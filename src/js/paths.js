// 路径辅助模块 - 处理 Vite base 路径

// 从 Vite 配置中获取 base 路径
export const BASE_PATH = '/Kill-Team-Companion/';

/**
 * 将相对路径转换为带 base 前缀的绝对路径
 * @param {string} relativePath - 相对路径，如 './assets/images/...' 或 'assets/images/...'
 * @returns {string} 带 base 前缀的路径
 */
export function getAssetPath(relativePath) {
  if (!relativePath) return '';

  // 移除开头的 './'
  let path = relativePath.replace(/^\.\//, '');

  // 如果已经是绝对路径，直接返回
  if (path.startsWith('/')) {
    return path;
  }

  // 添加 base 路径前缀
  return BASE_PATH + path;
}
