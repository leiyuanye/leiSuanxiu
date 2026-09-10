package com.weekend.enterprise.model;

public class TimelineEvent {
    private String year;
    private String title;
    private String description;

    public TimelineEvent(String year, String title, String description) {
        this.year = year;
        this.title = title;
        this.description = description;
    }

    public String getYear() { return year; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
}
