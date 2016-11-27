/**
 * 重载Backbone.Router, 将规则解析到PAWAController中的方法
 */
define(['PAWA', 'backbone'], function(PAWA, Backbone) {
    var PAWARouter = PAWA.PAWARouter = Backbone.Router.extend({
        initialize : function(options) {
            this.init.apply(this, arguments);
        },
        init : function(options) {
        },
        route: function(route, name, callback) {
      		if (!_.isRegExp(route)) route = this._routeToRegExp(route);
			if (!callback) callback = this[name];
			var statusReg = new RegExp();
			Backbone.history.route(route, _.bind(function(fragment) {
		        var args = this._extractParameters(route, fragment);
		        PAWA.routeStatus = 200;
		        PAWA.execFilter(route, fragment, args);
		        statusReg.compile(PAWA.routeStatus, 'ig');
		        //判断经过过滤器之后状态码是否依旧OK，如果不OK的话，执行配置中的状态码处理
		        if(!statusReg.test(PAWA.OK_STATUS)) {
		        	PAWA.handleStatus(PAWA.routeStatus, route, fragment, args);
		        	return ;
		        }
		        //状态是OK的，继续其它处理
		        callback && callback.apply(this, args);
		        this.trigger.apply(this, ['route:' + name].concat(args));
		        this.trigger('route', name, args);
		        Backbone.history.trigger('route', this, name, args);
		        PAWA.request.clear();
			}, this));
		    return this;
      }
    });
    PAWARouter.routeStatus = 200;
    return PAWARouter;
});
