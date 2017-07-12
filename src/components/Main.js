require('normalize.css/normalize.css');
require('styles/App.scss');

//获取图片相关的数据
var imageDatas=require('../data/imageDatas.json');

//利用自执行函数，将图片名信息转出图片URL路径信息,因为只执行一次，所以使用自执行函数
imageDatas =(function genImageURL(imageDataArr) {
		for (var i = 0, j=imageDataArr.length;i<j; i++) {
			var singleImageData=imageDataArr[i];

			singleImageData.imageURL=require('../images'+singleImageData.fileName);

			imageDataArr[i]=singleImageData;
		}
		return imageDataArr;
})(imageDatas);


import React from 'react';



class AppComponent extends React.Component {
  render() {
    return (
    	//舞台结构
      <section className="stage" ref="stage">
      	<section className="img-sec">
      	{imgFigures}
      	</section>
      	<nav className="controller-nac">
      		{controllerUnits}
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
