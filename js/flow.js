/* ============================================
   Digital Shadow — Flowchart Animations
   SVG line drawing + interactive highlighting
   ============================================ */

(function () {
  'use strict';

  var svg = document.getElementById('flowchart-svg');
  if (!svg) return;

  function animateLines() {
    var paths = svg.querySelectorAll('.flow-connector');
    paths.forEach(function (path, i) {
      var length = path.getTotalLength ? path.getTotalLength() : 200;
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.animation = 'flowDraw 0.8s ease forwards';
      path.style.animationDelay = (i * 0.15) + 's';
    });
  }

  function animateBoxes() {
    var boxes = svg.querySelectorAll('.flow-box, .flow-diamond, .flow-terminal');
    boxes.forEach(function (box, i) {
      box.style.opacity = '0';
      box.style.animation = 'flowFadeIn 0.5s ease forwards';
      box.style.animationDelay = (i * 0.12) + 's';
    });
  }

  function initHoverEffects() {
    var nodes = svg.querySelectorAll('[data-operation]');
    nodes.forEach(function (node) {
      node.style.cursor = 'pointer';
      node.addEventListener('mouseenter', function () {
        this.classList.add('flow-highlight');
      });
      node.addEventListener('mouseleave', function () {
        this.classList.remove('flow-highlight');
      });
    });
  }

  var style = document.createElement('style');
  style.textContent =
    '@keyframes flowDraw{to{stroke-dashoffset:0}}' +
    '@keyframes flowFadeIn{to{opacity:1}}' +
    '.flow-highlight rect,.flow-highlight polygon{filter:drop-shadow(0 0 12px rgba(124,92,255,0.6));stroke:var(--primary,#7c5cff)!important;stroke-width:3!important}' +
    '.flow-highlight text{fill:var(--primary,#7c5cff)!important}';
  document.head.appendChild(style);

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateBoxes();
        animateLines();
        initHoverEffects();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(svg);
})();
