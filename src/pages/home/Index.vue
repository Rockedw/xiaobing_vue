<template>
  <div>
    <div class="topbar">
      <div class="menu">
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
          <a-menu-item key="projects">
            <template #icon>
              <project-outlined />
            </template>
            projects
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
          <a-empty v-if="tasks.length==0" :image="simpleImage" />
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
        <a-button @click="create_repo()">
          新建仓库
        </a-button>
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
           <a-upload
              action="/test"
              :multiple="true"
              :file-list="fileList"
              @change="handleChange"
              directory
            >
              <a-button>
                <upload-outlined></upload-outlined>
                上传模型
              </a-button>
           </a-upload>


            <a-table :columns="columns" :data-source="model_list">
              <template #headerCell="{ column }">
                <template v-if="column.dataIndex === 'name'">
                  <span>
                    <smile-outlined />
                    Name
                  </span>
                </template>
              </template>

              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'name'">
                    {{ record.model_name }}
                </template>
                 <template v-if="column.dataIndex === 'version'">
                    {{ record.model_version }}
                </template>
                 <template v-if="column.dataIndex === 'create time'">
                    {{ record.model_name }}
                </template>
                 <template v-if="column.dataIndex === 'operation'">
                     <a-popconfirm
                        v-if="model_list.length"
                        title="Sure to delete?"
                        @confirm="onDelete(record.model_name,record.model_version)"
                      >
                        <a>Delete</a>
                      </a-popconfirm>
                </template>
                <!-- <template v-else-if="column.key === 'tags'">
                  <span>
                    <a-tag
                      v-for="tag in record.tags"
                      :key="tag"
                      :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
                    >
                      {{ tag.toUpperCase() }}
                    </a-tag>
                  </span>
                </template>
                <template v-else-if="column.key === 'action'">
                  <span>
                    <a>Invite 一 {{ record.name }}</a>
                    <a-divider type="vertical" />
                    <a>Delete</a>
                    <a-divider type="vertical" />
                    <a class="ant-dropdown-link">
                      More actions
                      <down-outlined />
                    </a>
                  </span>
                </template> -->
              </template>
            </a-table>

      </div>
      <div class="content" v-if="current[0]=='projects'">
            <a-table :columns="project_columns" :data-source="project_list">
              <template #headerCell="{ column }">
                <template v-if="column.dataIndex === 'repository'">
                  <span>
                    <smile-outlined />
                    Repository
                  </span>
                </template>
              </template>

              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'repository'">
                    {{ record.repo_name }}
                </template>
                 <template v-if="column.dataIndex === 'owner'">
                    {{ record.repo_owner }}
                </template>
                <template v-if="column.dataIndex === 'branch'">
                    {{ record.branch_name }}
                </template>
                 <template v-if="column.dataIndex === 'modles'">
                    <li v-for="(model,index) in record.model_names">
                      {{record.model_names[index]}}{{record.model_version[index]}}
                    </li>
                </template>
                 <template v-if="column.dataIndex === 'operation'">
                     <a-popconfirm
                        v-if="project_list.length"
                        title="Sure to delete?"
                        @confirm="onDelete(record.model_name,record.model_version)"
                      >
                        <a>Delete</a>
                      </a-popconfirm>
                </template>
       
              </template>
            </a-table>

      </div>

    </div>
  </div>
</template>


<script>
import { defineComponent, reactive, toRefs,ref } from "vue";
import {onMounted } from 'vue';
import axios  from "axios";
import { useRouter } from "vue-router"
import { Empty } from 'ant-design-vue';
import {CodeOutlined, FolderOpenOutlined ,UploadOutlined,ProjectOutlined } from '@ant-design/icons-vue';
// const host = 'http://localhost:8084/'
const host = 'http://39.105.6.98:43081/'
const query_all_task_url = host+'query_all_task'
const temp = 'all'
export default defineComponent({
  components: {
    // BankOutlined,
    // ApartmentOutlined
    CodeOutlined,
    FolderOpenOutlined,
    UploadOutlined,
    ProjectOutlined
    
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
    const fileList = ref([])
    const project_list = ref([])
    const columns = [{
      title: 'name',
      dataIndex: 'name',
      width: '30%',
    }, {
      title: 'version',
      dataIndex: 'version',
    }, {
      title: 'create time',
      dataIndex: 'create time',
    }, {
      title: 'operation',
      dataIndex: 'operation',
    }];

    const project_columns = [{
      title: 'repository',
      dataIndex: 'repository',
    }, {
      title: 'owner',
      dataIndex: 'owner',
    }, {
      title: 'branch',
      dataIndex: 'branch',
    }, {
      title: 'models',
      dataIndex: 'models',
    }, {
      title: 'operation',
      dataIndex: 'operation',
    }];


    const handleChange = info => {
      let resFileList = [...info.fileList]; // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new

      resFileList = resFileList.slice(-2); // 2. read from response and show file link

      resFileList = resFileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url;
        }

        return file;
      });
      fileList.value = resFileList;
    };

    //  const onDelete = key => {
    //   dataSource.value = dataSource.value.filter(item => item.key !== key);
    // };
    const onDelete = function(model_name,model_version){
      model_list.value = model_list.value.filter(item => !(item.model_name==model_name&&model_version==item.model_version))
    }

    let create_repo = function(){
      let url =  '/api/v1/user/repos'
        axios.post('/api/v1/user/repos',{
          auto_init: true,
          default_branch: "master", 
          description: "nothing",  
          name: "test_creation4",  
          trust_model: "default"
        },{
          headers: {
            Authorization: "token 1b6ef1abf0564839abe7c484489be8b98965a481",
            accept: 'application/json',
          }
        })
        .then(response=>{
          console.log(response.data)
        })
        .catch(error=>{
            console.error();
        })

        // axios.get('http://39.105.6.98:43000/api/v1/repos/search?access_token=1b6ef1abf0564839abe7c484489be8b98965a481')
        // .then(response=>{
        //   console.log(response.data)
        // })
        // .catch(error=>{
        //   console.error(error);
        // })
    }

    let get_all_project = function(){
      let url = host+'query_all_project'
      axios.get(url)
      .then(response=>{
        project_list.value = response.data.data
      })
      .catch(error=>{
        console.error(error);
      })
    }


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
      // 参数
        loading,
        initLoading,
        initLoading1,
        data,
        list,
        tasks,
        selected,
        current,
        model_list,
        columns,
        fileList,
        project_columns,
        simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      // 方法
        query_repo_by_task_id,
        turn_to_repo_detial,
        query_all_model,
        onDelete,
        create_repo,
        handleChange
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
.menu{
  width: 100% !important;
}
.top_menu{
  margin-left: 80% !important;
}

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