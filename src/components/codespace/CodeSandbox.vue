<template>
    <portal v-if="codespaceData.name" to="navbar_brand">
        <codespace-title :uuid="uuid" :name="codespaceData.name"
            :created_by="codespaceData.created_by"></codespace-title>
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
    <codemirror v-model="codespaceData.code" autocomplete="false" placeholder="Code goes here..."
        :style="{ height: '400px' }" theme="github-dark" :autofocus="true" :indent-with-tab="true" :tab-size="2"
        :extensions="extensions" @ready="handleReady" />
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
            view: shallowRef({}),
        }
    },
    mounted() {

        // disable grammarly
        let codeSandbox = document.querySelector(".cm-content");
        codeSandbox.setAttribute("data-gramm", "false");
        codeSandbox.setAttribute("data-gramm_editor", "false");
        codeSandbox.setAttribute("data-enable-grammarly", "false");

        // set codespace data
        if (this.token || this.$store.getters["getCodeSpaceData"].uuid !== this.uuid) {
            let id = this.uuid || this.token;
            axios.get(`codespace/${id}/`)
                .catch(err => {
                    this.$router.push("/");
                    alert(err.response.data.detail);
                }).then(response => {
                    if (response) {
                        this.$store.dispatch("setCodeSpaceData", { "data": response.data });
                    }
                })
        }
    },
    computed: {
        codespaceData() {
            return this.$store.getters["getCodeSpaceData"];
        },
        extensions() {
            return [python(), this.themes[this.selectedTheme]]
        },
    },
    methods: {
        handleReady(payload) {
            this.view.value = payload.view;
        },
        changeTheme(theme) {
            this.selectedTheme = theme;
        },
    }
}
</script>