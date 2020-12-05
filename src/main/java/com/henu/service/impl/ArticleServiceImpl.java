package com.henu.service.impl;

import com.henu.entity.Article;
import com.henu.entity.Tag;
import com.henu.repository.ArticleRepository;
import com.henu.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Override
    public int findNextArticleId() {
        return articleRepository.findNextArticleId();
    }

    @Override
    public List<Article> findAll() {
        return null;
    }

    @Override
    public List<Article> findByTag(Tag tag) {
        return null;
    }

    @Override
    @Transactional
    public int addArticle(Article article) {
        //查询本文章id
        int id = articleRepository.findNextArticleId();
        //插入文章
        int i = articleRepository.addArticle(article);
        return i==1?id:0;
    }

    @Override
    public int delArticle(Article article) {
        return 0;
    }
}
