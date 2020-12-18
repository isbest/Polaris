package com.henu.controller;

import com.henu.code.Code;
import com.henu.entity.Article;
import com.henu.entity.FileInfo;
import com.henu.entity.Tag;
import com.henu.entity.User;
import com.henu.service.ArticleService;
import com.henu.service.TagService;
import com.henu.utils.BlogUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.*;


@Controller
@RequestMapping("/article")
public class ArticleHandler {
    private static final int pageSize = 5;
    @Autowired
    private ArticleService articleService;
    @Autowired
    private TagService tagService;

    //对接vditor的文件上传
    @ResponseBody
    @PostMapping("/fileupload")
    @CrossOrigin(origins = "*")
    public Map<String, Object> fileUpLoad(HttpServletRequest request) {
        MultipartRequest multipartRequest = (MultipartRequest) request;
        List<MultipartFile> files = multipartRequest.getFiles("file[]"); //获取上传的文件对象

        //获取保存文件的路径
        String path = request.getSession().getServletContext().getRealPath("/upload");
        List<String> errFiles = null;
        Map<String, String> succMap = null;
        int code = 0;
        String msg = "上传成功";

        for (MultipartFile multipartFile : files) {
            String fileName = multipartFile.getOriginalFilename();
            File file = new File(path, fileName);
            try {
                multipartFile.transferTo(file);
            } catch (IOException e) {
                //记录上传错误的文件
                if (errFiles == null) {
                    errFiles = new ArrayList<>();
                }
                errFiles.add(fileName);
                code = 1;
                msg = "上传失败";
                e.printStackTrace();
            }

            if (succMap == null) {
                succMap = new HashMap<>();
            }
            succMap.put(fileName, "http://localhost:8080/upload/" + fileName);
            System.out.println(succMap.toString());
        }

        //封装返回信息
        HashMap<String, Object> res = new HashMap<>();
        FileInfo fileInfo = new FileInfo(errFiles == null ? new String[]{} : errFiles.toArray(new String[]{}), succMap);
        res.put("code", code);
        res.put("msg", msg);
        res.put("data", fileInfo);

        System.out.println(res.toString());
        return res;
    }

    //发布新文章
    @PostMapping("/add")
    @ResponseBody
    public Map<String, Object> addArticle(@RequestBody Article article, HttpServletRequest request) {
        Map<String, Object> map = new HashMap<>();
        User user = (User) request.getSession().getAttribute("user");
        if (user == null) {
            map.put("msg", Code.NO_USER_LOGIN);
            return map;
        }
        //设置用户id
        article.setAuthorId(user.getId());
        int i = articleService.addArticle((Article) article);
        if (i == 0) {
            map.put("msg", Code.ARTICLE_ERROR);
            return map;
        }

        //设置标签的文章id
        List<Tag> tags = article.getTags();
        for (Tag tag :
                tags) {
            tag.setArticleId(i);
        }

        boolean putTagFlag = tagService.putTagFromArticle(tags);
        if (!putTagFlag) {
            map.put("msg", Code.TAGS_ERROR);
            return map;
        }

        map.put("msg", Code.ADD_ARTICLE_SUCCESS);
        return map;
    }

    //文章详细信息,API
    @GetMapping("/api/{id}")
    @ResponseBody
    @CrossOrigin(origins = "*")
    public Article getArticleById(@PathVariable String id) {
        Article articleById = articleService.findArticleById(Integer.parseInt(id));
        return articleById;
    }

    @RequestMapping("/id")
    public String toArticle(int id) {
        return "article";
    }

    @RequestMapping("/api/timeLine")
    @CrossOrigin(origins = "*")
    @ResponseBody
    public List<Article> getTimeLine() {
        return articleService.findAll();
    }


    //最近文章
    @ResponseBody
    @RequestMapping("/api/recent/{n}")
    @CrossOrigin(origins = "*")
    public List<Article> getRecentlyArticle(@PathVariable String n) {
        return articleService.getRecentlyArticle(Integer.parseInt(n));
    }

    //文章分页
    @GetMapping("/api/page/{pageNum}")
    @ResponseBody
    @CrossOrigin(origins = "*")
    public List<Article> getArticleByPage(@PathVariable String pageNum) {
        List<Article> articleByPage = articleService.findArticleByPage(Integer.parseInt(pageNum) * pageSize, pageSize);
        return articleByPage;
    }

    //所有文章测试
    @RequestMapping("/api/getArticles")
    @CrossOrigin(origins = "*")
    @ResponseBody
    public List<Article> getArticles() {
        return articleService.findAll();
    }

    //按时间排序升序 在线用户
    @RequestMapping("/time/line")
    @ResponseBody
    @CrossOrigin(origins = "*")
    public List<Article> getArticleByUser(HttpServletRequest request){
        User user = (User) request.getSession().getAttribute("user");
        if(user == null) {
            return null;
        }
        List<Article> userArticles = articleService.getUserArticles(user.getId());
        return BlogUtils.desOrderByDate(userArticles);
    }

    //按时间排序升序api
    @RequestMapping("/api/time/line/{id}")
    @ResponseBody
    @CrossOrigin(origins = "*")
    public List<Article> getArticleInfoById(@PathVariable String id){
        List<Article> userArticles = articleService.getUserArticles(Integer.parseInt(id));
        return BlogUtils.desOrderByDate(userArticles);
    }

    //页面跳转
    @RequestMapping("/archives")
    public String toArchives(int id) {
        return "archives";
    }

    //按照标签查询
    @RequestMapping("/api/tag/{tag}")
    @ResponseBody
    @CrossOrigin(origins = "*")
    public List<Article> findArticleByTagName(@PathVariable String tag) {
        return articleService.findByTag(tag);
    }

}
