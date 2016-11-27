/**
 *PAWA切面日志适配器 
 */
define(['PAWAAll'], function(PAWA) {
	/**
	 *切面日志记录器 
	 */
	function recordLog (){
    	var methods = this.constructor.prototype, recorded = this.constructor.__recorded__,
    		forbids = {'initialize': 0, 'model':0, 'constructor': 0};
    	//因为是在类实例化的时候去做切面日志，因此如果已经实例化过一次的类，就不再做切面日志了
    	if(this.constructor.__recorded__) return ;
    	//标识为日志已做
    	this.constructor.__recorded__ = true;
    	for(var name in methods) {
    		if(methods.hasOwnProperty(name) && typeof methods[name] === 'function'  && !(name in forbids) && name.charAt(0) !== '_') {
    			var method = methods[name];
    			methods[name] = (function(name, method) {
    				return function(){
    					if(this.__logCnf__) {
    						//logger.i(this.__logCnf__.moduleName, "类：", this.__logCnf__.className, "的方法:",name,"被调用！");
							console.log(this.__logCnf__.moduleName + " 类：" + this.__logCnf__.className + "的方法：" + name + "被调用！");
    					}
    					var result = method.apply(this, arguments);
    					if(this.__logCnf__) {
    						//logger.i(this.__logCnf__.moduleName, "类：",this.__logCnf__.className, "的方法:",name,"调用结束！");
    					}
    					return result;
    				}
    			})(name, method);
    		}
    	}
    }
    /**
     *配置各个类的切面日志 模块及类名
     */
	PAWA.PAWAController.prototype.__logCnf__ = {moduleName: "PAWA", className: "PAWAController"};
	PAWA.PAWACollection.prototype.__logCnf__ = {moduleName: "PAWA", className: "PAWACollection"};
	PAWA.PAWAModel.prototype.__logCnf__ = {moduleName: "PAWA", className: "PAWAModel"};
	PAWA.PAWAView.prototype.__logCnf__ = {moduleName: "PAWA", className: "PAWAView"};
	/**
	 *包装切面日志 
	 */
	PAWA.PAWAController.prototype.__recordLog__ 
		= PAWA.PAWACollection.prototype.__recordLog__ 
		= PAWA.PAWAModel.prototype.__recordLog__
		= PAWA.PAWAView.prototype.__recordLog__
		= recordLog;
}); 