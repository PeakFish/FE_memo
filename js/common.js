//最短的判断ie6的方法
var ie6=!-[1,]&&!window.XMLHttpRequest;

//判断浏览器的方法
function BrowserVersion(){
    var Sys = {},ua = navigator.userAgent.toLowerCase(),s;
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
    if(Sys.ie){
        return "IE"+Sys.ie;
    }else if(Sys.firefox){
        return "Firefox"+Sys.firefox;
    }else if(Sys.chrome){
        return "Chrome"+Sys.chrome;
    }else if(Sys.opera){
        return "Opera"+Sys.opera;
    }else if(Sys.safari){
        return "Safari"+Sys.safari;
    }else{
        return '';
    }
}

/*Placeholder 功能检测*/
function isPlaceholderSupport(){
    return 'placeholder' in document.createElement('input');  
}

//通过class 获取元素 返回 Array
function getByClass (sClass , oParent) {
    oParent ? oParent : oParent=document ;
    var aResult=[];
    var aEle=oParent.getElementsByTagName('*');

    for(var i=0;i<aEle.length;i++) {
        if(aEle[i].className.search(sClass) != -1) {
            aResult.push(aEle[i]);
        }
    }
    return aResult;
}


function getOffsetTop(o){
    var top=0;
    while(o){//o!=null && o!= document.body
        top+=o.offsetTop;
        o=o.offsetParent;
    }
    return top;
}

function getOffsetLeft(o){
    var left=0;
    while (o){//o!=null && o!= document.body
        left+=o.offsetLeft;
        o=o.offsetParent;
    }
    return left;
}
function getElementPosition(e){
  var x = 0, y = 0;
  while(e){
    x += e.offsetLeft;
    y += e.offsetTop;
    e = e.offsetParent;
  }
  return { x: x, y: y };
}

/*
//判断一个变量是否定义了
!function(){
    var i;
    console.log(eval(valExists("i")));
    console.log(eval(valExists("i2")));
}();
*/
function valExists(valName){
    var arr=[],i=0;
    arr[i++]="var result;";
    arr[i++]="try{";
    arr[i++]=valName+";";
    arr[i++]="result=true;";
    arr[i++]="}catch(e){";
    arr[i++]="result=false;";
    arr[i++]="}";
    arr[i++]="result";
    return arr.join("");
}



//设置css3的属性由于有前缀的原因
function setStyle3(c,a,b){
    c.style["Webkit"+a.charAt(0).toUpperCase()+a.substring(1)]=b;
    c.style["Moz"+a.charAt(0).toUpperCase()+a.substring(1)]=b;
    c.style["ms"+a.charAt(0).toUpperCase()+a.substring(1)]=b;
    c.style["O"+a.charAt(0).toUpperCase()+a.substring(1)]=b;
    c.style[a]=b;
}
//绑定事件
function myAddEvent(obj, ev, fn){
    if(obj.attachEvent){
        obj.attachEvent('on'+ev, fn);//ie
    }else{
        obj.addEventListener(ev, fn, false);//ff
    }
}



//Ajax
function XHR(url, callback, method, data){
    method ? method : method="get" ;
    data ? data : data=null ;

    var myXHR=null;
    if(window.ActiveXObject){
        myXHR=new ActiveXObject("Microsoft.XMLHTTP");
    }else{
        myXHR=new XMLHttpRequest();
    }
    //alert(method);
    //alert(url);
    myXHR.open(method,url,true);
    myXHR.onreadystatechange=function(){
        if(myXHR.readyState == 4){
            callback(myXHR);
        }
    };

    myXHR.send(data);
}


/* 运动框架相关 */
function getStyle(obj, attr){
    return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj, false)[attr];
}

function startMove(obj, json, fnEnd){
    if(obj.timer){
        clearInterval(obj.timer);
    }
    obj.timer=setInterval(function (){
        doMove(obj, json, fnEnd);
    }, 10);
    
    var oDate=new Date();
    
    if(oDate.getTime()-obj.lastMove>30){//这句话是什么意思呢？
        doMove(obj, json, fnEnd);
    }
}

function doMove(obj, json, fnEnd){//让物体开始减速运动
    var iCur=0;//dom运动的终点
    var attr='';//传入的dom属性
    var bStop=true;//假设运动已经该停止了

    for(attr in json){
        iCur = attr=='opacity'?parseInt(100*parseFloat(getStyle(obj, 'opacity'))):parseInt(getStyle(obj, attr));

        if(isNaN(iCur)){
            iCur=0;
        }

        var iSpeed=(json[attr]-iCur)/8;
        iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);

        if(parseInt(json[attr])!=iCur){
            bStop=false;
        }

        if(attr=='opacity'){
            obj.style.filter="alpha(opacity:"+(iCur+iSpeed)+")";
            obj.style.opacity=(iCur+iSpeed)/100;
        }else{
            obj.style[attr]=iCur+iSpeed+'px';
        }
    }

    if(bStop){
        clearInterval(obj.timer);
        obj.timer=null;

        if(fnEnd){
            fnEnd();
        }
    }

    obj.lastMove=(new Date()).getTime();
}
/*
//智能社的运动框架
function getStyle(obj, name){
    if(obj.currentStyle) return obj.currentStyle[name];//ie
    else return getComputedStyle(obj, false)[name];//ff
}
function startMove(obj, json, fnEnd){

    clearInterval(obj.timer);
    obj.timer=setInterval(function (){
        var bStop=true;
        for(var attr in json){

            var cur=0;
            if(attr=='opacity'){
                cur=Math.round(parseFloat(getStyle(obj, attr))*100);
            }else{
                cur=parseInt(getStyle(obj, attr));
            }

            var speed=(json[attr]-cur)/6;
            speed=speed>0?Math.ceil(speed):Math.floor(speed);

            if(cur!=json[attr])
                bStop=false;

            if(attr=='opacity'){
                obj.style.filter='alpha(opacity:'+(cur+speed)+')';
                obj.style.opacity=(cur+speed)/100;
            }else{
                obj.style[attr]=cur+speed+'px';
            }
        }

        if(bStop){
            clearInterval(obj.timer);       
            if(fnEnd)fnEnd();
        }
    }, 30);
}
*/



/* 没有 console的 浏览器的调试方法 [ctrl+c] from 司徒正美*/
if(!window.console){
       window.console = {}
       console.log = function(str){
             avalon.ready(function() {
                        var div = document.createElement("pre");
                        div.className = "mass_sys_log";
                        div.innerHTML = str + ""; //确保为字符串
                        document.body.appendChild(div);
             });
       }
}


/*不使用第三个变量交换两个变量的值*/
/*
a = 1, b = 2;
a = [b, b = a][0];
a // 2
b // 1

a = a ^ b;
b = b ^ a;
a = a ^ b;

*/


//缓存图片的方法
try{

    //var 宽度=123;
    //alert(宽度);
    //window();

}catch(e){

    alert(e.message);
    var cacheimg=new Image();
    cacheimg.onload=function(){
        alert(cacheimg);
        document.body.appendChild(cacheimg);
    }
    cacheimg.src="http://s1.bdstatic.com/r/www/cache/static/global/img/icons_15d9b398.png";
    alert((new Image())+"123");
}



//图片等比缩放
/*
width,height 是图片的原值
target 是 newval 的说明 ，值选择是 width 还是 height 
*/

function changeImg(width,height,newval,target){

    var obj={};

    if(target==="width"){

        obj.width=newval;
        obj.height=Math.round((newval/width)*height);

    }else if(target==="height"){

        obj.width=Math.round((newval/height)*width);
        obj.height=newval;

    }

    return obj;
}


//大城小胖的获取元素样式的函数
//张鑫旭相关博客地址 http://www.zhangxinxu.com/wordpress/?p=2378
var meTools={
    inner: function (obj) {
        var rect = obj.getBoundingClientRect(),
            x = rect.left + (window.pageXOffset ? window.pageXOffset : document.body.scrollTop),
            y = rect.top + (window.pageYOffset ? window.pageYOffset : document.body.scrollLeft),

            //border left
            borderX = parseInt(this.getStyle(obj, 'border-left-width') || 0, 10) || 
                    parseInt(this.getStyle(obj, 'borderLeftWidth') || 0, 10) || 0,

            borderY = parseInt(this.getStyle(obj, 'border-top-width') || 0, 10) || 
                    parseInt(this.getStyle(obj, 'borderTopWidth') || 0, 10) || 0;

        x += borderX;
        y += borderY;

        return { x: x, y: y };
    },

    getStyle: function (obj, prop) {
        var result;
        if (obj.currentStyle)
            result = obj.currentStyle[this.camelize(prop)];
        else if (window.getComputedStyle)
            result = document.defaultView.getComputedStyle(obj, null).getPropertyValue(this.csselize(prop));
        return result;
    },

    camelize: function (str) {
        return str.replace(/-+(.)?/g, function (match, chr){ return chr ? chr.toUpperCase() : '' });
    },

    csselize: function (str) {
        return str.replace(/[A-Z]/g, function (chr){ return chr ? '-' + chr.toLowerCase() : '' });
    }
}


//javascript获取光标位置以及设置光标位置
//参数ctrl为input或者textarea对象，pos为光标要移动到的位置。
//三水清博客 http://js8.in/2010/01/29/javascript%E8%8E%B7%E5%8F%96%E5%85%89%E6%A0%87%E4%BD%8D%E7%BD%AE%E4%BB%A5%E5%8F%8A%E8%AE%BE%E7%BD%AE%E5%85%89%E6%A0%87%E4%BD%8D%E7%BD%AE/

function getCursortPosition (ctrl) {//获取光标位置函数
    var CaretPos = 0;   // IE Support
    if(document.selection){
        ctrl.focus ();
        var Sel = document.selection.createRange ();
        Sel.moveStart ('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
    }else if (ctrl.selectionStart || ctrl.selectionStart == '0')// Firefox support
        CaretPos = ctrl.selectionStart;
    return (CaretPos);
}

function setCaretPosition(ctrl, pos){//设置光标位置函数
    if(ctrl.setSelectionRange){
        ctrl.focus();
        ctrl.setSelectionRange(pos,pos);
    }else if(ctrl.createTextRange){
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}


/*
在众多的方法里面，event.stopImmediatePropagation 算是比较少用的一个方法，拼写上感觉一半像 event.stopPropagation。
对于stopPropagation 的用法大家是众所周知的，他是W3C标准事件方法，用于阻止事件冒泡（非标准情况下，用window.event.stopBubble来阻止冒泡）
而stopImmediatePropagation 的功能比stopPropagation 多一些，除了可以阻止事件冒泡之外，还可以把这个元素绑定的同类型事件也阻止了。

题外：
event.isImmediatePropagationStopped 可以用来确定该元素是否有调用过event.stopImmediatePropagation。

浏览器支持情况：
Firefox >=10Chrome
IE >= 9
Opera
Safari
*/


/*张鑫旭的页面可见性*/
var isPageVisibilitySupport = (function() {
    var support = false;
    if (typeof window.screenX === "number") {
        ["webkit", "moz", "ms", "o", ""].forEach(function(prefix) {
            if (support == false && document[prefix + (prefix? "H": "h") + "idden"] + "" !== "undefined") {
                support = true;
            }
        });
    }
    return support;
})();
//alert(isPageVisibilitySupport);
/*张鑫旭的页面可见性 结束*/

//获取网址中的参数
function getArgs(){

    var args = new Object(); //声明一个空对象
    var query = window.location.search.slice(1); // 取查询字符串，如从 http://www.snowpeak.org/testjs.htm?a1=v1&a2=&a3=v3#anchor 中截出 a1=v1&a2=&a3=v3。
    var pairs = query.split("&"); // 以 & 符分开成数组

    for(var i = 0; i < pairs.length; i++){
        var pos = pairs[i].indexOf('='); // 查找 "name=value" 对
        if (pos == -1) continue; // 若不成对，则跳出循环继续下一对
        var argname = pairs[i].substring(0,pos); // 取参数名
        var value = pairs[i].substring(pos+1); // 取参数值
        value = decodeURIComponent(value); // 若需要，则解码
        args[argname] = value; // 存成对象的一个属性
    }
    return args; // 返回此对象
}


//获取url中的参数
function getQueryStringRegExp(name, url){

    var url = url || location.href;

    var reg = new RegExp("[\?|&]"+ name +"=([^&]*)", "i");

    return reg.exec(url) && reg.exec(url)[1] || "";

/*    if(reg.test(url)){

        return unescape(RegExp.$1.replace(/\+/g, " "));

    }
*/

}


/***********  移动端   *************/

/*
*长按处理函数，不兼容ie10 mobile
*obj是元素
*fn是长按的事件处理函数
*pressTime是按住元素的时间 默认是750毫秒
*/
function mylongTap(obj,fn,pressTime){
    pressTime ? +pressTime : pressTime = 750;
    obj.addEventListener('touchstart', function(e){
        obj.mylongTapTimer=setTimeout(function(){
            fn(e);
        },pressTime);
    }, false);

    obj.addEventListener('touchmove', function(e){
        if(obj.mylongTapTimer){
            clearTimeout( obj.mylongTapTimer );
            obj.mylongTapTimer=null;
        }
    }, false);

    obj.addEventListener('touchend', function(e){
        if(obj.mylongTapTimer){
            clearTimeout( obj.mylongTapTimer );
            obj.mylongTapTimer=null;
        }
    }, false);

    obj.addEventListener('touchcancle', function(e){
        if(obj.mylongTapTimer){
            clearTimeout( obj.mylongTapTimer );
            obj.mylongTapTimer=null;
        }
    }, false);
}

//随机颜色
function getRandomColor(){ return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6); }


/**
 *  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 *  
 *  Function.prototype.bind Polyfill
 *
**/

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis || window,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}


//获取图片原始宽高 http://www.cnblogs.com/snandy/p/3704218.html

function getImgNaturalDimensions(img, callback) {

    if (img.naturalWidth) {// 现代浏览器
        callback(img.naturalWidth, image.naturalHeight);
    } else {// IE6/7/8
        var imgae = new Image();
        image.src = img.src;
        image.onload = function(){
            callback(image.width, image.height);
        };
    }
}



//
function numRange(num, min, max){

    return Math.max(min, Math.min(num, max));

}

function numCircle(num, len){

    num %= len;

    num = num < 0 ? num + len : num ;

    return num;
}


// 工具时间处理函数
// difference in years, months, and days between 2 dates
function DifFechasAMD(dIni, dFin) {
    var dAux, nAnos, nMeses, nDias, cRetorno;
    // final date always greater than the initial
    if (dIni > dFin) {
        dAux = dIni;
        dIni = dFin;
        dFin = dAux;
    }
    // calculate years
    nAnos = dFin.getFullYear() - dIni.getFullYear();
    // translate the initial date to the same year that the final
    dAux = new Date(dIni.getFullYear() + nAnos, dIni.getMonth(), dIni.getDate());
    // Check if we have to take a year off because it is not full
    if (dAux > dFin) {
        --nAnos;
    }
    // calculate months
    nMeses = dFin.getMonth() - dIni.getMonth();
    // We add in months the part of the incomplete Year
    if (nMeses < 0) {
        nMeses = nMeses + 12;
    }
    // Calculate days
    nDias = dFin.getDate() - dIni.getDate();
    // We add in days the part of the incomplete month
    if (nDias < 0) {
        nDias = nDias + DifFechasDiasDelMes(dIni);
    }
    // if the day is greater, we quit the month
    if (dFin.getDate() < dIni.getDate()) {
        if (nMeses == 0) {
            nMeses = 11;
        }
        else {
            --nMeses;
        }
    }
    cRetorno = {"nAnos":nAnos,"nMeses":nMeses,"nDias":nDias};
    return cRetorno;
}

function DifFechasDiasDelMes(date) {
    date = new Date(date);
    return 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
}


//js操作cookie
var docCookies = {
    getItem: function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        if (!sKey) { return false; }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }
};

//博客园在新标签页中执行代码
function runCode(id) {
    obj = document.getElementById(id);
    var TestWin=open(''); //打开一个窗口并赋给变量TestWin。
    TestWin.opener = null // 防止代码对论谈页面修改
    TestWin.document.write(obj.value); //向这个打开的窗口中写入代码code，这样就实现了运行代码功能。
    TestWin.document.close();
}

function LenB(str){
    str = str.replace(/[^\x00-\xff]/g, "**");
    return str.length;
}

//转换数字为千位计数法 http://blog.csdn.net/u013408979/article/details/51910708
function number_format(num){
    return num && num
    .toString()
    .replace(/(^|\s)\d+/g, function(m){
        return m.replace(/(?=(?!\b)(\d{3})+$)/g, ',');
    });
}
