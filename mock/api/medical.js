import { getMedicalUserInfo, getRecommendDoctors, getHealthArticles, getHealthReminders } from '../medical';

export default {
  'GET /api/medical/userInfo': getMedicalUserInfo,
  'GET /api/medical/recommendDoctors': getRecommendDoctors,
  'GET /api/medical/healthArticles': getHealthArticles,
  'GET /api/medical/healthReminders': getHealthReminders
};
