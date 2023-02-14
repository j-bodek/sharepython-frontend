<template>
    <div class="bg-dark text-light h-100 d-flex" style="height: 100vh !important">
        <div class="m-auto w-50">
            <div class="mb-5">
                <h1 class="mb-4" style="font-size: 3rem">Forgot Your Password?</h1>

                <h5>Enter your email and we will send You link to reset Your password.</h5>
            </div>

            <form class="w-100" v-on:submit.prevent="submit">
                <div class="mb-5">
                    <p v-for="error in errors" class="mb-3 text-danger fw-bold">{{ error }}</p>
                    <p v-if="success" class="mb-3 text-success fw-bold">{{ success }}</p>

                    <!-- Email input -->
                    <mdb-input v-model="email" class="text-white mb-3" labelClass="text-white" type="email"
                        label="Email" outline required></mdb-input>

                </div>

                <!-- Submit button -->
                <button type="submit" class="btn btn-primary btn-block">Reset Password</button>
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
            email: "",
            errors: [],
            success: "",
        }
    },
    methods: {
        submit() {
            // reset success message
            axios.post("reset_password/request/", {
                email: this.email,
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
                    this.success = `We send reset password link to ${response.data.email}`;
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
            this.email = "";
            this.success = "";
            this.errors = [];
        }
    }
}
</script>