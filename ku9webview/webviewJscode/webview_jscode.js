(function(){
    const startTime = Date.now();

    function getVideoParentShadowRoots() {
      const allElements = document.querySelectorAll('*');
      for (const element of allElements) {
        const shadowRoot = element.shadowRoot;
        if (shadowRoot) {
          const video = shadowRoot.querySelector('video');
          if (video) return video;
        }
      }
      return null;
    }

    function removeControls() {
      ['#control_bar', '.controls', '.vjs-control-bar', 'xg-controls'].forEach(selector => {
        document.querySelectorAll(selector).forEach(e => e.remove());
      });
    }

    function setupVideo(video) {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100vw';
      container.style.height = '100vh';
      container.style.zIndex = '2147483647';
      container.style.backgroundColor = 'black';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'fill';
      video.style.transform = 'translateZ(0)';
      container.appendChild(video);
      document.body.appendChild(container);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const enterFullscreen = () => {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        }
        const fullscreenStyle = () => {
          video.style.objectFit = 'contain';
          container.style.width = '100%';
          container.style.height = '100%';
        };
        container.addEventListener('fullscreenchange', fullscreenStyle);
      };

      setTimeout(enterFullscreen, 300);
    }

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
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        }
      }
     if (video.paused) video.play();

     if (video.muted || video.volume === 0) {
     video.muted = false;
     video.volume = 1.0;
     };

    }

    const interval = setInterval(checkVideo, 100);
  })();