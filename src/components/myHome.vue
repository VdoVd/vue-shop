<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/img/head4.jpg" alt="logo"/>
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">logout</el-button></el-header>
    <el-container>
      <el-aside :width = "isCollapse ? '64px': '200px'" >
        <div class="toggle-button" @click="toggleCollapse">|||</div>
            <el-menu
              :collapse="isCollapse"
              unique-opened
              :collapse-transition="false"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-submenu :index="item.id+''" v-for = "item in menulist" :key = "item.id" >
                <template slot="title">
                  <i :class="iconsObj[item.id]"></i>
                  <span>{{item.authName}}</span>
                </template>
                <el-submenu :index = "subItem.id+''" v-for = "subItem in item.children" :key = "subItem.id">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{subItem.authName}}</span>
                  </template>
                </el-submenu>
              </el-submenu>
            </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      iconsObj: {
        '125': 'iconfont el-icon-user-solid',
        '103': 'iconfont el-icon-s-grid',
        '101': 'iconfont el-icon-s-goods',
        '102': 'iconfont el-icon-s-order',
        '145': 'iconfont el-icon-date'
      },
      isCollapse: true
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    async getMenuList () {
      const {data: res} = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    }
  }
}
</script>

<style scoped lang="less">
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.home-container{
  height: 100%;
}
.el-container{
  height: 100%;
}
.iconfont{
  margin-right: 10px;
}
.el-header{
  background-color:black;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 20px;
  >div{
    display: flex;
    align-items: center;
    span{
      margin-left: 10px;
    }
  }
  img{
    height: 50px;
    width: 50px;
    border-radius: 50%;
  }
}
.el-aside{
  background-color: #373d44;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #dddddd;
}
</style>
