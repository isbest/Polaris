package com.henu.service;

import com.henu.entity.Article;

import java.util.List;

public interface ArticleService {
    int findNextArticleId();
    List<Article> findAll();
    Article findArticleById(int id);
    List<Article> findByTag(String tag);
    int addArticle(Article article);
    int delArticle(Article article);
    List<Article> findArticleByPage(int offset, int pageSize);
    List<Article> getRecentlyArticle(int n);
}
