package com.henu.controller;

import com.henu.entity.Comment;
import com.henu.entity.User;
import com.henu.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;
import java.util.Map;

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

    @ResponseBody
    @PostMapping("/api/add")
    @CrossOrigin(origins = "*")
    public int addComment(@RequestBody Comment comment, HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("user");
        if(user == null) {
            return -1;
        }
        comment.setUser(user);
        boolean b = commentService.addComment(comment);
        return b?0:1;
    }

    @ResponseBody
    @PostMapping("/api/like/add/{id}")
    @CrossOrigin(origins = "*")
    public int addLikes(HttpServletRequest request, @PathVariable String id) {
        commentService.addLikes(Integer.parseInt(id));
        return 0;
    }


}
