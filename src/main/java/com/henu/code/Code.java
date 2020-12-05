package com.henu.code;

//报错信息
public class Code {
    public static final int EMAIL_EXITS = 20;  //邮箱已经被注册过
    public static final int CHECKABLE_ERROR = 21;  //验证码错误
    public static final int REGISTER_SUCCESS = 22;  //注册成功
    public static final int REGISTER_ERROR = 23;  //注册失败成功

    public static final int USER_NO_EXITS = 24; //登录失败没有此用户
    public static final int USER_ALREADY_LOGIN = 25; //登录失败没有此用户
    public static final int USER_LOGIN_SUCCESS = 26; //登录成功
    public static final int LOGIN_ERROR = 27; //登录失败
    public static final int PASSWORD_ERROR = 28; //登录失败

    public static final int NO_USER_LOGIN = 29; //用户未登录
    public static final int ARTICLE_ERROR = 30; //文章存数据库出错
    public static final int TAGS_ERROR = 31; //标签存数据库出错
    public static final int ADD_ARTICLE_SUCCESS = 32; //标签存数据库出错
}
