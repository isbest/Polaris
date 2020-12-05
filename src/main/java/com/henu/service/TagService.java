package com.henu.service;

import com.henu.entity.Tag;

import java.util.List;

public interface TagService {
    boolean putTagFromArticle(List<Tag> tags);
}
