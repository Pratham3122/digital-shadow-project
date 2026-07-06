/* ============================================================
   animations.js — Shared Animation Utilities
   Digital Shadow — Premium Animation Engine
   ============================================================ */

'use strict';

const DSAnimations = (() => {

  /* ---------- EASING FUNCTIONS ---------- */
  const easing = {
    linear: t => t,
    easeOutCubic: t => 1 - Math.pow(1 - t, 3),
    easeOutQuart: t => 1 - Math.pow(1 - t, 4),
    easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeOutBack: t => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    spring: t => {
      const c4 = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
  };

  /* ---------- animateCounter ---------- */
  function animateCounter(element, target, duration = 1500) {
    return new Promise(resolve => {
      if (!element) { resolve(); return; }
      const start = performance.now();
      const startVal = 0;
      const isFloat = target % 1 !== 0;

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing.easeOutExpo(progress);
        const current = startVal + (target - startVal) * easedProgress;

        if (isFloat) {
          element.textContent = current.toFixed(1);
        } else {
          element.textContent = Math.round(current).toLocaleString();
        }

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          element.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
          resolve();
        }
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------- animateProgressBar ---------- */
  function animateProgressBar(element, targetPercent, duration = 1200) {
    return new Promise(resolve => {
      if (!element) { resolve(); return; }
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing.easeOutCubic(progress);
        const currentWidth = targetPercent * easedProgress;

        element.style.width = currentWidth + '%';

        const label = element.querySelector('.progress-label');
        if (label) {
          label.textContent = Math.round(currentWidth) + '%';
        }

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          element.style.width = targetPercent + '%';
          if (label) label.textContent = Math.round(targetPercent) + '%';
          resolve();
        }
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------- typeWriter ---------- */
  function typeWriter(element, text, speed = 40) {
    return new Promise(resolve => {
      if (!element) { resolve(); return; }
      element.textContent = '';
      let index = 0;

      function type() {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      }
      type();
    });
  }

  /* ---------- staggerReveal ---------- */
  function staggerReveal(elements, delay = 100) {
    return new Promise(resolve => {
      if (!elements || elements.length === 0) { resolve(); return; }
      const arr = Array.from(elements);
      let completed = 0;

      arr.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s cubic-bezier(0.4,0,0.2,1) ${i * delay}ms, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * delay}ms`;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
        });

        setTimeout(() => {
          completed++;
          if (completed >= arr.length) resolve();
        }, 600 + i * delay);
      });
    });
  }

  /* ---------- pulseElement ---------- */
  function pulseElement(element) {
    return new Promise(resolve => {
      if (!element) { resolve(); return; }
      element.style.transition = 'transform 0.15s ease-out';
      element.style.transform = 'scale(1.08)';

      setTimeout(() => {
        element.style.transform = 'scale(0.97)';
        setTimeout(() => {
          element.style.transition = 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)';
          element.style.transform = 'scale(1)';
          setTimeout(resolve, 250);
        }, 100);
      }, 150);
    });
  }

  /* ---------- shakeElement ---------- */
  function shakeElement(element) {
    return new Promise(resolve => {
      if (!element) { resolve(); return; }
      const keyframes = [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(-3px)' },
        { transform: 'translateX(3px)' },
        { transform: 'translateX(0)' }
      ];

      const anim = element.animate(keyframes, {
        duration: 500,
        easing: 'ease-out'
      });
      anim.onfinish = resolve;
    });
  }

  /* ---------- slideIn ---------- */
  function slideIn(element, direction = 'left') {
    return new Promise(resolve => {
      if (!element) { resolve(); return; }
      const transforms = {
        left:   { from: 'translateX(-60px)', to: 'translateX(0)' },
        right:  { from: 'translateX(60px)',  to: 'translateX(0)' },
        up:     { from: 'translateY(60px)',  to: 'translateY(0)' },
        down:   { from: 'translateY(-60px)', to: 'translateY(0)' }
      };

      const t = transforms[direction] || transforms.left;
      element.style.opacity = '0';
      element.style.transform = t.from;
      element.style.transition = 'none';

      requestAnimationFrame(() => {
        element.style.transition = 'opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
        element.style.opacity = '1';
        element.style.transform = t.to;
        setTimeout(resolve, 600);
      });
    });
  }

  /* ---------- fadeInOut ---------- */
  function fadeInOut(element, duration = 2000) {
    return new Promise(resolve => {
      if (!element) { resolve(); return; }
      const half = duration / 2;
      element.style.opacity = '0';
      element.style.transition = `opacity ${half}ms ease-in`;

      requestAnimationFrame(() => {
        element.style.opacity = '1';
        setTimeout(() => {
          element.style.transition = `opacity ${half}ms ease-out`;
          element.style.opacity = '0';
          setTimeout(resolve, half);
        }, half);
      });
    });
  }

  /* ---------- rippleEffect ---------- */
  function rippleEffect(event) {
    return new Promise(resolve => {
      const target = event.currentTarget || event.target;
      if (!target) { resolve(); return; }

      const rect = target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const maxDim = Math.max(rect.width, rect.height);

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDim * 2}px;
        height: ${maxDim * 2}px;
        left: ${x - maxDim}px;
        top: ${y - maxDim}px;
        background: radial-gradient(circle, rgba(124,92,255,0.35) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        opacity: 1;
        pointer-events: none;
        z-index: 1;
      `;

      const pos = getComputedStyle(target).position;
      if (pos === 'static') target.style.position = 'relative';
      target.style.overflow = 'hidden';
      target.appendChild(ripple);

      const anim = ripple.animate([
        { transform: 'scale(0)', opacity: 1 },
        { transform: 'scale(1)', opacity: 0 }
      ], {
        duration: 600,
        easing: 'ease-out'
      });

      anim.onfinish = () => {
        ripple.remove();
        resolve();
      };
    });
  }

  /* ---------- morphNumber ---------- */
  function morphNumber(element, from, to, duration = 800) {
    return new Promise(resolve => {
      if (!element) { resolve(); return; }
      const start = performance.now();
      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing.easeOutExpo(progress);
        const current = from + (to - from) * easedProgress;
        element.textContent = Math.round(current).toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          element.textContent = to.toLocaleString();
          resolve();
        }
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------- glowPulse ---------- */
  function glowPulse(element, color = 'rgba(124,92,255,0.4)', count = 2) {
    return new Promise(resolve => {
      if (!element) { resolve(); return; }
      let iteration = 0;
      function pulse() {
        element.style.transition = 'box-shadow 0.4s ease-in';
        element.style.boxShadow = `0 0 25px ${color}, 0 0 50px ${color}`;
        setTimeout(() => {
          element.style.transition = 'box-shadow 0.4s ease-out';
          element.style.boxShadow = 'none';
          iteration++;
          if (iteration < count) {
            setTimeout(pulse, 200);
          } else {
            element.style.boxShadow = '';
            element.style.transition = '';
            resolve();
          }
        }, 400);
      }
      pulse();
    });
  }

  /* ---------- Public API ---------- */
  return {
    animateCounter,
    animateProgressBar,
    typeWriter,
    staggerReveal,
    pulseElement,
    shakeElement,
    slideIn,
    fadeInOut,
    rippleEffect,
    morphNumber,
    glowPulse,
    easing
  };

})();

/* Global convenience aliases */
const animateCounter    = DSAnimations.animateCounter;
const animateProgressBar = DSAnimations.animateProgressBar;
const typeWriter        = DSAnimations.typeWriter;
const staggerReveal     = DSAnimations.staggerReveal;
const pulseElement      = DSAnimations.pulseElement;
const shakeElement      = DSAnimations.shakeElement;
const slideIn           = DSAnimations.slideIn;
const fadeInOut          = DSAnimations.fadeInOut;
const rippleEffect      = DSAnimations.rippleEffect;
