package com.henu.controller;

import com.henu.entity.Comment;
import com.henu.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/comment")
public class CommentHandler {
    @Autowired
    private CommentService commentService;

    @RequestMapping("/api/comtree/{id}")
    @ResponseBody
    @CrossOrigin(origins = "*")
    public List<Comment> getComTree(@PathVariable String id) {
        List<Comment> commentTreeByAid = commentService.getCommentTreeByAid(Integer.parseInt(id));
        System.out.println(commentTreeByAid.toString());
        return commentTreeByAid;
    }
}
