function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function showMessage(msg) {
  const message = document.createElement('p');
  message.textContent = msg;
  message.classList.add('message');

  document.body.appendChild(message);

  await delay(1500);
  document.body.removeChild(message);
}

window.onload = async function() {
  const arrowDom = document.querySelector('#arrow');
  const rippleDom = document.querySelector('.ripple');
  const searchDom = document.querySelector('input[type="search"]');
  const submitDom = document.querySelector('input[type="submit"]');
  const tipsDom = document.querySelector('.tips');
  const outputDom = document.querySelector('#output');
  const textareaDom = document.querySelector('textarea');
  const copyButton = document.getElementById('copy');
  const previewButton = document.getElementById('preview');

  submitDom.addEventListener('click', function(event) {
    // 获取url中的wd参数
    const wd = new URLSearchParams(location.search).get('wd');
    const searchValue = searchDom.value.trim();
    if (!wd && searchValue) {
      event.preventDefault();
      textareaDom.value = `${location.origin}${location.pathname}?wd=${encodeURIComponent(searchValue)}`;
      tipsDom.textContent = '↓↓↓ 复制下面的链接，教伸手党使用百度';
      outputDom.style.display = 'block';
    }
  });

  copyButton.addEventListener('click', async function(event) {
    textareaDom.select();
    try {
      await navigator.clipboard.writeText(text);
      showMessage('复制成功');
    } catch (error) {
      showMessage('复制失败，请手动复制');
    }
  });

  previewButton.addEventListener('click', function() {
    const url = textareaDom.value;
    window.open(url, '_blank');
  });

  // 箭头的移动步骤
  const moveSteps = [
    {
      x: searchDom.offsetLeft + 90,
      y: searchDom.offsetTop + searchDom.offsetHeight / 2
    },
    {
      x: submitDom.offsetLeft + 20,
      y: submitDom.offsetTop + submitDom.offsetHeight / 2
    }
  ];
  // 移动箭头到input
  arrowDom.style.left = `${moveSteps[0].x}px`;
  arrowDom.style.top = `${moveSteps[0].y}px`;
  // 移动完成后
  await delay(1000);
  // 播放水波纹
  rippleDom.style.left = `${moveSteps[0].x - 10}px`;
  rippleDom.style.top = `${moveSteps[0].y - 10}px`;
  rippleDom.style.display = 'block';
  // 隐藏水波纹
  await delay(500);
  rippleDom.style.display = 'none';
  // 使input获取焦点
  searchDom.focus();
  // 获取url中的wd参数
  const wd = new URLSearchParams(location.search).get('wd');
  if (!wd) {
    document.querySelector('.tips').style.display = 'block';
    return;
  }
  let i = 0;
  // 模拟输入
  const timer = setInterval(async function() {
    searchDom.value += wd[i];
    i++;
    if (i >= wd.length) {
      clearInterval(timer);
      // 移动箭头到button
      arrowDom.style.left = `${moveSteps[1].x}px`;
      arrowDom.style.top = `${moveSteps[1].y}px`;
      await delay(1000);
      // 播放水波纹
      rippleDom.style.left = `${moveSteps[1].x - 10}px`;
      rippleDom.style.top = `${moveSteps[1].y - 10}px`;
      rippleDom.style.display = 'block';
      // 隐藏水波纹
      await delay(500);
      rippleDom.style.display = 'none';
      // 点击button
      document.querySelector('input[type="submit"]').click();
    }
  }, 300);

  // 显示停止按钮
  const stopMessage = document.querySelector('.stop');
  stopMessage.style.display = 'block';
  stopMessage.addEventListener('click', function(event) {
    // 清空URL参数
    history.replaceState(null, document.title, location.pathname);
    // 终止输入过程
    clearInterval(timer);
    // 隐藏停止按钮
    stopMessage.style.display = 'none';
    // 显示提示信息
    tipsDom.style.display = 'block';
    // 清空输入框
    searchDom.value = '';
    searchDom.focus();
  });
}
