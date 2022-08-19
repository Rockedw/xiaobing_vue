<template>
  <div>
    <div class="topbar">
      <!-- <div class="user">
        Hi, Impr
      </div> -->
    </div>
    <div class="layout">
      <div class="sidenav">    
        <sidenav></sidenav>
      </div>
      <div class="content">
        <router-view :key ="$route.path"></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import sidenav from '@/components/SideNav';
import { defineComponent} from 'vue';
// import router from '@/router'
export default defineComponent({
  components: {
    sidenav,
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
</style>