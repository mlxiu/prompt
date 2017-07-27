# 功能
扁平化，简单信息提示框。类似七牛后台提示框。

# 依赖
jquery

# 使用
先引入jquery，再引入本js。然后就可以使用了。
eg：

```javascript
  prompt.add('给我一个理由忘记');
  prompt.add('仿佛有痛楚。如果我晕眩', 'bottom');
```
# 方法

1. init(Object options);
2. add(String content, String position);

init方法，用来初始化选项的。默认会初始化一次，即默认值。

add方法，用来添加提示消息。第一个参数是提示消息的内容，第二个参数是提示消息展示的位置。
位置仅有三个值可选：'top','bottom','center'。分别表示展示在顶部，底部，中间。该参数可省略。省略或非该三个值，强制为'top'。

# 选项
1. max 信息提示框同时显示的最大个数。默认4
2. delay 信息提示框展示的时间，单位毫秒。默认2800
3. height 顶部或底部消息提示框时，消息提示框的高度。默认50
4. centerWidth 中间模态提示框时，提示框的宽度。默认400
5. centerHeight 中间模态提示框时，提示框的高度。默认90
6. fontSize 提示框文字的大小。默认16
7. color 提示框的文字颜色。 默认#3d995f
8. backgroundColor 提示框的背景颜色。默认#d7fae3
9. borderColor 提示框的边框颜色。默认#d7fae3

默认有一套默认值。引入js就可以使用。如果想修改默认值，可以通过init方法。
eg：

```javascript
  prompt.init({'fontSize':14, 'max':3, 'height': 45});
```

还可以直接修改。
eg：

```javascript
  prompt.fontSize = 14;
```
 
这些修改，都必须在add方法之前操作。
