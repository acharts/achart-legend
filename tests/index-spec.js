var expect = require('expect.js');
var Legend = require('../index'),
  Canvas = require('achart-canvas'),
  PlotRange = require('achart-plot').Range,
  PlotItem = require('achart-plot').Item,
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

  });

  it('hover',function(){

  });

  it('click',function(){

  });

});

describe('achart-legenditem',function(){

});
