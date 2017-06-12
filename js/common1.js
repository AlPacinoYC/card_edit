$(window).resize(function(){
			infinite(true);
		});
		infinite(true);
function infinite(marginBool) {
	var htmlWidth = $('.wrap_card').width();
	if (htmlWidth >= 960) {
		htmlWidth = 960;
		$(".wrap_card").css({
			"font-size" : "36px"
		});
	} else {
		if (htmlWidth <= 320) {
			htmlWidth = 320;
		};
		$(".wrap_card").css({
			"font-size" :  24 / 530 * htmlWidth + "px"
		});
	}
	
	var navHeight = $('.nav').height() || 0;
	var adsHeight = $('.ads').height() || 0;

	$('#wrap').css({
    	"padding-bottom" : navHeight + adsHeight + "px"
    });
	// 解决苹果微信浏览器横屏到纵屏时产生的白色区域
	if (marginBool) {	
		var marginTop = 24 / 640 * htmlWidth * 4.17;
		$('#wrap').css({
	    	"margin-top" : marginTop - 2 + "px"
	    });
	};
}