import { createApp } from 'vue';
import { PageHeader ,DatePicker, Button, Menu, Avatar, Table, Spin, Row, Col, Radio, List,Descriptions ,Tabs ,Cascader ,Space ,Tree ,Modal ,Form,Input, Popconfirm,Upload,Empty } from 'ant-design-vue';
import App from './App.vue';
import router from './router';
import './assets/css/base.less';


const app = createApp(App);

app.use(DatePicker)
   .use(Button)
   .use(Menu)
   .use(Table)
   .use(Avatar)
   .use(Spin)
   .use(Row)
   .use(Radio)
   .use(List)
   .use(Col)
   .use(PageHeader)
   .use(Descriptions)
   .use(Tabs)
   .use(Cascader)
   .use(Space)
   .use(Tree)
   .use(Modal)
   .use(Form)
   .use(Input)
   .use(Table)
   .use(Popconfirm)
   .use(Upload)
   .use(Empty)
// app.use(Antd)

app.use(router);


app.mount('#app');
