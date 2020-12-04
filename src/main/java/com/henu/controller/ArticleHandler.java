package com.henu.controller;

import com.henu.entity.FileInfo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.*;


@Controller
@RequestMapping("/article")
public class ArticleHandler {

    @ResponseBody
    @PostMapping("/fileupload")
    public FileInfo fileUpLoad(HttpServletRequest request) {
        MultipartRequest multipartRequest= (MultipartRequest) request;
        List<MultipartFile> files = multipartRequest.getFiles("file[]"); //获取上传的文件对象

        System.out.println(files.toArray().toString());

        //获取保存文件的路径
        String path = request.getSession().getServletContext().getRealPath("/upload");
        List<String> errFiles = null;
        Map<String,String> succMap = null;

        for (MultipartFile multipartFile :
                files) {
            multipartFile.getOriginalFilename();
            String fileName = multipartFile.getOriginalFilename();
            File file = new File(path,fileName);
            try {
                multipartFile.transferTo(file);
            } catch (IOException e) {
                //记录上传错误的文件
                if(errFiles == null) {
                    errFiles = new ArrayList<>();
                }
                errFiles.add(fileName);
                e.printStackTrace();
            }
            if(succMap == null) {
                succMap = new HashMap<>();
                succMap.put(fileName,path+fileName);
            }
            succMap.put(fileName,path+fileName);
        }

        FileInfo fileInfo = new FileInfo(errFiles, succMap);
        System.out.println(fileInfo.toString());
        return fileInfo;
    }


}
