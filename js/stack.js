/* ============================================
   Digital Shadow — Stack Visualization
   Interactive animated stack engine
   ============================================ */

(function () {
  'use strict';

  var container = document.getElementById('stack-viz-container');
  var statusEl = document.getElementById('stack-status');
  var logEl = document.getElementById('stack-log');
  if (!container) return;

  var stack = [];
  var isAnimating = false;
  var stackIdCounter = 0;

  var CATEGORIES = {
    Phone: '📱', Travel: '🚗', College: '🎓', WiFi: '📶',
    Payment: '💳', App: '📲', Study: '📚', Work: '💼'
  };

  var CAT_COLORS = {
    Phone: '#7c5cff', Travel: '#00d4aa', College: '#ffb800',
    WiFi: '#00b4d8', Payment: '#ff4d6a', App: '#9d7dff',
    Study: '#00d4aa', Work: '#ff8c42'
  };

  function render() {
    container.innerHTML = '';

    if (stack.length === 0) {
      container.innerHTML = '<div class="stack-empty">Stack is empty</div>';
      updateStatus();
      return;
    }

    var topLabel = document.createElement('div');
    topLabel.className = 'stack-top-label';
    topLabel.textContent = '← TOP';
    container.insertBefore(topLabel, container.firstChild);

    for (var i = stack.length - 1; i >= 0; i--) {
      var item = stack[i];
      var block = document.createElement('div');
      block.className = 'stack-block' + (item.animate ? ' stack-block-enter' : '');
      block.id = 'stack-block-' + item.id;
      block.style.borderLeftColor = CAT_COLORS[item.category] || '#7c5cff';

      block.innerHTML =
        '<span class="stack-block-icon">' + (CATEGORIES[item.category] || '📌') + '</span>' +
        '<span class="stack-block-name">' + item.name + '</span>' +
        '<span class="stack-block-cat">' + item.category + '</span>';

      container.appendChild(block);
    }

    var bottomLabel = document.createElement('div');
    bottomLabel.className = 'stack-bottom-bar';
    bottomLabel.textContent = '━━━ BOTTOM ━━━';
    container.appendChild(bottomLabel);

    updateStatus();

    setTimeout(function () {
      container.querySelectorAll('.stack-block-enter').forEach(function (el) {
        el.classList.remove('stack-block-enter');
      });
    }, 50);
  }

  function updateStatus() {
    if (!statusEl) return;
    statusEl.textContent = 'Size: ' + stack.length + ' | Top: ' + (stack.length ? stack[stack.length - 1].name : 'Empty');
  }

  function log(msg) {
    if (!logEl) return;
    var entry = document.createElement('div');
    entry.className = 'stack-log-entry';
    entry.innerHTML = '<span class="stack-log-time">' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '</span> ' + msg;
    logEl.insertBefore(entry, logEl.firstChild);
    if (logEl.children.length > 20) {
      logEl.removeChild(logEl.lastChild);
    }
  }

  window.StackViz = {
    push: function (name, category) {
      if (isAnimating) return;
      stackIdCounter++;
      stack.push({
        id: stackIdCounter,
        name: name || 'Event',
        category: category || 'Phone',
        animate: true
      });
      render();
      log('⬆️ <strong>PUSH</strong>: ' + name);
    },

    pop: function () {
      if (isAnimating || stack.length === 0) return null;
      isAnimating = true;
      var top = stack[stack.length - 1];
      var topEl = document.getElementById('stack-block-' + top.id);

      if (topEl) {
        topEl.classList.add('stack-block-exit');
        setTimeout(function () {
          stack.pop();
          render();
          isAnimating = false;
        }, 400);
      } else {
        stack.pop();
        render();
        isAnimating = false;
      }

      log('⬇️ <strong>POP</strong>: ' + top.name);
      return top;
    },

    replayAll: function (events) {
      if (isAnimating) return;
      isAnimating = true;
      stack = [];
      render();
      log('🔁 <strong>REPLAY</strong>: Starting...');

      var items = events || [];
      var i = 0;

      function pushNext() {
        if (i < items.length) {
          stackIdCounter++;
          stack.push({
            id: stackIdCounter,
            name: items[i].name,
            category: items[i].category || 'Phone',
            animate: true
          });
          render();
          log('⬆️ Push: ' + items[i].name);
          i++;
          setTimeout(pushNext, 500);
        } else {
          log('✅ <strong>REPLAY COMPLETE</strong>: ' + items.length + ' events pushed');
          isAnimating = false;
        }
      }
      setTimeout(pushNext, 300);
    },

    undoLast: function () {
      if (stack.length === 0) {
        log('⚠️ Stack empty — nothing to undo');
        return null;
      }
      var item = this.pop();
      if (item) {
        log('↩️ <strong>UNDO</strong>: ' + item.name);
      }
      return item;
    },

    clear: function () {
      stack = [];
      render();
      log('🗑️ Stack cleared');
    },

    getStack: function () { return stack.slice(); },
    getSize: function () { return stack.length; },
    peek: function () { return stack.length ? stack[stack.length - 1] : null; }
  };

  render();
})();
