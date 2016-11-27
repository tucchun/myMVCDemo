define(["PAWA"], function(PAWA){
	var request = PAWA.request = {
		_parameters: {}, 
		clear : function() {
			if(!_.isEmpty(this._parameters))//如果不是空对象则设置成空对象，可以手动清除
				this._parameters = {};
		},
		/**
		 *添加或者获取参数的统一方法
		 * @param args:
		 * 1、若args[0]为字符串，且 只有一个参数，则取出key为args[0]的参数值
		 * 2.若args[0]为字符串，且有两个参数，则设置key为args[0]的参数值为args[1]
		 * 3. 若第一个参数(args)是一个Object，则将Object中的所有key和value都这是到参数表中
		 * 4. 除第 1 条以外的任意一种情况均返回所有参数
		 */
		param : function() {
			var arg = arguments, idx = 0, len = arg.length;
			switch(len) {
				case 1: //一个参数的情况
					if(typeof arg[0] === 'string') {	//传的是一个字符串
						return _.clone(this._parameters[arg[0]]);
					} else if(_.isObject(arg[0])) {
						_.extend(this._parameters, arg[0]);
					} 
					break;
				case 2: //两个参数的情况
					if(typeof arg[0] === 'string') {	//传的是一个字符串
						return this._parameters[arg[0]] = arg[1];
					} else if(_.isObject(arg[0])) {
						_.extend(this._parameters, arg[0]);
					}
					break;
			}
			return _.clone(this._parameters);
		}
	};
	return request;
});
