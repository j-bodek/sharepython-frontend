<template>
    <div class="bg-dark text-light h-100 d-flex" style="height: 100vh !important">
        <div class="m-auto w-50">
            <h1 class="mb-5" style="font-size: 3rem">Log In</h1>

            <form class="w-100" v-on:submit.prevent="submit">
                <p>{{ user }}</p>
                <div class="mb-5">
                    <p v-if="error" class="mb-3 text-danger fw-bold">{{ error }}</p>
                    <!-- Email input -->
                    <div class="form-outline mb-3">
                        <input v-model="email" type="email" name="email" class="form-control text-white" required />
                        <label class="form-label text-white">Email address</label>
                    </div>

                    <!-- Password input -->
                    <div class="form-outline">
                        <input v-model="password" type="password" name="password" class="form-control text-white"
                            required />
                        <label class="form-label text-white">Password</label>
                    </div>
                </div>

                <!-- Submit button -->
                <button type="submit" class="btn btn-primary btn-block">Log In</button>
            </form>
        </div>
    </div>

</template>

<script>
import axios from 'axios';

export default {
    name: "LoginPage",
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
                    localStorage.setItem("refresh", response.data.refresh);
                    localStorage.setItem("access", response.data.access);
                    axios.defaults.headers.common["Authorization"] = `Bearers ${response.data.access}`;
                    // reset fields
                    this.resetFields();
                    // set user
                    this.$store.dispatch("setUser", { "user": response.data.user })
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

<style>
.form-control {
    border: 1px solid rgba(251, 251, 251, 0.3) !important;
}

.form-control:hover {
    border: 1px solid rgba(251, 251, 251, 0.6) !important;
}

.form-control:focus {
    border: 1px solid #3b71ca !important;
}
</style>