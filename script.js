// calcs
var _ = require('lodash');

function mod(n, m) {
    return ((n % m) + m) % m;
}

var brew = ["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"]
var brewback = ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"];

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
	var frow = this.props.emptyrow();
	var that = this;	
        return {firstrow: frow, scale: this.props.scale, y:this.props.y};
    },
    componentDidMount: function() {

	this.context = this.refs.canvas.getContext('2d');
	this.paint();
    },
    shouldComponentUpdate: function(pprops, pstate) {
	if (pprops.w !== this.props.w ||
	    pprops.h !== this.props.h ||
	    pprops.rule !== this.props.rule ||
	    pprops.y !== this.props.y ||
	    pprops.secondrow.join('') !== this.props.secondrow.join('') ||
	    pprops.scale !== this.props.scale) {
	    console.log('props changed, updating...')
	    return true;
	}


	if (pstate.firstrow.join() !== this.state.firstrow.join() ||
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

	if (y === 0) {
	    frow[x] = (frow[x] === 1 ? 0 : 1);
	}
	this.setState({firstrow:frow});
	this.props.setSrowBit(x,y);
    },
    getColor: function(row,row2,i) {
	var brewdex = parseInt('' +  row2[mod((i - 1), row2.length)] + row2[(i) % row2.length] + row2[(i+1) % row2.length], 2);
	if (row[i] === 1) {

	    return brew[brewdex];
	}
	else {
	    return brewback[brewdex];
	}
    },
    drawrow: function(row,y,prow) {
	for (var i = 0; i < row.length; i++) {
	    this.context.fillStyle = this.getColor(row,prow,i);
	    this.context.fillRect(i*this.state.scale, y*this.state.scale, this.state.scale, this.state.scale);
	}
    },
    calcnext: function(row1, row2, times, brule) {	
	var next = [];
	times = times || 1;

	/*

*/
	for (var j = 0; j < times; j++) {
	    var key = '' + row1 + row2 + '_' + this.props.rule;

	    if (cache[key]) {
		next =  cache[key];
	    }
	    else {
		for (var i = 0; i < row2.length; i++) {
		    var num = parseInt('' + row2[mod((i - 1), row2.length)] + row2[(i) % row2.length] + row2[(i+1) % row2.length], 2);
		    var np = parseInt(brule[num] || '0')
		    
		    /*		if (i === 1) {
		      console.log('brule', brule, 'i',i, '' + row2[mod((i - 1), row2.length)] + row2[(i) % row2.length] + row2[(i+1) % row2.length], '===', num, brule + '[' + num + ']', np)
		      }*/

		    if (np === 1) {
			next[(i) % row2.length] = (row1[(i) % row2.length] !== 1 ? 1 : 0);
		    }
		    else {
			next[(i) % row2.length] = row1[(i) % row2.length];
		    }

		}
	    }
	    row1 = row2;
	    row2 = next;
	    next = [];
	}

	cache[key] = row2;
	return row2;
    },
    paint: function(cy) {
	console.time('paint');
	var row1 = this.state.firstrow;
	var row2 = this.props.secondrow;
	var brule = this.props.rule.toString(2).split('').reverse().join('');
	for (var y = 0; y < this.props.h; y++) {
//	    this.drawrow(row1,y);
	    this.drawrow(row2,y+1,row1);
	    
	    var trow2 = row2;
	    row2 = this.calcnext(row1, row2,1,brule);
	    row1 = trow2;
	}
	console.timeEnd('paint');
    },
    paintCursor: function(cx, cy) {
	console.log('painting cursor')
	var that = this;
	if (this.context.fillStyle) {
	    console.log('cursor', this.context, cy);

	     for (var j = 0; j < 2; j++) {
		for (var i = -1; i < 9; i++) {
		    var row = (j === 0 ? that.state.firstrow : that.props.secondrow);
		    if (row) {
			that.context.fillStyle=that.getColor(that.props.secondrow, that.state.firstrow, cx + i);
			that.context.fillRect((cx+i)*that.state.scale, (cy+j)*that.state.scale, that.state.scale, that.state.scale);
		    }
		}
	     }

	    
	    this.context.fillStyle = "rgba(0,0,0,0.1)";
	    this.context.fillRect(cx*this.state.scale, cy*this.state.scale, 8*this.state.scale, 2*this.state.scale);
	}

    },
    scaleup: function() {
	this.setState({scale: this.state.scale + 1})
    },
    scaledown: function() {
	this.setState({scale: this.state.scale - 1})
    },
    goup: function() {
	var brule = this.props.rule.toString(2).split('').reverse().join('');
	var next10 = this.calcnext(this.state.firstrow, this.props.secondrow, 20,brule);
	var next11 = this.calcnext(this.state.firstrow, this.props.secondrow, 21,brule);
	this.setState({firstrow: next10})
	this.props.setSrow(next11);
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
	    <button onClick={this.props.clear}>clear</button>
	    
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
	    <Cursor paint={this.paintCursor} setBit={this.setBit} frow={this.state.firstrow} srow={this.props.secondrow} />
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
    componentDidMount: function() {
	this.hashHistory=createHashHistory();
	var rule = this.props.location.query.rule;
	var srow = this.props.location.query.srow
	
	this.nav(rule, (srow ? srow.split('') : undefined));

    },
    routerWillLeave: function(nextLocation) {
        return null;
    },
    nav: function(r,s) {
	r = r || this.props.location.query.rule  || 233;
	var secondrow = (this.props.location.hash && this.props.location.hash.split('?')[0].split('#')[1].split('=')[1]) || 0 ;
	s = (s !== undefined ? s : secondrow);
	this.history.pushState(null, '/tomata/', {rule:r});
        this.hashHistory.push('secondrow=' + s);
    },
    setSrowBit: function(x) {
	console.log('set srow bit', x, this.props.location.hash)
	var secondrow = this.props.location.hash.split('?')[0].split('#')[1].split('=')[1].split('');
	for (var i = 0; i < w; i++) {
	    if (secondrow[i] === undefined) {
		secondrow[i] = '0';
	    }
	    
	    if (i === x) {
		secondrow[i] = parseInt(secondrow[i]) === 1 ? 0 : 1;
	    }
	    else {
		secondrow[i] = parseInt(secondrow[i]) === 1 ? 1 : 0;
	    }
	}

	this.hashHistory.push('secondrow=' + secondrow.join(''));
//	this.forceUpdate();
    },

    setSrow: function(secondrow) {
	this.hashHistory.push('secondrow=' + secondrow.join(''));
    },
    setRuleByText: function(e) {
	this.nav(parseInt(this.state.ruleText));
    },
    rrule: function() {
	var newrule = _.random(rules);
	this.nav(newrule)
    },
    emptyrow:function() {
	var row = [];
	for (var i = 0; i < w; i++) {
	    row.push(0)
	}
	return row;
    },
    clear: function() {
	this.nav(null,0);
    },
    changeRuleText: function(e) {
	this.setState({ruleText:e.target.value})
    },
    render: function() {
	console.log('rendering app', this.props.location);
	
	var rule = parseInt(this.props.location.query.rule);
	var secondrow = this.props.location.hash ? this.props.location.hash.split('?')[0].split('#')[1].split('=')[1].split('') : ['0'];

	for (var i = 0; i < w; i++) {
	    if (secondrow[i] === undefined) {
		secondrow[i] = '0';
	    }
	    
	    secondrow[i] = parseInt(secondrow[i]) === 1 ? 1 : 0;
	}

	
	return (
	    <div>
	    <input ref="rule" value={this.state.ruleText} onChange={this.changeRuleText} />
	    <button onClick={this.setRuleByText}>go</button>
	    <button onClick={this.rrule}>random rule</button>
	    <Toma w={w} scale={1} rule={rule} clear={this.clear} emptyrow={this.emptyrow} h={500} y={0} secondrow={secondrow} setSrow={this.setSrow} setSrowBit={this.setSrowBit} />
	    </div>
	);
    }
});

import createBrowserHistory from 'history/lib/createBrowserHistory';
import createHashHistory from 'history/lib/createHashHistory';

render((
    <Router history={createBrowserHistory()}>
    <Route path="/" component={App}>
    </Route>
    <Route path="/tomata/" component={App}>
    </Route>
    </Router>), document.getElementById('root'));




