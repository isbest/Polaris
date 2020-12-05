package com.henu.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class Article {
    private Integer id;
    private Integer authorId;
    private String title;
    private String content;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date releaseDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date modifyDate;
    private int likes;
    private int views;
    private List<Tag> tags;
}
