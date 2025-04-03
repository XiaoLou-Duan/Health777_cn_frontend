/**
 * validation.js - 表单验证工具
 */

/**
 * 验证手机号
 * @param {String} value 需要验证的手机号
 * @returns {Boolean} 验证结果
 */
export function validatePhone(value) {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(value);
}

/**
 * 手机号脱敏处理
 * @param {String} phone 手机号
 * @returns {String} 脱敏后的手机号
 */
export function maskPhoneNumber(phone) {
  if (!phone || phone.length !== 11) {
    return '未绑定手机号';
  }
  
  return phone.substring(0, 3) + '****' + phone.substring(7);
}

/**
 * 验证邮箱
 * @param {String} value 需要验证的邮箱
 * @returns {Boolean} 验证结果
 */
export function validateEmail(value) {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return reg.test(value);
}

/**
 * 验证身份证号
 * @param {String} value 需要验证的身份证号
 * @returns {Boolean} 验证结果
 */
export function validateIdCard(value) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(value);
}

/**
 * 验证密码（8-20位，包含大小写字母和数字）
 * @param {String} value 需要验证的密码
 * @returns {Boolean} 验证结果
 */
export function validatePassword(value) {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
  return reg.test(value);
}

/**
 * 验证是否为空
 * @param {String} value 需要验证的值
 * @returns {Boolean} 验证结果
 */
export function validateEmpty(value) {
  return value !== null && value !== undefined && value.trim() !== '';
}

/**
 * 验证数字
 * @param {String} value 需要验证的值
 * @returns {Boolean} 验证结果
 */
export function validateNumber(value) {
  return !isNaN(Number(value));
}

/**
 * 验证老年人年龄（>=60岁）
 * @param {Number} age 年龄
 * @returns {Boolean} 验证结果
 */
export function validateElderlyAge(age) {
  return typeof age === 'number' && age >= 60;
}

/**
 * 验证BMI值（正常范围：18.5-24.9）
 * @param {Number} bmi BMI值
 * @returns {Object} 验证结果及状态
 */
export function validateBMI(bmi) {
  if (typeof bmi !== 'number') return { valid: false, status: 'invalid' };
  
  if (bmi < 18.5) return { valid: true, status: 'underweight' };
  if (bmi >= 18.5 && bmi <= 24.9) return { valid: true, status: 'normal' };
  if (bmi > 24.9 && bmi <= 28) return { valid: true, status: 'overweight' };
  if (bmi > 28) return { valid: true, status: 'obese' };
  
  return { valid: false, status: 'invalid' };
}

/**
 * 验证蛋白质摄入（每日推荐范围：老年人1.0-1.2g/kg体重）
 * @param {Number} protein 蛋白质摄入量(g)
 * @param {Number} weight 体重(kg)
 * @returns {Object} 验证结果及状态
 */
export function validateProteinIntake(protein, weight) {
  if (typeof protein !== 'number' || typeof weight !== 'number' || weight <= 0) {
    return { valid: false, status: 'invalid' };
  }
  
  const minRecommend = weight * 1.0;
  const maxRecommend = weight * 1.2;
  
  if (protein < minRecommend) return { valid: true, status: 'insufficient', gap: minRecommend - protein };
  if (protein >= minRecommend && protein <= maxRecommend) return { valid: true, status: 'appropriate' };
  if (protein > maxRecommend) return { valid: true, status: 'excessive', excess: protein - maxRecommend };
  
  return { valid: false, status: 'invalid' };
}

export default {
  validatePhone,
  validateEmail,
  validateIdCard,
  validatePassword,
  validateEmpty,
  validateNumber,
  validateElderlyAge,
  validateBMI,
  validateProteinIntake,
  maskPhoneNumber
};
