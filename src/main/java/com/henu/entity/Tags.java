package com.henu.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Tags {
    private int id;
    private int articleId;
    private String tag;
}
