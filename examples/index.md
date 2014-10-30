# Demo

---


## legend

<style>
  .bordered{
    border : 1px solid #ddd;
  }
</style>

````html

<div id="c1"></div>

````

````javascript
seajs.use(['index','achart-canvas','achart-plot'], function(Legend,Canvas,Plot) {
  var types = ['circle','line','rect','circle','line'],
    symbols = ['circle','diamond','square','triangle','triangle-down'],
    colors = [ '#ff6600','#b01111','#ac5724','#572d8a','#333333','#7bab12','#c25e5e','#a6c96a','#133960','#2586e7'];

  var items = [],
    range = new Plot.Range({y : 460,x : 40},{x : 460,y : 40});
  for(var i = 0; i < 5; i++){
    items.push({
      name : 'test ' + i,
      color : colors[i],
      type : types[i],
      symbol : symbols[i]
    });
  }
  
  var canvas = new Canvas({
    id : 'c1',
    elCls : 'bordered',
    width : 500,
    height : 500
  });
  var legend1 = canvas.addGroup(Legend,{
    items : items.slice(0),
    plotRange : range
  });

  legend1.on('itemclick',function(ev){
    var item = ev.item;
    console.log('item click');
  });

  legend1.on('itemover',function(ev){
    var item = ev.item;
    console.log('item over');
  });

  legend1.on('itemout',function(ev){
    var item = ev.item;
    console.log('item out');
  });

  legend1.on('itemchecked',function(ev){
    var item = ev.item;
    console.log('item checked');
  });

  legend1.on('itemunchecked',function(ev){
    var item = ev.item;
    console.log('item unchecked');
  });

  var legend2 = canvas.addGroup(Legend,{
    items : items.slice(0),
    layout : 'vertical',
    dx : -10,//在定位的地点偏移x
    dy : 20, //在定位的地点偏移y
    align : 'right',
    spacingY : 10,
    plotRange : range
  });

   var legend1 = canvas.addGroup(Legend,{
    items : items.slice(0),
    align : 'top',
    plotRange : range
  });

  var legend2 = canvas.addGroup(Legend,{
    items : items.slice(0),
    layout : 'vertical',
    align : 'left',
    plotRange : range
  });

});
````


## events

````html
<p>鼠标移动、点击，触发事件</p>
<div id="log" style="border:1px solid #eee;padding : 10px;margin:10px 0;height:30px;"></div>
<div id="c11"></div>

````

````javascript
seajs.use(['index','achart-canvas','jquery'], function(Legend,Canvas,$) {
  var types = ['circle','line','rect','circle','line'],
    symbols = ['circle','diamond','square','triangle','triangle-down'],
    colors = [ '#ff6600','#b01111','#ac5724','#572d8a','#333333','#7bab12','#c25e5e','#a6c96a','#133960','#2586e7'];

  var items = [];
  for(var i = 0; i < 5; i++){
    items.push({
      name : 'test ' + i,
      color : colors[i],
      type : types[i],
      symbol : symbols[i]
    });
  }

  function log(msg){
    $('#log').text(msg);
  }
  
  var canvas = new Canvas({
    id : 'c11',
    elCls : 'bordered',
    width : 500,
    height : 300
  });
  var legend = canvas.addGroup(Legend,{
    items : items.slice(0),
    x : 50,
    y : 100,
    events : { //也可以 legend.on注册事件
      itemover : function(ev){
        var item = ev.item;
        log(item.get('name') + ' over');
      },
      itemout : function(ev){
        var item = ev.item;
        log(item.get('name') + ' out');
      },
      itemclick : function(ev){
        var item = ev.item;
        log(item.get('name') + ' click');
      },
      itemunchecked : function(ev){
        var item = ev.item;
        log(item.get('name') + ' unchecked');
      },
      itemchecked : function(ev){
        var item = ev.item;
        log(item.get('name') + ' checked');
      }
    }
  });

});
````


## direct use legend


````html

<div id="c12"></div>

````

````javascript
seajs.use(['index','achart-canvas','achart-util'], function(Legend,Canvas,Util) {
  var 
    colors = [ '#ff6600','#b01111','#ac5724','#572d8a','#333333','#7bab12','#c25e5e','#a6c96a','#133960','#2586e7'];
  
  var canvas = new Canvas({
    id : 'c12',
    elCls : 'bordered',
    width : 500,
    height : 200
  });
  
  //圆形
  var group = canvas.addGroup();
  
  var items = [];
  for(var i =0; i< 5;i++){

    var circle = group.addShape('circle',{
      cx : (i + 1) * 50,
      cy : 50,
      r : 10,
      stroke : colors[i]
    });

    items.push({
      name : 'circle ' + i,
      color : colors[i],
      type : 'circle',
      item : circle //将circle缓存到配置项中，通过get方法获取
    });
    
  } 

  var legend = canvas.addGroup(Legend,{
    x : 50,
    y : 100,
    items : items
  });

  legend.on('itemover',function(ev){
    var legendItem = ev.item,
      circle = legendItem.get('item'),
      stroke = circle.attr('stroke');
    circle.attr('fill',Util.highlight(stroke,0.5));
  });

  legend.on('itemout',function(ev){
    var legendItem = ev.item,
      circle = legendItem.get('item');
    circle.attr('fill','none');
  });

  legend.on('itemchecked',function(ev){
    var legendItem = ev.item,
      circle = legendItem.get('item');
    circle.show();
  });

  legend.on('itemunchecked',function(ev){
    var legendItem = ev.item,
      circle = legendItem.get('item');
    circle.hide();
  });
});

````

## use legend width mixin

````html

<div id="c2"></div>

````

````javascript
seajs.use(['index','achart-canvas','achart-plot','achart-util','achart-actived'], function(Legend,Canvas,Plot,Util,Actived) {
  var types = ['circle','line','rect','circle','line'],
    symbols = ['circle','diamond','square','triangle','triangle-down'],
    colors = [ '#ff6600','#b01111','#ac5724','#572d8a','#333333','#7bab12','#c25e5e','#a6c96a','#133960','#2586e7'];


  var canvas = new Canvas({
    id : 'c2',
    elCls : 'bordered',
    width : 500,
    height : 500
  });

  var AGroup = function(cfg){
    AGroup.superclass.constructor.call(this,cfg);
  };

  AGroup.ATTRS = {
    circles : null
  };
  Util.extend(AGroup,Plot.Item);

  Util.mixin(AGroup,[Actived.Group,Legend.UseLegend]);

  Util.augment(AGroup,{
    renderUI : function(){
      AGroup.superclass.renderUI.call(this);
      this._renderCircles(this.get('circles'));
      this.renderLegend();
    },
    _renderCircles : function(circles){
      var _self = this;

      _self.clear();
      Util.each(circles,function(circle){
        _self.addShape('circle',circle);
      });

    },
    //覆写子项是否 actived
    isItemActived : function(item){
      return item.get('actived');
    },
    //覆写状态改变
    setItemActived : function(item,actived){

      var stroke = item.get('attrs').stroke;
      if(actived){
        item.set('actived',true);
        item.attr('stroke',Util.dark(stroke,0.2));
      }else{
        item.set('actived',false);
        item.attr('stroke',Util.highlight(stroke,0.2));
      }
    },
    addCircle : function(circle){
     var child = this.addShape('circle',circle);
      var item = {
          name : 'new ',
          color : child.attr('stroke'),
          type : 'circle',
          item : child
      };
      this.addLengendItem(item);
    },
    //更改内部圆
    changeCircles : function(circles){

      this.set('circles',circles);
      this._renderCircles(circles);
      this.resetLegendItems();
    },
    //覆写 getLengendItems 方法
    getLengendItems : function(){
      var _self = this,
        children = _self.get('children'),
        items = [];
      Util.each(children,function(child,i){
        var item = {
          name : 'test ' + i,
          color : child.attr('stroke'),
          type : types[i],
          symbol : symbols[i],
          item : child
        };
        items.push(item);
      });

      return items;
    },
    //覆写清空
    remove : function(){
      this.removeLegend();
      AGroup.superclass.remove.call(this);
    }
  });

  var circles = [];

  for(var i = 0; i < 5; i++){
    circles.push({
      r : 10,
      cx : 50 * (i + 1),
      cy : 100,
      stroke : colors[i]
    });
  }

  var group = canvas.addGroup(AGroup,{
    legend : {
      x : 100,
      y : 150,
      leaveChecked : true //阻止最后一项也取消勾选
    },
    circles : circles
  });
});

````

