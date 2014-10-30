/**
 * @fileOverview 图例项
 * @ignore
 */


var Util = require('achart-util'),
	PlotItem = require('achart-plot').Item,
	MARKER_WIDTH = 20,
  ALIGN_Y = 7;

/**
 * @class Chart.Legend.Item
 * 图例的子项，用于标示其中一个数据序列
 * 
 * - <a href="http://spmjs.io/docs/achart-legend/#legend-item" target="_blank">文档</a>
 * - <a href="http://spmjs.io/docs/achart-legend/wiki/legend.html" target="_blank">wiki</a>
 * 
 * @extends Chart.Plot.Item
 * @mixins Chart.Actived
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
		y : ALIGN_Y,
		cursor : 'pointer',
	},
  /**
   * checked 状态
   * @type {Boolean}
   */
  checked : true,
	/**
	 * 所属的图例
	 * @type {Object}
	 */
	legend : null,
	
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

  /**
   * 显示的文本
   * @type {String}
   */
	name : null,

  /**
   * 颜色
   * @type {String}
   */
	color : null,

  /**
   * marker的类型，默认为null
   * @type {String}
   */
	symbol : null,

  /**
   * 显示的图形代表图形元素，默认 rect
   * @type {String}
   */
	type : 'rect',
	
  /**
   * 图形元素隐藏时的颜色
   * @type {String}
   */
	uncheckedColor : '#CCC',

  /**
   * 图形是线的配置项
   * @protected
   * @type {Object}
   */
	line : {
		x1 : 3,
		y1 : 7,
		x2 : 17,
		y2 : 7,
		"stroke-width" : 2
	},
  /**
   * 图形是圆时的配置项
   * @protected
   * @type {Object}
   */
	circle : {
		cx : 10,
		cy : 7,
		r : 5,
		'fill-opacity' : .5
	},
  /**
   * 图形是矩形的配置项
   * @protected
   * @type {Object}
   */
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
  },
  
  //设置是否可见
	_setChecked : function(checked){
		var _self = this,
			shape = _self.get('shape'),
			marker = _self.get('marker'),
			color = checked ? _self.get('color') : _self.get('uncheckedColor');

		shape && shape.attr({
			stroke : color,
			fill : color
		});
		marker && marker.attr({
			stroke : color,
			fill : color
		});
	},
  //checked发生改变时
  _onRenderChecked : function(checked){
    var _self = this;
    if(_self.get('rendered')){
      _self._setChecked(checked);
    }
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
			labelShape;
    if(!cfg.x){
      cfg.x = MARKER_WIDTH;
    }
    if(!cfg.y){
      cfg.y = ALIGN_Y;
    }
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
