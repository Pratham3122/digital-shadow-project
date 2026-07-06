# Digital Shadow — C Implementation

> **"Your Life Has a Memory, Even When You Don't."**

Digital Shadow is a Digital Life Timeline Reconstruction System built with **Linked Lists** and **Stacks** in C. It captures, manages, and replays your digital life events through an interactive terminal interface.

---

## Prerequisites

- **GCC Compiler** (MinGW on Windows, or gcc on Linux/macOS)
- No external libraries required — uses only C standard library

---

## Build Instructions

### Compile

```bash
gcc -o digital_shadow main.c
```

### Run

**Linux / macOS:**
```bash
./digital_shadow
```

**Windows:**
```cmd
digital_shadow.exe
```

---

## Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Add Event** | Create a new event with auto-generated timestamp. Choose from 8 categories. |
| 2 | **Delete Event** | Remove an event by its unique ID. Handles head, middle, and tail deletion. |
| 3 | **Edit Event** | Modify the name and/or category of an existing event. |
| 4 | **Search Event** | Case-insensitive partial match search across all event names. |
| 5 | **Display Timeline** | View the complete chronological timeline of all events. |
| 6 | **Today's Timeline** | Filter and display only events recorded today. |
| 7 | **Replay Day** | Stack-based LIFO demonstration — pushes all events then pops in reverse. |
| 8 | **Undo Last Event** | Reverts the most recently added event using the undo stack. |
| 9 | **Statistics** | Overview of total events, today's count, category breakdown with bar chart, and first/last event info. |
| 0 | **Exit** | Frees all allocated memory and exits cleanly. |

### Supported Categories

`Phone` · `Travel` · `College` · `WiFi` · `Payment` · `App` · `Study` · `Work`

---

## Data Structures Used

### Linked List (Event Timeline)

Each event is a node in a singly linked list:

```
[Event 1] → [Event 2] → [Event 3] → ... → [Event N] → NULL
```

- **Insertion**: At the tail (maintains chronological order)
- **Deletion**: By ID (handles head, middle, tail cases)
- **Traversal**: Linear scan for display, search, and statistics

### Stack (Undo / Replay)

A LIFO stack built with a separate singly linked list:

```
TOP → [StackNode] → [StackNode] → ... → NULL
```

- **Push**: On every event addition (stores a copy)
- **Pop**: On undo operation (retrieves and removes the last added event)
- **Replay**: Temporary stack to demonstrate LIFO reversal of timeline

---

## Sample Usage Walkthrough

### 1. Launch the Program

```
  ╔══════════════════════════════════════════════════════════════╗
  ║       DIGITAL SHADOW                                       ║
  ║     "Your Life Has a Memory, Even When You Don't."         ║
  ╚══════════════════════════════════════════════════════════════╝
```

### 2. Add a Few Events

Select option `1` from the menu:

```
  Event Name: Morning Coffee Run
  Select category (1-8): 1    → Phone

  [SUCCESS] Event added successfully!
  ID       : 1
  Name     : Morning Coffee Run
  Category : Phone
  Date     : 04/07/2026
  Time     : 22:05:30
```

### 3. View the Timeline

Select option `5`:

```
  ┌──────┬──────────────────────┬────────────┬────────────┬──────────┐
  │  ID  │  Name                │  Category  │  Date      │  Time    │
  ├──────┼──────────────────────┼────────────┼────────────┼──────────┤
  │    1 │ Morning Coffee Run   │ Phone      │ 04/07/2026 │ 22:05:30 │
  │    2 │ College Lecture       │ College    │ 04/07/2026 │ 22:06:12 │
  │    3 │ UPI Payment           │ Payment    │ 04/07/2026 │ 22:07:45 │
  └──────┴──────────────────────┴────────────┴────────────┴──────────┘
```

### 4. Replay Day (Stack Demo)

Select option `7` to see events pushed and popped in LIFO order:

```
  Step 1: Pushing all events onto the stack (LIFO)...
    PUSH -> [1] Morning Coffee Run
    PUSH -> [2] College Lecture
    PUSH -> [3] UPI Payment

  Step 2: Popping all events from stack (reverse order)...
    [3] UPI Payment
    [2] College Lecture
    [1] Morning Coffee Run
```

### 5. Undo Last Event

Select option `8` to remove the most recently added event:

```
  Undoing event: [3] UPI Payment (Payment)
  [SUCCESS] Event [3] has been removed from the timeline.
  Total events remaining: 2
```

### 6. View Statistics

Select option `9`:

```
  Total Events        : 2
  Events Today        : 2
  Most Active Category: Phone

  CATEGORY BREAKDOWN
  Phone      : ██ (1)
  Travel     : - (0)
  College    : █ (1)
  ...
```

---

## Memory Management

- All dynamically allocated nodes are freed on exit via `freeAllEvents()` and `freeStack()`
- Each undo stack node stores an independent copy of event data (not a pointer to the linked list node)
- Deletion properly unlinks and frees individual nodes

---

## Project Structure

```
c-code/
├── header.h     — Struct definitions, constants, and function prototypes
├── main.c       — Complete implementation (all functions)
└── README.md    — This file
```

---

## Author

Built as part of the **Digital Shadow** project — a Data Structures course project demonstrating practical applications of Linked Lists and Stacks in C.
