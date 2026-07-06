/* ============================================================
   statistics.js — Statistics Dashboard Engine
   Digital Shadow — Analytics & Chart Rendering
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     SAMPLE DATA SET (~15 events across categories and times)
     ================================================================ */
  const sampleEvents = [
    { name: 'Phone Unlocked',       category: 'Phone',   time: new Date(2026, 6, 4, 6, 30) },
    { name: 'Morning Alarm Off',    category: 'Phone',   time: new Date(2026, 6, 4, 6, 0) },
    { name: 'Left Home',            category: 'Travel',  time: new Date(2026, 6, 4, 7, 15) },
    { name: 'Bus GPS Ping',         category: 'Travel',  time: new Date(2026, 6, 4, 7, 45) },
    { name: 'Entered College',      category: 'College', time: new Date(2026, 6, 4, 8, 0) },
    { name: 'Connected WiFi',       category: 'WiFi',    time: new Date(2026, 6, 4, 8, 5) },
    { name: 'UPI Payment — Canteen',category: 'Payment', time: new Date(2026, 6, 4, 9, 30) },
    { name: 'Opened Instagram',     category: 'App',     time: new Date(2026, 6, 4, 10, 0) },
    { name: 'Library Check-in',     category: 'Study',   time: new Date(2026, 6, 4, 11, 0) },
    { name: 'Assignment Submitted', category: 'Study',   time: new Date(2026, 6, 4, 12, 30) },
    { name: 'Lunch Payment',        category: 'Payment', time: new Date(2026, 6, 4, 13, 0) },
    { name: 'Lab Session Start',    category: 'Work',    time: new Date(2026, 6, 4, 14, 0) },
    { name: 'Left College',         category: 'College', time: new Date(2026, 6, 4, 16, 0) },
    { name: 'Gym Check-in',         category: 'Travel',  time: new Date(2026, 6, 4, 17, 0) },
    { name: 'Netflix Opened',       category: 'App',     time: new Date(2026, 6, 4, 20, 0) },
    { name: 'Phone Locked',         category: 'Phone',   time: new Date(2026, 6, 4, 22, 30) }
  ];

  /* Sort by time */
  sampleEvents.sort((a, b) => a.time - b.time);

  const categoryColors = {
    'Phone':   '#7c5cff',
    'Travel':  '#00d4aa',
    'College': '#ffb800',
    'WiFi':    '#00b4d8',
    'Payment': '#ff4d6a',
    'App':     '#ff6b35',
    'Study':   '#b8c0ff',
    'Work':    '#06d6a0'
  };

  const categoryIcons = {
    'Phone': '📱', 'Travel': '✈️', 'College': '🎓', 'WiFi': '📶',
    'Payment': '💳', 'App': '📲', 'Study': '📖', 'Work': '💼'
  };

  /* ================================================================
     COMPUTE STATISTICS
     ================================================================ */
  function computeStats(events) {
    const cats = {};
    events.forEach(e => {
      cats[e.category] = (cats[e.category] || 0) + 1;
    });

    let mostFreq = { name: '—', count: 0 };
    for (const [cat, count] of Object.entries(cats)) {
      if (count > mostFreq.count) mostFreq = { name: cat, count };
    }

    const first = events[0];
    const last  = events[events.length - 1];
    const durationMs = last.time - first.time;
    const durationHrs = Math.round(durationMs / (1000 * 60 * 60) * 10) / 10;

    /* Events by hour (0-23) */
    const byHour = new Array(24).fill(0);
    events.forEach(e => {
      byHour[e.time.getHours()]++;
    });

    /* Today's events (we treat all sample data as today) */
    const todayCount = events.length;

    return {
      total: events.length,
      today: todayCount,
      categories: cats,
      mostFrequent: mostFreq,
      first, last,
      durationHrs,
      byHour
    };
  }

  const stats = computeStats(sampleEvents);

  /* ================================================================
     RENDER STAT CARDS
     ================================================================ */
  function renderStatCards() {
    const grid = document.getElementById('stats-cards-grid');
    if (!grid) return;

    const cards = [
      {
        label: 'Total Events',
        value: stats.total,
        icon: '◈',
        color: '#7c5cff',
        id: 'stat-total'
      },
      {
        label: "Today's Events",
        value: stats.today,
        icon: '📅',
        color: '#00d4aa',
        id: 'stat-today'
      },
      {
        label: 'Most Frequent',
        value: stats.mostFrequent.name,
        sub: stats.mostFrequent.count + ' events',
        icon: categoryIcons[stats.mostFrequent.name] || '📊',
        color: categoryColors[stats.mostFrequent.name] || '#7c5cff',
        id: 'stat-frequent',
        isText: true
      },
      {
        label: 'First Event',
        value: stats.first.name,
        sub: formatTime(stats.first.time),
        icon: '🌅',
        color: '#ffb800',
        id: 'stat-first',
        isText: true
      },
      {
        label: 'Last Event',
        value: stats.last.name,
        sub: formatTime(stats.last.time),
        icon: '🌙',
        color: '#ff4d6a',
        id: 'stat-last',
        isText: true
      },
      {
        label: 'Timeline Length',
        value: stats.durationHrs,
        sub: 'hours',
        icon: '⏱️',
        color: '#00b4d8',
        id: 'stat-duration'
      }
    ];

    cards.forEach((card, index) => {
      const el = document.createElement('div');
      el.className = `glass-card stat-card reveal stagger-${index + 1}`;
      el.style.setProperty('--card-accent', card.color);

      el.innerHTML = `
        <div class="stat-card-icon" style="background: ${card.color}22; color: ${card.color};">${card.icon}</div>
        <div class="stat-card-body">
          <span class="stat-card-label">${card.label}</span>
          ${card.isText
            ? `<span class="stat-card-value stat-text-value" id="${card.id}">${card.value}</span>`
            : `<span class="stat-card-value" id="${card.id}">0</span>`
          }
          ${card.sub ? `<span class="stat-card-sub">${card.sub}</span>` : ''}
        </div>
        <div class="stat-card-accent" style="background: linear-gradient(135deg, ${card.color}33, transparent);"></div>
      `;

      grid.appendChild(el);
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  /* ================================================================
     RENDER BAR CHART (Category Distribution)
     ================================================================ */
  function renderBarChart() {
    const container = document.getElementById('bar-chart');
    if (!container) return;

    const cats = stats.categories;
    const maxCount = Math.max(...Object.values(cats));
    const entries = Object.entries(cats).sort((a, b) => b[1] - a[1]);

    container.innerHTML = '';

    const chartArea = document.createElement('div');
    chartArea.className = 'bar-chart-area';

    /* Y-axis labels */
    const yAxis = document.createElement('div');
    yAxis.className = 'bar-y-axis';
    for (let i = maxCount; i >= 0; i--) {
      const label = document.createElement('span');
      label.className = 'bar-y-label';
      label.textContent = i;
      yAxis.appendChild(label);
    }
    chartArea.appendChild(yAxis);

    /* Bars */
    const barsWrap = document.createElement('div');
    barsWrap.className = 'bar-bars-wrap';

    entries.forEach(([cat, count]) => {
      const col = document.createElement('div');
      col.className = 'bar-column';

      const bar = document.createElement('div');
      bar.className = 'bar-fill';
      bar.style.height = '0%';
      bar.style.background = `linear-gradient(180deg, ${categoryColors[cat] || '#7c5cff'}, ${categoryColors[cat] || '#7c5cff'}88)`;
      bar.setAttribute('data-target-height', (count / maxCount * 100));

      const countLabel = document.createElement('span');
      countLabel.className = 'bar-count-label';
      countLabel.textContent = count;

      const catLabel = document.createElement('span');
      catLabel.className = 'bar-cat-label';
      catLabel.textContent = cat;

      const catIcon = document.createElement('span');
      catIcon.className = 'bar-cat-icon';
      catIcon.textContent = categoryIcons[cat] || '📌';

      col.appendChild(countLabel);
      col.appendChild(bar);
      col.appendChild(catIcon);
      col.appendChild(catLabel);
      barsWrap.appendChild(col);
    });

    chartArea.appendChild(barsWrap);
    container.appendChild(chartArea);
  }

  /* ================================================================
     RENDER PROGRESS BARS (Category Breakdown)
     ================================================================ */
  function renderProgressBars() {
    const container = document.getElementById('progress-bars');
    if (!container) return;

    const cats = stats.categories;
    const total = stats.total;
    const entries = Object.entries(cats).sort((a, b) => b[1] - a[1]);

    container.innerHTML = '';

    entries.forEach(([cat, count]) => {
      const pct = Math.round((count / total) * 100);
      const color = categoryColors[cat] || '#7c5cff';

      const row = document.createElement('div');
      row.className = 'progress-row';

      row.innerHTML = `
        <div class="progress-header">
          <span class="progress-cat-icon">${categoryIcons[cat] || '📌'}</span>
          <span class="progress-cat-name">${cat}</span>
          <span class="progress-cat-count">${count} events</span>
          <span class="progress-cat-pct">${pct}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" data-target-width="${pct}" style="width: 0%; background: linear-gradient(90deg, ${color}, ${color}bb);"></div>
        </div>
      `;

      container.appendChild(row);
    });
  }

  /* ================================================================
     RENDER LINE CHART (Events by Hour — SVG)
     ================================================================ */
  function renderLineChart() {
    const container = document.getElementById('line-chart');
    if (!container) return;

    const data = stats.byHour;
    const maxVal = Math.max(...data, 1);

    const svgNS = 'http://www.w3.org/2000/svg';
    const width = 700;
    const height = 250;
    const padX = 45;
    const padY = 25;
    const plotW = width - padX * 2;
    const plotH = height - padY * 2;

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('class', 'line-chart-svg');

    /* Grid lines */
    for (let i = 0; i <= 4; i++) {
      const y = padY + (plotH / 4) * i;
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', padX);
      line.setAttribute('y1', y);
      line.setAttribute('x2', width - padX);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', 'rgba(136,136,170,0.12)');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);

      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', padX - 10);
      label.setAttribute('y', y + 4);
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('fill', 'var(--text-tertiary)');
      label.setAttribute('font-size', '11');
      label.setAttribute('font-family', 'Inter, sans-serif');
      label.textContent = Math.round(maxVal - (maxVal / 4) * i);
      svg.appendChild(label);
    }

    /* X-axis labels */
    const hourLabels = [0, 3, 6, 9, 12, 15, 18, 21];
    hourLabels.forEach(h => {
      const x = padX + (h / 23) * plotW;
      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', x);
      label.setAttribute('y', height - 5);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', 'var(--text-tertiary)');
      label.setAttribute('font-size', '11');
      label.setAttribute('font-family', 'Inter, sans-serif');
      label.textContent = h.toString().padStart(2, '0') + ':00';
      svg.appendChild(label);
    });

    /* Build points */
    const points = [];
    data.forEach((val, i) => {
      const x = padX + (i / 23) * plotW;
      const y = padY + plotH - (val / maxVal) * plotH;
      points.push({ x, y, val });
    });

    /* Gradient fill area */
    const defs = document.createElementNS(svgNS, 'defs');
    const gradient = document.createElementNS(svgNS, 'linearGradient');
    gradient.setAttribute('id', 'lineGradientFill');
    gradient.setAttribute('x1', '0'); gradient.setAttribute('y1', '0');
    gradient.setAttribute('x2', '0'); gradient.setAttribute('y2', '1');
    const stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0%'); stop1.setAttribute('stop-color', '#7c5cff'); stop1.setAttribute('stop-opacity', '0.3');
    const stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '100%'); stop2.setAttribute('stop-color', '#7c5cff'); stop2.setAttribute('stop-opacity', '0.02');
    gradient.appendChild(stop1); gradient.appendChild(stop2);
    defs.appendChild(gradient);

    /* Line gradient */
    const lineGrad = document.createElementNS(svgNS, 'linearGradient');
    lineGrad.setAttribute('id', 'lineStrokeGrad');
    lineGrad.setAttribute('x1', '0'); lineGrad.setAttribute('y1', '0');
    lineGrad.setAttribute('x2', '1'); lineGrad.setAttribute('y2', '0');
    const ls1 = document.createElementNS(svgNS, 'stop');
    ls1.setAttribute('offset', '0%'); ls1.setAttribute('stop-color', '#7c5cff');
    const ls2 = document.createElementNS(svgNS, 'stop');
    ls2.setAttribute('offset', '100%'); ls2.setAttribute('stop-color', '#00d4aa');
    lineGrad.appendChild(ls1); lineGrad.appendChild(ls2);
    defs.appendChild(lineGrad);

    svg.appendChild(defs);

    /* Area path */
    let areaD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) * 0.4;
      const cp1y = points[i - 1].y;
      const cp2x = points[i].x - (points[i].x - points[i - 1].x) * 0.4;
      const cp2y = points[i].y;
      areaD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
    }
    areaD += ` L ${points[points.length - 1].x} ${padY + plotH} L ${points[0].x} ${padY + plotH} Z`;

    const area = document.createElementNS(svgNS, 'path');
    area.setAttribute('d', areaD);
    area.setAttribute('fill', 'url(#lineGradientFill)');
    area.setAttribute('class', 'line-chart-area');
    svg.appendChild(area);

    /* Line path */
    let lineD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) * 0.4;
      const cp1y = points[i - 1].y;
      const cp2x = points[i].x - (points[i].x - points[i - 1].x) * 0.4;
      const cp2y = points[i].y;
      lineD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
    }

    const linePath = document.createElementNS(svgNS, 'path');
    linePath.setAttribute('d', lineD);
    linePath.setAttribute('fill', 'none');
    linePath.setAttribute('stroke', 'url(#lineStrokeGrad)');
    linePath.setAttribute('stroke-width', '2.5');
    linePath.setAttribute('stroke-linecap', 'round');
    linePath.setAttribute('class', 'line-chart-path');

    /* Animate dash */
    const pathLength = 1500;
    linePath.setAttribute('stroke-dasharray', pathLength);
    linePath.setAttribute('stroke-dashoffset', pathLength);
    svg.appendChild(linePath);

    /* Dots */
    points.forEach(p => {
      if (p.val > 0) {
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', p.x);
        circle.setAttribute('cy', p.y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', '#7c5cff');
        circle.setAttribute('stroke', 'var(--bg-primary)');
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('class', 'line-chart-dot');

        /* Tooltip */
        const title = document.createElementNS(svgNS, 'title');
        title.textContent = `${p.val} event${p.val !== 1 ? 's' : ''}`;
        circle.appendChild(title);

        svg.appendChild(circle);
      }
    });

    container.innerHTML = '';
    container.appendChild(svg);
  }

  /* ================================================================
     ANIMATE ON SCROLL
     ================================================================ */
  function animateOnView() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          /* Animate counters */
          const totalEl = document.getElementById('stat-total');
          const todayEl = document.getElementById('stat-today');
          const durEl   = document.getElementById('stat-duration');

          if (totalEl && !totalEl.dataset.animated) {
            totalEl.dataset.animated = 'true';
            animateCounter(totalEl, stats.total, 1500);
          }
          if (todayEl && !todayEl.dataset.animated) {
            todayEl.dataset.animated = 'true';
            animateCounter(todayEl, stats.today, 1200);
          }
          if (durEl && !durEl.dataset.animated) {
            durEl.dataset.animated = 'true';
            animateCounter(durEl, stats.durationHrs, 1800);
          }

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.stat-card').forEach(card => observer.observe(card));
  }

  function animateBars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          /* Animate bar chart */
          const bars = entry.target.querySelectorAll('.bar-fill');
          bars.forEach((bar, i) => {
            const target = bar.getAttribute('data-target-height');
            setTimeout(() => {
              bar.style.transition = 'height 1s cubic-bezier(0.34,1.56,0.64,1)';
              bar.style.height = target + '%';
            }, i * 120);
          });

          /* Animate progress bars */
          const fills = entry.target.querySelectorAll('.progress-fill');
          fills.forEach((fill, i) => {
            const target = fill.getAttribute('data-target-width');
            setTimeout(() => {
              fill.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)';
              fill.style.width = target + '%';
            }, i * 150);
          });

          /* Animate line chart */
          const linePath = entry.target.querySelector('.line-chart-path');
          if (linePath) {
            linePath.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1)';
            linePath.style.strokeDashoffset = '0';
          }

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const chartSection = document.getElementById('charts-section');
    if (chartSection) observer.observe(chartSection);
  }

  /* ================================================================
     INIT
     ================================================================ */
  renderStatCards();
  renderBarChart();
  renderProgressBars();
  renderLineChart();

  requestAnimationFrame(() => {
    animateOnView();
    animateBars();
  });

});
