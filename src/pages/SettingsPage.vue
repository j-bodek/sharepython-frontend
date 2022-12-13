<template>
    <div class="bg-dark text-light h-100 d-flex" style="height: 100vh !important">
        <div class="m-auto w-50">
            <h1 class="mb-5" style="font-size: 3rem">Account Settings</h1>

            <form class="w-100">
                <base-all-user-data-form v-on:data="updateUserData" :user="user"></base-all-user-data-form>
                <!-- Submit button -->
                <button type="submit" class="btn btn-primary btn-block">Update</button>
            </form>
            <button type="button" class="btn btn-danger btn-block mt-3">Delete Account</button>
        </div>
    </div>
</template>
<script>
import BaseAllUserDataForm from '../components/base/BaseAllUserDataForm.vue';

export default {
    name: "SettingsPage",
    components: {
        BaseAllUserDataForm
    },
    data() {
        return {
            "user": this.$store.getters["getUser"],
            "userData": {},
        }
    },
    methods: {
        updateUserData(event) {
            this.userData = event;
        }
    }
}
</script>
