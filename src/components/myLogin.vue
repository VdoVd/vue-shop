<template>
<div class="login_container">
  <div class="login_box">
<!--    head-->
    <div class="avatar_box">
      <img src="../assets/img/head4.jpg">
    </div>
<!--    login-->
    <el-form ref="loginFormRef" :model="loginFrom" :rules="LoginfromRules"   label-width="0px" class="login_form">
      <!-- 用戶名 -->
      <el-form-item prop="username">
        <el-input  v-model="loginFrom.username">
        </el-input>
      </el-form-item>
      <!-- 密碼 -->
      <el-form-item prop="password">
        <el-input v-model="loginFrom.password">
        </el-input>
      </el-form-item>
      <!-- 按鈕 -->
      <el-form-item  class="btns">
        <el-button type="primary">登录</el-button>
        <el-button type="info" @click="resetLoginForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>

</script>

<style scoped  lang="less">
.login_container{
  background-color: #42b983;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  .avatar_box{
    height: 130px;
    width: 130px;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

</style>
