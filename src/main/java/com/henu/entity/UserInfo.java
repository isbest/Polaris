package com.henu.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserInfo {
    private int id;
    private int uid;
    private String github;
    private String qq;
    private String csdn;
    private String motto;
    private String avatarURL;
}
