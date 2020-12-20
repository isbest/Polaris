package com.henu.controller;

import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.ShearCaptcha;
import com.alibaba.fastjson.JSON;
import com.henu.code.Code;
import com.henu.entity.User;
import com.henu.entity.UserInfo;
import com.henu.service.TagService;
import com.henu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.*;

@Controller
@RequestMapping("/user")
public class UserHandler {
    private String code = "";

    @Autowired
    private UserService userService;
    @Autowired
    private TagService tagService;

    //验证码
    @GetMapping("/checkCode")
    public void getCheckCode(HttpServletResponse response) {
        ShearCaptcha captcha = CaptchaUtil.createShearCaptcha(152, 40, 4, 4);
        code = captcha.getCode();
        try {
            captcha.write(response.getOutputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //注册
    @ResponseBody
    @PostMapping("/register")
    public Map<String, Integer> userRegister(User user,
                                             @RequestParam("checkCode") String checkCode,
                                             HttpServletRequest request) {
        Map<String, Integer> result = new HashMap<>();
        if (!code.equals(checkCode)) {
            result.put("result", Code.CHECKABLE_ERROR);
            return result;
        }
        user.setRegisterDate(new Date());
        int register = userService.register(user);
        result.put("result", register);
        System.out.println(user.getBirthdayDate());
        return result;
    }

    //登录
    @ResponseBody
    @PostMapping("/login")
    public Map<String, Integer> userLogin(@RequestParam("email") String email,
                                          @RequestParam("password") String password,
                                          HttpServletRequest request) {
        Map<String, Integer> result = new HashMap<>();
        if (email == null || password == null) {
            result.put("result", Code.LOGIN_ERROR);
        }

        User login = userService.login(email);
        if (login == null) {
            result.put("result", Code.USER_NO_EXITS);
            return result;
        }

        if (!password.equals(login.getPassword())) {
            result.put("result", Code.PASSWORD_ERROR);
            return result;
        }

        if (request.getSession().getAttribute("user") != null) {
            result.put("result", Code.USER_ALREADY_LOGIN);
            return result;
        }
        //将用户存入session
        request.getSession().setAttribute("user", login);
        result.put("result", Code.USER_LOGIN_SUCCESS);
        return result;
    }

    //获取用户信息 文章数，标签数，友链
    @RequestMapping("/api/info")
    @CrossOrigin(origins = "*")
    @ResponseBody
    public Map<String, Object> getUserCardInfo(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("user");
        return userService.getUserInfo(user.getId());
    }

    //获取用户信息
    @RequestMapping("/api/user/{id}")
    @ResponseBody
    @CrossOrigin(origins = "*")
    public User findById(@PathVariable String id) {
        return userService.findByID(Integer.parseInt(id));
    }

    //跳转用户信息页面
    @RequestMapping("/info/id")
    public String toUserInfo(int id) {
        return "about";
    }

    //获取所有的标签
    @RequestMapping("/api/info/tags")
    @CrossOrigin(origins = "*")
    @ResponseBody
    public List<String> getAllTags() {
        return tagService.getAllTags();
    }


    //更新用户信息
    @PostMapping("/update/user")
    @ResponseBody
    public Map<String, Object> updateUser(@RequestBody User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("res", userService.updateUser(user));
        return map;
    }

    //更新用户链接信息
    @PostMapping("/update/userinfo")
    @ResponseBody
    public Map<String, Object> updateUserInfo(@RequestBody UserInfo userInfo) {
        Map<String, Object> map = new HashMap<>();
        System.out.println(userInfo);
        map.put("res", userService.updateUserInfo(userInfo));
        return map;
    }

    //上传头像
    @ResponseBody
    @PostMapping("/upload/avatar")
    @CrossOrigin(origins = "*")
    public Map<String, Object> upload(@RequestParam("avatar") MultipartFile multipartFile, HttpServletRequest request) {
        Map<String, Object> map = new HashMap<>();
        //获取保存文件的路径
        String path = request.getSession().getServletContext().getRealPath("/upload");
        String fileName = multipartFile.getOriginalFilename();
        assert fileName != null;
        File file = new File(path, fileName);
        try {
            multipartFile.transferTo(file);
        } catch (IOException e) {
            map.put("msg","上传失败");
        }
        map.put("msg","上传成功");
        String avatarURL = "http://localhost:8080/upload/"+fileName;
        map.put("url",avatarURL);
        return map;
    }

}
