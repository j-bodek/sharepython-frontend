<template>
    <header>
        <!-- Navbar -->
        <nav class="navbar navbar-expand-md navbar-dark bg-dark w-100 position-fixed">
            <!-- Container wrapper -->
            <div class="container">
                <!-- Navbar brand -->
                <router-link class="navbar-brand me-2 fw-bold" to="/">
                    SharePython
                </router-link>

                <!-- Toggle button -->
                <button class="navbar-toggler" type="button" data-mdb-toggle="collapse"
                    data-mdb-target="#navbarButtonsExample" aria-controls="navbarButtonsExample" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <i class="fas fa-bars"></i>
                </button>

                <!-- Collapsible wrapper -->
                <div class="collapse navbar-collapse justify-content-end" id="navbarButtonsExample">
                    <div class="d-flex align-items-center">
                        <router-link to="/login" class="nav-link btn shadow-0 text-light px-3 me-2">
                            Log In
                        </router-link>
                        <router-link to="/signup" class="nav-link btn shadow-0 text-light me-3">
                            Sign Up
                        </router-link>
                        <a class="btn btn-light px-3" target="_blank" href="https://github.com/LilJack118/sharepython"
                            role="button">
                            <i class="fab fa-github"></i>
                        </a>
                    </div>
                </div>
                <!-- Collapsible wrapper -->
            </div>
            <!-- Container wrapper -->
        </nav>
        <!-- Navbar -->
    </header>
</template>

<style>
.nav-link:hover {
    color: #332d2d !important;
    background-color: #fbfbfb;
}
</style>