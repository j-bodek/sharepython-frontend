<template>
    <div class="bg-dark text-light h-100 d-flex" style="height: 100vh !important">
        <div class="m-auto" style="width: fit-content">
            <h1 class="fw-bold mb-4" style="font-size:8vh">
                SharePython.io
            </h1>
            <div class="slider-container mb-4 d-flex justify-content-center">
                <h1>For</h1>
                <base-slider :sliderList="sliderList"></base-slider>
                <h1>python code!</h1>
            </div>
            <button type="button" @click="createCodeSpace" class="btn btn-lg btn-outline-primary btn-rounded start-btn"
                data-mdb-ripple-color="dark">
                Let's test it
            </button>
        </div>
    </div>
</template>

<script>
import BaseSlider from '../components/base/BaseSlider.vue';
import createCodeSpaceMixin from "../mixins/createCodeSpaceMixin.js";

export default {
    name: 'LandingPage',
    mixins: [createCodeSpaceMixin],
    components: {
        BaseSlider,
    },
    data() {
        return {
            sliderList: [
                "writing",
                "sharing",
                "running"
            ]
        }
    },
}
</script>

<style scoped>
.start-btn:hover {
    background-color: #3b71ca;
    color: #fbfbfb;
    font-weight: bold !important;
}

.slider-container h1 {
    margin-top: 0;
    line-height: 3rem;
}
</style>