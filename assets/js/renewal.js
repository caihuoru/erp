//续费js

//时间戳转换
function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D;
}




// 用户资料:日期等
$.ajax({
    type: "GET",
    cache:false,
    dataType:"json",
    url:"http://192.168.0.169:8090/api/meal.meal/getclientexpired",
    data:{"vhost_dir":"erp10080"},
    success:function(data){
        // 服务时间
        $(".serve .serve_data p:first-child").html("服务开始时间："+timestampToTime(data.data.meal_expire_time-(data.data.term*86400)));
        $(".serve .serve_data p:last-child").html("服务结束时间："+timestampToTime(data.data.meal_expire_time));

        // 倒计时
        // 获取当前时间戳(以s为单位)
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        //当前时间戳为：timestamp
        console.log(data)
        var lasttime=Math.ceil((timestamp-(data.data.meal_expire_time-(data.data.term*86400)))/86400);
        // alertSet(总服务期限,过去的天数);
        alertSet(data.data.term,lasttime);
        if(timestamp>=data.data.meal_expire_time){
            // 如果已经到期
            var expire=document.createElement("div");
            expire.className="expire";
            $("body").append(expire);
            $(".renewal").show();
        }
    }
})

// 充值选择
$("body").on("click",".price-pick",function(){
    $(".pay_code .pay_money span").html($(this).find("span").html()+"￥");
    $(".price-pick").css({"border":"1px solid #438EB9"});
    $(this).css({"border":"1px solid #f6644c"});
})


// 费用信息
$.ajax({
    type: "GET",
    cache:false,
    dataType:"json",
    url:"http://192.168.0.169:8090/api/meal.meal/getmeallists",
    success:function(data){
        var html='';
        console.log(data.data[0]);
        for(var i=1; i<data.data.length;i++){
            html+='<div class="price-pick"><span>'+data.data[i].price+'</span>/'+data.data[i].packageName+'<p class="original">'+data.data[i].term+'天</p></div>';
        }
        $(".price").html(html);
        
    }

})