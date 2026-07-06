#ifndef DIGITAL_SHADOW_H
#define DIGITAL_SHADOW_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <ctype.h>

#define MAX_NAME 50
#define MAX_CATEGORY 20
#define MAX_CATEGORIES 8

struct Event {
    int id;
    char name[MAX_NAME];
    char category[MAX_CATEGORY];
    char date[11];
    char time_stamp[9];
    struct Event *next;
};

struct StackNode {
    struct Event *event_data;
    struct StackNode *next;
};

void clearScreen();
void getCurrentDate(char *buffer);
void getCurrentTime(char *buffer);
void printHeader();
void printMenu();
void pressEnterToContinue();

void addEvent();
void deleteEvent();
void editEvent();
void searchEvent();
void displayTimeline();
void displayTodayTimeline();

void pushToStack(struct Event *event);
struct Event* popFromStack();
void replayDay();
void undoLastEvent();

void showStatistics();

void freeAllEvents();
void freeStack();

#endif
