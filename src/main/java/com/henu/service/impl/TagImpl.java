package com.henu.service.impl;

import com.henu.entity.Tag;
import com.henu.repository.ArticleRepository;
import com.henu.repository.TagRepository;
import com.henu.service.TagService;
import com.henu.utils.BlogUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TagImpl implements TagService {
    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private ArticleRepository articleRepository;

    @Override
    @Transactional
    public boolean putTagFromArticle(List<Tag> tags) {
        int count = 0;
        for (Tag tag : tags) {
            int i = tagRepository.putTagFromArticle(tag);
            count++;
        }
        if(count == tags.size()) {
            return true;
        }
        return false;
    }

    @Override
    public List<Tag> getArticleTagsById(int id) {
        List<Tag> articleTagsById = tagRepository.getArticleTagsById(id);
        return articleTagsById;
    }

    @Override
    public List<String> getAllTags() {
        List<Tag> allTags = tagRepository.getAllTags();
        return BlogUtils.getTags(allTags);
    }

}
