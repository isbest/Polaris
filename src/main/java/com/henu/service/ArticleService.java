package com.henu.service;

import com.henu.entity.Article;
import com.henu.entity.Tag;

import java.util.List;

public interface ArticleService {
    int findNextArticleId();
    List<Article> findAll();
    List<Article> findByTag(Tag tag);
    int addArticle(Article article);
    int delArticle(Article article);
}
