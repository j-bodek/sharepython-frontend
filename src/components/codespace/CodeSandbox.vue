<template>
    <portal v-if="codespaceData.name" to="navbar_brand">
        <codespace-title :uuid="uuid"></codespace-title>
    </portal>
    <div class="mb-3 d-flex">
        <div class="w-100">
            <slot name="actionButtons">

            </slot>
        </div>
        <div class="d-flex">
            <div v-if="uuid && unsavedChanges" class="my-auto me-2">
                <p style="font-size:10px" class="text-warning m-0 p-0 text-nowrap">unsaved changes</p>
            </div>
            <button v-if="uuid" class="button btn btn-sm text-white me-1" @click="saveChanges"
                style="background: #413A3A">
                <i class="fa-solid fa-floppy-disk"></i>
            </button>
            <change-theme-button :themes="themes" :selectedTheme="selectedTheme"
                @change="changeTheme"></change-theme-button>
        </div>
    </div>
    <!-- Code Sandbox -->
    <codemirror class="cm-single-select" v-model="codespaceData.code" autocomplete="false" ref="editor"
        placeholder="Code goes here..." :style="{ height: '400px' }" theme="github-dark" :autofocus="true"
        :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="handleReady"
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
            unsavedChanges: false,
        }
    },
    created() {
        // this will display popup informing about unsaved changes
        window.onbeforeunload = () => (this.unsavedChanges && this.uuid ? true : null);
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
        if (this.uuid && this.unsavedChanges) {
            let save_chagnes = confirm("Do you want to save your changes?");
            if (save_chagnes) {
                axios.patch(`codespace/save_changes/${this.uuid}/`)
            }
        }
        // make sure that if user changes page connection is closed
        this.connection.close(1000, "unmounted");
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
            this.connection = new WebSocket(`ws://localhost:8888/codespace/${token}/`)
            let that = this;
            this.connection.addEventListener("close", e => {
                that.handleConnectionClosed(e);
            })
            this.connection.onmessage = function (message) {
                that.updateCodeOnWebSocketMessage(message)
            }
        },
        async getWebSocketAccessToken() {
            const response = await axios.post("codespace/access/token/", {
                codespace_uuid: this.uuid,
                expire_time: 120,
                mode: "edit", // create (owner) token in edit mode
            }, {
                withCredentials: true,
            })
            return response.data.token;
        },
        saveChanges() {
            if (this.unsavedChanges && this.uuid) {
                axios.patch(`codespace/save_changes/${this.uuid}/`)
                    .catch(err => {
                        alert(err.response.data.detail);
                    }).then(response => {
                        if (response.status == 200) {
                            this.unsavedChanges = false;
                        }
                    })
            } else {
                alert("You don't have permission to save changes, or don't have any changes at all.")
            }
        },
        handleReady(payload) {
            this.EditorView = payload.view;
            this.EditorState = payload.state;
        },
        handleConnectionClosed(event) {
            if (event.reason != "unmounted") {
                alert("Session has expired. Refresh to reconnect");
                location.reload();
            };
        },
        updateCodeOnWebSocketMessage(message) {
            let data = JSON.parse(message.data);
            if (data.operation == "connected") {
                this.connection_id = data.data.id;
            } else if (data.operation == 'insert_value' && data.sender != this.connection_id) {
                let insertedBefore = 0;
                let selections = data.changes.map(change => {
                    let sel = EditorSelection.cursor(change.from + insertedBefore + change.insert.length);
                    insertedBefore += (change.from - change.to + change.insert.length);
                    return sel
                })

                // this parameter is used to defferentiate if change
                // was received from websockets or from user input
                let changes = ChangeSet.of(data.changes, data.doc_length)
                changes.isWebSocketUpdate = true;
                this.EditorView.dispatch({
                    changes: changes,
                    selection: EditorSelection.create(selections),
                })
            } else if (data.operation == 'create_selection' && data.sender != this.connection_id) {
                let selections = data.selections.map(selection => {
                    return EditorSelection.range(selection.anchor, selection.head);
                })
                let selection = EditorSelection.create(selections);
                selection.isWebSocketUpdate = true;

                this.EditorView.dispatch({
                    selection: selection,
                })
            }
        },
        onCodeChange(value, viewUpdate) {
            this.unsavedChanges = true;
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
            if (!viewUpdate.startState.selection.isWebSocketUpdate) {
                let startSelection = viewUpdate.startState.selection;
                let curSelection = viewUpdate.state.selection;
                if (!curSelection.eq(startSelection)) {
                    let selections = curSelection.toJSON().ranges.filter(selection => {
                        if (selection["head"] - selection["anchor"] !== 0) {
                            return selection;
                        };
                    })
                    if (selections.length > 0) {
                        let message = {
                            operation: "create_selection",
                            sender: this.connection_id,
                            selections: selections
                        };
                        this.connection.send(JSON.stringify(message));
                    }
                }
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
}

/* add animation to cursor layer in order to synchronise blinking effect */
.cm-editor:not(.cm-focused) .cm-cursorLayer {
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