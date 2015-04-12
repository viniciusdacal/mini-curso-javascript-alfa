window.onload = function(){
	var canvas  = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var animation = new Animation(context);
	var balls = [];
	var getRandom255 = function(){
		return parseInt(Math.random()* 255);
	};
	var getRandomColor = function(){
		return 'rgb('+getRandom255()+
				','+getRandom255()+
				','+getRandom255()+')';
	}
	for(var i=0; i< 999; i++){
		var ball = new Ball(context);
		ball.speedX = Math.random() * 20;
		ball.speedY = Math.random() * 20;
		ball.color = function(){
			return getRandomColor();
		};
		animation.newSprite(ball);
	}

	animation.play(); 

};