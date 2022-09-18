<template>
<div class="login_container">
  <div class="login_box">
<!--    head-->
    <div class="avatar_box">
      <img src="../assets/img/head4.jpg">
    </div>
<!--    login-->
    <el-form ref="loginFormRef" label-width="0px" :rules="loginRules" :model="loginForm" class="login_form">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" prefix-icon="iconfont el-icon-user">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont el-icon-lock">
        </el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" @click="login">login</el-button>
        <el-button type="info" @click="resetLoginForm">reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'zsf',
        password: '123456'
      },

      loginRules: {
        username: [
          { required: true, message: '请输入登陆名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        console.log('log success')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped  lang="less">
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
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
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
