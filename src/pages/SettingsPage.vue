<template>
    <div class="bg-dark text-light h-100 d-flex" style="height: 100vh !important">
        <div class="m-auto w-50">
            <h1 class="mb-5" style="font-size: 3rem">Account Settings</h1>

            <div class="mb-3">
                <h6 v-if="info" class="text-info fw-bold m-0 mb-2"> {{ info }}</h6>
                <h6 v-if="success" class="text-success fw-bold m-0 mb-2"> {{ success }}</h6>
                <h6 v-if="errors" v-for="error in errors" class="text-danger fw-bold m-0 mb-2"> {{ error }}</h6>
            </div>
            <form class="w-100" v-on:submit.prevent="submitUpdateUserData">
                <base-all-user-data-form v-on:data="updateUserData" :user="user"></base-all-user-data-form>
                <!-- Submit button -->
                <button type="submit" class="btn btn-primary btn-block">Update</button>
            </form>
            <button type="button" class="btn btn-danger btn-block mt-3">Delete Account</button>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import BaseAllUserDataForm from '../components/base/BaseAllUserDataForm.vue';

export default {
    name: "SettingsPage",
    components: {
        BaseAllUserDataForm
    },
    data() {
        return {
            "userData": {},
            "info": "",
            "errors": [],
            "success": "",
        }
    },
    computed: {
        user() {
            return this.$store.getters["getUser"]
        }
    },
    watch: {
        info(newVal, oldVal) {
            if (newVal !== "") {
                setTimeout(() => {
                    this.info = "";
                }, 3000)
            }
        },
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
        success(newVal, oldVal) {
            if (newVal !== "") {
                setTimeout(() => {
                    this.success = "";
                }, 3000)
            }
        },
    },
    methods: {
        updateUserData(event) {
            this.userData = event;
        },
        submitUpdateUserData() {
            const updatedData = this.getUpdatedUserData();
            if (Object.keys(updatedData).length == 0) {
                this.info = "Nothing Changed";
            } else {
                axios.patch("user/", updatedData, {
                    withCredentials: true,
                }).catch(err => {
                    for (const [key, value] of Object.entries(err.response.data)) {
                        if (this.user[key]) {
                            value.forEach(val => {
                                this.errors.push(val);
                            })
                        }
                    }

                    if (this.errors.length == 0) {
                        this.errors.push("Opss... Something went wrong");
                    }
                }).then(response => {
                    if (response) {
                        // set auth data
                        this.success = "Updated Successfully";
                        this.$store.dispatch("setUser", { "user": response.data });
                    }
                })
            }
        },
        getUpdatedUserData() {
            let updatedData = {};
            for (const [key, value] of Object.entries(this.userData)) {
                if (this.user[key] !== value && value !== "") {
                    updatedData[key] = value;
                }
            }
            return updatedData;
        }
    }
}
</script>
