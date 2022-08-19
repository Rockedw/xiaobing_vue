<template>
  <div class="container">
    <h3 class="page-tl">推广工具</h3>
  </div>
</template>
<script>
import { reactive, defineComponent, toRefs, onMounted } from 'vue';
import {  } from '@/api/promote';

export default defineComponent({
  setup() {
    const data = reactive({
      loading: false,
    });

    onMounted(() => {

    })
    return {
      ...toRefs(data),
    };
  },

});

</script>
<style scoped>
</style>