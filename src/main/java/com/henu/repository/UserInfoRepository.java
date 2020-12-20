package com.henu.repository;

import com.henu.entity.UserInfo;

public interface UserInfoRepository {
    UserInfo getUserInfoById(int id);
    int updateUserInfo(UserInfo userInfo);
    int updateUserAvatar(String avatarURL,int uid);
}
