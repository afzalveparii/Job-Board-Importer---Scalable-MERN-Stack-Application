export const logger = {
  info: (message, data = {}) => {
    console.log(`ℹ️  [INFO] ${message}`, data);
  },
  error: (message, error = {}) => {
    console.error(`❌ [ERROR] ${message}`, error);
  },
  success: (message, data = {}) => {
    console.log(`✅ [SUCCESS] ${message}`, data);
  },
  warn: (message, data = {}) => {
    console.warn(`⚠️  [WARN] ${message}`, data);
  },
};

export default logger;
