// 淘宝闪购联盟 Cookie 获取工具 - Content Script

// 页面加载后读取 document.cookie 并发送给 background
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

  // 延迟执行，确保页面 cookie 已设置
  setTimeout(() => {
    const cookies = getPageCookies();

    if (cookies.length > 0) {
      const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      const cookieDetails = JSON.stringify(cookies, null, 2);

      // 发送给 background service worker
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
      }).catch(() => {
        // popup 未打开时忽略错误
      });
    }
  }, 1500);

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
