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
            <button type="button" @click="createCodespace" class="btn btn-lg btn-outline-primary btn-rounded start-btn"
                data-mdb-ripple-color="dark">
                Let's test it
            </button>
        </div>
    </div>
</template>

<script>
import BaseSlider from '../components/base/BaseSlider.vue';

export default {
    name: 'LandingPage',
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
    methods: {
        createCodespace() {
            // TODO
            // send request to api and create new codespace
            let dummy_uuid = "a841a176-c31b-4969-9e59-0aa1743b420a";
            // redirect to codespace page
            this.$router.push({
                name: "codespace",
                params: { uuid: dummy_uuid }
            })
        }
    }
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