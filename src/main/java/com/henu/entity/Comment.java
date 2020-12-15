package com.henu.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @description: 评论的been对象
 * @author xstar
 * @date 2020/12/15 下午9:08
 */
@Data
@NoArgsConstructor
public class Comment {
    private int id;
    private int userId;
    private Date date;
    private String content;
    private int likes;
    private int commentId;
    private int sourceId;
}
