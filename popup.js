// Cookie 获取工具 - Popup 脚本 (v2.0)

let currentData = null;
let viewMode = 'list';
let configDomains = [];

// DOM
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
const domainTags = document.getElementById('domainTags');
const domainPreviewCount = document.getElementById('domainPreviewCount');

// 按钮
const btnCapture = document.getElementById('btnCapture');
const btnAddSite = document.getElementById('btnAddSite');
const btnCopyString = document.getElementById('btnCopyString');
const btnCopyJSON = document.getElementById('btnCopyJSON');
const btnExport = document.getElementById('btnExport');
const btnToggleView = document.getElementById('btnToggleView');
const btnSettings = document.getElementById('btnSettings');
const btnManageDomains = document.getElementById('btnManageDomains');

// 初始化
async function init() {
  loadConfig();
  loadStoredCookies();
}

// 加载域名配置
function loadConfig() {
  chrome.runtime.sendMessage({ type: 'GET_CONFIG' }, (response) => {
    if (response && response.config) {
      configDomains = response.config.domains || [];
      renderDomainTags();
    }
  });
}

// 渲染域名标签
function renderDomainTags() {
  domainPreviewCount.textContent = configDomains.length;
  domainTags.innerHTML = '';

  const max = 5;
  configDomains.slice(0, max).forEach(d => {
    const tag = document.createElement('span');
    tag.className = 'domain-tag';
    tag.textContent = d;
    domainTags.appendChild(tag);
  });

  if (configDomains.length > max) {
    const more = document.createElement('span');
    more.className = 'domain-tag-more';
    more.textContent = `+${configDomains.length - max}`;
    domainTags.appendChild(more);
  }

  if (configDomains.length === 0) {
    domainTags.innerHTML = '<span class="domain-tag-more">未配置域名</span>';
  }
}

// 加载已存储的 Cookie
function loadStoredCookies() {
  chrome.runtime.sendMessage({ type: 'GET_STORED_COOKIES' }, (response) => {
    if (response && response.data) {
      displayData(response.data);
    }
  });
}

// 显示 Cookie 数据
function displayData(data) {
  if (!data) { showEmpty(); return; }

  currentData = data;
  errorMsg.style.display = 'none';

  currentPage.textContent = data.title || data.url || '-';
  cookieCount.textContent = data.cookieCount || 0;
  captureTime.textContent = formatTime(data.timestamp);

  statusBadge.textContent = '已捕获';
  statusBadge.classList.add('active');
  statusBadge.classList.remove('error');

  btnCopyString.disabled = false;
  btnCopyJSON.disabled = false;
  btnExport.disabled = false;

  if (data.cookies && data.cookies.length > 0) {
    renderCookieList(data.cookies);
    cookieListContainer.style.display = 'block';
    emptyState.style.display = 'none';
  }

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

// 手动获取
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

// 添加当前网站
btnAddSite.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'ADD_CURRENT_DOMAIN' }, (response) => {
    if (chrome.runtime.lastError) {
      showError('通信失败');
      return;
    }
    if (response && response.error) {
      showError(response.error);
      return;
    }
    if (response && response.success) {
      if (response.alreadyExists) {
        showToast('该网站已在捕获列表中');
      } else if (response.addedDomain) {
        showToast(`已添加: ${response.addedDomain}`);
      }
      if (response.config) {
        configDomains = response.config.domains || [];
        renderDomainTags();
      }
    }
  });
});

// 打开设置页
btnSettings.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

btnManageDomains.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// 复制
btnCopyString.addEventListener('click', async () => {
  if (!currentData || !currentData.cookieString) return;
  await copyToClipboard(currentData.cookieString);
  showToast('Cookie 字符串已复制');
});

btnCopyJSON.addEventListener('click', async () => {
  if (!currentData || !currentData.cookieDetails) return;
  await copyToClipboard(currentData.cookieDetails);
  showToast('JSON 格式已复制');
});

// 导出
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
  a.download = `cookies_${formatFileName(currentData.timestamp)}.json`;
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

// 监听实时更新
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
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

init();
