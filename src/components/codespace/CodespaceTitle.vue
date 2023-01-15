<template>
    <router-link class="navbar-brand me-2 fw-bold" to="/">
        <i class="fa-brands fa-python me-2"></i>
    </router-link>

    <div ref="navbar_header_wrapper" class="text-start w-100">

        <p v-if="!uuid" :style="{ width: navbarHeaderWrapperWidth + 'px' }"
            style="white-space: nowrap; text-overflow: ellipsis !important; overflow: hidden"
            class="text-white fw-bold p-0 m-0">
            {{ name.value }}
        </p>
        <input v-else class="title-input" type="text" :style="{ width: navbarHeaderWrapperWidth + 'px' }"
            v-model="name.value" v-on:keyup.enter="updateTitle">

        <p v-if="codespaceData.created_by" class="text-muted p-0 m-0" style="font-size:12px">
            Created By: {{ codespaceData.created_by }}
        </p>
    </div>
</template>
<script>
import axios from "axios";

export default {
    name: "CodespaceTitle",
    props: ["uuid"],
    data() {
        return {
            name: { value: "", previous_value: "" },
            navbarHeaderWrapperWidth: 0,
        }
    },
    computed: {
        codespaceData() {
            return this.$store.getters["getCodeSpaceData"];
        },
    },
    watch: {
        codespaceData(newData, oldData) {
            this.name["value"] = this.codespaceData.name;
        }
    },
    mounted() {
        this.name["value"] = this.codespaceData.name;
        this.name["previous_value"] = this.codespaceData.name;

        this.navbarHeaderWrapperWidth = this.$refs.navbar_header_wrapper.offsetWidth;
        // add resize listener
        window.addEventListener('resize', e => {
            this.navbarHeaderWrapperWidth = this.$refs.navbar_header_wrapper.offsetWidth;
        });
    },
    methods: {
        updateTitle() {
            if (this.name.value == this.name.previous_value) {
                alert("CodeSpace title hasn't changed");
                return;
            };

            axios.patch(`codespace/${this.uuid}/`, { "name": this.name.value }, {
                withCredentials: true,
            }).catch(err => {
                alert(err.response.data.detail);
            }).then(response => {
                if (response.status == 200) {
                    this.name['previous_value'] = this.name['value'];
                    alert("Successfully updated CodeSpace title!");
                }
            })
        }
    }
}
</script>

<style>
.title-input {
    background: transparent;
    color: white;
    font-weight: bold;
    border: 1px solid transparent;
    line-height: 0;
    padding: 2px;
    border-radius: 5px;
}

.title-input:hover {
    border: 1px solid #e5e5e5;
}

.title-input:focus {
    border: 1px solid #1a73e8;
    outline: none;
}
</style>