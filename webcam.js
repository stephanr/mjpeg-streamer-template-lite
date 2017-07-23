/*jslint browser: true, sloppy: true */
/*global $ */

var rotation = 0, flipped = 0, mirrored = 0;

function applyCssTransform() {
	var img, off, css;
	css = "";
	off = 0;

	if (rotation === 90 || rotation === 270) {
		off = Math.ceil(Math.abs(img.width() - img.height()) / 2);
	}
	if (rotation > 0) {
		css += " rotate(" + rotation + "deg)";
	}
	if (flipped && mirrored) {
		css += " scale(-1,-1)";
	} else if (flipped) {
		css += " scaleY(-1)";
	} else if (mirrored) {
		css += " scaleX(-1)";
	}

	img = $('#streamimage');

	// apply position styles
	img.css("margin-top", off + 'px');
	img.css("margin-bottom", off + 'px');
	img.css("left", '-' + off + 'px');
	// apply transformation styles
	img.css("-moz-transform", css);
	img.css("-webkit-transform", css);
	//img.css("transform", css);
}

function fmtDateNum(val) {
	return (val < 10) ? '0' + val : val;
}

$(document).ready(function () {
	// reload cookie state
	var fromcookie = 0;
	if( Cookies.get('mirrored') === '1' ){
		mirrored = 1;
		fromcookie = 1;
	}
	if( Cookies.get('flipped') === '1' ){
		flipped = 1;
		fromcookie = 1;
	}
	switch (Cookies.get('rotation')){
		case '90':
			rotation = 90;
			fromcookie = 1;
			break;
		case '180':
			rotation = 180;
			fromcookie = 1;
			break;
		case '270':
			rotation = 270;
			fromcookie = 1;
			break;
	}
	if ( fromcookie === 1 ) {
		applyCssTransform();
	}
	
	// assing button functions
	$('#rotate').click(function () {
		rotation = (rotation + 90) % 360;
		switch (rotation){
			case 90:
				Cookies.set('rotation', '90');
				break;
			case 180:
				Cookies.set('rotation', '180');
				break;
			case 270:
				Cookies.set('rotation', '270');
				break;
		}
		applyCssTransform();
	});
	$('#mirror').click(function () {
		mirrored = !mirrored;
		Cookies.set('mirrored', mirrored ? '1' : '0' );
		applyCssTransform();
	});
	$('#flip').click(function () {
		flipped = !flipped;
		Cookies.set('flipped', flipped ? '1' : '0' );
		applyCssTransform();
	});
	$('#refresh').click(function () {
		var url;
		url = "/?action=snapshot&timestamp=" + new Date().getTime();
		$("#streamimage").attr("src", url);
	});
	$('#streamimage.static').load(function () {
		var d = new Date(), txt;
		txt = d.getDate() + '.';
		txt += fmtDateNum(d.getMonth() + 1) + '.';
		txt += d.getFullYear() + ' ';
		txt += fmtDateNum(d.getHours()) + ':';
		txt += fmtDateNum(d.getMinutes()) + ':';
		txt += fmtDateNum(d.getSeconds());
		$("#streamwrap #loaded").html(txt);
	});
});