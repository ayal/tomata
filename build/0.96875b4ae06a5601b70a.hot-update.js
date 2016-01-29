webpackHotUpdate(0,[
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(2);

	var k = 1;
	var scale = 10;
	var cols = 3;
	var rules = Math.pow(2, Math.pow(2, cols));

	var rule = _.random(rules);

	var w = 100;

	// random row
	var row = [];
	for (var i = 0; i < w; i++) {
	    row.push(_.random(k));
	}

	var calcnext = function calcnext(row) {
	    var next = [];
	    for (var i = 0; i < row.length; i++) {
	        var num = parseInt('' + row[i % row.length] + row[(i + 1) % row.length] + row[(i + 2) % row.length], 2);
	        var np = parseInt(rule.toString(2)[num] || 0);
	        next[i + 1] = np;
	    }
	    return next;
	};

	console.log(row.join(''));

	// canvas

	var canvas = document.createElement('canvas');
	canvas.width = w * scale;
	canvas.height = w * scale;
	canvas.style.border = "1px solid";
	document.body.appendChild(canvas);
	var context = canvas.getContext('2d');

	// draw
	var drawrow = function drawrow(row, y) {
	    for (var i = 0; i < row.length; i++) {
	        if (row[i] !== 0) {
	            context.fillRect(i * scale, y * scale, scale, scale);
	        }
	    }
	};

	drawrow(row, 0);

/***/ }
])