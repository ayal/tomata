// calcs
var _ = require('lodash');

var k = 1;
var scale = 3;
var cols = 3;
var rules = Math.pow(2,Math.pow(2,cols));

var w = 200;

// react
require("./style.less");
import React from 'react'
import { render } from 'react-dom'

import { Router, Route, Link, History, Lifecycle } from 'react-router';


const Toma = React.createClass({
    getInitialState: function() {
        return {ruleText:''+this.props.rule,firstrow:this.props.rrow()};
    },
    componentDidMount: function() {
	this.context = this.refs.canvas.getContext('2d');
	this.paint();
    },
    componentWillReceiveProps: function(nprops) {
	this.setState({ruleText:'' + nprops.rule});
    },
    componentDidUpdate: function() {

	this.context = this.refs.canvas.getContext('2d');
	this.context.clearRect(0, 0, this.props.w * this.props.scale, this.props.h * this.props.scale);
	this.paint();
    },
    drawrow: function(row,y) {
	for (var i = 0; i < row.length; i++) {
	    if (row[i] !== 0) {
		this.context.fillStyle="#BBB";
		this.context.fillRect(i*scale, y*scale, scale, scale);
	    }
	}
    },
    calcnext: function(row) {
	var next = [];
	var brule = this.props.rule.toString(2);
	console.log('rule', this.props.rule, 'brule', brule, this.props.rule.toString(2))
	for (var i = 0; i < row.length; i++) {
	    var num = parseInt('' + row[i % row.length] + row[(i+1) % row.length] + row[(i+2) % row.length], 2);
	    var np = parseInt(brule[num] || '0')
	    next[i+1] = np;
	}
	return next;
    },
    paint: function(context) {
	var row = this.state.firstrow;
	this.context.save();
	for (var y = 0; y < this.props.h; y++) {
	    this.drawrow(row,y);
	    row = this.calcnext(row);
	}
	this.context.restore();
    },
    changeRuleText: function(e) {
	this.setState({ruleText:e.target.value})
    },
    setRule: function() {
	this.props.setRule(parseInt(this.refs.rule.value))
    },
    rrule: function() {
	var newrule = _.random(rules);
	this.props.setRule(newrule)
    },
    rrow: function() {
	this.setState({firstrow: this.props.rrow()})
    },
    render: function() {
	return (
	    <div>
	    <div>
	    <input ref="rule" value={this.state.ruleText} onChange={this.changeRuleText} />
	    <button onClick={this.setRule}>go</button>
	    <button onClick={this.rrule}>random rule</button>
	    <button onClick={this.rrow}>random row</button>
	    </div>
	    <div>
	    <canvas ref="canvas" width={this.props.w*this.props.scale} height={this.props.h*this.props.scale} />
	    </div>
	    </div>
		
	)
    }
});

const App = React.createClass({
    mixins: [ Lifecycle, History ],
    routerWillLeave: function(nextLocation) {
        return null;
    },
    setRule: function(r) {
        this.history.pushState(null, '/', {rule:r});
    },
    rrow:function() {
	var row = [];
	for (var i = 0; i < w; i++) {
	    row.push(_.random(k));
	}
	return row;
    },
    render: function() {
	var rule = parseInt(this.props.location.query.rule) || _.random(rules);
	console.log('rendering toma', rule)
	return <Toma w={w} scale={scale} rule={rule} rrow={this.rrow} setRule={this.setRule} h={300} />
    }
});

import createBrowserHistory from 'history/lib/createBrowserHistory';

render((
	<Router history={createBrowserHistory()}>
    <Route path="/" component={App}>
    <Route path="/tomata" component={App}>
        </Route>
        </Router>), document.getElementById('root'));




