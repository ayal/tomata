webpackHotUpdate(0,[
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(161);

	var _reactRouter = __webpack_require__(162);

	var _createBrowserHistory = __webpack_require__(209);

	var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// calcs
	var _ = __webpack_require__(2);

	var k = 1;
	var scale = 5;
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

	console.log('rule', rule, 'row', row);

	// canvas

	// draw

	/**/

	// react
	__webpack_require__(210);

	var Toma = _react2.default.createClass({
				displayName: 'Toma',

				getInitialState: function getInitialState() {
							return { ruleText: '' + this.props.rule, rule: this.props.rule };
				},
				componentDidMount: function componentDidMount() {
							this.context = this.refs.canvas.getContext('2d');
							this.paint();
				},
				componentDidUpdate: function componentDidUpdate() {
							console.log('updated');
							this.context.clearRect(0, 0, this.props.w * this.props.scale, this.props.w * this.props.scale);
							this.paint();
				},
				drawrow: function drawrow(row, y) {
							for (var i = 0; i < row.length; i++) {
										if (row[i] !== 0) {
													this.context.fillRect(i * scale, y * scale, scale, scale);
										}
							}
				},
				paint: function paint(context) {
							this.context.save();
							for (var y = 0; y < w; y++) {
										this.drawrow(row, y);
										row = calcnext(row);
							}
							this.context.restore();
				},
				changeRule: function changeRule(e) {
							this.setState({ ruleText: e.target.value });
				},
				setRule: function setRule() {
							this.context.clearRect(0, 0, this.props.w * this.props.scale, this.props.w * this.props.scale);
							this.setState({ rule: this.refs.rule });
				},
				render: function render() {
							return _react2.default.createElement(
										'div',
										null,
										_react2.default.createElement(
													'div',
													null,
													_react2.default.createElement('input', { ref: 'rule', value: this.state.ruleText, onChange: this.changeRule }),
													_react2.default.createElement(
																'button',
																{ onClick: this.setRule },
																'go'
													)
										),
										_react2.default.createElement(
													'div',
													null,
													_react2.default.createElement('canvas', { ref: 'canvas', width: this.props.w * this.props.scale, height: this.props.w * this.props.scale })
										)
							);
				}
	});

	var App = _react2.default.createClass({
				displayName: 'App',

				mixins: [_reactRouter.Lifecycle, _reactRouter.History],
				routerWillLeave: function routerWillLeave(nextLocation) {
							return null;
				},
				_nav: function _nav(q) {
							this.history.pushState(null, '/', q);
				},
				render: function render() {
							return _react2.default.createElement(Toma, { w: w, scale: scale, rule: rule });
				}
	});

	(0, _reactDom.render)(_react2.default.createElement(
				_reactRouter.Router,
				{ history: (0, _createBrowserHistory2.default)() },
				_react2.default.createElement(_reactRouter.Route, { path: '/', component: App })
	), document.getElementById('root'));

/***/ }
])