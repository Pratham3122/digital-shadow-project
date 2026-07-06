/* ============================================
   Digital Shadow — Linked List Visualization
   Interactive animated linked list engine
   ============================================ */

(function () {
  'use strict';

  var container = document.getElementById('ll-viz-container');
  var statusEl = document.getElementById('ll-status');
  if (!container) return;

  var nodeIdCounter = 0;
  var nodes = [];
  var isAnimating = false;

  var CATEGORIES = {
    Phone: '📱', Travel: '🚗', College: '🎓', WiFi: '📶',
    Payment: '💳', App: '📲', Study: '📚', Work: '💼'
  };

  var CAT_COLORS = {
    Phone: '#7c5cff', Travel: '#00d4aa', College: '#ffb800',
    WiFi: '#00b4d8', Payment: '#ff4d6a', App: '#9d7dff',
    Study: '#00d4aa', Work: '#ff8c42'
  };

  function init() {
    var defaults = [
      { name: 'Phone Unlocked', category: 'Phone' },
      { name: 'Left Home', category: 'Travel' },
      { name: 'Entered College', category: 'College' },
      { name: 'Connected WiFi', category: 'WiFi' }
    ];
    defaults.forEach(function (d) {
      addNodeInternal(d.name, d.category, false);
    });
    render();
  }

  function addNodeInternal(name, category, animate) {
    nodeIdCounter++;
    nodes.push({
      id: nodeIdCounter,
      name: name,
      category: category || 'Phone',
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      animate: animate
    });
  }

  function render() {
    container.innerHTML = '';

    if (nodes.length === 0) {
      container.innerHTML = '<div class="ll-empty">Linked List is empty. Add a node to begin.</div>';
      updateStatus();
      return;
    }

    var headLabel = document.createElement('div');
    headLabel.className = 'll-head-label';
    headLabel.textContent = 'HEAD';
    container.appendChild(headLabel);

    nodes.forEach(function (node, index) {
      var nodeEl = document.createElement('div');
      nodeEl.className = 'll-node' + (node.animate ? ' ll-node-enter' : '');
      nodeEl.id = 'll-node-' + node.id;
      nodeEl.setAttribute('data-id', node.id);
      nodeEl.style.borderColor = CAT_COLORS[node.category] || '#7c5cff';

      nodeEl.innerHTML =
        '<div class="ll-node-data">' +
          '<div class="ll-node-icon">' + (CATEGORIES[node.category] || '📌') + '</div>' +
          '<div class="ll-node-info">' +
            '<span class="ll-node-name">' + node.name + '</span>' +
            '<span class="ll-node-meta">' + node.category + ' · ' + node.time + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="ll-node-pointer">' +
          '<span class="ll-node-id">ID: ' + node.id + '</span>' +
          '<span class="ll-node-next">' + (index < nodes.length - 1 ? 'next →' : 'NULL') + '</span>' +
        '</div>';

      container.appendChild(nodeEl);

      if (index < nodes.length - 1) {
        var arrow = document.createElement('div');
        arrow.className = 'll-arrow';
        arrow.innerHTML = '<svg width="40" height="20" viewBox="0 0 40 20"><path d="M0 10 L30 10 M25 4 L32 10 L25 16" stroke="var(--primary, #7c5cff)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
        container.appendChild(arrow);
      }
    });

    var nullEl = document.createElement('div');
    nullEl.className = 'll-null';
    nullEl.textContent = 'NULL';
    container.appendChild(nullEl);

    updateStatus();

    setTimeout(function () {
      container.querySelectorAll('.ll-node-enter').forEach(function (el) {
        el.classList.remove('ll-node-enter');
      });
    }, 50);
  }

  function updateStatus() {
    if (!statusEl) return;
    statusEl.textContent = 'Nodes: ' + nodes.length + ' | Head: ' + (nodes.length ? nodes[0].name : 'NULL') + ' | Tail: ' + (nodes.length ? nodes[nodes.length - 1].name : 'NULL');
  }

  window.LLViz = {
    insertNode: function (name, category) {
      if (isAnimating) return;
      addNodeInternal(name || 'New Event', category || 'Phone', true);
      render();
    },

    deleteNode: function (id) {
      if (isAnimating) return;
      var targetId = id;
      if (!targetId && nodes.length > 0) {
        targetId = nodes[nodes.length - 1].id;
      }
      var nodeEl = document.getElementById('ll-node-' + targetId);
      if (nodeEl) {
        isAnimating = true;
        nodeEl.classList.add('ll-node-exit');
        setTimeout(function () {
          nodes = nodes.filter(function (n) { return n.id !== targetId; });
          render();
          isAnimating = false;
        }, 400);
      }
    },

    searchNode: function (query) {
      if (isAnimating || !query) return;
      isAnimating = true;
      var allNodes = container.querySelectorAll('.ll-node');
      var foundIndex = -1;

      nodes.forEach(function (n, i) {
        if (n.name.toLowerCase().includes(query.toLowerCase())) {
          foundIndex = i;
        }
      });

      var delay = 0;
      allNodes.forEach(function (el, i) {
        setTimeout(function () {
          allNodes.forEach(function (e) { e.classList.remove('ll-node-searching', 'll-node-found'); });
          if (i === foundIndex) {
            el.classList.add('ll-node-found');
            isAnimating = false;
          } else {
            el.classList.add('ll-node-searching');
            if (i === allNodes.length - 1 && foundIndex === -1) {
              setTimeout(function () {
                allNodes.forEach(function (e) { e.classList.remove('ll-node-searching'); });
                isAnimating = false;
              }, 500);
            }
          }
        }, delay);
        delay += 500;
      });
    },

    traverseAll: function () {
      if (isAnimating) return;
      isAnimating = true;
      var allNodes = container.querySelectorAll('.ll-node');
      var delay = 0;

      allNodes.forEach(function (el, i) {
        setTimeout(function () {
          allNodes.forEach(function (e) { e.classList.remove('ll-node-traversing'); });
          el.classList.add('ll-node-traversing');
          if (i === allNodes.length - 1) {
            setTimeout(function () {
              allNodes.forEach(function (e) { e.classList.remove('ll-node-traversing'); });
              isAnimating = false;
            }, 600);
          }
        }, delay);
        delay += 400;
      });
    },

    getNodes: function () { return nodes.slice(); },
    getCount: function () { return nodes.length; }
  };

  init();
})();
