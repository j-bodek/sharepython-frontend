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
            <div class="output-box">
                <div v-for="output in outputs">{{ output }}</div>
                <div v-for="error in errors" class="error">{{ error }}</div>
                <input v-if="isStdin" type="text">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CodespaceTerminal",
    data() {
        return {
            pyodideWorker: null,
            isPyodideLoaded: true,
            isStdin: false,
            outputs: [],
            errors: [],
        }
    },
    created() {
        this.pyodideWorker = new Worker("/pyodideWorker.js");
        let that = this;
        this.pyodideWorker.onmessage = function (event) {
            const data = event.data // Data passed as parameter by the worker is retrieved from 'data' attribute
            if (data.method) {
                that[data.method](data.payload);
            }
        }
    },
    computed: {
        codespaceData() {
            return this.$store.getters["getCodeSpaceData"];
        },
    },
    methods: {
        execute() {
            this.outputs = [];
            this.errors = [];
            this.pyodideWorker.postMessage({ "code": this.codespaceData.code })
        },
        stdInputHandler() {
            if (!this.isStdin) {
                this.isStdin = true;
                return prompt();
            }
        },
        stdOutputHandler(payload) {
            this.isStdin = false;
            this.outputs.push(payload.output);
        },
        stdErrorHandler(payload) {
            this.displayError(payload.error.message);
        },
        displayError(error_msg) {
            this.errors.push(error_msg);
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
    color: #b9b5b8;
    padding: 7px 10px;
    margin: 0px;
    font-weight: 700;
    width: 100%;
    height: calc(100% - 14px);
    overflow: auto;
    white-space: nowrap;
}

.output-box .error {
    color: #ff6766;
    white-space: pre;
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