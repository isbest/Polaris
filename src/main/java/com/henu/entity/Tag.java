package com.henu.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Tag {
    private Integer id;
    private Integer articleId;
    private String tag;
}
