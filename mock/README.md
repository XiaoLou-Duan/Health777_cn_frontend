# HearthGood 模拟数据（Mock）结构说明

## 目录结构

```
mock/
  ├── index.js                # 入口文件，聚合所有模块
  ├── README.md               # 本文档，说明模拟数据结构
  ├── user.js                 # 用户模块API模拟
  ├── nutrition.js            # 营养模块API模拟
  ├── exercise.js             # 运动模块API模拟
  ├── social.js               # 社交模块API模拟
  ├── medical.js              # 医疗模块API模拟
  ├── utils/                  # 工具函数
  │   └── mock-helper.js      # Mock辅助函数
  └── data/                   # 模拟数据
      ├── user.js             # 用户数据
      ├── nutrition.js        # 营养数据
      ├── exercise/           # 运动数据(拆分)
      │   ├── index.js        # 运动数据入口文件
      │   ├── library.js      # 运动库数据
      │   ├── records.js      # 运动记录数据
      │   ├── stats.js        # 运动统计数据
      │   ├── plans.js        # 运动计划数据
      │   ├── steps.js        # 步数记录数据
      │   └── reminders.js    # 运动提醒数据
      ├── social.js           # 社交数据
      └── medical.js          # 医疗数据
```

## 数据分拆说明

由于运动模块数据量较大，我们将其拆分为多个子文件，以便于维护和管理：

1. **library.js**: 包含运动库数据，存储各种适合老年人的运动项目
2. **records.js**: 包含用户的运动记录数据
3. **stats.js**: 包含运动统计数据（日统计、周统计、月统计）
4. **plans.js**: 包含用户的运动计划数据
5. **steps.js**: 包含用户的步数记录数据
6. **reminders.js**: 包含运动提醒数据
7. **index.js**: 运动数据的入口文件，整合上述所有数据

## API接口规范

所有API响应遵循统一的数据格式：

```javascript
{
  code: 0,           // 0表示成功，非0表示失败
  message: "信息",    // 成功或失败的消息
  data: {}           // 响应数据，失败时为null
}
```

## 分页格式

带分页的数据统一使用以下格式：

```javascript
{
  list: [],          // 数据列表
  pagination: {
    total: 100,      // 总记录数
    page: 1,         // 当前页码
    pageSize: 10,    // 每页记录数
    pages: 10        // 总页数
  }
}
```

## 模拟数据生成规则

模拟数据尽量接近真实数据，特别是:

1. 老年人的健康指标范围
2. 肌少症相关的特定数据
3. 适合老年人的饮食和运动推荐
4. 符合老年人习惯的使用模式和时间安排

## 模拟API调用方式

在开发环境中，模拟API会自动拦截`uni.request`请求，无需额外配置。
在`main.js`中导入并调用：

```javascript
import { startMockService } from './mock';

// 启动模拟数据服务
if (process.env.NODE_ENV === 'development') {
  startMockService();
}
```
