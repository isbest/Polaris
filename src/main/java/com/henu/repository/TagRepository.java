package com.henu.repository;

import com.henu.entity.Tag;

import java.util.List;

public interface TagRepository {
    int putTagFromArticle(Tag tag);
    List<Tag> getArticleTagsById(int id);
}
