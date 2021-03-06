(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("terminal", [], factory);
	else if(typeof exports === 'object')
		exports["terminal"] = factory();
	else
		root["terminal"] = factory();
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = __webpack_require__(1);
exports.Stream = stream_1.Stream;
var Terminal = /** @class */ (function () {
    function Terminal(options) {
        if (options === void 0) { options = {
            welcome: '',
            prompt: '',
            separator: '$',
            theme: 'dark'
        }; }
        this.options = options;
        this.histtemp = '';
        this.history = window.localStorage.getItem('history') ? JSON.parse(window.localStorage.getItem('history')) : [];
        this.histpos = this.history.length;
    }
    Terminal.prototype.setupTerminal = function () {
        var _this = this;
        this.container.classList.add('terminal');
        this.container.classList.add("terminal-" + this.options.theme);
        this.container.insertAdjacentHTML('beforeend', "\n            <div class=\"background\">\n              <div class=\"term-container\">\n                <output></output>\n                <table class=\"input-line\">\n                    <tr>\n                        <td nowrap>\n                            <div class=\"prompt\">" + this.options.prompt + this.options.separator + "</div>\n                        </td>\n                        <td width=\"100%\">\n                            <input class=\"cmdline\" autofocus spellcheck=\"false\" />\n                        </td>\n                    </tr>\n                </table>\n              </div>\n            </div>\n        ");
        this.termContainer = this.container.querySelector('.term-container');
        this.inputLine = this.termContainer.querySelector('.input-line');
        this.cmdLine = this.termContainer.querySelector('.input-line .cmdline');
        this.output = this.termContainer.querySelector('output');
        this._prompt = this.termContainer.querySelector('.prompt');
        this.background = this.container.querySelector('.background');
        this.output.addEventListener('DOMSubtreeModified', function (e) {
            setTimeout(function () {
                _this.cmdLine.scrollIntoView();
            }, 0);
        });
        if (this.options.welcome) {
            this.write(this.options.welcome);
        }
        window.addEventListener('click', function (e) {
            _this.cmdLine.focus();
        }, false);
        this.output.addEventListener('click', function (e) {
            e.stopPropagation();
        }, false);
        var terminal = this;
        this.cmdLine.addEventListener('click', function (e) {
            terminal.inputTextClick(e, this);
        }, false);
        this.inputLine.addEventListener('click', function (e) {
            _this.cmdLine.focus();
        }, false);
        this.cmdLine.addEventListener('keyup', function (e) {
            terminal.historyHandler(e, this);
        }, false);
        this.cmdLine.addEventListener('keydown', function (e) {
            terminal.processNewCommand(terminal, e, this);
        }, false);
        window.addEventListener('keyup', function (e) {
            _this.cmdLine.focus();
            e.stopPropagation();
            e.preventDefault();
        }, false);
    };
    Terminal.prototype.processNewCommand = function (self, e, node) {
        var _this = this;
        // Only handle the Enter key.
        if (e.keyCode !== 13) {
            return;
        }
        var cmdline = node.value;
        // Save shell history.
        if (cmdline) {
            this.history[this.history.length] = cmdline;
            window.localStorage.setItem('history', JSON.stringify(this.history));
            this.histpos = this.history.length;
        }
        // Duplicate current input and append to output section.
        var line = node.parentNode.parentNode.parentNode.parentNode.cloneNode(true);
        line.removeAttribute('id');
        line.classList.add('line');
        var input = line.querySelector('input.cmdline');
        input.autofocus = false;
        input.readOnly = true;
        input.insertAdjacentHTML('beforebegin', input.value);
        input.parentNode.removeChild(input);
        this.output.appendChild(line);
        // Hide command line until we're done processing input.
        this.inputLine.classList.add('hidden');
        // Clear/setup line for next input.
        node.value = '';
        // Parse out command, args, and trim off whitespace.
        var args;
        var cmd;
        if (cmdline && cmdline.trim()) {
            args = cmdline.split(' ').filter(function (val, i) {
                return val;
            });
            cmd = args[0];
            args = args.splice(1); // Remove cmd from arg list.
        }
        if (cmd) {
            var stream = new stream_1.Stream()
                .onClose(function () {
                _this.inputLine.classList.remove('hidden');
            })
                .onWrite(function (html) {
                _this.write(html);
            });
            if (this.exec !== null) {
                this.exec(cmd, args, stream);
            }
        }
    };
    Terminal.prototype.inputTextClick = function (e, node) {
        node.value = node.value;
    };
    Terminal.prototype.historyHandler = function (e, node) {
        // Clear command-line on Escape key.
        if (e.keyCode === 27) {
            node.value = '';
            e.stopPropagation();
            e.preventDefault();
        }
        if (this.history.length && (e.keyCode === 38 || e.keyCode === 40)) {
            if (this.history[this.histpos]) {
                this.history[this.histpos] = node.value;
            }
            else {
                this.histtemp = node.value;
            }
            if (e.keyCode === 38) {
                // Up arrow key.
                this.histpos--;
                if (this.histpos < 0) {
                    this.histpos = 0;
                }
            }
            else if (e.keyCode === 40) {
                // Down arrow key.
                this.histpos++;
                if (this.histpos > this.history.length) {
                    this.histpos = this.history.length;
                }
            }
            node.value = this.history[this.histpos] ? this.history[this.histpos] : this.histtemp;
            // Move cursor to end of input.
            node.value = node.value;
        }
    };
    Terminal.prototype.write = function (html) {
        this.output.insertAdjacentHTML('beforeend', html);
        this.cmdLine.scrollIntoView();
    };
    Terminal.prototype.openIn = function (container) {
        if (!container) {
            throw new Error('Given container is undefined');
        }
        this._container = container;
        this.setupTerminal();
        return this;
    };
    Terminal.prototype.onCommand = function (exec) {
        if (!exec) {
            throw new Error('Callback function must be provided!');
        }
        this.exec = exec;
        return this;
    };
    Terminal.prototype.close = function () {
        if (this.container) {
            this.container.classList.remove('terminal');
            this.container.classList.remove("terminal-" + this.options.theme);
            this.termContainer.remove();
        }
    };
    Terminal.prototype.clear = function () {
        if (this.container) {
            this.output.innerHTML = '';
            this.cmdLine.value = '';
            this.background.style.minHeight = '';
        }
    };
    Object.defineProperty(Terminal.prototype, "theme", {
        get: function () {
            return this.options.theme;
        },
        set: function (theme) {
            if (this.container) {
                this.container.classList.remove("terminal-" + this.options.theme);
                this.options.theme = theme;
                this.container.classList.add("terminal-" + this.options.theme);
            }
            else {
                this.options.theme = theme;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Terminal.prototype, "prompt", {
        get: function () {
            return this.options.prompt;
        },
        set: function (prompt) {
            if (this.container) {
                this.options.prompt = prompt;
                this._prompt.innerHTML = prompt + this.options.separator;
            }
            else {
                this.options.prompt = prompt;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Terminal.prototype, "container", {
        get: function () {
            return this._container;
        },
        enumerable: true,
        configurable: true
    });
    return Terminal;
}());
exports.Terminal = Terminal;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Stream = /** @class */ (function () {
    function Stream() {
        this._closed = false;
    }
    Stream.prototype.write = function (html) {
        if (this._closed) {
            return;
        }
        if (this._write) {
            this._write(html);
        }
    };
    Stream.prototype.close = function () {
        if (this._close) {
            this._close();
        }
        this._closed = true;
    };
    Stream.prototype.isClosed = function () {
        return this._closed;
    };
    Stream.prototype.onWrite = function (callback) {
        this._write = callback;
        return this;
    };
    Stream.prototype.onClose = function (callback) {
        this._close = callback;
        return this;
    };
    return Stream;
}());
exports.Stream = Stream;


/***/ })
/******/ ]);
});
//# sourceMappingURL=terminal.js.map