<template>
  <div>
    <div class="topbar">
      <div class="menu">
        <a-menu class="top_menu" v-model:selectedKeys="current" mode="horizontal">
          <a-menu-item key="code">
            <template #icon>
              <code-outlined/>
            </template>
            Code
          </a-menu-item>
          <a-menu-item key="models">
            <template #icon>
              <FolderOpenOutlined/>
            </template>
            Models
          </a-menu-item>
          <a-menu-item key="projects">
            <template #icon>
              <project-outlined/>
            </template>
            Projects
          </a-menu-item>
          <a-menu-item key="modules">
            <template #icon>
              <project-outlined/>
            </template>
            Modules
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
          <a-empty v-if="tasks.length===0" :image="simpleImage"/>
          <a-radio-group class="sidebar-allbtn" v-model:value="selected">
            <a-radio-button
                v-for="(task,i) in tasks"
                :value="task.id"
                @click="query_repo_by_task_id(task.id)"
            >{{ task }}
            </a-radio-button
            >
          </a-radio-group>
        </div>
      </div>
      <div class="content" v-if="current[0]==='code'">
        <a-button @click="create_repo()">
          新建仓库
        </a-button>
        <a-list
            class="demo-loadmore-list"
            :loading="initLoading"
            item-layout="horizontal"
            :data-source="repo_list"
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
                <h4 @click="turn_to_repo_detail(item.owner_name,item.repo_name,item.update_time)">
                  {{ item.repo_name }}</h4>
                <div>owner : {{ item.owner_name }}</div>
              </a-skeleton>
            </a-list-item>
          </template>
        </a-list>
      </div>
      <div class="content" v-if="current[0]==='models'">
        <!--        <form  visible="create_model_modal_visible" action = "http://localhost:5000/uploader" method = "POST"-->
        <!--         enctype = "multipart/form-data">-->
        <!--         <input type = "file" name = "file" multiple/>-->
        <!--         <input type = "submit"/>-->
        <!--        </form>-->

        <a-modal v-model:visible="create_model_modal_visible" width="60%" title="Basic Modal" @ok="submit_model_form"
                 @cancel="clear_form">
          <a-form
              :model="create_model_form"
              name="validate_other"
              v-bind="formItemLayout"
          >
            <a-form-item
                name="Model"
                label="Model"
                has-feedback
            >
              <!--                <a-cascader  class="choose_model"  :options="model_name_list" v-model:value="create_model_form.model_name" placeholder="Please choose model" />-->
              <a-select v-if="is_here" v-model:value="create_model_form.model_name"
                        @change="query_repo_by_owner(create_project_form.owner_name)"
                        placeholder="Please select an Model">
                <a-select-option v-for="model_name in model_name_list" v-bind:key="model_name" :value="model_name">
                  {{ model_name }}
                </a-select-option>
              </a-select>
              <a-input v-model:value="create_model_form.model_name" v-if="!is_here">

              </a-input>
              <a v-if="is_here" @click="change_is_here()">不在其中</a>
              <a v-if="!is_here">请在上方输入模型名称</a>
            </a-form-item>

            <a-form-item name="upload" label="Upload" extra="选择模型文件夹">
              <a-upload
                  v-model:fileList="create_model_form.file_list"
                  directory
                  :loading="uploading"
                  :custom-request="log_files"
                  :show-upload-list="false"
                  :beforeUpload="false"
              >
                <a-button>
                  <template #icon>
                    <UploadOutlined/>
                  </template>
                  {{ uploading ? 'Uploading' : 'Start Upload' }}
                </a-button>
              </a-upload>
              <h3 v-for="(file,index) in create_model_form.file_list">{{ file.name }}
                <MinusCircleOutlined
                    v-if="create_model_form.file_list.length >= 1"
                    class="dynamic-delete-button"
                    :disabled="create_project_form.model_list.length === 0"
                    @click="remove_domain2(create_model_form.file_list[index])"
                />
              </h3>
            </a-form-item>
          </a-form>
        </a-modal>



        <a-table :columns="columns" :data-source="model_list">
          <template #headerCell="{ column }">
            <template v-if="column.dataIndex === 'name'">
                  <span>
                    <smile-outlined/>
                    Name
                  </span>
            </template>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              {{ record.model_name }}
            </template>
            <template v-if="column.dataIndex === 'hdfs_path'">
              {{ record.model_hdfs_path }}
            </template>
            <template v-if="column.dataIndex === 'update_time'">
              {{ record.update_time }}
            </template>
            <template v-if="column.dataIndex === 'version'">
              {{ record.version }}
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
      <div class="content" v-if="current[0]==='projects'">
        <a-table :columns="project_columns" :data-source="project_list">
          <template #headerCell="{ column }">
            <template v-if="column.dataIndex === 'repository'">
                  <span>
                    <smile-outlined/>
                    Repository
                  </span>
            </template>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'project_hdfs_path'">
              {{ record.project_hdfs_path }}
            </template>
            <template v-if="column.dataIndex === 'project_version'">
              {{ record.project_version }}
            </template>
            <template v-if="column.dataIndex === 'modules'">
                    <span v-for="(module_id,index) in record.module_ids">
                      id:{{ record.module_ids[index] }}
                    </span>
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <!--                     <a-popconfirm-->
              <!--                        v-if="project_list.length"-->
              <!--                        title="Sure to run?"-->
              <!--                        @confirm="load_model(record.repo_name,record.repo_owner,record.update_time,record.branch_name,record.model_names,record.model_versions)">-->
              <!--                        <a>Run</a>-->
              <!--                      </a-popconfirm>-->
              <a-switch v-model:checked="project_checked_list[record.index]"/>
              <a-popconfirm
                  v-if="model_list.length"
                  title="Sure to delete?"
                  @confirm="delete_project(record.project_id,record.index)"
              >
                <a style="margin-left: 3%">Delete</a>
              </a-popconfirm>
            </template>

          </template>
        </a-table>
        <div>
          <a-popconfirm
              v-if="project_list.length"
              title="Sure to run?"
              @confirm="run_projects()">
            <a-button>Run</a-button>
          </a-popconfirm>
          <a-button @click="make_create_project_modal_visible">Create</a-button>

          <a-modal v-model:visible="create_project_modal_visible" width="60%" title="Basic Modal" @ok="submit_form"
                   @cancel="clear_form">
            <a-form
                :model="create_project_form"
                name="validate_other"
                v-bind="formItemLayout"
            >
              <a-form-item
                  name="hdfs_path"
                  label="HDFS path"
                  has-feedback
              >
                <a-input v-model:value="create_project_form.project_hdfs_path">
                </a-input>
              </a-form-item>
<!--              <a-form-item-->
<!--                  name="Owner"-->
<!--                  label="Owner"-->
<!--                  has-feedback-->
<!--              >-->
<!--                <a-select v-model:value="create_project_form.owner_name"-->
<!--                          @change="query_repo_by_owner(create_project_form.owner_name)"-->
<!--                          placeholder="Please select an owner">-->
<!--                  <a-select-option v-for="owner in form_data.owner_names" v-bind:key="owner" :value="owner">-->
<!--                    {{ owner }}-->
<!--                  </a-select-option>-->
<!--                </a-select>-->
<!--              </a-form-item>-->

<!--              <a-form-item-->
<!--                  v-if="create_project_form.owner_name!==''"-->
<!--                  name="Repository"-->
<!--                  label="Repository"-->
<!--                  has-feedback-->
<!--              >-->
<!--                <a-select v-model:value="create_project_form.repo_name"-->
<!--                          @change="query_branches_by_owner_and_name(create_project_form.owner_name,create_project_form.repo_name)"-->
<!--                          placeholder="Please select a repository">-->
<!--                  <a-select-option v-for="repo in form_data.repo_names" v-bind:key="repo['repo_name']"-->
<!--                                   :value="repo['repo_name']">{{ repo['repo_name'] }}-->
<!--                  </a-select-option>-->
<!--                </a-select>-->
<!--              </a-form-item>-->

<!--              <a-form-item-->
<!--                  v-if="create_project_form.repo_name!==''"-->
<!--                  name="Branch"-->
<!--                  label="Branch"-->
<!--                  has-feedback-->
<!--              >-->
<!--                <a-select v-model:value="create_project_form.branch_name" placeholder="Please select a branch">-->
<!--                  <a-select-option v-for="branch in form_data.branches" v-bind:key="branch" :value="branch">-->
<!--                    {{ branch }}-->
<!--                  </a-select-option>-->
<!--                </a-select>-->
<!--              </a-form-item>-->

<!--              <a-form-item-->

<!--                  name="Model"-->
<!--                  label="Model"-->
<!--                  has-feedback-->
<!--              >-->
<!--                <div v-for="(model,index) in create_project_form.model_list">-->
<!--                  <a-cascader class="choose_model" :options="models_data"-->
<!--                              v-model:value="create_project_form.model_list[index]" placeholder="Please choose model"/>-->
<!--                  <MinusCircleOutlined-->
<!--                      v-if="create_project_form.model_list.length > 1"-->
<!--                      class="dynamic-delete-button"-->
<!--                      :disabled="create_project_form.model_list.length === 1"-->
<!--                      @click="remove_domain(create_project_form.model_list[index])"-->
<!--                  />-->
<!--                </div>-->
<!--                <a-button type="dashed" style="width: 60%" @click="add_domain">-->
<!--                  <PlusOutlined/>-->
<!--                  Add field-->
<!--                </a-button>-->
<!--              </a-form-item>-->
            </a-form>
          </a-modal>

          <a-modal
              v-model:visible="modal_visible"
              title="Basic Modal"
              width="100%"
              wrap-class-name="full-modal"
              @ok="handleOk"
              destroy-on-close
              @cancel="modal_after_close()"
          >
            <div v-for="(project,i) in running_project_list ">
              <h3>{{ project['model_name'] }}</h3>
              <a-spin v-if="service_url_list===[] || service_url_list[i] ===''" tip="模型加载中...">
                <a-alert
                    message="Alert message title"
                    description="Further details about the context of this alert."
                ></a-alert>
              </a-spin>
              <div  class="service_result_div" v-else-if="service_url_list[i]==='error'">
                //文本框展示错误信息
                <a-textarea
                    v-if="service_url_list[i] ==='error'"
                    :rows="4">
                    发生错误
                    </a-textarea>
              </div>
              <div  class="service_result_div" v-else>
                <h3>{{ service_url_list[i] }}</h3>
                <a-textarea v-model:value="post_data" placeholder="input" :rows="4"/>
                <a-textarea v-model:value="response_data_list[i]" style="margin-top: 1% !important;"
                            placeholder="result" :rows="7"/>
                <a-button style="margin-top: 1% !important;"
                          @click="request_service(i,'http://'+service_url_list[i],post_data)">提交
                </a-button>
                <a-divider dashed/>
              </div>
            </div>
          </a-modal>

        </div>

      </div>


    <div class="content" v-if="current[0]==='modules'">
      <a-table :columns="module_columns" :data-source="module_list">
        <template #headerCell="{ column }">
          <template v-if="column.dataIndex === 'repository'">
                    <span>
                      <smile-outlined/>
                      Repository
                    </span>
          </template>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'repository'">
            {{ record.repo_name }}
          </template>
          <template v-if="column.dataIndex === 'owner'">
            {{ record.owner_name }}
          </template>
          <template v-if="column.dataIndex === 'branch'">
            {{ record.branch_name }}
          </template>
          <template v-if="column.dataIndex === 'model'">
            {{ record.model_name }}
          </template>
          <template v-if="column.dataIndex === 'model version'">
            {{ record.model_version }}
          </template>
          <template v-if="column.dataIndex === 'update_time'">
            {{ record.model_update_time }}
          </template>

          <template v-if="column.dataIndex === 'operation'">
            <!--                     <a-popconfirm-->
            <!--                        v-if="project_list.length"-->
            <!--                        title="Sure to run?"-->
            <!--                        @confirm="load_model(record.repo_name,record.repo_owner,record.update_time,record.branch_name,record.model_names,record.model_versions)">-->
            <!--                        <a>Run</a>-->
            <!--                      </a-popconfirm>-->
            <a-switch v-model:checked="module_checked_list[record.index]"/>
            <a-popconfirm
                v-if="module_list.length"
                title="Sure to delete?"
                @confirm="delete_module_by_id(record.id)"
            >
              <a style="margin-left: 3%">Delete</a>
            </a-popconfirm>
          </template>

        </template>
      </a-table>

      <a-modal
              v-model:visible="modal_visible"
              title="Basic Modal"
              width="100%"
              wrap-class-name="full-modal"
              @ok="handleOk"
              destroy-on-close
              @cancel="modal_after_close()"
          >
        <a-row type="flex" :gutter="[16,16]">
          <a-col  flex="auto"  v-for="(module,i) in running_module_list ">
            <div>
              <h3>{{ module['model_name'] }}</h3>
              <a-spin v-if="service_url_list[i]===null||service_url_list[i] ===''" tip="模型加载中...">
                <a-alert
                    message="Alert message title"
                    description="Further details about the context of this alert."
                ></a-alert>
              </a-spin>
              <div class="service_result_div" v-else-if="service_url_list[i]==='error'">
                    <a>发生错误</a>
              </div>
              <div class="service_result_div" v-else >
                <h3>{{ service_url_list[i] }}</h3>
                <a-textarea v-model:value="post_data" placeholder="input" :rows="4"/>
                <a-textarea v-model:value="response_data_list[i]" style="margin-top: 1% !important;"
                            placeholder="result" :rows="7"/>
                <a-button style="margin-top: 1% !important;"
                          @click="request_service(i,'http://'+service_url_list[i],post_data)">提交
                </a-button>
                <a-divider dashed/>
              </div>
            </div>
          </a-col>
        </a-row>

          </a-modal>
      <div>


         <a-modal v-model:visible="create_module_modal_visible" width="60%" title="Basic Modal" @ok="submit_create_module_form"
                   @cancel="clear_form">
            <a-form
                :model="create_module_form"
                name="validate_other"
                v-bind="formItemLayout"
            >
              <a-form-item
                  name="hdfs_path"
                  label="HDFS path"
                  has-feedback
              >
                <a-input v-model:value="create_module_form.config_hdfs_path">
                </a-input>
              </a-form-item>
            </a-form>
          </a-modal>

      <a-button style="margin-right: 2px !important;" @click="make_create_module_modal_visible">Create</a-button>
       <a-popconfirm
              style="margin: auto !important;"
              v-if="module_list.length"
              title="Sure to run?"
              @confirm="run_module()">
            <a-button>Run</a-button>
          </a-popconfirm>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import {defineComponent, reactive, toRefs, ref} from "vue";
import {onMounted} from 'vue';
import axios from "axios";
import {useRouter} from "vue-router"
import {Empty} from 'ant-design-vue';
import {
  CodeOutlined,
  FolderOpenOutlined,
  UploadOutlined,
  ProjectOutlined,
  PlusOutlined,
  MinusCircleOutlined
} from '@ant-design/icons-vue';

// const host = 'http://localhost:8081/'
// const host = 'http://39.105.6.98:43081/'
// const host  = 'http://8.130.105.10:59081/'
const host = 'http://localhost:8081'
const query_all_task_url = host + 'query_all_task'
export default defineComponent({
  components: {
    // BankOutlined,
    // ApartmentOutlined
    CodeOutlined,
    FolderOpenOutlined,
    UploadOutlined,
    ProjectOutlined,
    PlusOutlined,
    MinusCircleOutlined

  },
  setup() {
    const modal_visible = ref(false)
    const router = useRouter()
    const initLoading = ref(true);
    const initLoading1 = ref(true);
    const loading = ref(false);
    const data = ref([]);
    const repo_list = ref([]);
    const current = ref(['code']);
    const tasks = ref([])
    const selected = ref(null)
    const model_list = ref([])
    const fileList = ref([])
    const project_list = ref([])
    const module_list = ref([])
    const service_url_list = ref([])
    const post_data = ref('')
    const response_data_list = ref([])
    const project_checked_list = ref([])
    const running_project_list = ref([])
    const create_project_modal_visible = ref(false)
    const repo_label_value_list = ref([])
    const project_repo_owner = ref('')
    const project_repo_name = ref('')
    const project_repo_branch = ref('')
    const owner_label_value_list = ref([])
    const owner_list = ref([])
    const models_data = ref([])
    const create_model_modal_visible = ref(false)
    const uploading = ref(false)
    const model_name_list = ref([])
    const is_here = ref(true)
    const modules = ref([])
    const module_checked_list = ref([])
    const running_module_list = ref([])
    const create_module_modal_visible = ref(false)

    const columns = [{
      title: 'name',
      dataIndex: 'name',
      width: '30%',
    },{
      title: 'HDFS path',
      dataIndex: 'model_hdfs_path',
    }, {
      title: 'update time',
      dataIndex: 'update_time',
    }, {
      title: 'version',
      dataIndex: 'version',
    },{
      title: 'operation',
      dataIndex: 'operation',
    }
    ];

    const module_columns = [{
      title: 'repository',
      dataIndex: 'repository',
    }, {
      title: 'owner',
      dataIndex: 'owner',
    }, {
      title: 'branch',
      dataIndex: 'branch',
    }, {
      title: 'model',
      dataIndex: 'model',
    }, {
      title: 'model version',
      dataIndex: 'model version',
    },{
      title: 'update time',
      dataIndex: 'update_time',
    },
      {
        title: 'operation',
        dataIndex: 'operation',
      }];

    const project_columns = [{
      title: 'HDFS path',
      dataIndex: 'project_hdfs_path',
    }, {
      title: 'version',
      dataIndex: 'project_version',
    }, {
      title: 'modules',
      dataIndex: 'modules',
    }, {
      title: 'operation',
      dataIndex: 'operation',
    }];


    const change_is_here = function () {
      is_here.value = !is_here.value
    }

    const make_create_project_modal_visible = function () {
      create_project_modal_visible.value = true
      console.log('repo_label_value_list', repo_label_value_list.value)
    }

    const log_files = function () {
      console.log(create_model_form.file_list)
    }

    const modal_after_close = function () {
      console.log('modal_after_close')
      service_url_list.value = []
      post_data.value = ''
      response_data_list.value = []
      running_module_list.value = []

    }

    const query_repo_by_owner = function (owner_name) {
      console.log('query_repo_by_owner')
      let url = host + 'query_repo_by_owner'
      axios.post(url, {
        owner_name: owner_name
      })
          .then(response => {
            form_data.repo_names = response.data.data
          })
          .catch(error => {
            console.error(error);
          })
    }

    const query_branches_by_owner_and_name = function (owner_name, repo_name) {
      console.log('query_branches_by_owner_and_name')
      let url = host + 'query_branches_by_owner_and_name'
      axios.post(url, {
        owner_name: owner_name,
        repo_name: repo_name
      })
          .then(response => {
            let temp = response.data.data['branches']
            for (let i = 1; i < temp.length; i++) {
              form_data.branches.push(temp[i])
            }
          })
          .catch(error => {
            console.error(error);
          })
    }

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
    const onDelete = function (model_name, model_version) {
      let url = host + 'delete_model'
      axios.post(url, {
        model_name: model_name,
        model_version: model_version
      })
          .then(response => {
            model_list.value = model_list.value.filter(item => !(item.model_name === model_name && model_version === item.model_version))
          })
          .catch(error => {
            console.error(error);
          })


    }

    const run_module = function () {
      console.log('run_module')
      let modules = module_list.value
      modal_visible.value=true
      let service_index = 0
      for (let i = 0; i < module_checked_list.value.length; i++) {
        console.log('module_checked_list.value[i]', module_checked_list.value[i])
        if (module_checked_list.value[i] === true) {
          let module = modules[i]
          running_module_list.value.push(module)
          service_url_list.value.push('')
          response_data_list.value.push('')
          load_module_model(i,service_index)
          console.log('module', module)
          service_index++
          // console.log('project.repo_name ',project['repo_name'])
        }
      }
    }

    const run_projects = function () {
      let index = 0
      let projects = project_list.value
      for (let i = 0; i < project_checked_list.value.length; i++) {
        if (project_checked_list.value[i] === true) {
          let project = projects[i]
          running_project_list.value.push(project)
          service_url_list.value.push('')
          response_data_list.value.push('')
          load_model(index, project['repo_name'], project['repo_owner'], project['update_time'], project['branch_name'], project['model_names'], project['model_versions'])
          index += 1
          console.log('project', project)
          // console.log('project.repo_name ',project['repo_name'])
        }
      }
    }

    const get_all_models = function () {
      let url = host + 'query_all_model'
      axios.get(url)
          .then(response => {
            model_list.value = response.data.data
            // for (let key in models) {
            //   console.log('key', key)
            //   console.log('models[key]', models[key])
            //   let children = []
            //   for (let i = 0; i < models[key].length; i++) {
            //     let version = models[key][i]
            //     console.log('-----version------', version)
            //     children.push({'value': version['model_version'], 'label': version['model_version']})
            //   }
            //
            //   model_data.push({'value': key, 'label': key, 'children': children})
            // }

            console.log('model_list', model_list.value)
          })
          .catch(error => {
            console.error(error);
          })
    }

    const add_domain = function () {
      create_project_form.model_list.push('')
      console.log(create_project_form.model_list)
    }

    const remove_domain = function (item) {
      let index = create_project_form.model_list.indexOf(item);
      if (index !== -1) {
        create_project_form.model_list.splice(index, 1);
      }
    }
    const remove_domain2 = function (item) {
      let index = create_model_form.file_list.indexOf(item);
      if (index !== -1) {
        create_model_form.file_list.splice(index, 1);
      }
    }

     const load_module_model = function (index,service_index) {
      console.log('load_module_model')
      let url = host + 'run_module'
      // modal_visible.value = true;
      axios.post(url, {
          module_id : module_list.value[index]['id'],
      }).then(response => {
        if (response.data.msg === 'success') {
          console.log('service url is ', response.data.data)
          service_url_list.value[service_index] = response.data.data
          console.log('service_url_list', service_url_list.value)
        }
        else{
          alert(response.data.data)
          service_url_list.value[service_index] = 'error'
        }
      }).catch(error => {
        console.error(error);
      })
    }

    const load_model = function (index, repo_name, repo_owner, update_time, branch_name, model_names, model_versions) {
      let url = host + 'load_model'
      modal_visible.value = true;
      axios.post(url, {
        repo_name: repo_name,
        repo_owner: repo_owner,
        update_time: update_time,
        branch_name: branch_name,
        model_names: model_names,
        model_versions: model_versions
      }).then(response => {
        console.log('herehrehskdhajkd', response.data.data)
        service_url_list.value[index] = response.data.data
      }).catch(error => {
        console.error(error);
      })
    }

    let create_repo = function () {
      let url = '/api/v1/user/repos'
      axios.post('/api/v1/user/repos', {
        auto_init: true,
        default_branch: "master",
        description: "nothing",
        name: "test_creation4",
        trust_model: "default"
      }, {
        headers: {
          Authorization: "token 1b6ef1abf0564839abe7c484489be8b98965a481",
          accept: 'application/json',
        }
      })
          .then(response => {
            console.log(response.data)
          })
          .catch(error => {
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

    const get_all_project = function () {
      let url = host + 'query_all_project'
      axios.get(url)
          .then(response => {
            project_checked_list.value = []
            project_list.value = response.data.data
            for (let i = 0; i < project_list.value.length; i++) {
              project_checked_list.value.push(false)
            }
            console.log('project_list', project_list.value)
            console.log('project_checked_list', project_checked_list.value)
          })
          .catch(error => {
            console.error(error);
          })
    }

    const request_service = function (index, service_url, data) {
      console.log('service_url', service_url)
      console.log('data', data)
      let url = host + 'request_service'
      axios.post(url, {
        service_url: service_url,
        data: data
      })
          .then(response => {
            console.log('request_service response', response.data.data)
            let response_data = JSON.parse(response.data.data.replace(/'/g, '"'))
            let temp = ''
            for (let key in response_data) {
              let value = response_data[key]
              temp = temp + key + ' : ' + value + ' \n'
            }
            response_data_list.value[index] = temp
          })
          .catch(error => {
            console.error(error);
          })
    }

    let query_repo_by_task_id = function (taskid) {
      let url = host + 'query_repo_by_task_id'
      console.log("update", taskid)
      // router.push({
      //     name:'home',
      //     params:{
      //       task_id:selected
      //     }
      // })

      axios.post(url, {
        task_id: taskid
      })
          .then(response => {
            console.log(response.data)
            data.value = response.data.data;
            repo_list.value = response.data.data;
          })
          .catch(error => {
            console.error();
          })
    }

    let turn_to_repo_detail = function (owner_name, repo_name, update_time) {
      router.push({
        name: 'repo_detail',
        params: {
          owner_name: owner_name,
          repo_name: repo_name,
          update_time: update_time
        }
      })
    }

    let query_all_repo = function () {
      let query_all_repo_url = host + 'query_all_repo'
      fetch(query_all_repo_url).then(res => res.json()).then(res => {
        initLoading.value = false;
        data.value = res.data;
        repo_list.value = res.data;
        console.log(repo_list.value)
      });
    }

    let processing_list_to_selection_data = function (data_list) {
      let selection_data = []
      for (let i = 0; i < data_list.length; i++) {
        selection_data.push({
          'value': data_list[i],
          'label': data_list[i]
        })
      }
      return selection_data
    }

    // let query_all_model = function () {
    //   console.log('query_all_model')
    //   let url = host + 'query_all_model'
    //   axios.get(url)
    //       .then(response => {
    //         initLoading1.value = false;
    //         // console.log('hahah',response.data.data)
    //         for (let key in response.data.data) {
    //           model_name_list.value.push(key)
    //           let v = response.data.data[key]
    //           for (let i = 0; i < v.length; i++) {
    //             // console.log(v[i])
    //             let create_time = Date(v[i]['create_time'])
    //             model_list.value.push({
    //               'model_name': key,
    //               'model_version': v[i]['model_version'],
    //               'create_time': create_time
    //             })
    //           }
    //         }
    //         let model_data = []
    //         let models = response.data.data
    //         for (let key in models) {
    //           console.log('key', key)
    //           console.log('models[key]', models[key])
    //           let children = []
    //           for (let i = 0; i < models[key].length; i++) {
    //             let version = models[key][i]
    //             console.log('-----version------', version)
    //             children.push({'value': version['model_version'], 'label': version['model_version']})
    //           }
    //
    //           model_data.push({'value': key, 'label': key, 'children': children})
    //         }
    //         console.log('model_data', model_data)
    //         models_data.value = model_data
    //
    //
    //         console.log('model_list', model_list.value)
    //       })
    //       .catch(error => {
    //         console.error();
    //       })
    //
    //
    // }
    const query_all_owner = function () {
      let query_all_owner_url = host + 'query_all_owner'
      fetch(query_all_owner_url).then(res => res.json()).then(res => {
        form_data.owner_names = res.data
        console.log('form_data.owner_names', form_data.owner_names)
      });
    }
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const create_project_form = reactive({
      // owner_name: '',
      // repo_name: '',
      // branch_name: '',
      // model_list: ['']
      project_hdfs_path: '',
    });

    const  create_module_form = reactive({
          is_hdfs_path : true,
          config_hdfs_path : '',
        }
    )

    const create_model_form = reactive({
      model_name: '',
      file_list: []
    })

    const form_data = reactive({
      owner_names: [],
      repo_names: [],
      branches: [],
      models: ['']
    });

    const submit_model_form = function () {
      // let url = host+'upload_model'
      //  axios.post(url,{
      //       model_name : create_model_form.model_name,
      //       file_list : create_model_form.file_list
      //   })
      //   .then(response=>{
      //       console.log(response.data)
      //       data.value = response.data.data;
      //       repo_list.value = response.data.data;
      //   })
      //   .catch(error=>{
      //       console.error();
      //   })
      upload_model_dir()

      console.log(create_model_form.file_list)
    }


    const submit_form = function () {
      let url = host + 'create_project'
      console.log('create_project_form', create_project_form)
      axios.post(url, {
        // owner_name: create_project_form.owner_name,
        // repo_name: create_project_form.repo_name,
        // branch_name: create_project_form.branch_name,
        // model_list: create_project_form.model_list
        project_hdfs_path: create_project_form.project_hdfs_path
      })
          .then(response => {
            console.log(response.data.data)
            create_project_modal_visible.value = false
            clear_form()
            if (response.data.data === 'success') {
              get_all_project()
            }

          })
          .catch(error => {
            console.error();
          })
    }
    const submit_create_module_form = function () {
      let url = host + 'create_module'
      console.log('create_module_form', create_module_form)
      axios.post(url, {
        is_hdfs_path: create_module_form.is_hdfs_path,
        config_hdfs_path: create_module_form.config_hdfs_path,
      })
          .then(response => {
            console.log(response.data.data)
            create_module_modal_visible.value = false
            clear_form()
            if (response.data.msg === 'success') {
              alert(response.data.data)
              get_all_module()
            }

          })
          .catch(error => {
            console.error();
          })
      
    }

    const delete_project = function (project_id, index) {
      let url = host + 'delete_project_by_project_id'
      axios.post(url, {
        project_id: project_id
      })
          .then(response => {
            console.log(response.data.data)
            if (response.data.data === 'success') {
              project_list.value.splice(index, 1)
              project_checked_list.value.splice(index, 1)
            }
          })
          .catch(error => {
            console.error();
          })
    }

    const upload_model_dir = function () {
      let form_data = new FormData();
      let url = host + 'upload_model'
      form_data.append('model_name', create_model_form.model_name)
      let files = []
      // for(let i = 0 ; i<create_model_form.file_list.length;i++){
      //   files.push(create_model_form.file_list[i].originFileObj)
      // }
      create_model_form.file_list.forEach(item => {

        //将fileList中每个元素的file添加到formdata对象中
        //formdata对Key值相同的，会自动封装成一个数组
        form_data.append('file_list', item.originFileObj);
        console.log(item.originFileObj)
      })
      // form_data.append('file_list',files)
      console.log('form_data', form_data)
      axios.post(url, form_data)
          .then(response => {
            console.log(response.data.data)
          })
          .catch(error => {
            console.error();
          })
    }

    const clear_form = function () {
      // create_project_form.owner_name = ''
      // create_project_form.repo_name = ''
      // create_project_form.branch_name = ''
      // create_project_form.model_list = ['']
      create_project_form.project_hdfs_path = ''
      create_model_form.model_name = ''
      create_model_form.file_list = []
      is_here.value = true
      create_module_form.config_hdfs_path = ''
      create_module_form.is_hdfs_path=true
    }

    const make_create_model_modal_visible = function () {
      create_model_modal_visible.value = true
    }

    const make_create_module_modal_visible = function (){
      create_module_modal_visible.value = true
    }

    onMounted(() => {
      get_all_project()
      axios.get(query_all_task_url)
          .then(response => {
            console.log(response.data.data)
            tasks.value = response.data.data
            console.log(tasks)
          })
          .catch(error => {
            console.error();
          })
      query_all_repo()
      // query_all_model()
      query_all_owner()
      get_all_module()
      get_all_models()

    });

    const get_all_module = function () {
      let url = host + 'query_all_module'
      axios.get(url)
          .then(response => {
            module_checked_list.value = []
            console.log(response.data.data)
            module_list.value = response.data.data
            console.log(modules)
            for(let i = 0 ; i<module_list.value.length;i++){
              module_checked_list.value.push(false)
            }
          })
          .catch(error => {
            console.error();
          })
    }

    const delete_module_by_id = function (module_id){
      // let url = host + 'delete_project_by_project_id'
      // axios.post(url, {
      //   project_id: project_id
      // })
      //     .then(response => {
      //       console.log(response.data.data)
      //       if (response.data.data === 'success') {
      var url = host + 'delete_module_by_id'
      axios.post(url, {
        module_id: module_id
      })
          .then(response => {
            console.log(response.data.data)
            if (response.data.msg === 'success') {
              get_all_module()
              var index = module_list.value.findIndex(item => item.module_id === module_id)
              module_list.value.splice(index, 1)
              module_checked_list.value.splice(index, 1)
            }
            else{
              alert(response.data.data)
            }
          })
          .catch(error => {
            console.error();
          })
    //         }
    //       })
    //       .catch(error => {
    //         console.error();
    //       })
    // }
    }

    return {
      // 参数
      loading,
      initLoading,
      initLoading1,
      data,
      repo_list,
      tasks,
      selected,
      current,
      model_list,
      columns,
      fileList,
      project_columns,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      project_list,
      modal_visible,
      service_url_list,
      post_data,
      response_data_list,
      project_checked_list,
      running_project_list,
      create_project_modal_visible,
      repo_label_value_list,
      owner_label_value_list,
      owner_list,
      value: ref(undefined),
      formItemLayout,
      create_project_form,
      form_data,
      models_data,
      create_model_modal_visible,
      create_model_form,
      uploading,
      model_name_list,
      is_here,
      module_columns,
      module_list,
      module_checked_list,
      running_module_list,
      create_module_form,
      create_module_modal_visible,
      make_create_module_modal_visible,
      // 方法
      query_repo_by_task_id,
      turn_to_repo_detail,
      // query_all_model,
      onDelete,
      load_model,
      create_repo,
      handleChange,
      get_all_project,
      request_service,
      modal_after_close,
      run_projects,
      make_create_project_modal_visible,
      query_all_owner,
      processing_list_to_selection_data,
      query_repo_by_owner,
      query_branches_by_owner_and_name,
      get_all_models,
      add_domain,
      remove_domain,
      submit_form,
      clear_form,
      delete_project,
      make_create_model_modal_visible,
      submit_model_form,
      upload_model_dir,
      log_files,
      remove_domain2,
      change_is_here,
      get_all_module,
      load_module_model,
      run_module,
      submit_create_module_form,
      delete_module_by_id


    }


  },
});
</script>


<style scoped>
.topbar {
  height: 60px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
}

.layout {
  display: flex;
}

.sidenav {
  min-height: calc(100vh - 60px);
  width: 340px;
  background-color: #f9fafb;
  border-right: 1px solid #eee;
}

.content {
  flex: 1;
  background-color: #fff;
  padding: 20px;
}

.user {
  font-size: 14px;
}

.ant-menu-inline {
  border-right: none;
}

.demo-loadmore-list {
  min-height: 350px;
}

.item {
  width: 70% !important;
  margin-left: 10% !important;
  height: auto !important;
}

.menu {
  width: 100% !important;
}

.top_menu {
  margin-left: 80% !important;
}

.service_result_div {
  /*min-height: 20vh !important;*/
  height: auto !important;
  /*max-height: 40vh !important;*/
}

.service_result {
  height: 40vh !important;
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
<style lang="less">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }

  .ant-modal-body {
    flex: 1;
  }
}
</style>