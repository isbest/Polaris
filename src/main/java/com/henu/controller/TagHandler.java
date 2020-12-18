package com.henu.controller;

import com.henu.entity.Tag;
import com.henu.entity.User;
import com.henu.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
@RequestMapping("/tag")
public class TagHandler {

    @Autowired
    private TagService tagService;

    //api
    @RequestMapping("/api/user/{id}")
    @CrossOrigin(origins = "*")
    @ResponseBody
    public List<Tag> getUsertags(@PathVariable String id) {
        return tagService.getUserTag(Integer.parseInt(id));
    }

    //登录的用户
    @RequestMapping("/cloud")
    @CrossOrigin(origins = "*")
    @ResponseBody
    public List<Tag> getTagCloud(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("user");
        if(user == null) {
            return null;
        }
        return tagService.getUserTag(user.getId());
    }


    //跳转个人标签
    @RequestMapping("/user")
    @CrossOrigin(origins = "*")
    public String gotoTagDec(int id) {
        return "archives";
    }

    //跳转按照标签查询
    @RequestMapping("/article/name")
    @CrossOrigin(origins = "*")
    public String findArticleByTag(String namey) {
        return "archives";
    }


}
