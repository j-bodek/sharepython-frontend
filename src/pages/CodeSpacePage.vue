<template>
    <!-- Share Modal -->
    <share-modal :uuid="uuid" :token="token" v-model="shareModal" @close="shareModal = false"></share-modal>

    <!-- Main Container -->
    <div class="bg-dark text-light h-100 d-flex px-5" style="min-height: 100vh !important">
        <div class="text-start w-100 mx-auto" style="margin: 100px 0px;">
            <!-- Code Sandbox -->
            <code-sandbox :uuid="uuid" :token="token">
                <!-- Action buttons -->
                <template v-slot:actionButtons>
                    <div class="w-100">
                        <button v-if="uuid" aria-controls="shareModal" @click="shareModal = true"
                            class="button btn btn-sm text-white" style="background: #413A3A">
                            <i class="fa-solid fa-share"></i>
                        </button>
                        <download-code-btn></download-code-btn>
                    </div>
                </template>
            </code-sandbox>

            <!-- Terminal Wrapper -->
            <div class="mt-3">
                <codespace-terminal></codespace-terminal>
            </div>
        </div>
    </div>
</template>
<script>
import { shallowRef, ref } from 'vue'
import ShareModal from '../components/codespace/ShareModal.vue';
import CodeSandbox from '../components/codespace/CodeSandbox.vue';
import DownloadCodeBtn from '../components/codespace/DownloadCodeBtn.vue';
import CodespaceTerminal from '../components/codespace/CodespaceTerminal.vue';

export default {
    name: "CodeSpacePage",
    components: {
        CodeSandbox,
        ShareModal,
        CodespaceTerminal,
        DownloadCodeBtn
    },
    data() {
        return {
            uuid: this.$route.params.uuid,
            route_token: this.$route.params.token,
            view: shallowRef({}),
            shareModal: ref(false),
        }
    },
    computed: {
        token() {
            if (this.uuid && this.uuid.startsWith("tmp-")) {
                return this.uuid;
            } else {
                return this.route_token;
            }
        },
    },
}
</script>
<style >
.button:hover {
    background-color: #4C4343 !important;
}
</style>