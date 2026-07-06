#include "header.h"

struct Event *head = NULL;
struct StackNode *stack_top = NULL;
int event_count = 0;
int next_id = 1;

const char *valid_categories[MAX_CATEGORIES] = {
    "Phone", "Travel", "College", "WiFi",
    "Payment", "App", "Study", "Work"
};

void clearScreen() {
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}

void getCurrentDate(char *buffer) {
    time_t now = time(NULL);
    struct tm *t = localtime(&now);
    sprintf(buffer, "%02d/%02d/%04d", t->tm_mday, t->tm_mon + 1, t->tm_year + 1900);
}

void getCurrentTime(char *buffer) {
    time_t now = time(NULL);
    struct tm *t = localtime(&now);
    sprintf(buffer, "%02d:%02d:%02d", t->tm_hour, t->tm_min, t->tm_sec);
}

void printHeader() {
    printf("\n");
    printf("  ╔══════════════════════════════════════════════════════════════╗\n");
    printf("  ║                                                            ║\n");
    printf("  ║       ██████╗ ██╗ ██████╗ ██╗████████╗ █████╗ ██╗         ║\n");
    printf("  ║       ██╔══██╗██║██╔════╝ ██║╚══██╔══╝██╔══██╗██║         ║\n");
    printf("  ║       ██║  ██║██║██║  ███╗██║   ██║   ███████║██║         ║\n");
    printf("  ║       ██║  ██║██║██║   ██║██║   ██║   ██╔══██║██║         ║\n");
    printf("  ║       ██████╔╝██║╚██████╔╝██║   ██║   ██║  ██║███████╗   ║\n");
    printf("  ║       ╚═════╝ ╚═╝ ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝   ║\n");
    printf("  ║                                                            ║\n");
    printf("  ║       ███████╗██╗  ██╗ █████╗ ██████╗  ██████╗ ██╗    ██╗ ║\n");
    printf("  ║       ██╔════╝██║  ██║██╔══██╗██╔══██╗██╔═══██╗██║    ██║ ║\n");
    printf("  ║       ███████╗███████║███████║██║  ██║██║   ██║██║ █╗ ██║ ║\n");
    printf("  ║       ╚════██║██╔══██║██╔══██║██║  ██║██║   ██║██║███╗██║ ║\n");
    printf("  ║       ███████║██║  ██║██║  ██║██████╔╝╚██████╔╝╚███╔███╔╝ ║\n");
    printf("  ║       ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚══╝╚══╝  ║\n");
    printf("  ║                                                            ║\n");
    printf("  ║     \"Your Life Has a Memory, Even When You Don't.\"         ║\n");
    printf("  ║                                                            ║\n");
    printf("  ║        Digital Life Timeline Reconstruction System         ║\n");
    printf("  ║            Using Linked List & Stack in C                  ║\n");
    printf("  ║                                                            ║\n");
    printf("  ╚══════════════════════════════════════════════════════════════╝\n");
    printf("\n");
}

void printMenu() {
    printf("\n");
    printf("  ┌──────────────────────────────────────────┐\n");
    printf("  │            ◈ MAIN MENU ◈                 │\n");
    printf("  ├──────────────────────────────────────────┤\n");
    printf("  │  [1]  Add Event                          │\n");
    printf("  │  [2]  Delete Event                       │\n");
    printf("  │  [3]  Edit Event                         │\n");
    printf("  │  [4]  Search Event                       │\n");
    printf("  │  [5]  Display Timeline                   │\n");
    printf("  │  [6]  Today's Timeline                   │\n");
    printf("  │  [7]  Replay Day (Stack Demo)            │\n");
    printf("  │  [8]  Undo Last Event                    │\n");
    printf("  │  [9]  Statistics                         │\n");
    printf("  │  [0]  Exit                               │\n");
    printf("  └──────────────────────────────────────────┘\n");
    printf("\n  Enter your choice: ");
}

void pressEnterToContinue() {
    printf("\n  Press Enter to continue...");
    int ch;
    while ((ch = getchar()) != '\n' && ch != EOF);
    getchar();
}

void addEvent() {
    clearScreen();
    printf("\n  ╔══════════════════════════════════════════╗\n");
    printf("  ║          ◈ ADD NEW EVENT ◈               ║\n");
    printf("  ╚══════════════════════════════════════════╝\n\n");

    struct Event *new_event = (struct Event *)malloc(sizeof(struct Event));
    if (new_event == NULL) {
        printf("  [ERROR] Memory allocation failed.\n");
        pressEnterToContinue();
        return;
    }

    new_event->id = next_id++;
    new_event->next = NULL;

    printf("  Event Name: ");
    int ch;
    while ((ch = getchar()) != '\n' && ch != EOF);
    fgets(new_event->name, MAX_NAME, stdin);
    new_event->name[strcspn(new_event->name, "\n")] = '\0';

    if (strlen(new_event->name) == 0) {
        printf("  [ERROR] Event name cannot be empty.\n");
        free(new_event);
        next_id--;
        pressEnterToContinue();
        return;
    }

    printf("\n  Available Categories:\n");
    printf("  ┌────────────────────────────────────────┐\n");
    for (int i = 0; i < MAX_CATEGORIES; i++) {
        printf("  │  [%d] %-34s │\n", i + 1, valid_categories[i]);
    }
    printf("  └────────────────────────────────────────┘\n");
    printf("  Select category (1-%d): ", MAX_CATEGORIES);

    int cat_choice;
    if (scanf("%d", &cat_choice) != 1 || cat_choice < 1 || cat_choice > MAX_CATEGORIES) {
        printf("  [ERROR] Invalid category selection.\n");
        free(new_event);
        next_id--;
        while ((ch = getchar()) != '\n' && ch != EOF);
        pressEnterToContinue();
        return;
    }

    strcpy(new_event->category, valid_categories[cat_choice - 1]);

    getCurrentDate(new_event->date);
    getCurrentTime(new_event->time_stamp);

    if (head == NULL) {
        head = new_event;
    } else {
        struct Event *current = head;
        while (current->next != NULL) {
            current = current->next;
        }
        current->next = new_event;
    }

    event_count++;

    pushToStack(new_event);

    printf("\n  ┌────────────────────────────────────────┐\n");
    printf("  │  [SUCCESS] Event added successfully!    │\n");
    printf("  ├────────────────────────────────────────┤\n");
    printf("  │  ID       : %-26d │\n", new_event->id);
    printf("  │  Name     : %-26s │\n", new_event->name);
    printf("  │  Category : %-26s │\n", new_event->category);
    printf("  │  Date     : %-26s │\n", new_event->date);
    printf("  │  Time     : %-26s │\n", new_event->time_stamp);
    printf("  └────────────────────────────────────────┘\n");

    pressEnterToContinue();
}

void deleteEvent() {
    clearScreen();
    printf("\n  ╔══════════════════════════════════════════╗\n");
    printf("  ║          ◈ DELETE EVENT ◈                ║\n");
    printf("  ╚══════════════════════════════════════════╝\n\n");

    if (head == NULL) {
        printf("  [INFO] No events to delete. Timeline is empty.\n");
        pressEnterToContinue();
        return;
    }

    int target_id;
    printf("  Enter Event ID to delete: ");
    if (scanf("%d", &target_id) != 1) {
        printf("  [ERROR] Invalid input.\n");
        int ch;
        while ((ch = getchar()) != '\n' && ch != EOF);
        pressEnterToContinue();
        return;
    }

    struct Event *current = head;
    struct Event *previous = NULL;

    while (current != NULL && current->id != target_id) {
        previous = current;
        current = current->next;
    }

    if (current == NULL) {
        printf("  [ERROR] Event with ID %d not found.\n", target_id);
        pressEnterToContinue();
        return;
    }

    printf("\n  Deleting: [%d] %s (%s) - %s %s\n",
        current->id, current->name, current->category,
        current->date, current->time_stamp);

    if (previous == NULL) {
        head = current->next;
    } else {
        previous->next = current->next;
    }

    free(current);
    event_count--;

    printf("\n  [SUCCESS] Event deleted successfully.\n");
    printf("  Total events remaining: %d\n", event_count);

    pressEnterToContinue();
}

void editEvent() {
    clearScreen();
    printf("\n  ╔══════════════════════════════════════════╗\n");
    printf("  ║          ◈ EDIT EVENT ◈                  ║\n");
    printf("  ╚══════════════════════════════════════════╝\n\n");

    if (head == NULL) {
        printf("  [INFO] No events to edit. Timeline is empty.\n");
        pressEnterToContinue();
        return;
    }

    int target_id;
    printf("  Enter Event ID to edit: ");
    if (scanf("%d", &target_id) != 1) {
        printf("  [ERROR] Invalid input.\n");
        int ch;
        while ((ch = getchar()) != '\n' && ch != EOF);
        pressEnterToContinue();
        return;
    }

    struct Event *current = head;
    while (current != NULL && current->id != target_id) {
        current = current->next;
    }

    if (current == NULL) {
        printf("  [ERROR] Event with ID %d not found.\n", target_id);
        pressEnterToContinue();
        return;
    }

    printf("\n  Current Details:\n");
    printf("  ┌────────────────────────────────────────┐\n");
    printf("  │  ID       : %-26d │\n", current->id);
    printf("  │  Name     : %-26s │\n", current->name);
    printf("  │  Category : %-26s │\n", current->category);
    printf("  │  Date     : %-26s │\n", current->date);
    printf("  │  Time     : %-26s │\n", current->time_stamp);
    printf("  └────────────────────────────────────────┘\n");

    printf("\n  New Event Name (or press Enter to keep): ");
    int ch;
    while ((ch = getchar()) != '\n' && ch != EOF);
    char new_name[MAX_NAME];
    fgets(new_name, MAX_NAME, stdin);
    new_name[strcspn(new_name, "\n")] = '\0';

    if (strlen(new_name) > 0) {
        strcpy(current->name, new_name);
    }

    printf("\n  Available Categories:\n");
    printf("  ┌────────────────────────────────────────┐\n");
    for (int i = 0; i < MAX_CATEGORIES; i++) {
        printf("  │  [%d] %-34s │\n", i + 1, valid_categories[i]);
    }
    printf("  │  [0] Keep current                      │\n");
    printf("  └────────────────────────────────────────┘\n");
    printf("  Select new category (0 to keep): ");

    int cat_choice;
    if (scanf("%d", &cat_choice) != 1) {
        printf("  [ERROR] Invalid input. Keeping current category.\n");
        while ((ch = getchar()) != '\n' && ch != EOF);
    } else if (cat_choice >= 1 && cat_choice <= MAX_CATEGORIES) {
        strcpy(current->category, valid_categories[cat_choice - 1]);
    }

    printf("\n  [SUCCESS] Event updated successfully.\n");
    printf("  ┌────────────────────────────────────────┐\n");
    printf("  │  ID       : %-26d │\n", current->id);
    printf("  │  Name     : %-26s │\n", current->name);
    printf("  │  Category : %-26s │\n", current->category);
    printf("  │  Date     : %-26s │\n", current->date);
    printf("  │  Time     : %-26s │\n", current->time_stamp);
    printf("  └────────────────────────────────────────┘\n");

    pressEnterToContinue();
}

char* toLowerStr(const char *src, char *dest, int max_len) {
    int i;
    for (i = 0; i < max_len - 1 && src[i] != '\0'; i++) {
        dest[i] = tolower((unsigned char)src[i]);
    }
    dest[i] = '\0';
    return dest;
}

void searchEvent() {
    clearScreen();
    printf("\n  ╔══════════════════════════════════════════╗\n");
    printf("  ║          ◈ SEARCH EVENTS ◈               ║\n");
    printf("  ╚══════════════════════════════════════════╝\n\n");

    if (head == NULL) {
        printf("  [INFO] No events to search. Timeline is empty.\n");
        pressEnterToContinue();
        return;
    }

    char search_term[MAX_NAME];
    printf("  Enter search term: ");
    int ch;
    while ((ch = getchar()) != '\n' && ch != EOF);
    fgets(search_term, MAX_NAME, stdin);
    search_term[strcspn(search_term, "\n")] = '\0';

    if (strlen(search_term) == 0) {
        printf("  [ERROR] Search term cannot be empty.\n");
        pressEnterToContinue();
        return;
    }

    char lower_search[MAX_NAME];
    toLowerStr(search_term, lower_search, MAX_NAME);

    printf("\n  ┌──────┬──────────────────────┬────────────┬────────────┬──────────┐\n");
    printf("  │  ID  │  Name                │  Category  │  Date      │  Time    │\n");
    printf("  ├──────┼──────────────────────┼────────────┼────────────┼──────────┤\n");

    int found = 0;
    struct Event *current = head;
    while (current != NULL) {
        char lower_name[MAX_NAME];
        toLowerStr(current->name, lower_name, MAX_NAME);

        if (strstr(lower_name, lower_search) != NULL) {
            printf("  │ %4d │ %-20s │ %-10s │ %10s │ %8s │\n",
                current->id, current->name, current->category,
                current->date, current->time_stamp);
            found++;
        }
        current = current->next;
    }

    printf("  └──────┴──────────────────────┴────────────┴────────────┴──────────┘\n");

    if (found == 0) {
        printf("\n  [INFO] No events found matching \"%s\".\n", search_term);
    } else {
        printf("\n  Found %d matching event(s).\n", found);
    }

    pressEnterToContinue();
}

void displayTimeline() {
    clearScreen();
    printf("\n  ╔══════════════════════════════════════════╗\n");
    printf("  ║        ◈ COMPLETE TIMELINE ◈             ║\n");
    printf("  ╚══════════════════════════════════════════╝\n\n");

    if (head == NULL) {
        printf("  [INFO] Timeline is empty. Add some events first.\n");
        pressEnterToContinue();
        return;
    }

    printf("  Total Events: %d\n\n", event_count);

    printf("  ┌──────┬──────────────────────┬────────────┬────────────┬──────────┐\n");
    printf("  │  ID  │  Name                │  Category  │  Date      │  Time    │\n");
    printf("  ├──────┼──────────────────────┼────────────┼────────────┼──────────┤\n");

    struct Event *current = head;
    while (current != NULL) {
        printf("  │ %4d │ %-20s │ %-10s │ %10s │ %8s │\n",
            current->id, current->name, current->category,
            current->date, current->time_stamp);
        current = current->next;
    }

    printf("  └──────┴──────────────────────┴────────────┴────────────┴──────────┘\n");

    pressEnterToContinue();
}

void displayTodayTimeline() {
    clearScreen();
    printf("\n  ╔══════════════════════════════════════════╗\n");
    printf("  ║        ◈ TODAY'S TIMELINE ◈              ║\n");
    printf("  ╚══════════════════════════════════════════╝\n\n");

    if (head == NULL) {
        printf("  [INFO] Timeline is empty. Add some events first.\n");
        pressEnterToContinue();
        return;
    }

    char today[11];
    getCurrentDate(today);
    printf("  Date: %s\n\n", today);

    printf("  ┌──────┬──────────────────────┬────────────┬──────────┐\n");
    printf("  │  ID  │  Name                │  Category  │  Time    │\n");
    printf("  ├──────┼──────────────────────┼────────────┼──────────┤\n");

    int found = 0;
    struct Event *current = head;
    while (current != NULL) {
        if (strcmp(current->date, today) == 0) {
            printf("  │ %4d │ %-20s │ %-10s │ %8s │\n",
                current->id, current->name, current->category,
                current->time_stamp);
            found++;
        }
        current = current->next;
    }

    printf("  └──────┴──────────────────────┴────────────┴──────────┘\n");

    if (found == 0) {
        printf("\n  [INFO] No events recorded today.\n");
    } else {
        printf("\n  %d event(s) recorded today.\n", found);
    }

    pressEnterToContinue();
}

void pushToStack(struct Event *event) {
    struct StackNode *new_node = (struct StackNode *)malloc(sizeof(struct StackNode));
    if (new_node == NULL) {
        return;
    }

    new_node->event_data = (struct Event *)malloc(sizeof(struct Event));
    if (new_node->event_data == NULL) {
        free(new_node);
        return;
    }

    new_node->event_data->id = event->id;
    strcpy(new_node->event_data->name, event->name);
    strcpy(new_node->event_data->category, event->category);
    strcpy(new_node->event_data->date, event->date);
    strcpy(new_node->event_data->time_stamp, event->time_stamp);
    new_node->event_data->next = NULL;

    new_node->next = stack_top;
    stack_top = new_node;
}

struct Event* popFromStack() {
    if (stack_top == NULL) {
        return NULL;
    }

    struct StackNode *temp = stack_top;
    struct Event *event_data = temp->event_data;
    stack_top = stack_top->next;
    free(temp);

    return event_data;
}

void replayDay() {
    clearScreen();
    printf("\n  ╔══════════════════════════════════════════╗\n");
    printf("  ║      ◈ REPLAY DAY (STACK DEMO) ◈        ║\n");
    printf("  ╚══════════════════════════════════════════╝\n\n");

    if (head == NULL) {
        printf("  [INFO] Timeline is empty. Nothing to replay.\n");
        pressEnterToContinue();
        return;
    }

    struct StackNode *replay_top = NULL;
    struct Event *current = head;

    printf("  Step 1: Pushing all events onto the stack (LIFO)...\n\n");

    int push_count = 0;
    while (current != NULL) {
        struct StackNode *new_node = (struct StackNode *)malloc(sizeof(struct StackNode));
        if (new_node == NULL) break;

        new_node->event_data = (struct Event *)malloc(sizeof(struct Event));
        if (new_node->event_data == NULL) {
            free(new_node);
            break;
        }

        new_node->event_data->id = current->id;
        strcpy(new_node->event_data->name, current->name);
        strcpy(new_node->event_data->category, current->category);
        strcpy(new_node->event_data->date, current->date);
        strcpy(new_node->event_data->time_stamp, current->time_stamp);
        new_node->event_data->next = NULL;

        new_node->next = replay_top;
        replay_top = new_node;
        push_count++;

        printf("    PUSH -> [%d] %s\n", current->id, current->name);
        current = current->next;
    }

    printf("\n  %d event(s) pushed onto stack.\n", push_count);
    printf("\n  Step 2: Popping all events from stack (reverse order)...\n\n");

    printf("  ┌──────┬──────────────────────┬────────────┬────────────┬──────────┐\n");
    printf("  │  ID  │  Name                │  Category  │  Date      │  Time    │\n");
    printf("  ├──────┼──────────────────────┼────────────┼────────────┼──────────┤\n");

    while (replay_top != NULL) {
        struct StackNode *temp = replay_top;
        struct Event *ev = temp->event_data;

        printf("  │ %4d │ %-20s │ %-10s │ %10s │ %8s │\n",
            ev->id, ev->name, ev->category, ev->date, ev->time_stamp);

        replay_top = replay_top->next;
        free(ev);
        free(temp);
    }

    printf("  └──────┴──────────────────────┴────────────┴────────────┴──────────┘\n");
    printf("\n  All events replayed in LIFO (Last-In, First-Out) order.\n");

    pressEnterToContinue();
}

void undoLastEvent() {
    clearScreen();
    printf("\n  ╔══════════════════════════════════════════╗\n");
    printf("  ║        ◈ UNDO LAST EVENT ◈               ║\n");
    printf("  ╚══════════════════════════════════════════╝\n\n");

    if (stack_top == NULL) {
        printf("  [INFO] Nothing to undo. Stack is empty.\n");
        pressEnterToContinue();
        return;
    }

    struct Event *undone = popFromStack();
    if (undone == NULL) {
        printf("  [ERROR] Failed to pop from stack.\n");
        pressEnterToContinue();
        return;
    }

    printf("  Undoing event: [%d] %s (%s)\n", undone->id, undone->name, undone->category);

    int target_id = undone->id;
    struct Event *current = head;
    struct Event *previous = NULL;

    while (current != NULL && current->id != target_id) {
        previous = current;
        current = current->next;
    }

    if (current != NULL) {
        if (previous == NULL) {
            head = current->next;
        } else {
            previous->next = current->next;
        }
        free(current);
        event_count--;
        printf("\n  [SUCCESS] Event [%d] has been removed from the timeline.\n", target_id);
        printf("  Total events remaining: %d\n", event_count);
    } else {
        printf("\n  [INFO] Event [%d] was already removed from timeline.\n", target_id);
    }

    free(undone);

    pressEnterToContinue();
}

void showStatistics() {
    clearScreen();
    printf("\n  ╔══════════════════════════════════════════╗\n");
    printf("  ║          ◈ STATISTICS ◈                  ║\n");
    printf("  ╚══════════════════════════════════════════╝\n\n");

    if (head == NULL) {
        printf("  [INFO] No data available. Timeline is empty.\n");
        pressEnterToContinue();
        return;
    }

    int category_counts[MAX_CATEGORIES] = {0};
    int today_count = 0;
    char today[11];
    getCurrentDate(today);

    struct Event *current = head;
    struct Event *last_event = NULL;

    while (current != NULL) {
        if (strcmp(current->date, today) == 0) {
            today_count++;
        }

        for (int i = 0; i < MAX_CATEGORIES; i++) {
            if (strcmp(current->category, valid_categories[i]) == 0) {
                category_counts[i]++;
                break;
            }
        }

        last_event = current;
        current = current->next;
    }

    int max_count = 0;
    int max_index = 0;
    for (int i = 0; i < MAX_CATEGORIES; i++) {
        if (category_counts[i] > max_count) {
            max_count = category_counts[i];
            max_index = i;
        }
    }

    printf("  ┌──────────────────────────────────────────────────┐\n");
    printf("  │              OVERVIEW                            │\n");
    printf("  ├──────────────────────────────────────────────────┤\n");
    printf("  │  Total Events        : %-25d │\n", event_count);
    printf("  │  Events Today        : %-25d │\n", today_count);
    printf("  │  Most Active Category: %-25s │\n", max_count > 0 ? valid_categories[max_index] : "N/A");
    printf("  └──────────────────────────────────────────────────┘\n");

    printf("\n  ┌──────────────────────────────────────────────────┐\n");
    printf("  │           CATEGORY BREAKDOWN                     │\n");
    printf("  ├──────────────────────────────────────────────────┤\n");
    for (int i = 0; i < MAX_CATEGORIES; i++) {
        printf("  │  %-10s : ", valid_categories[i]);
        for (int j = 0; j < category_counts[i] && j < 30; j++) {
            printf("█");
        }
        if (category_counts[i] == 0) {
            printf("-");
        }
        printf(" (%d)", category_counts[i]);
        int padding = 30 - (category_counts[i] < 30 ? category_counts[i] : 30);
        for (int j = 0; j < padding; j++) {
            printf(" ");
        }
        printf("│\n");
    }
    printf("  └──────────────────────────────────────────────────┘\n");

    printf("\n  ┌──────────────────────────────────────────────────┐\n");
    printf("  │           FIRST & LAST EVENTS                    │\n");
    printf("  ├──────────────────────────────────────────────────┤\n");
    printf("  │  First: [%d] %-20s %s %s  │\n",
        head->id, head->name, head->date, head->time_stamp);
    if (last_event != NULL) {
        printf("  │  Last : [%d] %-20s %s %s  │\n",
            last_event->id, last_event->name, last_event->date, last_event->time_stamp);
    }
    printf("  └──────────────────────────────────────────────────┘\n");

    pressEnterToContinue();
}

void freeAllEvents() {
    struct Event *current = head;
    while (current != NULL) {
        struct Event *temp = current;
        current = current->next;
        free(temp);
    }
    head = NULL;
    event_count = 0;
}

void freeStack() {
    while (stack_top != NULL) {
        struct StackNode *temp = stack_top;
        stack_top = stack_top->next;
        if (temp->event_data != NULL) {
            free(temp->event_data);
        }
        free(temp);
    }
}

int main() {
    clearScreen();
    printHeader();
    pressEnterToContinue();

    int choice;
    do {
        clearScreen();
        printHeader();
        printMenu();

        if (scanf("%d", &choice) != 1) {
            int ch;
            while ((ch = getchar()) != '\n' && ch != EOF);
            choice = -1;
        }

        switch (choice) {
            case 1:
                addEvent();
                break;
            case 2:
                deleteEvent();
                break;
            case 3:
                editEvent();
                break;
            case 4:
                searchEvent();
                break;
            case 5:
                displayTimeline();
                break;
            case 6:
                displayTodayTimeline();
                break;
            case 7:
                replayDay();
                break;
            case 8:
                undoLastEvent();
                break;
            case 9:
                showStatistics();
                break;
            case 0:
                break;
            default:
                printf("\n  [ERROR] Invalid choice. Please try again.\n");
                pressEnterToContinue();
                break;
        }
    } while (choice != 0);

    freeAllEvents();
    freeStack();

    clearScreen();
    printf("\n");
    printf("  ╔══════════════════════════════════════════════════════════════╗\n");
    printf("  ║                                                            ║\n");
    printf("  ║       Thank you for using Digital Shadow!                   ║\n");
    printf("  ║                                                            ║\n");
    printf("  ║       \"Your Life Has a Memory, Even When You Don't.\"       ║\n");
    printf("  ║                                                            ║\n");
    printf("  ║       All events and memory freed. Goodbye!                ║\n");
    printf("  ║                                                            ║\n");
    printf("  ╚══════════════════════════════════════════════════════════════╝\n");
    printf("\n");

    return 0;
}
