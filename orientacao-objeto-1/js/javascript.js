var Person = function(){
	this.name = "jhon";
	this.lastname = "Doe";
	this.age = 50;
	this.height = 1.65;
};

Person.prototype =  {
	getAge: function(){
		return this.age;
	},
	setAge: function(age){
		this.age = age;
	},
	withAge: function(callback){
		return callback(this.age);
	}
};

var pedro = new Person();
console.log(pedro.getAge());
pedro.setAge("10");
console.log(pedro.getAge());

pedro.withAge(function(age){
	alert(age);
});
