$(window).load(function(){
	$('.loading').fadeOut('fast');
	$('.container').fadeIn('fast');
});
$('document').ready(function(){
		function getBalloonPositions() {
			var width = $(window).width();
			var height = $(window).height();
			var vw = width / 2;
			var balloon_width = Math.min(100, Math.max(50, width * 0.12));
			var spacing = balloon_width;
			var topPos = Math.min(240, height * 0.35);
			
			var positions = [];
			for (var i = 0; i < 7; i++) {
				positions.push({
					top: topPos,
					left: vw + (i - 3) * spacing - (balloon_width / 2)
				});
			}
			return positions;
		}

		$(window).resize(function(){
			var pos = getBalloonPositions();
			$('#b11').stop().animate({top:pos[0].top, left: pos[0].left},500);
			$('#b22').stop().animate({top:pos[1].top, left: pos[1].left},500);
			$('#b33').stop().animate({top:pos[2].top, left: pos[2].left},500);
			$('#b44').stop().animate({top:pos[3].top, left: pos[3].left},500);
			$('#b55').stop().animate({top:pos[4].top, left: pos[4].left},500);
			$('#b66').stop().animate({top:pos[5].top, left: pos[5].left},500);
			$('#b77').stop().animate({top:pos[6].top, left: pos[6].left},500);
		});

	$('#turn_on').click(function(){
		$('#bulb_yellow').addClass('bulb-glow-yellow');
		$('#bulb_red').addClass('bulb-glow-red');
		$('#bulb_blue').addClass('bulb-glow-blue');
		$('#bulb_green').addClass('bulb-glow-green');
		$('#bulb_pink').addClass('bulb-glow-pink');
		$('#bulb_orange').addClass('bulb-glow-orange');
		$('body').addClass('peach');
		$(this).fadeOut('slow').delay(5000).promise().done(function(){
			$('#play').fadeIn('slow');
		});
	});
	$('#play').click(function(){
		var audio = $('.song')[0];
        audio.play();
        $('#bulb_yellow').addClass('bulb-glow-yellow-after');
		$('#bulb_red').addClass('bulb-glow-red-after');
		$('#bulb_blue').addClass('bulb-glow-blue-after');
		$('#bulb_green').addClass('bulb-glow-green-after');
		$('#bulb_pink').addClass('bulb-glow-pink-after');
		$('#bulb_orange').addClass('bulb-glow-orange-after');
		$('body').css('backgroud-color','#FFF');
		$('body').addClass('peach-after');
		$(this).fadeOut('slow').delay(6000).promise().done(function(){
			$('#bannar_coming').fadeIn('slow');
		});
	});

	$('#bannar_coming').click(function(){
		$('.bannar').addClass('bannar-come');
		$(this).fadeOut('slow').delay(6000).promise().done(function(){
			$('#balloons_flying').fadeIn('slow');
		});
	});

	function loopOne() {
		var randleft = ($(window).width() - 80) * Math.random();
		var randtop = ($(window).height() - 150) * Math.random();
		$('#b1').animate({left:randleft,bottom:randtop},10000,function(){
			loopOne();
		});
	}
	function loopTwo() {
		var randleft = ($(window).width() - 80) * Math.random();
		var randtop = ($(window).height() - 150) * Math.random();
		$('#b2').animate({left:randleft,bottom:randtop},10000,function(){
			loopTwo();
		});
	}
	function loopThree() {
		var randleft = ($(window).width() - 80) * Math.random();
		var randtop = ($(window).height() - 150) * Math.random();
		$('#b3').animate({left:randleft,bottom:randtop},10000,function(){
			loopThree();
		});
	}
	function loopFour() {
		var randleft = ($(window).width() - 80) * Math.random();
		var randtop = ($(window).height() - 150) * Math.random();
		$('#b4').animate({left:randleft,bottom:randtop},10000,function(){
			loopFour();
		});
	}
	function loopFive() {
		var randleft = ($(window).width() - 80) * Math.random();
		var randtop = ($(window).height() - 150) * Math.random();
		$('#b5').animate({left:randleft,bottom:randtop},10000,function(){
			loopFive();
		});
	}

	function loopSix() {
		var randleft = ($(window).width() - 80) * Math.random();
		var randtop = ($(window).height() - 150) * Math.random();
		$('#b6').animate({left:randleft,bottom:randtop},10000,function(){
			loopSix();
		});
	}
	function loopSeven() {
		var randleft = ($(window).width() - 80) * Math.random();
		var randtop = ($(window).height() - 150) * Math.random();
		$('#b7').animate({left:randleft,bottom:randtop},10000,function(){
			loopSeven();
		});
	}

	$('#balloons_flying').click(function(){
		$('.balloon-border').animate({top:-500},8000);
		$('#b1,#b4,#b5,#b7').addClass('balloons-rotate-behaviour-one');
		$('#b2,#b3,#b6').addClass('balloons-rotate-behaviour-two');
		// $('#b3').addClass('balloons-rotate-behaviour-two');
		// $('#b4').addClass('balloons-rotate-behaviour-one');
		// $('#b5').addClass('balloons-rotate-behaviour-one');
		// $('#b6').addClass('balloons-rotate-behaviour-two');
		// $('#b7').addClass('balloons-rotate-behaviour-one');
		loopOne();
		loopTwo();
		loopThree();
		loopFour();
		loopFive();
		loopSix();
		loopSeven();
		
		$(this).fadeOut('slow').delay(5000).promise().done(function(){
			$('#cake_fadein').fadeIn('slow');
		});
	});	

	$('#cake_fadein').click(function(){
		$('.cake').fadeIn('slow');
		$(this).fadeOut('slow').delay(3000).promise().done(function(){
			$('#light_candle').fadeIn('slow');
		});
	});

	$('#light_candle').click(function(){
		$('.fuego').fadeIn('slow');
		$(this).fadeOut('slow').promise().done(function(){
			$('#wish_message').fadeIn('slow');
		});
	});

		
	$('#wish_message').click(function(){
		$('#b1,#b2,#b3,#b4,#b5,#b6,#b7').stop();
		$('#b1').attr('id','b11');
		$('#b2').attr('id','b22')
		$('#b3').attr('id','b33')
		$('#b4').attr('id','b44')
		$('#b5').attr('id','b55')
		$('#b6').attr('id','b66')
		$('#b7').attr('id','b77')
		
		var pos = getBalloonPositions();
		$('#b11').animate({top:pos[0].top, left: pos[0].left},500);
		$('#b22').animate({top:pos[1].top, left: pos[1].left},500);
		$('#b33').animate({top:pos[2].top, left: pos[2].left},500);
		$('#b44').animate({top:pos[3].top, left: pos[3].left},500);
		$('#b55').animate({top:pos[4].top, left: pos[4].left},500);
		$('#b66').animate({top:pos[5].top, left: pos[5].left},500);
		$('#b77').animate({top:pos[6].top, left: pos[6].left},500);
		$('.balloons').css('opacity','0.9');
		$('.balloons h2').fadeIn(3000);
		$(this).fadeOut('slow').delay(3000).promise().done(function(){
			$('#story').fadeIn('slow');
		});
	});
	
	$('#story').click(function(){
		$(this).fadeOut('slow');
		$('.cake').fadeOut('fast').promise().done(function(){
			$('.message').fadeIn('slow');
		});
		
		var i;

		function msgLoop (i) {
			$("p:nth-child("+i+")").fadeOut('slow').delay(800).promise().done(function(){
			i=i+1;
			$("p:nth-child("+i+")").fadeIn('slow').delay(1000);
			if(i==50){
				$("p:nth-child(49)").fadeOut('slow').promise().done(function () {
					$('.cake').fadeIn('fast');
				});
				
			}
			else{
				msgLoop(i);
			}			

		});
			// body...
		}
		
		msgLoop(0);
		
	});
});




//alert('hello');