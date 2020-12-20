package com.henu.controller;

import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.ShearCaptcha;
import com.henu.code.Code;
import com.henu.entity.User;
import com.henu.entity.UserInfo;
import com.henu.service.TagService;
import com.henu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    @RequestMapping("/api/info/{id}")
    @CrossOrigin(origins = "*")
    @ResponseBody
    public Map<String, Object> getUserCardInfo(@PathVariable String id) {
        return userService.getUserInfo(Integer.parseInt(id));
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
    public Map<String,Object> updateUser(@RequestBody User user) {
        Map<String,Object> map = new HashMap<>();
        System.out.println(user);
        map.put("res",userService.updateUser(user));
        return map;
    }

    //更新用户链接信息
    @PostMapping("/update/userinfo")
    public Map<String,Object>  updateUserInfo(@RequestBody UserInfo userInfo) {
        Map<String,Object> map = new HashMap<>();
        map.put("res",userService.updateUserInfo(userInfo));
        return map;
    }

}
