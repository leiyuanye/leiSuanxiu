package com.weekend.enterprise.model;

import java.util.Arrays;
import java.util.List;

public class Company {
    private int id;
    private String name;
    private String logoChar;
    private String colorHex;
    private String tagline;
    private String industry;
    private String founded;
    private String headquarters;
    private String size;
    private String ipoStatus;
    private String workHours;
    private String overtime;
    private String annualLeave;
    private String description;
    private List<String> productNames;
    private List<TimelineEvent> timeline;
    private List<Product> products;

    public Company(int id, String name, String logoChar, String colorHex, String tagline,
                   String industry, String founded, String headquarters, String size,
                   String ipoStatus, String workHours, String overtime, String annualLeave,
                   String description, List<String> productNames,
                   List<TimelineEvent> timeline, List<Product> products) {
        this.id = id;
        this.name = name;
        this.logoChar = logoChar;
        this.colorHex = colorHex;
        this.tagline = tagline;
        this.industry = industry;
        this.founded = founded;
        this.headquarters = headquarters;
        this.size = size;
        this.ipoStatus = ipoStatus;
        this.workHours = workHours;
        this.overtime = overtime;
        this.annualLeave = annualLeave;
        this.description = description;
        this.productNames = productNames;
        this.timeline = timeline;
        this.products = products;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public String getLogoChar() { return logoChar; }
    public String getColorHex() { return colorHex; }
    public String getTagline() { return tagline; }
    public String getIndustry() { return industry; }
    public String getFounded() { return founded; }
    public String getHeadquarters() { return headquarters; }
    public String getSize() { return size; }
    public String getIpoStatus() { return ipoStatus; }
    public String getWorkHours() { return workHours; }
    public String getOvertime() { return overtime; }
    public String getAnnualLeave() { return annualLeave; }
    public String getDescription() { return description; }
    public List<String> getProductNames() { return productNames; }
    public List<TimelineEvent> getTimeline() { return timeline; }
    public List<Product> getProducts() { return products; }
}
