<template>
    <header>
        <MDBNavbar style="z-index: 10" expand="md"
            class="navbar navbar-expand-md navbar-dark bg-dark w-100 position-fixed" container>
            <!-- Navbar brand -->
            <router-link class="navbar-brand me-2 fw-bold" to="/">
                SharePython
            </router-link>
            <MDBNavbarToggler @click="collapse1 = !collapse1" target="#navbarSupportedContent"></MDBNavbarToggler>
            <MDBCollapse class="justify-content-end" v-model="collapse1" id="navbarSupportedContent">

                <div class="d-flex align-items-center w-md-100">
                    <MDBNavbarNav v-if="(user === null)" class="w-100 p-0">
                        <MDBNavbarItem class="nav-link nav-link-bg m-0 me-2 py-0 px-2 rounded-4" to="/login" active>
                            Log In
                        </MDBNavbarItem>
                        <MDBNavbarItem class="nav-link nav-link-bg m-0 py-0 px-2 rounded-4" to="/signup" active>
                            Sign Up
                        </MDBNavbarItem>
                    </MDBNavbarNav>
                    <MDBNavbarNav v-else class="w-100 p-0">
                        <button v-on:click="logoutUser"
                            class="nav-link nav-link-bg btn shadow-0 text-light me-md-3 px-3">
                            LogOut
                        </button>
                        <MDBNavbarItem>
                            <!-- Navbar dropdown -->
                            <MDBDropdown class="nav-item" v-model="dropdown1">
                                <MDBDropdownToggle tag="a" class="nav-link text-white" @click="dropdown1 = !dropdown1">
                                    {{ user.first_name }} {{ user.last_name }}
                                </MDBDropdownToggle>
                                <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
                                    <MDBDropdownItem class="dropdown-item" to="/codespaces">Your CodeSpaces
                                    </MDBDropdownItem>
                                    <MDBDropdownItem class="dropdown-item" text @click="createCodeSpace">New CodeSpace
                                    </MDBDropdownItem>
                                    <MDBDropdownItem class="dropdown-item" to="/settings">Account Settings
                                    </MDBDropdownItem>
                                </MDBDropdownMenu>
                            </MDBDropdown>
                        </MDBNavbarItem>
                    </MDBNavbarNav>
                </div>
                <a class="btn btn-light px-3 my-0 ms-md-3 m-0 d-block" target="_blank"
                    href="https://github.com/LilJack118/sharepython" role="button">
                    <i class="fab fa-github"></i>
                </a>

            </MDBCollapse>

        </MDBNavbar>
        <!-- Navbar -->

        <!-- Navbar -->
    </header>
</template>

<script>
import {
    MDBNavbar,
    MDBNavbarToggler,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBCollapse,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem
} from 'mdb-vue-ui-kit';
import { ref } from 'vue';
import createCodeSpaceMixin from "../../mixins/createCodeSpaceMixin.js";

export default {
    name: "MainHeader",
    mixins: [createCodeSpaceMixin],
    components: {
        MDBNavbar,
        MDBNavbarToggler,
        MDBNavbarNav,
        MDBNavbarItem,
        MDBCollapse,
        MDBDropdown,
        MDBDropdownToggle,
        MDBDropdownMenu,
        MDBDropdownItem
    },
    data() {
        return {
            collapse1: ref(false),
            dropdown1: ref(false),
        }
    },
    computed: {
        user() {
            return this.$store.getters["getUser"];
        }
    },
    methods: {
        logoutUser() {
            let logout = window.confirm("Are you sure you want to log out?");
            if (logout) {
                this.$store.dispatch("resetUserData");
                this.$router.push("/");
            }
        },
    }
}
</script>

<style>
.dropdown-item:hover {
    cursor: pointer;
}

.nav-link-bg:hover {
    color: #332d2d !important;
    background-color: #fbfbfb !important;
}

.nav-link-bg:hover a {
    color: #332d2d !important;
}
</style>