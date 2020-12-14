//顶部动画

let menu = document.getElementById('page-header');
let goToWarp = document.getElementsByClassName('go-up-warp')[0];
let goToMain = document.getElementsByClassName('go-to-main')[0];
let toggle = document.getElementById('toggle');
let mobileMenu = document.getElementsByClassName('main-menu')[0];
let nav = document.getElementsByTagName('nav')[0];

function getScrollTop() {
  let scrollTop = 0,
    bodyScrollTop = 0,
    documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop =
    bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;
  return scrollTop;
}

function navShow() {
  if (getScrollTop() > 30 && !toggle.checked) {
    menu.classList.add('nav-bar');

    goToWarp.classList.add('go-up-warp-trans');
  }
}

function navHide() {
  if (getScrollTop() < 60 && !toggle.checked) {
    menu.classList.remove('nav-bar');
    goToWarp.classList.remove('go-up-warp-trans');
  }
}

// 判断滚轮方向
let scrollFunc = function (e) {
  e = e || window.event;
  if (e.wheelDelta) {
    //IE/Opera/Chrome
    if (e.wheelDelta === 120) {
      navShow();
    } else {
      navHide();
    }
  } else if (e.detail) {
    //Firefox
    if (e.detail === -3) {
      navHide();
    } else {
      navShow();
    }
  }
};

if (document.addEventListener) {
  document.addEventListener('DOMMouseScroll', scrollFunc, false);
}
window.onmousewheel = document.onmousewheel = scrollFunc;
//scrolldown动画

//回到顶部
goToWarp.onclick = function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  navHide();
};

goToMain.onclick = function () {
  let target = nav.getBoundingClientRect().height - 15;
  window.scrollTo(0, target);
  navShow();
};

toggle.onclick = () => {
  if (toggle.checked) {
    mobileMenu.classList.add('mobile-menu', 'mobile-menu-anno');
  }
  if (!toggle.checked) {
    mobileMenu.classList.remove('mobile-menu', 'mobile-menu-anno');
  }
};
