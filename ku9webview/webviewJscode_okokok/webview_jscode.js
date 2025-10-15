// 保存画面比例设置
function saveScaleType(scaletype) {
    localStorage.setItem('scaleType', scaletype);
}

// 恢复画面比例设置
function restoreScaleType() {
    const scaletype = localStorage.getItem('scaleType');
    if (scaletype!== null) {
        setscale(parseInt(scaletype));
    }
}

// 模拟切换频道函数
function switchChannel() {
    const currentScaleType = localStorage.getItem('scaleType');
    if (currentScaleType!== null) {
        saveScaleType(currentScaleType);
    }
    // 这里可以添加实际的切换频道逻辑
    console.log('频道已切换');
    // 恢复之前的比例设置
    restoreScaleType();
}

// 增强版Shadow DOM查询
function getVideoParentShadowRoots() {
    const walker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
        if (node.shadowRoot) {
            // 递归查询Shadow DOM
            const deepFind = (root) => {
                const innerWalker = root.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
                let innerNode;
                while ((innerNode = innerWalker.nextNode())) {
                    if (innerNode.shadowRoot) {
                        const video = innerNode.shadowRoot.querySelector('video');
                        if (video) return video;
                        const result = deepFind(innerNode.shadowRoot);
                        if (result) return result;
                    }
                }
                return null;
            };

            const video = deepFind(node.shadowRoot);
            if (video) return video;
        }
    }
    return null;
}

// 增强控制栏移除
function removeControls() {
    const selectors = [
        '#control_bar', '.controls',
        '.vjs-control-bar', 'xg-controls',
        // 新增成都电视台专用选择器
        '.xgplayer-ads', '.fixed-layer',
        'div[style*="z-index: 9999"]'
    ];
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(e => {
            e.style.display = 'none';
            e.parentNode?.removeChild(e);
        });
    });
}

// 改良版全屏容器设置
function setupVideo(video, objectFitValue) {
    const container = document.createElement('div');
    // 移动端适配样式
    container.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 2147483647 !important;
        background: black !important;
        overflow: hidden !important;
        transform: translateZ(0);
    `;

    // 视频样式优化
    video.style.cssText = `
        width: ${widthValue} !important;
        height: 100% !important;
        object-fit: ${objectFitValue} !important;
        aspect-ratio: ${aspectratioValue} !important;
        position: absolute !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
    `;

    document.body.appendChild(container);
    container.appendChild(video);

    // 智能全屏触发
    const enterFullscreen = () => {
        const fullscreenElem = container.requestFullscreen ? container : video;
        const requestFS = fullscreenElem.requestFullscreen ||
            fullscreenElem.webkitRequestFullscreen ||
            fullscreenElem.mozRequestFullScreen;

        if (requestFS) {
            requestFS.call(fullscreenElem).catch(() => {
                // 备用全屏方案
                container.style.width = `${window.innerWidth}px`;
                container.style.height = `${window.innerHeight}px`;
            });
        }
        video.volume = 1;
    };

    // 执行流程
    setTimeout(enterFullscreen, 300);
}

// 优化版检测函数（保持原有检测结构）
function checkVideo() {
    const startTime = Date.now();
    if (Date.now() - startTime > 15000) {
        clearInterval(interval);
        return;
    }

    let video = document.querySelector('video') || getVideoParentShadowRoots();

    if (video && video.readyState > 0) {
        clearInterval(interval);
        removeControls();
        const scaletype = localStorage.getItem('scaleType');
        let objectFitValue;
        switch (parseInt(scaletype)) {
            case 0:
            objectFitValue = 'fill';
                aspectratioValue ='none';
                widthValue = '100%';
            case 3:
                objectFitValue = 'fill';
                aspectratioValue ='none';
                widthValue = '100%';
                break;
            case 1:
                objectFitValue = 'contain';
                aspectratioValue ='16/9';
                widthValue = '100%';
               break;
            case 2:
                objectFitValue = 'fill';
                aspectratioValue ='4/3';
                widthValue = 'auto';
                break;
            case 4:
                objectFitValue = 'none';
                aspectratioValue ='none';
                widthValue = '100%';
                break;
            case 5:
                objectFitValue = 'cover';
                aspectratioValue ='none';
                widthValue = '100%';
                break;
            default:
                objectFitValue = 'fill';
                aspectratioValue ='none';
                widthValue = '100%';
        }
        setupVideo(video, objectFitValue);
    }
    if (video && video.paused) video.play();

}

// 启动检测
const interval = setInterval(checkVideo, 100);

// 新增移动端适配
const viewportMeta = document.createElement('meta');
viewportMeta.name = "viewport";
viewportMeta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
document.head.appendChild(viewportMeta);

function setscale(scaletype) {
    saveScaleType(scaletype);
    let objectFitValue;
    switch (scaletype) {
        case 0: // 默认
            objectFitValue = 'fill';
            aspectratioValue ='none';
            widthValue = '100%';
            break;
        case 1: // 16:9
            objectFitValue = 'contain';
            aspectratioValue ='16/9';
            widthValue = '100%';
            break;
        case 2: // 4:3
            // 这里可以添加4:3比例的具体样式逻辑
            aspectratioValue ='4/3';
            objectFitValue = 'fill';
            widthValue = 'auto';
            break;
        case 3: // 填充
            objectFitValue = 'fill';
            aspectratioValue ='none';
            widthValue = '100%';
            break;
        case 4: // 原始
            objectFitValue = 'none';
            aspectratioValue ='none';
            widthValue = '100%';
            break;
        case 5: // 裁剪
            objectFitValue = 'cover';
            aspectratioValue ='none';
            widthValue = '100%';
            break;
    }
    let video = document.querySelector('video') || getVideoParentShadowRoots();
    if (video && video.readyState > 0) {
        removeControls();
        setupVideo(video, objectFitValue);
    }
}

// 在页面加载时调用 restoreScaleType 函数
window.onload = function () {
    restoreScaleType();
};
    