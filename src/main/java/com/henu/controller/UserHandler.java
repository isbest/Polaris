package com.henu.controller;

import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.ShearCaptcha;
import com.henu.code.Code;
import com.henu.entity.User;
import com.henu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/user")
public class UserHandler {
    //验证码
    private String code = "";

    @Autowired
    private UserService userService;

    @GetMapping("/findAll")
    @ResponseBody
    public ModelAndView findAll() {
        ModelAndView modelAndView = new ModelAndView("index");
        modelAndView.addObject("list",userService.findALl());
        return modelAndView;
    }

    @ResponseBody
    @GetMapping("/findById")
    public ModelAndView findById(int id) {
        ModelAndView modelAndView = new ModelAndView("index");
        modelAndView.addObject("user",userService.findByID(id));
        return modelAndView;
    }

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
    public Map<String,Integer> userRegister(User user,
                                            @RequestParam("checkCode")String checkCode,
                                            HttpServletRequest request) {
        Map<String,Integer> result = new HashMap<>();
        if(!code.equals(checkCode)) {
            result.put("result",Code.CHECKABLE_ERROR);
            return result;
        }
        user.setRegisterDate(new Date());
        int register = userService.register(user);
        result.put("result",register);
        System.out.println(user.getBirthdayDate());
        return result;
    }

    //登录
    @ResponseBody
    @PostMapping("/login")
    public Map<String,Integer> userLogin(@RequestParam("email")String email,
                                         @RequestParam("password")String password,
                                         HttpServletRequest request) {
        Map<String,Integer> result = new HashMap<>();
        if(email==null || password==null) {
            result.put("result",Code.LOGIN_ERROR);
        }

        User login = userService.login(email);
        if(login == null) {
            result.put("result",Code.USER_NO_EXITS);
            return result;
        }

        if(!password.equals(login.getPassword())) {
            result.put("result",Code.PASSWORD_ERROR);
            return result;
        }

        if(request.getSession().getAttribute("user") != null) {
            result.put("result",Code.USER_ALREADY_LOGIN);
            return result;
        }
        //将用户存入session
        request.getSession().setAttribute("user",login);
        result.put("result",Code.USER_LOGIN_SUCCESS);
        return result;
    }

}
