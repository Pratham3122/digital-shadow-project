/* ============================================================
   visualization.js — Interactive Playground Engine
   Digital Shadow — Linked List + Stack Visualization
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     CATEGORY METADATA
     ================================================================ */
  const CATEGORIES = {
    'Phone':   { icon: '📱', color: '#7c5cff' },
    'Travel':  { icon: '✈️', color: '#00d4aa' },
    'College': { icon: '🎓', color: '#ffb800' },
    'WiFi':    { icon: '📶', color: '#00b4d8' },
    'Payment': { icon: '💳', color: '#ff4d6a' },
    'App':     { icon: '📲', color: '#ff6b35' },
    'Study':   { icon: '📖', color: '#b8c0ff' },
    'Work':    { icon: '💼', color: '#06d6a0' }
  };

  /* ================================================================
     DATA STRUCTURES
     ================================================================ */
  class LLNode {
    constructor(name, category) {
      this.name = name;
      this.category = category;
      this.time = new Date();
      this.id = 'node-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    }
  }

  /* Linked List */
  let linkedList = [];

  /* Stack */
  let stack = [];

  /* Operation log */
  let opLog = [];

  /* ================================================================
     ELEMENTS
     ================================================================ */
  const eventNameInput   = document.getElementById('event-name');
  const categorySelect   = document.getElementById('event-category');
  const addBtn           = document.getElementById('btn-add');
  const deleteBtn        = document.getElementById('btn-delete');
  const replayBtn        = document.getElementById('btn-replay');
  const undoBtn          = document.getElementById('btn-undo');
  const statsBtn         = document.getElementById('btn-stats');
  const llContainer      = document.getElementById('ll-container');
  const stackContainer   = document.getElementById('stack-container');
  const timelineContainer= document.getElementById('ht-timeline');
  const logContainer     = document.getElementById('op-log');
  const counterEl        = document.getElementById('event-counter');
  const statsPanel       = document.getElementById('stats-panel');

  /* ================================================================
     UTILITY
     ================================================================ */
  function formatTime(d) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  }

  function getMeta(cat) {
    return CATEGORIES[cat] || { icon: '📌', color: '#8888aa' };
  }

  function updateCounter() {
    if (counterEl) {
      const target = linkedList.length;
      if (typeof DSAnimations !== 'undefined') {
        DSAnimations.morphNumber(counterEl, parseInt(counterEl.textContent) || 0, target, 400);
      } else {
        counterEl.textContent = target;
      }
    }
  }

  function logOperation(action, detail) {
    const entry = {
      time: new Date(),
      action,
      detail
    };
    opLog.unshift(entry);
    if (opLog.length > 50) opLog.pop();
    renderLog();
  }

  /* ================================================================
     LINKED LIST VISUALIZATION
     ================================================================ */
  function renderLinkedList() {
    if (!llContainer) return;
    llContainer.innerHTML = '';

    if (linkedList.length === 0) {
      llContainer.innerHTML = '<div class="ll-empty">No events yet. Add one above!</div>';
      return;
    }

    /* HEAD pointer */
    const headPtr = document.createElement('div');
    headPtr.className = 'll-pointer head-pointer';
    headPtr.innerHTML = '<span class="ptr-label">HEAD</span><span class="ptr-arrow">↓</span>';
    llContainer.appendChild(headPtr);

    const nodesWrap = document.createElement('div');
    nodesWrap.className = 'll-nodes-wrap';

    linkedList.forEach((node, index) => {
      const meta = getMeta(node.category);

      /* Node element */
      const nodeEl = document.createElement('div');
      nodeEl.className = 'll-node';
      nodeEl.id = node.id;
      nodeEl.style.setProperty('--node-color', meta.color);
      nodeEl.setAttribute('data-index', index);

      nodeEl.innerHTML = `
        <div class="ll-node-inner glass" style="border-color: ${meta.color}44;">
          <div class="ll-node-icon" style="background: ${meta.color}22;">${meta.icon}</div>
          <div class="ll-node-info">
            <span class="ll-node-name">${node.name}</span>
            <span class="ll-node-cat" style="color: ${meta.color};">${node.category}</span>
            <span class="ll-node-time">${formatTime(node.time)}</span>
          </div>
          <div class="ll-node-addr">
            <span class="ll-addr-label">next</span>
            <span class="ll-addr-val">${index < linkedList.length - 1 ? '→' : 'NULL'}</span>
          </div>
        </div>
      `;

      nodesWrap.appendChild(nodeEl);

      /* Arrow connector (except last) */
      if (index < linkedList.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'll-arrow';
        arrow.innerHTML = `
          <svg width="40" height="20" viewBox="0 0 40 20">
            <defs>
              <linearGradient id="arrowGrad${index}" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="${meta.color}"/>
                <stop offset="100%" stop-color="${getMeta(linkedList[index + 1].category).color}"/>
              </linearGradient>
            </defs>
            <line x1="0" y1="10" x2="30" y2="10" stroke="url(#arrowGrad${index})" stroke-width="2"/>
            <polygon points="30,5 40,10 30,15" fill="url(#arrowGrad${index})"/>
          </svg>
        `;
        nodesWrap.appendChild(arrow);
      }
    });

    /* NULL terminator */
    const nullTerm = document.createElement('div');
    nullTerm.className = 'll-null';
    nullTerm.innerHTML = '<span>NULL</span>';
    nodesWrap.appendChild(nullTerm);

    llContainer.appendChild(nodesWrap);
  }

  function animateNodeIn(nodeId) {
    requestAnimationFrame(() => {
      const el = document.getElementById(nodeId);
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'scale(0.5) translateY(20px)';
      el.style.transition = 'none';

      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
        el.style.opacity = '1';
        el.style.transform = 'scale(1) translateY(0)';

        if (typeof DSAnimations !== 'undefined') {
          setTimeout(() => DSAnimations.glowPulse(el.querySelector('.ll-node-inner'), getMeta(linkedList[linkedList.length - 1].category).color + '55', 1), 500);
        }
      });
    });
  }

  /* ================================================================
     STACK VISUALIZATION
     ================================================================ */
  function renderStack() {
    if (!stackContainer) return;
    stackContainer.innerHTML = '';

    if (stack.length === 0) {
      stackContainer.innerHTML = '<div class="stack-empty">Stack is empty</div>';
      return;
    }

    /* TOP pointer */
    const topPtr = document.createElement('div');
    topPtr.className = 'stack-pointer top-pointer';
    topPtr.innerHTML = '<span class="ptr-arrow">→</span><span class="ptr-label">TOP</span>';
    stackContainer.appendChild(topPtr);

    const stackWrap = document.createElement('div');
    stackWrap.className = 'stack-wrap';

    /* Render from top to bottom (stack[0] is top) */
    stack.forEach((node, index) => {
      const meta = getMeta(node.category);
      const frame = document.createElement('div');
      frame.className = 'stack-frame';
      frame.id = 'stack-' + node.id;
      frame.style.setProperty('--frame-color', meta.color);

      frame.innerHTML = `
        <div class="stack-frame-inner glass" style="border-color: ${meta.color}44;">
          <span class="stack-icon">${meta.icon}</span>
          <span class="stack-name">${node.name}</span>
          <span class="stack-time">${formatTime(node.time)}</span>
        </div>
      `;

      stackWrap.appendChild(frame);
    });

    /* Stack base */
    const base = document.createElement('div');
    base.className = 'stack-base';
    base.innerHTML = '<span>━━━ STACK BASE ━━━</span>';
    stackWrap.appendChild(base);

    stackContainer.appendChild(stackWrap);
  }

  function animateStackPush(nodeId) {
    requestAnimationFrame(() => {
      const el = document.getElementById('stack-' + nodeId);
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateX(60px) scale(0.8)';
      el.style.transition = 'none';

      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateX(0) scale(1)';
      });
    });
  }

  function animateStackPop() {
    const frames = stackContainer.querySelectorAll('.stack-frame');
    if (frames.length === 0) return Promise.resolve();
    const top = frames[0];
    return new Promise(resolve => {
      top.style.transition = 'opacity 0.3s ease, transform 0.4s ease-in';
      top.style.opacity = '0';
      top.style.transform = 'translateX(-60px) scale(0.8)';
      setTimeout(resolve, 400);
    });
  }

  /* ================================================================
     HORIZONTAL TIMELINE
     ================================================================ */
  function renderHTimeline() {
    if (!timelineContainer) return;
    timelineContainer.innerHTML = '';

    if (linkedList.length === 0) {
      timelineContainer.innerHTML = '<div class="ht-empty">Add events to see the timeline</div>';
      return;
    }

    const track = document.createElement('div');
    track.className = 'ht-track';

    const line = document.createElement('div');
    line.className = 'ht-line';
    track.appendChild(line);

    linkedList.forEach((node, index) => {
      const meta = getMeta(node.category);
      const marker = document.createElement('div');
      marker.className = 'ht-marker';
      marker.style.setProperty('--marker-color', meta.color);

      marker.innerHTML = `
        <div class="ht-dot" style="background: ${meta.color}; box-shadow: 0 0 10px ${meta.color}55;"></div>
        <div class="ht-label ${index % 2 === 0 ? 'ht-above' : 'ht-below'}">
          <span class="ht-name">${node.name}</span>
          <span class="ht-time">${formatTime(node.time)}</span>
        </div>
      `;

      track.appendChild(marker);
    });

    timelineContainer.appendChild(track);

    /* Scroll to latest */
    requestAnimationFrame(() => {
      timelineContainer.scrollLeft = timelineContainer.scrollWidth;
    });
  }

  /* ================================================================
     OPERATION LOG
     ================================================================ */
  function renderLog() {
    if (!logContainer) return;
    logContainer.innerHTML = '';

    if (opLog.length === 0) {
      logContainer.innerHTML = '<div class="log-empty">No operations yet</div>';
      return;
    }

    opLog.slice(0, 15).forEach((entry, index) => {
      const row = document.createElement('div');
      row.className = 'log-entry';
      if (index === 0) row.classList.add('log-latest');

      const actionColors = {
        'ADD':    '#00d4aa',
        'DELETE': '#ff4d6a',
        'REPLAY': '#7c5cff',
        'UNDO':   '#ffb800',
        'STATS':  '#00b4d8'
      };

      const color = actionColors[entry.action] || '#8888aa';

      row.innerHTML = `
        <span class="log-time">${formatTime(entry.time)}</span>
        <span class="log-action" style="color: ${color}; border-color: ${color}33;">${entry.action}</span>
        <span class="log-detail">${entry.detail}</span>
      `;

      logContainer.appendChild(row);
    });
  }

  /* ================================================================
     STATISTICS PANEL
     ================================================================ */
  function showStatsPanel() {
    if (!statsPanel) return;

    const cats = {};
    linkedList.forEach(n => { cats[n.category] = (cats[n.category] || 0) + 1; });

    let mostFreq = { name: 'None', count: 0 };
    for (const [c, count] of Object.entries(cats)) {
      if (count > mostFreq.count) mostFreq = { name: c, count };
    }

    const first = linkedList[0];
    const last  = linkedList[linkedList.length - 1];

    statsPanel.innerHTML = `
      <div class="mini-stat"><span class="mini-label">Total</span><span class="mini-value">${linkedList.length}</span></div>
      <div class="mini-stat"><span class="mini-label">Stack Size</span><span class="mini-value">${stack.length}</span></div>
      <div class="mini-stat"><span class="mini-label">Top Category</span><span class="mini-value">${mostFreq.name} (${mostFreq.count})</span></div>
      ${first ? `<div class="mini-stat"><span class="mini-label">First</span><span class="mini-value">${first.name}</span></div>` : ''}
      ${last ? `<div class="mini-stat"><span class="mini-label">Last</span><span class="mini-value">${last.name}</span></div>` : ''}
      <div class="mini-stat"><span class="mini-label">Operations</span><span class="mini-value">${opLog.length}</span></div>
    `;

    statsPanel.classList.toggle('visible');
    if (typeof DSAnimations !== 'undefined') {
      DSAnimations.staggerReveal(statsPanel.querySelectorAll('.mini-stat'), 80);
    }
  }

  /* ================================================================
     ACTIONS
     ================================================================ */

  /* ADD EVENT */
  function addEvent(name, category) {
    if (!name || !name.trim()) {
      if (eventNameInput && typeof DSAnimations !== 'undefined') {
        DSAnimations.shakeElement(eventNameInput);
      }
      return;
    }

    const node = new LLNode(name.trim(), category);
    linkedList.push(node);

    renderLinkedList();
    animateNodeIn(node.id);
    renderHTimeline();
    updateCounter();
    logOperation('ADD', `"${node.name}" [${node.category}] → Linked List (position ${linkedList.length})`);

    if (eventNameInput) eventNameInput.value = '';
    if (eventNameInput) eventNameInput.focus();
  }

  /* DELETE LAST EVENT */
  function deleteLastEvent() {
    if (linkedList.length === 0) {
      logOperation('DELETE', 'No events to delete');
      if (deleteBtn && typeof DSAnimations !== 'undefined') DSAnimations.shakeElement(deleteBtn);
      return;
    }

    const removed = linkedList.pop();
    logOperation('DELETE', `Removed "${removed.name}" [${removed.category}] from end of Linked List`);

    renderLinkedList();
    renderHTimeline();
    updateCounter();
  }

  /* REPLAY DAY */
  function replayDay() {
    if (linkedList.length === 0) {
      logOperation('REPLAY', 'No events to replay');
      if (replayBtn && typeof DSAnimations !== 'undefined') DSAnimations.shakeElement(replayBtn);
      return;
    }

    stack = [];
    logOperation('REPLAY', `Pushing ${linkedList.length} events onto Stack...`);

    /* Staggered push animation */
    let i = 0;
    const pushNext = () => {
      if (i >= linkedList.length) {
        logOperation('REPLAY', `Stack loaded — ${stack.length} events ready for undo`);
        return;
      }
      const node = linkedList[i];
      stack.unshift(node); /* Push to top */
      renderStack();
      animateStackPush(node.id);
      i++;
      setTimeout(pushNext, 200);
    };

    pushNext();
  }

  /* UNDO */
  function undoEvent() {
    if (stack.length === 0) {
      logOperation('UNDO', 'Stack is empty — nothing to undo');
      if (undoBtn && typeof DSAnimations !== 'undefined') DSAnimations.shakeElement(undoBtn);
      return;
    }

    animateStackPop().then(() => {
      const popped = stack.shift();
      logOperation('UNDO', `POP: "${popped.name}" [${popped.category}] removed from Stack top`);
      renderStack();
    });
  }

  /* ================================================================
     EVENT BINDINGS
     ================================================================ */
  if (addBtn) {
    addBtn.addEventListener('click', (e) => {
      if (typeof rippleEffect === 'function') rippleEffect(e);
      addEvent(eventNameInput.value, categorySelect.value);
    });
  }

  if (eventNameInput) {
    eventNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        addEvent(eventNameInput.value, categorySelect.value);
      }
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
      if (typeof rippleEffect === 'function') rippleEffect(e);
      deleteLastEvent();
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      if (typeof rippleEffect === 'function') rippleEffect(e);
      replayDay();
    });
  }

  if (undoBtn) {
    undoBtn.addEventListener('click', (e) => {
      if (typeof rippleEffect === 'function') rippleEffect(e);
      undoEvent();
    });
  }

  if (statsBtn) {
    statsBtn.addEventListener('click', (e) => {
      if (typeof rippleEffect === 'function') rippleEffect(e);
      showStatsPanel();
    });
  }

  /* ================================================================
     PRE-LOAD SAMPLE EVENTS
     ================================================================ */
  function loadSampleEvents() {
    const samples = [
      { name: 'Phone Unlocked', category: 'Phone' },
      { name: 'Left Home',      category: 'Travel' },
      { name: 'Entered College', category: 'College' },
      { name: 'Connected WiFi',  category: 'WiFi' }
    ];

    let i = 0;
    const loadNext = () => {
      if (i >= samples.length) return;
      const s = samples[i];
      const node = new LLNode(s.name, s.category);
      /* Offset times for visual variety */
      node.time = new Date(Date.now() - (samples.length - i) * 1800000);
      linkedList.push(node);

      renderLinkedList();
      renderHTimeline();
      updateCounter();
      logOperation('ADD', `Pre-loaded "${node.name}" [${node.category}]`);

      i++;
      setTimeout(loadNext, 350);
    };

    loadNext();
  }

  /* ================================================================
     INIT
     ================================================================ */
  renderLinkedList();
  renderStack();
  renderHTimeline();
  renderLog();
  updateCounter();

  /* Load samples with stagger animation */
  setTimeout(loadSampleEvents, 600);

});
