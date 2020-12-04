package com.henu.service.impl;

import com.henu.code.Code;
import com.henu.entity.User;
import com.henu.repository.UserRepository;
import com.henu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> findALl() {
        return userRepository.findAll();
    }

    @Override
    public User findByID(int id) {
        return userRepository.findById(id);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public int insertUser(User user) {
        String email = user.getEmail();
        User byEmail = userRepository.findByEmail(email);
        if (byEmail!=null && email.equals(byEmail.getEmail())) {
            return 20;
        }
        String userName = user.getUserName();
        User byName = userRepository.findByName(userName);
        if(byName!=null && userName.equals(byName.getUserName())){
            return 21;
        }

        return userRepository.insertUser(user);
    }

    @Override
    public User login(String email) {
        List<User> all = userRepository.findAll();
        User user = null;
        for (User userOfOne :
                all) {
            if(userOfOne.getEmail().equals(email)) {
                user = userOfOne;
            }
        }
        return user;
    }

    @Override
    public int register(User user) {
        User byEmail = userRepository.findByEmail(user.getEmail());
        if(byEmail!=null) {
            return Code.EMAIL_EXITS;
        }
        int i = userRepository.insertUser(user);
        if(i > 0) {
            return Code.REGISTER_SUCCESS;
        }
        return Code.REGISTER_ERROR;
    }
}
