# achart-legend [![spm version](http://spmjs.io/badge/achart-legend)](http://spmjs.io/package/achart-legend)

---

图例，每个图例子项代表一个图表元素

 * [wiki 文档](wiki/)

---
## Install

```
$ spm install achart-legend --save
```

## Usage

```js
var Legend = require('achart-legend');

```

## Legend

  * 图例类，内部有一些列的 Legend.Item 类

### 配置项

  * items 图例子项集合
  * itemCfg 图例子项配置信息
  * layout 布局方式 horizontal，vertical，默认 horizontal
  * align 位置，top,left,right,bottom
  * checkable 子选项是否可以触发checked 操作，默认所有的选项都是勾选
  * leaveChecked 是否保留一项不能取消勾选，默认为false
  * back 图例外边框和背景的配置信息，是一个矩形，参考[矩形配置信息](http://spmjs.io/docs/achart-canvas/#rect)
  * spacingX 子项之间的间距，x轴方向
  * spacingY 子项之间的间距，y轴方向

### 方法
  
  * addItem(item) 添加子项
  * resetPosition() 更改了align后，重新定位legend
  * setItems(items) 重新设置

### 事件
  
  * itemclick
  * itemchecked
  * itemunchecked
  * itemover
  * itemout


## Legend.Item

  * 图例子项代表一个图形元素，显示代表图形元素的文本、图形或者marker
  * 代表的图形元素隐藏时，图例子项的图形和marker会变化颜色
  * 鼠标移动到legend时，代表的图形元素 actived

### 配置项
  
  * label 文本的配置信息，参考[文本配置信息](http://spmjs.io/docs/achart-canvas/#text)
  * item 代表的图表元素
  * name 图形元素的名称，用于显示文本
  * color 颜色
  * symbol 如果存在marker，则指定marker的类型
  * type 代表图形元素的图形类型，默认'rect'
  * checked 是否处于勾选状态，默认为 true，否则颜色将变为 uncheckedColor
  * uncheckedColor 图形元素隐藏时，当前图例子项的图形颜色


## Legend.UseLegend

  * 方便图形分组使用 Legend 的扩展

### 配置项

  * legend 图例的配置信息

### 方法
  
  方法类型都是protected，提供给使用此扩展的类调用

  * renderLegend 入口文件，渲染legend
  * getLengendItems 获取图例子项的配置项
  * addLengendItem(item) 增加一个图例项
  * getByLendItem(legendItem) 获取关联的图形元素
  * resetLegendItems 重置
  * removeLegend 移除时的清理函数

