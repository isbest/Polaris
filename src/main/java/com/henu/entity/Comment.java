package com.henu.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

/**
 * @description: 评论的been对象
 * @author xstar
 * @date 2020/12/15 下午9:08
 * JsonIgnoreProperties注解是为了忽略一些不需要转化的成员变量
 */
@Data
@NoArgsConstructor
@JsonIgnoreProperties(value = { "handler" })
public class Comment {
    private int id;
    private int cid;
    private int aid;
    private User user;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date date;
    private String content;
    private int likes;
    private List<Comment> childCom;
}
