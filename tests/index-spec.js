var expect = require('expect.js'),
  sinon = require('sinon');
var Legend = require('../index'),
  Canvas = require('achart-canvas'),
  PlotRange = require('achart-plot').Range,
  PlotItem = require('achart-plot').Item,
  Simulate = require('event-simulate'),
  Util = require('achart-util');

var node = Util.createDom('<div id="s1"></div>');
document.body.appendChild(node);

var canvas = new Canvas({
  id : 's1',
  width : 500,
  height : 500
});

var items = [],
  types = ['circle','line','rect','circle','line'],
  symbols = ['circle','diamond','square','triangle','triangle-down'],
  colors = [ '#ff6600','#b01111','#ac5724','#572d8a','#333333','#7bab12','#c25e5e','#a6c96a','#133960','#2586e7'];

  var AItem = function(cfg){
    AItem.superclass.constructor.call(this,cfg);
  };
  Util.extend(AItem,PlotItem);

  var group = canvas.addGroup(AItem);

  for(var i = 0; i < 5; i++){

    var c = group.addGroup(AItem);
    c.addShape({
      id : i,
      type : 'circle',
      attrs : {
        r : 10,
        cx : 50 * (i + 1),
        cy : 100,
        stroke : colors[i]
      }
    });

    items.push({
      name : 'test ' + i,
      color : colors[i],
      type : types[i],
      symbol : symbols[i],
      item : c
    });
  }
  var range = new PlotRange({y : 460,x : 40},{x : 460,y : 40}),
    legend = canvas.addGroup(Legend,{
      items : items,
      plotRange : range
    });

  var itemsGroup = legend.get('itemsGroup');

describe('achart-legend', function() {

  it('create', function() {
    expect(itemsGroup).not.to.be(undefined);
    expect(itemsGroup.getCount()).to.be(items.length);
  });

  it('position bottom',function(done){
    setTimeout(function(){
      expect(legend.get('y')).to.be(460);
      done();
    },500);
  });

  it('position top',function(done){
    legend.set('align','top');
    legend.resetPosition();
    setTimeout(function(){
      expect(legend.get('y')).to.be(40);
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
      expect(legend.get('x')).to.be(460);
      legend.set('align','top');
          legend.resetPosition();

      done();
    },500);
  });

  it('change',function(){
    var items = [];
    group.clear();
    for(var i = 0; i < 6; i++){
      var c = group.addGroup(AItem);
      c.addShape({
        id : i,
        type : 'circle',
        attrs : {
          r : 10,
          cx : 50 * (i + 1),
          cy : 100,
          stroke : colors[i]
        }
      });

      items.push({
        name : 'new ' + i,
        color : colors[i],
        type : types[i],
        symbol : symbols[i],
        item : c
      });
    }
    legend.setItems(items);

    expect(itemsGroup.getCount()).to.be(items.length);
  }); 

  it('add item',function(){
    var count = itemsGroup.getCount(),
      c = group.addGroup(AItem);
      c.addShape({
        id : 8,
        type : 'circle',
        attrs : {
          r : 10,
          cx : 50 * (8 + 1),
          cy : 100,
          stroke : colors[i]
        }
      });

      var item = {
        name : 'add',
        color : 'red',
        type : 'line',
        symbol : 'square',
        item : c
      };
    legend.addItem(item);

    expect(itemsGroup.getCount()).to.be(count + 1);
  });

  it('hover',function(){
    var item = itemsGroup.getFirst();
    Simulate.simulate(item.get('node'),'mouseover');

    expect(item.get('item').get('actived')).to.be(true);

    Simulate.simulate(item.get('node'),'mouseout');
    expect(item.get('item').get('actived')).to.be(false);
  });

  it('click',function(){
    var item = itemsGroup.getLast();

    Simulate.simulate(item.get('node'),'click');

    expect(item.get('item').get('visible')).to.be(false);

    Simulate.simulate(item.get('node'),'click');

    expect(item.get('item').get('visible')).to.be(true);
  });

});

describe('legend vertical',function(){
  var group1 = canvas.addGroup(AItem),
    items1 = [];
  for(var i = 0; i < 5; i++){

    var c = group1.addGroup(AItem);
    c.addShape({
      id : i,
      type : 'rect',
      attrs : {
        width : 20,
        height : 20,
        x : 50 * (i + 1),
        y : 200,
        stroke : colors[i]
      }
    });

    items1.push({
      name : 'test ' + i,
      color : colors[i],
      type : types[i],
      symbol : symbols[i],
      item : c
    });
  }
  var legend1 = canvas.addGroup(Legend,{
    plotRange : range,
    layout : 'vertical',
    align : 'right',
    items : items1
  });

  it('create',function(){
    var children = legend1.get('itemsGroup').get('children');
    expect(children.length).to.be(items1.length);
    expect(children[0].get('y') < children[1].get('y')).to.be(true);
  });
});
