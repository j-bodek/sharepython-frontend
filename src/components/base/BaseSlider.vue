<template>
    <div class="slider mx-2">
        <div ref="slider" :class="{ 'slide_up': animate }" class="slider-box text-danger">
            <h1 v-for="slide in sliderList">{{ slide }}</h1>
        </div>
    </div>
</template>
<script>
export default {
    name: 'BaseSlider',
    props: ['sliderList'],
    data() {
        return {
            animate: false,
        }
    },
    mounted() {
        let that = this;
        this.sliderAnimate();
        setInterval(() => {
            let element = that.sliderList.shift();
            that.sliderList.push(element);
            that.sliderAnimate();
        }, 5000)
    },
    methods: {
        sliderAnimate() {
            this.animate = true
            setTimeout(() => {
                this.animate = false
            }, 1500)
        }
    }
}
</script>
<style scoped>
h1 {
    margin-top: 0;
    line-height: 3rem;
}

.slider {
    height: 3rem;
    overflow: hidden;
}

.slide_up {
    animation: slide_up 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    /* transform: translate3d(0, 0, 0); */
}

@keyframes slide_up {
    0% {
        margin-top: 3rem;
    }

    100% {
        margin-top: 0rem;
    }
}
</style>