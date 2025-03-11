// 这个脚本需要安装 sharp 包: npm install sharp

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconFiles = [
  'home', 'home-active',
  'nutrition', 'nutrition-active',
  'exercise', 'exercise-active',
  'medical', 'medical-active',
  'community', 'community-active'
];

async function convertSvgToPng() {
  for (const file of iconFiles) {
    const svgPath = path.join(__dirname, `${file}.svg`);
    const pngPath = path.join(__dirname, `${file}.png`);
    
    if (fs.existsSync(svgPath)) {
      try {
        await sharp(svgPath)
          .resize(48, 48)  // 设置大小，可以根据需要调整
          .png()
          .toFile(pngPath);
        console.log(`转换成功: ${file}.svg → ${file}.png`);
      } catch (error) {
        console.error(`转换失败 ${file}.svg:`, error);
      }
    } else {
      console.error(`文件不存在: ${svgPath}`);
    }
  }
}

convertSvgToPng();
