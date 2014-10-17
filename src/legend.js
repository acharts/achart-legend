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
   * 子项的集合
   * @type {Array}
   */
  items : null,

  /**
   * 排布时子项之间间距
   * @type {[type]}
   */
  spacingX : PADDING,

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
    var _self = this,
      itemsGroup = _self.get('itemsGroup'),
      items = itemsGroup.get('children'),
      rst = null;

    Util.each(items,function(item){
      if(item.containsElement(node)){
        rst = item;
        return false;
      }
    });

    return rst;
  },

  _getLeaveCount : function(){
    var _self = this,
      itemsGroup = _self.get('itemsGroup'),
      items = itemsGroup.get('children'),
      tmpArr = [];

    tmpArr = Util.filter(items,function(item){
      return item.get('checked');
    })
    return tmpArr.length;
  },

  _renderItems : function(){
    var _self = this,
      items = _self.get('items'),
      itemsGroup = _self.addGroup();

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
      itemsGroup = _self.get('itemsGroup');
    itemsGroup.clear();

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
      cfg = Util.mix({x : x,y : y},item,itemCfg);

    cfg.legend = _self;
    itemsGroup.addGroup(Item,cfg);
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
  //获取下一个图例项的x坐标
  _getNextX : function(){
    var _self = this,
      layout = _self.get('layout'),
      spacing = _self.get('spacingX'),
      nextX = spacing;
    if(layout == 'horizontal'){
      var children = _self.get('itemsGroup').get('children');
      Util.each(children,function(item){
        if(item.isGroup){
          nextX += (item.getWidth() + spacing);
        }
      });
    }
    return nextX;
  },
  //获取下一个图例项的y坐标
  _getNextY : function(){
    var _self = this,
      spacing = _self.get('spacingY'),
      layout = _self.get('layout');
    if(layout == 'horizontal'){
      return spacing;
    }else{
      return LINE_HEIGHT * _self._getCount() + spacing ;
    }
  },
  //获取总的宽度
  _getTotalWidth : function(){
    var _self = this,
      spacing = _self.get('spacingX');

    if(_self.get('layout') == 'horizontal'){
      return this._getNextX();
    }else{
      var children = _self.get('itemsGroup').get('children'),
        max = spacing;
      Util.each(children,function(item){
        var width = item.getWidth();
        if(item.isGroup && width > max){
          max = width;
        }
      });
      return max + spacing * 2;
    }
    
  },
  //获取整体的高度
  _getTotalHeight : function(){
    var _self = this,
      nextY = _self._getNextY();

    if(_self.get('layout') == 'horizontal'){
      return LINE_HEIGHT + PADDING * 2;
    }
    return nextY + PADDING;
  }
});

module.exports = Legend;
