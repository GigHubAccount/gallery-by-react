# gallery-by-react
one photo gallery project based on react.
项目预览：https://gighubaccount.github.io/gallery-by-react/ <br>
借鉴其他人的git发布填坑经验：https://github.com/DodoMonster/galllery-by-react 和 https://github.com/pinmingkenan/gallery-by-react 

## 求Star！！！小伙伴们 

## 环境搭建填坑
1、没有Gruntfile.js不是安装错误，而是generator-react-webpack V2.0 移除了Grunt（webpack替代）。可以执行 npm start 或者npm run serve 启动服务。<br>
2、node运行后，直接把浏览器和git用ctrl+c、ctrl+d关闭，就相当于关闭网址端口与服务器。<br>
3、npm start而不是grunt serve启动服务器。<br>
4、npm run serve:dist 而不是 grunt serve:dist。（命令都在package.json的script对象中）<br>
5、需要修改配置一般都在cfg文件夹的defaults.js文件中。如<br>
    导入字体其添加的为代码：
    {
     test: /\.(`png|jpg|gif|woff|woff2|eot|ttf`)$/,
     loader: 'url-loader?limit=8192'
     },
       
        发布网页修改资源路径：  
module.exports = {  
    　srcPath: srcPath,  
    　publicPath: '`gallery-by-react`/assets/',  
    　port: dfltPort,  
    　getDefaultModules: getDefaultModules  
};

## 项目发布
打包到dist：npm run copy  
清除dist：npm run clean  
生成dist目录：npm run dist  
首先修改网页资源的路径，如上面所示，在修改dist文件夹下index.html中的<script type="text/javascript" src="`assets/app.js`"></script>  
在把src文件夹下的images复制放到dist文件夹下面。在执行下面命令。  
1.git add dist  
2.git commit -m "publish project to github-pages"  
3.git subtree push --prefix=dist origin gh-pages  

## 图片翻转坑
项目缺少的css翻转代码，嵌入到 .img-sec{ figcaption{ .img-back{} } }最里层的.img-back中<br>下面是代码：<br>
     .img-back{
        position:absolute;
        top:0;
        left:0;

        width:100%;
        height:100%;

        padding:50px 40px;
        overflow:auto;

        color:#a7a0a2;
        font-size:22px;
        line-height:1.25;
        text-align:center;//修改
        background-color:#fff;

        box-sizing:border-box;
        transform:rotateY(180deg) translateZ(1px);
        backface-visibility:hidden;
        p{
          margin:0;
        }


## 浏览器版本
     Google Chrome  58.0.3029.110 (64-bit)
     Firefox MozillaOnline -2017.7

