<template>
    <portal v-if="codespaceData.name" to="navbar_brand">
        <codespace-title :uuid="uuid"></codespace-title>
    </portal>
    <div class="mb-3 d-flex">
        <div class="w-100">
            <slot name="actionButtons">

            </slot>
        </div>
        <div>
            <change-theme-button :themes="themes" :selectedTheme="selectedTheme"
                @change="changeTheme"></change-theme-button>
        </div>
    </div>
    <!-- Code Sandbox -->
    <codemirror class="cm-single-select" v-model="codespaceData.code" autocomplete="false" ref="editor"
        @blur="codespaceReFocus" placeholder="Code goes here..." :style="{ height: '400px' }" theme="github-dark"
        :autofocus="true" :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="handleReady"
        @update:modelValue="onCodeChange" @update="createSelection" />
</template>

<script>
import { shallowRef } from 'vue'
// codemirror
import { Codemirror } from 'vue-codemirror'
import { python } from '@codemirror/lang-python'
// code mirror themes
import { oneDark } from '@codemirror/theme-one-dark'
import { materialLight } from '@ddietr/codemirror-themes/material-light'
import { materialDark } from '@ddietr/codemirror-themes/material-dark'
import { solarizedLight } from '@ddietr/codemirror-themes/solarized-light'
import { solarizedDark } from '@ddietr/codemirror-themes/solarized-dark'
import { dracula } from '@ddietr/codemirror-themes/dracula'
import { githubLight } from '@ddietr/codemirror-themes/github-light'
import { githubDark } from '@ddietr/codemirror-themes/github-dark'
import { aura } from '@ddietr/codemirror-themes/aura'
import { tokyoNight } from '@ddietr/codemirror-themes/tokyo-night'
import { tokyoNightStorm } from '@ddietr/codemirror-themes/tokyo-night-storm'
import { tokyoNightDay } from '@ddietr/codemirror-themes/tokyo-night-day'
// axios
import axios from "axios";
// components
import ChangeThemeButton from "./ChangeThemeButton.vue";
import CodespaceTitle from "./CodespaceTitle.vue";
import { EditorState, EditorSelection, ChangeSet, Compartment } from "@codemirror/state"
export default {
    name: "CodeSpacePage",
    props: ["uuid", "token"],
    components: {
        Codemirror,
        ChangeThemeButton,
        CodespaceTitle,
    },
    data() {
        return {
            themes: {
                "one-dark": oneDark,
                "material-light": materialLight,
                "material-dark": materialDark,
                "solarized-light": solarizedLight,
                "solirized-dark": solarizedDark,
                "dracula": dracula,
                "github-light": githubLight,
                "github-dark": githubDark,
                "aura": aura,
                "tokyo-night": tokyoNight,
                "tokyo-night-storm": tokyoNightStorm,
                "tokyo-night-day": tokyoNightDay,
            },
            selectedTheme: "one-dark",
            // CodeMirror EditorView instance ref
            EditorView: shallowRef({}),
            EditorState: shallowRef({}),
            // websocket connection
            connection: null,
            connection_id: null,
            isReadOnly: false,
        }
    },
    mounted() {
        // disable grammarly
        let codeSandbox = document.querySelector(".cm-content");
        codeSandbox.setAttribute("data-gramm", "false");
        codeSandbox.setAttribute("data-gramm_editor", "false");
        codeSandbox.setAttribute("data-enable-grammarly", "false");

        // set codespace data
        let id = this.uuid || this.token;
        axios.get(`codespace/${id}/`)
            .catch(err => {
                this.$router.push("/");
                alert(err.response.data.detail);
            }).then(response => {
                if (response) {
                    this.connectWebSocket();
                    this.$store.dispatch("setCodeSpaceData", { "data": response.data });
                }
            })
    },
    unmounted() {
        // make sure that if user changes page connection is closed
        this.connection.close();
    },
    computed: {
        codespaceData() {
            return this.$store.getters["getCodeSpaceData"];
        },
        extensions() {
            return [python(), this.themes[this.selectedTheme], EditorState.readOnly.of(this.isReadOnly)]
        },
    },
    methods: {
        async connectWebSocket() {
            let token = null;
            if (!this.token) {
                token = await this.getWebSocketAccessToken();
            } else {
                token = this.token;
            }
            this.connection = new WebSocket(`ws://localhost:8888/${token}/`)
            let that = this;
            this.connection.onmessage = function (message) {
                that.updateCodeOnWebSocketMessage(message)
            }
        },
        async getWebSocketAccessToken() {
            const response = await axios.post("codespace/access/token/", {
                codespace_uuid: this.uuid,
                expire_time: 120,
            }, {
                withCredentials: true,
            })
            return response.data.token;
        },
        codespaceReFocus() {
            // if document has no focus prevent trying to
            // re focus editor
            if (!document.hasFocus()) {
                return;
            };

            let that = this;
            const timer = setInterval(() => {
                that.EditorView.focus();
                if (that.EditorView.hasFocus) clearInterval(timer);
            }, 500);
        },
        handleReady(payload) {
            this.EditorView = payload.view;
            this.EditorState = payload.state;
        },
        updateCodeOnWebSocketMessage(message) {
            let data = JSON.parse(message.data);

            if (data.operation == "connected") {
                this.connection_id = data.data.id;
            } else if (data.operation == 'insert_value' && data.sender != this.connection_id) {
                let changes = [];
                data.changes.forEach(change => {
                    let changeObj = ChangeSet.of(change, data.doc_length);
                    changeObj.isWebSocketUpdate = true;
                    changes.push(changeObj)
                })
                // this parameter is used to defferentiate if change
                // was received from websockets or from user input
                changes.isWebSocketUpdate = true;
                this.EditorView.dispatch({
                    changes: changes,
                })
            }
        },
        onCodeChange(value, viewUpdate) {
            if (!viewUpdate.changes.isWebSocketUpdate) {
                let message = this.createChangesMessage(viewUpdate);
                this.connection.send(JSON.stringify(message));
            }
        },
        createChangesMessage(viewUpdate) {
            // create list of changes
            let changes = []
            viewUpdate.changes.iterChanges(function (fromA, toA, fromB, toB, inserted) {
                changes.push({
                    from: fromA,
                    to: toA,
                    insert: inserted.text.join("\n"),
                })
            }, false)

            return {
                operation: "insert_value",
                sender: this.connection_id,
                doc_length: viewUpdate.startState.doc.length,
                changes: changes
            };
        },
        createSelection(viewUpdate) {
            let startSelection = viewUpdate.startState.selection;
            let curSelection = viewUpdate.state.selection;
            if (!curSelection.eq(startSelection)) {
                console.log("listen for selection change")
            }
        },
        changeTheme(theme) {
            this.selectedTheme = theme;
        },
    }
}
</script>

<style>
/* This will ensure that cursor is visible if focus is lost */
.cm-editor:not(.cm-focused) .cm-cursor {
    display: block !important;
    border-left: 1.2px solid #528bff !important;
    animation: blink 1.5s step-end infinite;
}

@keyframes blink {

    from,
    to {
        opacity: 0;
    }

    50% {
        opacity: 100;
    }
}
</style>