<template>
        <!-- 选择模型弹出框 -->
        <a-modal v-model:visible="visible" width="60%" title="Basic Modal" @ok="submitForm">
          <a-form
                class="model_form"
                ref="formRef"
                name="dynamic_form_item"
                :model="model_names"
                v-bind="formItemLayoutWithOutLabel"
                
              >
                <a-form-item
                  :label="'hahahah'"
                >
                <a-input
                    v-model:value="input_text"
                    placeholder="please input text"
                    style="width: 40%; margin-right: 8px;height: 100px;"
                  />
                </a-form-item>
                <a-form-item
                  v-for="(model_name, index) in model_names"
                  :key="model_name.key"
                  v-bind="index === 0 ? formItemLayout : {}"
                  :label="index === 0 ? 'Model Information' : ''"
                  :name="['model_names', index, 'value']"
                >
                  <a-input
                    v-model:value="model_name.value"
                    placeholder="please input the name of model"
                    style="width: 40%; margin-right: 8px"
                  />
                  <a-cascader class="choose_model" v-model:value="local_models[index]" :options="options1" placeholder="Please choose model" />
                  
                  <MinusCircleOutlined
                    v-if="model_names.length > 1"
                    class="dynamic-delete-button"
                    :disabled="model_names.length === 1"
                    @click="removeDomain(model_name)"
                  />
                </a-form-item>
                <a-form-item v-bind="formItemLayoutWithOutLabel">
                  <a-button type="dashed" style="width: 60%" @click="addDomain">
                    <PlusOutlined />
                    Add field
                  </a-button>
                </a-form-item>
                <!-- <a-form-item v-bind="formItemLayoutWithOutLabel">
                  <a-button type="primary" html-type="submit" @click="submitForm">Submit</a-button>
                  <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
                </a-form-item> -->
            </a-form>
         </a-modal> 

      <a-modal v-model:visible="res_visible" width="60%" title="Basic Modal" @ok="handleOk">
          <div v-if="res_spin_visible" class="res_spin">
              <a-spin  size="large"/>
          </div>
          {{result}}
      </a-modal>

    <!-- 主界面 -->
    <div class="components-page-header-demo-responsive" style="border: 1px solid rgb(235, 237, 240)">
        <a-page-header :title=repo_name sub-title="This is a subtitle" @back="() => $router.go(-1)">
        <template #extra>
            <a-button key="2">Operation</a-button>
            <a-button type="primary" @click="showModal">Choose Models</a-button>
        </template>
        <template #footer>
            <a-tabs>
            <a-tab-pane key="1" tab="Details" />
            </a-tabs>
        </template>
        <div class="content">
            <div class="main">
            <a-descriptions size="small" :column="1">
                <a-descriptions-item label="Owner">{{owner_name}}</a-descriptions-item>
                <a-descriptions-item label="Description">
                <a>待添加</a>
                </a-descriptions-item>
                <a-descriptions-item label="Update Time">{{time}}</a-descriptions-item>
            </a-descriptions>
            </div>
            <div class="extra">
            <div
                :style="{
                display: 'flex',
                width: 'max-content',
                justifyContent: 'flex-end',
                }"
            >
                <a-statistic
                title="Status"
                value="Pending"
                :style="{
                    marginRight: '32px',
                }"
                />
                <a-statistic title="Price" prefix="$" :value="568.08" />
            </div>
            </div>
        </div>
        </a-page-header>
    </div>
        <!-- 分支选择 -->
        <div class="branches">
          <a-space>
              <a-cascader 
                v-model:value="branch_value"
                style="margin-top: 1rem"
                :options="options"
                placeholder="Please select"
                @change="onChangeCascader"
              >
              <template #suffixIcon><branches-outlined class="test" /></template>
              </a-cascader>
          </a-space>
        </div>
        <!-- 文件列表 -->
        <div class="files">
           <a-tree
            class="file_tree"
            v-if="is_extention"
            v-model:selectedKeys="selectedKeys"
            show-line
            :tree-data="fileTreeData"
            :defaultExpandAll=true
          >
            <template #switcherIcon="{ switcherCls }"><down-outlined :class="switcherCls" /></template>
        </a-tree>
        </div>
</template>
<script>
import {DownOutlined , BranchesOutlined ,MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { defineComponent, onMounted, ref, nextTick,reactive } from 'vue';
import {useRouter} from 'vue-router'
import axios  from "axios"
const host = 'http://localhost:8081/'
// const host = 'http://39.105.6.98:43081/'
// const host = 'http://8.130.105.10:59081/'



const options1 = ref([]);



export default defineComponent({
  components: {
    BranchesOutlined,
    DownOutlined,
    MinusCircleOutlined,
    PlusOutlined,
  },
  setup() {
    const selectedKeys = ref([]);
    const fileTreeData = ref([]);
    const branch_value =  ref('')
    const options =ref([])
    //repo 属性
    const owner_name = ref("")
    const repo_name = ref("")
    const update_time = ref(0)
    const time = ref('')
    const temp_version = ref('')
    const is_extention = ref(false)
    const res_visible = ref(false)
    const res_spin = ref(false)
    const result = ref('')
    const input_text = ref('')

    const visible = ref(false);

    const showModal = () => {
      visible.value = true;
    };

    const showResModal = () =>{
      res_visible.value = true;
    };

    const handleOk = e => {
      console.log(e);
      res_visible.value = false;
    };


     const formRef = ref();
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 4,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 20,
        },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 20,
          offset: 4,
        },
      },
    };
    // const dynamicValidateForm = ref({
    //   model_names: [],
    //   local_models:[]
    // })

    const model_names = ref([])
    const local_models = ref([])
    const res_spin_visible = ref(true)

    const submitForm = () => {
      visible.value=false
      showResModal()
      res_spin_visible.value = true
      let url = host+'run_mlflow_project'
      // formRef.value.validate().then(() => {
      //   console.log('values', value);
      // }).catch(error => {
      //   console.log('error', error);
      // });
      // console.log(value)
      console.log(model_names)
      console.log(local_models)
      // runMlflowProject()
      let temp =[]
      for(let i = 0 ; i<model_names.value.length;i++){
          temp.push(model_names.value[i].value)
      }
       axios.post(url,{
          owner_name:owner_name.value,
          repo_name:repo_name.value,
          temp_version:temp_version.value,
          model_names:temp,
          s3_models:local_models.value,
          input_text:input_text.value
        })
        .then(response=>{
            res_spin_visible.value = false
            //console.log('fileTreeData',response.data.data)
            result.value = response.data.data


        })
        .catch(error=>{
            //console.error();
        })

    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    const removeDomain = item => {
      let index = model_names.value.indexOf(item);

      if (index !== -1) {
        model_names.value.splice(index, 1);
        local_models.value.splice(index,1);
      }
    };

    const addDomain = () => {
      model_names.value.push({
        value: '',
        key: Date.now(),
      });
    };
    

    onMounted(() => {
      //console.log('temp_version1',temp_version.value)
      getPageParams()
      getAllModels()
      getBranchesByNameAndOwner(owner_name.value,repo_name.value,update_time.value)
      getFileByHeadBranch(owner_name.value,repo_name.value,null)
    })


  

    let onChangeCascader = function (value) {
      console.log('选中的id',value[0]);
      branch_value.value   = value[0]
      getFileByHeadBranch(owner_name.value,repo_name.value,value[0])
      console.log('change',temp_version.value)
    }

    const router = useRouter()
    let getPageParams = function () {
      let params = router.currentRoute.value.params // params参数跳转
      repo_name.value = params.repo_name
      owner_name.value = params.owner_name
      update_time.value = params.update_time
      time.value = new Date(parseInt(params.update_time)*1000)

    }

    let getBranchesByNameAndOwner = function(owner_name,repo_name,update_time){
      let url = host+ 'query_branches_by_owner_and_name'
      axios.post(url,{
            owner_name:owner_name,
            repo_name:repo_name,
            update_time:update_time
        })
        .then(response=>{
            console.log(response.data)
            let branches_and_version = response.data.data
            console.log('type',typeof(branches_and_version['temp_version']))
            temp_version.value=branches_and_version['temp_version']
            let temp = branches_and_version['branches']
            console.log('temp',temp)
            if(temp.length>0){
                branch_value.value = temp[0].replace(/\s+/g,"")
            }
            for(let i = 1 ; i<temp.length ; i++){
                options.value.push({
                  value:temp[i].replace(/\s+/g,""),
                  label:temp[i].replace(/\s+/g,"")
               })
            }
            console.log('options.value',options.value)
        })
        .catch(error=>{
        })
    }

    const getAllModels = function(){
      let url = host+'query_all_model'
      axios.get(url)
        .then(response=>{
            let model_data = []
            let models = response.data.data
                for(var key in models){
                    console.log('key',key)
                    console.log('models[key]',models[key])
                    let children = []
                    for(var i=0 ; i<models[key].length;i++){
                      let version = models[key][i]
                      console.log('-----version------',version)
                      children.push({'value':version['model_version'],'label':version['model_version']})
                    }

                    model_data.push({'value':key,'label':key,'children':children})
                }
            console.log('options1',options1.value)
            console.log('model_data',model_data)
            options1.value = model_data
        })
        .catch(error=>{
            console.error();
        })
    }
    
    
    let getFileByHeadBranch = function(owner_name,repo_name,branch_name){
       is_extention.value = false
       let url = host+'query_file_by_owner_and_name_and_branch'
       console.log('getFileByHeadBranch temp_version',temp_version.value)
        axios.post(url,{
          owner_name:owner_name,
          repo_name:repo_name,
          branch_name:branch_name,
          temp_version:temp_version.value
        })
        .then(response=>{
            fileTreeData.value = response.data.data
            is_extention.value = true
        })
        .catch(error=>{
            //console.error();
        })
    }

    let runMlflowProject = function(){
        res_spin_visible.value = true
        let url = host+'run_mlflow_project'
        axios.post(url,{
          owner_name:owner_name.value,
          repo_name:repo_name.value,
          temp_version:temp_version.value
        })
        .then(response=>{
          res_spin_visible.value = false
        })
        .catch(error=>{
            //console.error();
        })
    }
    
    return {
        repo_name,
        owner_name,
        getPageParams,
        branch_value,
        options,
        selectedKeys,
        fileTreeData,
        getFileByHeadBranch,
        onChangeCascader,
        update_time,
        time,
        temp_version,
        visible,
        showModal,
        handleOk,
        formRef,
        formItemLayout,
        formItemLayoutWithOutLabel,
        submitForm,
        resetForm,
        removeDomain,
        addDomain,
        value: ref([]),
        options1,
        model_names,
        local_models,
        getAllModels,
        is_extention,
        runMlflowProject,
        showResModal,
        res_spin,
        result,
        res_visible,
        input_text,
        res_spin_visible
    };
  },
// 
});
</script>
<style scoped>
.demo-loadmore-list {
  min-height: 350px;
}

.res_spin {
  text-align: center;
  /* background: rgba(0, 0, 0, 0.05); */
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
}

</style>
<style>
.components-page-header-demo-responsive {
  padding-bottom: 20px;
}
.components-page-header-demo-responsive tr:last-child td {
  padding-bottom: 0;
}
#components-page-header-demo-responsive .content {
  display: flex;
}
#components-page-header-demo-responsive .ant-statistic-content {
  font-size: 20px;
  line-height: 28px;
}
@media (max-width: 576px) {
  #components-page-header-demo-responsive .content {
    display: block;
  }

  #components-page-header-demo-responsive .main {
    width: 100%;
    margin-bottom: 12px;
  }

  #components-page-header-demo-responsive .extra {
    width: 100%;
    margin-left: 0;
    text-align: left;
  }
}
.branches {
    width: 20%;
    margin-left: 2%; 
    height: 5vh !important;
}
.files{
  margin-top: 1%;
}
.file_tree{
  height: 68vh !important;
  width: auto !important;
}
.components-page-header-demo-responsive{
  height: 25vh !important;
}

.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
.choose_model{
  width: 40% !important;
}
.model_form{
  min-height: 20vh !important;
  height: auto !important;
}


</style>