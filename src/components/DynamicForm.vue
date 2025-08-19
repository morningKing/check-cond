<template>
  <div class="dynamic-form">
    <div class="form-header">
      <h2>条件表单配置</h2>
      <el-button type="primary" @click="addCondition" :icon="Plus">
        添加条件
      </el-button>
    </div>

    <div class="conditions-container">
      <div 
        v-for="(condition, index) in conditions" 
        :key="condition.id" 
        class="condition-form"
      >
        <div class="condition-header">
          <h3>{{ condition.title }}</h3>
          <el-button 
            type="danger" 
            size="small" 
            @click="removeCondition(index)"
            :icon="Delete"
            :disabled="conditions.length === 1"
          >
            删除
          </el-button>
        </div>

        <el-form 
          :model="condition" 
          label-width="120px" 
          class="condition-form-content"
        >
          <!-- 参数类型和参数输入 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="参数类型">
                <el-select 
                  v-model="condition.paramType" 
                  placeholder="请选择参数类型"
                  style="width: 100%"
                >
                  <el-option
                    v-for="option in formOptions.paramTypes"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参数值">
                <el-input 
                  v-model="condition.paramValue" 
                  placeholder="请输入参数值"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 设备类型 -->
          <el-form-item label="设备类型">
            <el-select
              v-model="condition.deviceTypes"
              multiple
              placeholder="请选择设备类型"
              style="width: 100%"
            >
              <el-option
                v-for="option in formOptions.deviceTypes"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>

          <!-- 设备版本 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="版本识别方式">
                <el-select 
                  v-model="condition.versionMatchType" 
                  placeholder="请选择版本识别方式"
                  style="width: 100%"
                  @change="handleVersionMatchTypeChange(index)"
                >
                  <el-option
                    v-for="option in formOptions.versionMatchTypes"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 弱匹配：文本输入框 -->
              <el-form-item 
                v-if="condition.versionMatchType === 'weak'" 
                label="版本值"
              >
                <el-input 
                  v-model="condition.versionValue" 
                  placeholder="请输入版本值"
                />
              </el-form-item>
              
              <!-- 全匹配：复选下拉框 -->
              <el-form-item 
                v-else-if="condition.versionMatchType === 'exact'" 
                label="版本选择"
              >
                <el-select
                  v-model="condition.versionValues"
                  multiple
                  placeholder="请选择版本"
                  style="width: 100%"
                >
                  <el-option
                    v-for="option in formOptions.versionOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
              
              <!-- 范围：两个输入框 -->
              <el-form-item 
                v-else-if="condition.versionMatchType === 'range'" 
                label="版本范围"
              >
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-input 
                      v-model="condition.versionStart" 
                      placeholder="开始版本"
                    />
                  </el-col>
                  <el-col :span="12">
                    <el-input 
                      v-model="condition.versionEnd" 
                      placeholder="结束版本"
                    />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 单板类型 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="单板识别方式">
                <el-select 
                  v-model="condition.boardMatchType" 
                  placeholder="请选择单板识别方式"
                  style="width: 100%"
                  @change="handleBoardMatchTypeChange(index)"
                >
                  <el-option
                    v-for="option in formOptions.boardMatchTypes"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单板类型">
                <el-select
                  v-model="condition.boardTypes"
                  multiple
                  placeholder="请选择单板类型"
                  style="width: 100%"
                >
                  <el-option
                    v-for="option in getBoardOptionsByType(condition.boardMatchType)"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="form-actions">
      <el-button type="primary" @click="submitForm" size="large">
        提交表单
      </el-button>
      <el-button @click="resetForm" size="large">
        重置表单
      </el-button>
    </div>

    <!-- 表单数据预览 -->
    <div class="form-preview" v-if="showPreview">
      <h3>表单数据预览</h3>
      <pre>{{ JSON.stringify(conditions, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { formOptions, getBoardOptionsByType } from '../config/formOptions.js'
import { ElMessage } from 'element-plus'

export default {
  name: 'DynamicForm',
  components: {
    Plus,
    Delete
  },
  setup() {
    const conditions = ref([])
    const showPreview = ref(false)

    // 创建新的条件表单
    const createCondition = (index) => {
      return {
        id: Date.now() + index,
        title: `条件${index + 1}`,
        paramType: '',
        paramValue: '',
        deviceTypes: [],
        versionMatchType: '',
        versionValue: '',
        versionValues: [],
        versionStart: '',
        versionEnd: '',
        boardMatchType: '',
        boardTypes: []
      }
    }

    // 添加条件
    const addCondition = () => {
      const newIndex = conditions.value.length
      conditions.value.push(createCondition(newIndex))
    }

    // 删除条件
    const removeCondition = (index) => {
      if (conditions.value.length > 1) {
        conditions.value.splice(index, 1)
        // 重新生成标题
        conditions.value.forEach((condition, idx) => {
          condition.title = `条件${idx + 1}`
        })
      }
    }

    // 处理版本识别方式变化
    const handleVersionMatchTypeChange = (index) => {
      const condition = conditions.value[index]
      // 清空之前的版本相关值
      condition.versionValue = ''
      condition.versionValues = []
      condition.versionStart = ''
      condition.versionEnd = ''
    }

    // 处理单板识别方式变化
    const handleBoardMatchTypeChange = (index) => {
      const condition = conditions.value[index]
      // 清空之前的单板类型选择
      condition.boardTypes = []
    }

    // 提交表单
    const submitForm = () => {
      // 验证表单
      let isValid = true
      const errors = []

      conditions.value.forEach((condition, index) => {
        if (!condition.paramType) {
          errors.push(`条件${index + 1}: 请选择参数类型`)
          isValid = false
        }
        if (!condition.paramValue) {
          errors.push(`条件${index + 1}: 请输入参数值`)
          isValid = false
        }
        if (condition.deviceTypes.length === 0) {
          errors.push(`条件${index + 1}: 请选择设备类型`)
          isValid = false
        }
        if (!condition.versionMatchType) {
          errors.push(`条件${index + 1}: 请选择版本识别方式`)
          isValid = false
        }
        if (!condition.boardMatchType) {
          errors.push(`条件${index + 1}: 请选择单板识别方式`)
          isValid = false
        }
        if (condition.boardTypes.length === 0) {
          errors.push(`条件${index + 1}: 请选择单板类型`)
          isValid = false
        }
      })

      if (!isValid) {
        ElMessage.error(errors.join('\n'))
        return
      }

      ElMessage.success('表单提交成功！')
      showPreview.value = true
      console.log('表单数据:', conditions.value)
    }

    // 重置表单
    const resetForm = () => {
      conditions.value = [createCondition(0)]
      showPreview.value = false
      ElMessage.info('表单已重置')
    }

    // 初始化第一个条件
    addCondition()

    return {
      conditions,
      showPreview,
      formOptions,
      getBoardOptionsByType,
      addCondition,
      removeCondition,
      handleVersionMatchTypeChange,
      handleBoardMatchTypeChange,
      submitForm,
      resetForm
    }
  }
}
</script>

<style scoped>
.dynamic-form {
  max-width: 1200px;
  margin: 0 auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.form-header h2 {
  margin: 0;
  color: #303133;
}

.conditions-container {
  margin-bottom: 20px;
}

.condition-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.condition-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.condition-header h3 {
  margin: 0;
  color: #409EFF;
  font-size: 16px;
}

.condition-form-content {
  padding: 20px;
}

.form-actions {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form-actions .el-button {
  margin: 0 10px;
}

.form-preview {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.form-preview h3 {
  margin-top: 0;
  color: #303133;
}

.form-preview pre {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-row {
  margin-bottom: 0;
}
</style> 