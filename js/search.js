/* ============================================
   Digital Shadow — Search Modal
   Ctrl+K / Cmd+K site-wide search
   ============================================ */

(function () {
  'use strict';

  var pages = [
    { title: 'Home', url: 'index.html', description: 'Digital Shadow — Your Life Has a Memory', keywords: 'home hero landing' },
    { title: 'About', url: 'about.html', description: 'What is Digital Shadow and how does it work', keywords: 'about concept explanation' },
    { title: 'Problem Statement', url: 'problem.html', description: 'Why digital timeline reconstruction matters', keywords: 'problem statement memory footprint' },
    { title: 'Features', url: 'features.html', description: 'All features of Digital Shadow', keywords: 'features add delete edit search undo replay' },
    { title: 'Architecture', url: 'architecture.html', description: 'System design and architecture overview', keywords: 'architecture design system flow' },
    { title: 'Linked List', url: 'linkedlist.html', description: 'Interactive linked list visualization and tutorial', keywords: 'linked list data structure node pointer' },
    { title: 'Stack', url: 'stack.html', description: 'Interactive stack visualization and tutorial', keywords: 'stack push pop LIFO undo' },
    { title: 'Flowchart', url: 'flowchart.html', description: 'Program flow visualization', keywords: 'flowchart flow diagram svg' },
    { title: 'Algorithm', url: 'algorithm.html', description: 'Algorithms and complexity analysis', keywords: 'algorithm complexity time space pseudo code' },
    { title: 'Visualization', url: 'visualization.html', description: 'Interactive playground — experience Digital Shadow live', keywords: 'visualization playground demo interactive' },
    { title: 'Compiler', url: 'compiler.html', description: 'C code playground with logic explanations', keywords: 'compiler code C editor run' },
    { title: 'Statistics', url: 'statistics.html', description: 'Analytics dashboard with charts and metrics', keywords: 'statistics analytics dashboard charts' },
    { title: 'Future Scope', url: 'future.html', description: 'Roadmap and future plans for Digital Shadow', keywords: 'future scope roadmap plans' },
    { title: 'Viva Questions', url: 'viva.html', description: '50+ viva questions with detailed answers', keywords: 'viva questions answers exam preparation' },
    { title: 'Project Report', url: 'report.html', description: 'Complete project report', keywords: 'report abstract methodology conclusion' },
    { title: 'Presentation', url: 'ppt.html', description: '12-slide project presentation', keywords: 'presentation ppt slides' },
    { title: 'Contact', url: 'contact.html', description: 'Get in touch with the team', keywords: 'contact email form' }
  ];

  var modal = null;
  var input = null;
  var results = null;
  var selectedIndex = -1;

  function createModal() {
    modal = document.createElement('div');
    modal.id = 'searchModal';
    modal.className = 'search-modal';
    modal.innerHTML =
      '<div class="search-overlay"></div>' +
      '<div class="search-dialog glass">' +
        '<div class="search-input-wrap">' +
          '<span class="search-icon">🔍</span>' +
          '<input type="text" id="searchInput" class="search-input" placeholder="Search pages..." autocomplete="off">' +
          '<kbd class="search-kbd">ESC</kbd>' +
        '</div>' +
        '<div class="search-results" id="searchResults"></div>' +
        '<div class="search-footer">' +
          '<span><kbd>↑↓</kbd> Navigate</span>' +
          '<span><kbd>↵</kbd> Open</span>' +
          '<span><kbd>ESC</kbd> Close</span>' +
        '</div>' +
      '</div>';

    var style = document.createElement('style');
    style.textContent =
      '.search-modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999}' +
      '.search-modal.open{display:flex;align-items:flex-start;justify-content:center;padding-top:15vh}' +
      '.search-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px)}' +
      '.search-dialog{position:relative;width:90%;max-width:580px;background:var(--bg-secondary,#0d0d1a);border:1px solid var(--surface-border,rgba(255,255,255,0.06));border-radius:16px;overflow:hidden;box-shadow:0 16px 64px rgba(0,0,0,0.5);animation:scaleIn .2s ease}' +
      '.search-input-wrap{display:flex;align-items:center;padding:1rem 1.25rem;border-bottom:1px solid var(--surface-border,rgba(255,255,255,0.06))}' +
      '.search-icon{font-size:1.1rem;margin-right:.75rem;opacity:.5}' +
      '.search-input{flex:1;background:none;border:none;color:var(--text-primary,#f0f0f5);font-size:1rem;font-family:Inter,sans-serif;outline:none}' +
      '.search-input::placeholder{color:var(--text-tertiary,#555577)}' +
      '.search-kbd{background:var(--surface,rgba(255,255,255,0.03));border:1px solid var(--surface-border,rgba(255,255,255,0.06));border-radius:4px;padding:2px 6px;font-size:.7rem;color:var(--text-secondary,#8888aa);font-family:inherit}' +
      '.search-results{max-height:320px;overflow-y:auto;padding:.5rem}' +
      '.search-result-item{display:flex;flex-direction:column;padding:.75rem 1rem;border-radius:8px;cursor:pointer;transition:background .15s}' +
      '.search-result-item:hover,.search-result-item.selected{background:var(--surface-hover,rgba(255,255,255,0.06))}' +
      '.search-result-title{font-weight:600;color:var(--text-primary,#f0f0f5);font-size:.95rem}' +
      '.search-result-desc{font-size:.8rem;color:var(--text-secondary,#8888aa);margin-top:2px}' +
      '.search-no-results{padding:2rem;text-align:center;color:var(--text-tertiary,#555577);font-size:.9rem}' +
      '.search-footer{display:flex;gap:1.5rem;padding:.75rem 1.25rem;border-top:1px solid var(--surface-border,rgba(255,255,255,0.06));font-size:.75rem;color:var(--text-tertiary,#555577)}' +
      '.search-footer kbd{background:var(--surface,rgba(255,255,255,0.03));border:1px solid var(--surface-border,rgba(255,255,255,0.06));border-radius:3px;padding:1px 5px;font-size:.7rem;margin-right:4px}';

    document.head.appendChild(style);
    document.body.appendChild(modal);

    input = document.getElementById('searchInput');
    results = document.getElementById('searchResults');

    modal.querySelector('.search-overlay').addEventListener('click', closeSearch);
    input.addEventListener('input', onSearch);
    input.addEventListener('keydown', onKeydown);
  }

  function openSearch() {
    if (!modal) createModal();
    modal.classList.add('open');
    input.value = '';
    results.innerHTML = '';
    selectedIndex = -1;
    setTimeout(function () { input.focus(); }, 50);
    renderResults(pages);
  }

  function closeSearch() {
    if (modal) modal.classList.remove('open');
  }

  function onSearch() {
    var query = input.value.toLowerCase().trim();
    if (!query) {
      renderResults(pages);
      return;
    }
    var filtered = pages.filter(function (p) {
      return p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.keywords.toLowerCase().includes(query);
    });
    renderResults(filtered);
  }

  function renderResults(items) {
    selectedIndex = -1;
    if (!items.length) {
      results.innerHTML = '<div class="search-no-results">No pages found</div>';
      return;
    }
    results.innerHTML = items.map(function (p, i) {
      return '<div class="search-result-item" data-url="' + p.url + '" data-index="' + i + '">' +
        '<span class="search-result-title">' + p.title + '</span>' +
        '<span class="search-result-desc">' + p.description + '</span>' +
        '</div>';
    }).join('');

    results.querySelectorAll('.search-result-item').forEach(function (item) {
      item.addEventListener('click', function () {
        window.location.href = this.dataset.url;
      });
    });
  }

  function onKeydown(e) {
    var items = results.querySelectorAll('.search-result-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      updateSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      updateSelection(items);
    } else if (e.key === 'Enter' && selectedIndex >= 0 && items[selectedIndex]) {
      window.location.href = items[selectedIndex].dataset.url;
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  }

  function updateSelection(items) {
    items.forEach(function (item, i) {
      item.classList.toggle('selected', i === selectedIndex);
    });
    if (items[selectedIndex]) {
      items[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') {
      closeSearch();
    }
  });
})();
