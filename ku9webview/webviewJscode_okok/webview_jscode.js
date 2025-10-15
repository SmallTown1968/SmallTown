(function(){
    const startTime = Date.now();
    let currentVideo = null; // 存储当前视频元素

    // 增强版Shadow DOM查询
    function getVideoParentShadowRoots() {
        const walker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT);
        let node;
        while ((node = walker.nextNode())) {
            if (node.shadowRoot) {
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

    // 视频比例设置函数
    function setscale(scaletype) {
        if (!currentVideo) return;
        
        const container = currentVideo.parentElement;
        const baseStyle = `
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
        `;

        switch (scaletype) {
            case 0: // 默认（填充）
                currentVideo.style.cssText = baseStyle + `
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: fill !important;
                `;
                break;

            case 1: // 16:9
                currentVideo.style.cssText = baseStyle + `
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: contain !important;
                    aspect-ratio: 16/9 !important;
                `;
                break;

            case 2: // 4:3
                currentVideo.style.cssText = baseStyle + `
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: contain !important;
                    aspect-ratio: 4/3 !important;
                `;
                break;

            case 3: // 填充（拉伸）
                currentVideo.style.cssText = baseStyle + `
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: fill !important;
                `;
                break;

            case 4: // 原始比例
                const naturalRatio = currentVideo.videoWidth / currentVideo.videoHeight;
                currentVideo.style.cssText = baseStyle + `
                    width: auto !important;
                    height: auto !important;
                    max-width: 100% !important;
                    max-height: 100% !important;
                    object-fit: contain !important;
                    aspect-ratio: ${naturalRatio} !important;
                `;
                break;

            case 5: // 裁剪
                currentVideo.style.cssText = baseStyle + `
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                    aspect-ratio: 16/9 !important;
                `;
                break;
        }
    }

    // 全屏容器设置
    function setupVideo(video) {
        currentVideo = video; // 存储当前视频引用
        
        const container = document.createElement('div');
        container.id = 'video-fullscreen-container';
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

        // 设置默认比例
        setscale(5); // 默认使用填充模式

        document.body.appendChild(container);
        container.appendChild(video);

        // 自动播放处理
        const tryPlay = () => {
            if (video.paused) {
                video.play().catch(() => {
                    video.muted = false;
                    video.play();
                });
            }
        };

        // 全屏功能
        const enterFullscreen = () => {
            const fullscreenElem = container.requestFullscreen ? container : video;
            const requestFS = fullscreenElem.requestFullscreen || 
                            fullscreenElem.webkitRequestFullscreen || 
                            fullscreenElem.mozRequestFullScreen;

            if(requestFS) {
                requestFS.call(fullscreenElem).catch(() => {
                    container.style.width = `${window.innerWidth}px`;
                    container.style.height = `${window.innerHeight}px`;
                });
            }
            video.volume = 1;
        };
        
        setTimeout(() => {
            tryPlay();
            enterFullscreen();
        }, 300);
    }

    // 视频检测
    function checkVideo() {
        if (Date.now() - startTime > 15000) {
            clearInterval(interval);
            return;
        }

        let video = document.querySelector('video') || getVideoParentShadowRoots();

        if (video && video.readyState > 0) {
            clearInterval(interval);
            removeControls();
            setupVideo(video);

            if (video.muted || video.volume === 0) {
                video.muted = false;
                video.volume = 1.0;
            }
        }
    }

    // 启动检测
    const interval = setInterval(checkVideo, 100);

    // 移动端适配
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = "viewport";
    viewportMeta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    document.head.appendChild(viewportMeta);

    // 暴露API到全局
    window.videoScaler = {
        setScale: setscale,
        getCurrentVideo: () => currentVideo
    };
})();