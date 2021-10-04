(function($){
	$.fn.easyRollover = function(config){
		var defaults = {
			suffix: &#039;_out.&#039;,
			suffix_replace: &#039;_over.&#039;
		};
		opt = $.extend(defaults, config);

		var src, src_replace, _self, image;
		for(var i=0;i&lt;this.length;i++){
			src = this[i].getAttribute(&#039;src&#039;);
			if(src.indexOf(opt.suffix) &gt; -1){
				src_replace = src.replace(opt.suffix, opt.suffix_replace);
				image = new Image();
				image.src = src_replace;
				$(this[i]).hover(function(){
					this.setAttribute(&#039;src&#039;, src_replace);
 
				}, function(){
					this.setAttribute(&#039;src&#039;, src);

				});
			}

		}
	};
})(jQuery);
