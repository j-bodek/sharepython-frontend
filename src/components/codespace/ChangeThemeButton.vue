<template>
    <MDBDropdown btnGroup dropstart v-model="themeDropdown">
        <MDBDropdownToggle id="themeBtn" class="button btn btn-sm text-white" style="background: #413A3A"
            @click="themeDropdown = !themeDropdown">
            <i class="fa-solid fa-brush"></i>
        </MDBDropdownToggle>
        <MDBDropdownMenu id="themeList">
            <MDBDropdownItem @click="changeTheme($event)" v-for="theme in themeNames"
                :class="{ 'active': theme === selectedTheme }" :data-theme="theme" text>
                {{ theme }}
            </MDBDropdownItem>
        </MDBDropdownMenu>
    </MDBDropdown>
</template>

<script>
import { ref } from 'vue'
import {
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
} from "mdb-vue-ui-kit";

export default {
    name: "CodeSpacePage",
    props: ["themes", "selectedTheme"],
    components: {
        MDBDropdown,
        MDBDropdownToggle,
        MDBDropdownMenu,
        MDBDropdownItem,
    },
    data() {
        return {
            themeDropdown: ref(false),
        }
    },
    computed: {
        themeNames() {
            return Object.keys(this.themes);
        },
    },
    methods: {
        changeTheme(e) {
            this.$emit("change", e.target.dataset.theme);
        },
    }
}
</script>

<style scoped>
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