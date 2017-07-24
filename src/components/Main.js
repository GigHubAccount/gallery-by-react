require('normalize.css/normalize.css');
require('styles/App.scss');
import React from 'react';
import ReactDOM from 'react-dom';
//获取图片相关的数据
var imageDatas=require('../data/imageDatas.json');

//利用自执行函数，将图片名信息转出图片URL路径信息,因为只执行一次，所以使用自执行函数
imageDatas =(function genImageURL(imageDataArr) {
		for (var i = 0, j=imageDataArr.length;i<j; i++) {
			var singleImageData=imageDataArr[i];

			singleImageData.imageURL=require('../images/'+singleImageData.fileName);

			imageDataArr[i]=singleImageData;
		}
		return imageDataArr;
})(imageDatas);

/**
 * 获取区间内的一个随机值
 * @param  {[type]} low  [description]
 * @param  {[type]} high [description]
 * @return {[type]}      [description]
 */
function getRangeRandom(low,high) {
	return Math.floor((Math.random()*(high-low)+low));
}

/**
 * 获取0-30°之间的一个任意正负值
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
function get30DegRandom() {
	return (Math.random()>0.5?'':'-')+Math.ceil(Math.random()*30);//不一样
}

var ImgFigure =React.createClass({
	/**
	 * imgFigure的点击处理函数
	 */
	handleClick:function(e){
		//if(this.props.isCenter){//不一样
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		//this.props.inverse();//在看看
		e.stopPropagation();
		e.preventDefault();
	},

	render(){
		var styleObj={};

		//如果props属性中指定了这张图片的位置，则使用
		if (this.props.arrange.pos) {
			styleObj=this.props.arrange.pos;
		}

		//如果图片的旋转角度有值并且不为0，添加旋转角度
		if (this.props.arrange.rotate) {
			/*(['-MozTransform-','-msTransform-','-WebkitTransform-','transform']).forEach(function (value)//不一样
			{
					styleObj[value]='rotate('+this.props.arrange.rotate+'deg)';//不一样
				
			}.bind(this));*/

			(['MozT','msT','WebkitT','t']).forEach(function (value)//不一样
				{
					styleObj[value+'ransform']='rotate('+this.props.arrange.rotate+'deg)';//不一样
				
			}.bind(this));
		}

		var imgFigureClassName='img-figure';
			imgFigureClassName+=this.props.arrange.isInverse?' is-inverse':' ';

		if(this.props.arrange.isCenter){
			styleObj.zIndex=11;
		}



		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL}
					alt={this.props.data.title}
				/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
			);
	}
});

//控制组件
class ControllerUnit extends React.Component{
	constructor(props){
		super(props);
		this.handleClick=this.handleClick.bind(this);
	}

	handleClick(e){
		//if(this.props.isCenter){//不一样
		//如果点击的是当前正在选中的按钮，则翻转图片，否则将对应的图片的居中
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}

	render(){
		let controlerUnitClassName='controller-unit';

		//对应的图片如果居中，则按钮居中
		if(this.props.arrange.isCenter){
			//controllerName+=this.props.isCenter?' is-center':' ';
			controlerUnitClassName+=' is-center';

			//对应的图片翻转，则按钮旋转
			if(this.props.arrange.isInverse){
				//controllerName+=this.props.arrange.isInverse?' is-inverse':' ';
				controlerUnitClassName+=' is-inverse';
			}
		}

		return(
			<span className={controlerUnitClassName} onClick={this.handleClick}></span>
		);
	}
}




class AppComponent extends React.Component{
	/*getInitialState(){
		return{
			imgsArrangeArr:[
				{
					pos:{
						left:'0',
						top:'0'
					}
				}
			]
		};
	}*/

	constructor(props){
		super(props);
		this.state={
			imgsArrangeArr:[
				/*{
					pos:{
						left:0,
						right:0
					},
					rotate:0,
					isInverse:false//图片正反面
					isCenter:false //图片是否居中
				},
				*/
			]
		};

		//设置排布的可取值范围
		this.Constant={
			centerPos:{
				left:0,
				right:0//不一样
			},
			hPosRange:{//水平方向的取值范围
				leftSecX:[0,0],
				rightSecX:[0,0],
				y:[0,0]
			},
			vPosRange:{
			//垂直方向的取值范围
				x:[0,0],
				topY:[0,0]
			}
		}
	}

	/**
	 * 利用rearrange函数，居中对应index的图片
	 * @param index，需要被居中的图片对应的图片信息数组的index值
	 * @return {Function}
	 */
	center(index){
		return function () {
			this.rearrange(index);
		}.bind(this);
	}

	/**
	 * 翻转图片
	 * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
	 * return {Function } 这是一个闭包函数就，其内return一个真正被待执行的函数
	 */
	inverse(index){
		return function(){
			var imgsArrangeArr =this.state.imgsArrangeArr;

			imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr:imgsArrangeArr
			});
		}.bind(this);
	}

	/**
	 * 重新布局所有图片
	 * @param  centerIndex 指定居中排布哪个图片
	 * @return {[type]}             [description]
	 */
	rearrange (centerIndex) {
		var imgsArrangeArr=this.state.imgsArrangeArr,
			Constant=this.Constant,
			centerPos=Constant.centerPos,
			hPosRange=Constant.hPosRange,
			vPosRange=Constant.vPosRange,
			hPosRangeLeftSecX=hPosRange.leftSecX,
			hPosRangeRightSecX=hPosRange.rightSecX,
			hPosRangeY=hPosRange.y,
			vPosRangeTopY=vPosRange.topY,
			vPosRangeX=vPosRange.x,

			imgsArrangeTopArr=[],
			topImgNum=Math.floor(Math.random()*2),//取一个或不取
			topImgSpliceIndex=0,

			imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);

			//首先居中centerIndex的图片,居中对的centerIndex图片不需要旋转
			imgsArrangeCenterArr[0]={
				pos:centerPos,
				rotate:0,
				isCenter:true
			};

			//取出要布局上侧的图片的状态信息
			topImgSpliceIndex=Math.floor(Math.random()*(imgsArrangeArr.length-topImgNum));
			imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

			//布局位于上侧的图片
			imgsArrangeTopArr.forEach(function (value,index) {
				imgsArrangeTopArr[index]={
					pos:{
						top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
						left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
					},
					rotate:get30DegRandom(),
					isCenter:false
				};
				
			});

			//布局左右两侧的图片
			for (var i = 0,j=imgsArrangeArr.length,k=j/2; i < j; i++) {
				var hPosRangeLORX=null;
				//前半部分布局左边，右半部分布局右边
				if(i<k){
					hPosRangeLORX=hPosRangeLeftSecX;
				}else{
					hPosRangeLORX = hPosRangeRightSecX;
				}

				imgsArrangeArr[i]={
					pos:{
						top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
						left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
					},
					rotate:get30DegRandom(),
					isCenter:false
				};

			}



			if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
				imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeArr[0]);
			}

			imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr:imgsArrangeArr
			});
	}

	//组件加载以后，为每张图片计算其位置的范围
	componentDidMount() {

		//首先拿到舞台的大小
		let stageDOM=ReactDOM.findDOMNode(this.refs.stage),
			stageW=stageDOM.scrollWidth,
			stageH=stageDOM.scrollHeight,
			halfStageW=Math.floor(stageW/2),
			halfStageH=Math.floor(stageH/2);

		//获取imgFigure的大小
		let imgFigureDOM=ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW=imgFigureDOM.scrollWidth,
			imgH=imgFigureDOM.scrollHeight,
			halfImgW=Math.floor(imgW/2),
			halfImgH=Math.floor(imgH/2);

		//计算中心图片的位置
		this.Constant.centerPos={
			left:halfStageW-halfImgW,
			top:halfStageH-halfImgH
		};
		

		//计算左右区域的位置
		this.Constant.hPosRange.leftSecX[0]=-halfImgW;
		this.Constant.hPosRange.leftSecX[1]=halfStageW-halfImgW*3;
		this.Constant.hPosRange.rightSecX[0]=halfStageW+halfImgW;
		this.Constant.hPosRange.rightSecX[1]=stageW-halfImgW;
		this.Constant.hPosRange.y[0]=-halfImgH;
		this.Constant.hPosRange.y[1]=stageH-halfImgH;//不一样用的是halfStageH-halfImgH

		//计算上区域的位置
		this.Constant.vPosRange.topY[0]=-halfImgH;
		this.Constant.vPosRange.topY[1]=halfStageH-halfImgH*3;
		this.Constant.vPosRange.x[0]=halfStageW-imgW;
		this.Constant.vPosRange.x[1]=halfStageW;
		
		this.rearrange(0);
	}

  render(){
  	var controllerUnits=[],
  		imgFigures=[];

  	imageDatas.forEach(function (value,index) {
  		if (!this.state.imgsArrangeArr[index]) {
  			this.state.imgsArrangeArr[index]={
  				pos:{
  					left:0,
  					top:0
  				},
  				rotate:0,
  				isInverse:false,
  				isCenter:false
  			};
  		}
  		imgFigures.push( <ImgFigure data={value}  key={index} ref={'imgFigure'+index}
  			arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
  			center={this.center(index)}/>);

  		controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]}
  			inverse={this.inverse(index)} center={this.center(index)} />);

  		}.bind(this));//bind把react conponent对象传到这里

    return (
    	//舞台结构
      <section className="stage"  ref="stage">
      	<section className="img-sec">
	  		{imgFigures}
      	</section>
      	<nav className="controller-nav">
      		{controllerUnits}
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
