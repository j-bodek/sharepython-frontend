<template>
  <main-header></main-header>
  <router-view></router-view>
  <main-footer></main-footer>
</template>

<script>
import MainHeader from './components/layout/MainHeader.vue';
import MainFooter from './components/layout/MainFooter.vue';

export default {
  name: 'App',
  components: {
    MainHeader,
    MainFooter
  }
}
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: fit-content;
  overflow: hidden;
  background: red;
  margin: 0;
}
</style>
