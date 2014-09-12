# 图例使用

---

使用图例和使用图例扩展

---

## 目录

  * 简介  
  * 使用图例
  * 使用图例扩展

### 简介

  * 图例可以直接通过addGroup的方式添加到画布上，根据标示的图形元素生成图例项，然后监听图例的事件操作对应的图形元素
  * 我们提供了一个图例扩展用于处理那些图例项跟图形元素一一对应的场景

### 使用图例

  * 直接使用图例的步骤如下：

    1. 创建图形元素对应的图例项配置项集合（items)
    2. 通过addGroup(Legend,cfg)将图例添加到画布上
    3. 监听 legend的 itemover,itemout,itemclick,itemchecked,itemunchecked事件，操作对应的图形

  * 下面示例说明了上面的步骤

````html

<div id="c1"></div>

````

````javascript
seajs.use(['index','achart-canvas','achart-util'], function(Legend,Canvas,Util) {
  var 
    colors = [ '#ff6600','#b01111','#ac5724','#572d8a','#333333','#7bab12','#c25e5e','#a6c96a','#133960','#2586e7'];
  
  var canvas = new Canvas({
    id : 'c1',
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

### 使用图例扩展

  * 为了便于开发者使用图例和减少重复代码，我们提供了Legend.UseLegend的扩展
  * Legend.UseLegend解决了一下问题

    1. 图例和图例项的生成和销毁
    2. 图例的事件监听，鼠标hover和out时会设置 actived，点击取消勾选或者勾选时，隐藏显示对应的图形元素
    3. 图形元素变化是图例跟随变化

  * 如果需要actived状态，引入 [Actived.Group扩展](http://spmjs.io/docs/achart-actived/wiki/group.html)
  
#### 此扩展提供的接口

  * renderLegend 入口文件，渲染legend
  * getLengendItems 获取图例子项的配置项
  * addLengendItem(item) 增加一个图例项
  * getByLendItem(legendItem) 获取关联的图形元素
  * resetLegendItems 重置
  * removeLegend 移除时的清理函数

#### 使用扩展的步骤

  * 覆写getLengendItems()方法 自动生成图例项
  * 覆写 getByLendItem(legendItem) 方法，获取图例项关联的图形元素
  * 渲染控件时调用入口文件 renderLegend() 
  * 发生改变时调用 resetLegendItems() 重置图例项
  * 添加图例项 addLengendItem(item)
  * 移除时 调用removeLegend() 清理函数

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



