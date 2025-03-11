<template>
  <view class="food-image-capture">
    <view class="capture-area">
      <image 
        v-if="previewImage" 
        class="preview-image" 
        :src="previewImage" 
        mode="aspectFill"
      ></image>
      <view v-else class="empty-preview">
        <u-icon name="camera-fill" size="80" color="#cccccc"></u-icon>
        <text class="hint-text">点击拍摄或上传食物图片</text>
      </view>
    </view>
    
    <view class="action-buttons">
      <u-button 
        type="primary" 
        icon="camera" 
        @click="takePhoto"
      >拍照</u-button>
      <u-button 
        type="info" 
        icon="album" 
        @click="chooseFromAlbum"
      >相册</u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      previewImage: ''
    }
  },
  methods: {
    // 拍照
    takePhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          this.handleImageSelected(res.tempFilePaths[0]);
        }
      });
    },
    
    // 从相册选择
    chooseFromAlbum() {
      uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: (res) => {
          this.handleImageSelected(res.tempFilePaths[0]);
        }
      });
    },
    
    // 处理选择的图片
    handleImageSelected(imagePath) {
      this.previewImage = imagePath;
      
      // 转为base64或直接使用文件路径
      // 这里简化处理，实际应用可能需要图片压缩和转换
      this.$emit('capture-success', imagePath);
    }
  }
}
</script>

<style lang="scss">
@import "./food-image-capture.scss";
</style>
