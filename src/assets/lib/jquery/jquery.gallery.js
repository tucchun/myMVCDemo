/**
 * jquery.gallery.js
 * http://www.codrops.com
 *
 * Copyright 2011, Pedro Botelho / Codrops
 * Free to use under the MIT license.
 *
 * Date: Mon Jan 30 2012
 */
;(function( $, undefined ) {
	/*
	 * Gallery object.
	 */
	$.Gallery 				= function( options, element ) {
		this.$el	= $( element );
		this._init( options );
	};
	$.Gallery.defaults 		= {
		current		: 0,	// index of current item
		autoplay	: false,// slideshow on / off
		interval	: 2000  // time between transitions
    };
	$.Gallery.prototype 	= {
		_init 				: function( options ) {
			this.options 		= $.extend( true, {}, $.Gallery.defaults, options );
			// support for 3d / 2d transforms and transitions
			//this.support3d		= Modernizr.csstransforms3d;
			//this.support2d		= Modernizr.csstransforms;
			//this.supportTrans	= Modernizr.csstransitions;
			this.$wrapper		= this.$el.find('.dg-wrapper');
			this.$items			= this.$wrapper.children();
			this.itemsCount		= this.$items.length;
			this.$nav			= this.$el.find('nav');
			this.$navPrev		= this.$nav.find('.dg-prev');
			this.$navNext		= this.$nav.find('.dg-next');
            this.$navTransition = this.$nav.find('.dg-transition');
			// minimum of 3 items
			if( this.itemsCount < 3 ) {
				this.$nav.remove();
				return false;
			}	
			this.current		= this.options.current;
			this.isAnim			= false;
			this.$items.css({
				'opacity'	: 0,
				'visibility': 'hidden'
			});
			this._validate();
			this._layout();
            this.maxScrollX = this.$currentItm.width();
			// load the events
			this._loadEvents();
			// slideshow
			if( this.options.autoplay ) {
				this._startSlideshow();
			}
		},
		_validate			: function() {
			if( this.options.current < 0 || this.options.current > this.itemsCount - 1 ) {
				this.current = 0;
			}	
		},
		_layout				: function() {
			// current, left and right items
			this._setItems();
			// current item is not changed
			// left and right one are rotated and translated
			this.$leftItm.css( this._getCoordinates('left') || {} );
			this.$rightItm.css( this._getCoordinates('right') || {} );
			this.$currentItm.css(this._getCoordinates('center')).addClass('dg-center');
		},
		_setItems			: function() {
			this.$items.removeClass('dg-center');
			this.$currentItm	= this.$items.eq( this.current );
			this.$leftItm		= ( this.current === 0 ) ? this.$items.eq( this.itemsCount - 1 ) : this.$items.eq( this.current - 1 );
			this.$rightItm		= ( this.current === this.itemsCount - 1 ) ? this.$items.eq( 0 ) : this.$items.eq( this.current + 1 );
			/*//2d 模式需要设置层顺序
            this.$items.css( 'z-index', 1 );
            this.$currentItm.css( 'z-index', 999 );*/
            //onSwitched
            this.options.onSwitched && this.options.onSwitched.apply(this, [this.$currentItm, {index:this.current}]);
			// next & previous items
			if( this.itemsCount > 3 ) {
				// next item
				this.$nextItm		= ( this.$rightItm.index() === this.itemsCount - 1 ) ? this.$items.eq( 0 ) : this.$rightItm.next();
				this.$nextItm.css( this._getCoordinates('outright') );
				// previous item
				this.$prevItm		= ( this.$leftItm.index() === 0 ) ? this.$items.eq( this.itemsCount - 1 ) : this.$leftItm.prev();
				this.$prevItm.css( this._getCoordinates('outleft') );
			}
		},
		_loadEvents			: function() {
			var _self	= this;
			var prev = function(){
                if( _self.options.autoplay ) {
                    clearTimeout( _self.slideshow );
                    _self.options.autoplay	= false;
                }
                _self._navigate('prev');
            };
            var next = function(){
                if( _self.options.autoplay ) {
                    clearTimeout( _self.slideshow );
                    _self.options.autoplay	= false;
                }
                _self._navigate('next');
            };
			this.$navPrev.on( 'click.gallery', function( event ) {
                prev();
				return false;
			});
			this.$navNext.on( 'click.gallery', function( event ) {
				next();
				return false;
			});
			this.$wrapper.on( 'webkitTransitionEnd.gallery transitionend.gallery OTransitionEnd.gallery', function( event ) {
				_self.$currentItm.addClass('dg-center');
				_self.$items.removeClass('dg-transition');
				_self.isAnim	= false;
			});
            this.$el.bind('touchstart', function(e){e.preventDefault()});
            this.$el.swipeleft(function(e){
                next();
            });
            this.$el.swiperight(function(e){
                prev();
            });

		},

		_getCoordinates		: function( position ) {
            switch( position ) {
                case 'outleft':
                    return {
                        '-webkit-transform'	: 'translateX(-475px) translateZ(-283px) rotateY(-30deg)',
                        '-moz-transform'	: 'translateX(-475px) translateZ(-283px) rotateY(-30deg)',
                        '-o-transform'		: 'translateX(-475px) translateZ(-283px) rotateY(-30deg)',
                        '-ms-transform'		: 'translateX(-475px) translateZ(-283px) rotateY(-30deg)',
                        'transform'			: 'translateX(-475px) translateZ(-283px) rotateY(-30deg)',
                        'opacity'			: 0,
                        'visibility'		: 'hidden'
                    };
                    break;
                case 'outright':
                    return {
                        '-webkit-transform'	: 'translateX(475px) translateZ(-283px) rotateY(30deg)',

                        '-moz-transform'	: 'translateX(475px) translateZ(-283px) rotateY(30deg)',
                        '-o-transform'		: 'translateX(475px) translateZ(-283px) rotateY(30deg)',
                        '-ms-transform'		: 'translateX(475px) translateZ(-283px) rotateY(30deg)',
                        'transform'			: 'translateX(475px) translateZ(-283px) rotateY(30deg)',
                        'opacity'			: 0,
                        'visibility'		: 'hidden'
                    };
                    break;
                case 'left':
                    return {
                        '-webkit-transform'	: 'translateX(-340px) translateZ(-79px) rotateY(-30deg)',
                        '-moz-transform'	: 'translateX(-340px) translateZ(-79px) rotateY(-30deg)',
                        '-o-transform'		: 'translateX(-340px) translateZ(-79px) rotateY(-30deg)',
                        '-ms-transform'		: 'translateX(-340px) translateZ(-79px) rotateY(-30deg)',
                        'transform'			: 'translateX(-340px) translateZ(-79px) rotateY(-30deg)',
                        'opacity'			: 1,
                        'visibility'		: 'visible'
                    };
                    break;
                case 'right':
                    return {
                        '-webkit-transform'	: 'translateX(340px) translateZ(-79px) rotateY(30deg)',
                        '-moz-transform'	: 'translateX(340px) translateZ(-79px) rotateY(30deg)',
                        '-o-transform'		: 'translateX(340px) translateZ(-79px) rotateY(30deg)',
                        '-ms-transform'		: 'translateX(340px) translateZ(-79px) rotateY(30deg)',
                        'transform'			: 'translateX(340px) translateZ(-79px) rotateY(30deg)',
                        'opacity'			: 1,
                        'visibility'		: 'visible'
                    };
                    break;
                case 'center':
                    return {
                        '-webkit-transform'	: 'translateX(0px) translateZ(0px) rotateY(0deg)',
                        '-moz-transform'	: 'translateX(0px) translateZ(0px) rotateY(0deg)',
                        '-o-transform'		: 'translateX(0px) translateZ(0px) rotateY(0deg)',
                        '-ms-transform'		: 'translateX(0px) translateZ(0px) rotateY(0deg)',
                        'transform'			: 'translateX(0px) translateZ(0px) rotateY(0deg)',
                        'opacity'			: 1,
                        'visibility'		: 'visible'
                    };
                    break;
            };
		},
		_navigate			: function( dir ) {
            this.options.onSwitchStart && this.options.onSwitchStart.apply(this, [this.$currentItm, {index:this.current}]);
			if( this.isAnim )
				return false;
			this.isAnim	= true;
			switch( dir ) {
				case 'next' :
					this.current	= this.$rightItm.index();
                    // current item moves left
                    this.$currentItm.addClass('dg-transition').css( this._getCoordinates('left') );
                    // right item moves to the center
                    this.$rightItm.addClass('dg-transition').css( this._getCoordinates('center') );
					// next item moves to the right
					if( this.$nextItm ) {
                        // left item moves out
                        this.$leftItm.addClass('dg-transition').css( this._getCoordinates('outleft') );
                        this.$nextItm.addClass('dg-transition').css( this._getCoordinates('right') );
					}
					else {
						// left item moves right
						this.$leftItm.addClass('dg-transition').css( this._getCoordinates('right') );
					}
                    break;
				case 'prev' :
					this.current	= this.$leftItm.index();
					// current item moves right
					this.$currentItm.addClass('dg-transition').css( this._getCoordinates('right') );
					// left item moves to the center
					this.$leftItm.addClass('dg-transition').css( this._getCoordinates('center') );
					// prev item moves to the left
					if( this.$prevItm ) {
						// right item moves out
						this.$rightItm.addClass('dg-transition').css( this._getCoordinates('outright') );
						this.$prevItm.addClass('dg-transition').css( this._getCoordinates('left') );
					}
					else {
						// right item moves left
						this.$rightItm.addClass('dg-transition').css( this._getCoordinates('left') );
					}
					break;	
			};
			this._setItems();
			/*if( !this.supportTrans )
				this.$currentItm.addClass('dg-center');*/
		},
		_startSlideshow		: function() {
			var _self	= this;
			this.slideshow	= setTimeout( function() {
				_self._navigate( 'next' );
				if( _self.options.autoplay ) {
					_self._startSlideshow();
				}
			}, this.options.interval );
		},
		destroy				: function() {
			this.$navPrev.off('.gallery');
			this.$navNext.off('.gallery');
			this.$wrapper.off('.gallery');
		}
	};
	var logError 			= function( message ) {
		if ( this.console ) {
			console.error( message );
		}
	};
	$.fn.gallery			= function( options ) {
		if ( typeof options === 'string' ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			this.each(function() {
				var instance = $.data( this, 'gallery' );
				if ( !instance ) {
					logError( "cannot call methods on gallery prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				}
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
					logError( "no such method '" + options + "' for gallery instance" );
					return;
				}
				instance[ options ].apply( instance, args );
			});
		} 
		else {
			this.each(function() {
				var instance = $(this).data( 'gallery' );
				if ( !instance ) {
					$(this).data( 'gallery', new $.Gallery( options, this ) );
				}
			});
		}
		return this;
	};
})( jQuery );