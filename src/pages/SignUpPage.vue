<template>
    <div class="bg-dark text-light h-100 d-flex" style="height: 100vh !important">
        <div class="m-auto w-50">
            <h1 class="mb-5" style="font-size: 3rem">Sign Up</h1>

            <form class="w-100">
                <base-all-user-data-form></base-all-user-data-form>
                <!-- Submit button -->
                <button type="submit" class="btn btn-primary btn-block">Sign Up</button>
            </form>
        </div>
    </div>
</template>
<script>
import BaseAllUserDataForm from '../components/base/BaseAllUserDataForm.vue';

export default {
    name: "SignUpPage",
    components: {
        BaseAllUserDataForm
    }
}
</script>
