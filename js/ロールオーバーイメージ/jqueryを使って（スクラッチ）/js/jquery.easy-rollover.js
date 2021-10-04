(function($){
	$.fn.easyRollover = function(config){
		var defaults = {
			suffix: '_out.',
			suffix_replace: '_over.'
		};
		opt = $.extend(defaults, config); //基本的にopt=defaultsと考えてOK

		var src, src_replace, _self, image;
		for(var i=0;i<this.length;i++){
			src = this[i].getAttribute('src');
			if(src.indexOf(opt.suffix) > -1){
				src_replace = src.replace(opt.suffix, opt.suffix_replace);
				image = new Image();
				image.src = src_replace;
				$(this[i]).hover(function(){
					this.setAttribute('src', src_replace);

				}, function(){
					this.setAttribute('src', src);

				});
			}

		}
	};
})(jQuery);
