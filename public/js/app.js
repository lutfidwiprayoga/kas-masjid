/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(/*! process/browser.js */ "./node_modules/process/browser.js");


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var pkg = __webpack_require__(/*! ./../../package.json */ "./node_modules/axios/package.json");

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(/*! ./bootstrap */ "./resources/js/bootstrap.js");

window.Highcharts = __webpack_require__(/*! highcharts */ "./node_modules/highcharts/highcharts.js");

/***/ }),

/***/ "./resources/js/bootstrap.js":
/*!***********************************!*\
  !*** ./resources/js/bootstrap.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

window._ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */
// import Echo from 'laravel-echo';
// window.Pusher = require('pusher-js');
// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     forceTLS: true
// });

/***/ }),

/***/ "./node_modules/highcharts/highcharts.js":
/*!***********************************************!*\
  !*** ./node_modules/highcharts/highcharts.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
 Highcharts JS v10.1.0 (2022-04-29)

 (c) 2009-2021 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(U,K){ true&&module.exports?(K["default"]=K,module.exports=U.document?K(U):K): true?!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(){return K(U)}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):(0)})("undefined"!==typeof window?window:this,function(U){function K(a,C,f,H){a.hasOwnProperty(C)||(a[C]=H.apply(null,f),"function"===typeof CustomEvent&&U.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:C,module:a[C]}})))}
var f={};K(f,"Core/Globals.js",[],function(){var a;(function(a){a.SVG_NS="http://www.w3.org/2000/svg";a.product="Highcharts";a.version="10.1.0";a.win="undefined"!==typeof U?U:{};a.doc=a.win.document;a.svg=a.doc&&a.doc.createElementNS&&!!a.doc.createElementNS(a.SVG_NS,"svg").createSVGRect;a.userAgent=a.win.navigator&&a.win.navigator.userAgent||"";a.isChrome=-1!==a.userAgent.indexOf("Chrome");a.isFirefox=-1!==a.userAgent.indexOf("Firefox");a.isMS=/(edge|msie|trident)/i.test(a.userAgent)&&!a.win.opera;
a.isSafari=!a.isChrome&&-1!==a.userAgent.indexOf("Safari");a.isTouchDevice=/(Mobile|Android|Windows Phone)/.test(a.userAgent);a.isWebKit=-1!==a.userAgent.indexOf("AppleWebKit");a.deg2rad=2*Math.PI/360;a.hasBidiBug=a.isFirefox&&4>parseInt(a.userAgent.split("Firefox/")[1],10);a.hasTouch=!!a.win.TouchEvent;a.marginNames=["plotTop","marginRight","marginBottom","plotLeft"];a.noop=function(){};a.supportsPassiveEvents=function(){var f=!1;if(!a.isMS){var C=Object.defineProperty({},"passive",{get:function(){f=
!0}});a.win.addEventListener&&a.win.removeEventListener&&(a.win.addEventListener("testPassive",a.noop,C),a.win.removeEventListener("testPassive",a.noop,C))}return f}();a.charts=[];a.dateFormats={};a.seriesTypes={};a.symbolSizes={};a.chartCount=0})(a||(a={}));"";return a});K(f,"Core/Utilities.js",[f["Core/Globals.js"]],function(a){function f(d,r,h,l){var v=r?"Highcharts error":"Highcharts warning";32===d&&(d=v+": Deprecated member");var m=n(d),c=m?v+" #"+d+": www.highcharts.com/errors/"+d+"/":d.toString();
if("undefined"!==typeof l){var q="";m&&(c+="?");y(l,function(b,d){q+="\n - "+d+": "+b;m&&(c+=encodeURI(d)+"="+encodeURI(b))});c+=q}z(a,"displayError",{chart:h,code:d,message:c,params:l},function(){if(r)throw Error(c);b.console&&-1===f.messages.indexOf(c)&&console.warn(c)});f.messages.push(c)}function B(b,d){var v={};y(b,function(r,h){if(I(b[h],!0)&&!b.nodeType&&d[h])r=B(b[h],d[h]),Object.keys(r).length&&(v[h]=r);else if(I(b[h])||b[h]!==d[h]||h in b&&!(h in d))v[h]=b[h]});return v}function H(b,d){return parseInt(b,
d||10)}function w(b){return"string"===typeof b}function E(b){b=Object.prototype.toString.call(b);return"[object Array]"===b||"[object Array Iterator]"===b}function I(b,d){return!!b&&"object"===typeof b&&(!d||!E(b))}function A(b){return I(b)&&"number"===typeof b.nodeType}function u(b){var d=b&&b.constructor;return!(!I(b,!0)||A(b)||!d||!d.name||"Object"===d.name)}function n(b){return"number"===typeof b&&!isNaN(b)&&Infinity>b&&-Infinity<b}function k(b){return"undefined"!==typeof b&&null!==b}function e(b,
d,h){var v=w(d)&&!k(h),r,l=function(d,h){k(d)?b.setAttribute(h,d):v?(r=b.getAttribute(h))||"class"!==h||(r=b.getAttribute(h+"Name")):b.removeAttribute(h)};w(d)?l(h,d):y(d,l);return r}function c(b,d){var v;b||(b={});for(v in d)b[v]=d[v];return b}function p(){for(var b=arguments,d=b.length,h=0;h<d;h++){var l=b[h];if("undefined"!==typeof l&&null!==l)return l}}function g(b,d){a.isMS&&!a.svg&&d&&k(d.opacity)&&(d.filter="alpha(opacity="+100*d.opacity+")");c(b.style,d)}function t(b){return Math.pow(10,Math.floor(Math.log(b)/
Math.LN10))}function q(b,d){return 1E14<b?b:parseFloat(b.toPrecision(d||14))}function F(d,r,h){var v=a.getStyle||F;if("width"===r)return r=Math.min(d.offsetWidth,d.scrollWidth),h=d.getBoundingClientRect&&d.getBoundingClientRect().width,h<r&&h>=r-1&&(r=Math.floor(h)),Math.max(0,r-(v(d,"padding-left",!0)||0)-(v(d,"padding-right",!0)||0));if("height"===r)return Math.max(0,Math.min(d.offsetHeight,d.scrollHeight)-(v(d,"padding-top",!0)||0)-(v(d,"padding-bottom",!0)||0));b.getComputedStyle||f(27,!0);if(d=
b.getComputedStyle(d,void 0)){var l=d.getPropertyValue(r);p(h,"opacity"!==r)&&(l=H(l))}return l}function y(b,d,h){for(var v in b)Object.hasOwnProperty.call(b,v)&&d.call(h||b[v],b[v],v,b)}function x(b,d,h){function v(d,J){var v=b.removeEventListener||a.removeEventListenerPolyfill;v&&v.call(b,d,J,!1)}function r(r){var J;if(b.nodeName){if(d){var L={};L[d]=!0}else L=r;y(L,function(b,d){if(r[d])for(J=r[d].length;J--;)v(d,r[d][J].fn)})}}var l="function"===typeof b&&b.prototype||b;if(Object.hasOwnProperty.call(l,
"hcEvents")){var m=l.hcEvents;d?(l=m[d]||[],h?(m[d]=l.filter(function(b){return h!==b.fn}),v(d,h)):(r(m),m[d]=[])):(r(m),delete l.hcEvents)}}function z(b,d,l,m){l=l||{};if(h.createEvent&&(b.dispatchEvent||b.fireEvent&&b!==a)){var v=h.createEvent("Events");v.initEvent(d,!0,!0);l=c(v,l);b.dispatchEvent?b.dispatchEvent(l):b.fireEvent(d,l)}else if(b.hcEvents){l.target||c(l,{preventDefault:function(){l.defaultPrevented=!0},target:b,type:d});v=[];for(var r=b,q=!1;r.hcEvents;)Object.hasOwnProperty.call(r,
"hcEvents")&&r.hcEvents[d]&&(v.length&&(q=!0),v.unshift.apply(v,r.hcEvents[d])),r=Object.getPrototypeOf(r);q&&v.sort(function(b,d){return b.order-d.order});v.forEach(function(d){!1===d.fn.call(b,l)&&l.preventDefault()})}m&&!l.defaultPrevented&&m.call(b,l)}var m=a.charts,h=a.doc,b=a.win;(f||(f={})).messages=[];Math.easeInOutSine=function(b){return-.5*(Math.cos(Math.PI*b)-1)};var l=Array.prototype.find?function(b,d){return b.find(d)}:function(b,d){var v,r=b.length;for(v=0;v<r;v++)if(d(b[v],v))return b[v]};
y({map:"map",each:"forEach",grep:"filter",reduce:"reduce",some:"some"},function(b,d){a[d]=function(v){var r;f(32,!1,void 0,(r={},r["Highcharts."+d]="use Array."+b,r));return Array.prototype[b].apply(v,[].slice.call(arguments,1))}});var d,D=function(){var b=Math.random().toString(36).substring(2,9)+"-",r=0;return function(){return"highcharts-"+(d?"":b)+r++}}();b.jQuery&&(b.jQuery.fn.highcharts=function(){var b=[].slice.call(arguments);if(this[0])return b[0]?(new (a[w(b[0])?b.shift():"Chart"])(this[0],
b[0],b[1]),this):m[e(this[0],"data-highcharts-chart")]});l={addEvent:function(b,d,h,l){void 0===l&&(l={});var r="function"===typeof b&&b.prototype||b;Object.hasOwnProperty.call(r,"hcEvents")||(r.hcEvents={});r=r.hcEvents;a.Point&&b instanceof a.Point&&b.series&&b.series.chart&&(b.series.chart.runTrackerClick=!0);var v=b.addEventListener||a.addEventListenerPolyfill;v&&v.call(b,d,h,a.supportsPassiveEvents?{passive:void 0===l.passive?-1!==d.indexOf("touch"):l.passive,capture:!1}:!1);r[d]||(r[d]=[]);
r[d].push({fn:h,order:"number"===typeof l.order?l.order:Infinity});r[d].sort(function(b,d){return b.order-d.order});return function(){x(b,d,h)}},arrayMax:function(b){for(var d=b.length,v=b[0];d--;)b[d]>v&&(v=b[d]);return v},arrayMin:function(b){for(var d=b.length,v=b[0];d--;)b[d]<v&&(v=b[d]);return v},attr:e,clamp:function(b,d,h){return b>d?b<h?b:h:d},cleanRecursively:B,clearTimeout:function(b){k(b)&&clearTimeout(b)},correctFloat:q,createElement:function(b,d,l,m,q){b=h.createElement(b);d&&c(b,d);
q&&g(b,{padding:"0",border:"none",margin:"0"});l&&g(b,l);m&&m.appendChild(b);return b},css:g,defined:k,destroyObjectProperties:function(b,d){y(b,function(r,v){r&&r!==d&&r.destroy&&r.destroy();delete b[v]})},discardElement:function(b){b&&b.parentElement&&b.parentElement.removeChild(b)},erase:function(b,d){for(var r=b.length;r--;)if(b[r]===d){b.splice(r,1);break}},error:f,extend:c,extendClass:function(b,d){var r=function(){};r.prototype=new b;c(r.prototype,d);return r},find:l,fireEvent:z,getMagnitude:t,
getNestedProperty:function(d,r){for(d=d.split(".");d.length&&k(r);){var h=d.shift();if("undefined"===typeof h||"__proto__"===h)return;r=r[h];if(!k(r)||"function"===typeof r||"number"===typeof r.nodeType||r===b)return}return r},getStyle:F,inArray:function(b,d,h){f(32,!1,void 0,{"Highcharts.inArray":"use Array.indexOf"});return d.indexOf(b,h)},isArray:E,isClass:u,isDOMElement:A,isFunction:function(b){return"function"===typeof b},isNumber:n,isObject:I,isString:w,keys:function(b){f(32,!1,void 0,{"Highcharts.keys":"use Object.keys"});
return Object.keys(b)},merge:function(){var b,d=arguments,h={},l=function(b,d){"object"!==typeof b&&(b={});y(d,function(r,J){"__proto__"!==J&&"constructor"!==J&&(!I(r,!0)||u(r)||A(r)?b[J]=d[J]:b[J]=l(b[J]||{},r))});return b};!0===d[0]&&(h=d[1],d=Array.prototype.slice.call(d,2));var m=d.length;for(b=0;b<m;b++)h=l(h,d[b]);return h},normalizeTickInterval:function(b,d,h,l,m){var r=b;h=p(h,t(b));var v=b/h;d||(d=m?[1,1.2,1.5,2,2.5,3,4,5,6,8,10]:[1,2,2.5,5,10],!1===l&&(1===h?d=d.filter(function(b){return 0===
b%1}):.1>=h&&(d=[1/h])));for(l=0;l<d.length&&!(r=d[l],m&&r*h>=b||!m&&v<=(d[l]+(d[l+1]||d[l]))/2);l++);return r=q(r*h,-Math.round(Math.log(.001)/Math.LN10))},objectEach:y,offset:function(d){var r=h.documentElement;d=d.parentElement||d.parentNode?d.getBoundingClientRect():{top:0,left:0,width:0,height:0};return{top:d.top+(b.pageYOffset||r.scrollTop)-(r.clientTop||0),left:d.left+(b.pageXOffset||r.scrollLeft)-(r.clientLeft||0),width:d.width,height:d.height}},pad:function(b,d,h){return Array((d||2)+1-String(b).replace("-",
"").length).join(h||"0")+b},pick:p,pInt:H,relativeLength:function(b,d,h){return/%$/.test(b)?d*parseFloat(b)/100+(h||0):parseFloat(b)},removeEvent:x,splat:function(b){return E(b)?b:[b]},stableSort:function(b,d){var h=b.length,r,l;for(l=0;l<h;l++)b[l].safeI=l;b.sort(function(b,h){r=d(b,h);return 0===r?b.safeI-h.safeI:r});for(l=0;l<h;l++)delete b[l].safeI},syncTimeout:function(b,d,h){if(0<d)return setTimeout(b,d,h);b.call(0,h);return-1},timeUnits:{millisecond:1,second:1E3,minute:6E4,hour:36E5,day:864E5,
week:6048E5,month:24192E5,year:314496E5},uniqueKey:D,useSerialIds:function(b){return d=p(b,d)},wrap:function(b,d,h){var l=b[d];b[d]=function(){var b=Array.prototype.slice.call(arguments),d=arguments,r=this;r.proceed=function(){l.apply(r,arguments.length?arguments:d)};b.unshift(l);b=h.apply(this,b);r.proceed=null;return b}}};"";return l});K(f,"Core/Chart/ChartDefaults.js",[],function(){return{alignThresholds:!1,panning:{enabled:!1,type:"x"},styledMode:!1,borderRadius:0,colorCount:10,allowMutatingData:!0,
defaultSeriesType:"line",ignoreHiddenSeries:!0,spacing:[10,10,15,10],resetZoomButton:{theme:{zIndex:6},position:{align:"right",x:-10,y:10}},zoomBySingleTouch:!1,width:null,height:null,borderColor:"#335cad",backgroundColor:"#ffffff",plotBorderColor:"#cccccc"}});K(f,"Core/Color/Color.js",[f["Core/Globals.js"],f["Core/Utilities.js"]],function(a,f){var C=f.isNumber,H=f.merge,w=f.pInt;f=function(){function f(C){this.rgba=[NaN,NaN,NaN,NaN];this.input=C;var A=a.Color;if(A&&A!==f)return new A(C);if(!(this instanceof
f))return new f(C);this.init(C)}f.parse=function(a){return a?new f(a):f.None};f.prototype.init=function(a){var A;if("object"===typeof a&&"undefined"!==typeof a.stops)this.stops=a.stops.map(function(e){return new f(e[1])});else if("string"===typeof a){this.input=a=f.names[a.toLowerCase()]||a;if("#"===a.charAt(0)){var u=a.length;var n=parseInt(a.substr(1),16);7===u?A=[(n&16711680)>>16,(n&65280)>>8,n&255,1]:4===u&&(A=[(n&3840)>>4|(n&3840)>>8,(n&240)>>4|n&240,(n&15)<<4|n&15,1])}if(!A)for(n=f.parsers.length;n--&&
!A;){var k=f.parsers[n];(u=k.regex.exec(a))&&(A=k.parse(u))}}A&&(this.rgba=A)};f.prototype.get=function(a){var A=this.input,u=this.rgba;if("object"===typeof A&&"undefined"!==typeof this.stops){var n=H(A);n.stops=[].slice.call(n.stops);this.stops.forEach(function(k,e){n.stops[e]=[n.stops[e][0],k.get(a)]});return n}return u&&C(u[0])?"rgb"===a||!a&&1===u[3]?"rgb("+u[0]+","+u[1]+","+u[2]+")":"a"===a?""+u[3]:"rgba("+u.join(",")+")":A};f.prototype.brighten=function(a){var A=this.rgba;if(this.stops)this.stops.forEach(function(n){n.brighten(a)});
else if(C(a)&&0!==a)for(var u=0;3>u;u++)A[u]+=w(255*a),0>A[u]&&(A[u]=0),255<A[u]&&(A[u]=255);return this};f.prototype.setOpacity=function(a){this.rgba[3]=a;return this};f.prototype.tweenTo=function(a,A){var u=this.rgba,n=a.rgba;if(!C(u[0])||!C(n[0]))return a.input||"none";a=1!==n[3]||1!==u[3];return(a?"rgba(":"rgb(")+Math.round(n[0]+(u[0]-n[0])*(1-A))+","+Math.round(n[1]+(u[1]-n[1])*(1-A))+","+Math.round(n[2]+(u[2]-n[2])*(1-A))+(a?","+(n[3]+(u[3]-n[3])*(1-A)):"")+")"};f.names={white:"#ffffff",black:"#000000"};
f.parsers=[{regex:/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,parse:function(a){return[w(a[1]),w(a[2]),w(a[3]),parseFloat(a[4],10)]}},{regex:/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,parse:function(a){return[w(a[1]),w(a[2]),w(a[3]),1]}}];f.None=new f("");return f}();"";return f});K(f,"Core/Color/Palettes.js",[],function(){return{colors:"#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1".split(" ")}});
K(f,"Core/Time.js",[f["Core/Globals.js"],f["Core/Utilities.js"]],function(a,f){var C=a.win,H=f.defined,w=f.error,E=f.extend,I=f.isObject,A=f.merge,u=f.objectEach,n=f.pad,k=f.pick,e=f.splat,c=f.timeUnits,p=a.isSafari&&C.Intl&&C.Intl.DateTimeFormat.prototype.formatRange,g=a.isSafari&&C.Intl&&!C.Intl.DateTimeFormat.prototype.formatRange;f=function(){function t(c){this.options={};this.variableTimezone=this.useUTC=!1;this.Date=C.Date;this.getTimezoneOffset=this.timezoneOffsetFunction();this.update(c)}
t.prototype.get=function(c,e){if(this.variableTimezone||this.timezoneOffset){var q=e.getTime(),p=q-this.getTimezoneOffset(e);e.setTime(p);c=e["getUTC"+c]();e.setTime(q);return c}return this.useUTC?e["getUTC"+c]():e["get"+c]()};t.prototype.set=function(c,e,g){if(this.variableTimezone||this.timezoneOffset){if("Milliseconds"===c||"Seconds"===c||"Minutes"===c&&0===this.getTimezoneOffset(e)%36E5)return e["setUTC"+c](g);var q=this.getTimezoneOffset(e);q=e.getTime()-q;e.setTime(q);e["setUTC"+c](g);c=this.getTimezoneOffset(e);
q=e.getTime()+c;return e.setTime(q)}return this.useUTC||p&&"FullYear"===c?e["setUTC"+c](g):e["set"+c](g)};t.prototype.update=function(c){var e=k(c&&c.useUTC,!0);this.options=c=A(!0,this.options||{},c);this.Date=c.Date||C.Date||Date;this.timezoneOffset=(this.useUTC=e)&&c.timezoneOffset;this.getTimezoneOffset=this.timezoneOffsetFunction();this.variableTimezone=e&&!(!c.getTimezoneOffset&&!c.timezone)};t.prototype.makeTime=function(c,e,p,t,z,m){if(this.useUTC){var h=this.Date.UTC.apply(0,arguments);var b=
this.getTimezoneOffset(h);h+=b;var l=this.getTimezoneOffset(h);b!==l?h+=l-b:b-36E5!==this.getTimezoneOffset(h-36E5)||g||(h-=36E5)}else h=(new this.Date(c,e,k(p,1),k(t,0),k(z,0),k(m,0))).getTime();return h};t.prototype.timezoneOffsetFunction=function(){var c=this,e=this.options,p=e.getTimezoneOffset,g=e.moment||C.moment;if(!this.useUTC)return function(c){return 6E4*(new Date(c.toString())).getTimezoneOffset()};if(e.timezone){if(g)return function(c){return 6E4*-g.tz(c,e.timezone).utcOffset()};w(25)}return this.useUTC&&
p?function(c){return 6E4*p(c.valueOf())}:function(){return 6E4*(c.timezoneOffset||0)}};t.prototype.dateFormat=function(c,e,p){if(!H(e)||isNaN(e))return a.defaultOptions.lang&&a.defaultOptions.lang.invalidDate||"";c=k(c,"%Y-%m-%d %H:%M:%S");var q=this,g=new this.Date(e),m=this.get("Hours",g),h=this.get("Day",g),b=this.get("Date",g),l=this.get("Month",g),d=this.get("FullYear",g),D=a.defaultOptions.lang,v=D&&D.weekdays,r=D&&D.shortWeekdays;g=E({a:r?r[h]:v[h].substr(0,3),A:v[h],d:n(b),e:n(b,2," "),w:h,
b:D.shortMonths[l],B:D.months[l],m:n(l+1),o:l+1,y:d.toString().substr(2,2),Y:d,H:n(m),k:m,I:n(m%12||12),l:m%12||12,M:n(this.get("Minutes",g)),p:12>m?"AM":"PM",P:12>m?"am":"pm",S:n(g.getSeconds()),L:n(Math.floor(e%1E3),3)},a.dateFormats);u(g,function(b,d){for(;-1!==c.indexOf("%"+d);)c=c.replace("%"+d,"function"===typeof b?b.call(q,e):b)});return p?c.substr(0,1).toUpperCase()+c.substr(1):c};t.prototype.resolveDTLFormat=function(c){return I(c,!0)?c:(c=e(c),{main:c[0],from:c[1],to:c[2]})};t.prototype.getTimeTicks=
function(e,g,p,t){var q=this,m=[],h={},b=new q.Date(g),l=e.unitRange,d=e.count||1,D;t=k(t,1);if(H(g)){q.set("Milliseconds",b,l>=c.second?0:d*Math.floor(q.get("Milliseconds",b)/d));l>=c.second&&q.set("Seconds",b,l>=c.minute?0:d*Math.floor(q.get("Seconds",b)/d));l>=c.minute&&q.set("Minutes",b,l>=c.hour?0:d*Math.floor(q.get("Minutes",b)/d));l>=c.hour&&q.set("Hours",b,l>=c.day?0:d*Math.floor(q.get("Hours",b)/d));l>=c.day&&q.set("Date",b,l>=c.month?1:Math.max(1,d*Math.floor(q.get("Date",b)/d)));if(l>=
c.month){q.set("Month",b,l>=c.year?0:d*Math.floor(q.get("Month",b)/d));var v=q.get("FullYear",b)}l>=c.year&&q.set("FullYear",b,v-v%d);l===c.week&&(v=q.get("Day",b),q.set("Date",b,q.get("Date",b)-v+t+(v<t?-7:0)));v=q.get("FullYear",b);t=q.get("Month",b);var r=q.get("Date",b),y=q.get("Hours",b);g=b.getTime();!q.variableTimezone&&q.useUTC||!H(p)||(D=p-g>4*c.month||q.getTimezoneOffset(g)!==q.getTimezoneOffset(p));g=b.getTime();for(b=1;g<p;)m.push(g),g=l===c.year?q.makeTime(v+b*d,0):l===c.month?q.makeTime(v,
t+b*d):!D||l!==c.day&&l!==c.week?D&&l===c.hour&&1<d?q.makeTime(v,t,r,y+b*d):g+l*d:q.makeTime(v,t,r+b*d*(l===c.day?1:7)),b++;m.push(g);l<=c.hour&&1E4>m.length&&m.forEach(function(b){0===b%18E5&&"000000000"===q.dateFormat("%H%M%S%L",b)&&(h[b]="day")})}m.info=E(e,{higherRanks:h,totalRange:l*d});return m};t.prototype.getDateFormat=function(e,g,p,t){var q=this.dateFormat("%m-%d %H:%M:%S.%L",g),m={millisecond:15,second:12,minute:9,hour:6,day:3},h="millisecond";for(b in c){if(e===c.week&&+this.dateFormat("%w",
g)===p&&"00:00:00.000"===q.substr(6)){var b="week";break}if(c[b]>e){b=h;break}if(m[b]&&q.substr(m[b])!=="01-01 00:00:00.000".substr(m[b]))break;"week"!==b&&(h=b)}if(b)var l=this.resolveDTLFormat(t[b]).main;return l};return t}();"";return f});K(f,"Core/DefaultOptions.js",[f["Core/Chart/ChartDefaults.js"],f["Core/Color/Color.js"],f["Core/Globals.js"],f["Core/Color/Palettes.js"],f["Core/Time.js"],f["Core/Utilities.js"]],function(a,f,B,H,w,E){f=f.parse;var C=E.merge,A={colors:H.colors,symbols:["circle",
"diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:"January February March April May June July August September October November December".split(" "),shortMonths:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),weekdays:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),decimalPoint:".",numericSymbols:"kMGTPE".split(""),resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:" "},global:{},time:{Date:void 0,getTimezoneOffset:void 0,
timezone:void 0,timezoneOffset:0,useUTC:!0},chart:a,title:{text:"Chart title",align:"center",margin:15,widthAdjust:-44},subtitle:{text:"",align:"center",widthAdjust:-44},caption:{margin:15,text:"",align:"left",verticalAlign:"bottom"},plotOptions:{},labels:{style:{position:"absolute",color:"#333333"}},legend:{enabled:!0,align:"center",alignColumns:!0,className:"highcharts-no-tooltip",layout:"horizontal",labelFormatter:function(){return this.name},borderColor:"#999999",borderRadius:0,navigation:{activeColor:"#003399",
inactiveColor:"#cccccc"},itemStyle:{color:"#333333",cursor:"pointer",fontSize:"12px",fontWeight:"bold",textOverflow:"ellipsis"},itemHoverStyle:{color:"#000000"},itemHiddenStyle:{color:"#cccccc"},shadow:!1,itemCheckboxStyle:{position:"absolute",width:"13px",height:"13px"},squareSymbol:!0,symbolPadding:5,verticalAlign:"bottom",x:0,y:0,title:{style:{fontWeight:"bold"}}},loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"45%"},style:{position:"absolute",backgroundColor:"#ffffff",opacity:.5,
textAlign:"center"}},tooltip:{enabled:!0,animation:B.svg,borderRadius:3,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",second:"%A, %b %e, %H:%M:%S",minute:"%A, %b %e, %H:%M",hour:"%A, %b %e, %H:%M",day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",month:"%B %Y",year:"%Y"},footerFormat:"",headerShape:"callout",hideDelay:500,padding:8,shape:"callout",shared:!1,snap:B.isTouchDevice?25:10,headerFormat:'<span style="font-size: 10px">{point.key}</span><br/>',pointFormat:'<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',
backgroundColor:f("#f7f7f7").setOpacity(.85).get(),borderWidth:1,shadow:!0,stickOnContact:!1,style:{color:"#333333",cursor:"default",fontSize:"12px",whiteSpace:"nowrap"},useHTML:!1},credits:{enabled:!0,href:"https://www.highcharts.com?credits",position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#999999",fontSize:"9px"},text:"Highcharts.com"}};A.chart.styledMode=!1;"";var u=new w(C(A.global,A.time));a={defaultOptions:A,defaultTime:u,getOptions:function(){return A},
setOptions:function(n){C(!0,A,n);if(n.time||n.global)B.time?B.time.update(C(A.global,A.time,n.global,n.time)):B.time=u;return A}};"";return a});K(f,"Core/Animation/Fx.js",[f["Core/Color/Color.js"],f["Core/Globals.js"],f["Core/Utilities.js"]],function(a,f,B){var C=a.parse,w=f.win,E=B.isNumber,I=B.objectEach;return function(){function a(a,n,k){this.pos=NaN;this.options=n;this.elem=a;this.prop=k}a.prototype.dSetter=function(){var a=this.paths,n=a&&a[0];a=a&&a[1];var k=this.now||0,e=[];if(1!==k&&n&&a)if(n.length===
a.length&&1>k)for(var c=0;c<a.length;c++){for(var p=n[c],g=a[c],t=[],q=0;q<g.length;q++){var F=p[q],y=g[q];E(F)&&E(y)&&("A"!==g[0]||4!==q&&5!==q)?t[q]=F+k*(y-F):t[q]=y}e.push(t)}else e=a;else e=this.toD||[];this.elem.attr("d",e,void 0,!0)};a.prototype.update=function(){var a=this.elem,n=this.prop,k=this.now,e=this.options.step;if(this[n+"Setter"])this[n+"Setter"]();else a.attr?a.element&&a.attr(n,k,null,!0):a.style[n]=k+this.unit;e&&e.call(a,k,this)};a.prototype.run=function(u,n,k){var e=this,c=e.options,
p=function(c){return p.stopped?!1:e.step(c)},g=w.requestAnimationFrame||function(c){setTimeout(c,13)},t=function(){for(var c=0;c<a.timers.length;c++)a.timers[c]()||a.timers.splice(c--,1);a.timers.length&&g(t)};u!==n||this.elem["forceAnimate:"+this.prop]?(this.startTime=+new Date,this.start=u,this.end=n,this.unit=k,this.now=this.start,this.pos=0,p.elem=this.elem,p.prop=this.prop,p()&&1===a.timers.push(p)&&g(t)):(delete c.curAnim[this.prop],c.complete&&0===Object.keys(c.curAnim).length&&c.complete.call(this.elem))};
a.prototype.step=function(a){var n=+new Date,k=this.options,e=this.elem,c=k.complete,p=k.duration,g=k.curAnim;if(e.attr&&!e.element)a=!1;else if(a||n>=p+this.startTime){this.now=this.end;this.pos=1;this.update();var t=g[this.prop]=!0;I(g,function(c){!0!==c&&(t=!1)});t&&c&&c.call(e);a=!1}else this.pos=k.easing((n-this.startTime)/p),this.now=this.start+(this.end-this.start)*this.pos,this.update(),a=!0;return a};a.prototype.initPath=function(a,n,k){function e(c,m){for(;c.length<x;){var h=c[0],b=m[x-
c.length];b&&"M"===h[0]&&(c[0]="C"===b[0]?["C",h[1],h[2],h[1],h[2],h[1],h[2]]:["L",h[1],h[2]]);c.unshift(h);t&&(h=c.pop(),c.push(c[c.length-1],h))}}function c(c,m){for(;c.length<x;)if(m=c[Math.floor(c.length/q)-1].slice(),"C"===m[0]&&(m[1]=m[5],m[2]=m[6]),t){var h=c[Math.floor(c.length/q)].slice();c.splice(c.length/2,0,m,h)}else c.push(m)}var p=a.startX,g=a.endX;k=k.slice();var t=a.isArea,q=t?2:1;n=n&&n.slice();if(!n)return[k,k];if(p&&g&&g.length){for(a=0;a<p.length;a++)if(p[a]===g[0]){var F=a;break}else if(p[0]===
g[g.length-p.length+a]){F=a;var y=!0;break}else if(p[p.length-1]===g[g.length-p.length+a]){F=p.length-a;break}"undefined"===typeof F&&(n=[])}if(n.length&&E(F)){var x=k.length+F*q;y?(e(n,k),c(k,n)):(e(k,n),c(n,k))}return[n,k]};a.prototype.fillSetter=function(){a.prototype.strokeSetter.apply(this,arguments)};a.prototype.strokeSetter=function(){this.elem.attr(this.prop,C(this.start).tweenTo(C(this.end),this.pos),void 0,!0)};a.timers=[];return a}()});K(f,"Core/Animation/AnimationUtilities.js",[f["Core/Animation/Fx.js"],
f["Core/Utilities.js"]],function(a,f){function C(c){return u(c)?n({duration:500,defer:0},c):{duration:c?500:0,defer:0}}function H(c,e){for(var g=a.timers.length;g--;)a.timers[g].elem!==c||e&&e!==a.timers[g].prop||(a.timers[g].stopped=!0)}var w=f.defined,E=f.getStyle,I=f.isArray,A=f.isNumber,u=f.isObject,n=f.merge,k=f.objectEach,e=f.pick;return{animate:function(c,e,g){var p,q="",F,y;if(!u(g)){var x=arguments;g={duration:x[2],easing:x[3],complete:x[4]}}A(g.duration)||(g.duration=400);g.easing="function"===
typeof g.easing?g.easing:Math[g.easing]||Math.easeInOutSine;g.curAnim=n(e);k(e,function(t,m){H(c,m);y=new a(c,g,m);F=void 0;"d"===m&&I(e.d)?(y.paths=y.initPath(c,c.pathArray,e.d),y.toD=e.d,p=0,F=1):c.attr?p=c.attr(m):(p=parseFloat(E(c,m))||0,"opacity"!==m&&(q="px"));F||(F=t);"string"===typeof F&&F.match("px")&&(F=F.replace(/px/g,""));y.run(p,F,q)})},animObject:C,getDeferredAnimation:function(c,e,g){var p=C(e),q=0,k=0;(g?[g]:c.series).forEach(function(c){c=C(c.options.animation);q=e&&w(e.defer)?p.defer:
Math.max(q,c.duration+c.defer);k=Math.min(p.duration,c.duration)});c.renderer.forExport&&(q=0);return{defer:Math.max(0,q-k),duration:Math.min(q,k)}},setAnimation:function(c,p){p.renderer.globalAnimation=e(c,p.options.chart.animation,!0)},stop:H}});K(f,"Core/Renderer/HTML/AST.js",[f["Core/Globals.js"],f["Core/Utilities.js"]],function(a,f){var C=a.SVG_NS,H=f.attr,w=f.createElement,E=f.css,I=f.error,A=f.isFunction,u=f.isString,n=f.objectEach,k=f.splat,e=(f=a.win.trustedTypes)&&A(f.createPolicy)&&f.createPolicy("highcharts",
{createHTML:function(c){return c}}),c=e?e.createHTML(""):"";try{var p=!!(new DOMParser).parseFromString(c,"text/html")}catch(g){p=!1}A=function(){function g(c){this.nodes="string"===typeof c?this.parseMarkup(c):c}g.filterUserAttributes=function(c){n(c,function(e,p){var q=!0;-1===g.allowedAttributes.indexOf(p)&&(q=!1);-1!==["background","dynsrc","href","lowsrc","src"].indexOf(p)&&(q=u(e)&&g.allowedReferences.some(function(c){return 0===e.indexOf(c)}));q||(I(33,!1,void 0,{"Invalid attribute in config":""+
p}),delete c[p])});return c};g.parseStyle=function(c){return c.split(";").reduce(function(c,e){e=e.split(":").map(function(c){return c.trim()});var g=e.shift();g&&e.length&&(c[g.replace(/-([a-z])/g,function(c){return c[1].toUpperCase()})]=e.join(":"));return c},{})};g.setElementHTML=function(c,e){c.innerHTML=g.emptyHTML;e&&(new g(e)).addToDOM(c)};g.prototype.addToDOM=function(c){function e(c,p){var q;k(c).forEach(function(c){var m=c.tagName,h=c.textContent?a.doc.createTextNode(c.textContent):void 0,
b=g.bypassHTMLFiltering;if(m)if("#text"===m)var l=h;else if(-1!==g.allowedTags.indexOf(m)||b){m=a.doc.createElementNS("svg"===m?C:p.namespaceURI||C,m);var d=c.attributes||{};n(c,function(b,c){"tagName"!==c&&"attributes"!==c&&"children"!==c&&"style"!==c&&"textContent"!==c&&(d[c]=b)});H(m,b?d:g.filterUserAttributes(d));c.style&&E(m,c.style);h&&m.appendChild(h);e(c.children||[],m);l=m}else I(33,!1,void 0,{"Invalid tagName in config":m});l&&p.appendChild(l);q=l});return q}return e(this.nodes,c)};g.prototype.parseMarkup=
function(c){var q=[];c=c.trim().replace(/ style="/g,' data-style="');if(p)c=(new DOMParser).parseFromString(e?e.createHTML(c):c,"text/html");else{var k=w("div");k.innerHTML=c;c={body:k}}var t=function(c,e){var m=c.nodeName.toLowerCase(),h={tagName:m};"#text"===m&&(h.textContent=c.textContent||"");if(m=c.attributes){var b={};[].forEach.call(m,function(d){"data-style"===d.name?h.style=g.parseStyle(d.value):b[d.name]=d.value});h.attributes=b}if(c.childNodes.length){var l=[];[].forEach.call(c.childNodes,
function(b){t(b,l)});l.length&&(h.children=l)}e.push(h)};[].forEach.call(c.body.childNodes,function(c){return t(c,q)});return q};g.allowedAttributes="aria-controls aria-describedby aria-expanded aria-haspopup aria-hidden aria-label aria-labelledby aria-live aria-pressed aria-readonly aria-roledescription aria-selected class clip-path color colspan cx cy d dx dy disabled fill height href id in markerHeight markerWidth offset opacity orient padding paddingLeft paddingRight patternUnits r refX refY role scope slope src startOffset stdDeviation stroke stroke-linecap stroke-width style tableValues result rowspan summary target tabindex text-align textAnchor textLength title type valign width x x1 x2 y y1 y2 zIndex".split(" ");
g.allowedReferences="https:// http:// mailto: / ../ ./ #".split(" ");g.allowedTags="a abbr b br button caption circle clipPath code dd defs div dl dt em feComponentTransfer feFuncA feFuncB feFuncG feFuncR feGaussianBlur feOffset feMerge feMergeNode filter h1 h2 h3 h4 h5 h6 hr i img li linearGradient marker ol p path pattern pre rect small span stop strong style sub sup svg table text thead tbody tspan td th tr u ul #text".split(" ");g.emptyHTML=c;g.bypassHTMLFiltering=!1;return g}();"";return A});
K(f,"Core/FormatUtilities.js",[f["Core/DefaultOptions.js"],f["Core/Utilities.js"]],function(a,f){function C(a,k,e,c){a=+a||0;k=+k;var p=H.lang,g=(a.toString().split(".")[1]||"").split("e")[0].length,t=a.toString().split("e"),q=k;if(-1===k)k=Math.min(g,20);else if(!I(k))k=2;else if(k&&t[1]&&0>t[1]){var F=k+ +t[1];0<=F?(t[0]=(+t[0]).toExponential(F).split("e")[0],k=F):(t[0]=t[0].split(".")[0]||0,a=20>k?(t[0]*Math.pow(10,t[1])).toFixed(k):0,t[1]=0)}F=(Math.abs(t[1]?t[0]:a)+Math.pow(10,-Math.max(k,g)-
1)).toFixed(k);g=String(u(F));var y=3<g.length?g.length%3:0;e=A(e,p.decimalPoint);c=A(c,p.thousandsSep);a=(0>a?"-":"")+(y?g.substr(0,y)+c:"");a=0>+t[1]&&!q?"0":a+g.substr(y).replace(/(\d{3})(?=\d)/g,"$1"+c);k&&(a+=e+F.slice(-k));t[1]&&0!==+a&&(a+="e"+t[1]);return a}var H=a.defaultOptions,w=a.defaultTime,E=f.getNestedProperty,I=f.isNumber,A=f.pick,u=f.pInt;return{dateFormat:function(a,k,e){return w.dateFormat(a,k,e)},format:function(a,k,e){var c="{",p=!1,g=/f$/,t=/\.([0-9])/,q=H.lang,F=e&&e.time||
w;e=e&&e.numberFormatter||C;for(var y=[];a;){var x=a.indexOf(c);if(-1===x)break;var z=a.slice(0,x);if(p){z=z.split(":");c=E(z.shift()||"",k);if(z.length&&"number"===typeof c)if(z=z.join(":"),g.test(z)){var m=parseInt((z.match(t)||["","-1"])[1],10);null!==c&&(c=e(c,m,q.decimalPoint,-1<z.indexOf(",")?q.thousandsSep:""))}else c=F.dateFormat(z,c);y.push(c)}else y.push(z);a=a.slice(x+1);c=(p=!p)?"}":"{"}y.push(a);return y.join("")},numberFormat:C}});K(f,"Core/Renderer/RendererUtilities.js",[f["Core/Utilities.js"]],
function(a){var f=a.clamp,B=a.pick,H=a.stableSort,w;(function(a){function C(a,u,n){var k=a,e=k.reducedLen||u,c=function(c,e){return(e.rank||0)-(c.rank||0)},p=function(c,e){return c.target-e.target},g,t=!0,q=[],F=0;for(g=a.length;g--;)F+=a[g].size;if(F>e){H(a,c);for(F=g=0;F<=e;)F+=a[g].size,g++;q=a.splice(g-1,a.length)}H(a,p);for(a=a.map(function(c){return{size:c.size,targets:[c.target],align:B(c.align,.5)}});t;){for(g=a.length;g--;)e=a[g],c=(Math.min.apply(0,e.targets)+Math.max.apply(0,e.targets))/
2,e.pos=f(c-e.size*e.align,0,u-e.size);g=a.length;for(t=!1;g--;)0<g&&a[g-1].pos+a[g-1].size>a[g].pos&&(a[g-1].size+=a[g].size,a[g-1].targets=a[g-1].targets.concat(a[g].targets),a[g-1].align=.5,a[g-1].pos+a[g-1].size>u&&(a[g-1].pos=u-a[g-1].size),a.splice(g,1),t=!0)}k.push.apply(k,q);g=0;a.some(function(c){var e=0;return(c.targets||[]).some(function(){k[g].pos=c.pos+e;if("undefined"!==typeof n&&Math.abs(k[g].pos-k[g].target)>n)return k.slice(0,g+1).forEach(function(c){return delete c.pos}),k.reducedLen=
(k.reducedLen||u)-.1*u,k.reducedLen>.1*u&&C(k,u,n),!0;e+=k[g].size;g++;return!1})});H(k,p);return k}a.distribute=C})(w||(w={}));return w});K(f,"Core/Renderer/SVG/SVGElement.js",[f["Core/Animation/AnimationUtilities.js"],f["Core/Renderer/HTML/AST.js"],f["Core/Color/Color.js"],f["Core/Globals.js"],f["Core/Utilities.js"]],function(a,f,B,H,w){var C=a.animate,I=a.animObject,A=a.stop,u=H.deg2rad,n=H.doc,k=H.noop,e=H.svg,c=H.SVG_NS,p=H.win,g=w.addEvent,t=w.attr,q=w.createElement,F=w.css,y=w.defined,x=w.erase,
z=w.extend,m=w.fireEvent,h=w.isArray,b=w.isFunction,l=w.isNumber,d=w.isString,D=w.merge,v=w.objectEach,r=w.pick,O=w.pInt,P=w.syncTimeout,S=w.uniqueKey;a=function(){function a(){this.element=void 0;this.onEvents={};this.opacity=1;this.renderer=void 0;this.SVG_NS=c;this.symbolCustomAttribs="x y width height r start end innerR anchorX anchorY rounded".split(" ")}a.prototype._defaultGetter=function(b){b=r(this[b+"Value"],this[b],this.element?this.element.getAttribute(b):null,0);/^[\-0-9\.]+$/.test(b)&&
(b=parseFloat(b));return b};a.prototype._defaultSetter=function(b,d,c){c.setAttribute(d,b)};a.prototype.add=function(b){var d=this.renderer,c=this.element;b&&(this.parentGroup=b);this.parentInverted=b&&b.inverted;"undefined"!==typeof this.textStr&&"text"===this.element.nodeName&&d.buildText(this);this.added=!0;if(!b||b.handleZ||this.zIndex)var h=this.zIndexSetter();h||(b?b.element:d.box).appendChild(c);if(this.onAdd)this.onAdd();return this};a.prototype.addClass=function(b,d){var c=d?"":this.attr("class")||
"";b=(b||"").split(/ /g).reduce(function(b,d){-1===c.indexOf(d)&&b.push(d);return b},c?[c]:[]).join(" ");b!==c&&this.attr("class",b);return this};a.prototype.afterSetters=function(){this.doTransform&&(this.updateTransform(),this.doTransform=!1)};a.prototype.align=function(b,c,J){var h={},l=this.renderer,e=l.alignedObjects,m,a,G;if(b){if(this.alignOptions=b,this.alignByTranslate=c,!J||d(J))this.alignTo=m=J||"renderer",x(e,this),e.push(this),J=void 0}else b=this.alignOptions,c=this.alignByTranslate,
m=this.alignTo;J=r(J,l[m],"scrollablePlotBox"===m?l.plotBox:void 0,l);m=b.align;var v=b.verticalAlign;l=(J.x||0)+(b.x||0);e=(J.y||0)+(b.y||0);"right"===m?a=1:"center"===m&&(a=2);a&&(l+=(J.width-(b.width||0))/a);h[c?"translateX":"x"]=Math.round(l);"bottom"===v?G=1:"middle"===v&&(G=2);G&&(e+=(J.height-(b.height||0))/G);h[c?"translateY":"y"]=Math.round(e);this[this.placed?"animate":"attr"](h);this.placed=!0;this.alignAttr=h;return this};a.prototype.alignSetter=function(b){var d={left:"start",center:"middle",
right:"end"};d[b]&&(this.alignValue=b,this.element.setAttribute("text-anchor",d[b]))};a.prototype.animate=function(b,d,c){var J=this,h=I(r(d,this.renderer.globalAnimation,!0));d=h.defer;r(n.hidden,n.msHidden,n.webkitHidden,!1)&&(h.duration=0);0!==h.duration?(c&&(h.complete=c),P(function(){J.element&&C(J,b,h)},d)):(this.attr(b,void 0,c||h.complete),v(b,function(b,d){h.step&&h.step.call(this,b,{prop:d,pos:1,elem:this})},this));return this};a.prototype.applyTextOutline=function(b){var d=this.element;
-1!==b.indexOf("contrast")&&(b=b.replace(/contrast/g,this.renderer.getContrast(d.style.fill)));var J=b.split(" ");b=J[J.length-1];if((J=J[0])&&"none"!==J&&H.svg){this.fakeTS=!0;this.ySetter=this.xSetter;J=J.replace(/(^[\d\.]+)(.*?)$/g,function(b,d,c){return 2*Number(d)+c});this.removeTextOutline();var h=n.createElementNS(c,"tspan");t(h,{"class":"highcharts-text-outline",fill:b,stroke:b,"stroke-width":J,"stroke-linejoin":"round"});[].forEach.call(d.childNodes,function(b){var d=b.cloneNode(!0);d.removeAttribute&&
["fill","stroke","stroke-width","stroke"].forEach(function(b){return d.removeAttribute(b)});h.appendChild(d)});var l=n.createElementNS(c,"tspan");l.textContent="\u200b";["x","y"].forEach(function(b){var c=d.getAttribute(b);c&&l.setAttribute(b,c)});h.appendChild(l);d.insertBefore(h,d.firstChild)}};a.prototype.attr=function(b,d,c,h){var J=this.element,l=this.symbolCustomAttribs,r,L=this,G,e;if("string"===typeof b&&"undefined"!==typeof d){var m=b;b={};b[m]=d}"string"===typeof b?L=(this[b+"Getter"]||
this._defaultGetter).call(this,b,J):(v(b,function(d,c){G=!1;h||A(this,c);this.symbolName&&-1!==l.indexOf(c)&&(r||(this.symbolAttr(b),r=!0),G=!0);!this.rotation||"x"!==c&&"y"!==c||(this.doTransform=!0);G||(e=this[c+"Setter"]||this._defaultSetter,e.call(this,d,c,J),!this.styledMode&&this.shadows&&/^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(c)&&this.updateShadows(c,d,e))},this),this.afterSetters());c&&c.call(this);return L};a.prototype.clip=function(b){return this.attr("clip-path",b?"url("+
this.renderer.url+"#"+b.id+")":"none")};a.prototype.crisp=function(b,d){d=d||b.strokeWidth||0;var c=Math.round(d)%2/2;b.x=Math.floor(b.x||this.x||0)+c;b.y=Math.floor(b.y||this.y||0)+c;b.width=Math.floor((b.width||this.width||0)-2*c);b.height=Math.floor((b.height||this.height||0)-2*c);y(b.strokeWidth)&&(b.strokeWidth=d);return b};a.prototype.complexColor=function(b,d,c){var J=this.renderer,l,r,e,a,G,g,p,q,k,t,x=[],z;m(this.renderer,"complexColor",{args:arguments},function(){b.radialGradient?r="radialGradient":
b.linearGradient&&(r="linearGradient");if(r){e=b[r];G=J.gradients;g=b.stops;k=c.radialReference;h(e)&&(b[r]=e={x1:e[0],y1:e[1],x2:e[2],y2:e[3],gradientUnits:"userSpaceOnUse"});"radialGradient"===r&&k&&!y(e.gradientUnits)&&(a=e,e=D(e,J.getRadialAttr(k,a),{gradientUnits:"userSpaceOnUse"}));v(e,function(b,d){"id"!==d&&x.push(d,b)});v(g,function(b){x.push(b)});x=x.join(",");if(G[x])t=G[x].attr("id");else{e.id=t=S();var L=G[x]=J.createElement(r).attr(e).add(J.defs);L.radAttr=a;L.stops=[];g.forEach(function(b){0===
b[1].indexOf("rgba")?(l=B.parse(b[1]),p=l.get("rgb"),q=l.get("a")):(p=b[1],q=1);b=J.createElement("stop").attr({offset:b[0],"stop-color":p,"stop-opacity":q}).add(L);L.stops.push(b)})}z="url("+J.url+"#"+t+")";c.setAttribute(d,z);c.gradient=x;b.toString=function(){return z}}})};a.prototype.css=function(b){var d=this.styles,c={},h=this.element,l=!d;b.color&&(b.fill=b.color);d&&v(b,function(b,J){d&&d[J]!==b&&(c[J]=b,l=!0)});if(l){d&&(b=z(d,c));if(null===b.width||"auto"===b.width)delete this.textWidth;
else if("text"===h.nodeName.toLowerCase()&&b.width)var r=this.textWidth=O(b.width);this.styles=b;r&&!e&&this.renderer.forExport&&delete b.width;var m=D(b);h.namespaceURI===this.SVG_NS&&["textOutline","textOverflow","width"].forEach(function(b){return m&&delete m[b]});F(h,m);this.added&&("text"===this.element.nodeName&&this.renderer.buildText(this),b.textOutline&&this.applyTextOutline(b.textOutline))}return this};a.prototype.dashstyleSetter=function(b){var d=this["stroke-width"];"inherit"===d&&(d=
1);if(b=b&&b.toLowerCase()){var c=b.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(b=c.length;b--;)c[b]=""+O(c[b])*r(d,NaN);b=c.join(",").replace(/NaN/g,"none");this.element.setAttribute("stroke-dasharray",b)}};a.prototype.destroy=function(){var b=this,d=b.element||{},c=b.renderer,h=d.ownerSVGElement,l=c.isSVG&&
"SPAN"===d.nodeName&&b.parentGroup||void 0;d.onclick=d.onmouseout=d.onmouseover=d.onmousemove=d.point=null;A(b);if(b.clipPath&&h){var r=b.clipPath;[].forEach.call(h.querySelectorAll("[clip-path],[CLIP-PATH]"),function(b){-1<b.getAttribute("clip-path").indexOf(r.element.id)&&b.removeAttribute("clip-path")});b.clipPath=r.destroy()}if(b.stops){for(h=0;h<b.stops.length;h++)b.stops[h].destroy();b.stops.length=0;b.stops=void 0}b.safeRemoveChild(d);for(c.styledMode||b.destroyShadows();l&&l.div&&0===l.div.childNodes.length;)d=
l.parentGroup,b.safeRemoveChild(l.div),delete l.div,l=d;b.alignTo&&x(c.alignedObjects,b);v(b,function(d,c){b[c]&&b[c].parentGroup===b&&b[c].destroy&&b[c].destroy();delete b[c]})};a.prototype.destroyShadows=function(){(this.shadows||[]).forEach(function(b){this.safeRemoveChild(b)},this);this.shadows=void 0};a.prototype.destroyTextPath=function(b,d){var c=b.getElementsByTagName("text")[0];if(c){if(c.removeAttribute("dx"),c.removeAttribute("dy"),d.element.setAttribute("id",""),this.textPathWrapper&&
c.getElementsByTagName("textPath").length){for(b=this.textPathWrapper.element.childNodes;b.length;)c.appendChild(b[0]);c.removeChild(this.textPathWrapper.element)}}else if(b.getAttribute("dx")||b.getAttribute("dy"))b.removeAttribute("dx"),b.removeAttribute("dy");this.textPathWrapper&&(this.textPathWrapper=this.textPathWrapper.destroy())};a.prototype.dSetter=function(b,d,c){h(b)&&("string"===typeof b[0]&&(b=this.renderer.pathToSegments(b)),this.pathArray=b,b=b.reduce(function(b,d,c){return d&&d.join?
(c?b+" ":"")+d.join(" "):(d||"").toString()},""));/(NaN| {2}|^$)/.test(b)&&(b="M 0 0");this[d]!==b&&(c.setAttribute(d,b),this[d]=b)};a.prototype.fadeOut=function(b){var d=this;d.animate({opacity:0},{duration:r(b,150),complete:function(){d.attr({y:-9999}).hide()}})};a.prototype.fillSetter=function(b,d,c){"string"===typeof b?c.setAttribute(d,b):b&&this.complexColor(b,d,c)};a.prototype.getBBox=function(d,c){var h=this.alignValue,l=this.element,e=this.renderer,m=this.styles,v=this.textStr,g=e.cache,G=
e.cacheKeys,p=l.namespaceURI===this.SVG_NS;c=r(c,this.rotation,0);var q=e.styledMode?l&&a.prototype.getStyle.call(l,"font-size"):m&&m.fontSize,D;if(y(v)){var k=v.toString();-1===k.indexOf("<")&&(k=k.replace(/[0-9]/g,"0"));k+=["",c,q,this.textWidth,h,m&&m.textOverflow,m&&m.fontWeight].join()}k&&!d&&(D=g[k]);if(!D){if(p||e.forExport){try{var t=this.fakeTS&&function(b){var d=l.querySelector(".highcharts-text-outline");d&&F(d,{display:b})};b(t)&&t("none");D=l.getBBox?z({},l.getBBox()):{width:l.offsetWidth,
height:l.offsetHeight};b(t)&&t("")}catch(ha){""}if(!D||0>D.width)D={x:0,y:0,width:0,height:0}}else D=this.htmlGetBBox();if(e.isSVG&&(e=D.width,d=D.height,p&&(D.height=d={"11px,17":14,"13px,20":16}[(q||"")+","+Math.round(d)]||d),c)){p=Number(l.getAttribute("y")||0)-D.y;h={right:1,center:.5}[h||0]||0;m=c*u;q=(c-90)*u;var x=e*Math.cos(m);c=e*Math.sin(m);t=Math.cos(q);m=Math.sin(q);e=D.x+h*(e-x)+p*t;q=e+x;t=q-d*t;x=t-x;p=D.y+p-h*c+p*m;h=p+c;d=h-d*m;c=d-c;D.x=Math.min(e,q,t,x);D.y=Math.min(p,h,d,c);D.width=
Math.max(e,q,t,x)-D.x;D.height=Math.max(p,h,d,c)-D.y}if(k&&(""===v||0<D.height)){for(;250<G.length;)delete g[G.shift()];g[k]||G.push(k);g[k]=D}}return D};a.prototype.getStyle=function(b){return p.getComputedStyle(this.element||this,"").getPropertyValue(b)};a.prototype.hasClass=function(b){return-1!==(""+this.attr("class")).split(" ").indexOf(b)};a.prototype.hide=function(){return this.attr({visibility:"hidden"})};a.prototype.htmlGetBBox=function(){return{height:0,width:0,x:0,y:0}};a.prototype.init=
function(b,d){this.element="span"===d?q(d):n.createElementNS(this.SVG_NS,d);this.renderer=b;m(this,"afterInit")};a.prototype.invert=function(b){this.inverted=b;this.updateTransform();return this};a.prototype.on=function(b,d){var c=this.onEvents;if(c[b])c[b]();c[b]=g(this.element,b,d);return this};a.prototype.opacitySetter=function(b,d,c){this.opacity=b=Number(Number(b).toFixed(3));c.setAttribute(d,b)};a.prototype.removeClass=function(b){return this.attr("class",(""+this.attr("class")).replace(d(b)?
new RegExp("(^| )"+b+"( |$)"):b," ").replace(/ +/g," ").trim())};a.prototype.removeTextOutline=function(){var b=this.element.querySelector("tspan.highcharts-text-outline");b&&this.safeRemoveChild(b)};a.prototype.safeRemoveChild=function(b){var d=b.parentNode;d&&d.removeChild(b)};a.prototype.setRadialReference=function(b){var d=this.element.gradient&&this.renderer.gradients[this.element.gradient];this.element.radialReference=b;d&&d.radAttr&&d.animate(this.renderer.getRadialAttr(b,d.radAttr));return this};
a.prototype.setTextPath=function(b,d){var c=this.element,h=this.text?this.text.element:c,r={textAnchor:"text-anchor"},e=!1,m=this.textPathWrapper,a=!m;d=D(!0,{enabled:!0,attributes:{dy:-5,startOffset:"50%",textAnchor:"middle"}},d);var G=f.filterUserAttributes(d.attributes);if(b&&d&&d.enabled){m&&null===m.element.parentNode?(a=!0,m=m.destroy()):m&&this.removeTextOutline.call(m.parentGroup);this.options&&this.options.padding&&(G.dx=-this.options.padding);m||(this.textPathWrapper=m=this.renderer.createElement("textPath"),
e=!0);var g=m.element;(d=b.element.getAttribute("id"))||b.element.setAttribute("id",d=S());if(a)for(h.setAttribute("y",0),l(G.dx)&&h.setAttribute("x",-G.dx),b=[].slice.call(h.childNodes),a=0;a<b.length;a++){var q=b[a];q.nodeType!==p.Node.TEXT_NODE&&"tspan"!==q.nodeName||g.appendChild(q)}e&&m&&m.add({element:h});g.setAttributeNS("http://www.w3.org/1999/xlink","href",this.renderer.url+"#"+d);y(G.dy)&&(g.parentNode.setAttribute("dy",G.dy),delete G.dy);y(G.dx)&&(g.parentNode.setAttribute("dx",G.dx),delete G.dx);
v(G,function(b,d){g.setAttribute(r[d]||d,b)});c.removeAttribute("transform");this.removeTextOutline.call(m);this.text&&!this.renderer.styledMode&&this.attr({fill:"none","stroke-width":0});this.applyTextOutline=this.updateTransform=k}else m&&(delete this.updateTransform,delete this.applyTextOutline,this.destroyTextPath(c,b),this.updateTransform(),this.options&&this.options.rotation&&this.applyTextOutline(this.options.style.textOutline));return this};a.prototype.shadow=function(b,d,c){var h=[],l=this.element,
J=this.oldShadowOptions,r={color:"#000000",offsetX:this.parentInverted?-1:1,offsetY:this.parentInverted?-1:1,opacity:.15,width:3},e=!1,G;!0===b?G=r:"object"===typeof b&&(G=z(r,b));G&&(G&&J&&v(G,function(b,d){b!==J[d]&&(e=!0)}),e&&this.destroyShadows(),this.oldShadowOptions=G);if(!G)this.destroyShadows();else if(!this.shadows){var m=G.opacity/G.width;var a=this.parentInverted?"translate("+G.offsetY+", "+G.offsetX+")":"translate("+G.offsetX+", "+G.offsetY+")";for(r=1;r<=G.width;r++){var g=l.cloneNode(!1);
var p=2*G.width+1-2*r;t(g,{stroke:b.color||"#000000","stroke-opacity":m*r,"stroke-width":p,transform:a,fill:"none"});g.setAttribute("class",(g.getAttribute("class")||"")+" highcharts-shadow");c&&(t(g,"height",Math.max(t(g,"height")-p,0)),g.cutHeight=p);d?d.element.appendChild(g):l.parentNode&&l.parentNode.insertBefore(g,l);h.push(g)}this.shadows=h}return this};a.prototype.show=function(b){void 0===b&&(b=!0);return this.attr({visibility:b?"inherit":"visible"})};a.prototype.strokeSetter=function(b,
d,c){this[d]=b;this.stroke&&this["stroke-width"]?(a.prototype.fillSetter.call(this,this.stroke,"stroke",c),c.setAttribute("stroke-width",this["stroke-width"]),this.hasStroke=!0):"stroke-width"===d&&0===b&&this.hasStroke?(c.removeAttribute("stroke"),this.hasStroke=!1):this.renderer.styledMode&&this["stroke-width"]&&(c.setAttribute("stroke-width",this["stroke-width"]),this.hasStroke=!0)};a.prototype.strokeWidth=function(){if(!this.renderer.styledMode)return this["stroke-width"]||0;var b=this.getStyle("stroke-width"),
d=0;if(b.indexOf("px")===b.length-2)d=O(b);else if(""!==b){var h=n.createElementNS(c,"rect");t(h,{width:b,"stroke-width":0});this.element.parentNode.appendChild(h);d=h.getBBox().width;h.parentNode.removeChild(h)}return d};a.prototype.symbolAttr=function(b){var d=this;"x y r start end width height innerR anchorX anchorY clockwise".split(" ").forEach(function(c){d[c]=r(b[c],d[c])});d.attr({d:d.renderer.symbols[d.symbolName](d.x,d.y,d.width,d.height,d)})};a.prototype.textSetter=function(b){b!==this.textStr&&
(delete this.textPxLength,this.textStr=b,this.added&&this.renderer.buildText(this))};a.prototype.titleSetter=function(b){var d=this.element,c=d.getElementsByTagName("title")[0]||n.createElementNS(this.SVG_NS,"title");d.insertBefore?d.insertBefore(c,d.firstChild):d.appendChild(c);c.textContent=String(r(b,"")).replace(/<[^>]*>/g,"").replace(/&lt;/g,"<").replace(/&gt;/g,">")};a.prototype.toFront=function(){var b=this.element;b.parentNode.appendChild(b);return this};a.prototype.translate=function(b,d){return this.attr({translateX:b,
translateY:d})};a.prototype.updateShadows=function(b,d,c){var h=this.shadows;if(h)for(var l=h.length;l--;)c.call(h[l],"height"===b?Math.max(d-(h[l].cutHeight||0),0):"d"===b?this.d:d,b,h[l])};a.prototype.updateTransform=function(){var b=this.scaleX,d=this.scaleY,c=this.inverted,h=this.rotation,l=this.matrix,e=this.element,m=this.translateX||0,a=this.translateY||0;c&&(m+=this.width,a+=this.height);m=["translate("+m+","+a+")"];y(l)&&m.push("matrix("+l.join(",")+")");c?m.push("rotate(90) scale(-1,1)"):
h&&m.push("rotate("+h+" "+r(this.rotationOriginX,e.getAttribute("x"),0)+" "+r(this.rotationOriginY,e.getAttribute("y")||0)+")");(y(b)||y(d))&&m.push("scale("+r(b,1)+" "+r(d,1)+")");m.length&&e.setAttribute("transform",m.join(" "))};a.prototype.visibilitySetter=function(b,d,c){"inherit"===b?c.removeAttribute(d):this[d]!==b&&c.setAttribute(d,b);this[d]=b};a.prototype.xGetter=function(b){"circle"===this.element.nodeName&&("x"===b?b="cx":"y"===b&&(b="cy"));return this._defaultGetter(b)};a.prototype.zIndexSetter=
function(b,d){var c=this.renderer,h=this.parentGroup,l=(h||c).element||c.box,r=this.element;c=l===c.box;var e=!1;var m=this.added;var G;y(b)?(r.setAttribute("data-z-index",b),b=+b,this[d]===b&&(m=!1)):y(this[d])&&r.removeAttribute("data-z-index");this[d]=b;if(m){(b=this.zIndex)&&h&&(h.handleZ=!0);d=l.childNodes;for(G=d.length-1;0<=G&&!e;G--){h=d[G];m=h.getAttribute("data-z-index");var a=!y(m);if(h!==r)if(0>b&&a&&!c&&!G)l.insertBefore(r,d[G]),e=!0;else if(O(m)<=b||a&&(!y(b)||0<=b))l.insertBefore(r,
d[G+1]||null),e=!0}e||(l.insertBefore(r,d[c?3:0]||null),e=!0)}return e};return a}();a.prototype["stroke-widthSetter"]=a.prototype.strokeSetter;a.prototype.yGetter=a.prototype.xGetter;a.prototype.matrixSetter=a.prototype.rotationOriginXSetter=a.prototype.rotationOriginYSetter=a.prototype.rotationSetter=a.prototype.scaleXSetter=a.prototype.scaleYSetter=a.prototype.translateXSetter=a.prototype.translateYSetter=a.prototype.verticalAlignSetter=function(b,d){this[d]=b;this.doTransform=!0};"";return a});
K(f,"Core/Renderer/RendererRegistry.js",[f["Core/Globals.js"]],function(a){var f;(function(f){f.rendererTypes={};var C;f.getRendererType=function(a){void 0===a&&(a=C);return f.rendererTypes[a]||f.rendererTypes[C]};f.registerRendererType=function(w,B,I){f.rendererTypes[w]=B;if(!C||I)C=w,a.Renderer=B}})(f||(f={}));return f});K(f,"Core/Renderer/SVG/SVGLabel.js",[f["Core/Renderer/SVG/SVGElement.js"],f["Core/Utilities.js"]],function(a,f){var C=this&&this.__extends||function(){var a=function(k,e){a=Object.setPrototypeOf||
{__proto__:[]}instanceof Array&&function(c,e){c.__proto__=e}||function(c,e){for(var a in e)e.hasOwnProperty(a)&&(c[a]=e[a])};return a(k,e)};return function(k,e){function c(){this.constructor=k}a(k,e);k.prototype=null===e?Object.create(e):(c.prototype=e.prototype,new c)}}(),H=f.defined,w=f.extend,E=f.isNumber,I=f.merge,A=f.pick,u=f.removeEvent;return function(n){function k(e,c,a,g,t,q,F,y,x,z){var m=n.call(this)||this;m.paddingLeftSetter=m.paddingSetter;m.paddingRightSetter=m.paddingSetter;m.init(e,
"g");m.textStr=c;m.x=a;m.y=g;m.anchorX=q;m.anchorY=F;m.baseline=x;m.className=z;m.addClass("button"===z?"highcharts-no-tooltip":"highcharts-label");z&&m.addClass("highcharts-"+z);m.text=e.text(void 0,0,0,y).attr({zIndex:1});var h;"string"===typeof t&&((h=/^url\((.*?)\)$/.test(t))||m.renderer.symbols[t])&&(m.symbolKey=t);m.bBox=k.emptyBBox;m.padding=3;m.baselineOffset=0;m.needsBox=e.styledMode||h;m.deferredAttr={};m.alignFactor=0;return m}C(k,n);k.prototype.alignSetter=function(e){e={left:0,center:.5,
right:1}[e];e!==this.alignFactor&&(this.alignFactor=e,this.bBox&&E(this.xSetting)&&this.attr({x:this.xSetting}))};k.prototype.anchorXSetter=function(e,c){this.anchorX=e;this.boxAttr(c,Math.round(e)-this.getCrispAdjust()-this.xSetting)};k.prototype.anchorYSetter=function(e,c){this.anchorY=e;this.boxAttr(c,e-this.ySetting)};k.prototype.boxAttr=function(e,c){this.box?this.box.attr(e,c):this.deferredAttr[e]=c};k.prototype.css=function(e){if(e){var c={};e=I(e);k.textProps.forEach(function(a){"undefined"!==
typeof e[a]&&(c[a]=e[a],delete e[a])});this.text.css(c);var p="width"in c;"fontSize"in c||"fontWeight"in c?this.updateTextPadding():p&&this.updateBoxSize()}return a.prototype.css.call(this,e)};k.prototype.destroy=function(){u(this.element,"mouseenter");u(this.element,"mouseleave");this.text&&this.text.destroy();this.box&&(this.box=this.box.destroy());a.prototype.destroy.call(this)};k.prototype.fillSetter=function(e,c){e&&(this.needsBox=!0);this.fill=e;this.boxAttr(c,e)};k.prototype.getBBox=function(){this.textStr&&
0===this.bBox.width&&0===this.bBox.height&&this.updateBoxSize();var e=this.padding,c=A(this.paddingLeft,e);return{width:this.width,height:this.height,x:this.bBox.x-c,y:this.bBox.y-e}};k.prototype.getCrispAdjust=function(){return this.renderer.styledMode&&this.box?this.box.strokeWidth()%2/2:(this["stroke-width"]?parseInt(this["stroke-width"],10):0)%2/2};k.prototype.heightSetter=function(e){this.heightSetting=e};k.prototype.onAdd=function(){var e=this.textStr;this.text.add(this);this.attr({text:H(e)?
e:"",x:this.x,y:this.y});this.box&&H(this.anchorX)&&this.attr({anchorX:this.anchorX,anchorY:this.anchorY})};k.prototype.paddingSetter=function(e,c){E(e)?e!==this[c]&&(this[c]=e,this.updateTextPadding()):this[c]=void 0};k.prototype.rSetter=function(e,c){this.boxAttr(c,e)};k.prototype.shadow=function(e){e&&!this.renderer.styledMode&&(this.updateBoxSize(),this.box&&this.box.shadow(e));return this};k.prototype.strokeSetter=function(e,c){this.stroke=e;this.boxAttr(c,e)};k.prototype["stroke-widthSetter"]=
function(e,c){e&&(this.needsBox=!0);this["stroke-width"]=e;this.boxAttr(c,e)};k.prototype["text-alignSetter"]=function(e){this.textAlign=e};k.prototype.textSetter=function(e){"undefined"!==typeof e&&this.text.attr({text:e});this.updateTextPadding()};k.prototype.updateBoxSize=function(){var e=this.text.element.style,c={},a=this.padding,g=this.bBox=E(this.widthSetting)&&E(this.heightSetting)&&!this.textAlign||!H(this.text.textStr)?k.emptyBBox:this.text.getBBox();this.width=this.getPaddedWidth();this.height=
(this.heightSetting||g.height||0)+2*a;e=this.renderer.fontMetrics(e&&e.fontSize,this.text);this.baselineOffset=a+Math.min((this.text.firstLineMetrics||e).b,g.height||Infinity);this.heightSetting&&(this.baselineOffset+=(this.heightSetting-e.h)/2);this.needsBox&&(this.box||(a=this.box=this.symbolKey?this.renderer.symbol(this.symbolKey):this.renderer.rect(),a.addClass(("button"===this.className?"":"highcharts-label-box")+(this.className?" highcharts-"+this.className+"-box":"")),a.add(this)),a=this.getCrispAdjust(),
c.x=a,c.y=(this.baseline?-this.baselineOffset:0)+a,c.width=Math.round(this.width),c.height=Math.round(this.height),this.box.attr(w(c,this.deferredAttr)),this.deferredAttr={})};k.prototype.updateTextPadding=function(){var e=this.text;this.updateBoxSize();var c=this.baseline?0:this.baselineOffset,a=A(this.paddingLeft,this.padding);H(this.widthSetting)&&this.bBox&&("center"===this.textAlign||"right"===this.textAlign)&&(a+={center:.5,right:1}[this.textAlign]*(this.widthSetting-this.bBox.width));if(a!==
e.x||c!==e.y)e.attr("x",a),e.hasBoxWidthChanged&&(this.bBox=e.getBBox(!0)),"undefined"!==typeof c&&e.attr("y",c);e.x=a;e.y=c};k.prototype.widthSetter=function(e){this.widthSetting=E(e)?e:void 0};k.prototype.getPaddedWidth=function(){var e=this.padding,c=A(this.paddingLeft,e);e=A(this.paddingRight,e);return(this.widthSetting||this.bBox.width||0)+c+e};k.prototype.xSetter=function(e){this.x=e;this.alignFactor&&(e-=this.alignFactor*this.getPaddedWidth(),this["forceAnimate:x"]=!0);this.xSetting=Math.round(e);
this.attr("translateX",this.xSetting)};k.prototype.ySetter=function(e){this.ySetting=this.y=Math.round(e);this.attr("translateY",this.ySetting)};k.emptyBBox={width:0,height:0,x:0,y:0};k.textProps="color direction fontFamily fontSize fontStyle fontWeight lineHeight textAlign textDecoration textOutline textOverflow width".split(" ");return k}(a)});K(f,"Core/Renderer/SVG/Symbols.js",[f["Core/Utilities.js"]],function(a){function f(a,f,n,k,e){var c=[];if(e){var p=e.start||0,g=I(e.r,n);n=I(e.r,k||n);var t=
(e.end||0)-.001;k=e.innerR;var q=I(e.open,.001>Math.abs((e.end||0)-p-2*Math.PI)),F=Math.cos(p),y=Math.sin(p),x=Math.cos(t),z=Math.sin(t);p=I(e.longArc,.001>t-p-Math.PI?0:1);c.push(["M",a+g*F,f+n*y],["A",g,n,0,p,I(e.clockwise,1),a+g*x,f+n*z]);w(k)&&c.push(q?["M",a+k*x,f+k*z]:["L",a+k*x,f+k*z],["A",k,k,0,p,w(e.clockwise)?1-e.clockwise:0,a+k*F,f+k*y]);q||c.push(["Z"])}return c}function B(a,f,n,k,e){return e&&e.r?H(a,f,n,k,e):[["M",a,f],["L",a+n,f],["L",a+n,f+k],["L",a,f+k],["Z"]]}function H(a,f,n,k,
e){e=e&&e.r||0;return[["M",a+e,f],["L",a+n-e,f],["C",a+n,f,a+n,f,a+n,f+e],["L",a+n,f+k-e],["C",a+n,f+k,a+n,f+k,a+n-e,f+k],["L",a+e,f+k],["C",a,f+k,a,f+k,a,f+k-e],["L",a,f+e],["C",a,f,a,f,a+e,f]]}var w=a.defined,E=a.isNumber,I=a.pick;return{arc:f,callout:function(a,f,n,k,e){var c=Math.min(e&&e.r||0,n,k),p=c+6,g=e&&e.anchorX;e=e&&e.anchorY||0;var t=H(a,f,n,k,{r:c});if(!E(g))return t;a+g>=n?e>f+p&&e<f+k-p?t.splice(3,1,["L",a+n,e-6],["L",a+n+6,e],["L",a+n,e+6],["L",a+n,f+k-c]):t.splice(3,1,["L",a+n,k/
2],["L",g,e],["L",a+n,k/2],["L",a+n,f+k-c]):0>=a+g?e>f+p&&e<f+k-p?t.splice(7,1,["L",a,e+6],["L",a-6,e],["L",a,e-6],["L",a,f+c]):t.splice(7,1,["L",a,k/2],["L",g,e],["L",a,k/2],["L",a,f+c]):e&&e>k&&g>a+p&&g<a+n-p?t.splice(5,1,["L",g+6,f+k],["L",g,f+k+6],["L",g-6,f+k],["L",a+c,f+k]):e&&0>e&&g>a+p&&g<a+n-p&&t.splice(1,1,["L",g-6,f],["L",g,f-6],["L",g+6,f],["L",n-c,f]);return t},circle:function(a,u,n,k){return f(a+n/2,u+k/2,n/2,k/2,{start:.5*Math.PI,end:2.5*Math.PI,open:!1})},diamond:function(a,f,n,k){return[["M",
a+n/2,f],["L",a+n,f+k/2],["L",a+n/2,f+k],["L",a,f+k/2],["Z"]]},rect:B,roundedRect:H,square:B,triangle:function(a,f,n,k){return[["M",a+n/2,f],["L",a+n,f+k],["L",a,f+k],["Z"]]},"triangle-down":function(a,f,n,k){return[["M",a,f],["L",a+n,f],["L",a+n/2,f+k],["Z"]]}}});K(f,"Core/Renderer/SVG/TextBuilder.js",[f["Core/Renderer/HTML/AST.js"],f["Core/Globals.js"],f["Core/Utilities.js"]],function(a,f,B){var C=f.doc,w=f.SVG_NS,E=f.win,I=B.attr,A=B.extend,u=B.isString,n=B.objectEach,k=B.pick;return function(){function e(c){var a=
c.styles;this.renderer=c.renderer;this.svgElement=c;this.width=c.textWidth;this.textLineHeight=a&&a.lineHeight;this.textOutline=a&&a.textOutline;this.ellipsis=!(!a||"ellipsis"!==a.textOverflow);this.noWrap=!(!a||"nowrap"!==a.whiteSpace);this.fontSize=a&&a.fontSize}e.prototype.buildSVG=function(){var c=this.svgElement,e=c.element,g=c.renderer,t=k(c.textStr,"").toString(),q=-1!==t.indexOf("<"),f=e.childNodes;g=this.width&&!c.added&&g.box;var y=/<br.*?>/g,x=[t,this.ellipsis,this.noWrap,this.textLineHeight,
this.textOutline,this.fontSize,this.width].join();if(x!==c.textCache){c.textCache=x;delete c.actualWidth;for(x=f.length;x--;)e.removeChild(f[x]);q||this.ellipsis||this.width||-1!==t.indexOf(" ")&&(!this.noWrap||y.test(t))?""!==t&&(g&&g.appendChild(e),t=new a(t),this.modifyTree(t.nodes),t.addToDOM(c.element),this.modifyDOM(),this.ellipsis&&-1!==(e.textContent||"").indexOf("\u2026")&&c.attr("title",this.unescapeEntities(c.textStr||"",["&lt;","&gt;"])),g&&g.removeChild(e)):e.appendChild(C.createTextNode(this.unescapeEntities(t)));
u(this.textOutline)&&c.applyTextOutline&&c.applyTextOutline(this.textOutline)}};e.prototype.modifyDOM=function(){var c=this,a=this.svgElement,e=I(a.element,"x");a.firstLineMetrics=void 0;for(var k;k=a.element.firstChild;)if(/^[\s\u200B]*$/.test(k.textContent||" "))a.element.removeChild(k);else break;[].forEach.call(a.element.querySelectorAll("tspan.highcharts-br"),function(g,q){g.nextSibling&&g.previousSibling&&(0===q&&1===g.previousSibling.nodeType&&(a.firstLineMetrics=a.renderer.fontMetrics(void 0,
g.previousSibling)),I(g,{dy:c.getLineHeight(g.nextSibling),x:e}))});var q=this.width||0;if(q){var f=function(g,k){var m=g.textContent||"",h=m.replace(/([^\^])-/g,"$1- ").split(" "),b=!c.noWrap&&(1<h.length||1<a.element.childNodes.length),l=c.getLineHeight(k),d=0,D=a.actualWidth;if(c.ellipsis)m&&c.truncate(g,m,void 0,0,Math.max(0,q-parseInt(c.fontSize||12,10)),function(b,d){return b.substring(0,d)+"\u2026"});else if(b){m=[];for(b=[];k.firstChild&&k.firstChild!==g;)b.push(k.firstChild),k.removeChild(k.firstChild);
for(;h.length;)h.length&&!c.noWrap&&0<d&&(m.push(g.textContent||""),g.textContent=h.join(" ").replace(/- /g,"-")),c.truncate(g,void 0,h,0===d?D||0:0,q,function(b,d){return h.slice(0,d).join(" ").replace(/- /g,"-")}),D=a.actualWidth,d++;b.forEach(function(b){k.insertBefore(b,g)});m.forEach(function(b){k.insertBefore(C.createTextNode(b),g);b=C.createElementNS(w,"tspan");b.textContent="\u200b";I(b,{dy:l,x:e});k.insertBefore(b,g)})}},y=function(c){[].slice.call(c.childNodes).forEach(function(e){e.nodeType===
E.Node.TEXT_NODE?f(e,c):(-1!==e.className.baseVal.indexOf("highcharts-br")&&(a.actualWidth=0),y(e))})};y(a.element)}};e.prototype.getLineHeight=function(c){var a;c=c.nodeType===E.Node.TEXT_NODE?c.parentElement:c;this.renderer.styledMode||(a=c&&/(px|em)$/.test(c.style.fontSize)?c.style.fontSize:this.fontSize||this.renderer.style.fontSize||12);return this.textLineHeight?parseInt(this.textLineHeight.toString(),10):this.renderer.fontMetrics(a,c||this.svgElement.element).h};e.prototype.modifyTree=function(c){var a=
this,e=function(g,q){var k=g.attributes;k=void 0===k?{}:k;var p=g.children,t=g.style;t=void 0===t?{}:t;var f=g.tagName,m=a.renderer.styledMode;if("b"===f||"strong"===f)m?k["class"]="highcharts-strong":t.fontWeight="bold";else if("i"===f||"em"===f)m?k["class"]="highcharts-emphasized":t.fontStyle="italic";t&&t.color&&(t.fill=t.color);"br"===f?(k["class"]="highcharts-br",g.textContent="\u200b",(q=c[q+1])&&q.textContent&&(q.textContent=q.textContent.replace(/^ +/gm,""))):"a"===f&&p&&p.some(function(c){return"#text"===
c.tagName})&&(g.children=[{children:p,tagName:"tspan"}]);"#text"!==f&&"a"!==f&&(g.tagName="tspan");A(g,{attributes:k,style:t});p&&p.filter(function(c){return"#text"!==c.tagName}).forEach(e)};c.forEach(e)};e.prototype.truncate=function(c,a,e,k,q,f){var g=this.svgElement,p=g.renderer,t=g.rotation,m=[],h=e?1:0,b=(a||e||"").length,l=b,d,D=function(b,d){d=d||b;var h=c.parentNode;if(h&&"undefined"===typeof m[d])if(h.getSubStringLength)try{m[d]=k+h.getSubStringLength(0,e?d+1:d)}catch(S){""}else p.getSpanWidth&&
(c.textContent=f(a||e,b),m[d]=k+p.getSpanWidth(g,c));return m[d]};g.rotation=0;var v=D(c.textContent.length);if(k+v>q){for(;h<=b;)l=Math.ceil((h+b)/2),e&&(d=f(e,l)),v=D(l,d&&d.length-1),h===b?h=b+1:v>q?b=l-1:h=l;0===b?c.textContent="":a&&b===a.length-1||(c.textContent=d||f(a||e,l))}e&&e.splice(0,l);g.actualWidth=v;g.rotation=t};e.prototype.unescapeEntities=function(c,a){n(this.renderer.escapes,function(e,k){a&&-1!==a.indexOf(e)||(c=c.toString().replace(new RegExp(e,"g"),k))});return c};return e}()});
K(f,"Core/Renderer/SVG/SVGRenderer.js",[f["Core/Renderer/HTML/AST.js"],f["Core/Color/Color.js"],f["Core/Globals.js"],f["Core/Renderer/RendererRegistry.js"],f["Core/Renderer/SVG/SVGElement.js"],f["Core/Renderer/SVG/SVGLabel.js"],f["Core/Renderer/SVG/Symbols.js"],f["Core/Renderer/SVG/TextBuilder.js"],f["Core/Utilities.js"]],function(a,f,B,H,w,E,I,A,u){var n=B.charts,k=B.deg2rad,e=B.doc,c=B.isFirefox,p=B.isMS,g=B.isWebKit,t=B.noop,q=B.SVG_NS,F=B.symbolSizes,y=B.win,x=u.addEvent,z=u.attr,m=u.createElement,
h=u.css,b=u.defined,l=u.destroyObjectProperties,d=u.extend,D=u.isArray,v=u.isNumber,r=u.isObject,O=u.isString,P=u.merge,S=u.pick,N=u.pInt,C=u.uniqueKey,X;B=function(){function J(b,d,c,h,a,e,l){this.width=this.url=this.style=this.isSVG=this.imgCount=this.height=this.gradients=this.globalAnimation=this.defs=this.chartIndex=this.cacheKeys=this.cache=this.boxWrapper=this.box=this.alignedObjects=void 0;this.init(b,d,c,h,a,e,l)}J.prototype.init=function(b,d,a,l,r,m,J){var G=this.createElement("svg").attr({version:"1.1",
"class":"highcharts-root"}),L=G.element;J||G.css(this.getStyle(l));b.appendChild(L);z(b,"dir","ltr");-1===b.innerHTML.indexOf("xmlns")&&z(L,"xmlns",this.SVG_NS);this.isSVG=!0;this.box=L;this.boxWrapper=G;this.alignedObjects=[];this.url=this.getReferenceURL();this.createElement("desc").add().element.appendChild(e.createTextNode("Created with Highcharts 10.1.0"));this.defs=this.createElement("defs").add();this.allowHTML=m;this.forExport=r;this.styledMode=J;this.gradients={};this.cache={};this.cacheKeys=
[];this.imgCount=0;this.setSize(d,a,!1);var g;c&&b.getBoundingClientRect&&(d=function(){h(b,{left:0,top:0});g=b.getBoundingClientRect();h(b,{left:Math.ceil(g.left)-g.left+"px",top:Math.ceil(g.top)-g.top+"px"})},d(),this.unSubPixelFix=x(y,"resize",d))};J.prototype.definition=function(b){return(new a([b])).addToDOM(this.defs.element)};J.prototype.getReferenceURL=function(){if((c||g)&&e.getElementsByTagName("base").length){if(!b(X)){var d=C();d=(new a([{tagName:"svg",attributes:{width:8,height:8},children:[{tagName:"defs",
children:[{tagName:"clipPath",attributes:{id:d},children:[{tagName:"rect",attributes:{width:4,height:4}}]}]},{tagName:"rect",attributes:{id:"hitme",width:8,height:8,"clip-path":"url(#"+d+")",fill:"rgba(0,0,0,0.001)"}}]}])).addToDOM(e.body);h(d,{position:"fixed",top:0,left:0,zIndex:9E5});var l=e.elementFromPoint(6,6);X="hitme"===(l&&l.id);e.body.removeChild(d)}if(X)return y.location.href.split("#")[0].replace(/<[^>]*>/g,"").replace(/([\('\)])/g,"\\$1").replace(/ /g,"%20")}return""};J.prototype.getStyle=
function(b){return this.style=d({fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',fontSize:"12px"},b)};J.prototype.setStyle=function(b){this.boxWrapper.css(this.getStyle(b))};J.prototype.isHidden=function(){return!this.boxWrapper.getBBox().width};J.prototype.destroy=function(){var b=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();l(this.gradients||{});this.gradients=null;b&&(this.defs=b.destroy());this.unSubPixelFix&&this.unSubPixelFix();return this.alignedObjects=
null};J.prototype.createElement=function(b){var d=new this.Element;d.init(this,b);return d};J.prototype.getRadialAttr=function(b,d){return{cx:b[0]-b[2]/2+(d.cx||0)*b[2],cy:b[1]-b[2]/2+(d.cy||0)*b[2],r:(d.r||0)*b[2]}};J.prototype.buildText=function(b){(new A(b)).buildSVG()};J.prototype.getContrast=function(b){b=f.parse(b).rgba;b[0]*=1;b[1]*=1.2;b[2]*=.5;return 459<b[0]+b[1]+b[2]?"#000000":"#FFFFFF"};J.prototype.button=function(b,c,h,l,e,m,J,g,v,q){var G=this.label(b,c,h,v,void 0,void 0,q,void 0,"button"),
D=this.styledMode;b=e&&e.states||{};e&&delete e.states;var L=0,k=e?P(e):{},f=P({color:"#333333",cursor:"pointer",fontWeight:"normal"},k.style);delete k.style;k=a.filterUserAttributes(k);G.attr(P({padding:8,r:2},k));if(!D){k=P({fill:"#f7f7f7",stroke:"#cccccc","stroke-width":1},k);m=P(k,{fill:"#e6e6e6"},a.filterUserAttributes(m||b.hover||{}));var t=m.style;delete m.style;J=P(k,{fill:"#e6ebf5",style:{color:"#000000",fontWeight:"bold"}},a.filterUserAttributes(J||b.select||{}));var M=J.style;delete J.style;
g=P(k,{style:{color:"#cccccc"}},a.filterUserAttributes(g||b.disabled||{}));var y=g.style;delete g.style}x(G.element,p?"mouseover":"mouseenter",function(){3!==L&&G.setState(1)});x(G.element,p?"mouseout":"mouseleave",function(){3!==L&&G.setState(L)});G.setState=function(b){1!==b&&(G.state=L=b);G.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-"+["normal","hover","pressed","disabled"][b||0]);D||(G.attr([k,m,J,g][b||0]),b=[f,t,M,y][b||0],r(b)&&G.css(b))};D||
G.attr(k).css(d({cursor:"default"},f));return G.on("touchstart",function(b){return b.stopPropagation()}).on("click",function(b){3!==L&&l.call(G,b)})};J.prototype.crispLine=function(d,c,h){void 0===h&&(h="round");var a=d[0],e=d[1];b(a[1])&&a[1]===e[1]&&(a[1]=e[1]=Math[h](a[1])-c%2/2);b(a[2])&&a[2]===e[2]&&(a[2]=e[2]=Math[h](a[2])+c%2/2);return d};J.prototype.path=function(b){var c=this.styledMode?{}:{fill:"none"};D(b)?c.d=b:r(b)&&d(c,b);return this.createElement("path").attr(c)};J.prototype.circle=
function(b,d,c){b=r(b)?b:"undefined"===typeof b?{}:{x:b,y:d,r:c};d=this.createElement("circle");d.xSetter=d.ySetter=function(b,d,c){c.setAttribute("c"+d,b)};return d.attr(b)};J.prototype.arc=function(b,d,c,a,h,e){r(b)?(a=b,d=a.y,c=a.r,b=a.x):a={innerR:a,start:h,end:e};b=this.symbol("arc",b,d,c,c,a);b.r=c;return b};J.prototype.rect=function(b,d,c,a,h,e){h=r(b)?b.r:h;var l=this.createElement("rect");b=r(b)?b:"undefined"===typeof b?{}:{x:b,y:d,width:Math.max(c,0),height:Math.max(a,0)};this.styledMode||
("undefined"!==typeof e&&(b["stroke-width"]=e,b=l.crisp(b)),b.fill="none");h&&(b.r=h);l.rSetter=function(b,d,c){l.r=b;z(c,{rx:b,ry:b})};l.rGetter=function(){return l.r||0};return l.attr(b)};J.prototype.setSize=function(b,d,c){this.width=b;this.height=d;this.boxWrapper.animate({width:b,height:d},{step:function(){this.attr({viewBox:"0 0 "+this.attr("width")+" "+this.attr("height")})},duration:S(c,!0)?void 0:0});this.alignElements()};J.prototype.g=function(b){var d=this.createElement("g");return b?d.attr({"class":"highcharts-"+
b}):d};J.prototype.image=function(b,d,c,a,h,e){var l={preserveAspectRatio:"none"},r=function(b,d){b.setAttributeNS?b.setAttributeNS("http://www.w3.org/1999/xlink","href",d):b.setAttribute("hc-svg-href",d)};v(d)&&(l.x=d);v(c)&&(l.y=c);v(a)&&(l.width=a);v(h)&&(l.height=h);var m=this.createElement("image").attr(l);d=function(d){r(m.element,b);e.call(m,d)};e?(r(m.element,"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="),c=new y.Image,x(c,"load",d),c.src=b,c.complete&&d({})):
r(m.element,b);return m};J.prototype.symbol=function(c,a,l,r,J,G){var g=this,v=/^url\((.*?)\)$/,q=v.test(c),D=!q&&(this.symbols[c]?c:"circle"),k=D&&this.symbols[D],f;if(k){"number"===typeof a&&(f=k.call(this.symbols,Math.round(a||0),Math.round(l||0),r||0,J||0,G));var p=this.path(f);g.styledMode||p.attr("fill","none");d(p,{symbolName:D||void 0,x:a,y:l,width:r,height:J});G&&d(p,G)}else if(q){var L=c.match(v)[1];var t=p=this.image(L);t.imgwidth=S(F[L]&&F[L].width,G&&G.width);t.imgheight=S(F[L]&&F[L].height,
G&&G.height);var y=function(b){return b.attr({width:b.width,height:b.height})};["width","height"].forEach(function(d){t[d+"Setter"]=function(d,c){var a=this["img"+c];this[c]=d;b(a)&&(G&&"within"===G.backgroundSize&&this.width&&this.height&&(a=Math.round(a*Math.min(this.width/this.imgwidth,this.height/this.imgheight))),this.element&&this.element.setAttribute(c,a),this.alignByTranslate||(d=((this[c]||0)-a)/2,this.attr("width"===c?{translateX:d}:{translateY:d})))}});b(a)&&t.attr({x:a,y:l});t.isImg=!0;
b(t.imgwidth)&&b(t.imgheight)?y(t):(t.attr({width:0,height:0}),m("img",{onload:function(){var b=n[g.chartIndex];0===this.width&&(h(this,{position:"absolute",top:"-999em"}),e.body.appendChild(this));F[L]={width:this.width,height:this.height};t.imgwidth=this.width;t.imgheight=this.height;t.element&&y(t);this.parentNode&&this.parentNode.removeChild(this);g.imgCount--;if(!g.imgCount&&b&&!b.hasLoaded)b.onload()},src:L}),this.imgCount++)}return p};J.prototype.clipRect=function(b,d,c,a){var h=C()+"-",l=
this.createElement("clipPath").attr({id:h}).add(this.defs);b=this.rect(b,d,c,a,0).add(l);b.id=h;b.clipPath=l;b.count=0;return b};J.prototype.text=function(d,c,a,h){var l={};if(h&&(this.allowHTML||!this.forExport))return this.html(d,c,a);l.x=Math.round(c||0);a&&(l.y=Math.round(a));b(d)&&(l.text=d);d=this.createElement("text").attr(l);if(!h||this.forExport&&!this.allowHTML)d.xSetter=function(b,d,c){for(var a=c.getElementsByTagName("tspan"),h=c.getAttribute(d),l=0,e;l<a.length;l++)e=a[l],e.getAttribute(d)===
h&&e.setAttribute(d,b);c.setAttribute(d,b)};return d};J.prototype.fontMetrics=function(b,d){b=!this.styledMode&&/px/.test(b)||!y.getComputedStyle?b||d&&d.style&&d.style.fontSize||this.style&&this.style.fontSize:d&&w.prototype.getStyle.call(d,"font-size");b=/px/.test(b)?N(b):12;d=24>b?b+3:Math.round(1.2*b);return{h:d,b:Math.round(.8*d),f:b}};J.prototype.rotCorr=function(b,d,c){var a=b;d&&c&&(a=Math.max(a*Math.cos(d*k),4));return{x:-b/3*Math.sin(d*k),y:a}};J.prototype.pathToSegments=function(b){for(var d=
[],c=[],a={A:8,C:7,H:2,L:3,M:3,Q:5,S:5,T:3,V:2},h=0;h<b.length;h++)O(c[0])&&v(b[h])&&c.length===a[c[0].toUpperCase()]&&b.splice(h,0,c[0].replace("M","L").replace("m","l")),"string"===typeof b[h]&&(c.length&&d.push(c.slice(0)),c.length=0),c.push(b[h]);d.push(c.slice(0));return d};J.prototype.label=function(b,d,c,a,h,l,e,r,m){return new E(this,b,d,c,a,h,l,e,r,m)};J.prototype.alignElements=function(){this.alignedObjects.forEach(function(b){return b.align()})};return J}();d(B.prototype,{Element:w,SVG_NS:q,
escapes:{"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},symbols:I,draw:t});H.registerRendererType("svg",B,!0);"";return B});K(f,"Core/Renderer/HTML/HTMLElement.js",[f["Core/Globals.js"],f["Core/Renderer/SVG/SVGElement.js"],f["Core/Utilities.js"]],function(a,f,B){var C=this&&this.__extends||function(){var c=function(a,e){c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(c,a){c.__proto__=a}||function(c,a){for(var e in a)a.hasOwnProperty(e)&&(c[e]=a[e])};return c(a,e)};return function(a,
e){function g(){this.constructor=a}c(a,e);a.prototype=null===e?Object.create(e):(g.prototype=e.prototype,new g)}}(),w=a.isFirefox,E=a.isMS,I=a.isWebKit,A=a.win,u=B.css,n=B.defined,k=B.extend,e=B.pick,c=B.pInt;return function(a){function g(){return null!==a&&a.apply(this,arguments)||this}C(g,a);g.compose=function(c){if(-1===g.composedClasses.indexOf(c)){g.composedClasses.push(c);var a=g.prototype,e=c.prototype;e.getSpanCorrection=a.getSpanCorrection;e.htmlCss=a.htmlCss;e.htmlGetBBox=a.htmlGetBBox;
e.htmlUpdateTransform=a.htmlUpdateTransform;e.setSpanRotation=a.setSpanRotation}return c};g.prototype.getSpanCorrection=function(c,a,e){this.xCorr=-c*e;this.yCorr=-a};g.prototype.htmlCss=function(c){var a="SPAN"===this.element.tagName&&c&&"width"in c,g=e(a&&c.width,void 0);if(a){delete c.width;this.textWidth=g;var f=!0}c&&"ellipsis"===c.textOverflow&&(c.whiteSpace="nowrap",c.overflow="hidden");this.styles=k(this.styles,c);u(this.element,c);f&&this.htmlUpdateTransform();return this};g.prototype.htmlGetBBox=
function(){var c=this.element;return{x:c.offsetLeft,y:c.offsetTop,width:c.offsetWidth,height:c.offsetHeight}};g.prototype.htmlUpdateTransform=function(){if(this.added){var a=this.renderer,e=this.element,g=this.translateX||0,k=this.translateY||0,f=this.x||0,p=this.y||0,m=this.textAlign||"left",h={left:0,center:.5,right:1}[m],b=this.styles;b=b&&b.whiteSpace;u(e,{marginLeft:g,marginTop:k});!a.styledMode&&this.shadows&&this.shadows.forEach(function(b){u(b,{marginLeft:g+1,marginTop:k+1})});this.inverted&&
[].forEach.call(e.childNodes,function(b){a.invertChild(b,e)});if("SPAN"===e.tagName){var l=this.rotation,d=this.textWidth&&c(this.textWidth),D=[l,m,e.innerHTML,this.textWidth,this.textAlign].join(),v=void 0;v=!1;if(d!==this.oldTextWidth){if(this.textPxLength)var r=this.textPxLength;else u(e,{width:"",whiteSpace:b||"nowrap"}),r=e.offsetWidth;(d>this.oldTextWidth||r>d)&&(/[ \-]/.test(e.textContent||e.innerText)||"ellipsis"===e.style.textOverflow)&&(u(e,{width:r>d||l?d+"px":"auto",display:"block",whiteSpace:b||
"normal"}),this.oldTextWidth=d,v=!0)}this.hasBoxWidthChanged=v;D!==this.cTT&&(v=a.fontMetrics(e.style.fontSize,e).b,!n(l)||l===(this.oldRotation||0)&&m===this.oldAlign||this.setSpanRotation(l,h,v),this.getSpanCorrection(!n(l)&&this.textPxLength||e.offsetWidth,v,h,l,m));u(e,{left:f+(this.xCorr||0)+"px",top:p+(this.yCorr||0)+"px"});this.cTT=D;this.oldRotation=l;this.oldAlign=m}}else this.alignOnAdd=!0};g.prototype.setSpanRotation=function(c,a,e){var g={},k=E&&!/Edge/.test(A.navigator.userAgent)?"-ms-transform":
I?"-webkit-transform":w?"MozTransform":A.opera?"-o-transform":void 0;k&&(g[k]=g.transform="rotate("+c+"deg)",g[k+(w?"Origin":"-origin")]=g.transformOrigin=100*a+"% "+e+"px",u(this.element,g))};g.composedClasses=[];return g}(f)});K(f,"Core/Renderer/HTML/HTMLRenderer.js",[f["Core/Renderer/HTML/AST.js"],f["Core/Renderer/SVG/SVGElement.js"],f["Core/Renderer/SVG/SVGRenderer.js"],f["Core/Utilities.js"]],function(a,f,B,H){var C=this&&this.__extends||function(){var a=function(k,e){a=Object.setPrototypeOf||
{__proto__:[]}instanceof Array&&function(c,a){c.__proto__=a}||function(c,a){for(var e in a)a.hasOwnProperty(e)&&(c[e]=a[e])};return a(k,e)};return function(k,e){function c(){this.constructor=k}a(k,e);k.prototype=null===e?Object.create(e):(c.prototype=e.prototype,new c)}}(),E=H.attr,I=H.createElement,A=H.extend,u=H.pick;return function(n){function k(){return null!==n&&n.apply(this,arguments)||this}C(k,n);k.compose=function(a){-1===k.composedClasses.indexOf(a)&&(k.composedClasses.push(a),a.prototype.html=
k.prototype.html);return a};k.prototype.html=function(e,c,k){var g=this.createElement("span"),p=g.element,q=g.renderer,n=q.isSVG,y=function(c,a){["opacity","visibility"].forEach(function(e){c[e+"Setter"]=function(h,b,l){var d=c.div?c.div.style:a;f.prototype[e+"Setter"].call(this,h,b,l);d&&(d[b]=h)}});c.addedSetters=!0};g.textSetter=function(c){c!==this.textStr&&(delete this.bBox,delete this.oldTextWidth,a.setElementHTML(this.element,u(c,"")),this.textStr=c,g.doTransform=!0)};n&&y(g,g.element.style);
g.xSetter=g.ySetter=g.alignSetter=g.rotationSetter=function(c,a){"align"===a?g.alignValue=g.textAlign=c:g[a]=c;g.doTransform=!0};g.afterSetters=function(){this.doTransform&&(this.htmlUpdateTransform(),this.doTransform=!1)};g.attr({text:e,x:Math.round(c),y:Math.round(k)}).css({position:"absolute"});q.styledMode||g.css({fontFamily:this.style.fontFamily,fontSize:this.style.fontSize});p.style.whiteSpace="nowrap";g.css=g.htmlCss;n&&(g.add=function(c){var a=q.box.parentNode,e=[];if(this.parentGroup=c){var h=
c.div;if(!h){for(;c;)e.push(c),c=c.parentGroup;e.reverse().forEach(function(b){function c(d,c){b[c]=d;"translateX"===c?v.left=d+"px":v.top=d+"px";b.doTransform=!0}var d=E(b.element,"class"),m=b.styles||{};h=b.div=b.div||I("div",d?{className:d}:void 0,{position:"absolute",left:(b.translateX||0)+"px",top:(b.translateY||0)+"px",display:b.display,opacity:b.opacity,cursor:m.cursor,pointerEvents:m.pointerEvents,visibility:b.visibility},h||a);var v=h.style;A(b,{classSetter:function(b){return function(d){this.element.setAttribute("class",
d);b.className=d}}(h),on:function(){e[0].div&&g.on.apply({element:e[0].div,onEvents:b.onEvents},arguments);return b},translateXSetter:c,translateYSetter:c});b.addedSetters||y(b)})}}else h=a;h.appendChild(p);g.added=!0;g.alignOnAdd&&g.htmlUpdateTransform();return g});return g};k.composedClasses=[];return k}(B)});K(f,"Core/Axis/AxisDefaults.js",[],function(){var a;(function(a){a.defaultXAxisOptions={alignTicks:!0,allowDecimals:void 0,panningEnabled:!0,zIndex:2,zoomEnabled:!0,dateTimeLabelFormats:{millisecond:{main:"%H:%M:%S.%L",
range:!1},second:{main:"%H:%M:%S",range:!1},minute:{main:"%H:%M",range:!1},hour:{main:"%H:%M",range:!1},day:{main:"%e. %b"},week:{main:"%e. %b"},month:{main:"%b '%y"},year:{main:"%Y"}},endOnTick:!1,gridLineDashStyle:"Solid",gridZIndex:1,labels:{autoRotation:void 0,autoRotationLimit:80,distance:void 0,enabled:!0,indentation:10,overflow:"justify",padding:5,reserveSpace:void 0,rotation:void 0,staggerLines:0,step:0,useHTML:!1,x:0,zIndex:7,style:{color:"#666666",cursor:"default",fontSize:"11px"}},maxPadding:.01,
minorGridLineDashStyle:"Solid",minorTickLength:2,minorTickPosition:"outside",minPadding:.01,offset:void 0,opposite:!1,reversed:void 0,reversedStacks:!1,showEmpty:!0,showFirstLabel:!0,showLastLabel:!0,startOfWeek:1,startOnTick:!1,tickLength:10,tickPixelInterval:100,tickmarkPlacement:"between",tickPosition:"outside",title:{align:"middle",rotation:0,useHTML:!1,x:0,y:0,style:{color:"#666666"}},type:"linear",uniqueNames:!0,visible:!0,minorGridLineColor:"#f2f2f2",minorGridLineWidth:1,minorTickColor:"#999999",
lineColor:"#ccd6eb",lineWidth:1,gridLineColor:"#e6e6e6",gridLineWidth:void 0,tickColor:"#ccd6eb"};a.defaultYAxisOptions={reversedStacks:!0,endOnTick:!0,maxPadding:.05,minPadding:.05,tickPixelInterval:72,showLastLabel:!0,labels:{x:-8},startOnTick:!0,title:{rotation:270,text:"Values"},stackLabels:{animation:{},allowOverlap:!1,enabled:!1,crop:!0,overflow:"justify",formatter:function(){var a=this.axis.chart.numberFormatter;return a(this.total,-1)},style:{color:"#000000",fontSize:"11px",fontWeight:"bold",
textOutline:"1px contrast"}},gridLineWidth:1,lineWidth:0};a.defaultLeftAxisOptions={labels:{x:-15},title:{rotation:270}};a.defaultRightAxisOptions={labels:{x:15},title:{rotation:90}};a.defaultBottomAxisOptions={labels:{autoRotation:[-45],x:0},margin:15,title:{rotation:0}};a.defaultTopAxisOptions={labels:{autoRotation:[-45],x:0},margin:15,title:{rotation:0}}})(a||(a={}));return a});K(f,"Core/Foundation.js",[f["Core/Utilities.js"]],function(a){var f=a.addEvent,B=a.isFunction,H=a.objectEach,w=a.removeEvent,
E;(function(a){a.registerEventOptions=function(a,u){a.eventOptions=a.eventOptions||{};H(u.events,function(n,k){a.eventOptions[k]!==n&&(a.eventOptions[k]&&(w(a,k,a.eventOptions[k]),delete a.eventOptions[k]),B(n)&&(a.eventOptions[k]=n,f(a,k,n)))})}})(E||(E={}));return E});K(f,"Core/Axis/Tick.js",[f["Core/FormatUtilities.js"],f["Core/Globals.js"],f["Core/Utilities.js"]],function(a,f,B){var C=f.deg2rad,w=B.clamp,E=B.correctFloat,I=B.defined,A=B.destroyObjectProperties,u=B.extend,n=B.fireEvent,k=B.isNumber,
e=B.merge,c=B.objectEach,p=B.pick;f=function(){function g(c,a,e,g,k){this.isNewLabel=this.isNew=!0;this.axis=c;this.pos=a;this.type=e||"";this.parameters=k||{};this.tickmarkOffset=this.parameters.tickmarkOffset;this.options=this.parameters.options;n(this,"init");e||g||this.addLabel()}g.prototype.addLabel=function(){var c=this,e=c.axis,g=e.options,f=e.chart,x=e.categories,z=e.logarithmic,m=e.names,h=c.pos,b=p(c.options&&c.options.labels,g.labels),l=e.tickPositions,d=h===l[0],D=h===l[l.length-1],v=
(!b.step||1===b.step)&&1===e.tickInterval;l=l.info;var r=c.label,O;x=this.parameters.category||(x?p(x[h],m[h],h):h);z&&k(x)&&(x=E(z.lin2log(x)));if(e.dateTime)if(l){var P=f.time.resolveDTLFormat(g.dateTimeLabelFormats[!g.grid&&l.higherRanks[h]||l.unitName]);var S=P.main}else k(x)&&(S=e.dateTime.getXDateFormat(x,g.dateTimeLabelFormats||{}));c.isFirst=d;c.isLast=D;var N={axis:e,chart:f,dateTimeLabelFormat:S,isFirst:d,isLast:D,pos:h,tick:c,tickPositionInfo:l,value:x};n(this,"labelFormat",N);var C=function(d){return b.formatter?
b.formatter.call(d,d):b.format?(d.text=e.defaultLabelFormatter.call(d),a.format(b.format,d,f)):e.defaultLabelFormatter.call(d,d)};g=C.call(N,N);var X=P&&P.list;c.shortenLabel=X?function(){for(O=0;O<X.length;O++)if(u(N,{dateTimeLabelFormat:X[O]}),r.attr({text:C.call(N,N)}),r.getBBox().width<e.getSlotWidth(c)-2*b.padding)return;r.attr({text:""})}:void 0;v&&e._addedPlotLB&&c.moveLabel(g,b);I(r)||c.movedLabel?r&&r.textStr!==g&&!v&&(!r.textWidth||b.style.width||r.styles.width||r.css({width:null}),r.attr({text:g}),
r.textPxLength=r.getBBox().width):(c.label=r=c.createLabel({x:0,y:0},g,b),c.rotation=0)};g.prototype.createLabel=function(c,a,g){var k=this.axis,f=k.chart;if(c=I(a)&&g.enabled?f.renderer.text(a,c.x,c.y,g.useHTML).add(k.labelGroup):null)f.styledMode||c.css(e(g.style)),c.textPxLength=c.getBBox().width;return c};g.prototype.destroy=function(){A(this,this.axis)};g.prototype.getPosition=function(c,a,e,g){var k=this.axis,f=k.chart,m=g&&f.oldChartHeight||f.chartHeight;c={x:c?E(k.translate(a+e,null,null,
g)+k.transB):k.left+k.offset+(k.opposite?(g&&f.oldChartWidth||f.chartWidth)-k.right-k.left:0),y:c?m-k.bottom+k.offset-(k.opposite?k.height:0):E(m-k.translate(a+e,null,null,g)-k.transB)};c.y=w(c.y,-1E5,1E5);n(this,"afterGetPosition",{pos:c});return c};g.prototype.getLabelPosition=function(c,a,e,g,k,f,m,h){var b=this.axis,l=b.transA,d=b.isLinked&&b.linkedParent?b.linkedParent.reversed:b.reversed,D=b.staggerLines,v=b.tickRotCorr||{x:0,y:0},r=g||b.reserveSpaceDefault?0:-b.labelOffset*("center"===b.labelAlign?
.5:1),p={},q=k.y;I(q)||(q=0===b.side?e.rotation?-8:-e.getBBox().height:2===b.side?v.y+8:Math.cos(e.rotation*C)*(v.y-e.getBBox(!1,0).height/2));c=c+k.x+r+v.x-(f&&g?f*l*(d?-1:1):0);a=a+q-(f&&!g?f*l*(d?1:-1):0);D&&(e=m/(h||1)%D,b.opposite&&(e=D-e-1),a+=b.labelOffset/D*e);p.x=c;p.y=Math.round(a);n(this,"afterGetLabelPosition",{pos:p,tickmarkOffset:f,index:m});return p};g.prototype.getLabelSize=function(){return this.label?this.label.getBBox()[this.axis.horiz?"height":"width"]:0};g.prototype.getMarkPath=
function(c,a,e,g,k,f){return f.crispLine([["M",c,a],["L",c+(k?0:-e),a+(k?e:0)]],g)};g.prototype.handleOverflow=function(c){var a=this.axis,e=a.options.labels,g=c.x,k=a.chart.chartWidth,f=a.chart.spacing,m=p(a.labelLeft,Math.min(a.pos,f[3]));f=p(a.labelRight,Math.max(a.isRadial?0:a.pos+a.len,k-f[1]));var h=this.label,b=this.rotation,l={left:0,center:.5,right:1}[a.labelAlign||h.attr("align")],d=h.getBBox().width,D=a.getSlotWidth(this),v={},r=D,n=1,t;if(b||"justify"!==e.overflow)0>b&&g-l*d<m?t=Math.round(g/
Math.cos(b*C)-m):0<b&&g+l*d>f&&(t=Math.round((k-g)/Math.cos(b*C)));else if(k=g+(1-l)*d,g-l*d<m?r=c.x+r*(1-l)-m:k>f&&(r=f-c.x+r*l,n=-1),r=Math.min(D,r),r<D&&"center"===a.labelAlign&&(c.x+=n*(D-r-l*(D-Math.min(d,r)))),d>r||a.autoRotation&&(h.styles||{}).width)t=r;t&&(this.shortenLabel?this.shortenLabel():(v.width=Math.floor(t)+"px",(e.style||{}).textOverflow||(v.textOverflow="ellipsis"),h.css(v)))};g.prototype.moveLabel=function(a,e){var g=this,k=g.label,f=g.axis,p=f.reversed,m=!1;k&&k.textStr===a?
(g.movedLabel=k,m=!0,delete g.label):c(f.ticks,function(b){m||b.isNew||b===g||!b.label||b.label.textStr!==a||(g.movedLabel=b.label,m=!0,b.labelPos=g.movedLabel.xy,delete b.label)});if(!m&&(g.labelPos||k)){var h=g.labelPos||k.xy;k=f.horiz?p?0:f.width+f.left:h.x;f=f.horiz?h.y:p?f.width+f.left:0;g.movedLabel=g.createLabel({x:k,y:f},a,e);g.movedLabel&&g.movedLabel.attr({opacity:0})}};g.prototype.render=function(c,a,e){var g=this.axis,k=g.horiz,f=this.pos,m=p(this.tickmarkOffset,g.tickmarkOffset);f=this.getPosition(k,
f,m,a);m=f.x;var h=f.y;g=k&&m===g.pos+g.len||!k&&h===g.pos?-1:1;k=p(e,this.label&&this.label.newOpacity,1);e=p(e,1);this.isActive=!0;this.renderGridLine(a,e,g);this.renderMark(f,e,g);this.renderLabel(f,a,k,c);this.isNew=!1;n(this,"afterRender")};g.prototype.renderGridLine=function(c,a,e){var g=this.axis,k=g.options,f={},m=this.pos,h=this.type,b=p(this.tickmarkOffset,g.tickmarkOffset),l=g.chart.renderer,d=this.gridLine,D=k.gridLineWidth,v=k.gridLineColor,r=k.gridLineDashStyle;"minor"===this.type&&
(D=k.minorGridLineWidth,v=k.minorGridLineColor,r=k.minorGridLineDashStyle);d||(g.chart.styledMode||(f.stroke=v,f["stroke-width"]=D||0,f.dashstyle=r),h||(f.zIndex=1),c&&(a=0),this.gridLine=d=l.path().attr(f).addClass("highcharts-"+(h?h+"-":"")+"grid-line").add(g.gridGroup));if(d&&(e=g.getPlotLinePath({value:m+b,lineWidth:d.strokeWidth()*e,force:"pass",old:c})))d[c||this.isNew?"attr":"animate"]({d:e,opacity:a})};g.prototype.renderMark=function(c,a,e){var g=this.axis,k=g.options,f=g.chart.renderer,m=
this.type,h=g.tickSize(m?m+"Tick":"tick"),b=c.x;c=c.y;var l=p(k["minor"!==m?"tickWidth":"minorTickWidth"],!m&&g.isXAxis?1:0);k=k["minor"!==m?"tickColor":"minorTickColor"];var d=this.mark,D=!d;h&&(g.opposite&&(h[0]=-h[0]),d||(this.mark=d=f.path().addClass("highcharts-"+(m?m+"-":"")+"tick").add(g.axisGroup),g.chart.styledMode||d.attr({stroke:k,"stroke-width":l})),d[D?"attr":"animate"]({d:this.getMarkPath(b,c,h[0],d.strokeWidth()*e,g.horiz,f),opacity:a}))};g.prototype.renderLabel=function(c,a,e,g){var f=
this.axis,q=f.horiz,m=f.options,h=this.label,b=m.labels,l=b.step;f=p(this.tickmarkOffset,f.tickmarkOffset);var d=c.x;c=c.y;var D=!0;h&&k(d)&&(h.xy=c=this.getLabelPosition(d,c,h,q,b,f,g,l),this.isFirst&&!this.isLast&&!m.showFirstLabel||this.isLast&&!this.isFirst&&!m.showLastLabel?D=!1:!q||b.step||b.rotation||a||0===e||this.handleOverflow(c),l&&g%l&&(D=!1),D&&k(c.y)?(c.opacity=e,h[this.isNewLabel?"attr":"animate"](c).show(!0),this.isNewLabel=!1):(h.hide(),this.isNewLabel=!0))};g.prototype.replaceMovedLabel=
function(){var c=this.label,a=this.axis,e=a.reversed;if(c&&!this.isNew){var g=a.horiz?e?a.left:a.width+a.left:c.xy.x;e=a.horiz?c.xy.y:e?a.width+a.top:a.top;c.animate({x:g,y:e,opacity:0},void 0,c.destroy);delete this.label}a.isDirty=!0;this.label=this.movedLabel;delete this.movedLabel};return g}();"";return f});K(f,"Core/Axis/Axis.js",[f["Core/Animation/AnimationUtilities.js"],f["Core/Axis/AxisDefaults.js"],f["Core/Color/Color.js"],f["Core/DefaultOptions.js"],f["Core/Foundation.js"],f["Core/Globals.js"],
f["Core/Axis/Tick.js"],f["Core/Utilities.js"]],function(a,f,B,H,w,E,I,A){var u=a.animObject,n=H.defaultOptions,k=w.registerEventOptions,e=E.deg2rad,c=A.arrayMax,p=A.arrayMin,g=A.clamp,t=A.correctFloat,q=A.defined,F=A.destroyObjectProperties,y=A.erase,x=A.error,z=A.extend,m=A.fireEvent,h=A.isArray,b=A.isNumber,l=A.isString,d=A.merge,D=A.normalizeTickInterval,v=A.objectEach,r=A.pick,O=A.relativeLength,P=A.removeEvent,S=A.splat,N=A.syncTimeout,C=function(b,d){return D(d,void 0,void 0,r(b.options.allowDecimals,
.5>d||void 0!==b.tickAmount),!!b.tickAmount)};a=function(){function a(b,d){this.zoomEnabled=this.width=this.visible=this.userOptions=this.translationSlope=this.transB=this.transA=this.top=this.ticks=this.tickRotCorr=this.tickPositions=this.tickmarkOffset=this.tickInterval=this.tickAmount=this.side=this.series=this.right=this.positiveValuesOnly=this.pos=this.pointRangePadding=this.pointRange=this.plotLinesAndBandsGroups=this.plotLinesAndBands=this.paddedTicks=this.overlap=this.options=this.offset=
this.names=this.minPixelPadding=this.minorTicks=this.minorTickInterval=this.min=this.maxLabelLength=this.max=this.len=this.left=this.labelFormatter=this.labelEdge=this.isLinked=this.height=this.hasVisibleSeries=this.hasNames=this.eventOptions=this.coll=this.closestPointRange=this.chart=this.bottom=this.alternateBands=void 0;this.init(b,d)}a.prototype.init=function(d,c){var a=c.isX;this.chart=d;this.horiz=d.inverted&&!this.isZAxis?!a:a;this.isXAxis=a;this.coll=this.coll||(a?"xAxis":"yAxis");m(this,
"init",{userOptions:c});this.opposite=r(c.opposite,this.opposite);this.side=r(c.side,this.side,this.horiz?this.opposite?0:2:this.opposite?1:3);this.setOptions(c);var e=this.options,h=e.labels,l=e.type;this.userOptions=c;this.minPixelPadding=0;this.reversed=r(e.reversed,this.reversed);this.visible=e.visible;this.zoomEnabled=e.zoomEnabled;this.hasNames="category"===l||!0===e.categories;this.categories=e.categories||(this.hasNames?[]:void 0);this.names||(this.names=[],this.names.keys={});this.plotLinesAndBandsGroups=
{};this.positiveValuesOnly=!!this.logarithmic;this.isLinked=q(e.linkedTo);this.ticks={};this.labelEdge=[];this.minorTicks={};this.plotLinesAndBands=[];this.alternateBands={};this.len=0;this.minRange=this.userMinRange=e.minRange||e.maxZoom;this.range=e.range;this.offset=e.offset||0;this.min=this.max=null;c=r(e.crosshair,S(d.options.tooltip.crosshairs)[a?0:1]);this.crosshair=!0===c?{}:c;-1===d.axes.indexOf(this)&&(a?d.axes.splice(d.xAxis.length,0,this):d.axes.push(this),d[this.coll].push(this));this.series=
this.series||[];d.inverted&&!this.isZAxis&&a&&"undefined"===typeof this.reversed&&(this.reversed=!0);this.labelRotation=b(h.rotation)?h.rotation:void 0;k(this,e);m(this,"afterInit")};a.prototype.setOptions=function(b){this.options=d(f.defaultXAxisOptions,"yAxis"===this.coll&&f.defaultYAxisOptions,[f.defaultTopAxisOptions,f.defaultRightAxisOptions,f.defaultBottomAxisOptions,f.defaultLeftAxisOptions][this.side],d(n[this.coll],b));m(this,"afterSetOptions",{userOptions:b})};a.prototype.defaultLabelFormatter=
function(d){var c=this.axis;d=this.chart.numberFormatter;var a=b(this.value)?this.value:NaN,e=c.chart.time,h=this.dateTimeLabelFormat,l=n.lang,g=l.numericSymbols;l=l.numericSymbolMagnitude||1E3;var r=c.logarithmic?Math.abs(a):c.tickInterval,m=g&&g.length;if(c.categories)var J=""+this.value;else if(h)J=e.dateFormat(h,a);else if(m&&1E3<=r)for(;m--&&"undefined"===typeof J;)c=Math.pow(l,m+1),r>=c&&0===10*a%c&&null!==g[m]&&0!==a&&(J=d(a/c,-1)+g[m]);"undefined"===typeof J&&(J=1E4<=Math.abs(a)?d(a,-1):d(a,
-1,void 0,""));return J};a.prototype.getSeriesExtremes=function(){var d=this,c=d.chart,a;m(this,"getSeriesExtremes",null,function(){d.hasVisibleSeries=!1;d.dataMin=d.dataMax=d.threshold=null;d.softThreshold=!d.isXAxis;d.stacking&&d.stacking.buildStacks();d.series.forEach(function(e){if(e.visible||!c.options.chart.ignoreHiddenSeries){var h=e.options,l=h.threshold;d.hasVisibleSeries=!0;d.positiveValuesOnly&&0>=l&&(l=null);if(d.isXAxis){if(h=e.xData,h.length){h=d.logarithmic?h.filter(d.validatePositiveValue):
h;a=e.getXExtremes(h);var g=a.min;var m=a.max;b(g)||g instanceof Date||(h=h.filter(b),a=e.getXExtremes(h),g=a.min,m=a.max);h.length&&(d.dataMin=Math.min(r(d.dataMin,g),g),d.dataMax=Math.max(r(d.dataMax,m),m))}}else if(e=e.applyExtremes(),b(e.dataMin)&&(g=e.dataMin,d.dataMin=Math.min(r(d.dataMin,g),g)),b(e.dataMax)&&(m=e.dataMax,d.dataMax=Math.max(r(d.dataMax,m),m)),q(l)&&(d.threshold=l),!h.softThreshold||d.positiveValuesOnly)d.softThreshold=!1}})});m(this,"afterGetSeriesExtremes")};a.prototype.translate=
function(d,c,a,e,h,l){var g=this.linkedParent||this,m=e&&g.old?g.old.min:g.min,r=g.minPixelPadding;h=(g.isOrdinal||g.brokenAxis&&g.brokenAxis.hasBreaks||g.logarithmic&&h)&&g.lin2val;var k=1,J=0;e=e&&g.old?g.old.transA:g.transA;e||(e=g.transA);a&&(k*=-1,J=g.len);g.reversed&&(k*=-1,J-=k*(g.sector||g.len));c?(l=(d*k+J-r)/e+m,h&&(l=g.lin2val(l))):(h&&(d=g.val2lin(d)),d=k*(d-m)*e,l=b(m)?(g.isRadial?d:t(d))+J+k*r+(b(l)?e*l:0):void 0);return l};a.prototype.toPixels=function(b,d){return this.translate(b,
!1,!this.horiz,null,!0)+(d?0:this.pos)};a.prototype.toValue=function(b,d){return this.translate(b-(d?0:this.pos),!0,!this.horiz,null,!0)};a.prototype.getPlotLinePath=function(d){function c(b,d,c){if("pass"!==n&&b<d||b>c)n?b=g(b,d,c):P=!0;return b}var a=this,e=a.chart,h=a.left,l=a.top,k=d.old,J=d.value,f=d.lineWidth,v=k&&e.oldChartHeight||e.chartHeight,D=k&&e.oldChartWidth||e.chartWidth,p=a.transB,q=d.translatedValue,n=d.force,t,z,y,O,P;d={value:J,lineWidth:f,old:k,force:n,acrossPanes:d.acrossPanes,
translatedValue:q};m(this,"getPlotLinePath",d,function(d){q=r(q,a.translate(J,null,null,k));q=g(q,-1E5,1E5);t=y=Math.round(q+p);z=O=Math.round(v-q-p);b(q)?a.horiz?(z=l,O=v-a.bottom,t=y=c(t,h,h+a.width)):(t=h,y=D-a.right,z=O=c(z,l,l+a.height)):(P=!0,n=!1);d.path=P&&!n?null:e.renderer.crispLine([["M",t,z],["L",y,O]],f||1)});return d.path};a.prototype.getLinearTickPositions=function(b,d,c){var a=t(Math.floor(d/b)*b);c=t(Math.ceil(c/b)*b);var e=[],h;t(a+b)===a&&(h=20);if(this.single)return[d];for(d=a;d<=
c;){e.push(d);d=t(d+b,h);if(d===l)break;var l=d}return e};a.prototype.getMinorTickInterval=function(){var b=this.options;return!0===b.minorTicks?r(b.minorTickInterval,"auto"):!1===b.minorTicks?null:b.minorTickInterval};a.prototype.getMinorTickPositions=function(){var b=this.options,d=this.tickPositions,c=this.minorTickInterval,a=this.pointRangePadding||0,e=this.min-a;a=this.max+a;var h=a-e,l=[];if(h&&h/c<this.len/3){var g=this.logarithmic;if(g)this.paddedTicks.forEach(function(b,d,a){d&&l.push.apply(l,
g.getLogTickPositions(c,a[d-1],a[d],!0))});else if(this.dateTime&&"auto"===this.getMinorTickInterval())l=l.concat(this.getTimeTicks(this.dateTime.normalizeTimeTickInterval(c),e,a,b.startOfWeek));else for(b=e+(d[0]-e)%c;b<=a&&b!==l[0];b+=c)l.push(b)}0!==l.length&&this.trimTicks(l);return l};a.prototype.adjustForMinRange=function(){var b=this.options,d=this.logarithmic,a=this.min,e=this.max,h=0,l,g,m,k;this.isXAxis&&"undefined"===typeof this.minRange&&!d&&(q(b.min)||q(b.max)||q(b.floor)||q(b.ceiling)?
this.minRange=null:(this.series.forEach(function(b){m=b.xData;k=b.xIncrement?1:m.length-1;if(1<m.length)for(l=k;0<l;l--)if(g=m[l]-m[l-1],!h||g<h)h=g}),this.minRange=Math.min(5*h,this.dataMax-this.dataMin)));if(e-a<this.minRange){var f=this.dataMax-this.dataMin>=this.minRange;var v=this.minRange;var D=(v-e+a)/2;D=[a-D,r(b.min,a-D)];f&&(D[2]=this.logarithmic?this.logarithmic.log2lin(this.dataMin):this.dataMin);a=c(D);e=[a+v,r(b.max,a+v)];f&&(e[2]=d?d.log2lin(this.dataMax):this.dataMax);e=p(e);e-a<v&&
(D[0]=e-v,D[1]=r(b.min,e-v),a=c(D))}this.min=a;this.max=e};a.prototype.getClosest=function(){var b;this.categories?b=1:this.series.forEach(function(d){var c=d.closestPointRange,a=d.visible||!d.chart.options.chart.ignoreHiddenSeries;!d.noSharedTooltip&&q(c)&&a&&(b=q(b)?Math.min(b,c):c)});return b};a.prototype.nameToX=function(b){var d=h(this.options.categories),c=d?this.categories:this.names,a=b.options.x;b.series.requireSorting=!1;q(a)||(a=this.options.uniqueNames&&c?d?c.indexOf(b.name):r(c.keys[b.name],
-1):b.series.autoIncrement());if(-1===a){if(!d&&c)var e=c.length}else e=a;"undefined"!==typeof e&&(this.names[e]=b.name,this.names.keys[b.name]=e);return e};a.prototype.updateNames=function(){var b=this,d=this.names;0<d.length&&(Object.keys(d.keys).forEach(function(b){delete d.keys[b]}),d.length=0,this.minRange=this.userMinRange,(this.series||[]).forEach(function(d){d.xIncrement=null;if(!d.points||d.isDirtyData)b.max=Math.max(b.max,d.xData.length-1),d.processData(),d.generatePoints();d.data.forEach(function(c,
a){if(c&&c.options&&"undefined"!==typeof c.name){var e=b.nameToX(c);"undefined"!==typeof e&&e!==c.x&&(c.x=e,d.xData[a]=e)}})}))};a.prototype.setAxisTranslation=function(){var b=this,d=b.max-b.min,c=b.linkedParent,a=!!b.categories,e=b.isXAxis,h=b.axisPointRange||0,g=0,k=0,f=b.transA;if(e||a||h){var v=b.getClosest();c?(g=c.minPointOffset,k=c.pointRangePadding):b.series.forEach(function(d){var c=a?1:e?r(d.options.pointRange,v,0):b.axisPointRange||0,m=d.options.pointPlacement;h=Math.max(h,c);if(!b.single||
a)d=d.is("xrange")?!e:e,g=Math.max(g,d&&l(m)?0:c/2),k=Math.max(k,d&&"on"===m?0:c)});c=b.ordinal&&b.ordinal.slope&&v?b.ordinal.slope/v:1;b.minPointOffset=g*=c;b.pointRangePadding=k*=c;b.pointRange=Math.min(h,b.single&&a?1:d);e&&(b.closestPointRange=v)}b.translationSlope=b.transA=f=b.staticScale||b.len/(d+k||1);b.transB=b.horiz?b.left:b.bottom;b.minPixelPadding=f*g;m(this,"afterSetAxisTranslation")};a.prototype.minFromRange=function(){return this.max-this.range};a.prototype.setTickInterval=function(d){var c=
this.chart,a=this.logarithmic,e=this.options,h=this.isXAxis,l=this.isLinked,g=e.tickPixelInterval,k=this.categories,f=this.softThreshold,v=e.maxPadding,D=e.minPadding,J=b(e.tickInterval)&&0<=e.tickInterval?e.tickInterval:void 0,p=b(this.threshold)?this.threshold:null;this.dateTime||k||l||this.getTickAmount();var n=r(this.userMin,e.min);var z=r(this.userMax,e.max);if(l){this.linkedParent=c[this.coll][e.linkedTo];var y=this.linkedParent.getExtremes();this.min=r(y.min,y.dataMin);this.max=r(y.max,y.dataMax);
e.type!==this.linkedParent.options.type&&x(11,1,c)}else{if(f&&q(p))if(this.dataMin>=p)y=p,D=0;else if(this.dataMax<=p){var O=p;v=0}this.min=r(n,y,this.dataMin);this.max=r(z,O,this.dataMax)}a&&(this.positiveValuesOnly&&!d&&0>=Math.min(this.min,r(this.dataMin,this.min))&&x(10,1,c),this.min=t(a.log2lin(this.min),16),this.max=t(a.log2lin(this.max),16));this.range&&q(this.max)&&(this.userMin=this.min=n=Math.max(this.dataMin,this.minFromRange()),this.userMax=z=this.max,this.range=null);m(this,"foundExtremes");
this.beforePadding&&this.beforePadding();this.adjustForMinRange();!(k||this.axisPointRange||this.stacking&&this.stacking.usePercentage||l)&&q(this.min)&&q(this.max)&&(c=this.max-this.min)&&(!q(n)&&D&&(this.min-=c*D),!q(z)&&v&&(this.max+=c*v));b(this.userMin)||(b(e.softMin)&&e.softMin<this.min&&(this.min=n=e.softMin),b(e.floor)&&(this.min=Math.max(this.min,e.floor)));b(this.userMax)||(b(e.softMax)&&e.softMax>this.max&&(this.max=z=e.softMax),b(e.ceiling)&&(this.max=Math.min(this.max,e.ceiling)));f&&
q(this.dataMin)&&(p=p||0,!q(n)&&this.min<p&&this.dataMin>=p?this.min=this.options.minRange?Math.min(p,this.max-this.minRange):p:!q(z)&&this.max>p&&this.dataMax<=p&&(this.max=this.options.minRange?Math.max(p,this.min+this.minRange):p));b(this.min)&&b(this.max)&&!this.chart.polar&&this.min>this.max&&(q(this.options.min)?this.max=this.min:q(this.options.max)&&(this.min=this.max));this.tickInterval=this.min===this.max||"undefined"===typeof this.min||"undefined"===typeof this.max?1:l&&this.linkedParent&&
!J&&g===this.linkedParent.options.tickPixelInterval?J=this.linkedParent.tickInterval:r(J,this.tickAmount?(this.max-this.min)/Math.max(this.tickAmount-1,1):void 0,k?1:(this.max-this.min)*g/Math.max(this.len,g));if(h&&!d){var P=this.min!==(this.old&&this.old.min)||this.max!==(this.old&&this.old.max);this.series.forEach(function(b){b.forceCrop=b.forceCropping&&b.forceCropping();b.processData(P)});m(this,"postProcessData",{hasExtemesChanged:P})}this.setAxisTranslation();m(this,"initialAxisTranslation");
this.pointRange&&!J&&(this.tickInterval=Math.max(this.pointRange,this.tickInterval));d=r(e.minTickInterval,this.dateTime&&!this.series.some(function(b){return b.noSharedTooltip})?this.closestPointRange:0);!J&&this.tickInterval<d&&(this.tickInterval=d);this.dateTime||this.logarithmic||J||(this.tickInterval=C(this,this.tickInterval));this.tickAmount||(this.tickInterval=this.unsquish());this.setTickPositions()};a.prototype.setTickPositions=function(){var b=this.options,d=b.tickPositions,c=this.getMinorTickInterval(),
a=this.hasVerticalPanning(),e="colorAxis"===this.coll,h=(e||!a)&&b.startOnTick;a=(e||!a)&&b.endOnTick;e=b.tickPositioner;this.tickmarkOffset=this.categories&&"between"===b.tickmarkPlacement&&1===this.tickInterval?.5:0;this.minorTickInterval="auto"===c&&this.tickInterval?this.tickInterval/5:c;this.single=this.min===this.max&&q(this.min)&&!this.tickAmount&&(parseInt(this.min,10)===this.min||!1!==b.allowDecimals);this.tickPositions=c=d&&d.slice();if(!c){if(this.ordinal&&this.ordinal.positions||!((this.max-
this.min)/this.tickInterval>Math.max(2*this.len,200)))if(this.dateTime)c=this.getTimeTicks(this.dateTime.normalizeTimeTickInterval(this.tickInterval,b.units),this.min,this.max,b.startOfWeek,this.ordinal&&this.ordinal.positions,this.closestPointRange,!0);else if(this.logarithmic)c=this.logarithmic.getLogTickPositions(this.tickInterval,this.min,this.max);else for(var l=b=this.tickInterval;l<=2*b;)if(c=this.getLinearTickPositions(this.tickInterval,this.min,this.max),this.tickAmount&&c.length>this.tickAmount)this.tickInterval=
C(this,l*=1.1);else break;else c=[this.min,this.max],x(19,!1,this.chart);c.length>this.len&&(c=[c[0],c.pop()],c[0]===c[1]&&(c.length=1));this.tickPositions=c;e&&(e=e.apply(this,[this.min,this.max]))&&(this.tickPositions=c=e)}this.paddedTicks=c.slice(0);this.trimTicks(c,h,a);this.isLinked||(this.single&&2>c.length&&!this.categories&&!this.series.some(function(b){return b.is("heatmap")&&"between"===b.options.pointPlacement})&&(this.min-=.5,this.max+=.5),d||e||this.adjustTickAmount());m(this,"afterSetTickPositions")};
a.prototype.trimTicks=function(b,d,c){var a=b[0],e=b[b.length-1],h=!this.isOrdinal&&this.minPointOffset||0;m(this,"trimTicks");if(!this.isLinked){if(d&&-Infinity!==a)this.min=a;else for(;this.min-h>b[0];)b.shift();if(c)this.max=e;else for(;this.max+h<b[b.length-1];)b.pop();0===b.length&&q(a)&&!this.options.tickPositions&&b.push((e+a)/2)}};a.prototype.alignToOthers=function(){var d=this,c=[this],a=d.options,e="yAxis"===this.coll&&this.chart.options.chart.alignThresholds,h=[],l;d.thresholdAlignment=
void 0;if((!1!==this.chart.options.chart.alignTicks&&a.alignTicks||e)&&!1!==a.startOnTick&&!1!==a.endOnTick&&!d.logarithmic){var g=function(b){var d=b.options;return[b.horiz?d.left:d.top,d.width,d.height,d.pane].join()},m=g(this);this.chart[this.coll].forEach(function(b){var a=b.series;a.length&&a.some(function(b){return b.visible})&&b!==d&&g(b)===m&&(l=!0,c.push(b))})}if(l&&e){c.forEach(function(c){c=c.getThresholdAlignment(d);b(c)&&h.push(c)});var r=1<h.length?h.reduce(function(b,d){return b+d},
0)/h.length:void 0;c.forEach(function(b){b.thresholdAlignment=r})}return l};a.prototype.getThresholdAlignment=function(d){(!b(this.dataMin)||this!==d&&this.series.some(function(b){return b.isDirty||b.isDirtyData}))&&this.getSeriesExtremes();if(b(this.threshold))return d=g((this.threshold-(this.dataMin||0))/((this.dataMax||0)-(this.dataMin||0)),0,1),this.options.reversed&&(d=1-d),d};a.prototype.getTickAmount=function(){var b=this.options,d=b.tickPixelInterval,c=b.tickAmount;!q(b.tickInterval)&&!c&&
this.len<d&&!this.isRadial&&!this.logarithmic&&b.startOnTick&&b.endOnTick&&(c=2);!c&&this.alignToOthers()&&(c=Math.ceil(this.len/d)+1);4>c&&(this.finalTickAmt=c,c=5);this.tickAmount=c};a.prototype.adjustTickAmount=function(){var d=this,c=d.finalTickAmt,a=d.max,e=d.min,h=d.options,l=d.tickPositions,g=d.tickAmount,m=d.thresholdAlignment,k=l&&l.length,f=r(d.threshold,d.softThreshold?0:null);var v=d.tickInterval;if(b(m)){var D=.5>m?Math.ceil(m*(g-1)):Math.floor(m*(g-1));h.reversed&&(D=g-1-D)}if(d.hasData()&&
b(e)&&b(a)){m=function(){d.transA*=(k-1)/(g-1);d.min=h.startOnTick?l[0]:Math.min(e,l[0]);d.max=h.endOnTick?l[l.length-1]:Math.max(a,l[l.length-1])};if(b(D)&&b(d.threshold)){for(;l[D]!==f||l.length!==g||l[0]>e||l[l.length-1]<a;){l.length=0;for(l.push(d.threshold);l.length<g;)void 0===l[D]||l[D]>d.threshold?l.unshift(t(l[0]-v)):l.push(t(l[l.length-1]+v));if(v>8*d.tickInterval)break;v*=2}m()}else if(k<g){for(;l.length<g;)l.length%2||e===f?l.push(t(l[l.length-1]+v)):l.unshift(t(l[0]-v));m()}if(q(c)){for(v=
f=l.length;v--;)(3===c&&1===v%2||2>=c&&0<v&&v<f-1)&&l.splice(v,1);d.finalTickAmt=void 0}}};a.prototype.setScale=function(){var b=!1,d=!1;this.series.forEach(function(c){b=b||c.isDirtyData||c.isDirty;d=d||c.xAxis&&c.xAxis.isDirty||!1});this.setAxisSize();var c=this.len!==(this.old&&this.old.len);c||b||d||this.isLinked||this.forceRedraw||this.userMin!==(this.old&&this.old.userMin)||this.userMax!==(this.old&&this.old.userMax)||this.alignToOthers()?(this.stacking&&this.stacking.resetStacks(),this.forceRedraw=
!1,this.getSeriesExtremes(),this.setTickInterval(),this.isDirty||(this.isDirty=c||this.min!==(this.old&&this.old.min)||this.max!==(this.old&&this.old.max))):this.stacking&&this.stacking.cleanStacks();b&&this.panningState&&(this.panningState.isDirty=!0);m(this,"afterSetScale")};a.prototype.setExtremes=function(b,d,c,a,e){var h=this,l=h.chart;c=r(c,!0);h.series.forEach(function(b){delete b.kdTree});e=z(e,{min:b,max:d});m(h,"setExtremes",e,function(){h.userMin=b;h.userMax=d;h.eventArgs=e;c&&l.redraw(a)})};
a.prototype.zoom=function(b,d){var c=this,a=this.dataMin,e=this.dataMax,h=this.options,l=Math.min(a,r(h.min,a)),g=Math.max(e,r(h.max,e));b={newMin:b,newMax:d};m(this,"zoom",b,function(b){var d=b.newMin,h=b.newMax;if(d!==c.min||h!==c.max)c.allowZoomOutside||(q(a)&&(d<l&&(d=l),d>g&&(d=g)),q(e)&&(h<l&&(h=l),h>g&&(h=g))),c.displayBtn="undefined"!==typeof d||"undefined"!==typeof h,c.setExtremes(d,h,!1,void 0,{trigger:"zoom"});b.zoomed=!0});return b.zoomed};a.prototype.setAxisSize=function(){var b=this.chart,
d=this.options,c=d.offsets||[0,0,0,0],a=this.horiz,e=this.width=Math.round(O(r(d.width,b.plotWidth-c[3]+c[1]),b.plotWidth)),h=this.height=Math.round(O(r(d.height,b.plotHeight-c[0]+c[2]),b.plotHeight)),l=this.top=Math.round(O(r(d.top,b.plotTop+c[0]),b.plotHeight,b.plotTop));d=this.left=Math.round(O(r(d.left,b.plotLeft+c[3]),b.plotWidth,b.plotLeft));this.bottom=b.chartHeight-h-l;this.right=b.chartWidth-e-d;this.len=Math.max(a?e:h,0);this.pos=a?d:l};a.prototype.getExtremes=function(){var b=this.logarithmic;
return{min:b?t(b.lin2log(this.min)):this.min,max:b?t(b.lin2log(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,userMin:this.userMin,userMax:this.userMax}};a.prototype.getThreshold=function(b){var d=this.logarithmic,c=d?d.lin2log(this.min):this.min;d=d?d.lin2log(this.max):this.max;null===b||-Infinity===b?b=c:Infinity===b?b=d:c>b?b=c:d<b&&(b=d);return this.translate(b,0,1,0,1)};a.prototype.autoLabelAlign=function(b){var d=(r(b,0)-90*this.side+720)%360;b={align:"center"};m(this,"autoLabelAlign",
b,function(b){15<d&&165>d?b.align="right":195<d&&345>d&&(b.align="left")});return b.align};a.prototype.tickSize=function(b){var d=this.options,c=r(d["tick"===b?"tickWidth":"minorTickWidth"],"tick"===b&&this.isXAxis&&!this.categories?1:0),a=d["tick"===b?"tickLength":"minorTickLength"];if(c&&a){"inside"===d[b+"Position"]&&(a=-a);var e=[a,c]}b={tickSize:e};m(this,"afterTickSize",b);return b.tickSize};a.prototype.labelMetrics=function(){var b=this.tickPositions&&this.tickPositions[0]||0;return this.chart.renderer.fontMetrics(this.options.labels.style.fontSize,
this.ticks[b]&&this.ticks[b].label)};a.prototype.unsquish=function(){var d=this.options.labels,c=this.horiz,a=this.tickInterval,h=this.len/(((this.categories?1:0)+this.max-this.min)/a),l=d.rotation,g=this.labelMetrics(),m=Math.max(this.max-this.min,0),k=function(b){var d=b/(h||1);d=1<d?Math.ceil(d):1;d*a>m&&Infinity!==b&&Infinity!==h&&m&&(d=Math.ceil(m/a));return t(d*a)},v=a,f,D,p=Number.MAX_VALUE;if(c){if(!d.staggerLines&&!d.step)if(b(l))var q=[l];else h<d.autoRotationLimit&&(q=d.autoRotation);q&&
q.forEach(function(b){if(b===l||b&&-90<=b&&90>=b){D=k(Math.abs(g.h/Math.sin(e*b)));var d=D+Math.abs(b/360);d<p&&(p=d,f=b,v=D)}})}else d.step||(v=k(g.h));this.autoRotation=q;this.labelRotation=r(f,b(l)?l:0);return v};a.prototype.getSlotWidth=function(d){var c=this.chart,a=this.horiz,e=this.options.labels,h=Math.max(this.tickPositions.length-(this.categories?0:1),1),l=c.margin[3];if(d&&b(d.slotWidth))return d.slotWidth;if(a&&2>e.step)return e.rotation?0:(this.staggerLines||1)*this.len/h;if(!a){d=e.style.width;
if(void 0!==d)return parseInt(String(d),10);if(l)return l-c.spacing[3]}return.33*c.chartWidth};a.prototype.renderUnsquish=function(){var b=this.chart,d=b.renderer,c=this.tickPositions,a=this.ticks,e=this.options.labels,h=e.style,g=this.horiz,m=this.getSlotWidth(),r=Math.max(1,Math.round(m-2*e.padding)),k={},v=this.labelMetrics(),f=h.textOverflow,D=0;l(e.rotation)||(k.rotation=e.rotation||0);c.forEach(function(b){b=a[b];b.movedLabel&&b.replaceMovedLabel();b&&b.label&&b.label.textPxLength>D&&(D=b.label.textPxLength)});
this.maxLabelLength=D;if(this.autoRotation)D>r&&D>v.h?k.rotation=this.labelRotation:this.labelRotation=0;else if(m){var p=r;if(!f){var q="clip";for(r=c.length;!g&&r--;){var n=c[r];if(n=a[n].label)n.styles&&"ellipsis"===n.styles.textOverflow?n.css({textOverflow:"clip"}):n.textPxLength>m&&n.css({width:m+"px"}),n.getBBox().height>this.len/c.length-(v.h-v.f)&&(n.specificTextOverflow="ellipsis")}}}k.rotation&&(p=D>.5*b.chartHeight?.33*b.chartHeight:D,f||(q="ellipsis"));if(this.labelAlign=e.align||this.autoLabelAlign(this.labelRotation))k.align=
this.labelAlign;c.forEach(function(b){var d=(b=a[b])&&b.label,c=h.width,e={};d&&(d.attr(k),b.shortenLabel?b.shortenLabel():p&&!c&&"nowrap"!==h.whiteSpace&&(p<d.textPxLength||"SPAN"===d.element.tagName)?(e.width=p+"px",f||(e.textOverflow=d.specificTextOverflow||q),d.css(e)):d.styles&&d.styles.width&&!e.width&&!c&&d.css({width:null}),delete d.specificTextOverflow,b.rotation=k.rotation)},this);this.tickRotCorr=d.rotCorr(v.b,this.labelRotation||0,0!==this.side)};a.prototype.hasData=function(){return this.series.some(function(b){return b.hasData()})||
this.options.showEmpty&&q(this.min)&&q(this.max)};a.prototype.addTitle=function(b){var c=this.chart.renderer,a=this.horiz,e=this.opposite,h=this.options.title,l=this.chart.styledMode,g;this.axisTitle||((g=h.textAlign)||(g=(a?{low:"left",middle:"center",high:"right"}:{low:e?"right":"left",middle:"center",high:e?"left":"right"})[h.align]),this.axisTitle=c.text(h.text||"",0,0,h.useHTML).attr({zIndex:7,rotation:h.rotation,align:g}).addClass("highcharts-axis-title"),l||this.axisTitle.css(d(h.style)),this.axisTitle.add(this.axisGroup),
this.axisTitle.isNew=!0);l||h.style.width||this.isRadial||this.axisTitle.css({width:this.len+"px"});this.axisTitle[b?"show":"hide"](b)};a.prototype.generateTick=function(b){var d=this.ticks;d[b]?d[b].addLabel():d[b]=new I(this,b)};a.prototype.getOffset=function(){var b=this,d=this,c=d.chart,a=d.horiz,e=d.options,h=d.side,l=d.ticks,g=d.tickPositions,k=d.coll,f=d.axisParent,D=c.renderer,p=c.inverted&&!d.isZAxis?[1,0,3,2][h]:h,n=d.hasData(),t=e.title,z=e.labels,y=c.axisOffset;c=c.clipOffset;var O=[-1,
1,1,-1][h],P=e.className,x,F=0,fa=0,ca=0;d.showAxis=x=n||e.showEmpty;d.staggerLines=d.horiz&&z.staggerLines||void 0;if(!d.axisGroup){var N=function(d,c,a){return D.g(d).attr({zIndex:a}).addClass("highcharts-"+k.toLowerCase()+c+" "+(b.isRadial?"highcharts-radial-axis"+c+" ":"")+(P||"")).add(f)};d.gridGroup=N("grid","-grid",e.gridZIndex);d.axisGroup=N("axis","",e.zIndex);d.labelGroup=N("axis-labels","-labels",z.zIndex)}n||d.isLinked?(g.forEach(function(b){d.generateTick(b)}),d.renderUnsquish(),d.reserveSpaceDefault=
0===h||2===h||{1:"left",3:"right"}[h]===d.labelAlign,r(z.reserveSpace,"center"===d.labelAlign?!0:null,d.reserveSpaceDefault)&&g.forEach(function(b){ca=Math.max(l[b].getLabelSize(),ca)}),d.staggerLines&&(ca*=d.staggerLines),d.labelOffset=ca*(d.opposite?-1:1)):v(l,function(b,d){b.destroy();delete l[d]});if(t&&t.text&&!1!==t.enabled&&(d.addTitle(x),x&&!1!==t.reserveSpace)){d.titleOffset=F=d.axisTitle.getBBox()[a?"height":"width"];var u=t.offset;fa=q(u)?0:r(t.margin,a?5:10)}d.renderLine();d.offset=O*
r(e.offset,y[h]?y[h]+(e.margin||0):0);d.tickRotCorr=d.tickRotCorr||{x:0,y:0};t=0===h?-d.labelMetrics().h:2===h?d.tickRotCorr.y:0;n=Math.abs(ca)+fa;ca&&(n=n-t+O*(a?r(z.y,d.tickRotCorr.y+8*O):z.x));d.axisTitleMargin=r(u,n);d.getMaxLabelDimensions&&(d.maxLabelDimensions=d.getMaxLabelDimensions(l,g));"colorAxis"!==k&&(a=this.tickSize("tick"),y[h]=Math.max(y[h],(d.axisTitleMargin||0)+F+O*d.offset,n,g&&g.length&&a?a[0]+O*d.offset:0),e=!d.axisLine||e.offset?0:2*Math.floor(d.axisLine.strokeWidth()/2),c[p]=
Math.max(c[p],e));m(this,"afterGetOffset")};a.prototype.getLinePath=function(b){var d=this.chart,c=this.opposite,a=this.offset,e=this.horiz,h=this.left+(c?this.width:0)+a;a=d.chartHeight-this.bottom-(c?this.height:0)+a;c&&(b*=-1);return d.renderer.crispLine([["M",e?this.left:h,e?a:this.top],["L",e?d.chartWidth-this.right:h,e?a:d.chartHeight-this.bottom]],b)};a.prototype.renderLine=function(){this.axisLine||(this.axisLine=this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup),
this.chart.styledMode||this.axisLine.attr({stroke:this.options.lineColor,"stroke-width":this.options.lineWidth,zIndex:7}))};a.prototype.getTitlePosition=function(){var b=this.horiz,d=this.left,c=this.top,a=this.len,e=this.options.title,h=b?d:c,l=this.opposite,g=this.offset,r=e.x,k=e.y,v=this.axisTitle,f=this.chart.renderer.fontMetrics(e.style.fontSize,v);v=v?Math.max(v.getBBox(!1,0).height-f.h-1,0):0;a={low:h+(b?0:a),middle:h+a/2,high:h+(b?a:0)}[e.align];d=(b?c+this.height:d)+(b?1:-1)*(l?-1:1)*(this.axisTitleMargin||
0)+[-v,v,f.f,-v][this.side];b={x:b?a+r:d+(l?this.width:0)+g+r,y:b?d+k-(l?this.height:0)+g:a+k};m(this,"afterGetTitlePosition",{titlePosition:b});return b};a.prototype.renderMinorTick=function(b,d){var c=this.minorTicks;c[b]||(c[b]=new I(this,b,"minor"));d&&c[b].isNew&&c[b].render(null,!0);c[b].render(null,!1,1)};a.prototype.renderTick=function(b,d,c){var a=this.ticks;if(!this.isLinked||b>=this.min&&b<=this.max||this.grid&&this.grid.isColumn)a[b]||(a[b]=new I(this,b)),c&&a[b].isNew&&a[b].render(d,
!0,-1),a[b].render(d)};a.prototype.render=function(){var d=this,c=d.chart,a=d.logarithmic,e=d.options,h=d.isLinked,l=d.tickPositions,g=d.axisTitle,r=d.ticks,k=d.minorTicks,f=d.alternateBands,D=e.stackLabels,p=e.alternateGridColor,q=d.tickmarkOffset,n=d.axisLine,t=d.showAxis,z=u(c.renderer.globalAnimation),y,O;d.labelEdge.length=0;d.overlap=!1;[r,k,f].forEach(function(b){v(b,function(b){b.isActive=!1})});if(d.hasData()||h){var P=d.chart.hasRendered&&d.old&&b(d.old.min);d.minorTickInterval&&!d.categories&&
d.getMinorTickPositions().forEach(function(b){d.renderMinorTick(b,P)});l.length&&(l.forEach(function(b,c){d.renderTick(b,c,P)}),q&&(0===d.min||d.single)&&(r[-1]||(r[-1]=new I(d,-1,null,!0)),r[-1].render(-1)));p&&l.forEach(function(b,e){O="undefined"!==typeof l[e+1]?l[e+1]+q:d.max-q;0===e%2&&b<d.max&&O<=d.max+(c.polar?-q:q)&&(f[b]||(f[b]=new E.PlotLineOrBand(d)),y=b+q,f[b].options={from:a?a.lin2log(y):y,to:a?a.lin2log(O):O,color:p,className:"highcharts-alternate-grid"},f[b].render(),f[b].isActive=
!0)});d._addedPlotLB||(d._addedPlotLB=!0,(e.plotLines||[]).concat(e.plotBands||[]).forEach(function(b){d.addPlotBandOrLine(b)}))}[r,k,f].forEach(function(b){var d=[],a=z.duration;v(b,function(b,c){b.isActive||(b.render(c,!1,0),b.isActive=!1,d.push(c))});N(function(){for(var c=d.length;c--;)b[d[c]]&&!b[d[c]].isActive&&(b[d[c]].destroy(),delete b[d[c]])},b!==f&&c.hasRendered&&a?a:0)});n&&(n[n.isPlaced?"animate":"attr"]({d:this.getLinePath(n.strokeWidth())}),n.isPlaced=!0,n[t?"show":"hide"](t));g&&t&&
(e=d.getTitlePosition(),g[g.isNew?"attr":"animate"](e),g.isNew=!1);D&&D.enabled&&d.stacking&&d.stacking.renderStackTotals();d.old={len:d.len,max:d.max,min:d.min,transA:d.transA,userMax:d.userMax,userMin:d.userMin};d.isDirty=!1;m(this,"afterRender")};a.prototype.redraw=function(){this.visible&&(this.render(),this.plotLinesAndBands.forEach(function(b){b.render()}));this.series.forEach(function(b){b.isDirty=!0})};a.prototype.getKeepProps=function(){return this.keepProps||a.keepProps};a.prototype.destroy=
function(b){var d=this,c=d.plotLinesAndBands,a=this.eventOptions;m(this,"destroy",{keepEvents:b});b||P(d);[d.ticks,d.minorTicks,d.alternateBands].forEach(function(b){F(b)});if(c)for(b=c.length;b--;)c[b].destroy();"axisLine axisTitle axisGroup gridGroup labelGroup cross scrollbar".split(" ").forEach(function(b){d[b]&&(d[b]=d[b].destroy())});for(var e in d.plotLinesAndBandsGroups)d.plotLinesAndBandsGroups[e]=d.plotLinesAndBandsGroups[e].destroy();v(d,function(b,c){-1===d.getKeepProps().indexOf(c)&&
delete d[c]});this.eventOptions=a};a.prototype.drawCrosshair=function(b,d){var c=this.crosshair,a=r(c&&c.snap,!0),e=this.chart,h,l=this.cross;m(this,"drawCrosshair",{e:b,point:d});b||(b=this.cross&&this.cross.e);if(c&&!1!==(q(d)||!a)){a?q(d)&&(h=r("colorAxis"!==this.coll?d.crosshairPos:null,this.isXAxis?d.plotX:this.len-d.plotY)):h=b&&(this.horiz?b.chartX-this.pos:this.len-b.chartY+this.pos);if(q(h)){var g={value:d&&(this.isXAxis?d.x:r(d.stackY,d.y)),translatedValue:h};e.polar&&z(g,{isCrosshair:!0,
chartX:b&&b.chartX,chartY:b&&b.chartY,point:d});g=this.getPlotLinePath(g)||null}if(!q(g)){this.hideCrosshair();return}a=this.categories&&!this.isRadial;l||(this.cross=l=e.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-"+(a?"category ":"thin ")+(c.className||"")).attr({zIndex:r(c.zIndex,2)}).add(),e.styledMode||(l.attr({stroke:c.color||(a?B.parse("#ccd6eb").setOpacity(.25).get():"#cccccc"),"stroke-width":r(c.width,1)}).css({"pointer-events":"none"}),c.dashStyle&&l.attr({dashstyle:c.dashStyle})));
l.show().attr({d:g});a&&!c.width&&l.attr({"stroke-width":this.transA});this.cross.e=b}else this.hideCrosshair();m(this,"afterDrawCrosshair",{e:b,point:d})};a.prototype.hideCrosshair=function(){this.cross&&this.cross.hide();m(this,"afterHideCrosshair")};a.prototype.hasVerticalPanning=function(){var b=this.chart.options.chart.panning;return!!(b&&b.enabled&&/y/.test(b.type))};a.prototype.validatePositiveValue=function(d){return b(d)&&0<d};a.prototype.update=function(b,c){var a=this.chart;b=d(this.userOptions,
b);this.destroy(!0);this.init(a,b);a.isDirtyBox=!0;r(c,!0)&&a.redraw()};a.prototype.remove=function(b){for(var d=this.chart,c=this.coll,a=this.series,e=a.length;e--;)a[e]&&a[e].remove(!1);y(d.axes,this);y(d[c],this);d[c].forEach(function(b,d){b.options.index=b.userOptions.index=d});this.destroy();d.isDirtyBox=!0;r(b,!0)&&d.redraw()};a.prototype.setTitle=function(b,d){this.update({title:b},d)};a.prototype.setCategories=function(b,d){this.update({categories:b},d)};a.defaultOptions=f.defaultXAxisOptions;
a.keepProps="extKey hcEvents names series userMax userMin".split(" ");return a}();"";return a});K(f,"Core/Axis/DateTimeAxis.js",[f["Core/Utilities.js"]],function(a){var f=a.addEvent,B=a.getMagnitude,H=a.normalizeTickInterval,w=a.timeUnits,E;(function(a){function A(){return this.chart.time.getTimeTicks.apply(this.chart.time,arguments)}function u(a){"datetime"!==a.userOptions.type?this.dateTime=void 0:this.dateTime||(this.dateTime=new k(this))}var n=[];a.compose=function(a){-1===n.indexOf(a)&&(n.push(a),
a.keepProps.push("dateTime"),a.prototype.getTimeTicks=A,f(a,"init",u));return a};var k=function(){function a(c){this.axis=c}a.prototype.normalizeTimeTickInterval=function(c,a){var e=a||[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1,2]],["week",[1,2]],["month",[1,2,3,4,6]],["year",null]];a=e[e.length-1];var k=w[a[0]],f=a[1],p;for(p=0;p<e.length&&!(a=e[p],k=w[a[0]],f=a[1],e[p+1]&&c<=(k*f[f.length-1]+w[e[p+
1][0]])/2);p++);k===w.year&&c<5*k&&(f=[1,2,5]);c=H(c/k,f,"year"===a[0]?Math.max(B(c/k),1):1);return{unitRange:k,count:c,unitName:a[0]}};a.prototype.getXDateFormat=function(c,a){var e=this.axis;return e.closestPointRange?e.chart.time.getDateFormat(e.closestPointRange,c,e.options.startOfWeek,a)||a.year:a.day};return a}();a.Additions=k})(E||(E={}));return E});K(f,"Core/Axis/LogarithmicAxis.js",[f["Core/Utilities.js"]],function(a){var f=a.addEvent,B=a.normalizeTickInterval,H=a.pick,w;(function(a){function w(a){var e=
this.logarithmic;"logarithmic"!==a.userOptions.type?this.logarithmic=void 0:e||(this.logarithmic=new n(this))}function A(){var a=this.logarithmic;a&&(this.lin2val=function(e){return a.lin2log(e)},this.val2lin=function(e){return a.log2lin(e)})}var u=[];a.compose=function(a){-1===u.indexOf(a)&&(u.push(a),a.keepProps.push("logarithmic"),f(a,"init",w),f(a,"afterInit",A));return a};var n=function(){function a(a){this.axis=a}a.prototype.getLogTickPositions=function(a,c,k,g){var e=this.axis,f=e.len,p=e.options,
n=[];g||(this.minorAutoInterval=void 0);if(.5<=a)a=Math.round(a),n=e.getLinearTickPositions(a,c,k);else if(.08<=a){var x=Math.floor(c),z,m=p=void 0;for(f=.3<a?[1,2,4]:.15<a?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];x<k+1&&!m;x++){var h=f.length;for(z=0;z<h&&!m;z++){var b=this.log2lin(this.lin2log(x)*f[z]);b>c&&(!g||p<=k)&&"undefined"!==typeof p&&n.push(p);p>k&&(m=!0);p=b}}}else c=this.lin2log(c),k=this.lin2log(k),a=g?e.getMinorTickInterval():p.tickInterval,a=H("auto"===a?null:a,this.minorAutoInterval,p.tickPixelInterval/
(g?5:1)*(k-c)/((g?f/e.tickPositions.length:f)||1)),a=B(a),n=e.getLinearTickPositions(a,c,k).map(this.log2lin),g||(this.minorAutoInterval=a/5);g||(e.tickInterval=a);return n};a.prototype.lin2log=function(a){return Math.pow(10,a)};a.prototype.log2lin=function(a){return Math.log(a)/Math.LN10};return a}();a.Additions=n})(w||(w={}));return w});K(f,"Core/Axis/PlotLineOrBand/PlotLineOrBandAxis.js",[f["Core/Utilities.js"]],function(a){var f=a.erase,B=a.extend,H=a.isNumber,w;(function(a){var w=[],A;a.compose=
function(a,k){A||(A=a);-1===w.indexOf(k)&&(w.push(k),B(k.prototype,u.prototype));return k};var u=function(){function a(){}a.prototype.getPlotBandPath=function(a,e,c){void 0===c&&(c=this.options);var k=this.getPlotLinePath({value:e,force:!0,acrossPanes:c.acrossPanes}),g=[],f=this.horiz;e=!H(this.min)||!H(this.max)||a<this.min&&e<this.min||a>this.max&&e>this.max;a=this.getPlotLinePath({value:a,force:!0,acrossPanes:c.acrossPanes});c=1;if(a&&k){if(e){var q=a.toString()===k.toString();c=0}for(e=0;e<a.length;e+=
2){var n=a[e],y=a[e+1],x=k[e],z=k[e+1];"M"!==n[0]&&"L"!==n[0]||"M"!==y[0]&&"L"!==y[0]||"M"!==x[0]&&"L"!==x[0]||"M"!==z[0]&&"L"!==z[0]||(f&&x[1]===n[1]?(x[1]+=c,z[1]+=c):f||x[2]!==n[2]||(x[2]+=c,z[2]+=c),g.push(["M",n[1],n[2]],["L",y[1],y[2]],["L",z[1],z[2]],["L",x[1],x[2]],["Z"]));g.isFlat=q}}return g};a.prototype.addPlotBand=function(a){return this.addPlotBandOrLine(a,"plotBands")};a.prototype.addPlotLine=function(a){return this.addPlotBandOrLine(a,"plotLines")};a.prototype.addPlotBandOrLine=function(a,
e){var c=this,k=this.userOptions,g=new A(this,a);this.visible&&(g=g.render());if(g){this._addedPlotLB||(this._addedPlotLB=!0,(k.plotLines||[]).concat(k.plotBands||[]).forEach(function(a){c.addPlotBandOrLine(a)}));if(e){var f=k[e]||[];f.push(a);k[e]=f}this.plotLinesAndBands.push(g)}return g};a.prototype.removePlotBandOrLine=function(a){var e=this.plotLinesAndBands,c=this.options,k=this.userOptions;if(e){for(var g=e.length;g--;)e[g].id===a&&e[g].destroy();[c.plotLines||[],k.plotLines||[],c.plotBands||
[],k.plotBands||[]].forEach(function(c){for(g=c.length;g--;)(c[g]||{}).id===a&&f(c,c[g])})}};a.prototype.removePlotBand=function(a){this.removePlotBandOrLine(a)};a.prototype.removePlotLine=function(a){this.removePlotBandOrLine(a)};return a}()})(w||(w={}));return w});K(f,"Core/Axis/PlotLineOrBand/PlotLineOrBand.js",[f["Core/Axis/PlotLineOrBand/PlotLineOrBandAxis.js"],f["Core/Utilities.js"]],function(a,f){var C=f.arrayMax,H=f.arrayMin,w=f.defined,E=f.destroyObjectProperties,I=f.erase,A=f.fireEvent,
u=f.merge,n=f.objectEach,k=f.pick;f=function(){function e(c,a){this.axis=c;a&&(this.options=a,this.id=a.id)}e.compose=function(c){return a.compose(e,c)};e.prototype.render=function(){A(this,"render");var c=this,a=c.axis,e=a.horiz,f=a.logarithmic,q=c.options,F=q.color,y=k(q.zIndex,0),x=q.events,z={},m=a.chart.renderer,h=q.label,b=c.label,l=q.to,d=q.from,D=q.value,v=c.svgElem,r=[],O=w(d)&&w(l);r=w(D);var P=!v,S={"class":"highcharts-plot-"+(O?"band ":"line ")+(q.className||"")},N=O?"bands":"lines";f&&
(d=f.log2lin(d),l=f.log2lin(l),D=f.log2lin(D));a.chart.styledMode||(r?(S.stroke=F||"#999999",S["stroke-width"]=k(q.width,1),q.dashStyle&&(S.dashstyle=q.dashStyle)):O&&(S.fill=F||"#e6ebf5",q.borderWidth&&(S.stroke=q.borderColor,S["stroke-width"]=q.borderWidth)));z.zIndex=y;N+="-"+y;(f=a.plotLinesAndBandsGroups[N])||(a.plotLinesAndBandsGroups[N]=f=m.g("plot-"+N).attr(z).add());P&&(c.svgElem=v=m.path().attr(S).add(f));if(r)r=a.getPlotLinePath({value:D,lineWidth:v.strokeWidth(),acrossPanes:q.acrossPanes});
else if(O)r=a.getPlotBandPath(d,l,q);else return;!c.eventsAdded&&x&&(n(x,function(b,d){v.on(d,function(b){x[d].apply(c,[b])})}),c.eventsAdded=!0);(P||!v.d)&&r&&r.length?v.attr({d:r}):v&&(r?(v.show(),v.animate({d:r})):v.d&&(v.hide(),b&&(c.label=b=b.destroy())));h&&(w(h.text)||w(h.formatter))&&r&&r.length&&0<a.width&&0<a.height&&!r.isFlat?(h=u({align:e&&O&&"center",x:e?!O&&4:10,verticalAlign:!e&&O&&"middle",y:e?O?16:10:O?6:-4,rotation:e&&!O&&90},h),this.renderLabel(h,r,O,y)):b&&b.hide();return c};e.prototype.renderLabel=
function(c,a,e,f){var g=this.axis,k=g.chart.renderer,p=this.label;p||(this.label=p=k.text(this.getLabelText(c),0,0,c.useHTML).attr({align:c.textAlign||c.align,rotation:c.rotation,"class":"highcharts-plot-"+(e?"band":"line")+"-label "+(c.className||""),zIndex:f}).add(),g.chart.styledMode||p.css(u({textOverflow:"ellipsis"},c.style)));f=a.xBounds||[a[0][1],a[1][1],e?a[2][1]:a[0][1]];a=a.yBounds||[a[0][2],a[1][2],e?a[2][2]:a[0][2]];e=H(f);k=H(a);p.align(c,!1,{x:e,y:k,width:C(f)-e,height:C(a)-k});p.alignValue&&
"left"!==p.alignValue||p.css({width:(90===p.rotation?g.height-(p.alignAttr.y-g.top):g.width-(p.alignAttr.x-g.left))+"px"});p.show(!0)};e.prototype.getLabelText=function(a){return w(a.formatter)?a.formatter.call(this):a.text};e.prototype.destroy=function(){I(this.axis.plotLinesAndBands,this);delete this.axis;E(this)};return e}();"";"";return f});K(f,"Core/Tooltip.js",[f["Core/FormatUtilities.js"],f["Core/Globals.js"],f["Core/Renderer/RendererUtilities.js"],f["Core/Renderer/RendererRegistry.js"],f["Core/Utilities.js"]],
function(a,f,B,H,w){var C=a.format,I=f.doc,A=B.distribute,u=w.addEvent,n=w.clamp,k=w.css,e=w.defined,c=w.discardElement,p=w.extend,g=w.fireEvent,t=w.isArray,q=w.isNumber,F=w.isString,y=w.merge,x=w.pick,z=w.splat,m=w.syncTimeout;a=function(){function a(b,a){this.allowShared=!0;this.container=void 0;this.crosshairs=[];this.distance=0;this.isHidden=!0;this.isSticky=!1;this.now={};this.options={};this.outside=!1;this.chart=b;this.init(b,a)}a.prototype.applyFilter=function(){var b=this.chart;b.renderer.definition({tagName:"filter",
attributes:{id:"drop-shadow-"+b.index,opacity:.5},children:[{tagName:"feGaussianBlur",attributes:{"in":"SourceAlpha",stdDeviation:1}},{tagName:"feOffset",attributes:{dx:1,dy:1}},{tagName:"feComponentTransfer",children:[{tagName:"feFuncA",attributes:{type:"linear",slope:.3}}]},{tagName:"feMerge",children:[{tagName:"feMergeNode"},{tagName:"feMergeNode",attributes:{"in":"SourceGraphic"}}]}]})};a.prototype.bodyFormatter=function(b){return b.map(function(b){var d=b.series.tooltipOptions;return(d[(b.point.formatPrefix||
"point")+"Formatter"]||b.point.tooltipFormatter).call(b.point,d[(b.point.formatPrefix||"point")+"Format"]||"")})};a.prototype.cleanSplit=function(b){this.chart.series.forEach(function(a){var d=a&&a.tt;d&&(!d.isActive||b?a.tt=d.destroy():d.isActive=!1)})};a.prototype.defaultFormatter=function(b){var a=this.points||z(this);var d=[b.tooltipFooterHeaderFormatter(a[0])];d=d.concat(b.bodyFormatter(a));d.push(b.tooltipFooterHeaderFormatter(a[0],!0));return d};a.prototype.destroy=function(){this.label&&(this.label=
this.label.destroy());this.split&&this.tt&&(this.cleanSplit(!0),this.tt=this.tt.destroy());this.renderer&&(this.renderer=this.renderer.destroy(),c(this.container));w.clearTimeout(this.hideTimer);w.clearTimeout(this.tooltipTimeout)};a.prototype.getAnchor=function(b,a){var d=this.chart,c=d.pointer,e=d.inverted,h=d.plotTop,l=d.plotLeft,g,m,f=0,k=0;b=z(b);this.followPointer&&a?("undefined"===typeof a.chartX&&(a=c.normalize(a)),c=[a.chartX-l,a.chartY-h]):b[0].tooltipPos?c=b[0].tooltipPos:(b.forEach(function(b){g=
b.series.yAxis;m=b.series.xAxis;f+=b.plotX||0;k+=b.plotLow?(b.plotLow+(b.plotHigh||0))/2:b.plotY||0;m&&g&&(e?(f+=h+d.plotHeight-m.len-m.pos,k+=l+d.plotWidth-g.len-g.pos):(f+=m.pos-l,k+=g.pos-h))}),f/=b.length,k/=b.length,c=[e?d.plotWidth-k:f,e?d.plotHeight-f:k],this.shared&&1<b.length&&a&&(e?c[0]=a.chartX-l:c[1]=a.chartY-h));return c.map(Math.round)};a.prototype.getLabel=function(){var b=this,a=this.chart.styledMode,d=this.options,c=this.split&&this.allowShared,h="tooltip"+(e(d.className)?" "+d.className:
""),g=d.style.pointerEvents||(!this.followPointer&&d.stickOnContact?"auto":"none"),m=function(){b.inContact=!0},p=function(d){var a=b.chart.hoverSeries;b.inContact=b.shouldStickOnContact()&&b.chart.pointer.inClass(d.relatedTarget,"highcharts-tooltip");if(!b.inContact&&a&&a.onMouseOut)a.onMouseOut()},n,q=this.chart.renderer;if(b.label){var z=!b.label.hasClass("highcharts-label");(c&&!z||!c&&z)&&b.destroy()}if(!this.label){if(this.outside){z=this.chart.options.chart.style;var t=H.getRendererType();
this.container=n=f.doc.createElement("div");n.className="highcharts-tooltip-container";k(n,{position:"absolute",top:"1px",pointerEvents:g,zIndex:Math.max(this.options.style.zIndex||0,(z&&z.zIndex||0)+3)});u(n,"mouseenter",m);u(n,"mouseleave",p);f.doc.body.appendChild(n);this.renderer=q=new t(n,0,0,z,void 0,void 0,q.styledMode)}c?this.label=q.g(h):(this.label=q.label("",0,0,d.shape,void 0,void 0,d.useHTML,void 0,h).attr({padding:d.padding,r:d.borderRadius}),a||this.label.attr({fill:d.backgroundColor,
"stroke-width":d.borderWidth}).css(d.style).css({pointerEvents:g}).shadow(d.shadow));a&&d.shadow&&(this.applyFilter(),this.label.attr({filter:"url(#drop-shadow-"+this.chart.index+")"}));if(b.outside&&!b.split){var y=this.label,x=y.xSetter,F=y.ySetter;y.xSetter=function(d){x.call(y,b.distance);n.style.left=d+"px"};y.ySetter=function(d){F.call(y,b.distance);n.style.top=d+"px"}}this.label.on("mouseenter",m).on("mouseleave",p).attr({zIndex:8}).add()}return this.label};a.prototype.getPosition=function(b,
a,d){var c=this.chart,e=this.distance,h={},l=c.inverted&&d.h||0,g=this.outside,m=g?I.documentElement.clientWidth-2*e:c.chartWidth,f=g?Math.max(I.body.scrollHeight,I.documentElement.scrollHeight,I.body.offsetHeight,I.documentElement.offsetHeight,I.documentElement.clientHeight):c.chartHeight,k=c.pointer.getChartPosition(),p=function(h){var l="x"===h;return[h,l?m:f,l?b:a].concat(g?[l?b*k.scaleX:a*k.scaleY,l?k.left-e+(d.plotX+c.plotLeft)*k.scaleX:k.top-e+(d.plotY+c.plotTop)*k.scaleY,0,l?m:f]:[l?b:a,l?
d.plotX+c.plotLeft:d.plotY+c.plotTop,l?c.plotLeft:c.plotTop,l?c.plotLeft+c.plotWidth:c.plotTop+c.plotHeight])},n=p("y"),q=p("x"),z;p=!!d.negative;!c.polar&&c.hoverSeries&&c.hoverSeries.yAxis&&c.hoverSeries.yAxis.reversed&&(p=!p);var t=!this.followPointer&&x(d.ttBelow,!c.inverted===p),y=function(b,d,a,c,m,f,r){var v=g?"y"===b?e*k.scaleY:e*k.scaleX:e,D=(a-c)/2,G=c<m-e,p=m+e+c<d,n=m-v-a+D;m=m+v-D;if(t&&p)h[b]=m;else if(!t&&G)h[b]=n;else if(G)h[b]=Math.min(r-c,0>n-l?n:n-l);else if(p)h[b]=Math.max(f,m+
l+a>d?m:m+l);else return!1},F=function(b,d,a,c,l){var g;l<e||l>d-e?g=!1:h[b]=l<a/2?1:l>d-c/2?d-c-2:l-a/2;return g},G=function(b){var d=n;n=q;q=d;z=b},T=function(){!1!==y.apply(0,n)?!1!==F.apply(0,q)||z||(G(!0),T()):z?h.x=h.y=0:(G(!0),T())};(c.inverted||1<this.len)&&G();T();return h};a.prototype.hide=function(b){var a=this;w.clearTimeout(this.hideTimer);b=x(b,this.options.hideDelay);this.isHidden||(this.hideTimer=m(function(){a.getLabel().fadeOut(b?void 0:b);a.isHidden=!0},b))};a.prototype.init=function(b,
a){this.chart=b;this.options=a;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=!0;this.split=a.split&&!b.inverted&&!b.polar;this.shared=a.shared||this.split;this.outside=x(a.outside,!(!b.scrollablePixelsX&&!b.scrollablePixelsY))};a.prototype.shouldStickOnContact=function(){return!(this.followPointer||!this.options.stickOnContact)};a.prototype.isStickyOnContact=function(){return!(!this.shouldStickOnContact()||!this.inContact)};a.prototype.move=function(b,a,d,c){var e=this,h=e.now,l=!1!==e.options.animation&&
!e.isHidden&&(1<Math.abs(b-h.x)||1<Math.abs(a-h.y)),g=e.followPointer||1<e.len;p(h,{x:l?(2*h.x+b)/3:b,y:l?(h.y+a)/2:a,anchorX:g?void 0:l?(2*h.anchorX+d)/3:d,anchorY:g?void 0:l?(h.anchorY+c)/2:c});e.getLabel().attr(h);e.drawTracker();l&&(w.clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(function(){e&&e.move(b,a,d,c)},32))};a.prototype.refresh=function(b,a){var d=this.chart,c=this.options,e=z(b),h=e[0],l=[],m=c.formatter||this.defaultFormatter,f=this.shared,k=d.styledMode,p={};if(c.enabled&&
h.series){w.clearTimeout(this.hideTimer);this.allowShared=!(!t(b)&&b.series&&b.series.noSharedTooltip);this.followPointer=!this.split&&h.series.tooltipOptions.followPointer;b=this.getAnchor(b,a);var n=b[0],q=b[1];f&&this.allowShared?(d.pointer.applyInactiveState(e),e.forEach(function(b){b.setState("hover");l.push(b.getLabelConfig())}),p={x:h.category,y:h.y},p.points=l):p=h.getLabelConfig();this.len=l.length;m=m.call(p,this);f=h.series;this.distance=x(f.tooltipOptions.distance,16);if(!1===m)this.hide();
else{if(this.split&&this.allowShared)this.renderSplit(m,e);else{var y=n,F=q;a&&d.pointer.isDirectTouch&&(y=a.chartX-d.plotLeft,F=a.chartY-d.plotTop);if(d.polar||!1===f.options.clip||e.some(function(b){return b.series.shouldShowTooltip(y,F)}))a=this.getLabel(),c.style.width&&!k||a.css({width:this.chart.spacingBox.width+"px"}),a.attr({text:m&&m.join?m.join(""):m}),a.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-"+x(h.colorIndex,f.colorIndex)),k||a.attr({stroke:c.borderColor||h.color||
f.color||"#666666"}),this.updatePosition({plotX:n,plotY:q,negative:h.negative,ttBelow:h.ttBelow,h:b[2]||0});else{this.hide();return}}this.isHidden&&this.label&&this.label.attr({opacity:1}).show();this.isHidden=!1}g(this,"refresh")}};a.prototype.renderSplit=function(b,a){function d(b,d,a,e,h){void 0===h&&(h=!0);a?(d=Z?0:E,b=n(b-e/2,M.left,M.right-e-(c.outside?R:0))):(d-=B,b=h?b-e-C:b+C,b=n(b,h?b:M.left,M.right));return{x:b,y:d}}var c=this,e=c.chart,h=c.chart,l=h.chartWidth,g=h.chartHeight,m=h.plotHeight,
f=h.plotLeft,k=h.plotTop,q=h.pointer,z=h.scrollablePixelsY;z=void 0===z?0:z;var t=h.scrollablePixelsX,y=h.scrollingContainer;y=void 0===y?{scrollLeft:0,scrollTop:0}:y;var u=y.scrollLeft;y=y.scrollTop;var w=h.styledMode,C=c.distance,G=c.options,T=c.options.positioner,M=c.outside&&"number"!==typeof t?I.documentElement.getBoundingClientRect():{left:u,right:u+l,top:y,bottom:y+g},V=c.getLabel(),W=this.renderer||e.renderer,Z=!(!e.xAxis[0]||!e.xAxis[0].opposite);e=q.getChartPosition();var R=e.left;e=e.top;
var B=k+y,aa=0,E=m-z;F(b)&&(b=[!1,b]);b=b.slice(0,a.length+1).reduce(function(b,e,h){if(!1!==e&&""!==e){h=a[h-1]||{isHeader:!0,plotX:a[0].plotX,plotY:m,series:{}};var l=h.isHeader,g=l?c:h.series;e=e.toString();var r=g.tt,v=h.isHeader;var D=h.series;var p="highcharts-color-"+x(h.colorIndex,D.colorIndex,"none");r||(r={padding:G.padding,r:G.borderRadius},w||(r.fill=G.backgroundColor,r["stroke-width"]=G.borderWidth),r=W.label("",0,0,G[v?"headerShape":"shape"],void 0,void 0,G.useHTML).addClass((v?"highcharts-tooltip-header ":
"")+"highcharts-tooltip-box "+p).attr(r).add(V));r.isActive=!0;r.attr({text:e});w||r.css(G.style).shadow(G.shadow).attr({stroke:G.borderColor||h.color||D.color||"#333333"});g=g.tt=r;v=g.getBBox();e=v.width+g.strokeWidth();l&&(aa=v.height,E+=aa,Z&&(B-=aa));D=h.plotX;D=void 0===D?0:D;p=h.plotY;p=void 0===p?0:p;r=h.series;if(h.isHeader){D=f+D;var q=k+m/2}else{var z=r.xAxis,fa=r.yAxis;D=z.pos+n(D,-C,z.len+C);r.shouldShowTooltip(0,fa.pos-k+p,{ignoreX:!0})&&(q=fa.pos+p)}D=n(D,M.left-C,M.right+C);"number"===
typeof q?(v=v.height+1,p=T?T.call(c,e,v,h):d(D,q,l,e),b.push({align:T?0:void 0,anchorX:D,anchorY:q,boxWidth:e,point:h,rank:x(p.rank,l?1:0),size:v,target:p.y,tt:g,x:p.x})):g.isActive=!1}return b},[]);!T&&b.some(function(b){var d=(c.outside?R:0)+b.anchorX;return d<M.left&&d+b.boxWidth<M.right?!0:d<R-M.left+b.boxWidth&&M.right-d>d})&&(b=b.map(function(b){var a=d(b.anchorX,b.anchorY,b.point.isHeader,b.boxWidth,!1);return p(b,{target:a.y,x:a.x})}));c.cleanSplit();A(b,E);var H=R,ba=R;b.forEach(function(b){var d=
b.x,a=b.boxWidth;b=b.isHeader;b||(c.outside&&R+d<H&&(H=R+d),!b&&c.outside&&H+a>ba&&(ba=R+d))});b.forEach(function(b){var d=b.x,a=b.anchorX,e=b.pos,h=b.point.isHeader;e={visibility:"undefined"===typeof e?"hidden":"inherit",x:d,y:e+B,anchorX:a,anchorY:b.anchorY};if(c.outside&&d<a){var l=R-H;0<l&&(h||(e.x=d+l,e.anchorX=a+l),h&&(e.x=(ba-H)/2,e.anchorX=a+l))}b.tt.attr(e)});b=c.container;z=c.renderer;c.outside&&b&&z&&(h=V.getBBox(),z.setSize(h.width+h.x,h.height+h.y,!1),b.style.left=H+"px",b.style.top=
e+"px")};a.prototype.drawTracker=function(){if(this.followPointer||!this.options.stickOnContact)this.tracker&&this.tracker.destroy();else{var b=this.chart,a=this.label,d=this.shared?b.hoverPoints:b.hoverPoint;if(a&&d){var c={x:0,y:0,width:0,height:0};d=this.getAnchor(d);var e=a.getBBox();d[0]+=b.plotLeft-a.translateX;d[1]+=b.plotTop-a.translateY;c.x=Math.min(0,d[0]);c.y=Math.min(0,d[1]);c.width=0>d[0]?Math.max(Math.abs(d[0]),e.width-d[0]):Math.max(Math.abs(d[0]),e.width);c.height=0>d[1]?Math.max(Math.abs(d[1]),
e.height-Math.abs(d[1])):Math.max(Math.abs(d[1]),e.height);this.tracker?this.tracker.attr(c):(this.tracker=a.renderer.rect(c).addClass("highcharts-tracker").add(a),b.styledMode||this.tracker.attr({fill:"rgba(0,0,0,0)"}))}}};a.prototype.styledModeFormat=function(b){return b.replace('style="font-size: 10px"','class="highcharts-header"').replace(/style="color:{(point|series)\.color}"/g,'class="highcharts-color-{$1.colorIndex}"')};a.prototype.tooltipFooterHeaderFormatter=function(b,a){var d=b.series,
c=d.tooltipOptions,e=d.xAxis,h=e&&e.dateTime;e={isFooter:a,labelConfig:b};var l=c.xDateFormat,m=c[a?"footerFormat":"headerFormat"];g(this,"headerFormatter",e,function(a){h&&!l&&q(b.key)&&(l=h.getXDateFormat(b.key,c.dateTimeLabelFormats));h&&l&&(b.point&&b.point.tooltipDateKeys||["key"]).forEach(function(b){m=m.replace("{point."+b+"}","{point."+b+":"+l+"}")});d.chart.styledMode&&(m=this.styledModeFormat(m));a.text=C(m,{point:b,series:d},this.chart)});return e.text};a.prototype.update=function(b){this.destroy();
y(!0,this.chart.options.tooltip.userOptions,b);this.init(this.chart,y(!0,this.options,b))};a.prototype.updatePosition=function(b){var a=this.chart,d=this.options,c=a.pointer,e=this.getLabel();c=c.getChartPosition();var h=(d.positioner||this.getPosition).call(this,e.width,e.height,b),g=b.plotX+a.plotLeft;b=b.plotY+a.plotTop;if(this.outside){d=d.borderWidth+2*this.distance;this.renderer.setSize(e.width+d,e.height+d,!1);if(1!==c.scaleX||1!==c.scaleY)k(this.container,{transform:"scale("+c.scaleX+", "+
c.scaleY+")"}),g*=c.scaleX,b*=c.scaleY;g+=c.left-h.x;b+=c.top-h.y}this.move(Math.round(h.x),Math.round(h.y||0),g,b)};return a}();"";return a});K(f,"Core/Series/Point.js",[f["Core/Renderer/HTML/AST.js"],f["Core/Animation/AnimationUtilities.js"],f["Core/DefaultOptions.js"],f["Core/FormatUtilities.js"],f["Core/Utilities.js"]],function(a,f,B,H,w){var C=f.animObject,I=B.defaultOptions,A=H.format,u=w.addEvent,n=w.defined,k=w.erase,e=w.extend,c=w.fireEvent,p=w.getNestedProperty,g=w.isArray,t=w.isFunction,
q=w.isNumber,F=w.isObject,y=w.merge,x=w.objectEach,z=w.pick,m=w.syncTimeout,h=w.removeEvent,b=w.uniqueKey;f=function(){function l(){this.colorIndex=this.category=void 0;this.formatPrefix="point";this.id=void 0;this.isNull=!1;this.percentage=this.options=this.name=void 0;this.selected=!1;this.total=this.series=void 0;this.visible=!0;this.x=void 0}l.prototype.animateBeforeDestroy=function(){var b=this,a={x:b.startXPos,opacity:0},c=b.getGraphicalProps();c.singular.forEach(function(d){b[d]=b[d].animate("dataLabel"===
d?{x:b[d].startXPos,y:b[d].startYPos,opacity:0}:a)});c.plural.forEach(function(d){b[d].forEach(function(d){d.element&&d.animate(e({x:b.startXPos},d.startYPos?{x:d.startXPos,y:d.startYPos}:{}))})})};l.prototype.applyOptions=function(b,a){var d=this.series,c=d.options.pointValKey||d.pointValKey;b=l.prototype.optionsToObject.call(this,b);e(this,b);this.options=this.options?e(this.options,b):b;b.group&&delete this.group;b.dataLabels&&delete this.dataLabels;c&&(this.y=l.prototype.getNestedProperty.call(this,
c));this.formatPrefix=(this.isNull=z(this.isValid&&!this.isValid(),null===this.x||!q(this.y)))?"null":"point";this.selected&&(this.state="select");"name"in this&&"undefined"===typeof a&&d.xAxis&&d.xAxis.hasNames&&(this.x=d.xAxis.nameToX(this));"undefined"===typeof this.x&&d?this.x="undefined"===typeof a?d.autoIncrement():a:q(b.x)&&d.options.relativeXValue&&(this.x=d.autoIncrement(b.x));return this};l.prototype.destroy=function(){function b(){if(a.graphic||a.dataLabel||a.dataLabels)h(a),a.destroyElements();
for(f in a)a[f]=null}var a=this,c=a.series,e=c.chart;c=c.options.dataSorting;var l=e.hoverPoints,g=C(a.series.chart.renderer.globalAnimation),f;a.legendItem&&e.legend.destroyItem(a);l&&(a.setState(),k(l,a),l.length||(e.hoverPoints=null));if(a===e.hoverPoint)a.onMouseOut();c&&c.enabled?(this.animateBeforeDestroy(),m(b,g.duration)):b();e.pointCount--};l.prototype.destroyElements=function(b){var d=this;b=d.getGraphicalProps(b);b.singular.forEach(function(b){d[b]=d[b].destroy()});b.plural.forEach(function(b){d[b].forEach(function(b){b.element&&
b.destroy()});delete d[b]})};l.prototype.firePointEvent=function(b,a,e){var d=this,h=this.series.options;(h.point.events[b]||d.options&&d.options.events&&d.options.events[b])&&d.importEvents();"click"===b&&h.allowPointSelect&&(e=function(b){d.select&&d.select(null,b.ctrlKey||b.metaKey||b.shiftKey)});c(d,b,a,e)};l.prototype.getClassName=function(){return"highcharts-point"+(this.selected?" highcharts-point-select":"")+(this.negative?" highcharts-negative":"")+(this.isNull?" highcharts-null-point":"")+
("undefined"!==typeof this.colorIndex?" highcharts-color-"+this.colorIndex:"")+(this.options.className?" "+this.options.className:"")+(this.zone&&this.zone.className?" "+this.zone.className.replace("highcharts-negative",""):"")};l.prototype.getGraphicalProps=function(b){var d=this,a=[],c={singular:[],plural:[]},e;b=b||{graphic:1,dataLabel:1};b.graphic&&a.push("graphic","upperGraphic","shadowGroup");b.dataLabel&&a.push("dataLabel","dataLabelUpper","connector");for(e=a.length;e--;){var h=a[e];d[h]&&
c.singular.push(h)}["dataLabel","connector"].forEach(function(a){var e=a+"s";b[a]&&d[e]&&c.plural.push(e)});return c};l.prototype.getLabelConfig=function(){return{x:this.category,y:this.y,color:this.color,colorIndex:this.colorIndex,key:this.name||this.category,series:this.series,point:this,percentage:this.percentage,total:this.total||this.stackTotal}};l.prototype.getNestedProperty=function(b){if(b)return 0===b.indexOf("custom.")?p(b,this.options):this[b]};l.prototype.getZone=function(){var b=this.series,
a=b.zones;b=b.zoneAxis||"y";var c,e=0;for(c=a[e];this[b]>=c.value;)c=a[++e];this.nonZonedColor||(this.nonZonedColor=this.color);this.color=c&&c.color&&!this.options.color?c.color:this.nonZonedColor;return c};l.prototype.hasNewShapeType=function(){return(this.graphic&&(this.graphic.symbolName||this.graphic.element.nodeName))!==this.shapeType};l.prototype.init=function(d,a,e){this.series=d;this.applyOptions(a,e);this.id=n(this.id)?this.id:b();this.resolveColor();d.chart.pointCount++;c(this,"afterInit");
return this};l.prototype.optionsToObject=function(b){var d=this.series,a=d.options.keys,c=a||d.pointArrayMap||["y"],e=c.length,h={},m=0,f=0;if(q(b)||null===b)h[c[0]]=b;else if(g(b))for(!a&&b.length>e&&(d=typeof b[0],"string"===d?h.name=b[0]:"number"===d&&(h.x=b[0]),m++);f<e;)a&&"undefined"===typeof b[m]||(0<c[f].indexOf(".")?l.prototype.setNestedProperty(h,b[m],c[f]):h[c[f]]=b[m]),m++,f++;else"object"===typeof b&&(h=b,b.dataLabels&&(d._hasPointLabels=!0),b.marker&&(d._hasPointMarkers=!0));return h};
l.prototype.resolveColor=function(){var b=this.series,a=b.chart.styledMode;var c=b.chart.options.chart.colorCount;delete this.nonZonedColor;if(b.options.colorByPoint){if(!a){c=b.options.colors||b.chart.options.colors;var e=c[b.colorCounter];c=c.length}a=b.colorCounter;b.colorCounter++;b.colorCounter===c&&(b.colorCounter=0)}else a||(e=b.color),a=b.colorIndex;this.colorIndex=z(this.options.colorIndex,a);this.color=z(this.options.color,e)};l.prototype.setNestedProperty=function(b,a,c){c.split(".").reduce(function(b,
d,c,e){b[d]=e.length-1===c?a:F(b[d],!0)?b[d]:{};return b[d]},b);return b};l.prototype.tooltipFormatter=function(b){var d=this.series,a=d.tooltipOptions,c=z(a.valueDecimals,""),e=a.valuePrefix||"",h=a.valueSuffix||"";d.chart.styledMode&&(b=d.chart.tooltip.styledModeFormat(b));(d.pointArrayMap||["y"]).forEach(function(d){d="{point."+d;if(e||h)b=b.replace(RegExp(d+"}","g"),e+d+"}"+h);b=b.replace(RegExp(d+"}","g"),d+":,."+c+"f}")});return A(b,{point:this,series:this.series},d.chart)};l.prototype.update=
function(b,a,c,e){function d(){h.applyOptions(b);var d=g&&h.hasDummyGraphic;d=null===h.y?!d:d;g&&d&&(h.graphic=g.destroy(),delete h.hasDummyGraphic);F(b,!0)&&(g&&g.element&&b&&b.marker&&"undefined"!==typeof b.marker.symbol&&(h.graphic=g.destroy()),b&&b.dataLabels&&h.dataLabel&&(h.dataLabel=h.dataLabel.destroy()),h.connector&&(h.connector=h.connector.destroy()));k=h.index;l.updateParallelArrays(h,k);f.data[k]=F(f.data[k],!0)||F(b,!0)?h.options:z(b,f.data[k]);l.isDirty=l.isDirtyData=!0;!l.fixedBox&&
l.hasCartesianSeries&&(m.isDirtyBox=!0);"point"===f.legendType&&(m.isDirtyLegend=!0);a&&m.redraw(c)}var h=this,l=h.series,g=h.graphic,m=l.chart,f=l.options,k;a=z(a,!0);!1===e?d():h.firePointEvent("update",{options:b},d)};l.prototype.remove=function(b,a){this.series.removePoint(this.series.data.indexOf(this),b,a)};l.prototype.select=function(b,a){var d=this,c=d.series,e=c.chart;this.selectedStaging=b=z(b,!d.selected);d.firePointEvent(b?"select":"unselect",{accumulate:a},function(){d.selected=d.options.selected=
b;c.options.data[c.data.indexOf(d)]=d.options;d.setState(b&&"select");a||e.getSelectedPoints().forEach(function(b){var a=b.series;b.selected&&b!==d&&(b.selected=b.options.selected=!1,a.options.data[a.data.indexOf(b)]=b.options,b.setState(e.hoverPoints&&a.options.inactiveOtherPoints?"inactive":""),b.firePointEvent("unselect"))})});delete this.selectedStaging};l.prototype.onMouseOver=function(b){var d=this.series.chart,a=d.pointer;b=b?a.normalize(b):a.getChartCoordinatesFromPoint(this,d.inverted);a.runPointActions(b,
this)};l.prototype.onMouseOut=function(){var b=this.series.chart;this.firePointEvent("mouseOut");this.series.options.inactiveOtherPoints||(b.hoverPoints||[]).forEach(function(b){b.setState()});b.hoverPoints=b.hoverPoint=null};l.prototype.importEvents=function(){if(!this.hasImportedEvents){var b=this,a=y(b.series.options.point,b.options).events;b.events=a;x(a,function(d,a){t(d)&&u(b,a,d)});this.hasImportedEvents=!0}};l.prototype.setState=function(b,h){var d=this.series,l=this.state,g=d.options.states[b||
"normal"]||{},m=I.plotOptions[d.type].marker&&d.options.marker,f=m&&!1===m.enabled,k=m&&m.states&&m.states[b||"normal"]||{},p=!1===k.enabled,n=this.marker||{},D=d.chart,y=m&&d.markerAttribs,t=d.halo,x,F=d.stateMarkerGraphic;b=b||"";if(!(b===this.state&&!h||this.selected&&"select"!==b||!1===g.enabled||b&&(p||f&&!1===k.enabled)||b&&n.states&&n.states[b]&&!1===n.states[b].enabled)){this.state=b;y&&(x=d.markerAttribs(this,b));if(this.graphic&&!this.hasDummyGraphic){l&&this.graphic.removeClass("highcharts-point-"+
l);b&&this.graphic.addClass("highcharts-point-"+b);if(!D.styledMode){var u=d.pointAttribs(this,b);var G=z(D.options.chart.animation,g.animation);d.options.inactiveOtherPoints&&q(u.opacity)&&((this.dataLabels||[]).forEach(function(b){b&&b.animate({opacity:u.opacity},G)}),this.connector&&this.connector.animate({opacity:u.opacity},G));this.graphic.animate(u,G)}x&&this.graphic.animate(x,z(D.options.chart.animation,k.animation,m.animation));F&&F.hide()}else{if(b&&k){l=n.symbol||d.symbol;F&&F.currentSymbol!==
l&&(F=F.destroy());if(x)if(F)F[h?"animate":"attr"]({x:x.x,y:x.y});else l&&(d.stateMarkerGraphic=F=D.renderer.symbol(l,x.x,x.y,x.width,x.height).add(d.markerGroup),F.currentSymbol=l);!D.styledMode&&F&&"inactive"!==this.state&&F.attr(d.pointAttribs(this,b))}F&&(F[b&&this.isInside?"show":"hide"](),F.element.point=this,F.addClass(this.getClassName(),!0))}g=g.halo;x=(F=this.graphic||F)&&F.visibility||"inherit";g&&g.size&&F&&"hidden"!==x&&!this.isCluster?(t||(d.halo=t=D.renderer.path().add(F.parentGroup)),
t.show()[h?"animate":"attr"]({d:this.haloPath(g.size)}),t.attr({"class":"highcharts-halo highcharts-color-"+z(this.colorIndex,d.colorIndex)+(this.className?" "+this.className:""),visibility:x,zIndex:-1}),t.point=this,D.styledMode||t.attr(e({fill:this.color||d.color,"fill-opacity":g.opacity},a.filterUserAttributes(g.attributes||{})))):t&&t.point&&t.point.haloPath&&t.animate({d:t.point.haloPath(0)},null,t.hide);c(this,"afterSetState",{state:b})}};l.prototype.haloPath=function(b){return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX)-
b,this.plotY-b,2*b,2*b)};return l}();"";return f});K(f,"Core/Pointer.js",[f["Core/Color/Color.js"],f["Core/Globals.js"],f["Core/Tooltip.js"],f["Core/Utilities.js"]],function(a,f,B,H){var w=a.parse,C=f.charts,I=f.noop,A=H.addEvent,u=H.attr,n=H.css,k=H.defined,e=H.extend,c=H.find,p=H.fireEvent,g=H.isNumber,t=H.isObject,q=H.objectEach,F=H.offset,y=H.pick,x=H.splat;a=function(){function a(a,c){this.lastValidTouch={};this.pinchDown=[];this.runChartClick=!1;this.eventsToUnbind=[];this.chart=a;this.hasDragged=
!1;this.options=c;this.init(a,c)}a.prototype.applyInactiveState=function(a){var c=[],b;(a||[]).forEach(function(a){b=a.series;c.push(b);b.linkedParent&&c.push(b.linkedParent);b.linkedSeries&&(c=c.concat(b.linkedSeries));b.navigatorSeries&&c.push(b.navigatorSeries)});this.chart.series.forEach(function(b){-1===c.indexOf(b)?b.setState("inactive",!0):b.options.inactiveOtherPoints&&b.setAllPointsToState("inactive")})};a.prototype.destroy=function(){var c=this;this.eventsToUnbind.forEach(function(a){return a()});
this.eventsToUnbind=[];f.chartCount||(a.unbindDocumentMouseUp&&(a.unbindDocumentMouseUp=a.unbindDocumentMouseUp()),a.unbindDocumentTouchEnd&&(a.unbindDocumentTouchEnd=a.unbindDocumentTouchEnd()));clearInterval(c.tooltipTimeout);q(c,function(a,b){c[b]=void 0})};a.prototype.drag=function(a){var c=this.chart,b=c.options.chart,e=this.zoomHor,d=this.zoomVert,g=c.plotLeft,m=c.plotTop,f=c.plotWidth,k=c.plotHeight,p=this.mouseDownX||0,n=this.mouseDownY||0,q=t(b.panning)?b.panning&&b.panning.enabled:b.panning,
y=b.panKey&&a[b.panKey+"Key"],x=a.chartX,z=a.chartY,F=this.selectionMarker;if(!F||!F.touch)if(x<g?x=g:x>g+f&&(x=g+f),z<m?z=m:z>m+k&&(z=m+k),this.hasDragged=Math.sqrt(Math.pow(p-x,2)+Math.pow(n-z,2)),10<this.hasDragged){var u=c.isInsidePlot(p-g,n-m,{visiblePlotOnly:!0});!c.hasCartesianSeries&&!c.mapView||!this.zoomX&&!this.zoomY||!u||y||F||(this.selectionMarker=F=c.renderer.rect(g,m,e?1:f,d?1:k,0).attr({"class":"highcharts-selection-marker",zIndex:7}).add(),c.styledMode||F.attr({fill:b.selectionMarkerFill||
w("#335cad").setOpacity(.25).get()}));F&&e&&(e=x-p,F.attr({width:Math.abs(e),x:(0<e?0:e)+p}));F&&d&&(e=z-n,F.attr({height:Math.abs(e),y:(0<e?0:e)+n}));u&&!F&&q&&c.pan(a,b.panning)}};a.prototype.dragStart=function(a){var c=this.chart;c.mouseIsDown=a.type;c.cancelClick=!1;c.mouseDownX=this.mouseDownX=a.chartX;c.mouseDownY=this.mouseDownY=a.chartY};a.prototype.drop=function(a){var c=this,b=this.chart,l=this.hasPinched;if(this.selectionMarker){var d=this.selectionMarker,m=d.attr?d.attr("x"):d.x,f=d.attr?
d.attr("y"):d.y,r=d.attr?d.attr("width"):d.width,q=d.attr?d.attr("height"):d.height,t={originalEvent:a,xAxis:[],yAxis:[],x:m,y:f,width:r,height:q},y=!!b.mapView;if(this.hasDragged||l)b.axes.forEach(function(b){if(b.zoomEnabled&&k(b.min)&&(l||c[{xAxis:"zoomX",yAxis:"zoomY"}[b.coll]])&&g(m)&&g(f)){var d=b.horiz,e="touchend"===a.type?b.minPixelPadding:0,h=b.toValue((d?m:f)+e);d=b.toValue((d?m+r:f+q)-e);t[b.coll].push({axis:b,min:Math.min(h,d),max:Math.max(h,d)});y=!0}}),y&&p(b,"selection",t,function(d){b.zoom(e(d,
l?{animation:!1}:null))});g(b.index)&&(this.selectionMarker=this.selectionMarker.destroy());l&&this.scaleGroups()}b&&g(b.index)&&(n(b.container,{cursor:b._cursor}),b.cancelClick=10<this.hasDragged,b.mouseIsDown=this.hasDragged=this.hasPinched=!1,this.pinchDown=[])};a.prototype.findNearestKDPoint=function(a,c,b){var e=this.chart,d=e.hoverPoint;e=e.tooltip;if(d&&e&&e.isStickyOnContact())return d;var h;a.forEach(function(d){var a=!(d.noSharedTooltip&&c)&&0>d.options.findNearestPointBy.indexOf("y");d=
d.searchPoint(b,a);if((a=t(d,!0)&&d.series)&&!(a=!t(h,!0))){a=h.distX-d.distX;var e=h.dist-d.dist,l=(d.series.group&&d.series.group.zIndex)-(h.series.group&&h.series.group.zIndex);a=0<(0!==a&&c?a:0!==e?e:0!==l?l:h.series.index>d.series.index?-1:1)}a&&(h=d)});return h};a.prototype.getChartCoordinatesFromPoint=function(a,c){var b=a.series,e=b.xAxis;b=b.yAxis;var d=a.shapeArgs;if(e&&b){var h=y(a.clientX,a.plotX),m=a.plotY||0;a.isNode&&d&&g(d.x)&&g(d.y)&&(h=d.x,m=d.y);return c?{chartX:b.len+b.pos-m,chartY:e.len+
e.pos-h}:{chartX:h+e.pos,chartY:m+b.pos}}if(d&&d.x&&d.y)return{chartX:d.x,chartY:d.y}};a.prototype.getChartPosition=function(){if(this.chartPosition)return this.chartPosition;var a=this.chart.container,c=F(a);this.chartPosition={left:c.left,top:c.top,scaleX:1,scaleY:1};var b=a.offsetWidth;a=a.offsetHeight;2<b&&2<a&&(this.chartPosition.scaleX=c.width/b,this.chartPosition.scaleY=c.height/a);return this.chartPosition};a.prototype.getCoordinates=function(a){var c={xAxis:[],yAxis:[]};this.chart.axes.forEach(function(b){c[b.isXAxis?
"xAxis":"yAxis"].push({axis:b,value:b.toValue(a[b.horiz?"chartX":"chartY"])})});return c};a.prototype.getHoverData=function(a,e,b,l,d,g){var h=[];l=!(!l||!a);var m={chartX:g?g.chartX:void 0,chartY:g?g.chartY:void 0,shared:d};p(this,"beforeGetHoverData",m);var f=e&&!e.stickyTracking?[e]:b.filter(function(b){return m.filter?m.filter(b):b.visible&&!(!d&&b.directTouch)&&y(b.options.enableMouseTracking,!0)&&b.stickyTracking});var k=l||!g?a:this.findNearestKDPoint(f,d,g);e=k&&k.series;k&&(d&&!e.noSharedTooltip?
(f=b.filter(function(b){return m.filter?m.filter(b):b.visible&&!(!d&&b.directTouch)&&y(b.options.enableMouseTracking,!0)&&!b.noSharedTooltip}),f.forEach(function(b){var d=c(b.points,function(b){return b.x===k.x&&!b.isNull});t(d)&&(b.chart.isBoosting&&(d=b.getPoint(d)),h.push(d))})):h.push(k));m={hoverPoint:k};p(this,"afterGetHoverData",m);return{hoverPoint:m.hoverPoint,hoverSeries:e,hoverPoints:h}};a.prototype.getPointFromEvent=function(a){a=a.target;for(var c;a&&!c;)c=a.point,a=a.parentNode;return c};
a.prototype.onTrackerMouseOut=function(a){a=a.relatedTarget||a.toElement;var c=this.chart.hoverSeries;this.isDirectTouch=!1;if(!(!c||!a||c.stickyTracking||this.inClass(a,"highcharts-tooltip")||this.inClass(a,"highcharts-series-"+c.index)&&this.inClass(a,"highcharts-tracker")))c.onMouseOut()};a.prototype.inClass=function(a,c){for(var b;a;){if(b=u(a,"class")){if(-1!==b.indexOf(c))return!0;if(-1!==b.indexOf("highcharts-container"))return!1}a=a.parentElement}};a.prototype.init=function(a,c){this.options=
c;this.chart=a;this.runChartClick=!(!c.chart.events||!c.chart.events.click);this.pinchDown=[];this.lastValidTouch={};B&&(a.tooltip=new B(a,c.tooltip),this.followTouchMove=y(c.tooltip.followTouchMove,!0));this.setDOMEvents()};a.prototype.normalize=function(a,c){var b=a.touches,h=b?b.length?b.item(0):y(b.changedTouches,a.changedTouches)[0]:a;c||(c=this.getChartPosition());b=h.pageX-c.left;h=h.pageY-c.top;b/=c.scaleX;h/=c.scaleY;return e(a,{chartX:Math.round(b),chartY:Math.round(h)})};a.prototype.onContainerClick=
function(a){var c=this.chart,b=c.hoverPoint;a=this.normalize(a);var l=c.plotLeft,d=c.plotTop;c.cancelClick||(b&&this.inClass(a.target,"highcharts-tracker")?(p(b.series,"click",e(a,{point:b})),c.hoverPoint&&b.firePointEvent("click",a)):(e(a,this.getCoordinates(a)),c.isInsidePlot(a.chartX-l,a.chartY-d,{visiblePlotOnly:!0})&&p(c,"click",a)))};a.prototype.onContainerMouseDown=function(a){var c=1===((a.buttons||a.button)&1);a=this.normalize(a);if(f.isFirefox&&0!==a.button)this.onContainerMouseMove(a);
if("undefined"===typeof a.button||c)this.zoomOption(a),c&&a.preventDefault&&a.preventDefault(),this.dragStart(a)};a.prototype.onContainerMouseLeave=function(c){var e=C[y(a.hoverChartIndex,-1)],b=this.chart.tooltip;b&&b.shouldStickOnContact()&&this.inClass(c.relatedTarget,"highcharts-tooltip-container")||(c=this.normalize(c),e&&(c.relatedTarget||c.toElement)&&(e.pointer.reset(),e.pointer.chartPosition=void 0),b&&!b.isHidden&&this.reset())};a.prototype.onContainerMouseEnter=function(a){delete this.chartPosition};
a.prototype.onContainerMouseMove=function(a){var c=this.chart;a=this.normalize(a);this.setHoverChartIndex();a.preventDefault||(a.returnValue=!1);("mousedown"===c.mouseIsDown||this.touchSelect(a))&&this.drag(a);c.openMenu||!this.inClass(a.target,"highcharts-tracker")&&!c.isInsidePlot(a.chartX-c.plotLeft,a.chartY-c.plotTop,{visiblePlotOnly:!0})||(this.inClass(a.target,"highcharts-no-tooltip")?this.reset(!1,0):this.runPointActions(a))};a.prototype.onDocumentTouchEnd=function(c){var e=C[y(a.hoverChartIndex,
-1)];e&&e.pointer.drop(c)};a.prototype.onContainerTouchMove=function(a){if(this.touchSelect(a))this.onContainerMouseMove(a);else this.touch(a)};a.prototype.onContainerTouchStart=function(a){if(this.touchSelect(a))this.onContainerMouseDown(a);else this.zoomOption(a),this.touch(a,!0)};a.prototype.onDocumentMouseMove=function(a){var c=this.chart,b=this.chartPosition;a=this.normalize(a,b);var e=c.tooltip;!b||e&&e.isStickyOnContact()||c.isInsidePlot(a.chartX-c.plotLeft,a.chartY-c.plotTop,{visiblePlotOnly:!0})||
this.inClass(a.target,"highcharts-tracker")||this.reset()};a.prototype.onDocumentMouseUp=function(c){var e=C[y(a.hoverChartIndex,-1)];e&&e.pointer.drop(c)};a.prototype.pinch=function(a){var c=this,b=c.chart,l=c.pinchDown,d=a.touches||[],g=d.length,f=c.lastValidTouch,k=c.hasZoom,m={},n=1===g&&(c.inClass(a.target,"highcharts-tracker")&&b.runTrackerClick||c.runChartClick),q={},t=c.selectionMarker;1<g?c.initiated=!0:1===g&&this.followTouchMove&&(c.initiated=!1);k&&c.initiated&&!n&&!1!==a.cancelable&&
a.preventDefault();[].map.call(d,function(b){return c.normalize(b)});"touchstart"===a.type?([].forEach.call(d,function(b,a){l[a]={chartX:b.chartX,chartY:b.chartY}}),f.x=[l[0].chartX,l[1]&&l[1].chartX],f.y=[l[0].chartY,l[1]&&l[1].chartY],b.axes.forEach(function(a){if(a.zoomEnabled){var d=b.bounds[a.horiz?"h":"v"],c=a.minPixelPadding,e=a.toPixels(Math.min(y(a.options.min,a.dataMin),a.dataMin)),h=a.toPixels(Math.max(y(a.options.max,a.dataMax),a.dataMax)),l=Math.max(e,h);d.min=Math.min(a.pos,Math.min(e,
h)-c);d.max=Math.max(a.pos+a.len,l+c)}}),c.res=!0):c.followTouchMove&&1===g?this.runPointActions(c.normalize(a)):l.length&&(p(b,"touchpan",{originalEvent:a},function(){t||(c.selectionMarker=t=e({destroy:I,touch:!0},b.plotBox));c.pinchTranslate(l,d,m,t,q,f);c.hasPinched=k;c.scaleGroups(m,q)}),c.res&&(c.res=!1,this.reset(!1,0)))};a.prototype.pinchTranslate=function(a,c,b,e,d,g){this.zoomHor&&this.pinchTranslateDirection(!0,a,c,b,e,d,g);this.zoomVert&&this.pinchTranslateDirection(!1,a,c,b,e,d,g)};a.prototype.pinchTranslateDirection=
function(a,c,b,e,d,g,f,k){var h=this.chart,l=a?"x":"y",m=a?"X":"Y",r="chart"+m,p=a?"width":"height",n=h["plot"+(a?"Left":"Top")],q=h.inverted,v=h.bounds[a?"h":"v"],D=1===c.length,t=c[0][r],y=!D&&c[1][r];c=function(){"number"===typeof F&&20<Math.abs(t-y)&&(z=k||Math.abs(M-F)/Math.abs(t-y));G=(n-M)/z+t;x=h["plot"+(a?"Width":"Height")]/z};var x,G,z=k||1,M=b[0][r],F=!D&&b[1][r];c();b=G;if(b<v.min){b=v.min;var u=!0}else b+x>v.max&&(b=v.max-x,u=!0);u?(M-=.8*(M-f[l][0]),"number"===typeof F&&(F-=.8*(F-f[l][1])),
c()):f[l]=[M,F];q||(g[l]=G-n,g[p]=x);g=q?1/z:z;d[p]=x;d[l]=b;e[q?a?"scaleY":"scaleX":"scale"+m]=z;e["translate"+m]=g*n+(M-g*t)};a.prototype.reset=function(a,c){var b=this.chart,e=b.hoverSeries,d=b.hoverPoint,h=b.hoverPoints,g=b.tooltip,f=g&&g.shared?h:d;a&&f&&x(f).forEach(function(b){b.series.isCartesian&&"undefined"===typeof b.plotX&&(a=!1)});if(a)g&&f&&x(f).length&&(g.refresh(f),g.shared&&h?h.forEach(function(b){b.setState(b.state,!0);b.series.isCartesian&&(b.series.xAxis.crosshair&&b.series.xAxis.drawCrosshair(null,
b),b.series.yAxis.crosshair&&b.series.yAxis.drawCrosshair(null,b))}):d&&(d.setState(d.state,!0),b.axes.forEach(function(b){b.crosshair&&d.series[b.coll]===b&&b.drawCrosshair(null,d)})));else{if(d)d.onMouseOut();h&&h.forEach(function(b){b.setState()});if(e)e.onMouseOut();g&&g.hide(c);this.unDocMouseMove&&(this.unDocMouseMove=this.unDocMouseMove());b.axes.forEach(function(b){b.hideCrosshair()});this.hoverX=b.hoverPoints=b.hoverPoint=null}};a.prototype.runPointActions=function(e,h){var b=this.chart,
g=b.tooltip&&b.tooltip.options.enabled?b.tooltip:void 0,d=g?g.shared:!1,f=h||b.hoverPoint,k=f&&f.series||b.hoverSeries;h=this.getHoverData(f,k,b.series,(!e||"touchmove"!==e.type)&&(!!h||k&&k.directTouch&&this.isDirectTouch),d,e);f=h.hoverPoint;k=h.hoverSeries;var m=h.hoverPoints;h=k&&k.tooltipOptions.followPointer&&!k.tooltipOptions.split;var p=d&&k&&!k.noSharedTooltip;if(f&&(f!==b.hoverPoint||g&&g.isHidden)){(b.hoverPoints||[]).forEach(function(b){-1===m.indexOf(b)&&b.setState()});if(b.hoverSeries!==
k)k.onMouseOver();this.applyInactiveState(m);(m||[]).forEach(function(b){b.setState("hover")});b.hoverPoint&&b.hoverPoint.firePointEvent("mouseOut");if(!f.series)return;b.hoverPoints=m;b.hoverPoint=f;f.firePointEvent("mouseOver",void 0,function(){g&&f&&g.refresh(p?m:f,e)})}else h&&g&&!g.isHidden&&(d=g.getAnchor([{}],e),b.isInsidePlot(d[0],d[1],{visiblePlotOnly:!0})&&g.updatePosition({plotX:d[0],plotY:d[1]}));this.unDocMouseMove||(this.unDocMouseMove=A(b.container.ownerDocument,"mousemove",function(b){var d=
C[a.hoverChartIndex];if(d)d.pointer.onDocumentMouseMove(b)}),this.eventsToUnbind.push(this.unDocMouseMove));b.axes.forEach(function(a){var d=y((a.crosshair||{}).snap,!0),h;d&&((h=b.hoverPoint)&&h.series[a.coll]===a||(h=c(m,function(b){return b.series&&b.series[a.coll]===a})));h||!d?a.drawCrosshair(e,h):a.hideCrosshair()})};a.prototype.scaleGroups=function(a,c){var b=this.chart;b.series.forEach(function(e){var d=a||e.getPlotBox();e.group&&(e.xAxis&&e.xAxis.zoomEnabled||b.mapView)&&(e.group.attr(d),
e.markerGroup&&(e.markerGroup.attr(d),e.markerGroup.clip(c?b.clipRect:null)),e.dataLabelsGroup&&e.dataLabelsGroup.attr(d))});b.clipRect.attr(c||b.clipBox)};a.prototype.setDOMEvents=function(){var c=this,e=this.chart.container,b=e.ownerDocument;e.onmousedown=this.onContainerMouseDown.bind(this);e.onmousemove=this.onContainerMouseMove.bind(this);e.onclick=this.onContainerClick.bind(this);this.eventsToUnbind.push(A(e,"mouseenter",this.onContainerMouseEnter.bind(this)));this.eventsToUnbind.push(A(e,"mouseleave",
this.onContainerMouseLeave.bind(this)));a.unbindDocumentMouseUp||(a.unbindDocumentMouseUp=A(b,"mouseup",this.onDocumentMouseUp.bind(this)));for(var g=this.chart.renderTo.parentElement;g&&"BODY"!==g.tagName;)this.eventsToUnbind.push(A(g,"scroll",function(){delete c.chartPosition})),g=g.parentElement;f.hasTouch&&(this.eventsToUnbind.push(A(e,"touchstart",this.onContainerTouchStart.bind(this),{passive:!1})),this.eventsToUnbind.push(A(e,"touchmove",this.onContainerTouchMove.bind(this),{passive:!1})),
a.unbindDocumentTouchEnd||(a.unbindDocumentTouchEnd=A(b,"touchend",this.onDocumentTouchEnd.bind(this),{passive:!1})))};a.prototype.setHoverChartIndex=function(){var c=this.chart,e=f.charts[y(a.hoverChartIndex,-1)];if(e&&e!==c)e.pointer.onContainerMouseLeave({relatedTarget:c.container});e&&e.mouseIsDown||(a.hoverChartIndex=c.index)};a.prototype.touch=function(a,c){var b=this.chart,e;this.setHoverChartIndex();if(1===a.touches.length)if(a=this.normalize(a),(e=b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-
b.plotTop,{visiblePlotOnly:!0}))&&!b.openMenu){c&&this.runPointActions(a);if("touchmove"===a.type){c=this.pinchDown;var d=c[0]?4<=Math.sqrt(Math.pow(c[0].chartX-a.chartX,2)+Math.pow(c[0].chartY-a.chartY,2)):!1}y(d,!0)&&this.pinch(a)}else c&&this.reset();else 2===a.touches.length&&this.pinch(a)};a.prototype.touchSelect=function(a){return!(!this.chart.options.chart.zoomBySingleTouch||!a.touches||1!==a.touches.length)};a.prototype.zoomOption=function(a){var c=this.chart,b=c.options.chart;c=c.inverted;
var e=b.zoomType||"";/touch/.test(a.type)&&(e=y(b.pinchType,e));this.zoomX=a=/x/.test(e);this.zoomY=b=/y/.test(e);this.zoomHor=a&&!c||b&&c;this.zoomVert=b&&!c||a&&c;this.hasZoom=a||b};return a}();"";return a});K(f,"Core/MSPointer.js",[f["Core/Globals.js"],f["Core/Pointer.js"],f["Core/Utilities.js"]],function(a,f,B){function C(){var a=[];a.item=function(a){return this[a]};c(g,function(c){a.push({pageX:c.pageX,pageY:c.pageY,target:c.target})});return a}function w(a,c,e,g){var k=I[f.hoverChartIndex||
NaN];"touch"!==a.pointerType&&a.pointerType!==a.MSPOINTER_TYPE_TOUCH||!k||(k=k.pointer,g(a),k[c]({type:e,target:a.currentTarget,preventDefault:u,touches:C()}))}var E=this&&this.__extends||function(){var a=function(c,e){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,c){a.__proto__=c}||function(a,c){for(var e in c)c.hasOwnProperty(e)&&(a[e]=c[e])};return a(c,e)};return function(c,e){function g(){this.constructor=c}a(c,e);c.prototype=null===e?Object.create(e):(g.prototype=e.prototype,
new g)}}(),I=a.charts,A=a.doc,u=a.noop,n=a.win,k=B.addEvent,e=B.css,c=B.objectEach,p=B.removeEvent,g={},t=!!n.PointerEvent;return function(c){function f(){return null!==c&&c.apply(this,arguments)||this}E(f,c);f.isRequired=function(){return!(a.hasTouch||!n.PointerEvent&&!n.MSPointerEvent)};f.prototype.batchMSEvents=function(a){a(this.chart.container,t?"pointerdown":"MSPointerDown",this.onContainerPointerDown);a(this.chart.container,t?"pointermove":"MSPointerMove",this.onContainerPointerMove);a(A,t?
"pointerup":"MSPointerUp",this.onDocumentPointerUp)};f.prototype.destroy=function(){this.batchMSEvents(p);c.prototype.destroy.call(this)};f.prototype.init=function(a,g){c.prototype.init.call(this,a,g);this.hasZoom&&e(a.container,{"-ms-touch-action":"none","touch-action":"none"})};f.prototype.onContainerPointerDown=function(a){w(a,"onContainerTouchStart","touchstart",function(a){g[a.pointerId]={pageX:a.pageX,pageY:a.pageY,target:a.currentTarget}})};f.prototype.onContainerPointerMove=function(a){w(a,
"onContainerTouchMove","touchmove",function(a){g[a.pointerId]={pageX:a.pageX,pageY:a.pageY};g[a.pointerId].target||(g[a.pointerId].target=a.currentTarget)})};f.prototype.onDocumentPointerUp=function(a){w(a,"onDocumentTouchEnd","touchend",function(a){delete g[a.pointerId]})};f.prototype.setDOMEvents=function(){c.prototype.setDOMEvents.call(this);(this.hasZoom||this.followTouchMove)&&this.batchMSEvents(k)};return f}(f)});K(f,"Core/Legend/Legend.js",[f["Core/Animation/AnimationUtilities.js"],f["Core/FormatUtilities.js"],
f["Core/Globals.js"],f["Core/Series/Point.js"],f["Core/Renderer/RendererUtilities.js"],f["Core/Utilities.js"]],function(a,f,B,H,w,E){var C=a.animObject,A=a.setAnimation,u=f.format;a=B.isFirefox;var n=B.marginNames;B=B.win;var k=w.distribute,e=E.addEvent,c=E.createElement,p=E.css,g=E.defined,t=E.discardElement,q=E.find,F=E.fireEvent,y=E.isNumber,x=E.merge,z=E.pick,m=E.relativeLength,h=E.stableSort,b=E.syncTimeout;w=E.wrap;E=function(){function a(b,a){this.allItems=[];this.contentGroup=this.box=void 0;
this.display=!1;this.group=void 0;this.offsetWidth=this.maxLegendWidth=this.maxItemWidth=this.legendWidth=this.legendHeight=this.lastLineHeight=this.lastItemY=this.itemY=this.itemX=this.itemMarginTop=this.itemMarginBottom=this.itemHeight=this.initialItemY=0;this.options=void 0;this.padding=0;this.pages=[];this.proximate=!1;this.scrollGroup=void 0;this.widthOption=this.totalItemWidth=this.titleHeight=this.symbolWidth=this.symbolHeight=0;this.chart=b;this.init(b,a)}a.prototype.init=function(b,a){this.chart=
b;this.setOptions(a);a.enabled&&(this.render(),e(this.chart,"endResize",function(){this.legend.positionCheckboxes()}),this.proximate?this.unchartrender=e(this.chart,"render",function(){this.legend.proximatePositions();this.legend.positionItems()}):this.unchartrender&&this.unchartrender())};a.prototype.setOptions=function(b){var a=z(b.padding,8);this.options=b;this.chart.styledMode||(this.itemStyle=b.itemStyle,this.itemHiddenStyle=x(this.itemStyle,b.itemHiddenStyle));this.itemMarginTop=b.itemMarginTop||
0;this.itemMarginBottom=b.itemMarginBottom||0;this.padding=a;this.initialItemY=a-5;this.symbolWidth=z(b.symbolWidth,16);this.pages=[];this.proximate="proximate"===b.layout&&!this.chart.inverted;this.baseline=void 0};a.prototype.update=function(b,a){var d=this.chart;this.setOptions(x(!0,this.options,b));this.destroy();d.isDirtyLegend=d.isDirtyBox=!0;z(a,!0)&&d.redraw();F(this,"afterUpdate")};a.prototype.colorizeItem=function(b,a){b.legendGroup[a?"removeClass":"addClass"]("highcharts-legend-item-hidden");
if(!this.chart.styledMode){var d=this.options,c=b.legendItem,e=b.legendLine,h=b.legendSymbol,g=this.itemHiddenStyle.color;d=a?d.itemStyle.color:g;var l=a?b.color||g:g,f=b.options&&b.options.marker,k={fill:l};c&&c.css({fill:d,color:d});e&&e.attr({stroke:l});h&&(f&&h.isMarker&&(k=b.pointAttribs(),a||(k.stroke=k.fill=g)),h.attr(k))}F(this,"afterColorizeItem",{item:b,visible:a})};a.prototype.positionItems=function(){this.allItems.forEach(this.positionItem,this);this.chart.isResizing||this.positionCheckboxes()};
a.prototype.positionItem=function(b){var a=this,d=this.options,c=d.symbolPadding,e=!d.rtl,h=b._legendItemPos;d=h[0];h=h[1];var l=b.checkbox,f=b.legendGroup;f&&f.element&&(c={translateX:e?d:this.legendWidth-d-2*c-4,translateY:h},e=function(){F(a,"afterPositionItem",{item:b})},g(f.translateY)?f.animate(c,void 0,e):(f.attr(c),e()));l&&(l.x=d,l.y=h)};a.prototype.destroyItem=function(b){var a=b.checkbox;["legendItem","legendLine","legendSymbol","legendGroup"].forEach(function(a){b[a]&&(b[a]=b[a].destroy())});
a&&t(b.checkbox)};a.prototype.destroy=function(){function b(b){this[b]&&(this[b]=this[b].destroy())}this.getAllItems().forEach(function(a){["legendItem","legendGroup"].forEach(b,a)});"clipRect up down pager nav box title group".split(" ").forEach(b,this);this.display=null};a.prototype.positionCheckboxes=function(){var b=this.group&&this.group.alignAttr,a=this.clipHeight||this.legendHeight,c=this.titleHeight;if(b){var e=b.translateY;this.allItems.forEach(function(d){var h=d.checkbox;if(h){var g=e+
c+h.y+(this.scrollOffset||0)+3;p(h,{left:b.translateX+d.checkboxOffset+h.x-20+"px",top:g+"px",display:this.proximate||g>e-6&&g<e+a-6?"":"none"})}},this)}};a.prototype.renderTitle=function(){var b=this.options,a=this.padding,c=b.title,e=0;c.text&&(this.title||(this.title=this.chart.renderer.label(c.text,a-3,a-4,void 0,void 0,void 0,b.useHTML,void 0,"legend-title").attr({zIndex:1}),this.chart.styledMode||this.title.css(c.style),this.title.add(this.group)),c.width||this.title.css({width:this.maxLegendWidth+
"px"}),b=this.title.getBBox(),e=b.height,this.offsetWidth=b.width,this.contentGroup.attr({translateY:e}));this.titleHeight=e};a.prototype.setText=function(b){var a=this.options;b.legendItem.attr({text:a.labelFormat?u(a.labelFormat,b,this.chart):a.labelFormatter.call(b)})};a.prototype.renderItem=function(b){var a=this.chart,d=a.renderer,c=this.options,e=this.symbolWidth,h=c.symbolPadding||0,g=this.itemStyle,l=this.itemHiddenStyle,f="horizontal"===c.layout?z(c.itemDistance,20):0,k=!c.rtl,m=!b.series,
p=!m&&b.series.drawLegendSymbol?b.series:b,n=p.options,q=this.createCheckboxForItem&&n&&n.showCheckbox,t=c.useHTML,y=b.options.className,G=b.legendItem;n=e+h+f+(q?20:0);G||(b.legendGroup=d.g("legend-item").addClass("highcharts-"+p.type+"-series highcharts-color-"+b.colorIndex+(y?" "+y:"")+(m?" highcharts-series-"+b.index:"")).attr({zIndex:1}).add(this.scrollGroup),b.legendItem=G=d.text("",k?e+h:-h,this.baseline||0,t),a.styledMode||G.css(x(b.visible?g:l)),G.attr({align:k?"left":"right",zIndex:2}).add(b.legendGroup),
this.baseline||(this.fontMetrics=d.fontMetrics(a.styledMode?12:g.fontSize,G),this.baseline=this.fontMetrics.f+3+this.itemMarginTop,G.attr("y",this.baseline),this.symbolHeight=c.symbolHeight||this.fontMetrics.f,c.squareSymbol&&(this.symbolWidth=z(c.symbolWidth,Math.max(this.symbolHeight,16)),n=this.symbolWidth+h+f+(q?20:0),k&&G.attr("x",this.symbolWidth+h))),p.drawLegendSymbol(this,b),this.setItemEvents&&this.setItemEvents(b,G,t));q&&!b.checkbox&&this.createCheckboxForItem&&this.createCheckboxForItem(b);
this.colorizeItem(b,b.visible);!a.styledMode&&g.width||G.css({width:(c.itemWidth||this.widthOption||a.spacingBox.width)-n+"px"});this.setText(b);a=G.getBBox();d=this.fontMetrics&&this.fontMetrics.h||0;b.itemWidth=b.checkboxOffset=c.itemWidth||b.legendItemWidth||a.width+n;this.maxItemWidth=Math.max(this.maxItemWidth,b.itemWidth);this.totalItemWidth+=b.itemWidth;this.itemHeight=b.itemHeight=Math.round(b.legendItemHeight||(a.height>1.5*d?a.height:d))};a.prototype.layoutItem=function(b){var a=this.options,
c=this.padding,d="horizontal"===a.layout,e=b.itemHeight,h=this.itemMarginBottom,g=this.itemMarginTop,l=d?z(a.itemDistance,20):0,f=this.maxLegendWidth;a=a.alignColumns&&this.totalItemWidth>f?this.maxItemWidth:b.itemWidth;d&&this.itemX-c+a>f&&(this.itemX=c,this.lastLineHeight&&(this.itemY+=g+this.lastLineHeight+h),this.lastLineHeight=0);this.lastItemY=g+this.itemY+h;this.lastLineHeight=Math.max(e,this.lastLineHeight);b._legendItemPos=[this.itemX,this.itemY];d?this.itemX+=a:(this.itemY+=g+e+h,this.lastLineHeight=
e);this.offsetWidth=this.widthOption||Math.max((d?this.itemX-c-(b.checkbox?0:l):a)+c,this.offsetWidth)};a.prototype.getAllItems=function(){var b=[];this.chart.series.forEach(function(a){var c=a&&a.options;a&&z(c.showInLegend,g(c.linkedTo)?!1:void 0,!0)&&(b=b.concat(a.legendItems||("point"===c.legendType?a.data:a)))});F(this,"afterGetAllItems",{allItems:b});return b};a.prototype.getAlignment=function(){var b=this.options;return this.proximate?b.align.charAt(0)+"tv":b.floating?"":b.align.charAt(0)+
b.verticalAlign.charAt(0)+b.layout.charAt(0)};a.prototype.adjustMargins=function(b,a){var c=this.chart,d=this.options,e=this.getAlignment();e&&[/(lth|ct|rth)/,/(rtv|rm|rbv)/,/(rbh|cb|lbh)/,/(lbv|lm|ltv)/].forEach(function(h,f){h.test(e)&&!g(b[f])&&(c[n[f]]=Math.max(c[n[f]],c.legend[(f+1)%2?"legendHeight":"legendWidth"]+[1,-1,-1,1][f]*d[f%2?"x":"y"]+z(d.margin,12)+a[f]+(c.titleOffset[f]||0)))})};a.prototype.proximatePositions=function(){var b=this.chart,a=[],c="left"===this.options.align;this.allItems.forEach(function(d){var e;
var h=c;if(d.yAxis){d.xAxis.options.reversed&&(h=!h);d.points&&(e=q(h?d.points:d.points.slice(0).reverse(),function(b){return y(b.plotY)}));h=this.itemMarginTop+d.legendItem.getBBox().height+this.itemMarginBottom;var g=d.yAxis.top-b.plotTop;d.visible?(e=e?e.plotY:d.yAxis.height,e+=g-.3*h):e=g+d.yAxis.height;a.push({target:e,size:h,item:d})}},this);k(a,b.plotHeight).forEach(function(a){a.item._legendItemPos&&(a.item._legendItemPos[1]=b.plotTop-b.spacing[0]+a.pos)})};a.prototype.render=function(){var b=
this.chart,a=b.renderer,c=this.options,e=this.padding,g=this.getAllItems(),f=this.group,l=this.box;this.itemX=e;this.itemY=this.initialItemY;this.lastItemY=this.offsetWidth=0;this.widthOption=m(c.width,b.spacingBox.width-e);var k=b.spacingBox.width-2*e-c.x;-1<["rm","lm"].indexOf(this.getAlignment().substring(0,2))&&(k/=2);this.maxLegendWidth=this.widthOption||k;f||(this.group=f=a.g("legend").addClass(c.className||"").attr({zIndex:7}).add(),this.contentGroup=a.g().attr({zIndex:1}).add(f),this.scrollGroup=
a.g().add(this.contentGroup));this.renderTitle();h(g,function(b,a){return(b.options&&b.options.legendIndex||0)-(a.options&&a.options.legendIndex||0)});c.reversed&&g.reverse();this.allItems=g;this.display=k=!!g.length;this.itemHeight=this.totalItemWidth=this.maxItemWidth=this.lastLineHeight=0;g.forEach(this.renderItem,this);g.forEach(this.layoutItem,this);g=(this.widthOption||this.offsetWidth)+e;var p=this.lastItemY+this.lastLineHeight+this.titleHeight;p=this.handleOverflow(p);p+=e;l||(this.box=l=
a.rect().addClass("highcharts-legend-box").attr({r:c.borderRadius}).add(f));b.styledMode||l.attr({stroke:c.borderColor,"stroke-width":c.borderWidth||0,fill:c.backgroundColor||"none"}).shadow(c.shadow);if(0<g&&0<p)l[l.placed?"animate":"attr"](l.crisp.call({},{x:0,y:0,width:g,height:p},l.strokeWidth()));l[k?"show":"hide"]();b.styledMode&&"none"===f.getStyle("display")&&(g=p=0);this.legendWidth=g;this.legendHeight=p;k&&this.align();this.proximate||this.positionItems();F(this,"afterRender")};a.prototype.align=
function(b){void 0===b&&(b=this.chart.spacingBox);var a=this.chart,c=this.options,d=b.y;/(lth|ct|rth)/.test(this.getAlignment())&&0<a.titleOffset[0]?d+=a.titleOffset[0]:/(lbh|cb|rbh)/.test(this.getAlignment())&&0<a.titleOffset[2]&&(d-=a.titleOffset[2]);d!==b.y&&(b=x(b,{y:d}));a.hasRendered||(this.group.placed=!1);this.group.align(x(c,{width:this.legendWidth,height:this.legendHeight,verticalAlign:this.proximate?"top":c.verticalAlign}),!0,b)};a.prototype.handleOverflow=function(b){var a=this,c=this.chart,
d=c.renderer,e=this.options,h=e.y,g="top"===e.verticalAlign,f=this.padding,l=e.maxHeight,k=e.navigation,m=z(k.animation,!0),p=k.arrowSize||12,n=this.pages,q=this.allItems,t=function(b){"number"===typeof b?F.attr({height:b}):F&&(a.clipRect=F.destroy(),a.contentGroup.clip());a.contentGroup.div&&(a.contentGroup.div.style.clip=b?"rect("+f+"px,9999px,"+(f+b)+"px,0)":"auto")},y=function(b){a[b]=d.circle(0,0,1.3*p).translate(p/2,p/2).add(M);c.styledMode||a[b].attr("fill","rgba(0,0,0,0.0001)");return a[b]},
G,x;h=c.spacingBox.height+(g?-h:h)-f;var M=this.nav,F=this.clipRect;"horizontal"!==e.layout||"middle"===e.verticalAlign||e.floating||(h/=2);l&&(h=Math.min(h,l));n.length=0;b&&0<h&&b>h&&!1!==k.enabled?(this.clipHeight=G=Math.max(h-20-this.titleHeight-f,0),this.currentPage=z(this.currentPage,1),this.fullHeight=b,q.forEach(function(b,a){var c=b._legendItemPos[1],d=Math.round(b.legendItem.getBBox().height),e=n.length;if(!e||c-n[e-1]>G&&(x||c)!==n[e-1])n.push(x||c),e++;b.pageIx=e-1;x&&(q[a-1].pageIx=e-
1);a===q.length-1&&c+d-n[e-1]>G&&d<=G&&(n.push(c),b.pageIx=e);c!==x&&(x=c)}),F||(F=a.clipRect=d.clipRect(0,f,9999,0),a.contentGroup.clip(F)),t(G),M||(this.nav=M=d.g().attr({zIndex:1}).add(this.group),this.up=d.symbol("triangle",0,0,p,p).add(M),y("upTracker").on("click",function(){a.scroll(-1,m)}),this.pager=d.text("",15,10).addClass("highcharts-legend-navigation"),!c.styledMode&&k.style&&this.pager.css(k.style),this.pager.add(M),this.down=d.symbol("triangle-down",0,0,p,p).add(M),y("downTracker").on("click",
function(){a.scroll(1,m)})),a.scroll(0),b=h):M&&(t(),this.nav=M.destroy(),this.scrollGroup.attr({translateY:1}),this.clipHeight=0);return b};a.prototype.scroll=function(a,c){var d=this,e=this.chart,h=this.pages,g=h.length,f=this.clipHeight,l=this.options.navigation,k=this.pager,m=this.padding,p=this.currentPage+a;p>g&&(p=g);0<p&&("undefined"!==typeof c&&A(c,e),this.nav.attr({translateX:m,translateY:f+this.padding+7+this.titleHeight,visibility:"inherit"}),[this.up,this.upTracker].forEach(function(b){b.attr({"class":1===
p?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"})}),k.attr({text:p+"/"+g}),[this.down,this.downTracker].forEach(function(b){b.attr({x:18+this.pager.getBBox().width,"class":p===g?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"})},this),e.styledMode||(this.up.attr({fill:1===p?l.inactiveColor:l.activeColor}),this.upTracker.css({cursor:1===p?"default":"pointer"}),this.down.attr({fill:p===g?l.inactiveColor:l.activeColor}),this.downTracker.css({cursor:p===g?"default":"pointer"})),
this.scrollOffset=-h[p-1]+this.initialItemY,this.scrollGroup.animate({translateY:this.scrollOffset}),this.currentPage=p,this.positionCheckboxes(),a=C(z(c,e.renderer.globalAnimation,!0)),b(function(){F(d,"afterScroll",{currentPage:p})},a.duration))};a.prototype.setItemEvents=function(b,a,c){var d=this,e=d.chart.renderer.boxWrapper,h=b instanceof H,g="highcharts-legend-"+(h?"point":"series")+"-active",f=d.chart.styledMode,l=function(a){d.allItems.forEach(function(c){b!==c&&[c].concat(c.linkedSeries||
[]).forEach(function(b){b.setState(a,!h)})})};(c?[a,b.legendSymbol]:[b.legendGroup]).forEach(function(c){if(c)c.on("mouseover",function(){b.visible&&l("inactive");b.setState("hover");b.visible&&e.addClass(g);f||a.css(d.options.itemHoverStyle)}).on("mouseout",function(){d.chart.styledMode||a.css(x(b.visible?d.itemStyle:d.itemHiddenStyle));l("");e.removeClass(g);b.setState()}).on("click",function(a){var c=function(){b.setVisible&&b.setVisible();l(b.visible?"inactive":"")};e.removeClass(g);a={browserEvent:a};
b.firePointEvent?b.firePointEvent("legendItemClick",a,c):F(b,"legendItemClick",a,c)})})};a.prototype.createCheckboxForItem=function(b){b.checkbox=c("input",{type:"checkbox",className:"highcharts-legend-checkbox",checked:b.selected,defaultChecked:b.selected},this.options.itemCheckboxStyle,this.chart.container);e(b.checkbox,"click",function(a){F(b.series||b,"checkboxClick",{checked:a.target.checked,item:b},function(){b.select()})})};return a}();(/Trident\/7\.0/.test(B.navigator&&B.navigator.userAgent)||
a)&&w(E.prototype,"positionItem",function(b,a){var c=this,d=function(){a._legendItemPos&&b.call(c,a)};d();c.bubbleLegend||setTimeout(d)});"";return E});K(f,"Core/Series/SeriesRegistry.js",[f["Core/Globals.js"],f["Core/DefaultOptions.js"],f["Core/Series/Point.js"],f["Core/Utilities.js"]],function(a,f,B,H){var w=f.defaultOptions,C=H.error,I=H.extendClass,A=H.merge,u;(function(f){function k(a,c){var e=w.plotOptions||{},g=c.defaultOptions;c.prototype.pointClass||(c.prototype.pointClass=B);c.prototype.type=
a;g&&(e[a]=g);f.seriesTypes[a]=c}f.seriesTypes=a.seriesTypes;f.getSeries=function(a,c){void 0===c&&(c={});var e=a.options.chart;e=c.type||e.type||e.defaultSeriesType||"";var g=f.seriesTypes[e];f||C(17,!0,a,{missingModuleFor:e});e=new g;"function"===typeof e.init&&e.init(a,c);return e};f.registerSeriesType=k;f.seriesType=function(a,c,p,g,n){var e=w.plotOptions||{};c=c||"";e[a]=A(e[c],p);k(a,I(f.seriesTypes[c]||function(){},g));f.seriesTypes[a].prototype.type=a;n&&(f.seriesTypes[a].prototype.pointClass=
I(B,n));return f.seriesTypes[a]}})(u||(u={}));return u});K(f,"Core/Chart/Chart.js",[f["Core/Animation/AnimationUtilities.js"],f["Core/Axis/Axis.js"],f["Core/FormatUtilities.js"],f["Core/Foundation.js"],f["Core/Globals.js"],f["Core/Legend/Legend.js"],f["Core/MSPointer.js"],f["Core/DefaultOptions.js"],f["Core/Pointer.js"],f["Core/Renderer/RendererRegistry.js"],f["Core/Series/SeriesRegistry.js"],f["Core/Renderer/SVG/SVGRenderer.js"],f["Core/Time.js"],f["Core/Utilities.js"],f["Core/Renderer/HTML/AST.js"]],
function(a,f,B,H,w,E,I,A,u,n,k,e,c,p,g){var t=a.animate,q=a.animObject,F=a.setAnimation,y=B.numberFormat,x=H.registerEventOptions,z=w.charts,m=w.doc,h=w.marginNames,b=w.svg,l=w.win,d=A.defaultOptions,D=A.defaultTime,v=k.seriesTypes,r=p.addEvent,C=p.attr,P=p.cleanRecursively,S=p.createElement,N=p.css,Y=p.defined,X=p.discardElement,J=p.erase,L=p.error,K=p.extend,da=p.find,Q=p.fireEvent,ea=p.getStyle,G=p.isArray,T=p.isNumber,M=p.isObject,V=p.isString,W=p.merge,Z=p.objectEach,R=p.pick,ha=p.pInt,aa=p.relativeLength,
ja=p.removeEvent,ia=p.splat,ba=p.syncTimeout,ka=p.uniqueKey;a=function(){function a(b,a,c){this.series=this.renderTo=this.renderer=this.pointer=this.pointCount=this.plotWidth=this.plotTop=this.plotLeft=this.plotHeight=this.plotBox=this.options=this.numberFormatter=this.margin=this.legend=this.labelCollectors=this.isResizing=this.index=this.eventOptions=this.container=this.colorCounter=this.clipBox=this.chartWidth=this.chartHeight=this.bounds=this.axisOffset=this.axes=void 0;this.sharedClips={};this.yAxis=
this.xAxis=this.userOptions=this.titleOffset=this.time=this.symbolCounter=this.spacingBox=this.spacing=void 0;this.getArgs(b,a,c)}a.chart=function(b,c,d){return new a(b,c,d)};a.prototype.getArgs=function(b,a,c){V(b)||b.nodeName?(this.renderTo=b,this.init(a,c)):this.init(b,a)};a.prototype.init=function(b,a){var e=b.plotOptions||{};Q(this,"init",{args:arguments},function(){var h=W(d,b),g=h.chart;Z(h.plotOptions,function(b,a){M(b)&&(b.tooltip=e[a]&&W(e[a].tooltip)||void 0)});h.tooltip.userOptions=b.chart&&
b.chart.forExport&&b.tooltip.userOptions||b.tooltip;this.userOptions=b;this.margin=[];this.spacing=[];this.bounds={h:{},v:{}};this.labelCollectors=[];this.callback=a;this.isResizing=0;this.options=h;this.axes=[];this.series=[];this.time=b.time&&Object.keys(b.time).length?new c(b.time):w.time;this.numberFormatter=g.numberFormatter||y;this.styledMode=g.styledMode;this.hasCartesianSeries=g.showAxes;this.index=z.length;z.push(this);w.chartCount++;x(this,g);this.xAxis=[];this.yAxis=[];this.pointCount=
this.colorCounter=this.symbolCounter=0;Q(this,"afterInit");this.firstRender()})};a.prototype.initSeries=function(b){var a=this.options.chart;a=b.type||a.type||a.defaultSeriesType;var c=v[a];c||L(17,!0,this,{missingModuleFor:a});a=new c;"function"===typeof a.init&&a.init(this,b);return a};a.prototype.setSeriesData=function(){this.getSeriesOrderByLinks().forEach(function(b){b.points||b.data||!b.enabledDataSorting||b.setData(b.options.data,!1)})};a.prototype.getSeriesOrderByLinks=function(){return this.series.concat().sort(function(b,
a){return b.linkedSeries.length||a.linkedSeries.length?a.linkedSeries.length-b.linkedSeries.length:0})};a.prototype.orderSeries=function(b){var a=this.series;b=b||0;for(var c=a.length;b<c;++b)a[b]&&(a[b].index=b,a[b].name=a[b].getName())};a.prototype.isInsidePlot=function(b,a,c){void 0===c&&(c={});var d=this.inverted,e=this.plotBox,h=this.plotLeft,g=this.plotTop,f=this.scrollablePlotBox,l=0;var k=0;c.visiblePlotOnly&&this.scrollingContainer&&(k=this.scrollingContainer,l=k.scrollLeft,k=k.scrollTop);
var m=c.series;e=c.visiblePlotOnly&&f||e;f=c.inverted?a:b;a=c.inverted?b:a;b={x:f,y:a,isInsidePlot:!0};if(!c.ignoreX){var p=m&&(d?m.yAxis:m.xAxis)||{pos:h,len:Infinity};f=c.paneCoordinates?p.pos+f:h+f;f>=Math.max(l+h,p.pos)&&f<=Math.min(l+h+e.width,p.pos+p.len)||(b.isInsidePlot=!1)}!c.ignoreY&&b.isInsidePlot&&(d=m&&(d?m.xAxis:m.yAxis)||{pos:g,len:Infinity},c=c.paneCoordinates?d.pos+a:g+a,c>=Math.max(k+g,d.pos)&&c<=Math.min(k+g+e.height,d.pos+d.len)||(b.isInsidePlot=!1));Q(this,"afterIsInsidePlot",
b);return b.isInsidePlot};a.prototype.redraw=function(b){Q(this,"beforeRedraw");var a=this.hasCartesianSeries?this.axes:this.colorAxis||[],c=this.series,d=this.pointer,e=this.legend,h=this.userOptions.legend,g=this.renderer,f=g.isHidden(),l=[],k=this.isDirtyBox,m=this.isDirtyLegend;this.setResponsive&&this.setResponsive(!1);F(this.hasRendered?b:!1,this);f&&this.temporaryDisplay();this.layOutTitles();for(b=c.length;b--;){var p=c[b];if(p.options.stacking||p.options.centerInCategory){var G=!0;if(p.isDirty){var n=
!0;break}}}if(n)for(b=c.length;b--;)p=c[b],p.options.stacking&&(p.isDirty=!0);c.forEach(function(b){b.isDirty&&("point"===b.options.legendType?("function"===typeof b.updateTotals&&b.updateTotals(),m=!0):h&&(h.labelFormatter||h.labelFormat)&&(m=!0));b.isDirtyData&&Q(b,"updatedData")});m&&e&&e.options.enabled&&(e.render(),this.isDirtyLegend=!1);G&&this.getStacks();a.forEach(function(b){b.updateNames();b.setScale()});this.getMargins();a.forEach(function(b){b.isDirty&&(k=!0)});a.forEach(function(b){var a=
b.min+","+b.max;b.extKey!==a&&(b.extKey=a,l.push(function(){Q(b,"afterSetExtremes",K(b.eventArgs,b.getExtremes()));delete b.eventArgs}));(k||G)&&b.redraw()});k&&this.drawChartBox();Q(this,"predraw");c.forEach(function(b){(k||b.isDirty)&&b.visible&&b.redraw();b.isDirtyData=!1});d&&d.reset(!0);g.draw();Q(this,"redraw");Q(this,"render");f&&this.temporaryDisplay(!0);l.forEach(function(b){b.call()})};a.prototype.get=function(b){function a(a){return a.id===b||a.options&&a.options.id===b}for(var c=this.series,
d=da(this.axes,a)||da(this.series,a),e=0;!d&&e<c.length;e++)d=da(c[e].points||[],a);return d};a.prototype.getAxes=function(){var b=this,a=this.options,c=a.xAxis=ia(a.xAxis||{});a=a.yAxis=ia(a.yAxis||{});Q(this,"getAxes");c.forEach(function(b,a){b.index=a;b.isX=!0});a.forEach(function(b,a){b.index=a});c.concat(a).forEach(function(a){new f(b,a)});Q(this,"afterGetAxes")};a.prototype.getSelectedPoints=function(){return this.series.reduce(function(b,a){a.getPointsCollection().forEach(function(a){R(a.selectedStaging,
a.selected)&&b.push(a)});return b},[])};a.prototype.getSelectedSeries=function(){return this.series.filter(function(b){return b.selected})};a.prototype.setTitle=function(b,a,c){this.applyDescription("title",b);this.applyDescription("subtitle",a);this.applyDescription("caption",void 0);this.layOutTitles(c)};a.prototype.applyDescription=function(b,a){var c=this,d="title"===b?{color:"#333333",fontSize:this.options.isStock?"16px":"18px"}:{color:"#666666"};d=this.options[b]=W(!this.styledMode&&{style:d},
this.options[b],a);var e=this[b];e&&a&&(this[b]=e=e.destroy());d&&!e&&(e=this.renderer.text(d.text,0,0,d.useHTML).attr({align:d.align,"class":"highcharts-"+b,zIndex:d.zIndex||4}).add(),e.update=function(a){c[{title:"setTitle",subtitle:"setSubtitle",caption:"setCaption"}[b]](a)},this.styledMode||e.css(d.style),this[b]=e)};a.prototype.layOutTitles=function(b){var a=[0,0,0],c=this.renderer,d=this.spacingBox;["title","subtitle","caption"].forEach(function(b){var e=this[b],h=this.options[b],g=h.verticalAlign||
"top";b="title"===b?"top"===g?-3:0:"top"===g?a[0]+2:0;var f;if(e){this.styledMode||(f=h.style&&h.style.fontSize);f=c.fontMetrics(f,e).b;e.css({width:(h.width||d.width+(h.widthAdjust||0))+"px"});var l=Math.round(e.getBBox(h.useHTML).height);e.align(K({y:"bottom"===g?f:b+f,height:l},h),!1,"spacingBox");h.floating||("top"===g?a[0]=Math.ceil(a[0]+l):"bottom"===g&&(a[2]=Math.ceil(a[2]+l)))}},this);a[0]&&"top"===(this.options.title.verticalAlign||"top")&&(a[0]+=this.options.title.margin);a[2]&&"bottom"===
this.options.caption.verticalAlign&&(a[2]+=this.options.caption.margin);var e=!this.titleOffset||this.titleOffset.join(",")!==a.join(",");this.titleOffset=a;Q(this,"afterLayOutTitles");!this.isDirtyBox&&e&&(this.isDirtyBox=this.isDirtyLegend=e,this.hasRendered&&R(b,!0)&&this.isDirtyBox&&this.redraw())};a.prototype.getChartSize=function(){var b=this.options.chart,a=b.width;b=b.height;var c=this.renderTo;Y(a)||(this.containerWidth=ea(c,"width"));Y(b)||(this.containerHeight=ea(c,"height"));this.chartWidth=
Math.max(0,a||this.containerWidth||600);this.chartHeight=Math.max(0,aa(b,this.chartWidth)||(1<this.containerHeight?this.containerHeight:400))};a.prototype.temporaryDisplay=function(b){var a=this.renderTo;if(b)for(;a&&a.style;)a.hcOrigStyle&&(N(a,a.hcOrigStyle),delete a.hcOrigStyle),a.hcOrigDetached&&(m.body.removeChild(a),a.hcOrigDetached=!1),a=a.parentNode;else for(;a&&a.style;){m.body.contains(a)||a.parentNode||(a.hcOrigDetached=!0,m.body.appendChild(a));if("none"===ea(a,"display",!1)||a.hcOricDetached)a.hcOrigStyle=
{display:a.style.display,height:a.style.height,overflow:a.style.overflow},b={display:"block",overflow:"hidden"},a!==this.renderTo&&(b.height=0),N(a,b),a.offsetWidth||a.style.setProperty("display","block","important");a=a.parentNode;if(a===m.body)break}};a.prototype.setClassName=function(b){this.container.className="highcharts-container "+(b||"")};a.prototype.getContainer=function(){var a=this.options,c=a.chart,d=ka(),h,f=this.renderTo;f||(this.renderTo=f=c.renderTo);V(f)&&(this.renderTo=f=m.getElementById(f));
f||L(13,!0,this);var l=ha(C(f,"data-highcharts-chart"));T(l)&&z[l]&&z[l].hasRendered&&z[l].destroy();C(f,"data-highcharts-chart",this.index);f.innerHTML=g.emptyHTML;c.skipClone||f.offsetWidth||this.temporaryDisplay();this.getChartSize();l=this.chartWidth;var k=this.chartHeight;N(f,{overflow:"hidden"});this.styledMode||(h=K({position:"relative",overflow:"hidden",width:l+"px",height:k+"px",textAlign:"left",lineHeight:"normal",zIndex:0,"-webkit-tap-highlight-color":"rgba(0,0,0,0)",userSelect:"none",
"touch-action":"manipulation",outline:"none"},c.style||{}));this.container=d=S("div",{id:d},h,f);this._cursor=d.style.cursor;this.renderer=new (c.renderer||!b?n.getRendererType(c.renderer):e)(d,l,k,void 0,c.forExport,a.exporting&&a.exporting.allowHTML,this.styledMode);F(void 0,this);this.setClassName(c.className);if(this.styledMode)for(var p in a.defs)this.renderer.definition(a.defs[p]);else this.renderer.setStyle(c.style);this.renderer.chartIndex=this.index;Q(this,"afterGetContainer")};a.prototype.getMargins=
function(b){var a=this.spacing,c=this.margin,d=this.titleOffset;this.resetMargins();d[0]&&!Y(c[0])&&(this.plotTop=Math.max(this.plotTop,d[0]+a[0]));d[2]&&!Y(c[2])&&(this.marginBottom=Math.max(this.marginBottom,d[2]+a[2]));this.legend&&this.legend.display&&this.legend.adjustMargins(c,a);Q(this,"getMargins");b||this.getAxisMargins()};a.prototype.getAxisMargins=function(){var b=this,a=b.axisOffset=[0,0,0,0],c=b.colorAxis,d=b.margin,e=function(b){b.forEach(function(b){b.visible&&b.getOffset()})};b.hasCartesianSeries?
e(b.axes):c&&c.length&&e(c);h.forEach(function(c,e){Y(d[e])||(b[c]+=a[e])});b.setChartSize()};a.prototype.reflow=function(b){var a=this,c=a.options.chart,d=a.renderTo,e=Y(c.width)&&Y(c.height),h=c.width||ea(d,"width");c=c.height||ea(d,"height");d=b?b.target:l;delete a.pointer.chartPosition;if(!e&&!a.isPrinting&&h&&c&&(d===l||d===m)){if(h!==a.containerWidth||c!==a.containerHeight)p.clearTimeout(a.reflowTimeout),a.reflowTimeout=ba(function(){a.container&&a.setSize(void 0,void 0,!1)},b?100:0);a.containerWidth=
h;a.containerHeight=c}};a.prototype.setReflow=function(b){var a=this;!1===b||this.unbindReflow?!1===b&&this.unbindReflow&&(this.unbindReflow=this.unbindReflow()):(this.unbindReflow=r(l,"resize",function(b){a.options&&a.reflow(b)}),r(this,"destroy",this.unbindReflow))};a.prototype.setSize=function(b,a,c){var d=this,e=d.renderer;d.isResizing+=1;F(c,d);c=e.globalAnimation;d.oldChartHeight=d.chartHeight;d.oldChartWidth=d.chartWidth;"undefined"!==typeof b&&(d.options.chart.width=b);"undefined"!==typeof a&&
(d.options.chart.height=a);d.getChartSize();d.styledMode||(c?t:N)(d.container,{width:d.chartWidth+"px",height:d.chartHeight+"px"},c);d.setChartSize(!0);e.setSize(d.chartWidth,d.chartHeight,c);d.axes.forEach(function(b){b.isDirty=!0;b.setScale()});d.isDirtyLegend=!0;d.isDirtyBox=!0;d.layOutTitles();d.getMargins();d.redraw(c);d.oldChartHeight=null;Q(d,"resize");ba(function(){d&&Q(d,"endResize",null,function(){--d.isResizing})},q(c).duration)};a.prototype.setChartSize=function(b){var a=this.inverted,
c=this.renderer,d=this.chartWidth,e=this.chartHeight,h=this.options.chart,g=this.spacing,f=this.clipOffset,l,k,m,p;this.plotLeft=l=Math.round(this.plotLeft);this.plotTop=k=Math.round(this.plotTop);this.plotWidth=m=Math.max(0,Math.round(d-l-this.marginRight));this.plotHeight=p=Math.max(0,Math.round(e-k-this.marginBottom));this.plotSizeX=a?p:m;this.plotSizeY=a?m:p;this.plotBorderWidth=h.plotBorderWidth||0;this.spacingBox=c.spacingBox={x:g[3],y:g[0],width:d-g[3]-g[1],height:e-g[0]-g[2]};this.plotBox=
c.plotBox={x:l,y:k,width:m,height:p};a=2*Math.floor(this.plotBorderWidth/2);d=Math.ceil(Math.max(a,f[3])/2);e=Math.ceil(Math.max(a,f[0])/2);this.clipBox={x:d,y:e,width:Math.floor(this.plotSizeX-Math.max(a,f[1])/2-d),height:Math.max(0,Math.floor(this.plotSizeY-Math.max(a,f[2])/2-e))};b||(this.axes.forEach(function(b){b.setAxisSize();b.setAxisTranslation()}),c.alignElements());Q(this,"afterSetChartSize",{skipAxes:b})};a.prototype.resetMargins=function(){Q(this,"resetMargins");var b=this,a=b.options.chart;
["margin","spacing"].forEach(function(c){var d=a[c],e=M(d)?d:[d,d,d,d];["Top","Right","Bottom","Left"].forEach(function(d,h){b[c][h]=R(a[c+d],e[h])})});h.forEach(function(a,c){b[a]=R(b.margin[c],b.spacing[c])});b.axisOffset=[0,0,0,0];b.clipOffset=[0,0,0,0]};a.prototype.drawChartBox=function(){var b=this.options.chart,a=this.renderer,c=this.chartWidth,d=this.chartHeight,e=this.styledMode,h=this.plotBGImage,g=b.backgroundColor,f=b.plotBackgroundColor,l=b.plotBackgroundImage,k=this.plotLeft,m=this.plotTop,
p=this.plotWidth,G=this.plotHeight,n=this.plotBox,q=this.clipRect,r=this.clipBox,t=this.chartBackground,M=this.plotBackground,y=this.plotBorder,z,x="animate";t||(this.chartBackground=t=a.rect().addClass("highcharts-background").add(),x="attr");if(e)var v=z=t.strokeWidth();else{v=b.borderWidth||0;z=v+(b.shadow?8:0);g={fill:g||"none"};if(v||t["stroke-width"])g.stroke=b.borderColor,g["stroke-width"]=v;t.attr(g).shadow(b.shadow)}t[x]({x:z/2,y:z/2,width:c-z-v%2,height:d-z-v%2,r:b.borderRadius});x="animate";
M||(x="attr",this.plotBackground=M=a.rect().addClass("highcharts-plot-background").add());M[x](n);e||(M.attr({fill:f||"none"}).shadow(b.plotShadow),l&&(h?(l!==h.attr("href")&&h.attr("href",l),h.animate(n)):this.plotBGImage=a.image(l,k,m,p,G).add()));q?q.animate({width:r.width,height:r.height}):this.clipRect=a.clipRect(r);x="animate";y||(x="attr",this.plotBorder=y=a.rect().addClass("highcharts-plot-border").attr({zIndex:1}).add());e||y.attr({stroke:b.plotBorderColor,"stroke-width":b.plotBorderWidth||
0,fill:"none"});y[x](y.crisp({x:k,y:m,width:p,height:G},-y.strokeWidth()));this.isDirtyBox=!1;Q(this,"afterDrawChartBox")};a.prototype.propFromSeries=function(){var b=this,a=b.options.chart,c=b.options.series,d,e,h;["inverted","angular","polar"].forEach(function(g){e=v[a.type||a.defaultSeriesType];h=a[g]||e&&e.prototype[g];for(d=c&&c.length;!h&&d--;)(e=v[c[d].type])&&e.prototype[g]&&(h=!0);b[g]=h})};a.prototype.linkSeries=function(){var b=this,a=b.series;a.forEach(function(b){b.linkedSeries.length=
0});a.forEach(function(a){var c=a.options.linkedTo;V(c)&&(c=":previous"===c?b.series[a.index-1]:b.get(c))&&c.linkedParent!==a&&(c.linkedSeries.push(a),a.linkedParent=c,c.enabledDataSorting&&a.setDataSortingOptions(),a.visible=R(a.options.visible,c.options.visible,a.visible))});Q(this,"afterLinkSeries")};a.prototype.renderSeries=function(){this.series.forEach(function(b){b.translate();b.render()})};a.prototype.renderLabels=function(){var b=this,a=b.options.labels;a.items&&a.items.forEach(function(c){var d=
K(a.style,c.style),e=ha(d.left)+b.plotLeft,h=ha(d.top)+b.plotTop+12;delete d.left;delete d.top;b.renderer.text(c.html,e,h).attr({zIndex:2}).css(d).add()})};a.prototype.render=function(){var b=this.axes,a=this.colorAxis,c=this.renderer,d=this.options,e=function(b){b.forEach(function(b){b.visible&&b.render()})},h=0;this.setTitle();this.legend=new E(this,d.legend);this.getStacks&&this.getStacks();this.getMargins(!0);this.setChartSize();d=this.plotWidth;b.some(function(b){if(b.horiz&&b.visible&&b.options.labels.enabled&&
b.series.length)return h=21,!0});var g=this.plotHeight=Math.max(this.plotHeight-h,0);b.forEach(function(b){b.setScale()});this.getAxisMargins();var f=1.1<d/this.plotWidth,l=1.05<g/this.plotHeight;if(f||l)b.forEach(function(b){(b.horiz&&f||!b.horiz&&l)&&b.setTickInterval(!0)}),this.getMargins();this.drawChartBox();this.hasCartesianSeries?e(b):a&&a.length&&e(a);this.seriesGroup||(this.seriesGroup=c.g("series-group").attr({zIndex:3}).add());this.renderSeries();this.renderLabels();this.addCredits();this.setResponsive&&
this.setResponsive();this.hasRendered=!0};a.prototype.addCredits=function(b){var a=this,c=W(!0,this.options.credits,b);c.enabled&&!this.credits&&(this.credits=this.renderer.text(c.text+(this.mapCredits||""),0,0).addClass("highcharts-credits").on("click",function(){c.href&&(l.location.href=c.href)}).attr({align:c.position.align,zIndex:8}),a.styledMode||this.credits.css(c.style),this.credits.add().align(c.position),this.credits.update=function(b){a.credits=a.credits.destroy();a.addCredits(b)})};a.prototype.destroy=
function(){var b=this,a=b.axes,c=b.series,d=b.container,e=d&&d.parentNode,h;Q(b,"destroy");b.renderer.forExport?J(z,b):z[b.index]=void 0;w.chartCount--;b.renderTo.removeAttribute("data-highcharts-chart");ja(b);for(h=a.length;h--;)a[h]=a[h].destroy();this.scroller&&this.scroller.destroy&&this.scroller.destroy();for(h=c.length;h--;)c[h]=c[h].destroy();"title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" ").forEach(function(a){var c=
b[a];c&&c.destroy&&(b[a]=c.destroy())});d&&(d.innerHTML=g.emptyHTML,ja(d),e&&X(d));Z(b,function(a,c){delete b[c]})};a.prototype.firstRender=function(){var b=this,a=b.options;if(!b.isReadyToRender||b.isReadyToRender()){b.getContainer();b.resetMargins();b.setChartSize();b.propFromSeries();b.getAxes();(G(a.series)?a.series:[]).forEach(function(a){b.initSeries(a)});b.linkSeries();b.setSeriesData();Q(b,"beforeRender");u&&(I.isRequired()?b.pointer=new I(b,a):b.pointer=new u(b,a));b.render();b.pointer.getChartPosition();
if(!b.renderer.imgCount&&!b.hasLoaded)b.onload();b.temporaryDisplay(!0)}};a.prototype.onload=function(){this.callbacks.concat([this.callback]).forEach(function(b){b&&"undefined"!==typeof this.index&&b.apply(this,[this])},this);Q(this,"load");Q(this,"render");Y(this.index)&&this.setReflow(this.options.chart.reflow);this.warnIfA11yModuleNotLoaded();this.hasLoaded=!0};a.prototype.warnIfA11yModuleNotLoaded=function(){var b=this;setTimeout(function(){var a=b&&b.options;!a||b.accessibility||a.accessibility&&
!1===a.accessibility.enabled||L('Highcharts warning: Consider including the "accessibility.js" module to make your chart more usable for people with disabilities. Set the "accessibility.enabled" option to false to remove this warning. See https://www.highcharts.com/docs/accessibility/accessibility-module.',!1,b)},100)};a.prototype.addSeries=function(b,a,c){var d=this,e;b&&(a=R(a,!0),Q(d,"addSeries",{options:b},function(){e=d.initSeries(b);d.isDirtyLegend=!0;d.linkSeries();e.enabledDataSorting&&e.setData(b.data,
!1);Q(d,"afterAddSeries",{series:e});a&&d.redraw(c)}));return e};a.prototype.addAxis=function(b,a,c,d){return this.createAxis(a?"xAxis":"yAxis",{axis:b,redraw:c,animation:d})};a.prototype.addColorAxis=function(b,a,c){return this.createAxis("colorAxis",{axis:b,redraw:a,animation:c})};a.prototype.createAxis=function(b,a){b=new f(this,W(a.axis,{index:this[b].length,isX:"xAxis"===b}));R(a.redraw,!0)&&this.redraw(a.animation);return b};a.prototype.showLoading=function(b){var a=this,c=a.options,d=c.loading,
e=function(){h&&N(h,{left:a.plotLeft+"px",top:a.plotTop+"px",width:a.plotWidth+"px",height:a.plotHeight+"px"})},h=a.loadingDiv,f=a.loadingSpan;h||(a.loadingDiv=h=S("div",{className:"highcharts-loading highcharts-loading-hidden"},null,a.container));f||(a.loadingSpan=f=S("span",{className:"highcharts-loading-inner"},null,h),r(a,"redraw",e));h.className="highcharts-loading";g.setElementHTML(f,R(b,c.lang.loading,""));a.styledMode||(N(h,K(d.style,{zIndex:10})),N(f,d.labelStyle),a.loadingShown||(N(h,{opacity:0,
display:""}),t(h,{opacity:d.style.opacity||.5},{duration:d.showDuration||0})));a.loadingShown=!0;e()};a.prototype.hideLoading=function(){var b=this.options,a=this.loadingDiv;a&&(a.className="highcharts-loading highcharts-loading-hidden",this.styledMode||t(a,{opacity:0},{duration:b.loading.hideDuration||100,complete:function(){N(a,{display:"none"})}}));this.loadingShown=!1};a.prototype.update=function(b,a,d,e){var h=this,g={credits:"addCredits",title:"setTitle",subtitle:"setSubtitle",caption:"setCaption"},
f=b.isResponsiveOptions,l=[],k,m;Q(h,"update",{options:b});f||h.setResponsive(!1,!0);b=P(b,h.options);h.userOptions=W(h.userOptions,b);var p=b.chart;if(p){W(!0,h.options.chart,p);"className"in p&&h.setClassName(p.className);"reflow"in p&&h.setReflow(p.reflow);if("inverted"in p||"polar"in p||"type"in p){h.propFromSeries();var G=!0}"alignTicks"in p&&(G=!0);"events"in p&&x(this,p);Z(p,function(b,a){-1!==h.propsRequireUpdateSeries.indexOf("chart."+a)&&(k=!0);-1!==h.propsRequireDirtyBox.indexOf(a)&&(h.isDirtyBox=
!0);-1!==h.propsRequireReflow.indexOf(a)&&(f?h.isDirtyBox=!0:m=!0)});!h.styledMode&&p.style&&h.renderer.setStyle(h.options.chart.style||{})}!h.styledMode&&b.colors&&(this.options.colors=b.colors);b.time&&(this.time===D&&(this.time=new c(b.time)),W(!0,h.options.time,b.time));Z(b,function(a,c){if(h[c]&&"function"===typeof h[c].update)h[c].update(a,!1);else if("function"===typeof h[g[c]])h[g[c]](a);else"colors"!==c&&-1===h.collectionsWithUpdate.indexOf(c)&&W(!0,h.options[c],b[c]);"chart"!==c&&-1!==h.propsRequireUpdateSeries.indexOf(c)&&
(k=!0)});this.collectionsWithUpdate.forEach(function(a){if(b[a]){var c=[];h[a].forEach(function(b,a){b.options.isInternal||c.push(R(b.options.index,a))});ia(b[a]).forEach(function(b,e){var g=Y(b.id),f;g&&(f=h.get(b.id));!f&&h[a]&&(f=h[a][c?c[e]:e])&&g&&Y(f.options.id)&&(f=void 0);f&&f.coll===a&&(f.update(b,!1),d&&(f.touched=!0));!f&&d&&h.collectionsWithInit[a]&&(h.collectionsWithInit[a][0].apply(h,[b].concat(h.collectionsWithInit[a][1]||[]).concat([!1])).touched=!0)});d&&h[a].forEach(function(b){b.touched||
b.options.isInternal?delete b.touched:l.push(b)})}});l.forEach(function(b){b.chart&&b.remove&&b.remove(!1)});G&&h.axes.forEach(function(b){b.update({},!1)});k&&h.getSeriesOrderByLinks().forEach(function(b){b.chart&&b.update({},!1)},this);G=p&&p.width;p=p&&(V(p.height)?aa(p.height,G||h.chartWidth):p.height);m||T(G)&&G!==h.chartWidth||T(p)&&p!==h.chartHeight?h.setSize(G,p,e):R(a,!0)&&h.redraw(e);Q(h,"afterUpdate",{options:b,redraw:a,animation:e})};a.prototype.setSubtitle=function(b,a){this.applyDescription("subtitle",
b);this.layOutTitles(a)};a.prototype.setCaption=function(b,a){this.applyDescription("caption",b);this.layOutTitles(a)};a.prototype.showResetZoom=function(){function b(){a.zoomOut()}var a=this,c=d.lang,e=a.options.chart.resetZoomButton,h=e.theme,g="chart"===e.relativeTo||"spacingBox"===e.relativeTo?null:"scrollablePlotBox";Q(this,"beforeShowResetZoom",null,function(){a.resetZoomButton=a.renderer.button(c.resetZoom,null,null,b,h).attr({align:e.position.align,title:c.resetZoomTitle}).addClass("highcharts-reset-zoom").add().align(e.position,
!1,g)});Q(this,"afterShowResetZoom")};a.prototype.zoomOut=function(){Q(this,"selection",{resetSelection:!0},this.zoom)};a.prototype.zoom=function(b){var a=this,c=a.pointer,d=a.inverted?c.mouseDownX:c.mouseDownY,e=!1,h;!b||b.resetSelection?(a.axes.forEach(function(b){h=b.zoom()}),c.initiated=!1):b.xAxis.concat(b.yAxis).forEach(function(b){var g=b.axis,f=a.inverted?g.left:g.top,l=a.inverted?f+g.width:f+g.height,k=g.isXAxis,m=!1;if(!k&&d>=f&&d<=l||k||!Y(d))m=!0;c[k?"zoomX":"zoomY"]&&m&&(h=g.zoom(b.min,
b.max),g.displayBtn&&(e=!0))});var g=a.resetZoomButton;e&&!g?a.showResetZoom():!e&&M(g)&&(a.resetZoomButton=g.destroy());h&&a.redraw(R(a.options.chart.animation,b&&b.animation,100>a.pointCount))};a.prototype.pan=function(b,a){var c=this,d=c.hoverPoints;a="object"===typeof a?a:{enabled:a,type:"x"};var e=c.options.chart,h=c.options.mapNavigation&&c.options.mapNavigation.enabled;e&&e.panning&&(e.panning=a);var g=a.type,f;Q(this,"pan",{originalEvent:b},function(){d&&d.forEach(function(b){b.setState()});
var a=c.xAxis;"xy"===g?a=a.concat(c.yAxis):"y"===g&&(a=c.yAxis);var e={};a.forEach(function(a){if(a.options.panningEnabled&&!a.options.isInternal){var d=a.horiz,l=b[d?"chartX":"chartY"];d=d?"mouseDownX":"mouseDownY";var k=c[d],m=a.minPointOffset||0,p=a.reversed&&!c.inverted||!a.reversed&&c.inverted?-1:1,G=a.getExtremes(),n=a.toValue(k-l,!0)+m*p,q=a.toValue(k+a.len-l,!0)-(m*p||a.isXAxis&&a.pointRangePadding||0),r=q<n;p=a.hasVerticalPanning();k=r?q:n;n=r?n:q;var t=a.panningState;!p||a.isXAxis||t&&!t.isDirty||
a.series.forEach(function(b){var a=b.getProcessedData(!0);a=b.getExtremes(a.yData,!0);t||(t={startMin:Number.MAX_VALUE,startMax:-Number.MAX_VALUE});T(a.dataMin)&&T(a.dataMax)&&(t.startMin=Math.min(R(b.options.threshold,Infinity),a.dataMin,t.startMin),t.startMax=Math.max(R(b.options.threshold,-Infinity),a.dataMax,t.startMax))});p=Math.min(R(t&&t.startMin,G.dataMin),m?G.min:a.toValue(a.toPixels(G.min)-a.minPixelPadding));q=Math.max(R(t&&t.startMax,G.dataMax),m?G.max:a.toValue(a.toPixels(G.max)+a.minPixelPadding));
a.panningState=t;a.isOrdinal||(m=p-k,0<m&&(n+=m,k=p),m=n-q,0<m&&(n=q,k-=m),a.series.length&&k!==G.min&&n!==G.max&&k>=p&&n<=q&&(a.setExtremes(k,n,!1,!1,{trigger:"pan"}),c.resetZoomButton||h||k===p||n===q||!g.match("y")||(c.showResetZoom(),a.displayBtn=!1),f=!0),e[d]=l)}});Z(e,function(b,a){c[a]=b});f&&c.redraw(!1);N(c.container,{cursor:"move"})})};return a}();K(a.prototype,{callbacks:[],collectionsWithInit:{xAxis:[a.prototype.addAxis,[!0]],yAxis:[a.prototype.addAxis,[!1]],series:[a.prototype.addSeries]},
collectionsWithUpdate:["xAxis","yAxis","series"],propsRequireDirtyBox:"backgroundColor borderColor borderWidth borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),propsRequireReflow:"margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft".split(" "),propsRequireUpdateSeries:"chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions time tooltip".split(" ")});
"";return a});K(f,"Core/Legend/LegendSymbol.js",[f["Core/Utilities.js"]],function(a){var f=a.merge,B=a.pick,H;(function(a){a.drawLineMarker=function(a){var w=this.options,A=a.symbolWidth,u=a.symbolHeight,n=u/2,k=this.chart.renderer,e=this.legendGroup;a=a.baseline-Math.round(.3*a.fontMetrics.b);var c={},p=w.marker;this.chart.styledMode||(c={"stroke-width":w.lineWidth||0},w.dashStyle&&(c.dashstyle=w.dashStyle));this.legendLine=k.path([["M",0,a],["L",A,a]]).addClass("highcharts-graph").attr(c).add(e);
p&&!1!==p.enabled&&A&&(w=Math.min(B(p.radius,n),n),0===this.symbol.indexOf("url")&&(p=f(p,{width:u,height:u}),w=0),this.legendSymbol=A=k.symbol(this.symbol,A/2-w,a-w,2*w,2*w,p).addClass("highcharts-point").add(e),A.isMarker=!0)};a.drawRectangle=function(a,f){var w=a.symbolHeight,u=a.options.squareSymbol;f.legendSymbol=this.chart.renderer.rect(u?(a.symbolWidth-w)/2:0,a.baseline-w+1,u?w:a.symbolWidth,w,B(a.options.symbolRadius,w/2)).addClass("highcharts-point").attr({zIndex:3}).add(f.legendGroup)}})(H||
(H={}));return H});K(f,"Core/Series/SeriesDefaults.js",[],function(){return{lineWidth:2,allowPointSelect:!1,crisp:!0,showCheckbox:!1,animation:{duration:1E3},events:{},marker:{enabledThreshold:2,lineColor:"#ffffff",lineWidth:0,radius:4,states:{normal:{animation:!0},hover:{animation:{duration:50},enabled:!0,radiusPlus:2,lineWidthPlus:1},select:{fillColor:"#cccccc",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:{animation:{},align:"center",defer:!0,formatter:function(){var a=this.series.chart.numberFormatter;
return"number"!==typeof this.y?"":a(this.y,-1)},padding:5,style:{fontSize:"11px",fontWeight:"bold",color:"contrast",textOutline:"1px contrast"},verticalAlign:"bottom",x:0,y:0},cropThreshold:300,opacity:1,pointRange:0,softThreshold:!0,states:{normal:{animation:!0},hover:{animation:{duration:50},lineWidthPlus:1,marker:{},halo:{size:10,opacity:.25}},select:{animation:{duration:0}},inactive:{animation:{duration:50},opacity:.2}},stickyTracking:!0,turboThreshold:1E3,findNearestPointBy:"x"}});K(f,"Core/Series/Series.js",
[f["Core/Animation/AnimationUtilities.js"],f["Core/DefaultOptions.js"],f["Core/Foundation.js"],f["Core/Globals.js"],f["Core/Legend/LegendSymbol.js"],f["Core/Series/Point.js"],f["Core/Series/SeriesDefaults.js"],f["Core/Series/SeriesRegistry.js"],f["Core/Renderer/SVG/SVGElement.js"],f["Core/Utilities.js"]],function(a,f,B,H,w,E,I,A,u,n){var k=a.animObject,e=a.setAnimation,c=f.defaultOptions,p=B.registerEventOptions,g=H.hasTouch,t=H.svg,q=H.win,F=A.seriesTypes,y=n.addEvent,x=n.arrayMax,z=n.arrayMin,m=
n.clamp,h=n.cleanRecursively,b=n.correctFloat,l=n.defined,d=n.erase,D=n.error,v=n.extend,r=n.find,C=n.fireEvent,P=n.getNestedProperty,S=n.isArray,N=n.isNumber,Y=n.isString,X=n.merge,J=n.objectEach,L=n.pick,K=n.removeEvent,da=n.splat,Q=n.syncTimeout;a=function(){function a(){this.zones=this.yAxis=this.xAxis=this.userOptions=this.tooltipOptions=this.processedYData=this.processedXData=this.points=this.options=this.linkedSeries=this.index=this.eventsToUnbind=this.eventOptions=this.data=this.chart=this._i=
void 0}a.prototype.init=function(b,a){C(this,"init",{options:a});var c=this,d=b.series;this.eventsToUnbind=[];c.chart=b;c.options=c.setOptions(a);a=c.options;c.linkedSeries=[];c.bindAxes();v(c,{name:a.name,state:"",visible:!1!==a.visible,selected:!0===a.selected});p(this,a);var e=a.events;if(e&&e.click||a.point&&a.point.events&&a.point.events.click||a.allowPointSelect)b.runTrackerClick=!0;c.getColor();c.getSymbol();c.parallelArrays.forEach(function(b){c[b+"Data"]||(c[b+"Data"]=[])});c.isCartesian&&
(b.hasCartesianSeries=!0);var h;d.length&&(h=d[d.length-1]);c._i=L(h&&h._i,-1)+1;c.opacity=c.options.opacity;b.orderSeries(this.insert(d));a.dataSorting&&a.dataSorting.enabled?c.setDataSortingOptions():c.points||c.data||c.setData(a.data,!1);C(this,"afterInit")};a.prototype.is=function(b){return F[b]&&this instanceof F[b]};a.prototype.insert=function(b){var a=this.options.index,c;if(N(a)){for(c=b.length;c--;)if(a>=L(b[c].options.index,b[c]._i)){b.splice(c+1,0,this);break}-1===c&&b.unshift(this);c+=
1}else b.push(this);return L(c,b.length-1)};a.prototype.bindAxes=function(){var b=this,a=b.options,c=b.chart,d;C(this,"bindAxes",null,function(){(b.axisTypes||[]).forEach(function(e){var h=0;c[e].forEach(function(c){d=c.options;if(a[e]===h&&!d.isInternal||"undefined"!==typeof a[e]&&a[e]===d.id||"undefined"===typeof a[e]&&0===d.index)b.insert(c.series),b[e]=c,c.isDirty=!0;d.isInternal||h++});b[e]||b.optionalAxis===e||D(18,!0,c)})});C(this,"afterBindAxes")};a.prototype.updateParallelArrays=function(b,
a){var c=b.series,d=arguments,e=N(a)?function(d){var e="y"===d&&c.toYData?c.toYData(b):b[d];c[d+"Data"][a]=e}:function(b){Array.prototype[a].apply(c[b+"Data"],Array.prototype.slice.call(d,2))};c.parallelArrays.forEach(e)};a.prototype.hasData=function(){return this.visible&&"undefined"!==typeof this.dataMax&&"undefined"!==typeof this.dataMin||this.visible&&this.yData&&0<this.yData.length};a.prototype.autoIncrement=function(b){var a=this.options,c=a.pointIntervalUnit,d=a.relativeXValue,e=this.chart.time,
h=this.xIncrement,g;h=L(h,a.pointStart,0);this.pointInterval=g=L(this.pointInterval,a.pointInterval,1);d&&N(b)&&(g*=b);c&&(a=new e.Date(h),"day"===c?e.set("Date",a,e.get("Date",a)+g):"month"===c?e.set("Month",a,e.get("Month",a)+g):"year"===c&&e.set("FullYear",a,e.get("FullYear",a)+g),g=a.getTime()-h);if(d&&N(b))return h+g;this.xIncrement=h+g;return h};a.prototype.setDataSortingOptions=function(){var b=this.options;v(this,{requireSorting:!1,sorted:!1,enabledDataSorting:!0,allowDG:!1});l(b.pointRange)||
(b.pointRange=1)};a.prototype.setOptions=function(b){var a=this.chart,d=a.options,e=d.plotOptions,h=a.userOptions||{};b=X(b);a=a.styledMode;var g={plotOptions:e,userOptions:b};C(this,"setOptions",g);var f=g.plotOptions[this.type],k=h.plotOptions||{};this.userOptions=g.userOptions;h=X(f,e.series,h.plotOptions&&h.plotOptions[this.type],b);this.tooltipOptions=X(c.tooltip,c.plotOptions.series&&c.plotOptions.series.tooltip,c.plotOptions[this.type].tooltip,d.tooltip.userOptions,e.series&&e.series.tooltip,
e[this.type].tooltip,b.tooltip);this.stickyTracking=L(b.stickyTracking,k[this.type]&&k[this.type].stickyTracking,k.series&&k.series.stickyTracking,this.tooltipOptions.shared&&!this.noSharedTooltip?!0:h.stickyTracking);null===f.marker&&delete h.marker;this.zoneAxis=h.zoneAxis;e=this.zones=(h.zones||[]).slice();!h.negativeColor&&!h.negativeFillColor||h.zones||(d={value:h[this.zoneAxis+"Threshold"]||h.threshold||0,className:"highcharts-negative"},a||(d.color=h.negativeColor,d.fillColor=h.negativeFillColor),
e.push(d));e.length&&l(e[e.length-1].value)&&e.push(a?{}:{color:this.color,fillColor:this.fillColor});C(this,"afterSetOptions",{options:h});return h};a.prototype.getName=function(){return L(this.options.name,"Series "+(this.index+1))};a.prototype.getCyclic=function(b,a,c){var d=this.chart,e=this.userOptions,h=b+"Index",g=b+"Counter",f=c?c.length:L(d.options.chart[b+"Count"],d[b+"Count"]);if(!a){var k=L(e[h],e["_"+h]);l(k)||(d.series.length||(d[g]=0),e["_"+h]=k=d[g]%f,d[g]+=1);c&&(a=c[k])}"undefined"!==
typeof k&&(this[h]=k);this[b]=a};a.prototype.getColor=function(){this.chart.styledMode?this.getCyclic("color"):this.options.colorByPoint?this.color="#cccccc":this.getCyclic("color",this.options.color||c.plotOptions[this.type].color,this.chart.options.colors)};a.prototype.getPointsCollection=function(){return(this.hasGroupedData?this.points:this.data)||[]};a.prototype.getSymbol=function(){this.getCyclic("symbol",this.options.marker.symbol,this.chart.options.symbols)};a.prototype.findPointIndex=function(b,
a){var c=b.id,d=b.x,e=this.points,h=this.options.dataSorting,g,f;if(c)h=this.chart.get(c),h instanceof E&&(g=h);else if(this.linkedParent||this.enabledDataSorting||this.options.relativeXValue)if(g=function(a){return!a.touched&&a.index===b.index},h&&h.matchByName?g=function(a){return!a.touched&&a.name===b.name}:this.options.relativeXValue&&(g=function(a){return!a.touched&&a.options.x===b.x}),g=r(e,g),!g)return;if(g){var l=g&&g.index;"undefined"!==typeof l&&(f=!0)}"undefined"===typeof l&&N(d)&&(l=this.xData.indexOf(d,
a));-1!==l&&"undefined"!==typeof l&&this.cropped&&(l=l>=this.cropStart?l-this.cropStart:l);!f&&N(l)&&e[l]&&e[l].touched&&(l=void 0);return l};a.prototype.updateData=function(b,a){var c=this.options,d=c.dataSorting,e=this.points,h=[],g=this.requireSorting,f=b.length===e.length,k,m,p,n=!0;this.xIncrement=null;b.forEach(function(b,a){var m=l(b)&&this.pointClass.prototype.optionsToObject.call({series:this},b)||{},n=m.x;if(m.id||N(n)){if(m=this.findPointIndex(m,p),-1===m||"undefined"===typeof m?h.push(b):
e[m]&&b!==c.data[m]?(e[m].update(b,!1,null,!1),e[m].touched=!0,g&&(p=m+1)):e[m]&&(e[m].touched=!0),!f||a!==m||d&&d.enabled||this.hasDerivedData)k=!0}else h.push(b)},this);if(k)for(b=e.length;b--;)(m=e[b])&&!m.touched&&m.remove&&m.remove(!1,a);else!f||d&&d.enabled?n=!1:(b.forEach(function(b,a){b!==e[a].y&&e[a].update&&e[a].update(b,!1,null,!1)}),h.length=0);e.forEach(function(b){b&&(b.touched=!1)});if(!n)return!1;h.forEach(function(b){this.addPoint(b,!1,null,null,!1)},this);null===this.xIncrement&&
this.xData&&this.xData.length&&(this.xIncrement=x(this.xData),this.autoIncrement());return!0};a.prototype.setData=function(b,a,c,d){var e=this,h=e.points,g=h&&h.length||0,f=e.options,l=e.chart,k=f.dataSorting,m=e.xAxis,p=f.turboThreshold,n=this.xData,q=this.yData,r=e.pointArrayMap;r=r&&r.length;var G=f.keys,t,y=0,z=1,x=null;if(!l.options.chart.allowMutatingData){f.data&&delete e.options.data;e.userOptions.data&&delete e.userOptions.data;var v=X(!0,b)}b=v||b||[];v=b.length;a=L(a,!0);k&&k.enabled&&
(b=this.sortData(b));l.options.chart.allowMutatingData&&!1!==d&&v&&g&&!e.cropped&&!e.hasGroupedData&&e.visible&&!e.isSeriesBoosting&&(t=this.updateData(b,c));if(!t){e.xIncrement=null;e.colorCounter=0;this.parallelArrays.forEach(function(b){e[b+"Data"].length=0});if(p&&v>p)if(x=e.getFirstValidPoint(b),N(x))for(c=0;c<v;c++)n[c]=this.autoIncrement(),q[c]=b[c];else if(S(x))if(r)if(x.length===r)for(c=0;c<v;c++)n[c]=this.autoIncrement(),q[c]=b[c];else for(c=0;c<v;c++)d=b[c],n[c]=d[0],q[c]=d.slice(1,r+1);
else if(G&&(y=G.indexOf("x"),z=G.indexOf("y"),y=0<=y?y:0,z=0<=z?z:1),1===x.length&&(z=0),y===z)for(c=0;c<v;c++)n[c]=this.autoIncrement(),q[c]=b[c][z];else for(c=0;c<v;c++)d=b[c],n[c]=d[y],q[c]=d[z];else D(12,!1,l);else for(c=0;c<v;c++)"undefined"!==typeof b[c]&&(d={series:e},e.pointClass.prototype.applyOptions.apply(d,[b[c]]),e.updateParallelArrays(d,c));q&&Y(q[0])&&D(14,!0,l);e.data=[];e.options.data=e.userOptions.data=b;for(c=g;c--;)h[c]&&h[c].destroy&&h[c].destroy();m&&(m.minRange=m.userMinRange);
e.isDirty=l.isDirtyBox=!0;e.isDirtyData=!!h;c=!1}"point"===f.legendType&&(this.processData(),this.generatePoints());a&&l.redraw(c)};a.prototype.sortData=function(b){var a=this,c=a.options.dataSorting.sortKey||"y",d=function(b,a){return l(a)&&b.pointClass.prototype.optionsToObject.call({series:b},a)||{}};b.forEach(function(c,e){b[e]=d(a,c);b[e].index=e},this);b.concat().sort(function(b,a){b=P(c,b);a=P(c,a);return a<b?-1:a>b?1:0}).forEach(function(b,a){b.x=a},this);a.linkedSeries&&a.linkedSeries.forEach(function(a){var c=
a.options,e=c.data;c.dataSorting&&c.dataSorting.enabled||!e||(e.forEach(function(c,h){e[h]=d(a,c);b[h]&&(e[h].x=b[h].x,e[h].index=h)}),a.setData(e,!1))});return b};a.prototype.getProcessedData=function(b){var a=this.xAxis,c=this.options,d=c.cropThreshold,e=b||this.getExtremesFromAll||c.getExtremesFromAll,h=this.isCartesian;b=a&&a.val2lin;c=!(!a||!a.logarithmic);var g=0,f=this.xData,l=this.yData,k=this.requireSorting;var m=!1;var p=f.length;if(a){m=a.getExtremes();var n=m.min;var q=m.max;m=!(!a.categories||
a.names.length)}if(h&&this.sorted&&!e&&(!d||p>d||this.forceCrop))if(f[p-1]<n||f[0]>q)f=[],l=[];else if(this.yData&&(f[0]<n||f[p-1]>q)){var r=this.cropData(this.xData,this.yData,n,q);f=r.xData;l=r.yData;g=r.start;r=!0}for(d=f.length||1;--d;)if(a=c?b(f[d])-b(f[d-1]):f[d]-f[d-1],0<a&&("undefined"===typeof G||a<G))var G=a;else 0>a&&k&&!m&&(D(15,!1,this.chart),k=!1);return{xData:f,yData:l,cropped:r,cropStart:g,closestPointRange:G}};a.prototype.processData=function(b){var a=this.xAxis;if(this.isCartesian&&
!this.isDirty&&!a.isDirty&&!this.yAxis.isDirty&&!b)return!1;b=this.getProcessedData();this.cropped=b.cropped;this.cropStart=b.cropStart;this.processedXData=b.xData;this.processedYData=b.yData;this.closestPointRange=this.basePointRange=b.closestPointRange;C(this,"afterProcessData")};a.prototype.cropData=function(b,a,c,d,e){var h=b.length,g,f=0,l=h;e=L(e,this.cropShoulder);for(g=0;g<h;g++)if(b[g]>=c){f=Math.max(0,g-e);break}for(c=g;c<h;c++)if(b[c]>d){l=c+e;break}return{xData:b.slice(f,l),yData:a.slice(f,
l),start:f,end:l}};a.prototype.generatePoints=function(){var b=this.options,a=this.processedData||b.data,c=this.processedXData,d=this.processedYData,e=this.pointClass,h=c.length,g=this.cropStart||0,f=this.hasGroupedData,l=b.keys,k=[];b=b.dataGrouping&&b.dataGrouping.groupAll?g:0;var m,p,n=this.data;if(!n&&!f){var q=[];q.length=a.length;n=this.data=q}l&&f&&(this.options.keys=!1);for(p=0;p<h;p++){q=g+p;if(f){var r=(new e).init(this,[c[p]].concat(da(d[p])));r.dataGroup=this.groupMap[b+p];r.dataGroup.options&&
(r.options=r.dataGroup.options,v(r,r.dataGroup.options),delete r.dataLabels)}else(r=n[q])||"undefined"===typeof a[q]||(n[q]=r=(new e).init(this,a[q],c[p]));r&&(r.index=f?b+p:q,k[p]=r)}this.options.keys=l;if(n&&(h!==(m=n.length)||f))for(p=0;p<m;p++)p!==g||f||(p+=h),n[p]&&(n[p].destroyElements(),n[p].plotX=void 0);this.data=n;this.points=k;C(this,"afterGeneratePoints")};a.prototype.getXExtremes=function(b){return{min:z(b),max:x(b)}};a.prototype.getExtremes=function(b,a){var c=this.xAxis,d=this.yAxis,
e=this.processedXData||this.xData,h=[],g=this.requireSorting?this.cropShoulder:0;d=d?d.positiveValuesOnly:!1;var f,l=0,k=0,m=0;b=b||this.stackedYData||this.processedYData||[];var p=b.length;if(c){var n=c.getExtremes();l=n.min;k=n.max}for(f=0;f<p;f++){var q=e[f];n=b[f];var r=(N(n)||S(n))&&(n.length||0<n||!d);q=a||this.getExtremesFromAll||this.options.getExtremesFromAll||this.cropped||!c||(e[f+g]||q)>=l&&(e[f-g]||q)<=k;if(r&&q)if(r=n.length)for(;r--;)N(n[r])&&(h[m++]=n[r]);else h[m++]=n}b={activeYData:h,
dataMin:z(h),dataMax:x(h)};C(this,"afterGetExtremes",{dataExtremes:b});return b};a.prototype.applyExtremes=function(){var b=this.getExtremes();this.dataMin=b.dataMin;this.dataMax=b.dataMax;return b};a.prototype.getFirstValidPoint=function(b){for(var a=b.length,c=0,d=null;null===d&&c<a;)d=b[c],c++;return d};a.prototype.translate=function(){this.processedXData||this.processData();this.generatePoints();var a=this.options,c=a.stacking,d=this.xAxis,e=d.categories,h=this.enabledDataSorting,g=this.yAxis,
f=this.points,k=f.length,p=this.pointPlacementToXValue(),n=!!p,q=a.threshold,r=a.startFromThreshold?q:0,t=this.zoneAxis||"y",y,z,x=Number.MAX_VALUE;for(y=0;y<k;y++){var v=f[y],F=v.x,u=void 0,D=void 0,w=v.y,A=v.low,B=c&&g.stacking&&g.stacking.stacks[(this.negStacks&&w<(r?0:q)?"-":"")+this.stackKey];if(g.positiveValuesOnly&&!g.validatePositiveValue(w)||d.positiveValuesOnly&&!d.validatePositiveValue(F))v.isNull=!0;v.plotX=z=b(m(d.translate(F,0,0,0,1,p,"flags"===this.type),-1E5,1E5));if(c&&this.visible&&
B&&B[F]){var H=this.getStackIndicator(H,F,this.index);v.isNull||(u=B[F],D=u.points[H.key])}S(D)&&(A=D[0],w=D[1],A===r&&H.key===B[F].base&&(A=L(N(q)&&q,g.min)),g.positiveValuesOnly&&0>=A&&(A=null),v.total=v.stackTotal=u.total,v.percentage=u.total&&v.y/u.total*100,v.stackY=w,this.irregularWidths||u.setOffset(this.pointXOffset||0,this.barW||0));v.yBottom=l(A)?m(g.translate(A,0,1,0,1),-1E5,1E5):null;this.dataModify&&(w=this.dataModify.modifyValue(w,y));v.plotY=void 0;N(w)&&(u=g.translate(w,!1,!0,!1,!0),
"undefined"!==typeof u&&(v.plotY=m(u,-1E5,1E5)));v.isInside=this.isPointInside(v);v.clientX=n?b(d.translate(F,0,0,0,1,p)):z;v.negative=v[t]<(a[t+"Threshold"]||q||0);v.category=L(e&&e[v.x],v.x);if(!v.isNull&&!1!==v.visible){"undefined"!==typeof I&&(x=Math.min(x,Math.abs(z-I)));var I=z}v.zone=this.zones.length?v.getZone():void 0;!v.graphic&&this.group&&h&&(v.isNew=!0)}this.closestPointRangePx=x;C(this,"afterTranslate")};a.prototype.getValidPoints=function(b,a,c){var d=this.chart;return(b||this.points||
[]).filter(function(b){return a&&!d.isInsidePlot(b.plotX,b.plotY,{inverted:d.inverted})?!1:!1!==b.visible&&(c||!b.isNull)})};a.prototype.getClipBox=function(){var b=this.chart,a=this.xAxis,c=this.yAxis,d=X(b.clipBox);a&&a.len!==b.plotSizeX&&(d.width=a.len);c&&c.len!==b.plotSizeY&&(d.height=c.len);return d};a.prototype.getSharedClipKey=function(){return this.sharedClipKey=(this.options.xAxis||0)+","+(this.options.yAxis||0)};a.prototype.setClip=function(){var b=this.chart,a=this.group,c=this.markerGroup,
d=b.sharedClips;b=b.renderer;var e=this.getClipBox(),h=this.getSharedClipKey(),g=d[h];g?g.animate(e):d[h]=g=b.clipRect(e);a&&a.clip(!1===this.options.clip?void 0:g);c&&c.clip()};a.prototype.animate=function(b){var a=this.chart,c=this.group,d=this.markerGroup,e=a.inverted,h=k(this.options.animation),g=[this.getSharedClipKey(),h.duration,h.easing,h.defer].join(),f=a.sharedClips[g],l=a.sharedClips[g+"m"];if(b&&c)h=this.getClipBox(),f?f.attr("height",h.height):(h.width=0,e&&(h.x=a.plotHeight),f=a.renderer.clipRect(h),
a.sharedClips[g]=f,l=a.renderer.clipRect({x:e?(a.plotSizeX||0)+99:-99,y:e?-a.plotLeft:-a.plotTop,width:99,height:e?a.chartWidth:a.chartHeight}),a.sharedClips[g+"m"]=l),c.clip(f),d&&d.clip(l);else if(f&&!f.hasClass("highcharts-animating")){a=this.getClipBox();var m=h.step;d&&d.element.childNodes.length&&(h.step=function(b,a){m&&m.apply(a,arguments);l&&l.element&&l.attr(a.prop,"width"===a.prop?b+99:b)});f.addClass("highcharts-animating").animate(a,h)}};a.prototype.afterAnimate=function(){var b=this;
this.setClip();J(this.chart.sharedClips,function(a,c,d){a&&!b.chart.container.querySelector('[clip-path="url(#'+a.id+')"]')&&(a.destroy(),delete d[c])});this.finishedAnimating=!0;C(this,"afterAnimate")};a.prototype.drawPoints=function(){var b=this.points,a=this.chart,c=this.options.marker,d=this[this.specialGroup]||this.markerGroup,e=this.xAxis,h=L(c.enabled,!e||e.isRadial?!0:null,this.closestPointRangePx>=c.enabledThreshold*c.radius),g,f;if(!1!==c.enabled||this._hasPointMarkers)for(g=0;g<b.length;g++){var l=
b[g];var k=(f=l.graphic)?"animate":"attr";var m=l.marker||{};var p=!!l.marker;if((h&&"undefined"===typeof m.enabled||m.enabled)&&!l.isNull&&!1!==l.visible){var n=L(m.symbol,this.symbol,"rect");var q=this.markerAttribs(l,l.selected&&"select");this.enabledDataSorting&&(l.startXPos=e.reversed?-(q.width||0):e.width);var r=!1!==l.isInside;f?f[r?"show":"hide"](r).animate(q):r&&(0<(q.width||0)||l.hasImage)&&(l.graphic=f=a.renderer.symbol(n,q.x,q.y,q.width,q.height,p?m:c).add(d),this.enabledDataSorting&&
a.hasRendered&&(f.attr({x:l.startXPos}),k="animate"));f&&"animate"===k&&f[r?"show":"hide"](r).animate(q);if(f&&!a.styledMode)f[k](this.pointAttribs(l,l.selected&&"select"));f&&f.addClass(l.getClassName(),!0)}else f&&(l.graphic=f.destroy())}};a.prototype.markerAttribs=function(b,a){var c=this.options,d=c.marker,e=b.marker||{},h=e.symbol||d.symbol,g=L(e.radius,d&&d.radius);a&&(d=d.states[a],a=e.states&&e.states[a],g=L(a&&a.radius,d&&d.radius,g&&g+(d&&d.radiusPlus||0)));b.hasImage=h&&0===h.indexOf("url");
b.hasImage&&(g=0);b=N(g)?{x:c.crisp?Math.floor(b.plotX-g):b.plotX-g,y:b.plotY-g}:{};g&&(b.width=b.height=2*g);return b};a.prototype.pointAttribs=function(b,a){var c=this.options.marker,d=b&&b.options,e=d&&d.marker||{},h=d&&d.color,g=b&&b.color,f=b&&b.zone&&b.zone.color,l=this.color;b=L(e.lineWidth,c.lineWidth);d=1;l=h||f||g||l;h=e.fillColor||c.fillColor||l;g=e.lineColor||c.lineColor||l;a=a||"normal";c=c.states[a]||{};a=e.states&&e.states[a]||{};b=L(a.lineWidth,c.lineWidth,b+L(a.lineWidthPlus,c.lineWidthPlus,
0));h=a.fillColor||c.fillColor||h;g=a.lineColor||c.lineColor||g;d=L(a.opacity,c.opacity,d);return{stroke:g,"stroke-width":b,fill:h,opacity:d}};a.prototype.destroy=function(b){var a=this,c=a.chart,e=/AppleWebKit\/533/.test(q.navigator.userAgent),h=a.data||[],g,f,l,k;C(a,"destroy",{keepEventsForUpdate:b});this.removeEvents(b);(a.axisTypes||[]).forEach(function(b){(k=a[b])&&k.series&&(d(k.series,a),k.isDirty=k.forceRedraw=!0)});a.legendItem&&a.chart.legend.destroyItem(a);for(f=h.length;f--;)(l=h[f])&&
l.destroy&&l.destroy();a.clips&&a.clips.forEach(function(b){return b.destroy()});n.clearTimeout(a.animationTimeout);J(a,function(b,a){b instanceof u&&!b.survive&&(g=e&&"group"===a?"hide":"destroy",b[g]())});c.hoverSeries===a&&(c.hoverSeries=void 0);d(c.series,a);c.orderSeries();J(a,function(c,d){b&&"hcEvents"===d||delete a[d]})};a.prototype.applyZones=function(){var b=this,a=this.chart,c=a.renderer,d=this.zones,e=this.clips||[],h=this.graph,g=this.area,f=Math.max(a.chartWidth,a.chartHeight),l=this[(this.zoneAxis||
"y")+"Axis"],k=a.inverted,p,n,q,r,t,y,v,z,x=!1;if(d.length&&(h||g)&&l&&"undefined"!==typeof l.min){var F=l.reversed;var u=l.horiz;h&&!this.showLine&&h.hide();g&&g.hide();var D=l.getExtremes();d.forEach(function(d,G){p=F?u?a.plotWidth:0:u?0:l.toPixels(D.min)||0;p=m(L(n,p),0,f);n=m(Math.round(l.toPixels(L(d.value,D.max),!0)||0),0,f);x&&(p=n=l.toPixels(D.max));r=Math.abs(p-n);t=Math.min(p,n);y=Math.max(p,n);l.isXAxis?(q={x:k?y:t,y:0,width:r,height:f},u||(q.x=a.plotHeight-q.x)):(q={x:0,y:k?y:t,width:f,
height:r},u&&(q.y=a.plotWidth-q.y));k&&c.isVML&&(q=l.isXAxis?{x:0,y:F?t:y,height:q.width,width:a.chartWidth}:{x:q.y-a.plotLeft-a.spacingBox.x,y:0,width:q.height,height:a.chartHeight});e[G]?e[G].animate(q):e[G]=c.clipRect(q);v=b["zone-area-"+G];z=b["zone-graph-"+G];h&&z&&z.clip(e[G]);g&&v&&v.clip(e[G]);x=d.value>D.max;b.resetZones&&0===n&&(n=void 0)});this.clips=e}else b.visible&&(h&&h.show(),g&&g.show())};a.prototype.invertGroups=function(b){function a(){["group","markerGroup"].forEach(function(a){c[a]&&
(d.renderer.isVML&&c[a].attr({width:c.yAxis.len,height:c.xAxis.len}),c[a].width=c.yAxis.len,c[a].height=c.xAxis.len,c[a].invert(c.isRadialSeries?!1:b))})}var c=this,d=c.chart;c.xAxis&&(c.eventsToUnbind.push(y(d,"resize",a)),a(),c.invertGroups=a)};a.prototype.plotGroup=function(b,a,c,d,e){var h=this[b],g=!h;c={visibility:c,zIndex:d||.1};"undefined"===typeof this.opacity||this.chart.styledMode||"inactive"===this.state||(c.opacity=this.opacity);g&&(this[b]=h=this.chart.renderer.g().add(e));h.addClass("highcharts-"+
a+" highcharts-series-"+this.index+" highcharts-"+this.type+"-series "+(l(this.colorIndex)?"highcharts-color-"+this.colorIndex+" ":"")+(this.options.className||"")+(h.hasClass("highcharts-tracker")?" highcharts-tracker":""),!0);h.attr(c)[g?"attr":"animate"](this.getPlotBox());return h};a.prototype.getPlotBox=function(){var b=this.chart,a=this.xAxis,c=this.yAxis;b.inverted&&(a=c,c=this.xAxis);return{translateX:a?a.left:b.plotLeft,translateY:c?c.top:b.plotTop,scaleX:1,scaleY:1}};a.prototype.removeEvents=
function(b){b||K(this);this.eventsToUnbind.length&&(this.eventsToUnbind.forEach(function(b){b()}),this.eventsToUnbind.length=0)};a.prototype.render=function(){var b=this,a=b.chart,c=b.options,d=k(c.animation),e=b.visible?"inherit":"hidden",h=c.zIndex,g=b.hasRendered,f=a.seriesGroup,l=a.inverted;a=!b.finishedAnimating&&a.renderer.isSVG?d.duration:0;C(this,"render");var m=b.plotGroup("group","series",e,h,f);b.markerGroup=b.plotGroup("markerGroup","markers",e,h,f);!1!==c.clip&&b.setClip();b.animate&&
a&&b.animate(!0);m.inverted=L(b.invertible,b.isCartesian)?l:!1;b.drawGraph&&(b.drawGraph(),b.applyZones());b.visible&&b.drawPoints();b.drawDataLabels&&b.drawDataLabels();b.redrawPoints&&b.redrawPoints();b.drawTracker&&!1!==b.options.enableMouseTracking&&b.drawTracker();b.invertGroups(l);b.animate&&a&&b.animate();g||(a&&d.defer&&(a+=d.defer),b.animationTimeout=Q(function(){b.afterAnimate()},a||0));b.isDirty=!1;b.hasRendered=!0;C(b,"afterRender")};a.prototype.redraw=function(){var b=this.chart,a=this.isDirty||
this.isDirtyData,c=this.group,d=this.xAxis,e=this.yAxis;c&&(b.inverted&&c.attr({width:b.plotWidth,height:b.plotHeight}),c.animate({translateX:L(d&&d.left,b.plotLeft),translateY:L(e&&e.top,b.plotTop)}));this.translate();this.render();a&&delete this.kdTree};a.prototype.searchPoint=function(b,a){var c=this.xAxis,d=this.yAxis,e=this.chart.inverted;return this.searchKDTree({clientX:e?c.len-b.chartY+c.pos:b.chartX-c.pos,plotY:e?d.len-b.chartX+d.pos:b.chartY-d.pos},a,b)};a.prototype.buildKDTree=function(b){function a(b,
d,e){var h=b&&b.length;if(h){var g=c.kdAxisArray[d%e];b.sort(function(b,a){return b[g]-a[g]});h=Math.floor(h/2);return{point:b[h],left:a(b.slice(0,h),d+1,e),right:a(b.slice(h+1),d+1,e)}}}this.buildingKdTree=!0;var c=this,d=-1<c.options.findNearestPointBy.indexOf("y")?2:1;delete c.kdTree;Q(function(){c.kdTree=a(c.getValidPoints(null,!c.directTouch),d,d);c.buildingKdTree=!1},c.options.kdNow||b&&"touchstart"===b.type?0:1)};a.prototype.searchKDTree=function(b,a,c){function d(b,a,c,k){var m=a.point,p=
e.kdAxisArray[c%k],n=m,q=l(b[h])&&l(m[h])?Math.pow(b[h]-m[h],2):null;var r=l(b[g])&&l(m[g])?Math.pow(b[g]-m[g],2):null;r=(q||0)+(r||0);m.dist=l(r)?Math.sqrt(r):Number.MAX_VALUE;m.distX=l(q)?Math.sqrt(q):Number.MAX_VALUE;p=b[p]-m[p];r=0>p?"left":"right";q=0>p?"right":"left";a[r]&&(r=d(b,a[r],c+1,k),n=r[f]<n[f]?r:m);a[q]&&Math.sqrt(p*p)<n[f]&&(b=d(b,a[q],c+1,k),n=b[f]<n[f]?b:n);return n}var e=this,h=this.kdAxisArray[0],g=this.kdAxisArray[1],f=a?"distX":"dist";a=-1<e.options.findNearestPointBy.indexOf("y")?
2:1;this.kdTree||this.buildingKdTree||this.buildKDTree(c);if(this.kdTree)return d(b,this.kdTree,a,a)};a.prototype.pointPlacementToXValue=function(){var b=this.options,a=b.pointRange,c=this.xAxis;b=b.pointPlacement;"between"===b&&(b=c.reversed?-.5:.5);return N(b)?b*(a||c.pointRange):0};a.prototype.isPointInside=function(b){var a=this.chart,c=this.xAxis,d=this.yAxis;return"undefined"!==typeof b.plotY&&"undefined"!==typeof b.plotX&&0<=b.plotY&&b.plotY<=(d?d.len:a.plotHeight)&&0<=b.plotX&&b.plotX<=(c?
c.len:a.plotWidth)};a.prototype.drawTracker=function(){var b=this,a=b.options,c=a.trackByArea,d=[].concat(c?b.areaPath:b.graphPath),e=b.chart,h=e.pointer,f=e.renderer,l=e.options.tooltip.snap,k=b.tracker,m=function(a){if(e.hoverSeries!==b)b.onMouseOver()},p="rgba(192,192,192,"+(t?.0001:.002)+")";k?k.attr({d:d}):b.graph&&(b.tracker=f.path(d).attr({visibility:b.visible?"inherit":"hidden",zIndex:2}).addClass(c?"highcharts-tracker-area":"highcharts-tracker-line").add(b.group),e.styledMode||b.tracker.attr({"stroke-linecap":"round",
"stroke-linejoin":"round",stroke:p,fill:c?p:"none","stroke-width":b.graph.strokeWidth()+(c?0:2*l)}),[b.tracker,b.markerGroup,b.dataLabelsGroup].forEach(function(b){if(b&&(b.addClass("highcharts-tracker").on("mouseover",m).on("mouseout",function(b){h.onTrackerMouseOut(b)}),a.cursor&&!e.styledMode&&b.css({cursor:a.cursor}),g))b.on("touchstart",m)}));C(this,"afterDrawTracker")};a.prototype.addPoint=function(b,a,c,d,e){var h=this.options,g=this.data,f=this.chart,l=this.xAxis;l=l&&l.hasNames&&l.names;
var k=h.data,m=this.xData,p;a=L(a,!0);var n={series:this};this.pointClass.prototype.applyOptions.apply(n,[b]);var q=n.x;var r=m.length;if(this.requireSorting&&q<m[r-1])for(p=!0;r&&m[r-1]>q;)r--;this.updateParallelArrays(n,"splice",r,0,0);this.updateParallelArrays(n,r);l&&n.name&&(l[q]=n.name);k.splice(r,0,b);if(p||this.processedData)this.data.splice(r,0,null),this.processData();"point"===h.legendType&&this.generatePoints();c&&(g[0]&&g[0].remove?g[0].remove(!1):(g.shift(),this.updateParallelArrays(n,
"shift"),k.shift()));!1!==e&&C(this,"addPoint",{point:n});this.isDirtyData=this.isDirty=!0;a&&f.redraw(d)};a.prototype.removePoint=function(b,a,c){var d=this,h=d.data,g=h[b],f=d.points,l=d.chart,k=function(){f&&f.length===h.length&&f.splice(b,1);h.splice(b,1);d.options.data.splice(b,1);d.updateParallelArrays(g||{series:d},"splice",b,1);g&&g.destroy();d.isDirty=!0;d.isDirtyData=!0;a&&l.redraw()};e(c,l);a=L(a,!0);g?g.firePointEvent("remove",null,k):k()};a.prototype.remove=function(b,a,c,d){function e(){h.destroy(d);
g.isDirtyLegend=g.isDirtyBox=!0;g.linkSeries();L(b,!0)&&g.redraw(a)}var h=this,g=h.chart;!1!==c?C(h,"remove",null,e):e()};a.prototype.update=function(b,a){b=h(b,this.userOptions);C(this,"update",{options:b});var c=this,d=c.chart,e=c.userOptions,g=c.initialType||c.type,f=d.options.plotOptions,l=F[g].prototype,k=c.finishedAnimating&&{animation:!1},m={},p,n=["eventOptions","navigatorSeries","baseSeries"],q=b.type||e.type||d.options.chart.type,r=!(this.hasDerivedData||q&&q!==this.type||"undefined"!==
typeof b.pointStart||"undefined"!==typeof b.pointInterval||"undefined"!==typeof b.relativeXValue||b.joinBy||b.mapData||c.hasOptionChanged("dataGrouping")||c.hasOptionChanged("pointStart")||c.hasOptionChanged("pointInterval")||c.hasOptionChanged("pointIntervalUnit")||c.hasOptionChanged("keys"));q=q||g;r&&(n.push("data","isDirtyData","points","processedData","processedXData","processedYData","xIncrement","cropped","_hasPointMarkers","_hasPointLabels","clips","nodes","layout","level","mapMap","mapData",
"minY","maxY","minX","maxX"),!1!==b.visible&&n.push("area","graph"),c.parallelArrays.forEach(function(b){n.push(b+"Data")}),b.data&&(b.dataSorting&&v(c.options.dataSorting,b.dataSorting),this.setData(b.data,!1)));b=X(e,k,{index:"undefined"===typeof e.index?c.index:e.index,pointStart:L(f&&f.series&&f.series.pointStart,e.pointStart,c.xData[0])},!r&&{data:c.options.data},b);r&&b.data&&(b.data=c.options.data);n=["group","markerGroup","dataLabelsGroup","transformGroup"].concat(n);n.forEach(function(b){n[b]=
c[b];delete c[b]});f=!1;if(F[q]){if(f=q!==c.type,c.remove(!1,!1,!1,!0),f)if(Object.setPrototypeOf)Object.setPrototypeOf(c,F[q].prototype);else{k=Object.hasOwnProperty.call(c,"hcEvents")&&c.hcEvents;for(p in l)c[p]=void 0;v(c,F[q].prototype);k?c.hcEvents=k:delete c.hcEvents}}else D(17,!0,d,{missingModuleFor:q});n.forEach(function(b){c[b]=n[b]});c.init(d,b);if(r&&this.points){var t=c.options;!1===t.visible?(m.graphic=1,m.dataLabel=1):c._hasPointLabels||(b=t.marker,l=t.dataLabels,!b||!1!==b.enabled&&
(e.marker&&e.marker.symbol)===b.symbol||(m.graphic=1),l&&!1===l.enabled&&(m.dataLabel=1));this.points.forEach(function(b){b&&b.series&&(b.resolveColor(),Object.keys(m).length&&b.destroyElements(m),!1===t.showInLegend&&b.legendItem&&d.legend.destroyItem(b))},this)}c.initialType=g;d.linkSeries();f&&c.linkedSeries.length&&(c.isDirtyData=!0);C(this,"afterUpdate");L(a,!0)&&d.redraw(r?void 0:!1)};a.prototype.setName=function(b){this.name=this.options.name=this.userOptions.name=b;this.chart.isDirtyLegend=
!0};a.prototype.hasOptionChanged=function(b){var a=this.options[b],c=this.chart.options.plotOptions,d=this.userOptions[b];return d?a!==d:a!==L(c&&c[this.type]&&c[this.type][b],c&&c.series&&c.series[b],a)};a.prototype.onMouseOver=function(){var b=this.chart,a=b.hoverSeries;b.pointer.setHoverChartIndex();if(a&&a!==this)a.onMouseOut();this.options.events.mouseOver&&C(this,"mouseOver");this.setState("hover");b.hoverSeries=this};a.prototype.onMouseOut=function(){var b=this.options,a=this.chart,c=a.tooltip,
d=a.hoverPoint;a.hoverSeries=null;if(d)d.onMouseOut();this&&b.events.mouseOut&&C(this,"mouseOut");!c||this.stickyTracking||c.shared&&!this.noSharedTooltip||c.hide();a.series.forEach(function(b){b.setState("",!0)})};a.prototype.setState=function(b,a){var c=this,d=c.options,e=c.graph,h=d.inactiveOtherPoints,g=d.states,f=L(g[b||"normal"]&&g[b||"normal"].animation,c.chart.options.chart.animation),l=d.lineWidth,k=0,m=d.opacity;b=b||"";if(c.state!==b&&([c.group,c.markerGroup,c.dataLabelsGroup].forEach(function(a){a&&
(c.state&&a.removeClass("highcharts-series-"+c.state),b&&a.addClass("highcharts-series-"+b))}),c.state=b,!c.chart.styledMode)){if(g[b]&&!1===g[b].enabled)return;b&&(l=g[b].lineWidth||l+(g[b].lineWidthPlus||0),m=L(g[b].opacity,m));if(e&&!e.dashstyle)for(d={"stroke-width":l},e.animate(d,f);c["zone-graph-"+k];)c["zone-graph-"+k].animate(d,f),k+=1;h||[c.group,c.markerGroup,c.dataLabelsGroup,c.labelBySeries].forEach(function(b){b&&b.animate({opacity:m},f)})}a&&h&&c.points&&c.setAllPointsToState(b||void 0)};
a.prototype.setAllPointsToState=function(b){this.points.forEach(function(a){a.setState&&a.setState(b)})};a.prototype.setVisible=function(b,a){var c=this,d=c.chart,e=c.legendItem,h=d.options.chart.ignoreHiddenSeries,g=c.visible,f=(c.visible=b=c.options.visible=c.userOptions.visible="undefined"===typeof b?!g:b)?"show":"hide";["group","dataLabelsGroup","markerGroup","tracker","tt"].forEach(function(b){if(c[b])c[b][f]()});if(d.hoverSeries===c||(d.hoverPoint&&d.hoverPoint.series)===c)c.onMouseOut();e&&
d.legend.colorizeItem(c,b);c.isDirty=!0;c.options.stacking&&d.series.forEach(function(b){b.options.stacking&&b.visible&&(b.isDirty=!0)});c.linkedSeries.forEach(function(a){a.setVisible(b,!1)});h&&(d.isDirtyBox=!0);C(c,f);!1!==a&&d.redraw()};a.prototype.show=function(){this.setVisible(!0)};a.prototype.hide=function(){this.setVisible(!1)};a.prototype.select=function(b){this.selected=b=this.options.selected="undefined"===typeof b?!this.selected:b;this.checkbox&&(this.checkbox.checked=b);C(this,b?"select":
"unselect")};a.prototype.shouldShowTooltip=function(b,a,c){void 0===c&&(c={});c.series=this;c.visiblePlotOnly=!0;return this.chart.isInsidePlot(b,a,c)};a.defaultOptions=I;return a}();v(a.prototype,{axisTypes:["xAxis","yAxis"],coll:"series",colorCounter:0,cropShoulder:1,directTouch:!1,drawLegendSymbol:w.drawLineMarker,isCartesian:!0,kdAxisArray:["clientX","plotY"],parallelArrays:["x","y"],pointClass:E,requireSorting:!0,sorted:!0});A.series=a;"";"";return a});K(f,"Extensions/ScrollablePlotArea.js",
[f["Core/Animation/AnimationUtilities.js"],f["Core/Axis/Axis.js"],f["Core/Chart/Chart.js"],f["Core/Series/Series.js"],f["Core/Renderer/RendererRegistry.js"],f["Core/Utilities.js"]],function(a,f,B,H,w,E){var C=a.stop,A=E.addEvent,u=E.createElement,n=E.merge,k=E.pick;A(B,"afterSetChartSize",function(a){var c=this.options.chart.scrollablePlotArea,e=c&&c.minWidth;c=c&&c.minHeight;if(!this.renderer.forExport){if(e){if(this.scrollablePixelsX=e=Math.max(0,e-this.chartWidth)){this.scrollablePlotBox=this.renderer.scrollablePlotBox=
n(this.plotBox);this.plotBox.width=this.plotWidth+=e;this.inverted?this.clipBox.height+=e:this.clipBox.width+=e;var g={1:{name:"right",value:e}}}}else c&&(this.scrollablePixelsY=e=Math.max(0,c-this.chartHeight))&&(this.scrollablePlotBox=this.renderer.scrollablePlotBox=n(this.plotBox),this.plotBox.height=this.plotHeight+=e,this.inverted?this.clipBox.width+=e:this.clipBox.height+=e,g={2:{name:"bottom",value:e}});g&&!a.skipAxes&&this.axes.forEach(function(a){g[a.side]?a.getPlotLinePath=function(){var c=
g[a.side].name,e=this[c];this[c]=e-g[a.side].value;var k=f.prototype.getPlotLinePath.apply(this,arguments);this[c]=e;return k}:(a.setAxisSize(),a.setAxisTranslation())})}});A(B,"render",function(){this.scrollablePixelsX||this.scrollablePixelsY?(this.setUpScrolling&&this.setUpScrolling(),this.applyFixed()):this.fixedDiv&&this.applyFixed()});B.prototype.setUpScrolling=function(){var a=this,c={WebkitOverflowScrolling:"touch",overflowX:"hidden",overflowY:"hidden"};this.scrollablePixelsX&&(c.overflowX=
"auto");this.scrollablePixelsY&&(c.overflowY="auto");this.scrollingParent=u("div",{className:"highcharts-scrolling-parent"},{position:"relative"},this.renderTo);this.scrollingContainer=u("div",{className:"highcharts-scrolling"},c,this.scrollingParent);A(this.scrollingContainer,"scroll",function(){a.pointer&&delete a.pointer.chartPosition});this.innerContainer=u("div",{className:"highcharts-inner-container"},null,this.scrollingContainer);this.innerContainer.appendChild(this.container);this.setUpScrolling=
null};B.prototype.moveFixedElements=function(){var a=this.container,c=this.fixedRenderer,f=".highcharts-contextbutton .highcharts-credits .highcharts-legend .highcharts-legend-checkbox .highcharts-navigator-series .highcharts-navigator-xaxis .highcharts-navigator-yaxis .highcharts-navigator .highcharts-reset-zoom .highcharts-drillup-button .highcharts-scrollbar .highcharts-subtitle .highcharts-title".split(" "),g;this.scrollablePixelsX&&!this.inverted?g=".highcharts-yaxis":this.scrollablePixelsX&&
this.inverted?g=".highcharts-xaxis":this.scrollablePixelsY&&!this.inverted?g=".highcharts-xaxis":this.scrollablePixelsY&&this.inverted&&(g=".highcharts-yaxis");g&&f.push(g+":not(.highcharts-radial-axis)",g+"-labels:not(.highcharts-radial-axis-labels)");f.forEach(function(e){[].forEach.call(a.querySelectorAll(e),function(a){(a.namespaceURI===c.SVG_NS?c.box:c.box.parentNode).appendChild(a);a.style.pointerEvents="auto"})})};B.prototype.applyFixed=function(){var a=!this.fixedDiv,c=this.options.chart,
f=c.scrollablePlotArea,g=w.getRendererType();a?(this.fixedDiv=u("div",{className:"highcharts-fixed"},{position:"absolute",overflow:"hidden",pointerEvents:"none",zIndex:(c.style&&c.style.zIndex||0)+2,top:0},null,!0),this.scrollingContainer&&this.scrollingContainer.parentNode.insertBefore(this.fixedDiv,this.scrollingContainer),this.renderTo.style.overflow="visible",this.fixedRenderer=c=new g(this.fixedDiv,this.chartWidth,this.chartHeight,this.options.chart.style),this.scrollableMask=c.path().attr({fill:this.options.chart.backgroundColor||
"#fff","fill-opacity":k(f.opacity,.85),zIndex:-1}).addClass("highcharts-scrollable-mask").add(),A(this,"afterShowResetZoom",this.moveFixedElements),A(this,"afterApplyDrilldown",this.moveFixedElements),A(this,"afterLayOutTitles",this.moveFixedElements)):this.fixedRenderer.setSize(this.chartWidth,this.chartHeight);if(this.scrollableDirty||a)this.scrollableDirty=!1,this.moveFixedElements();c=this.chartWidth+(this.scrollablePixelsX||0);g=this.chartHeight+(this.scrollablePixelsY||0);C(this.container);
this.container.style.width=c+"px";this.container.style.height=g+"px";this.renderer.boxWrapper.attr({width:c,height:g,viewBox:[0,0,c,g].join(" ")});this.chartBackground.attr({width:c,height:g});this.scrollingContainer.style.height=this.chartHeight+"px";a&&(f.scrollPositionX&&(this.scrollingContainer.scrollLeft=this.scrollablePixelsX*f.scrollPositionX),f.scrollPositionY&&(this.scrollingContainer.scrollTop=this.scrollablePixelsY*f.scrollPositionY));g=this.axisOffset;a=this.plotTop-g[0]-1;f=this.plotLeft-
g[3]-1;c=this.plotTop+this.plotHeight+g[2]+1;g=this.plotLeft+this.plotWidth+g[1]+1;var n=this.plotLeft+this.plotWidth-(this.scrollablePixelsX||0),q=this.plotTop+this.plotHeight-(this.scrollablePixelsY||0);a=this.scrollablePixelsX?[["M",0,a],["L",this.plotLeft-1,a],["L",this.plotLeft-1,c],["L",0,c],["Z"],["M",n,a],["L",this.chartWidth,a],["L",this.chartWidth,c],["L",n,c],["Z"]]:this.scrollablePixelsY?[["M",f,0],["L",f,this.plotTop-1],["L",g,this.plotTop-1],["L",g,0],["Z"],["M",f,q],["L",f,this.chartHeight],
["L",g,this.chartHeight],["L",g,q],["Z"]]:[["M",0,0]];"adjustHeight"!==this.redrawTrigger&&this.scrollableMask.attr({d:a})};A(f,"afterInit",function(){this.chart.scrollableDirty=!0});A(H,"show",function(){this.chart.scrollableDirty=!0});""});K(f,"Core/Axis/StackingAxis.js",[f["Core/Animation/AnimationUtilities.js"],f["Core/Axis/Axis.js"],f["Core/Utilities.js"]],function(a,f,B){var C=a.getDeferredAnimation,w=B.addEvent,E=B.destroyObjectProperties,I=B.fireEvent,A=B.isNumber,u=B.objectEach,n;(function(a){function e(){var a=
this.stacking;if(a){var c=a.stacks;u(c,function(a,e){E(a);c[e]=null});a&&a.stackTotalGroup&&a.stackTotalGroup.destroy()}}function c(){this.stacking||(this.stacking=new g(this))}var f=[];a.compose=function(a){-1===f.indexOf(a)&&(f.push(a),w(a,"init",c),w(a,"destroy",e));return a};var g=function(){function a(a){this.oldStacks={};this.stacks={};this.stacksTouched=0;this.axis=a}a.prototype.buildStacks=function(){var a=this.axis,c=a.series,e=a.options.reversedStacks,g=c.length,f;if(!a.isXAxis){this.usePercentage=
!1;for(f=g;f--;){var k=c[e?f:g-f-1];k.setStackedPoints();k.setGroupedPoints()}for(f=0;f<g;f++)c[f].modifyStacks();I(a,"afterBuildStacks")}};a.prototype.cleanStacks=function(){if(!this.axis.isXAxis){if(this.oldStacks)var a=this.stacks=this.oldStacks;u(a,function(a){u(a,function(a){a.cumulative=a.total})})}};a.prototype.resetStacks=function(){var a=this,c=a.stacks;a.axis.isXAxis||u(c,function(c){u(c,function(e,g){A(e.touched)&&e.touched<a.stacksTouched?(e.destroy(),delete c[g]):(e.total=null,e.cumulative=
null)})})};a.prototype.renderStackTotals=function(){var a=this.axis,c=a.chart,e=c.renderer,g=this.stacks;a=C(c,a.options.stackLabels&&a.options.stackLabels.animation||!1);var f=this.stackTotalGroup=this.stackTotalGroup||e.g("stack-labels").attr({zIndex:6,opacity:0}).add();f.translate(c.plotLeft,c.plotTop);u(g,function(a){u(a,function(a){a.render(f)})});f.animate({opacity:1},a)};return a}();a.Additions=g})(n||(n={}));return n});K(f,"Extensions/Stacking.js",[f["Core/Axis/Axis.js"],f["Core/Chart/Chart.js"],
f["Core/FormatUtilities.js"],f["Core/Globals.js"],f["Core/Series/Series.js"],f["Core/Axis/StackingAxis.js"],f["Core/Utilities.js"]],function(a,f,B,H,w,E,I){var A=B.format,u=I.correctFloat,n=I.defined,k=I.destroyObjectProperties,e=I.isArray,c=I.isNumber,p=I.objectEach,g=I.pick,t=function(){function a(a,c,e,g,f){var h=a.chart.inverted;this.axis=a;this.isNegative=e;this.options=c=c||{};this.x=g;this.total=null;this.points={};this.hasValidPoints=!1;this.stack=f;this.rightCliff=this.leftCliff=0;this.alignOptions=
{align:c.align||(h?e?"left":"right":"center"),verticalAlign:c.verticalAlign||(h?"middle":e?"bottom":"top"),y:c.y,x:c.x};this.textAlign=c.textAlign||(h?e?"right":"left":"center")}a.prototype.destroy=function(){k(this,this.axis)};a.prototype.render=function(a){var c=this.axis.chart,e=this.options,f=e.format;f=f?A(f,this,c):e.formatter.call(this);this.label?this.label.attr({text:f,visibility:"hidden"}):(this.label=c.renderer.label(f,null,null,e.shape,null,null,e.useHTML,!1,"stack-labels"),f={r:e.borderRadius||
0,text:f,rotation:e.rotation,padding:g(e.padding,5),visibility:"hidden"},c.styledMode||(f.fill=e.backgroundColor,f.stroke=e.borderColor,f["stroke-width"]=e.borderWidth,this.label.css(e.style)),this.label.attr(f),this.label.added||this.label.add(a));this.label.labelrank=c.plotSizeY};a.prototype.setOffset=function(a,e,f,k,m){var h=this.axis,b=h.chart;k=h.translate(h.stacking.usePercentage?100:k?k:this.total,0,0,0,1);f=h.translate(f?f:0);f=n(k)&&Math.abs(k-f);a=g(m,b.xAxis[0].translate(this.x))+a;h=
n(k)&&this.getStackBox(b,this,a,k,e,f,h);e=this.label;f=this.isNegative;a="justify"===g(this.options.overflow,"justify");var l=this.textAlign;e&&h&&(m=e.getBBox(),k=e.padding,l="left"===l?b.inverted?-k:k:"right"===l?m.width:b.inverted&&"center"===l?m.width/2:b.inverted?f?m.width+k:-k:m.width/2,f=b.inverted?m.height/2:f?-k:m.height,this.alignOptions.x=g(this.options.x,0),this.alignOptions.y=g(this.options.y,0),h.x-=l,h.y-=f,e.align(this.alignOptions,null,h),b.isInsidePlot(e.alignAttr.x+l-this.alignOptions.x,
e.alignAttr.y+f-this.alignOptions.y)?e.show():(e.hide(),a=!1),a&&w.prototype.justifyDataLabel.call(this.axis,e,this.alignOptions,e.alignAttr,m,h),e.attr({x:e.alignAttr.x,y:e.alignAttr.y}),g(!a&&this.options.crop,!0)&&((b=c(e.x)&&c(e.y)&&b.isInsidePlot(e.x-k+e.width,e.y)&&b.isInsidePlot(e.x+k,e.y))||e.hide()))};a.prototype.getStackBox=function(a,c,e,g,f,h,b){var l=c.axis.reversed,d=a.inverted,k=b.height+b.pos-(d?a.plotLeft:a.plotTop);c=c.isNegative&&!l||!c.isNegative&&l;return{x:d?c?g-b.right:g-h+
b.pos-a.plotLeft:e+a.xAxis[0].transB-a.plotLeft,y:d?b.height-e-f:c?k-g-h:k-g,width:d?h:f,height:d?f:h}};return a}();f.prototype.getStacks=function(){var a=this,c=a.inverted;a.yAxis.forEach(function(a){a.stacking&&a.stacking.stacks&&a.hasVisibleSeries&&(a.stacking.oldStacks=a.stacking.stacks)});a.series.forEach(function(e){var f=e.xAxis&&e.xAxis.options||{};!e.options.stacking||!0!==e.visible&&!1!==a.options.chart.ignoreHiddenSeries||(e.stackKey=[e.type,g(e.options.stack,""),c?f.top:f.left,c?f.height:
f.width].join())})};E.compose(a);w.prototype.setGroupedPoints=function(){var a=this.yAxis.stacking;this.options.centerInCategory&&(this.is("column")||this.is("columnrange"))&&!this.options.stacking&&1<this.chart.series.length?w.prototype.setStackedPoints.call(this,"group"):a&&p(a.stacks,function(c,e){"group"===e.slice(-5)&&(p(c,function(a){return a.destroy()}),delete a.stacks[e])})};w.prototype.setStackedPoints=function(a){var c=a||this.options.stacking;if(c&&(!0===this.visible||!1===this.chart.options.chart.ignoreHiddenSeries)){var f=
this.processedXData,k=this.processedYData,p=[],m=k.length,h=this.options,b=h.threshold,l=g(h.startFromThreshold&&b,0);h=h.stack;a=a?this.type+","+c:this.stackKey;var d="-"+a,q=this.negStacks,v=this.yAxis,r=v.stacking.stacks,w=v.stacking.oldStacks,A,C;v.stacking.stacksTouched+=1;for(C=0;C<m;C++){var B=f[C];var H=k[C];var I=this.getStackIndicator(I,B,this.index);var J=I.key;var E=(A=q&&H<(l?0:b))?d:a;r[E]||(r[E]={});r[E][B]||(w[E]&&w[E][B]?(r[E][B]=w[E][B],r[E][B].total=null):r[E][B]=new t(v,v.options.stackLabels,
A,B,h));E=r[E][B];null!==H?(E.points[J]=E.points[this.index]=[g(E.cumulative,l)],n(E.cumulative)||(E.base=J),E.touched=v.stacking.stacksTouched,0<I.index&&!1===this.singleStacks&&(E.points[J][0]=E.points[this.index+","+B+",0"][0])):E.points[J]=E.points[this.index]=null;"percent"===c?(A=A?a:d,q&&r[A]&&r[A][B]?(A=r[A][B],E.total=A.total=Math.max(A.total,E.total)+Math.abs(H)||0):E.total=u(E.total+(Math.abs(H)||0))):"group"===c?(e(H)&&(H=H[0]),null!==H&&(E.total=(E.total||0)+1)):E.total=u(E.total+(H||
0));E.cumulative="group"===c?(E.total||1)-1:g(E.cumulative,l)+(H||0);null!==H&&(E.points[J].push(E.cumulative),p[C]=E.cumulative,E.hasValidPoints=!0)}"percent"===c&&(v.stacking.usePercentage=!0);"group"!==c&&(this.stackedYData=p);v.stacking.oldStacks={}}};w.prototype.modifyStacks=function(){var a=this,c=a.stackKey,e=a.yAxis.stacking.stacks,g=a.processedXData,f,k=a.options.stacking;a[k+"Stacker"]&&[c,"-"+c].forEach(function(c){for(var b=g.length,h,d;b--;)if(h=g[b],f=a.getStackIndicator(f,h,a.index,
c),d=(h=e[c]&&e[c][h])&&h.points[f.key])a[k+"Stacker"](d,h,b)})};w.prototype.percentStacker=function(a,c,e){c=c.total?100/c.total:0;a[0]=u(a[0]*c);a[1]=u(a[1]*c);this.stackedYData[e]=a[1]};w.prototype.getStackIndicator=function(a,c,e,g){!n(a)||a.x!==c||g&&a.stackKey!==g?a={x:c,index:0,key:g,stackKey:g}:a.index++;a.key=[e,c,a.index].join();return a};H.StackItem=t;"";return H.StackItem});K(f,"Series/Line/LineSeries.js",[f["Core/Series/Series.js"],f["Core/Series/SeriesRegistry.js"],f["Core/Utilities.js"]],
function(a,f,B){var C=this&&this.__extends||function(){var a=function(f,u){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,f){a.__proto__=f}||function(a,f){for(var e in f)f.hasOwnProperty(e)&&(a[e]=f[e])};return a(f,u)};return function(f,u){function n(){this.constructor=f}a(f,u);f.prototype=null===u?Object.create(u):(n.prototype=u.prototype,new n)}}(),w=B.defined,E=B.merge;B=function(f){function A(){var a=null!==f&&f.apply(this,arguments)||this;a.data=void 0;a.options=void 0;a.points=
void 0;return a}C(A,f);A.prototype.drawGraph=function(){var a=this,f=this.options,k=(this.gappedPath||this.getGraphPath).call(this),e=this.chart.styledMode,c=[["graph","highcharts-graph"]];e||c[0].push(f.lineColor||this.color||"#cccccc",f.dashStyle);c=a.getZonesGraphs(c);c.forEach(function(c,g){var p=c[0],n=a[p],u=n?"animate":"attr";n?(n.endX=a.preventGraphAnimation?null:k.xMap,n.animate({d:k})):k.length&&(a[p]=n=a.chart.renderer.path(k).addClass(c[1]).attr({zIndex:1}).add(a.group));n&&!e&&(p={stroke:c[2],
"stroke-width":f.lineWidth,fill:a.fillGraph&&a.color||"none"},c[3]?p.dashstyle=c[3]:"square"!==f.linecap&&(p["stroke-linecap"]=p["stroke-linejoin"]="round"),n[u](p).shadow(2>g&&f.shadow));n&&(n.startX=k.xMap,n.isArea=k.isArea)})};A.prototype.getGraphPath=function(a,f,k){var e=this,c=e.options,p=[],g=[],n,q=c.step;a=a||e.points;var u=a.reversed;u&&a.reverse();(q={right:1,center:2}[q]||q&&3)&&u&&(q=4-q);a=this.getValidPoints(a,!1,!(c.connectNulls&&!f&&!k));a.forEach(function(t,x){var z=t.plotX,m=t.plotY,
h=a[x-1];(t.leftCliff||h&&h.rightCliff)&&!k&&(n=!0);t.isNull&&!w(f)&&0<x?n=!c.connectNulls:t.isNull&&!f?n=!0:(0===x||n?x=[["M",t.plotX,t.plotY]]:e.getPointSpline?x=[e.getPointSpline(a,t,x)]:q?(x=1===q?[["L",h.plotX,m]]:2===q?[["L",(h.plotX+z)/2,h.plotY],["L",(h.plotX+z)/2,m]]:[["L",z,h.plotY]],x.push(["L",z,m])):x=[["L",z,m]],g.push(t.x),q&&(g.push(t.x),2===q&&g.push(t.x)),p.push.apply(p,x),n=!1)});p.xMap=g;return e.graphPath=p};A.prototype.getZonesGraphs=function(a){this.zones.forEach(function(f,
k){k=["zone-graph-"+k,"highcharts-graph highcharts-zone-graph-"+k+" "+(f.className||"")];this.chart.styledMode||k.push(f.color||this.color,f.dashStyle||this.options.dashStyle);a.push(k)},this);return a};A.defaultOptions=E(a.defaultOptions,{});return A}(a);f.registerSeriesType("line",B);"";return B});K(f,"Series/Area/AreaSeries.js",[f["Core/Color/Color.js"],f["Core/Legend/LegendSymbol.js"],f["Core/Series/SeriesRegistry.js"],f["Core/Utilities.js"]],function(a,f,B,H){var w=this&&this.__extends||function(){var a=
function(e,c){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,c){a.__proto__=c}||function(a,c){for(var e in c)c.hasOwnProperty(e)&&(a[e]=c[e])};return a(e,c)};return function(e,c){function f(){this.constructor=e}a(e,c);e.prototype=null===c?Object.create(c):(f.prototype=c.prototype,new f)}}(),C=a.parse,I=B.seriesTypes.line;a=H.extend;var A=H.merge,u=H.objectEach,n=H.pick;H=function(a){function e(){var c=null!==a&&a.apply(this,arguments)||this;c.data=void 0;c.options=void 0;c.points=
void 0;return c}w(e,a);e.prototype.drawGraph=function(){this.areaPath=[];a.prototype.drawGraph.apply(this);var c=this,e=this.areaPath,f=this.options,k=[["area","highcharts-area",this.color,f.fillColor]];this.zones.forEach(function(a,e){k.push(["zone-area-"+e,"highcharts-area highcharts-zone-area-"+e+" "+a.className,a.color||c.color,a.fillColor||f.fillColor])});k.forEach(function(a){var g=a[0],k=c[g],p=k?"animate":"attr",q={};k?(k.endX=c.preventGraphAnimation?null:e.xMap,k.animate({d:e})):(q.zIndex=
0,k=c[g]=c.chart.renderer.path(e).addClass(a[1]).add(c.group),k.isArea=!0);c.chart.styledMode||(q.fill=n(a[3],C(a[2]).setOpacity(n(f.fillOpacity,.75)).get()));k[p](q);k.startX=e.xMap;k.shiftUnit=f.step?2:1})};e.prototype.getGraphPath=function(a){var c=I.prototype.getGraphPath,e=this.options,f=e.stacking,k=this.yAxis,u,y=[],x=[],z=this.index,m=k.stacking.stacks[this.stackKey],h=e.threshold,b=Math.round(k.getThreshold(e.threshold));e=n(e.connectNulls,"percent"===f);var l=function(c,d,e){var g=a[c];
c=f&&m[g.x].points[z];var l=g[e+"Null"]||0;e=g[e+"Cliff"]||0;g=!0;if(e||l){var p=(l?c[0]:c[1])+e;var n=c[0]+e;g=!!l}else!f&&a[d]&&a[d].isNull&&(p=n=h);"undefined"!==typeof p&&(x.push({plotX:D,plotY:null===p?b:k.getThreshold(p),isNull:g,isCliff:!0}),y.push({plotX:D,plotY:null===n?b:k.getThreshold(n),doCurve:!1}))};a=a||this.points;f&&(a=this.getStackPoints(a));for(u=0;u<a.length;u++){f||(a[u].leftCliff=a[u].rightCliff=a[u].leftNull=a[u].rightNull=void 0);var d=a[u].isNull;var D=n(a[u].rectPlotX,a[u].plotX);
var v=f?n(a[u].yBottom,b):b;if(!d||e)e||l(u,u-1,"left"),d&&!f&&e||(x.push(a[u]),y.push({x:u,plotX:D,plotY:v})),e||l(u,u+1,"right")}u=c.call(this,x,!0,!0);y.reversed=!0;d=c.call(this,y,!0,!0);(v=d[0])&&"M"===v[0]&&(d[0]=["L",v[1],v[2]]);d=u.concat(d);d.length&&d.push(["Z"]);c=c.call(this,x,!1,e);d.xMap=u.xMap;this.areaPath=d;return c};e.prototype.getStackPoints=function(a){var c=this,e=[],f=[],k=this.xAxis,w=this.yAxis,y=w.stacking.stacks[this.stackKey],x={},z=w.series,m=z.length,h=w.options.reversedStacks?
1:-1,b=z.indexOf(c);a=a||this.points;if(this.options.stacking){for(var l=0;l<a.length;l++)a[l].leftNull=a[l].rightNull=void 0,x[a[l].x]=a[l];u(y,function(b,a){null!==b.total&&f.push(a)});f.sort(function(b,a){return b-a});var d=z.map(function(b){return b.visible});f.forEach(function(a,g){var l=0,p,q;if(x[a]&&!x[a].isNull)e.push(x[a]),[-1,1].forEach(function(e){var l=1===e?"rightNull":"leftNull",k=0,n=y[f[g+e]];if(n)for(var r=b;0<=r&&r<m;){var t=z[r].index;p=n.points[t];p||(t===c.index?x[a][l]=!0:d[r]&&
(q=y[a].points[t])&&(k-=q[1]-q[0]));r+=h}x[a][1===e?"rightCliff":"leftCliff"]=k});else{for(var t=b;0<=t&&t<m;){if(p=y[a].points[z[t].index]){l=p[1];break}t+=h}l=n(l,0);l=w.translate(l,0,1,0,1);e.push({isNull:!0,plotX:k.translate(a,0,0,0,1),x:a,plotY:l,yBottom:l})}})}return e};e.defaultOptions=A(I.defaultOptions,{threshold:0});return e}(I);a(H.prototype,{singleStacks:!1,drawLegendSymbol:f.drawRectangle});B.registerSeriesType("area",H);"";return H});K(f,"Series/Spline/SplineSeries.js",[f["Core/Series/SeriesRegistry.js"],
f["Core/Utilities.js"]],function(a,f){var C=this&&this.__extends||function(){var a=function(f,u){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,f){a.__proto__=f}||function(a,f){for(var e in f)f.hasOwnProperty(e)&&(a[e]=f[e])};return a(f,u)};return function(f,u){function n(){this.constructor=f}a(f,u);f.prototype=null===u?Object.create(u):(n.prototype=u.prototype,new n)}}(),H=a.seriesTypes.line,w=f.merge,E=f.pick;f=function(a){function f(){var f=null!==a&&a.apply(this,arguments)||
this;f.data=void 0;f.options=void 0;f.points=void 0;return f}C(f,a);f.prototype.getPointSpline=function(a,f,k){var e=f.plotX||0,c=f.plotY||0,p=a[k-1];k=a[k+1];if(p&&!p.isNull&&!1!==p.doCurve&&!f.isCliff&&k&&!k.isNull&&!1!==k.doCurve&&!f.isCliff){a=p.plotY||0;var g=k.plotX||0;k=k.plotY||0;var n=0;var q=(1.5*e+(p.plotX||0))/2.5;var u=(1.5*c+a)/2.5;g=(1.5*e+g)/2.5;var y=(1.5*c+k)/2.5;g!==q&&(n=(y-u)*(g-e)/(g-q)+c-y);u+=n;y+=n;u>a&&u>c?(u=Math.max(a,c),y=2*c-u):u<a&&u<c&&(u=Math.min(a,c),y=2*c-u);y>k&&
y>c?(y=Math.max(k,c),u=2*c-y):y<k&&y<c&&(y=Math.min(k,c),u=2*c-y);f.rightContX=g;f.rightContY=y}f=["C",E(p.rightContX,p.plotX,0),E(p.rightContY,p.plotY,0),E(q,e,0),E(u,c,0),e,c];p.rightContX=p.rightContY=void 0;return f};f.defaultOptions=w(H.defaultOptions);return f}(H);a.registerSeriesType("spline",f);"";return f});K(f,"Series/AreaSpline/AreaSplineSeries.js",[f["Series/Area/AreaSeries.js"],f["Series/Spline/SplineSeries.js"],f["Core/Legend/LegendSymbol.js"],f["Core/Series/SeriesRegistry.js"],f["Core/Utilities.js"]],
function(a,f,B,H,w){var C=this&&this.__extends||function(){var a=function(f,e){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,e){a.__proto__=e}||function(a,e){for(var c in e)e.hasOwnProperty(c)&&(a[c]=e[c])};return a(f,e)};return function(f,e){function c(){this.constructor=f}a(f,e);f.prototype=null===e?Object.create(e):(c.prototype=e.prototype,new c)}}(),I=a.prototype,A=w.extend,u=w.merge;w=function(n){function k(){var a=null!==n&&n.apply(this,arguments)||this;a.data=void 0;a.points=
void 0;a.options=void 0;return a}C(k,n);k.defaultOptions=u(f.defaultOptions,a.defaultOptions);return k}(f);A(w.prototype,{getGraphPath:I.getGraphPath,getStackPoints:I.getStackPoints,drawGraph:I.drawGraph,drawLegendSymbol:B.drawRectangle});H.registerSeriesType("areaspline",w);"";return w});K(f,"Series/Column/ColumnSeries.js",[f["Core/Animation/AnimationUtilities.js"],f["Core/Color/Color.js"],f["Core/Globals.js"],f["Core/Legend/LegendSymbol.js"],f["Core/Series/Series.js"],f["Core/Series/SeriesRegistry.js"],
f["Core/Utilities.js"]],function(a,f,B,H,w,E,I){var C=this&&this.__extends||function(){var a=function(c,b){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(b,a){b.__proto__=a}||function(b,a){for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c])};return a(c,b)};return function(c,b){function e(){this.constructor=c}a(c,b);c.prototype=null===b?Object.create(b):(e.prototype=b.prototype,new e)}}(),u=a.animObject,n=f.parse,k=B.hasTouch;a=B.noop;var e=I.clamp,c=I.css,p=I.defined,g=I.extend,t=I.fireEvent,
q=I.isArray,F=I.isNumber,y=I.merge,x=I.pick,z=I.objectEach;I=function(a){function f(){var b=null!==a&&a.apply(this,arguments)||this;b.borderWidth=void 0;b.data=void 0;b.group=void 0;b.options=void 0;b.points=void 0;return b}C(f,a);f.prototype.animate=function(b){var a=this,c=this.yAxis,f=a.options,h=this.chart.inverted,k={},m=h?"translateX":"translateY";if(b)k.scaleY=.001,b=e(c.toPixels(f.threshold),c.pos,c.pos+c.len),h?k.translateX=b-c.len:k.translateY=b,a.clipBox&&a.setClip(),a.group.attr(k);else{var p=
Number(a.group.attr(m));a.group.animate({scaleY:1},g(u(a.options.animation),{step:function(b,d){a.group&&(k[m]=p+d.pos*(c.pos-p),a.group.attr(k))}}))}};f.prototype.init=function(b,c){a.prototype.init.apply(this,arguments);var d=this;b=d.chart;b.hasRendered&&b.series.forEach(function(b){b.type===d.type&&(b.isDirty=!0)})};f.prototype.getColumnMetrics=function(){var b=this,a=b.options,c=b.xAxis,e=b.yAxis,f=c.options.reversedStacks;f=c.reversed&&!f||!c.reversed&&f;var h={},g,k=0;!1===a.grouping?k=1:b.chart.series.forEach(function(a){var c=
a.yAxis,d=a.options;if(a.type===b.type&&(a.visible||!b.chart.options.chart.ignoreHiddenSeries)&&e.len===c.len&&e.pos===c.pos){if(d.stacking&&"group"!==d.stacking){g=a.stackKey;"undefined"===typeof h[g]&&(h[g]=k++);var f=h[g]}else!1!==d.grouping&&(f=k++);a.columnIndex=f}});var m=Math.min(Math.abs(c.transA)*(c.ordinal&&c.ordinal.slope||a.pointRange||c.closestPointRange||c.tickInterval||1),c.len),p=m*a.groupPadding,n=(m-2*p)/(k||1);a=Math.min(a.maxPointWidth||c.len,x(a.pointWidth,n*(1-2*a.pointPadding)));
b.columnMetrics={width:a,offset:(n-a)/2+(p+((b.columnIndex||0)+(f?1:0))*n-m/2)*(f?-1:1),paddedWidth:n,columnCount:k};return b.columnMetrics};f.prototype.crispCol=function(b,a,c,e){var d=this.chart,f=this.borderWidth,h=-(f%2?.5:0);f=f%2?.5:1;d.inverted&&d.renderer.isVML&&(f+=1);this.options.crisp&&(c=Math.round(b+c)+h,b=Math.round(b)+h,c-=b);e=Math.round(a+e)+f;h=.5>=Math.abs(a)&&.5<e;a=Math.round(a)+f;e-=a;h&&e&&(--a,e+=1);return{x:b,y:a,width:c,height:e}};f.prototype.adjustForMissingColumns=function(b,
a,c,e){var d=this,f=this.options.stacking;if(!c.isNull&&1<e.columnCount){var h=this.yAxis.options.reversedStacks,g=0,l=h?0:-e.columnCount;z(this.yAxis.stacking&&this.yAxis.stacking.stacks,function(b){if("number"===typeof c.x&&(b=b[c.x.toString()])){var a=b.points[d.index],e=b.total;f?(a&&(g=l),b.hasValidPoints&&(h?l++:l--)):q(a)&&(g=a[1],l=e||0)}});b=(c.plotX||0)+((l-1)*e.paddedWidth+a)/2-a-g*e.paddedWidth}return b};f.prototype.translate=function(){var b=this,a=b.chart,c=b.options,f=b.dense=2>b.closestPointRange*
b.xAxis.transA;f=b.borderWidth=x(c.borderWidth,f?0:1);var h=b.xAxis,g=b.yAxis,k=c.threshold,m=b.translatedThreshold=g.getThreshold(k),n=x(c.minPointLength,5),q=b.getColumnMetrics(),t=q.width,z=b.pointXOffset=q.offset,u=b.dataMin,y=b.dataMax,C=b.barW=Math.max(t,1+2*f);a.inverted&&(m-=.5);c.pointPadding&&(C=Math.ceil(C));w.prototype.translate.apply(b);b.points.forEach(function(d){var f=x(d.yBottom,m),l=999+Math.abs(f),r=d.plotX||0;l=e(d.plotY,-l,g.len+l);var v=Math.min(l,f),w=Math.max(l,f)-v,D=t,A=
r+z,B=C;n&&Math.abs(w)<n&&(w=n,r=!g.reversed&&!d.negative||g.reversed&&d.negative,F(k)&&F(y)&&d.y===k&&y<=k&&(g.min||0)<k&&(u!==y||(g.max||0)<=k)&&(r=!r),v=Math.abs(v-m)>n?f-n:m-(r?n:0));p(d.options.pointWidth)&&(D=B=Math.ceil(d.options.pointWidth),A-=Math.round((D-t)/2));c.centerInCategory&&(A=b.adjustForMissingColumns(A,D,d,q));d.barX=A;d.pointWidth=D;d.tooltipPos=a.inverted?[e(g.len+g.pos-a.plotLeft-l,g.pos-a.plotLeft,g.len+g.pos-a.plotLeft),h.len+h.pos-a.plotTop-A-B/2,w]:[h.left-a.plotLeft+A+
B/2,e(l+g.pos-a.plotTop,g.pos-a.plotTop,g.len+g.pos-a.plotTop),w];d.shapeType=b.pointClass.prototype.shapeType||"rect";d.shapeArgs=b.crispCol.apply(b,d.isNull?[A,m,B,0]:[A,v,B,w])})};f.prototype.drawGraph=function(){this.group[this.dense?"addClass":"removeClass"]("highcharts-dense-data")};f.prototype.pointAttribs=function(b,a){var c=this.options,e=this.pointAttrToOptions||{},f=e.stroke||"borderColor",h=e["stroke-width"]||"borderWidth",g=b&&b.color||this.color,l=b&&b[f]||c[f]||g;e=b&&b.options.dashStyle||
c.dashStyle;var k=b&&b[h]||c[h]||this[h]||0,m=x(b&&b.opacity,c.opacity,1);if(b&&this.zones.length){var p=b.getZone();g=b.options.color||p&&(p.color||b.nonZonedColor)||this.color;p&&(l=p.borderColor||l,e=p.dashStyle||e,k=p.borderWidth||k)}a&&b&&(b=y(c.states[a],b.options.states&&b.options.states[a]||{}),a=b.brightness,g=b.color||"undefined"!==typeof a&&n(g).brighten(b.brightness).get()||g,l=b[f]||l,k=b[h]||k,e=b.dashStyle||e,m=x(b.opacity,m));f={fill:g,stroke:l,"stroke-width":k,opacity:m};e&&(f.dashstyle=
e);return f};f.prototype.drawPoints=function(){var b=this,a=this.chart,c=b.options,e=a.renderer,f=c.animationLimit||250,h;b.points.forEach(function(d){var g=d.graphic,l=!!g,k=g&&a.pointCount<f?"animate":"attr";if(F(d.plotY)&&null!==d.y){h=d.shapeArgs;g&&d.hasNewShapeType()&&(g=g.destroy());b.enabledDataSorting&&(d.startXPos=b.xAxis.reversed?-(h?h.width||0:0):b.xAxis.width);g||(d.graphic=g=e[d.shapeType](h).add(d.group||b.group))&&b.enabledDataSorting&&a.hasRendered&&a.pointCount<f&&(g.attr({x:d.startXPos}),
l=!0,k="animate");if(g&&l)g[k](y(h));if(c.borderRadius)g[k]({r:c.borderRadius});a.styledMode||g[k](b.pointAttribs(d,d.selected&&"select")).shadow(!1!==d.allowShadow&&c.shadow,null,c.stacking&&!c.borderRadius);g&&(g.addClass(d.getClassName(),!0),g.attr({visibility:d.visible?"inherit":"hidden"}))}else g&&(d.graphic=g.destroy())})};f.prototype.drawTracker=function(){var b=this,a=b.chart,d=a.pointer,e=function(b){var a=d.getPointFromEvent(b);"undefined"!==typeof a&&(d.isDirectTouch=!0,a.onMouseOver(b))},
f;b.points.forEach(function(b){f=q(b.dataLabels)?b.dataLabels:b.dataLabel?[b.dataLabel]:[];b.graphic&&(b.graphic.element.point=b);f.forEach(function(a){a.div?a.div.point=b:a.element.point=b})});b._hasTracking||(b.trackerGroups.forEach(function(f){if(b[f]){b[f].addClass("highcharts-tracker").on("mouseover",e).on("mouseout",function(b){d.onTrackerMouseOut(b)});if(k)b[f].on("touchstart",e);!a.styledMode&&b.options.cursor&&b[f].css(c).css({cursor:b.options.cursor})}}),b._hasTracking=!0);t(this,"afterDrawTracker")};
f.prototype.remove=function(){var b=this,a=b.chart;a.hasRendered&&a.series.forEach(function(a){a.type===b.type&&(a.isDirty=!0)});w.prototype.remove.apply(b,arguments)};f.defaultOptions=y(w.defaultOptions,{borderRadius:0,centerInCategory:!1,groupPadding:.2,marker:null,pointPadding:.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{halo:!1,brightness:.1},select:{color:"#cccccc",borderColor:"#000000"}},dataLabels:{align:void 0,verticalAlign:void 0,y:void 0},startFromThreshold:!0,stickyTracking:!1,
tooltip:{distance:6},threshold:0,borderColor:"#ffffff"});return f}(w);g(I.prototype,{cropShoulder:0,directTouch:!0,drawLegendSymbol:H.drawRectangle,getSymbol:a,negStacks:!0,trackerGroups:["group","dataLabelsGroup"]});E.registerSeriesType("column",I);"";"";return I});K(f,"Core/Series/DataLabel.js",[f["Core/Animation/AnimationUtilities.js"],f["Core/FormatUtilities.js"],f["Core/Utilities.js"]],function(a,f,B){var C=a.getDeferredAnimation,w=f.format,E=B.defined,I=B.extend,A=B.fireEvent,u=B.isArray,n=
B.merge,k=B.objectEach,e=B.pick,c=B.splat,p;(function(a){function f(a,b,c,d,f){var h=this,g=this.chart,l=this.isCartesian&&g.inverted,k=this.enabledDataSorting,m=e(a.dlBox&&a.dlBox.centerX,a.plotX),p=a.plotY,n=c.rotation,q=c.align,t=E(m)&&E(p)&&g.isInsidePlot(m,Math.round(p),{inverted:l,paneCoordinates:!0,series:h}),z=function(c){k&&h.xAxis&&!u&&h.setDataLabelStartPos(a,b,f,t,c)},u="justify"===e(c.overflow,k?"none":"justify"),x=this.visible&&!1!==a.visible&&(a.series.forceDL||k&&!u||t||e(c.inside,
!!this.options.stacking)&&d&&g.isInsidePlot(m,l?d.x+1:d.y+d.height-1,{inverted:l,paneCoordinates:!0,series:h}));if(x&&E(m)&&E(p)){n&&b.attr({align:q});q=b.getBBox(!0);var y=[0,0];var w=g.renderer.fontMetrics(g.styledMode?void 0:c.style.fontSize,b).b;d=I({x:l?this.yAxis.len-p:m,y:Math.round(l?this.xAxis.len-m:p),width:0,height:0},d);I(c,{width:q.width,height:q.height});n?(u=!1,y=g.renderer.rotCorr(w,n),m={x:d.x+(c.x||0)+d.width/2+y.x,y:d.y+(c.y||0)+{top:0,middle:.5,bottom:1}[c.verticalAlign]*d.height},
y=[q.x-Number(b.attr("x")),q.y-Number(b.attr("y"))],z(m),b[f?"attr":"animate"](m)):(z(d),b.align(c,void 0,d),m=b.alignAttr);u&&0<=d.height?this.justifyDataLabel(b,c,m,q,d,f):e(c.crop,!0)&&(d=m.x,z=m.y,d+=y[0],z+=y[1],x=g.isInsidePlot(d,z,{paneCoordinates:!0,series:h})&&g.isInsidePlot(d+q.width,z+q.height,{paneCoordinates:!0,series:h}));if(c.shape&&!n)b[f?"attr":"animate"]({anchorX:l?g.plotWidth-a.plotY:a.plotX,anchorY:l?g.plotHeight-a.plotX:a.plotY})}f&&k&&(b.placed=!1);x||k&&!u?b.show():(b.hide(),
b.placed=!1)}function g(a,b){var c=b.filter;return c?(b=c.operator,a=a[c.property],c=c.value,">"===b&&a>c||"<"===b&&a<c||">="===b&&a>=c||"<="===b&&a<=c||"=="===b&&a==c||"==="===b&&a===c?!0:!1):!0}function p(){var a=this,b=a.chart,f=a.options,d=a.points,m=a.hasRendered||0,p=b.renderer,n=f.dataLabels,q,t=n.animation;t=n.defer?C(b,t,a):{defer:0,duration:0};n=x(x(b.options.plotOptions&&b.options.plotOptions.series&&b.options.plotOptions.series.dataLabels,b.options.plotOptions&&b.options.plotOptions[a.type]&&
b.options.plotOptions[a.type].dataLabels),n);A(this,"drawDataLabels");if(u(n)||n.enabled||a._hasPointLabels){var z=a.plotGroup("dataLabelsGroup","data-labels",m?"inherit":"hidden",n.zIndex||6);z.attr({opacity:+m});!m&&(m=a.dataLabelsGroup)&&(a.visible&&z.show(),m[f.animation?"animate":"attr"]({opacity:1},t));d.forEach(function(d){q=c(x(n,d.dlOptions||d.options&&d.options.dataLabels));q.forEach(function(c,h){var l=c.enabled&&(!d.isNull||d.dataLabelOnNull)&&g(d,c),m=d.connectors?d.connectors[h]:d.connector,
n=d.dataLabels?d.dataLabels[h]:d.dataLabel,q=!n,r=e(c.distance,d.labelDistance);if(l){var t=d.getLabelConfig();var v=e(c[d.formatPrefix+"Format"],c.format);t=E(v)?w(v,t,b):(c[d.formatPrefix+"Formatter"]||c.formatter).call(t,c);v=c.style;var u=c.rotation;b.styledMode||(v.color=e(c.color,v.color,a.color,"#000000"),"contrast"===v.color?(d.contrastColor=p.getContrast(d.color||a.color),v.color=!E(r)&&c.inside||0>r||f.stacking?d.contrastColor:"#000000"):delete d.contrastColor,f.cursor&&(v.cursor=f.cursor));
var x={r:c.borderRadius||0,rotation:u,padding:c.padding,zIndex:1};b.styledMode||(x.fill=c.backgroundColor,x.stroke=c.borderColor,x["stroke-width"]=c.borderWidth);k(x,function(b,a){"undefined"===typeof b&&delete x[a]})}!n||l&&E(t)&&!!n.div===!!c.useHTML&&(n.rotation&&c.rotation||n.rotation===c.rotation)||(q=!0,d.dataLabel=n=d.dataLabel&&d.dataLabel.destroy(),d.dataLabels&&(1===d.dataLabels.length?delete d.dataLabels:delete d.dataLabels[h]),h||delete d.dataLabel,m&&(d.connector=d.connector.destroy(),
d.connectors&&(1===d.connectors.length?delete d.connectors:delete d.connectors[h])));l&&E(t)?(n?x.text=t:(d.dataLabels=d.dataLabels||[],n=d.dataLabels[h]=u?p.text(t,0,0,c.useHTML).addClass("highcharts-data-label"):p.label(t,0,0,c.shape,null,null,c.useHTML,null,"data-label"),h||(d.dataLabel=n),n.addClass(" highcharts-data-label-color-"+d.colorIndex+" "+(c.className||"")+(c.useHTML?" highcharts-tracker":""))),n.options=c,n.attr(x),b.styledMode||n.css(v).shadow(c.shadow),n.added||n.add(z),c.textPath&&
!c.useHTML&&(n.setTextPath(d.getDataLabelPath&&d.getDataLabelPath(n)||d.graphic,c.textPath),d.dataLabelPath&&!c.textPath.enabled&&(d.dataLabelPath=d.dataLabelPath.destroy())),a.alignDataLabel(d,n,c,null,q)):n&&n.hide()})})}A(this,"afterDrawDataLabels")}function y(a,b,c,d,e,f){var h=this.chart,g=b.align,k=b.verticalAlign,l=a.box?0:a.padding||0,m=b.x;m=void 0===m?0:m;var p=b.y;p=void 0===p?0:p;var n=(c.x||0)+l;if(0>n){"right"===g&&0<=m?(b.align="left",b.inside=!0):m-=n;var q=!0}n=(c.x||0)+d.width-l;
n>h.plotWidth&&("left"===g&&0>=m?(b.align="right",b.inside=!0):m+=h.plotWidth-n,q=!0);n=c.y+l;0>n&&("bottom"===k&&0<=p?(b.verticalAlign="top",b.inside=!0):p-=n,q=!0);n=(c.y||0)+d.height-l;n>h.plotHeight&&("top"===k&&0>=p?(b.verticalAlign="bottom",b.inside=!0):p+=h.plotHeight-n,q=!0);q&&(b.x=m,b.y=p,a.placed=!f,a.align(b,void 0,e));return q}function x(a,b){var c=[],d;if(u(a)&&!u(b))c=a.map(function(a){return n(a,b)});else if(u(b)&&!u(a))c=b.map(function(b){return n(a,b)});else if(u(a)||u(b))for(d=
Math.max(a.length,b.length);d--;)c[d]=n(a[d],b[d]);else c=n(a,b);return c}function z(a,b,c,d,e){var f=this.chart,g=f.inverted,h=this.xAxis,k=h.reversed,l=g?b.height/2:b.width/2;a=(a=a.pointWidth)?a/2:0;b.startXPos=g?e.x:k?-l-a:h.width-l+a;b.startYPos=g?k?this.yAxis.height-l+a:-l-a:e.y;d?"hidden"===b.visibility&&(b.show(),b.attr({opacity:0}).animate({opacity:1})):b.attr({opacity:1}).animate({opacity:0},void 0,b.hide);f.hasRendered&&(c&&b.attr({x:b.startXPos,y:b.startYPos}),b.placed=!0)}var m=[];a.compose=
function(a){if(-1===m.indexOf(a)){var b=a.prototype;m.push(a);b.alignDataLabel=f;b.drawDataLabels=p;b.justifyDataLabel=y;b.setDataLabelStartPos=z}}})(p||(p={}));"";return p});K(f,"Series/Column/ColumnDataLabel.js",[f["Core/Series/DataLabel.js"],f["Core/Series/SeriesRegistry.js"],f["Core/Utilities.js"]],function(a,f,B){var C=f.series,w=B.merge,E=B.pick,I;(function(f){function u(a,e,c,f,g){var k=this.chart.inverted,n=a.series,p=(n.xAxis?n.xAxis.len:this.chart.plotSizeX)||0;n=(n.yAxis?n.yAxis.len:this.chart.plotSizeY)||
0;var u=a.dlBox||a.shapeArgs,x=E(a.below,a.plotY>E(this.translatedThreshold,n)),z=E(c.inside,!!this.options.stacking);u&&(f=w(u),0>f.y&&(f.height+=f.y,f.y=0),u=f.y+f.height-n,0<u&&u<f.height&&(f.height-=u),k&&(f={x:n-f.y-f.height,y:p-f.x-f.width,width:f.height,height:f.width}),z||(k?(f.x+=x?0:f.width,f.width=0):(f.y+=x?f.height:0,f.height=0)));c.align=E(c.align,!k||z?"center":x?"right":"left");c.verticalAlign=E(c.verticalAlign,k||z?"middle":x?"top":"bottom");C.prototype.alignDataLabel.call(this,a,
e,c,f,g);c.inside&&a.contrastColor&&e.css({color:a.contrastColor})}var n=[];f.compose=function(f){a.compose(C);-1===n.indexOf(f)&&(n.push(f),f.prototype.alignDataLabel=u)}})(I||(I={}));return I});K(f,"Series/Bar/BarSeries.js",[f["Series/Column/ColumnSeries.js"],f["Core/Series/SeriesRegistry.js"],f["Core/Utilities.js"]],function(a,f,B){var C=this&&this.__extends||function(){var a=function(f,u){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,f){a.__proto__=f}||function(a,f){for(var e in f)f.hasOwnProperty(e)&&
(a[e]=f[e])};return a(f,u)};return function(f,u){function n(){this.constructor=f}a(f,u);f.prototype=null===u?Object.create(u):(n.prototype=u.prototype,new n)}}(),w=B.extend,E=B.merge;B=function(f){function w(){var a=null!==f&&f.apply(this,arguments)||this;a.data=void 0;a.options=void 0;a.points=void 0;return a}C(w,f);w.defaultOptions=E(a.defaultOptions,{});return w}(a);w(B.prototype,{inverted:!0});f.registerSeriesType("bar",B);"";return B});K(f,"Series/Scatter/ScatterSeries.js",[f["Series/Column/ColumnSeries.js"],
f["Series/Line/LineSeries.js"],f["Core/Series/SeriesRegistry.js"],f["Core/Utilities.js"]],function(a,f,B,H){var w=this&&this.__extends||function(){var a=function(f,k){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,c){a.__proto__=c}||function(a,c){for(var e in c)c.hasOwnProperty(e)&&(a[e]=c[e])};return a(f,k)};return function(f,k){function e(){this.constructor=f}a(f,k);f.prototype=null===k?Object.create(k):(e.prototype=k.prototype,new e)}}(),C=H.addEvent,I=H.extend,A=H.merge;H=
function(a){function n(){var f=null!==a&&a.apply(this,arguments)||this;f.data=void 0;f.options=void 0;f.points=void 0;return f}w(n,a);n.prototype.applyJitter=function(){var a=this,e=this.options.jitter,c=this.points.length;e&&this.points.forEach(function(f,g){["x","y"].forEach(function(k,n){var p="plot"+k.toUpperCase();if(e[k]&&!f.isNull){var q=a[k+"Axis"];var t=e[k]*q.transA;if(q&&!q.isLog){var z=Math.max(0,f[p]-t);q=Math.min(q.len,f[p]+t);n=1E4*Math.sin(g+n*c);f[p]=z+(q-z)*(n-Math.floor(n));"x"===
k&&(f.clientX=f.plotX)}}})})};n.prototype.drawGraph=function(){this.options.lineWidth?a.prototype.drawGraph.call(this):this.graph&&(this.graph=this.graph.destroy())};n.defaultOptions=A(f.defaultOptions,{lineWidth:0,findNearestPointBy:"xy",jitter:{x:0,y:0},marker:{enabled:!0},tooltip:{headerFormat:'<span style="color:{point.color}">\u25cf</span> <span style="font-size: 10px"> {series.name}</span><br/>',pointFormat:"x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"}});return n}(f);I(H.prototype,{drawTracker:a.prototype.drawTracker,
sorted:!1,requireSorting:!1,noSharedTooltip:!0,trackerGroups:["group","markerGroup","dataLabelsGroup"],takeOrdinalPosition:!1});C(H,"afterTranslate",function(){this.applyJitter()});B.registerSeriesType("scatter",H);"";return H});K(f,"Series/CenteredUtilities.js",[f["Core/Globals.js"],f["Core/Series/Series.js"],f["Core/Utilities.js"]],function(a,f,B){var C=a.deg2rad,w=B.isNumber,E=B.pick,I=B.relativeLength,A;(function(a){a.getCenter=function(){var a=this.options,k=this.chart,e=2*(a.slicedOffset||0),
c=k.plotWidth-2*e,p=k.plotHeight-2*e,g=a.center,t=Math.min(c,p),q=a.thickness,u=a.size,y=a.innerSize||0;"string"===typeof u&&(u=parseFloat(u));"string"===typeof y&&(y=parseFloat(y));a=[E(g[0],"50%"),E(g[1],"50%"),E(u&&0>u?void 0:a.size,"100%"),E(y&&0>y?void 0:a.innerSize||0,"0%")];!k.angular||this instanceof f||(a[3]=0);for(g=0;4>g;++g)u=a[g],k=2>g||2===g&&/%$/.test(u),a[g]=I(u,[c,p,t,a[2]][g])+(k?e:0);a[3]>a[2]&&(a[3]=a[2]);w(q)&&2*q<a[2]&&0<q&&(a[3]=a[2]-2*q);return a};a.getStartAndEndRadians=function(a,
f){a=w(a)?a:0;f=w(f)&&f>a&&360>f-a?f:a+360;return{start:C*(a+-90),end:C*(f+-90)}}})(A||(A={}));"";return A});K(f,"Series/Pie/PiePoint.js",[f["Core/Animation/AnimationUtilities.js"],f["Core/Series/Point.js"],f["Core/Utilities.js"]],function(a,f,B){var C=this&&this.__extends||function(){var a=function(e,c){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,c){a.__proto__=c}||function(a,c){for(var e in c)c.hasOwnProperty(e)&&(a[e]=c[e])};return a(e,c)};return function(e,c){function f(){this.constructor=
e}a(e,c);e.prototype=null===c?Object.create(c):(f.prototype=c.prototype,new f)}}(),w=a.setAnimation,E=B.addEvent,I=B.defined;a=B.extend;var A=B.isNumber,u=B.pick,n=B.relativeLength;f=function(a){function e(){var c=null!==a&&a.apply(this,arguments)||this;c.labelDistance=void 0;c.options=void 0;c.series=void 0;return c}C(e,a);e.prototype.getConnectorPath=function(){var a=this.labelPosition,e=this.series.options.dataLabels,f=this.connectorShapes,k=e.connectorShape;f[k]&&(k=f[k]);return k.call(this,{x:a.final.x,
y:a.final.y,alignment:a.alignment},a.connectorPosition,e)};e.prototype.getTranslate=function(){return this.sliced?this.slicedTranslation:{translateX:0,translateY:0}};e.prototype.haloPath=function(a){var c=this.shapeArgs;return this.sliced||!this.visible?[]:this.series.chart.renderer.symbols.arc(c.x,c.y,c.r+a,c.r+a,{innerR:c.r-1,start:c.start,end:c.end})};e.prototype.init=function(){var c=this;a.prototype.init.apply(this,arguments);this.name=u(this.name,"Slice");var e=function(a){c.slice("select"===
a.type)};E(this,"select",e);E(this,"unselect",e);return this};e.prototype.isValid=function(){return A(this.y)&&0<=this.y};e.prototype.setVisible=function(a,e){var c=this,f=this.series,k=f.chart,n=f.options.ignoreHiddenPoint;e=u(e,n);a!==this.visible&&(this.visible=this.options.visible=a="undefined"===typeof a?!this.visible:a,f.options.data[f.data.indexOf(this)]=this.options,["graphic","dataLabel","connector","shadowGroup"].forEach(function(e){if(c[e])c[e][a?"show":"hide"](a)}),this.legendItem&&k.legend.colorizeItem(this,
a),a||"hover"!==this.state||this.setState(""),n&&(f.isDirty=!0),e&&k.redraw())};e.prototype.slice=function(a,e,f){var c=this.series;w(f,c.chart);u(e,!0);this.sliced=this.options.sliced=I(a)?a:!this.sliced;c.options.data[c.data.indexOf(this)]=this.options;this.graphic&&this.graphic.animate(this.getTranslate());this.shadowGroup&&this.shadowGroup.animate(this.getTranslate())};return e}(f);a(f.prototype,{connectorShapes:{fixedOffset:function(a,e,c){var f=e.breakAt;e=e.touchingSliceAt;return[["M",a.x,
a.y],c.softConnector?["C",a.x+("left"===a.alignment?-5:5),a.y,2*f.x-e.x,2*f.y-e.y,f.x,f.y]:["L",f.x,f.y],["L",e.x,e.y]]},straight:function(a,e){e=e.touchingSliceAt;return[["M",a.x,a.y],["L",e.x,e.y]]},crookedLine:function(a,e,c){e=e.touchingSliceAt;var f=this.series,g=f.center[0],k=f.chart.plotWidth,q=f.chart.plotLeft;f=a.alignment;var u=this.shapeArgs.r;c=n(c.crookDistance,1);k="left"===f?g+u+(k+q-g-u)*(1-c):q+(g-u)*c;c=["L",k,a.y];g=!0;if("left"===f?k>a.x||k<e.x:k<a.x||k>e.x)g=!1;a=[["M",a.x,a.y]];
g&&a.push(c);a.push(["L",e.x,e.y]);return a}}});return f});K(f,"Series/Pie/PieSeries.js",[f["Series/CenteredUtilities.js"],f["Series/Column/ColumnSeries.js"],f["Core/Globals.js"],f["Core/Legend/LegendSymbol.js"],f["Series/Pie/PiePoint.js"],f["Core/Series/Series.js"],f["Core/Series/SeriesRegistry.js"],f["Core/Renderer/SVG/Symbols.js"],f["Core/Utilities.js"]],function(a,f,B,H,w,E,I,A,u){var n=this&&this.__extends||function(){var a=function(c,e){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&
function(a,c){a.__proto__=c}||function(a,c){for(var e in c)c.hasOwnProperty(e)&&(a[e]=c[e])};return a(c,e)};return function(c,e){function f(){this.constructor=c}a(c,e);c.prototype=null===e?Object.create(e):(f.prototype=e.prototype,new f)}}(),k=a.getStartAndEndRadians;B=B.noop;var e=u.clamp,c=u.extend,p=u.fireEvent,g=u.merge,t=u.pick,q=u.relativeLength;u=function(a){function c(){var c=null!==a&&a.apply(this,arguments)||this;c.center=void 0;c.data=void 0;c.maxLabelDistance=void 0;c.options=void 0;c.points=
void 0;return c}n(c,a);c.prototype.animate=function(a){var c=this,e=c.points,f=c.startAngleRad;a||e.forEach(function(a){var b=a.graphic,d=a.shapeArgs;b&&d&&(b.attr({r:t(a.startR,c.center&&c.center[3]/2),start:f,end:f}),b.animate({r:d.r,start:d.start,end:d.end},c.options.animation))})};c.prototype.drawEmpty=function(){var a=this.startAngleRad,c=this.endAngleRad,e=this.options;if(0===this.total&&this.center){var f=this.center[0];var b=this.center[1];this.graph||(this.graph=this.chart.renderer.arc(f,
b,this.center[1]/2,0,a,c).addClass("highcharts-empty-series").add(this.group));this.graph.attr({d:A.arc(f,b,this.center[2]/2,0,{start:a,end:c,innerR:this.center[3]/2})});this.chart.styledMode||this.graph.attr({"stroke-width":e.borderWidth,fill:e.fillColor||"none",stroke:e.color||"#cccccc"})}else this.graph&&(this.graph=this.graph.destroy())};c.prototype.drawPoints=function(){var a=this.chart.renderer;this.points.forEach(function(c){c.graphic&&c.hasNewShapeType()&&(c.graphic=c.graphic.destroy());c.graphic||
(c.graphic=a[c.shapeType](c.shapeArgs).add(c.series.group),c.delayedRendering=!0)})};c.prototype.generatePoints=function(){a.prototype.generatePoints.call(this);this.updateTotals()};c.prototype.getX=function(a,c,f){var g=this.center,b=this.radii?this.radii[f.index]||0:g[2]/2;a=Math.asin(e((a-g[1])/(b+f.labelDistance),-1,1));return g[0]+(c?-1:1)*Math.cos(a)*(b+f.labelDistance)+(0<f.labelDistance?(c?-1:1)*this.options.dataLabels.padding:0)};c.prototype.hasData=function(){return!!this.processedXData.length};
c.prototype.redrawPoints=function(){var a=this,c=a.chart,e=c.renderer,f=a.options.shadow,b,l,d,k;this.drawEmpty();!f||a.shadowGroup||c.styledMode||(a.shadowGroup=e.g("shadow").attr({zIndex:-1}).add(a.group));a.points.forEach(function(h){var m={};l=h.graphic;if(!h.isNull&&l){var n=void 0;k=h.shapeArgs;b=h.getTranslate();c.styledMode||(n=h.shadowGroup,f&&!n&&(n=h.shadowGroup=e.g("shadow").add(a.shadowGroup)),n&&n.attr(b),d=a.pointAttribs(h,h.selected&&"select"));h.delayedRendering?(l.setRadialReference(a.center).attr(k).attr(b),
c.styledMode||l.attr(d).attr({"stroke-linejoin":"round"}).shadow(f,n),h.delayedRendering=!1):(l.setRadialReference(a.center),c.styledMode||g(!0,m,d),g(!0,m,k,b),l.animate(m));l.attr({visibility:h.visible?"inherit":"hidden"});l.addClass(h.getClassName(),!0)}else l&&(h.graphic=l.destroy())})};c.prototype.sortByAngle=function(a,c){a.sort(function(a,e){return"undefined"!==typeof a.angle&&(e.angle-a.angle)*c})};c.prototype.translate=function(a){this.generatePoints();var c=this.options,e=c.slicedOffset,
f=e+(c.borderWidth||0),b=k(c.startAngle,c.endAngle),g=this.startAngleRad=b.start;b=(this.endAngleRad=b.end)-g;var d=this.points,n=c.dataLabels.distance;c=c.ignoreHiddenPoint;var v=d.length,r,u=0;a||(this.center=a=this.getCenter());for(r=0;r<v;r++){var w=d[r];var y=g+u*b;!w.isValid()||c&&!w.visible||(u+=w.percentage/100);var x=g+u*b;var C={x:a[0],y:a[1],r:a[2]/2,innerR:a[3]/2,start:Math.round(1E3*y)/1E3,end:Math.round(1E3*x)/1E3};w.shapeType="arc";w.shapeArgs=C;w.labelDistance=t(w.options.dataLabels&&
w.options.dataLabels.distance,n);w.labelDistance=q(w.labelDistance,C.r);this.maxLabelDistance=Math.max(this.maxLabelDistance||0,w.labelDistance);x=(x+y)/2;x>1.5*Math.PI?x-=2*Math.PI:x<-Math.PI/2&&(x+=2*Math.PI);w.slicedTranslation={translateX:Math.round(Math.cos(x)*e),translateY:Math.round(Math.sin(x)*e)};C=Math.cos(x)*a[2]/2;var A=Math.sin(x)*a[2]/2;w.tooltipPos=[a[0]+.7*C,a[1]+.7*A];w.half=x<-Math.PI/2||x>Math.PI/2?1:0;w.angle=x;y=Math.min(f,w.labelDistance/5);w.labelPosition={natural:{x:a[0]+C+
Math.cos(x)*w.labelDistance,y:a[1]+A+Math.sin(x)*w.labelDistance},"final":{},alignment:0>w.labelDistance?"center":w.half?"right":"left",connectorPosition:{breakAt:{x:a[0]+C+Math.cos(x)*y,y:a[1]+A+Math.sin(x)*y},touchingSliceAt:{x:a[0]+C,y:a[1]+A}}}}p(this,"afterTranslate")};c.prototype.updateTotals=function(){var a=this.points,c=a.length,e=this.options.ignoreHiddenPoint,f,b=0;for(f=0;f<c;f++){var g=a[f];!g.isValid()||e&&!g.visible||(b+=g.y)}this.total=b;for(f=0;f<c;f++)g=a[f],g.percentage=0<b&&(g.visible||
!e)?g.y/b*100:0,g.total=b};c.defaultOptions=g(E.defaultOptions,{center:[null,null],clip:!1,colorByPoint:!0,dataLabels:{allowOverlap:!0,connectorPadding:5,connectorShape:"fixedOffset",crookDistance:"70%",distance:30,enabled:!0,formatter:function(){return this.point.isNull?void 0:this.point.name},softConnector:!0,x:0},fillColor:void 0,ignoreHiddenPoint:!0,inactiveOtherPoints:!0,legendType:"point",marker:null,size:null,showInLegend:!1,slicedOffset:10,stickyTracking:!1,tooltip:{followPointer:!0},borderColor:"#ffffff",
borderWidth:1,lineWidth:void 0,states:{hover:{brightness:.1}}});return c}(E);c(u.prototype,{axisTypes:[],directTouch:!0,drawGraph:void 0,drawLegendSymbol:H.drawRectangle,drawTracker:f.prototype.drawTracker,getCenter:a.getCenter,getSymbol:B,isCartesian:!1,noSharedTooltip:!0,pointAttribs:f.prototype.pointAttribs,pointClass:w,requireSorting:!1,searchPoint:B,trackerGroups:["group","dataLabelsGroup"]});I.registerSeriesType("pie",u);"";return u});K(f,"Series/Pie/PieDataLabel.js",[f["Core/Series/DataLabel.js"],
f["Core/Globals.js"],f["Core/Renderer/RendererUtilities.js"],f["Core/Series/SeriesRegistry.js"],f["Core/Utilities.js"]],function(a,f,B,H,w){var C=f.noop,I=B.distribute,A=H.series,u=w.arrayMax,n=w.clamp,k=w.defined,e=w.merge,c=w.pick,p=w.relativeLength,g;(function(f){function g(){var a=this,f=a.data,b=a.chart,g=a.options.dataLabels||{},d=g.connectorPadding,n=b.plotWidth,p=b.plotHeight,q=b.plotLeft,t=Math.round(b.chartWidth/3),w=a.center,z=w[2]/2,x=w[1],y=[[],[]],C=[0,0,0,0],B=a.dataLabelPositioners,
F,E,H,K,U,G,T,M,V,W,Z,R;a.visible&&(g.enabled||a._hasPointLabels)&&(f.forEach(function(a){a.dataLabel&&a.visible&&a.dataLabel.shortened&&(a.dataLabel.attr({width:"auto"}).css({width:"auto",textOverflow:"clip"}),a.dataLabel.shortened=!1)}),A.prototype.drawDataLabels.apply(a),f.forEach(function(a){a.dataLabel&&(a.visible?(y[a.half].push(a),a.dataLabel._pos=null,!k(g.style.width)&&!k(a.options.dataLabels&&a.options.dataLabels.style&&a.options.dataLabels.style.width)&&a.dataLabel.getBBox().width>t&&(a.dataLabel.css({width:Math.round(.7*
t)+"px"}),a.dataLabel.shortened=!0)):(a.dataLabel=a.dataLabel.destroy(),a.dataLabels&&1===a.dataLabels.length&&delete a.dataLabels))}),y.forEach(function(e,f){var h=e.length,l=[],m;if(h){a.sortByAngle(e,f-.5);if(0<a.maxLabelDistance){var r=Math.max(0,x-z-a.maxLabelDistance);var t=Math.min(x+z+a.maxLabelDistance,b.plotHeight);e.forEach(function(a){0<a.labelDistance&&a.dataLabel&&(a.top=Math.max(0,x-z-a.labelDistance),a.bottom=Math.min(x+z+a.labelDistance,b.plotHeight),m=a.dataLabel.getBBox().height||
21,a.distributeBox={target:a.labelPosition.natural.y-a.top+m/2,size:m,rank:a.y},l.push(a.distributeBox))});r=t+m-r;I(l,r,r/5)}for(Z=0;Z<h;Z++){F=e[Z];G=F.labelPosition;K=F.dataLabel;W=!1===F.visible?"hidden":"inherit";V=r=G.natural.y;l&&k(F.distributeBox)&&("undefined"===typeof F.distributeBox.pos?W="hidden":(T=F.distributeBox.size,V=B.radialDistributionY(F)));delete F.positionIndex;if(g.justify)M=B.justify(F,z,w);else switch(g.alignTo){case "connectors":M=B.alignToConnectors(e,f,n,q);break;case "plotEdges":M=
B.alignToPlotEdges(K,f,n,q);break;default:M=B.radialDistributionX(a,F,V,r)}K._attr={visibility:W,align:G.alignment};R=F.options.dataLabels||{};K._pos={x:M+c(R.x,g.x)+({left:d,right:-d}[G.alignment]||0),y:V+c(R.y,g.y)-10};G.final.x=M;G.final.y=V;c(g.crop,!0)&&(U=K.getBBox().width,r=null,M-U<d&&1===f?(r=Math.round(U-M+d),C[3]=Math.max(r,C[3])):M+U>n-d&&0===f&&(r=Math.round(M+U-n+d),C[1]=Math.max(r,C[1])),0>V-T/2?C[0]=Math.max(Math.round(-V+T/2),C[0]):V+T/2>p&&(C[2]=Math.max(Math.round(V+T/2-p),C[2])),
K.sideOverflow=r)}}}),0===u(C)||this.verifyDataLabelOverflow(C))&&(this.placeDataLabels(),this.points.forEach(function(d){R=e(g,d.options.dataLabels);if(E=c(R.connectorWidth,1)){var f;H=d.connector;if((K=d.dataLabel)&&K._pos&&d.visible&&0<d.labelDistance){W=K._attr.visibility;if(f=!H)d.connector=H=b.renderer.path().addClass("highcharts-data-label-connector  highcharts-color-"+d.colorIndex+(d.className?" "+d.className:"")).add(a.dataLabelsGroup),b.styledMode||H.attr({"stroke-width":E,stroke:R.connectorColor||
d.color||"#666666"});H[f?"attr":"animate"]({d:d.getConnectorPath()});H.attr("visibility",W)}else H&&(d.connector=H.destroy())}}))}function t(){this.points.forEach(function(a){var c=a.dataLabel,b;c&&a.visible&&((b=c._pos)?(c.sideOverflow&&(c._attr.width=Math.max(c.getBBox().width-c.sideOverflow,0),c.css({width:c._attr.width+"px",textOverflow:(this.options.dataLabels.style||{}).textOverflow||"ellipsis"}),c.shortened=!0),c.attr(c._attr),c[c.moved?"animate":"attr"](b),c.moved=!0):c&&c.attr({y:-9999}));
delete a.distributeBox},this)}function w(a){var c=this.center,b=this.options,e=b.center,d=b.minSize||80,f=null!==b.size;if(!f){if(null!==e[0])var g=Math.max(c[2]-Math.max(a[1],a[3]),d);else g=Math.max(c[2]-a[1]-a[3],d),c[0]+=(a[3]-a[1])/2;null!==e[1]?g=n(g,d,c[2]-Math.max(a[0],a[2])):(g=n(g,d,c[2]-a[0]-a[2]),c[1]+=(a[0]-a[2])/2);g<c[2]?(c[2]=g,c[3]=Math.min(b.thickness?Math.max(0,g-2*b.thickness):Math.max(0,p(b.innerSize||0,g)),g),this.translate(c),this.drawDataLabels&&this.drawDataLabels()):f=!0}return f}
var x=[],z={radialDistributionY:function(a){return a.top+a.distributeBox.pos},radialDistributionX:function(a,c,b,e){return a.getX(b<c.top+2||b>c.bottom-2?e:b,c.half,c)},justify:function(a,c,b){return b[0]+(a.half?-1:1)*(c+a.labelDistance)},alignToPlotEdges:function(a,c,b,e){a=a.getBBox().width;return c?a+e:b-a-e},alignToConnectors:function(a,c,b,e){var d=0,f;a.forEach(function(a){f=a.dataLabel.getBBox().width;f>d&&(d=f)});return c?d+e:b-d-e}};f.compose=function(c){a.compose(A);-1===x.indexOf(c)&&
(x.push(c),c=c.prototype,c.dataLabelPositioners=z,c.alignDataLabel=C,c.drawDataLabels=g,c.placeDataLabels=t,c.verifyDataLabelOverflow=w)}})(g||(g={}));return g});K(f,"Extensions/OverlappingDataLabels.js",[f["Core/Chart/Chart.js"],f["Core/Utilities.js"]],function(a,f){function C(a,f){var e=!1;if(a){var c=a.newOpacity;a.oldOpacity!==c&&(a.alignAttr&&a.placed?(a[c?"removeClass":"addClass"]("highcharts-data-label-hidden"),e=!0,a.alignAttr.opacity=c,a[a.isOld?"animate":"attr"](a.alignAttr,null,function(){f.styledMode||
a.css({pointerEvents:c?"auto":"none"})}),w(f,"afterHideOverlappingLabel")):a.attr({opacity:c}));a.isOld=!0}return e}var H=f.addEvent,w=f.fireEvent,E=f.isArray,I=f.isNumber,A=f.objectEach,u=f.pick;H(a,"render",function(){var a=this,f=[];(this.labelCollectors||[]).forEach(function(a){f=f.concat(a())});(this.yAxis||[]).forEach(function(a){a.stacking&&a.options.stackLabels&&!a.options.stackLabels.allowOverlap&&A(a.stacking.stacks,function(a){A(a,function(a){a.label&&f.push(a.label)})})});(this.series||
[]).forEach(function(e){var c=e.options.dataLabels;e.visible&&(!1!==c.enabled||e._hasPointLabels)&&(c=function(c){return c.forEach(function(c){c.visible&&(E(c.dataLabels)?c.dataLabels:c.dataLabel?[c.dataLabel]:[]).forEach(function(e){var g=e.options;e.labelrank=u(g.labelrank,c.labelrank,c.shapeArgs&&c.shapeArgs.height);g.allowOverlap?(e.oldOpacity=e.opacity,e.newOpacity=1,C(e,a)):f.push(e)})})},c(e.nodes||[]),c(e.points))});this.hideOverlappingLabels(f)});a.prototype.hideOverlappingLabels=function(a){var f=
this,e=a.length,c=f.renderer,n,g,t,q=!1;var u=function(a){var e,f=a.box?0:a.padding||0,b=e=0,g;if(a&&(!a.alignAttr||a.placed)){var d=a.alignAttr||{x:a.attr("x"),y:a.attr("y")};var k=a.parentGroup;a.width||(e=a.getBBox(),a.width=e.width,a.height=e.height,e=c.fontMetrics(null,a.element).h);var n=a.width-2*f;(g={left:"0",center:"0.5",right:"1"}[a.alignValue])?b=+g*n:I(a.x)&&Math.round(a.x)!==a.translateX&&(b=a.x-a.translateX);return{x:d.x+(k.translateX||0)+f-(b||0),y:d.y+(k.translateY||0)+f-e,width:a.width-
2*f,height:a.height-2*f}}};for(g=0;g<e;g++)if(n=a[g])n.oldOpacity=n.opacity,n.newOpacity=1,n.absoluteBox=u(n);a.sort(function(a,c){return(c.labelrank||0)-(a.labelrank||0)});for(g=0;g<e;g++){var y=(u=a[g])&&u.absoluteBox;for(n=g+1;n<e;++n){var x=(t=a[n])&&t.absoluteBox;!y||!x||u===t||0===u.newOpacity||0===t.newOpacity||"hidden"===u.visibility||"hidden"===t.visibility||x.x>=y.x+y.width||x.x+x.width<=y.x||x.y>=y.y+y.height||x.y+x.height<=y.y||((u.labelrank<t.labelrank?u:t).newOpacity=0)}}a.forEach(function(a){C(a,
f)&&(q=!0)});q&&w(f,"afterHideAllOverlappingLabels")}});K(f,"Core/Responsive.js",[f["Core/Utilities.js"]],function(a){var f=a.extend,B=a.find,H=a.isArray,w=a.isObject,E=a.merge,I=a.objectEach,A=a.pick,u=a.splat,n=a.uniqueKey,k;(function(a){var c=[];a.compose=function(a){-1===c.indexOf(a)&&(c.push(a),f(a.prototype,e.prototype));return a};var e=function(){function a(){}a.prototype.currentOptions=function(a){function c(a,f,g,h){var b;I(a,function(a,d){if(!h&&-1<e.collectionsWithUpdate.indexOf(d)&&f[d])for(a=
u(a),g[d]=[],b=0;b<Math.max(a.length,f[d].length);b++)f[d][b]&&(void 0===a[b]?g[d][b]=f[d][b]:(g[d][b]={},c(a[b],f[d][b],g[d][b],h+1)));else w(a)?(g[d]=H(a)?[]:{},c(a,f[d]||{},g[d],h+1)):g[d]="undefined"===typeof f[d]?null:f[d]})}var e=this,f={};c(a,this.options,f,0);return f};a.prototype.matchResponsiveRule=function(a,c){var e=a.condition;(e.callback||function(){return this.chartWidth<=A(e.maxWidth,Number.MAX_VALUE)&&this.chartHeight<=A(e.maxHeight,Number.MAX_VALUE)&&this.chartWidth>=A(e.minWidth,
0)&&this.chartHeight>=A(e.minHeight,0)}).call(this)&&c.push(a._id)};a.prototype.setResponsive=function(a,c){var e=this,f=this.options.responsive,g=this.currentResponsive,k=[];!c&&f&&f.rules&&f.rules.forEach(function(a){"undefined"===typeof a._id&&(a._id=n());e.matchResponsiveRule(a,k)},this);c=E.apply(void 0,k.map(function(a){return B((f||{}).rules||[],function(c){return c._id===a})}).map(function(a){return a&&a.chartOptions}));c.isResponsiveOptions=!0;k=k.toString()||void 0;k!==(g&&g.ruleIds)&&(g&&
this.update(g.undoOptions,a,!0),k?(g=this.currentOptions(c),g.isResponsiveOptions=!0,this.currentResponsive={ruleIds:k,mergedOptions:c,undoOptions:g},this.update(c,a,!0)):this.currentResponsive=void 0)};return a}()})(k||(k={}));"";"";return k});K(f,"masters/highcharts.src.js",[f["Core/Globals.js"],f["Core/Utilities.js"],f["Core/DefaultOptions.js"],f["Core/Animation/Fx.js"],f["Core/Animation/AnimationUtilities.js"],f["Core/Renderer/HTML/AST.js"],f["Core/FormatUtilities.js"],f["Core/Renderer/RendererUtilities.js"],
f["Core/Renderer/SVG/SVGElement.js"],f["Core/Renderer/SVG/SVGRenderer.js"],f["Core/Renderer/HTML/HTMLElement.js"],f["Core/Renderer/HTML/HTMLRenderer.js"],f["Core/Axis/Axis.js"],f["Core/Axis/DateTimeAxis.js"],f["Core/Axis/LogarithmicAxis.js"],f["Core/Axis/PlotLineOrBand/PlotLineOrBand.js"],f["Core/Axis/Tick.js"],f["Core/Tooltip.js"],f["Core/Series/Point.js"],f["Core/Pointer.js"],f["Core/MSPointer.js"],f["Core/Legend/Legend.js"],f["Core/Chart/Chart.js"],f["Core/Series/Series.js"],f["Core/Series/SeriesRegistry.js"],
f["Series/Column/ColumnSeries.js"],f["Series/Column/ColumnDataLabel.js"],f["Series/Pie/PieSeries.js"],f["Series/Pie/PieDataLabel.js"],f["Core/Series/DataLabel.js"],f["Core/Responsive.js"],f["Core/Color/Color.js"],f["Core/Time.js"]],function(a,f,B,H,w,E,I,A,u,n,k,e,c,p,g,t,q,F,y,x,z,m,h,b,l,d,D,v,r,K,P,S,N){a.animate=w.animate;a.animObject=w.animObject;a.getDeferredAnimation=w.getDeferredAnimation;a.setAnimation=w.setAnimation;a.stop=w.stop;a.timers=H.timers;a.AST=E;a.Axis=c;a.Chart=h;a.chart=h.chart;
a.Fx=H;a.Legend=m;a.PlotLineOrBand=t;a.Point=y;a.Pointer=z.isRequired()?z:x;a.Series=b;a.SVGElement=u;a.SVGRenderer=n;a.Tick=q;a.Time=N;a.Tooltip=F;a.Color=S;a.color=S.parse;e.compose(n);k.compose(u);a.defaultOptions=B.defaultOptions;a.getOptions=B.getOptions;a.time=B.defaultTime;a.setOptions=B.setOptions;a.dateFormat=I.dateFormat;a.format=I.format;a.numberFormat=I.numberFormat;a.addEvent=f.addEvent;a.arrayMax=f.arrayMax;a.arrayMin=f.arrayMin;a.attr=f.attr;a.clearTimeout=f.clearTimeout;a.correctFloat=
f.correctFloat;a.createElement=f.createElement;a.css=f.css;a.defined=f.defined;a.destroyObjectProperties=f.destroyObjectProperties;a.discardElement=f.discardElement;a.distribute=A.distribute;a.erase=f.erase;a.error=f.error;a.extend=f.extend;a.extendClass=f.extendClass;a.find=f.find;a.fireEvent=f.fireEvent;a.getMagnitude=f.getMagnitude;a.getStyle=f.getStyle;a.inArray=f.inArray;a.isArray=f.isArray;a.isClass=f.isClass;a.isDOMElement=f.isDOMElement;a.isFunction=f.isFunction;a.isNumber=f.isNumber;a.isObject=
f.isObject;a.isString=f.isString;a.keys=f.keys;a.merge=f.merge;a.normalizeTickInterval=f.normalizeTickInterval;a.objectEach=f.objectEach;a.offset=f.offset;a.pad=f.pad;a.pick=f.pick;a.pInt=f.pInt;a.relativeLength=f.relativeLength;a.removeEvent=f.removeEvent;a.seriesType=l.seriesType;a.splat=f.splat;a.stableSort=f.stableSort;a.syncTimeout=f.syncTimeout;a.timeUnits=f.timeUnits;a.uniqueKey=f.uniqueKey;a.useSerialIds=f.useSerialIds;a.wrap=f.wrap;D.compose(d);K.compose(b);p.compose(c);g.compose(c);r.compose(v);
t.compose(c);P.compose(h);return a});f["masters/highcharts.src.js"]._modules=f;return f["masters/highcharts.src.js"]});
//# sourceMappingURL=highcharts.js.map

/***/ }),

/***/ "./node_modules/lodash/lodash.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/lodash.js ***!
  \***************************************/
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.17.21';

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Error message constants. */
  var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
      FUNC_ERROR_TEXT = 'Expected a function',
      INVALID_TEMPL_VAR_ERROR_TEXT = 'Invalid `variable` option passed into `_.template`';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_CURRY_BOUND_FLAG = 4,
      WRAP_CURRY_FLAG = 8,
      WRAP_CURRY_RIGHT_FLAG = 16,
      WRAP_PARTIAL_FLAG = 32,
      WRAP_PARTIAL_RIGHT_FLAG = 64,
      WRAP_ARY_FLAG = 128,
      WRAP_REARG_FLAG = 256,
      WRAP_FLIP_FLAG = 512;

  /** Used as default options for `_.truncate`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2,
      LAZY_WHILE_FLAG = 3;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

  /** Used to associate wrap methods with their bit flags. */
  var wrapFlags = [
    ['ary', WRAP_ARY_FLAG],
    ['bind', WRAP_BIND_FLAG],
    ['bindKey', WRAP_BIND_KEY_FLAG],
    ['curry', WRAP_CURRY_FLAG],
    ['curryRight', WRAP_CURRY_RIGHT_FLAG],
    ['flip', WRAP_FLIP_FLAG],
    ['partial', WRAP_PARTIAL_FLAG],
    ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
    ['rearg', WRAP_REARG_FLAG]
  ];

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      domExcTag = '[object DOMException]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      nullTag = '[object Null]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
      reUnescapedHtml = /[&<>"']/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);

  /** Used to match leading whitespace. */
  var reTrimStart = /^\s+/;

  /** Used to match a single whitespace character. */
  var reWhitespace = /\s/;

  /** Used to match wrap detail comments. */
  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
      reSplitDetails = /,? & /;

  /** Used to match words composed of alphanumeric characters. */
  var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

  /**
   * Used to validate the `validate` option in `_.template` variable.
   *
   * Forbids characters which could potentially change the meaning of the function argument definition:
   * - "()," (modification of function parameters)
   * - "=" (default value)
   * - "[]{}" (destructuring of function parameters)
   * - "/" (beginning of a comment)
   * - whitespace
   */
  var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Used to match
   * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to match Latin Unicode letters (excluding mathematical operators). */
  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to compose unicode character classes. */
  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f',
      reComboHalfMarksRange = '\\ufe20-\\ufe2f',
      rsComboSymbolsRange = '\\u20d0-\\u20ff',
      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsPunctuationRange = '\\u2000-\\u206f',
      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = '\\ufe0e\\ufe0f',
      rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

  /** Used to compose unicode capture groups. */
  var rsApos = "['\u2019]",
      rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = '\\u200d';

  /** Used to compose unicode regexes. */
  var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
      rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
      rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
      rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
      rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  /** Used to match apostrophes. */
  var reApos = RegExp(rsApos, 'g');

  /**
   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
   */
  var reComboMark = RegExp(rsCombo, 'g');

  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

  /** Used to match complex or compound words. */
  var reUnicodeWord = RegExp([
    rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
    rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
    rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
    rsUpper + '+' + rsOptContrUpper,
    rsOrdUpper,
    rsOrdLower,
    rsDigits,
    rsEmoji
  ].join('|'), 'g');

  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

  /** Used to detect strings that need a more robust regexp to match words. */
  var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
    'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
    '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
  cloneableTags[boolTag] = cloneableTags[dateTag] =
  cloneableTags[float32Tag] = cloneableTags[float64Tag] =
  cloneableTags[int8Tag] = cloneableTags[int16Tag] =
  cloneableTags[int32Tag] = cloneableTags[mapTag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[setTag] =
  cloneableTags[stringTag] = cloneableTags[symbolTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map Latin Unicode letters to basic Latin letters. */
  var deburredLetters = {
    // Latin-1 Supplement block.
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss',
    // Latin Extended-A block.
    '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
    '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
    '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
    '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
    '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
    '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
    '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
    '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
    '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
    '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
    '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
    '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
    '\u0134': 'J',  '\u0135': 'j',
    '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
    '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
    '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
    '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
    '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
    '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
    '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
    '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
    '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
    '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
    '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
    '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
    '\u0163': 't',  '\u0165': 't', '\u0167': 't',
    '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
    '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
    '\u0174': 'W',  '\u0175': 'w',
    '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
    '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
    '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
    '\u0132': 'IJ', '\u0133': 'ij',
    '\u0152': 'Oe', '\u0153': 'oe',
    '\u0149': "'n", '\u017f': 's'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Built-in method references without a dependency on `root`. */
  var freeParseFloat = parseFloat,
      freeParseInt = parseInt;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  var freeExports =  true && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
      nodeIsDate = nodeUtil && nodeUtil.isDate,
      nodeIsMap = nodeUtil && nodeUtil.isMap,
      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
      nodeIsSet = nodeUtil && nodeUtil.isSet,
      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /*--------------------------------------------------------------------------*/

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * A specialized version of `baseAggregator` for arrays.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} setter The function to set `accumulator` values.
   * @param {Function} iteratee The iteratee to transform keys.
   * @param {Object} accumulator The initial aggregated object.
   * @returns {Function} Returns `accumulator`.
   */
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.forEachRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEachRight(array, iteratee) {
    var length = array == null ? 0 : array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array == null ? 0 : array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.reduceRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the last element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
    var length = array == null ? 0 : array.length;
    if (initAccum && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets the size of an ASCII `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  var asciiSize = baseProperty('length');

  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function asciiToArray(string) {
    return string.split('');
  }

  /**
   * Splits an ASCII `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function asciiWords(string) {
    return string.match(reAsciiWord) || [];
  }

  /**
   * The base implementation of methods like `_.findKey` and `_.findLastKey`,
   * without support for iteratee shorthands, which iterates over `collection`
   * using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFindKey(collection, predicate, eachFunc) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = key;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  /**
   * This function is like `baseIndexOf` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */
  function baseIsNaN(value) {
    return value !== value;
  }

  /**
   * The base implementation of `_.mean` and `_.meanBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the mean.
   */
  function baseMean(array, iteratee) {
    var length = array == null ? 0 : array.length;
    return length ? (baseSum(array, iteratee) / length) : NAN;
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define the
   * sort order of `array` and replaces criteria objects with their corresponding
   * values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.sum` and `_.sumBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function baseSum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined) {
        result = result === undefined ? current : (result + current);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the key-value pairs.
   */
  function baseToPairs(object, props) {
    return arrayMap(props, function(key) {
      return [key, object[key]];
    });
  }

  /**
   * The base implementation of `_.trim`.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} Returns the trimmed string.
   */
  function baseTrim(string) {
    return string
      ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
      : string;
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */
  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */
  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} placeholder The placeholder to search for.
   * @returns {number} Returns the placeholder count.
   */
  function countHolders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        ++result;
      }
    }
    return result;
  }

  /**
   * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
   * letters to basic Latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  var deburrLetter = basePropertyOf(deburredLetters);

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf(htmlEscapes);

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */
  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }

  /**
   * Checks if `string` contains a word composed of Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a word is found, else `false`.
   */
  function hasUnicodeWord(string) {
    return reHasUnicodeWord.test(string);
  }

  /**
   * Converts `iterator` to an array.
   *
   * @private
   * @param {Object} iterator The iterator to convert.
   * @returns {Array} Returns the converted array.
   */
  function iteratorToArray(iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * Converts `set` to its value-value pairs.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the value-value pairs.
   */
  function setToPairs(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = [value, value];
    });
    return result;
  }

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * A specialized version of `_.lastIndexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictLastIndexOf(array, value, fromIndex) {
    var index = fromIndex + 1;
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return index;
  }

  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */
  function stringSize(string) {
    return hasUnicode(string)
      ? unicodeSize(string)
      : asciiSize(string);
  }

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function stringToArray(string) {
    return hasUnicode(string)
      ? unicodeToArray(string)
      : asciiToArray(string);
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedEndIndex(string) {
    var index = string.length;

    while (index-- && reWhitespace.test(string.charAt(index))) {}
    return index;
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

  /**
   * Gets the size of a Unicode `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  function unicodeSize(string) {
    var result = reUnicode.lastIndex = 0;
    while (reUnicode.test(string)) {
      ++result;
    }
    return result;
  }

  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }

  /**
   * Splits a Unicode `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function unicodeWords(string) {
    return string.match(reUnicodeWord) || [];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the `context` object.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Util
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // Create a suped-up `defer` in Node.js.
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  var runInContext = (function runInContext(context) {
    context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));

    /** Built-in constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = context['__core-js_shared__'];

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? context.Buffer : undefined,
        Symbol = context.Symbol,
        Uint8Array = context.Uint8Array,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice,
        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined,
        symIterator = Symbol ? Symbol.iterator : undefined,
        symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    var defineProperty = (function() {
      try {
        var func = getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /** Mocked built-ins. */
    var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
        ctxNow = Date && Date.now !== root.Date.now && Date.now,
        ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeFloor = Math.floor,
        nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeIsFinite = context.isFinite,
        nativeJoin = arrayProto.join,
        nativeKeys = overArg(Object.keys, Object),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = Date.now,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeReverse = arrayProto.reverse;

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(context, 'DataView'),
        Map = getNative(context, 'Map'),
        Promise = getNative(context, 'Promise'),
        Set = getNative(context, 'Set'),
        WeakMap = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit method
     * chain sequences. Methods that operate on and return arrays, collections,
     * and functions can be chained together. Methods that retrieve a single value
     * or may return a primitive value will automatically end the chain sequence
     * and return the unwrapped value. Otherwise, the value must be unwrapped
     * with `_#value`.
     *
     * Explicit chain sequences, which must be unwrapped with `_#value`, may be
     * enabled using `_.chain`.
     *
     * The execution of chained methods is lazy, that is, it's deferred until
     * `_#value` is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion.
     * Shortcut fusion is an optimization to merge iteratee calls; this avoids
     * the creation of intermediate arrays and can greatly reduce the number of
     * iteratee executions. Sections of a chain sequence qualify for shortcut
     * fusion if the section is applied to an array and iteratees accept only
     * one argument. The heuristic for whether a section qualifies for shortcut
     * fusion is subject to change.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
     * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
     * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
     * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
     * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
     * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
     * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
     * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
     * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
     * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
     * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
     * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
     * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
     * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
     * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
     * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
     * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
     * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
     * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
     * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
     * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
     * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
     * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
     * `zipObject`, `zipObjectDeep`, and `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
     * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
     * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
     * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
     * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
     * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
     * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
     * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
     * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
     * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
     * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
     * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
     * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
     * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
     * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
     * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
     * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
     * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
     * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
     * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
     * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
     * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
     * `upperFirst`, `value`, and `words`
     *
     * @name _
     * @constructor
     * @category Seq
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // Returns an unwrapped value.
     * wrapped.reduce(_.add);
     * // => 6
     *
     * // Returns a wrapped value.
     * var squares = wrapped.map(square);
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} proto The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }());

    /**
     * The function whose prototype chain sequence wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable explicit method chain sequences.
     */
    function LodashWrapper(value, chainAll) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__chain__ = !!chainAll;
      this.__index__ = 0;
      this.__values__ = undefined;
    }

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB) as well as ES2015 template strings. Change the
     * following template settings to use alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type {Object}
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type {string}
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type {Object}
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type {Function}
         */
        '_': lodash
      }
    };

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;
    lodash.prototype.constructor = lodash;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @constructor
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = MAX_ARRAY_LENGTH;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = copyArray(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = copyArray(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = copyArray(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || (!isRight && arrLength == length && takeCount == length)) {
        return baseWrapperValue(array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    // Ensure `LazyWrapper` is an instance of `baseLodash`.
    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.sample` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @returns {*} Returns the random element.
     */
    function arraySample(array) {
      var length = array.length;
      return length ? array[baseRandom(0, length - 1)] : undefined;
    }

    /**
     * A specialized version of `_.sampleSize` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function arraySampleSize(array, n) {
      return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
    }

    /**
     * A specialized version of `_.shuffle` for arrays.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function arrayShuffle(array) {
      return shuffleSelf(copyArray(array));
    }

    /**
     * This function is like `assignValue` except that it doesn't assign
     * `undefined` values.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignMergeValue(object, key, value) {
      if ((value !== undefined && !eq(object[key], value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Aggregates elements of `collection` on `accumulator` with keys transformed
     * by `iteratee` and values set by `setter`.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform keys.
     * @param {Object} accumulator The initial aggregated object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseAggregator(collection, setter, iteratee, accumulator) {
      baseEach(collection, function(value, key, collection) {
        setter(accumulator, value, iteratee(value), collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.assignIn` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssignIn(object, source) {
      return object && copyObject(source, keysIn(source), object);
    }

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue(object, key, value) {
      if (key == '__proto__' && defineProperty) {
        defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    /**
     * The base implementation of `_.at` without support for individual paths.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {string[]} paths The property paths to pick.
     * @returns {Array} Returns the picked elements.
     */
    function baseAt(object, paths) {
      var index = -1,
          length = paths.length,
          result = Array(length),
          skip = object == null;

      while (++index < length) {
        result[index] = skip ? undefined : get(object, paths[index]);
      }
      return result;
    }

    /**
     * The base implementation of `_.clamp` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     */
    function baseClamp(number, lower, upper) {
      if (number === number) {
        if (upper !== undefined) {
          number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
          number = number >= lower ? number : lower;
        }
      }
      return number;
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Deep clone
     *  2 - Flatten inherited properties
     *  4 - Clone symbols
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, bitmask, customizer, key, object, stack) {
      var result,
          isDeep = bitmask & CLONE_DEEP_FLAG,
          isFlat = bitmask & CLONE_FLAT_FLAG,
          isFull = bitmask & CLONE_SYMBOLS_FLAG;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = (isFlat || isFunc) ? {} : initCloneObject(value);
          if (!isDeep) {
            return isFlat
              ? copySymbolsIn(value, baseAssignIn(result, value))
              : copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (isSet(value)) {
        value.forEach(function(subValue) {
          result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
        });
      } else if (isMap(value)) {
        value.forEach(function(subValue, key) {
          result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
        });
      }

      var keysFunc = isFull
        ? (isFlat ? getAllKeysIn : getAllKeys)
        : (isFlat ? keysIn : keys);

      var props = isArr ? undefined : keysFunc(value);
      arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });
      return result;
    }

    /**
     * The base implementation of `_.conforms` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     */
    function baseConforms(source) {
      var props = keys(source);
      return function(object) {
        return baseConformsTo(object, source, props);
      };
    }

    /**
     * The base implementation of `_.conformsTo` which accepts `props` to check.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     */
    function baseConformsTo(object, source, props) {
      var length = props.length;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (length--) {
        var key = props[length],
            predicate = source[key],
            value = object[key];

        if ((value === undefined && !(key in object)) || !predicate(value)) {
          return false;
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts `args`
     * to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Array} args The arguments to provide to `func`.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of methods like `_.difference` without support
     * for excluding multiple arrays or iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      }
      else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee == null ? value : iteratee(value);

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * The base implementation of methods like `_.max` and `_.min` which accepts a
     * `comparator` to determine the extremum value.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The iteratee invoked per iteration.
     * @param {Function} comparator The comparator used to compare values.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(array, iteratee, comparator) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index],
            current = iteratee(value);

        if (current != null && (computed === undefined
              ? (current === current && !isSymbol(current))
              : comparator(current, computed)
            )) {
          var computed = current,
              result = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = toInteger(start);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : toInteger(end);
      if (end < 0) {
        end += length;
      }
      end = start > end ? 0 : toLength(end);
      while (start < end) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {number} depth The maximum recursion depth.
     * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
     * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1,
          length = array.length;

      predicate || (predicate = isFlattenable);
      result || (result = []);

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForOwn` which iterates over `object`
     * properties returned by `keysFunc` and invokes `iteratee` for each property.
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forOwn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return object && baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from `props`.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the function names.
     */
    function baseFunctions(object, props) {
      return arrayFilter(props, function(key) {
        return isFunction(object[key]);
      });
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = castPath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * The base implementation of `_.gt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     */
    function baseGt(value, other) {
      return value > other;
    }

    /**
     * The base implementation of `_.has` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHas(object, key) {
      return object != null && hasOwnProperty.call(object, key);
    }

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }

    /**
     * The base implementation of `_.inRange` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to check.
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     */
    function baseInRange(number, start, end) {
      return number >= nativeMin(start, end) && number < nativeMax(start, end);
    }

    /**
     * The base implementation of methods like `_.intersection`, without support
     * for iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of shared values.
     */
    function baseIntersection(arrays, iteratee, comparator) {
      var includes = comparator ? arrayIncludesWith : arrayIncludes,
          length = arrays[0].length,
          othLength = arrays.length,
          othIndex = othLength,
          caches = Array(othLength),
          maxLength = Infinity,
          result = [];

      while (othIndex--) {
        var array = arrays[othIndex];
        if (othIndex && iteratee) {
          array = arrayMap(array, baseUnary(iteratee));
        }
        maxLength = nativeMin(array.length, maxLength);
        caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
          ? new SetCache(othIndex && array)
          : undefined;
      }
      array = arrays[0];

      var index = -1,
          seen = caches[0];

      outer:
      while (++index < length && result.length < maxLength) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (!(seen
              ? cacheHas(seen, computed)
              : includes(result, computed, comparator)
            )) {
          othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if (!(cache
                  ? cacheHas(cache, computed)
                  : includes(arrays[othIndex], computed, comparator))
                ) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.invert` and `_.invertBy` which inverts
     * `object` with values transformed by `iteratee` and set by `setter`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform values.
     * @param {Object} accumulator The initial inverted object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseInverter(object, setter, iteratee, accumulator) {
      baseForOwn(object, function(value, key, object) {
        setter(accumulator, iteratee(value), key, object);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.invoke` without support for individual
     * method arguments.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function baseInvoke(object, path, args) {
      path = castPath(path, object);
      object = parent(object, path);
      var func = object == null ? object : object[toKey(last(path))];
      return func == null ? undefined : apply(func, object, args);
    }

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    /**
     * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     */
    function baseIsArrayBuffer(value) {
      return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
    }

    /**
     * The base implementation of `_.isDate` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     */
    function baseIsDate(value) {
      return isObjectLike(value) && baseGetTag(value) == dateTag;
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag : getTag(object),
          othTag = othIsArr ? arrayTag : getTag(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    /**
     * The base implementation of `_.isMap` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     */
    function baseIsMap(value) {
      return isObjectLike(value) && getTag(value) == mapTag;
    }

    /**
     * The base implementation of `_.isMatch` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack;
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === undefined
                ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.isRegExp` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     */
    function baseIsRegExp(value) {
      return isObjectLike(value) && baseGetTag(value) == regexpTag;
    }

    /**
     * The base implementation of `_.isSet` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     */
    function baseIsSet(value) {
      return isObjectLike(value) && getTag(value) == setTag;
    }

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee(value) {
      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == 'object') {
        return isArray(value)
          ? baseMatchesProperty(value[0], value[1])
          : baseMatches(value);
      }
      return property(value);
    }

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.lt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     */
    function baseLt(value, other) {
      return value < other;
    }

    /**
     * The base implementation of `_.map` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return (objValue === undefined && objValue === srcValue)
          ? hasIn(object, path)
          : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }

    /**
     * The base implementation of `_.merge` without support for multiple sources.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack || (stack = new Stack);
        if (isObject(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        }
        else {
          var newValue = customizer
            ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
            : undefined;

          if (newValue === undefined) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = safeGet(object, key),
          srcValue = safeGet(source, key),
          stacked = stack.get(srcValue);

      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer
        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
        : undefined;

      var isCommon = newValue === undefined;

      if (isCommon) {
        var isArr = isArray(srcValue),
            isBuff = !isArr && isBuffer(srcValue),
            isTyped = !isArr && !isBuff && isTypedArray(srcValue);

        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray(objValue)) {
            newValue = objValue;
          }
          else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          }
          else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          }
          else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          }
          else {
            newValue = [];
          }
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          }
          else if (!isObject(objValue) || isFunction(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        }
        else {
          isCommon = false;
        }
      }
      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack['delete'](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }

    /**
     * The base implementation of `_.nth` which doesn't coerce arguments.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {number} n The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     */
    function baseNth(array, n) {
      var length = array.length;
      if (!length) {
        return;
      }
      n += n < 0 ? length : 0;
      return isIndex(n, length) ? array[n] : undefined;
    }

    /**
     * The base implementation of `_.orderBy` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {string[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseOrderBy(collection, iteratees, orders) {
      if (iteratees.length) {
        iteratees = arrayMap(iteratees, function(iteratee) {
          if (isArray(iteratee)) {
            return function(value) {
              return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
            }
          }
          return iteratee;
        });
      } else {
        iteratees = [identity];
      }

      var index = -1;
      iteratees = arrayMap(iteratees, baseUnary(getIteratee()));

      var result = baseMap(collection, function(value, key, collection) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.pick` without support for individual
     * property identifiers.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @returns {Object} Returns the new object.
     */
    function basePick(object, paths) {
      return basePickBy(object, paths, function(value, path) {
        return hasIn(object, path);
      });
    }

    /**
     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @param {Function} predicate The function invoked per property.
     * @returns {Object} Returns the new object.
     */
    function basePickBy(object, paths, predicate) {
      var index = -1,
          length = paths.length,
          result = {};

      while (++index < length) {
        var path = paths[index],
            value = baseGet(object, path);

        if (predicate(value, path)) {
          baseSet(result, castPath(path, object), value);
        }
      }
      return result;
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }

    /**
     * The base implementation of `_.pullAllBy` without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     */
    function basePullAll(array, values, iteratee, comparator) {
      var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
          index = -1,
          length = values.length,
          seen = array;

      if (array === values) {
        values = copyArray(values);
      }
      if (iteratee) {
        seen = arrayMap(array, baseUnary(iteratee));
      }
      while (++index < length) {
        var fromIndex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;

        while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
          if (seen !== array) {
            splice.call(seen, fromIndex, 1);
          }
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * indexes or capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0,
          lastIndex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (length == lastIndex || index !== previous) {
          var previous = index;
          if (isIndex(index)) {
            splice.call(array, index, 1);
          } else {
            baseUnset(array, index);
          }
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for returning
     * floating-point numbers.
     *
     * @private
     * @param {number} lower The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the random number.
     */
    function baseRandom(lower, upper) {
      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
    }

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the range of numbers.
     */
    function baseRange(start, end, step, fromRight) {
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * The base implementation of `_.repeat` which doesn't coerce arguments.
     *
     * @private
     * @param {string} string The string to repeat.
     * @param {number} n The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     */
    function baseRepeat(string, n) {
      var result = '';
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        if (n) {
          string += string;
        }
      } while (n);

      return result;
    }

    /**
     * The base implementation of `_.rest` which doesn't validate or coerce arguments.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     */
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + '');
    }

    /**
     * The base implementation of `_.sample`.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     */
    function baseSample(collection) {
      return arraySample(values(collection));
    }

    /**
     * The base implementation of `_.sampleSize` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function baseSampleSize(collection, n) {
      var array = values(collection);
      return shuffleSelf(array, baseClamp(n, 0, array.length));
    }

    /**
     * The base implementation of `_.set`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseSet(object, path, value, customizer) {
      if (!isObject(object)) {
        return object;
      }
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = toKey(path[index]),
            newValue = value;

        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          return object;
        }

        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : undefined;
          if (newValue === undefined) {
            newValue = isObject(objValue)
              ? objValue
              : (isIndex(path[index + 1]) ? [] : {});
          }
        }
        assignValue(nested, key, newValue);
        nested = nested[key];
      }
      return object;
    }

    /**
     * The base implementation of `setData` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `setToString` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, 'toString', {
        'configurable': true,
        'enumerable': false,
        'value': constant(string),
        'writable': true
      });
    };

    /**
     * The base implementation of `_.shuffle`.
     *
     * @private
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function baseShuffle(collection) {
      return shuffleSelf(values(collection));
    }

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
     * performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndex(array, value, retHighest) {
      var low = 0,
          high = array == null ? low : array.length;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if (computed !== null && !isSymbol(computed) &&
              (retHighest ? (computed <= value) : (computed < value))) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return baseSortedIndexBy(array, value, identity, retHighest);
    }

    /**
     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
     * which invokes `iteratee` for `value` and each element of `array` to compute
     * their sort ranking. The iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The iteratee invoked per element.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndexBy(array, value, iteratee, retHighest) {
      var low = 0,
          high = array == null ? 0 : array.length;
      if (high === 0) {
        return 0;
      }

      value = iteratee(value);
      var valIsNaN = value !== value,
          valIsNull = value === null,
          valIsSymbol = isSymbol(value),
          valIsUndefined = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            othIsDefined = computed !== undefined,
            othIsNull = computed === null,
            othIsReflexive = computed === computed,
            othIsSymbol = isSymbol(computed);

        if (valIsNaN) {
          var setLow = retHighest || othIsReflexive;
        } else if (valIsUndefined) {
          setLow = othIsReflexive && (retHighest || othIsDefined);
        } else if (valIsNull) {
          setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
        } else if (valIsSymbol) {
          setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
        } else if (othIsNull || othIsSymbol) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniq(array, iteratee) {
      var index = -1,
          length = array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (!index || !eq(computed, seen)) {
          var seen = computed;
          result[resIndex++] = value === 0 ? 0 : value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.toNumber` which doesn't ensure correct
     * conversions of binary, hexadecimal, or octal string values.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     */
    function baseToNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      return +value;
    }

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isArray(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return arrayMap(value, baseToString) + '';
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * The base implementation of `_.uniqBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseUniq(array, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          length = array.length,
          isCommon = true,
          result = [],
          seen = result;

      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      }
      else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache;
      }
      else {
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.unset`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The property path to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     */
    function baseUnset(object, path) {
      path = castPath(path, object);
      object = parent(object, path);
      return object == null || delete object[toKey(last(path))];
    }

    /**
     * The base implementation of `_.update`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to update.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseUpdate(object, path, updater, customizer) {
      return baseSet(object, path, updater(baseGet(object, path)), customizer);
    }

    /**
     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
     * without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) &&
        predicate(array[index], index, array)) {}

      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to perform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      return arrayReduce(actions, function(result, action) {
        return action.func.apply(action.thisArg, arrayPush([result], action.args));
      }, result);
    }

    /**
     * The base implementation of methods like `_.xor`, without support for
     * iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of values.
     */
    function baseXor(arrays, iteratee, comparator) {
      var length = arrays.length;
      if (length < 2) {
        return length ? baseUniq(arrays[0]) : [];
      }
      var index = -1,
          result = Array(length);

      while (++index < length) {
        var array = arrays[index],
            othIndex = -1;

        while (++othIndex < length) {
          if (othIndex != index) {
            result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
          }
        }
      }
      return baseUniq(baseFlatten(result, 1), iteratee, comparator);
    }

    /**
     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
     *
     * @private
     * @param {Array} props The property identifiers.
     * @param {Array} values The property values.
     * @param {Function} assignFunc The function to assign values.
     * @returns {Object} Returns the new object.
     */
    function baseZipObject(props, values, assignFunc) {
      var index = -1,
          length = props.length,
          valsLength = values.length,
          result = {};

      while (++index < length) {
        var value = index < valsLength ? values[index] : undefined;
        assignFunc(result, props[index], value);
      }
      return result;
    }

    /**
     * Casts `value` to an empty array if it's not an array like object.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array|Object} Returns the cast array-like object.
     */
    function castArrayLikeObject(value) {
      return isArrayLikeObject(value) ? value : [];
    }

    /**
     * Casts `value` to `identity` if it's not a function.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Function} Returns cast function.
     */
    function castFunction(value) {
      return typeof value == 'function' ? value : identity;
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {Object} [object] The object to query keys on.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value, object) {
      if (isArray(value)) {
        return value;
      }
      return isKey(value, object) ? [value] : stringToPath(toString(value));
    }

    /**
     * A `baseRest` alias which can be replaced with `identity` by module
     * replacement plugins.
     *
     * @private
     * @type {Function}
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    var castRest = baseRest;

    /**
     * Casts `array` to a slice if it's needed.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {number} start The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the cast slice.
     */
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === undefined ? length : end;
      return (!start && end >= length) ? array : baseSlice(array, start, end);
    }

    /**
     * A simple wrapper around the global [`clearTimeout`](https://mdn.io/clearTimeout).
     *
     * @private
     * @param {number|Object} id The timer id or timeout object of the timer to clear.
     */
    var clearTimeout = ctxClearTimeout || function(id) {
      return root.clearTimeout(id);
    };

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    /**
     * Compares values to sort them in ascending order.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {number} Returns the sort order indicator for `value`.
     */
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== undefined,
            valIsNull = value === null,
            valIsReflexive = value === value,
            valIsSymbol = isSymbol(value);

        var othIsDefined = other !== undefined,
            othIsNull = other === null,
            othIsReflexive = other === other,
            othIsSymbol = isSymbol(other);

        if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
            (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
            (valIsNull && othIsDefined && othIsReflexive) ||
            (!valIsDefined && othIsReflexive) ||
            !valIsReflexive) {
          return 1;
        }
        if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
            (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
            (othIsNull && valIsDefined && valIsReflexive) ||
            (!othIsDefined && valIsReflexive) ||
            !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }

    /**
     * Used by `_.orderBy` to compare multiple properties of a value to another
     * and stable sort them.
     *
     * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
     * specify an order of "desc" for descending or "asc" for ascending sort order
     * of corresponding values.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {boolean[]|string[]} orders The order to sort by for each property.
     * @returns {number} Returns the sort order indicator for `object`.
     */
    function compareMultiple(object, other, orders) {
      var index = -1,
          objCriteria = object.criteria,
          othCriteria = other.criteria,
          length = objCriteria.length,
          ordersLength = orders.length;

      while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
          if (index >= ordersLength) {
            return result;
          }
          var order = orders[index];
          return result * (order == 'desc' ? -1 : 1);
        }
      }
      // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
      // that causes it, under certain circumstances, to provide the same value for
      // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
      // for more details.
      //
      // This also ensures a stable sort in V8 and other engines.
      // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
      return object.index - other.index;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersLength = holders.length,
          leftIndex = -1,
          leftLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(leftLength + rangeLength),
          isUncurried = !isCurried;

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[holders[argsIndex]] = args[argsIndex];
        }
      }
      while (rangeLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersIndex = -1,
          holdersLength = holders.length,
          rightIndex = -1,
          rightLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(rangeLength + rightLength),
          isUncurried = !isCurried;

      while (++argsIndex < rangeLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[offset + holders[holdersIndex]] = args[argsIndex++];
        }
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        if (newValue === undefined) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }

    /**
     * Copies own symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Copies own and inherited symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbolsIn(source, object) {
      return copyObject(source, getSymbolsIn(source), object);
    }

    /**
     * Creates a function like `_.groupBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} [initializer] The accumulator object initializer.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee) {
        var func = isArray(collection) ? arrayAggregator : baseAggregator,
            accumulator = initializer ? initializer() : {};

        return func(collection, setter, getIteratee(iteratee, 2), accumulator);
      };
    }

    /**
     * Creates a function like `_.assign`.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard = length > 2 ? sources[2] : undefined;

        customizer = (assigner.length > 3 && typeof customizer == 'function')
          ? (length--, customizer)
          : undefined;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length,
            index = fromRight ? length : -1,
            iterable = Object(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createBind(func, bitmask, thisArg) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.lowerFirst`.
     *
     * @private
     * @param {string} methodName The name of the `String` case method to use.
     * @returns {Function} Returns the new case function.
     */
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString(string);

        var strSymbols = hasUnicode(string)
          ? stringToArray(string)
          : undefined;

        var chr = strSymbols
          ? strSymbols[0]
          : string.charAt(0);

        var trailing = strSymbols
          ? castSlice(strSymbols, 1).join('')
          : string.slice(1);

        return chr[methodName]() + trailing;
      };
    }

    /**
     * Creates a function like `_.camelCase`.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtor(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors. See
        // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a function that wraps `func` to enable currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {number} arity The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCurry(func, bitmask, arity) {
      var Ctor = createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length,
            placeholder = getHolder(wrapper);

        while (index--) {
          args[index] = arguments[index];
        }
        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
          ? []
          : replaceHolders(args, placeholder);

        length -= holders.length;
        if (length < arity) {
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, undefined,
            args, holders, undefined, undefined, arity - length);
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return apply(fn, this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} findIndexFunc The function to find the collection index.
     * @returns {Function} Returns the new find function.
     */
    function createFind(findIndexFunc) {
      return function(collection, predicate, fromIndex) {
        var iterable = Object(collection);
        if (!isArrayLike(collection)) {
          var iteratee = getIteratee(predicate, 3);
          collection = keys(collection);
          predicate = function(key) { return iteratee(iterable[key], key, iterable); };
        }
        var index = findIndexFunc(collection, predicate, fromIndex);
        return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
      };
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return flatRest(function(funcs) {
        var length = funcs.length,
            index = length,
            prereq = LodashWrapper.prototype.thru;

        if (fromRight) {
          funcs.reverse();
        }
        while (index--) {
          var func = funcs[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
            var wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? index : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) &&
                data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
                !data[4].length && data[9] == 1
              ) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func))
              ? wrapper[funcName]()
              : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value)) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      });
    }

    /**
     * Creates a function that wraps `func` to invoke it with optional `this`
     * binding of `thisArg`, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided
     *  to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & WRAP_ARY_FLAG,
          isBind = bitmask & WRAP_BIND_FLAG,
          isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
          isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
          isFlip = bitmask & WRAP_FLIP_FLAG,
          Ctor = isBindKey ? undefined : createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length;

        while (index--) {
          args[index] = arguments[index];
        }
        if (isCurried) {
          var placeholder = getHolder(wrapper),
              holdersCount = countHolders(args, placeholder);
        }
        if (partials) {
          args = composeArgs(args, partials, holders, isCurried);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
        }
        length -= holdersCount;
        if (isCurried && length < arity) {
          var newHolders = replaceHolders(args, placeholder);
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, thisArg,
            args, newHolders, argPos, ary, arity - length
          );
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        length = args.length;
        if (argPos) {
          args = reorder(args, argPos);
        } else if (isFlip && length > 1) {
          args.reverse();
        }
        if (isAry && ary < length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtor(fn);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.invertBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} toIteratee The function to resolve iteratees.
     * @returns {Function} Returns the new inverter function.
     */
    function createInverter(setter, toIteratee) {
      return function(object, iteratee) {
        return baseInverter(object, setter, toIteratee(iteratee), {});
      };
    }

    /**
     * Creates a function that performs a mathematical operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @param {number} [defaultValue] The value used for `undefined` arguments.
     * @returns {Function} Returns the new mathematical operation function.
     */
    function createMathOperation(operator, defaultValue) {
      return function(value, other) {
        var result;
        if (value === undefined && other === undefined) {
          return defaultValue;
        }
        if (value !== undefined) {
          result = value;
        }
        if (other !== undefined) {
          if (result === undefined) {
            return other;
          }
          if (typeof value == 'string' || typeof other == 'string') {
            value = baseToString(value);
            other = baseToString(other);
          } else {
            value = baseToNumber(value);
            other = baseToNumber(other);
          }
          result = operator(value, other);
        }
        return result;
      };
    }

    /**
     * Creates a function like `_.over`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over iteratees.
     * @returns {Function} Returns the new over function.
     */
    function createOver(arrayFunc) {
      return flatRest(function(iteratees) {
        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
        return baseRest(function(args) {
          var thisArg = this;
          return arrayFunc(iteratees, function(iteratee) {
            return apply(iteratee, thisArg, args);
          });
        });
      });
    }

    /**
     * Creates the padding for `string` based on `length`. The `chars` string
     * is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {number} length The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padding for `string`.
     */
    function createPadding(length, chars) {
      chars = chars === undefined ? ' ' : baseToString(chars);

      var charsLength = chars.length;
      if (charsLength < 2) {
        return charsLength ? baseRepeat(chars, length) : chars;
      }
      var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
      return hasUnicode(chars)
        ? castSlice(stringToArray(result), 0, length).join('')
        : result.slice(0, length);
    }

    /**
     * Creates a function that wraps `func` to invoke it with the `this` binding
     * of `thisArg` and `partials` prepended to the arguments it receives.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to
     *  the new function.
     * @returns {Function} Returns the new wrapped function.
     */
    function createPartial(func, bitmask, thisArg, partials) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength),
            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        return apply(fn, isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.range` or `_.rangeRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new range function.
     */
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
          end = step = undefined;
        }
        // Ensure the sign of `-0` is preserved.
        start = toFinite(start);
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
        return baseRange(start, end, step, fromRight);
      };
    }

    /**
     * Creates a function that performs a relational operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @returns {Function} Returns the new relational operation function.
     */
    function createRelationalOperation(operator) {
      return function(value, other) {
        if (!(typeof value == 'string' && typeof other == 'string')) {
          value = toNumber(value);
          other = toNumber(other);
        }
        return operator(value, other);
      };
    }

    /**
     * Creates a function that wraps `func` to continue currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {Function} wrapFunc The function to create the `func` wrapper.
     * @param {*} placeholder The placeholder value.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
      var isCurry = bitmask & WRAP_CURRY_FLAG,
          newHolders = isCurry ? holders : undefined,
          newHoldersRight = isCurry ? undefined : holders,
          newPartials = isCurry ? partials : undefined,
          newPartialsRight = isCurry ? undefined : partials;

      bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);
      bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

      if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
        bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
      }
      var newData = [
        func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
        newHoldersRight, argPos, ary, arity
      ];

      var result = wrapFunc.apply(undefined, newData);
      if (isLaziable(func)) {
        setData(result, newData);
      }
      result.placeholder = placeholder;
      return setWrapToString(result, func, bitmask);
    }

    /**
     * Creates a function like `_.round`.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        number = toNumber(number);
        precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
        if (precision && nativeIsFinite(number)) {
          // Shift with exponential notation to avoid floating-point issues.
          // See [MDN](https://mdn.io/round#Examples) for more details.
          var pair = (toString(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));

          pair = (toString(value) + 'e').split('e');
          return +(pair[0] + 'e' + (+pair[1] - precision));
        }
        return func(number);
      };
    }

    /**
     * Creates a set object of `values`.
     *
     * @private
     * @param {Array} values The values to add to the set.
     * @returns {Object} Returns the new set.
     */
    var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
      return new Set(values);
    };

    /**
     * Creates a `_.toPairs` or `_.toPairsIn` function.
     *
     * @private
     * @param {Function} keysFunc The function to get the keys of a given object.
     * @returns {Function} Returns the new pairs function.
     */
    function createToPairs(keysFunc) {
      return function(object) {
        var tag = getTag(object);
        if (tag == mapTag) {
          return mapToArray(object);
        }
        if (tag == setTag) {
          return setToPairs(object);
        }
        return baseToPairs(object, keysFunc(object));
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags.
     *    1 - `_.bind`
     *    2 - `_.bindKey`
     *    4 - `_.curry` or `_.curryRight` of a bound function
     *    8 - `_.curry`
     *   16 - `_.curryRight`
     *   32 - `_.partial`
     *   64 - `_.partialRight`
     *  128 - `_.rearg`
     *  256 - `_.ary`
     *  512 - `_.flip`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
      arity = arity === undefined ? arity : toInteger(arity);
      length -= holders ? holders.length : 0;

      if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func);

      var newData = [
        func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
        argPos, ary, arity
      ];

      if (data) {
        mergeData(newData, data);
      }
      func = newData[0];
      bitmask = newData[1];
      thisArg = newData[2];
      partials = newData[3];
      holders = newData[4];
      arity = newData[9] = newData[9] === undefined
        ? (isBindKey ? 0 : func.length)
        : nativeMax(newData[9] - length, 0);

      if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
        bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
      }
      if (!bitmask || bitmask == WRAP_BIND_FLAG) {
        var result = createBind(func, bitmask, thisArg);
      } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
        result = createCurry(func, bitmask, arity);
      } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
        result = createPartial(func, bitmask, thisArg, partials);
      } else {
        result = createHybrid.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setWrapToString(setter(result, newData), func, bitmask);
    }

    /**
     * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
     * of source objects to the destination object for all destination properties
     * that resolve to `undefined`.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to assign.
     * @param {Object} object The parent object of `objValue`.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsAssignIn(objValue, srcValue, key, object) {
      if (objValue === undefined ||
          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        return srcValue;
      }
      return objValue;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
     * objects into destination objects that are passed thru.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to merge.
     * @param {Object} object The parent object of `objValue`.
     * @param {Object} source The parent object of `srcValue`.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
      if (isObject(objValue) && isObject(srcValue)) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, objValue);
        baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
        stack['delete'](srcValue);
      }
      return objValue;
    }

    /**
     * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
     * objects.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {string} key The key of the property to inspect.
     * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
     */
    function customOmitClone(value) {
      return isPlainObject(value) ? undefined : value;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Check that cyclic values are equal.
      var arrStacked = stack.get(array);
      var othStacked = stack.get(other);
      if (arrStacked && othStacked) {
        return arrStacked == other && othStacked == array;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraySome(other, function(othValue, othIndex) {
                if (!cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      // Check that cyclic values are equal.
      var objStacked = stack.get(object);
      var othStacked = stack.get(other);
      if (objStacked && othStacked) {
        return objStacked == other && othStacked == object;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseRest` which flattens the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    function flatRest(func) {
      return setToString(overRest(func, undefined, flatten), func + '');
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Creates an array of own and inherited enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeysIn(object) {
      return baseGetAllKeys(object, keysIn, getSymbolsIn);
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = (func.name + ''),
          array = realNames[result],
          length = hasOwnProperty.call(realNames, result) ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the argument placeholder value for `func`.
     *
     * @private
     * @param {Function} func The function to inspect.
     * @returns {*} Returns the placeholder value.
     */
    function getHolder(func) {
      var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
      return object.placeholder;
    }

    /**
     * Gets the appropriate "iteratee" function. If `_.iteratee` is customized,
     * this function returns the custom method, otherwise it returns `baseIteratee`.
     * If arguments are provided, the chosen function is invoked with them and
     * its result is returned.
     *
     * @private
     * @param {*} [value] The value to convert to an iteratee.
     * @param {number} [arity] The arity of the created iteratee.
     * @returns {Function} Returns the chosen function or its result.
     */
    function getIteratee() {
      var result = lodash.iteratee || iteratee;
      result = result === iteratee ? baseIteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = keys(object),
          length = result.length;

      while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    /**
     * Creates an array of the own and inherited enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
      var result = [];
      while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
      }
      return result;
    };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map && getTag(new Map) != mapTag) ||
        (Promise && getTag(Promise.resolve()) != promiseTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Extracts wrapper details from the `source` body comment.
     *
     * @private
     * @param {string} source The source to inspect.
     * @returns {Array} Returns the wrapper details.
     */
    function getWrapDetails(source) {
      var match = source.match(reWrapDetails);
      return match ? match[1].split(reSplitDetails) : [];
    }

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     */
    function hasPath(object, path, hasFunc) {
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          result = false;

      while (++index < length) {
        var key = toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength(length) && isIndex(key, length) &&
        (isArray(object) || isArguments(object));
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototype(object))
        : {};
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case dataViewTag:
          return cloneDataView(object, isDeep);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return new Ctor;

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return new Ctor;

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Inserts wrapper `details` in a comment at the top of the `source` body.
     *
     * @private
     * @param {string} source The source to modify.
     * @returns {Array} details The details to insert.
     * @returns {string} Returns the modified source.
     */
    function insertWrapDetails(source, details) {
      var length = details.length;
      if (!length) {
        return source;
      }
      var lastIndex = length - 1;
      details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
      details = details.join(length > 2 ? ', ' : ' ');
      return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
    }

    /**
     * Checks if `value` is a flattenable `arguments` object or array.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
     */
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) ||
        !!(spreadableSymbol && value && value[spreadableSymbol]);
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
     *  else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isArrayLike(object) && isIndex(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
     *  else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func),
          other = lodash[funcName];

      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
        return false;
      }
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Checks if `func` is capable of being masked.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
     */
    var isMaskable = coreJsData ? isFunction : stubFalse;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * A specialized version of `matchesProperty` for source values suitable
     * for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue &&
          (srcValue !== undefined || (key in Object(object)));
      };
    }

    /**
     * A specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
     *
     * @private
     * @param {Function} func The function to have its output memoized.
     * @returns {Function} Returns the new memoized function.
     */
    function memoizeCapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers used to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and
     * `_.rearg` modify function arguments, making the order in which they are
     * executed important, preventing the merging of metadata. However, we make
     * an exception for a safe combined case where curried functions have `_.ary`
     * and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);

      var isCombo =
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||
        ((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & WRAP_BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : value;
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = value;
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & WRAP_ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * This function is like
     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /**
     * A specialized version of `baseRest` which transforms the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @param {Function} transform The rest array transform.
     * @returns {Function} Returns the new function.
     */
    function overRest(func, start, transform) {
      start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }

    /**
     * Gets the parent value at `path` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path to get the parent value of.
     * @returns {*} Returns the parent value.
     */
    function parent(object, path) {
      return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = copyArray(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function safeGet(object, key) {
      if (key === 'constructor' && typeof object[key] === 'function') {
        return;
      }

      if (key == '__proto__') {
        return;
      }

      return object[key];
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity
     * function to avoid garbage collection pauses in V8. See
     * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = shortOut(baseSetData);

    /**
     * A simple wrapper around the global [`setTimeout`](https://mdn.io/setTimeout).
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    var setTimeout = ctxSetTimeout || function(func, wait) {
      return root.setTimeout(func, wait);
    };

    /**
     * Sets the `toString` method of `func` to return `string`.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var setToString = shortOut(baseSetToString);

    /**
     * Sets the `toString` method of `wrapper` to mimic the source of `reference`
     * with wrapper details in a comment at the top of the source body.
     *
     * @private
     * @param {Function} wrapper The function to modify.
     * @param {Function} reference The reference function.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Function} Returns `wrapper`.
     */
    function setWrapToString(wrapper, reference, bitmask) {
      var source = (reference + '');
      return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
    }

    /**
     * Creates a function that'll short out and invoke `identity` instead
     * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
     * milliseconds.
     *
     * @private
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new shortable function.
     */
    function shortOut(func) {
      var count = 0,
          lastCalled = 0;

      return function() {
        var stamp = nativeNow(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(undefined, arguments);
      };
    }

    /**
     * A specialized version of `_.shuffle` which mutates and sets the size of `array`.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @param {number} [size=array.length] The size of `array`.
     * @returns {Array} Returns `array`.
     */
    function shuffleSelf(array, size) {
      var index = -1,
          length = array.length,
          lastIndex = length - 1;

      size = size === undefined ? length : size;
      while (++index < size) {
        var rand = baseRandom(index, lastIndex),
            value = array[rand];

        array[rand] = array[index];
        array[index] = value;
      }
      array.length = size;
      return array;
    }

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46 /* . */) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Updates wrapper `details` based on `bitmask` flags.
     *
     * @private
     * @returns {Array} details The details to modify.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Array} Returns `details`.
     */
    function updateWrapDetails(details, bitmask) {
      arrayEach(wrapFlags, function(pair) {
        var value = '_.' + pair[0];
        if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
          details.push(value);
        }
      });
      return details.sort();
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      if (wrapper instanceof LazyWrapper) {
        return wrapper.clone();
      }
      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
      result.__actions__ = copyArray(wrapper.__actions__);
      result.__index__  = wrapper.__index__;
      result.__values__ = wrapper.__values__;
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `array` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the new array of chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
        size = 1;
      } else {
        size = nativeMax(toInteger(size), 0);
      }
      var length = array == null ? 0 : array.length;
      if (!length || size < 1) {
        return [];
      }
      var index = 0,
          resIndex = 0,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[resIndex++] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Creates a new array concatenating `array` with any additional arrays
     * and/or values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to concatenate.
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var other = _.concat(array, 2, [3], [[4]]);
     *
     * console.log(other);
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    function concat() {
      var length = arguments.length;
      if (!length) {
        return [];
      }
      var args = Array(length - 1),
          array = arguments[0],
          index = length;

      while (index--) {
        args[index - 1] = arguments[index];
      }
      return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
    }

    /**
     * Creates an array of `array` values not included in the other given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * **Note:** Unlike `_.pullAll`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.without, _.xor
     * @example
     *
     * _.difference([2, 1], [2, 3]);
     * // => [1]
     */
    var difference = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `iteratee` which
     * is invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * **Note:** Unlike `_.pullAllBy`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var differenceBy = baseRest(function(array, values) {
      var iteratee = last(values);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `comparator`
     * which is invoked to compare elements of `array` to `values`. The order and
     * references of result values are determined by the first array. The comparator
     * is invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.pullAllWith`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     *
     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }]
     */
    var differenceWith = baseRest(function(array, values) {
      var comparator = last(values);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator)
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.dropRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropRightWhile(users, ['active', false]);
     * // => objects for ['barney']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropRightWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.dropWhile(users, function(o) { return !o.active; });
     * // => objects for ['pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropWhile(users, ['active', false]);
     * // => objects for ['pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8, 10], '*', 1, 3);
     * // => [4, '*', '*', 10]
     */
    function fill(array, value, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(o) { return o.user == 'barney'; });
     * // => 0
     *
     * // The `_.matches` iteratee shorthand.
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findIndex(users, ['active', false]);
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.findIndex(users, 'active');
     * // => 2
     */
    function findIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index);
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
     * // => 2
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastIndex(users, ['active', false]);
     * // => 2
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    function findLastIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length - 1;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = fromIndex < 0
          ? nativeMax(length + index, 0)
          : nativeMin(index, length - 1);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index, true);
    }

    /**
     * Flattens `array` a single level deep.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, [3, [4]], 5]]);
     * // => [1, 2, [3, [4]], 5]
     */
    function flatten(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, 1) : [];
    }

    /**
     * Recursively flattens `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, [3, [4]], 5]]);
     * // => [1, 2, 3, 4, 5]
     */
    function flattenDeep(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, INFINITY) : [];
    }

    /**
     * Recursively flatten `array` up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * var array = [1, [2, [3, [4]], 5]];
     *
     * _.flattenDepth(array, 1);
     * // => [1, 2, [3, [4]], 5]
     *
     * _.flattenDepth(array, 2);
     * // => [1, 2, 3, [4], 5]
     */
    function flattenDepth(array, depth) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(array, depth);
    }

    /**
     * The inverse of `_.toPairs`; this method returns an object composed
     * from key-value `pairs`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} pairs The key-value pairs.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.fromPairs([['a', 1], ['b', 2]]);
     * // => { 'a': 1, 'b': 2 }
     */
    function fromPairs(pairs) {
      var index = -1,
          length = pairs == null ? 0 : pairs.length,
          result = {};

      while (++index < length) {
        var pair = pairs[index];
        result[pair[0]] = pair[1];
      }
      return result;
    }

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias first
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.head([1, 2, 3]);
     * // => 1
     *
     * _.head([]);
     * // => undefined
     */
    function head(array) {
      return (array && array.length) ? array[0] : undefined;
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it's used as the
     * offset from the end of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // Search from the `fromIndex`.
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     */
    function indexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseIndexOf(array, value, index);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 0, -1) : [];
    }

    /**
     * Creates an array of unique values that are included in all given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersection([2, 1], [2, 3]);
     * // => [2]
     */
    var intersection = baseRest(function(arrays) {
      var mapped = arrayMap(arrays, castArrayLikeObject);
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped)
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `iteratee`
     * which is invoked for each element of each `arrays` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [2.1]
     *
     * // The `_.property` iteratee shorthand.
     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }]
     */
    var intersectionBy = baseRest(function(arrays) {
      var iteratee = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      if (iteratee === last(mapped)) {
        iteratee = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `comparator`
     * which is invoked to compare elements of `arrays`. The order and references
     * of result values are determined by the first array. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.intersectionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }]
     */
    var intersectionWith = baseRest(function(arrays) {
      var comparator = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      comparator = typeof comparator == 'function' ? comparator : undefined;
      if (comparator) {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, undefined, comparator)
        : [];
    });

    /**
     * Converts all elements in `array` into a string separated by `separator`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to convert.
     * @param {string} [separator=','] The element separator.
     * @returns {string} Returns the joined string.
     * @example
     *
     * _.join(['a', 'b', 'c'], '~');
     * // => 'a~b~c'
     */
    function join(array, separator) {
      return array == null ? '' : nativeJoin.call(array, separator);
    }

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array == null ? 0 : array.length;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // Search from the `fromIndex`.
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
      }
      return value === value
        ? strictLastIndexOf(array, value, index)
        : baseFindIndex(array, baseIsNaN, index, true);
    }

    /**
     * Gets the element at index `n` of `array`. If `n` is negative, the nth
     * element from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.11.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=0] The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     *
     * _.nth(array, 1);
     * // => 'b'
     *
     * _.nth(array, -2);
     * // => 'c';
     */
    function nth(array, n) {
      return (array && array.length) ? baseNth(array, toInteger(n)) : undefined;
    }

    /**
     * Removes all given values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
     * to remove elements from an array by predicate.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pull(array, 'a', 'c');
     * console.log(array);
     * // => ['b', 'b']
     */
    var pull = baseRest(pullAll);

    /**
     * This method is like `_.pull` except that it accepts an array of values to remove.
     *
     * **Note:** Unlike `_.difference`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pullAll(array, ['a', 'c']);
     * console.log(array);
     * // => ['b', 'b']
     */
    function pullAll(array, values) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values)
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `iteratee` which is
     * invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The iteratee is invoked with one argument: (value).
     *
     * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
     *
     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
     * console.log(array);
     * // => [{ 'x': 2 }]
     */
    function pullAllBy(array, values, iteratee) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, getIteratee(iteratee, 2))
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `comparator` which
     * is invoked to compare elements of `array` to `values`. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
     *
     * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
     * console.log(array);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
     */
    function pullAllWith(array, values, comparator) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, undefined, comparator)
        : array;
    }

    /**
     * Removes elements from `array` corresponding to `indexes` and returns an
     * array of removed elements.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     * var pulled = _.pullAt(array, [1, 3]);
     *
     * console.log(array);
     * // => ['a', 'c']
     *
     * console.log(pulled);
     * // => ['b', 'd']
     */
    var pullAt = flatRest(function(array, indexes) {
      var length = array == null ? 0 : array.length,
          result = baseAt(array, indexes);

      basePullAt(array, arrayMap(indexes, function(index) {
        return isIndex(index, length) ? +index : index;
      }).sort(compareAscending));

      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is invoked
     * with three arguments: (value, index, array).
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
     * to pull elements from an array by value.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getIteratee(predicate, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Reverses `array` so that the first element becomes the last, the second
     * element becomes the second to last, and so on.
     *
     * **Note:** This method mutates `array` and is based on
     * [`Array#reverse`](https://mdn.io/Array/reverse).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.reverse(array);
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function reverse(array) {
      return array == null ? array : nativeReverse.call(array);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of
     * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
     * returned.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      else {
        start = start == null ? 0 : toInteger(start);
        end = end === undefined ? length : toInteger(end);
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     */
    function sortedIndex(array, value) {
      return baseSortedIndex(array, value);
    }

    /**
     * This method is like `_.sortedIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
     * // => 0
     */
    function sortedIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
    }

    /**
     * This method is like `_.indexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
     * // => 1
     */
    function sortedIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value);
        if (index < length && eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 5, 5, 5, 6], 5);
     * // => 4
     */
    function sortedLastIndex(array, value) {
      return baseSortedIndex(array, value, true);
    }

    /**
     * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 1
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
     * // => 1
     */
    function sortedLastIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
    }

    /**
     * This method is like `_.lastIndexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
     * // => 3
     */
    function sortedLastIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value, true) - 1;
        if (eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.uniq` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniq([1, 1, 2]);
     * // => [1, 2]
     */
    function sortedUniq(array) {
      return (array && array.length)
        ? baseSortedUniq(array)
        : [];
    }

    /**
     * This method is like `_.uniqBy` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
     * // => [1.1, 2.3]
     */
    function sortedUniqBy(array, iteratee) {
      return (array && array.length)
        ? baseSortedUniq(array, getIteratee(iteratee, 2))
        : [];
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.tail([1, 2, 3]);
     * // => [2, 3]
     */
    function tail(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 1, length) : [];
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      if (!(array && array.length)) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.takeRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeRightWhile(users, ['active', false]);
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeRightWhile(users, 'active');
     * // => []
     */
    function takeRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.takeWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeWhile(users, ['active', false]);
     * // => objects for ['barney', 'fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeWhile(users, 'active');
     * // => []
     */
    function takeWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all given arrays using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([2], [1, 2]);
     * // => [2, 1]
     */
    var union = baseRest(function(arrays) {
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
    });

    /**
     * This method is like `_.union` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which uniqueness is computed. Result values are chosen from the first
     * array in which the value occurs. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.unionBy([2.1], [1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    var unionBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.union` except that it accepts `comparator` which
     * is invoked to compare elements of `arrays`. Result values are chosen from
     * the first array in which the value occurs. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.unionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var unionWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurrence of each element
     * is kept. The order of result values is determined by the order they occur
     * in the array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     */
    function uniq(array) {
      return (array && array.length) ? baseUniq(array) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * uniqueness is computed. The order of result values is determined by the
     * order they occur in the array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniqBy(array, iteratee) {
      return (array && array.length) ? baseUniq(array, getIteratee(iteratee, 2)) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `comparator` which
     * is invoked to compare elements of `array`. The order of result values is
     * determined by the order they occur in the array.The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.uniqWith(objects, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
     */
    function uniqWith(array, comparator) {
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return (array && array.length) ? baseUniq(array, undefined, comparator) : [];
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @since 1.2.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     *
     * _.unzip(zipped);
     * // => [['a', 'b'], [1, 2], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var length = 0;
      array = arrayFilter(array, function(group) {
        if (isArrayLikeObject(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      return baseTimes(length, function(index) {
        return arrayMap(array, baseProperty(index));
      });
    }

    /**
     * This method is like `_.unzip` except that it accepts `iteratee` to specify
     * how regrouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  regrouped values.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee) {
      if (!(array && array.length)) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      return arrayMap(result, function(group) {
        return apply(iteratee, undefined, group);
      });
    }

    /**
     * Creates an array excluding all given values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.pull`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.xor
     * @example
     *
     * _.without([2, 1, 2, 3], 1, 2);
     * // => [3]
     */
    var without = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the
     * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the given arrays. The order of result values is determined by the order
     * they occur in the arrays.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.without
     * @example
     *
     * _.xor([2, 1], [2, 3]);
     * // => [1, 3]
     */
    var xor = baseRest(function(arrays) {
      return baseXor(arrayFilter(arrays, isArrayLikeObject));
    });

    /**
     * This method is like `_.xor` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which by which they're compared. The order of result values is determined
     * by the order they occur in the arrays. The iteratee is invoked with one
     * argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2, 3.4]
     *
     * // The `_.property` iteratee shorthand.
     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var xorBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.xor` except that it accepts `comparator` which is
     * invoked to compare elements of `arrays`. The order of result values is
     * determined by the order they occur in the arrays. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.xorWith(objects, others, _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var xorWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
    });

    /**
     * Creates an array of grouped elements, the first of which contains the
     * first elements of the given arrays, the second of which contains the
     * second elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     */
    var zip = baseRest(unzip);

    /**
     * This method is like `_.fromPairs` except that it accepts two arrays,
     * one of property identifiers and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 0.4.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject(['a', 'b'], [1, 2]);
     * // => { 'a': 1, 'b': 2 }
     */
    function zipObject(props, values) {
      return baseZipObject(props || [], values || [], assignValue);
    }

    /**
     * This method is like `_.zipObject` except that it supports property paths.
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
     */
    function zipObjectDeep(props, values) {
      return baseZipObject(props || [], values || [], baseSet);
    }

    /**
     * This method is like `_.zip` except that it accepts `iteratee` to specify
     * how grouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  grouped values.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
     *   return a + b + c;
     * });
     * // => [111, 222]
     */
    var zipWith = baseRest(function(arrays) {
      var length = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined;

      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
      return unzipWith(arrays, iteratee);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` wrapper instance that wraps `value` with explicit method
     * chain sequences enabled. The result of such sequences must be unwrapped
     * with `_#value`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Seq
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _
     *   .chain(users)
     *   .sortBy('age')
     *   .map(function(o) {
     *     return o.user + ' is ' + o.age;
     *   })
     *   .head()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor
     * is invoked with one argument; (value). The purpose of this method is to
     * "tap into" a method chain sequence in order to modify intermediate results.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    // Mutate input array.
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     * The purpose of this method is to "pass thru" values replacing intermediate
     * results in a method chain sequence.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor) {
      return interceptor(value);
    }

    /**
     * This method is the wrapper version of `_.at`.
     *
     * @name at
     * @memberOf _
     * @since 1.0.0
     * @category Seq
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _(object).at(['a[0].b.c', 'a[1]']).value();
     * // => [3, 4]
     */
    var wrapperAt = flatRest(function(paths) {
      var length = paths.length,
          start = length ? paths[0] : 0,
          value = this.__wrapped__,
          interceptor = function(object) { return baseAt(object, paths); };

      if (length > 1 || this.__actions__.length ||
          !(value instanceof LazyWrapper) || !isIndex(start)) {
        return this.thru(interceptor);
      }
      value = value.slice(start, +start + (length ? 1 : 0));
      value.__actions__.push({
        'func': thru,
        'args': [interceptor],
        'thisArg': undefined
      });
      return new LodashWrapper(value, this.__chain__).thru(function(array) {
        if (length && !array.length) {
          array.push(undefined);
        }
        return array;
      });
    });

    /**
     * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
     *
     * @name chain
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // A sequence without explicit chaining.
     * _(users).head();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // A sequence with explicit chaining.
     * _(users)
     *   .chain()
     *   .head()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chain sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Gets the next value on a wrapped object following the
     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
     *
     * @name next
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the next iterator value.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 1 }
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 2 }
     *
     * wrapped.next();
     * // => { 'done': true, 'value': undefined }
     */
    function wrapperNext() {
      if (this.__values__ === undefined) {
        this.__values__ = toArray(this.value());
      }
      var done = this.__index__ >= this.__values__.length,
          value = done ? undefined : this.__values__[this.__index__++];

      return { 'done': done, 'value': value };
    }

    /**
     * Enables the wrapper to be iterable.
     *
     * @name Symbol.iterator
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped[Symbol.iterator]() === wrapped;
     * // => true
     *
     * Array.from(wrapped);
     * // => [1, 2]
     */
    function wrapperToIterator() {
      return this;
    }

    /**
     * Creates a clone of the chain sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @param {*} value The value to plant.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2]).map(square);
     * var other = wrapped.plant([3, 4]);
     *
     * other.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        clone.__index__ = 0;
        clone.__values__ = undefined;
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * This method is the wrapper version of `_.reverse`.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({
          'func': thru,
          'args': [reverse],
          'thisArg': undefined
        });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(reverse);
    }

    /**
     * Executes the chain sequence to resolve the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @since 0.1.0
     * @alias toJSON, valueOf
     * @category Seq
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the number of times the key was returned by `iteratee`. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': 1, '6': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        ++result[key];
      } else {
        baseAssignValue(result, key, 1);
      }
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * Iteration is stopped once `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * **Note:** This method returns `true` for
     * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
     * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
     * elements of empty collections.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.every(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, guard) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * **Note:** Unlike `_.remove`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.reject
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, { 'age': 36, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.filter(users, 'active');
     * // => objects for ['barney']
     *
     * // Combining several predicates using `_.overEvery` or `_.overSome`.
     * _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
     * // => objects for ['fred', 'barney']
     */
    function filter(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.find(users, function(o) { return o.age < 40; });
     * // => object for 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.find(users, { 'age': 1, 'active': true });
     * // => object for 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.find(users, ['active', false]);
     * // => object for 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.find(users, 'active');
     * // => object for 'barney'
     */
    var find = createFind(findIndex);

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=collection.length-1] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findLast = createFind(findLastIndex);

    /**
     * Creates a flattened array of values by running each element in `collection`
     * thru `iteratee` and flattening the mapped results. The iteratee is invoked
     * with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _.flatMap([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMap(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), 1);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDeep([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMapDeep(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), INFINITY);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDepth([1, 2], duplicate, 2);
     * // => [[1, 1], [2, 2]]
     */
    function flatMapDepth(collection, iteratee, depth) {
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(map(collection, iteratee), depth);
    }

    /**
     * Iterates over elements of `collection` and invokes `iteratee` for each element.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length"
     * property are iterated like arrays. To avoid this behavior use `_.forIn`
     * or `_.forOwn` for object iteration.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias each
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEachRight
     * @example
     *
     * _.forEach([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `1` then `2`.
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forEach(collection, iteratee) {
      var func = isArray(collection) ? arrayEach : baseEach;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @alias eachRight
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEach
     * @example
     *
     * _.forEachRight([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `2` then `1`.
     */
    function forEachRight(collection, iteratee) {
      var func = isArray(collection) ? arrayEachRight : baseEachRight;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The order of grouped values
     * is determined by the order they occur in `collection`. The corresponding
     * value of each key is an array of elements responsible for generating the
     * key. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': [4.2], '6': [6.1, 6.3] }
     *
     * // The `_.property` iteratee shorthand.
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        baseAssignValue(result, key, [value]);
      }
    });

    /**
     * Checks if `value` is in `collection`. If `collection` is a string, it's
     * checked for a substring of `value`, otherwise
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'a': 1, 'b': 2 }, 1);
     * // => true
     *
     * _.includes('abcd', 'bc');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `path` is a function, it's invoked
     * for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke each method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invokeMap([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invokeMap = baseRest(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
      });
      return result;
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the last element responsible for generating the key. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var array = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.keyBy(array, function(o) {
     *   return String.fromCharCode(o.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.keyBy(array, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     */
    var keyBy = createAggregator(function(result, value, key) {
      baseAssignValue(result, key, value);
    });

    /**
     * Creates an array of values by running each element in `collection` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
     * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
     * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
     * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * _.map([4, 8], square);
     * // => [16, 64]
     *
     * _.map({ 'a': 4, 'b': 8 }, square);
     * // => [16, 64] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee) {
      var func = isArray(collection) ? arrayMap : baseMap;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.sortBy` except that it allows specifying the sort
     * orders of the iteratees to sort by. If `orders` is unspecified, all values
     * are sorted in ascending order. Otherwise, specify an order of "desc" for
     * descending or "asc" for ascending sort order of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @param {string[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // Sort by `user` in ascending order and by `age` in descending order.
     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     */
    function orderBy(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      orders = guard ? undefined : orders;
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseOrderBy(collection, iteratees, orders);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, the second of which
     * contains elements `predicate` returns falsey for. The predicate is
     * invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.partition(users, function(o) { return o.active; });
     * // => objects for [['fred'], ['barney', 'pebbles']]
     *
     * // The `_.matches` iteratee shorthand.
     * _.partition(users, { 'age': 1, 'active': false });
     * // => objects for [['pebbles'], ['barney', 'fred']]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.partition(users, ['active', false]);
     * // => objects for [['barney', 'pebbles'], ['fred']]
     *
     * // The `_.property` iteratee shorthand.
     * _.partition(users, 'active');
     * // => objects for [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` thru `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not given, the first element of `collection` is used as the initial
     * value. The iteratee is invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
     * and `sortBy`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduceRight
     * @example
     *
     * _.reduce([1, 2], function(sum, n) {
     *   return sum + n;
     * }, 0);
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     *   return result;
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
     */
    function reduce(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduce : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduce
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduceRight : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
    }

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.filter
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * _.reject(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.reject(users, { 'age': 40, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.reject(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.reject(users, 'active');
     * // => objects for ['barney']
     */
    function reject(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, negate(getIteratee(predicate, 3)));
    }

    /**
     * Gets a random element from `collection`.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     */
    function sample(collection) {
      var func = isArray(collection) ? arraySample : baseSample;
      return func(collection);
    }

    /**
     * Gets `n` random elements at unique keys from `collection` up to the
     * size of `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @param {number} [n=1] The number of elements to sample.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the random elements.
     * @example
     *
     * _.sampleSize([1, 2, 3], 2);
     * // => [3, 1]
     *
     * _.sampleSize([1, 2, 3], 4);
     * // => [2, 3, 1]
     */
    function sampleSize(collection, n, guard) {
      if ((guard ? isIterateeCall(collection, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      var func = isArray(collection) ? arraySampleSize : baseSampleSize;
      return func(collection, n);
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      var func = isArray(collection) ? arrayShuffle : baseShuffle;
      return func(collection);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable string keyed properties for objects.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the collection size.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      if (collection == null) {
        return 0;
      }
      if (isArrayLike(collection)) {
        return isString(collection) ? stringSize(collection) : collection.length;
      }
      var tag = getTag(collection);
      if (tag == mapTag || tag == setTag) {
        return collection.size;
      }
      return baseKeys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * Iteration is stopped once `predicate` returns truthy. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.some(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, guard) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection thru each iteratee. This method
     * performs a stable sort, that is, it preserves the original sort order of
     * equal elements. The iteratees are invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 30 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.sortBy(users, [function(o) { return o.user; }]);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
     *
     * _.sortBy(users, ['user', 'age']);
     * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
     */
    var sortBy = baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred invocation.
     */
    var now = ctxNow || function() {
      return root.Date.now();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it's called `n` or more times.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => Logs 'done saving!' after the two async saves have completed.
     */
    function after(n, func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that invokes `func`, with up to `n` arguments,
     * ignoring any additional arguments.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      n = guard ? undefined : n;
      n = (func && n == null) ? func.length : n;
      return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it's called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery(element).on('click', _.before(5, addContactToList));
     * // => Allows adding up to 4 contacts to the list.
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and `partials` prepended to the arguments it receives.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * function greet(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * }
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = baseRest(function(func, thisArg, partials) {
      var bitmask = WRAP_BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bind));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Creates a function that invokes the method at `object[key]` with `partials`
     * prepended to the arguments it receives.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist. See
     * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Function
     * @param {Object} object The object to invoke the method on.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = baseRest(function(object, key, partials) {
      var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bindKey));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts arguments of `func` and either invokes
     * `func` returning its result, if at least `arity` number of arguments have
     * been provided, or returns a function that accepts the remaining `func`
     * arguments, and so on. The arity of `func` may be specified if `func.length`
     * is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    function curry(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curry.placeholder;
      return result;
    }

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    function curryRight(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curryRight.placeholder;
      return result;
    }

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            timeWaiting = wait - timeSinceLastCall;

        return maxing
          ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
          : timeWaiting;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(now());
      }

      function debounced() {
        var time = now(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            clearTimeout(timerId);
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // => Logs 'deferred' after one millisecond.
     */
    var defer = baseRest(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => Logs 'later' after one second.
     */
    var delay = baseRest(function(func, wait, args) {
      return baseDelay(func, toNumber(wait) || 0, args);
    });

    /**
     * Creates a function that invokes `func` with arguments reversed.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to flip arguments for.
     * @returns {Function} Returns the new flipped function.
     * @example
     *
     * var flipped = _.flip(function() {
     *   return _.toArray(arguments);
     * });
     *
     * flipped('a', 'b', 'c', 'd');
     * // => ['d', 'c', 'b', 'a']
     */
    function flip(func) {
      return createWrap(func, WRAP_FLIP_FLAG);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize.Cache = MapCache;

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new negated function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        var args = arguments;
        switch (args.length) {
          case 0: return !predicate.call(this);
          case 1: return !predicate.call(this, args[0]);
          case 2: return !predicate.call(this, args[0], args[1]);
          case 3: return !predicate.call(this, args[0], args[1], args[2]);
        }
        return !predicate.apply(this, args);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first invocation. The `func` is
     * invoked with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // => `createApplication` is invoked once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with its arguments transformed.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms=[_.identity]]
     *  The argument transforms.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var func = _.overArgs(function(x, y) {
     *   return [x, y];
     * }, [square, doubled]);
     *
     * func(9, 3);
     * // => [81, 6]
     *
     * func(10, 5);
     * // => [100, 10]
     */
    var overArgs = castRest(function(func, transforms) {
      transforms = (transforms.length == 1 && isArray(transforms[0]))
        ? arrayMap(transforms[0], baseUnary(getIteratee()))
        : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));

      var funcsLength = transforms.length;
      return baseRest(function(args) {
        var index = -1,
            length = nativeMin(args.length, funcsLength);

        while (++index < length) {
          args[index] = transforms[index].call(this, args[index]);
        }
        return apply(func, this, args);
      });
    });

    /**
     * Creates a function that invokes `func` with `partials` prepended to the
     * arguments it receives. This method is like `_.bind` except it does **not**
     * alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 0.2.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // Partially applied with placeholders.
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partial));
      return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, holders);
    });

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to the arguments it receives.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // Partially applied with placeholders.
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partialRight));
      return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined, partials, holders);
    });

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified `indexes` where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, [2, 0, 1]);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     */
    var rearg = flatRest(function(func, indexes) {
      return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as
     * an array.
     *
     * **Note:** This method is based on the
     * [rest parameter](https://mdn.io/rest_parameters).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.rest(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function rest(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start === undefined ? start : toInteger(start);
      return baseRest(func, start);
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * create function and an array of arguments much like
     * [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
     *
     * **Note:** This method is based on the
     * [spread operator](https://mdn.io/spread_operator).
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @param {number} [start=0] The start position of the spread.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start == null ? 0 : nativeMax(toInteger(start), 0);
      return baseRest(function(args) {
        var array = args[start],
            otherArgs = castSlice(args, 0, start);

        if (array) {
          arrayPush(otherArgs, array);
        }
        return apply(func, this, otherArgs);
      });
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide `options` to indicate whether `func`
     * should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=true]
     *  Specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
      });
    }

    /**
     * Creates a function that accepts up to one argument, ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.unary(parseInt));
     * // => [6, 8, 10]
     */
    function unary(func) {
      return ary(func, 1);
    }

    /**
     * Creates a function that provides `value` to `wrapper` as its first
     * argument. Any additional arguments provided to the function are appended
     * to those provided to the `wrapper`. The wrapper is invoked with the `this`
     * binding of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} [wrapper=identity] The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      return partial(castFunction(wrapper), value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Casts `value` as an array if it's not one.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Lang
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast array.
     * @example
     *
     * _.castArray(1);
     * // => [1]
     *
     * _.castArray({ 'a': 1 });
     * // => [{ 'a': 1 }]
     *
     * _.castArray('abc');
     * // => ['abc']
     *
     * _.castArray(null);
     * // => [null]
     *
     * _.castArray(undefined);
     * // => [undefined]
     *
     * _.castArray();
     * // => []
     *
     * var array = [1, 2, 3];
     * console.log(_.castArray(array) === array);
     * // => true
     */
    function castArray() {
      if (!arguments.length) {
        return [];
      }
      var value = arguments[0];
      return isArray(value) ? value : [value];
    }

    /**
     * Creates a shallow clone of `value`.
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
     * and supports cloning arrays, array buffers, booleans, date objects, maps,
     * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
     * arrays. The own enumerable properties of `arguments` objects are cloned
     * as plain objects. An empty object is returned for uncloneable values such
     * as error objects, functions, DOM nodes, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to clone.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeep
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var shallow = _.clone(objects);
     * console.log(shallow[0] === objects[0]);
     * // => true
     */
    function clone(value) {
      return baseClone(value, CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.clone` except that it accepts `customizer` which
     * is invoked to produce the cloned value. If `customizer` returns `undefined`,
     * cloning is handled by the method instead. The `customizer` is invoked with
     * up to four arguments; (value [, index|key, object, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeepWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * }
     *
     * var el = _.cloneWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 0
     */
    function cloneWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.cloneWith` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the deep cloned value.
     * @see _.cloneWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * }
     *
     * var el = _.cloneDeepWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 20
     */
    function cloneDeepWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * Checks if `object` conforms to `source` by invoking the predicate
     * properties of `source` with the corresponding property values of `object`.
     *
     * **Note:** This method is equivalent to `_.conforms` when `source` is
     * partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 1; } });
     * // => true
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 2; } });
     * // => false
     */
    function conformsTo(object, source) {
      return source == null || baseConformsTo(object, source, keys(source));
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     * @see _.lt
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    var gt = createRelationalOperation(baseGt);

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to
     *  `other`, else `false`.
     * @see _.lte
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    var gte = createRelationalOperation(function(value, other) {
      return value >= other;
    });

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is classified as an `ArrayBuffer` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     * @example
     *
     * _.isArrayBuffer(new ArrayBuffer(2));
     * // => true
     *
     * _.isArrayBuffer(new Array(2));
     * // => false
     */
    var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        (isObjectLike(value) && baseGetTag(value) == boolTag);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

    /**
     * Checks if `value` is likely a DOM element.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
    }

    /**
     * Checks if `value` is an empty object, collection, map, or set.
     *
     * Objects are considered empty if they have no own enumerable string keyed
     * properties.
     *
     * Array-like values such as `arguments` objects, arrays, buffers, strings, or
     * jQuery-like collections are considered empty if they have a `length` of `0`.
     * Similarly, maps and sets are considered empty if they have a `size` of `0`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) &&
          (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
            isBuffer(value) || isTypedArray(value) || isArguments(value))) {
        return !value.length;
      }
      var tag = getTag(value);
      if (tag == mapTag || tag == setTag) {
        return !value.size;
      }
      if (isPrototype(value)) {
        return !baseKeys(value).length;
      }
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are compared by strict equality, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * This method is like `_.isEqual` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with up to
     * six arguments: (objValue, othValue [, index|key, object, other, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, othValue) {
     *   if (isGreeting(objValue) && isGreeting(othValue)) {
     *     return true;
     *   }
     * }
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqualWith(array, other, customizer);
     * // => true
     */
    function isEqualWith(value, other, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      if (!isObjectLike(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == errorTag || tag == domExcTag ||
        (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on
     * [`Number.isFinite`](https://mdn.io/Number/isFinite).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(3);
     * // => true
     *
     * _.isFinite(Number.MIN_VALUE);
     * // => true
     *
     * _.isFinite(Infinity);
     * // => false
     *
     * _.isFinite('3');
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /**
     * Checks if `value` is an integer.
     *
     * **Note:** This method is based on
     * [`Number.isInteger`](https://mdn.io/Number/isInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
     * @example
     *
     * _.isInteger(3);
     * // => true
     *
     * _.isInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isInteger(Infinity);
     * // => false
     *
     * _.isInteger('3');
     * // => false
     */
    function isInteger(value) {
      return typeof value == 'number' && value == toInteger(value);
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

    /**
     * Performs a partial deep comparison between `object` and `source` to
     * determine if `object` contains equivalent property values.
     *
     * **Note:** This method is equivalent to `_.matches` when `source` is
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.isMatch(object, { 'b': 2 });
     * // => true
     *
     * _.isMatch(object, { 'b': 1 });
     * // => false
     */
    function isMatch(object, source) {
      return object === source || baseIsMatch(object, source, getMatchData(source));
    }

    /**
     * This method is like `_.isMatch` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with five
     * arguments: (objValue, srcValue, index|key, object, source).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, srcValue) {
     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
     *     return true;
     *   }
     * }
     *
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatchWith(object, source, customizer);
     * // => true
     */
    function isMatchWith(object, source, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseIsMatch(object, source, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is based on
     * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
     * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
     * `undefined` and other non-number values.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some
      // ActiveX objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a pristine native function.
     *
     * **Note:** This method can't reliably detect native functions in the presence
     * of the core-js package because core-js circumvents this kind of detection.
     * Despite multiple requests, the core-js maintainer has made it clear: any
     * attempt to fix the detection will be obstructed. As a result, we're left
     * with little choice but to throw an error. Unfortunately, this also affects
     * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
     * which rely on core-js.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (isMaskable(value)) {
        throw new Error(CORE_ERROR_TEXT);
      }
      return baseIsNative(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is `null` or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
     * @example
     *
     * _.isNil(null);
     * // => true
     *
     * _.isNil(void 0);
     * // => true
     *
     * _.isNil(NaN);
     * // => false
     */
    function isNil(value) {
      return value == null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
     * classified as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(3);
     * // => true
     *
     * _.isNumber(Number.MIN_VALUE);
     * // => true
     *
     * _.isNumber(Infinity);
     * // => true
     *
     * _.isNumber('3');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        (isObjectLike(value) && baseGetTag(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * @static
     * @memberOf _
     * @since 0.8.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
        funcToString.call(Ctor) == objectCtorString;
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

    /**
     * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
     * double precision number which isn't the result of a rounded unsafe integer.
     *
     * **Note:** This method is based on
     * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
     * @example
     *
     * _.isSafeInteger(3);
     * // => true
     *
     * _.isSafeInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isSafeInteger(Infinity);
     * // => false
     *
     * _.isSafeInteger('3');
     * // => false
     */
    function isSafeInteger(value) {
      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a string, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' ||
        (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is classified as a `WeakMap` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
     * @example
     *
     * _.isWeakMap(new WeakMap);
     * // => true
     *
     * _.isWeakMap(new Map);
     * // => false
     */
    function isWeakMap(value) {
      return isObjectLike(value) && getTag(value) == weakMapTag;
    }

    /**
     * Checks if `value` is classified as a `WeakSet` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
     * @example
     *
     * _.isWeakSet(new WeakSet);
     * // => true
     *
     * _.isWeakSet(new Set);
     * // => false
     */
    function isWeakSet(value) {
      return isObjectLike(value) && baseGetTag(value) == weakSetTag;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     * @see _.gt
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    var lt = createRelationalOperation(baseLt);

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to
     *  `other`, else `false`.
     * @see _.gte
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    var lte = createRelationalOperation(function(value, other) {
      return value <= other;
    });

    /**
     * Converts `value` to an array.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * _.toArray({ 'a': 1, 'b': 2 });
     * // => [1, 2]
     *
     * _.toArray('abc');
     * // => ['a', 'b', 'c']
     *
     * _.toArray(1);
     * // => []
     *
     * _.toArray(null);
     * // => []
     */
    function toArray(value) {
      if (!value) {
        return [];
      }
      if (isArrayLike(value)) {
        return isString(value) ? stringToArray(value) : copyArray(value);
      }
      if (symIterator && value[symIterator]) {
        return iteratorToArray(value[symIterator]());
      }
      var tag = getTag(value),
          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

      return func(value);
    }

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    /**
     * Converts `value` to an integer.
     *
     * **Note:** This method is loosely based on
     * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toInteger(3.2);
     * // => 3
     *
     * _.toInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toInteger(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toInteger('3.2');
     * // => 3
     */
    function toInteger(value) {
      var result = toFinite(value),
          remainder = result % 1;

      return result === result ? (remainder ? result - remainder : result) : 0;
    }

    /**
     * Converts `value` to an integer suitable for use as the length of an
     * array-like object.
     *
     * **Note:** This method is based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toLength(3.2);
     * // => 3
     *
     * _.toLength(Number.MIN_VALUE);
     * // => 0
     *
     * _.toLength(Infinity);
     * // => 4294967295
     *
     * _.toLength('3.2');
     * // => 3
     */
    function toLength(value) {
      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
    }

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = baseTrim(value);
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable string
     * keyed properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }

    /**
     * Converts `value` to a safe integer. A safe integer can be compared and
     * represented correctly.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toSafeInteger(3.2);
     * // => 3
     *
     * _.toSafeInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toSafeInteger(Infinity);
     * // => 9007199254740991
     *
     * _.toSafeInteger('3.2');
     * // => 3
     */
    function toSafeInteger(value) {
      return value
        ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
        : (value === 0 ? value : 0);
    }

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : baseToString(value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable string keyed properties of source objects to the
     * destination object. Source objects are applied from left to right.
     * Subsequent sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object` and is loosely based on
     * [`Object.assign`](https://mdn.io/Object/assign).
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assignIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assign({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'c': 3 }
     */
    var assign = createAssigner(function(object, source) {
      if (isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keys(source), object);
        return;
      }
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          assignValue(object, key, source[key]);
        }
      }
    });

    /**
     * This method is like `_.assign` except that it iterates over own and
     * inherited source properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assign
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assignIn({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
     */
    var assignIn = createAssigner(function(object, source) {
      copyObject(source, keysIn(source), object);
    });

    /**
     * This method is like `_.assignIn` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extendWith
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignInWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keysIn(source), object, customizer);
    });

    /**
     * This method is like `_.assign` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignInWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keys(source), object, customizer);
    });

    /**
     * Creates an array of values corresponding to `paths` of `object`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Array} Returns the picked values.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _.at(object, ['a[0].b.c', 'a[1]']);
     * // => [3, 4]
     */
    var at = flatRest(baseAt);

    /**
     * Creates an object that inherits from the `prototype` object. If a
     * `properties` object is given, its own enumerable string keyed properties
     * are assigned to the created object.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties == null ? result : baseAssign(result, properties);
    }

    /**
     * Assigns own and inherited enumerable string keyed properties of source
     * objects to the destination object for all destination properties that
     * resolve to `undefined`. Source objects are applied from left to right.
     * Once a property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaultsDeep
     * @example
     *
     * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var defaults = baseRest(function(object, sources) {
      object = Object(object);

      var index = -1;
      var length = sources.length;
      var guard = length > 2 ? sources[2] : undefined;

      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        length = 1;
      }

      while (++index < length) {
        var source = sources[index];
        var props = keysIn(source);
        var propsIndex = -1;
        var propsLength = props.length;

        while (++propsIndex < propsLength) {
          var key = props[propsIndex];
          var value = object[key];

          if (value === undefined ||
              (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
            object[key] = source[key];
          }
        }
      }

      return object;
    });

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaults
     * @example
     *
     * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
     * // => { 'a': { 'b': 2, 'c': 3 } }
     */
    var defaultsDeep = baseRest(function(args) {
      args.push(undefined, customDefaultsMerge);
      return apply(mergeWith, undefined, args);
    });

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(o) { return o.age < 40; });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // The `_.matches` iteratee shorthand.
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    function findKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(o) { return o.age < 40; });
     * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    function findLastKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
    }

    /**
     * Iterates over own and inherited enumerable string keyed properties of an
     * object and invokes `iteratee` for each property. The iteratee is invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forInRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
     */
    function forIn(object, iteratee) {
      return object == null
        ? object
        : baseFor(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
     */
    function forInRight(object, iteratee) {
      return object == null
        ? object
        : baseForRight(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * Iterates over own enumerable string keyed properties of an object and
     * invokes `iteratee` for each property. The iteratee is invoked with three
     * arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwnRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forOwn(object, iteratee) {
      return object && baseForOwn(object, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
     */
    function forOwnRight(object, iteratee) {
      return object && baseForOwnRight(object, getIteratee(iteratee, 3));
    }

    /**
     * Creates an array of function property names from own enumerable properties
     * of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functionsIn
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functions(new Foo);
     * // => ['a', 'b']
     */
    function functions(object) {
      return object == null ? [] : baseFunctions(object, keys(object));
    }

    /**
     * Creates an array of function property names from own and inherited
     * enumerable properties of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functions
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functionsIn(new Foo);
     * // => ['a', 'b', 'c']
     */
    function functionsIn(object) {
      return object == null ? [] : baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': 2 } };
     * var other = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b');
     * // => true
     *
     * _.has(object, ['a', 'b']);
     * // => true
     *
     * _.has(other, 'a');
     * // => false
     */
    function has(object, path) {
      return object != null && hasPath(object, path, baseHas);
    }

    /**
     * Checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b');
     * // => true
     *
     * _.hasIn(object, ['a', 'b']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn(object, path) {
      return object != null && hasPath(object, path, baseHasIn);
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite
     * property assignments of previous values.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Object
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     */
    var invert = createInverter(function(result, value, key) {
      if (value != null &&
          typeof value.toString != 'function') {
        value = nativeObjectToString.call(value);
      }

      result[value] = key;
    }, constant(identity));

    /**
     * This method is like `_.invert` except that the inverted object is generated
     * from the results of running each element of `object` thru `iteratee`. The
     * corresponding inverted value of each inverted key is an array of keys
     * responsible for generating the inverted value. The iteratee is invoked
     * with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Object
     * @param {Object} object The object to invert.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invertBy(object);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     *
     * _.invertBy(object, function(value) {
     *   return 'group' + value;
     * });
     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
     */
    var invertBy = createInverter(function(result, value, key) {
      if (value != null &&
          typeof value.toString != 'function') {
        value = nativeObjectToString.call(value);
      }

      if (hasOwnProperty.call(result, value)) {
        result[value].push(key);
      } else {
        result[value] = [key];
      }
    }, getIteratee);

    /**
     * Invokes the method at `path` of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
     *
     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
     * // => [2, 3]
     */
    var invoke = baseRest(baseInvoke);

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * string keyed property of `object` thru `iteratee`. The iteratee is invoked
     * with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapValues
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    function mapKeys(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, iteratee(value, key, object), value);
      });
      return result;
    }

    /**
     * Creates an object with the same keys as `object` and values generated
     * by running each own enumerable string keyed property of `object` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapKeys
     * @example
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * _.mapValues(users, function(o) { return o.age; });
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     *
     * // The `_.property` iteratee shorthand.
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    function mapValues(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, key, iteratee(value, key, object));
      });
      return result;
    }

    /**
     * This method is like `_.assign` except that it recursively merges own and
     * inherited enumerable string keyed properties of source objects into the
     * destination object. Source properties that resolve to `undefined` are
     * skipped if a destination value exists. Array and plain object properties
     * are merged recursively. Other objects and value types are overridden by
     * assignment. Source objects are applied from left to right. Subsequent
     * sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {
     *   'a': [{ 'b': 2 }, { 'd': 4 }]
     * };
     *
     * var other = {
     *   'a': [{ 'c': 3 }, { 'e': 5 }]
     * };
     *
     * _.merge(object, other);
     * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
     */
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });

    /**
     * This method is like `_.merge` except that it accepts `customizer` which
     * is invoked to produce the merged values of the destination and source
     * properties. If `customizer` returns `undefined`, merging is handled by the
     * method instead. The `customizer` is invoked with six arguments:
     * (objValue, srcValue, key, object, source, stack).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   if (_.isArray(objValue)) {
     *     return objValue.concat(srcValue);
     *   }
     * }
     *
     * var object = { 'a': [1], 'b': [2] };
     * var other = { 'a': [3], 'b': [4] };
     *
     * _.mergeWith(object, other, customizer);
     * // => { 'a': [1, 3], 'b': [2, 4] }
     */
    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
      baseMerge(object, source, srcIndex, customizer);
    });

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable property paths of `object` that are not omitted.
     *
     * **Note:** This method is considerably slower than `_.pick`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to omit.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omit(object, ['a', 'c']);
     * // => { 'b': '2' }
     */
    var omit = flatRest(function(object, paths) {
      var result = {};
      if (object == null) {
        return result;
      }
      var isDeep = false;
      paths = arrayMap(paths, function(path) {
        path = castPath(path, object);
        isDeep || (isDeep = path.length > 1);
        return path;
      });
      copyObject(object, getAllKeysIn(object), result);
      if (isDeep) {
        result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
      }
      var length = paths.length;
      while (length--) {
        baseUnset(result, paths[length]);
      }
      return result;
    });

    /**
     * The opposite of `_.pickBy`; this method creates an object composed of
     * the own and inherited enumerable string keyed properties of `object` that
     * `predicate` doesn't return truthy for. The predicate is invoked with two
     * arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omitBy(object, _.isNumber);
     * // => { 'b': '2' }
     */
    function omitBy(object, predicate) {
      return pickBy(object, negate(getIteratee(predicate)));
    }

    /**
     * Creates an object composed of the picked `object` properties.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pick(object, ['a', 'c']);
     * // => { 'a': 1, 'c': 3 }
     */
    var pick = flatRest(function(object, paths) {
      return object == null ? {} : basePick(object, paths);
    });

    /**
     * Creates an object composed of the `object` properties `predicate` returns
     * truthy for. The predicate is invoked with two arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pickBy(object, _.isNumber);
     * // => { 'a': 1, 'c': 3 }
     */
    function pickBy(object, predicate) {
      if (object == null) {
        return {};
      }
      var props = arrayMap(getAllKeysIn(object), function(prop) {
        return [prop];
      });
      predicate = getIteratee(predicate);
      return basePickBy(object, props, function(value, path) {
        return predicate(value, path[0]);
      });
    }

    /**
     * This method is like `_.get` except that if the resolved value is a
     * function it's invoked with the `this` binding of its parent object and
     * its result is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a[0].b.c3', 'default');
     * // => 'default'
     *
     * _.result(object, 'a[0].b.c3', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      path = castPath(path, object);

      var index = -1,
          length = path.length;

      // Ensure the loop is entered when path is empty.
      if (!length) {
        length = 1;
        object = undefined;
      }
      while (++index < length) {
        var value = object == null ? undefined : object[toKey(path[index])];
        if (value === undefined) {
          index = length;
          value = defaultValue;
        }
        object = isFunction(value) ? value.call(object) : value;
      }
      return object;
    }

    /**
     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
     * it's created. Arrays are created for missing index properties while objects
     * are created for all other missing properties. Use `_.setWith` to customize
     * `path` creation.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, ['x', '0', 'y', 'z'], 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }

    /**
     * This method is like `_.set` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.setWith(object, '[0][1]', 'a', Object);
     * // => { '0': { '1': 'a' } }
     */
    function setWith(object, path, value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseSet(object, path, value, customizer);
    }

    /**
     * Creates an array of own enumerable string keyed-value pairs for `object`
     * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
     * entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entries
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairs(new Foo);
     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
     */
    var toPairs = createToPairs(keys);

    /**
     * Creates an array of own and inherited enumerable string keyed-value pairs
     * for `object` which can be consumed by `_.fromPairs`. If `object` is a map
     * or set, its entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entriesIn
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairsIn(new Foo);
     * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
     */
    var toPairsIn = createToPairs(keysIn);

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable string keyed properties thru `iteratee`, with each invocation
     * potentially mutating the `accumulator` object. If `accumulator` is not
     * provided, a new object with the same `[[Prototype]]` will be used. The
     * iteratee is invoked with four arguments: (accumulator, value, key, object).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * }, []);
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function transform(object, iteratee, accumulator) {
      var isArr = isArray(object),
          isArrLike = isArr || isBuffer(object) || isTypedArray(object);

      iteratee = getIteratee(iteratee, 4);
      if (accumulator == null) {
        var Ctor = object && object.constructor;
        if (isArrLike) {
          accumulator = isArr ? new Ctor : [];
        }
        else if (isObject(object)) {
          accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
        }
        else {
          accumulator = {};
        }
      }
      (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Removes the property at `path` of `object`.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     *
     * _.unset(object, ['a', '0', 'b', 'c']);
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     */
    function unset(object, path) {
      return object == null ? true : baseUnset(object, path);
    }

    /**
     * This method is like `_.set` except that accepts `updater` to produce the
     * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
     * is invoked with one argument: (value).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.update(object, 'a[0].b.c', function(n) { return n * n; });
     * console.log(object.a[0].b.c);
     * // => 9
     *
     * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
     * console.log(object.x[0].y.z);
     * // => 0
     */
    function update(object, path, updater) {
      return object == null ? object : baseUpdate(object, path, castFunction(updater));
    }

    /**
     * This method is like `_.update` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.updateWith(object, '[0][1]', _.constant('a'), Object);
     * // => { '0': { '1': 'a' } }
     */
    function updateWith(object, path, updater, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
    }

    /**
     * Creates an array of the own enumerable string keyed property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return object == null ? [] : baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable string keyed property
     * values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return object == null ? [] : baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Clamps `number` within the inclusive `lower` and `upper` bounds.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Number
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp(number, lower, upper) {
      if (upper === undefined) {
        upper = lower;
        lower = undefined;
      }
      if (upper !== undefined) {
        upper = toNumber(upper);
        upper = upper === upper ? upper : 0;
      }
      if (lower !== undefined) {
        lower = toNumber(lower);
        lower = lower === lower ? lower : 0;
      }
      return baseClamp(toNumber(number), lower, upper);
    }

    /**
     * Checks if `n` is between `start` and up to, but not including, `end`. If
     * `end` is not specified, it's set to `start` with `start` then set to `0`.
     * If `start` is greater than `end` the params are swapped to support
     * negative ranges.
     *
     * @static
     * @memberOf _
     * @since 3.3.0
     * @category Number
     * @param {number} number The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     * @see _.range, _.rangeRight
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     *
     * _.inRange(-3, -2, -6);
     * // => true
     */
    function inRange(number, start, end) {
      start = toFinite(start);
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = toFinite(end);
      }
      number = toNumber(number);
      return baseInRange(number, start, end);
    }

    /**
     * Produces a random number between the inclusive `lower` and `upper` bounds.
     * If only one argument is provided a number between `0` and the given number
     * is returned. If `floating` is `true`, or either `lower` or `upper` are
     * floats, a floating-point number is returned instead of an integer.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Number
     * @param {number} [lower=0] The lower bound.
     * @param {number} [upper=1] The upper bound.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(lower, upper, floating) {
      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
        upper = floating = undefined;
      }
      if (floating === undefined) {
        if (typeof upper == 'boolean') {
          floating = upper;
          upper = undefined;
        }
        else if (typeof lower == 'boolean') {
          floating = lower;
          lower = undefined;
        }
      }
      if (lower === undefined && upper === undefined) {
        lower = 0;
        upper = 1;
      }
      else {
        lower = toFinite(lower);
        if (upper === undefined) {
          upper = lower;
          lower = 0;
        } else {
          upper = toFinite(upper);
        }
      }
      if (lower > upper) {
        var temp = lower;
        lower = upper;
        upper = temp;
      }
      if (floating || lower % 1 || upper % 1) {
        var rand = nativeRandom();
        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
      }
      return baseRandom(lower, upper);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar--');
     * // => 'fooBar'
     *
     * _.camelCase('__FOO_BAR__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize(word) : word);
    });

    /**
     * Converts the first character of `string` to upper case and the remaining
     * to lower case.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('FRED');
     * // => 'Fred'
     */
    function capitalize(string) {
      return upperFirst(toString(string).toLowerCase());
    }

    /**
     * Deburrs `string` by converting
     * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
     * letters to basic Latin letters and removing
     * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = toString(string);
      return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search up to.
     * @returns {boolean} Returns `true` if `string` ends with `target`,
     *  else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = toString(string);
      target = baseToString(target);

      var length = string.length;
      position = position === undefined
        ? length
        : baseClamp(toInteger(position), 0, length);

      var end = position;
      position -= target.length;
      return position >= 0 && string.slice(position, end) == target;
    }

    /**
     * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
     * corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional
     * characters use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value. See
     * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * When working with HTML you should always
     * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
     * XSS vectors.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      string = toString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https://lodash\.com/\)'
     */
    function escapeRegExp(string) {
      string = toString(string);
      return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : string;
    }

    /**
     * Converts `string` to
     * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__FOO_BAR__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Converts `string`, as space separated words, to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.lowerCase('--Foo-Bar--');
     * // => 'foo bar'
     *
     * _.lowerCase('fooBar');
     * // => 'foo bar'
     *
     * _.lowerCase('__FOO_BAR__');
     * // => 'foo bar'
     */
    var lowerCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toLowerCase();
    });

    /**
     * Converts the first character of `string` to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.lowerFirst('Fred');
     * // => 'fred'
     *
     * _.lowerFirst('FRED');
     * // => 'fRED'
     */
    var lowerFirst = createCaseFirst('toLowerCase');

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      if (!length || strLength >= length) {
        return string;
      }
      var mid = (length - strLength) / 2;
      return (
        createPadding(nativeFloor(mid), chars) +
        string +
        createPadding(nativeCeil(mid), chars)
      );
    }

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padEnd('abc', 6);
     * // => 'abc   '
     *
     * _.padEnd('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padEnd('abc', 3);
     * // => 'abc'
     */
    function padEnd(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (string + createPadding(length - strLength, chars))
        : string;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padStart('abc', 6);
     * // => '   abc'
     *
     * _.padStart('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padStart('abc', 3);
     * // => 'abc'
     */
    function padStart(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (createPadding(length - strLength, chars) + string)
        : string;
    }

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
     * hexadecimal, in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the
     * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix=10] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      if (guard || radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=1] The number of times to repeat the string.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n, guard) {
      if ((guard ? isIterateeCall(string, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      return baseRepeat(toString(string), n);
    }

    /**
     * Replaces matches for `pattern` in `string` with `replacement`.
     *
     * **Note:** This method is based on
     * [`String#replace`](https://mdn.io/String/replace).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to modify.
     * @param {RegExp|string} pattern The pattern to replace.
     * @param {Function|string} replacement The match replacement.
     * @returns {string} Returns the modified string.
     * @example
     *
     * _.replace('Hi Fred', 'Fred', 'Barney');
     * // => 'Hi Barney'
     */
    function replace() {
      var args = arguments,
          string = toString(args[0]);

      return args.length < 3 ? string : string.replace(args[1], args[2]);
    }

    /**
     * Converts `string` to
     * [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--FOO-BAR--');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Splits `string` by `separator`.
     *
     * **Note:** This method is based on
     * [`String#split`](https://mdn.io/String/split).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to split.
     * @param {RegExp|string} separator The separator pattern to split by.
     * @param {number} [limit] The length to truncate results to.
     * @returns {Array} Returns the string segments.
     * @example
     *
     * _.split('a-b-c', '-', 2);
     * // => ['a', 'b']
     */
    function split(string, separator, limit) {
      if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
        separator = limit = undefined;
      }
      limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
      if (!limit) {
        return [];
      }
      string = toString(string);
      if (string && (
            typeof separator == 'string' ||
            (separator != null && !isRegExp(separator))
          )) {
        separator = baseToString(separator);
        if (!separator && hasUnicode(string)) {
          return castSlice(stringToArray(string), 0, limit);
        }
      }
      return string.split(separator, limit);
    }

    /**
     * Converts `string` to
     * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @since 3.1.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar--');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__FOO_BAR__');
     * // => 'FOO BAR'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + upperFirst(word);
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`,
     *  else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = toString(string);
      position = position == null
        ? 0
        : baseClamp(toInteger(position), 0, string.length);

      target = baseToString(target);
      return string.slice(position, position + target.length) == target;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is given, it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options={}] The options object.
     * @param {RegExp} [options.escape=_.templateSettings.escape]
     *  The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
     *  The "evaluate" delimiter.
     * @param {Object} [options.imports=_.templateSettings.imports]
     *  An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
     *  The "interpolate" delimiter.
     * @param {string} [options.sourceURL='lodash.templateSources[n]']
     *  The sourceURL of the compiled template.
     * @param {string} [options.variable='obj']
     *  The data object variable name.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // Use the "interpolate" delimiter to create a compiled template.
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // Use the HTML "escape" delimiter to escape data property values.
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the internal `print` function in "evaluate" delimiters.
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // Use the ES template literal delimiter as an "interpolate" delimiter.
     * // Disable support by replacing the "interpolate" delimiter.
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // Use backslashes to treat delimiters as plain text.
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // Use the `imports` option to import `jQuery` as `jq`.
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the `sourceURL` option to specify a custom sourceURL for the template.
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
     *
     * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // Use custom template delimiters.
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // Use the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and stack traces.
     * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, guard) {
      // Based on John Resig's `tmpl` implementation
      // (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      string = toString(string);
      options = assignInWith({}, options, settings, customDefaultsAssignIn);

      var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      // The sourceURL gets injected into the source that's eval-ed, so be careful
      // to normalize all kinds of whitespace, so e.g. newlines (and unicode versions of it) can't sneak in
      // and escape the comment, thus injecting code that gets evaled.
      var sourceURL = '//# sourceURL=' +
        (hasOwnProperty.call(options, 'sourceURL')
          ? (options.sourceURL + '').replace(/\s/g, ' ')
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products needs `match` returned in
        // order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = hasOwnProperty.call(options, 'variable') && options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Throw an error if a forbidden character was found in `variable`, to prevent
      // potential command injection attacks.
      else if (reForbiddenIdentifierChars.test(variable)) {
        throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
      }

      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source)
          .apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Converts `string`, as a whole, to lower case just like
     * [String#toLowerCase](https://mdn.io/toLowerCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.toLower('--Foo-Bar--');
     * // => '--foo-bar--'
     *
     * _.toLower('fooBar');
     * // => 'foobar'
     *
     * _.toLower('__FOO_BAR__');
     * // => '__foo_bar__'
     */
    function toLower(value) {
      return toString(value).toLowerCase();
    }

    /**
     * Converts `string`, as a whole, to upper case just like
     * [String#toUpperCase](https://mdn.io/toUpperCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.toUpper('--foo-bar--');
     * // => '--FOO-BAR--'
     *
     * _.toUpper('fooBar');
     * // => 'FOOBAR'
     *
     * _.toUpper('__foo_bar__');
     * // => '__FOO_BAR__'
     */
    function toUpper(value) {
      return toString(value).toUpperCase();
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return baseTrim(string);
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          chrSymbols = stringToArray(chars),
          start = charsStartIndex(strSymbols, chrSymbols),
          end = charsEndIndex(strSymbols, chrSymbols) + 1;

      return castSlice(strSymbols, start, end).join('');
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimEnd('  abc  ');
     * // => '  abc'
     *
     * _.trimEnd('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimEnd(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.slice(0, trimmedEndIndex(string) + 1);
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

      return castSlice(strSymbols, 0, end).join('');
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimStart('  abc  ');
     * // => 'abc  '
     *
     * _.trimStart('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimStart(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrimStart, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          start = charsStartIndex(strSymbols, stringToArray(chars));

      return castSlice(strSymbols, start).join('');
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object} [options={}] The options object.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.truncate('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function truncate(string, options) {
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (isObject(options)) {
        var separator = 'separator' in options ? options.separator : separator;
        length = 'length' in options ? toInteger(options.length) : length;
        omission = 'omission' in options ? baseToString(options.omission) : omission;
      }
      string = toString(string);

      var strLength = string.length;
      if (hasUnicode(string)) {
        var strSymbols = stringToArray(string);
        strLength = strSymbols.length;
      }
      if (length >= strLength) {
        return string;
      }
      var end = length - stringSize(omission);
      if (end < 1) {
        return omission;
      }
      var result = strSymbols
        ? castSlice(strSymbols, 0, end).join('')
        : string.slice(0, end);

      if (separator === undefined) {
        return result + omission;
      }
      if (strSymbols) {
        end += (result.length - end);
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              substring = result;

          if (!separator.global) {
            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            var newEnd = match.index;
          }
          result = result.slice(0, newEnd === undefined ? end : newEnd);
        }
      } else if (string.indexOf(baseToString(separator), end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
     * their corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional
     * HTML entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @since 0.6.0
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = toString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Converts `string`, as space separated words, to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.upperCase('--foo-bar');
     * // => 'FOO BAR'
     *
     * _.upperCase('fooBar');
     * // => 'FOO BAR'
     *
     * _.upperCase('__foo_bar__');
     * // => 'FOO BAR'
     */
    var upperCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toUpperCase();
    });

    /**
     * Converts the first character of `string` to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.upperFirst('fred');
     * // => 'Fred'
     *
     * _.upperFirst('FRED');
     * // => 'FRED'
     */
    var upperFirst = createCaseFirst('toUpperCase');

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      string = toString(string);
      pattern = guard ? undefined : pattern;

      if (pattern === undefined) {
        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
      }
      return string.match(pattern) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Function} func The function to attempt.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // Avoid throwing errors for invalid selectors.
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = baseRest(function(func, args) {
      try {
        return apply(func, undefined, args);
      } catch (e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method.
     *
     * **Note:** This method doesn't set the "length" property of bound functions.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} methodNames The object method names to bind.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'click': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view, ['click']);
     * jQuery(element).on('click', view.click);
     * // => Logs 'clicked docs' when clicked.
     */
    var bindAll = flatRest(function(object, methodNames) {
      arrayEach(methodNames, function(key) {
        key = toKey(key);
        baseAssignValue(object, key, bind(object[key], object));
      });
      return object;
    });

    /**
     * Creates a function that iterates over `pairs` and invokes the corresponding
     * function of the first predicate to return truthy. The predicate-function
     * pairs are invoked with the `this` binding and arguments of the created
     * function.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Array} pairs The predicate-function pairs.
     * @returns {Function} Returns the new composite function.
     * @example
     *
     * var func = _.cond([
     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
     *   [_.stubTrue,                      _.constant('no match')]
     * ]);
     *
     * func({ 'a': 1, 'b': 2 });
     * // => 'matches A'
     *
     * func({ 'a': 0, 'b': 1 });
     * // => 'matches B'
     *
     * func({ 'a': '1', 'b': '2' });
     * // => 'no match'
     */
    function cond(pairs) {
      var length = pairs == null ? 0 : pairs.length,
          toIteratee = getIteratee();

      pairs = !length ? [] : arrayMap(pairs, function(pair) {
        if (typeof pair[1] != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return [toIteratee(pair[0]), pair[1]];
      });

      return baseRest(function(args) {
        var index = -1;
        while (++index < length) {
          var pair = pairs[index];
          if (apply(pair[0], this, args)) {
            return apply(pair[1], this, args);
          }
        }
      });
    }

    /**
     * Creates a function that invokes the predicate properties of `source` with
     * the corresponding property values of a given object, returning `true` if
     * all predicates return truthy, else `false`.
     *
     * **Note:** The created function is equivalent to `_.conformsTo` with
     * `source` partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 2, 'b': 1 },
     *   { 'a': 1, 'b': 2 }
     * ];
     *
     * _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
     * // => [{ 'a': 1, 'b': 2 }]
     */
    function conforms(source) {
      return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new constant function.
     * @example
     *
     * var objects = _.times(2, _.constant({ 'a': 1 }));
     *
     * console.log(objects);
     * // => [{ 'a': 1 }, { 'a': 1 }]
     *
     * console.log(objects[0] === objects[1]);
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Checks `value` to determine whether a default value should be returned in
     * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
     * or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Util
     * @param {*} value The value to check.
     * @param {*} defaultValue The default value.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * _.defaultTo(1, 10);
     * // => 1
     *
     * _.defaultTo(undefined, 10);
     * // => 10
     */
    function defaultTo(value, defaultValue) {
      return (value == null || value !== value) ? defaultValue : value;
    }

    /**
     * Creates a function that returns the result of invoking the given functions
     * with the `this` binding of the created function, where each successive
     * invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flowRight
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow([_.add, square]);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the given functions from right to left.
     *
     * @static
     * @since 3.0.0
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flow
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight([square, _.add]);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that invokes `func` with the arguments of the created
     * function. If `func` is a property name, the created function returns the
     * property value for a given element. If `func` is an array or object, the
     * created function returns `true` for elements that contain the equivalent
     * source properties, otherwise it returns `false`.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Util
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
     * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, _.iteratee(['user', 'fred']));
     * // => [{ 'user': 'fred', 'age': 40 }]
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, _.iteratee('user'));
     * // => ['barney', 'fred']
     *
     * // Create custom iteratee shorthands.
     * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
     *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
     *     return func.test(string);
     *   };
     * });
     *
     * _.filter(['abc', 'def'], /ef/);
     * // => ['def']
     */
    function iteratee(func) {
      return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between a given
     * object and `source`, returning `true` if the given object has equivalent
     * property values, else `false`.
     *
     * **Note:** The created function is equivalent to `_.isMatch` with `source`
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * **Note:** Multiple values can be checked by combining several matchers
     * using `_.overSome`
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
     * // => [{ 'a': 4, 'b': 5, 'c': 6 }]
     *
     * // Checking for several possible values
     * _.filter(objects, _.overSome([_.matches({ 'a': 1 }), _.matches({ 'a': 4 })]));
     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between the
     * value at `path` of a given object to `srcValue`, returning `true` if the
     * object value is equivalent, else `false`.
     *
     * **Note:** Partial comparisons will match empty array and empty object
     * `srcValue` values against any array or object value, respectively. See
     * `_.isEqual` for a list of supported value comparisons.
     *
     * **Note:** Multiple values can be checked by combining several matchers
     * using `_.overSome`
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.find(objects, _.matchesProperty('a', 4));
     * // => { 'a': 4, 'b': 5, 'c': 6 }
     *
     * // Checking for several possible values
     * _.filter(objects, _.overSome([_.matchesProperty('a', 1), _.matchesProperty('a', 4)]));
     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that invokes the method at `path` of a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': _.constant(2) } },
     *   { 'a': { 'b': _.constant(1) } }
     * ];
     *
     * _.map(objects, _.method('a.b'));
     * // => [2, 1]
     *
     * _.map(objects, _.method(['a', 'b']));
     * // => [2, 1]
     */
    var method = baseRest(function(path, args) {
      return function(object) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path of `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = baseRest(function(object, args) {
      return function(path) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * Adds all own enumerable string keyed function properties of a source
     * object to the destination object. If `object` is a function, then methods
     * are added to its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      var props = keys(source),
          methodNames = baseFunctions(source, props);

      if (options == null &&
          !(isObject(source) && (methodNames.length || !props.length))) {
        options = source;
        source = object;
        object = this;
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
          isFunc = isFunction(object);

      arrayEach(methodNames, function(methodName) {
        var func = source[methodName];
        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = function() {
            var chainAll = this.__chain__;
            if (chain || chainAll) {
              var result = object(this.__wrapped__),
                  actions = result.__actions__ = copyArray(this.__actions__);

              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
              result.__chain__ = chainAll;
              return result;
            }
            return func.apply(object, arrayPush([this.value()], arguments));
          };
        }
      });

      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      if (root._ === this) {
        root._ = oldDash;
      }
      return this;
    }

    /**
     * This method returns `undefined`.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Util
     * @example
     *
     * _.times(2, _.noop);
     * // => [undefined, undefined]
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that gets the argument at index `n`. If `n` is negative,
     * the nth argument from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [n=0] The index of the argument to return.
     * @returns {Function} Returns the new pass-thru function.
     * @example
     *
     * var func = _.nthArg(1);
     * func('a', 'b', 'c', 'd');
     * // => 'b'
     *
     * var func = _.nthArg(-2);
     * func('a', 'b', 'c', 'd');
     * // => 'c'
     */
    function nthArg(n) {
      n = toInteger(n);
      return baseRest(function(args) {
        return baseNth(args, n);
      });
    }

    /**
     * Creates a function that invokes `iteratees` with the arguments it receives
     * and returns their results.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.over([Math.max, Math.min]);
     *
     * func(1, 2, 3, 4);
     * // => [4, 1]
     */
    var over = createOver(arrayMap);

    /**
     * Creates a function that checks if **all** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * Following shorthands are possible for providing predicates.
     * Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
     * Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overEvery([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => false
     *
     * func(NaN);
     * // => false
     */
    var overEvery = createOver(arrayEvery);

    /**
     * Creates a function that checks if **any** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * Following shorthands are possible for providing predicates.
     * Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
     * Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overSome([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => true
     *
     * func(NaN);
     * // => false
     *
     * var matchesFunc = _.overSome([{ 'a': 1 }, { 'a': 2 }])
     * var matchesPropertyFunc = _.overSome([['a', 1], ['a', 2]])
     */
    var overSome = createOver(arraySome);

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': 2 } },
     *   { 'a': { 'b': 1 } }
     * ];
     *
     * _.map(objects, _.property('a.b'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the value at a given path of `object`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return object == null ? undefined : baseGet(object, path);
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified,
     * it's set to `start` with `start` then set to `0`.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.rangeRight
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createRange();

    /**
     * This method is like `_.range` except that it populates values in
     * descending order.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.range
     * @example
     *
     * _.rangeRight(4);
     * // => [3, 2, 1, 0]
     *
     * _.rangeRight(-4);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 5);
     * // => [4, 3, 2, 1]
     *
     * _.rangeRight(0, 20, 5);
     * // => [15, 10, 5, 0]
     *
     * _.rangeRight(0, -4, -1);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.rangeRight(0);
     * // => []
     */
    var rangeRight = createRange(true);

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    /**
     * This method returns a new empty object.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Object} Returns the new empty object.
     * @example
     *
     * var objects = _.times(2, _.stubObject);
     *
     * console.log(objects);
     * // => [{}, {}]
     *
     * console.log(objects[0] === objects[1]);
     * // => false
     */
    function stubObject() {
      return {};
    }

    /**
     * This method returns an empty string.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {string} Returns the empty string.
     * @example
     *
     * _.times(2, _.stubString);
     * // => ['', '']
     */
    function stubString() {
      return '';
    }

    /**
     * This method returns `true`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `true`.
     * @example
     *
     * _.times(2, _.stubTrue);
     * // => [true, true]
     */
    function stubTrue() {
      return true;
    }

    /**
     * Invokes the iteratee `n` times, returning an array of the results of
     * each invocation. The iteratee is invoked with one argument; (index).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.times(3, String);
     * // => ['0', '1', '2']
     *
     *  _.times(4, _.constant(0));
     * // => [0, 0, 0, 0]
     */
    function times(n, iteratee) {
      n = toInteger(n);
      if (n < 1 || n > MAX_SAFE_INTEGER) {
        return [];
      }
      var index = MAX_ARRAY_LENGTH,
          length = nativeMin(n, MAX_ARRAY_LENGTH);

      iteratee = getIteratee(iteratee);
      n -= MAX_ARRAY_LENGTH;

      var result = baseTimes(length, iteratee);
      while (++index < n) {
        iteratee(index);
      }
      return result;
    }

    /**
     * Converts `value` to a property path array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {*} value The value to convert.
     * @returns {Array} Returns the new property path array.
     * @example
     *
     * _.toPath('a.b.c');
     * // => ['a', 'b', 'c']
     *
     * _.toPath('a[0].b.c');
     * // => ['a', '0', 'b', 'c']
     */
    function toPath(value) {
      if (isArray(value)) {
        return arrayMap(value, toKey);
      }
      return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
    }

    /**
     * Generates a unique ID. If `prefix` is given, the ID is appended to it.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {string} [prefix=''] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return toString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {number} augend The first number in an addition.
     * @param {number} addend The second number in an addition.
     * @returns {number} Returns the total.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    var add = createMathOperation(function(augend, addend) {
      return augend + addend;
    }, 0);

    /**
     * Computes `number` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Divide two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} dividend The first number in a division.
     * @param {number} divisor The second number in a division.
     * @returns {number} Returns the quotient.
     * @example
     *
     * _.divide(6, 4);
     * // => 1.5
     */
    var divide = createMathOperation(function(dividend, divisor) {
      return dividend / divisor;
    }, 1);

    /**
     * Computes `number` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Computes the maximum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => undefined
     */
    function max(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseGt)
        : undefined;
    }

    /**
     * This method is like `_.max` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.maxBy(objects, function(o) { return o.n; });
     * // => { 'n': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.maxBy(objects, 'n');
     * // => { 'n': 2 }
     */
    function maxBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseGt)
        : undefined;
    }

    /**
     * Computes the mean of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the mean.
     * @example
     *
     * _.mean([4, 2, 8, 6]);
     * // => 5
     */
    function mean(array) {
      return baseMean(array, identity);
    }

    /**
     * This method is like `_.mean` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be averaged.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the mean.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.meanBy(objects, function(o) { return o.n; });
     * // => 5
     *
     * // The `_.property` iteratee shorthand.
     * _.meanBy(objects, 'n');
     * // => 5
     */
    function meanBy(array, iteratee) {
      return baseMean(array, getIteratee(iteratee, 2));
    }

    /**
     * Computes the minimum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => undefined
     */
    function min(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseLt)
        : undefined;
    }

    /**
     * This method is like `_.min` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.minBy(objects, function(o) { return o.n; });
     * // => { 'n': 1 }
     *
     * // The `_.property` iteratee shorthand.
     * _.minBy(objects, 'n');
     * // => { 'n': 1 }
     */
    function minBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseLt)
        : undefined;
    }

    /**
     * Multiply two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} multiplier The first number in a multiplication.
     * @param {number} multiplicand The second number in a multiplication.
     * @returns {number} Returns the product.
     * @example
     *
     * _.multiply(6, 4);
     * // => 24
     */
    var multiply = createMathOperation(function(multiplier, multiplicand) {
      return multiplier * multiplicand;
    }, 1);

    /**
     * Computes `number` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Subtract two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {number} minuend The first number in a subtraction.
     * @param {number} subtrahend The second number in a subtraction.
     * @returns {number} Returns the difference.
     * @example
     *
     * _.subtract(6, 4);
     * // => 2
     */
    var subtract = createMathOperation(function(minuend, subtrahend) {
      return minuend - subtrahend;
    }, 0);

    /**
     * Computes the sum of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 2, 8, 6]);
     * // => 20
     */
    function sum(array) {
      return (array && array.length)
        ? baseSum(array, identity)
        : 0;
    }

    /**
     * This method is like `_.sum` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be summed.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the sum.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.sumBy(objects, function(o) { return o.n; });
     * // => 20
     *
     * // The `_.property` iteratee shorthand.
     * _.sumBy(objects, 'n');
     * // => 20
     */
    function sumBy(array, iteratee) {
      return (array && array.length)
        ? baseSum(array, getIteratee(iteratee, 2))
        : 0;
    }

    /*------------------------------------------------------------------------*/

    // Add methods that return wrapped values in chain sequences.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.assignIn = assignIn;
    lodash.assignInWith = assignInWith;
    lodash.assignWith = assignWith;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.castArray = castArray;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.concat = concat;
    lodash.cond = cond;
    lodash.conforms = conforms;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.differenceBy = differenceBy;
    lodash.differenceWith = differenceWith;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatMap = flatMap;
    lodash.flatMapDeep = flatMapDeep;
    lodash.flatMapDepth = flatMapDepth;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flattenDepth = flattenDepth;
    lodash.flip = flip;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.fromPairs = fromPairs;
    lodash.functions = functions;
    lodash.functionsIn = functionsIn;
    lodash.groupBy = groupBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.intersectionBy = intersectionBy;
    lodash.intersectionWith = intersectionWith;
    lodash.invert = invert;
    lodash.invertBy = invertBy;
    lodash.invokeMap = invokeMap;
    lodash.iteratee = iteratee;
    lodash.keyBy = keyBy;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.mergeWith = mergeWith;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.negate = negate;
    lodash.nthArg = nthArg;
    lodash.omit = omit;
    lodash.omitBy = omitBy;
    lodash.once = once;
    lodash.orderBy = orderBy;
    lodash.over = over;
    lodash.overArgs = overArgs;
    lodash.overEvery = overEvery;
    lodash.overSome = overSome;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pickBy = pickBy;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAll = pullAll;
    lodash.pullAllBy = pullAllBy;
    lodash.pullAllWith = pullAllWith;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rangeRight = rangeRight;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.reverse = reverse;
    lodash.sampleSize = sampleSize;
    lodash.set = set;
    lodash.setWith = setWith;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortedUniq = sortedUniq;
    lodash.sortedUniqBy = sortedUniqBy;
    lodash.split = split;
    lodash.spread = spread;
    lodash.tail = tail;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.toArray = toArray;
    lodash.toPairs = toPairs;
    lodash.toPairsIn = toPairsIn;
    lodash.toPath = toPath;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.unary = unary;
    lodash.union = union;
    lodash.unionBy = unionBy;
    lodash.unionWith = unionWith;
    lodash.uniq = uniq;
    lodash.uniqBy = uniqBy;
    lodash.uniqWith = uniqWith;
    lodash.unset = unset;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.update = update;
    lodash.updateWith = updateWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.without = without;
    lodash.words = words;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.xorBy = xorBy;
    lodash.xorWith = xorWith;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipObjectDeep = zipObjectDeep;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.entries = toPairs;
    lodash.entriesIn = toPairsIn;
    lodash.extend = assignIn;
    lodash.extendWith = assignInWith;

    // Add methods to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add methods that return unwrapped values in chain sequences.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clamp = clamp;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.cloneDeepWith = cloneDeepWith;
    lodash.cloneWith = cloneWith;
    lodash.conformsTo = conformsTo;
    lodash.deburr = deburr;
    lodash.defaultTo = defaultTo;
    lodash.divide = divide;
    lodash.endsWith = endsWith;
    lodash.eq = eq;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.floor = floor;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.hasIn = hasIn;
    lodash.head = head;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.invoke = invoke;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isArrayBuffer = isArrayBuffer;
    lodash.isArrayLike = isArrayLike;
    lodash.isArrayLikeObject = isArrayLikeObject;
    lodash.isBoolean = isBoolean;
    lodash.isBuffer = isBuffer;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isEqualWith = isEqualWith;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isInteger = isInteger;
    lodash.isLength = isLength;
    lodash.isMap = isMap;
    lodash.isMatch = isMatch;
    lodash.isMatchWith = isMatchWith;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNil = isNil;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isObjectLike = isObjectLike;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isSafeInteger = isSafeInteger;
    lodash.isSet = isSet;
    lodash.isString = isString;
    lodash.isSymbol = isSymbol;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.isWeakMap = isWeakMap;
    lodash.isWeakSet = isWeakSet;
    lodash.join = join;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lowerCase = lowerCase;
    lodash.lowerFirst = lowerFirst;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.maxBy = maxBy;
    lodash.mean = mean;
    lodash.meanBy = meanBy;
    lodash.min = min;
    lodash.minBy = minBy;
    lodash.stubArray = stubArray;
    lodash.stubFalse = stubFalse;
    lodash.stubObject = stubObject;
    lodash.stubString = stubString;
    lodash.stubTrue = stubTrue;
    lodash.multiply = multiply;
    lodash.nth = nth;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padEnd = padEnd;
    lodash.padStart = padStart;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.replace = replace;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.sample = sample;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedIndexBy = sortedIndexBy;
    lodash.sortedIndexOf = sortedIndexOf;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.sortedLastIndexBy = sortedLastIndexBy;
    lodash.sortedLastIndexOf = sortedLastIndexOf;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.subtract = subtract;
    lodash.sum = sum;
    lodash.sumBy = sumBy;
    lodash.template = template;
    lodash.times = times;
    lodash.toFinite = toFinite;
    lodash.toInteger = toInteger;
    lodash.toLength = toLength;
    lodash.toLower = toLower;
    lodash.toNumber = toNumber;
    lodash.toSafeInteger = toSafeInteger;
    lodash.toString = toString;
    lodash.toUpper = toUpper;
    lodash.trim = trim;
    lodash.trimEnd = trimEnd;
    lodash.trimStart = trimStart;
    lodash.truncate = truncate;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.upperCase = upperCase;
    lodash.upperFirst = upperFirst;

    // Add aliases.
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.first = head;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
          source[methodName] = func;
        }
      });
      return source;
    }()), { 'chain': false });

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type {string}
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        n = n === undefined ? 1 : nativeMax(toInteger(n), 0);

        var result = (this.__filtered__ && !index)
          ? new LazyWrapper(this)
          : this.clone();

        if (result.__filtered__) {
          result.__takeCount__ = nativeMin(n, result.__takeCount__);
        } else {
          result.__views__.push({
            'size': nativeMin(n, MAX_ARRAY_LENGTH),
            'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
          });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee) {
        var result = this.clone();
        result.__iteratees__.push({
          'iteratee': getIteratee(iteratee, 3),
          'type': type
        });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.head` and `_.last`.
    arrayEach(['head', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
    arrayEach(['initial', 'tail'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.find = function(predicate) {
      return this.filter(predicate).head();
    };

    LazyWrapper.prototype.findLast = function(predicate) {
      return this.reverse().find(predicate);
    };

    LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
      if (typeof path == 'function') {
        return new LazyWrapper(this);
      }
      return this.map(function(value) {
        return baseInvoke(value, path, args);
      });
    });

    LazyWrapper.prototype.reject = function(predicate) {
      return this.filter(negate(getIteratee(predicate)));
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = toInteger(start);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = toInteger(end);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate) {
      return this.reverse().takeWhile(predicate).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(MAX_ARRAY_LENGTH);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
          isTaker = /^(?:head|last)$/.test(methodName),
          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
          retUnwrapped = isTaker || /^find/.test(methodName);

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__,
            args = isTaker ? [1] : arguments,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        var interceptor = function(value) {
          var result = lodashFunc.apply(lodash, arrayPush([value], args));
          return (isTaker && chainAll) ? result[0] : result;
        };

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var chainAll = this.__chain__,
            isHybrid = !!this.__actions__.length,
            isUnwrapped = retUnwrapped && !chainAll,
            onlyLazy = isLazy && !isHybrid;

        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
          return new LodashWrapper(result, chainAll);
        }
        if (isUnwrapped && onlyLazy) {
          return func.apply(this, args);
        }
        result = this.thru(interceptor);
        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
      };
    });

    // Add `Array` methods to `lodash.prototype`.
    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
      var func = arrayProto[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:pop|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          var value = this.value();
          return func.apply(isArray(value) ? value : [], args);
        }
        return this[chainName](function(value) {
          return func.apply(isArray(value) ? value : [], args);
        });
      };
    });

    // Map minified method names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = lodashFunc.name + '';
        if (!hasOwnProperty.call(realNames, key)) {
          realNames[key] = [];
        }
        realNames[key].push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybrid(undefined, WRAP_BIND_KEY_FLAG).name] = [{
      'name': 'wrapper',
      'func': undefined
    }];

    // Add methods to `LazyWrapper`.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chain sequence methods to the `lodash` wrapper.
    lodash.prototype.at = wrapperAt;
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.next = wrapperNext;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    // Add lazy aliases.
    lodash.prototype.first = lodash.prototype.head;

    if (symIterator) {
      lodash.prototype[symIterator] = wrapperToIterator;
    }
    return lodash;
  });

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Some AMD build optimizers, like r.js, check for condition patterns like:
  if (true) {
    // Expose Lodash on the global object to prevent errors when Lodash is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    // Use `_.noConflict` to remove Lodash from the global object.
    root._ = _;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
  // Check for `exports` after `define` in case a build optimizer adds it.
  else {}
}.call(this));


/***/ }),

/***/ "./resources/css/app.css":
/*!*******************************!*\
  !*** ./resources/css/app.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/axios/package.json":
/*!*****************************************!*\
  !*** ./node_modules/axios/package.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/app": 0,
/******/ 			"css/app": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/js/app.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/css/app.css")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;