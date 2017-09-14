'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queueable = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.default = queueable;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createQueue(fn) {
  var exec = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      var res, next;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              active++;
              _context.next = 3;
              return fn.apply(this, params);

            case 3:
              res = _context.sent;

              active--;

              if (queue.length && active < concurrency) {
                next = queue.shift();

                exec.apply(this, next.params).then(next.resolve).catch(next.reject);
              }

              return _context.abrupt('return', res);

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function exec() {
      return _ref.apply(this, arguments);
    };
  }();

  var concurrency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  var active = 0;
  var queue = [];

  return function handleCall() {
    for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      params[_key2] = arguments[_key2];
    }

    if (active < concurrency) {
      return exec.apply(this, params);
    }
    return new _promise2.default(function (resolve, reject) {
      queue.push({
        resolve: resolve,
        reject: reject,
        params: params
      });
    });
  };
}

function handleDescriptor(target, name, descriptor) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  var fn = descriptor.value;
  if (typeof fn !== 'function') {
    throw new SyntaxError('Only functions can be made queueable');
  }

  var _options = (0, _slicedToArray3.default)(options, 1),
      _options$ = _options[0];

  _options$ = _options$ === undefined ? {} : _options$;
  var _options$$concurrency = _options$.concurrency,
      concurrency = _options$$concurrency === undefined ? 1 : _options$$concurrency;

  var queue = createQueue(fn, concurrency);

  return (0, _extends3.default)({}, descriptor, {
    value: queue
  });
}

function queueable() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  if (typeof args[0] === 'function') {
    return createQueue.apply(this, args);
  }
  return handleDescriptor.apply(undefined, args);
}

exports.queueable = queueable;