package com.henu.service.impl;

import com.henu.entity.Comment;
import com.henu.repository.CommentRepository;
import com.henu.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public List<Comment> getCommentTreeByAid(int aid) {
        return commentRepository.getCommentTree(aid);
    }
}
