/**
 * @fileOverview 图例项
 * @ignore
 */


var Util = require('achart-util'),
	PlotItem = require('achart-plot').Item,
	MARKER_WIDTH = 20;

/**
 * @class Chart.LegendItem
 * 图例的子项，用于标示其中一个数据序列
 * @extends Chart.PlotItem
 * @mixins Chart.ActivedGroup
 */
var LegendItem = function(cfg){
	LegendItem.superclass.constructor.call(this,cfg);
};

LegendItem.ATTRS = {

	elCls : 'x-chart-legend-item',
	/**
	 * 文本的配置信息，不包括文本内容，文本内容由决定
	 * @type {Object}
	 */
	label : {
		x : MARKER_WIDTH,
		'text-anchor': 'start',
		y : 7,
		cursor : 'pointer',
	},
	/**
	 * 所属的图例
	 * @type {Object}
	 */
	legend : null,
	/**
	 * 标示的图表元素
	 * @type {Chart.Canvas.Group}
	 */
	item : null,
	/**
	 * x轴的位置
	 * @type {Number}
	 */
	x : null,
	/**
	 * y轴的位置
	 * @type {Number}
	 */
	y : null,

	name : null,

	color : null,

	symbol : null,

	type : 'rect',
	
	hideColor : '#CCC',

	line : {
		x1 : 3,
		y1 : 7,
		x2 : 17,
		y2 : 7,
		"stroke-width" : 2
	},
	circle : {
		cx : 10,
		cy : 7,
		r : 5,
		'fill-opacity' : .5
	},
	rect : {
		x : 2,
		y : 2,
		width : 15,
		height : 10
	}
}

Util.extend(LegendItem,PlotItem);

Util.augment(LegendItem,{

	renderUI : function(){
		var _self = this
		LegendItem.superclass.renderUI.call(_self);
		_self._createShape();
		_self._createMarker();
		_self._createLabel();      
  },
  bindUI : function(){
  	var _self = this;
  		
  	LegendItem.superclass.bindUI.call(_self);
  	_self.bindMouseEvent();
  	_self.bindClick();
  },
  //鼠标事件
  bindMouseEvent : function(){
  	var _self = this,
  		item = _self.get('item');

  	_self.on('mouseover',function(ev){
      if(item.setActived){
        item.setActived();
      }else{
        item.set('actived',true);
      }
      
  	}).on('mouseout',function(ev){
  		if(item.clearActived){
        item.clearActived();
      }else{
        item.set('actived',false);
      }
  	});
  },
  //点击事件
  bindClick : function(){
  	var _self = this,
  		item = _self.get('item');

  	_self.on('click',function(){
  		var visible = item.get('visible');
  		if(visible){ //防止最后一个隐藏
  			var itemParent = item.get('parent'),
  				children = itemParent.getVisibleChildren ? itemParent.getVisibleChildren() : itemParent.get('children'),
  				count = children.length;
  			if(count == 1){
  				return;
  			}
  		}
  		_self._setVisible(!visible);
  	});
  },
  //设置是否可见
	_setVisible : function(visible){
		var _self = this,
			item = _self.get('item'),
			shape = _self.get('shape'),
			marker = _self.get('marker'),
			color = visible ? _self.get('color') : _self.get('hideColor'),
			itemParent = item.get('parent');
		if(visible){
			itemParent.showChild && itemParent.showChild(item);
		}else{
			itemParent.hideChild && itemParent.hideChild(item);
		}
		shape && shape.attr({
			stroke : color,
			fill : color
		});
		marker && marker.attr({
			stroke : color,
			fill : color
		});
	},
	/**
	 * 获取legend item的宽度
	 * @return {Number} 宽度
	 */
	getWidth : function(){
		var _self = this,
			labelShape = _self.get('labelShape');
		return labelShape.getBBox().width + MARKER_WIDTH;
	},
	_createLabel : function(){
		var _self = this,
			text = _self.get('name'),
			label = _self.get('label'),
			cfg = Util.mix({},label,{
				text : text
			}),
			labelShape = _self.addShape('label',cfg);
		_self.set('labelShape',labelShape);
	},
	//创建跟序列相关的图形
	_createShape : function(){
		var _self = this,
			type = _self.get('type'),
			color = _self.get('color'),
			cfg = Util.mix({
					fill : color,
					stroke : color
				},_self.get(type)),
			shape;
		if(cfg && type){
			shape = _self.addShape(type,cfg);
		}
		shape && shape.attr('cursor','pointer');
		_self.set('shape',shape);
	},
	_createMarker : function(){
		var _self = this,
			symbol = _self.get('symbol'),
			marker;

		if(symbol){
			marker = {symbol : symbol,fill : _self.get('color'),"stroke" : _self.get('color')};
			marker.radius = 3;
			marker.x = 10;
			marker.y = 7;
			marker = _self.addShape('marker',marker);
		}
		_self.set('marker',marker);
	}
});

module.exports = LegendItem;
