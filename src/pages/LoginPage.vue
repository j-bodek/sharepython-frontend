<template>
    <div class="bg-dark text-light h-100 d-flex" style="height: 100vh !important">
        <div class="m-auto w-50">
            <h1 class="mb-5" style="font-size: 3rem">Log In</h1>

            <form class="w-100" v-on:submit.prevent="submit">
                <p>{{ user }}</p>
                <div class="mb-5">
                    <p v-if="error" class="mb-3 text-danger fw-bold">{{ error }}</p>

                    <!-- Email input -->
                    <mdb-input v-model="email" class="text-white mb-3" labelClass="text-white" type="email"
                        label="Email" outline></mdb-input>

                    <!-- Password input -->
                    <mdb-input v-model="password" class="text-white mb-3" labelClass="text-white" type="password"
                        label="Password" outline></mdb-input>

                </div>

                <!-- Submit button -->
                <button type="submit" class="btn btn-primary btn-block">Log In</button>
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
            password: "",
            error: "",
        }
    },
    computed: {
        user() {
            return this.$store.getters["getUser"];
        }
    },
    methods: {
        submit() {
            axios.post("auth/token/", {
                email: this.email,
                password: this.password,
            }, {
                withCredentials: true,
            }).catch(err => {
                if (err.response.status === 401) {
                    this.error = "Invalid email or password";
                }
            }).then(response => {
                if (response) {
                    // set auth data
                    this.$store.dispatch("setAuthData", { "data": response.data });
                    axios.defaults.headers.common["Authorization"] = `Bearers ${response.data.access}`;
                    // reset fields
                    this.resetFields();
                    this.$router.push("/")
                }
            })

        },
        resetFields() {
            this.email = '';
            this.password = '';
            this.error = '';
        }
    }
}
</script>