import React from 'react';
let {Component} = React;
import Config from 'config';
import alert from '../alert.js';
export default class GoOut extends Component{

	constructor(props){
		super(props);
		this.state= {applyResean:'',type:2}
		this.typeArr = Config .goOUtType;
	}

	//bind
	componentWillReceiveProps( nextProps){
		/*console.log('prev',prevProps)
		console.log('cur',this.props)*/
		if(nextProps.detail){
			let customJObj =JSON.parse(nextProps.detail.customJObj)||{};
			console.log(customJObj)
			this.setState({'applyResean':nextProps.detail.applyResean,
				type: nextProps.detail.outType || 0,
				beginDate:nextProps.detail.beginDate,
				endDate:nextProps.detail.endDate
			});
			//console.log(this.state.applyDetail)
		}
	}

	getValues(){
		return {
			beginDate:this.state.beginDate,
			endDate:this.state.endDate,
			applyResean:this.refs.applyResean.value,
			outType:this.state.type
		}
	}
	validate(){
		if(Config.trim(this.refs.applyResean.value)==""){
			alert('请输入外出事由',this.props.stage);
			return false;
		}
		if(Config.trim(this.state.beginDate)==""){
			alert('请选择开始时间',this.props.stage);
			return false;
		}
		if(Config.trim(this.state.endDate)==""){
			alert('请选择结束时间',this.props.stage);
			return false;
		}
		return true;
	}
	selectType(type){
		this.setState({type:type});
	}

	change(field,e){
		let value= e.target.value;
		this.setState({applyResean:value});
	}

	setTime(type){
		let _this = this;
		Config.native('setTime').then((res)=>{
			try{
			if(type ===1){
				if( +new Date(res.data.replace(/\-/g,'/')) <= +new Date((this.state.beginDate||'').replace(/\-/g,'/'))){
					alert('结束时间必须大于开始时间',this.props.stage);
				}else{
					_this.setState({endDate:res.data})
				}
			}else if(type==0){
				if(+new Date(res.data.replace(/\-/g,'/')) >= +new Date((this.state.endDate||'').replace(/\-/g,'/'))){
					alert('结束时间必须大于开始时间',this.props.stage);
				}else{
					_this.setState({beginDate:res.data})
				}
			}
			_this.props.renderProcess(this.state.beginDate,this.state.endDate);
			}catch(e){
			}
		})
	}
	render(){
		return (
			<div className="detail">
				<div className="txt-reason">
					<textarea ref="applyResean" value={this.state.applyResean} onChange={this.change.bind(this,'applyResean')} maxLength ="60" placeholder="请输入外出事由（必填）"/>
					<div className="formbox">
						<div className="rowinput">
							<div>外出方式 <span className="tips"></span></div>
							<div className="type-list">
							{
								this.typeArr.map((item,index)=>{
									return <a onClick={this.selectType.bind(this,item.key)} className={this.state.type== item.key ?"focus":undefined}>{item.name}</a>
								})
							}
							</div>
						</div>
					</div>
				</div>
				<div className="formbox">
					<div className="rowinput row" onClick={this.setTime.bind(this,0)}>开始时间<span className="expectPayDate">{!this.state.beginDate?<i>请选择（必填）</i>:this.state.beginDate}</span></div>
					<div className="rowinput row" onClick={this.setTime.bind(this,1)}>结束时间<span className="expectPayDate">{!this.state.endDate?<i>请选择（必填）</i>:this.state.endDate}</span></div>
				</div>
			</div>
			);
	}
}