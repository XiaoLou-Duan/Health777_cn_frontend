<template>
  <view class="popup-container">
    <u-popup v-model="show" mode="center" border-radius="12" width="650rpx">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">添加使用记录</text>
          <u-icon name="close" color="#999" size="28" @click="closePopup"></u-icon>
        </view>
        
        <view class="form-content">
          <u-form :model="formData" ref="uForm" label-position="left" label-width="160">
            <u-form-item label="使用时间" prop="time" required>
              <u-datetime-picker
                v-model="formData.time"
                mode="datetime"
                :max-date="new Date().getTime()"
              ></u-datetime-picker>
            </u-form-item>
            
            <u-form-item label="乳清蛋白品牌" prop="brand" required>
              <u-input v-model="formData.brand" placeholder="请输入品牌名称" />
            </u-form-item>
            
            <u-form-item label="口味" prop="flavor" required>
              <u-input v-model="formData.flavor" placeholder="请输入口味" />
            </u-form-item>
            
            <u-form-item label="使用量(克)" prop="amount" required>
              <u-number-box v-model="formData.amount" min="0" step="5"></u-number-box>
            </u-form-item>
            
            <u-form-item label="备注" prop="note">
              <u-input v-model="formData.note" placeholder="可选" />
            </u-form-item>
          </u-form>
        </view>
        
        <view class="popup-footer">
          <u-button @click="closePopup">取消</u-button>
          <u-button type="primary" @click="submitForm">确认</u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      formData: {
        time: new Date().getTime(),
        brand: '',
        flavor: '',
        amount: 30,
        note: ''
      },
      rules: {
        brand: [
          { required: true, message: '请输入乳清蛋白品牌', trigger: 'blur' }
        ],
        flavor: [
          { required: true, message: '请输入口味', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入使用量', trigger: 'change' },
          { type: 'number', min: 1, message: '使用量必须大于0', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.$refs.uForm.setRules(this.rules);
  },
  methods: {
    closePopup() {
      this.$emit('close');
    },
    submitForm() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          this.$emit('submit', this.formData);
        }
      });
    }
  }
}
</script>

<style lang="scss">
.popup-container {
  .popup-content {
    padding: 30rpx;
    
    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;
      
      .popup-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
    }
    
    .form-content {
      margin-bottom: 30rpx;
    }
    
    .popup-footer {
      display: flex;
      justify-content: space-between;
      
      .u-button {
        margin: 0 20rpx;
        flex: 1;
      }
    }
  }
}
</style>
