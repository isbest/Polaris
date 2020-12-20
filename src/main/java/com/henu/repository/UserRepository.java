package com.henu.repository;

import com.henu.entity.User;

import java.util.List;

public interface UserRepository {
     List<User> findAll();
     User findById(int id);
     int insertUser(User user);
     User findByName(String username);
     User findByEmail(String email);
     int updateUser(User user);
}
