var expect = require('expect.js'),
  sinon = require('sinon');
var Legend = require('../index'),
  Canvas = require('achart-canvas'),
  PlotRange = require('achart-plot').Range,
  PlotItem = require('achart-plot').Item,
  Actived = require('achart-actived'),
  Simulate = require('event-simulate'),
  Util = require('achart-util');

var node = Util.createDom('<div id="s1"></div>');
document.body.appendChild(node);

var canvas = new Canvas({
  id : 's1',
  width : 500,
  height : 500
});

var
  types = ['circle','line','rect','circle','line','circle','line','rect','circle','line'],
  symbols = ['circle','diamond','square','triangle','triangle-down','circle','diamond','square','triangle','triangle-down'],
  colors = [ '#ff6600','#b01111','#ac5724','#572d8a','#333333','#7bab12','#c25e5e','#a6c96a','#133960','#2586e7'];


  var range = new PlotRange({y : 450,x : 50},{x : 450,y : 50});

describe('legend',function(){
  var items = [];
  for(var i = 0; i < 10; i++){
    items.push({
      name : 'test ' + i,
      color : colors[i],
      type : types[i],
      symbol : symbols[i]
    });
  }

  var legend = canvas.addGroup(Legend,{
      items : items,
      leaveChecked : true,
      spacingX : 10,
      plotRange : range
    }),
    itemsGroups = legend.get('itemsGroups');

  function getTotalCount(){
    var totalCount = 0;
    var itemsGroups = legend.get('itemsGroups');
    Util.each(itemsGroups,function(ig,i){
      totalCount += ig.get('children').length;
    })
    return totalCount;
  }
  var itemsGroup = legend.get('itemsGroup');
  it('create', function() {
    expect(itemsGroup).not.to.be(undefined);

    expect(getTotalCount()).to.be(items.length);
  });

  it('position bottom',function(done){
    setTimeout(function(){
      expect(legend.get('y')).to.be(450);
      done();
    },500);
  });

  it('position top',function(done){
    legend.set('align','top');
    legend.resetPosition();
    setTimeout(function(){
      expect(legend.get('y')).to.be(50);
      done();
    },500);
  });

  it('position left',function(done){
    legend.set('align','left');
    legend.resetPosition();
    setTimeout(function(){
      expect(legend.get('y')).to.be(250);
      done();
    },500);
  });

  it('position right',function(done){
     legend.set('align','right');
    legend.resetPosition();
    setTimeout(function(){
      //expect(legend.get('x')).to.be(460);
      legend.set('align','top');
          legend.resetPosition();

      done();
    },500);
  });

  it('change',function(){
    for(var i = 0; i < 6; i++){
      items.push({
        name : 'new ' + i,
        color : colors[i],
        type : types[i],
        symbol : symbols[i]
      });
    }
    legend.setItems(items);
    expect(getTotalCount()).to.be(items.length);
  });

  it('add item',function(){
    var count = getTotalCount();

      var item = {
        name : 'add',
        color : 'red',
        type : 'line',
        symbol : 'square'
      };
    legend.addItem(item);

    expect(getTotalCount()).to.be(count + 1);
  });

  it('hover and out',function(){
    var itemsGroup = legend.get('itemsGroup');
    var item = itemsGroup.getFirst(),
      callback = sinon.spy(),
      callback1 = sinon.spy();

    legend.on('itemover',callback);
    legend.on('itemout',callback1);


    Simulate.simulate(item.get('node'),'mouseover');
    expect(callback.called).to.be(true);

    Simulate.simulate(item.get('node'),'mouseout');
    expect(callback1.called).to.be(true);

    legend.off('itemover',callback);
    legend.off('itemout',callback1);
  });

  it('click & checked',function(){
    var itemsGroup = legend.get('itemsGroup');
    var item = itemsGroup.getLast(),
      callback = sinon.spy(),
      callback1 = sinon.spy(),
      callback2 = sinon.spy();
    legend.on('itemclick',callback);
    legend.on('itemchecked',callback1);
    legend.on('itemunchecked',callback2)

    Simulate.simulate(item.get('node'),'click');

    expect(callback.called).to.be(true);
    expect(callback2.called).to.be(true);

    Simulate.simulate(item.get('node'),'click');

    expect(callback1.called).to.be(true);
    legend.off('itemclick',callback);
    legend.off('itemchecked',callback1);
    legend.off('itemunchecked',callback2)
  });


  it('prevent mousemove',function(){

    var callback = sinon.spy();

    canvas.on('mousemove',callback);
    Simulate.simulate(legend.get('node'),'mousemove');

    expect(callback.called).to.be(false);

    canvas.off('mousemove',callback);

  });
});

describe('legend vertical',function(){
  var items1 = [];
  for(var i = 0; i < 20; i++){
    items1.push({
      name : 'test ' + i,
      color : colors[i],
      type : types[i],
      symbol : symbols[i]
    });
  }
  var legend1 = canvas.addGroup(Legend,{
    plotRange : range,
    layout : 'vertical',
    align : 'right',
    dy: -250,
    items : items1
  });
  function getTotalCount(){
    var totalCount = 0;
    var itemsGroups = legend1.get('itemsGroups');
    Util.each(itemsGroups,function(ig,i){
      totalCount += ig.get('children').length;
    })
    return totalCount;
  }
  it('create',function(){
    var children = legend1.get('itemsGroups')[0].get('children');
    expect(getTotalCount()).to.be(items1.length);
    expect(children[0].get('y') < children[1].get('y')).to.be(true);
  });
});

describe('use legend', function() {

  var AGroup = function(cfg){
    AGroup.superclass.constructor.call(this,cfg);
  };

  AGroup.ATTRS = {
    circles : null
  };
  Util.extend(AGroup,PlotItem);

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
      y : 150
    },
    circles : circles
  });

  var legend = group.get('legendGroup'),
    itemsGroup = legend.get('itemsGroup'),
    itemsGroups = legend.get('itemsGroups');

  function getTotalCount(){
    var totalCount = 0;
    var itemsGroups = legend.get('itemsGroups');
    Util.each(itemsGroups,function(ig,i){
      totalCount += ig.get('children').length;
    })
    return totalCount;
  }

  it('create',function(){
    expect(legend).not.to.be(undefined);
  });

  it('items',function(){
    expect(itemsGroup.getCount()).to.be(group.getCount());
  });

  it('addItem',function(){
    var count = group.getCount();
    group.addCircle({
      r : 10,
      cx : 100,
      cy : 200,
      stroke : 'red'
    });

    expect(group.getCount()).to.be(count + 1);
    expect(itemsGroup.getCount()).to.be(count + 1);
  });

  it('change',function(){
    var circles1 = [];
    for(var i = 0; i < 6; i++){
      circles1.push({
        r : 10,
        cx : 50 * (i + 1),
        cy : 100,
        stroke : colors[i]
      });
    }
    group.changeCircles(circles1);

    expect(getTotalCount()).to.be(group.getCount());
    expect(getTotalCount()).to.be(circles1.length);

  });

  it('hover',function(){
    var itemsGroup = legend.get('itemsGroup');
    var first = itemsGroup.getFirst();


    Simulate.simulate(first.get('node'),'mouseover');

    expect(group.getFirst().get('actived')).to.be(true);
  });

  it('out',function(){
    var itemsGroup = legend.get('itemsGroup');
    var first = itemsGroup.getFirst();
    Simulate.simulate(first.get('node'),'mouseout');

    expect(group.getFirst().get('actived')).to.be(false);
  });

  it('unchecked',function(){
    var itemsGroup = legend.get('itemsGroup');
    var last = itemsGroup.getLast();
    Simulate.simulate(last.get('node'),'click');

    expect(group.getLast().get('visible')).to.be(false);
  });

  it('checked',function(){
    var itemsGroup = legend.get('itemsGroup');
     var last = itemsGroup.getLast();
    Simulate.simulate(last.get('node'),'click');

    expect(group.getLast().get('visible')).to.be(true);
  });

  it('remove',function(){
    group.remove();
    expect(legend.get('destroyed')).to.be(true);
  });

});

describe('legend title',function(){
  var items = [];
  for(var i = 0; i < 5; i++){
    items.push({
      name : 'test ' + i,
      color : colors[i],
      type : types[i],
      symbol : symbols[i]
    });
  }

  var legend = canvas.addGroup(Legend,{
      items : items,
      leaveChecked : true,
      title: '这是一个title',
      spacingX : 10,
      plotRange : range
    }),
    itemsGroup = legend.get('itemsGroup');

  it('create', function() {
    expect(itemsGroup).not.to.be(undefined);
    expect(itemsGroup.getCount()).to.be(items.length);
  });

  it('title', function() {
    expect(legend.get('titleShape')).not.to.be(undefined);
  });

  it('totalHeight',function(){
    expect(legend._getTotalHeight() > 25).to.be(true);
  });

});

function random(min,max){
  return parseInt((max - min) * Math.random() + min);
}
describe('legend vertical title',function(){
  var items = [];
  for(var i = 0; i < 25; i++){
    items.push({
      name : 'test ' + random(1,100000),
      color : colors[i],
      type : types[i],
      symbol : symbols[i]
    });
  }

  var legend = canvas.addGroup(Legend,{
      items : items,
      leaveChecked : true,
      title: '这是一个title',
      layout : 'vertical',
      align : 'left',
      dy: -50,
      plotRange : range
    }),
    itemsGroup = legend.get('itemsGroup');

  function getTotalCount(){
    var totalCount = 0;
    var itemsGroups = legend.get('itemsGroups');
    Util.each(itemsGroups,function(ig,i){
      totalCount += ig.get('children').length;
    })
    return totalCount;
  }

  it('create', function() {
    expect(itemsGroup).not.to.be(undefined);
    expect(getTotalCount()).to.be(items.length);
  });

  it('title', function() {
    expect(legend.get('titleShape')).not.to.be(undefined);
  });

  it('totalWidth',function(){
    expect(legend._getTotalWidth() > 55).to.be(true);
  });

});
