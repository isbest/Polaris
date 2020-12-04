package com.henu.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class Comment {
    private int id;
    private int userId;
    private Date date;
    private String content;
    private int likes;
    private int commentId;
}
