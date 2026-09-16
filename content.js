// Cookie 获取工具 - Content Script (v2.0 支持自定义网站)

(function () {
  function getPageCookies() {
    const cookieStr = document.cookie || '';
    if (!cookieStr) return [];

    return cookieStr.split(';').map(pair => {
      const idx = pair.indexOf('=');
      if (idx === -1) return { name: pair.trim(), value: '' };
      return {
        name: pair.substring(0, idx).trim(),
        value: pair.substring(idx + 1).trim(),
        domain: window.location.hostname,
        path: '/',
        secure: window.location.protocol === 'https:',
        httpOnly: false
      };
    });
  }

  // 从 storage 获取配置的域名列表，判断当前页面是否在捕获范围
  async function isConfiguredSite() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['customDomains'], (result) => {
        const domains = result.customDomains || ['taobao.com', 'tb.cn', 'tmall.com', 'tmall.hk', 'alibaba.com', 'alicdn.com'];
        const hostname = window.location.hostname;
        const matched = domains.some(domain => {
          const d = domain.trim().toLowerCase();
          return hostname === d || hostname.endsWith('.' + d);
        });
        resolve(matched);
      });
    });
  }

  // 主流程：判断域名后发送 cookie
  async function trySendCookies() {
    const isTarget = await isConfiguredSite();
    if (!isTarget) return;

    const cookies = getPageCookies();
    if (cookies.length === 0) return;

    const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    const cookieDetails = JSON.stringify(cookies, null, 2);

    chrome.runtime.sendMessage({
      type: 'CONTENT_COOKIES',
      data: {
        url: window.location.href,
        title: document.title,
        timestamp: Date.now(),
        cookieCount: cookies.length,
        cookieString: cookieString,
        cookieDetails: cookieDetails,
        cookies: cookies
      }
    }).catch(() => {});
  }

  // 延迟执行，确保页面 cookie 已设置
  setTimeout(trySendCookies, 1500);

  // 监听来自 popup/background 的请求
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_PAGE_COOKIES') {
      const cookies = getPageCookies();
      const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      sendResponse({
        url: window.location.href,
        title: document.title,
        cookies: cookies,
        cookieString: cookieString
      });
    }
    return true;
  });
})();
