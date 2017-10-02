(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = exports.Parser = function () {
  function Parser(TEXTAREA) {
    var _this = this;

    _classCallCheck(this, Parser);

    this.analisysArr = [];

    TEXTAREA.addEventListener("keyup", function (event) {
      _this.parse(event.target.value);
    });
    this.parse(TEXTAREA.value);
  }

  _createClass(Parser, [{
    key: "trim",
    value: function trim(text) {
      text = text.replace(/(\n|\r)/g, "");
      return text.replace(/(^\s*|\s*$)/g, "");
    }
  }, {
    key: "searchMatchFlag",
    value: function searchMatchFlag(text, serarchPoint) {
      var matchFlag = null;
      if (serarchPoint === "start") {
        matchFlag = text.match(/^(\{|\[)/);
      } else if (serarchPoint === "end") {
        matchFlag = text.match(/(\}|\])$/);
      }
      if (matchFlag === null) {
        console.log('error');
        return;
      }
      return matchFlag[0];
    }
  }, {
    key: "compareMatchFlag",
    value: function compareMatchFlag(startFlag, endFlag) {
      if (startFlag === "{" && endFlag !== "}") {
        return true;
      }
      if (startFlag === "[" && endFlag !== "]") {
        return true;
      }
      return false;
    }
  }, {
    key: "removeMatchFlagString",
    value: function removeMatchFlagString(text) {
      text = text.replace(/^(\{|\[)/, "");
      text = text.replace(/(\}|\])$/, "");
      return text;
    }
  }, {
    key: "parse",
    value: function parse(original) {
      var _this2 = this;

      var text = this.trim(original);
      var startMatchFlag = this.searchMatchFlag(text, "start");
      var endMatchFlag = this.searchMatchFlag(text, "end");
      this.analisysArr.push(startMatchFlag);

      if (this.compareMatchFlag(startMatchFlag, endMatchFlag)) {
        console.log('notmatchflag');
        return;
      }
      text = this.removeMatchFlagString(text);
      text.split(",").forEach(function (item) {
        _this2.analisysArr.push(item);
      });

      this.analisysArr.push(endMatchFlag);
      console.log(this.analisysArr);
    }
    /*
    printArr() {
    }
    */

  }]);

  return Parser;
}();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
});