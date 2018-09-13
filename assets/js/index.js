jQuery(function($) {
    $('.easy-pie-chart.percentage').each(function(){
        var $box = $(this).closest('.infobox');
        var barColor = $(this).data('color') || (!$box.hasClass('infobox-dark') ? $box.css('color') : 'rgba(255,255,255,0.95)');
        var trackColor = barColor == 'rgba(255,255,255,0.95)' ? 'rgba(255,255,255,0.25)' : '#E2E2E2';
        var size = parseInt($(this).data('size')) || 50;
        $(this).easyPieChart({
            barColor: barColor,
            trackColor: trackColor,
            scaleColor: false,
            lineCap: 'butt',
            lineWidth: parseInt(size/10),
            animate: ace.vars['old_ie'] ? false : 1000,
            size: size
        });
    })

    $('.sparkline').each(function(){
        var $box = $(this).closest('.infobox');
        var barColor = !$box.hasClass('infobox-dark') ? $box.css('color') : '#FFF';
        $(this).sparkline('html',
                         {
                            tagValuesAttribute:'data-values',
                            type: 'bar',
                            barColor: barColor ,
                            chartRangeMin:$(this).data('min') || 0
                         });
    });


  //flot chart resize plugin, somehow manipulates default browser resize event to optimize it!
  //but sometimes it brings up errors with normal resize event handlers
  $.resize.throttleWindow = false;

  var placeholder = $('#piechart-placeholder').css({'width':'90%' , 'min-height':'150px'});
  var data = [
    { label: "销售月冠：",  data: 38.7, color: "#68BC31"},
    { label: "设计月冠：",  data: 24.5, color: "#2091CF"},
    { label: "我的业务量",  data: 8.2, color: "#AF4E96"},
    { label: "我的设计量",  data: 18.6, color: "#DA5430"},
    // { label: "other",  data: 10, color: "#FEE074"}
  ]
  function drawPieChart(placeholder, data, position) {
       $.plot(placeholder, data, {
        series: {
            pie: {
                show: true,
                tilt:0.8,
                highlight: {
                    opacity: 0.25
                },
                stroke: {
                    color: '#fff',
                    width: 2
                },
                startAngle: 2
            }
        },
        legend: {
            show: true,
            position: position || "ne", 
            labelBoxBorderColor: null,
            margin:[-30,15]
        }
        ,
        grid: {
            hoverable: true,
            clickable: true
        }
     })
 }
 drawPieChart(placeholder, data);

 /**
 we saved the drawing function and the data to redraw with different position later when switching to RTL mode dynamically
 so that's not needed actually.
 */
 placeholder.data('chart', data);
 placeholder.data('draw', drawPieChart);


  //pie chart tooltip example
  var $tooltip = $("<div class='tooltip top in'><div class='tooltip-inner'></div></div>").hide().appendTo('body');
  var previousPoint = null;

  placeholder.on('plothover', function (event, pos, item) {
    if(item) {
        if (previousPoint != item.seriesIndex) {
            previousPoint = item.seriesIndex;
            var tip = item.series['label'] + " : " + item.series['percent']+'%';
            $tooltip.show().children(0).text(tip);
        }
        $tooltip.css({top:pos.pageY + 10, left:pos.pageX + 10});
    } else {
        $tooltip.hide();
        previousPoint = null;
    }
    
 });

    /////////////////////////////////////
    $(document).one('ajaxloadstart.page', function(e) {
        $tooltip.remove();
    });




   
    
    //Android's default browser somehow is confused when tapping on label which will lead to dragging the task
    //so disable dragging when clicking on label
    var agent = navigator.userAgent.toLowerCase();
    if(ace.vars['touch'] && ace.vars['android']) {
      $('#tasks').on('touchstart', function(e){
        var li = $(e.target).closest('#tasks li');
        if(li.length == 0)return;
        var label = li.find('label.inline').get(0);
        if(label == e.target || $.contains(label, e.target)) e.stopImmediatePropagation() ;
      });
    }

    $('#tasks').sortable({
        opacity:0.8,
        revert:true,
        forceHelperSize:true,
        placeholder: 'draggable-placeholder',
        forcePlaceholderSize:true,
        tolerance:'pointer',
        stop: function( event, ui ) {
            //just for Chrome!!!! so that dropdowns on items don't appear below other items after being moved
            $(ui.item).css('z-index', 'auto');
        }
        }
    );
    $('#tasks').disableSelection();
    $('#tasks input:checkbox').removeAttr('checked').on('click', function(){
        if(this.checked) $(this).closest('li').addClass('selected');
        else $(this).closest('li').removeClass('selected');
    });


    //show the dropdowns on top or bottom depending on window height and menu position
    $('#task-tab .dropdown-hover').on('mouseenter', function(e) {
        var offset = $(this).offset();

        var $w = $(window)
        if (offset.top > $w.scrollTop() + $w.innerHeight() - 100) 
            $(this).addClass('dropup');
        else $(this).removeClass('dropup');
    });

})