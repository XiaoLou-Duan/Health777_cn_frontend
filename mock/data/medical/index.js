/**
 * mock/data/medical/index.js - 医疗模块数据入口
 * 
 * 用于统一导出所有医疗子模块的数据
 */

// 导入医疗数据子模块
import doctors from './doctors';
import messages from './messages';
import appointments from './appointments';
import records from './records';

// 导出所有医疗数据
export default {
  doctors,
  messages,
  appointments,
  records
};
