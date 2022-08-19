<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'App',
  components: {
    
  }
}
</script>

<style>
@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Roboto'), local('Roboto-Regular'), url(@/assets/fonts/Roboto-Regular.woff2) format('woff2');
}
@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: local('Roboto'), local('Roboto-Bold'), url(@/assets/fonts/Roboto-Bold.woff2) format('woff2');
}
#app {
  font-family: 'Roboto', system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, 'Open Sans', 'Helvetica Neue', sans-serif, serif;
  color: #000;
  font-weight: 400;
}
body{
  margin: 0;
  background-color: #f8f8f8;
}
.page-tl{
  margin-bottom: 16px;
}
</style>
