package com.henu.repository;

import com.henu.entity.Article;
import com.henu.entity.Tag;

import java.util.List;
import java.util.Map;

public interface ArticleRepository {
    int findNextArticleId();
    List<Article> findAll();
    Article findArticleById(int id);
    List<Article> findByTag(Tag tag);
    int addArticle(Article article);
    int delArticle(Article article);
    List<Article> findArticleByPage(Map<String,Object> params);
    List<Article> getRecentlyArticle(int id);
}
