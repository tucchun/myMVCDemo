/**
 * 定义PAWA对象
 */
define(['backbone'], function(Backbone) {
	// 将PAWA原型引用为Backbone, 便于调用和扩展
	var PAWAConstructor = new Function();
	PAWAConstructor.prototype = Backbone;
	PAWAConstructor.prototype.constructor = PAWAConstructor;

	// 创建并扩展PAWA对象
	_.extend(window.PAWA = new PAWAConstructor(), {
		// 框架版本号
		VERSION : '0.0.4',
		// 上一次自动加载时的Hash
		lastHash : '',
		// 初始化创建Router对象
		/**
		 *
		 * @param {Object} options 定义初始化参数
		 *  {
		 * 	isSPA: 是否是单页, true 单页， 否则是多页 , 默认false
		 * 	pushState: 是否使用history api 默认false
		 *  defaultHash: 如果地址栏上没有带hash的话，默认route到的位置  默认"index/index"
		 * }
		 */
		module : "PAWA",
		init : function(options) {
			var options = options || {};
			options.isSPA === undefined && (options.isSPA = false);
			options.pushState === undefined && (options.pushState = false);
			//options.defaultHash === PAWA.request.param("index") && (options.defaultHash = "index/index");
			this.router = new PAWA.PAWARouter();
			this.main = options.main || function(){};
			this.history.start({
				pushState : options.pushState
			});
			this.defaultHash = options.defaultHash || PAWA.request.param("index") || "index/index";
			if (options.isSPA) {
				PAWA.history.handlers.push({
					callback : _.bind(this.autoload, this),
					route : /^(.*)$/
				});
				this.navigate();
			}
			this.handleStatus.coreConfig = options.coreConfig || {};
		},
		// 导航到当前的action
		navigate : function(fragment) {
			var router = this.router, fragment = fragment || location.hash.substring(1) || this.defaultHash;
			router.navigate('', {
				trigger : false,
				replace : true
			});
			router.navigate(fragment, {
				trigger : true,
				replace : true
			});
		},
		// 加载模块入口
		autoload : function(hash) {
			if (this.lastHash === hash) {
				PAWA.routeStatus = 404;
				PAWA.handleStatus(PAWA.routeStatus, hash);
				throw Error('404: not found uri: ' + hash);
				return false;
			}
			this.lastHash = hash;
			//this.main();
			var hashArr = hash.split('/');
			var module = hashArr.splice(0, 1), controller = hashArr.join('/');
			if (module && module != 'common') {
				this.main();
				this.navigate(hash);
			//	var mainPath = 'main.js';
			//	require([mainPath], _.bind(function(moduleMain) {
			//		moduleMain();
			//		this.navigate(hash);
			//	}, this));
			}
		},
		/**
		 * 给PAWA应用增加过滤器
		 * @param {Object} filterName 过滤器名称
		 * @param {Object} filterObj 过滤器对象
		 * @param {Object} position 添加到过滤器中的位置
		 * @param {Boolean} prevOrNext 添加到position（当且仅当postion是一个string）的前面还是后面，true为前面，false为后面，默认后面
		 */
		addFilter: function addFilter(filterName, filterObj, position, prevOrNext) {
			var filterChain = this.__filterChain__, 			//拿到责任链对象，这里不使用链表，用数组标识顺序
				//拿到责任链标识顺序的数组
				sortedName = filterChain._sortedName,			
				//拿到责任链中的过滤器对象
				filters = filterChain._filters,					
				//查看当前要添加的过滤器在责任链中是否存在
				filterIndex = sortedName.indexOf(filterName),	
				//从尾部增加
				isAddToTail = position === sortedName.length || undefined === position,	
				//从头部增加标识
				isAddToHead = position === 0,					
				//从指定位置增加标识
				isAddAbsolute = typeof position === 'string' && sortedName.indexOf(position);	
			
			if(filterIndex !== -1) {				//如果责任链中已经有当前名称的filterName则报错,并且不再进行处理
				throw new FilterAreadyInChainError(filterName);
				return ;
			}
			if(isAddToTail)	{			//添加到尾部
				sortedName.push(filterName);
				filters[filterName] = filterObj;	
			} else if(isAddToHead) {	//添加到头部
				sortedName.unshift(filterName);
				filters[filterName] = filterObj;
			} else if(isAddAbsolute !== -1) {	//从指定的地方添加
				if(prevOrNext) {	//true为前面添加
					if(isAddAbsolute === 0) {	//如果是在第0个位置，则unshift到前面
						sortedName.unshift(filterName);
					} else {	
						//否则使用splice方法从中间加入
						sortedName.splice(isAddAbsolute-1, 0, filterName);
					}	
				} else {	//默认添加到后面
					sortedName.splice(isAddAbsolute, 0, filterName);
				}
				//将过滤器对象添加到责任链中
				filters[filterName] = filterObj;
			}
			return this;
		},
		/**
		 * 删除一个过滤器
 		 * @param {Object} filterName 过滤器名
		 */
		removeFilter: function removeFilter(filterName) {
			var filterChain = this.__filterChain__, 			//拿到责任链对象，这里不使用链表，用数组标识顺序
			//拿到责任链标识顺序的数组
			sortedName = filterChain._sortedName,
			//拿到责任链中的过滤器对象
			filters = filterChain._filters,					
			//查看当前要添加的过滤器在责任链中是否存在
			filterIndex = sortedName.indexOf(filterName);
			if(filterIndex !== -1) {
				sortedName.splice(filterIndex, 1);
			}
			return this;
		},
		/**
		 * 解析过滤器
		 * @param {Object} routeReg route的正则表示
		 * @param {Object} fragment 当前帧
		 * @param {Object} args 其余的参数信息
		 */
        execFilter: function execFilters(routeReg, fragment, args, filterIndex) {
            var filterChain = this.__filterChain__,          //拿到责任链对象，这里不使用链表，用数组标识顺序
            //拿到责任链标识顺序的数组
                sortedName = filterChain._sortedName,
            //拿到责任链中的过滤器对象
                filters = filterChain._filters;
            filterIndex = filterIndex || 0;
            //拿到责任链当前的过滤器
            var currFilter = filters[sortedName[filterIndex]];
            if(!currFilter) return ;
            if(typeof currFilter === 'object') {
                for(var i = 0, len = currFilter.conditions.length;i < len; i ++) {
                    if(currFilter.conditions[i].test(fragment)) {
                        //调用责任链的处理方法,filter只调用一次
                        currFilter.handler(routeReg, fragment, args, filterIndex);
                        break;
                    }
                }
                if(i === len) {
                    currFilter.handler(routeReg, fragment, args, filterIndex + 1);
                }
            }
            return this;
        },
        OK_STATUS: '200, 304, 201, 204',
		__filterChain__: {
			_sortedName: [],
			_filters: {
			}
		},
		/**
		 * 根据状态码做对应的处理
 		 * @param {Object} statusCode
		 */
		handleStatus: function(statusCode, route, fragment, args) {
			this.handleStatus.coreConfig = this.handleStatus.coreConfig || {};
			var handlers = this.handleStatus.coreConfig[statusCode], isContinue = true;
			if(!handlers) return;
			for(var i = 0, len = handlers.length; i < len; i ++) {
				if(typeof handlers[i] === 'function') {
					isContinue = handlers[i](route, fragment, args);
				}
				if(isContinue === false) return ;
			}
		}
	});
	
	function FilterAreadyInChainError(filterName) {
		var name = "FilterAreadyInChainError",
		  	message = "filter 添加失败，" + filterName + " 已经存在，请先remove之后再进行添加！";
		var err = new Error(message);
		err.name = name;
		err.type = 'PAWA_FILTER_ERROR';
		err.level = '中';
		return err;
	}
	
	return PAWA;
});
