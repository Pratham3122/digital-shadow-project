/* ============================================================
   timeline.js — Timeline Rendering Engine
   Digital Shadow — Vertical & Horizontal Timeline Renderer
   ============================================================ */

'use strict';

class TimelineRenderer {
  constructor() {
    this.events = [];
    this.categoryColors = {
      'Phone':   { color: '#7c5cff', icon: '📱' },
      'Travel':  { color: '#00d4aa', icon: '✈️' },
      'College': { color: '#ffb800', icon: '🎓' },
      'WiFi':    { color: '#00b4d8', icon: '📶' },
      'Payment': { color: '#ff4d6a', icon: '💳' },
      'App':     { color: '#ff6b35', icon: '📲' },
      'Study':   { color: '#b8c0ff', icon: '📖' },
      'Work':    { color: '#06d6a0', icon: '💼' }
    };
    this._observer = null;
  }

  /* ---------- Format time ---------- */
  _formatTime(date) {
    if (!(date instanceof Date)) date = new Date(date);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  _formatDate(date) {
    if (!(date instanceof Date)) date = new Date(date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /* ---------- Get category meta ---------- */
  _getCategoryMeta(category) {
    return this.categoryColors[category] || { color: '#8888aa', icon: '📌' };
  }

  /* ---------- Render Vertical Timeline ---------- */
  renderTimeline(container, events) {
    if (!container) return;
    this.events = events || this.events;
    container.innerHTML = '';

    const timeline = document.createElement('div');
    timeline.className = 'vt-timeline';

    /* Central line */
    const line = document.createElement('div');
    line.className = 'vt-line';
    timeline.appendChild(line);

    this.events.forEach((event, index) => {
      const side = index % 2 === 0 ? 'left' : 'right';
      const meta = this._getCategoryMeta(event.category);

      const item = document.createElement('div');
      item.className = `vt-item vt-${side} reveal`;
      item.setAttribute('data-category', event.category);
      item.style.setProperty('--accent', meta.color);

      item.innerHTML = `
        <div class="vt-dot" style="background: ${meta.color}; box-shadow: 0 0 12px ${meta.color}55;">
          <span class="vt-dot-icon">${meta.icon}</span>
        </div>
        <div class="vt-card glass" style="border-color: ${meta.color}33;">
          <div class="vt-card-header">
            <span class="vt-category-badge" style="background: ${meta.color}22; color: ${meta.color};">${event.category}</span>
            <span class="vt-time">${this._formatTime(event.time)}</span>
          </div>
          <h4 class="vt-event-name">${event.name}</h4>
          ${event.description ? `<p class="vt-description">${event.description}</p>` : ''}
          <div class="vt-date">${this._formatDate(event.time)}</div>
        </div>
      `;

      item.addEventListener('click', () => {
        item.classList.toggle('vt-expanded');
      });

      timeline.appendChild(item);
    });

    container.appendChild(timeline);
    this._setupScrollObserver(timeline);
  }

  /* ---------- Render Horizontal Timeline ---------- */
  renderHorizontalTimeline(container, events) {
    if (!container) return;
    this.events = events || this.events;
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'ht-wrapper';

    const track = document.createElement('div');
    track.className = 'ht-track';

    /* The main line */
    const line = document.createElement('div');
    line.className = 'ht-line';
    track.appendChild(line);

    this.events.forEach((event, index) => {
      const meta = this._getCategoryMeta(event.category);

      const marker = document.createElement('div');
      marker.className = 'ht-marker';
      marker.style.setProperty('--marker-color', meta.color);

      marker.innerHTML = `
        <div class="ht-dot" style="background: ${meta.color};">
          <span class="ht-icon">${meta.icon}</span>
        </div>
        <div class="ht-label ${index % 2 === 0 ? 'ht-above' : 'ht-below'}">
          <span class="ht-name">${event.name}</span>
          <span class="ht-time">${this._formatTime(event.time)}</span>
        </div>
      `;

      marker.addEventListener('click', () => {
        this.highlightEvent(marker);
      });

      track.appendChild(marker);
    });

    wrapper.appendChild(track);
    container.appendChild(wrapper);

    /* Scroll to end */
    requestAnimationFrame(() => {
      wrapper.scrollLeft = wrapper.scrollWidth;
    });
  }

  /* ---------- Add Event ---------- */
  addEvent(event) {
    this.events.push(event);
    return this.events.length;
  }

  /* ---------- Remove Event ---------- */
  removeEvent(index) {
    if (index === undefined) index = this.events.length - 1;
    if (index >= 0 && index < this.events.length) {
      return this.events.splice(index, 1)[0];
    }
    return null;
  }

  /* ---------- Highlight Event ---------- */
  highlightEvent(markerElement) {
    if (!markerElement) return;
    const allMarkers = markerElement.parentElement.querySelectorAll('.ht-marker, .vt-item');
    allMarkers.forEach(m => m.classList.remove('ht-highlighted'));
    markerElement.classList.add('ht-highlighted');

    if (typeof DSAnimations !== 'undefined') {
      DSAnimations.pulseElement(markerElement.querySelector('.ht-dot, .vt-dot'));
    }
  }

  /* ---------- Filter by Category ---------- */
  filterByCategory(container, category) {
    if (!container) return;
    const items = container.querySelectorAll('[data-category]');
    items.forEach(item => {
      if (category === 'all' || item.getAttribute('data-category') === category) {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.style.pointerEvents = 'auto';
      } else {
        item.style.opacity = '0.2';
        item.style.transform = 'scale(0.95)';
        item.style.pointerEvents = 'none';
      }
    });
  }

  /* ---------- Scroll Observer ---------- */
  _setupScrollObserver(container) {
    if (this._observer) this._observer.disconnect();

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    const items = container.querySelectorAll('.reveal, .vt-item');
    items.forEach(item => this._observer.observe(item));
  }

  /* ---------- Get stats ---------- */
  getStats() {
    const cats = {};
    this.events.forEach(e => {
      cats[e.category] = (cats[e.category] || 0) + 1;
    });

    let mostFreq = { name: 'None', count: 0 };
    for (const [cat, count] of Object.entries(cats)) {
      if (count > mostFreq.count) {
        mostFreq = { name: cat, count };
      }
    }

    return {
      total: this.events.length,
      categories: cats,
      mostFrequent: mostFreq,
      first: this.events[0] || null,
      last: this.events[this.events.length - 1] || null
    };
  }
}

/* Export globally */
window.TimelineRenderer = TimelineRenderer;
