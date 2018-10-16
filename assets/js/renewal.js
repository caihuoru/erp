//续费js

//时间戳转换
function timestampToTime(timestamp,hour) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + '时';
    var m = date.getMinutes() + '分';
    var s = date.getSeconds();
    if(hour){
        return h+m;
    }
    return Y+M+D;
}

// 弹窗
function popup(){
    var expire=document.createElement("div");
        expire.className="expire";
        $("body").append(expire);
        // var html=""
        $("body").append(`<div class="renewal" onselectstart="return false;">
        <div class="renewal-content">
            <div class="renewal-title">7搜装企erp系统充值</div>
            <div class="edition"> <div class="company edition-part">公司版</div> <div class="group edition-part">集团版</div></div>
            <div class="price">
                <div class="price-pick">
                    <span</span>/
                    <p class="original"></p>
                </div>
                <div class="price-pick">
                    <span></span>/
                    <p class="original"></p>
                </div>
                <div class="price-pick">
                    <span></span>/
                    <p class="original"></p>
                </div>
            </div>
            <div class="pay-way">支付方式：扫码</div>
            <div class="pay">
                
                <div class="pay-list">
                    <div class="weixin">
                        微信支付
                    </div>
                    <div class="zhifubao">
                        支付宝支付
                    </div>
                </div>
                <div class="pay_code">
                    <div class="code_img" title='获取二维码'></div>
                    <div class="pay_money">支付金额:<span class="moeny-num"></span><span>￥</span></div>
                    <!-- <div class="try">您目前处于试用期</div> -->
                </div>
            </div>
            
        </div>
    </div>`)
    $(".renewal").show(300);
    // 费用信息渲染
    $.ajax({
        type: "GET",
        cache:false,
        dataType:"json",
        url:domain+"/api/meal.meal/getmeallists",
        success:function(data){
            console.log(data)
            var html='';
            // 充值价格选择
            for(var i=1; i<data.data.length;i++){
                html+='<div class="price-pick" data-packageName='+data.data[i].packageName+' data-id='+data.data[i].guid+'><span>'+data.data[i].price+'</span>/'+data.data[i].packageName+'<p class="original">'+data.data[i].term+'天</p></div>';
            }
            $(".price").html(html);
            // 第一个套餐
            moeny=parseInt($(".price-pick").eq(0).find("span").html());
            product_name=$(".price-pick").eq(0).data("packagename");
            product_id=$(".price-pick").eq(0).data("id");
            // 默认打开
            setTimeout(function(){
                // pay();
                $(".pay_code .pay_money .moeny-num").html($(".price-pick").eq(0).find("span").html());
                $(".price-pick").eq(0).addClass("border-color-red");
                $(".weixin").addClass("bg-color");
            },300)
        }
    })
}
var domain="http://wechat.yzferp.com";
// var domain="http://192.168.0.169:8090";
// 数据信息
var product_data;
var product_id=[];
var product_name;
$.ajax({
    type: "GET",
    cache:false,
    dataType:"json",
    url:domain+"/api/meal.meal/getclientexpired",
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
        console.log(data);
        product_data=data.data;
        var lasttime=Math.ceil((timestamp-(data.data.meal_expire_time-(data.data.term*86400)))/86400);
        // alertSet(总服务期限,过去的天数);
        alertSet(data.data.term,lasttime);
        // 如果已经到期
        if(timestamp<=data.data.meal_expire_time || data.data.is_expired==true){
            popup();
        }
        // 如果是试用期
        else if(data.data.guid==period_id && data.data.is_expired==false){
            popup();
            $(".renewal .renewal-title").append('<span title="关闭">x</span>');
            if(data.data.remain_day<=0){
               
                $(".renewal .renewal-content .pay .pay_code").append('<div class="try">您目前处于试用期 剩余:'+ timestampToTime(data.data.meal_expire_time-timestamp,"hour")+'</div>');
            }else{
                $(".renewal .renewal-content .pay .pay_code").append('<div class="try">您目前处于试用期 剩余:'+data.data.remain_day+'天</div>');
            }
            // timestampToTime()
        }


        
    }
})


// 支付
var pay_type=1;//默认微信支付
var moeny;
var amount=1;
function pay(){
    switch (pay_type){
        // 微信支付
        case 1:
            $.ajax({
                type: "post",
                dataType:"json",
                cache:false,
                // url:"http://192.168.0.169:8090/api/meal.meal/getProductQrCode",
                url:domain+"/api/meal.meal/PayMeal",
                data:{
                    "pay_type":pay_type,
                    "client_id":product_data.client_id,
                    "body":"装企ERP-套餐购买-"+product_name,
                    "total_fee": 1,//(moeny*100),
                    "site_id":product_data.site_id,
                    // "guid":product_data.guid,     
                    "product_id":product_id,
                    "detail":"详情",
                    "amount":amount,
                    
                    // "sign_type":"MD5"
                },
                success:function(data){
                    // console.log(pay_type);
                    console.log(product_name);
                    console.log(product_data.client_id);
                    console.log(moeny);
                    console.log(product_data.site_id)
                    console.log(product_id)
                    
                   
                    $(".renewal .renewal-content .pay .pay_code .code_img").css({"background-image":"url("+data.data.qr_code_url+")"});
                }
            })
            break;
        // 支付宝支付
        case 0:
            layer.msg("支付宝!", {
                icon: 1
            });
            $.ajax({
                type: "post",
                dataType:"json",
                cache:false,
                // url:"http://192.168.0.169:8090/api/meal.meal/getProductQrCode",
                url:domain+"/api/meal.meal/PayMeal",
                data:{
                    "app_id":"app_id",
                    "merchant_private_key":"merchant_private_key",
                    "return_url":"return_url",
                    "charset":"UTF-8",
                    "sign_type":"sign_type",
                    // "guid":product_data.guid,     
                    "getewayUrl":"getewayUrl",
                    "detail":"详情",
                    "alipay_public_key":"alipay_public_key",
                    
                    // "sign_type":"MD5"
                },
                success:function(data){
                    // console.log(pay_type);
                }
            })
            break;
    }
}

// 充值套餐选择
$("body").on("click",".price-pick",function(){
    if($(this).hasClass("border-color-red")){
        return false;
    }
    $(".pay_code .pay_money .moeny-num").html($(this).find("span").html());
    $(".price-pick").removeClass("border-color-red");
    $(this).addClass("border-color-red");
    moeny=parseInt($(this).find("span").html());
    product_name=$(this).data("packagename");
    product_id=$(this).data("id")
    $(".renewal .renewal-content .pay .pay_code .code_img").css({"background-image":"url(../assets/images/index/buy_code.png)"});
    // pay();
})


// 试用期允许关闭
$("body").on("click",".renewal .renewal-title span",function(){
    $(".expire").remove();
    $(".renewal").remove();
})

// 支付方式选择
$("body").on("click",".renewal-content .pay .pay-list div",function(){
    $(".renewal-content .pay .pay-list div").removeClass("bg-color");
    $(this).addClass("bg-color");
    if($(this).hasClass("weixin") && pay_type==1){
        return false;
    }else if($(this).hasClass("zhifubao") && pay_type==0){
        return false;
    }
    if($(this).hasClass("weixin")){
        pay_type=1;
    }else if($(this).hasClass("zhifubao")){
        pay_type=0;
    }
    $(".renewal .renewal-content .pay .pay_code .code_img").css({"background-image":"url(../assets/images/index/buy_code.png)"})
    // pay();
})
var server_back
// 点击获取支付码 并开始轮询
$("body").on("click",".pay_code .code_img",function(){
    pay();
    clearInterval(server_back);
    server_back=setInterval(function(){
        $.ajax({
            type: "GET",
            cache:false,
            
            dataType:"json",
            url:domain+"/api/meal.meal/getclientexpired",
            data:{"vhost_dir":"erp10080"},
            success:function(data){
                if(data.data.term!=product_data.term){
                    window.location.href="/src/index.html"
                    clearInterval(server_back);
                }
                console.log(1);
                // 二维码过期
                if(!data.data){
                    $(".renewal .renewal-content .pay .pay_code .code_img").css({"background-image":"url(../assets/images/index/buy_code.png)"})
                }
            }
        })
    },1000)
})

    // 获取试用期id
    $.ajax({
        type: "GET",
        async:false,
        cache:false,
        dataType:"json",
        url:domain+"/api/meal.meal/getmeallists",
        success:function(data){
            period_id=data.data[0].guid;
        }
    })

    