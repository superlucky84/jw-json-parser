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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = exports.Parser = function () {
  function Parser(TEXTAREA) {
    var _this = this;

    _classCallCheck(this, Parser);

    var resultHTML = null;
    var root = document.getElementById("root");

    TEXTAREA.addEventListener("keyup", function (event) {
      resultHTML = _this.itemParse(event.target.value);
      root.innerHTML = resultHTML;
    });resultHTML = this.itemParse(TEXTAREA.value);
    root.innerHTML = resultHTML;
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
      if (!text) {
        return;
      }

      var matchFlag = null;
      if (serarchPoint === "start") {
        matchFlag = text.match(/^(\{|\[)/);
      } else if (serarchPoint === "end") {
        matchFlag = text.match(/(\}|\])$/);
      }
      if (matchFlag === null) {
        return null;
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

    // 키와 벨류를 분리함

  }, {
    key: "separateKayValue",
    value: function separateKayValue(item) {

      var key = item.replace(/(.*?):(.*)/, "$1");
      var value = item.replace(/(.*?):(.*)/, "$2");

      var keyValueArr = item.match(/(.*?):(.*)/);
      if (keyValueArr) {
        return [keyValueArr[1], keyValueArr[2]];
      }
      return [];
    }
  }, {
    key: "objectItemSplit",
    value: function objectItemSplit(text) {
      var splitArr = text.split(",");
      var newsplitArr = [];
      var serarchPoint = [];
      var match = null;
      var closeMatch = null;
      splitArr.forEach(function (item) {
        var matchStart = false;
        if (match === null) {
          match = item.match(/(\{|\[)/);
          if (match) {
            match = match[0];
            closeMatch = match == "{" ? "}" : "]";
            matchStart = true;
          }
        }
        var matchArr = item.match(new RegExp("\\" + match, "g"));
        var closeMatchArr = item.match(new RegExp("\\" + closeMatch, "g"));
        // 플래그 매칭
        if (matchArr) {
          serarchPoint = serarchPoint.concat(matchArr);
        }
        if (matchStart === true || serarchPoint.length === 0) {
          newsplitArr.push(item);
        } else if (serarchPoint.length > 0) {
          var newSplitLastIdx = newsplitArr.length - 1;
          newsplitArr[newSplitLastIdx] = newsplitArr[newSplitLastIdx] + "," + item;
        }
        if (serarchPoint.length > 0 && closeMatchArr) {
          serarchPoint.splice(0, closeMatchArr.length);
          if (serarchPoint.length === 0) {
            match = null;
          }
        }
      });
      return newsplitArr;
    }
  }, {
    key: "objectParse",
    value: function objectParse(text, analisysArr) {
      var _this2 = this;

      var splitArr = this.objectItemSplit(text);
      splitArr.forEach(function (item, idx) {

        var keyValue = _this2.separateKayValue(item);
        if (keyValue.length > 0) {
          var startMatchFlag = _this2.searchMatchFlag(_this2.trim(keyValue[1]), "start");
          if (startMatchFlag) {
            keyValue[1] = _this2.itemParse(keyValue[1]);
          }
          var comma = idx < splitArr.length - 1 ? "," : "";
          analisysArr.push("<li>");
          analisysArr.push(_this2.surroundTag(_this2.trim(keyValue[0]), "property"));
          analisysArr.push(":");
          analisysArr.push(_this2.surroundTag(keyValue[1]) + comma);
          analisysArr.push("</li>");
        }
      });
    }
  }, {
    key: "arrayParse",
    value: function arrayParse(text, analisysArr) {
      var _this3 = this;

      var splitArr = this.objectItemSplit(text);
      splitArr.forEach(function (item, idx) {
        var startMatchFlag = _this3.searchMatchFlag(_this3.trim(item), "start");
        if (startMatchFlag) {
          item = _this3.itemParse(item);
        }
        var comma = idx < splitArr.length - 1 ? "," : "";
        analisysArr.push("<li>");
        analisysArr.push(_this3.surroundTag(item) + comma);
        analisysArr.push("</li>");
      });
    }
  }, {
    key: "itemParse",
    value: function itemParse(original) {
      var analisysArr = [];
      var text = this.trim(original);
      var startMatchFlag = this.searchMatchFlag(text, "start");
      var endMatchFlag = this.searchMatchFlag(text, "end");
      if (this.compareMatchFlag(startMatchFlag, endMatchFlag)) {
        return;
      }
      text = this.removeMatchFlagString(text);
      if (startMatchFlag === "{") {
        analisysArr.push(this.surroundTag("{", "toggle"));
        analisysArr.push("<ul>");
        this.objectParse(text, analisysArr);
        analisysArr.push("</ul>");
        analisysArr.push(this.surroundTag("}", "toggle-end"));
      } else if (startMatchFlag === "[") {
        analisysArr.push(this.surroundTag("[", "toggle"));
        analisysArr.push("<ol>");
        this.arrayParse(text, analisysArr);
        analisysArr.push("</ol>");
        analisysArr.push(this.surroundTag("]", "toggle-end"));
      }
      return analisysArr.join("");
    }
  }, {
    key: "surroundTag",
    value: function surroundTag(item, type) {
      if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === "object") {
        return item;
      }
      if (!type) {
        type = item.match(/^"/) ? "string" : "number";
      }
      return "<span class=\"" + type + "\">" + item + "</span>";
    }
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