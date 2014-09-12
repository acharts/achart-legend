# 图例

---

图例的功能

---

## 目录

  * 简介
  * 图例项
  * 图例的勾选
  * 图例的位置
  * 图例的事件

### 简介

  * 图例用于标示多个图形元素，每个图例项对应一个图形元素或者多个图形元素
  * 图例将图例项的鼠标事件、点击事件作为自定义事件抛出
  * 图例控制图例项，是否允许勾选，是否保留最后一个不能被取消勾选状态

  ![勾选](http://gtms01.alicdn.com/tps/i1/TB1Iuj0FVXXXXcZXVXXlIWGWXXX-598-144.png)

### 图例项

  * 鼠标 Hover 到图例项是，对应的图形元素处于激活状态，out时取消激活
  * 图例项可以点击取消显示对应的图形，所以图例项有一个 'checked' 属性，默认为true
  * 点击图例项时，图例项取消 'checked' 状态，再次点击则恢复 'checked' 状态

#### 图例项的构成
  
  * 显示的文本(name)
  * 标示图形元素的图形(type)，支持 'rect','cirlce','line'
  * 标示图形的符号(symbol)，是一个[marker](http://spmjs.io/docs/achart-canvas/#marker),支持的类型：circle、square、diamond、triangle、triangle-down

### 图例的勾选

  * 图例项 使用'checked'标示勾选，点击时可以取消勾选
  * 再次点击则恢复勾选状态
  * 图例用'checkable' 属性来标示图例项是否可以勾选，使用'leaveChecked' 标示是否保留最后一项不能取消勾选

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

### 图例的位置和布局

  * 上面的示例中图例有4个位置，使用 align属性，默认为bottom

    * top 顶部左上角
    * left 左侧居中
    * right 右侧居中
    * bottom 底部居中

  * 布局方式有2种 ，使用layout属性

    * horizontal 横向布局，默认
    * vertical 纵向布局

  * 设置了[plotRange](http://spmjs.io/docs/achart-plot/wiki/range.html)属性，align属性才生效

  * 如果未设置plotRange ,可以直接使用 x,y设置图例的位置

### 图例的事件

  * 绑定事件可以通过配置项events传入，也可以通过on函数绑定
  * 通过ev.item可以得到触发事件的选项
  * legend支持的事件有：

    1. itemover  mouseover事件
    2. itemout mouseout事件
    3. itemclick  click事件
    4. itemchecked 勾选图例项
    5. itemunchecked 取消勾选

  
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


### 更多

  * [图例项的使用](use.md)











