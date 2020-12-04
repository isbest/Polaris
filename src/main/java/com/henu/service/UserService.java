package com.henu.service;

import com.henu.entity.User;

import java.util.List;

public interface UserService {
    List<User> findALl();
    User findByID(int id);
    User findByEmail(String email);
    int insertUser(User user);
    User login(String email);
    int register(User user);
}
