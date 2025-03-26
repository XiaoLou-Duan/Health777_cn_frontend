/**
 * theme.js - 主题配置
 */

// 默认主题
export const DEFAULT_THEME = {
  // 主色调
  primary: '#5677fc',
  primaryLight: '#e7edff',
  primaryDark: '#3a5cdd',
  
  // 辅助色
  secondary: '#9c27b0',
  secondaryLight: '#f4e2f9',
  secondaryDark: '#7b1fa2',
  
  // 功能色
  success: '#07c160',
  warning: '#ff9800',
  error: '#f56c6c',
  info: '#909399',
  
  // 中性色
  textPrimary: '#303133',
  textRegular: '#606266',
  textSecondary: '#909399',
  textPlaceholder: '#c0c4cc',
  
  // 背景色
  background: '#f5f5f5',
  cardBackground: '#ffffff',
  
  // 边框色
  border: '#ebeef5',
  divider: '#f0f0f0',
  
  // 阴影
  shadow: '0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1)',
  
  // 字体大小
  fontSizeLarge: '36rpx',
  fontSizeNormal: '28rpx',
  fontSizeSmall: '24rpx',
  fontSizeMini: '20rpx',
  
  // 圆角
  borderRadius: '12rpx',
  borderRadiusLarge: '24rpx',
  borderRadiusSmall: '6rpx',
  
  // 间距
  spacingLarge: '30rpx',
  spacingNormal: '20rpx',
  spacingSmall: '10rpx',
  spacingMini: '5rpx',
  
  // 动画时间
  transitionTime: '0.3s'
};

// 高对比度主题（适合老年人）
export const HIGH_CONTRAST_THEME = {
  // 主色调（加深以提高对比度）
  primary: '#2b54e8',
  primaryLight: '#d6e0ff',
  primaryDark: '#1e3cb3',
  
  // 辅助色
  secondary: '#7b1fa2',
  secondaryLight: '#ecd8f0',
  secondaryDark: '#4a0072',
  
  // 功能色
  success: '#007f45',
  warning: '#c66a00',
  error: '#d42f2f',
  info: '#505458',
  
  // 中性色
  textPrimary: '#000000',
  textRegular: '#222222',
  textSecondary: '#444444',
  textPlaceholder: '#666666',
  
  // 背景色
  background: '#f8f8f8',
  cardBackground: '#ffffff',
  
  // 边框色
  border: '#bbbbbb',
  divider: '#dddddd',
  
  // 阴影
  shadow: '0 2rpx 12rpx 0 rgba(0, 0, 0, 0.2)',
  
  // 字体大小（增大以适应老年人）
  fontSizeLarge: '42rpx',
  fontSizeNormal: '34rpx',
  fontSizeSmall: '28rpx',
  fontSizeMini: '24rpx',
  
  // 圆角
  borderRadius: '12rpx',
  borderRadiusLarge: '24rpx',
  borderRadiusSmall: '6rpx',
  
  // 间距（增大以提高可点击性）
  spacingLarge: '36rpx',
  spacingNormal: '26rpx',
  spacingSmall: '16rpx',
  spacingMini: '8rpx',
  
  // 动画时间（老年人适用的较慢动画）
  transitionTime: '0.5s'
};

// 暗色主题
export const DARK_THEME = {
  // 主色调
  primary: '#5677fc',
  primaryLight: '#2b3c73',
  primaryDark: '#3a5cdd',
  
  // 辅助色
  secondary: '#9c27b0',
  secondaryLight: '#4a1452',
  secondaryDark: '#7b1fa2',
  
  // 功能色
  success: '#07c160',
  warning: '#ff9800',
  error: '#f56c6c',
  info: '#909399',
  
  // 中性色
  textPrimary: '#ffffff',
  textRegular: '#e0e0e0',
  textSecondary: '#b0b0b0',
  textPlaceholder: '#808080',
  
  // 背景色
  background: '#121212',
  cardBackground: '#1e1e1e',
  
  // 边框色
  border: '#303030',
  divider: '#383838',
  
  // 阴影
  shadow: '0 2rpx 12rpx 0 rgba(0, 0, 0, 0.4)',
  
  // 字体大小
  fontSizeLarge: '36rpx',
  fontSizeNormal: '28rpx',
  fontSizeSmall: '24rpx',
  fontSizeMini: '20rpx',
  
  // 圆角
  borderRadius: '12rpx',
  borderRadiusLarge: '24rpx',
  borderRadiusSmall: '6rpx',
  
  // 间距
  spacingLarge: '30rpx',
  spacingNormal: '20rpx',
  spacingSmall: '10rpx',
  spacingMini: '5rpx',
  
  // 动画时间
  transitionTime: '0.3s'
};

// 获取当前主题
export function getCurrentTheme(themeType = 'default') {
  switch (themeType) {
    case 'high-contrast':
      return HIGH_CONTRAST_THEME;
    case 'dark':
      return DARK_THEME;
    case 'default':
    default:
      return DEFAULT_THEME;
  }
}

// 将主题转换为CSS变量
export function themeToVars(theme) {
  return Object.entries(theme).reduce((acc, [key, value]) => {
    acc[`--${key}`] = value;
    return acc;
  }, {});
}

export default {
  DEFAULT_THEME,
  HIGH_CONTRAST_THEME,
  DARK_THEME,
  getCurrentTheme,
  themeToVars
};
