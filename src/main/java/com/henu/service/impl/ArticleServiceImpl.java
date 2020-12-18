package com.henu.service.impl;

import com.henu.entity.Article;
import com.henu.entity.Tag;
import com.henu.repository.ArticleRepository;
import com.henu.repository.TagRepository;
import com.henu.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private TagRepository tagRepository;

    @Override
    public int findNextArticleId() {
        return articleRepository.findNextArticleId();
    }

    @Override
    public int getArticlesNum() {
        return articleRepository.getArticlesNum();
    }

    @Override
    @Transactional
    public List<Article> findAll() {
        List<Article> all = articleRepository.findAll();
        for (Article article:
             all) {
            List<Tag> articleTagsById = tagRepository.getArticleTagsById(article.getId());
            article.setTags(articleTagsById);
        }
        return all;
    }

    @Override
    @Transactional
    public Article findArticleById(int id) {
        Article articleById = articleRepository.findArticleById(id);
        List<Tag> articleTagsById = tagRepository.getArticleTagsById(id);
        articleById.setTags(articleTagsById);
        return articleById;
    }

    @Override
    public List<Article> findByTag(String tag) {
        return articleRepository.findByTag(tag);
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

    //分页查询
    @Override
    @Transactional
    public List<Article> findArticleByPage(int offset, int pageSize) {
        Map<String,Object> params = new HashMap<>();
        params.put("offset",offset);
        params.put("pageSize",pageSize);
        List<Article> articleByPage = articleRepository.findArticleByPage(params);
        for (Article article :
                articleByPage) {
            List<Tag> articleTagsById = tagRepository.getArticleTagsById(article.getId());
            article.setTags(articleTagsById);
        }

        return articleByPage;
    }

    //最近2天的文章
    @Override
    public List<Article> getRecentlyArticle(int n) {
        return articleRepository.getRecentlyArticle(n);
    }

    @Override
    public List<Article> getUserArticles(int id) {
        return articleRepository.getUserArticles(id);
    }

}
