<template>
    <button @click="downloadCode" class="button btn btn-sm text-white" style="background: #413A3A">
        <i class="fa-solid fa-download"></i>
    </button>
</template>

<script>
import FileSaver from 'file-saver';

export default {
    name: "DownloadCodeBtn",
    computed: {
        codespaceData() {
            return this.$store.getters["getCodeSpaceData"];
        },
    },
    methods: {
        downloadCode() {
            let fileName = this.createFileName();
            let file = new Blob([this.codespaceData.code], { type: 'text/plain;charset=utf-8' })
            FileSaver.saveAs(file, `${fileName}.py`);
        },
        createFileName() {
            let name;
            if (this.codespaceData.name) {
                name = this.codespaceData.name;
            } else {
                let date = new Date().toLocaleDateString();
                let time = new Date().toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric"
                });
                name = `${date}-${time}`;
            }

            return name.trim().toLowerCase().replaceAll(" ", "_")
        }
    }
}
</script>