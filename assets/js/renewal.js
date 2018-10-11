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

// 弹窗
function popup(){
    var expire=document.createElement("div");
        expire.className="expire";
        $("body").append(expire);
        var html=
        $("body").append(`<div class="renewal" onselectstart="return false;">
        <div class="renewal-content">
            <div class="renewal-title">7搜装企erp系统充值</div>
            <div class="price">
                <div class="price-pick">
                    <span>178￥</span>/12个月
                    <p class="original">250￥</p>
                </div>
                <div class="price-pick">
                    <span>45￥</span>/3个月
                    <p class="original">58￥</p>
                </div>
                <div class="price-pick">
                    <span>6￥</span>/1个月
                    <p class="original">19.8￥</p>
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
                    <div class="code_img"></div>
                    <div class="pay_money">支付金额:<span></span></div>
                    <!-- <div class="try">您目前处于试用期</div> -->
                </div>
            </div>
            
        </div>
    </div>`)
    $(".renewal").show(300);

    
    
}


// 数据信息
var product_data;
$.ajax({
    type: "GET",
    cache:false,
    dataType:"json",
    url:"http://192.168.0.169:8090/api/meal.meal/getclientexpired",
    data:{"vhost_dir":"erp10080"},
    success:function(data){

        // 费用信息渲染
        $.ajax({
            type: "GET",
            cache:false,
            dataType:"json",
            url:"http://192.168.0.169:8090/api/meal.meal/getmeallists",
            success:function(data){
                var html='';
                // 充值价格选择
                for(var i=1; i<data.data.length;i++){
                    html+='<div class="price-pick"><span>'+data.data[i].price+'</span>/'+data.data[i].packageName+'<p class="original">'+data.data[i].term+'天</p></div>';
                }
                $(".price").html(html);
                moeny=parseInt($(".price-pick").eq(0).find("span").html());
            }
        })


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
        if(timestamp>=data.data.meal_expire_time || data.data.is_expired==true){
            // 如果已经到期
            popup();
        }
        // 如果是试用期
        else if(data.data.packageName=="试用期（普通）" && data.data.is_expired==false){
            popup();
            $(".renewal .renewal-title").append('<span title="关闭">x</span>');
            $(".renewal .renewal-content .pay .pay_code").append('<div class="try">您目前处于试用期 剩余:'+data.data.remain_day+'天</div>');
        }

    // 默认打开调用一次微信支付点击事件
    setTimeout(function(){
        pay();
        $(".pay_code .pay_money span").html($(".price-pick").eq(0).find("span").html()+"￥");
        $(".price-pick").eq(0).addClass("border-color-red");
        $(".weixin").addClass("bg-color");
    },300)
    }
})


// 支付
var pay_type=1;
var moeny;

function pay(){
    $.ajax({
        type: "post",
        cache:false,
        dataType:"json",
        // url:"http://192.168.0.169:8090/api/meal.meal/getProductQrCode",
        url:"http://192.168.0.169:8090/api/meal.meal/PayMeal",
        data:{
            "pay_type":pay_type,
            "client_id":product_data.client_id,
            "body":"装企ERP-套餐购买",
            "total_fee":(moeny*100),
            "site_id":product_data.site_id,
            // "guid":product_data.guid,     
            "product_id":product_data.guid,
            "detail":"详情"
            // "sign_type":"MD5"
        },
        success:function(data){
            console.log(moeny);
            $(".renewal .renewal-content .pay .pay_code .code_img").css({"background-image":"url("+data.data.qr_code_url+")"})
        }
    })
}

// 充值套餐选择
$("body").on("click",".price-pick",function(){
    // if($(this).hasClass)
    $(".pay_code .pay_money span").html($(this).find("span").html()+"￥");
    $(".price-pick").removeClass("border-color-red");
    $(this).addClass("border-color-red");
    moeny=parseInt($(this).find("span").html());

    pay();
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
    }else if($(this).hasClass("zhifubao") && pay_type==2){
        return false;
    }
    if($(this).hasClass("weixin")){
        pay_type=1;
    }else{
        pay_type=2;
    }
    pay();
    
})