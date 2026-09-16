// 淘宝闪购联盟 Cookie 获取工具 - Popup 脚本

let currentData = null;
let viewMode = 'list'; // 'list' 或 'string'

// DOM 元素
const statusBadge = document.getElementById('statusBadge');
const currentPage = document.getElementById('currentPage');
const cookieCount = document.getElementById('cookieCount');
const captureTime = document.getElementById('captureTime');
const cookieList = document.getElementById('cookieList');
const cookieListContainer = document.getElementById('cookieListContainer');
const cookieStringContainer = document.getElementById('cookieStringContainer');
const cookieStringArea = document.getElementById('cookieStringArea');
const emptyState = document.getElementById('emptyState');
const errorMsg = document.getElementById('errorMsg');

// 按钮
const btnCapture = document.getElementById('btnCapture');
const btnCopyString = document.getElementById('btnCopyString');
const btnCopyJSON = document.getElementById('btnCopyJSON');
const btnExport = document.getElementById('btnExport');
const btnToggleView = document.getElementById('btnToggleView');

// 初始化 - 加载已存储的 Cookie 数据
async function init() {
  chrome.runtime.sendMessage({ type: 'GET_STORED_COOKIES' }, (response) => {
    if (response && response.data) {
      displayData(response.data);
    }
  });
}

// 显示 Cookie 数据
function displayData(data) {
  if (!data) {
    showEmpty();
    return;
  }

  currentData = data;
  errorMsg.style.display = 'none';

  // 更新页面信息
  currentPage.textContent = data.title || data.url || '-';
  cookieCount.textContent = data.cookieCount || 0;
  captureTime.textContent = formatTime(data.timestamp);

  // 更新状态
  statusBadge.textContent = '已捕获';
  statusBadge.classList.add('active');
  statusBadge.classList.remove('error');

  // 启用按钮
  btnCopyString.disabled = false;
  btnCopyJSON.disabled = false;
  btnExport.disabled = false;

  // 显示 Cookie 列表
  if (data.cookies && data.cookies.length > 0) {
    renderCookieList(data.cookies);
    cookieListContainer.style.display = 'block';
    emptyState.style.display = 'none';
  }

  // 显示 Cookie 字符串
  if (data.cookieString) {
    cookieStringArea.value = data.cookieString;
    cookieStringContainer.style.display = 'block';
  }
}

// 渲染 Cookie 列表
function renderCookieList(cookies) {
  cookieList.innerHTML = '';

  cookies.forEach((cookie, index) => {
    const item = document.createElement('div');
    item.className = 'cookie-item';

    const valueDisplay = cookie.value.length > 80
      ? cookie.value.substring(0, 80) + '...'
      : cookie.value;

    const meta = [];
    if (cookie.httpOnly) meta.push('HttpOnly');
    if (cookie.secure) meta.push('Secure');
    meta.push(cookie.domain);
    if (cookie.path) meta.push('Path: ' + cookie.path);

    item.innerHTML = `
      <div class="cookie-name">${index + 1}. ${escapeHTML(cookie.name)}</div>
      <div class="cookie-value">${escapeHTML(valueDisplay)}</div>
      <div class="cookie-meta">${meta.map(m => `<span>${escapeHTML(m)}</span>`).join('')}</div>
    `;

    cookieList.appendChild(item);
  });
}

// 手动获取 Cookie
btnCapture.addEventListener('click', () => {
  statusBadge.textContent = '获取中...';
  statusBadge.classList.remove('active', 'error');

  chrome.runtime.sendMessage({ type: 'GET_COOKIES' }, (response) => {
    if (chrome.runtime.lastError) {
      showError('插件通信失败，请重新打开弹窗');
      return;
    }

    if (response && response.error) {
      showError(response.error);
      statusBadge.textContent = '错误';
      statusBadge.classList.add('error');
      return;
    }

    if (response && response.success && response.data) {
      displayData(response.data);
    }
  });
});

// 复制 Cookie 字符串
btnCopyString.addEventListener('click', async () => {
  if (!currentData || !currentData.cookieString) return;
  await copyToClipboard(currentData.cookieString);
  showToast('Cookie 字符串已复制');
});

// 复制 JSON 格式
btnCopyJSON.addEventListener('click', async () => {
  if (!currentData || !currentData.cookieDetails) return;
  await copyToClipboard(currentData.cookieDetails);
  showToast('JSON 格式已复制');
});

// 导出为文件
btnExport.addEventListener('click', () => {
  if (!currentData) return;

  const exportData = {
    url: currentData.url,
    title: currentData.title,
    captureTime: new Date(currentData.timestamp).toISOString(),
    cookieCount: currentData.cookieCount,
    cookies: currentData.cookies
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `taobao_cookies_${formatFileName(currentData.timestamp)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('文件已导出');
});

// 切换视图
btnToggleView.addEventListener('click', () => {
  if (viewMode === 'list') {
    viewMode = 'string';
    cookieListContainer.style.display = 'none';
    cookieStringContainer.style.display = 'block';
    btnToggleView.textContent = '列表视图';
  } else {
    viewMode = 'list';
    cookieListContainer.style.display = 'block';
    cookieStringContainer.style.display = 'none';
    btnToggleView.textContent = '字符串视图';
  }
});

// 监听来自 background 的实时更新
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'COOKIE_UPDATED' && message.data) {
    displayData(message.data);
  }
});

// 工具函数
function showEmpty() {
  cookieListContainer.style.display = 'none';
  cookieStringContainer.style.display = 'none';
  emptyState.style.display = 'block';
  statusBadge.textContent = '等待中';
  statusBadge.classList.remove('active', 'error');
  btnCopyString.disabled = true;
  btnCopyJSON.disabled = true;
  btnExport.disabled = true;
  currentPage.textContent = '-';
  cookieCount.textContent = '0';
  captureTime.textContent = '-';
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.style.display = 'block';
  emptyState.style.display = 'none';
}

function formatTime(timestamp) {
  if (!timestamp) return '-';
  const d = new Date(timestamp);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function formatFileName(timestamp) {
  const d = new Date(timestamp);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: #4CAF50;
    color: white;
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 13px;
    z-index: 1000;
    animation: fadeInOut 2s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// 启动
init();
