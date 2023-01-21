<template>
    <div>
        <div v-if="!isPyodideLoaded" class="loading-screen">
            <div class="loading-screen-content">
                <div class="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <h6>Loading Pyodide ...</h6>
            </div>
        </div>
        <button @click="execute" id="execute_btn" class="btn btn-outline-success mb-2">
            <i class="fa-solid fa-play"></i>
            <span class="ms-2 fw-bold">Run</span>
        </button>
        <!-- {{ syntaxedCode }} -->
        <div class="terminal w-100 rounded">
            <div class="w-100 d-flex p-1" style="background: #413A3A">
                <div class="terminal-btn bg-danger me-2"></div>
                <div class="terminal-btn bg-warning me-2"></div>
                <div class="terminal-btn bg-success me-2"></div>
            </div>
            <ul class="output-box" ref="outputBox">

            </ul>
        </div>
    </div>
</template>

<script>
import { loadPyodide } from "pyodide";
import { Vue } from "vue";
export default {
    name: "CodespaceTerminal",
    data() {
        return {
            pyodide: null,
            isPyodideLoaded: false,
        }
    },
    created() {
        this.loadPyodideInstance();

    },
    computed: {
        codespaceData() {
            return this.$store.getters["getCodeSpaceData"];
        },
    },
    methods: {
        async loadPyodideInstance() {
            try {
                if (this.pyodide == null) {
                    this.pyodide = await loadPyodide({
                        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.22.0/full/",
                    });
                    this.pyodide.setStdout({ batched: this.stdOutput, })
                    this.isPyodideLoaded = true;
                }
            } catch (error) {
                alert(error)
            }
        },
        execute() {
            try {
                // clean output box
                this.$refs.outputBox.innerHTML = '';
                this.pyodide.runPython(this.codespaceData.code);
            } catch (error) {
                console.log(error)
            }
        },
        stdOutput(output) {
            let li = document.createElement('li');
            li.innerHTML = output;
            this.$refs.outputBox.appendChild(li);
        }
    }
}
</script>

<style scoped>
.terminal {
    height: 250px;
    background-color: #2B2727;
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

.output-box {
    list-style-type: none;
    color: #b9b5b8;
    padding: 7px 10px;
    margin: 0px;
    font-weight: 700;
    width: 100%;
    height: calc(100% - 14px);
    overflow: auto;
    white-space: nowrap;
}


.loading-screen {
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.6);
    top: 0;
    left: 0;
    margin: 0;
    z-index: 1000;
    position: fixed !important;
    display: flex;
}

.loading-screen-content {
    margin: auto;
    width: fit-content;
    height: fit-content;
    text-align: center;
}

.lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
}

.lds-ellipsis div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #fff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.lds-ellipsis div:nth-child(1) {
    left: 8px;
    animation: lds-ellipsis1 0.6s infinite;
}

.lds-ellipsis div:nth-child(2) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(3) {
    left: 32px;
    animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(4) {
    left: 56px;
    animation: lds-ellipsis3 0.6s infinite;
}

@keyframes lds-ellipsis1 {
    0% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes lds-ellipsis3 {
    0% {
        transform: scale(1);
    }

    100% {
        transform: scale(0);
    }
}

@keyframes lds-ellipsis2 {
    0% {
        transform: translate(0, 0);
    }

    100% {
        transform: translate(24px, 0);
    }
}
</style>