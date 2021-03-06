import React from 'react';
let {Component} = React;
import Config from 'config';
import Dialog from 'Component/Dialog';
import confirm from 'Component/confirm.js';

export  default  class CaigouDetail extends Component{
	constructor(props){
		super(props);
		this.text = [{field:'item',text:'名称'},{field:'spec',text:'规格'},{field:'unit',text:'单位'},{field:'price',text:'价格'},{field:'quantity',text:'数量'}]
		this.state={item:{price:'',quantity:'',spec:'',item:'',unit:'',dialog:0}}
	}
	del(index){
		let hasValue= false;
		for(var key in this.state.item){
			if(this.state.item[key]!=""){
				hasValue=true;
			}
		}
		if(hasValue){
			confirm("确定删除采购明细（"+this.props.index+"）?",this,()=>{
				this.props.del(this.props.index);
				this.props.computeMoney(this);
			})
		}else{
			this.props.del(this.props.index);
			this.props.computeMoney(this);
		}

		//this.props.reRender();
	}
	componentWillMount(){
		console.log(this.props.item)
		this.setState({item:Object.assign(this.state.item,this.props.item)});
	}
	componentDidMount(){
		//console.log("didMount")
	}

	//bind
	/*componentWillReceiveProps( nextProps){
		
		if(nextProps.item){
			console.log(nextProps.item)
			this.setState({'item':nextProps.item});
			//console.log(this.state.applyDetail)
		}
	}*/
	change(field,e){
		let value= e.target.value;
		if(field == "price"){
			let regStr = /^[0-9]+(\.)?([0-9]{1,2})?$/;
			if(!regStr.test(value)&&value!=""){
				this.state.item[field]=this.state.item[field];	
			}else{
				this.state.item[field]= value;
			}
			this.setState({item:this.state.item})
		}else if(field == "quantity"){
			//let regStr = /^\d+$/;
			let regStr = /^[0-9]+(\.)?([0-9]{1,2})?$/;
			if(!regStr.test(value)&&value!=""){
				this.state.item[field]=this.state.item[field];	
			}else{
				this.state.item[field]= value;
			}
			this.setState({item:this.state.item})
		}else{
			this.state.item[field]= value;
			this.setState({item:this.state.item})
		}
		this.props.computeMoney(this);
	}
	getMoney(){
		let price = this.state.item.price||0;
		let quantity = this.state.item.quantity||0;
		return price*quantity;
	}
	validate(){
		let returnValue = {status:true}
		for (var i = this.text.length - 1; i >= 0; i--) {
		 	let item = this.text[i];
		 	if( Config.trim(this.state.item[item.field]).length ==0){
		 		let indexstr="";
		 		this.props.detail.length===1?undefined:indexstr="（"+this.props.index+"）";
				returnValue = {status:false,text:"请输入采购明细"+indexstr+"的"+item.text}
			}
		};
		return returnValue;
	}
	getValues(){
		var returnValues= {};
		Object.assign(returnValues,this.state.item);
		return returnValues;
	}
	renderDialog(){
		console.log(this.state.dialog)
		return <Dialog stage={this} {...this.state.dialog}/>
	}
	render(){
		console.log('aaaaaaaaaaa',this.state.item.item)
		return (
			<div>
				<div className="detail" title={this.props.title}>
					<h3>采购明细{this.props.detail.length>1 ?"（"+this.props.index+"）":undefined} <a onClick={this.del.bind(this)} className={this.props.index>1?"del":"hide"}>删除</a></h3>
					<div className="formbox">
						<div className="rowinput">
							名称<input type="text" ref="item" maxLength ="60" value={this.state.item.item} onChange={this.change.bind(this,"item")} placeholder="请输入（必填）"/>
						</div>
						<div className="rowinput">
							规格<input type="text" ref="spec" maxLength ="60" value={this.state.item.spec} onChange={this.change.bind(this,"spec")} placeholder="请输入（必填）"/>
						</div>
						<div className="rowinput">
							单位<input type="text" ref="unit" maxLength ="60" value={this.state.item.unit} onChange={this.change.bind(this,"unit")} placeholder="请输入（必填）"/>
						</div>
						<div className="rowinput">
							单价（元）<input type="text" ref="price" maxLength ="12" value={this.state.item.price} onChange={this.change.bind(this,"price")} placeholder="请输入（必填）"/>
						</div>
						<div className="rowinput">
							数量<input type="text" ref="quantity" maxLength ="12" value={this.state.item.quantity} onChange={this.change.bind(this,"quantity")} placeholder="请输入（必填）"/>
						</div>
					</div>
				</div>
                {this.state.dialog?this.renderDialog():undefined}
			</div>
			);
	}
}