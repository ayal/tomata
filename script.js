// calcs
var _ = require('lodash');

function mod(n, m) {
    return ((n % m) + m) % m;
}

var k = 1;
var cols = 3;
var rules = Math.pow(2,Math.pow(2,cols));

// react
require("./style.less");
import React from 'react'
import { render } from 'react-dom'

import { Router, Route, Link, History, Lifecycle } from 'react-router';

document.addEventListener('keydown', function (e) {
    if (e.which === 39) {
	window.moveCursor(1,0);
    }
    else if (e.which === 37) {
	window.moveCursor(-1,0);
    }
    else {
	console.log(e.which)
    }

});

const Cursor = React.createClass({
    getInitialState: function() {
	var that = this;
	window.moveCursor = function(dx,dy) {
	    that.setState({cx: that.state.cx + dx, cy: that.state.cy + dy})
	}
        return {cx:w / 2,cy:0};
    },
    componentDidMount: function() {
	this.props.paint();
    },
    componentDidUpdate: function() {
	this.props.paint(this.state.cx, this.state.cy);
    },
    clickbit: function(i,j) {
	var that = this;
	return function() {
	    that.props.setBit(that.state.cx + i, that.state.cy + j);
	}
    },
    render: function() {
	var bits = [];
	for (var j = 0; j < 2; j++) {
	    bits.push(<div></div>)
	    for (var i = 0; i < 8; i++) {
		var row = (j === 0 ? this.props.frow : this.props.srow);
		
		if (row) {
		var cls = row[this.state.cx + i] === 1 ? 'on' :'off';
		    bits.push(<div className={"bit " + cls} data-i={i} data-j={j} onClick={this.clickbit(i,j)}></div>)
		}
	    }
	}
	return (
	    <div className="cursor">
	    {bits}
	    </div>
	);
    }
});

var cache = {};

const Toma = React.createClass({
    getInitialState: function() {
	var srow = this.props.rrow();
	//	srow[299] = srow[301] = 1;
	var that = this;
        return {firstrow: this.props.rrow(), secondrow: srow, scale: this.props.scale, y:this.props.y};
    },
    componentDidMount: function() {
/*	var dr1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var dr2 = [1,1,1,1,1,0,1,0,1,1,0,0,0,1,1,0,1,0,0,0,1,0,0,0];
	dr1 = _.groupBy(dr1,function(x,i){return Math.floor(i/3)})
	dr2 = _.groupBy(dr2,function(x,i){return Math.floor(i/3)})
	var that = this;
	_.each(dr1, function(v,k) {
	    console.log([0,1,0],dr2[k],'>',that.calcnext([0,1,0],dr2[k]));
	}) */
//	console.log(this.calcnext(dr2,dr2));

	this.context = this.refs.canvas.getContext('2d');
	this.paint();
    },
    shouldComponentUpdate: function(pprops, pstate) {
	if (pprops.w !== this.props.w ||
	    pprops.h !== this.props.h ||
	    pprops.rule !== this.props.rule ||
	    pprops.y !== this.props.y ||
	    pprops.scale !== this.props.scale) {
	    console.log('props changed, updating...')
	    return true;
	}


	if (pstate.firstrow.join() !== this.state.firstrow.join() ||
	    pstate.secondrow.join() !== this.state.secondrow.join() ||
	    pstate.y !== this.state.y ||
	    pstate.scale !== this.state.scale)
	    {
		console.log('state changed, updating...')
		return true;
	    }
	
	
	console.log('not updating...')
	return false;
	
    },
    componentDidUpdate: function() {
	this.context = this.refs.canvas.getContext('2d');
	this.context.clearRect(0, 0, this.props.w * this.state.scale, this.props.h * this.state.scale);
	console.log('cleared');
	this.paint();
    },
    setBit: function(x,y) {
	console.log('setbit',x,y)
	var frow = _.clone(this.state.firstrow);
	var srow = _.clone(this.state.secondrow);
	if (y === 0) {
	    frow[x] = (frow[x] === 1 ? 0 : 1);
	}
	else {
	    srow[x] = (srow[x] === 1 ? 0 : 1);
	}
	this.setState({firstrow:frow,secondrow:srow})
    },
    drawrow: function(row,y) {
	for (var i = 0; i < row.length; i++) {
	    if (row[i] === 1) {
		this.context.fillStyle="pink";
	    }
	    else {
		this.context.fillStyle="white";
	    }
	    this.context.fillRect(i*this.state.scale, y*this.state.scale, this.state.scale, this.state.scale);
	}
    },
    calcnext: function(row1, row2, times, brule) {
	var key = '' + row1 + row2 + this.props.rule;
	if (cache[key]) {
	    return cache[key];
	}
	
	var next = [];
	times = times || 1;

	for (var j = 0; j < times; j++) {
	    for (var i = 0; i < row2.length; i++) {
		var num = parseInt('' + row2[mod((i - 1), row2.length)] + row2[(i) % row2.length] + row2[(i+1) % row2.length], 2);
		var np = parseInt(brule[num] || '0')
		
/*		if (i === 1) {
		    console.log('brule', brule, 'i',i, '' + row2[mod((i - 1), row2.length)] + row2[(i) % row2.length] + row2[(i+1) % row2.length], '===', num, brule + '[' + num + ']', np)
		}*/

		if (np === 1) {
		    next[(i) % row2.length] = (row1[(i) % row2.length] === 0 ? 1 : 0);
		}
		else {
		    next[(i) % row2.length] = row1[(i) % row2.length];
		}

	    }

	    row2 = next;
	    
	    next = [];
	}

	cache[key] = row2;
	return row2;
    },
    paint: function(cy) {
	console.time('paint');
	var row1 = this.state.firstrow;
	var row2 = this.state.secondrow;
	var brule = this.props.rule.toString(2).split('').reverse().join('');
	for (var y = 0; y < this.props.h; y++) {
	    this.drawrow(row1,y);
//	    this.drawrow(row2,y+1);
	    
	    var trow2 = row2;
	    row2 = this.calcnext(row1, row2,1,brule);
	    row1 = trow2;
	}
	console.timeEnd('paint');
    },
    paintCursor: function(cx, cy) {
	var that = this;
	if (this.context.fillStyle) {
	    console.log('cursor', this.context, cy);

	     for (var j = 0; j < 2; j++) {
		for (var i = -1; i < 9; i++) {
		    var row = (j === 0 ? that.state.firstrow : that.state.secondrow);
		    if (row) {
			if (row[cx + i] === 1) {
			    that.context.fillStyle="pink";
			}
			else {
			    that.context.fillStyle="white";
			}
			that.context.fillRect((cx+i)*that.state.scale, (cy+j)*that.state.scale, that.state.scale, that.state.scale);
		    }
		}
	     }

	    
	    this.context.fillStyle = "rgba(0,0,0,0.1)";
	    this.context.fillRect(cx*this.state.scale, cy*this.state.scale, 8*this.state.scale, 2*this.state.scale);
	}

    },

    rrow: function() {
	this.setState({firstrow: this.props.rrow(), secondrow: this.props.rrow()})
    },
    scaleup: function() {
	this.setState({scale: this.state.scale + 1})
    },
    scaledown: function() {
	this.setState({scale: this.state.scale - 1})
    },
    goup: function() {
/*	var next10 = this.calcnext(this.state.firstrow, this.state.secondrow, 10);
	var next11 = this.calcnext(this.state.firstrow, next10, 10);
	this.setState({firstrow: next10}) */
    },
    download: function(e) {
	e.target.href = this.refs.canvas.toDataURL('image/png');
	e.target.download = this.props.rule + '__' + this.state.scale + '.png';

    },
    render: function() {
	console.log('rendering toma')
	return (
	    <div>
	    <div>
	    <button onClick={this.rrow}>random row</button>
	    
	    <div>
	    <button onClick={this.scaleup}>+</button>
	    <span>scale: {this.state.scale}</span>
	    <button onClick={this.scaledown}>-</button>
	    <button onClick={this.goup}>scroll</button>
	    <a onClick={this.download}>download</a>
	    </div>
	    
	    </div>
	    
	    <div>
	    <canvas ref="canvas" width={this.props.w*this.state.scale} height={this.props.h*this.state.scale} />
	    </div>
	    <Cursor paint={this.paintCursor} setBit={this.setBit} frow={this.state.firstrow} srow={this.state.secondrow}/>
	    </div>
		
	)
    }
});

var w = 300;

const App = React.createClass({
    mixins: [ Lifecycle, History ],
    getInitialState: function() {
        return {ruleText:this.props.location.query.rule};
    },
    routerWillLeave: function(nextLocation) {
        return null;
    },
    setRule: function(r) {
        this.history.pushState(null, '/tomata/', {rule:r});
    },
    setRuleByText: function(e) {
	this.setRule(parseInt(this.state.ruleText));
    },
    rrule: function() {
	var newrule = _.random(rules);
	this.setRule(newrule)
    },
    rrow:function() {
	var row = [];
	for (var i = 0; i < w; i++) {
	    row.push(0)
	}
	return row;
    },
    changeRuleText: function(e) {
	this.setState({ruleText:e.target.value})
    },
    render: function() {
	var rule = this.props.location.query.rule ? parseInt(this.props.location.query.rule) : _.random(rules);
	console.log('rendering app', rule)
	return (
	    <div>
	    <input ref="rule" value={this.state.ruleText} onChange={this.changeRuleText} />
	    <button onClick={this.setRuleByText}>go</button>
	    <button onClick={this.rrule}>random rule</button>
	    <Toma w={w} scale={1} rule={rule} rrow={this.rrow} h={500} y={0} />
	    </div>
	);
    }
});

import createBrowserHistory from 'history/lib/createBrowserHistory';

render((
	<Router history={createBrowserHistory()}>
    <Route path="/" component={App}>
    </Route>
    <Route path="/tomata/" component={App}>
        </Route>
        </Router>), document.getElementById('root'));




