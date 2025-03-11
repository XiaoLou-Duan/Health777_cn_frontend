<template>
  <view class="protein-record">
    <view class="record-header">
      <text class="record-title">使用记录</text>
      <u-button 
        type="primary" 
        size="mini" 
        @click="$emit('add-record')"
      >添加记录</u-button>
    </view>
    
    <view class="record-list">
      <view class="record-item" v-for="(item, index) in recordList" :key="index">
        <view class="record-info">
          <text class="record-time">{{ formatTime(item.time) }}</text>
          <text class="record-amount">{{ item.amount }}克</text>
        </view>
        <view class="record-detail">
          <text class="record-brand">品牌: {{ item.brand }}</text>
          <text class="record-flavor">口味: {{ item.flavor }}</text>
          <text class="record-note" v-if="item.note">备注: {{ item.note }}</text>
        </view>
      </view>
      
      <view class="empty-record" v-if="!recordList || recordList.length === 0">
        <u-empty mode="data" text="暂无记录" marginTop="20"></u-empty>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    recordList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatTime(timestamp) {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
  }
}
</script>

<style lang="scss">
@import "./protein-record.scss";
</style>
