<template>
  <div class="sidebar">
    <div class="sidebar-tit">Tasks:</div>
      <a-radio-group class="sidebar-allbtn" v-model:value="selected">
        <a-radio-button v-for="(task,i) in tasks" :value=task.id @click="query_repo_by_task_id">{{task.value}}</a-radio-button>
      </a-radio-group>
    </div>
</template>
<script>
import { defineComponent, reactive, toRefs,ref } from "vue";
import {onMounted, nextTick } from 'vue';
import axios  from "axios";
import { useRouter } from "vue-router"
// import { BankOutlined, ApartmentOutlined } from '@ant-design/icons-vue';
const query_all_task_url = 'http://localhost:8081/query_all_task'
export default defineComponent({
  components: {
    // BankOutlined,
    // ApartmentOutlined
  },
  setup() {
    

    const tasks = ref([])
    const selected = ref(null)
    const data = reactive({
      value1: [],
    });
    data.value1 = ref('a');
    const router = useRouter()
    let query_repo_by_task_id = function(){
      console.log("update")
      console.log(selected)
        router.push({
            name:'home',
            params:{
              task_id:selected
            }
        })
    }

    onMounted(() => {
      axios.get(query_all_task_url)
      .then(response=>{
        // console.log(response.data.data)
        tasks.value=response.data.data
        // console.log(tasks)
      })
      .catch(error=>{
        console.error();
      })
    });
  
    return {
      ...toRefs(data),
      tasks,
      selected,
      query_repo_by_task_id
    }



  },
});
</script>
<style lang='less'>
// .ant-menu-inline {
//   border-right: none;
// }
.sidebar-tit {
  margin-top: 8px;
  margin-left: 8px;
  font-size: 16px;
}
.sidebar-allbtn {
  display: flex;
  flex-wrap: wrap;
  label {
    margin: 4px;
    // border-radius: 8px;
    // overflow: hidden;
  }
}
</style>