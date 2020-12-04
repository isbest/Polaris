const container = document.getElementById('container');
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const jumpToUp = document.getElementsByClassName('jump-to-up')[0];
const jumpToIn = document.getElementsByClassName('jump-to-in')[0];
const singIn = document.getElementsByClassName('sign-in-container')[0];
const singUp = document.getElementsByClassName('sign-up-container')[0];

signUpButton.onclick = function () {
    container.classList.add('penal-right-active');
};

signInButton.onclick = function () {
    container.classList.remove('penal-right-active');
};

jumpToUp.addEventListener(
    'click',
    function (event) {
        singUp.style.display = 'flex';
        singIn.style.display = 'none';
        event.preventDefault();
    },
    false
);

jumpToIn.addEventListener(
    'click',
    function (event) {
        singUp.style.display = 'none';
        singIn.style.display = 'flex';
        event.preventDefault();
    },
    false
);

$(function () {
    $("#register").bind('click', function () {
        $.ajax({
            type: "POST",
            url: "/user/register",
            data: $("#registerForm").serialize(),
            dataType: "json",
            crossDomain: true,
            success: function (newData) {
                if (newData != null || newData !== '') {
                    for (const mapKey in newData) {
                        console.log()
                        if (newData[mapKey] == 20) {
                            $('#registerMail').css("background-color", "#FF0202");
                        }
                        if (newData[mapKey] == 21) {
                            $('#registerCheckCode').css("background-color", "#FF0202");
                        }
                        if (newData[mapKey] == 22) {
                            container.classList.remove('penal-right-active');
                        }
                    }
                }
            }
        })
    })

    $("#login").bind("click", function () {
        $.ajax({
            type: "POST",
            url: "/user/login",
            data: $("#loginForm").serialize(),
            dataType: "json",
            crossDomain: true,
            success: function (newData) {
                if (newData != null || newData !== '') {
                    console.log(newData)
                    for (const mapKey in newData) {
                        if (newData[mapKey] == 27) {
                            console.log("登录失败")
                        }
                        if (newData[mapKey] == 24) {
                            console.log("该邮箱未注册")
                            container.classList.add('penal-right-active');
                        }
                        if (newData[mapKey] == 25) {
                            console.log("重复登录")
                            alert("请勿重复登录")
                        }
                        if (newData[mapKey] == 28) {
                            console.log("密码错误")
                            $("#loginPassword").css("background-color", "#FF0202")
                        }
                        if (newData[mapKey] == 26) {
                            console.log("登录成功")
                            window.location.href = "/index.html"
                        }
                    }
                }
            }
        })
    })
})