<template>
    <div class="bg-dark text-light h-100 d-flex px-5" style="min-height: 100vh !important">
        <div class="text-start w-100 mx-auto" style="margin: 100px 0px;">

            <!-- Action buttons -->
            <div class="mb-3 d-flex">
                <div class="w-100">
                    <button class="button btn btn-sm text-white" style="background: #413A3A">
                        <i class="fa-solid fa-share"></i>
                    </button>
                    <button class="button btn btn-sm text-white" style="background: #413A3A">
                        <i class="fa-solid fa-download"></i>
                    </button>
                    <button class="button btn btn-sm text-white" style="background: #413A3A">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                <div>
                    <MDBDropdown btnGroup dropstart v-model="themeDropdown">
                        <MDBDropdownToggle id="themeBtn" class="button btn btn-sm text-white"
                            style="background: #413A3A" @click="themeDropdown = !themeDropdown">
                            <i class="fa-solid fa-brush"></i>
                        </MDBDropdownToggle>
                        <MDBDropdownMenu id="themeList">
                            <MDBDropdownItem @click="changeTheme($event)" v-for="theme in themeNames"
                                :class="{ 'active': theme === selectedTheme }" :data-theme="theme" text>
                                {{ theme }}
                            </MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </div>
            </div>

            <!-- Code Sandbox -->
            <codemirror v-model="codespaceData.code" autocomplete="false" placeholder="Code goes here..."
                :style="{ height: '400px' }" theme="github-dark" :autofocus="true" :indent-with-tab="true" :tab-size="2"
                :extensions="extensions" @ready="handleReady" />

            <!-- Terminal Wrapper -->
            <div class="mt-3">
                <div>
                    <button id="execute_btn" class="btn btn-outline-success mb-2">
                        <i class="fa-solid fa-play"></i>
                        <span class="ms-2 fw-bold">Run</span>
                    </button>
                    <div class="terminal w-100 rounded">
                        <div class="w-100 d-flex p-1" style="background: #2B2626">
                            <div class="terminal-btn bg-danger me-2"></div>
                            <div class="terminal-btn bg-warning me-2"></div>
                            <div class="terminal-btn bg-success me-2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import { EditorState } from '@codemirror/state'
import { MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from "mdb-vue-ui-kit";
import { shallowRef, ref } from 'vue'
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
import axios from "axios";

export default {
    name: "CodeSpacePage",
    components: {
        Codemirror,
        MDBDropdown,
        MDBDropdownToggle,
        MDBDropdownMenu,
        MDBDropdownItem,
    },
    data() {
        return {
            uuid: this.$route.params.uuid,
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
            themeDropdown: ref(false),
        }
    },
    mounted() {
        // disable grammarly
        let codeSandbox = document.querySelector(".cm-content");
        codeSandbox.setAttribute("data-gramm", "false");
        codeSandbox.setAttribute("data-gramm_editor", "false");
        codeSandbox.setAttribute("data-enable-grammarly", "false");
        // set codespace data
        if (this.$store.getters["getCodeSpaceData"].uuid !== this.uuid) {
            axios.get(`codespace/${this.uuid}/`)
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
        themeNames() {
            return Object.keys(this.themes);
        },
        extensions() {
            return [python(), this.themes[this.selectedTheme]]
        }
    },
    methods: {
        handleReady(payload) {
            this.view.value = payload.view;
        },
        changeTheme(e) {
            this.selectedTheme = e.target.dataset.theme;
        }
    }
}
</script>
<style scoped>
.terminal {
    height: 250px;
    background-color: #413A3A;
    overflow: hidden;
}

.terminal-btn {
    width: 14px;
    height: 14px;
    border-radius: 14px
}

.button:hover {
    background-color: #4C4343 !important;
}

#execute_btn:hover {
    background-color: #14a44d !important;
    color: white !important;
}

#themeBtn::before {
    content: none !important;
}

#themeList li {
    cursor: pointer;
    transition: all .1s ease-in-out;
}

#themeList li:has(.active) {
    background-color: #eee !important;
}

#themeList li:hover {
    background-color: #eee !important;
}
</style>