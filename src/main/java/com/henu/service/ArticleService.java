package com.henu.service;

import com.henu.entity.Article;
import com.henu.entity.Tag;

import java.util.List;
import java.util.Map;

public interface ArticleService {
    int findNextArticleId();
    List<Article> findAll();
    Article findArticleById(int id);
    List<Article> findByTag(Tag tag);
    int addArticle(Article article);
    int delArticle(Article article);
    List<Article> findArticleByPage(int offset, int pageSize);
    List<Article> getRecentlyArticle(int n);
}
