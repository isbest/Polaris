package com.henu.repository;

import com.henu.entity.Comment;

import java.util.List;

public interface CommentRepository {
    List<Comment> getCommentTree(int aid);
}
