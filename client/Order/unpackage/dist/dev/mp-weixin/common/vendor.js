(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],[
/* 0 */,
/* 1 */
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({
  __proto__: null });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin']['options']) {
      Object.assign(options, vueOptions['mp-weixin']['options']);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),
/* 2 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  // fixed by xxxxxx (nvue vuex)
  /* eslint-disable no-undef */
  if(typeof SharedObject !== 'undefined'){
    this.id = SharedObject.uid++;
  } else {
    this.id = uid++;
  }
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i++, i)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    /* eslint-disable no-undef */
    var app = getApp();
    if (app && app.onError) {
      app.onError(err);
    } else {
      console.error(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!***************************************************!*\
  !*** D:/WorkSpace/orders/client/Order/pages.json ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 5 */
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),
/* 6 */
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@alpha","_id":"@dcloudio/uni-stat@2.0.0-alpha-25120200103005","_inBundle":false,"_integrity":"sha512-nYoIrRV2e5o/vzr6foSdWi3Rl2p0GuO+LPY3JctyY6uTKgPnuH99d7aL/QQdJ1SacQjBWO+QGK1qankN7oyrWw==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@alpha","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"alpha","saveSpec":null,"fetchSpec":"alpha"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-alpha-25120200103005.tgz","_shasum":"a77a63481f36474f3e86686868051219d1bb12df","_spec":"@dcloudio/uni-stat@alpha","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"6be187a3dfe15f95dd6146d9fec08e1f81100987","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-alpha-25120200103005"};

/***/ }),
/* 7 */
/*!********************************************************************!*\
  !*** D:/WorkSpace/orders/client/Order/pages.json?{"type":"style"} ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/main/main": { "navigationBarTitleText": "任务中心", "enablePullDownRefresh": true }, "pages/login/login": { "navigationBarTitleText": "登录" }, "pages/user/user": { "navigationBarTitleText": "我的" }, "pages/detail/detail": { "navigationBarTitleText": "任务详情" }, "pages/withdraw/withdraw": { "navigationBarTitleText": "提现" }, "pages/newtask/newtask": { "navigationBarTitleText": "发布任务" }, "pages/withdraw/success": {}, "pages/postadmin/postadmin": { "enablePullDownRefresh": true, "navigationBarTitleText": "发布管理" }, "pages/children/children": { "navigationBarTitleText": "我的下级用户" } }, "globalStyle": { "navigationBarTextStyle": "white", "navigationBarBackgroundColor": "#0faeff", "backgroundColor": "#fbf9fe" } };exports.default = _default;

/***/ }),
/* 8 */
/*!*******************************************************************!*\
  !*** D:/WorkSpace/orders/client/Order/pages.json?{"type":"stat"} ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__9098950" };exports.default = _default;

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    options.components = Object.assign(components, options.components || {})
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 15 */
/*!*************************************************!*\
  !*** D:/WorkSpace/orders/client/Order/utils.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _index = _interopRequireDefault(__webpack_require__(/*! ./store/index */ 16));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}var _default =

{
  baseUrl: "http://localhost:5000",

  getUrl: function getUrl() {var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    if (url[0] != '/') return this.baseUrl + '/' + url;else
    return this.baseUrl + url;
  },

  request: function request(url, data, method) {var _this = this;
    return new Promise(function (resolve, reject) {
      uni.request({
        url: _this.getUrl(url),
        method: method,
        data: _objectSpread({},
        data, {
          mysession: _index.default.state.sessionKey }),

        success: function success(res) {
          if (res.statusCode >= 400) reject(res);
          if (res.data.status === false) reject(res);
          if (!!res.data.message)
          uni.showToast({
            icon: 'none',
            title: res.data.message });

          resolve(res.data);
        },
        fail: function fail(err) {
          console.log(err);
          reject(err);
        } });

    });
  },

  post: function post(url, data) {
    return this.request(url, data, 'POST');
  },
  get: function get(url, data) {
    return this.request(url, data, 'GET');
  },


  showLoading: function showLoading() {
    uni.showLoading({
      title: '拉取数据中',
      mask: true });

  },

  hideLoading: function hideLoading() {
    uni.hideLoading();
  },

  showErr: function showErr() {var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '拉取信息失败';
    uni.showToast({
      title: msg,
      icon: 'none' });

  } };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),
/* 16 */
/*!*******************************************************!*\
  !*** D:/WorkSpace/orders/client/Order/store/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 17));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

_vue.default.use(_vuex.default);

var store = new _vuex.default.Store({
  state: {
    /**
            * 是否需要强制登录
            */
    forcedLogin: false,
    hasLogin: true,
    userName: "正在获取",
    admin: false,
    sessionKey: uni.getStorageSync("session") },

  mutations: {
    login: function login(state, _ref)



    {var phoneNum = _ref.phoneNum,sessionKey = _ref.sessionKey,admin = _ref.admin;
      state.userName = phoneNum || '新用户';
      state.sessionKey = sessionKey;
      state.hasLogin = true;
      state.admin = admin;
      uni.setStorageSync("session", sessionKey);
    },
    logout: function logout(state) {
      state.userName = "";
      state.sessionKey = null;
      state.hasLogin = false;
      uni.clearStorageSync("session");
    } } });var _default =



store;exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),
/* 17 */
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),
/* 18 */
/*!*************************************************!*\
  !*** D:/WorkSpace/orders/client/Order/uni.scss ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ 26);


/***/ }),
/* 26 */
/*!************************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime-module.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(/*! ./runtime */ 27);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),
/* 27 */
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);


/***/ }),
/* 28 */
/*!**********************************************************!*\
  !*** D:/WorkSpace/orders/client/Order/vendor/filters.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.toMoney = toMoney;function toMoney(value) {
  if (typeof value == 'number') {
    return "\uFFE5".concat(value.toFixed(2));
  } else {
    return "￥0.00";
  }
}

/***/ }),
/* 29 */
/*!*****************************************************!*\
  !*** D:/WorkSpace/orders/client/Order/api/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.sendSms = sendSms;exports.login = login;exports.newTask = newTask;exports.reNewTask = reNewTask;exports.getPostTasks = getPostTasks;exports.getTasksByUser = getTasksByUser;exports.getcash = getcash;exports.receiveTask = receiveTask;exports.pay = pay;exports.wxlogin = wxlogin;exports.cancelTask = cancelTask;exports.getAvailableMoney = getAvailableMoney;exports.getTasks = getTasks;exports.getTaskByID = getTaskByID;exports.getCosCred = getCosCred;var _utils = _interopRequireDefault(__webpack_require__(/*! @/utils.js */ 15));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var get = _utils.default.get.bind(_utils.default);
var post = _utils.default.post.bind(_utils.default);

function sendSms(phonenumber) {
  return post("/sendsms", {
    phonenumber: phonenumber });

}

function login(phonenumber, code, uplevel) {var admin = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  return post("/login", {
    phonenumber: phonenumber,
    code: code,
    uplevel: uplevel,
    admin: admin });

}

function newTask(title, content, fee) {
  return post("/task/putTask", {
    title: title,
    content: content,
    fee: fee,
    "new": true });

}


function reNewTask(taskid) {
  return post("/task/putTask", {
    taskid: taskid,
    "new": false });

}


function getPostTasks() {var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return post("/task/getSendTasks", {
    type: type,
    page: page,
    size: size });

}


function getTasksByUser(username) {var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  return post("/getUserTask", {
    username: username,
    page: page,
    size: size });

}


function getcash(fee) {
  return post("/getcash", {
    fee: fee });

}

function receiveTask(taskid) {
  return post("/receiveTask", {
    taskid: taskid });

}

function pay(taskid) {
  return post("/payTask", {
    taskid: taskid });

}

function wxlogin(enc, iv, code) {
  return post("/wxlogin", {
    "encrypted_data": enc,
    iv: iv,
    code: code });

}

function cancelTask(taskid) {
  return post("/cancelTask", {
    taskid: taskid });

}


function getAvailableMoney() {
  return post("/getBalance");
}



function getTasks() {var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  return post("/getUserTask", {
    selectuser: false,
    username: "",
    page: page,
    size: size });

}


function getTaskByID(taskid) {
  return post("/task/getTaskById", {
    taskid: taskid });

}


function getCosCred(bucket, region) {
  return post("/get_cos_credentials", {
    bucket: bucket,
    region: region });

}

/***/ }),
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */
/*!***************************************************!*\
  !*** D:/WorkSpace/orders/client/Order/service.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; // 管理账号信息
var USERS_KEY = 'USERS_KEY';
var STATE_KEY = 'STATE_KEY';

var getUsers = function getUsers() {
  var ret = '';
  ret = uni.getStorageSync(USERS_KEY);
  if (!ret) {
    ret = '[]';
  }
  return JSON.parse(ret);
};

var addUser = function addUser(userInfo) {
  var users = getUsers();
  users.push({
    account: userInfo.account,
    password: userInfo.password });

  uni.setStorageSync(USERS_KEY, JSON.stringify(users));
};var _default =

{
  getUsers: getUsers,
  addUser: addUser };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */
/*!***************************************************!*\
  !*** D:/WorkSpace/orders/client/Order/lib/cos.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}(function webpackUniversalModuleDefinition(root, factory) {
  if (true)
  module.exports = factory();else
  {}
})(void 0, function () {
  return (/******/function (modules) {// webpackBootstrap
      /******/ // The module cache
      /******/var installedModules = {};
      /******/
      /******/ // The require function
      /******/function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/if (installedModules[moduleId]) {
          /******/return installedModules[moduleId].exports;
          /******/}
        /******/ // Create a new module (and put it into the cache)
        /******/var module = installedModules[moduleId] = {
          /******/i: moduleId,
          /******/l: false,
          /******/exports: {}
          /******/ };
        /******/
        /******/ // Execute the module function
        /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ // Flag the module as loaded
        /******/module.l = true;
        /******/
        /******/ // Return the exports of the module
        /******/return module.exports;
        /******/}
      /******/
      /******/
      /******/ // expose the modules object (__webpack_modules__)
      /******/__webpack_require__.m = modules;
      /******/
      /******/ // expose the module cache
      /******/__webpack_require__.c = installedModules;
      /******/
      /******/ // identity function for calling harmony imports with the correct context
      /******/__webpack_require__.i = function (value) {return value;};
      /******/
      /******/ // define getter function for harmony exports
      /******/__webpack_require__.d = function (exports, name, getter) {
        /******/if (!__webpack_require__.o(exports, name)) {
          /******/Object.defineProperty(exports, name, {
            /******/configurable: false,
            /******/enumerable: true,
            /******/get: getter
            /******/ });
          /******/}
        /******/};
      /******/
      /******/ // getDefaultExport function for compatibility with non-harmony modules
      /******/__webpack_require__.n = function (module) {
        /******/var getter = module && module.__esModule ?
        /******/function getDefault() {return module['default'];} :
        /******/function getModuleExports() {return module;};
        /******/__webpack_require__.d(getter, 'a', getter);
        /******/return getter;
        /******/};
      /******/
      /******/ // Object.prototype.hasOwnProperty.call
      /******/__webpack_require__.o = function (object, property) {return Object.prototype.hasOwnProperty.call(object, property);};
      /******/
      /******/ // __webpack_public_path__
      /******/__webpack_require__.p = "D:\\code\\cos-wx-sdk-v5\\demo\\lib";
      /******/
      /******/ // Load entry module and return exports
      /******/return __webpack_require__(__webpack_require__.s = 5);
      /******/}(
    /************************************************************************/
    /******/[
    /* 0 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";


      var md5 = __webpack_require__(8);
      var CryptoJS = __webpack_require__(6);
      var xml2json = __webpack_require__(10);
      var json2xml = __webpack_require__(7);
      var base64 = __webpack_require__(1);

      function camSafeUrlEncode(str) {
        return encodeURIComponent(str).
        replace(/!/g, '%21').
        replace(/'/g, '%27').
        replace(/\(/g, '%28').
        replace(/\)/g, '%29').
        replace(/\*/g, '%2A');
      }

      //测试用的key后面可以去掉
      var getAuth = function getAuth(opt) {
        opt = opt || {};

        var SecretId = opt.SecretId;
        var SecretKey = opt.SecretKey;
        var KeyTime = opt.KeyTime;
        var method = (opt.method || opt.Method || 'get').toLowerCase();
        var queryParams = clone(opt.Query || opt.params || {});
        var headers = clone(opt.Headers || opt.headers || {});
        var pathname = opt.Pathname || '/' + (opt.Key || '');

        if (!SecretId) return console.error('missing param SecretId');
        if (!SecretKey) return console.error('missing param SecretKey');

        var getObjectKeys = function getObjectKeys(obj) {
          var list = [];
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              list.push(key);
            }
          }
          return list.sort(function (a, b) {
            a = a.toLowerCase();
            b = b.toLowerCase();
            return a === b ? 0 : a > b ? 1 : -1;
          });
        };

        var obj2str = function obj2str(obj) {
          var i, key, val;
          var list = [];
          var keyList = getObjectKeys(obj);
          for (i = 0; i < keyList.length; i++) {
            key = keyList[i];
            val = obj[key] === undefined || obj[key] === null ? '' : '' + obj[key];
            key = key.toLowerCase();
            key = camSafeUrlEncode(key);
            val = camSafeUrlEncode(val) || '';
            list.push(key + '=' + val);
          }
          return list.join('&');
        };

        // 签名有效起止时间
        var now = Math.round(getSkewTime(opt.SystemClockOffset) / 1000) - 1;
        var exp = now;

        var Expires = opt.Expires || opt.expires;
        if (Expires === undefined) {
          exp += 900; // 签名过期时间为当前 + 900s
        } else {
          exp += Expires * 1 || 0;
        }

        // 要用到的 Authorization 参数列表
        var qSignAlgorithm = 'sha1';
        var qAk = SecretId;
        var qSignTime = KeyTime || now + ';' + exp;
        var qKeyTime = KeyTime || now + ';' + exp;
        var qHeaderList = getObjectKeys(headers).join(';').toLowerCase();
        var qUrlParamList = getObjectKeys(queryParams).join(';').toLowerCase();

        // 签名算法说明文档：https://www.qcloud.com/document/product/436/7778
        // 步骤一：计算 SignKey
        var signKey = CryptoJS.HmacSHA1(qKeyTime, SecretKey).toString();

        // 步骤二：构成 FormatString
        var formatString = [method, pathname, obj2str(queryParams), obj2str(headers), ''].join('\n');

        // 步骤三：计算 StringToSign
        var stringToSign = ['sha1', qSignTime, CryptoJS.SHA1(formatString).toString(), ''].join('\n');

        // 步骤四：计算 Signature
        var qSignature = CryptoJS.HmacSHA1(stringToSign, signKey).toString();

        // 步骤五：构造 Authorization
        var authorization = [
        'q-sign-algorithm=' + qSignAlgorithm,
        'q-ak=' + qAk,
        'q-sign-time=' + qSignTime,
        'q-key-time=' + qKeyTime,
        'q-header-list=' + qHeaderList,
        'q-url-param-list=' + qUrlParamList,
        'q-signature=' + qSignature].
        join('&');

        return authorization;

      };

      var noop = function noop() {

      };

      // 清除对象里值为的 undefined 或 null 的属性
      var clearKey = function clearKey(obj) {
        var retObj = {};
        for (var key in obj) {
          if (obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null) {
            retObj[key] = obj[key];
          }
        }
        return retObj;
      };

      var readAsBinaryString = function readAsBinaryString(blob, callback) {
        var readFun;
        var fr = new FileReader();
        if (FileReader.prototype.readAsBinaryString) {
          readFun = FileReader.prototype.readAsBinaryString;
          fr.onload = function () {
            callback(this.result);
          };
        } else if (FileReader.prototype.readAsArrayBuffer) {// 在 ie11 添加 readAsBinaryString 兼容
          readFun = function readFun(fileData) {
            var binary = "";
            var pt = this;
            var reader = new FileReader();
            reader.onload = function (e) {
              var bytes = new Uint8Array(reader.result);
              var length = bytes.byteLength;
              for (var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              callback(binary);
            };
            reader.readAsArrayBuffer(fileData);
          };
        } else {
          console.error('FileReader not support readAsBinaryString');
        }
        readFun.call(fr, blob);
      };

      // 获取文件 md5 值
      var getFileMd5 = function getFileMd5(blob, callback) {
        readAsBinaryString(blob, function (content) {
          var hash = md5(content, true);
          callback(null, hash);
        });
      };

      function clone(obj) {
        return map(obj, function (v) {
          return typeof v === 'object' ? clone(v) : v;
        });
      }

      function extend(target, source) {
        each(source, function (val, key) {
          target[key] = source[key];
        });
        return target;
      }

      function isArray(arr) {
        return arr instanceof Array;
      }

      function isInArray(arr, item) {
        var flag = false;
        for (var i = 0; i < arr.length; i++) {
          if (item === arr[i]) {
            flag = true;
            break;
          }
        }
        return flag;
      }

      function makeArray(arr) {
        return isArray(arr) ? arr : [arr];
      }

      function each(obj, fn) {
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            fn(obj[i], i);
          }
        }
      }

      function map(obj, fn) {
        var o = isArray(obj) ? [] : {};
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            o[i] = fn(obj[i], i);
          }
        }
        return o;
      }

      function filter(obj, fn) {
        var iaArr = isArray(obj);
        var o = iaArr ? [] : {};
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            if (fn(obj[i], i)) {
              if (iaArr) {
                o.push(obj[i]);
              } else {
                o[i] = obj[i];
              }
            }
          }
        }
        return o;
      }

      var binaryBase64 = function binaryBase64(str) {
        var i,len,char,res = '';
        for (i = 0, len = str.length / 2; i < len; i++) {
          char = parseInt(str[i * 2] + str[i * 2 + 1], 16);
          res += String.fromCharCode(char);
        }
        return base64.btoa(res);
      };
      var uuid = function uuid() {
        var S4 = function S4() {
          return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
        };
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
      };

      var hasMissingParams = function hasMissingParams(apiName, params) {
        var Bucket = params.Bucket;
        var Region = params.Region;
        var Key = params.Key;
        if (apiName.indexOf('Bucket') > -1 || apiName === 'deleteMultipleObject' || apiName === 'multipartList' || apiName === 'listObjectVersions') {
          if (!Bucket) return 'Bucket';
          if (!Region) return 'Region';
        } else if (apiName.indexOf('Object') > -1 || apiName.indexOf('multipart') > -1 || apiName === 'sliceUploadFile' || apiName === 'abortUploadTask') {
          if (!Bucket) return 'Bucket';
          if (!Region) return 'Region';
          if (!Key) return 'Key';
        }
        return false;
      };

      var formatParams = function formatParams(apiName, params) {

        // 复制参数对象
        params = extend({}, params);

        // 统一处理 Headers
        if (apiName !== 'getAuth' && apiName !== 'getV4Auth' && apiName !== 'getObjectUrl') {
          var Headers = params.Headers || {};
          if (params && typeof params === 'object') {
            (function () {
              for (var key in params) {
                if (params.hasOwnProperty(key) && key.indexOf('x-cos-') > -1) {
                  Headers[key] = params[key];
                }
              }
            })();

            var headerMap = {
              // params headers
              'x-cos-mfa': 'MFA',
              'Content-MD5': 'ContentMD5',
              'Content-Length': 'ContentLength',
              'Content-Type': 'ContentType',
              'Expect': 'Expect',
              'Expires': 'Expires',
              'Cache-Control': 'CacheControl',
              'Content-Disposition': 'ContentDisposition',
              'Content-Encoding': 'ContentEncoding',
              'Range': 'Range',
              'If-Modified-Since': 'IfModifiedSince',
              'If-Unmodified-Since': 'IfUnmodifiedSince',
              'If-Match': 'IfMatch',
              'If-None-Match': 'IfNoneMatch',
              'x-cos-copy-source': 'CopySource',
              'x-cos-copy-source-Range': 'CopySourceRange',
              'x-cos-metadata-directive': 'MetadataDirective',
              'x-cos-copy-source-If-Modified-Since': 'CopySourceIfModifiedSince',
              'x-cos-copy-source-If-Unmodified-Since': 'CopySourceIfUnmodifiedSince',
              'x-cos-copy-source-If-Match': 'CopySourceIfMatch',
              'x-cos-copy-source-If-None-Match': 'CopySourceIfNoneMatch',
              'x-cos-acl': 'ACL',
              'x-cos-grant-read': 'GrantRead',
              'x-cos-grant-write': 'GrantWrite',
              'x-cos-grant-full-control': 'GrantFullControl',
              'x-cos-grant-read-acp': 'GrantReadAcp',
              'x-cos-grant-write-acp': 'GrantWriteAcp',
              'x-cos-storage-class': 'StorageClass',
              // SSE-C
              'x-cos-server-side-encryption-customer-algorithm': 'SSECustomerAlgorithm',
              'x-cos-server-side-encryption-customer-key': 'SSECustomerKey',
              'x-cos-server-side-encryption-customer-key-MD5': 'SSECustomerKeyMD5',
              // SSE-COS、SSE-KMS
              'x-cos-server-side-encryption': 'ServerSideEncryption',
              'x-cos-server-side-encryption-cos-kms-key-id': 'SSEKMSKeyId',
              'x-cos-server-side-encryption-context': 'SSEContext' };

            util.each(headerMap, function (paramKey, headerKey) {
              if (params[paramKey] !== undefined) {
                Headers[headerKey] = params[paramKey];
              }
            });

            params.Headers = clearKey(Headers);
          }
        }

        return params;
      };

      var apiWrapper = function apiWrapper(apiName, apiFn) {
        return function (params, callback) {

          // 处理参数
          if (typeof params === 'function') {
            callback = params;
            params = {};
          }

          // 整理参数格式
          params = formatParams(apiName, params);

          // 代理回调函数
          var formatResult = function formatResult(result) {
            if (result && result.headers) {
              result.headers['x-cos-version-id'] && (result.VersionId = result.headers['x-cos-version-id']);
              result.headers['x-cos-delete-marker'] && (result.DeleteMarker = result.headers['x-cos-delete-marker']);
            }
            return result;
          };
          var _callback = function _callback(err, data) {
            callback && callback(formatResult(err), formatResult(data));
          };

          if (apiName !== 'getService' && apiName !== 'abortUploadTask') {
            // 判断参数是否完整
            var missingResult;
            if (missingResult = hasMissingParams(apiName, params)) {
              _callback({ error: 'missing param ' + missingResult });
              return;
            }
            // 判断 region 格式
            if (params.Region) {
              if (params.Region.indexOf('cos.') > -1) {
                _callback({ error: 'param Region should not be start with "cos."' });
                return;
              } else if (!/^([a-z\d-]+)$/.test(params.Region)) {
                _callback({ error: 'Region format error.' });
                return;
              }
              // 判断 region 格式
              if (!this.options.CompatibilityMode && params.Region.indexOf('-') === -1 && params.Region !== 'yfb' && params.Region !== 'default') {
                console.warn('warning: param Region format error, find help here: https://cloud.tencent.com/document/product/436/6224');
              }
            }
            // 兼容不带 AppId 的 Bucket
            if (params.Bucket) {
              if (!/^([a-z\d-]+)-(\d+)$/.test(params.Bucket)) {
                if (params.AppId) {
                  params.Bucket = params.Bucket + '-' + params.AppId;
                } else if (this.options.AppId) {
                  params.Bucket = params.Bucket + '-' + this.options.AppId;
                } else {
                  _callback({ error: 'Bucket should format as "test-1250000000".' });
                  return;
                }
              }
              if (params.AppId) {
                console.warn('warning: AppId has been deprecated, Please put it at the end of parameter Bucket(E.g Bucket:"test-1250000000" ).');
                delete params.AppId;
              }
            }
          }
          var res = apiFn.call(this, params, _callback);
          if (apiName === 'getAuth' || apiName === 'getObjectUrl') {
            return res;
          }
        };
      };

      var throttleOnProgress = function throttleOnProgress(total, onProgress) {

        if (!onProgress || typeof onProgress !== 'function') return noop;
        var self = this;
        var size0 = 0;
        var size1 = 0;
        var time0 = Date.now();
        var time1;
        var timer;

        function update() {
          clearTimeout(timer);
          timer = 0;
          time1 = Date.now();
          var speed = Math.max(0, Math.round((size1 - size0) / ((time1 - time0) / 1000) * 100) / 100);
          var percent;
          if (size1 === 0 && total === 0) {
            percent = 1;
          } else {
            percent = Math.round(size1 / total * 100) / 100 || 0;
          }
          time0 = time1;
          size0 = size1;
          try {
            onProgress({ loaded: size1, total: total, speed: speed, percent: percent });
          } catch (e) {
          }
        }

        return function (info, immediately) {
          if (info) {
            size1 = info.loaded;
            total = info.total;
          }
          if (Date.now() - time0 > self.options.ProgressInterval || immediately) {
            update();
          } else {
            if (timer) return;
            timer = setTimeout(update, self.options.ProgressInterval);
          }
        };
      };

      var getFileSize = function getFileSize(api, params, callback) {
        var size;
        if (typeof params.Body === 'string') {
          params.Body = new Blob([params.Body], { type: 'text/plain' });
        }
        if (params.Body && (params.Body instanceof Blob || params.Body.toString() === '[object File]' || params.Body.toString() === '[object Blob]')) {
          size = params.Body.size;
        } else {
          callback({ error: 'params body format error, Only allow File|Blob|String.' });
          return;
        }
        params.ContentLength = size;
        callback(null, size);
      };

      var getSkewTime = function getSkewTime(offset) {
        return Date.now() + (offset || 0);
      };

      var util = {
        noop: noop,
        formatParams: formatParams,
        apiWrapper: apiWrapper,
        xml2json: xml2json,
        json2xml: json2xml,
        md5: md5,
        clearKey: clearKey,
        getFileMd5: getFileMd5,
        binaryBase64: binaryBase64,
        extend: extend,
        isArray: isArray,
        isInArray: isInArray,
        makeArray: makeArray,
        each: each,
        map: map,
        filter: filter,
        clone: clone,
        uuid: uuid,
        camSafeUrlEncode: camSafeUrlEncode,
        throttleOnProgress: throttleOnProgress,
        getFileSize: getFileSize,
        getSkewTime: getSkewTime,
        getAuth: getAuth,
        isBrowser: true };


      util.fileSlice = function (file, start, end) {
        if (file.slice) {
          return file.slice(start, end);
        } else if (file.mozSlice) {
          return file.mozSlice(start, end);
        } else if (file.webkitSlice) {
          return file.webkitSlice(start, end);
        }
      };
      util.getFileUUID = function (file, ChunkSize) {
        // 如果信息不完整，不获取
        if (file.name && file.size && file.lastModifiedDate && ChunkSize) {
          return util.md5([file.name, file.size, file.lastModifiedDate, ChunkSize].join('::'));
        } else {
          return null;
        }
      };
      util.getBodyMd5 = function (UploadCheckContentMd5, Body, callback) {
        callback = callback || noop;
        if (UploadCheckContentMd5) {
          if (typeof Body === 'string') {
            callback(util.md5(Body, true));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };

      module.exports = util;


      /***/},
    /* 1 */
    /***/function (module, exports) {

      /*
                                      * $Id: base64.js,v 2.15 2014/04/05 12:58:57 dankogai Exp dankogai $
                                      *
                                      *  Licensed under the BSD 3-Clause License.
                                      *    http://opensource.org/licenses/BSD-3-Clause
                                      *
                                      *  References:
                                      *    http://en.wikipedia.org/wiki/Base64
                                      */

      var Base64 = function (global) {
        global = global || {};
        'use strict';
        // existing version for noConflict()
        var _Base64 = global.Base64;
        var version = "2.1.9";
        // if node.js, we use Buffer
        var buffer;
        // constants
        var b64chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var b64tab = function (bin) {
          var t = {};
          for (var i = 0, l = bin.length; i < l; i++) {t[bin.charAt(i)] = i;}
          return t;
        }(b64chars);
        var fromCharCode = String.fromCharCode;
        // encoder stuff
        var cb_utob = function cb_utob(c) {
          if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c :
            cc < 0x800 ? fromCharCode(0xc0 | cc >>> 6) +
            fromCharCode(0x80 | cc & 0x3f) :
            fromCharCode(0xe0 | cc >>> 12 & 0x0f) +
            fromCharCode(0x80 | cc >>> 6 & 0x3f) +
            fromCharCode(0x80 | cc & 0x3f);
          } else {
            var cc = 0x10000 +
            (c.charCodeAt(0) - 0xD800) * 0x400 + (
            c.charCodeAt(1) - 0xDC00);
            return fromCharCode(0xf0 | cc >>> 18 & 0x07) +
            fromCharCode(0x80 | cc >>> 12 & 0x3f) +
            fromCharCode(0x80 | cc >>> 6 & 0x3f) +
            fromCharCode(0x80 | cc & 0x3f);
          }
        };
        var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
        var utob = function utob(u) {
          return u.replace(re_utob, cb_utob);
        };
        var cb_encode = function cb_encode(ccc) {
          var padlen = [0, 2, 1][ccc.length % 3],
          ord = ccc.charCodeAt(0) << 16 |
          (ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8 | (
          ccc.length > 2 ? ccc.charCodeAt(2) : 0),
          chars = [
          b64chars.charAt(ord >>> 18),
          b64chars.charAt(ord >>> 12 & 63),
          padlen >= 2 ? '=' : b64chars.charAt(ord >>> 6 & 63),
          padlen >= 1 ? '=' : b64chars.charAt(ord & 63)];

          return chars.join('');
        };
        var btoa = global.btoa ? function (b) {
          return global.btoa(b);
        } : function (b) {
          return b.replace(/[\s\S]{1,3}/g, cb_encode);
        };
        var _encode = buffer ? function (u) {
          return (u.constructor === buffer.constructor ? u : new buffer(u)).
          toString('base64');
        } :
        function (u) {return btoa(utob(u));};

        var encode = function encode(u, urisafe) {
          return !urisafe ?
          _encode(String(u)) :
          _encode(String(u)).replace(/[+\/]/g, function (m0) {
            return m0 == '+' ? '-' : '_';
          }).replace(/=/g, '');
        };
        var encodeURI = function encodeURI(u) {return encode(u, true);};
        // decoder stuff
        var re_btou = new RegExp([
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}'].
        join('|'), 'g');
        var cb_btou = function cb_btou(cccc) {
          switch (cccc.length) {
            case 4:
              var cp = (0x07 & cccc.charCodeAt(0)) << 18 |
              (0x3f & cccc.charCodeAt(1)) << 12 |
              (0x3f & cccc.charCodeAt(2)) << 6 |
              0x3f & cccc.charCodeAt(3),
              offset = cp - 0x10000;
              return fromCharCode((offset >>> 10) + 0xD800) +
              fromCharCode((offset & 0x3FF) + 0xDC00);
            case 3:
              return fromCharCode(
              (0x0f & cccc.charCodeAt(0)) << 12 |
              (0x3f & cccc.charCodeAt(1)) << 6 |
              0x3f & cccc.charCodeAt(2));

            default:
              return fromCharCode(
              (0x1f & cccc.charCodeAt(0)) << 6 |
              0x3f & cccc.charCodeAt(1));}


        };
        var btou = function btou(b) {
          return b.replace(re_btou, cb_btou);
        };
        var cb_decode = function cb_decode(cccc) {
          var len = cccc.length,
          padlen = len % 4,
          n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) | (
          len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) | (
          len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) | (
          len > 3 ? b64tab[cccc.charAt(3)] : 0),
          chars = [
          fromCharCode(n >>> 16),
          fromCharCode(n >>> 8 & 0xff),
          fromCharCode(n & 0xff)];

          chars.length -= [0, 0, 2, 1][padlen];
          return chars.join('');
        };
        var atob = global.atob ? function (a) {
          return global.atob(a);
        } : function (a) {
          return a.replace(/[\s\S]{1,4}/g, cb_decode);
        };
        var _decode = buffer ? function (a) {
          return (a.constructor === buffer.constructor ?
          a : new buffer(a, 'base64')).toString();
        } :
        function (a) {return btou(atob(a));};
        var decode = function decode(a) {
          return _decode(
          String(a).replace(/[-_]/g, function (m0) {return m0 == '-' ? '+' : '/';}).
          replace(/[^A-Za-z0-9\+\/]/g, ''));

        };
        var noConflict = function noConflict() {
          var Base64 = global.Base64;
          global.Base64 = _Base64;
          return Base64;
        };
        // export Base64
        var Base64 = {
          VERSION: version,
          atob: atob,
          btoa: btoa,
          fromBase64: decode,
          toBase64: encode,
          utob: utob,
          encode: encode,
          encodeURI: encodeURI,
          btou: btou,
          decode: decode,
          noConflict: noConflict };

        return Base64;
      }();

      module.exports = Base64;



      /***/},
    /* 2 */
    /***/function (module, exports) {

      /*
                                      * DOM Level 2
                                      * Object DOMException
                                      * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
                                      * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
                                      */

      function copy(src, dest) {
        for (var p in src) {
          dest[p] = src[p];
        }
      }
      /**
        ^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
        ^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
         */
      function _extends(Class, Super) {
        var pt = Class.prototype;
        if (Object.create) {
          var ppt = Object.create(Super.prototype);
          pt.__proto__ = ppt;
        }
        if (!(pt instanceof Super)) {var
          t = function t() {};;
          t.prototype = Super.prototype;
          t = new t();
          copy(pt, t);
          Class.prototype = pt = t;
        }
        if (pt.constructor != Class) {
          if (typeof Class != 'function') {
            console.error("unknow Class:" + Class);
          }
          pt.constructor = Class;
        }
      }
      var htmlns = 'http://www.w3.org/1999/xhtml';
      // Node Types
      var NodeType = {};
      var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1;
      var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2;
      var TEXT_NODE = NodeType.TEXT_NODE = 3;
      var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4;
      var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5;
      var ENTITY_NODE = NodeType.ENTITY_NODE = 6;
      var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
      var COMMENT_NODE = NodeType.COMMENT_NODE = 8;
      var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9;
      var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10;
      var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11;
      var NOTATION_NODE = NodeType.NOTATION_NODE = 12;

      // ExceptionCode
      var ExceptionCode = {};
      var ExceptionMessage = {};
      var INDEX_SIZE_ERR = ExceptionCode.INDEX_SIZE_ERR = (ExceptionMessage[1] = "Index size error", 1);
      var DOMSTRING_SIZE_ERR = ExceptionCode.DOMSTRING_SIZE_ERR = (ExceptionMessage[2] = "DOMString size error", 2);
      var HIERARCHY_REQUEST_ERR = ExceptionCode.HIERARCHY_REQUEST_ERR = (ExceptionMessage[3] = "Hierarchy request error", 3);
      var WRONG_DOCUMENT_ERR = ExceptionCode.WRONG_DOCUMENT_ERR = (ExceptionMessage[4] = "Wrong document", 4);
      var INVALID_CHARACTER_ERR = ExceptionCode.INVALID_CHARACTER_ERR = (ExceptionMessage[5] = "Invalid character", 5);
      var NO_DATA_ALLOWED_ERR = ExceptionCode.NO_DATA_ALLOWED_ERR = (ExceptionMessage[6] = "No data allowed", 6);
      var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = (ExceptionMessage[7] = "No modification allowed", 7);
      var NOT_FOUND_ERR = ExceptionCode.NOT_FOUND_ERR = (ExceptionMessage[8] = "Not found", 8);
      var NOT_SUPPORTED_ERR = ExceptionCode.NOT_SUPPORTED_ERR = (ExceptionMessage[9] = "Not supported", 9);
      var INUSE_ATTRIBUTE_ERR = ExceptionCode.INUSE_ATTRIBUTE_ERR = (ExceptionMessage[10] = "Attribute in use", 10);
      //level2
      var INVALID_STATE_ERR = ExceptionCode.INVALID_STATE_ERR = (ExceptionMessage[11] = "Invalid state", 11);
      var SYNTAX_ERR = ExceptionCode.SYNTAX_ERR = (ExceptionMessage[12] = "Syntax error", 12);
      var INVALID_MODIFICATION_ERR = ExceptionCode.INVALID_MODIFICATION_ERR = (ExceptionMessage[13] = "Invalid modification", 13);
      var NAMESPACE_ERR = ExceptionCode.NAMESPACE_ERR = (ExceptionMessage[14] = "Invalid namespace", 14);
      var INVALID_ACCESS_ERR = ExceptionCode.INVALID_ACCESS_ERR = (ExceptionMessage[15] = "Invalid access", 15);


      function DOMException(code, message) {
        if (message instanceof Error) {
          var error = message;
        } else {
          error = this;
          Error.call(this, ExceptionMessage[code]);
          this.message = ExceptionMessage[code];
          if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
        }
        error.code = code;
        if (message) this.message = this.message + ": " + message;
        return error;
      };
      DOMException.prototype = Error.prototype;
      copy(ExceptionCode, DOMException);
      /**
                                          * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
                                          * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
                                          * The items in the NodeList are accessible via an integral index, starting from 0.
                                          */
      function NodeList() {
      };
      NodeList.prototype = {
        /**
                              * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
                              * @standard level1
                              */
        length: 0,
        /**
                    * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
                    * @standard level1
                    * @param index  unsigned long 
                    *   Index into the collection.
                    * @return Node
                    * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
                    */
        item: function item(index) {
          return this[index] || null;
        },
        toString: function toString(isHTML, nodeFilter) {
          for (var buf = [], i = 0; i < this.length; i++) {
            serializeToString(this[i], buf, isHTML, nodeFilter);
          }
          return buf.join('');
        } };

      function LiveNodeList(node, refresh) {
        this._node = node;
        this._refresh = refresh;
        _updateLiveList(this);
      }
      function _updateLiveList(list) {
        var inc = list._node._inc || list._node.ownerDocument._inc;
        if (list._inc != inc) {
          var ls = list._refresh(list._node);
          //console.log(ls.length)
          __set__(list, 'length', ls.length);
          copy(ls, list);
          list._inc = inc;
        }
      }
      LiveNodeList.prototype.item = function (i) {
        _updateLiveList(this);
        return this[i];
      };

      _extends(LiveNodeList, NodeList);
      /**
                                         * 
                                         * Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM specifies an order to these Nodes.
                                         * NamedNodeMap objects in the DOM are live.
                                         * used for attributes or DocumentType entities 
                                         */
      function NamedNodeMap() {
      };

      function _findNodeIndex(list, node) {
        var i = list.length;
        while (i--) {
          if (list[i] === node) {return i;}
        }
      }

      function _addNamedNode(el, list, newAttr, oldAttr) {
        if (oldAttr) {
          list[_findNodeIndex(list, oldAttr)] = newAttr;
        } else {
          list[list.length++] = newAttr;
        }
        if (el) {
          newAttr.ownerElement = el;
          var doc = el.ownerDocument;
          if (doc) {
            oldAttr && _onRemoveAttribute(doc, el, oldAttr);
            _onAddAttribute(doc, el, newAttr);
          }
        }
      }
      function _removeNamedNode(el, list, attr) {
        //console.log('remove attr:'+attr)
        var i = _findNodeIndex(list, attr);
        if (i >= 0) {
          var lastIndex = list.length - 1;
          while (i < lastIndex) {
            list[i] = list[++i];
          }
          list.length = lastIndex;
          if (el) {
            var doc = el.ownerDocument;
            if (doc) {
              _onRemoveAttribute(doc, el, attr);
              attr.ownerElement = null;
            }
          }
        } else {
          throw DOMException(NOT_FOUND_ERR, new Error(el.tagName + '@' + attr));
        }
      }
      NamedNodeMap.prototype = {
        length: 0,
        item: NodeList.prototype.item,
        getNamedItem: function getNamedItem(key) {
          //		if(key.indexOf(':')>0 || key == 'xmlns'){
          //			return null;
          //		}
          //console.log()
          var i = this.length;
          while (i--) {
            var attr = this[i];
            //console.log(attr.nodeName,key)
            if (attr.nodeName == key) {
              return attr;
            }
          }
        },
        setNamedItem: function setNamedItem(attr) {
          var el = attr.ownerElement;
          if (el && el != this._ownerElement) {
            throw new DOMException(INUSE_ATTRIBUTE_ERR);
          }
          var oldAttr = this.getNamedItem(attr.nodeName);
          _addNamedNode(this._ownerElement, this, attr, oldAttr);
          return oldAttr;
        },
        /* returns Node */
        setNamedItemNS: function setNamedItemNS(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
          var el = attr.ownerElement,oldAttr;
          if (el && el != this._ownerElement) {
            throw new DOMException(INUSE_ATTRIBUTE_ERR);
          }
          oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName);
          _addNamedNode(this._ownerElement, this, attr, oldAttr);
          return oldAttr;
        },

        /* returns Node */
        removeNamedItem: function removeNamedItem(key) {
          var attr = this.getNamedItem(key);
          _removeNamedNode(this._ownerElement, this, attr);
          return attr;


        }, // raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR

        //for level2
        removeNamedItemNS: function removeNamedItemNS(namespaceURI, localName) {
          var attr = this.getNamedItemNS(namespaceURI, localName);
          _removeNamedNode(this._ownerElement, this, attr);
          return attr;
        },
        getNamedItemNS: function getNamedItemNS(namespaceURI, localName) {
          var i = this.length;
          while (i--) {
            var node = this[i];
            if (node.localName == localName && node.namespaceURI == namespaceURI) {
              return node;
            }
          }
          return null;
        } };

      /**
              * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490
              */
      function DOMImplementation( /* Object */features) {
        this._features = {};
        if (features) {
          for (var feature in features) {
            this._features = features[feature];
          }
        }
      };

      DOMImplementation.prototype = {
        hasFeature: function hasFeature( /* string */feature, /* string */version) {
          var versions = this._features[feature.toLowerCase()];
          if (versions && (!version || version in versions)) {
            return true;
          } else {
            return false;
          }
        },
        // Introduced in DOM Level 2:
        createDocument: function createDocument(namespaceURI, qualifiedName, doctype) {// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR,WRONG_DOCUMENT_ERR
          var doc = new Document();
          doc.implementation = this;
          doc.childNodes = new NodeList();
          doc.doctype = doctype;
          if (doctype) {
            doc.appendChild(doctype);
          }
          if (qualifiedName) {
            var root = doc.createElementNS(namespaceURI, qualifiedName);
            doc.appendChild(root);
          }
          return doc;
        },
        // Introduced in DOM Level 2:
        createDocumentType: function createDocumentType(qualifiedName, publicId, systemId) {// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
          var node = new DocumentType();
          node.name = qualifiedName;
          node.nodeName = qualifiedName;
          node.publicId = publicId;
          node.systemId = systemId;
          // Introduced in DOM Level 2:
          //readonly attribute DOMString        internalSubset;

          //TODO:..
          //  readonly attribute NamedNodeMap     entities;
          //  readonly attribute NamedNodeMap     notations;
          return node;
        } };



      /**
              * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
              */

      function Node() {
      };

      Node.prototype = {
        firstChild: null,
        lastChild: null,
        previousSibling: null,
        nextSibling: null,
        attributes: null,
        parentNode: null,
        childNodes: null,
        ownerDocument: null,
        nodeValue: null,
        namespaceURI: null,
        prefix: null,
        localName: null,
        // Modified in DOM Level 2:
        insertBefore: function insertBefore(newChild, refChild) {//raises 
          return _insertBefore(this, newChild, refChild);
        },
        replaceChild: function replaceChild(newChild, oldChild) {//raises 
          this.insertBefore(newChild, oldChild);
          if (oldChild) {
            this.removeChild(oldChild);
          }
        },
        removeChild: function removeChild(oldChild) {
          return _removeChild(this, oldChild);
        },
        appendChild: function appendChild(newChild) {
          return this.insertBefore(newChild, null);
        },
        hasChildNodes: function hasChildNodes() {
          return this.firstChild != null;
        },
        cloneNode: function cloneNode(deep) {
          return _cloneNode(this.ownerDocument || this, this, deep);
        },
        // Modified in DOM Level 2:
        normalize: function normalize() {
          var child = this.firstChild;
          while (child) {
            var next = child.nextSibling;
            if (next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE) {
              this.removeChild(next);
              child.appendData(next.data);
            } else {
              child.normalize();
              child = next;
            }
          }
        },
        // Introduced in DOM Level 2:
        isSupported: function isSupported(feature, version) {
          return this.ownerDocument.implementation.hasFeature(feature, version);
        },
        // Introduced in DOM Level 2:
        hasAttributes: function hasAttributes() {
          return this.attributes.length > 0;
        },
        lookupPrefix: function lookupPrefix(namespaceURI) {
          var el = this;
          while (el) {
            var map = el._nsMap;
            //console.dir(map)
            if (map) {
              for (var n in map) {
                if (map[n] == namespaceURI) {
                  return n;
                }
              }
            }
            el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
          }
          return null;
        },
        // Introduced in DOM Level 3:
        lookupNamespaceURI: function lookupNamespaceURI(prefix) {
          var el = this;
          while (el) {
            var map = el._nsMap;
            //console.dir(map)
            if (map) {
              if (prefix in map) {
                return map[prefix];
              }
            }
            el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
          }
          return null;
        },
        // Introduced in DOM Level 3:
        isDefaultNamespace: function isDefaultNamespace(namespaceURI) {
          var prefix = this.lookupPrefix(namespaceURI);
          return prefix == null;
        } };



      function _xmlEncoder(c) {
        return c == '<' && '&lt;' ||
        c == '>' && '&gt;' ||
        c == '&' && '&amp;' ||
        c == '"' && '&quot;' ||
        '&#' + c.charCodeAt() + ';';
      }


      copy(NodeType, Node);
      copy(NodeType, Node.prototype);

      /**
                                       * @param callback return true for continue,false for break
                                       * @return boolean true: break visit;
                                       */
      function _visitNode(node, callback) {
        if (callback(node)) {
          return true;
        }
        if (node = node.firstChild) {
          do {
            if (_visitNode(node, callback)) {return true;}
          } while (node = node.nextSibling);
        }
      }



      function Document() {
      }
      function _onAddAttribute(doc, el, newAttr) {
        doc && doc._inc++;
        var ns = newAttr.namespaceURI;
        if (ns == 'http://www.w3.org/2000/xmlns/') {
          //update namespace
          el._nsMap[newAttr.prefix ? newAttr.localName : ''] = newAttr.value;
        }
      }
      function _onRemoveAttribute(doc, el, newAttr, remove) {
        doc && doc._inc++;
        var ns = newAttr.namespaceURI;
        if (ns == 'http://www.w3.org/2000/xmlns/') {
          //update namespace
          delete el._nsMap[newAttr.prefix ? newAttr.localName : ''];
        }
      }
      function _onUpdateChild(doc, el, newChild) {
        if (doc && doc._inc) {
          doc._inc++;
          //update childNodes
          var cs = el.childNodes;
          if (newChild) {
            cs[cs.length++] = newChild;
          } else {
            //console.log(1)
            var child = el.firstChild;
            var i = 0;
            while (child) {
              cs[i++] = child;
              child = child.nextSibling;
            }
            cs.length = i;
          }
        }
      }

      /**
         * attributes;
         * children;
         * 
         * writeable properties:
         * nodeValue,Attr:value,CharacterData:data
         * prefix
         */
      function _removeChild(parentNode, child) {
        var previous = child.previousSibling;
        var next = child.nextSibling;
        if (previous) {
          previous.nextSibling = next;
        } else {
          parentNode.firstChild = next;
        }
        if (next) {
          next.previousSibling = previous;
        } else {
          parentNode.lastChild = previous;
        }
        _onUpdateChild(parentNode.ownerDocument, parentNode);
        return child;
      }
      /**
         * preformance key(refChild == null)
         */
      function _insertBefore(parentNode, newChild, nextChild) {
        var cp = newChild.parentNode;
        if (cp) {
          cp.removeChild(newChild); //remove and update
        }
        if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
          var newFirst = newChild.firstChild;
          if (newFirst == null) {
            return newChild;
          }
          var newLast = newChild.lastChild;
        } else {
          newFirst = newLast = newChild;
        }
        var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

        newFirst.previousSibling = pre;
        newLast.nextSibling = nextChild;


        if (pre) {
          pre.nextSibling = newFirst;
        } else {
          parentNode.firstChild = newFirst;
        }
        if (nextChild == null) {
          parentNode.lastChild = newLast;
        } else {
          nextChild.previousSibling = newLast;
        }
        do {
          newFirst.parentNode = parentNode;
        } while (newFirst !== newLast && (newFirst = newFirst.nextSibling));
        _onUpdateChild(parentNode.ownerDocument || parentNode, parentNode);
        //console.log(parentNode.lastChild.nextSibling == null)
        if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
          newChild.firstChild = newChild.lastChild = null;
        }
        return newChild;
      }
      function _appendSingleChild(parentNode, newChild) {
        var cp = newChild.parentNode;
        if (cp) {
          var pre = parentNode.lastChild;
          cp.removeChild(newChild); //remove and update
          var pre = parentNode.lastChild;
        }
        var pre = parentNode.lastChild;
        newChild.parentNode = parentNode;
        newChild.previousSibling = pre;
        newChild.nextSibling = null;
        if (pre) {
          pre.nextSibling = newChild;
        } else {
          parentNode.firstChild = newChild;
        }
        parentNode.lastChild = newChild;
        _onUpdateChild(parentNode.ownerDocument, parentNode, newChild);
        return newChild;
        //console.log("__aa",parentNode.lastChild.nextSibling == null)
      }
      Document.prototype = {
        //implementation : null,
        nodeName: '#document',
        nodeType: DOCUMENT_NODE,
        doctype: null,
        documentElement: null,
        _inc: 1,

        insertBefore: function insertBefore(newChild, refChild) {//raises 
          if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
            var child = newChild.firstChild;
            while (child) {
              var next = child.nextSibling;
              this.insertBefore(child, refChild);
              child = next;
            }
            return newChild;
          }
          if (this.documentElement == null && newChild.nodeType == ELEMENT_NODE) {
            this.documentElement = newChild;
          }

          return _insertBefore(this, newChild, refChild), newChild.ownerDocument = this, newChild;
        },
        removeChild: function removeChild(oldChild) {
          if (this.documentElement == oldChild) {
            this.documentElement = null;
          }
          return _removeChild(this, oldChild);
        },
        // Introduced in DOM Level 2:
        importNode: function importNode(importedNode, deep) {
          return _importNode(this, importedNode, deep);
        },
        // Introduced in DOM Level 2:
        getElementById: function getElementById(id) {
          var rtv = null;
          _visitNode(this.documentElement, function (node) {
            if (node.nodeType == ELEMENT_NODE) {
              if (node.getAttribute('id') == id) {
                rtv = node;
                return true;
              }
            }
          });
          return rtv;
        },

        //document factory method:
        createElement: function createElement(tagName) {
          var node = new Element();
          node.ownerDocument = this;
          node.nodeName = tagName;
          node.tagName = tagName;
          node.childNodes = new NodeList();
          var attrs = node.attributes = new NamedNodeMap();
          attrs._ownerElement = node;
          return node;
        },
        createDocumentFragment: function createDocumentFragment() {
          var node = new DocumentFragment();
          node.ownerDocument = this;
          node.childNodes = new NodeList();
          return node;
        },
        createTextNode: function createTextNode(data) {
          var node = new Text();
          node.ownerDocument = this;
          node.appendData(data);
          return node;
        },
        createComment: function createComment(data) {
          var node = new Comment();
          node.ownerDocument = this;
          node.appendData(data);
          return node;
        },
        createCDATASection: function createCDATASection(data) {
          var node = new CDATASection();
          node.ownerDocument = this;
          node.appendData(data);
          return node;
        },
        createProcessingInstruction: function createProcessingInstruction(target, data) {
          var node = new ProcessingInstruction();
          node.ownerDocument = this;
          node.tagName = node.target = target;
          node.nodeValue = node.data = data;
          return node;
        },
        createAttribute: function createAttribute(name) {
          var node = new Attr();
          node.ownerDocument = this;
          node.name = name;
          node.nodeName = name;
          node.localName = name;
          node.specified = true;
          return node;
        },
        createEntityReference: function createEntityReference(name) {
          var node = new EntityReference();
          node.ownerDocument = this;
          node.nodeName = name;
          return node;
        },
        // Introduced in DOM Level 2:
        createElementNS: function createElementNS(namespaceURI, qualifiedName) {
          var node = new Element();
          var pl = qualifiedName.split(':');
          var attrs = node.attributes = new NamedNodeMap();
          node.childNodes = new NodeList();
          node.ownerDocument = this;
          node.nodeName = qualifiedName;
          node.tagName = qualifiedName;
          node.namespaceURI = namespaceURI;
          if (pl.length == 2) {
            node.prefix = pl[0];
            node.localName = pl[1];
          } else {
            //el.prefix = null;
            node.localName = qualifiedName;
          }
          attrs._ownerElement = node;
          return node;
        },
        // Introduced in DOM Level 2:
        createAttributeNS: function createAttributeNS(namespaceURI, qualifiedName) {
          var node = new Attr();
          var pl = qualifiedName.split(':');
          node.ownerDocument = this;
          node.nodeName = qualifiedName;
          node.name = qualifiedName;
          node.namespaceURI = namespaceURI;
          node.specified = true;
          if (pl.length == 2) {
            node.prefix = pl[0];
            node.localName = pl[1];
          } else {
            //el.prefix = null;
            node.localName = qualifiedName;
          }
          return node;
        } };

      _extends(Document, Node);


      function Element() {
        this._nsMap = {};
      };
      Element.prototype = {
        nodeType: ELEMENT_NODE,
        hasAttribute: function hasAttribute(name) {
          return this.getAttributeNode(name) != null;
        },
        getAttribute: function getAttribute(name) {
          var attr = this.getAttributeNode(name);
          return attr && attr.value || '';
        },
        getAttributeNode: function getAttributeNode(name) {
          return this.attributes.getNamedItem(name);
        },
        setAttribute: function setAttribute(name, value) {
          var attr = this.ownerDocument.createAttribute(name);
          attr.value = attr.nodeValue = "" + value;
          this.setAttributeNode(attr);
        },
        removeAttribute: function removeAttribute(name) {
          var attr = this.getAttributeNode(name);
          attr && this.removeAttributeNode(attr);
        },

        //four real opeartion method
        appendChild: function appendChild(newChild) {
          if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
            return this.insertBefore(newChild, null);
          } else {
            return _appendSingleChild(this, newChild);
          }
        },
        setAttributeNode: function setAttributeNode(newAttr) {
          return this.attributes.setNamedItem(newAttr);
        },
        setAttributeNodeNS: function setAttributeNodeNS(newAttr) {
          return this.attributes.setNamedItemNS(newAttr);
        },
        removeAttributeNode: function removeAttributeNode(oldAttr) {
          //console.log(this == oldAttr.ownerElement)
          return this.attributes.removeNamedItem(oldAttr.nodeName);
        },
        //get real attribute name,and remove it by removeAttributeNode
        removeAttributeNS: function removeAttributeNS(namespaceURI, localName) {
          var old = this.getAttributeNodeNS(namespaceURI, localName);
          old && this.removeAttributeNode(old);
        },

        hasAttributeNS: function hasAttributeNS(namespaceURI, localName) {
          return this.getAttributeNodeNS(namespaceURI, localName) != null;
        },
        getAttributeNS: function getAttributeNS(namespaceURI, localName) {
          var attr = this.getAttributeNodeNS(namespaceURI, localName);
          return attr && attr.value || '';
        },
        setAttributeNS: function setAttributeNS(namespaceURI, qualifiedName, value) {
          var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
          attr.value = attr.nodeValue = "" + value;
          this.setAttributeNode(attr);
        },
        getAttributeNodeNS: function getAttributeNodeNS(namespaceURI, localName) {
          return this.attributes.getNamedItemNS(namespaceURI, localName);
        },

        getElementsByTagName: function getElementsByTagName(tagName) {
          return new LiveNodeList(this, function (base) {
            var ls = [];
            _visitNode(base, function (node) {
              if (node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)) {
                ls.push(node);
              }
            });
            return ls;
          });
        },
        getElementsByTagNameNS: function getElementsByTagNameNS(namespaceURI, localName) {
          return new LiveNodeList(this, function (base) {
            var ls = [];
            _visitNode(base, function (node) {
              if (node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)) {
                ls.push(node);
              }
            });
            return ls;

          });
        } };

      Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
      Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


      _extends(Element, Node);
      function Attr() {
      };
      Attr.prototype.nodeType = ATTRIBUTE_NODE;
      _extends(Attr, Node);


      function CharacterData() {
      };
      CharacterData.prototype = {
        data: '',
        substringData: function substringData(offset, count) {
          return this.data.substring(offset, offset + count);
        },
        appendData: function appendData(text) {
          text = this.data + text;
          this.nodeValue = this.data = text;
          this.length = text.length;
        },
        insertData: function insertData(offset, text) {
          this.replaceData(offset, 0, text);

        },
        appendChild: function appendChild(newChild) {
          throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR]);
        },
        deleteData: function deleteData(offset, count) {
          this.replaceData(offset, count, "");
        },
        replaceData: function replaceData(offset, count, text) {
          var start = this.data.substring(0, offset);
          var end = this.data.substring(offset + count);
          text = start + text + end;
          this.nodeValue = this.data = text;
          this.length = text.length;
        } };

      _extends(CharacterData, Node);
      function Text() {
      };
      Text.prototype = {
        nodeName: "#text",
        nodeType: TEXT_NODE,
        splitText: function splitText(offset) {
          var text = this.data;
          var newText = text.substring(offset);
          text = text.substring(0, offset);
          this.data = this.nodeValue = text;
          this.length = text.length;
          var newNode = this.ownerDocument.createTextNode(newText);
          if (this.parentNode) {
            this.parentNode.insertBefore(newNode, this.nextSibling);
          }
          return newNode;
        } };

      _extends(Text, CharacterData);
      function Comment() {
      };
      Comment.prototype = {
        nodeName: "#comment",
        nodeType: COMMENT_NODE };

      _extends(Comment, CharacterData);

      function CDATASection() {
      };
      CDATASection.prototype = {
        nodeName: "#cdata-section",
        nodeType: CDATA_SECTION_NODE };

      _extends(CDATASection, CharacterData);


      function DocumentType() {
      };
      DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
      _extends(DocumentType, Node);

      function Notation() {
      };
      Notation.prototype.nodeType = NOTATION_NODE;
      _extends(Notation, Node);

      function Entity() {
      };
      Entity.prototype.nodeType = ENTITY_NODE;
      _extends(Entity, Node);

      function EntityReference() {
      };
      EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
      _extends(EntityReference, Node);

      function DocumentFragment() {
      };
      DocumentFragment.prototype.nodeName = "#document-fragment";
      DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE;
      _extends(DocumentFragment, Node);


      function ProcessingInstruction() {
      }
      ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
      _extends(ProcessingInstruction, Node);
      function XMLSerializer() {}
      XMLSerializer.prototype.serializeToString = function (node, isHtml, nodeFilter) {
        return nodeSerializeToString.call(node, isHtml, nodeFilter);
      };
      Node.prototype.toString = nodeSerializeToString;
      function nodeSerializeToString(isHtml, nodeFilter) {
        var buf = [];
        var refNode = this.nodeType == 9 ? this.documentElement : this;
        var prefix = refNode.prefix;
        var uri = refNode.namespaceURI;

        if (uri && prefix == null) {
          //console.log(prefix)
          var prefix = refNode.lookupPrefix(uri);
          if (prefix == null) {
            //isHTML = true;
            var visibleNamespaces = [
            { namespace: uri, prefix: null
              //{namespace:uri,prefix:''}
            }];
          }
        }
        serializeToString(this, buf, isHtml, nodeFilter, visibleNamespaces);
        //console.log('###',this.nodeType,uri,prefix,buf.join(''))
        return buf.join('');
      }
      function needNamespaceDefine(node, isHTML, visibleNamespaces) {
        var prefix = node.prefix || '';
        var uri = node.namespaceURI;
        if (!prefix && !uri) {
          return false;
        }
        if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace" ||
        uri == 'http://www.w3.org/2000/xmlns/') {
          return false;
        }

        var i = visibleNamespaces.length;
        //console.log('@@@@',node.tagName,prefix,uri,visibleNamespaces)
        while (i--) {
          var ns = visibleNamespaces[i];
          // get namespace prefix
          //console.log(node.nodeType,node.tagName,ns.prefix,prefix)
          if (ns.prefix == prefix) {
            return ns.namespace != uri;
          }
        }
        //console.log(isHTML,uri,prefix=='')
        //if(isHTML && prefix ==null && uri == 'http://www.w3.org/1999/xhtml'){
        //	return false;
        //}
        //node.flag = '11111'
        //console.error(3,true,node.flag,node.prefix,node.namespaceURI)
        return true;
      }
      function serializeToString(node, buf, isHTML, nodeFilter, visibleNamespaces) {
        if (nodeFilter) {
          node = nodeFilter(node);
          if (node) {
            if (typeof node == 'string') {
              buf.push(node);
              return;
            }
          } else {
            return;
          }
          //buf.sort.apply(attrs, attributeSorter);
        }
        switch (node.nodeType) {
          case ELEMENT_NODE:
            if (!visibleNamespaces) visibleNamespaces = [];
            var startVisibleNamespaces = visibleNamespaces.length;
            var attrs = node.attributes;
            var len = attrs.length;
            var child = node.firstChild;
            var nodeName = node.tagName;

            isHTML = htmlns === node.namespaceURI || isHTML;
            buf.push('<', nodeName);



            for (var i = 0; i < len; i++) {
              // add namespaces for attributes
              var attr = attrs.item(i);
              if (attr.prefix == 'xmlns') {
                visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
              } else if (attr.nodeName == 'xmlns') {
                visibleNamespaces.push({ prefix: '', namespace: attr.value });
              }
            }
            for (var i = 0; i < len; i++) {
              var attr = attrs.item(i);
              if (needNamespaceDefine(attr, isHTML, visibleNamespaces)) {
                var prefix = attr.prefix || '';
                var uri = attr.namespaceURI;
                var ns = prefix ? ' xmlns:' + prefix : " xmlns";
                buf.push(ns, '="', uri, '"');
                visibleNamespaces.push({ prefix: prefix, namespace: uri });
              }
              serializeToString(attr, buf, isHTML, nodeFilter, visibleNamespaces);
            }
            // add namespace for current node		
            if (needNamespaceDefine(node, isHTML, visibleNamespaces)) {
              var prefix = node.prefix || '';
              var uri = node.namespaceURI;
              var ns = prefix ? ' xmlns:' + prefix : " xmlns";
              buf.push(ns, '="', uri, '"');
              visibleNamespaces.push({ prefix: prefix, namespace: uri });
            }

            if (child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)) {
              buf.push('>');
              //if is cdata child node
              if (isHTML && /^script$/i.test(nodeName)) {
                while (child) {
                  if (child.data) {
                    buf.push(child.data);
                  } else {
                    serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
                  }
                  child = child.nextSibling;
                }
              } else
              {
                while (child) {
                  serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
                  child = child.nextSibling;
                }
              }
              buf.push('</', nodeName, '>');
            } else {
              buf.push('/>');
            }
            // remove added visible namespaces
            //visibleNamespaces.length = startVisibleNamespaces;
            return;
          case DOCUMENT_NODE:
          case DOCUMENT_FRAGMENT_NODE:
            var child = node.firstChild;
            while (child) {
              serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
              child = child.nextSibling;
            }
            return;
          case ATTRIBUTE_NODE:
            return buf.push(' ', node.name, '="', node.value.replace(/[<&"]/g, _xmlEncoder), '"');
          case TEXT_NODE:
            return buf.push(node.data.replace(/[<&]/g, _xmlEncoder));
          case CDATA_SECTION_NODE:
            return buf.push('<![CDATA[', node.data, ']]>');
          case COMMENT_NODE:
            return buf.push("<!--", node.data, "-->");
          case DOCUMENT_TYPE_NODE:
            var pubid = node.publicId;
            var sysid = node.systemId;
            buf.push('<!DOCTYPE ', node.name);
            if (pubid) {
              buf.push(' PUBLIC "', pubid);
              if (sysid && sysid != '.') {
                buf.push('" "', sysid);
              }
              buf.push('">');
            } else if (sysid && sysid != '.') {
              buf.push(' SYSTEM "', sysid, '">');
            } else {
              var sub = node.internalSubset;
              if (sub) {
                buf.push(" [", sub, "]");
              }
              buf.push(">");
            }
            return;
          case PROCESSING_INSTRUCTION_NODE:
            return buf.push("<?", node.target, " ", node.data, "?>");
          case ENTITY_REFERENCE_NODE:
            return buf.push('&', node.nodeName, ';');
          //case ENTITY_NODE:
          //case NOTATION_NODE:
          default:
            buf.push('??', node.nodeName);}

      }
      function _importNode(doc, node, deep) {
        var node2;
        switch (node.nodeType) {
          case ELEMENT_NODE:
            node2 = node.cloneNode(false);
            node2.ownerDocument = doc;
          //var attrs = node2.attributes;
          //var len = attrs.length;
          //for(var i=0;i<len;i++){
          //node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
          //}
          case DOCUMENT_FRAGMENT_NODE:
            break;
          case ATTRIBUTE_NODE:
            deep = true;
            break;
          //case ENTITY_REFERENCE_NODE:
          //case PROCESSING_INSTRUCTION_NODE:
          ////case TEXT_NODE:
          //case CDATA_SECTION_NODE:
          //case COMMENT_NODE:
          //	deep = false;
          //	break;
          //case DOCUMENT_NODE:
          //case DOCUMENT_TYPE_NODE:
          //cannot be imported.
          //case ENTITY_NODE:
          //case NOTATION_NODE：
          //can not hit in level3
          //default:throw e;
        }
        if (!node2) {
          node2 = node.cloneNode(false); //false
        }
        node2.ownerDocument = doc;
        node2.parentNode = null;
        if (deep) {
          var child = node.firstChild;
          while (child) {
            node2.appendChild(_importNode(doc, child, deep));
            child = child.nextSibling;
          }
        }
        return node2;
      }
      //
      //var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
      //					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
      function _cloneNode(doc, node, deep) {
        var node2 = new node.constructor();
        for (var n in node) {
          var v = node[n];
          if (typeof v != 'object') {
            if (v != node2[n]) {
              node2[n] = v;
            }
          }
        }
        if (node.childNodes) {
          node2.childNodes = new NodeList();
        }
        node2.ownerDocument = doc;
        switch (node2.nodeType) {
          case ELEMENT_NODE:
            var attrs = node.attributes;
            var attrs2 = node2.attributes = new NamedNodeMap();
            var len = attrs.length;
            attrs2._ownerElement = node2;
            for (var i = 0; i < len; i++) {
              node2.setAttributeNode(_cloneNode(doc, attrs.item(i), true));
            }
            break;;
          case ATTRIBUTE_NODE:
            deep = true;}

        if (deep) {
          var child = node.firstChild;
          while (child) {
            node2.appendChild(_cloneNode(doc, child, deep));
            child = child.nextSibling;
          }
        }
        return node2;
      }

      function __set__(object, key, value) {
        object[key] = value;
      }
      //do dynamic
      try {
        if (Object.defineProperty) {var






























          getTextContent = function getTextContent(node) {
            switch (node.nodeType) {
              case ELEMENT_NODE:
              case DOCUMENT_FRAGMENT_NODE:
                var buf = [];
                node = node.firstChild;
                while (node) {
                  if (node.nodeType !== 7 && node.nodeType !== 8) {
                    buf.push(getTextContent(node));
                  }
                  node = node.nextSibling;
                }
                return buf.join('');
              default:
                return node.nodeValue;}

          };Object.defineProperty(LiveNodeList.prototype, 'length', { get: function get() {_updateLiveList(this);return this.$$length;} });Object.defineProperty(Node.prototype, 'textContent', { get: function get() {return getTextContent(this);}, set: function set(data) {switch (this.nodeType) {case ELEMENT_NODE:case DOCUMENT_FRAGMENT_NODE:while (this.firstChild) {this.removeChild(this.firstChild);}if (data || String(data)) {this.appendChild(this.ownerDocument.createTextNode(data));}break;default: //TODO:
                  this.data = data;this.value = data;this.nodeValue = data;}} });__set__ = function __set__(object, key, value) {
            //console.log(value)
            object['$$' + key] = value;
          };
        }
      } catch (e) {
      } //ie8

      //if(typeof require == 'function'){
      exports.DOMImplementation = DOMImplementation;
      exports.XMLSerializer = XMLSerializer;
      //}


      /***/},
    /* 3 */
    /***/function (module, exports) {

      var initEvent = function initEvent(cos) {
        var listeners = {};
        var getList = function getList(action) {
          !listeners[action] && (listeners[action] = []);
          return listeners[action];
        };
        cos.on = function (action, callback) {
          getList(action).push(callback);
        };
        cos.off = function (action, callback) {
          var list = getList(action);
          for (var i = list.length - 1; i >= 0; i--) {
            callback === list[i] && list.splice(i, 1);
          }
        };
        cos.emit = function (action, data) {
          var list = getList(action).map(function (cb) {
            return cb;
          });
          for (var i = 0; i < list.length; i++) {
            list[i](data);
          }
        };
      };

      var EventProxy = function EventProxy() {
        initEvent(this);
      };

      module.exports.init = initEvent;
      module.exports.EventProxy = EventProxy;

      /***/},
    /* 4 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";var _defaultOptions;


      var util = __webpack_require__(0);
      var event = __webpack_require__(3);
      var task = __webpack_require__(16);
      var base = __webpack_require__(15);
      var advance = __webpack_require__(13);

      var defaultOptions = (_defaultOptions = {
        SecretId: '',
        SecretKey: '',
        XCosSecurityToken: '', // 使用临时密钥需要注意自行刷新 Token
        ChunkRetryTimes: 2,
        FileParallelLimit: 3,
        ChunkParallelLimit: 3 }, _defineProperty(_defaultOptions, "ChunkRetryTimes",
      3), _defineProperty(_defaultOptions, "ChunkSize",
      1024 * 1024), _defineProperty(_defaultOptions, "SliceSize",
      1024 * 1024), _defineProperty(_defaultOptions, "CopyChunkParallelLimit",
      20), _defineProperty(_defaultOptions, "CopyChunkSize",
      1024 * 1024 * 10), _defineProperty(_defaultOptions, "CopySliceSize",
      1024 * 1024 * 10), _defineProperty(_defaultOptions, "MaxPartNumber",
      10000), _defineProperty(_defaultOptions, "ProgressInterval",
      1000), _defineProperty(_defaultOptions, "UploadQueueSize",
      10000), _defineProperty(_defaultOptions, "Domain",
      ''), _defineProperty(_defaultOptions, "ServiceDomain",
      ''), _defineProperty(_defaultOptions, "Protocol",
      ''), _defineProperty(_defaultOptions, "CompatibilityMode",
      false), _defineProperty(_defaultOptions, "ForcePathStyle",
      false), _defineProperty(_defaultOptions, "CorrectClockSkew",
      true), _defineProperty(_defaultOptions, "SystemClockOffset",
      0), _defaultOptions);


      // 对外暴露的类
      var COS = function COS(options) {
        this.options = util.extend(util.clone(defaultOptions), options || {});
        this.options.FileParallelLimit = Math.max(1, this.options.FileParallelLimit);
        this.options.ChunkParallelLimit = Math.max(1, this.options.ChunkParallelLimit);
        this.options.ChunkRetryTimes = Math.max(0, this.options.ChunkRetryTimes);
        this.options.ChunkSize = Math.max(1024 * 1024, this.options.ChunkSize);
        this.options.CopyChunkParallelLimit = Math.max(1, this.options.CopyChunkParallelLimit);
        this.options.CopyChunkSize = Math.max(1024 * 1024, this.options.CopyChunkSize);
        this.options.CopySliceSize = Math.max(0, this.options.CopySliceSize);
        this.options.MaxPartNumber = Math.max(1024, Math.min(10000, this.options.MaxPartNumber));
        this.options.Timeout = Math.max(0, this.options.Timeout);
        if (this.options.AppId) {
          console.warn('warning: AppId has been deprecated, Please put it at the end of parameter Bucket(E.g: "test-1250000000").');
        }
        event.init(this);
        task.init(this);
      };

      base.init(COS, task);
      advance.init(COS, task);

      COS.getAuthorization = util.getAuth;
      COS.version = '0.7.10';

      module.exports = COS;


      /***/},
    /* 5 */
    /***/function (module, exports, __webpack_require__) {

      var COS = __webpack_require__(4);
      module.exports = COS;

      /***/},
    /* 6 */
    /***/function (module, exports) {

      /*
                                      CryptoJS v3.1.2
                                      code.google.com/p/crypto-js
                                      (c) 2009-2013 by Jeff Mott. All rights reserved.
                                      code.google.com/p/crypto-js/wiki/License
                                      */
      var CryptoJS = CryptoJS || function (g, l) {var e = {},d = e.lib = {},m = function m() {},k = d.Base = { extend: function extend(a) {m.prototype = this;var c = new m();a && c.mixIn(a);c.hasOwnProperty("init") || (c.init = function () {c.$super.init.apply(this, arguments);});c.init.prototype = c;c.$super = this;return c;}, create: function create() {var a = this.extend();a.init.apply(a, arguments);return a;}, init: function init() {}, mixIn: function mixIn(a) {for (var c in a) {a.hasOwnProperty(c) && (this[c] = a[c]);}a.hasOwnProperty("toString") && (this.toString = a.toString);}, clone: function clone() {return this.init.prototype.extend(this);} },
        p = d.WordArray = k.extend({ init: function init(a, c) {a = this.words = a || [];this.sigBytes = c != l ? c : 4 * a.length;}, toString: function toString(a) {return (a || n).stringify(this);}, concat: function concat(a) {var c = this.words,q = a.words,f = this.sigBytes;a = a.sigBytes;this.clamp();if (f % 4) for (var b = 0; b < a; b++) {c[f + b >>> 2] |= (q[b >>> 2] >>> 24 - 8 * (b % 4) & 255) << 24 - 8 * ((f + b) % 4);} else if (65535 < q.length) for (b = 0; b < a; b += 4) {c[f + b >>> 2] = q[b >>> 2];} else c.push.apply(c, q);this.sigBytes += a;return this;}, clamp: function clamp() {var a = this.words,c = this.sigBytes;a[c >>> 2] &= 4294967295 <<
            32 - 8 * (c % 4);a.length = g.ceil(c / 4);}, clone: function clone() {var a = k.clone.call(this);a.words = this.words.slice(0);return a;}, random: function random(a) {for (var c = [], b = 0; b < a; b += 4) {c.push(4294967296 * g.random() | 0);}return new p.init(c, a);} }),b = e.enc = {},n = b.Hex = { stringify: function stringify(a) {var c = a.words;a = a.sigBytes;for (var b = [], f = 0; f < a; f++) {var d = c[f >>> 2] >>> 24 - 8 * (f % 4) & 255;b.push((d >>> 4).toString(16));b.push((d & 15).toString(16));}return b.join("");}, parse: function parse(a) {for (var c = a.length, b = [], f = 0; f < c; f += 2) {b[f >>> 3] |= parseInt(a.substr(f,
              2), 16) << 24 - 4 * (f % 8);}return new p.init(b, c / 2);} },j = b.Latin1 = { stringify: function stringify(a) {var c = a.words;a = a.sigBytes;for (var b = [], f = 0; f < a; f++) {b.push(String.fromCharCode(c[f >>> 2] >>> 24 - 8 * (f % 4) & 255));}return b.join("");}, parse: function parse(a) {for (var c = a.length, b = [], f = 0; f < c; f++) {b[f >>> 2] |= (a.charCodeAt(f) & 255) << 24 - 8 * (f % 4);}return new p.init(b, c);} },h = b.Utf8 = { stringify: function stringify(a) {try {return decodeURIComponent(escape(j.stringify(a)));} catch (c) {throw Error("Malformed UTF-8 data");}}, parse: function parse(a) {return j.parse(unescape(encodeURIComponent(a)));} },
        r = d.BufferedBlockAlgorithm = k.extend({ reset: function reset() {this._data = new p.init();this._nDataBytes = 0;}, _append: function _append(a) {"string" == typeof a && (a = h.parse(a));this._data.concat(a);this._nDataBytes += a.sigBytes;}, _process: function _process(a) {var c = this._data,b = c.words,f = c.sigBytes,d = this.blockSize,e = f / (4 * d),e = a ? g.ceil(e) : g.max((e | 0) - this._minBufferSize, 0);a = e * d;f = g.min(4 * a, f);if (a) {for (var k = 0; k < a; k += d) {this._doProcessBlock(b, k);}k = b.splice(0, a);c.sigBytes -= f;}return new p.init(k, f);}, clone: function clone() {var a = k.clone.call(this);
            a._data = this._data.clone();return a;}, _minBufferSize: 0 });d.Hasher = r.extend({ cfg: k.extend(), init: function init(a) {this.cfg = this.cfg.extend(a);this.reset();}, reset: function reset() {r.reset.call(this);this._doReset();}, update: function update(a) {this._append(a);this._process();return this;}, finalize: function finalize(a) {a && this._append(a);return this._doFinalize();}, blockSize: 16, _createHelper: function _createHelper(a) {return function (b, d) {return new a.init(d).finalize(b);};}, _createHmacHelper: function _createHmacHelper(a) {return function (b, d) {return new s.HMAC.init(a,
              d).finalize(b);};} });var s = e.algo = {};return e;}(Math);
      (function () {var g = CryptoJS,l = g.lib,e = l.WordArray,d = l.Hasher,m = [],l = g.algo.SHA1 = d.extend({ _doReset: function _doReset() {this._hash = new e.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);}, _doProcessBlock: function _doProcessBlock(d, e) {for (var b = this._hash.words, n = b[0], j = b[1], h = b[2], g = b[3], l = b[4], a = 0; 80 > a; a++) {if (16 > a) m[a] = d[e + a] | 0;else {var c = m[a - 3] ^ m[a - 8] ^ m[a - 14] ^ m[a - 16];m[a] = c << 1 | c >>> 31;}c = (n << 5 | n >>> 27) + l + m[a];c = 20 > a ? c + ((j & h | ~j & g) + 1518500249) : 40 > a ? c + ((j ^ h ^ g) + 1859775393) : 60 > a ? c + ((j & h | j & g | h & g) - 1894007588) : c + ((j ^ h ^
              g) - 899497514);l = g;g = h;h = j << 30 | j >>> 2;j = n;n = c;}b[0] = b[0] + n | 0;b[1] = b[1] + j | 0;b[2] = b[2] + h | 0;b[3] = b[3] + g | 0;b[4] = b[4] + l | 0;}, _doFinalize: function _doFinalize() {var d = this._data,e = d.words,b = 8 * this._nDataBytes,g = 8 * d.sigBytes;e[g >>> 5] |= 128 << 24 - g % 32;e[(g + 64 >>> 9 << 4) + 14] = Math.floor(b / 4294967296);e[(g + 64 >>> 9 << 4) + 15] = b;d.sigBytes = 4 * e.length;this._process();return this._hash;}, clone: function clone() {var e = d.clone.call(this);e._hash = this._hash.clone();return e;} });g.SHA1 = d._createHelper(l);g.HmacSHA1 = d._createHmacHelper(l);})();
      (function () {var g = CryptoJS,l = g.enc.Utf8;g.algo.HMAC = g.lib.Base.extend({ init: function init(e, d) {e = this._hasher = new e.init();"string" == typeof d && (d = l.parse(d));var g = e.blockSize,k = 4 * g;d.sigBytes > k && (d = e.finalize(d));d.clamp();for (var p = this._oKey = d.clone(), b = this._iKey = d.clone(), n = p.words, j = b.words, h = 0; h < g; h++) {n[h] ^= 1549556828, j[h] ^= 909522486;}p.sigBytes = b.sigBytes = k;this.reset();}, reset: function reset() {var e = this._hasher;e.reset();e.update(this._iKey);}, update: function update(e) {this._hasher.update(e);return this;}, finalize: function finalize(e) {var d =
            this._hasher;e = d.finalize(e);d.reset();return d.finalize(this._oKey.clone().concat(e));} });})();


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_enc = C.enc;

        /**
                            * Base64 encoding strategy.
                            */
        var Base64 = C_enc.Base64 = {
          /**
                                       * Converts a word array to a Base64 string.
                                       *
                                       * @param {WordArray} wordArray The word array.
                                       *
                                       * @return {string} The Base64 string.
                                       *
                                       * @static
                                       *
                                       * @example
                                       *
                                       *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
                                       */
          stringify: function stringify(wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map;

            // Clamp excess bits
            wordArray.clamp();

            // Convert
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
              var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
              var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 0xff;
              var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 0xff;

              var triplet = byte1 << 16 | byte2 << 8 | byte3;

              for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
                base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 0x3f));
              }
            }

            // Add padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
              while (base64Chars.length % 4) {
                base64Chars.push(paddingChar);
              }
            }

            return base64Chars.join('');
          },

          /**
              * Converts a Base64 string to a word array.
              *
              * @param {string} base64Str The Base64 string.
              *
              * @return {WordArray} The word array.
              *
              * @static
              *
              * @example
              *
              *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
              */
          parse: function parse(base64Str) {
            // Shortcuts
            var base64StrLength = base64Str.length;
            var map = this._map;

            // Ignore padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
              var paddingIndex = base64Str.indexOf(paddingChar);
              if (paddingIndex != -1) {
                base64StrLength = paddingIndex;
              }
            }

            // Convert
            var words = [];
            var nBytes = 0;
            for (var i = 0; i < base64StrLength; i++) {
              if (i % 4) {
                var bits1 = map.indexOf(base64Str.charAt(i - 1)) << i % 4 * 2;
                var bits2 = map.indexOf(base64Str.charAt(i)) >>> 6 - i % 4 * 2;
                words[nBytes >>> 2] |= (bits1 | bits2) << 24 - nBytes % 4 * 8;
                nBytes++;
              }
            }

            return WordArray.create(words, nBytes);
          },

          _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=' };

      })();

      module.exports = CryptoJS;


      /***/},
    /* 7 */
    /***/function (module, exports) {

      //copyright Ryan Day 2010 <http://ryanday.org>, Joscha Feth 2013 <http://www.feth.com> [MIT Licensed]

      var element_start_char =
      "a-zA-Z_\xC0-\xD6\xD8-\xF6\xF8-\xFF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FFF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD";
      var element_non_start_char = "-.0-9\xB7\u0300-\u036F\u203F\u2040";
      var element_replace = new RegExp("^([^" + element_start_char + "])|^((x|X)(m|M)(l|L))|([^" + element_start_char + element_non_start_char + "])", "g");
      var not_safe_in_xml = /[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm;

      var objKeys = function objKeys(obj) {
        var l = [];
        if (obj instanceof Object) {
          for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
              l.push(k);
            }
          }
        }
        return l;
      };
      var process_to_xml = function process_to_xml(node_data, options) {

        var makeNode = function makeNode(name, content, attributes, level, hasSubNodes) {
          var indent_value = options.indent !== undefined ? options.indent : "\t";
          var indent = options.prettyPrint ? '\n' + new Array(level).join(indent_value) : '';
          if (options.removeIllegalNameCharacters) {
            name = name.replace(element_replace, '_');
          }

          var node = [indent, '<', name, attributes || ''];
          if (content && content.length > 0) {
            node.push('>');
            node.push(content);
            hasSubNodes && node.push(indent);
            node.push('</');
            node.push(name);
            node.push('>');
          } else {
            node.push('/>');
          }
          return node.join('');
        };

        return function fn(node_data, node_descriptor, level) {
          var type = typeof node_data;
          if (Array.isArray ? Array.isArray(node_data) : node_data instanceof Array) {
            type = 'array';
          } else if (node_data instanceof Date) {
            type = 'date';
          }

          switch (type) {
            //if value is an array create child nodes from values
            case 'array':
              var ret = [];
              node_data.map(function (v) {
                ret.push(fn(v, 1, level + 1));
                //entries that are values of an array are the only ones that can be special node descriptors
              });
              options.prettyPrint && ret.push('\n');
              return ret.join('');
              break;

            case 'date':
              // cast dates to ISO 8601 date (soap likes it)
              return node_data.toJSON ? node_data.toJSON() : node_data + '';
              break;

            case 'object':
              var nodes = [];
              for (var name in node_data) {
                if (node_data[name] instanceof Array) {
                  for (var j in node_data[name]) {
                    nodes.push(makeNode(name, fn(node_data[name][j], 0, level + 1), null, level + 1, objKeys(node_data[name][j]).length));
                  }
                } else {
                  nodes.push(makeNode(name, fn(node_data[name], 0, level + 1), null, level + 1));
                }
              }
              options.prettyPrint && nodes.length > 0 && nodes.push('\n');
              return nodes.join('');
              break;

            case 'function':
              return node_data();
              break;

            default:
              return options.escape ? esc(node_data) : '' + node_data;}


        }(node_data, 0, 0);
      };


      var xml_header = function xml_header(standalone) {
        var ret = ['<?xml version="1.0" encoding="UTF-8"'];

        if (standalone) {
          ret.push(' standalone="yes"');
        }
        ret.push('?>');

        return ret.join('');
      };

      function esc(str) {
        return ('' + str).replace(/&/g, '&amp;').
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;').
        replace(/'/g, '&apos;').
        replace(/"/g, '&quot;').
        replace(not_safe_in_xml, '');
      }

      var json2xml = function json2xml(obj, options) {

        if (!options) {
          options = {
            xmlHeader: {
              standalone: true },

            prettyPrint: true,
            indent: "  " };

        }

        if (typeof obj == 'string') {
          try {
            obj = JSON.parse(obj.toString());
          } catch (e) {
            return false;
          }
        }

        var xmlheader = '';
        var docType = '';
        if (options) {
          if (typeof options == 'object') {
            // our config is an object

            if (options.xmlHeader) {
              // the user wants an xml header
              xmlheader = xml_header(!!options.xmlHeader.standalone);
            }

            if (typeof options.docType != 'undefined') {
              docType = '<!DOCTYPE ' + options.docType + '>';
            }
          } else {
            // our config is a boolean value, so just add xml header
            xmlheader = xml_header();
          }
        }
        options = options || {};

        var ret = [
        xmlheader,
        options.prettyPrint && docType ? '\n' : '',
        docType,
        process_to_xml(obj, options)];

        return ret.join('').replace(/\n{2,}/g, '\n').replace(/\s+$/g, '');
      };

      module.exports = json2xml;

      /***/},
    /* 8 */
    /***/function (module, exports) {

      /**
                                      *
                                      *  MD5 (Message-Digest Algorithm)
                                      *  http://www.webtoolkit.info/
                                      *
                                      **/

      var md5 = function md5(string) {

        function RotateLeft(lValue, iShiftBits) {
          return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
        }

        function AddUnsigned(lX, lY) {
          var lX4, lY4, lX8, lY8, lResult;
          lX8 = lX & 0x80000000;
          lY8 = lY & 0x80000000;
          lX4 = lX & 0x40000000;
          lY4 = lY & 0x40000000;
          lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
          if (lX4 & lY4) {
            return lResult ^ 0x80000000 ^ lX8 ^ lY8;
          }
          if (lX4 | lY4) {
            if (lResult & 0x40000000) {
              return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
            } else {
              return lResult ^ 0x40000000 ^ lX8 ^ lY8;
            }
          } else {
            return lResult ^ lX8 ^ lY8;
          }
        }

        function F(x, y, z) {return x & y | ~x & z;}
        function G(x, y, z) {return x & z | y & ~z;}
        function H(x, y, z) {return x ^ y ^ z;}
        function I(x, y, z) {return y ^ (x | ~z);}

        function FF(a, b, c, d, x, s, ac) {
          a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
          return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a, b, c, d, x, s, ac) {
          a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
          return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a, b, c, d, x, s, ac) {
          a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
          return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a, b, c, d, x, s, ac) {
          a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
          return AddUnsigned(RotateLeft(a, s), b);
        };

        function ConvertToWordArray(string) {
          var lWordCount;
          var lMessageLength = string.length;
          var lNumberOfWords_temp1 = lMessageLength + 8;
          var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - lNumberOfWords_temp1 % 64) / 64;
          var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
          var lWordArray = Array(lNumberOfWords - 1);
          var lBytePosition = 0;
          var lByteCount = 0;
          while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - lByteCount % 4) / 4;
            lBytePosition = lByteCount % 4 * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | string.charCodeAt(lByteCount) << lBytePosition;
            lByteCount++;
          }
          lWordCount = (lByteCount - lByteCount % 4) / 4;
          lBytePosition = lByteCount % 4 * 8;
          lWordArray[lWordCount] = lWordArray[lWordCount] | 0x80 << lBytePosition;
          lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
          lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
          return lWordArray;
        };

        function WordToHex(lValue) {
          var WordToHexValue = "",WordToHexValue_temp = "",lByte,lCount;
          for (lCount = 0; lCount <= 3; lCount++) {
            lByte = lValue >>> lCount * 8 & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
          }
          return WordToHexValue;
        };

        function Utf8Encode(string) {
          string = string.replace(/\r\n/g, "\n");
          var utftext = "";

          for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
              utftext += String.fromCharCode(c);
            } else
            if (c > 127 && c < 2048) {
              utftext += String.fromCharCode(c >> 6 | 192);
              utftext += String.fromCharCode(c & 63 | 128);
            } else
            {
              utftext += String.fromCharCode(c >> 12 | 224);
              utftext += String.fromCharCode(c >> 6 & 63 | 128);
              utftext += String.fromCharCode(c & 63 | 128);
            }

          }

          return utftext;
        };

        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7,S12 = 12,S13 = 17,S14 = 22;
        var S21 = 5,S22 = 9,S23 = 14,S24 = 20;
        var S31 = 4,S32 = 11,S33 = 16,S34 = 23;
        var S41 = 6,S42 = 10,S43 = 15,S44 = 21;

        string = Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301;b = 0xEFCDAB89;c = 0x98BADCFE;d = 0x10325476;

        for (k = 0; k < x.length; k += 16) {
          AA = a;BB = b;CC = c;DD = d;
          a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
          d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
          c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
          b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
          a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
          d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
          c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
          b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
          a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
          d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
          c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
          b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
          a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
          d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
          c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
          b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
          a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
          d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
          c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
          b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
          a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
          d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
          c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
          b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
          a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
          d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
          c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
          b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
          a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
          d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
          c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
          b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
          a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
          d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
          c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
          b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
          a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
          d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
          c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
          b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
          a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
          d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
          c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
          b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
          a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
          d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
          c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
          b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
          a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
          d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
          c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
          b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
          a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
          d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
          c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
          b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
          a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
          d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
          c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
          b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
          a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
          d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
          c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
          b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
          a = AddUnsigned(a, AA);
          b = AddUnsigned(b, BB);
          c = AddUnsigned(c, CC);
          d = AddUnsigned(d, DD);
        }

        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

        return temp.toLowerCase();
      };

      module.exports = md5;

      /***/},
    /* 9 */
    /***/function (module, exports) {

      var obj2str = function obj2str(obj) {
        var i, key, val;
        var list = [];
        var keyList = Object.keys(obj);
        for (i = 0; i < keyList.length; i++) {
          key = keyList[i];
          val = obj[key] || '';
          list.push(key + '=' + encodeURIComponent(val));
        }
        return list.join('&');
      };

      var request = function request(params, callback) {
        var filePath = params.filePath;
        var headers = params.headers || {};
        var url = params.url;
        var method = params.method;
        var onProgress = params.onProgress;
        var requestTask;

        var cb = function cb(err, response) {
          callback(err, { statusCode: response.statusCode, headers: response.header }, response.data);
        };

        if (filePath) {
          var fileKey;
          var m = url.match(/^(https?:\/\/[^/]+\/)([^/]*\/?)(.*)$/);
          if (params.pathStyle) {
            fileKey = decodeURIComponent(m[3] || '');
            url = m[1] + m[2];
          } else {
            fileKey = decodeURIComponent(m[2] + m[3] || '');
            url = m[1];
          }

          // 整理 postObject 参数
          var formData = {
            'key': fileKey,
            'success_action_status': 200,
            'Signature': headers.Authorization };

          var headerKeys = [
          'Cache-Control',
          'Content-Type',
          'Content-Disposition',
          'Content-Encoding',
          'Expires',
          'x-cos-storage-class',
          'x-cos-security-token'];

          for (var i in params.headers) {
            if (params.headers.hasOwnProperty(i) && (i.indexOf('x-cos-meta-') > -1 || headerKeys.indexOf(i) > -1)) {
              formData[i] = params.headers[i];
            }
          }
          headers['x-cos-acl'] && (formData.acl = headers['x-cos-acl']);
          !formData['Content-Type'] && (formData['Content-Type'] = '');

          var responseHeader = {};
          requestTask = uni.uploadFile({
            url: url,
            method: method,
            name: 'file',
            filePath: filePath,
            formData: formData,
            success: function success(response) {
              !response.header && (response.header = responseHeader);
              cb(null, response);
            },
            fail: function fail(response) {
              cb(response.errMsg, response);
            } });


          requestTask.onHeadersReceived && requestTask.onHeadersReceived(function (res) {
            responseHeader = res.header;
          });

          requestTask.onProgressUpdate(function (res) {
            onProgress({
              loaded: res.totalBytesSent,
              total: res.totalBytesExpectedToSend,
              progress: res.progress / 100 });

          });
        } else {
          var qsStr = params.qs && obj2str(params.qs) || '';
          if (qsStr) {
            url += (url.indexOf('?') > -1 ? '&' : '?') + qsStr;
          }
          headers['Content-Length'] && delete headers['Content-Length'];
          uni.request({
            url: url,
            method: method,
            header: headers,
            dataType: 'text',
            data: params.body,
            success: function success(response) {
              cb(null, response);
            },
            fail: function fail(response) {
              cb(response.errMsg, response);
            } });

        }

        return requestTask;
      };

      module.exports = request;

      /***/},
    /* 10 */
    /***/function (module, exports, __webpack_require__) {

      /*
                                                           Copyright 2011-2013 Abdulla Abdurakhmanov
                                                           Original sources are available at https://code.google.com/p/x2js/
                                                           Licensed under the Apache License, Version 2.0 (the "License");
                                                           you may not use this file except in compliance with the License.
                                                           You may obtain a copy of the License at
                                                           http://www.apache.org/licenses/LICENSE-2.0
                                                           Unless required by applicable law or agreed to in writing, software
                                                           distributed under the License is distributed on an "AS IS" BASIS,
                                                           WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                           See the License for the specific language governing permissions and
                                                           limitations under the License.
                                                           */
      var DOMParser = __webpack_require__(11).DOMParser;

      var x2js = function x2js(config) {
        'use strict';

        var VERSION = "1.2.0";

        config = config || {};
        initConfigDefaults();
        initRequiredPolyfills();

        function initConfigDefaults() {
          if (config.escapeMode === undefined) {
            config.escapeMode = true;
          }

          config.attributePrefix = config.attributePrefix || "_";
          config.arrayAccessForm = config.arrayAccessForm || "none";
          config.emptyNodeForm = config.emptyNodeForm || "text";

          if (config.enableToStringFunc === undefined) {
            config.enableToStringFunc = true;
          }
          config.arrayAccessFormPaths = config.arrayAccessFormPaths || [];
          if (config.skipEmptyTextNodesForObj === undefined) {
            config.skipEmptyTextNodesForObj = true;
          }
          if (config.stripWhitespaces === undefined) {
            config.stripWhitespaces = true;
          }
          config.datetimeAccessFormPaths = config.datetimeAccessFormPaths || [];

          if (config.useDoubleQuotes === undefined) {
            config.useDoubleQuotes = false;
          }

          config.xmlElementsFilter = config.xmlElementsFilter || [];
          config.jsonPropertiesFilter = config.jsonPropertiesFilter || [];

          if (config.keepCData === undefined) {
            config.keepCData = false;
          }
        }

        var DOMNodeTypes = {
          ELEMENT_NODE: 1,
          TEXT_NODE: 3,
          CDATA_SECTION_NODE: 4,
          COMMENT_NODE: 8,
          DOCUMENT_NODE: 9 };


        function initRequiredPolyfills() {
        }

        function getNodeLocalName(node) {
          var nodeLocalName = node.localName;
          if (nodeLocalName == null) // Yeah, this is IE!!
            nodeLocalName = node.baseName;
          if (nodeLocalName == null || nodeLocalName == "") // =="" is IE too
            nodeLocalName = node.nodeName;
          return nodeLocalName;
        }

        function getNodePrefix(node) {
          return node.prefix;
        }

        function escapeXmlChars(str) {
          if (typeof str == "string")
          return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');else

          return str;
        }

        function unescapeXmlChars(str) {
          return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
        }

        function checkInStdFiltersArrayForm(stdFiltersArrayForm, obj, name, path) {
          var idx = 0;
          for (; idx < stdFiltersArrayForm.length; idx++) {
            var filterPath = stdFiltersArrayForm[idx];
            if (typeof filterPath === "string") {
              if (filterPath == path)
              break;
            } else

            if (filterPath instanceof RegExp) {
              if (filterPath.test(path))
              break;
            } else

            if (typeof filterPath === "function") {
              if (filterPath(obj, name, path))
              break;
            }
          }
          return idx != stdFiltersArrayForm.length;
        }

        function toArrayAccessForm(obj, childName, path) {
          switch (config.arrayAccessForm) {
            case "property":
              if (!(obj[childName] instanceof Array))
              obj[childName + "_asArray"] = [obj[childName]];else

              obj[childName + "_asArray"] = obj[childName];
              break;
            /*case "none":
                      break;*/}


          if (!(obj[childName] instanceof Array) && config.arrayAccessFormPaths.length > 0) {
            if (checkInStdFiltersArrayForm(config.arrayAccessFormPaths, obj, childName, path)) {
              obj[childName] = [obj[childName]];
            }
          }
        }

        function fromXmlDateTime(prop) {
          // Implementation based up on http://stackoverflow.com/questions/8178598/xml-datetime-to-javascript-date-object
          // Improved to support full spec and optional parts
          var bits = prop.split(/[-T:+Z]/g);

          var d = new Date(bits[0], bits[1] - 1, bits[2]);
          var secondBits = bits[5].split("\.");
          d.setHours(bits[3], bits[4], secondBits[0]);
          if (secondBits.length > 1)
          d.setMilliseconds(secondBits[1]);

          // Get supplied time zone offset in minutes
          if (bits[6] && bits[7]) {
            var offsetMinutes = bits[6] * 60 + Number(bits[7]);
            var sign = /\d\d-\d\d:\d\d$/.test(prop) ? '-' : '+';

            // Apply the sign
            offsetMinutes = 0 + (sign == '-' ? -1 * offsetMinutes : offsetMinutes);

            // Apply offset and local timezone
            d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset());
          } else

          if (prop.indexOf("Z", prop.length - 1) !== -1) {
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));
          }

          // d is now a local time equivalent to the supplied time
          return d;
        }

        function checkFromXmlDateTimePaths(value, childName, fullPath) {
          if (config.datetimeAccessFormPaths.length > 0) {
            var path = fullPath.split("\.#")[0];
            if (checkInStdFiltersArrayForm(config.datetimeAccessFormPaths, value, childName, path)) {
              return fromXmlDateTime(value);
            } else

            return value;
          } else

          return value;
        }

        function checkXmlElementsFilter(obj, childType, childName, childPath) {
          if (childType == DOMNodeTypes.ELEMENT_NODE && config.xmlElementsFilter.length > 0) {
            return checkInStdFiltersArrayForm(config.xmlElementsFilter, obj, childName, childPath);
          } else

          return true;
        }

        function parseDOMChildren(node, path) {
          if (node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
            var result = new Object();
            var nodeChildren = node.childNodes;
            // Alternative for firstElementChild which is not supported in some environments
            for (var cidx = 0; cidx < nodeChildren.length; cidx++) {
              var child = nodeChildren.item(cidx);
              if (child.nodeType == DOMNodeTypes.ELEMENT_NODE) {
                var childName = getNodeLocalName(child);
                result[childName] = parseDOMChildren(child, childName);
              }
            }
            return result;
          } else

          if (node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
            var result = new Object();
            result.__cnt = 0;

            var nodeChildren = node.childNodes;

            // Children nodes
            for (var cidx = 0; cidx < nodeChildren.length; cidx++) {
              var child = nodeChildren.item(cidx); // nodeChildren[cidx];
              var childName = getNodeLocalName(child);

              if (child.nodeType != DOMNodeTypes.COMMENT_NODE) {
                var childPath = path + "." + childName;
                if (checkXmlElementsFilter(result, child.nodeType, childName, childPath)) {
                  result.__cnt++;
                  if (result[childName] == null) {
                    result[childName] = parseDOMChildren(child, childPath);
                    toArrayAccessForm(result, childName, childPath);
                  } else
                  {
                    if (result[childName] != null) {
                      if (!(result[childName] instanceof Array)) {
                        result[childName] = [result[childName]];
                        toArrayAccessForm(result, childName, childPath);
                      }
                    }
                    result[childName][result[childName].length] = parseDOMChildren(child, childPath);
                  }
                }
              }
            }

            // Attributes
            for (var aidx = 0; aidx < node.attributes.length; aidx++) {
              var attr = node.attributes.item(aidx); // [aidx];
              result.__cnt++;
              result[config.attributePrefix + attr.name] = attr.value;
            }

            // Node namespace prefix
            var nodePrefix = getNodePrefix(node);
            if (nodePrefix != null && nodePrefix != "") {
              result.__cnt++;
              result.__prefix = nodePrefix;
            }

            if (result["#text"] != null) {
              result.__text = result["#text"];
              if (result.__text instanceof Array) {
                result.__text = result.__text.join("\n");
              }
              //if(config.escapeMode)
              //	result.__text = unescapeXmlChars(result.__text);
              if (config.stripWhitespaces)
              result.__text = result.__text.trim();
              delete result["#text"];
              if (config.arrayAccessForm == "property")
              delete result["#text_asArray"];
              result.__text = checkFromXmlDateTimePaths(result.__text, childName, path + "." + childName);
            }
            if (result["#cdata-section"] != null) {
              result.__cdata = result["#cdata-section"];
              delete result["#cdata-section"];
              if (config.arrayAccessForm == "property")
              delete result["#cdata-section_asArray"];
            }

            if (result.__cnt == 0 && config.emptyNodeForm == "text") {
              result = '';
            } else

            if (result.__cnt == 1 && result.__text != null) {
              result = result.__text;
            } else

            if (result.__cnt == 1 && result.__cdata != null && !config.keepCData) {
              result = result.__cdata;
            } else

            if (result.__cnt > 1 && result.__text != null && config.skipEmptyTextNodesForObj) {
              if (config.stripWhitespaces && result.__text == "" || result.__text.trim() == "") {
                delete result.__text;
              }
            }
            delete result.__cnt;

            if (config.enableToStringFunc && (result.__text != null || result.__cdata != null)) {
              result.toString = function () {
                return (this.__text != null ? this.__text : '') + (this.__cdata != null ? this.__cdata : '');
              };
            }

            return result;
          } else

          if (node.nodeType == DOMNodeTypes.TEXT_NODE || node.nodeType == DOMNodeTypes.CDATA_SECTION_NODE) {
            return node.nodeValue;
          }
        }

        function startTag(jsonObj, element, attrList, closed) {
          var resultStr = "<" + (jsonObj != null && jsonObj.__prefix != null ? jsonObj.__prefix + ":" : "") + element;
          if (attrList != null) {
            for (var aidx = 0; aidx < attrList.length; aidx++) {
              var attrName = attrList[aidx];
              var attrVal = jsonObj[attrName];
              if (config.escapeMode)
              attrVal = escapeXmlChars(attrVal);
              resultStr += " " + attrName.substr(config.attributePrefix.length) + "=";
              if (config.useDoubleQuotes)
              resultStr += '"' + attrVal + '"';else

              resultStr += "'" + attrVal + "'";
            }
          }
          if (!closed)
          resultStr += ">";else

          resultStr += "/>";
          return resultStr;
        }

        function endTag(jsonObj, elementName) {
          return "</" + (jsonObj.__prefix != null ? jsonObj.__prefix + ":" : "") + elementName + ">";
        }

        function endsWith(str, suffix) {
          return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }

        function jsonXmlSpecialElem(jsonObj, jsonObjField) {
          if (config.arrayAccessForm == "property" && endsWith(jsonObjField.toString(), "_asArray") ||
          jsonObjField.toString().indexOf(config.attributePrefix) == 0 ||
          jsonObjField.toString().indexOf("__") == 0 ||
          jsonObj[jsonObjField] instanceof Function)
          return true;else

          return false;
        }

        function jsonXmlElemCount(jsonObj) {
          var elementsCnt = 0;
          if (jsonObj instanceof Object) {
            for (var it in jsonObj) {
              if (jsonXmlSpecialElem(jsonObj, it))
              continue;
              elementsCnt++;
            }
          }
          return elementsCnt;
        }

        function checkJsonObjPropertiesFilter(jsonObj, propertyName, jsonObjPath) {
          return config.jsonPropertiesFilter.length == 0 ||
          jsonObjPath == "" ||
          checkInStdFiltersArrayForm(config.jsonPropertiesFilter, jsonObj, propertyName, jsonObjPath);
        }

        function parseJSONAttributes(jsonObj) {
          var attrList = [];
          if (jsonObj instanceof Object) {
            for (var ait in jsonObj) {
              if (ait.toString().indexOf("__") == -1 && ait.toString().indexOf(config.attributePrefix) == 0) {
                attrList.push(ait);
              }
            }
          }
          return attrList;
        }

        function parseJSONTextAttrs(jsonTxtObj) {
          var result = "";

          if (jsonTxtObj.__cdata != null) {
            result += "<![CDATA[" + jsonTxtObj.__cdata + "]]>";
          }

          if (jsonTxtObj.__text != null) {
            if (config.escapeMode)
            result += escapeXmlChars(jsonTxtObj.__text);else

            result += jsonTxtObj.__text;
          }
          return result;
        }

        function parseJSONTextObject(jsonTxtObj) {
          var result = "";

          if (jsonTxtObj instanceof Object) {
            result += parseJSONTextAttrs(jsonTxtObj);
          } else

          if (jsonTxtObj != null) {
            if (config.escapeMode)
            result += escapeXmlChars(jsonTxtObj);else

            result += jsonTxtObj;
          }

          return result;
        }

        function getJsonPropertyPath(jsonObjPath, jsonPropName) {
          if (jsonObjPath === "") {
            return jsonPropName;
          } else

          return jsonObjPath + "." + jsonPropName;
        }

        function parseJSONArray(jsonArrRoot, jsonArrObj, attrList, jsonObjPath) {
          var result = "";
          if (jsonArrRoot.length == 0) {
            result += startTag(jsonArrRoot, jsonArrObj, attrList, true);
          } else
          {
            for (var arIdx = 0; arIdx < jsonArrRoot.length; arIdx++) {
              result += startTag(jsonArrRoot[arIdx], jsonArrObj, parseJSONAttributes(jsonArrRoot[arIdx]), false);
              result += parseJSONObject(jsonArrRoot[arIdx], getJsonPropertyPath(jsonObjPath, jsonArrObj));
              result += endTag(jsonArrRoot[arIdx], jsonArrObj);
            }
          }
          return result;
        }

        function parseJSONObject(jsonObj, jsonObjPath) {
          var result = "";

          var elementsCnt = jsonXmlElemCount(jsonObj);

          if (elementsCnt > 0) {
            for (var it in jsonObj) {

              if (jsonXmlSpecialElem(jsonObj, it) || jsonObjPath != "" && !checkJsonObjPropertiesFilter(jsonObj, it, getJsonPropertyPath(jsonObjPath, it)))
              continue;

              var subObj = jsonObj[it];

              var attrList = parseJSONAttributes(subObj);

              if (subObj == null || subObj == undefined) {
                result += startTag(subObj, it, attrList, true);
              } else

              if (subObj instanceof Object) {

                if (subObj instanceof Array) {
                  result += parseJSONArray(subObj, it, attrList, jsonObjPath);
                } else
                if (subObj instanceof Date) {
                  result += startTag(subObj, it, attrList, false);
                  result += subObj.toISOString();
                  result += endTag(subObj, it);
                } else
                {
                  var subObjElementsCnt = jsonXmlElemCount(subObj);
                  if (subObjElementsCnt > 0 || subObj.__text != null || subObj.__cdata != null) {
                    result += startTag(subObj, it, attrList, false);
                    result += parseJSONObject(subObj, getJsonPropertyPath(jsonObjPath, it));
                    result += endTag(subObj, it);
                  } else
                  {
                    result += startTag(subObj, it, attrList, true);
                  }
                }
              } else
              {
                result += startTag(subObj, it, attrList, false);
                result += parseJSONTextObject(subObj);
                result += endTag(subObj, it);
              }
            }
          }
          result += parseJSONTextObject(jsonObj);

          return result;
        }

        this.parseXmlString = function (xmlDocStr) {
          // var isIEParser = window.ActiveXObject || "ActiveXObject" in window;
          var isIEParser = false;
          if (xmlDocStr === undefined) {
            return null;
          }
          var xmlDoc;
          if (DOMParser) {
            var parser = new DOMParser();
            var parsererrorNS = null;
            // IE9+ now is here
            if (!isIEParser) {
              try {
                parsererrorNS = parser.parseFromString("INVALID", "text/xml").getElementsByTagName("parsererror")[0].namespaceURI;
              }
              catch (err) {
                parsererrorNS = null;
              }
            }
            try {
              xmlDoc = parser.parseFromString(xmlDocStr, "text/xml");
              if (parsererrorNS != null && xmlDoc.getElementsByTagNameNS(parsererrorNS, "parsererror").length > 0) {
                //throw new Error('Error parsing XML: '+xmlDocStr);
                xmlDoc = null;
              }
            }
            catch (err) {
              xmlDoc = null;
            }
          } else
          {
            // IE :(
            if (xmlDocStr.indexOf("<?") == 0) {
              xmlDocStr = xmlDocStr.substr(xmlDocStr.indexOf("?>") + 2);
            }
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlDocStr);
          }
          return xmlDoc;
        };

        this.asArray = function (prop) {
          if (prop === undefined || prop == null)
          return [];else

          if (prop instanceof Array)
          return prop;else

          return [prop];
        };

        this.toXmlDateTime = function (dt) {
          if (dt instanceof Date)
          return dt.toISOString();else

          if (typeof dt === 'number')
          return new Date(dt).toISOString();else

          return null;
        };

        this.asDateTime = function (prop) {
          if (typeof prop == "string") {
            return fromXmlDateTime(prop);
          } else

          return prop;
        };

        this.xml2json = function (xmlDoc) {
          return parseDOMChildren(xmlDoc);
        };

        this.xml_str2json = function (xmlDocStr) {
          var xmlDoc = this.parseXmlString(xmlDocStr);
          if (xmlDoc != null)
          return this.xml2json(xmlDoc);else

          return null;
        };

        this.json2xml_str = function (jsonObj) {
          return parseJSONObject(jsonObj, "");
        };

        this.json2xml = function (jsonObj) {
          var xmlDocStr = this.json2xml_str(jsonObj);
          return this.parseXmlString(xmlDocStr);
        };

        this.getVersion = function () {
          return VERSION;
        };
      };

      var xml2json = function xml2json(str) {
        if (!str) return null;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(str, "text/xml");
        var x2jsObj = new x2js();
        var data = x2jsObj.xml2json(xmlDoc);
        if (data.html && data.getElementsByTagName('parsererror').length) {
          return null;
        } else {
          return data;
        }
      };

      var json2xml = function json2xml(data) {
        var x2jsObj = new x2js();
        return x2jsObj.json2xml(data);
      };

      module.exports = xml2json;

      /***/},
    /* 11 */
    /***/function (module, exports, __webpack_require__) {

      function DOMParser(options) {
        this.options = options || { locator: {} };

      }
      DOMParser.prototype.parseFromString = function (source, mimeType) {
        var options = this.options;
        var sax = new XMLReader();
        var domBuilder = options.domBuilder || new DOMHandler(); //contentHandler and LexicalHandler
        var errorHandler = options.errorHandler;
        var locator = options.locator;
        var defaultNSMap = options.xmlns || {};
        var entityMap = { 'lt': '<', 'gt': '>', 'amp': '&', 'quot': '"', 'apos': "'" };
        if (locator) {
          domBuilder.setDocumentLocator(locator);
        }

        sax.errorHandler = buildErrorHandler(errorHandler, domBuilder, locator);
        sax.domBuilder = options.domBuilder || domBuilder;
        if (/\/x?html?$/.test(mimeType)) {
          entityMap.nbsp = '\xa0';
          entityMap.copy = '\xa9';
          defaultNSMap[''] = 'http://www.w3.org/1999/xhtml';
        }
        defaultNSMap.xml = defaultNSMap.xml || 'http://www.w3.org/XML/1998/namespace';
        if (source) {
          sax.parse(source, defaultNSMap, entityMap);
        } else {
          sax.errorHandler.error("invalid doc source");
        }
        return domBuilder.doc;
      };
      function buildErrorHandler(errorImpl, domBuilder, locator) {
        if (!errorImpl) {
          if (domBuilder instanceof DOMHandler) {
            return domBuilder;
          }
          errorImpl = domBuilder;
        }
        var errorHandler = {};
        var isCallback = errorImpl instanceof Function;
        locator = locator || {};
        function build(key) {
          var fn = errorImpl[key];
          if (!fn && isCallback) {
            fn = errorImpl.length == 2 ? function (msg) {errorImpl(key, msg);} : errorImpl;
          }
          errorHandler[key] = fn && function (msg) {
            fn('[xmldom ' + key + ']\t' + msg + _locator(locator));
          } || function () {};
        }
        build('warning');
        build('error');
        build('fatalError');
        return errorHandler;
      }

      //console.log('#\n\n\n\n\n\n\n####')
      /**
       * +ContentHandler+ErrorHandler
       * +LexicalHandler+EntityResolver2
       * -DeclHandler-DTDHandler 
       * 
       * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
       * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
       * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
       */
      function DOMHandler() {
        this.cdata = false;
      }
      function position(locator, node) {
        node.lineNumber = locator.lineNumber;
        node.columnNumber = locator.columnNumber;
      }
      /**
         * @see org.xml.sax.ContentHandler#startDocument
         * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
         */
      DOMHandler.prototype = {
        startDocument: function startDocument() {
          this.doc = new DOMImplementation().createDocument(null, null, null);
          if (this.locator) {
            this.doc.documentURI = this.locator.systemId;
          }
        },
        startElement: function startElement(namespaceURI, localName, qName, attrs) {
          var doc = this.doc;
          var el = doc.createElementNS(namespaceURI, qName || localName);
          var len = attrs.length;
          appendElement(this, el);
          this.currentElement = el;

          this.locator && position(this.locator, el);
          for (var i = 0; i < len; i++) {
            var namespaceURI = attrs.getURI(i);
            var value = attrs.getValue(i);
            var qName = attrs.getQName(i);
            var attr = doc.createAttributeNS(namespaceURI, qName);
            this.locator && position(attrs.getLocator(i), attr);
            attr.value = attr.nodeValue = value;
            el.setAttributeNode(attr);
          }
        },
        endElement: function endElement(namespaceURI, localName, qName) {
          var current = this.currentElement;
          var tagName = current.tagName;
          this.currentElement = current.parentNode;
        },
        startPrefixMapping: function startPrefixMapping(prefix, uri) {
        },
        endPrefixMapping: function endPrefixMapping(prefix) {
        },
        processingInstruction: function processingInstruction(target, data) {
          var ins = this.doc.createProcessingInstruction(target, data);
          this.locator && position(this.locator, ins);
          appendElement(this, ins);
        },
        ignorableWhitespace: function ignorableWhitespace(ch, start, length) {
        },
        characters: function characters(chars, start, length) {
          chars = _toString.apply(this, arguments);
          //console.log(chars)
          if (chars) {
            if (this.cdata) {
              var charNode = this.doc.createCDATASection(chars);
            } else {
              var charNode = this.doc.createTextNode(chars);
            }
            if (this.currentElement) {
              this.currentElement.appendChild(charNode);
            } else if (/^\s*$/.test(chars)) {
              this.doc.appendChild(charNode);
              //process xml
            }
            this.locator && position(this.locator, charNode);
          }
        },
        skippedEntity: function skippedEntity(name) {
        },
        endDocument: function endDocument() {
          this.doc.normalize();
        },
        setDocumentLocator: function setDocumentLocator(locator) {
          if (this.locator = locator) {// && !('lineNumber' in locator)){
            locator.lineNumber = 0;
          }
        },
        //LexicalHandler
        comment: function comment(chars, start, length) {
          chars = _toString.apply(this, arguments);
          var comm = this.doc.createComment(chars);
          this.locator && position(this.locator, comm);
          appendElement(this, comm);
        },

        startCDATA: function startCDATA() {
          //used in characters() methods
          this.cdata = true;
        },
        endCDATA: function endCDATA() {
          this.cdata = false;
        },

        startDTD: function startDTD(name, publicId, systemId) {
          var impl = this.doc.implementation;
          if (impl && impl.createDocumentType) {
            var dt = impl.createDocumentType(name, publicId, systemId);
            this.locator && position(this.locator, dt);
            appendElement(this, dt);
          }
        },
        /**
            * @see org.xml.sax.ErrorHandler
            * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
            */
        warning: function warning(error) {
          console.warn('[xmldom warning]\t' + error, _locator(this.locator));
        },
        error: function error(_error) {
          console.error('[xmldom error]\t' + _error, _locator(this.locator));
        },
        fatalError: function fatalError(error) {
          console.error('[xmldom fatalError]\t' + error, _locator(this.locator));
          throw error;
        } };

      function _locator(l) {
        if (l) {
          return '\n@' + (l.systemId || '') + '#[line:' + l.lineNumber + ',col:' + l.columnNumber + ']';
        }
      }
      function _toString(chars, start, length) {
        if (typeof chars == 'string') {
          return chars.substr(start, length);
        } else {//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
          if (chars.length >= start + length || start) {
            return new java.lang.String(chars, start, length) + '';
          }
          return chars;
        }
      }

      /*
         * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
         * used method of org.xml.sax.ext.LexicalHandler:
         *  #comment(chars, start, length)
         *  #startCDATA()
         *  #endCDATA()
         *  #startDTD(name, publicId, systemId)
         *
         *
         * IGNORED method of org.xml.sax.ext.LexicalHandler:
         *  #endDTD()
         *  #startEntity(name)
         *  #endEntity(name)
         *
         *
         * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
         * IGNORED method of org.xml.sax.ext.DeclHandler
         * 	#attributeDecl(eName, aName, type, mode, value)
         *  #elementDecl(name, model)
         *  #externalEntityDecl(name, publicId, systemId)
         *  #internalEntityDecl(name, value)
         * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
         * IGNORED method of org.xml.sax.EntityResolver2
         *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
         *  #resolveEntity(publicId, systemId)
         *  #getExternalSubset(name, baseURI)
         * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
         * IGNORED method of org.xml.sax.DTDHandler
         *  #notationDecl(name, publicId, systemId) {};
         *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
         */
      "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function (key) {
        DOMHandler.prototype[key] = function () {return null;};
      });

      /* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
      function appendElement(hander, node) {
        if (!hander.currentElement) {
          hander.doc.appendChild(node);
        } else {
          hander.currentElement.appendChild(node);
        }
      } //appendChild and setAttributeNS are preformance key

      //if(typeof require == 'function'){
      var XMLReader = __webpack_require__(12).XMLReader;
      var DOMImplementation = exports.DOMImplementation = __webpack_require__(2).DOMImplementation;
      exports.XMLSerializer = __webpack_require__(2).XMLSerializer;
      exports.DOMParser = DOMParser;
      //}


      /***/},
    /* 12 */
    /***/function (module, exports) {

      //[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
      //[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
      //[5]   	Name	   ::=   	NameStartChar (NameChar)*
      var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/; //\u10000-\uEFFFF
      var nameChar = new RegExp("[\\-\\.0-9" + nameStartChar.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
      var tagNamePattern = new RegExp('^' + nameStartChar.source + nameChar.source + '*(?:\:' + nameStartChar.source + nameChar.source + '*)?$');
      //var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
      //var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

      //S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
      //S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
      var S_TAG = 0; //tag name offerring
      var S_ATTR = 1; //attr name offerring 
      var S_ATTR_SPACE = 2; //attr name end and space offer
      var S_EQ = 3; //=space?
      var S_ATTR_NOQUOT_VALUE = 4; //attr value(no quot value only)
      var S_ATTR_END = 5; //attr value end and no space(quot end)
      var S_TAG_SPACE = 6; //(attr value end || tag end ) && (space offer)
      var S_TAG_CLOSE = 7; //closed el<el />

      function XMLReader() {

      }

      XMLReader.prototype = {
        parse: function parse(source, defaultNSMap, entityMap) {
          var domBuilder = this.domBuilder;
          domBuilder.startDocument();
          _copy(defaultNSMap, defaultNSMap = {});
          _parse(source, defaultNSMap, entityMap,
          domBuilder, this.errorHandler);
          domBuilder.endDocument();
        } };

      function _parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
        function fixedFromCharCode(code) {
          // String.prototype.fromCharCode does not supports
          // > 2 bytes unicode chars directly
          if (code > 0xffff) {
            code -= 0x10000;
            var surrogate1 = 0xd800 + (code >> 10),
            surrogate2 = 0xdc00 + (code & 0x3ff);

            return String.fromCharCode(surrogate1, surrogate2);
          } else {
            return String.fromCharCode(code);
          }
        }
        function entityReplacer(a) {
          var k = a.slice(1, -1);
          if (k in entityMap) {
            return entityMap[k];
          } else if (k.charAt(0) === '#') {
            return fixedFromCharCode(parseInt(k.substr(1).replace('x', '0x')));
          } else {
            errorHandler.error('entity not found:' + a);
            return a;
          }
        }
        function appendText(end) {//has some bugs
          if (end > start) {
            var xt = source.substring(start, end).replace(/&#?\w+;/g, entityReplacer);
            locator && position(start);
            domBuilder.characters(xt, 0, end - start);
            start = end;
          }
        }
        function position(p, m) {
          while (p >= lineEnd && (m = linePattern.exec(source))) {
            lineStart = m.index;
            lineEnd = lineStart + m[0].length;
            locator.lineNumber++;
            //console.log('line++:',locator,startPos,endPos)
          }
          locator.columnNumber = p - lineStart + 1;
        }
        var lineStart = 0;
        var lineEnd = 0;
        var linePattern = /.*(?:\r\n?|\n)|.*$/g;
        var locator = domBuilder.locator;

        var parseStack = [{ currentNSMap: defaultNSMapCopy }];
        var closeMap = {};
        var start = 0;
        while (true) {
          try {
            var tagStart = source.indexOf('<', start);
            if (tagStart < 0) {
              if (!source.substr(start).match(/^\s*$/)) {
                var doc = domBuilder.doc;
                var text = doc.createTextNode(source.substr(start));
                doc.appendChild(text);
                domBuilder.currentElement = text;
              }
              return;
            }
            if (tagStart > start) {
              appendText(tagStart);
            }
            switch (source.charAt(tagStart + 1)) {
              case '/':
                var end = source.indexOf('>', tagStart + 3);
                var tagName = source.substring(tagStart + 2, end);
                var config = parseStack.pop();
                if (end < 0) {

                  tagName = source.substring(tagStart + 2).replace(/[\s<].*/, '');
                  //console.error('#@@@@@@'+tagName)
                  errorHandler.error("end tag name: " + tagName + ' is not complete:' + config.tagName);
                  end = tagStart + 1 + tagName.length;
                } else if (tagName.match(/\s</)) {
                  tagName = tagName.replace(/[\s<].*/, '');
                  errorHandler.error("end tag name: " + tagName + ' maybe not complete');
                  end = tagStart + 1 + tagName.length;
                }
                //console.error(parseStack.length,parseStack)
                //console.error(config);
                var localNSMap = config.localNSMap;
                var endMatch = config.tagName == tagName;
                var endIgnoreCaseMach = endMatch || config.tagName && config.tagName.toLowerCase() == tagName.toLowerCase();
                if (endIgnoreCaseMach) {
                  domBuilder.endElement(config.uri, config.localName, tagName);
                  if (localNSMap) {
                    for (var prefix in localNSMap) {
                      domBuilder.endPrefixMapping(prefix);
                    }
                  }
                  if (!endMatch) {
                    errorHandler.fatalError("end tag name: " + tagName + ' is not match the current start tagName:' + config.tagName);
                  }
                } else {
                  parseStack.push(config);
                }

                end++;
                break;
              // end elment
              case '?': // <?...?>
                locator && position(tagStart);
                end = parseInstruction(source, tagStart, domBuilder);
                break;
              case '!': // <!doctype,<![CDATA,<!--
                locator && position(tagStart);
                end = parseDCC(source, tagStart, domBuilder, errorHandler);
                break;
              default:
                locator && position(tagStart);
                var el = new ElementAttributes();
                var currentNSMap = parseStack[parseStack.length - 1].currentNSMap;
                //elStartEnd
                var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler);
                var len = el.length;


                if (!el.closed && fixSelfClosed(source, end, el.tagName, closeMap)) {
                  el.closed = true;
                  if (!entityMap.nbsp) {
                    errorHandler.warning('unclosed xml attribute');
                  }
                }
                if (locator && len) {
                  var locator2 = copyLocator(locator, {});
                  //try{//attribute position fixed
                  for (var i = 0; i < len; i++) {
                    var a = el[i];
                    position(a.offset);
                    a.locator = copyLocator(locator, {});
                  }
                  //}catch(e){console.error('@@@@@'+e)}
                  domBuilder.locator = locator2;
                  if (appendElement(el, domBuilder, currentNSMap)) {
                    parseStack.push(el);
                  }
                  domBuilder.locator = locator;
                } else {
                  if (appendElement(el, domBuilder, currentNSMap)) {
                    parseStack.push(el);
                  }
                }



                if (el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed) {
                  end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder);
                } else {
                  end++;
                }}

          } catch (e) {
            errorHandler.error('element parse error: ' + e);
            //errorHandler.error('element parse error: '+e);
            end = -1;
            //throw e;
          }
          if (end > start) {
            start = end;
          } else {
            //TODO: 这里有可能sax回退，有位置错误风险
            appendText(Math.max(tagStart, start) + 1);
          }
        }
      }
      function copyLocator(f, t) {
        t.lineNumber = f.lineNumber;
        t.columnNumber = f.columnNumber;
        return t;
      }

      /**
         * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
         * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
         */
      function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler) {
        var attrName;
        var value;
        var p = ++start;
        var s = S_TAG; //status
        while (true) {
          var c = source.charAt(p);
          switch (c) {
            case '=':
              if (s === S_ATTR) {//attrName
                attrName = source.slice(start, p);
                s = S_EQ;
              } else if (s === S_ATTR_SPACE) {
                s = S_EQ;
              } else {
                //fatalError: equal must after attrName or space after attrName
                throw new Error('attribute equal must after attrName');
              }
              break;
            case '\'':
            case '"':
              if (s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
              ) {//equal
                  if (s === S_ATTR) {
                    errorHandler.warning('attribute value must after "="');
                    attrName = source.slice(start, p);
                  }
                  start = p + 1;
                  p = source.indexOf(c, start);
                  if (p > 0) {
                    value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
                    el.add(attrName, value, start - 1);
                    s = S_ATTR_END;
                  } else {
                    //fatalError: no end quot match
                    throw new Error('attribute value no end \'' + c + '\' match');
                  }
                } else if (s == S_ATTR_NOQUOT_VALUE) {
                value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
                //console.log(attrName,value,start,p)
                el.add(attrName, value, start);
                //console.dir(el)
                errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ')!!');
                start = p + 1;
                s = S_ATTR_END;
              } else {
                //fatalError: no equal before
                throw new Error('attribute value must after "="');
              }
              break;
            case '/':
              switch (s) {
                case S_TAG:
                  el.setTagName(source.slice(start, p));
                case S_ATTR_END:
                case S_TAG_SPACE:
                case S_TAG_CLOSE:
                  s = S_TAG_CLOSE;
                  el.closed = true;
                case S_ATTR_NOQUOT_VALUE:
                case S_ATTR:
                case S_ATTR_SPACE:
                  break;
                //case S_EQ:
                default:
                  throw new Error("attribute invalid close char('/')");}

              break;
            case '': //end document
              //throw new Error('unexpected end of input')
              errorHandler.error('unexpected end of input');
              if (s == S_TAG) {
                el.setTagName(source.slice(start, p));
              }
              return p;
            case '>':
              switch (s) {
                case S_TAG:
                  el.setTagName(source.slice(start, p));
                case S_ATTR_END:
                case S_TAG_SPACE:
                case S_TAG_CLOSE:
                  break; //normal
                case S_ATTR_NOQUOT_VALUE: //Compatible state
                case S_ATTR:
                  value = source.slice(start, p);
                  if (value.slice(-1) === '/') {
                    el.closed = true;
                    value = value.slice(0, -1);
                  }
                case S_ATTR_SPACE:
                  if (s === S_ATTR_SPACE) {
                    value = attrName;
                  }
                  if (s == S_ATTR_NOQUOT_VALUE) {
                    errorHandler.warning('attribute "' + value + '" missed quot(")!!');
                    el.add(attrName, value.replace(/&#?\w+;/g, entityReplacer), start);
                  } else {
                    if (currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !value.match(/^(?:disabled|checked|selected)$/i)) {
                      errorHandler.warning('attribute "' + value + '" missed value!! "' + value + '" instead!!');
                    }
                    el.add(value, value, start);
                  }
                  break;
                case S_EQ:
                  throw new Error('attribute value missed!!');}

              //			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
              return p;
            /*xml space '\x20' | #x9 | #xD | #xA; */
            case "\x80":
              c = ' ';
            default:
              if (c <= ' ') {//space
                switch (s) {
                  case S_TAG:
                    el.setTagName(source.slice(start, p)); //tagName
                    s = S_TAG_SPACE;
                    break;
                  case S_ATTR:
                    attrName = source.slice(start, p);
                    s = S_ATTR_SPACE;
                    break;
                  case S_ATTR_NOQUOT_VALUE:
                    var value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
                    errorHandler.warning('attribute "' + value + '" missed quot(")!!');
                    el.add(attrName, value, start);
                  case S_ATTR_END:
                    s = S_TAG_SPACE;
                    break;
                  //case S_TAG_SPACE:
                  //case S_EQ:
                  //case S_ATTR_SPACE:
                  //	void();break;
                  //case S_TAG_CLOSE:
                  //ignore warning
                }
              } else {//not space
                //S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
                //S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
                switch (s) {
                  //case S_TAG:void();break;
                  //case S_ATTR:void();break;
                  //case S_ATTR_NOQUOT_VALUE:void();break;
                  case S_ATTR_SPACE:
                    var tagName = el.tagName;
                    if (currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
                      errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!');
                    }
                    el.add(attrName, attrName, start);
                    start = p;
                    s = S_ATTR;
                    break;
                  case S_ATTR_END:
                    errorHandler.warning('attribute space is required"' + attrName + '"!!');
                  case S_TAG_SPACE:
                    s = S_ATTR;
                    start = p;
                    break;
                  case S_EQ:
                    s = S_ATTR_NOQUOT_VALUE;
                    start = p;
                    break;
                  case S_TAG_CLOSE:
                    throw new Error("elements closed character '/' and '>' must be connected to");}

              }}
          //end outer switch
          //console.log('p++',p)
          p++;
        }
      }
      /**
         * @return true if has new namespace define
         */
      function appendElement(el, domBuilder, currentNSMap) {
        var tagName = el.tagName;
        var localNSMap = null;
        //var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
        var i = el.length;
        while (i--) {
          var a = el[i];
          var qName = a.qName;
          var value = a.value;
          var nsp = qName.indexOf(':');
          if (nsp > 0) {
            var prefix = a.prefix = qName.slice(0, nsp);
            var localName = qName.slice(nsp + 1);
            var nsPrefix = prefix === 'xmlns' && localName;
          } else {
            localName = qName;
            prefix = null;
            nsPrefix = qName === 'xmlns' && '';
          }
          //can not set prefix,because prefix !== ''
          a.localName = localName;
          //prefix == null for no ns prefix attribute 
          if (nsPrefix !== false) {//hack!!
            if (localNSMap == null) {
              localNSMap = {};
              //console.log(currentNSMap,0)
              _copy(currentNSMap, currentNSMap = {});
              //console.log(currentNSMap,1)
            }
            currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
            a.uri = 'http://www.w3.org/2000/xmlns/';
            domBuilder.startPrefixMapping(nsPrefix, value);
          }
        }
        var i = el.length;
        while (i--) {
          a = el[i];
          var prefix = a.prefix;
          if (prefix) {//no prefix attribute has no namespace
            if (prefix === 'xml') {
              a.uri = 'http://www.w3.org/XML/1998/namespace';
            }if (prefix !== 'xmlns') {
              a.uri = currentNSMap[prefix || ''];

              //{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
            }
          }
        }
        var nsp = tagName.indexOf(':');
        if (nsp > 0) {
          prefix = el.prefix = tagName.slice(0, nsp);
          localName = el.localName = tagName.slice(nsp + 1);
        } else {
          prefix = null; //important!!
          localName = el.localName = tagName;
        }
        //no prefix element has default namespace
        var ns = el.uri = currentNSMap[prefix || ''];
        domBuilder.startElement(ns, localName, tagName, el);
        //endPrefixMapping and startPrefixMapping have not any help for dom builder
        //localNSMap = null
        if (el.closed) {
          domBuilder.endElement(ns, localName, tagName);
          if (localNSMap) {
            for (prefix in localNSMap) {
              domBuilder.endPrefixMapping(prefix);
            }
          }
        } else {
          el.currentNSMap = currentNSMap;
          el.localNSMap = localNSMap;
          //parseStack.push(el);
          return true;
        }
      }
      function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
        if (/^(?:script|textarea)$/i.test(tagName)) {
          var elEndStart = source.indexOf('</' + tagName + '>', elStartEnd);
          var text = source.substring(elStartEnd + 1, elEndStart);
          if (/[&<]/.test(text)) {
            if (/^script$/i.test(tagName)) {
              //if(!/\]\]>/.test(text)){
              //lexHandler.startCDATA();
              domBuilder.characters(text, 0, text.length);
              //lexHandler.endCDATA();
              return elEndStart;
              //}
            } //}else{//text area
            text = text.replace(/&#?\w+;/g, entityReplacer);
            domBuilder.characters(text, 0, text.length);
            return elEndStart;
            //}

          }
        }
        return elStartEnd + 1;
      }
      function fixSelfClosed(source, elStartEnd, tagName, closeMap) {
        //if(tagName in closeMap){
        var pos = closeMap[tagName];
        if (pos == null) {
          //console.log(tagName)
          pos = source.lastIndexOf('</' + tagName + '>');
          if (pos < elStartEnd) {//忘记闭合
            pos = source.lastIndexOf('</' + tagName);
          }
          closeMap[tagName] = pos;
        }
        return pos < elStartEnd;
        //} 
      }
      function _copy(source, target) {
        for (var n in source) {target[n] = source[n];}
      }
      function parseDCC(source, start, domBuilder, errorHandler) {//sure start with '<!'
        var next = source.charAt(start + 2);
        switch (next) {
          case '-':
            if (source.charAt(start + 3) === '-') {
              var end = source.indexOf('-->', start + 4);
              //append comment source.substring(4,end)//<!--
              if (end > start) {
                domBuilder.comment(source, start + 4, end - start - 4);
                return end + 3;
              } else {
                errorHandler.error("Unclosed comment");
                return -1;
              }
            } else {
              //error
              return -1;
            }
          default:
            if (source.substr(start + 3, 6) == 'CDATA[') {
              var end = source.indexOf(']]>', start + 9);
              domBuilder.startCDATA();
              domBuilder.characters(source, start + 9, end - start - 9);
              domBuilder.endCDATA();
              return end + 3;
            }
            //<!DOCTYPE
            //startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
            var matchs = split(source, start);
            var len = matchs.length;
            if (len > 1 && /!doctype/i.test(matchs[0][0])) {
              var name = matchs[1][0];
              var pubid = len > 3 && /^public$/i.test(matchs[2][0]) && matchs[3][0];
              var sysid = len > 4 && matchs[4][0];
              var lastMatch = matchs[len - 1];
              domBuilder.startDTD(name, pubid && pubid.replace(/^(['"])(.*?)\1$/, '$2'),
              sysid && sysid.replace(/^(['"])(.*?)\1$/, '$2'));
              domBuilder.endDTD();

              return lastMatch.index + lastMatch[0].length;
            }}

        return -1;
      }



      function parseInstruction(source, start, domBuilder) {
        var end = source.indexOf('?>', start);
        if (end) {
          var match = source.substring(start, end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
          if (match) {
            var len = match[0].length;
            domBuilder.processingInstruction(match[1], match[2]);
            return end + 2;
          } else {//error
            return -1;
          }
        }
        return -1;
      }

      /**
         * @param source
         */
      function ElementAttributes(source) {

      }
      ElementAttributes.prototype = {
        setTagName: function setTagName(tagName) {
          if (!tagNamePattern.test(tagName)) {
            throw new Error('invalid tagName:' + tagName);
          }
          this.tagName = tagName;
        },
        add: function add(qName, value, offset) {
          if (!tagNamePattern.test(qName)) {
            throw new Error('invalid attribute:' + qName);
          }
          this[this.length++] = { qName: qName, value: value, offset: offset };
        },
        length: 0,
        getLocalName: function getLocalName(i) {return this[i].localName;},
        getLocator: function getLocator(i) {return this[i].locator;},
        getQName: function getQName(i) {return this[i].qName;},
        getURI: function getURI(i) {return this[i].uri;},
        getValue: function getValue(i) {return this[i].value;}
        //	,getIndex:function(uri, localName)){
        //		if(localName){
        //			
        //		}else{
        //			var qName = uri
        //		}
        //	},
        //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
        //	getType:function(uri,localName){}
        //	getType:function(i){},
      };




      function _set_proto_(thiz, parent) {
        thiz.__proto__ = parent;
        return thiz;
      }
      if (!(_set_proto_({}, _set_proto_.prototype) instanceof _set_proto_)) {
        _set_proto_ = function _set_proto_(thiz, parent) {
          function p() {};
          p.prototype = parent;
          p = new p();
          for (parent in thiz) {
            p[parent] = thiz[parent];
          }
          return p;
        };
      }

      function split(source, start) {
        var match;
        var buf = [];
        var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
        reg.lastIndex = start;
        reg.exec(source); //skip <
        while (match = reg.exec(source)) {
          buf.push(match);
          if (match[1]) return buf;
        }
      }

      exports.XMLReader = XMLReader;



      /***/},
    /* 13 */
    /***/function (module, exports, __webpack_require__) {

      var Async = __webpack_require__(14);
      var EventProxy = __webpack_require__(3).EventProxy;
      var util = __webpack_require__(0);

      // 抛弃分块上传任务
      /*
       AsyncLimit (抛弃上传任务的并发量)，
       UploadId (上传任务的编号，当 Level 为 task 时候需要)
       Level (抛弃分块上传任务的级别，task : 抛弃指定的上传任务，file ： 抛弃指定的文件对应的上传任务，其他值 ：抛弃指定Bucket 的全部上传任务)
       */
      function abortUploadTask(params, callback) {
        var Bucket = params.Bucket;
        var Region = params.Region;
        var Key = params.Key;
        var UploadId = params.UploadId;
        var Level = params.Level || 'task';
        var AsyncLimit = params.AsyncLimit;
        var self = this;

        var ep = new EventProxy();

        ep.on('error', function (errData) {
          return callback(errData);
        });

        // 已经获取到需要抛弃的任务列表
        ep.on('get_abort_array', function (AbortArray) {
          abortUploadTaskArray.call(self, {
            Bucket: Bucket,
            Region: Region,
            Key: Key,
            Headers: params.Headers,
            AsyncLimit: AsyncLimit,
            AbortArray: AbortArray },
          function (err, data) {
            if (err) {
              return callback(err);
            }
            callback(null, data);
          });
        });

        if (Level === 'bucket') {
          // Bucket 级别的任务抛弃，抛弃该 Bucket 下的全部上传任务
          wholeMultipartList.call(self, {
            Bucket: Bucket,
            Region: Region },
          function (err, data) {
            if (err) {
              return callback(err);
            }
            ep.emit('get_abort_array', data.UploadList || []);
          });
        } else if (Level === 'file') {
          // 文件级别的任务抛弃，抛弃该文件的全部上传任务
          if (!Key) return callback({ error: 'abort_upload_task_no_key' });
          wholeMultipartList.call(self, {
            Bucket: Bucket,
            Region: Region,
            Key: Key },
          function (err, data) {
            if (err) {
              return callback(err);
            }
            ep.emit('get_abort_array', data.UploadList || []);
          });
        } else if (Level === 'task') {
          // 单个任务级别的任务抛弃，抛弃指定 UploadId 的上传任务
          if (!UploadId) return callback({ error: 'abort_upload_task_no_id' });
          if (!Key) return callback({ error: 'abort_upload_task_no_key' });
          ep.emit('get_abort_array', [{
            Key: Key,
            UploadId: UploadId }]);

        } else {
          return callback({ error: 'abort_unknown_level' });
        }
      }

      // 批量抛弃分块上传任务
      function abortUploadTaskArray(params, callback) {

        var Bucket = params.Bucket;
        var Region = params.Region;
        var Key = params.Key;
        var AbortArray = params.AbortArray;
        var AsyncLimit = params.AsyncLimit || 1;
        var self = this;

        var index = 0;
        var resultList = new Array(AbortArray.length);
        Async.eachLimit(AbortArray, AsyncLimit, function (AbortItem, callback) {
          var eachIndex = index;
          if (Key && Key !== AbortItem.Key) {
            resultList[eachIndex] = { error: { KeyNotMatch: true } };
            callback(null);
            return;
          }
          var UploadId = AbortItem.UploadId || AbortItem.UploadID;

          self.multipartAbort({
            Bucket: Bucket,
            Region: Region,
            Key: AbortItem.Key,
            Headers: params.Headers,
            UploadId: UploadId },
          function (err, data) {
            var task = {
              Bucket: Bucket,
              Region: Region,
              Key: AbortItem.Key,
              UploadId: UploadId };

            resultList[eachIndex] = { error: err, task: task };
            callback(null);
          });
          index++;

        }, function (err) {
          if (err) {
            return callback(err);
          }

          var successList = [];
          var errorList = [];

          for (var i = 0, len = resultList.length; i < len; i++) {
            var item = resultList[i];
            if (item['task']) {
              if (item['error']) {
                errorList.push(item['task']);
              } else {
                successList.push(item['task']);
              }
            }
          }

          return callback(null, {
            successList: successList,
            errorList: errorList });

        });
      }

      // 获取符合条件的全部上传任务 (条件包括 Bucket, Region, Prefix)
      function wholeMultipartList(params, callback) {
        var self = this;
        var UploadList = [];
        var sendParams = {
          Bucket: params.Bucket,
          Region: params.Region,
          Prefix: params.Key };

        var next = function next() {
          self.multipartList(sendParams, function (err, data) {
            if (err) return callback(err);
            UploadList.push.apply(UploadList, data.Upload || []);
            if (data.IsTruncated == 'true') {// 列表不完整
              sendParams.KeyMarker = data.NextKeyMarker;
              sendParams.UploadIdMarker = data.NextUploadIdMarker;
              next();
            } else {
              callback(null, { UploadList: UploadList });
            }
          });
        };
        next();
      }


      // 分片复制文件
      function sliceCopyFile(params, callback) {
        var ep = new EventProxy();

        var self = this;
        var Bucket = params.Bucket;
        var Region = params.Region;
        var Key = params.Key;
        var CopySource = params.CopySource;
        var m = CopySource.match(/^([^.]+-\d+)\.cos(v6)?\.([^.]+)\.[^/]+\/(.+)$/);
        if (!m) {
          callback({ error: 'CopySource format error' });
          return;
        }

        var SourceBucket = m[1];
        var SourceRegion = m[3];
        var SourceKey = decodeURIComponent(m[4]);
        var CopySliceSize = params.SliceSize === undefined ? self.options.CopySliceSize : params.SliceSize;
        CopySliceSize = Math.max(0, Math.min(CopySliceSize, 5 * 1024 * 1024 * 1024));

        var ChunkSize = params.ChunkSize || this.options.CopyChunkSize;
        var ChunkParallel = this.options.CopyChunkParallelLimit;

        var FinishSize = 0;
        var FileSize;
        var _onProgress;

        // 分片复制完成，开始 multipartComplete 操作
        ep.on('copy_slice_complete', function (UploadData) {
          self.multipartComplete({
            Bucket: Bucket,
            Region: Region,
            Key: Key,
            UploadId: UploadData.UploadId,
            Parts: UploadData.PartList },
          function (err, data) {
            if (err) {
              _onProgress(null, true);
              return callback(err);
            }
            _onProgress({ loaded: FileSize, total: FileSize }, true);
            callback(null, data);
          });
        });

        ep.on('get_copy_data_finish', function (UploadData) {
          Async.eachLimit(UploadData.PartList, ChunkParallel, function (SliceItem, asyncCallback) {
            var PartNumber = SliceItem.PartNumber;
            var CopySourceRange = SliceItem.CopySourceRange;
            var currentSize = SliceItem.end - SliceItem.start;
            var preAddSize = 0;

            copySliceItem.call(self, {
              Bucket: Bucket,
              Region: Region,
              Key: Key,
              CopySource: CopySource,
              UploadId: UploadData.UploadId,
              PartNumber: PartNumber,
              CopySourceRange: CopySourceRange,
              onProgress: function onProgress(data) {
                FinishSize += data.loaded - preAddSize;
                preAddSize = data.loaded;
                _onProgress({ loaded: FinishSize, total: FileSize });
              } },
            function (err, data) {
              if (err) {
                return asyncCallback(err);
              }
              _onProgress({ loaded: FinishSize, total: FileSize });

              FinishSize += currentSize - preAddSize;
              SliceItem.ETag = data.ETag;
              asyncCallback(err || null, data);
            });
          }, function (err) {
            if (err) {
              _onProgress(null, true);
              return callback(err);
            }

            ep.emit('copy_slice_complete', UploadData);
          });
        });

        ep.on('get_file_size_finish', function (SourceHeaders) {
          // 控制分片大小
          (function () {
            var SIZE = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 1024 * 2, 1024 * 4, 1024 * 5];
            var AutoChunkSize = 1024 * 1024;
            for (var i = 0; i < SIZE.length; i++) {
              AutoChunkSize = SIZE[i] * 1024 * 1024;
              if (FileSize / AutoChunkSize <= self.options.MaxPartNumber) break;
            }
            params.ChunkSize = ChunkSize = Math.max(ChunkSize, AutoChunkSize);

            var ChunkCount = Math.ceil(FileSize / ChunkSize);

            var list = [];
            for (var partNumber = 1; partNumber <= ChunkCount; partNumber++) {
              var start = (partNumber - 1) * ChunkSize;
              var end = partNumber * ChunkSize < FileSize ? partNumber * ChunkSize - 1 : FileSize - 1;
              var item = {
                PartNumber: partNumber,
                start: start,
                end: end,
                CopySourceRange: "bytes=" + start + "-" + end };

              list.push(item);
            }
            params.PartList = list;
          })();

          var TargetHeader;
          if (params.Headers['x-cos-metadata-directive'] === 'Replaced') {
            TargetHeader = params.Headers;
          } else {
            TargetHeader = SourceHeaders;
          }
          TargetHeader['x-cos-storage-class'] = params.Headers['x-cos-storage-class'] || SourceHeaders['x-cos-storage-class'];
          TargetHeader = util.clearKey(TargetHeader);
          self.multipartInit({
            Bucket: Bucket,
            Region: Region,
            Key: Key,
            Headers: TargetHeader },
          function (err, data) {
            if (err) {
              return callback(err);
            }
            params.UploadId = data.UploadId;
            ep.emit('get_copy_data_finish', params);
          });
        });

        // 获取远端复制源文件的大小
        self.headObject({
          Bucket: SourceBucket,
          Region: SourceRegion,
          Key: SourceKey },
        function (err, data) {
          if (err) {
            if (err.statusCode && err.statusCode === 404) {
              callback({ ErrorStatus: SourceKey + ' Not Exist' });
            } else {
              callback(err);
            }
            return;
          }

          FileSize = params.FileSize = data.headers['content-length'];
          if (FileSize === undefined || !FileSize) {
            callback({ error: 'get Content-Length error, please add "Content-Length" to CORS ExposeHeader setting.' });
            return;
          }

          _onProgress = util.throttleOnProgress.call(self, FileSize, params.onProgress);

          // 开始上传
          if (FileSize <= CopySliceSize) {
            if (!params.Headers['x-cos-metadata-directive']) {
              params.Headers['x-cos-metadata-directive'] = 'Copy';
            }
            self.putObjectCopy(params, function (err, data) {
              if (err) {
                _onProgress(null, true);
                return callback(err);
              }
              _onProgress({ loaded: FileSize, total: FileSize }, true);
              callback(err, data);
            });
          } else {
            var resHeaders = data.headers;
            var SourceHeaders = {
              'Cache-Control': resHeaders['cache-control'],
              'Content-Disposition': resHeaders['content-disposition'],
              'Content-Encoding': resHeaders['content-encoding'],
              'Content-Type': resHeaders['content-type'],
              'Expires': resHeaders['expires'],
              'x-cos-storage-class': resHeaders['x-cos-storage-class'] };

            util.each(resHeaders, function (v, k) {
              var metaPrefix = 'x-cos-meta-';
              if (k.indexOf(metaPrefix) === 0 && k.length > metaPrefix.length) {
                SourceHeaders[k] = v;
              }
            });
            ep.emit('get_file_size_finish', SourceHeaders);
          }
        });
      }

      // 复制指定分片
      function copySliceItem(params, callback) {
        var TaskId = params.TaskId;
        var Bucket = params.Bucket;
        var Region = params.Region;
        var Key = params.Key;
        var CopySource = params.CopySource;
        var UploadId = params.UploadId;
        var PartNumber = params.PartNumber * 1;
        var CopySourceRange = params.CopySourceRange;

        var ChunkRetryTimes = this.options.ChunkRetryTimes + 1;
        var self = this;

        Async.retry(ChunkRetryTimes, function (tryCallback) {
          self.uploadPartCopy({
            TaskId: TaskId,
            Bucket: Bucket,
            Region: Region,
            Key: Key,
            CopySource: CopySource,
            UploadId: UploadId,
            PartNumber: PartNumber,
            CopySourceRange: CopySourceRange,
            onProgress: params.onProgress },
          function (err, data) {
            tryCallback(err || null, data);
          });
        }, function (err, data) {
          return callback(err, data);
        });
      }


      var API_MAP = {
        abortUploadTask: abortUploadTask,
        sliceCopyFile: sliceCopyFile };


      module.exports.init = function (COS, task) {
        util.each(API_MAP, function (fn, apiName) {
          COS.prototype[apiName] = util.apiWrapper(apiName, fn);
        });
      };


      /***/},
    /* 14 */
    /***/function (module, exports) {

      var eachLimit = function eachLimit(arr, limit, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length || limit <= 0) {
          return callback();
        }

        var completed = 0;
        var started = 0;
        var running = 0;

        (function replenish() {
          if (completed >= arr.length) {
            return callback();
          }

          while (running < limit && started < arr.length) {
            started += 1;
            running += 1;
            iterator(arr[started - 1], function (err) {

              if (err) {
                callback(err);
                callback = function callback() {};
              } else {
                completed += 1;
                running -= 1;
                if (completed >= arr.length) {
                  callback();
                } else {
                  replenish();
                }
              }
            });
          }
        })();
      };

      var retry = function retry(times, iterator, callback) {
        var next = function next(index) {
          iterator(function (err, data) {
            if (err && index < times) {
              next(index + 1);
            } else {
              callback(err, data);
            }
          });
        };
        if (times < 1) {
          callback();
        } else {
          next(1);
        }
      };

      var async = {
        eachLimit: eachLimit,
        retry: retry };


      module.exports = async;

      /***/},
    /* 15 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      var REQUEST = __webpack_require__(9);
      var base64 = __webpack_require__(1);
      var util = __webpack_require__(0);


      // Bucket 相关

      /**
       * 获取用户的 bucket 列表
       * @param  {Object}  params         回调函数，必须，下面为参数列表
       * 无特殊参数
       * @param  {Function}  callback     回调函数，必须
       */
      function getService(params, callback) {
        if (typeof params === 'function') {
          callback = params;
          params = {};
        }
        var protocol = 'https:';
        var domain = this.options.ServiceDomain;
        var appId = params.AppId || this.options.appId;
        var region = params.Region;
        if (domain) {
          domain = domain.replace(/\{\{AppId\}\}/ig, appId || '').
          replace(/\{\{Region\}\}/ig, region || '').replace(/\{\{.*?\}\}/ig, '');
          if (!/^[a-zA-Z]+:\/\//.test(domain)) {
            domain = protocol + '//' + domain;
          }
          if (domain.slice(-1) === '/') {
            domain = domain.slice(0, -1);
          }
        } else if (region) {
          domain = protocol + '//cos.' + region + '.myqcloud.com';
        } else {
          domain = protocol + '//service.cos.myqcloud.com';
        }

        submitRequest.call(this, {
          Action: 'name/cos:GetService',
          url: domain + '/',
          method: 'GET' },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          var buckets = data && data.ListAllMyBucketsResult && data.ListAllMyBucketsResult.Buckets &&
          data.ListAllMyBucketsResult.Buckets.Bucket || [];
          buckets = util.isArray(buckets) ? buckets : [buckets];
          var owner = data && data.ListAllMyBucketsResult && data.ListAllMyBucketsResult.Owner || {};
          callback(null, {
            Buckets: buckets,
            Owner: owner,
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      /**
         * 查看是否存在该Bucket，是否有权限访问
         * @param  {Object}  params                     参数对象，必须
         *     @param  {String}  params.Bucket          Bucket名称，必须
         *     @param  {String}  params.Region          地域名称，必须
         * @param  {Function}  callback                 回调函数，必须
         * @return  {Object}  err                       请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                      返回的数据
         *     @return  {Boolean}  data.BucketExist     Bucket是否存在
         *     @return  {Boolean}  data.BucketAuth      是否有 Bucket 的访问权限
         */
      function headBucket(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:HeadBucket',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          method: 'HEAD' },
        function (err, data) {
          callback(err, data);
        });
      }

      /**
         * 获取 Bucket 下的 object 列表
         * @param  {Object}  params                         参数对象，必须
         *     @param  {String}  params.Bucket              Bucket名称，必须
         *     @param  {String}  params.Region              地域名称，必须
         *     @param  {String}  params.Prefix              前缀匹配，用来规定返回的文件前缀地址，非必须
         *     @param  {String}  params.Delimiter           定界符为一个符号，如果有Prefix，则将Prefix到delimiter之间的相同路径归为一类，非必须
         *     @param  {String}  params.Marker              默认以UTF-8二进制顺序列出条目，所有列出条目从marker开始，非必须
         *     @param  {String}  params.MaxKeys             单次返回最大的条目数量，默认1000，非必须
         *     @param  {String}  params.EncodingType        规定返回值的编码方式，非必须
         * @param  {Function}  callback                     回调函数，必须
         * @return  {Object}  err                           请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                          返回的数据
         *     @return  {Object}  data.ListBucketResult     返回的 object 列表信息
         */
      function getBucket(params, callback) {
        var reqParams = {};
        reqParams['prefix'] = params['Prefix'] || '';
        reqParams['delimiter'] = params['Delimiter'];
        reqParams['marker'] = params['Marker'];
        reqParams['max-keys'] = params['MaxKeys'];
        reqParams['encoding-type'] = params['EncodingType'];

        submitRequest.call(this, {
          Action: 'name/cos:GetBucket',
          ResourceKey: reqParams['prefix'],
          method: 'GET',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          qs: reqParams },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          var ListBucketResult = data.ListBucketResult || {};
          var Contents = ListBucketResult.Contents || [];
          var CommonPrefixes = ListBucketResult.CommonPrefixes || [];

          Contents = util.isArray(Contents) ? Contents : [Contents];
          CommonPrefixes = util.isArray(CommonPrefixes) ? CommonPrefixes : [CommonPrefixes];

          var result = util.clone(ListBucketResult);
          util.extend(result, {
            Contents: Contents,
            CommonPrefixes: CommonPrefixes,
            statusCode: data.statusCode,
            headers: data.headers });


          callback(null, result);
        });
      }

      /**
         * 创建 Bucket，并初始化访问权限
         * @param  {Object}  params                         参数对象，必须
         *     @param  {String}  params.Bucket              Bucket名称，必须
         *     @param  {String}  params.Region              地域名称，必须
         *     @param  {String}  params.ACL                 用户自定义文件权限，可以设置：private，public-read；默认值：private，非必须
         *     @param  {String}  params.GrantRead           赋予被授权者读的权限，格式x-cos-grant-read: uin=" ",uin=" "，非必须
         *     @param  {String}  params.GrantWrite          赋予被授权者写的权限，格式x-cos-grant-write: uin=" ",uin=" "，非必须
         *     @param  {String}  params.GrantFullControl    赋予被授权者读写权限，格式x-cos-grant-full-control: uin=" ",uin=" "，非必须
         * @param  {Function}  callback                     回调函数，必须
         * @return  {Object}  err                           请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                          返回的数据
         *     @return  {String}  data.Location             操作地址
         */
      function putBucket(params, callback) {
        var self = this;
        var headers = {};
        headers['x-cos-acl'] = params['ACL'];
        headers['x-cos-grant-read'] = params['GrantRead'];
        headers['x-cos-grant-write'] = params['GrantWrite'];
        headers['x-cos-grant-read-acp'] = params['GrantReadAcp'];
        headers['x-cos-grant-write-acp'] = params['GrantWriteAcp'];
        headers['x-cos-grant-full-control'] = params['GrantFullControl'];
        submitRequest.call(this, {
          Action: 'name/cos:PutBucket',
          method: 'PUT',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: headers },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          var url = getUrl({
            domain: self.options.Domain,
            bucket: params.Bucket,
            region: params.Region,
            isLocation: true });

          callback(null, {
            Location: url,
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      /**
         * 删除 Bucket
         * @param  {Object}  params                 参数对象，必须
         *     @param  {String}  params.Bucket      Bucket名称，必须
         *     @param  {String}  params.Region      地域名称，必须
         * @param  {Function}  callback             回调函数，必须
         * @return  {Object}  err                   请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                  返回的数据
         *     @return  {String}  data.Location     操作地址
         */
      function deleteBucket(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:DeleteBucket',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          method: 'DELETE' },
        function (err, data) {
          if (err && err.statusCode === 204) {
            return callback(null, { statusCode: err.statusCode });
          } else if (err) {
            return callback(err);
          }
          callback(null, {
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      /**
         * 获取 Bucket 的 权限列表
         * @param  {Object}  params                         参数对象，必须
         *     @param  {String}  params.Bucket              Bucket名称，必须
         *     @param  {String}  params.Region              地域名称，必须
         * @param  {Function}  callback                     回调函数，必须
         * @return  {Object}  err                           请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                          返回的数据
         *     @return  {Object}  data.AccessControlPolicy  访问权限信息
         */
      function getBucketAcl(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:GetBucketACL',
          method: 'GET',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          action: 'acl' },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          var AccessControlPolicy = data.AccessControlPolicy || {};
          var Owner = AccessControlPolicy.Owner || {};
          var Grant = AccessControlPolicy.AccessControlList.Grant || [];
          Grant = util.isArray(Grant) ? Grant : [Grant];
          var result = decodeAcl(AccessControlPolicy);
          if (data.headers && data.headers['x-cos-acl']) {
            result.ACL = data.headers['x-cos-acl'];
          }
          result = util.extend(result, {
            Owner: Owner,
            Grants: Grant,
            statusCode: data.statusCode,
            headers: data.headers });

          callback(null, result);
        });
      }

      /**
         * 设置 Bucket 的 权限列表
         * @param  {Object}  params                         参数对象，必须
         *     @param  {String}  params.Bucket              Bucket名称，必须
         *     @param  {String}  params.Region              地域名称，必须
         *     @param  {String}  params.ACL                 用户自定义文件权限，可以设置：private，public-read；默认值：private，非必须
         *     @param  {String}  params.GrantRead           赋予被授权者读的权限，格式x-cos-grant-read: uin=" ",uin=" "，非必须
         *     @param  {String}  params.GrantWrite          赋予被授权者写的权限，格式x-cos-grant-write: uin=" ",uin=" "，非必须
         *     @param  {String}  params.GrantFullControl    赋予被授权者读写权限，格式x-cos-grant-full-control: uin=" ",uin=" "，非必须
         * @param  {Function}  callback                     回调函数，必须
         * @return  {Object}  err                           请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                          返回的数据
         */
      function putBucketAcl(params, callback) {
        var headers = params.Headers;

        var xml = '';
        if (params['AccessControlPolicy']) {
          var AccessControlPolicy = util.clone(params['AccessControlPolicy'] || {});
          var Grants = AccessControlPolicy.Grants || AccessControlPolicy.Grant;
          Grants = util.isArray(Grants) ? Grants : [Grants];
          delete AccessControlPolicy.Grant;
          delete AccessControlPolicy.Grants;
          AccessControlPolicy.AccessControlList = { Grant: Grants };
          xml = util.json2xml({ AccessControlPolicy: AccessControlPolicy });

          headers['Content-Type'] = 'application/xml';
          headers['Content-MD5'] = util.binaryBase64(util.md5(xml));
        }

        // Grant Header 去重
        util.each(headers, function (val, key) {
          if (key.indexOf('x-cos-grant-') === 0) {
            headers[key] = uniqGrant(headers[key]);
          }
        });

        submitRequest.call(this, {
          Action: 'name/cos:PutBucketACL',
          method: 'PUT',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: headers,
          action: 'acl',
          body: xml },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          callback(null, {
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      /**
         * 获取 Bucket 的 跨域设置
         * @param  {Object}  params                         参数对象，必须
         *     @param  {String}  params.Bucket              Bucket名称，必须
         *     @param  {String}  params.Region              地域名称，必须
         * @param  {Function}  callback                     回调函数，必须
         * @return  {Object}  err                           请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                          返回的数据
         *     @return  {Object}  data.CORSRules            Bucket的跨域设置
         */
      function getBucketCors(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:GetBucketCORS',
          method: 'GET',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          action: 'cors' },
        function (err, data) {
          if (err) {
            if (err.statusCode === 404 && err.error && err.error.Code === 'NoSuchCORSConfiguration') {
              var result = {
                CORSRules: [],
                statusCode: err.statusCode };

              err.headers && (result.headers = err.headers);
              callback(null, result);
            } else {
              callback(err);
            }
            return;
          }
          var CORSConfiguration = data.CORSConfiguration || {};
          var CORSRules = CORSConfiguration.CORSRules || CORSConfiguration.CORSRule || [];
          CORSRules = util.clone(util.isArray(CORSRules) ? CORSRules : [CORSRules]);

          util.each(CORSRules, function (rule) {
            util.each(['AllowedOrigin', 'AllowedHeader', 'AllowedMethod', 'ExposeHeader'], function (key, j) {
              var sKey = key + 's';
              var val = rule[sKey] || rule[key] || [];
              delete rule[key];
              rule[sKey] = util.isArray(val) ? val : [val];
            });
          });

          callback(null, {
            CORSRules: CORSRules,
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      /**
         * 设置 Bucket 的 跨域设置
         * @param  {Object}  params                             参数对象，必须
         *     @param  {String}  params.Bucket                  Bucket名称，必须
         *     @param  {String}  params.Region                  地域名称，必须
         *     @param  {Object}  params.CORSConfiguration       相关的跨域设置，必须
         * @param  {Array}  params.CORSConfiguration.CORSRules  对应的跨域规则
         * @param  {Function}  callback                         回调函数，必须
         * @return  {Object}  err                               请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                              返回的数据
         */
      function putBucketCors(params, callback) {

        var CORSConfiguration = params['CORSConfiguration'] || {};
        var CORSRules = CORSConfiguration['CORSRules'] || params['CORSRules'] || [];
        CORSRules = util.clone(util.isArray(CORSRules) ? CORSRules : [CORSRules]);
        util.each(CORSRules, function (rule) {
          util.each(['AllowedOrigin', 'AllowedHeader', 'AllowedMethod', 'ExposeHeader'], function (key, k) {
            var sKey = key + 's';
            var val = rule[sKey] || rule[key] || [];
            delete rule[sKey];
            rule[key] = util.isArray(val) ? val : [val];
          });
        });

        var xml = util.json2xml({ CORSConfiguration: { CORSRule: CORSRules } });

        var headers = params.Headers;
        headers['Content-Type'] = 'application/xml';
        headers['Content-MD5'] = util.binaryBase64(util.md5(xml));

        submitRequest.call(this, {
          Action: 'name/cos:PutBucketCORS',
          method: 'PUT',
          Bucket: params.Bucket,
          Region: params.Region,
          body: xml,
          action: 'cors',
          headers: headers },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          callback(null, {
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      /**
         * 删除 Bucket 的 跨域设置
         * @param  {Object}  params                 参数对象，必须
         *     @param  {String}  params.Bucket      Bucket名称，必须
         *     @param  {String}  params.Region      地域名称，必须
         * @param  {Function}  callback             回调函数，必须
         * @return  {Object}  err                   请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                  返回的数据
         */
      function deleteBucketCors(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:DeleteBucketCORS',
          method: 'DELETE',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          action: 'cors' },
        function (err, data) {
          if (err && err.statusCode === 204) {
            return callback(null, { statusCode: err.statusCode });
          } else if (err) {
            return callback(err);
          }
          callback(null, {
            statusCode: data.statusCode || err.statusCode,
            headers: data.headers });

        });
      }

      function putBucketPolicy(params, callback) {
        var Policy = params['Policy'];
        var PolicyStr = Policy;
        try {
          if (typeof Policy === 'string') {
            Policy = JSON.parse(PolicyStr);
          } else {
            PolicyStr = JSON.stringify(Policy);
          }
        } catch (e) {
          callback({ error: 'Policy format error' });
        }

        var headers = params.Headers;
        headers['Content-Type'] = 'application/json';
        headers['Content-MD5'] = util.binaryBase64(util.md5(PolicyStr));

        submitRequest.call(this, {
          Action: 'name/cos:PutBucketPolicy',
          method: 'PUT',
          Bucket: params.Bucket,
          Region: params.Region,
          action: 'policy',
          body: util.isBrowser ? PolicyStr : Policy,
          headers: headers,
          json: true },
        function (err, data) {
          if (err && err.statusCode === 204) {
            return callback(null, { statusCode: err.statusCode });
          } else if (err) {
            return callback(err);
          }
          callback(null, {
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      /**
         * 删除 Bucket 的 跨域设置
         * @param  {Object}  params                 参数对象，必须
         *     @param  {String}  params.Bucket      Bucket名称，必须
         *     @param  {String}  params.Region      地域名称，必须
         * @param  {Function}  callback             回调函数，必须
         * @return  {Object}  err                   请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                  返回的数据
         */
      function deleteBucketPolicy(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:DeleteBucketPolicy',
          method: 'DELETE',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          action: 'policy' },
        function (err, data) {
          if (err && err.statusCode === 204) {
            return callback(null, { statusCode: err.statusCode });
          } else if (err) {
            return callback(err);
          }
          callback(null, {
            statusCode: data.statusCode || err.statusCode,
            headers: data.headers });

        });
      }

      /**
         * 获取 Bucket 的 地域信息
         * @param  {Object}  params             参数对象，必须
         *     @param  {String}  params.Bucket  Bucket名称，必须
         *     @param  {String}  params.Region  地域名称，必须
         * @param  {Function}  callback         回调函数，必须
         * @return  {Object}  err               请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data              返回数据，包含地域信息 LocationConstraint
         */
      function getBucketLocation(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:GetBucketLocation',
          method: 'GET',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          action: 'location' },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          callback(null, data);
        });
      }

      /**
         * 获取 Bucket 的读取权限策略
         * @param  {Object}  params             参数对象，必须
         *     @param  {String}  params.Bucket  Bucket名称，必须
         *     @param  {String}  params.Region  地域名称，必须
         * @param  {Function}  callback         回调函数，必须
         * @return  {Object}  err               请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data              返回数据
         */
      function getBucketPolicy(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:GetBucketPolicy',
          method: 'GET',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          action: 'policy',
          rawBody: true },
        function (err, data) {
          if (err) {
            if (err.statusCode && err.statusCode === 403) {
              return callback({ ErrorStatus: 'Access Denied' });
            }
            if (err.statusCode && err.statusCode === 405) {
              return callback({ ErrorStatus: 'Method Not Allowed' });
            }
            if (err.statusCode && err.statusCode === 404) {
              return callback({ ErrorStatus: 'Policy Not Found' });
            }
            return callback(err);
          }
          var Policy = {};
          try {
            Policy = JSON.parse(data.body);
          } catch (e) {
          }
          callback(null, {
            Policy: Policy,
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      /**
         * 获取 Bucket 的标签设置
         * @param  {Object}  params             参数对象，必须
         *     @param  {String}  params.Bucket  Bucket名称，必须
         *     @param  {String}  params.Region  地域名称，必须
         * @param  {Function}  callback         回调函数，必须
         * @return  {Object}  err               请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data              返回数据
         */
      function getBucketTagging(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:GetBucketTagging',
          method: 'GET',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          action: 'tagging' },
        function (err, data) {
          if (err) {
            if (err.statusCode === 404 && err.error && (err.error === "Not Found" || err.error.Code === 'NoSuchTagSet')) {
              var result = {
                Tags: [],
                statusCode: err.statusCode };

              err.headers && (result.headers = err.headers);
              callback(null, result);
            } else {
              callback(err);
            }
            return;
          }
          var Tags = [];
          try {
            Tags = data.Tagging.TagSet.Tag || [];
          } catch (e) {
          }
          Tags = util.clone(util.isArray(Tags) ? Tags : [Tags]);
          callback(null, {
            Tags: Tags,
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      /**
         * 设置 Bucket 的标签
         * @param  {Object}  params             参数对象，必须
         *     @param  {String}  params.Bucket  Bucket名称，必须
         *     @param  {String}  params.Region  地域名称，必须
         *     @param  {Array}   params.TagSet  标签设置，必须
         * @param  {Function}  callback         回调函数，必须
         * @return  {Object}  err               请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data              返回数据
         */
      function putBucketTagging(params, callback) {

        var Tagging = params['Tagging'] || {};
        var Tags = Tagging.TagSet || Tagging.Tags || params['Tags'] || [];
        Tags = util.clone(util.isArray(Tags) ? Tags : [Tags]);
        var xml = util.json2xml({ Tagging: { TagSet: { Tag: Tags } } });

        var headers = params.Headers;
        headers['Content-Type'] = 'application/xml';
        headers['Content-MD5'] = util.binaryBase64(util.md5(xml));

        submitRequest.call(this, {
          Action: 'name/cos:PutBucketTagging',
          method: 'PUT',
          Bucket: params.Bucket,
          Region: params.Region,
          body: xml,
          action: 'tagging',
          headers: headers },
        function (err, data) {
          if (err && err.statusCode === 204) {
            return callback(null, { statusCode: err.statusCode });
          } else if (err) {
            return callback(err);
          }
          callback(null, {
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }


      /**
         * 删除 Bucket 的 标签设置
         * @param  {Object}  params             参数对象，必须
         *     @param  {String}  params.Bucket  Bucket名称，必须
         *     @param  {String}  params.Region  地域名称，必须
         * @param  {Function}  callback         回调函数，必须
         * @return  {Object}  err               请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data              返回的数据
         */
      function deleteBucketTagging(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:DeleteBucketTagging',
          method: 'DELETE',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          action: 'tagging' },
        function (err, data) {
          if (err && err.statusCode === 204) {
            return callback(null, { statusCode: err.statusCode });
          } else if (err) {
            return callback(err);
          }
          callback(null, {
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      function putBucketLifecycle(params, callback) {

        var LifecycleConfiguration = params['LifecycleConfiguration'] || {};
        var Rules = LifecycleConfiguration.Rules || params.Rules || [];
        Rules = util.clone(Rules);
        var xml = util.json2xml({ LifecycleConfiguration: { Rule: Rules } });

        var headers = params.Headers;
        headers['Content-Type'] = 'application/xml';
        headers['Content-MD5'] = util.binaryBase64(util.md5(xml));

        submitRequest.call(this, {
          Action: 'name/cos:PutBucketLifecycle',
          method: 'PUT',
          Bucket: params.Bucket,
          Region: params.Region,
          body: xml,
          action: 'lifecycle',
          headers: headers },
        function (err, data) {
          if (err && err.statusCode === 204) {
            return callback(null, { statusCode: err.statusCode });
          } else if (err) {
            return callback(err);
          }
          callback(null, {
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      function getBucketLifecycle(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:GetBucketLifecycle',
          method: 'GET',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          action: 'lifecycle' },
        function (err, data) {
          if (err) {
            if (err.statusCode === 404 && err.error && err.error.Code === 'NoSuchLifecycleConfiguration') {
              var result = {
                Rules: [],
                statusCode: err.statusCode };

              err.headers && (result.headers = err.headers);
              callback(null, result);
            } else {
              callback(err);
            }
            return;
          }
          var Rules = [];
          try {
            Rules = data.LifecycleConfiguration.Rule || [];
          } catch (e) {
          }
          Rules = util.clone(util.isArray(Rules) ? Rules : [Rules]);
          callback(null, {
            Rules: Rules,
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      function deleteBucketLifecycle(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:DeleteBucketLifecycle',
          method: 'DELETE',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          action: 'lifecycle' },
        function (err, data) {
          if (err && err.statusCode === 204) {
            return callback(null, { statusCode: err.statusCode });
          } else if (err) {
            return callback(err);
          }
          callback(null, {
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      function putBucketVersioning(params, callback) {

        if (!params['VersioningConfiguration']) {
          callback({ error: 'missing param VersioningConfiguration' });
          return;
        }
        var VersioningConfiguration = params['VersioningConfiguration'] || {};
        var xml = util.json2xml({ VersioningConfiguration: VersioningConfiguration });

        var headers = params.Headers;
        headers['Content-Type'] = 'application/xml';
        headers['Content-MD5'] = util.binaryBase64(util.md5(xml));

        submitRequest.call(this, {
          Action: 'name/cos:PutBucketVersioning',
          method: 'PUT',
          Bucket: params.Bucket,
          Region: params.Region,
          body: xml,
          action: 'versioning',
          headers: headers },
        function (err, data) {
          if (err && err.statusCode === 204) {
            return callback(null, { statusCode: err.statusCode });
          } else if (err) {
            return callback(err);
          }
          callback(null, {
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      function getBucketVersioning(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:GetBucketVersioning',
          method: 'GET',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          action: 'versioning' },
        function (err, data) {
          if (!err) {
            !data.VersioningConfiguration && (data.VersioningConfiguration = {});
          }
          callback(err, data);
        });
      }

      function putBucketReplication(params, callback) {
        var ReplicationConfiguration = util.clone(params.ReplicationConfiguration);
        var xml = util.json2xml({ ReplicationConfiguration: ReplicationConfiguration });
        xml = xml.replace(/<(\/?)Rules>/ig, '<$1Rule>');
        xml = xml.replace(/<(\/?)Tags>/ig, '<$1Tag>');

        var headers = params.Headers;
        headers['Content-Type'] = 'application/xml';
        headers['Content-MD5'] = util.binaryBase64(util.md5(xml));

        submitRequest.call(this, {
          Action: 'name/cos:PutBucketReplication',
          method: 'PUT',
          Bucket: params.Bucket,
          Region: params.Region,
          body: xml,
          action: 'replication',
          headers: headers },
        function (err, data) {
          if (err && err.statusCode === 204) {
            return callback(null, { statusCode: err.statusCode });
          } else if (err) {
            return callback(err);
          }
          callback(null, {
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      function getBucketReplication(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:GetBucketReplication',
          method: 'GET',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          action: 'replication' },
        function (err, data) {
          if (err) {
            if (err.statusCode === 404 && err.error && (err.error === 'Not Found' || err.error.Code === 'ReplicationConfigurationnotFoundError')) {
              var result = {
                ReplicationConfiguration: { Rules: [] },
                statusCode: err.statusCode };

              err.headers && (result.headers = err.headers);
              callback(null, result);
            } else {
              callback(err);
            }
            return;
          }
          if (!err) {
            !data.ReplicationConfiguration && (data.ReplicationConfiguration = {});
          }
          if (data.ReplicationConfiguration.Rule) {
            data.ReplicationConfiguration.Rules = data.ReplicationConfiguration.Rule;
            delete data.ReplicationConfiguration.Rule;
          }
          callback(err, data);
        });
      }

      function deleteBucketReplication(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:DeleteBucketReplication',
          method: 'DELETE',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          action: 'replication' },
        function (err, data) {
          if (err && err.statusCode === 204) {
            return callback(null, { statusCode: err.statusCode });
          } else if (err) {
            return callback(err);
          }
          callback(null, {
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      // Object 相关

      /**
       * 取回对应Object的元数据，Head的权限与Get的权限一致
       * @param  {Object}  params                         参数对象，必须
       *     @param  {String}  params.Bucket              Bucket名称，必须
       *     @param  {String}  params.Region              地域名称，必须
       *     @param  {String}  params.Key                 文件名称，必须
       *     @param  {String}  params.IfModifiedSince     当Object在指定时间后被修改，则返回对应Object元信息，否则返回304，非必须
       * @param  {Function}  callback                     回调函数，必须
       * @return  {Object}  err                           请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
       * @return  {Object}  data                          为指定 object 的元数据，如果设置了 IfModifiedSince ，且文件未修改，则返回一个对象，NotModified 属性为 true
       *     @return  {Boolean}  data.NotModified         是否在 IfModifiedSince 时间点之后未修改该 object，则为 true
       */
      function headObject(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:HeadObject',
          method: 'HEAD',
          Bucket: params.Bucket,
          Region: params.Region,
          Key: params.Key,
          VersionId: params.VersionId,
          headers: params.Headers },
        function (err, data) {
          if (err) {
            var statusCode = err.statusCode;
            if (params.Headers['If-Modified-Since'] && statusCode && statusCode === 304) {
              return callback(null, {
                NotModified: true,
                statusCode: statusCode });

            }
            return callback(err);
          }
          if (data.headers) {
            var headers = data.headers;
            data.ETag = headers.etag || headers.Etag || headers.ETag || '';
          }
          callback(null, data);
        });
      }


      function listObjectVersions(params, callback) {
        var reqParams = {};
        reqParams['prefix'] = params['Prefix'] || '';
        reqParams['delimiter'] = params['Delimiter'];
        reqParams['key-marker'] = params['KeyMarker'];
        reqParams['version-id-marker'] = params['VersionIdMarker'];
        reqParams['max-keys'] = params['MaxKeys'];
        reqParams['encoding-type'] = params['EncodingType'];

        submitRequest.call(this, {
          Action: 'name/cos:GetBucketObjectVersions',
          ResourceKey: reqParams['prefix'],
          method: 'GET',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          qs: reqParams,
          action: 'versions' },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          var ListVersionsResult = data.ListVersionsResult || {};
          var DeleteMarkers = ListVersionsResult.DeleteMarker || [];
          DeleteMarkers = util.isArray(DeleteMarkers) ? DeleteMarkers : [DeleteMarkers];
          var Versions = ListVersionsResult.Version || [];
          Versions = util.isArray(Versions) ? Versions : [Versions];

          var result = util.clone(ListVersionsResult);
          delete result.DeleteMarker;
          delete result.Version;
          util.extend(result, {
            DeleteMarkers: DeleteMarkers,
            Versions: Versions,
            statusCode: data.statusCode,
            headers: data.headers });


          callback(null, result);
        });
      }

      /**
         * 下载 object
         * @param  {Object}  params                                 参数对象，必须
         *     @param  {String}  params.Bucket                      Bucket名称，必须
         *     @param  {String}  params.Region                      地域名称，必须
         *     @param  {String}  params.Key                         文件名称，必须
         *     @param  {WriteStream}  params.Output                 文件写入流，非必须
         *     @param  {String}  params.IfModifiedSince             当Object在指定时间后被修改，则返回对应Object元信息，否则返回304，非必须
         *     @param  {String}  params.IfUnmodifiedSince           如果文件修改时间早于或等于指定时间，才返回文件内容。否则返回 412 (precondition failed)，非必须
         *     @param  {String}  params.IfMatch                     当 ETag 与指定的内容一致，才返回文件。否则返回 412 (precondition failed)，非必须
         *     @param  {String}  params.IfNoneMatch                 当 ETag 与指定的内容不一致，才返回文件。否则返回304 (not modified)，非必须
         *     @param  {String}  params.ResponseContentType         设置返回头部中的 Content-Type 参数，非必须
         *     @param  {String}  params.ResponseContentLanguage     设置返回头部中的 Content-Language 参数，非必须
         *     @param  {String}  params.ResponseExpires             设置返回头部中的 Content-Expires 参数，非必须
         *     @param  {String}  params.ResponseCacheControl        设置返回头部中的 Cache-Control 参数，非必须
         *     @param  {String}  params.ResponseContentDisposition  设置返回头部中的 Content-Disposition 参数，非必须
         *     @param  {String}  params.ResponseContentEncoding     设置返回头部中的 Content-Encoding 参数，非必须
         * @param  {Function}  callback                             回调函数，必须
         * @param  {Object}  err                                    请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @param  {Object}  data                                   为对应的 object 数据，包括 body 和 headers
         */
      function getObject(params, callback) {
        var reqParams = {};

        reqParams['response-content-type'] = params['ResponseContentType'];
        reqParams['response-content-language'] = params['ResponseContentLanguage'];
        reqParams['response-expires'] = params['ResponseExpires'];
        reqParams['response-cache-control'] = params['ResponseCacheControl'];
        reqParams['response-content-disposition'] = params['ResponseContentDisposition'];
        reqParams['response-content-encoding'] = params['ResponseContentEncoding'];

        // 如果用户自己传入了 output
        submitRequest.call(this, {
          Action: 'name/cos:GetObject',
          method: 'GET',
          Bucket: params.Bucket,
          Region: params.Region,
          Key: params.Key,
          VersionId: params.VersionId,
          headers: params.Headers,
          qs: reqParams,
          rawBody: true },
        function (err, data) {
          if (err) {
            var statusCode = err.statusCode;
            if (params.Headers['If-Modified-Since'] && statusCode && statusCode === 304) {
              return callback(null, {
                NotModified: true });

            }
            return callback(err);
          }
          var result = {};
          result.Body = data.body;

          if (data && data.headers) {
            var headers = data.headers;
            result.ETag = headers.etag || headers.Etag || headers.ETag || '';
          }
          util.extend(result, {
            statusCode: data.statusCode,
            headers: data.headers });

          callback(null, result);
        });

      }

      /**
         * 上传 object
         * @param  {Object} params                                          参数对象，必须
         *     @param  {String}  params.Bucket                              Bucket名称，必须
         *     @param  {String}  params.Region                              地域名称，必须
         *     @param  {String}  params.Key                                 文件名称，必须
         *     @param  {String}  params.Body                                上传文件的内容，只支持字符串
         *     @param  {String}  params.CacheControl                        RFC 2616 中定义的缓存策略，将作为 Object 元数据保存，非必须
         *     @param  {String}  params.ContentDisposition                  RFC 2616 中定义的文件名称，将作为 Object 元数据保存，非必须
         *     @param  {String}  params.ContentEncoding                     RFC 2616 中定义的编码格式，将作为 Object 元数据保存，非必须
         *     @param  {String}  params.ContentLength                       RFC 2616 中定义的 HTTP 请求内容长度（字节），必须
         *     @param  {String}  params.ContentType                         RFC 2616 中定义的内容类型（MIME），将作为 Object 元数据保存，非必须
         *     @param  {String}  params.Expect                              当使用 Expect: 100-continue 时，在收到服务端确认后，才会发送请求内容，非必须
         *     @param  {String}  params.Expires                             RFC 2616 中定义的过期时间，将作为 Object 元数据保存，非必须
         *     @param  {String}  params.ContentSha1                         RFC 3174 中定义的 160-bit 内容 SHA-1 算法校验，非必须
         *     @param  {String}  params.ACL                                 允许用户自定义文件权限，有效值：private | public-read，非必须
         *     @param  {String}  params.GrantRead                           赋予被授权者读的权限，格式 x-cos-grant-read: uin=" ",uin=" "，非必须
         *     @param  {String}  params.GrantWrite                          赋予被授权者写的权限，格式 x-cos-grant-write: uin=" ",uin=" "，非必须
         *     @param  {String}  params.GrantFullControl                    赋予被授权者读写权限，格式 x-cos-grant-full-control: uin=" ",uin=" "，非必须
         *     @param  {String}  params.ServerSideEncryption               支持按照指定的加密算法进行服务端数据加密，格式 x-cos-server-side-encryption: "AES256"，非必须
         *     @param  {Function}  params.onProgress                        上传进度回调函数
         * @param  {Function}  callback                                     回调函数，必须
         * @return  {Object}  err                                           请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                                          为对应的 object 数据
         *     @return  {String}  data.ETag                                 为对应上传文件的 ETag 值
         */
      function putObject(params, callback) {
        var self = this;
        var FileSize = params.ContentLength;
        var onProgress = util.throttleOnProgress.call(self, FileSize, params.onProgress);

        util.getBodyMd5(self.options.UploadCheckContentMd5, params.Body, function (md5) {
          md5 && (params.Headers['Content-MD5'] = util.binaryBase64(md5));
          if (params.ContentLength !== undefined) {
            params.Headers['Content-Length'] = params.ContentLength;
          }
          submitRequest.call(self, {
            Action: 'name/cos:PutObject',
            TaskId: params.TaskId,
            method: 'PUT',
            Bucket: params.Bucket,
            Region: params.Region,
            Key: params.Key,
            headers: params.Headers,
            body: params.Body,
            onProgress: onProgress },
          function (err, data) {
            if (err) {
              onProgress(null, true);
              return callback(err);
            }
            onProgress({ loaded: FileSize, total: FileSize }, true);

            if (data && data.headers) {
              var headers = data.headers;
              var ETag = headers.etag || headers.Etag || headers.ETag || '';

              var url = getUrl({
                ForcePathStyle: self.options.ForcePathStyle,
                protocol: self.options.Protocol,
                domain: self.options.Domain,
                bucket: params.Bucket,
                region: params.Region,
                object: params.Key });

              url = url.substr(url.indexOf('://') + 3);
              return callback(null, {
                Location: url,
                ETag: ETag,
                statusCode: data.statusCode,
                headers: headers });

            }
            callback(null, data);
          });
        });
      }

      /**
         * 上传 object
         * @param  {Object} params                                          参数对象，必须
         *     @param  {String}  params.Bucket                              Bucket名称，必须
         *     @param  {String}  params.Region                              地域名称，必须
         *     @param  {String}  params.Key                                 文件名称，必须
         *     @param  {FilePath}  params.FilePath                          要上传的文件路径
         *     @param  {Function}  params.onProgress                        上传进度回调函数
         * @param  {Function}  callback                                     回调函数，必须
         * @return  {Object}  err                                           请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                                          为对应的 object 数据
         *     @return  {String}  data.ETag                                 为对应上传文件的 ETag 值
         */
      function postObject(params, callback) {
        var self = this;
        var headers = {};

        headers['Cache-Control'] = params['CacheControl'];
        headers['Content-Disposition'] = params['ContentDisposition'];
        headers['Content-Encoding'] = params['ContentEncoding'];
        headers['Content-MD5'] = params['ContentMD5'];
        headers['Content-Length'] = params['ContentLength'];
        headers['Content-Type'] = params['ContentType'];
        headers['Expect'] = params['Expect'];
        headers['Expires'] = params['Expires'];
        headers['x-cos-acl'] = params['ACL'];
        headers['x-cos-grant-read'] = params['GrantRead'];
        headers['x-cos-grant-write'] = params['GrantWrite'];
        headers['x-cos-grant-full-control'] = params['GrantFullControl'];
        headers['x-cos-storage-class'] = params['StorageClass'];

        var filePath = params.FilePath;
        for (var key in params) {
          if (key.indexOf('x-cos-meta-') > -1) {
            headers[key] = params[key];
          }
        }

        var onProgress = util.throttleOnProgress.call(self, headers['Content-Length'], params.onProgress);

        submitRequest.call(this, {
          Action: 'name/cos:PostObject',
          method: 'POST',
          Bucket: params.Bucket,
          Region: params.Region,
          Key: params.Key,
          headers: headers,
          filePath: filePath,
          onProgress: onProgress },
        function (err, data) {
          onProgress(null, true);
          if (err) {
            return callback(err);
          }
          if (data && data.headers) {
            var headers = data.headers;
            var ETag = headers.etag || headers.Etag || headers.ETag || '';

            var url = getUrl({
              ForcePathStyle: self.options.ForcePathStyle,
              protocol: self.options.Protocol,
              domain: self.options.Domain,
              bucket: params.Bucket,
              region: params.Region,
              object: params.Key,
              isLocation: true });


            return callback(null, {
              Location: url,
              statusCode: data.statusCode,
              headers: headers,
              ETag: ETag });

          }
          callback(null, data);
        });
      }

      /**
         * 删除 object
         * @param  {Object}  params                     参数对象，必须
         *     @param  {String}  params.Bucket          Bucket名称，必须
         *     @param  {String}  params.Region          地域名称，必须
         *     @param  {String}  params.Key             object名称，必须
         * @param  {Function}  callback                 回调函数，必须
         * @param  {Object}  err                        请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @param  {Object}  data                       删除操作成功之后返回的数据
         */
      function deleteObject(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:DeleteObject',
          method: 'DELETE',
          Bucket: params.Bucket,
          Region: params.Region,
          Key: params.Key,
          headers: params.Headers,
          VersionId: params.VersionId },
        function (err, data) {
          if (err) {
            var statusCode = err.statusCode;
            if (statusCode && statusCode === 204) {
              return callback(null, { statusCode: statusCode });
            } else if (statusCode && statusCode === 404) {
              return callback(null, { BucketNotFound: true, statusCode: statusCode });
            } else {
              return callback(err);
            }
          }
          callback(null, {
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      /**
         * 获取 object 的 权限列表
         * @param  {Object}  params                         参数对象，必须
         *     @param  {String}  params.Bucket              Bucket名称，必须
         *     @param  {String}  params.Region              地域名称，必须
         *     @param  {String}  params.Key                 object名称，必须
         * @param  {Function}  callback                     回调函数，必须
         * @return  {Object}  err                           请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                          返回的数据
         *     @return  {Object}  data.AccessControlPolicy  权限列表
         */
      function getObjectAcl(params, callback) {

        submitRequest.call(this, {
          Action: 'name/cos:GetObjectACL',
          method: 'GET',
          Bucket: params.Bucket,
          Region: params.Region,
          Key: params.Key,
          headers: params.Headers,
          action: 'acl' },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          var AccessControlPolicy = data.AccessControlPolicy || {};
          var Owner = AccessControlPolicy.Owner || {};
          var Grant = AccessControlPolicy.AccessControlList && AccessControlPolicy.AccessControlList.Grant || [];
          Grant = util.isArray(Grant) ? Grant : [Grant];
          var result = decodeAcl(AccessControlPolicy);
          if (data.headers && data.headers['x-cos-acl']) {
            result.ACL = data.headers['x-cos-acl'];
          }
          result = util.extend(result, {
            Owner: Owner,
            Grants: Grant,
            statusCode: data.statusCode,
            headers: data.headers });

          callback(null, result);
        });
      }

      /**
         * 设置 object 的 权限列表
         * @param  {Object}  params             参数对象，必须
         *     @param  {String}  params.Bucket  Bucket名称，必须
         *     @param  {String}  params.Region  地域名称，必须
         *     @param  {String}  params.Key     object名称，必须
         * @param  {Function}  callback         回调函数，必须
         * @return  {Object}  err               请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data              返回的数据
         */
      function putObjectAcl(params, callback) {
        var headers = params.Headers;

        var xml = '';
        if (params['AccessControlPolicy']) {
          var AccessControlPolicy = util.clone(params['AccessControlPolicy'] || {});
          var Grants = AccessControlPolicy.Grants || AccessControlPolicy.Grant;
          Grants = util.isArray(Grants) ? Grants : [Grants];
          delete AccessControlPolicy.Grant;
          delete AccessControlPolicy.Grants;
          AccessControlPolicy.AccessControlList = { Grant: Grants };
          xml = util.json2xml({ AccessControlPolicy: AccessControlPolicy });

          headers['Content-Type'] = 'application/xml';
          headers['Content-MD5'] = util.binaryBase64(util.md5(xml));
        }

        // Grant Header 去重
        util.each(headers, function (val, key) {
          if (key.indexOf('x-cos-grant-') === 0) {
            headers[key] = uniqGrant(headers[key]);
          }
        });

        submitRequest.call(this, {
          Action: 'name/cos:PutObjectACL',
          method: 'PUT',
          Bucket: params.Bucket,
          Region: params.Region,
          Key: params.Key,
          action: 'acl',
          headers: headers,
          body: xml },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          callback(null, {
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      /**
         * Options Object请求实现跨域访问的预请求。即发出一个 OPTIONS 请求给服务器以确认是否可以进行跨域操作。
         * @param  {Object}  params             参数对象，必须
         *     @param  {String}  params.Bucket  Bucket名称，必须
         *     @param  {String}  params.Region  地域名称，必须
         *     @param  {String}  params.Key     object名称，必须
         * @param  {Function}  callback         回调函数，必须
         * @return  {Object}  err               请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data              返回的数据
         */
      function optionsObject(params, callback) {

        var headers = params.Headers;
        headers['Origin'] = params['Origin'];
        headers['Access-Control-Request-Method'] = params['AccessControlRequestMethod'];
        headers['Access-Control-Request-Headers'] = params['AccessControlRequestHeaders'];

        submitRequest.call(this, {
          Action: 'name/cos:OptionsObject',
          method: 'OPTIONS',
          Bucket: params.Bucket,
          Region: params.Region,
          Key: params.Key,
          headers: headers },
        function (err, data) {
          if (err) {
            if (err.statusCode && err.statusCode === 403) {
              return callback(null, {
                OptionsForbidden: true,
                statusCode: err.statusCode });

            }
            return callback(err);
          }

          var headers = data.headers || {};
          callback(null, {
            AccessControlAllowOrigin: headers['access-control-allow-origin'],
            AccessControlAllowMethods: headers['access-control-allow-methods'],
            AccessControlAllowHeaders: headers['access-control-allow-headers'],
            AccessControlExposeHeaders: headers['access-control-expose-headers'],
            AccessControlMaxAge: headers['access-control-max-age'],
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      /**
         * @param  {Object}                                     参数列表
         *     @param  {String}  Bucket                         Bucket 名称
         *     @param  {String}  Region                         地域名称
         *     @param  {String}  Key                            文件名称
         *     @param  {String}  CopySource                     源文件URL绝对路径，可以通过versionid子资源指定历史版本
         *     @param  {String}  ACL                            允许用户自定义文件权限。有效值：private，public-read默认值：private。
         *     @param  {String}  GrantRead                      赋予被授权者读的权限，格式 x-cos-grant-read: uin=" ",uin=" "，当需要给子账户授权时，uin="RootAcountID/SubAccountID"，当需要给根账户授权时，uin="RootAcountID"。
         *     @param  {String}  GrantWrite                     赋予被授权者写的权限，格式 x-cos-grant-write: uin=" ",uin=" "，当需要给子账户授权时，uin="RootAcountID/SubAccountID"，当需要给根账户授权时，uin="RootAcountID"。
         *     @param  {String}  GrantFullControl               赋予被授权者读写权限，格式 x-cos-grant-full-control: uin=" ",uin=" "，当需要给子账户授权时，uin="RootAcountID/SubAccountID"，当需要给根账户授权时，uin="RootAcountID"。
         *     @param  {String}  MetadataDirective              是否拷贝元数据，枚举值：Copy, Replaced，默认值Copy。假如标记为Copy，忽略Header中的用户元数据信息直接复制；假如标记为Replaced，按Header信息修改元数据。当目标路径和原路径一致，即用户试图修改元数据时，必须为Replaced
         *     @param  {String}  CopySourceIfModifiedSince      当Object在指定时间后被修改，则执行操作，否则返回412。可与x-cos-copy-source-If-None-Match一起使用，与其他条件联合使用返回冲突。
         *     @param  {String}  CopySourceIfUnmodifiedSince    当Object在指定时间后未被修改，则执行操作，否则返回412。可与x-cos-copy-source-If-Match一起使用，与其他条件联合使用返回冲突。
         *     @param  {String}  CopySourceIfMatch              当Object的ETag和给定一致时，则执行操作，否则返回412。可与x-cos-copy-source-If-Unmodified-Since一起使用，与其他条件联合使用返回冲突。
         *     @param  {String}  CopySourceIfNoneMatch          当Object的ETag和给定不一致时，则执行操作，否则返回412。可与x-cos-copy-source-If-Modified-Since一起使用，与其他条件联合使用返回冲突。
         *     @param  {String}  StorageClass                   存储级别，枚举值：存储级别，枚举值：Standard, Standard_IA，Archive；默认值：Standard
         *     @param  {String}  CacheControl                   指定所有缓存机制在整个请求/响应链中必须服从的指令。
         *     @param  {String}  ContentDisposition             MIME 协议的扩展，MIME 协议指示 MIME 用户代理如何显示附加的文件
         *     @param  {String}  ContentEncoding                HTTP 中用来对「采用何种编码格式传输正文」进行协定的一对头部字段
         *     @param  {String}  ContentLength                  设置响应消息的实体内容的大小，单位为字节
         *     @param  {String}  ContentType                    RFC 2616 中定义的 HTTP 请求内容类型（MIME），例如text/plain
         *     @param  {String}  Expect                         请求的特定的服务器行为
         *     @param  {String}  Expires                        响应过期的日期和时间
         *     @param  {String}  params.ServerSideEncryption   支持按照指定的加密算法进行服务端数据加密，格式 x-cos-server-side-encryption: "AES256"，非必须
         *     @param  {String}  ContentLanguage                指定内容语言
         *     @param  {String}  x-cos-meta-*                   允许用户自定义的头部信息，将作为 Object 元数据返回。大小限制2K。
         */
      function putObjectCopy(params, callback) {
        var CopySource = params.CopySource || '';
        var m = CopySource.match(/^([^.]+-\d+)\.cos(v6)?\.([^.]+)\.[^/]+\/(.+)$/);
        if (!m) {
          callback({ error: 'CopySource format error' });
          return;
        }

        var SourceBucket = m[1];
        var SourceRegion = m[3];
        var SourceKey = decodeURIComponent(m[4]);

        submitRequest.call(this, {
          Scope: [{
            action: 'name/cos:GetObject',
            bucket: SourceBucket,
            region: SourceRegion,
            prefix: SourceKey },
          {
            action: 'name/cos:PutObject',
            bucket: params.Bucket,
            region: params.Region,
            prefix: params.Key }],

          method: 'PUT',
          Bucket: params.Bucket,
          Region: params.Region,
          Key: params.Key,
          VersionId: params.VersionId,
          headers: params.Headers },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          var result = util.clone(data.CopyObjectResult || {});
          util.extend(result, {
            statusCode: data.statusCode,
            headers: data.headers });

          callback(null, result);
        });
      }

      function uploadPartCopy(params, callback) {

        var CopySource = params.CopySource || '';
        var m = CopySource.match(/^([^.]+-\d+)\.cos(v6)?\.([^.]+)\.[^/]+\/(.+)$/);
        if (!m) {
          callback({ error: 'CopySource format error' });
          return;
        }

        var SourceBucket = m[1];
        var SourceRegion = m[3];
        var SourceKey = decodeURIComponent(m[4]);

        submitRequest.call(this, {
          Scope: [{
            action: 'name/cos:GetObject',
            bucket: SourceBucket,
            region: SourceRegion,
            prefix: SourceKey },
          {
            action: 'name/cos:PutObject',
            bucket: params.Bucket,
            region: params.Region,
            prefix: params.Key }],

          method: 'PUT',
          Bucket: params.Bucket,
          Region: params.Region,
          Key: params.Key,
          VersionId: params.VersionId,
          qs: {
            partNumber: params['PartNumber'],
            uploadId: params['UploadId'] },

          headers: params.Headers },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          var result = util.clone(data.CopyPartResult || {});
          util.extend(result, {
            statusCode: data.statusCode,
            headers: data.headers });

          callback(null, result);
        });
      }

      function deleteMultipleObject(params, callback) {
        var Objects = params.Objects || [];
        var Quiet = params.Quiet;
        Objects = util.isArray(Objects) ? Objects : [Objects];

        var xml = util.json2xml({ Delete: { Object: Objects, Quiet: Quiet || false } });

        var headers = params.Headers;
        headers['Content-Type'] = 'application/xml';
        headers['Content-MD5'] = util.binaryBase64(util.md5(xml));

        var Scope = util.map(Objects, function (v) {
          return {
            action: 'name/cos:DeleteObject',
            bucket: params.Bucket,
            region: params.Region,
            prefix: v.Key };

        });

        submitRequest.call(this, {
          Scope: Scope,
          method: 'POST',
          Bucket: params.Bucket,
          Region: params.Region,
          body: xml,
          action: 'delete',
          headers: headers },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          var DeleteResult = data.DeleteResult || {};
          var Deleted = DeleteResult.Deleted || [];
          var Errors = DeleteResult.Error || [];

          Deleted = util.isArray(Deleted) ? Deleted : [Deleted];
          Errors = util.isArray(Errors) ? Errors : [Errors];

          var result = util.clone(DeleteResult);
          util.extend(result, {
            Error: Errors,
            Deleted: Deleted,
            statusCode: data.statusCode,
            headers: data.headers });

          callback(null, result);
        });
      }

      function restoreObject(params, callback) {
        var headers = params.Headers;
        if (!params['RestoreRequest']) {
          callback({ error: 'missing param RestoreRequest' });
          return;
        }

        var RestoreRequest = params.RestoreRequest || {};
        var xml = util.json2xml({ RestoreRequest: RestoreRequest });

        headers['Content-Type'] = 'application/xml';
        headers['Content-MD5'] = util.binaryBase64(util.md5(xml));

        submitRequest.call(this, {
          Action: 'name/cos:RestoreObject',
          method: 'POST',
          Bucket: params.Bucket,
          Region: params.Region,
          Key: params.Key,
          VersionId: params.VersionId,
          body: xml,
          action: 'restore',
          headers: headers },
        function (err, data) {
          callback(err, data);
        });
      }


      // 分块上传


      /**
       * 初始化分块上传
       * @param  {Object}  params                                     参数对象，必须
       *     @param  {String}  params.Bucket                          Bucket名称，必须
       *     @param  {String}  params.Region                          地域名称，必须
       *     @param  {String}  params.Key                             object名称，必须
       *     @param  {String}  params.UploadId                        object名称，必须
       *     @param  {String}  params.CacheControl                    RFC 2616 中定义的缓存策略，将作为 Object 元数据保存，非必须
       *     @param  {String}  params.ContentDisposition              RFC 2616 中定义的文件名称，将作为 Object 元数据保存    ，非必须
       *     @param  {String}  params.ContentEncoding                 RFC 2616 中定义的编码格式，将作为 Object 元数据保存，非必须
       *     @param  {String}  params.ContentType                     RFC 2616 中定义的内容类型（MIME），将作为 Object 元数据保存，非必须
       *     @param  {String}  params.Expires                         RFC 2616 中定义的过期时间，将作为 Object 元数据保存，非必须
       *     @param  {String}  params.ACL                             允许用户自定义文件权限，非必须
       *     @param  {String}  params.GrantRead                       赋予被授权者读的权限 ，非必须
       *     @param  {String}  params.GrantWrite                      赋予被授权者写的权限 ，非必须
       *     @param  {String}  params.GrantFullControl                赋予被授权者读写权限 ，非必须
       *     @param  {String}  params.StorageClass                    设置Object的存储级别，枚举值：Standard，Standard_IA，Archive，非必须
       *     @param  {String}  params.ServerSideEncryption           支持按照指定的加密算法进行服务端数据加密，格式 x-cos-server-side-encryption: "AES256"，非必须
       * @param  {Function}  callback                                 回调函数，必须
       * @return  {Object}  err                                       请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
       * @return  {Object}  data                                      返回的数据
       */
      function multipartInit(params, callback) {
        submitRequest.call(this, {
          Action: 'name/cos:InitiateMultipartUpload',
          method: 'POST',
          Bucket: params.Bucket,
          Region: params.Region,
          Key: params.Key,
          action: 'uploads',
          headers: params.Headers },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          data = util.clone(data || {});
          if (data && data.InitiateMultipartUploadResult) {
            return callback(null, util.extend(data.InitiateMultipartUploadResult, {
              statusCode: data.statusCode,
              headers: data.headers }));

          }
          callback(null, data);
        });
      }

      /**
         * 分块上传
         * @param  {Object}  params                                 参数对象，必须
         *     @param  {String}  params.Bucket                      Bucket名称，必须
         *     @param  {String}  params.Region                      地域名称，必须
         *     @param  {String}  params.Key                         object名称，必须
         *     @param  {String}  params.Body                        上传文件对象或字符串
         *     @param  {String} params.ContentLength                RFC 2616 中定义的 HTTP 请求内容长度（字节），非必须
         *     @param  {String} params.Expect                       当使用 Expect: 100-continue 时，在收到服务端确认后，才会发送请求内容，非必须
         *     @param  {String} params.ServerSideEncryption         支持按照指定的加密算法进行服务端数据加密，格式 x-cos-server-side-encryption: "AES256"，非必须
         *     @param  {String} params.ContentSha1                  RFC 3174 中定义的 160-bit 内容 SHA-1 算法校验值，非必须
         * @param  {Function}  callback                             回调函数，必须
         *     @return  {Object}  err                               请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         *     @return  {Object}  data                              返回的数据
         *     @return  {Object}  data.ETag                         返回的文件分块 sha1 值
         */
      function multipartUpload(params, callback) {

        var self = this;
        util.getFileSize('multipartUpload', params, function () {
          util.getBodyMd5(self.options.UploadCheckContentMd5, params.Body, function (md5) {
            md5 && (params.Headers['Content-MD5'] = util.binaryBase64(md5));
            submitRequest.call(self, {
              Action: 'name/cos:UploadPart',
              TaskId: params.TaskId,
              method: 'PUT',
              Bucket: params.Bucket,
              Region: params.Region,
              Key: params.Key,
              qs: {
                partNumber: params['PartNumber'],
                uploadId: params['UploadId'] },

              headers: params.Headers,
              onProgress: params.onProgress,
              body: params.Body || null },
            function (err, data) {
              if (err) {
                return callback(err);
              }
              if (data && data.headers) {
                var headers = data.headers;
                data.ETag = headers.etag || headers.Etag || headers.ETag || '';
              }

              callback(null, data);
            });
          });
        });

      }

      /**
         * 完成分块上传
         * @param  {Object}  params                             参数对象，必须
         *     @param  {String}  params.Bucket                  Bucket名称，必须
         *     @param  {String}  params.Region                  地域名称，必须
         *     @param  {String}  params.Key                     object名称，必须
         *     @param  {Array}   params.Parts                   分块信息列表，必须
         *     @param  {String}  params.Parts[i].PartNumber     块编号，必须
         *     @param  {String}  params.Parts[i].ETag           分块的 sha1 校验值
         * @param  {Function}  callback                         回调函数，必须
         * @return  {Object}  err                               请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                              返回的数据
         *     @return  {Object}  data.CompleteMultipartUpload  完成分块上传后的文件信息，包括Location, Bucket, Key 和 ETag
         */
      function multipartComplete(params, callback) {
        var self = this;

        var UploadId = params.UploadId;

        var Parts = params['Parts'];

        for (var i = 0, len = Parts.length; i < len; i++) {
          if (Parts[i]['ETag'].indexOf('"') === 0) {
            continue;
          }
          Parts[i]['ETag'] = '"' + Parts[i]['ETag'] + '"';
        }

        var xml = util.json2xml({ CompleteMultipartUpload: { Part: Parts } });

        var headers = params.Headers;
        headers['Content-Type'] = 'application/xml';
        headers['Content-MD5'] = util.binaryBase64(util.md5(xml));

        submitRequest.call(this, {
          Action: 'name/cos:CompleteMultipartUpload',
          method: 'POST',
          Bucket: params.Bucket,
          Region: params.Region,
          Key: params.Key,
          qs: {
            uploadId: UploadId },

          body: xml,
          headers: headers },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          var url = getUrl({
            ForcePathStyle: self.options.ForcePathStyle,
            protocol: self.options.Protocol,
            domain: self.options.Domain,
            bucket: params.Bucket,
            region: params.Region,
            object: params.Key,
            isLocation: true });

          var CompleteMultipartUploadResult = data.CompleteMultipartUploadResult || {};
          var result = util.extend(CompleteMultipartUploadResult, {
            Location: url,
            statusCode: data.statusCode,
            headers: data.headers });

          callback(null, result);
        });
      }

      /**
         * 分块上传任务列表查询
         * @param  {Object}  params                                 参数对象，必须
         *     @param  {String}  params.Bucket                      Bucket名称，必须
         *     @param  {String}  params.Region                      地域名称，必须
         *     @param  {String}  params.Delimiter                   定界符为一个符号，如果有Prefix，则将Prefix到delimiter之间的相同路径归为一类，定义为Common Prefix，然后列出所有Common Prefix。如果没有Prefix，则从路径起点开始，非必须
         *     @param  {String}  params.EncodingType                规定返回值的编码方式，非必须
         *     @param  {String}  params.Prefix                      前缀匹配，用来规定返回的文件前缀地址，非必须
         *     @param  {String}  params.MaxUploads                  单次返回最大的条目数量，默认1000，非必须
         *     @param  {String}  params.KeyMarker                   与upload-id-marker一起使用 </Br>当upload-id-marker未被指定时，ObjectName字母顺序大于key-marker的条目将被列出 </Br>当upload-id-marker被指定时，ObjectName字母顺序大于key-marker的条目被列出，ObjectName字母顺序等于key-marker同时UploadId大于upload-id-marker的条目将被列出，非必须
         *     @param  {String}  params.UploadIdMarker              与key-marker一起使用 </Br>当key-marker未被指定时，upload-id-marker将被忽略 </Br>当key-marker被指定时，ObjectName字母顺序大于key-marker的条目被列出，ObjectName字母顺序等于key-marker同时UploadId大于upload-id-marker的条目将被列出，非必须
         * @param  {Function}  callback                             回调函数，必须
         * @return  {Object}  err                                   请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                                  返回的数据
         *     @return  {Object}  data.ListMultipartUploadsResult   分块上传任务信息
         */
      function multipartList(params, callback) {
        var reqParams = {};

        reqParams['delimiter'] = params['Delimiter'];
        reqParams['encoding-type'] = params['EncodingType'];
        reqParams['prefix'] = params['Prefix'] || '';

        reqParams['max-uploads'] = params['MaxUploads'];

        reqParams['key-marker'] = params['KeyMarker'];
        reqParams['upload-id-marker'] = params['UploadIdMarker'];

        reqParams = util.clearKey(reqParams);

        submitRequest.call(this, {
          Action: 'name/cos:ListMultipartUploads',
          ResourceKey: reqParams['prefix'],
          method: 'GET',
          Bucket: params.Bucket,
          Region: params.Region,
          headers: params.Headers,
          qs: reqParams,
          action: 'uploads' },
        function (err, data) {
          if (err) {
            return callback(err);
          }

          if (data && data.ListMultipartUploadsResult) {
            var Upload = data.ListMultipartUploadsResult.Upload || [];

            var CommonPrefixes = data.ListMultipartUploadsResult.CommonPrefixes || [];

            CommonPrefixes = util.isArray(CommonPrefixes) ? CommonPrefixes : [CommonPrefixes];
            Upload = util.isArray(Upload) ? Upload : [Upload];

            data.ListMultipartUploadsResult.Upload = Upload;
            data.ListMultipartUploadsResult.CommonPrefixes = CommonPrefixes;
          }
          var result = util.clone(data.ListMultipartUploadsResult || {});
          util.extend(result, {
            statusCode: data.statusCode,
            headers: data.headers });

          callback(null, result);
        });
      }

      /**
         * 上传的分块列表查询
         * @param  {Object}  params                                 参数对象，必须
         *     @param  {String}  params.Bucket                      Bucket名称，必须
         *     @param  {String}  params.Region                      地域名称，必须
         *     @param  {String}  params.Key                         object名称，必须
         *     @param  {String}  params.UploadId                    标示本次分块上传的ID，必须
         *     @param  {String}  params.EncodingType                规定返回值的编码方式，非必须
         *     @param  {String}  params.MaxParts                    单次返回最大的条目数量，默认1000，非必须
         *     @param  {String}  params.PartNumberMarker            默认以UTF-8二进制顺序列出条目，所有列出条目从marker开始，非必须
         * @param  {Function}  callback                             回调函数，必须
         * @return  {Object}  err                                   请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         * @return  {Object}  data                                  返回的数据
         *     @return  {Object}  data.ListMultipartUploadsResult   分块信息
         */
      function multipartListPart(params, callback) {
        var reqParams = {};

        reqParams['uploadId'] = params['UploadId'];
        reqParams['encoding-type'] = params['EncodingType'];
        reqParams['max-parts'] = params['MaxParts'];
        reqParams['part-number-marker'] = params['PartNumberMarker'];

        submitRequest.call(this, {
          Action: 'name/cos:ListParts',
          method: 'GET',
          Bucket: params.Bucket,
          Region: params.Region,
          Key: params.Key,
          headers: params.Headers,
          qs: reqParams },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          var ListPartsResult = data.ListPartsResult || {};
          var Part = ListPartsResult.Part || [];
          Part = util.isArray(Part) ? Part : [Part];

          ListPartsResult.Part = Part;
          var result = util.clone(ListPartsResult);
          util.extend(result, {
            statusCode: data.statusCode,
            headers: data.headers });

          callback(null, result);
        });
      }

      /**
         * 抛弃分块上传
         * @param  {Object}  params                 参数对象，必须
         *     @param  {String}  params.Bucket      Bucket名称，必须
         *     @param  {String}  params.Region      地域名称，必须
         *     @param  {String}  params.Key         object名称，必须
         *     @param  {String}  params.UploadId    标示本次分块上传的ID，必须
         * @param  {Function}  callback             回调函数，必须
         *     @return  {Object}    err             请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         *     @return  {Object}    data            返回的数据
         */
      function multipartAbort(params, callback) {
        var reqParams = {};

        reqParams['uploadId'] = params['UploadId'];
        submitRequest.call(this, {
          Action: 'name/cos:AbortMultipartUpload',
          method: 'DELETE',
          Bucket: params.Bucket,
          Region: params.Region,
          Key: params.Key,
          headers: params.Headers,
          qs: reqParams },
        function (err, data) {
          if (err) {
            return callback(err);
          }
          callback(null, {
            statusCode: data.statusCode,
            headers: data.headers });

        });
      }

      /**
         * 获取签名
         * @param  {Object}  params             参数对象，必须
         *     @param  {String}  params.Method  请求方法，必须
         *     @param  {String}  params.Key     object名称，必须
         *     @param  {String}  params.Expires 名超时时间，单位秒，可选
         * @return  {String}  data              返回签名字符串
         */
      function getAuth(params) {
        var self = this;
        return util.getAuth({
          SecretId: params.SecretId || this.options.SecretId || '',
          SecretKey: params.SecretKey || this.options.SecretKey || '',
          Method: params.Method,
          Key: params.Key,
          Query: params.Query,
          Headers: params.Headers,
          Expires: params.Expires,
          SystemClockOffset: self.options.SystemClockOffset });

      }

      /**
         * 获取文件下载链接
         * @param  {Object}  params                 参数对象，必须
         *     @param  {String}  params.Bucket      Bucket名称，必须
         *     @param  {String}  params.Region      地域名称，必须
         *     @param  {String}  params.Key         object名称，必须
         *     @param  {String}  params.Method      请求的方法，可选
         *     @param  {String}  params.Expires     签名超时时间，单位秒，可选
         * @param  {Function}  callback             回调函数，必须
         *     @return  {Object}    err             请求失败的错误，如果请求成功，则为空。https://cloud.tencent.com/document/product/436/7730
         *     @return  {Object}    data            返回的数据
         */
      function getObjectUrl(params, callback) {
        var self = this;
        var url = getUrl({
          ForcePathStyle: self.options.ForcePathStyle,
          protocol: params.Protocol || self.options.Protocol,
          domain: self.options.Domain,
          bucket: params.Bucket,
          region: params.Region,
          object: params.Key });

        if (params.Sign !== undefined && !params.Sign) {
          callback(null, { Url: url });
          return url;
        }
        var AuthData = getAuthorizationAsync.call(this, {
          Action: (params.Method || '').toUpperCase() === 'PUT' ? 'name/cos:PutObject' : 'name/cos:GetObject',
          Bucket: params.Bucket || '',
          Region: params.Region || '',
          Method: params.Method || 'get',
          Key: params.Key,
          Expires: params.Expires },
        function (err, AuthData) {
          if (!callback) return;
          if (err) {
            callback(err);
            return;
          }
          var signUrl = url;
          signUrl += '?' + (AuthData.Authorization.indexOf('q-signature') > -1 ?
          AuthData.Authorization : 'sign=' + encodeURIComponent(AuthData.Authorization));
          AuthData.XCosSecurityToken && (signUrl += '&x-cos-security-token=' + AuthData.XCosSecurityToken);
          AuthData.ClientIP && (signUrl += '&clientIP=' + AuthData.ClientIP);
          AuthData.ClientUA && (signUrl += '&clientUA=' + AuthData.ClientUA);
          AuthData.Token && (signUrl += '&token=' + AuthData.Token);
          setTimeout(function () {
            callback(null, { Url: signUrl });
          });
        });
        if (AuthData) {
          return url + '?' + AuthData.Authorization + (
          AuthData.XCosSecurityToken ? '&x-cos-security-token=' + AuthData.XCosSecurityToken : '');
        } else {
          return url;
        }
      }


      /**
         * 私有方法
         */
      function decodeAcl(AccessControlPolicy) {
        var result = {
          GrantFullControl: [],
          GrantWrite: [],
          GrantRead: [],
          GrantReadAcp: [],
          GrantWriteAcp: [],
          ACL: '' };

        var GrantMap = {
          'FULL_CONTROL': 'GrantFullControl',
          'WRITE': 'GrantWrite',
          'READ': 'GrantRead',
          'READ_ACP': 'GrantReadAcp',
          'WRITE_ACP': 'GrantWriteAcp' };

        var Grant = AccessControlPolicy.AccessControlList.Grant;
        if (Grant) {
          Grant = util.isArray(Grant) ? Grant : [Grant];
        }
        var PublicAcl = { READ: 0, WRITE: 0, FULL_CONTROL: 0 };
        Grant.length && util.each(Grant, function (item) {
          if (item.Grantee.ID === 'qcs::cam::anyone:anyone' || item.Grantee.URI === 'http://cam.qcloud.com/groups/global/AllUsers') {
            PublicAcl[item.Permission] = 1;
          } else if (item.Grantee.ID !== AccessControlPolicy.Owner.ID) {
            result[GrantMap[item.Permission]].push('id="' + item.Grantee.ID + '"');
          }
        });
        if (PublicAcl.FULL_CONTROL || PublicAcl.WRITE && PublicAcl.READ) {
          result.ACL = 'public-read-write';
        } else if (PublicAcl.READ) {
          result.ACL = 'public-read';
        } else {
          result.ACL = 'private';
        }
        util.each(GrantMap, function (item) {
          result[item] = uniqGrant(result[item].join(','));
        });
        return result;
      }

      // Grant 去重
      function uniqGrant(str) {
        var arr = str.split(',');
        var exist = {};
        var i, item;
        for (i = 0; i < arr.length;) {
          item = arr[i].trim();
          if (exist[item]) {
            arr.splice(i, 1);
          } else {
            exist[item] = true;
            arr[i] = item;
            i++;
          }
        }
        return arr.join(',');
      }

      // 生成操作 url
      function getUrl(params) {
        var longBucket = params.bucket;
        var shortBucket = longBucket.substr(0, longBucket.lastIndexOf('-'));
        var appId = longBucket.substr(longBucket.lastIndexOf('-') + 1);
        var domain = params.domain;
        var region = params.region;
        var object = params.object;
        var protocol = 'https:';
        if (!domain) {
          if (['cn-south', 'cn-south-2', 'cn-north', 'cn-east', 'cn-southwest', 'sg'].indexOf(region) > -1) {
            domain = '{Region}.myqcloud.com';
          } else {
            domain = 'cos.{Region}.myqcloud.com';
          }
          if (!params.ForcePathStyle) {
            domain = '{Bucket}.' + domain;
          }
        }
        domain = domain.replace(/\{\{AppId\}\}/ig, appId).
        replace(/\{\{Bucket\}\}/ig, shortBucket).
        replace(/\{\{Region\}\}/ig, region).
        replace(/\{\{.*?\}\}/ig, '');
        domain = domain.replace(/\{AppId\}/ig, appId).
        replace(/\{BucketName\}/ig, shortBucket).
        replace(/\{Bucket\}/ig, longBucket).
        replace(/\{Region\}/ig, region).
        replace(/\{.*?\}/ig, '');
        if (!/^[a-zA-Z]+:\/\//.test(domain)) {
          domain = protocol + '//' + domain;
        }

        // 去掉域名最后的斜杆
        if (domain.slice(-1) === '/') {
          domain = domain.slice(0, -1);
        }
        var url = domain;

        if (params.ForcePathStyle) {
          url += '/' + longBucket;
        }
        url += '/';
        if (object) {
          url += util.camSafeUrlEncode(object).replace(/%2F/g, '/');
        }

        if (params.isLocation) {
          url = url.replace(/^https?:\/\//, '');
        }
        return url;
      }

      // 异步获取签名
      function getAuthorizationAsync(params, callback) {

        var headers = util.clone(params.Headers);
        delete headers['Content-Type'];
        delete headers['Cache-Control'];
        util.each(headers, function (v, k) {
          v === '' && delete headers[k];
        });

        var cb = function cb(AuthData) {

          // 检查签名格式
          var formatAllow = false;
          var auth = AuthData.Authorization;
          if (auth) {
            if (auth.indexOf(' ') > -1) {
              formatAllow = false;
            } else if (auth.indexOf('q-sign-algorithm=') > -1 &&
            auth.indexOf('q-ak=') > -1 &&
            auth.indexOf('q-sign-time=') > -1 &&
            auth.indexOf('q-key-time=') > -1 &&
            auth.indexOf('q-url-param-list=') > -1) {
              formatAllow = true;
            } else {
              try {
                auth = base64.atob(auth);
                if (auth.indexOf('a=') > -1 &&
                auth.indexOf('k=') > -1 &&
                auth.indexOf('t=') > -1 &&
                auth.indexOf('r=') > -1 &&
                auth.indexOf('b=') > -1) {
                  formatAllow = true;
                }
              } catch (e) {}
            }
          }
          if (formatAllow) {
            callback && callback(null, AuthData);
          } else {
            callback && callback('authorization error');
          }
        };

        var self = this;
        var Bucket = params.Bucket || '';
        var Region = params.Region || '';

        // PathName
        var KeyName = params.Action === 'name/cos:PostObject' || !params.Key ? '' : params.Key;
        if (self.options.ForcePathStyle && Bucket) {
          KeyName = Bucket + '/' + KeyName;
        }
        var Pathname = '/' + KeyName;

        // Action、ResourceKey
        var StsData = {};
        var Scope = params.Scope;
        if (!Scope) {
          var Action = params.Action || '';
          var ResourceKey = params.ResourceKey || params.Key || '';
          Scope = params.Scope || [{
            action: Action,
            bucket: Bucket,
            region: Region,
            prefix: ResourceKey }];

        }
        var ScopeKey = util.md5(JSON.stringify(Scope));

        // STS
        self._StsCache = self._StsCache || [];
        (function () {
          var i, AuthData;
          for (i = self._StsCache.length - 1; i >= 0; i--) {
            AuthData = self._StsCache[i];
            var compareTime = Math.round(util.getSkewTime(self.options.SystemClockOffset) / 1000) + 30;
            if (AuthData.StartTime && compareTime < AuthData.StartTime || compareTime >= AuthData.ExpiredTime) {
              self._StsCache.splice(i, 1);
              continue;
            }
            if (!AuthData.ScopeLimit || AuthData.ScopeLimit && AuthData.ScopeKey === ScopeKey) {
              StsData = AuthData;
              break;
            }
          }
        })();

        var calcAuthByTmpKey = function calcAuthByTmpKey() {
          var KeyTime = StsData.StartTime && StsData.ExpiredTime ? StsData.StartTime + ';' + StsData.ExpiredTime : '';
          var Authorization = util.getAuth({
            SecretId: StsData.TmpSecretId,
            SecretKey: StsData.TmpSecretKey,
            Method: params.Method,
            Pathname: Pathname,
            Query: params.Query,
            Headers: headers,
            Expires: params.Expires,
            SystemClockOffset: self.options.SystemClockOffset,
            KeyTime: KeyTime });

          var AuthData = {
            Authorization: Authorization,
            XCosSecurityToken: StsData.XCosSecurityToken || '',
            Token: StsData.Token || '',
            ClientIP: StsData.ClientIP || '',
            ClientUA: StsData.ClientUA || '' };

          cb(AuthData);
        };

        // 先判断是否有临时密钥
        if (StsData.ExpiredTime && StsData.ExpiredTime - util.getSkewTime(self.options.SystemClockOffset) / 1000 > 60) {// 如果缓存的临时密钥有效，并还有超过60秒有效期就直接使用
          calcAuthByTmpKey();
        } else if (self.options.getAuthorization) {// 外部计算签名或获取临时密钥
          self.options.getAuthorization.call(self, {
            Bucket: Bucket,
            Region: Region,
            Method: params.Method,
            Key: KeyName,
            Pathname: Pathname,
            Query: params.Query,
            Headers: headers,
            Scope: Scope },
          function (AuthData) {
            if (typeof AuthData === 'string') {
              AuthData = { Authorization: AuthData };
            }
            if (AuthData.TmpSecretId &&
            AuthData.TmpSecretKey &&
            AuthData.XCosSecurityToken &&
            AuthData.ExpiredTime) {
              StsData = AuthData || {};
              StsData.Scope = Scope;
              StsData.ScopeKey = ScopeKey;
              self._StsCache.push(StsData);
              calcAuthByTmpKey();
            } else {
              cb(AuthData);
            }
          });
        } else if (self.options.getSTS) {// 外部获取临时密钥
          self.options.getSTS.call(self, {
            Bucket: Bucket,
            Region: Region },
          function (data) {
            StsData = data || {};
            StsData.Scope = Scope;
            StsData.ScopeKey = ScopeKey;
            StsData.TmpSecretId = StsData.SecretId;
            StsData.TmpSecretKey = StsData.SecretKey;
            self._StsCache.push(StsData);
            calcAuthByTmpKey();
          });
        } else {// 内部计算获取签名
          return function () {
            var Authorization = util.getAuth({
              SecretId: params.SecretId || self.options.SecretId,
              SecretKey: params.SecretKey || self.options.SecretKey,
              Method: params.Method,
              Pathname: Pathname,
              Query: params.Query,
              Headers: headers,
              Expires: params.Expires,
              SystemClockOffset: self.options.SystemClockOffset });

            var AuthData = {
              Authorization: Authorization,
              XCosSecurityToken: self.options.XCosSecurityToken };

            cb(AuthData);
            return AuthData;
          }();
        }
        return '';
      }

      // 调整时间偏差
      function allowRetry(err) {
        var allowRetry = false;
        var isTimeError = false;
        var serverDate = err.headers && (err.headers.date || err.headers.Date) || '';
        try {
          var errorCode = err.error.Code;
          var errorMessage = err.error.Message;
          if (errorCode === 'RequestTimeTooSkewed' ||
          errorCode === 'AccessDenied' && errorMessage === 'Request has expired') {
            isTimeError = true;
          }
        } catch (e) {
        }
        if (err) {
          if (isTimeError && serverDate) {
            var serverTime = Date.parse(serverDate);
            if (this.options.CorrectClockSkew && Math.abs(util.getSkewTime(this.options.SystemClockOffset) - serverTime) >= 30000) {
              console.error('error: Local time is too skewed.');
              this.options.SystemClockOffset = serverTime - Date.now();
              allowRetry = true;
            }
          } else if (Math.round(err.statusCode / 100) === 5) {
            allowRetry = true;
          }
        }
        return allowRetry;
      }

      // 获取签名并发起请求
      function submitRequest(params, callback) {
        var self = this;

        // 处理 headers
        !params.headers && (params.headers = {});

        // 处理 query
        !params.qs && (params.qs = {});
        params.VersionId && (params.qs.versionId = params.VersionId);
        params.qs = util.clearKey(params.qs);

        // 清理 undefined 和 null 字段
        params.headers && (params.headers = util.clearKey(params.headers));
        params.qs && (params.qs = util.clearKey(params.qs));

        var Query = util.clone(params.qs);
        params.action && (Query[params.action] = '');

        var next = function next(tryIndex) {
          var oldClockOffset = self.options.SystemClockOffset;
          getAuthorizationAsync.call(self, {
            Bucket: params.Bucket || '',
            Region: params.Region || '',
            Method: params.method,
            Key: params.Key,
            Query: Query,
            Headers: params.headers,
            Action: params.Action,
            ResourceKey: params.ResourceKey,
            Scope: params.Scope },
          function (err, AuthData) {
            params.AuthData = AuthData;
            _submitRequest.call(self, params, function (err, data) {
              if (err && tryIndex < 2 && (oldClockOffset !== self.options.SystemClockOffset || allowRetry.call(self, err))) {
                if (params.headers) {
                  delete params.headers.Authorization;
                  delete params.headers['token'];
                  delete params.headers['clientIP'];
                  delete params.headers['clientUA'];
                  delete params.headers['x-cos-security-token'];
                }
                next(tryIndex + 1);
              } else {
                callback(err, data);
              }
            });
          });
        };
        next(0);

      }

      // 发起请求
      function _submitRequest(params, callback) {
        var self = this;
        var TaskId = params.TaskId;
        if (TaskId && !self._isRunningTask(TaskId)) return;

        var bucket = params.Bucket;
        var region = params.Region;
        var object = params.Key;
        var method = params.method || 'GET';
        var url = params.url;
        var body = params.body;
        var json = params.json;
        var rawBody = params.rawBody;

        // url
        url = url || getUrl({
          ForcePathStyle: self.options.ForcePathStyle,
          protocol: self.options.Protocol,
          domain: self.options.Domain,
          bucket: bucket,
          region: region,
          object: object });

        if (params.action) {
          url = url + '?' + params.action;
        }

        var opt = {
          method: method,
          url: url,
          headers: params.headers,
          qs: params.qs,
          filePath: params.filePath,
          body: body,
          json: json };


        // 获取签名
        opt.headers.Authorization = params.AuthData.Authorization;
        params.AuthData.Token && (opt.headers['token'] = params.AuthData.Token);
        params.AuthData.ClientIP && (opt.headers['clientIP'] = params.AuthData.ClientIP);
        params.AuthData.ClientUA && (opt.headers['clientUA'] = params.AuthData.ClientUA);
        params.AuthData.XCosSecurityToken && (opt.headers['x-cos-security-token'] = params.AuthData.XCosSecurityToken);

        // 清理 undefined 和 null 字段
        opt.headers && (opt.headers = util.clearKey(opt.headers));
        opt = util.clearKey(opt);

        // progress
        if (params.onProgress && typeof params.onProgress === 'function') {
          opt.onProgress = function (e) {
            if (TaskId && !self._isRunningTask(TaskId)) return;
            var loaded = e ? e.loaded : 0;
            params.onProgress({ loaded: loaded, total: e.total });
          };
        }

        self.options.ForcePathStyle && (opt.pathStyle = self.options.ForcePathStyle);
        var sender = REQUEST(opt, function (err, response, body) {

          // 返回内容添加 状态码 和 headers
          var hasReturned;
          var cb = function cb(err, data) {
            TaskId && self.off('inner-kill-task', killTask);
            if (hasReturned) return;
            hasReturned = true;
            var attrs = {};
            response && response.statusCode && (attrs.statusCode = response.statusCode);
            response && response.headers && (attrs.headers = response.headers);
            if (err) {
              err = util.extend(err || {}, attrs);
              callback(err, null);
            } else {
              data = util.extend(data || {}, attrs);
              callback(null, data);
            }
          };

          // 请求错误，发生网络错误
          if (err) {
            cb({ error: err });
            return;
          }

          var jsonRes;
          try {
            jsonRes = util.xml2json(body) || {};
          } catch (e) {
            jsonRes = body || {};
          }

          // 请求返回码不为 200
          var statusCode = response.statusCode;
          var statusSuccess = Math.floor(statusCode / 100) === 2; // 200 202 204 206
          if (!statusSuccess) {
            cb({ error: jsonRes.Error || jsonRes });
            return;
          }

          // 不对 body 进行转换，body 直接挂载返回
          if (rawBody) {
            jsonRes = {};
            jsonRes.body = body;
          }

          if (jsonRes.Error) {
            cb({ error: jsonRes.Error });
            return;
          }
          cb(null, jsonRes);
        });

        // kill task
        var killTask = function killTask(data) {
          if (data.TaskId === TaskId) {
            sender && sender.abort && sender.abort();
            self.off('inner-kill-task', killTask);
          }
        };
        TaskId && self.on('inner-kill-task', killTask);

      }


      var API_MAP = {
        // Bucket 相关方法
        getService: getService,
        putBucket: putBucket,
        getBucket: getBucket,
        headBucket: headBucket,
        deleteBucket: deleteBucket,
        getBucketAcl: getBucketAcl,
        putBucketAcl: putBucketAcl,
        getBucketCors: getBucketCors,
        putBucketCors: putBucketCors,
        deleteBucketCors: deleteBucketCors,
        getBucketLocation: getBucketLocation,
        putBucketTagging: putBucketTagging,
        getBucketTagging: getBucketTagging,
        deleteBucketTagging: deleteBucketTagging,
        getBucketPolicy: getBucketPolicy,
        putBucketPolicy: putBucketPolicy,
        deleteBucketPolicy: deleteBucketPolicy,
        getBucketLifecycle: getBucketLifecycle,
        putBucketLifecycle: putBucketLifecycle,
        deleteBucketLifecycle: deleteBucketLifecycle,
        putBucketVersioning: putBucketVersioning,
        getBucketVersioning: getBucketVersioning,
        putBucketReplication: putBucketReplication,
        getBucketReplication: getBucketReplication,
        deleteBucketReplication: deleteBucketReplication,

        // Object 相关方法
        getObject: getObject,
        headObject: headObject,
        listObjectVersions: listObjectVersions,
        putObject: putObject,
        postObject: postObject,
        deleteObject: deleteObject,
        getObjectAcl: getObjectAcl,
        putObjectAcl: putObjectAcl,
        optionsObject: optionsObject,
        putObjectCopy: putObjectCopy,
        deleteMultipleObject: deleteMultipleObject,
        restoreObject: restoreObject,

        // 分块上传相关方法
        uploadPartCopy: uploadPartCopy,
        multipartInit: multipartInit,
        multipartUpload: multipartUpload,
        multipartComplete: multipartComplete,
        multipartList: multipartList,
        multipartListPart: multipartListPart,
        multipartAbort: multipartAbort,

        // 工具方法
        getObjectUrl: getObjectUrl,
        getAuth: getAuth };


      module.exports.init = function (COS, task) {
        task.transferToTaskMethod(API_MAP, 'postObject');
        util.each(API_MAP, function (fn, apiName) {
          COS.prototype[apiName] = util.apiWrapper(apiName, fn);
        });
      };


      /***/},
    /* 16 */
    /***/function (module, exports, __webpack_require__) {

      var util = __webpack_require__(0);

      var originApiMap = {};
      var transferToTaskMethod = function transferToTaskMethod(apiMap, apiName) {
        originApiMap[apiName] = apiMap[apiName];
        apiMap[apiName] = function (params, callback) {
          if (params.SkipTask) {
            originApiMap[apiName].call(this, params, callback);
          } else {
            this._addTask(apiName, params, callback);
          }
        };
      };

      var initTask = function initTask(cos) {

        var queue = [];
        var tasks = {};
        var uploadingFileCount = 0;
        var nextUploadIndex = 0;

        // 接口返回简略的任务信息
        var formatTask = function formatTask(task) {
          var t = {
            id: task.id,
            Bucket: task.Bucket,
            Region: task.Region,
            Key: task.Key,
            FilePath: task.FilePath,
            state: task.state,
            loaded: task.loaded,
            size: task.size,
            speed: task.speed,
            percent: task.percent,
            hashPercent: task.hashPercent,
            error: task.error };

          if (task.FilePath) t.FilePath = task.FilePath;
          return t;
        };

        var emitListUpdate = function emitListUpdate() {
          cos.emit('list-update', { list: util.map(queue, formatTask) });
        };

        var clearQueue = function clearQueue() {
          if (queue.length > cos.options.UploadQueueSize) {
            var i;
            for (i = 0;
            i < queue.length &&
            queue.length > cos.options.UploadQueueSize && // 大于队列才处理
            i < nextUploadIndex; // 小于当前操作的 index 才处理
            i++) {
              if (!queue[i] || queue[i].state !== 'waiting') {
                queue.splice(i, 1);
                nextUploadIndex--;
              }
            }
          }
        };

        var startNextTask = function startNextTask() {
          if (nextUploadIndex < queue.length &&
          uploadingFileCount < cos.options.FileParallelLimit) {
            var task = queue[nextUploadIndex];
            if (task.state === 'waiting') {
              uploadingFileCount++;
              task.state = 'checking';
              var apiParams = util.formatParams(task.api, task.params);
              originApiMap[task.api].call(cos, apiParams, function (err, data) {
                if (!cos._isRunningTask(task.id)) return;
                if (task.state === 'checking' || task.state === 'uploading') {
                  task.state = err ? 'error' : 'success';
                  err && (task.error = err);
                  uploadingFileCount--;
                  emitListUpdate();
                  startNextTask(cos);
                  task.callback && task.callback(err, data);
                  if (task.state === 'success') {
                    if (task.params) {
                      delete task.params.Body;
                      delete task.params;
                    }
                    delete task.callback;
                  }
                }
                clearQueue();
              });
              emitListUpdate();
            }
            nextUploadIndex++;
            startNextTask(cos);
          }
        };

        var killTask = function killTask(id, switchToState) {
          var task = tasks[id];
          if (!task) return;
          var waiting = task && task.state === 'waiting';
          var running = task && (task.state === 'checking' || task.state === 'uploading');
          if (switchToState === 'canceled' && task.state !== 'canceled' ||
          switchToState === 'paused' && waiting ||
          switchToState === 'paused' && running) {
            if (switchToState === 'paused' && task.params.Body && typeof task.params.Body.pipe === 'function') {
              console.error('stream not support pause');
              return;
            }
            task.state = switchToState;
            cos.emit('inner-kill-task', { TaskId: id, toState: switchToState });
            emitListUpdate();
            if (running) {
              uploadingFileCount--;
              startNextTask(cos);
            }
            if (switchToState === 'canceled') {
              if (task.params) {
                delete task.params.Body;
                delete task.params;
              }
              delete task.callback;
            }
          }
          clearQueue();
        };

        cos._addTasks = function (taskList) {
          util.each(taskList, function (task) {
            cos._addTask(task.api, task.params, task.callback, true);
          });
          emitListUpdate();
        };

        cos._addTask = function (api, params, callback, ignoreAddEvent) {

          // 复制参数对象
          params = util.formatParams(api, params);

          // 生成 id
          var id = util.uuid();
          params.TaskId = id;
          params.TaskReady && params.TaskReady(id);

          var task = {
            // env
            params: params,
            callback: callback,
            api: api,
            index: queue.length,
            // task
            id: id,
            Bucket: params.Bucket,
            Region: params.Region,
            Key: params.Key,
            FilePath: params.FilePath || '',
            state: 'waiting',
            loaded: 0,
            size: 0,
            speed: 0,
            percent: 0,
            hashPercent: 0,
            error: null };

          var onHashProgress = params.onHashProgress;
          params.onHashProgress = function (info) {
            if (!cos._isRunningTask(task.id)) return;
            task.hashPercent = info.percent;
            onHashProgress && onHashProgress(info);
            emitListUpdate();
          };
          var onProgress = params.onProgress;
          params.onProgress = function (info) {
            if (!cos._isRunningTask(task.id)) return;
            task.state === 'checking' && (task.state = 'uploading');
            task.loaded = info.loaded;
            task.size = info.total;
            task.speed = info.speed;
            task.percent = info.percent;
            onProgress && onProgress(info);
            emitListUpdate();
          };

          (function () {
            // 获取完文件大小再把任务加入队列
            tasks[id] = task;
            queue.push(task);
            task.size = params.FileSize;
            !ignoreAddEvent && emitListUpdate();
            startNextTask(cos);
            clearQueue();
          })();
          return id;
        };
        cos._isRunningTask = function (id) {
          var task = tasks[id];
          return !!(task && (task.state === 'checking' || task.state === 'uploading'));
        };
        cos.getTaskList = function () {
          return util.map(queue, formatTask);
        };
        cos.cancelTask = function (id) {
          killTask(id, 'canceled');
        };
        cos.pauseTask = function (id) {
          killTask(id, 'paused');
        };
        cos.restartTask = function (id) {
          var task = tasks[id];
          if (task && (task.state === 'paused' || task.state === 'error')) {
            task.state = 'waiting';
            emitListUpdate();
            nextUploadIndex = Math.min(nextUploadIndex, task.index);
            startNextTask();
          }
        };

      };

      module.exports.transferToTaskMethod = transferToTaskMethod;
      module.exports.init = initTask;


      /***/}]));

});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ })
]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map