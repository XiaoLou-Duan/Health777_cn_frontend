/**
 * mock/data/social/comments.js - 社区评论数据
 * 
 * 包含帖子评论数据
 */

import { generateRandomId } from '../../utils/mock-helper';

// 导入帖子数据以引用帖子ID
import posts from './posts';

// 获取所有帖子ID
const postIds = posts.posts.map(post => post.id);

// 评论列表
const comments = [
  {
    id: generateRandomId(),
    postId: postIds[0], // 对应第一篇帖子
    userId: '1002',
    content: '感谢分享！我也一直坚持每天喝牛奶，确实对增强体力有帮助。',
    createTime: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    likeCount: 3,
    replyTo: null,
    status: 'published'
  },
  {
    id: generateRandomId(),
    postId: postIds[0],
    userId: '1003',
    content: '请问是什么牌子的牛奶？全脂还是脱脂的比较好？',
    createTime: new Date(new Date().setDate(new Date().getDate() - 4.8)).toISOString(),
    likeCount: 1,
    replyTo: null,
    status: 'published'
  },
  {
    id: generateRandomId(),
    postId: postIds[0],
    userId: '1001', // 原帖作者
    content: '我喝的是普通全脂牛奶，据说全脂牛奶的营养更丰富，但如果有高血脂可能需要选择脱脂的。',
    createTime: new Date(new Date().setDate(new Date().getDate() - 4.7)).toISOString(),
    likeCount: 4,
    replyTo: '1003', // 回复第二条评论的用户
    status: 'published'
  },
  {
    id: generateRandomId(),
    postId: postIds[1], // 对应第二篇帖子
    userId: '1001',
    content: '这个椅子坐立运动我也在做，确实很有效，特别适合我们这些腿脚不太方便的老年人。',
    createTime: new Date(new Date().setDate(new Date().getDate() - 6.5)).toISOString(),
    likeCount: 5,
    replyTo: null,
    status: 'published'
  },
  {
    id: generateRandomId(),
    postId: postIds[1],
    userId: '1004',
    content: '请问做这个运动膝盖疼的话可以坚持吗？',
    createTime: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(),
    likeCount: 2,
    replyTo: null,
    status: 'published'
  },
  {
    id: generateRandomId(),
    postId: postIds[1],
    userId: '1002', // 原帖作者
    content: '如果膝盖疼痛建议先咨询医生，可能需要调整动作或者选择其他更适合的运动。安全第一！',
    createTime: new Date(new Date().setDate(new Date().getDate() - 5.9)).toISOString(),
    likeCount: 7,
    replyTo: '1004', // 回复第二条评论的用户
    status: 'published'
  },
  {
    id: generateRandomId(),
    postId: postIds[3], // 对应"爬楼梯困难怎么办？"帖子
    userId: '1002',
    content: '我也有这个问题，后来每天坚持做椅子坐立运动，慢慢就改善了。可以看看我发的那篇帖子，有详细介绍。',
    createTime: new Date(new Date().setDate(new Date().getDate() - 13.5)).toISOString(),
    likeCount: 4,
    replyTo: null,
    status: 'published'
  },
  {
    id: generateRandomId(),
    postId: postIds[3],
    userId: '1005',
    content: '建议使用扶手或拐杖辅助，同时做一些简单的腿部力量训练，饮食上增加蛋白质摄入。',
    createTime: new Date(new Date().setDate(new Date().getDate() - 12.8)).toISOString(),
    likeCount: 3,
    replyTo: null,
    status: 'published'
  },
  {
    id: generateRandomId(),
    postId: postIds[4], // 对应"肌少症康复三个月的变化"帖子
    userId: '1001',
    content: '非常鼓舞人心的经历！请问你每天的具体锻炼计划是什么样的？',
    createTime: new Date(new Date().setDate(new Date().getDate() - 19.5)).toISOString(),
    likeCount: 2,
    replyTo: null,
    status: 'published'
  },
  {
    id: generateRandomId(),
    postId: postIds[4],
    userId: '1004', // 原帖作者
    content: '我的锻炼计划很简单：早上做10分钟椅子操，中午散步15分钟，晚上再散步15分钟。关键是坚持，不求强度高，但求每天都做。',
    createTime: new Date(new Date().setDate(new Date().getDate() - 19.2)).toISOString(),
    likeCount: 5,
    replyTo: '1001', // 回复上一条评论的用户
    status: 'published'
  }
];

// 评论点赞记录
const commentLikes = [
  {
    id: generateRandomId(),
    userId: '1001',
    commentId: comments[3].id,
    createTime: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    commentId: comments[5].id,
    createTime: new Date(new Date().setDate(new Date().getDate() - 5.5)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1002',
    commentId: comments[2].id,
    createTime: new Date(new Date().setDate(new Date().getDate() - 4.5)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1003',
    commentId: comments[2].id,
    createTime: new Date(new Date().setDate(new Date().getDate() - 4.4)).toISOString()
  }
];

export default {
  comments,
  commentLikes
};
