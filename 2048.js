var game={
	data:[],//启动后是一个二维数组，存储每个格的数字
	RN:4,//总行数
	CN:4,//总列数
	state:0,//保存游戏的状态
	RUNNING:1,//专门表示游戏正在运行
	GAMEOVER:0,//专门表示游戏结束
	score:0,//保存游戏的分数
	getGridsHtml:function(){//生成所有背景格的html代码
		//r从0开始，到<RN结束，每次增1，同时声明空数组arr
		//c从0开始，到<CN结束，每次增1
		//	将""+r+c组合压入arr中
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			}
		}
		return '<div id="g'+arr.join('" class="grid"></div><div id="g')+
			'" class="grid"></div>';
	},
	getCellsHtml:function(){
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;arr.push(""+r+c++));//简写
		}
		return '<div id="c'+arr.join('" class="cell"></div><div id="c')+
			'" class="cell"></div>';
	},
	init:function(){
		var gp=document.getElementById("gridPanel");
		gp.style.width=116*this.CN+16+"px";
		gp.style.height=116*this.RN+16+"px";
		gp.innerHTML=this.getGridsHtml()+this.getCellsHtml();
	},
	start:function(){
		this.init();
		this.state=this.RUNNING;//游戏状态改为启动
		//初始化数组为RN行，CN列的二维数组，所有元素为0
		for(var r=0;r<this.CN;r++){
			this.data[r]=[];//初始化每一行为空数组
			for(var c=0;c<this.CN;c++){
				this.data[r][c]=0//初始化每个格为0
			}
		}
		this.score=0;//初始化游戏分数
		//随机生成2个2或4
		this.randomNum();
		this.randomNum();
		this.updataView();
	},
	isGameOver:function(){//判断当前游戏是否结束
		//遍历data中所有元素
		//	如果当前元素值==0，返回false
		//	否则 如果当前列不是最右侧列，且当前元素=右侧元素，返回false
		//	否则 如果当前行不是最后一行，且当前元素=下方元素，返回false
		//遍历结束，将游戏状态改为GAMEOVER，返回true
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				if(this.data[r][c]==0){
					return false;
				}else{
					if((c!=(this.data[r].length-1))&&(this.data[r][c]==this.data[r][c+1])){
					return false;
					}else if((r!=(this.data.length-1))&&(this.data[r][c]==this.data[r+1][c])){
					return false;
					}
				}
			}
		}
		this.state=this.GAMEOVER;
		return true;
	},
	randomNum:function(){//随机挑选一个位置，生成2或4
		if(!this.isFull()){
			while(true){//反复执行
				//随机生成一个行下标，保存在r中
				var r=parseInt(Math.random()*(this.RN));
				//随机生成一个列下标，保存在c中
				var c=parseInt(Math.random()*(this.CN));
				//如果data中r行c列位置的值==0，随机生成2或4，放入r行c列的元素中
				if(this.data[r][c]==0){
					//如果生成一个随机数<0.5，就放入2，否则放4
					this.data[r][c]=Math.random()<0.5?2:4;
					break;//退出循环
				}
			}
		}
	},
	isFull:function(){//判断数组是否是满的
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				//如果==0,返回false
				if(this.data[r][c]==0){
					return false;
				}
			}
		}
		//遍历结束，返回true
		return true;
	},
	updataView:function(){//负责将data中每个元素加载到页面中，并修改页面每个div的class属性
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				var div=document.getElementById("c"+r+c);
				if(this.data[r][c]!=0){//只有当前元素不等于0才在页面上显示
					div.innerHTML=this.data[r][c];
					//给div的class穿上和数值对应的衣服
					div.className="cell n"+this.data[r][c];
				}else{//否则，重置div的样式为cell,并清空内容
					div.className="cell";
					div.innerHTML="";
				}
			}
		}
		//将分数写在页面上
		var span=document.getElementById("score");
		span.innerHTML=this.score;
		//找到#gameover
		var gameover=document.getElementById("gameover");
		if(this.state==this.GAMEOVER){//如果游戏结束
			//将最后的分数显示在页面上
			var span=document.getElementById("finalscore");
			span.innerHTML=this.score;
			gameover.style.display="block";//修改display为block
		}else{//否则修改display为none
			gameover.style.display="none";
		}
	},
	moveLeft:function(){//左移
		var before=this.data.toString();
		for(var r=0;r<this.RN;r++){
			this.moveLeftInRow(r);
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isGameOver();
			this.updataView();
		}
	},
	moveLeftInRow:function(r){//左移第r行
		for(var c=0;c<this.data[r].length-1;c++){
		//从c开始，找下一个不为0的位置下标next
			var next=this.getRightNext(r,c);
			if(next==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[r][next];
					this.data[r][next]=0;
					c--;
				}else if(this.data[r][c]==this.data[r][next]){
					this.data[r][c]*=2;
					this.data[r][next]=0;
					this.score+=this.data[r][c];
				}
			}
		}
	},
	getRightNext:function(r,c){//专门找当前位置右侧的下一个
		//从c+1开始遍历之后所有元素
		for(var next=c+1;next<this.data[r].length;next++){
			if(this.data[r][next]!=0){
				return next;
			}
		}
		return -1;
	},
	moveRight:function(){//右移
		var before=this.data.toString();
		for(var r=0;r<this.RN;r++){
			this.moveRightInRow(r);
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isGameOver();
			this.updataView();
		}
	},
	moveRightInRow:function(r){
		for(var c=this.data[r].length-1;c>0;c--){
			var prev=this.getLeftPrev(r,c);
			if(prev==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[r][prev];
					this.data[r][prev]=0;
					c++;
				}else if(this.data[r][c]==this.data[r][prev]){
					this.data[r][c]*=2;
					this.data[r][prev]=0;
					this.score+=this.data[r][c];
				}
			}
		}
	},
	getLeftPrev:function(r,c){
		for(var prev=c-1;prev>=0;prev--){
			if(this.data[r][prev]!=0){
				return prev;
			}
		}
		return -1;
	},
	moveUp:function(){//上移
		var before=this.data.toString();
		for(var c=0;c<this.CN;c++){
			this.moveUpInCol(c);
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isGameOver();
			this.updataView();
		}
	},
	moveUpInCol:function(c){
		for(var r=0;r<this.data.length-1;r++){
			var down=this.getDownNext(r,c);
			if(down==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[down][c];
					this.data[down][c]=0;
					r--;
				}else if(this.data[r][c]==this.data[down][c]){
					this.data[r][c]*=2;
					this.data[down][c]=0;
					this.score+=this.data[r][c];
				}
			}
		}
	},
	getDownNext:function(r,c){
		for(var down=r+1;down<this.data.length;down++){
			if(this.data[down][c]!=0){
				return down;
			}
		}
		return -1;
	},
	moveDown:function(){//下移
		var before=this.data.toString();
		for(var c=0;c<this.CN;c++){
			this.moveDownInCol(c);
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isGameOver();
			this.updataView();
		}
	},
	moveDownInCol:function(c){
		for(var r=this.data.length-1;r>0;r--){
			var up=this.getUpPrev(r,c);
			if(up==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[up][c];
					this.data[up][c]=0;
					r++;
				}else if(this.data[r][c]==this.data[up][c]){
					this.data[r][c]*=2;
					this.data[up][c]=0;
					this.score+=this.data[r][c];
				}
			}
		}
	},
	getUpPrev:function(r,c){
		for(var up=r-1;up>=0;up--){
			if(this.data[up][c]!=0){
				return up;
			}
		}
		return -1;
	}
}
//当页面加载后再启动游戏
window.onload=function(){
	game.start();
	//当按键按下时
	document.onkeydown=function(){
		if(this.state==this.RUNNING){
			var e=window.event||arguments[0];
			if(e.keyCode==37){
				game.moveLeft();
			}else if(e.keyCode==39){
				game.moveRight();
			}else if(e.keyCode==38){
				game.moveUp();
			}else if(e.keyCode==40){
				game.moveDown();
			}
		}
	};
	
}