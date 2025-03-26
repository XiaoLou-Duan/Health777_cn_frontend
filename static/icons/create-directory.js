// 这是一个辅助脚本，用于创建icons目录
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'static', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('创建图标目录成功');
} else {
  console.log('图标目录已存在');
}
