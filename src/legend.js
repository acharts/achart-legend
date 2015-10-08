/**
 * @fileOverview 图例，用于标志具体的数据序列，并跟数据序列进行交互
 * @ignore
 */

var Util = require('achart-util'),
  PlotItem = require('achart-plot').Item,
  Item = require('./legenditem'),
  LINE_HEIGHT = 15,
  PADDING = 5;

/**
 * @class Chart.Legend
 * 图例
 *
 * - <a href="http://spmjs.io/docs/achart-legend/" target="_blank">文档</a>
 * - <a href="http://spmjs.io/docs/achart-legend/wiki/" target="_blank">wiki</a>
 *
 * @extends Chart.Plot.Item
 */
var Legend = function(cfg){
  Legend.superclass.constructor.call(this,cfg);
};

Legend.ATTRS = {
  zIndex : 8,
  elCls : 'x-chart-legend',
  /**
   * 子项的集合 详见Chart.Legend.Item
   * @type {Array}
   */
  items : null,

  /**
   * 排布时子项之间x间距 可以是一个padding数组 默认是5
   * @type {Array || Number}
   */
  spacingX : PADDING,

  /**
   * 排布时子项之间y间距 可以是一个padding数组 默认是5
   * @type {Array || Number}
   */
  spacingY : PADDING,

  /**
   * 子项的配置信息
   * @type {Object}
   */
  itemCfg : null,

  /**
   * 是否可以勾选
   * @type {Boolean}
   */
  checkable : true,

  /**
   * 标题配置信息
   * @type {Object}
   */
  titleCfg: {
    'text-anchor': 'start',
    'font-size': 12,
    y: 10,
    x: 15
  },

  /**
   * 标题
   * @type {String}
   */
  title: null,

  /**
   * 是否保留最后一项勾选
   * @type {Boolean}
   */
  leaveChecked : true,

  /**
   * 布局方式： horizontal，vertical
   * @type {String}
   */
  layout : 'horizontal',
  /**
   * 对齐位置的偏移量x
   * @type {Number}
   */
  dx : 0,
  /**
   * 对齐位置的偏移量y
   * @type {Number}
   */
  dy : 0,
  /**
   * 对齐方式,top,left,right,bottom
   * @type {String}
   */
  align : 'bottom',
  /**
   * 边框的配置项，一般是一个正方形
   * @type {Object}
   */
  back : {
    stroke : '#909090',
    fill : '#fff'
  }

  /**
   * @event itemover
   * 图例项鼠标进入
   * @param {Object} ev 事件对象
   * @param {Chart.Legend.Item}  ev.item 图例项
   */

  /**
   * @event itemout
   * 图例项鼠标 out
   * @param {Object} ev 事件对象
   * @param {Chart.Legend.Item} ev.item  图例项
   */

  /**
   * @event itemclick
   * 图例项鼠标点击
   * @param {Object} ev 事件对象
   * @param {Chart.Legend.Item} ev.item  图例项
   */


   /**
   * @event itemchecked
   * 图例项勾选
   * @param {Object} ev 事件对象
   * @param {Chart.Legend.Item} ev.item  图例项
   */

  /**
   * @event itemunchecked
   * 图例项取消勾选
   * @param {Object} ev 事件对象
   * @param {Chart.Legend.Item} ev.item  图例项
   */
}

Util.extend(Legend,PlotItem);

Util.augment(Legend,{

  renderUI : function(){
    var _self = this
    Legend.superclass.renderUI.call(_self);
    _self._renderTitle();
    _self._renderItems();
    _self._renderBorder();
  },
  bindUI : function(){
    Legend.superclass.bindUI.call(this);
    var _self = this;

    _self.on('mousemove',function(ev){
      if(ev.stopPropagation){
        ev.stopPropagation();
      }else{
        window.event.cancelBubble = true;
      }
    });

    _self._bindOverOut();
    _self._bindClick();
  },
  //绑定over ,out
  _bindOverOut : function(){
    var _self = this;

    _self.on('mouseover',function(ev){
      var item = _self.getItemByNode(ev.target);
      if(item){
        _self.fire('itemover',{item : item});
      }
    });
    _self.on('mouseout',function(ev){
      var item = _self.getItemByNode(ev.target);
      if(item){
        _self.fire('itemout',{item : item});
      }
    });
  },
  //绑定点击事件
  _bindClick : function(){
    var _self = this,
      checkable = _self.get('checkable');
    if(checkable){
      _self.on('click',function(ev){
        var item = _self.getItemByNode(ev.target);
        if(item){
          _self.fire('itemclick',{item : item});
          if(checkable){
            var checked = item.get('checked');
            if(_self.get('leaveChecked') && checked && _self._getLeaveCount() == 1){
              return;
            }
            item.set('checked',!checked);
            if(checked){
              _self.fire('itemunchecked',{item : item});
            }else{
              _self.fire('itemchecked',{item : item});
            }
          }
        }
      });
    }
  },
  /**
   * @protected
   * 根据DOM 获取图例子项
   */
  getItemByNode : function(node){
    var _self = this;
    var itemsGroups = _self.get('itemsGroups');
    var items = [];
    var rst = null;
    if(itemsGroups && itemsGroups.length > 0){
      for(var i = 0; i < itemsGroups.length; i ++){
        var ig  = itemsGroups[i];
        items = items.concat(ig.get('children'));
      }
    }else{
      items = itemsGroup.get('children');
    }
    Util.each(items,function(item){
      if(item.containsElement(node)){
        rst = item;
        return false;
      }
    });

    return rst;
  },

  _getLeaveCount : function(){
    var _self = this;
    var itemsGroups = _self.get('itemsGroups');
    var items = [];
    var tmpArr = [];
    if(itemsGroups && itemsGroups.length > 0){
      for(var i = 0; i < itemsGroups.length; i ++){
        var ig  = itemsGroups[i];
        items = items.concat(ig.get('children'));
      }
    }else{
      items = itemsGroup.get('children');
    }

    tmpArr = Util.filter(items,function(item){
      return item.get('checked');
    })
    return tmpArr.length;
  },

  _renderItems : function(){
    var _self = this,
      items = _self.get('items'),
      itemsGroup = _self.addGroup();

    //添加itemsGroup数组
    var itemsGroups = [];
    _self.set('itemsGroups',itemsGroups);
    itemsGroups.push(itemsGroup);

    _self.set('itemsGroup',itemsGroup);
    _self._setItems(items);

  },
  //设置子项
  _setItems : function(items){
    var _self = this;

    Util.each(items,function(item,index){
      _self._addItem(item,index);
    });
    if(items && items.length){
      _self.resetPosition();
      _self.resetBorder();
    }
  },
  /**
   * 添加图例
   * @param {Object} item 图例项的配置信息
   */
  addItem : function(item){
    var _self = this,
      items = _self.get('items');

    _self._addItem(item,items.length);
    _self.resetBorder();
    _self.resetPosition();
  },
  /**
   * 设置选项
   * @param {Array} items 选项集合
   */
  setItems : function(items){
    var _self = this,
      itemsGroups = _self.get('itemsGroups');

    var length = itemsGroups.length;
    for(var i = length - 1;i >= 0; i --){
      var itemsGroup = itemsGroups[i];
      itemsGroup.remove();
    }
    itemsGroups = [];
    var itemsGroup = _self.addGroup();
    itemsGroups.push(itemsGroup);
    _self.set('itemsGroups',itemsGroups);
    _self.set('itemsGroup',itemsGroup);
    _self.set('items',items);
    _self._setItems(items);
  },
  //添加图例
  _addItem : function(item,index){
    var _self = this,
      itemsGroup = _self.get('itemsGroup'),
      x = _self._getNextX(),
      y = _self._getNextY(),
      itemCfg = _self.get('itemCfg'),
      cfg = Util.mix({x : x,y : y,formatter: _self.get('formatter')},item,itemCfg);

    cfg.legend = _self;
    var newItem = itemsGroup.addGroup(Item,cfg);
    //判断是不是超出plotrange
    _self._checkOverflow(item,index,newItem);
  },
  //判断是否溢出
  _checkOverflow: function(item,index,newItem){
    var _self = this;
    var itemsGroup = _self.get('itemsGroup');
    var bBox = itemsGroup.getBBox();
    var plotRange = _self.get('plotRange');
    var spacingX = _self.get('spacingX');
    var spacingY = _self.get('spacingY');
    var itemsGroups = _self.get('itemsGroups');
    if(!plotRange){
      return;
    }
    var top = plotRange.tl;
    var end = plotRange.br;
    var maxWidth = end.x - top.x;
    var maxHeight = end.y - top.y;

    //横向排列
    if(_self.get('layout') == 'horizontal'){
      //溢出了
      if(bBox.width + spacingX > maxWidth){
        newItem.remove();
        //缓存最大宽度
        var borderWidth = _self.get('borderWidth');
        if(!borderWidth){
          _self.set('borderWidth',_self._getNextX());
        }else{
          _self.set('borderWidth',Math.max(_self._getNextX(),borderWidth));
        }
        //添加一个ItemGroup
        var newItemGroup = _self.addGroup();
        _self.set('itemsGroup',newItemGroup);
        itemsGroups.push(newItemGroup);
        _self._addItem(item,index);
      }
    }else{
      var titleHeight = _self._getTitleHeight();
      //溢出了
      if(bBox.height + spacingY + titleHeight> maxHeight ){
        newItem.remove();

        var borderWidth = _self.get('borderWidth') || 0;
        //获取当前最宽
        var currMaxWidth = 0;
        Util.each(itemsGroup.get('children'),function(child,i){
          var bb = child.getBBox();
          currMaxWidth = Math.max(bb.width,currMaxWidth);
        });
        //缓存最大宽度
        _self.set('borderWidth',borderWidth + currMaxWidth);
        //缓存最大itemsGroup个数
        var maxGroupCount = _self.get('maxGroupCount') || 0;
        //console.log(index);
        _self.set('maxGroupCount',0);
        //添加一个ItemGroup
        var newItemGroup = _self.addGroup();
        _self.set('itemsGroup',newItemGroup);
        itemsGroups.push(newItemGroup);
        _self._addItem(item,index);
      }
    }
  },
  //设置标题
  _renderTitle: function(){
    var _self = this,
      titleCfg = _self.get('titleCfg'),
      title = _self.get('title'),
      titleShape,
      cfg;

    if (title) {
      cfg = Util.mix({},titleCfg,{
        text : title
      });
      titleShape = _self.addShape('text',cfg);
      _self.set('titleShape',titleShape);
    }
  },
  // 获取title的高度
  _getTitleHeight: function(){
    var _self = this,
      titleShape = _self.get('titleShape'),
      rst = 0,
      bbox;
    if (titleShape) {
      bbox = titleShape.getBBox();
      rst = bbox.height + bbox.y;
    }
    return rst;
  },
  // 获取title 宽度
  _getTitleWidth: function(){
    var _self = this,
      titleShape = _self.get('titleShape'),
      rst = 0,
      bbox;
    if (titleShape) {
      bbox = titleShape.getBBox();
      rst = bbox.width + bbox.x + PADDING;
    }
    return rst;
  },
  //生成边框
  _renderBorder : function(){
    var _self = this,
      border = _self.get('back'),
      width,
      height,
      cfg,
      shape;

    if(border){
      width = _self._getTotalWidth();
      height = _self._getTotalHeight();

      cfg = Util.mix({
        r: 5,
        width : width,
        height : height
      },border);

      shape = _self.addShape('rect',cfg);
      shape.toBack();
      _self.set('borderShape',shape);
    }
  },
  //重置边框
  resetBorder : function(){
    var _self = this,
      borderShape = _self.get('borderShape');
    if(borderShape){
      borderShape.attr({
        width : _self._getTotalWidth(),
        height : _self._getTotalHeight()
      });
    }
  },
  //定位
  resetPosition : function(){
    var _self = this,
      align = _self.get('align'),
      plotRange = _self.get('plotRange');

    if(!plotRange){
      return;
    }
    var  top = plotRange.tl,
      end = plotRange.br,
      dx = _self.get('dx'),
      dy = _self.get('dy'),
      width = _self._getTotalWidth(),
      x,y;
    switch(align){
      case 'top' :
        x = top.x;
        y = top.y;
        break;
      case 'left':
        x = top.x;
        y = (top.y + end.y)/2;
        break;
      case 'right':
        x = end.x - width;
        y = (top.y + end.y)/2;
        break;
      case 'bottom':
        x = (top.x + end.x) /2 - width/2;
        y = end.y;
      default :
        break;
    }
   _self.move(x+dx,y+dy);

  },
  //获取总的个数
  _getCount : function(){
    return this.get('itemsGroup').get('children').length;
  },
  //vertical的时候的高度
  _getMaxHeight: function(){
    var _self = this;
    var itemsGroups = _self.get('itemsGroups');
    var spacing = _self.get('spacingY');
    var maxCount = 0;
    Util.each(itemsGroups,function(itemsGroup,i){
      maxCount = Math.max(itemsGroup.get('children').length,maxCount);
    });
    return LINE_HEIGHT * maxCount + spacing * (maxCount + 1) +  _self._getTitleHeight();;
  },
  //获取下一个图例项的x坐标
  _getNextX : function(){
    var _self = this,
      layout = _self.get('layout'),
      spacing = _self.get('spacingX');
    var itemsGroups = _self.get('itemsGroups');
    var groupCount = itemsGroups.length;
    var nextX = spacing;

    if(layout == 'horizontal'){
      var children = _self.get('itemsGroup').get('children');
      Util.each(children,function(item){
        if(item.isGroup){
          nextX += (item.getWidth() + spacing);
        }
      });
      return nextX;
    }else{
      var borderWidth = _self.get('borderWidth') || 0;
      return nextX + borderWidth;
    }
  },
  //获取下一个图例项的y坐标
  _getNextY : function(){
    var _self = this,
      spacing = _self.get('spacingY'),
      layout = _self.get('layout'),
      count =  _self._getCount(),
      titleHeight = _self._getTitleHeight(),
      rst;
    var itemsGroups = _self.get('itemsGroups');
    var groupCount = itemsGroups.length;
    if(layout == 'horizontal'){
      rst = spacing * groupCount + LINE_HEIGHT * (groupCount - 1);
    }else{
      rst = LINE_HEIGHT * count + spacing * (count + 1) ;
    }
    return rst + titleHeight;
  },
  //获取总的宽度
  _getTotalWidth : function(){
    var _self = this,
      spacing = _self.get('spacingX'),
      width,
      titleWidth = _self._getTitleWidth();

    if(_self.get('layout') == 'horizontal'){
      var borderWidth = _self.get('borderWidth');
      width = borderWidth || _self._getNextX();
    }else{
      var borderWidth = _self.get('borderWidth') || 0;
      var children = _self.get('itemsGroup').get('children'),
        max = spacing;
      Util.each(children,function(item){
        var width = item.getWidth();
        if(item.isGroup && width > max){
          max = width;
        }
      });
      width = borderWidth + max + spacing * 2  ;
    }

    return Math.max(width,titleWidth);
  },
  //获取整体的高度
  _getTotalHeight : function(){
    var _self = this,
      nextY = _self._getNextY();
    var itemsGroups = _self.get('itemsGroups');
    var groupCount = itemsGroups.length;
    if(_self.get('layout') == 'horizontal'){
      return LINE_HEIGHT * groupCount + PADDING * (1 + groupCount) + _self._getTitleHeight();
    }
    return _self._getMaxHeight();
  }
});

module.exports = Legend;
