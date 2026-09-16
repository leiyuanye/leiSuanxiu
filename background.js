// Cookie 获取工具 - Service Worker (v2.0 支持自定义网站)

// 默认域名列表（首次安装时使用）
const DEFAULT_DOMAINS = [
  'taobao.com',
  'tb.cn',
  'tmall.com',
  'tmall.hk',
  'alibaba.com',
  'alicdn.com'
];

// 全局缓存：当前配置的域名列表
let configuredDomains = [...DEFAULT_DOMAINS];

// 从 storage 加载域名配置
async function loadDomainConfig() {
  const result = await chrome.storage.sync.get(['customDomains', 'autoCapture', 'showNotification']);
  configuredDomains = (result.customDomains && result.customDomains.length > 0)
    ? result.customDomains
    : [...DEFAULT_DOMAINS];
  return {
    domains: configuredDomains,
    autoCapture: result.autoCapture !== false,
    showNotification: result.showNotification !== false
  };
}

// 判断 URL 是否匹配已配置的域名
function isTargetDomain(url, domains) {
  const list = domains || configuredDomains;
  try {
    const hostname = new URL(url).hostname;
    return list.some(domain => {
      const d = domain.trim().toLowerCase();
      return hostname === d || hostname.endsWith('.' + d);
    });
  } catch (e) {
    return false;
  }
}

// 获取指定 URL 的所有 Cookie
async function getCookiesForTab(tab, domains) {
  if (!tab || !tab.url) return [];

  const url = tab.url;
  const domainList = domains || configuredDomains;
  const allCookies = [];

  // 获取当前页面 URL 的 cookies
  const cookies = await chrome.cookies.getAll({ url: url });
  allCookies.push(...cookies);

  // 获取所有配置域名的 cookies
  for (const domain of domainList) {
    const d = domain.trim();
    if (!d) continue;
    const domainCookies = await chrome.cookies.getAll({ domain: d });
    for (const cookie of domainCookies) {
      const exists = allCookies.some(
        c => c.name === cookie.name && c.domain === cookie.domain && c.path === cookie.path
      );
      if (!exists) {
        allCookies.push(cookie);
      }
    }
  }

  return allCookies;
}

// 格式化 Cookie 为字符串
function formatCookiesToString(cookies) {
  return cookies
    .filter(c => c.name && c.value)
    .map(c => `${c.name}=${c.value}`)
    .join('; ');
}

// 格式化 Cookie 为详细 JSON
function formatCookiesToJSON(cookies) {
  return JSON.stringify(cookies.map(c => ({
    name: c.name,
    value: c.value,
    domain: c.domain,
    path: c.path,
    secure: c.secure,
    httpOnly: c.httpOnly,
    sameSite: c.sameSite,
    expirationDate: c.expirationDate,
    storeId: c.storeId
  })), null, 2);
}

// 构建 cookieData 对象
function buildCookieData(tab, cookies) {
  return {
    url: tab.url,
    title: tab.title || '',
    timestamp: Date.now(),
    cookieCount: cookies.length,
    cookieString: formatCookiesToString(cookies),
    cookieDetails: formatCookiesToJSON(cookies),
    cookies: cookies.map(c => ({
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: c.path,
      secure: c.secure,
      httpOnly: c.httpOnly
    }))
  };
}

// ============ 消息监听 ============

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 来自 content script 的 Cookie 数据
  if (message.type === 'CONTENT_COOKIES' && message.data) {
    chrome.storage.local.get('latestCookieData', (result) => {
      const existing = result.latestCookieData;
      if (existing && existing.url === message.data.url) {
        const existingNames = new Set(existing.cookies.map(c => c.name));
        for (const c of message.data.cookies) {
          if (!existingNames.has(c.name)) {
            existing.cookies.push(c);
            existing.cookieCount = existing.cookies.length;
            existing.cookieString += '; ' + `${c.name}=${c.value}`;
          }
        }
        existing.timestamp = message.data.timestamp;
        chrome.storage.local.set({ latestCookieData: existing });
      } else {
        chrome.storage.local.set({ latestCookieData: message.data });
      }
    });
    sendResponse({ received: true });
    return true;
  }

  // 手动获取 Cookie
  if (message.type === 'GET_COOKIES') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs.length === 0) {
        sendResponse({ error: '未找到活跃标签页' });
        return;
      }

      const tab = tabs[0];
      const config = await loadDomainConfig();

      if (!isTargetDomain(tab.url, config.domains)) {
        const hostname = (() => { try { return new URL(tab.url).hostname; } catch { return ''; } })();
        sendResponse({
          error: `当前页面不在捕获列表中\n当前域名: ${hostname}\n\n请在设置中添加该域名，或点击「添加当前网站」`
        });
        return;
      }

      const cookies = await getCookiesForTab(tab, config.domains);
      const cookieData = buildCookieData(tab, cookies);
      await chrome.storage.local.set({ latestCookieData: cookieData });
      sendResponse({ success: true, data: cookieData });
    });
    return true;
  }

  // 获取已存储的 Cookie
  if (message.type === 'GET_STORED_COOKIES') {
    chrome.storage.local.get('latestCookieData', (result) => {
      sendResponse({ data: result.latestCookieData || null });
    });
    return true;
  }

  // 获取域名配置
  if (message.type === 'GET_CONFIG') {
    loadDomainConfig().then(config => {
      sendResponse({ config });
    });
    return true;
  }

  // 添加当前网站域名
  if (message.type === 'ADD_CURRENT_DOMAIN') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs.length === 0) {
        sendResponse({ error: '未找到活跃标签页' });
        return;
      }
      const tab = tabs[0];
      let hostname;
      try { hostname = new URL(tab.url).hostname; } catch { sendResponse({ error: '无法解析URL' }); return; }

      // 提取主域名（简单规则：取最后两段）
      const parts = hostname.split('.');
      const mainDomain = parts.length >= 2 ? parts.slice(-2).join('.') : hostname;

      const config = await loadDomainConfig();
      if (config.domains.includes(mainDomain)) {
        sendResponse({ success: true, alreadyExists: true, config });
        return;
      }

      config.domains.push(mainDomain);
      await chrome.storage.sync.set({ customDomains: config.domains });
      configuredDomains = config.domains;
      sendResponse({ success: true, addedDomain: mainDomain, config });
    });
    return true;
  }

  return false;
});

// ============ 标签页更新监听 ============

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;

  const config = await loadDomainConfig();

  // 只在自动捕获开启时才自动获取
  if (!config.autoCapture) return;

  if (!isTargetDomain(tab.url, config.domains)) return;

  const cookies = await getCookiesForTab(tab, config.domains);
  const cookieData = buildCookieData(tab, cookies);

  await chrome.storage.local.set({ latestCookieData: cookieData });

  // 发送通知
  if (config.showNotification) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Cookie 已捕获',
      message: `已获取 ${cookies.length} 个 Cookie\n来源: ${tab.title || tab.url}`,
      priority: 2
    });
  }

  // 通知 popup 更新
  chrome.runtime.sendMessage({
    type: 'COOKIE_UPDATED',
    data: cookieData
  }).catch(() => {});
});

// ============ Cookie 变化监听 ============

chrome.cookies.onChanged.addListener(async (changeInfo) => {
  if (changeInfo.removed) return;

  const cookie = changeInfo.cookie;
  const config = await loadDomainConfig();
  const isTarget = config.domains.some(domain => {
    const d = domain.trim();
    return cookie.domain === d || cookie.domain.endsWith('.' + d);
  });

  if (!isTarget) return;

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length > 0 && isTargetDomain(tabs[0].url, config.domains)) {
    const cookies = await getCookiesForTab(tabs[0], config.domains);
    const cookieData = buildCookieData(tabs[0], cookies);
    await chrome.storage.local.set({ latestCookieData: cookieData });
  }
});

// ============ 安装/更新初始化 ============

chrome.runtime.onInstalled.addListener(async (details) => {
  // 初始化默认配置
  const result = await chrome.storage.sync.get(['customDomains', 'autoCapture', 'showNotification']);
  if (!result.customDomains) {
    await chrome.storage.sync.set({
      customDomains: DEFAULT_DOMAINS,
      autoCapture: true,
      showNotification: true
    });
  }
  configuredDomains = result.customDomains || DEFAULT_DOMAINS;

  if (details.reason === 'install') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Cookie 获取工具已安装',
      message: '已预置淘宝/天猫等域名，可在设置页自定义添加任意网站',
      priority: 2
    });
  } else if (details.reason === 'update') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Cookie 工具已更新到 v2.0',
      message: '新增自定义网站配置功能，点击设置页管理域名',
      priority: 2
    });
  }
});
