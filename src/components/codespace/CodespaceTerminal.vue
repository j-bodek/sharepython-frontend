<template>
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
</template>

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