<template>
    <div class="bg-dark text-light h-100 d-flex" style="height: 100vh !important">
        <div class="m-auto w-50">
            <h1 class="mb-5" style="font-size: 3rem">Log In</h1>

            <form class="w-100">
                <div class="mb-5">
                    <!-- Email input -->
                    <div class="form-outline mb-3">
                        <input type="email" id="email_input" class="form-control text-white" />
                        <label class="form-label text-white" for="email_input">Email address</label>
                    </div>

                    <!-- Password input -->
                    <div class="form-outline">
                        <input type="password" id="password_input" class="form-control text-white" />
                        <label class="form-label text-white" for="password_input">Password</label>
                    </div>
                </div>

                <!-- Submit button -->
                <button type="submit" class="btn btn-primary btn-block">Log In</button>
            </form>
        </div>
    </div>

</template>
<script>
export default {
    name: "LoginPage",
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