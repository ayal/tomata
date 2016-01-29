webpackHotUpdate(0,[
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(2);

	var k = 1;
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

	console.log(row.join(''), calcnext(row).join(''));

/***/ }
])