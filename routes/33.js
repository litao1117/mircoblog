function isPhone(phone) {
    var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(phone)) {
        return false;
    } else {
        return true;
    }
}

var p = 12345678901
isPhone(p);
console.log(isPhone(p))