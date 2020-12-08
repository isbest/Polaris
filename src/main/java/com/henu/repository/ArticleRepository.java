package com.henu.repository;

import com.henu.entity.Article;
import com.henu.entity.Tag;

import java.util.List;

public interface ArticleRepository {
    int findNextArticleId();
    List<Article> findAll();
    Article findArticleById(int id);
    List<Article> findByTag(Tag tag);
    int addArticle(Article article);
    int delArticle(Article article);
}
