<template>
    <div class="bg-dark text-light h-100 d-flex" style="height: 100vh !important">
        <div class="m-auto w-50">

            <h1 class="mb-5" style="font-size: 3rem">Reset Your Password</h1>

            <form class="w-100" v-on:submit.prevent="submit">
                <div class="mb-5">
                    <p v-for="error in errors" class="mb-3 text-danger fw-bold">{{ error }}</p>
                    <p v-if="success" class="mb-3 text-success fw-bold">{{ success }}</p>

                    <!-- New Password Input -->
                    <mdb-input v-model="password" class="text-white mb-3" labelClass="text-white" type="password"
                        label="New Password" outline required></mdb-input>

                </div>

                <!-- Submit button -->
                <button type="submit" class="btn btn-primary btn-block">Save Password</button>
            </form>
        </div>
    </div>

</template>

<script>
import { MDBInput } from 'mdb-vue-ui-kit';
import axios from 'axios';

export default {
    name: "LoginPage",
    components: {
        "mdb-input": MDBInput,
    },
    data() {
        return {
            password: "",
            errors: [],
            success: "",
            token: null,
            email: null,
        }
    },
    mounted() {
        // set token and email from url
        this.token = this.$route.params.token;
        const url = new URL(window.location.href);
        this.email = url.searchParams.get("email");
    },
    methods: {
        submit() {
            // reset success message
            axios.patch("reset_password/confirm/", {
                password: this.password,
                email: this.email,
                token: this.token,
            }, {
                withCredentials: true,
            }).catch(err => {
                this.resetFields();
                this.setErrors(err.response.data);
            }).then(response => {
                if (response && response.status == 200) {
                    // reset fields
                    this.resetFields();
                    // display success message
                    this.success = `Successfully updated password for user with email: ${response.data.email}`;
                }
            })

        },
        setErrors(errors) {
            for (const [key, value] of Object.entries(errors)) {
                value.forEach(val => {
                    this.errors.push(val);
                })
            }
        },
        resetFields() {
            this.password = "";
            this.success = "";
            this.errors = [];
        }
    }
}
</script>