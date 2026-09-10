package com.weekend.enterprise.model;

import java.util.List;

public class Product {
    private String name;
    private String category;
    private String users;
    private String rating;
    private String year;
    private String description;
    private List<String> features;
    private String colorHex;

    public Product(String name, String category, String users, String rating,
                   String year, String description, List<String> features, String colorHex) {
        this.name = name;
        this.category = category;
        this.users = users;
        this.rating = rating;
        this.year = year;
        this.description = description;
        this.features = features;
        this.colorHex = colorHex;
    }

    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getUsers() { return users; }
    public String getRating() { return rating; }
    public String getYear() { return year; }
    public String getDescription() { return description; }
    public List<String> getFeatures() { return features; }
    public String getColorHex() { return colorHex; }
}
