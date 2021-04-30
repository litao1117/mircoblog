var count = 0;
var dirction = false;
window.onload = function () {
        var ul_img = document.getElementsByClassName("ul_img")[0];
        var li_img = document.getElementsByClassName("li_img");
        var banner = document.getElementsByClassName("banner");
        var spot = document.getElementsByClassName("spot");
        var timer = setInterval(function () {
                if (dirction == false) {
                    count++;
                    ul_img.style.transform = "translate(" + -748 * count + "px)";
                    if (count >= li_img.length - 1) {
                        count = li_img.length - 1;
                        dirction = true;
                    }
                }
                else {
                    count--;
                    ul_img.style.transform = "translate(" + -748 * count + "px)";
                    if (count <= 0) {
                        count = 0;
                        dirction = false;
                    }
                }
            }, 3000)
        for (var b = 0; b < spot.length; b++) {
            spot[b].index = b;
            spot[b].onmouseover = function () {
                clearInterval(timer);
                if (this.index == 3) {
                    dirction = true;
                }
                if (this.index == 0) {
                    dirction = false;
                }
                count = this.index;
                ul_img.style.transform = "translate(" + -748 * this.index + "px)";
            }
            spot[b].onmouseout = function () {
                time();
            }
        }
    }
