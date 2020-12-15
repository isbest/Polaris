package com.henu.controller;

import com.henu.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/system")
public class SystemHandler {
    //2020-12-12的0点的毫秒值
    private static final long START_DATE = 1607702403030L;

    @Autowired
    private ArticleService articleService;

    //获取文章数量
    @RequestMapping("/api/sysInfo")
    @ResponseBody
    @CrossOrigin(origins = "*")
    public Map<String,Object> getArticlesNum() {
        Map<String,Object> map = new HashMap<>();
        map.put("articlesNum",articleService.getArticlesNum());
        map.put("runDays",(System.currentTimeMillis() - START_DATE)/1000/60/60/24);
        return map;
    }
}
