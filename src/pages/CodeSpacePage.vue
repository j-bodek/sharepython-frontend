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
                    <button class="button btn btn-sm text-white" style="background: #413A3A">
                        <i class="fa-solid fa-brush"></i>
                    </button>
                </div>
            </div>

            <!-- Code Sandbox -->
            <codemirror v-model="code" autocomplete="false" placeholder="Code goes here..." :style="{ height: '400px' }"
                :autofocus="true" :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="handleReady" />

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
import { shallowRef, ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'

export default {
    name: "CodeSpacePage",
    components: {
        Codemirror
    },
    data() {
        return {
            uuid: this.$route.params.uuid,
            code: ref(this.$store.getters["getInitialCodeSandbox"]),
            extensions: [python(), oneDark],
            // CodeMirror EditorView instance ref
            view: shallowRef({}),

        }
    },
    methods: {
        handleReady(payload) {
            this.view.value = payload.view;
        },
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
</style>