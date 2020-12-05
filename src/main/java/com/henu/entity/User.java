package com.henu.entity;


import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

@Data
@NoArgsConstructor
public class User implements Serializable {
    private int id;
    private String userName;
    private String password;
    private String sex;
    private String email;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date birthdayDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date registerDate;
    private String checkCode;
}
