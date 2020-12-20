package com.henu.repository;

import com.henu.entity.UserInfo;

public interface UserInfoRepository {
    UserInfo getUserInfoById(int id);
    int updateUserInfo(UserInfo userInfo);
    UserInfo isUserInfoExist(int id);
    int addInfo(UserInfo userInfo);
}
