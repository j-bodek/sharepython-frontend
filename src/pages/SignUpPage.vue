<template>
    <div class="bg-dark text-light h-100 d-flex" style="height: 100vh !important">
        <div class="m-auto w-50">
            <h1 class="mb-5" style="font-size: 3rem">Sign Up</h1>

            <form class="w-100">
                <div class="mb-5">
                    <!-- first name, last name inputs -->
                    <div class="row">
                        <div class="col-md-6 col-12 mb-3">
                            <div class="form-outline">
                                <input type="text" id="form3Example1" class="form-control text-white" />
                                <label class="form-label text-white" for="form3Example1">First name</label>
                            </div>
                        </div>
                        <div class="col-md-6 col-12 mb-3">
                            <div class="form-outline">
                                <input type="text" id="form3Example2" class="form-control text-white" />
                                <label class="form-label text-white" for="form3Example2">Last name</label>
                            </div>
                        </div>
                    </div>
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
                <button type="submit" class="btn btn-primary btn-block">Sign Up</button>
            </form>
        </div>
    </div>

</template>
<script>
export default {
    name: "SignUpPage",
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