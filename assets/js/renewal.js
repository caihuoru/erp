//续费js
$.ajax({
    type: "GET",
    cache:false,
    dataType:"json",
    url:"http://192.168.0.169:8090/api/meal.meal/getclientexpired",
    data:{"vhost_dir":"erp10080"},
    success:function(data){
        console.log(data.data[0].meal_expire_time);

        // 获取当前时间戳(以s为单位)
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        //当前时间戳为：timestamp
        console.log(timestamp);
        if(timestamp>=data.data[0].meal_expire_time){
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