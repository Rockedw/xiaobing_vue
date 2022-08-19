<template>
  <div class="container">
    <h3 class="page-tl">自动推送名单</h3>
  </div>
</template>
<script>
import { reactive, defineComponent, toRefs, onMounted } from 'vue';

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