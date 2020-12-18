package com.henu.utils;

import com.henu.entity.Article;
import com.henu.entity.Comment;
import com.henu.entity.Tag;

import java.util.*;


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

    public static List<Article> desOrderByDate(List<Article> articles) {
        //降序
        Collections.sort(articles, new Comparator<Article>() {
            @Override
            public int compare(Article article, Article t1) {
                if(article.getReleaseDate().compareTo(t1.getReleaseDate()) == -1) {
                    return 1;
                } else if (article.getReleaseDate().compareTo(t1.getReleaseDate()) == 0) {
                    return 0;
                } else {
                    return -1;
                }
            }
        });

        Set<String> years = new HashSet<>();
        Map<Integer,Article> map = new HashMap<>();
        for (int i = 0; i < articles.size(); i++) {
            if(years.add(articles.get(i).getReleaseDate().toString().split(" ")[5])) {
                Article article = new Article();
                article.setId(0);
                article.setTitle(articles.get(i).getReleaseDate().toString().split(" ")[5]);
                map.put(i,article);
            }
        }

        int correction = 0;
        for (Map.Entry<Integer,Article> entry : map.entrySet()) {
            articles.add(entry.getKey()+correction, entry.getValue());
            correction++;
        }

        return articles;
    }



}
