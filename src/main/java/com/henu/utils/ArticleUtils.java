package com.henu.utils;

import com.henu.entity.Article;
import com.henu.entity.User;


public class ArticleUtils {
    public static Article formatMap(Article article, User user) {
        article.setAuthorId(user.getId());
        return null;
    }
}
