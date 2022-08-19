<template>
  <a-list
    class="demo-loadmore-list"
    :loading="initLoading"
    item-layout="horizontal"
    :data-source="list"
  >
    <template #loadMore>
      <div
        v-if="!initLoading && !loading"
        :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
      >
        <a-button @click="onLoadMore">loading more</a-button>
      </div>
    </template>

    <template #renderItem="{ item }">
      <a-list-item>
        <a-skeleton avatar :title="false" :loading="!!item.loading" active>
          <h4>{{item.repo_name}}</h4>
          <div>owner : {{item.owner_name}}</div>
        </a-skeleton>
      </a-list-item>
    </template>

  </a-list>
</template>
<script>
import { defineComponent, onMounted, ref, nextTick } from 'vue';
import {useRouter} from 'vue-router'
import axios  from "axios";
const fakeDataUrl = `http://localhost:8081/`;
export default defineComponent({
  setup() {
    const router = useRouter()
    const initLoading = ref(true);
    const loading = ref(false);
    const data = ref([]);
    const list = ref([]);
    let getPageParams = function () {
      console.log("here")
      //let params = router.currentRoute.value.query // query参数跳转
      let params = router.currentRoute.value.params // params参数跳转
      console.log('currentRoute.value:', router.currentRoute.value)
      console.log('params:', params)
    }
    onMounted(() => {
      getPageParams()
      fetch(fakeDataUrl).then(res => res.json()).then(res => {
        initLoading.value = false;
        data.value = res.data;
        list.value = res.data;
        // console.log(list)
      });
      // axios.get(fakeDataUrl).then(response=>response.json()).then(response=>{
      //   data.value=response.data.data
      //   list.value=response.data.data
      //   console.log(typeof(data.value))
      //   console.log(data.value)
      // }).catch(error=>{
      //   console.log("error error")
      // })
    })

    const onLoadMore = () => {
       axios.get(fakeDataUrl).then(response=>{
        data.value=response.data['data']
        list.value=response.data['data']
        console.log(data.value)
      }).catch(error=>{
        console.log("error error")
      })
    };

    return {
      loading,
      initLoading,
      data,
      list,
      onLoadMore,
      getPageParams
    };
  },

});
</script>
<style scoped>
.demo-loadmore-list {
  min-height: 350px;
}
</style>