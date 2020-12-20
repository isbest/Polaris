package com.henu.service;

import com.henu.entity.Article;
import com.henu.entity.User;
import com.henu.entity.UserInfo;

import java.sql.Struct;
import java.util.List;
import java.util.Map;

public interface UserService {
    List<User> findALl();

    User findByID(int id);

    User findByEmail(String email);

    int insertUser(User user);

    User login(String email);

    int register(User user);

    List<Article> getUserArticles(int id);

    UserInfo getUserInfoById(int id);

    Map<String, Object> getUserInfo(int id);

    int updateUser(User user);

    int updateUserInfo(UserInfo userInfo);

}
