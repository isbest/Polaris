package com.henu.repository;

import com.henu.entity.Article;

import java.util.List;
import java.util.Map;

public interface ArticleRepository {
    int findNextArticleId();
    List<Article> findAll();
    Article findArticleById(int id);
    List<Article> findByTag(String tag);
    int addArticle(Article article);
    int delArticle(Article article);
    int getArticlesNum();
    List<Article> findArticleByPage(Map<String,Object> params);
    List<Article> getRecentlyArticle(int id);
    List<Article> getUserArticles(int id);
}
