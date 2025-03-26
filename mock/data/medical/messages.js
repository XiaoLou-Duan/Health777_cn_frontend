/**
 * mock/data/medical/messages.js - 医生消息数据
 * 
 * 包含医患沟通的消息数据
 */

import { generateRandomId } from '../../utils/mock-helper';

// 消息会话列表
const sessions = [
  {
    id: 'session001',
    userId: '1001',
    doctorId: 'doctor001',
    lastMessage: '您好张医生，我今天按照您的建议增加了蛋白质摄入，感觉好多了',
    lastMessageTime: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
    unreadCount: 0,
    status: 'active'
  },
  {
    id: 'session002',
    userId: '1001',
    doctorId: 'doctor002',
    lastMessage: '李医生，请问每天的蛋白质应该怎么分配在三餐中？',
    lastMessageTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    unreadCount: 1,
    status: 'active'
  },
  {
    id: 'session003',
    userId: '1001',
    doctorId: 'doctor005',
    lastMessage: '谢谢赵医生的建议，我会尝试这个锻炼方法',
    lastMessageTime: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    unreadCount: 0,
    status: 'active'
  }
];

// 消息记录
const messages = [
  // 张立明医生的聊天记录
  {
    id: generateRandomId(),
    sessionId: 'session001',
    senderId: '1001',
    receiverId: 'doctor001',
    content: '张医生您好，我是李大爷，最近被诊断出肌少症，想咨询一下生活中应该注意什么？',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session001',
    senderId: 'doctor001',
    receiverId: '1001',
    content: '李大爷您好，肌少症需要从多方面进行管理。首先，饮食上要保证足够的蛋白质摄入，建议每天摄入1.2-1.5克/公斤体重的蛋白质，特别是优质蛋白如鸡蛋、瘦肉、牛奶等。其次，适量运动很关键，特别是抗阻力训练，可以从简单的站立起坐开始。此外，保证充足的维生素D也很重要。您现在有进行什么运动吗？',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session001',
    senderId: '1001',
    receiverId: 'doctor001',
    content: '谢谢医生。我现在每天只是散步15分钟，其他运动很少做，因为怕摔倒。饮食上我确实蛋白质摄入不足，一天可能就一个鸡蛋，很少吃肉。',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 9)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session001',
    senderId: 'doctor001',
    receiverId: '1001',
    content: '理解您的担忧。我建议您可以在家中做一些简单安全的运动，如坐在椅子上进行腿部伸展，或者扶着稳固的桌子做半蹲。每天尝试做2-3组，每组8-10次，循序渐进增加次数。饮食上建议每餐增加一份蛋白质食物，可以是鸡蛋、豆腐、鱼肉等。牛奶也是很好的选择，每天1-2杯。您可以先从这些简单的改变开始。一周后告诉我感受如何？',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 9)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session001',
    senderId: '1001',
    receiverId: 'doctor001',
    content: '好的，我会按照您说的做。这些听起来我能做到。一周后给您反馈。',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 9)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session001',
    senderId: '1001',
    receiverId: 'doctor001',
    content: '张医生，我按照您的建议执行了一周，感觉精神好些了，但是腿还是有些无力，上楼依然很困难。',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session001',
    senderId: 'doctor001',
    receiverId: '1001',
    content: '李大爷，恢复是个循序渐进的过程，您能坚持已经很好了！肌肉的增强需要时间，一般要持续4-6周才能看到明显效果。建议您在现有基础上，每天增加一组椅子坐立练习，同时我发现很多患者维生素D不足，这会影响蛋白质的利用，建议您每天晒15分钟太阳。您可以上传一下您的饮食记录，我看看是否需要调整。',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session001',
    senderId: '1001',
    receiverId: 'doctor001',
    content: '好的，我会继续坚持。这是我昨天的饮食记录。',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session001',
    senderId: '1001',
    receiverId: 'doctor001',
    content: '/static/images/diet-record.jpg',
    type: 'image',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session001',
    senderId: 'doctor001',
    receiverId: '1001',
    content: '看了您的饮食记录，早餐的蛋白质摄入不足，建议增加一杯牛奶或豆浆。午餐很好，晚餐可以再添加些豆制品。总体来说，您的饮食正在改善，但蛋白质摄入仍需进一步增加。请继续记录，两周后我们再评估一次。',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session001',
    senderId: '1001',
    receiverId: 'doctor001',
    content: '您好张医生，我今天按照您的建议增加了蛋白质摄入，感觉好多了',
    type: 'text',
    sendTime: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
    readStatus: 'read'
  },
  
  // 李慧芳医生的聊天记录
  {
    id: generateRandomId(),
    sessionId: 'session002',
    senderId: '1001',
    receiverId: 'doctor002',
    content: '李医生您好，我是张立明医生推荐来咨询您的，关于肌少症的饮食问题',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session002',
    senderId: 'doctor002',
    receiverId: '1001',
    content: '您好！很高兴为您提供咨询。对于肌少症患者，营养干预是非常重要的一环。请问您目前的身高、体重是多少？有没有做过肌肉量或蛋白质摄入评估？',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session002',
    senderId: '1001',
    receiverId: 'doctor002',
    content: '我身高165cm，体重58kg。没做过专门的评估，但医生说我肌肉量偏低，蛋白质摄入不足。',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session002',
    senderId: 'doctor002',
    receiverId: '1001',
    content: '好的，根据您提供的信息，按照肌少症患者的标准，您每天需要摄入约70-87克蛋白质（按体重1.2-1.5g/kg计算）。我建议您早餐摄入25-30克，午餐25-30克，晚餐20-25克。在两餐之间可以适当加些蛋白质零食，如酸奶、坚果等。务必保证早餐的蛋白质摄入，因为这有助于一整天的肌肉蛋白合成。您平时喜欢吃哪些富含蛋白质的食物？',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session002',
    senderId: '1001',
    receiverId: 'doctor002',
    content: '我喜欢吃鸡蛋、豆腐、偶尔吃些鱼肉，但不太喝牛奶，觉得不好消化。',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session002',
    senderId: 'doctor002',
    receiverId: '1001',
    content: '了解了。如果牛奶不适合您，可以尝试酸奶、优质豆浆或者蛋白粉。鸡蛋和豆腐都是很好的蛋白质来源。我给您一个简单的参考：1个鸡蛋约含7克蛋白质，100克豆腐约含8克，100克鱼肉约含20克。建议您每餐都包含至少一种优质蛋白食物。例如早餐可以是2个鸡蛋+豆浆，午餐豆腐或鱼肉+蔬菜，晚餐瘦肉或豆制品+蔬菜。另外，适量补充一些健康脂肪如橄榄油、坚果，也有助于营养吸收。您可以记录一周的饮食，我们再详细分析调整。',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session002',
    senderId: '1001',
    receiverId: 'doctor002',
    content: '谢谢医生的详细建议，我会按照您说的安排饮食。请问这些蛋白质应该怎么分配在三餐中才最有效？',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    readStatus: 'unread'
  },
  
  // 赵明朗医生的聊天记录
  {
    id: generateRandomId(),
    sessionId: 'session003',
    senderId: '1001',
    receiverId: 'doctor005',
    content: '赵医生您好，我因为肌少症导致经常腿软，有骨质疏松风险，想咨询一下。',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session003',
    senderId: 'doctor005',
    receiverId: '1001',
    content: '您好！肌少症和骨质疏松确实常常同时存在，尤其是老年人。除了补充钙和维生素D，适当的负重运动对预防骨质疏松非常重要。您目前有做什么运动吗？骨密度检查过吗？',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session003',
    senderId: '1001',
    receiverId: 'doctor005',
    content: '我每天散步15分钟，最近开始做一些椅子坐立运动。去年做过骨密度，医生说是骨量减少，但还不到骨质疏松的程度。',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session003',
    senderId: 'doctor005',
    receiverId: '1001',
    content: '您现在的情况需要积极干预，预防进一步发展为骨质疏松。椅子坐立运动很好，这是一种负重运动，对增强腿部肌肉和保护骨骼都有帮助。我建议您可以在安全的情况下，增加每日散步时间到30分钟，分早晚两次进行。另外，可以做一些简单的平衡训练，如单腿站立（扶着桌子或椅子），每次15秒，逐渐增加到30秒。这些运动可以增强肌肉力量，改善平衡，减少跌倒风险。营养方面，除了足够的蛋白质，每天需要摄入800-1000mg钙和800IU维生素D。您有服用任何补充剂吗？',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session003',
    senderId: '1001',
    receiverId: 'doctor005',
    content: '我目前只服用钙片，每天600mg，没有额外补充维生素D。那些平衡训练听起来很有用，但我担心自己做不好会摔倒。',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session003',
    senderId: 'doctor005',
    receiverId: '1001',
    content: '您的担忧很合理。安全确实是第一位的。建议您开始平衡训练时，一定要有人在旁边保护，并且靠近稳固的支撑物。可以从非常短的时间开始，如5秒，逐渐增加。关于营养补充，建议您增加钙的摄入到800mg，并添加维生素D补充剂。或者选择含钙和维生素D的复合制剂。此外，适当的日晒（每天15-20分钟）也是获取维生素D的好方法。我可以给您发一个简单的家庭锻炼视频，里面有适合您情况的安全动作示范。',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    readStatus: 'read'
  },
  {
    id: generateRandomId(),
    sessionId: 'session003',
    senderId: '1001',
    receiverId: 'doctor005',
    content: '谢谢赵医生的建议，我会尝试这个锻炼方法',
    type: 'text',
    sendTime: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    readStatus: 'read'
  }
];

export default {
  sessions,
  messages
};
