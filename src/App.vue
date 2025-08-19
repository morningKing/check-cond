<template>
  <div id="app">
    <el-container>
      <el-header>
        <h1>动态条件表单</h1>
      </el-header>
      <el-main>
        <DynamicForm />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import DynamicForm from './components/DynamicForm.vue'

export default {
  name: 'App',
  components: {
    DynamicForm
  }
}
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.el-header {
  background-color: #409EFF;
  color: white;
  text-align: center;
  line-height: 60px;
}

.el-header h1 {
  margin: 0;
  font-size: 24px;
}

.el-main {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
}
</style> 