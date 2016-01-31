// calcs
var _ = require('lodash');

var k = 1;
var cols = 3;
var rules = Math.pow(2,Math.pow(2,cols));

// react
require("./style.less");
import React from 'react'
import { render } from 'react-dom'

import { Router, Route, Link, History, Lifecycle } from 'react-router';


const Toma = React.createClass({
    getInitialState: function() {
        return {firstrow:this.props.rrow(), secondrow: this.props.rrow(), scale: this.props.scale, y:this.props.y};
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
	    pprops.scale !== this.props.scale) {
	    console.log('props changed, updating...')
	    return true;
	}
	else if (pstate.firstrow.join() !== this.state.firstrow.join() ||
	    pstate.secondrow.join() !== this.state.secondrow.join() ||
	    pstate.y !== this.state.y ||
	    pstate.scale !== this.state.scale) {
	    console.log('state changed, updating...')
	    return true;
	}
	else {
	    console.log('not updating...')
	    return false;
	}
    },
    componentDidUpdate: function() {

	this.context = this.refs.canvas.getContext('2d');
	this.context.clearRect(0, 0, this.props.w * this.state.scale, this.props.h * this.state.scale);
	this.paint();
    },
    drawrow: function(row,y) {
	for (var i = 0; i < row.length; i++) {
	    if (row[i] === 1) {
		this.context.fillStyle="pink";
		this.context.fillRect(i*this.state.scale, y*this.state.scale, this.state.scale, this.state.scale);
	    }
	}
    },
    calcnext: function(row1, row2, times) {
	var next = [];
	times = times || 1;
	var brule = this.props.rule.toString(2).split('').reverse().join('');
	for (var j = 0; j < times; j++) {
	    for (var i = 0; i < row2.length; i++) {
		var num = parseInt('' + row2[i % row2.length] + row2[(i+1) % row2.length] + row2[(i+2) % row2.length], 2);
		var np = parseInt(brule[num] || '0')
		if (np === 1) {
		    next[i+1] = (row1[i+1] === 0 ? 1 : 0);
		}
		else {
		    next[i+1] = row1[i+1];
		}

	    }
	    row2 = next;
	    
	    next = [];
	}

	return row2;
    },
    paint: function(context) {
	
	var row1 = this.state.firstrow;
	var row2 = this.state.secondrow;
	
	this.context.save();
	for (var y = 0; y < this.props.h; y++) {
	    this.drawrow(row1,y);
	    this.drawrow(row2,y+1);
	    var trow2 = row2;
	    row2 = this.calcnext(row1, row2);

	    row1 = trow2;
	}
	this.context.restore();
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
	    
	    </div>
		
	)
    }
});

var w = 600;

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
	var seed = _.random(100);
	for (var i = 0; i < w; i++) {
		row.push(_.random(seed));
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




