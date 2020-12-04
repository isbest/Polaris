package com.henu.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class Article {
    private int id;
    private int authorId;
    private Date releaseDate;
    private Date modifyDate;
    private int likes;
}
