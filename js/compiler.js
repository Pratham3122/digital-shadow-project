/* ============================================================
   compiler.js — C Code Playground Engine
   Digital Shadow — Syntax Highlighting & Simulated Execution
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     COMPLETE MAIN.C SOURCE CODE
     ================================================================ */
  const ORIGINAL_CODE = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

// ============================================
// Digital Shadow — Life Event Tracker
// Data Structures: Linked List + Stack (in C)
// ============================================

#define MAX_NAME 50
#define MAX_CAT  20

// --- Node structure for Linked List ---
typedef struct Event {
    char name[MAX_NAME];
    char category[MAX_CAT];
    char timestamp[26];
    struct Event *next;
} Event;

// --- Stack node (used for Replay/Undo) ---
typedef struct StackNode {
    Event *eventData;
    struct StackNode *next;
} StackNode;

// --- Global pointers ---
Event *head = NULL;        // Linked list head
StackNode *stackTop = NULL; // Stack top
int eventCount = 0;

// --- Get current timestamp ---
void getCurrentTime(char *buffer) {
    time_t now = time(NULL);
    struct tm *t = localtime(&now);
    strftime(buffer, 26, "%Y-%m-%d %H:%M:%S", t);
}

// --- Create a new event node ---
Event* createEvent(const char *name, const char *category) {
    Event *newEvent = (Event *)malloc(sizeof(Event));
    if (!newEvent) {
        printf("Error: Memory allocation failed!\\n");
        return NULL;
    }
    strncpy(newEvent->name, name, MAX_NAME - 1);
    newEvent->name[MAX_NAME - 1] = '\\0';
    strncpy(newEvent->category, category, MAX_CAT - 1);
    newEvent->category[MAX_CAT - 1] = '\\0';
    getCurrentTime(newEvent->timestamp);
    newEvent->next = NULL;
    return newEvent;
}

// --- Add event to end of linked list ---
void addEvent(const char *name, const char *category) {
    Event *newEvent = createEvent(name, category);
    if (!newEvent) return;

    if (head == NULL) {
        head = newEvent;
    } else {
        Event *temp = head;
        while (temp->next != NULL) {
            temp = temp->next;
        }
        temp->next = newEvent;
    }
    eventCount++;
    printf("\\n  [+] Event added: \\"%s\\" [%s] at %s\\n",
           newEvent->name, newEvent->category, newEvent->timestamp);
}

// --- Delete the last event ---
void deleteLastEvent() {
    if (head == NULL) {
        printf("\\n  [!] No events to delete.\\n");
        return;
    }

    if (head->next == NULL) {
        printf("\\n  [-] Deleted: \\"%s\\"\\n", head->name);
        free(head);
        head = NULL;
    } else {
        Event *temp = head;
        while (temp->next->next != NULL) {
            temp = temp->next;
        }
        printf("\\n  [-] Deleted: \\"%s\\"\\n", temp->next->name);
        free(temp->next);
        temp->next = NULL;
    }
    eventCount--;
}

// --- Push event onto stack ---
void pushToStack(Event *event) {
    StackNode *node = (StackNode *)malloc(sizeof(StackNode));
    if (!node) {
        printf("Error: Stack allocation failed!\\n");
        return;
    }
    node->eventData = event;
    node->next = stackTop;
    stackTop = node;
}

// --- Pop event from stack ---
Event* popFromStack() {
    if (stackTop == NULL) return NULL;
    StackNode *temp = stackTop;
    Event *data = temp->eventData;
    stackTop = stackTop->next;
    free(temp);
    return data;
}

// --- Replay day (push all events onto stack) ---
void replayDay() {
    if (head == NULL) {
        printf("\\n  [!] No events to replay.\\n");
        return;
    }

    // Clear existing stack
    while (stackTop != NULL) {
        popFromStack();
    }

    printf("\\n  [>>] Replaying day — pushing events to stack...\\n");
    Event *temp = head;
    while (temp != NULL) {
        pushToStack(temp);
        printf("    PUSH: \\"%s\\" [%s]\\n", temp->name, temp->category);
        temp = temp->next;
    }
    printf("  [>>] Replay complete. Stack has %d events.\\n", eventCount);
}

// --- Undo last replayed event ---
void undoEvent() {
    Event *event = popFromStack();
    if (event == NULL) {
        printf("\\n  [!] Nothing to undo. Stack is empty.\\n");
        return;
    }
    printf("\\n  [<<] Undo (POP): \\"%s\\" [%s] at %s\\n",
           event->name, event->category, event->timestamp);
}

// --- Display full timeline ---
void displayTimeline() {
    if (head == NULL) {
        printf("\\n  [!] Timeline is empty.\\n");
        return;
    }

    printf("\\n  ========================================\\n");
    printf("  ◈  DIGITAL SHADOW — YOUR TIMELINE\\n");
    printf("  ========================================\\n\\n");

    Event *temp = head;
    int index = 1;
    while (temp != NULL) {
        printf("  [%d]  %s\\n", index, temp->timestamp);
        printf("       \\"%s\\" — %s\\n", temp->name, temp->category);
        if (temp->next) printf("       |\\n");
        temp = temp->next;
        index++;
    }

    printf("\\n  ─── Total events: %d ───\\n", eventCount);
}

// --- Show statistics ---
void showStatistics() {
    printf("\\n  ========================================\\n");
    printf("  ◈  EVENT STATISTICS\\n");
    printf("  ========================================\\n\\n");
    printf("    Total Events   : %d\\n", eventCount);

    if (head) {
        printf("    First Event    : \\"%s\\" at %s\\n",
               head->name, head->timestamp);
        Event *temp = head;
        while (temp->next) temp = temp->next;
        printf("    Last Event     : \\"%s\\" at %s\\n",
               temp->name, temp->timestamp);
    }
}

// --- Free all memory ---
void freeAll() {
    Event *temp;
    while (head != NULL) {
        temp = head;
        head = head->next;
        free(temp);
    }
    while (stackTop != NULL) {
        StackNode *sTemp = stackTop;
        stackTop = stackTop->next;
        free(sTemp);
    }
}

// ============================================
// MAIN — Menu-driven interface
// ============================================
int main() {
    int choice;
    char name[MAX_NAME], category[MAX_CAT];

    printf("\\n");
    printf("  ╔══════════════════════════════════════╗\\n");
    printf("  ║       ◈  DIGITAL SHADOW  ◈          ║\\n");
    printf("  ║  Your Life Has a Memory,             ║\\n");
    printf("  ║          Even When You Don't.        ║\\n");
    printf("  ╚══════════════════════════════════════╝\\n");

    do {
        printf("\\n  ┌─── MENU ──────────────────────────┐\\n");
        printf("  │  1. Add Event                      │\\n");
        printf("  │  2. Delete Last Event              │\\n");
        printf("  │  3. Replay Day (Push to Stack)     │\\n");
        printf("  │  4. Undo (Pop from Stack)          │\\n");
        printf("  │  5. Display Timeline               │\\n");
        printf("  │  6. Show Statistics                │\\n");
        printf("  │  0. Exit                           │\\n");
        printf("  └────────────────────────────────────┘\\n");
        printf("  Enter choice: ");
        scanf("%d", &choice);
        getchar(); // consume newline

        switch (choice) {
            case 1:
                printf("  Event name: ");
                fgets(name, MAX_NAME, stdin);
                name[strcspn(name, "\\n")] = 0;
                printf("  Category: ");
                fgets(category, MAX_CAT, stdin);
                category[strcspn(category, "\\n")] = 0;
                addEvent(name, category);
                break;
            case 2:
                deleteLastEvent();
                break;
            case 3:
                replayDay();
                break;
            case 4:
                undoEvent();
                break;
            case 5:
                displayTimeline();
                break;
            case 6:
                showStatistics();
                break;
            case 0:
                printf("\\n  Goodbye. Your shadow remembers.\\n\\n");
                break;
            default:
                printf("\\n  [!] Invalid choice.\\n");
        }
    } while (choice != 0);

    freeAll();
    return 0;
}`;

  /* ================================================================
     ELEMENTS
     ================================================================ */
  const editorArea  = document.getElementById('code-editor');
  const lineNumbers = document.getElementById('line-numbers');
  const outputArea  = document.getElementById('output-area');
  const inputArea   = document.getElementById('input-area');
  const runBtn      = document.getElementById('btn-run');
  const clearBtn    = document.getElementById('btn-clear');
  const resetBtn    = document.getElementById('btn-reset');

  /* ================================================================
     SYNTAX HIGHLIGHTING
     ================================================================ */
  const cKeywords = [
    'auto','break','case','char','const','continue','default','do','double',
    'else','enum','extern','float','for','goto','if','int','long','register',
    'return','short','signed','sizeof','static','struct','switch','typedef',
    'union','unsigned','void','volatile','while','NULL','printf','scanf',
    'malloc','free','fgets','strncpy','strcspn','getchar','time','localtime',
    'strftime','include','define'
  ];

  const cTypes = ['int','char','float','double','void','long','short','unsigned','signed','struct','typedef','Event','StackNode'];

  function highlightCode(code) {
    let html = escapeHtml(code);

    /* Comments: // ... */
    html = html.replace(/(\/\/[^\n]*)/g, '<span class="syn-comment">$1</span>');

    /* Preprocessor: #include, #define */
    html = html.replace(/(#\w+)/g, '<span class="syn-preproc">$1</span>');

    /* Strings */
    html = html.replace(/(&quot;(?:[^&]|&(?!quot;))*?&quot;|"(?:[^"\\]|\\.)*?")/g, '<span class="syn-string">$1</span>');

    /* Numbers */
    html = html.replace(/\b(\d+)\b/g, '<span class="syn-number">$1</span>');

    /* Keywords */
    const kwRegex = new RegExp('\\b(' + cKeywords.join('|') + ')\\b', 'g');
    html = html.replace(kwRegex, (match) => {
      if (cTypes.includes(match)) {
        return '<span class="syn-type">' + match + '</span>';
      }
      return '<span class="syn-keyword">' + match + '</span>';
    });

    /* Function calls: word( */
    html = html.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, (match, fn) => {
      if (cKeywords.includes(fn)) return match;
      return '<span class="syn-function">' + fn + '</span>';
    });

    return html;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ================================================================
     RENDER CODE WITH LINE NUMBERS
     ================================================================ */
  function renderCode(code) {
    const lines = code.split('\n');
    const highlighted = highlightCode(code);

    /* Line numbers */
    lineNumbers.innerHTML = '';
    lines.forEach((_, i) => {
      const ln = document.createElement('div');
      ln.className = 'line-num';
      ln.textContent = i + 1;
      lineNumbers.appendChild(ln);
    });

    /* Code */
    editorArea.innerHTML = `<code>${highlighted}</code>`;
  }

  /* ================================================================
     SIMULATED OUTPUT
     ================================================================ */
  function simulateRun() {
    outputArea.innerHTML = '';
    outputArea.classList.add('running');

    const outputLines = [
      { text: '$ gcc -o digital_shadow main.c', cls: 'out-cmd' },
      { text: '$ ./digital_shadow', cls: 'out-cmd' },
      { text: '', cls: '' },
      { text: '  ╔══════════════════════════════════════╗', cls: 'out-header' },
      { text: '  ║       ◈  DIGITAL SHADOW  ◈          ║', cls: 'out-header' },
      { text: '  ║  Your Life Has a Memory,             ║', cls: 'out-header' },
      { text: '  ║          Even When You Don\'t.        ║', cls: 'out-header' },
      { text: '  ╚══════════════════════════════════════╝', cls: 'out-header' },
      { text: '', cls: '' },
      { text: '  ┌─── MENU ──────────────────────────┐', cls: 'out-menu' },
      { text: '  │  1. Add Event                      │', cls: 'out-menu' },
      { text: '  │  2. Delete Last Event              │', cls: 'out-menu' },
      { text: '  │  3. Replay Day (Push to Stack)     │', cls: 'out-menu' },
      { text: '  │  4. Undo (Pop from Stack)          │', cls: 'out-menu' },
      { text: '  │  5. Display Timeline               │', cls: 'out-menu' },
      { text: '  │  6. Show Statistics                │', cls: 'out-menu' },
      { text: '  │  0. Exit                           │', cls: 'out-menu' },
      { text: '  └────────────────────────────────────┘', cls: 'out-menu' },
      { text: '  Enter choice: 1', cls: 'out-input' },
      { text: '  Event name: Phone Unlocked', cls: 'out-input' },
      { text: '  Category: Phone', cls: 'out-input' },
      { text: '', cls: '' },
      { text: '  [+] Event added: "Phone Unlocked" [Phone] at 2026-07-04 06:30:00', cls: 'out-success' },
      { text: '', cls: '' },
      { text: '  Enter choice: 1', cls: 'out-input' },
      { text: '  Event name: Left Home', cls: 'out-input' },
      { text: '  Category: Travel', cls: 'out-input' },
      { text: '', cls: '' },
      { text: '  [+] Event added: "Left Home" [Travel] at 2026-07-04 07:15:00', cls: 'out-success' },
      { text: '', cls: '' },
      { text: '  Enter choice: 1', cls: 'out-input' },
      { text: '  Event name: Entered College', cls: 'out-input' },
      { text: '  Category: College', cls: 'out-input' },
      { text: '', cls: '' },
      { text: '  [+] Event added: "Entered College" [College] at 2026-07-04 08:00:00', cls: 'out-success' },
      { text: '', cls: '' },
      { text: '  Enter choice: 5', cls: 'out-input' },
      { text: '', cls: '' },
      { text: '  ========================================', cls: 'out-header' },
      { text: '  ◈  DIGITAL SHADOW — YOUR TIMELINE', cls: 'out-header' },
      { text: '  ========================================', cls: 'out-header' },
      { text: '', cls: '' },
      { text: '  [1]  2026-07-04 06:30:00', cls: 'out-time' },
      { text: '       "Phone Unlocked" — Phone', cls: 'out-event' },
      { text: '       |', cls: 'out-connector' },
      { text: '  [2]  2026-07-04 07:15:00', cls: 'out-time' },
      { text: '       "Left Home" — Travel', cls: 'out-event' },
      { text: '       |', cls: 'out-connector' },
      { text: '  [3]  2026-07-04 08:00:00', cls: 'out-time' },
      { text: '       "Entered College" — College', cls: 'out-event' },
      { text: '', cls: '' },
      { text: '  ─── Total events: 3 ───', cls: 'out-total' },
      { text: '', cls: '' },
      { text: '  Enter choice: 0', cls: 'out-input' },
      { text: '', cls: '' },
      { text: '  Goodbye. Your shadow remembers.', cls: 'out-goodbye' },
      { text: '', cls: '' },
      { text: '─────────────────────────────────────────────', cls: 'out-divider' },
      { text: '  ⓘ  Note: This is a simulated output.', cls: 'out-notice' },
      { text: '     To run the actual C program:', cls: 'out-notice' },
      { text: '     $ gcc -o digital_shadow main.c', cls: 'out-notice-cmd' },
      { text: '     $ ./digital_shadow', cls: 'out-notice-cmd' },
      { text: '     Compile main.c with gcc and run it locally.', cls: 'out-notice' },
      { text: '─────────────────────────────────────────────', cls: 'out-divider' },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i >= outputLines.length) {
        clearInterval(interval);
        outputArea.classList.remove('running');

        /* Add blinking cursor */
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        cursor.textContent = '█';
        outputArea.appendChild(cursor);
        return;
      }

      const line = outputLines[i];
      const div = document.createElement('div');
      div.className = 'output-line ' + (line.cls || '');
      div.textContent = line.text || '\u00A0';
      outputArea.appendChild(div);
      outputArea.scrollTop = outputArea.scrollHeight;
      i++;
    }, 45);
  }

  /* ================================================================
     LOGIC EXPLANATION ACCORDION
     ================================================================ */
  function setupAccordions() {
    const triggers = document.querySelectorAll('.logic-card-header');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const card = trigger.closest('.logic-card');
        const isOpen = card.classList.contains('open');

        /* Close all */
        document.querySelectorAll('.logic-card.open').forEach(c => {
          c.classList.remove('open');
          c.querySelector('.logic-card-body').style.maxHeight = '0';
        });

        /* Toggle current */
        if (!isOpen) {
          card.classList.add('open');
          const body = card.querySelector('.logic-card-body');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  /* ================================================================
     EVENT BINDINGS
     ================================================================ */
  if (runBtn) {
    runBtn.addEventListener('click', (e) => {
      if (typeof rippleEffect === 'function') rippleEffect(e);
      simulateRun();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      if (typeof rippleEffect === 'function') rippleEffect(e);
      outputArea.innerHTML = '';
      const cursor = document.createElement('span');
      cursor.className = 'terminal-cursor';
      cursor.textContent = '█';
      outputArea.appendChild(cursor);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      if (typeof rippleEffect === 'function') rippleEffect(e);
      renderCode(ORIGINAL_CODE);
      outputArea.innerHTML = '';
      inputArea.value = '';
    });
  }

  /* ================================================================
     SYNC SCROLL (line numbers + code)
     ================================================================ */
  if (editorArea) {
    editorArea.addEventListener('scroll', () => {
      if (lineNumbers) lineNumbers.scrollTop = editorArea.scrollTop;
    });
  }

  /* ================================================================
     INIT
     ================================================================ */
  renderCode(ORIGINAL_CODE);
  setupAccordions();

});
