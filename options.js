// Cookie 获取工具 - 设置页脚本

const DEFAULT_DOMAINS = [
  'taobao.com',
  'tb.cn',
  'tmall.com',
  'tmall.hk',
  'alibaba.com',
  'alicdn.com'
];

let domains = [];
let autoCapture = true;
let showNotification = true;

// DOM
const domainInput = document.getElementById('domainInput');
const btnAddDomain = document.getElementById('btnAddDomain');
const domainList = document.getElementById('domainList');
const domainCount = document.getElementById('domainCount');
const btnRestoreDefault = document.getElementById('btnRestoreDefault');
const toggleAutoCapture = document.getElementById('toggleAutoCapture');
const toggleNotification = document.getElementById('toggleNotification');
const btnExportConfig = document.getElementById('btnExportConfig');
const btnImportConfig = document.getElementById('btnImportConfig');
const importFile = document.getElementById('importFile');

// 初始化
async function init() {
  const result = await chrome.storage.sync.get(['customDomains', 'autoCapture', 'showNotification']);
  domains = result.customDomains || [...DEFAULT_DOMAINS];
  autoCapture = result.autoCapture !== false;
  showNotification = result.showNotification !== false;

  toggleAutoCapture.checked = autoCapture;
  toggleNotification.checked = showNotification;

  renderDomainList();
}

// 渲染域名列表
function renderDomainList() {
  domainCount.textContent = domains.length;
  domainList.innerHTML = '';

  if (domains.length === 0) {
    domainList.innerHTML = '<div style="padding:20px;text-align:center;color:#aaa;font-size:13px;">暂无域名，请添加</div>';
    return;
  }

  domains.forEach((domain, index) => {
    const item = document.createElement('div');
    item.className = 'domain-item';

    item.innerHTML = `
      <div class="domain-name">
        <span class="domain-icon">🌐</span>
        <span>${escapeHTML(domain)}</span>
      </div>
      <div class="domain-actions">
        <button class="btn-remove" data-index="${index}">删除</button>
      </div>
    `;
    domainList.appendChild(item);
  });

  // 绑定删除按钮
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      domains.splice(idx, 1);
      saveDomains();
      renderDomainList();
      showToast('域名已删除');
    });
  });
}

// 保存域名
async function saveDomains() {
  await chrome.storage.sync.set({ customDomains: domains });
}

// 添加域名
btnAddDomain.addEventListener('click', () => {
  const value = domainInput.value.trim().toLowerCase();
  if (!value) {
    showToast('请输入域名', true);
    return;
  }

  // 简单验证：不能包含 http:// 或路径
  if (value.includes('://') || value.includes('/') || value.includes(' ')) {
    showToast('请输入纯域名，如 example.com', true);
    return;
  }

  if (domains.includes(value)) {
    showToast('该域名已存在', true);
    return;
  }

  domains.push(value);
  saveDomains();
  renderDomainList();
  domainInput.value = '';
  showToast('域名已添加');
});

// 回车添加
domainInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btnAddDomain.click();
});

// 恢复默认
btnRestoreDefault.addEventListener('click', async () => {
  domains = [...DEFAULT_DOMAINS];
  await saveDomains();
  renderDomainList();
  showToast('已恢复默认域名');
});

// 自动捕获开关
toggleAutoCapture.addEventListener('change', async () => {
  autoCapture = toggleAutoCapture.checked;
  await chrome.storage.sync.set({ autoCapture });
  showToast(autoCapture ? '已开启自动捕获' : '已关闭自动捕获');
});

// 通知开关
toggleNotification.addEventListener('change', async () => {
  showNotification = toggleNotification.checked;
  await chrome.storage.sync.set({ showNotification });
  showToast(showNotification ? '已开启通知' : '已关闭通知');
});

// 导出配置
btnExportConfig.addEventListener('click', () => {
  const config = {
    version: '2.0',
    exportTime: new Date().toISOString(),
    customDomains: domains,
    autoCapture,
    showNotification
  };
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cookie_tool_config_${formatDate()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('配置已导出');
});

// 导入配置
btnImportConfig.addEventListener('click', () => importFile.click());
importFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const config = JSON.parse(event.target.result);
      if (config.customDomains && Array.isArray(config.customDomains)) {
        domains = config.customDomains;
        await saveDomains();
        if (typeof config.autoCapture === 'boolean') {
          autoCapture = config.autoCapture;
          toggleAutoCapture.checked = autoCapture;
          await chrome.storage.sync.set({ autoCapture });
        }
        if (typeof config.showNotification === 'boolean') {
          showNotification = config.showNotification;
          toggleNotification.checked = showNotification;
          await chrome.storage.sync.set({ showNotification });
        }
        renderDomainList();
        showToast('配置已导入');
      } else {
        showToast('无效的配置文件', true);
      }
    } catch (err) {
      showToast('文件解析失败', true);
    }
    importFile.value = '';
  };
  reader.readAsText(file);
});

// 工具函数
function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function showToast(msg, isError) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show' + (isError ? ' error' : '');
  setTimeout(() => { toast.className = 'toast'; }, 2000);
}

init();
