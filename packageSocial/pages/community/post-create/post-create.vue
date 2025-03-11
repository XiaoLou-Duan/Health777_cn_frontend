<template>
  <view class="post-create-container">
    <u-navbar title="发布帖子" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 表单区域 -->
      <view class="form-section">
        <!-- 分类选择 -->
        <view class="form-item">
          <view class="item-label">分类选择</view>
          <view class="category-list">
            <view 
              class="category-item" 
              v-for="(item, index) in categories" 
              :key="index"
              :class="{ active: selectedCategory === item.id }"
              @click="selectCategory(item.id)"
            >
              {{ item.name }}
            </view>
          </view>
        </view>
        
        <!-- 帖子标题 -->
        <view class="form-item">
          <input 
            class="title-input" 
            placeholder="请输入标题（5-30字）" 
            v-model="postTitle"
            maxlength="30"
            :focus="titleFocus"
          />
        </view>
        
        <!-- 帖子内容 -->
        <view class="form-item">
          <textarea 
            class="content-textarea" 
            placeholder="分享你的健康经验、健身心得或饮食建议..." 
            v-model="postContent"
            maxlength="1000"
            auto-height
          ></textarea>
          <text class="word-count">{{ postContent.length }}/1000</text>
        </view>
        
        <!-- 图片上传 -->
        <view class="form-item">
          <view class="item-label">添加图片</view>
          <view class="image-uploader">
            <view class="upload-list">
              <view class="upload-item" v-for="(img, index) in uploadImages" :key="index">
                <image class="upload-image" :src="img" mode="aspectFill"></image>
                <view class="delete-btn" @click.stop="deleteImage(index)">
                  <u-icon name="close" color="#ffffff" size="20"></u-icon>
                </view>
              </view>
              
              <view class="upload-btn" @click="chooseImage" v-if="uploadImages.length < 9">
                <u-icon name="plus" size="40" color="#dcdcdc"></u-icon>
                <text>{{ uploadImages.length }}/9</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 标签选择 -->
        <view class="form-item">
          <view class="item-label">添加标签（可选）</view>
          <view class="tag-list">
            <view 
              class="tag-item" 
              v-for="(tag, index) in recommendTags" 
              :key="index"
              :class="{ active: selectedTags.includes(tag) }"
              @click="toggleTag(tag)"
            >
              # {{ tag }}
            </view>
            
            <view class="tag-custom" @click="showCustomTagInput">
              <u-icon name="plus" size="24" color="#999"></u-icon>
              <text>自定义</text>
            </view>
          </view>
          
          <!-- 自定义标签输入 -->
          <view class="custom-tag-input" v-if="showCustomTag">
            <input 
              type="text" 
              placeholder="请输入标签（不超过6个字）" 
              v-model="customTag"
              maxlength="6"
              confirm-type="done"
              @confirm="addCustomTag"
            />
            <button class="add-btn" @click="addCustomTag">添加</button>
          </view>
        </view>
        
        <!-- 位置信息 -->
        <view class="form-item">
          <view class="location-switch">
            <text>添加位置</text>
            <u-switch v-model="addLocation" active-color="#5FB878"></u-switch>
          </view>
          <view class="location-info" v-if="addLocation">
            <u-icon name="map" size="32" color="#5FB878"></u-icon>
            <text class="location-text">{{ locationName || '正在获取位置...' }}</text>
            <view class="location-refresh" @click="refreshLocation">
              <u-icon name="reload" size="24" color="#999"></u-icon>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 底部操作栏 -->
      <view class="action-bar">
        <view class="draft-btn" @click="saveDraft">存草稿</view>
        <view 
          class="publish-btn" 
          :class="{ disabled: !canPublish }" 
          @click="publishPost"
        >
          发布
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        { id: 'nutrition', name: '健康饮食' },
        { id: 'exercise', name: '运动健身' },
        { id: 'medical', name: '医疗咨询' },
        { id: 'experience', name: '经验分享' },
        { id: 'question', name: '问答' }
      ],
      selectedCategory: '',
      postTitle: '',
      postContent: '',
      uploadImages: [],
      recommendTags: ['肌少症', '高蛋白', '健身打卡', '康复经验', '饮食建议', '老年健康'],
      selectedTags: [],
      customTag: '',
      showCustomTag: false,
      addLocation: false,
      locationName: '',
      titleFocus: false
    }
  },
  computed: {
    canPublish() {
      return this.selectedCategory && this.postTitle.length >= 5 && this.postContent.length >= 10;
    }
  },
  onLoad() {
    // 获取草稿数据
    this.checkDraft();
    // 聚焦标题输入框
    this.titleFocus = true;
  },
  methods: {
    // 选择分类
    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
    },
    
    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 9 - this.uploadImages.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempPaths = res.tempFilePaths;
          // 模拟压缩和上传过程
          uni.showLoading({
            title: '处理图片中...'
          });
          
          setTimeout(() => {
            this.uploadImages = [...this.uploadImages, ...tempPaths];
            uni.hideLoading();
          }, 500);
        }
      });
    },
    
    // 删除图片
    deleteImage(index) {
      this.uploadImages.splice(index, 1);
    },
    
    // 切换标签选择
    toggleTag(tag) {
      const index = this.selectedTags.indexOf(tag);
      if (index > -1) {
        this.selectedTags.splice(index, 1);
      } else {
        if (this.selectedTags.length < 5) {
          this.selectedTags.push(tag);
        } else {
          uni.showToast({
            title: '最多选择5个标签',
            icon: 'none'
          });
        }
      }
    },
    
    // 显示自定义标签输入
    showCustomTagInput() {
      this.showCustomTag = true;
    },
    
    // 添加自定义标签
    addCustomTag() {
      if (!this.customTag.trim()) {
        return;
      }
      
      if (this.customTag.length > 6) {
        uni.showToast({
          title: '标签不能超过6个字',
          icon: 'none'
        });
        return;
      }
      
      if (this.selectedTags.length >= 5) {
        uni.showToast({
          title: '最多选择5个标签',
          icon: 'none'
        });
        return;
      }
      
      if (this.selectedTags.includes(this.customTag)) {
        uni.showToast({
          title: '标签已存在',
          icon: 'none'
        });
        return;
      }
      
      this.selectedTags.push(this.customTag);
      this.customTag = '';
      this.showCustomTag = false;
    },
    
    // 刷新位置信息
    refreshLocation() {
      this.getLocation();
    },
    
    // 获取位置信息
    getLocation() {
      this.locationName = '正在获取位置...';
      
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          // 使用经纬度获取位置名称
          this.getLocationName(res.latitude, res.longitude);
        },
        fail: () => {
          this.locationName = '无法获取位置';
        }
      });
    },
    
    // 根据经纬度获取位置名称
    getLocationName(latitude, longitude) {
      // 模拟获取位置名称
      setTimeout(() => {
        this.locationName = '北京市海淀区中关村';
      }, 500);
    },
    
    // 保存草稿
    saveDraft() {
      const draftData = {
        selectedCategory: this.selectedCategory,
        postTitle: this.postTitle,
        postContent: this.postContent,
        uploadImages: this.uploadImages,
        selectedTags: this.selectedTags,
        addLocation: this.addLocation,
        locationName: this.locationName,
        draftTime: Date.now()
      };
      
      uni.setStorage({
        key: 'postDraft',
        data: draftData,
        success: () => {
          uni.showToast({
            title: '已保存到草稿箱',
            icon: 'success'
          });
        }
      });
    },
    
    // 检查是否有草稿
    checkDraft() {
      uni.getStorage({
        key: 'postDraft',
        success: (res) => {
          uni.showModal({
            title: '提示',
            content: '检测到未发布的草稿，是否继续编辑？',
            success: (result) => {
              if (result.confirm) {
                const draft = res.data;
                this.selectedCategory = draft.selectedCategory;
                this.postTitle = draft.postTitle;
                this.postContent = draft.postContent;
                this.uploadImages = draft.uploadImages || [];
                this.selectedTags = draft.selectedTags || [];
                this.addLocation = draft.addLocation;
                this.locationName = draft.locationName;
              } else {
                uni.removeStorage({
                  key: 'postDraft'
                });
              }
            }
          });
        }
      });
    },
    
    // 发布帖子
    publishPost() {
      if (!this.canPublish) {
        if (!this.selectedCategory) {
          uni.showToast({
            title: '请选择分类',
            icon: 'none'
          });
        } else if (this.postTitle.length < 5) {
          uni.showToast({
            title: '标题至少5个字',
            icon: 'none'
          });
        } else if (this.postContent.length < 10) {
          uni.showToast({
            title: '内容至少10个字',
            icon: 'none'
          });
        }
        return;
      }
      
      uni.showLoading({
        title: '发布中...'
      });
      
      // 构建发布数据
      const postData = {
        category: this.selectedCategory,
        title: this.postTitle,
        content: this.postContent,
        tags: this.selectedTags,
        images: this.uploadImages,
        location: this.addLocation ? this.locationName : ''
      };
      
      uni.request({
        url: '/api/social/posts',
        method: 'POST',
        data: postData,
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            // 发布成功，清除草稿
            uni.removeStorage({
              key: 'postDraft'
            });
            
            uni.showToast({
              title: '发布成功',
              icon: 'success'
            });
            
            // 延迟返回，让用户看到成功提示
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          } else {
            uni.showToast({
              title: res.data.message || '发布失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.hideLoading();
          
          // 模拟发布成功
          setTimeout(() => {
            // 清除草稿
            uni.removeStorage({
              key: 'postDraft'
            });
            
            uni.showToast({
              title: '发布成功',
              icon: 'success'
            });
            
            // 延迟返回，让用户看到成功提示
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }, 500);
        }
      });
    }
  }
}
</script>

<style>
@import './post-create.scss';
</style>
