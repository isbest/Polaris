package com.henu.service;

import com.henu.entity.Comment;

import java.util.List;

public interface CommentService {
    List<Comment> getCommentTreeByAid(int aid);
    boolean addComment(Comment comment);
    boolean addLikes(int id);
}
