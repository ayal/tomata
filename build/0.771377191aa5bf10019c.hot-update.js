webpackHotUpdate(0,[
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(159);

	var _reactRouter = __webpack_require__(160);

	var _createBrowserHistory = __webpack_require__(207);

	var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// calcs
	var _ = __webpack_require__(208);

	var k = 1;
	var scale = 3;
	var cols = 3;
	var rules = Math.pow(2, Math.pow(2, cols));

	var w = 200;

	// react
	__webpack_require__(210);

	var Toma = _react2.default.createClass({
				displayName: 'Toma',

				getInitialState: function getInitialState() {
							return { firstrow: this.props.rrow(), scale: this.props.scale, y: this.props.y };
				},
				componentDidMount: function componentDidMount() {
							this.context = this.refs.canvas.getContext('2d');
							this.paint();
				},
				componentWillReceiveProps: function componentWillReceiveProps(nprops) {
							//	this.setState({ruleText:'' + nprops.rule});
							this.context = this.refs.canvas.getContext('2d');
							this.context.clearRect(0, 0, this.props.w * this.state.scale, this.props.h * this.state.scale);
							this.paint();
				},
				componentDidUpdate: function componentDidUpdate() {
							console.log(this.state, this.props);
							this.context = this.refs.canvas.getContext('2d');
							this.context.clearRect(0, 0, this.props.w * this.state.scale, this.props.h * this.state.scale);
							this.paint();
				},
				drawrow: function drawrow(row, y) {
							for (var i = 0; i < row.length; i++) {
										if (row[i] !== 0) {
													this.context.fillStyle = "#BBB";
													this.context.fillRect(i * this.state.scale, y * this.state.scale, this.state.scale, this.state.scale);
										}
							}
				},
				calcnext: function calcnext(row) {
							var next = [];
							var brule = this.props.rule.toString(2);
							for (var i = 0; i < row.length; i++) {
										var num = parseInt('' + row[i % row.length] + row[(i + 1) % row.length] + row[(i + 2) % row.length], 2);
										var np = parseInt(brule[num] || '0');
										next[i + 1] = np;
							}

							return next;
				},
				paint: function paint(context) {
							console.log('painting');
							var row = this.state.firstrow;
							this.context.save();
							for (var y = 0; y < this.props.h; y++) {
										this.drawrow(row, y);
										row = this.calcnext(row);
							}
							this.context.restore();
				},
				rrow: function rrow() {
							this.setState({ firstrow: this.props.rrow() });
				},
				scaleup: function scaleup() {
							this.setState({ scale: this.state.scale + 1 });
				},
				scaledown: function scaledown() {
							this.setState({ scale: this.state.scale - 1 });
				},
				goup: function goup() {
							this.setState({ firstrow: this.calcnext(this.state.firstrow) });
				},
				render: function render() {
							console.log('rendering', this.props, this.state);
							return _react2.default.createElement(
										'div',
										null,
										_react2.default.createElement(
													'div',
													null,
													_react2.default.createElement(
																'button',
																{ onClick: this.rrow },
																'random row'
													),
													_react2.default.createElement(
																'div',
																null,
																_react2.default.createElement(
																			'button',
																			{ onClick: this.scaleup },
																			'+'
																),
																_react2.default.createElement(
																			'span',
																			null,
																			'scale: ',
																			this.state.scale
																),
																_react2.default.createElement(
																			'button',
																			{ onClick: this.scaledown },
																			'-'
																),
																_react2.default.createElement(
																			'button',
																			{ onClick: this.goup },
																			'scroll'
																)
													)
										),
										_react2.default.createElement(
													'div',
													null,
													_react2.default.createElement('canvas', { ref: 'canvas', width: this.props.w * this.state.scale, height: this.props.h * this.state.scale })
										)
							);
				}
	});

	var App = _react2.default.createClass({
				displayName: 'App',

				mixins: [_reactRouter.Lifecycle, _reactRouter.History],
				getInitialState: function getInitialState() {
							return { ruleText: this.props.location.query.rule };
				},
				routerWillLeave: function routerWillLeave(nextLocation) {
							return null;
				},
				setRule: function setRule(r) {
							console.log(r);
							this.history.pushState(null, '/', { rule: r });
				},
				rrule: function rrule() {
							var newrule = _.random(rules);
							this.setRule(newrule);
				},
				rrow: function rrow() {
							var row = [];
							for (var i = 0; i < w; i++) {
										row.push(_.random(k));
							}
							return row;
				},
				changeRuleText: function changeRuleText(e) {
							this.setState({ ruleText: e.target.value });
				},
				render: function render() {
							var rule = parseInt(this.props.location.query.rule) || _.random(rules);
							console.log('rendering toma', rule);
							return _react2.default.createElement(
										'div',
										null,
										_react2.default.createElement('input', { ref: 'rule', value: this.state.ruleText, onChange: this.changeRuleText }),
										_react2.default.createElement(
													'button',
													{ onClick: this.setRule },
													'go'
										),
										_react2.default.createElement(
													'button',
													{ onClick: this.rrule },
													'random rule'
										),
										_react2.default.createElement(Toma, { w: w, scale: scale, rule: rule, rrow: this.rrow, h: 200, y: 0 })
							);
				}
	});

	(0, _reactDom.render)(_react2.default.createElement(
				_reactRouter.Router,
				{ history: (0, _createBrowserHistory2.default)() },
				_react2.default.createElement(_reactRouter.Route, { path: '/', component: App }),
				_react2.default.createElement(_reactRouter.Route, { path: '/tomata/', component: App })
	), document.getElementById('root'));

/***/ }
])