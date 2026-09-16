// 淘宝闪购联盟 Cookie 获取工具 - Service Worker

// 目标域名列表
const TARGET_DOMAINS = [
  'taobao.com',
  'tb.cn',
  'tmall.com',
  'tmall.hk',
  'alibaba.com',
  'alicdn.com'
];

// 判断 URL 是否匹配目标域名
function isTargetDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    return TARGET_DOMAINS.some(domain => hostname.endsWith(domain));
  } catch (e) {
    return false;
  }
}

// 获取指定 URL 的所有 Cookie
async function getCookiesForTab(tab) {
  if (!tab || !tab.url) return [];

  const url = tab.url;
  const allCookies = [];

  // 获取当前页面 URL 的 cookies
  const cookies = await chrome.cookies.getAll({ url: url });
  allCookies.push(...cookies);

  // 获取所有相关域名的 cookies
  for (const domain of TARGET_DOMAINS) {
    const domainCookies = await chrome.cookies.getAll({ domain: domain });
    // 去重
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

// 监听来自 content script 的 Cookie 数据
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CONTENT_COOKIES' && message.data) {
    // 合并 content script 获取的 document.cookie 数据
    chrome.storage.local.get('latestCookieData', (result) => {
      const existing = result.latestCookieData;
      if (existing && existing.url === message.data.url) {
        // 合并去重
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
});

// 监听标签页更新 - 当页面加载完成时获取 Cookie
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && isTargetDomain(tab.url)) {
    const cookies = await getCookiesForTab(tab);

    const cookieData = {
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

    // 存储到 chrome.storage
    await chrome.storage.local.set({ latestCookieData: cookieData });

    // 发送通知
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Cookie 已捕获',
      message: `已获取 ${cookies.length} 个 Cookie\n来源: ${tab.title || tab.url}`,
      priority: 2
    });

    // 通知 popup 更新
    chrome.runtime.sendMessage({
      type: 'COOKIE_UPDATED',
      data: cookieData
    }).catch(() => {
      // popup 未打开时忽略错误
    });
  }
});

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_COOKIES') {
    // 手动获取当前活跃标签页的 Cookie
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs.length === 0) {
        sendResponse({ error: 'No active tab found' });
        return;
      }

      const tab = tabs[0];
      if (!isTargetDomain(tab.url)) {
        sendResponse({
          error: `当前页面不是淘宝闪购联盟相关页面\n当前URL: ${tab.url}\n\n请先打开淘宝闪购联盟平台网页`
        });
        return;
      }

      const cookies = await getCookiesForTab(tab);
      const cookieData = {
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

      await chrome.storage.local.set({ latestCookieData: cookieData });
      sendResponse({ success: true, data: cookieData });
    });
    return true;
  }

  if (message.type === 'GET_STORED_COOKIES') {
    chrome.storage.local.get('latestCookieData', (result) => {
      sendResponse({ data: result.latestCookieData || null });
    });
    return true;
  }
});

// 监听 Cookie 变化
chrome.cookies.onChanged.addListener(async (changeInfo) => {
  const cookie = changeInfo.cookie;
  const isTarget = TARGET_DOMAINS.some(domain => cookie.domain.endsWith(domain));

  if (isTarget && !changeInfo.removed) {
    // 获取当前活跃标签页信息
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0 && isTargetDomain(tabs[0].url)) {
      const cookies = await getCookiesForTab(tabs[0]);
      const cookieData = {
        url: tabs[0].url,
        title: tabs[0].title || '',
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
      await chrome.storage.local.set({ latestCookieData: cookieData });
    }
  }
});

// 插件安装/更新时的初始化
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: '淘宝闪购联盟 Cookie 工具已安装',
      message: '打开淘宝闪购联盟平台网页即可自动捕获 Cookie',
      priority: 2
    });
  }
});
