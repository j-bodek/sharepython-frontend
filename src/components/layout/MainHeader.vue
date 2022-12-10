<template>
    <header>
        <!-- Navbar -->
        <nav class="navbar navbar-expand-md navbar-dark bg-dark w-100 position-fixed">
            <!-- Container wrapper -->
            <div class="container">
                <!-- Navbar brand -->
                <a class="navbar-brand me-2 fw-bold" href="#">
                    SharePython
                </a>

                <!-- Toggle button -->
                <button class="navbar-toggler" type="button" data-mdb-toggle="collapse"
                    data-mdb-target="#navbarButtonsExample" aria-controls="navbarButtonsExample" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <i class="fas fa-bars"></i>
                </button>

                <!-- Collapsible wrapper -->
                <div class="collapse navbar-collapse justify-content-end" id="navbarButtonsExample">
                    <div class="d-flex align-items-center">
                        <button type="button" class="btn btn-link text-light px-3 me-2">
                            Log In
                        </button>
                        <button type="button" class="btn btn-link text-light me-3">
                            Sign Up
                        </button>
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
.btn-link:hover,
.btn-link:focus {
    color: #332d2d !important;
}
</style>