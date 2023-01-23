<template>
    <div class="bg-dark text-light h-100 d-flex" style="height: 100vh !important">
        <div class="m-auto">
            <h1 class="mx-auto" style="font-size:10rem">404</h1>
            <h1 class="mx-auto">Page Not Found</h1>
            <h5>
                <router-link to="/">
                    <span>Home Page</span>
                </router-link>
            </h5>
        </div>
    </div>

</template>

<script>
export default {
    name: "NotFoundPage",
}
</script>