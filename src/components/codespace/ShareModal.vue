<template>
    <MDBModal id="shareModal" tabindex="-1" labelledby="shareModalLabel" v-model="shareModal">
        <MDBModalHeader>
            <MDBModalTitle id="shareModalLabel">Share Your Code In Real Time!</MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody>
            <MDBRange v-if="isRegularUuid" label="Expiry Period (In Days)" v-model="expire_time_range" :min="1"
                :max="200" />
            <div class="d-flex">
                <div class="w-100">
                    <MDBInput ref="shareUrlInput" label="Share URL" v-model="shareCodespaceUrl" readonly />
                </div>
                <button class="btn btn-text shadow-none p-0 m-0 ms-3">
                    <i v-if="!copiedShareUrl" class="fa-solid fa-clipboard text-muted" style="font-size: 20px"
                        @click="copyShareUrl"></i>
                    <i v-else class="fa-solid fa-clipboard-check" style="font-size:20px; color:green"></i>
                </button>
            </div>
        </MDBModalBody>
        <MDBModalFooter>
            <MDBBtn color="secondary" @click="emitClose">Close</MDBBtn>
            <MDBBtn v-if="isRegularUuid" color="primary" @click="createShareUrl">Create Share URL</MDBBtn>
        </MDBModalFooter>
    </MDBModal>
</template>

<script>
import {
    MDBModal,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBBtn,
    MDBRange,
    MDBInput
} from "mdb-vue-ui-kit";
import { shallowRef, ref } from 'vue'
import axios from "axios";

export default {
    name: "CodeSpacePage",
    props: ["uuid", "token"],
    components: {
        MDBModal,
        MDBModalHeader,
        MDBModalTitle,
        MDBModalBody,
        MDBModalFooter,
        MDBBtn,
        MDBRange,
        MDBInput
    },
    data() {
        return {
            expire_time_range: ref(50),
            shareCodespaceUrl: ref(""),
            copiedShareUrl: ref(false),
        }
    },
    mounted() {
        // set default share codespace url
        if (this.uuid && this.uuid.startsWith("tmp-")) {
            this.shareCodespaceUrl = window.location.href;
        }
    },
    computed: {
        isRegularUuid() {
            // check if is regular or tmp uuid (or token)
            return this.uuid && !this.uuid.startsWith("tmp-");
        },
    },
    methods: {
        emitClose(e) {
            this.$emit('close', true)
        },
        copyShareUrl() {
            this.copiedShareUrl = true;
            navigator.clipboard.writeText(this.shareCodespaceUrl);
            this.$refs.shareUrlInput.inputRef.select();
            setTimeout(() => this.copiedShareUrl = false, 3000);
        },
        createShareUrl() {
            axios.post("codespace/access/token/", {
                codespace_uuid: this.uuid,
                expire_time: 24 * 60 * 60 * this.expire_time_range,
            }, {
                withCredentials: true,
            }).catch(err => {
                alert(err.response.data.detail);
            }).then(response => {
                if (response) {
                    let protocol = window.location.protocol
                    let hostname = window.location.hostname
                    let port = window.location.port
                    let path = this.$router.resolve({ name: "codespace_with_token", params: { token: response.data.token } }).fullPath;
                    let url = `${protocol}://${hostname}:${port}${path}`;
                    this.shareCodespaceUrl = url;
                }
            })
        }
    }
}
</script>