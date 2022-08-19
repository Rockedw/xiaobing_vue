<template>
  <div>
    <div class="topbar">
      <div>
         <!-- <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" /> -->
      </div>
      <div style="width=80%">
        <a-menu class="top_menu" v-model:selectedKeys="current" mode="horizontal">
          <a-menu-item key="code">
            <template #icon>
              <code-outlined />
            </template>
            Code
          </a-menu-item>
          <a-menu-item key="models">
            <template #icon>
              <FolderOpenOutlined />
            </template>
            Models
          </a-menu-item>
        </a-menu>
      </div>
      
      <!-- <div class="user">
        Hi, Impr
      </div> -->
    </div>
    <div class="layout">
      <div class="sidenav">
        <div class="sidebar">
          <div class="sidebar-tit">Tasks:</div>
          <a-radio-group class="sidebar-allbtn" v-model:value="selected">
            <a-radio-button
              v-for="(task,i) in tasks"
              :value="task.id"
              @click="query_repo_by_task_id(task.id)"
              >{{task.value}}</a-radio-button
            >
          </a-radio-group>
        </div>
      </div>
      <div class="content" v-if="current[0]=='code'">
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
            <a-list-item class="item">
              <a-skeleton
                avatar
                :title="false"
                :loading="!!item.loading"
                active
              >
                <h4 @click="turn_to_repo_detial(item.owner_name,item.repo_name,item.update_time)">{{item.repo_name}}</h4>
                <div>owner : {{item.owner_name}}</div>
              </a-skeleton>
            </a-list-item>
          </template>
        </a-list>
      </div>
      <div class="content" v-if="current[0]=='models'">
          <a-list
          class="demo-loadmore-list"
          :loading="initLoading1"
          item-layout="horizontal"
          :data-source="model_list"
        >
          <template #loadMore>
            <div
              v-if="!initLoading1 && !loading"
              :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
            >
              <a-button @click="onLoadMore">loading more</a-button>
            </div>
          </template>

          <template #renderItem="{ item }">
            <a-list-item class="item">
              <a-skeleton
                avatar
                :title="false"
                :loading="!!item.loading"
                active
              >
                <h4 @click="turn_to_repo_detial(item.owner_name,item.repo_name,item.update_time)">Model : {{item.model_name}}</h4> <h5>&nbsp;Version : {{item.model_version}}</h5>
                <div>Creation Time : {{item.create_time}}</div>
              </a-skeleton>
            </a-list-item>
          </template>
        </a-list>

      </div>
    </div>
  </div>
</template>


<script>
import { defineComponent, reactive, toRefs,ref } from "vue";
import {onMounted, nextTick } from 'vue';
import axios  from "axios";
import { useRouter } from "vue-router"
import {CodeOutlined, FolderOpenOutlined} from '@ant-design/icons-vue';
const host = 'http://localhost:8083/'
// const host = 'http://39.105.6.98:43081/'
const query_all_task_url = host+'query_all_task'
const temp = 'all'
export default defineComponent({
  components: {
    // BankOutlined,
    // ApartmentOutlined
    CodeOutlined,
    FolderOpenOutlined
    
  },
  setup() {
    
    const router = useRouter()
    const initLoading = ref(true);
    const initLoading1 = ref(true);
    const loading = ref(false);
    const data = ref([]);
    const list = ref([]);
    const current = ref(['code']);
    const tasks = ref([])
    const selected = ref(null)
    const model_list = ref([])
    let query_repo_by_task_id = function(taskid){
        let url =  host+'query_repo_by_task_id'
        console.log("update",taskid)
        // router.push({
        //     name:'home',
        //     params:{
        //       task_id:selected
        //     }
        // })

        axios.post(url,{
            task_id:taskid
        })
        .then(response=>{
            console.log(response.data)
            data.value = response.data.data;
            list.value = response.data.data;
        })
        .catch(error=>{
            console.error();
        })
    }

    let turn_to_repo_detial = function(owner_name,repo_name,update_time){
         router.push({
            name:'repo_detail',
            params:{
              owner_name:owner_name,
              repo_name:repo_name,
              update_time:update_time
            }
        })
    }
    
    let query_all_repo = function(){
        let query_all_repo_url =  host+'query_all_repo'
        fetch(query_all_repo_url).then(res => res.json()).then(res => {
            initLoading.value = false;
            data.value = res.data;
            list.value = res.data;
            console.log(list.value)
        });
    }

    let query_all_model = function(){
        console.log('query_all_model')
        let url =  host+'query_all_model'
        axios.get(url)
        .then(response=>{
            initLoading1.value = false;
            // console.log('hahah',response.data.data)
            for(let key in response.data.data){
              let v = response.data.data[key]
              for(let i = 0 ;i<v.length;i++){
                // console.log(v[i])
                let create_time = Date(v[i]['create_time']) 
                model_list.value.push({'model_name':key,'model_version':v[i]['model_version'],'create_time':create_time})
              }
          }
          console.log('model_list',model_list.value)
        })
        .catch(error=>{
            console.error();
        })
    
      
    }


    onMounted(() => {
        axios.get(query_all_task_url)
        .then(response=>{
            console.log(response.data.data)
            tasks.value=response.data.data
            console.log(tasks)
        })
        .catch(error=>{
            console.error();
        })
        query_all_repo()
        query_all_model()
    });
  
    return {
        loading,
        initLoading,
        initLoading1,
        data,
        list,
        tasks,
        selected,
        query_repo_by_task_id,
        turn_to_repo_detial,
        current,
        query_all_model,
        model_list
    }



  },
});
</script>





<style scoped>
.topbar{
  height: 60px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
}
.layout{
  display: flex;
}
.sidenav{
  min-height: calc(100vh - 60px);
  width: 340px;
  background-color: #f9fafb;
  border-right: 1px solid #eee;
}
.content{
  flex: 1;
  background-color: #fff;
  padding: 20px;
}
.user{
  font-size: 14px;
}
 .ant-menu-inline {
   border-right: none;
 }
 .demo-loadmore-list {
  min-height: 350px;
}
.item{
  width: 70% !important;
  margin-left: 10% !important;
  height: auto !important;
}
/* .top_menu{
  margin-left: 80% !important;
} */

</style>
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