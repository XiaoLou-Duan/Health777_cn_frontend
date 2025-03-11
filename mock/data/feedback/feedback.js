import { generateRandomId } from "../../utils";

// 用户反馈数据
export const feedbackData = [
  {
    id: generateRandomId(),
    userId: '1001',
    type: 'suggestion',
    content: '希望能增加更多的健康饮食推荐功能，特别是适合老年人的食谱。',
    images: [],
    contactInfo: '13812341234',
    submitTime: '2025-03-10 15:30:22',
    status: 'processing',
    reply: '感谢您的建议，我们正在开发相关功能，预计将在下一个版本中上线。',
    replyTime: '2025-03-11 09:42:15'
  },
  {
    id: generateRandomId(),
    userId: '1001',
    type: 'bug',
    content: '运动检测页面在某些情况下会闪退，特别是在连续使用超过10分钟后。',
    images: ['https://example.com/bug_screenshot1.jpg'],
    contactInfo: '',
    submitTime: '2025-03-08 09:15:47',
    status: 'replied',
    reply: '感谢您的反馈，问题已修复，将在下一个版本更新中解决。',
    replyTime: '2025-03-09 14:20:33'
  },
  {
    id: generateRandomId(),
    userId: '1001',
    type: 'experience',
    content: '应用整体使用体验很好，但是字体有点小，对老年人不太友好。',
    images: [],
    contactInfo: 'user@example.com',
    submitTime: '2025-03-05 14:20:33',
    status: 'replied',
    reply: '感谢您的反馈，我们将在下一个版本中优化字体大小设置，并提供字体大小调整功能。',
    replyTime: '2025-03-06 10:35:47'
  },
  {
    id: generateRandomId(),
    userId: '1002',
    type: 'suggestion',
    content: '建议增加社区老年人互助功能，可以让有类似健康问题的老年人互相交流。',
    images: ['https://example.com/suggestion_image1.jpg'],
    contactInfo: '13987654321',
    submitTime: '2025-03-03 16:45:12',
    status: 'pending',
    reply: '',
    replyTime: ''
  },
  {
    id: generateRandomId(),
    userId: '1003',
    type: 'other',
    content: '请问如何联系客服？我有一些问题需要咨询。',
    images: [],
    contactInfo: '18611112222',
    submitTime: '2025-03-02 11:22:33',
    status: 'replied',
    reply: '您可以通过应用内的"关于我们"页面找到我们的联系方式，或直接拨打客服热线400-123-4567。',
    replyTime: '2025-03-02 15:30:45'
  }
];

// 反馈类型数据
export const feedbackTypes = [
  { label: '功能建议', value: 'suggestion' },
  { label: '体验问题', value: 'experience' },
  { label: '系统故障', value: 'bug' },
  { label: '其他', value: 'other' }
];

// 反馈状态数据
export const feedbackStatus = [
  { label: '待处理', value: 'pending' },
  { label: '处理中', value: 'processing' },
  { label: '已回复', value: 'replied' },
  { label: '已关闭', value: 'closed' }
];

// 用户反馈补充说明数据
export const feedbackSupplements = [
  {
    id: generateRandomId(),
    feedbackId: '100002', // 对应上面的某个反馈ID
    content: '补充说明：闪退主要发生在使用前置摄像头进行运动检测时。',
    submitTime: '2025-03-09 10:30:15'
  },
  {
    id: generateRandomId(),
    feedbackId: '100003', // 对应上面的某个反馈ID
    content: '补充说明：特别是在"饮食记录"页面，字体显示较小。',
    submitTime: '2025-03-06 09:15:22'
  }
];
