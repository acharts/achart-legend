

var Util = require('achart-util'),
  Legend = require('./legend');

/**
 * @class Chart.Legend.UseLegend
 * 使用图例的扩展
 * 
 * - <a href="http://spmjs.io/docs/achart-legend/#legend-uselegend" target="_blank">文档</a>
 * - <a href="http://spmjs.io/docs/achart-legend/wiki/use.html" target="_blank">wiki</a>
 * 
 */
var UseLegend = function () {
  // body...
};

UseLegend.ATTRS = {
  /**
   * legend配置项
   * @type {Object}
   */
  legend : null,

  /**
   * 生成的Legend对象
   * @type {Chart.Legend}
   */
  legendGroup : null
}

UseLegend.prototype = {

  /**
   * @protected
   * 渲染legend
   */
  renderLegend : function(){
    var _self = this,
      legend = _self.get('legend'),
      canvas = _self.get('canvas');
    if(legend){
      if(!legend.plotRange){
        legend.plotRange = _self.get('plotRange') || _self.get('parent').get('plotRange');
      }
       legend.items = legend.items || _self.getLengendItems();
      var 
        legendGroup = canvas.addGroup(Legend,legend);
      _self.set('legendGroup',legendGroup);
      _self._bindLegendEvent();
    }
  },
  /**
   * @protected
   * 获取Legend的子项集合
   * @return {Array} 子项集合
   */
  getLengendItems : function(){
    return [];
  },
  /**
   * @protected
   * @param  {Chart.Legend.Item} legendItem 图例的子项
   * @return {Chart.Canvas.Group} 子项
   */
  getByLendItem : function(legendItem){
    return legendItem.get('item');
  },
  /**
   * 添加Legend 子项
   * @protected
   */
  addLengendItem : function(item){
    var _self = this,
      legendGroup = _self.get('legendGroup');

    if(legendGroup){
      legendGroup.addItem(item);
    }
  },
  /**
   * @protected
   * 重置legends
   */
  resetLegendItems : function(){
    var _self = this,
      legendGroup = _self.get('legendGroup'),
      items = _self.getLengendItems();
    legendGroup.setItems(items);
  },
  //鼠标事件
  _bindLegendEvent : function(){
    var _self = this,
      legendGroup = _self.get('legendGroup');

    //over
    legendGroup.on('itemover',function(ev){
      var legendItem = ev.item,
        item = _self.getByLendItem(legendItem);
      if(_self.setActivedItem){
        _self.setActivedItem(item);
      }
    });

    //out
    legendGroup.on('itemout',function(ev){
      var legendItem = ev.item,
        item = _self.getByLendItem(legendItem);
      if(_self.clearActivedItem){
        _self.clearActivedItem(item);
      }
    });

    legendGroup.on('itemchecked',function(ev){
      var legendItem = ev.item,
        item = _self.getByLendItem(legendItem);
      _self.showChild(item);
    });

    legendGroup.on('itemunchecked',function(ev){
      var legendItem = ev.item,
        item = _self.getByLendItem(legendItem);
      _self.hideChild(item);
    });
  },
  /**
   * @protected
   * 移除legend
   */
  removeLegend : function(){
    var _self = this,
      legendGroup = _self.get('legendGroup');
    if(legendGroup){
      legendGroup.remove();
    }
  }

};

module.exports = UseLegend;