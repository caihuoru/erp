// 点击编辑
$(".function .population").click(function(){
    // 创建遮罩层
    var full=document.createElement("div");
    full.className="full";
    $("body").append(full);
    $(".editor-alert").fadeIn();
})


// 点击遮罩层
function Mask(is){
    $("body").on("click",is, function(){  
        $(".full").remove();
        $(".editor-alert").fadeOut();
        $(".editor-sidebar").hide();
        $(".adds").html("+ 添加");
    })
}
Mask(".full");
Mask(".close-off");

// 常用功能点击效果
$("body").on("click",".editor-alert .separate",function(){
    $(".separate").css({"background":"transparent"});
    $(".index_font2").css({"color":"rgba(26,26,26,1)"});
    $(this).find(".index_font2").css({"color":"#fff"});
    $(this).css({"background":"#D9D9D9"})

})

// 已删除
var already_delet=[];

// 刪除常用功能
$("body").on("click",".separate span",function(){
    var index=$(this).data("del");
    $(this).addClass("edit-pass").parent().fadeOut(function(){
        $(this).remove();
    });
    $(".function .classification-"+index).addClass("pass").parent().fadeOut(function(){
        $(this).remove();
    });
    // 记录已经删除的
    already_delet.push(index);
})


// 编辑内容请求
$.ajax({
    type: "get",
    dataType:"json",
    url:"json/get.json",
    success:function(data){
        var obj={};
        obj.data=data;
        var html = template('tpl', obj);
         $('.editor-sidebar-2').html(html);
         //编辑内容-默认展示  
         $(".ND5924E4061DD27544910").show();

    }
})

// 在线人员
$.ajax({
    type: "get",
    dataType:"json",
    url:"json/get.json",
    success:function(data){
        var obj={};
        obj.data=data;
        var html = template('online', obj);
        $('.online-page').html(html);

        // 判断在线人员是否需要滚动
        if($(".online-page").height()<$(".online-all").height()){
            $(".load-more").hide();
        }
    }
})

// 编辑常用功能增删减tab栏切换
$("body").on("click",".editor-sidebar-1 div",function(){
    $(".editor-sidebar-1 div").removeClass("pick");
    $(this).addClass("pick");

    var num=$(this).data(num);
    $(".add_editor-sidebar").hide();
    $("."+num.nun).show();
})


// 编辑常用功能开关
$(".adds").click(function(){
    if($(this).html()=="+ 添加"){
        $(".editor-sidebar").show(300);
        $(this).html("- 关闭");
    }else{
        $(".editor-sidebar").hide(300);
        $(this).html("+ 添加");
    }
    pick();
})

// 是否选择
function pick(){
    var management=document.querySelectorAll(".add_editor-sidebar .management");
    var separate=document.querySelectorAll(".con_alert .separate .index_font2");
    $(".add_editor-sidebar .management").parent().find("span").css({"color":"#45E3FF","border":"1px solid #45E3FF"}).removeClass("no-yes");
    for(var i=0; i<management.length;i++){
        // console.log($(".add_editor-sidebar .management").eq(i).html());
        for(var j=0; j<separate.length;j++){
            
            if($(".add_editor-sidebar .management").eq(i).html()==$(".separate .index_font2").eq(j).html()){
                $(".add_editor-sidebar .management").eq(i).parent().find("span").css({"color":"#CCCCCC","border":"1px solid #CCCCCC"}).addClass("no-yes");
            }
        }
    }
}
// 默认异步触发一次
setTimeout(pick,300);

// 常用功能增加
$("body").on("click",".add_editor-sidebar .management-pick",function(){
    if($(this).find("span").hasClass("no-yes")){
        layer.msg("已经存在!", {
            icon: 2
        });
        return false;
    }
     var edit_pass=document.querySelectorAll(".editor-alert .special_ .separate").length;
     if(edit_pass<8){
        $(this).next().find("i").html();
         console.log(edit_pass);
         var arr_first=already_delet.shift()
         var add_function='<div class="col-xs-6 col-sm-3 separate"><div class="classification-'+arr_first+'"></div><div class="index_font2">'+$(this).find("i").html()+'</div></div>';
         var add_alert='<div class="col-xs-6 col-sm-3 separate"><div class="classification-'+arr_first+'"></div><span data-del="'+arr_first+'">X</span><div class="index_font2">'+$(this).find("i").html()+'</div></div>';
         $(".editor-alert .special_").append(add_alert);
         $(".function .special_").append(add_function);
        //  $(".pass").eq(edit_pass-1).next().html($(this).find("i").html());
        //  $(".edit-pass").eq(edit_pass-1).next().html($(this).find("i").html());
        //  $(".pass").eq(edit_pass-1).parent().fadeIn().find(".pass").removeClass("pass");
        //  $(".edit-pass").eq(edit_pass-1).parent().fadeIn().find(".edit-pass").removeClass("edit-pass");
     }else{
         layer.msg("不得超过8个!", {
            icon: 2
        });
        return false;
     }
     pick();
})


//关闭或刷新页面触发事件  存储编辑内容
 window.onbeforeunload=function windowOnBeforeUnload() {
    for(var i=1;i<=8;i++){
        localStorage.setItem("classification-"+i, $('.classification-'+i).next().html());
    }
        
    console.log("window.onbeforeunload");
}

// 打开页面加载本地存储
if(localStorage.getItem("classification-1")){
    var local=[];
    for(var i=1;i<=8;i++){
        local[i]=localStorage.getItem("classification-"+i);
        if(local[i]=="undefined"){
            break;
        }
        
        $(".classification-"+i).parent().find(".index_font2").html(local[i]);	
    }
}



// 查看在线人员---滚动
var man_page=0;
$(".load-more").click(function(){
    man_page++;
    var height=$(".online-all").height();
    if(man_page>=Math.ceil($(".online-page").height()/height)){
        // console.log(Math.ceil(height/$(".online-page").height()))
        man_page=0
    }
    $(".online-page").animate({"top":-height*man_page},1000)
    
})



// 首页服务期限倒计时
// 总服务期限:t
// 过去的天数:Past_times
function alertSet(t,Past_times) {
    document.getElementById("js-alert-box").style.display = "block";
    t+=1;
    
    // var t = 10,
    var Total=t;
        n = document.getElementById("js-sec-circle");
    document.getElementById("js-sec-text").innerHTML = t;
    // var time=setInterval(function() {
    if (0 >= t) {
        // 如果到期
        layer.msg("已到期!请续费!", {
            icon: 2
        });
        // clearInterval(time);

        // 续费弹框
        // var expire=document.createElement("div");
        //     expire.className="expire";
        //     $("body").append(expire);
            $(".renewal").show();
            $("#js-sec-text").html("0");
    } else {
        // 已过去多少天
        t -= Past_times;

        //  e=t/服务总期限 * 606 
        var e = t / Total * 606;
        console.log(e);
        n.style.strokeDashoffset = e - 606;
        document.getElementById("js-sec-text").innerHTML = t;
    }
    // },1000);
}
// alertSet(200,199);