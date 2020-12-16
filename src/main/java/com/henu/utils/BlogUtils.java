package com.henu.utils;

import com.henu.entity.Article;
import com.henu.entity.Comment;
import com.henu.entity.Tag;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


public class BlogUtils {
    public static List<String> getArticlesTags(List<Article> articles) {
        Set<String> set = new HashSet<>();
        for (Article artickle :
                articles) {
            for (Tag tag :
                    artickle.getTags()) {
                set.add(tag.getTag());
            }
        }
        if (set.isEmpty()) {
            return null;
        }

        return new ArrayList<>(set);
    }

    public static List<String> getTags(List<Tag> tags) {
        Set<String> set = new HashSet<>();
        for (Tag tag :
                tags) {
            set.add(tag.getTag());
        }
        if (set.isEmpty()) {
            return null;
        }
        return new ArrayList<>(set);
    }

    public static void testComTree(List<Comment> comments) {
        for (Comment comment :
                comments) {
            System.out.println(comments);
            if(comment.getChildCom()!=null) {
                testComTree(comment.getChildCom());
            }
        }
    }

    public static List<Comment> buildComTree(List<Comment> comments) {
        return null;
    }
}
