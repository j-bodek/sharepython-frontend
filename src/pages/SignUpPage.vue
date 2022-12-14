<template>
    <div class="bg-dark text-light h-100 d-flex" style="height: 100vh !important">
        <div class="m-auto w-50">
            <h1 class="mb-5" style="font-size: 3rem">Sign Up</h1>

            <div class="mb-3">
                <h6 v-if="errors" v-for="error in errors" class="text-danger fw-bold m-0 mb-2"> {{ error }}</h6>
            </div>
            <form class="w-100" v-on:submit.prevent="submitSignUp">
                <base-all-user-data-form v-on:data="updateUserData"></base-all-user-data-form>
                <!-- Submit button -->
                <button type="submit" class="btn btn-primary btn-block">Sign Up</button>
            </form>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import BaseAllUserDataForm from '../components/base/BaseAllUserDataForm.vue';

export default {
    name: "SignUpPage",
    components: {
        BaseAllUserDataForm
    },
    data() {
        return {
            userData: {},
            errors: [],
        }
    },
    watch: {
        errors: {
            handler(newVal, oldVal) {
                if (newVal.length >= 0) {
                    setTimeout(() => {
                        this.errors = [];
                    }, 3000)
                }
            },
            deep: true
        },
    },
    methods: {
        updateUserData(event) {
            this.userData = event;
        },
        submitSignUp() {
            axios.post("/auth/register/", this.userData
            ).catch(error => {
                this.setErrors(error.response.data);
            }).then(response => {
                if (response) {
                    // set auth data
                    this.$store.dispatch("setAuthData", { "data": response.data });
                    // reset fields
                    this.userData = {};
                    this.$router.push("/");
                }
            })
        },
        setErrors(errors) {
            for (const [key, value] of Object.entries(errors)) {
                value.forEach(val => {
                    this.errors.push(val);
                })
            }
        }
    }
}
</script>
