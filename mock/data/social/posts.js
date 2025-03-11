/**
 * mock/data/social/posts.js - 社区帖子数据
 * 
 * 包含社区帖子和话题数据
 */

import { generateRandomId } from '../../utils/mock-helper';

// 话题分类
const topics = [
  {
    id: 'topic001',
    name: '饮食分享',
    description: '分享健康饮食心得和食谱',
    icon: '/static/icons/topics/diet.png',
    color: '#4CAF50',
    order: 1
  },
  {
    id: 'topic002',
    name: '锻炼建议',
    description: '分享适合老年人的锻炼方法',
    icon: '/static/icons/topics/exercise.png',
    color: '#2196F3',
    order: 2
  },
  {
    id: 'topic003',
    name: '健康生活',
    description: '日常保健与生活方式',
    icon: '/static/icons/topics/health.png',
    color: '#FF9800',
    order: 3
  },
  {
    id: 'topic004',
    name: '症状讨论',
    description: '肌少症相关症状与应对',
    icon: '/static/icons/topics/symptoms.png',
    color: '#9C27B0',
    order: 4
  },
  {
    id: 'topic005',
    name: '康复历程',
    description: '分享个人康复历程和进步',
    icon: '/static/icons/topics/recovery.png',
    color: '#F44336',
    order: 5
  }
];

// 帖子列表
const posts = [
  {
    id: generateRandomId(),
    userId: '1001',
    topicId: 'topic001',
    title: '每天两杯牛奶对肌肉恢复的帮助',
    content: '自从医生建议我每天喝两杯牛奶后，我感觉肌肉力量明显改善。牛奶中的蛋白质帮助我在锻炼后恢复更快，大家可以试试这个简单的方法！',
    images: [
      '/static/images/posts/milk1.jpg',
      '/static/images/posts/milk2.jpg'
    ],
    viewCount: 156,
    likeCount: 23,
    commentCount: 8,
    createTime: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    updateTime: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    isTop: false,
    isRecommend: true,
    status: 'published'
  },
  {
    id: generateRandomId(),
    userId: '1002',
    topicId: 'topic002',
    title: '椅子坐立运动对腿部力量的改善',
    content: '我想分享一个简单但有效的锻炼方法：椅子坐立运动。每天坚持做三组，每组10次，慢慢地站起来再坐下。这个动作非常适合我们这些腿部肌肉衰弱的老年人，做了一个月后我上楼明显不那么吃力了！',
    images: [
      '/static/images/posts/chair-exercise.jpg'
    ],
    viewCount: 187,
    likeCount: 31,
    commentCount: 12,
    createTime: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    updateTime: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    isTop: true,
    isRecommend: true,
    status: 'published'
  },
  {
    id: generateRandomId(),
    userId: '1003',
    topicId: 'topic003',
    title: '老年人补充维生素D的重要性',
    content: '最近去医院检查，医生说我的维生素D严重不足，这可能是导致我肌肉无力的原因之一。医生建议我每天晒太阳15-20分钟，并适当补充维生素D。现在坚持了一个月，感觉精神好多了，肌肉也不那么容易疲劳。',
    images: [],
    viewCount: 124,
    likeCount: 18,
    commentCount: 6,
    createTime: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    updateTime: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    isTop: false,
    isRecommend: false,
    status: 'published'
  },
  {
    id: generateRandomId(),
    userId: '1001',
    topicId: 'topic004',
    title: '爬楼梯困难怎么办？',
    content: '最近爬楼梯越来越吃力，膝盖也疼，请问大家有什么好的应对方法吗？医生说可能是肌少症导致的腿部力量下降，但我不知道怎么改善这个问题。',
    images: [],
    viewCount: 98,
    likeCount: 12,
    commentCount: 7,
    createTime: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(),
    updateTime: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(),
    isTop: false,
    isRecommend: false,
    status: 'published'
  },
  {
    id: generateRandomId(),
    userId: '1004',
    topicId: 'topic005',
    title: '肌少症康复三个月的变化',
    content: '三个月前被诊断出肌少症，在医生的指导下开始调整饮食和进行适当锻炼。现在每天能散步30分钟了，上下楼也比以前轻松。饮食上增加了鸡蛋、瘦肉和牛奶的摄入，体重也增加了2公斤。感谢这个平台上大家的建议和鼓励！',
    images: [
      '/static/images/posts/recovery1.jpg',
      '/static/images/posts/recovery2.jpg',
      '/static/images/posts/recovery3.jpg'
    ],
    viewCount: 215,
    likeCount: 42,
    commentCount: 16,
    createTime: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    updateTime: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    isTop: false,
    isRecommend: true,
    status: 'published'
  },
  {
    id: generateRandomId(),
    userId: '1002',
    topicId: 'topic001',
    title: '简单易做的高蛋白早餐分享',
    content: '分享一个我每天早上的高蛋白早餐：两个煮鸡蛋+一杯牛奶+一片全麦面包。准备时间不超过10分钟，但能提供足够的蛋白质和能量。大家还有什么简单又营养的早餐推荐吗？',
    images: [
      '/static/images/posts/breakfast.jpg'
    ],
    viewCount: 167,
    likeCount: 28,
    commentCount: 11,
    createTime: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(),
    updateTime: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(),
    isTop: false,
    isRecommend: true,
    status: 'published'
  }
];

// 用户点赞记录
const userLikes = [
  {
    id: generateRandomId(),
    userId: '1001',
    postId: posts[1].id,
    createTime: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    postId: posts[4].id,
    createTime: new Date(new Date().setDate(new Date().getDate() - 18)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1002',
    postId: posts[0].id,
    createTime: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1002',
    postId: posts[4].id,
    createTime: new Date(new Date().setDate(new Date().getDate() - 19)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1003',
    postId: posts[0].id,
    createTime: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1003',
    postId: posts[1].id,
    createTime: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString()
  }
];

export default {
  topics,
  posts,
  userLikes
};
