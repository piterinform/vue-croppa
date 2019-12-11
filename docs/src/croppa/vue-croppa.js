/*
 * vue-croppa v1.3.92
 * https://github.com/zhanziyang/vue-croppa
 * 
 * Copyright (c) 2019 zhanziyang
 * Released under the ISC license
 */
  
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Croppa = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var canvasExifOrientation$1 = createCommonjsModule(function (module, exports) {
(function (root, factory) {
    if (typeof undefined === 'function' && undefined.amd) {
        undefined([], factory);
    } else {
        module.exports = factory();
    }
}(commonjsGlobal, function () {
  'use strict';

  function drawImage(img, orientation, x, y, width, height) {
    if (!/^[1-8]$/.test(orientation)) throw new Error('orientation should be [1-8]');

    if (x == null) x = 0;
    if (y == null) y = 0;
    if (width == null) width = img.width;
    if (height == null) height = img.height;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    ctx.save();
    switch (+orientation) {
      // 1 = The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.
      case 1:
          break;

      // 2 = The 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.
      case 2:
         ctx.translate(width, 0);
         ctx.scale(-1, 1);
         break;

      // 3 = The 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.
      case 3:
          ctx.translate(width, height);
          ctx.rotate(180 / 180 * Math.PI);
          break;

      // 4 = The 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.
      case 4:
          ctx.translate(0, height);
          ctx.scale(1, -1);
          break;

      // 5 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual top.
      case 5:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.scale(1, -1);
          break;

      // 6 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual top.
      case 6:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.translate(0, -height);
          break;

      // 7 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.
      case 7:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(270 / 180 * Math.PI);
          ctx.translate(-width, height);
          ctx.scale(1, -1);
          break;

      // 8 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.
      case 8:
          canvas.width = height;
          canvas.height = width;
          ctx.translate(0, width);
          ctx.rotate(270 / 180 * Math.PI);
          break;
    }

    ctx.drawImage(img, x, y, width, height);
    ctx.restore();

    return canvas;
  }

  return {
    drawImage: drawImage
  };
}));
});

var u = {
  onePointCoord: function onePointCoord(point, vm) {
    var canvas = vm.canvas,
        quality = vm.quality;

    var rect = canvas.getBoundingClientRect();
    var clientX = point.clientX;
    var clientY = point.clientY;
    return {
      x: (clientX - rect.left) * quality,
      y: (clientY - rect.top) * quality
    };
  },
  getPointerCoords: function getPointerCoords(evt, vm) {
    var pointer = void 0;
    if (evt.touches && evt.touches[0]) {
      pointer = evt.touches[0];
    } else if (evt.changedTouches && evt.changedTouches[0]) {
      pointer = evt.changedTouches[0];
    } else {
      pointer = evt;
    }
    return this.onePointCoord(pointer, vm);
  },
  getPinchDistance: function getPinchDistance(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return Math.sqrt(Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2));
  },
  getPinchCenterCoord: function getPinchCenterCoord(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return {
      x: (coord1.x + coord2.x) / 2,
      y: (coord1.y + coord2.y) / 2
    };
  },
  imageLoaded: function imageLoaded(img) {
    return img.complete && img.naturalWidth !== 0;
  },
  rAFPolyfill: function rAFPolyfill() {
    // rAF polyfill
    if (typeof document == 'undefined' || typeof window == 'undefined') return;
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
        var id = window.setTimeout(function () {
          var arg = currTime + timeToCall;
          callback(arg);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }

    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  },
  toBlobPolyfill: function toBlobPolyfill() {
    if (typeof document == 'undefined' || typeof window == 'undefined' || !HTMLCanvasElement) return;
    var binStr, len, arr;
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function value(callback, type, quality) {
          binStr = atob(this.toDataURL(type, quality).split(',')[1]);
          len = binStr.length;
          arr = new Uint8Array(len);

          for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }

          callback(new Blob([arr], { type: type || 'image/png' }));
        }
      });
    }
  },
  eventHasFile: function eventHasFile(evt) {
    var dt = evt.dataTransfer || evt.originalEvent.dataTransfer;
    if (dt.types) {
      for (var i = 0, len = dt.types.length; i < len; i++) {
        if (dt.types[i] == 'Files') {
          return true;
        }
      }
    }

    return false;
  },
  getFileOrientation: function getFileOrientation(arrayBuffer) {
    var view = new DataView(arrayBuffer);
    if (view.getUint16(0, false) != 0xFFD8) return -2;
    var length = view.byteLength;
    var offset = 2;
    while (offset < length) {
      var marker = view.getUint16(offset, false);
      offset += 2;
      if (marker == 0xFFE1) {
        if (view.getUint32(offset += 2, false) != 0x45786966) return -1;
        var little = view.getUint16(offset += 6, false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;
        for (var i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) == 0x0112) {
            return view.getUint16(offset + i * 12 + 8, little);
          }
        }
      } else if ((marker & 0xFF00) != 0xFF00) break;else offset += view.getUint16(offset, false);
    }
    return -1;
  },
  parseDataUrl: function parseDataUrl(url) {
    var reg = /^data:([^;]+)?(;base64)?,(.*)/gmi;
    return reg.exec(url)[3];
  },
  base64ToArrayBuffer: function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  },
  getRotatedImage: function getRotatedImage(img, orientation) {
    var _canvas = canvasExifOrientation$1.drawImage(img, orientation);
    var _img = new Image();
    _img.src = _canvas.toDataURL();
    return _img;
  },
  flipX: function flipX(ori) {
    if (ori % 2 == 0) {
      return ori - 1;
    }

    return ori + 1;
  },
  flipY: function flipY(ori) {
    var map = {
      1: 4,
      4: 1,
      2: 3,
      3: 2,
      5: 8,
      8: 5,
      6: 7,
      7: 6
    };

    return map[ori];
  },
  rotate90: function rotate90(ori) {
    var map = {
      1: 6,
      2: 7,
      3: 8,
      4: 5,
      5: 2,
      6: 3,
      7: 4,
      8: 1
    };

    return map[ori];
  },
  numberValid: function numberValid(n) {
    return typeof n === 'number' && !isNaN(n);
  }
};

Number.isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

var initialImageType = String;
if (typeof window !== 'undefined' && window.Image) {
  initialImageType = [String, Image];
}

var props = {
  value: Object,
  width: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  height: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  placeholder: {
    type: String,
    default: 'Choose an image'
  },
  placeholderColor: {
    default: '#606060'
  },
  placeholderFontSize: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  canvasColor: {
    default: 'transparent'
  },
  quality: {
    type: Number,
    default: 2,
    validator: function validator(val) {
      return val > 0;
    }
  },
  zoomSpeed: {
    default: 3,
    type: Number,
    validator: function validator(val) {
      return val > 0;
    }
  },
  accept: String,
  fileSizeLimit: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  disabled: Boolean,
  disableDragAndDrop: Boolean,
  disableClickToChoose: Boolean,
  disableDragToMove: Boolean,
  disableScrollToZoom: Boolean,
  disablePinchToZoom: Boolean,
  disableRotation: Boolean,
  reverseScrollToZoom: Boolean,
  preventWhiteSpace: Boolean,
  showRemoveButton: {
    type: Boolean,
    default: true
  },
  removeButtonColor: {
    type: String,
    default: 'red'
  },
  removeButtonSize: {
    type: Number
  },
  initialImage: initialImageType,
  initialSize: {
    type: String,
    default: 'cover',
    validator: function validator(val) {
      return val === 'cover' || val === 'contain' || val === 'natural';
    }
  },
  initialPosition: {
    type: String,
    default: 'center',
    validator: function validator(val) {
      var valids = ['center', 'top', 'bottom', 'left', 'right'];
      return val.split(' ').every(function (word) {
        return valids.indexOf(word) >= 0;
      }) || /^-?\d+% -?\d+%$/.test(val);
    }
  },
  inputAttrs: Object,
  showLoading: Boolean,
  loadingSize: {
    type: Number,
    default: 20
  },
  loadingColor: {
    type: String,
    default: '#606060'
  },
  replaceDrop: Boolean,
  passive: Boolean,
  imageBorderRadius: {
    type: [Number, String],
    default: 0
  },
  autoSizing: Boolean,
  videoEnabled: Boolean
};

var events = {
  INIT_EVENT: 'init',
  FILE_CHOOSE_EVENT: 'file-choose',
  FILE_SIZE_EXCEED_EVENT: 'file-size-exceed',
  FILE_TYPE_MISMATCH_EVENT: 'file-type-mismatch',
  NEW_IMAGE_EVENT: 'new-image',
  NEW_IMAGE_DRAWN_EVENT: 'new-image-drawn',
  IMAGE_REMOVE_EVENT: 'image-remove',
  MOVE_EVENT: 'move',
  ZOOM_EVENT: 'zoom',
  DRAW_EVENT: 'draw',
  INITIAL_IMAGE_LOADED_EVENT: 'initial-image-loaded',
  LOADING_START_EVENT: 'loading-start',
  LOADING_END_EVENT: 'loading-end'
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var PCT_PER_ZOOM = 1 / 100000; // The amount of zooming everytime it happens, in percentage of image width.
var MIN_MS_PER_CLICK = 500; // If touch duration is shorter than the value, then it is considered as a click.
var CLICK_MOVE_THRESHOLD = 100; // If touch move distance is greater than this value, then it will by no mean be considered as a click.
var MIN_WIDTH = 10; // The minimal width the user can zoom to.
var DEFAULT_PLACEHOLDER_TAKEUP = 2 / 3; // Placeholder text by default takes up this amount of times of canvas width.
var PINCH_ACCELERATION = 1; // The amount of times by which the pinching is more sensitive than the scolling

var syncData = ['imgData', 'img', 'imgSet', 'originalImage', 'naturalHeight', 'naturalWidth', 'orientation', 'scaleRatio'];
// const DEBUG = false

var component = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { ref: "wrapper", class: 'croppa-container ' + (_vm.img ? 'croppa--has-target' : '') + ' ' + (_vm.passive ? 'croppa--passive' : '') + ' ' + (_vm.disabled ? 'croppa--disabled' : '') + ' ' + (_vm.disableClickToChoose ? 'croppa--disabled-cc' : '') + ' ' + (_vm.disableDragToMove && _vm.disableScrollToZoom ? 'croppa--disabled-mz' : '') + ' ' + (_vm.fileDraggedOver ? 'croppa--dropzone' : ''), on: { "dragenter": function dragenter($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleDragEnter($event);
        }, "dragleave": function dragleave($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleDragLeave($event);
        }, "dragover": function dragover($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleDragOver($event);
        }, "drop": function drop($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleDrop($event);
        } } }, [_c('input', _vm._b({ ref: "fileInput", staticStyle: { "height": "1px", "width": "1px", "overflow": "hidden", "margin-left": "-99999px", "position": "absolute" }, attrs: { "type": "file", "accept": _vm.accept, "disabled": _vm.disabled }, on: { "change": _vm._handleInputChange } }, 'input', _vm.inputAttrs, false)), _vm._v(" "), _c('div', { staticClass: "slots", staticStyle: { "width": "0", "height": "0", "visibility": "hidden" } }, [_vm._t("initial"), _vm._v(" "), _vm._t("placeholder")], 2), _vm._v(" "), _c('canvas', { ref: "canvas", on: { "click": function click($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleClick($event);
        }, "dblclick": function dblclick($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleDblClick($event);
        }, "touchstart": function touchstart($event) {
          $event.stopPropagation();return _vm._handlePointerStart($event);
        }, "mousedown": function mousedown($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerStart($event);
        }, "pointerstart": function pointerstart($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerStart($event);
        }, "touchend": function touchend($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerEnd($event);
        }, "touchcancel": function touchcancel($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerEnd($event);
        }, "mouseup": function mouseup($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerEnd($event);
        }, "pointerend": function pointerend($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerEnd($event);
        }, "pointercancel": function pointercancel($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerEnd($event);
        }, "touchmove": function touchmove($event) {
          $event.stopPropagation();return _vm._handlePointerMove($event);
        }, "mousemove": function mousemove($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerMove($event);
        }, "pointermove": function pointermove($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerMove($event);
        }, "pointerleave": function pointerleave($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerLeave($event);
        }, "DOMMouseScroll": function DOMMouseScroll($event) {
          $event.stopPropagation();return _vm._handleWheel($event);
        }, "wheel": function wheel($event) {
          $event.stopPropagation();return _vm._handleWheel($event);
        }, "mousewheel": function mousewheel($event) {
          $event.stopPropagation();return _vm._handleWheel($event);
        } } }), _vm._v(" "), _vm.showRemoveButton && _vm.img && !_vm.passive ? _c('svg', { staticClass: "icon icon-remove", style: 'top: -' + _vm.height / 40 + 'px; right: -' + _vm.width / 40 + 'px', attrs: { "viewBox": "0 0 1024 1024", "version": "1.1", "xmlns": "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink", "width": _vm.removeButtonSize || _vm.width / 10, "height": _vm.removeButtonSize || _vm.width / 10 }, on: { "click": _vm.remove } }, [_c('path', { attrs: { "d": "M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z", "fill": _vm.removeButtonColor } })]) : _vm._e(), _vm._v(" "), _vm.showLoading && _vm.loading ? _c('div', { staticClass: "sk-fading-circle", style: _vm.loadingStyle }, _vm._l(12, function (i) {
      return _c('div', { key: i, class: 'sk-circle' + i + ' sk-circle' }, [_c('div', { staticClass: "sk-circle-indicator", style: { backgroundColor: _vm.loadingColor } })]);
    })) : _vm._e(), _vm._v(" "), _vm._t("default")], 2);
  }, staticRenderFns: [],
  model: {
    prop: 'value',
    event: events.INIT_EVENT
  },

  props: props,

  data: function data() {
    return {
      canvas: null,
      ctx: null,
      originalImage: null,
      img: null,
      video: null,
      dragging: false,
      lastMovingCoord: null,
      imgData: {
        width: 0,
        height: 0,
        startX: 0,
        startY: 0
      },
      fileDraggedOver: false,
      tabStart: 0,
      scrolling: false,
      pinching: false,
      rotating: false,
      angle: 0,
      pinchDistance: 0,
      supportTouch: false,
      pointerMoved: false,
      pointerStartCoord: null,
      naturalWidth: 0,
      naturalHeight: 0,
      scaleRatio: null,
      orientation: 1,
      userMetadata: null,
      imageSet: false,
      currentPointerCoord: null,
      currentIsInitial: false,
      loading: false,
      realWidth: 0, // only for when autoSizing is on
      realHeight: 0, // only for when autoSizing is on
      chosenFile: null,
      useAutoSizing: false
    };
  },


  computed: {
    outputWidth: function outputWidth() {
      var w = this.useAutoSizing ? this.realWidth : this.width;
      return w * this.quality;
    },
    outputHeight: function outputHeight() {
      var h = this.useAutoSizing ? this.realHeight : this.height;
      return h * this.quality;
    },
    computedPlaceholderFontSize: function computedPlaceholderFontSize() {
      return this.placeholderFontSize * this.quality;
    },
    aspectRatio: function aspectRatio() {
      return this.naturalWidth / this.naturalHeight;
    },
    loadingStyle: function loadingStyle() {
      return {
        width: this.loadingSize + 'px',
        height: this.loadingSize + 'px',
        right: '15px',
        bottom: '10px'
      };
    }
  },

  mounted: function mounted() {
    var _this = this;

    this._initialize();
    u.rAFPolyfill();
    u.toBlobPolyfill();

    var supports = this.supportDetection();
    if (!supports.basic) {
      console.warn('Your browser does not support vue-croppa functionality.');
    }

    if (this.passive) {
      this.$watch('value._data', function (data) {
        var set$$1 = false;
        if (!data) return;
        for (var key in data) {
          if (syncData.indexOf(key) >= 0) {
            var val = data[key];
            if (val !== _this[key]) {
              _this.$set(_this, key, val);
              set$$1 = true;
            }
          }
        }
        if (set$$1) {
          if (!_this.img) {
            _this.remove();
          } else {
            _this.$nextTick(function () {
              _this._draw();
            });
          }
        }
      }, {
        deep: true
      });
    }

    this.useAutoSizing = !!(this.autoSizing && this.$refs.wrapper && getComputedStyle);
    if (this.useAutoSizing) {
      this._autoSizingInit();
    }
  },
  beforeDestroy: function beforeDestroy() {
    if (this.useAutoSizing) {
      this._autoSizingRemove();
    }
  },


  watch: {
    outputWidth: function outputWidth() {
      this.onDimensionChange();
    },
    outputHeight: function outputHeight() {
      this.onDimensionChange();
    },
    canvasColor: function canvasColor() {
      if (!this.img) {
        this._setPlaceholders();
      } else {
        this._draw();
      }
    },
    imageBorderRadius: function imageBorderRadius() {
      if (this.img) {
        this._draw();
      }
    },
    placeholder: function placeholder() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    placeholderColor: function placeholderColor() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    computedPlaceholderFontSize: function computedPlaceholderFontSize() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    preventWhiteSpace: function preventWhiteSpace(val) {
      if (val) {
        this.imageSet = false;
      }
      this._placeImage();
    },
    scaleRatio: function scaleRatio(val, oldVal) {
      if (this.passive) return;
      if (!this.img) return;
      if (!u.numberValid(val)) return;

      var x = 1;
      if (u.numberValid(oldVal) && oldVal !== 0) {
        x = val / oldVal;
      }
      var pos = this.currentPointerCoord || {
        x: this.imgData.startX + this.imgData.width / 2,
        y: this.imgData.startY + this.imgData.height / 2
      };
      this.imgData.width = this.naturalWidth * val;
      this.imgData.height = this.naturalHeight * val;

      if (!this.userMetadata && this.imageSet && !this.rotating) {
        var offsetX = (x - 1) * (pos.x - this.imgData.startX);
        var offsetY = (x - 1) * (pos.y - this.imgData.startY);
        this.imgData.startX = this.imgData.startX - offsetX;
        this.imgData.startY = this.imgData.startY - offsetY;
      }

      if (this.preventWhiteSpace) {
        this._preventZoomingToWhiteSpace();
        this._preventMovingToWhiteSpace();
      }
    },

    'imgData.width': function imgDataWidth(val, oldVal) {
      // if (this.passive) return
      if (!u.numberValid(val)) return;
      this.scaleRatio = val / this.naturalWidth;
      if (this.hasImage()) {
        if (Math.abs(val - oldVal) > val * (1 / 100000)) {
          this.emitEvent(events.ZOOM_EVENT);
          this._draw();
        }
      }
    },
    'imgData.height': function imgDataHeight(val) {
      // if (this.passive) return
      if (!u.numberValid(val)) return;
      this.scaleRatio = val / this.naturalHeight;
    },
    'imgData.startX': function imgDataStartX(val) {
      // if (this.passive) return
      if (this.hasImage()) {
        this.$nextTick(this._draw);
      }
    },
    'imgData.startY': function imgDataStartY(val) {
      // if (this.passive) return
      if (this.hasImage()) {
        this.$nextTick(this._draw);
      }
    },
    loading: function loading(val) {
      if (this.passive) return;
      if (val) {
        this.emitEvent(events.LOADING_START_EVENT);
      } else {
        this.emitEvent(events.LOADING_END_EVENT);
      }
    },
    autoSizing: function autoSizing(val) {
      this.useAutoSizing = !!(this.autoSizing && this.$refs.wrapper && getComputedStyle);
      if (val) {
        this._autoSizingInit();
      } else {
        this._autoSizingRemove();
      }
    }
  },

  methods: {
    emitEvent: function emitEvent() {
      // console.log(args[0])
      this.$emit.apply(this, arguments);
    },
    getCanvas: function getCanvas() {
      return this.canvas;
    },
    getContext: function getContext() {
      return this.ctx;
    },
    getChosenFile: function getChosenFile() {
      return this.chosenFile || this.$refs.fileInput.files[0];
    },
    move: function move(offset) {
      if (!offset || this.passive) return;
      var oldX = this.imgData.startX;
      var oldY = this.imgData.startY;
      this.imgData.startX += offset.x;
      this.imgData.startY += offset.y;
      if (this.preventWhiteSpace) {
        this._preventMovingToWhiteSpace();
      }
      if (this.imgData.startX !== oldX || this.imgData.startY !== oldY) {
        this.emitEvent(events.MOVE_EVENT);
        this._draw();
      }
    },
    moveUpwards: function moveUpwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: 0, y: -amount });
    },
    moveDownwards: function moveDownwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: 0, y: amount });
    },
    moveLeftwards: function moveLeftwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: -amount, y: 0 });
    },
    moveRightwards: function moveRightwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: amount, y: 0 });
    },
    zoom: function zoom() {
      var zoomIn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var acceleration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      if (this.passive) return;
      var realSpeed = this.zoomSpeed * acceleration;
      var speed = this.outputWidth * PCT_PER_ZOOM * realSpeed;
      var x = 1;
      if (zoomIn) {
        x = 1 + speed;
      } else if (this.imgData.width > MIN_WIDTH) {
        x = 1 - speed;
      }

      this.scaleRatio *= x;
    },
    zoomIn: function zoomIn() {
      this.zoom(true);
    },
    zoomOut: function zoomOut() {
      this.zoom(false);
    },
    rotate: function rotate() {
      var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (this.disableRotation || this.disabled || this.passive) return;
      step = parseInt(step);
      if (isNaN(step) || step > 3 || step < -3) {
        console.warn('Invalid argument for rotate() method. It should one of the integers from -3 to 3.');
        step = 1;
      }
      this._rotateByStep(step);
    },
    flipX: function flipX() {
      if (this.disableRotation || this.disabled || this.passive) return;
      this._setOrientation(2);
    },
    flipY: function flipY() {
      if (this.disableRotation || this.disabled || this.passive) return;
      this._setOrientation(4);
    },
    refresh: function refresh() {
      this.$nextTick(this._initialize);
    },
    hasImage: function hasImage() {
      return !!this.imageSet;
    },
    applyMetadata: function applyMetadata(metadata) {
      if (!metadata || this.passive) return;
      this.userMetadata = metadata;
      var ori = metadata.orientation || this.orientation || 1;
      this._setOrientation(ori, true);
    },
    generateDataUrl: function generateDataUrl(type, compressionRate) {
      if (!this.hasImage()) return '';
      return this.canvas.toDataURL(type, compressionRate);
    },
    generateBlob: function generateBlob(callback, mimeType, qualityArgument) {
      if (!this.hasImage()) {
        callback(null);
        return;
      }
      this.canvas.toBlob(callback, mimeType, qualityArgument);
    },
    promisedBlob: function promisedBlob() {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof Promise == 'undefined') {
        console.warn('No Promise support. Please add Promise polyfill if you want to use this method.');
        return;
      }
      return new Promise(function (resolve, reject) {
        try {
          _this2.generateBlob.apply(_this2, [function (blob) {
            resolve(blob);
          }].concat(args));
        } catch (err) {
          reject(err);
        }
      });
    },
    getMetadata: function getMetadata() {
      if (!this.hasImage()) return {};
      var _imgData = this.imgData,
          startX = _imgData.startX,
          startY = _imgData.startY;


      return {
        startX: startX,
        startY: startY,
        scale: this.scaleRatio,
        orientation: this.orientation
      };
    },
    supportDetection: function supportDetection() {
      if (typeof window === 'undefined') return;
      var div = document.createElement('div');
      return {
        'basic': window.requestAnimationFrame && window.File && window.FileReader && window.FileList && window.Blob,
        'dnd': 'ondragstart' in div && 'ondrop' in div
      };
    },
    chooseFile: function chooseFile() {
      if (this.passive) return;
      this.$refs.fileInput.click();
    },
    remove: function remove() {
      if (!this.imageSet) return;
      this._setPlaceholders();

      var hadImage = this.img != null;
      this.originalImage = null;
      this.img = null;
      this.$refs.fileInput.value = '';
      this.imgData = {
        width: 0,
        height: 0,
        startX: 0,
        startY: 0
      };
      this.orientation = 1;
      this.scaleRatio = null;
      this.userMetadata = null;
      this.imageSet = false;
      this.chosenFile = null;
      if (this.video) {
        this.video.pause();
        this.video = null;
      }

      if (hadImage) {
        this.emitEvent(events.IMAGE_REMOVE_EVENT);
      }
    },
    addClipPlugin: function addClipPlugin(plugin) {
      if (!this.clipPlugins) {
        this.clipPlugins = [];
      }
      if (typeof plugin === 'function' && this.clipPlugins.indexOf(plugin) < 0) {
        this.clipPlugins.push(plugin);
      } else {
        throw Error('Clip plugins should be functions');
      }
    },
    emitNativeEvent: function emitNativeEvent(evt) {
      this.emitEvent(evt.type, evt);
    },
    setFile: function setFile(file) {
      this._onNewFileIn(file);
    },
    _setContainerSize: function _setContainerSize() {
      if (this.useAutoSizing) {
        this.realWidth = +getComputedStyle(this.$refs.wrapper).width.slice(0, -2);
        this.realHeight = +getComputedStyle(this.$refs.wrapper).height.slice(0, -2);
      }
    },
    _autoSizingInit: function _autoSizingInit() {
      this._setContainerSize();
      window.addEventListener('resize', this._setContainerSize);
    },
    _autoSizingRemove: function _autoSizingRemove() {
      this._setContainerSize();
      window.removeEventListener('resize', this._setContainerSize);
    },
    _initialize: function _initialize() {
      this.canvas = this.$refs.canvas;
      this._setSize();
      this.canvas.style.backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : typeof this.canvasColor === 'string' ? this.canvasColor : '';
      this.ctx = this.canvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = "high";
      this.ctx.webkitImageSmoothingEnabled = true;
      this.ctx.msImageSmoothingEnabled = true;
      this.ctx.imageSmoothingEnabled = true;
      this.originalImage = null;
      this.img = null;
      this.$refs.fileInput.value = '';
      this.imageSet = false;
      this.chosenFile = null;
      this._setInitial();
      if (!this.passive) {
        this.emitEvent(events.INIT_EVENT, this);
      }
    },
    _setSize: function _setSize() {
      this.canvas.width = this.outputWidth;
      this.canvas.height = this.outputHeight;
      this.canvas.style.width = (this.useAutoSizing ? this.realWidth : this.width) + 'px';
      this.canvas.style.height = (this.useAutoSizing ? this.realHeight : this.height) + 'px';
    },
    _rotateByStep: function _rotateByStep(step) {
      var orientation = 1;
      switch (step) {
        case 1:
          orientation = 6;
          break;
        case 2:
          orientation = 3;
          break;
        case 3:
          orientation = 8;
          break;
        case -1:
          orientation = 8;
          break;
        case -2:
          orientation = 3;
          break;
        case -3:
          orientation = 6;
          break;
      }
      this._setOrientation(orientation);
    },
    _setImagePlaceholder: function _setImagePlaceholder() {
      var _this3 = this;

      var img = void 0;
      if (this.$slots.placeholder && this.$slots.placeholder[0]) {
        var vNode = this.$slots.placeholder[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm) {
          img = elm;
        }
      }

      if (!img) return;

      var onLoad = function onLoad() {
        _this3.ctx.drawImage(img, 0, 0, _this3.outputWidth, _this3.outputHeight);
      };

      if (u.imageLoaded(img)) {
        onLoad();
      } else {
        img.onload = onLoad;
      }
    },
    _setTextPlaceholder: function _setTextPlaceholder() {
      var ctx = this.ctx;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      var defaultFontSize = this.outputWidth * DEFAULT_PLACEHOLDER_TAKEUP / this.placeholder.length;
      var fontSize = !this.computedPlaceholderFontSize || this.computedPlaceholderFontSize == 0 ? defaultFontSize : this.computedPlaceholderFontSize;
      ctx.font = fontSize + 'px sans-serif';
      ctx.fillStyle = !this.placeholderColor || this.placeholderColor == 'default' ? '#606060' : this.placeholderColor;
      ctx.fillText(this.placeholder, this.outputWidth / 2, this.outputHeight / 2);
    },
    _setPlaceholders: function _setPlaceholders() {
      this._paintBackground();
      this._setImagePlaceholder();
      this._setTextPlaceholder();
    },
    _setInitial: function _setInitial() {
      var _this4 = this;

      var src = void 0,
          img = void 0;
      if (this.$slots.initial && this.$slots.initial[0]) {
        var vNode = this.$slots.initial[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm) {
          img = elm;
        }
      }
      if (this.initialImage && typeof this.initialImage === 'string') {
        src = this.initialImage;
        img = new Image();
        if (!/^data:/.test(src) && !/^blob:/.test(src)) {
          img.setAttribute('crossOrigin', 'anonymous');
        }
        img.src = src;
      } else if (_typeof(this.initialImage) === 'object' && this.initialImage instanceof Image) {
        img = this.initialImage;
      }
      if (!src && !img) {
        this._setPlaceholders();
        return;
      }
      this.currentIsInitial = true;
      if (u.imageLoaded(img)) {
        // this.emitEvent(events.INITIAL_IMAGE_LOADED_EVENT)
        this._onload(img, +img.dataset['exifOrientation'], true);
      } else {
        this.loading = true;
        img.onload = function () {
          // this.emitEvent(events.INITIAL_IMAGE_LOADED_EVENT)
          _this4._onload(img, +img.dataset['exifOrientation'], true);
        };

        img.onerror = function () {
          _this4._setPlaceholders();
        };
      }
    },
    _onload: function _onload(img) {
      var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var initial = arguments[2];

      if (this.imageSet) {
        this.remove();
      }
      this.originalImage = img;
      this.img = img;

      if (isNaN(orientation)) {
        orientation = 1;
      }

      this._setOrientation(orientation);

      if (initial) {
        this.emitEvent(events.INITIAL_IMAGE_LOADED_EVENT);
      }
    },
    _onVideoLoad: function _onVideoLoad(video, initial) {
      var _this5 = this;

      this.video = video;
      var canvas = document.createElement('canvas');
      var videoWidth = video.videoWidth,
          videoHeight = video.videoHeight;

      canvas.width = videoWidth;
      canvas.height = videoHeight;
      var ctx = canvas.getContext('2d');
      this.loading = false;
      var drawFrame = function drawFrame(initial) {
        if (!_this5.video) return;
        ctx.drawImage(_this5.video, 0, 0, videoWidth, videoHeight);
        var frame = new Image();
        frame.src = canvas.toDataURL();
        frame.onload = function () {
          _this5.img = frame;
          // this._placeImage()
          if (initial) {
            _this5._placeImage();
          } else {
            _this5._draw();
          }
        };
      };
      drawFrame(true);
      var keepDrawing = function keepDrawing() {
        _this5.$nextTick(function () {
          drawFrame();
          if (!_this5.video || _this5.video.ended || _this5.video.paused) return;
          requestAnimationFrame(keepDrawing);
        });
      };
      this.video.addEventListener('play', function () {
        requestAnimationFrame(keepDrawing);
      });
    },
    _handleClick: function _handleClick(evt) {
      this.emitNativeEvent(evt);
      if (!this.hasImage() && !this.disableClickToChoose && !this.disabled && !this.supportTouch && !this.passive) {
        this.chooseFile();
      }
    },
    _handleDblClick: function _handleDblClick(evt) {
      this.emitNativeEvent(evt);
      if (this.videoEnabled && this.video) {
        if (this.video.paused || this.video.ended) {
          this.video.play();
        } else {
          this.video.pause();
        }
        return;
      }
    },
    _handleInputChange: function _handleInputChange() {
      var input = this.$refs.fileInput;
      if (!input.files.length || this.passive) return;

      var file = input.files[0];
      this._onNewFileIn(file);
    },
    _onNewFileIn: function _onNewFileIn(file) {
      var _this6 = this;

      this.currentIsInitial = false;
      this.loading = true;
      this.emitEvent(events.FILE_CHOOSE_EVENT, file);
      this.chosenFile = file;
      if (!this._fileSizeIsValid(file)) {
        this.loading = false;
        this.emitEvent(events.FILE_SIZE_EXCEED_EVENT, file);
        return false;
      }
      if (!this._fileTypeIsValid(file)) {
        this.loading = false;
        this.emitEvent(events.FILE_TYPE_MISMATCH_EVENT, file);
        var type = file.type || file.name.toLowerCase().split('.').pop();
        return false;
      }

      if (typeof window !== 'undefined' && typeof window.FileReader !== 'undefined') {
        var fr = new FileReader();
        fr.onload = function (e) {
          var fileData = e.target.result;
          var base64 = u.parseDataUrl(fileData);
          var isVideo = /^video/.test(file.type);
          if (isVideo) {
            var video = document.createElement('video');
            video.src = fileData;
            fileData = null;
            if (video.readyState >= video.HAVE_FUTURE_DATA) {
              _this6._onVideoLoad(video);
            } else {
              video.addEventListener('canplay', function () {
                console.log('can play event');
                _this6._onVideoLoad(video);
              }, false);
            }
          } else {
            var orientation = 1;
            try {
              orientation = u.getFileOrientation(u.base64ToArrayBuffer(base64));
            } catch (err) {}
            if (orientation < 1) orientation = 1;
            var img = new Image();
            img.src = fileData;
            fileData = null;
            img.onload = function () {
              _this6._onload(img, orientation);
              _this6.emitEvent(events.NEW_IMAGE_EVENT);
            };
          }
        };
        fr.readAsDataURL(file);
      }
    },
    _fileSizeIsValid: function _fileSizeIsValid(file) {
      if (!file) return false;
      if (!this.fileSizeLimit || this.fileSizeLimit == 0) return true;

      return file.size < this.fileSizeLimit;
    },
    _fileTypeIsValid: function _fileTypeIsValid(file) {
      var acceptableMimeType = this.videoEnabled && /^video/.test(file.type) && document.createElement('video').canPlayType(file.type) || /^image/.test(file.type);
      if (!acceptableMimeType) return false;
      if (!this.accept) return true;
      var accept = this.accept;
      var baseMimetype = accept.replace(/\/.*$/, '');
      var types = accept.split(',');
      for (var i = 0, len = types.length; i < len; i++) {
        var type = types[i];
        var t = type.trim();
        if (t.charAt(0) == '.') {
          if (file.name.toLowerCase().split('.').pop() === t.toLowerCase().slice(1)) return true;
        } else if (/\/\*$/.test(t)) {
          var fileBaseType = file.type.replace(/\/.*$/, '');
          if (fileBaseType === baseMimetype) {
            return true;
          }
        } else if (file.type === type) {
          return true;
        }
      }

      return false;
    },
    _placeImage: function _placeImage(applyMetadata) {
      if (!this.img) return;
      var imgData = this.imgData;

      this.naturalWidth = this.img.naturalWidth;
      this.naturalHeight = this.img.naturalHeight;

      imgData.startX = u.numberValid(imgData.startX) ? imgData.startX : 0;
      imgData.startY = u.numberValid(imgData.startY) ? imgData.startY : 0;

      if (this.preventWhiteSpace) {
        this._aspectFill();
      } else if (!this.imageSet) {
        if (this.initialSize == 'contain') {
          this._aspectFit();
        } else if (this.initialSize == 'natural') {
          this._naturalSize();
        } else {
          this._aspectFill();
        }
      } else {
        this.imgData.width = this.naturalWidth * this.scaleRatio;
        this.imgData.height = this.naturalHeight * this.scaleRatio;
      }

      if (!this.imageSet) {
        if (/top/.test(this.initialPosition)) {
          imgData.startY = 0;
        } else if (/bottom/.test(this.initialPosition)) {
          imgData.startY = this.outputHeight - imgData.height;
        }

        if (/left/.test(this.initialPosition)) {
          imgData.startX = 0;
        } else if (/right/.test(this.initialPosition)) {
          imgData.startX = this.outputWidth - imgData.width;
        }

        if (/^-?\d+% -?\d+%$/.test(this.initialPosition)) {
          var result = /^(-?\d+)% (-?\d+)%$/.exec(this.initialPosition);
          var x = +result[1] / 100;
          var y = +result[2] / 100;
          imgData.startX = x * (this.outputWidth - imgData.width);
          imgData.startY = y * (this.outputHeight - imgData.height);
        }
      }

      applyMetadata && this._applyMetadata();

      if (applyMetadata && this.preventWhiteSpace) {
        this.zoom(false, 0);
      } else {
        this.move({ x: 0, y: 0 });
        this._draw();
      }
    },
    _aspectFill: function _aspectFill() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var canvasRatio = this.outputWidth / this.outputHeight;
      var scaleRatio = void 0;

      if (this.aspectRatio > canvasRatio) {
        scaleRatio = imgHeight / this.outputHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.outputHeight;
        this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
        this.imgData.startY = 0;
      } else {
        scaleRatio = imgWidth / this.outputWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.outputWidth;
        this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
        this.imgData.startX = 0;
      }
    },
    _aspectFit: function _aspectFit() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var canvasRatio = this.outputWidth / this.outputHeight;
      var scaleRatio = void 0;
      if (this.aspectRatio > canvasRatio) {
        scaleRatio = imgWidth / this.outputWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.outputWidth;
        this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
        this.imgData.startX = 0;
      } else {
        scaleRatio = imgHeight / this.outputHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.outputHeight;
        this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
        this.imgData.startY = 0;
      }
    },
    _naturalSize: function _naturalSize() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      this.imgData.width = imgWidth;
      this.imgData.height = imgHeight;
      this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
      this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
    },
    _handlePointerStart: function _handlePointerStart(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      this.supportTouch = true;
      this.pointerMoved = false;
      var pointerCoord = u.getPointerCoords(evt, this);
      this.pointerStartCoord = pointerCoord;

      if (this.disabled) return;
      // simulate click with touch on mobile devices
      if (!this.hasImage() && !this.disableClickToChoose) {
        this.tabStart = new Date().valueOf();
        return;
      }
      // ignore mouse right click and middle click
      if (evt.which && evt.which > 1) return;

      if (!evt.touches || evt.touches.length === 1) {
        this.dragging = true;
        this.pinching = false;
        var coord = u.getPointerCoords(evt, this);
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        this.dragging = false;
        this.pinching = true;
        this.pinchDistance = u.getPinchDistance(evt, this);
      }

      var cancelEvents = ['mouseup', 'touchend', 'touchcancel', 'pointerend', 'pointercancel'];
      for (var i = 0, len = cancelEvents.length; i < len; i++) {
        var e = cancelEvents[i];
        document.addEventListener(e, this._handlePointerEnd);
      }
    },
    _handlePointerEnd: function _handlePointerEnd(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      var pointerMoveDistance = 0;
      if (this.pointerStartCoord) {
        var pointerCoord = u.getPointerCoords(evt, this);
        pointerMoveDistance = Math.sqrt(Math.pow(pointerCoord.x - this.pointerStartCoord.x, 2) + Math.pow(pointerCoord.y - this.pointerStartCoord.y, 2)) || 0;
      }
      if (this.disabled) return;
      if (!this.hasImage() && !this.disableClickToChoose) {
        var tabEnd = new Date().valueOf();
        if (pointerMoveDistance < CLICK_MOVE_THRESHOLD && tabEnd - this.tabStart < MIN_MS_PER_CLICK && this.supportTouch) {
          this.chooseFile();
        }
        this.tabStart = 0;
        return;
      }

      this.dragging = false;
      this.pinching = false;
      this.pinchDistance = 0;
      this.lastMovingCoord = null;
      this.pointerMoved = false;
      this.pointerStartCoord = null;
    },
    _handlePointerMove: function _handlePointerMove(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      this.pointerMoved = true;
      if (!this.hasImage()) return;
      var coord = u.getPointerCoords(evt, this);
      this.currentPointerCoord = coord;

      if (this.disabled || this.disableDragToMove) return;

      evt.preventDefault();
      if (!evt.touches || evt.touches.length === 1) {
        if (!this.dragging) return;
        if (this.lastMovingCoord) {
          this.move({
            x: coord.x - this.lastMovingCoord.x,
            y: coord.y - this.lastMovingCoord.y
          });
        }
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        if (!this.pinching) return;
        var distance = u.getPinchDistance(evt, this);
        var delta = distance - this.pinchDistance;
        this.zoom(delta > 0, PINCH_ACCELERATION);
        this.pinchDistance = distance;
      }
    },
    _handlePointerLeave: function _handlePointerLeave(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      this.currentPointerCoord = null;
    },
    _handleWheel: function _handleWheel(evt) {
      var _this7 = this;

      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (this.disabled || this.disableScrollToZoom || !this.hasImage()) return;
      evt.preventDefault();
      this.scrolling = true;
      if (evt.wheelDelta < 0 || evt.deltaY > 0 || evt.detail > 0) {
        this.zoom(this.reverseScrollToZoom);
      } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
        this.zoom(!this.reverseScrollToZoom);
      }
      this.$nextTick(function () {
        _this7.scrolling = false;
      });
    },
    _handleDragEnter: function _handleDragEnter(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (this.disabled || this.disableDragAndDrop || !u.eventHasFile(evt)) return;
      if (this.hasImage() && !this.replaceDrop) return;
      this.fileDraggedOver = true;
    },
    _handleDragLeave: function _handleDragLeave(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = false;
    },
    _handleDragOver: function _handleDragOver(evt) {
      this.emitNativeEvent(evt);
    },
    _handleDrop: function _handleDrop(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      if (this.hasImage() && !this.replaceDrop) {
        return;
      }
      this.fileDraggedOver = false;

      var file = void 0;
      var dt = evt.dataTransfer;
      if (!dt) return;
      if (dt.items) {
        for (var i = 0, len = dt.items.length; i < len; i++) {
          var item = dt.items[i];
          if (item.kind == 'file') {
            file = item.getAsFile();
            break;
          }
        }
      } else {
        file = dt.files[0];
      }

      if (file) {
        this._onNewFileIn(file);
      }
    },
    _preventMovingToWhiteSpace: function _preventMovingToWhiteSpace() {
      if (this.imgData.startX > 0) {
        this.imgData.startX = 0;
      }
      if (this.imgData.startY > 0) {
        this.imgData.startY = 0;
      }
      if (this.outputWidth - this.imgData.startX > this.imgData.width) {
        this.imgData.startX = -(this.imgData.width - this.outputWidth);
      }
      if (this.outputHeight - this.imgData.startY > this.imgData.height) {
        this.imgData.startY = -(this.imgData.height - this.outputHeight);
      }
    },
    _preventZoomingToWhiteSpace: function _preventZoomingToWhiteSpace() {
      if (this.imgData.width < this.outputWidth) {
        this.scaleRatio = this.outputWidth / this.naturalWidth;
      }

      if (this.imgData.height < this.outputHeight) {
        this.scaleRatio = this.outputHeight / this.naturalHeight;
      }
    },
    _setOrientation: function _setOrientation() {
      var _this9 = this;

      var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;
      var applyMetadata = arguments[1];

      var useOriginal = applyMetadata;
      if (orientation > 1 || useOriginal) {
        if (!this.img) return;
        this.rotating = true;
        // u.getRotatedImageData(useOriginal ? this.originalImage : this.img, orientation)
        var _img = u.getRotatedImage(useOriginal ? this.originalImage : this.img, orientation);
        _img.onload = function () {
          _this9.img = _img;
          _this9._placeImage(applyMetadata);
        };
      } else {
        this._placeImage(applyMetadata);
      }

      if (orientation == 2) {
        // flip x
        this.orientation = u.flipX(this.orientation);
      } else if (orientation == 4) {
        // flip y
        this.orientation = u.flipY(this.orientation);
      } else if (orientation == 6) {
        // 90 deg
        this.orientation = u.rotate90(this.orientation);
      } else if (orientation == 3) {
        // 180 deg
        this.orientation = u.rotate90(u.rotate90(this.orientation));
      } else if (orientation == 8) {
        // 270 deg
        this.orientation = u.rotate90(u.rotate90(u.rotate90(this.orientation)));
      } else {
        this.orientation = orientation;
      }

      if (useOriginal) {
        this.orientation = orientation;
      }
    },
    _paintBackground: function _paintBackground() {
      var backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : this.canvasColor;
      this.ctx.fillStyle = backgroundColor;
      this.ctx.clearRect(0, 0, this.outputWidth, this.outputHeight);
      this.ctx.fillRect(0, 0, this.outputWidth, this.outputHeight);
    },
    _draw: function _draw() {
      var _this10 = this;

      this.$nextTick(function () {
        if (typeof window !== 'undefined' && window.requestAnimationFrame) {
          requestAnimationFrame(_this10._drawFrame);
        } else {
          _this10._drawFrame();
        }
      });
    },
    _drawFrame: function _drawFrame() {
      if (!this.img) return;
      this.loading = false;
      var ctx = this.ctx;
      var _imgData2 = this.imgData,
          startX = _imgData2.startX,
          startY = _imgData2.startY,
          width = _imgData2.width,
          height = _imgData2.height;


      this._paintBackground();
      ctx.drawImage(this.img, startX, startY, width, height);

      if (this.preventWhiteSpace) {
        this._clip(this._createContainerClipPath);
        // this._clip(this._createImageClipPath)
      }

      this.emitEvent(events.DRAW_EVENT, ctx);
      if (!this.imageSet) {
        this.imageSet = true;
        this.emitEvent(events.NEW_IMAGE_DRAWN_EVENT);
      }
      this.rotating = false;
    },
    _clipPathFactory: function _clipPathFactory(x, y, width, height) {
      var ctx = this.ctx;
      var radius = typeof this.imageBorderRadius === 'number' ? this.imageBorderRadius : !isNaN(Number(this.imageBorderRadius)) ? Number(this.imageBorderRadius) : 0;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    },
    _createContainerClipPath: function _createContainerClipPath() {
      var _this11 = this;

      this._clipPathFactory(0, 0, this.outputWidth, this.outputHeight);
      if (this.clipPlugins && this.clipPlugins.length) {
        this.clipPlugins.forEach(function (func) {
          func(_this11.ctx, 0, 0, _this11.outputWidth, _this11.outputHeight);
        });
      }
    },


    // _createImageClipPath () {
    //   let { startX, startY, width, height } = this.imgData
    //   let w = width
    //   let h = height
    //   let x = startX
    //   let y = startY
    //   if (w < h) {
    //     h = this.outputHeight * (width / this.outputWidth)
    //   }
    //   if (h < w) {
    //     w = this.outputWidth * (height / this.outputHeight)
    //     x = startX + (width - this.outputWidth) / 2
    //   }
    //   this._clipPathFactory(x, startY, w, h)
    // },

    _clip: function _clip(createPath) {
      var ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.globalCompositeOperation = 'destination-in';
      createPath();
      ctx.fill();
      ctx.restore();
    },
    _applyMetadata: function _applyMetadata() {
      var _this12 = this;

      if (!this.userMetadata) return;
      var _userMetadata = this.userMetadata,
          startX = _userMetadata.startX,
          startY = _userMetadata.startY,
          scale = _userMetadata.scale;


      if (u.numberValid(startX)) {
        this.imgData.startX = startX;
      }

      if (u.numberValid(startY)) {
        this.imgData.startY = startY;
      }

      if (u.numberValid(scale)) {
        this.scaleRatio = scale;
      }

      this.$nextTick(function () {
        _this12.userMetadata = null;
      });
    },
    onDimensionChange: function onDimensionChange() {
      if (!this.img) {
        this._initialize();
      } else {
        if (this.preventWhiteSpace) {
          this.imageSet = false;
        }
        this._setSize();
        this._placeImage();
      }
    },
    rotateToAngleInjected: function rotateToAngleInjected() {
      this.angle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this.disableRotation || this.disabled || this.passive) return;
      this.angle = parseInt(this.angle);
      if (isNaN(this.angle) || this.angle > 360 || this.angle < 0) {
        console.warn('Invalid argument for rotate() method. It should be in range [0, 360].');
        this.angle = 0;
      }

      var _this8 = this;
      if (!this.img) return;
      this.rotating = true;

      var img = this.originalImage;
      // Zoom in to reduce quality loss when rotating
      var width = this.originalImage.width;
      var height = this.originalImage.height;
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;

      var picOffsetX = width / 2;
      var picOffsetY = height / 2;

      ctx.translate(picOffsetX, picOffsetY);
      ctx.rotate(this.angle / 180 * Math.PI);
      ctx.drawImage(img, 0 - picOffsetX, 0 - picOffsetY, width, height);
      ctx.restore();

      var _canvas = canvas;

      var _img = new Image();
      _img.src = _canvas.toDataURL();

      _img.onload = function () {
        _this8.img = _img;
        _this8._drawFrame();
      };
    },
    getResizedImage: function getResizedImage(file) {
      var _this13 = this;

      var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;

      if (!file) {
        return null;
      }
      var img = new Image();
      var imgResized = new Image();
      var canvas = null;
      var fileReader = new FileReader();
      var ratio = 1;
      fileReader.onload = function (e) {
        var fileData = e.target.result;
        var base64 = u.parseDataUrl(fileData);
        // first get EXIF orientation
        var orientation = 1;
        try {
          orientation = u.getFileOrientation(u.base64ToArrayBuffer(base64));
        } catch (err) {}
        img.src = fileData;
        img.onload = function () {
          ratio = img.height / img.width;
          canvas = canvasExifOrientation.drawImage(img, orientation, 0, 0, width, width * ratio);
          imgResized.src = canvas.toDataURL();
          imgResized.onload = function () {
            _this13._onload(imgResized);
          };
        };
      };
      fileReader.readAsDataURL(file);
    }
  }
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var defaultOptions = {
  componentName: 'croppa'
};

var VueCroppa = {
  install: function install(Vue, options) {
    options = objectAssign({}, defaultOptions, options);
    var version = Number(Vue.version.split('.')[0]);
    if (version < 2) {
      throw new Error('vue-croppa supports vue version 2.0 and above. You are using Vue@' + version + '. Please upgrade to the latest version of Vue.');
    }
    var componentName = options.componentName || 'croppa';

    // registration
    Vue.component(componentName, component);
  },

  component: component
};

return VueCroppa;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIHBhcnNlRGF0YVVybCAodXJsKSB7XHJcbiAgICBjb25zdCByZWcgPSAvXmRhdGE6KFteO10rKT8oO2Jhc2U2NCk/LCguKikvZ21pXHJcbiAgICByZXR1cm4gcmVnLmV4ZWModXJsKVszXVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9XHJcbiAgTnVtYmVyLmlzSW50ZWdlciB8fFxyXG4gIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJlxyXG4gICAgICBpc0Zpbml0ZSh2YWx1ZSkgJiZcclxuICAgICAgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXHJcbiAgICApXHJcbiAgfVxyXG5cclxudmFyIGluaXRpYWxJbWFnZVR5cGUgPSBTdHJpbmdcclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5JbWFnZSkge1xyXG4gIGluaXRpYWxJbWFnZVR5cGUgPSBbU3RyaW5nLCBJbWFnZV1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaGVpZ2h0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcclxuICB9LFxyXG4gIHF1YWxpdHk6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiBTdHJpbmcsXHJcbiAgZmlsZVNpemVMaW1pdDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gIGRpc2FibGVEcmFnQW5kRHJvcDogQm9vbGVhbixcclxuICBkaXNhYmxlQ2xpY2tUb0Nob29zZTogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ1RvTW92ZTogQm9vbGVhbixcclxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIGRpc2FibGVQaW5jaFRvWm9vbTogQm9vbGVhbixcclxuICBkaXNhYmxlUm90YXRpb246IEJvb2xlYW4sXHJcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9LFxyXG4gIGluaXRpYWxJbWFnZTogaW5pdGlhbEltYWdlVHlwZSxcclxuICBpbml0aWFsU2l6ZToge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ2NvdmVyJyxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID09PSAnY292ZXInIHx8IHZhbCA9PT0gJ2NvbnRhaW4nIHx8IHZhbCA9PT0gJ25hdHVyYWwnXHJcbiAgICB9XHJcbiAgfSxcclxuICBpbml0aWFsUG9zaXRpb246IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdjZW50ZXInLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHZhciB2YWxpZHMgPSBbJ2NlbnRlcicsICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnXVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHZhbC5zcGxpdCgnICcpLmV2ZXJ5KHdvcmQgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHZhbGlkcy5pbmRleE9mKHdvcmQpID49IDBcclxuICAgICAgICB9KSB8fCAvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodmFsKVxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfSxcclxuICBpbnB1dEF0dHJzOiBPYmplY3QsXHJcbiAgc2hvd0xvYWRpbmc6IEJvb2xlYW4sXHJcbiAgbG9hZGluZ1NpemU6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwXHJcbiAgfSxcclxuICBsb2FkaW5nQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICcjNjA2MDYwJ1xyXG4gIH0sXHJcbiAgcmVwbGFjZURyb3A6IEJvb2xlYW4sXHJcbiAgcGFzc2l2ZTogQm9vbGVhbixcclxuICBpbWFnZUJvcmRlclJhZGl1czoge1xyXG4gICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgIGRlZmF1bHQ6IDBcclxuICB9LFxyXG4gIGF1dG9TaXppbmc6IEJvb2xlYW4sXHJcbiAgdmlkZW9FbmFibGVkOiBCb29sZWFuLFxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgSU5JVF9FVkVOVDogJ2luaXQnLFxuICBGSUxFX0NIT09TRV9FVkVOVDogJ2ZpbGUtY2hvb3NlJyxcbiAgRklMRV9TSVpFX0VYQ0VFRF9FVkVOVDogJ2ZpbGUtc2l6ZS1leGNlZWQnLFxuICBGSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQ6ICdmaWxlLXR5cGUtbWlzbWF0Y2gnLFxuICBORVdfSU1BR0VfRVZFTlQ6ICduZXctaW1hZ2UnLFxuICBORVdfSU1BR0VfRFJBV05fRVZFTlQ6ICduZXctaW1hZ2UtZHJhd24nLFxuICBJTUFHRV9SRU1PVkVfRVZFTlQ6ICdpbWFnZS1yZW1vdmUnLFxuICBNT1ZFX0VWRU5UOiAnbW92ZScsXG4gIFpPT01fRVZFTlQ6ICd6b29tJyxcbiAgRFJBV19FVkVOVDogJ2RyYXcnLFxuICBJTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVDogJ2luaXRpYWwtaW1hZ2UtbG9hZGVkJyxcbiAgTE9BRElOR19TVEFSVF9FVkVOVDogJ2xvYWRpbmctc3RhcnQnLFxuICBMT0FESU5HX0VORF9FVkVOVDogJ2xvYWRpbmctZW5kJ1xufVxuIiwiPHRlbXBsYXRlPlxuICA8ZGl2IHJlZj1cIndyYXBwZXJcIlxuICAgIDpjbGFzcz1cImBjcm9wcGEtY29udGFpbmVyICR7aW1nID8gJ2Nyb3BwYS0taGFzLXRhcmdldCcgOiAnJ30gJHtwYXNzaXZlID8gJ2Nyb3BwYS0tcGFzc2l2ZScgOiAnJ30gJHtkaXNhYmxlZCA/ICdjcm9wcGEtLWRpc2FibGVkJyA6ICcnfSAke2Rpc2FibGVDbGlja1RvQ2hvb3NlID8gJ2Nyb3BwYS0tZGlzYWJsZWQtY2MnIDogJyd9ICR7ZGlzYWJsZURyYWdUb01vdmUgJiYgZGlzYWJsZVNjcm9sbFRvWm9vbSA/ICdjcm9wcGEtLWRpc2FibGVkLW16JyA6ICcnfSAke2ZpbGVEcmFnZ2VkT3ZlciA/ICdjcm9wcGEtLWRyb3B6b25lJyA6ICcnfWBcIlxuICAgIEBkcmFnZW50ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdFbnRlclwiXG4gICAgQGRyYWdsZWF2ZS5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJhZ0xlYXZlXCJcbiAgICBAZHJhZ292ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdPdmVyXCJcbiAgICBAZHJvcC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJvcFwiPlxuICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiXG4gICAgICA6YWNjZXB0PVwiYWNjZXB0XCJcbiAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcbiAgICAgIHYtYmluZD1cImlucHV0QXR0cnNcIlxuICAgICAgcmVmPVwiZmlsZUlucHV0XCJcbiAgICAgIEBjaGFuZ2U9XCJfaGFuZGxlSW5wdXRDaGFuZ2VcIlxuICAgICAgc3R5bGU9XCJoZWlnaHQ6MXB4O3dpZHRoOjFweDtvdmVyZmxvdzpoaWRkZW47bWFyZ2luLWxlZnQ6LTk5OTk5cHg7cG9zaXRpb246YWJzb2x1dGU7XCIgLz5cbiAgICA8ZGl2IGNsYXNzPVwic2xvdHNcIlxuICAgICAgc3R5bGU9XCJ3aWR0aDogMDsgaGVpZ2h0OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW47XCI+XG4gICAgICA8c2xvdCBuYW1lPVwiaW5pdGlhbFwiPjwvc2xvdD5cbiAgICAgIDxzbG90IG5hbWU9XCJwbGFjZWhvbGRlclwiPjwvc2xvdD5cbiAgICA8L2Rpdj5cbiAgICA8Y2FudmFzIHJlZj1cImNhbnZhc1wiXG4gICAgICBAY2xpY2suc3RvcC5wcmV2ZW50PVwiX2hhbmRsZUNsaWNrXCJcbiAgICAgIEBkYmxjbGljay5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRGJsQ2xpY2tcIlxuICAgICAgQHRvdWNoc3RhcnQuc3RvcD1cIl9oYW5kbGVQb2ludGVyU3RhcnRcIlxuICAgICAgQG1vdXNlZG93bi5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlclN0YXJ0XCJcbiAgICAgIEBwb2ludGVyc3RhcnQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJTdGFydFwiXG4gICAgICBAdG91Y2hlbmQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxuICAgICAgQHRvdWNoY2FuY2VsLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEBtb3VzZXVwLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEBwb2ludGVyZW5kLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEBwb2ludGVyY2FuY2VsLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEB0b3VjaG1vdmUuc3RvcD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXG4gICAgICBAbW91c2Vtb3ZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXG4gICAgICBAcG9pbnRlcm1vdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJNb3ZlXCJcbiAgICAgIEBwb2ludGVybGVhdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJMZWF2ZVwiXG4gICAgICBARE9NTW91c2VTY3JvbGwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiXG4gICAgICBAd2hlZWwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiXG4gICAgICBAbW91c2V3aGVlbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCI+PC9jYW52YXM+XG4gICAgPHN2ZyBjbGFzcz1cImljb24gaWNvbi1yZW1vdmVcIlxuICAgICAgdi1pZj1cInNob3dSZW1vdmVCdXR0b24gJiYgaW1nICYmICFwYXNzaXZlXCJcbiAgICAgIEBjbGljaz1cInJlbW92ZVwiXG4gICAgICA6c3R5bGU9XCJgdG9wOiAtJHtoZWlnaHQvNDB9cHg7IHJpZ2h0OiAtJHt3aWR0aC80MH1weGBcIlxuICAgICAgdmlld0JveD1cIjAgMCAxMDI0IDEwMjRcIlxuICAgICAgdmVyc2lvbj1cIjEuMVwiXG4gICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiXG4gICAgICA6d2lkdGg9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCJcbiAgICAgIDpoZWlnaHQ9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCI+XG4gICAgICA8cGF0aCBkPVwiTTUxMS45MjEyMzEgMEMyMjkuMTc5MDc3IDAgMCAyMjkuMjU3ODQ2IDAgNTEyIDAgNzk0LjcwMjc2OSAyMjkuMTc5MDc3IDEwMjQgNTExLjkyMTIzMSAxMDI0IDc5NC43ODE1MzggMTAyNCAxMDI0IDc5NC43MDI3NjkgMTAyNCA1MTIgMTAyNCAyMjkuMjU3ODQ2IDc5NC43ODE1MzggMCA1MTEuOTIxMjMxIDBaTTczMi4wNDE4NDYgNjUwLjYzMzg0NiA2NTAuNTE1NjkyIDczMi4wODEyMzFDNjUwLjUxNTY5MiA3MzIuMDgxMjMxIDUyMS40OTE2OTIgNTkzLjY4MzY5MiA1MTEuODgxODQ2IDU5My42ODM2OTIgNTAyLjQyOTUzOCA1OTMuNjgzNjkyIDM3My4zNjYxNTQgNzMyLjA4MTIzMSAzNzMuMzY2MTU0IDczMi4wODEyMzFMMjkxLjc2MTIzMSA2NTAuNjMzODQ2QzI5MS43NjEyMzEgNjUwLjYzMzg0NiA0MzAuMzE2MzA4IDUyMy41MDAzMDggNDMwLjMxNjMwOCA1MTIuMTk2OTIzIDQzMC4zMTYzMDggNTAwLjY5NjYxNSAyOTEuNzYxMjMxIDM3My41MjM2OTIgMjkxLjc2MTIzMSAzNzMuNTIzNjkyTDM3My4zNjYxNTQgMjkxLjkxODc2OUMzNzMuMzY2MTU0IDI5MS45MTg3NjkgNTAzLjQ1MzUzOCA0MzAuMzk1MDc3IDUxMS44ODE4NDYgNDMwLjM5NTA3NyA1MjAuMzQ5NTM4IDQzMC4zOTUwNzcgNjUwLjUxNTY5MiAyOTEuOTE4NzY5IDY1MC41MTU2OTIgMjkxLjkxODc2OUw3MzIuMDQxODQ2IDM3My41MjM2OTJDNzMyLjA0MTg0NiAzNzMuNTIzNjkyIDU5My40NDczODUgNTAyLjU0NzY5MiA1OTMuNDQ3Mzg1IDUxMi4xOTY5MjMgNTkzLjQ0NzM4NSA1MjEuNDEyOTIzIDczMi4wNDE4NDYgNjUwLjYzMzg0NiA3MzIuMDQxODQ2IDY1MC42MzM4NDZaXCJcbiAgICAgICAgOmZpbGw9XCJyZW1vdmVCdXR0b25Db2xvclwiPjwvcGF0aD5cbiAgICA8L3N2Zz5cbiAgICA8ZGl2IGNsYXNzPVwic2stZmFkaW5nLWNpcmNsZVwiXG4gICAgICA6c3R5bGU9XCJsb2FkaW5nU3R5bGVcIlxuICAgICAgdi1pZj1cInNob3dMb2FkaW5nICYmIGxvYWRpbmdcIj5cbiAgICAgIDxkaXYgOmNsYXNzPVwiYHNrLWNpcmNsZSR7aX0gc2stY2lyY2xlYFwiXG4gICAgICAgIHYtZm9yPVwiaSBpbiAxMlwiXG4gICAgICAgIDprZXk9XCJpXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGUtaW5kaWNhdG9yXCJcbiAgICAgICAgICA6c3R5bGU9XCJ7YmFja2dyb3VuZENvbG9yOiBsb2FkaW5nQ29sb3J9XCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbmltcG9ydCB1IGZyb20gJy4vdXRpbCdcbmltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xuaW1wb3J0IGV2ZW50cyBmcm9tICcuL2V2ZW50cydcblxuY29uc3QgUENUX1BFUl9aT09NID0gMSAvIDEwMDAwMCAvLyBUaGUgYW1vdW50IG9mIHpvb21pbmcgZXZlcnl0aW1lIGl0IGhhcHBlbnMsIGluIHBlcmNlbnRhZ2Ugb2YgaW1hZ2Ugd2lkdGguXG5jb25zdCBNSU5fTVNfUEVSX0NMSUNLID0gNTAwIC8vIElmIHRvdWNoIGR1cmF0aW9uIGlzIHNob3J0ZXIgdGhhbiB0aGUgdmFsdWUsIHRoZW4gaXQgaXMgY29uc2lkZXJlZCBhcyBhIGNsaWNrLlxuY29uc3QgQ0xJQ0tfTU9WRV9USFJFU0hPTEQgPSAxMDAgLy8gSWYgdG91Y2ggbW92ZSBkaXN0YW5jZSBpcyBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZSwgdGhlbiBpdCB3aWxsIGJ5IG5vIG1lYW4gYmUgY29uc2lkZXJlZCBhcyBhIGNsaWNrLlxuY29uc3QgTUlOX1dJRFRIID0gMTAgLy8gVGhlIG1pbmltYWwgd2lkdGggdGhlIHVzZXIgY2FuIHpvb20gdG8uXG5jb25zdCBERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCA9IDIgLyAzIC8vIFBsYWNlaG9sZGVyIHRleHQgYnkgZGVmYXVsdCB0YWtlcyB1cCB0aGlzIGFtb3VudCBvZiB0aW1lcyBvZiBjYW52YXMgd2lkdGguXG5jb25zdCBQSU5DSF9BQ0NFTEVSQVRJT04gPSAxIC8vIFRoZSBhbW91bnQgb2YgdGltZXMgYnkgd2hpY2ggdGhlIHBpbmNoaW5nIGlzIG1vcmUgc2Vuc2l0aXZlIHRoYW4gdGhlIHNjb2xsaW5nXG5cbmNvbnN0IHN5bmNEYXRhID0gWydpbWdEYXRhJywgJ2ltZycsICdpbWdTZXQnLCAnb3JpZ2luYWxJbWFnZScsICduYXR1cmFsSGVpZ2h0JywgJ25hdHVyYWxXaWR0aCcsICdvcmllbnRhdGlvbicsICdzY2FsZVJhdGlvJ11cbi8vIGNvbnN0IERFQlVHID0gZmFsc2VcblxuZXhwb3J0IGRlZmF1bHQge1xuICBtb2RlbDoge1xuICAgIHByb3A6ICd2YWx1ZScsXG4gICAgZXZlbnQ6IGV2ZW50cy5JTklUX0VWRU5UXG4gIH0sXG5cbiAgcHJvcHM6IHByb3BzLFxuXG4gIGRhdGEgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjYW52YXM6IG51bGwsXG4gICAgICBjdHg6IG51bGwsXG4gICAgICBvcmlnaW5hbEltYWdlOiBudWxsLFxuICAgICAgaW1nOiBudWxsLFxuICAgICAgdmlkZW86IG51bGwsXG4gICAgICBkcmFnZ2luZzogZmFsc2UsXG4gICAgICBsYXN0TW92aW5nQ29vcmQ6IG51bGwsXG4gICAgICBpbWdEYXRhOiB7XG4gICAgICAgIHdpZHRoOiAwLFxuICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgIHN0YXJ0WDogMCxcbiAgICAgICAgc3RhcnRZOiAwXG4gICAgICB9LFxuICAgICAgZmlsZURyYWdnZWRPdmVyOiBmYWxzZSxcbiAgICAgIHRhYlN0YXJ0OiAwLFxuICAgICAgc2Nyb2xsaW5nOiBmYWxzZSxcbiAgICAgIHBpbmNoaW5nOiBmYWxzZSxcbiAgICAgIHJvdGF0aW5nOiBmYWxzZSxcbiAgICAgIGFuZ2xlOiAwLFxuICAgICAgcGluY2hEaXN0YW5jZTogMCxcbiAgICAgIHN1cHBvcnRUb3VjaDogZmFsc2UsXG4gICAgICBwb2ludGVyTW92ZWQ6IGZhbHNlLFxuICAgICAgcG9pbnRlclN0YXJ0Q29vcmQ6IG51bGwsXG4gICAgICBuYXR1cmFsV2lkdGg6IDAsXG4gICAgICBuYXR1cmFsSGVpZ2h0OiAwLFxuICAgICAgc2NhbGVSYXRpbzogbnVsbCxcbiAgICAgIG9yaWVudGF0aW9uOiAxLFxuICAgICAgdXNlck1ldGFkYXRhOiBudWxsLFxuICAgICAgaW1hZ2VTZXQ6IGZhbHNlLFxuICAgICAgY3VycmVudFBvaW50ZXJDb29yZDogbnVsbCxcbiAgICAgIGN1cnJlbnRJc0luaXRpYWw6IGZhbHNlLFxuICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICByZWFsV2lkdGg6IDAsIC8vIG9ubHkgZm9yIHdoZW4gYXV0b1NpemluZyBpcyBvblxuICAgICAgcmVhbEhlaWdodDogMCwgLy8gb25seSBmb3Igd2hlbiBhdXRvU2l6aW5nIGlzIG9uXG4gICAgICBjaG9zZW5GaWxlOiBudWxsLFxuICAgICAgdXNlQXV0b1NpemluZzogZmFsc2UsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgb3V0cHV0V2lkdGggKCkge1xuICAgICAgY29uc3QgdyA9IHRoaXMudXNlQXV0b1NpemluZyA/IHRoaXMucmVhbFdpZHRoIDogdGhpcy53aWR0aFxuICAgICAgcmV0dXJuIHcgKiB0aGlzLnF1YWxpdHlcbiAgICB9LFxuXG4gICAgb3V0cHV0SGVpZ2h0ICgpIHtcbiAgICAgIGNvbnN0IGggPSB0aGlzLnVzZUF1dG9TaXppbmcgPyB0aGlzLnJlYWxIZWlnaHQgOiB0aGlzLmhlaWdodFxuICAgICAgcmV0dXJuIGggKiB0aGlzLnF1YWxpdHlcbiAgICB9LFxuXG4gICAgY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyRm9udFNpemUgKiB0aGlzLnF1YWxpdHlcbiAgICB9LFxuXG4gICAgYXNwZWN0UmF0aW8gKCkge1xuICAgICAgcmV0dXJuIHRoaXMubmF0dXJhbFdpZHRoIC8gdGhpcy5uYXR1cmFsSGVpZ2h0XG4gICAgfSxcblxuICAgIGxvYWRpbmdTdHlsZSAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogdGhpcy5sb2FkaW5nU2l6ZSArICdweCcsXG4gICAgICAgIGhlaWdodDogdGhpcy5sb2FkaW5nU2l6ZSArICdweCcsXG4gICAgICAgIHJpZ2h0OiAnMTVweCcsXG4gICAgICAgIGJvdHRvbTogJzEwcHgnXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICB0aGlzLl9pbml0aWFsaXplKClcbiAgICB1LnJBRlBvbHlmaWxsKClcbiAgICB1LnRvQmxvYlBvbHlmaWxsKClcblxuICAgIGxldCBzdXBwb3J0cyA9IHRoaXMuc3VwcG9ydERldGVjdGlvbigpXG4gICAgaWYgKCFzdXBwb3J0cy5iYXNpYykge1xuICAgICAgY29uc29sZS53YXJuKCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB2dWUtY3JvcHBhIGZ1bmN0aW9uYWxpdHkuJylcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXNzaXZlKSB7XG4gICAgICB0aGlzLiR3YXRjaCgndmFsdWUuX2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICBsZXQgc2V0ID0gZmFsc2VcbiAgICAgICAgaWYgKCFkYXRhKSByZXR1cm5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcbiAgICAgICAgICBpZiAoc3luY0RhdGEuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgICAgIGxldCB2YWwgPSBkYXRhW2tleV1cbiAgICAgICAgICAgIGlmICh2YWwgIT09IHRoaXNba2V5XSkge1xuICAgICAgICAgICAgICB0aGlzLiRzZXQodGhpcywga2V5LCB2YWwpXG4gICAgICAgICAgICAgIHNldCA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNldCkge1xuICAgICAgICAgIGlmICghdGhpcy5pbWcpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgICAgZGVlcDogdHJ1ZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMudXNlQXV0b1NpemluZyA9ICEhKHRoaXMuYXV0b1NpemluZyAmJiB0aGlzLiRyZWZzLndyYXBwZXIgJiYgZ2V0Q29tcHV0ZWRTdHlsZSlcbiAgICBpZiAodGhpcy51c2VBdXRvU2l6aW5nKSB7XG4gICAgICB0aGlzLl9hdXRvU2l6aW5nSW5pdCgpXG4gICAgfVxuICB9LFxuXG4gIGJlZm9yZURlc3Ryb3kgKCkge1xuICAgIGlmICh0aGlzLnVzZUF1dG9TaXppbmcpIHtcbiAgICAgIHRoaXMuX2F1dG9TaXppbmdSZW1vdmUoKVxuICAgIH1cbiAgfSxcblxuICB3YXRjaDoge1xuICAgIG91dHB1dFdpZHRoOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLm9uRGltZW5zaW9uQ2hhbmdlKClcbiAgICB9LFxuICAgIG91dHB1dEhlaWdodDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5vbkRpbWVuc2lvbkNoYW5nZSgpXG4gICAgfSxcbiAgICBjYW52YXNDb2xvcjogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmltZykge1xuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZHJhdygpXG4gICAgICB9XG4gICAgfSxcbiAgICBpbWFnZUJvcmRlclJhZGl1czogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuaW1nKSB7XG4gICAgICAgIHRoaXMuX2RyYXcoKVxuICAgICAgfVxuICAgIH0sXG4gICAgcGxhY2Vob2xkZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5pbWcpIHtcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcbiAgICAgIH1cbiAgICB9LFxuICAgIHBsYWNlaG9sZGVyQ29sb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5pbWcpIHtcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmltZykge1xuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxuICAgICAgfVxuICAgIH0sXG4gICAgcHJldmVudFdoaXRlU3BhY2UgKHZhbCkge1xuICAgICAgaWYgKHZhbCkge1xuICAgICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoKVxuICAgIH0sXG4gICAgc2NhbGVSYXRpbyAodmFsLCBvbGRWYWwpIHtcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXG4gICAgICBpZiAoIXUubnVtYmVyVmFsaWQodmFsKSkgcmV0dXJuXG5cbiAgICAgIHZhciB4ID0gMVxuICAgICAgaWYgKHUubnVtYmVyVmFsaWQob2xkVmFsKSAmJiBvbGRWYWwgIT09IDApIHtcbiAgICAgICAgeCA9IHZhbCAvIG9sZFZhbFxuICAgICAgfVxuICAgICAgdmFyIHBvcyA9IHRoaXMuY3VycmVudFBvaW50ZXJDb29yZCB8fCB7XG4gICAgICAgIHg6IHRoaXMuaW1nRGF0YS5zdGFydFggKyB0aGlzLmltZ0RhdGEud2lkdGggLyAyLFxuICAgICAgICB5OiB0aGlzLmltZ0RhdGEuc3RhcnRZICsgdGhpcy5pbWdEYXRhLmhlaWdodCAvIDJcbiAgICAgIH1cbiAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoICogdmFsXG4gICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0ICogdmFsXG5cbiAgICAgIGlmICghdGhpcy51c2VyTWV0YWRhdGEgJiYgdGhpcy5pbWFnZVNldCAmJiAhdGhpcy5yb3RhdGluZykge1xuICAgICAgICBsZXQgb2Zmc2V0WCA9ICh4IC0gMSkgKiAocG9zLnggLSB0aGlzLmltZ0RhdGEuc3RhcnRYKVxuICAgICAgICBsZXQgb2Zmc2V0WSA9ICh4IC0gMSkgKiAocG9zLnkgLSB0aGlzLmltZ0RhdGEuc3RhcnRZKVxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gdGhpcy5pbWdEYXRhLnN0YXJ0WCAtIG9mZnNldFhcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHRoaXMuaW1nRGF0YS5zdGFydFkgLSBvZmZzZXRZXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XG4gICAgICAgIHRoaXMuX3ByZXZlbnRab29taW5nVG9XaGl0ZVNwYWNlKClcbiAgICAgICAgdGhpcy5fcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXG4gICAgICB9XG4gICAgfSxcbiAgICAnaW1nRGF0YS53aWR0aCc6IGZ1bmN0aW9uICh2YWwsIG9sZFZhbCkge1xuICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAoIXUubnVtYmVyVmFsaWQodmFsKSkgcmV0dXJuXG4gICAgICB0aGlzLnNjYWxlUmF0aW8gPSB2YWwgLyB0aGlzLm5hdHVyYWxXaWR0aFxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSkge1xuICAgICAgICBpZiAoTWF0aC5hYnModmFsIC0gb2xkVmFsKSA+ICh2YWwgKiAoMSAvIDEwMDAwMCkpKSB7XG4gICAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLlpPT01fRVZFTlQpXG4gICAgICAgICAgdGhpcy5fZHJhdygpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgICdpbWdEYXRhLmhlaWdodCc6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIC8vIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgaWYgKCF1Lm51bWJlclZhbGlkKHZhbCkpIHJldHVyblxuICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdmFsIC8gdGhpcy5uYXR1cmFsSGVpZ2h0XG4gICAgfSxcbiAgICAnaW1nRGF0YS5zdGFydFgnOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkpIHtcbiAgICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5fZHJhdylcbiAgICAgIH1cbiAgICB9LFxuICAgICdpbWdEYXRhLnN0YXJ0WSc6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIC8vIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSkge1xuICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLl9kcmF3KVxuICAgICAgfVxuICAgIH0sXG4gICAgbG9hZGluZyAodmFsKSB7XG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLkxPQURJTkdfU1RBUlRfRVZFTlQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuTE9BRElOR19FTkRfRVZFTlQpXG4gICAgICB9XG4gICAgfSxcbiAgICBhdXRvU2l6aW5nICh2YWwpIHtcbiAgICAgIHRoaXMudXNlQXV0b1NpemluZyA9ICEhKHRoaXMuYXV0b1NpemluZyAmJiB0aGlzLiRyZWZzLndyYXBwZXIgJiYgZ2V0Q29tcHV0ZWRTdHlsZSlcbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgdGhpcy5fYXV0b1NpemluZ0luaXQoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fYXV0b1NpemluZ1JlbW92ZSgpXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBlbWl0RXZlbnQgKC4uLmFyZ3MpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3NbMF0pXG4gICAgICB0aGlzLiRlbWl0KC4uLmFyZ3MpO1xuICAgIH0sXG5cbiAgICBnZXRDYW52YXMgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FudmFzXG4gICAgfSxcblxuICAgIGdldENvbnRleHQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY3R4XG4gICAgfSxcblxuICAgIGdldENob3NlbkZpbGUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hvc2VuRmlsZSB8fCB0aGlzLiRyZWZzLmZpbGVJbnB1dC5maWxlc1swXVxuICAgIH0sXG5cbiAgICBtb3ZlIChvZmZzZXQpIHtcbiAgICAgIGlmICghb2Zmc2V0IHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBsZXQgb2xkWCA9IHRoaXMuaW1nRGF0YS5zdGFydFhcbiAgICAgIGxldCBvbGRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WVxuICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCArPSBvZmZzZXQueFxuICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSArPSBvZmZzZXQueVxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy5fcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCAhPT0gb2xkWCB8fCB0aGlzLmltZ0RhdGEuc3RhcnRZICE9PSBvbGRZKSB7XG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5NT1ZFX0VWRU5UKVxuICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbW92ZVVwd2FyZHMgKGFtb3VudCA9IDEpIHtcbiAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcbiAgICB9LFxuXG4gICAgbW92ZURvd253YXJkcyAoYW1vdW50ID0gMSkge1xuICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogYW1vdW50IH0pXG4gICAgfSxcblxuICAgIG1vdmVMZWZ0d2FyZHMgKGFtb3VudCA9IDEpIHtcbiAgICAgIHRoaXMubW92ZSh7IHg6IC1hbW91bnQsIHk6IDAgfSlcbiAgICB9LFxuXG4gICAgbW92ZVJpZ2h0d2FyZHMgKGFtb3VudCA9IDEpIHtcbiAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxuICAgIH0sXG5cbiAgICB6b29tICh6b29tSW4gPSB0cnVlLCBhY2NlbGVyYXRpb24gPSAxKSB7XG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGxldCByZWFsU3BlZWQgPSB0aGlzLnpvb21TcGVlZCAqIGFjY2VsZXJhdGlvblxuICAgICAgbGV0IHNwZWVkID0gKHRoaXMub3V0cHV0V2lkdGggKiBQQ1RfUEVSX1pPT00pICogcmVhbFNwZWVkXG4gICAgICBsZXQgeCA9IDFcbiAgICAgIGlmICh6b29tSW4pIHtcbiAgICAgICAgeCA9IDEgKyBzcGVlZFxuICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPiBNSU5fV0lEVEgpIHtcbiAgICAgICAgeCA9IDEgLSBzcGVlZFxuICAgICAgfVxuXG4gICAgICB0aGlzLnNjYWxlUmF0aW8gKj0geFxuICAgIH0sXG5cbiAgICB6b29tSW4gKCkge1xuICAgICAgdGhpcy56b29tKHRydWUpXG4gICAgfSxcblxuICAgIHpvb21PdXQgKCkge1xuICAgICAgdGhpcy56b29tKGZhbHNlKVxuICAgIH0sXG5cbiAgICByb3RhdGUgKHN0ZXAgPSAxKSB7XG4gICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgc3RlcCA9IHBhcnNlSW50KHN0ZXApXG4gICAgICBpZiAoaXNOYU4oc3RlcCkgfHwgc3RlcCA+IDMgfHwgc3RlcCA8IC0zKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignSW52YWxpZCBhcmd1bWVudCBmb3Igcm90YXRlKCkgbWV0aG9kLiBJdCBzaG91bGQgb25lIG9mIHRoZSBpbnRlZ2VycyBmcm9tIC0zIHRvIDMuJylcbiAgICAgICAgc3RlcCA9IDFcbiAgICAgIH1cbiAgICAgIHRoaXMuX3JvdGF0ZUJ5U3RlcChzdGVwKVxuICAgIH0sXG5cbiAgICBmbGlwWCAoKSB7XG4gICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24oMilcbiAgICB9LFxuXG4gICAgZmxpcFkgKCkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKDQpXG4gICAgfSxcblxuICAgIHJlZnJlc2ggKCkge1xuICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5faW5pdGlhbGl6ZSlcbiAgICB9LFxuXG4gICAgaGFzSW1hZ2UgKCkge1xuICAgICAgcmV0dXJuICEhdGhpcy5pbWFnZVNldFxuICAgIH0sXG5cbiAgICBhcHBseU1ldGFkYXRhIChtZXRhZGF0YSkge1xuICAgICAgaWYgKCFtZXRhZGF0YSB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBtZXRhZGF0YVxuICAgICAgdmFyIG9yaSA9IG1ldGFkYXRhLm9yaWVudGF0aW9uIHx8IHRoaXMub3JpZW50YXRpb24gfHwgMVxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24ob3JpLCB0cnVlKVxuICAgIH0sXG4gICAgZ2VuZXJhdGVEYXRhVXJsICh0eXBlLCBjb21wcmVzc2lvblJhdGUpIHtcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpKSByZXR1cm4gJydcbiAgICAgIHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwodHlwZSwgY29tcHJlc3Npb25SYXRlKVxuICAgIH0sXG5cbiAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkge1xuICAgICAgICBjYWxsYmFjayhudWxsKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuY2FudmFzLnRvQmxvYihjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudClcbiAgICB9LFxuXG4gICAgcHJvbWlzZWRCbG9iICguLi5hcmdzKSB7XG4gICAgICBpZiAodHlwZW9mIFByb21pc2UgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdObyBQcm9taXNlIHN1cHBvcnQuIFBsZWFzZSBhZGQgUHJvbWlzZSBwb2x5ZmlsbCBpZiB5b3Ugd2FudCB0byB1c2UgdGhpcyBtZXRob2QuJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuZ2VuZXJhdGVCbG9iKChibG9iKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKGJsb2IpXG4gICAgICAgICAgfSwgLi4uYXJncylcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgZ2V0TWV0YWRhdGEgKCkge1xuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHJldHVybiB7fVxuICAgICAgbGV0IHsgc3RhcnRYLCBzdGFydFkgfSA9IHRoaXMuaW1nRGF0YVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGFydFgsXG4gICAgICAgIHN0YXJ0WSxcbiAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGVSYXRpbyxcbiAgICAgICAgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb25cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3VwcG9ydERldGVjdGlvbiAoKSB7XG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHJldHVyblxuICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICByZXR1cm4ge1xuICAgICAgICAnYmFzaWMnOiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICYmIHdpbmRvdy5GaWxlICYmIHdpbmRvdy5GaWxlUmVhZGVyICYmIHdpbmRvdy5GaWxlTGlzdCAmJiB3aW5kb3cuQmxvYixcbiAgICAgICAgJ2RuZCc6ICdvbmRyYWdzdGFydCcgaW4gZGl2ICYmICdvbmRyb3AnIGluIGRpdlxuICAgICAgfVxuICAgIH0sXG5cbiAgICBjaG9vc2VGaWxlICgpIHtcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQuY2xpY2soKVxuICAgIH0sXG5cbiAgICByZW1vdmUgKCkge1xuICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSByZXR1cm5cbiAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG5cbiAgICAgIGxldCBoYWRJbWFnZSA9IHRoaXMuaW1nICE9IG51bGxcbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IG51bGxcbiAgICAgIHRoaXMuaW1nID0gbnVsbFxuICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQudmFsdWUgPSAnJ1xuICAgICAgdGhpcy5pbWdEYXRhID0ge1xuICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICBzdGFydFg6IDAsXG4gICAgICAgIHN0YXJ0WTogMFxuICAgICAgfVxuICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IDFcbiAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IG51bGxcbiAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbnVsbFxuICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXG4gICAgICB0aGlzLmNob3NlbkZpbGUgPSBudWxsXG4gICAgICBpZiAodGhpcy52aWRlbykge1xuICAgICAgICB0aGlzLnZpZGVvLnBhdXNlKClcbiAgICAgICAgdGhpcy52aWRlbyA9IG51bGxcbiAgICAgIH1cblxuICAgICAgaWYgKGhhZEltYWdlKSB7XG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTUFHRV9SRU1PVkVfRVZFTlQpXG4gICAgICB9XG4gICAgfSxcblxuICAgIGFkZENsaXBQbHVnaW4gKHBsdWdpbikge1xuICAgICAgaWYgKCF0aGlzLmNsaXBQbHVnaW5zKSB7XG4gICAgICAgIHRoaXMuY2xpcFBsdWdpbnMgPSBbXVxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBwbHVnaW4gPT09ICdmdW5jdGlvbicgJiYgdGhpcy5jbGlwUGx1Z2lucy5pbmRleE9mKHBsdWdpbikgPCAwKSB7XG4gICAgICAgIHRoaXMuY2xpcFBsdWdpbnMucHVzaChwbHVnaW4pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBFcnJvcignQ2xpcCBwbHVnaW5zIHNob3VsZCBiZSBmdW5jdGlvbnMnKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBlbWl0TmF0aXZlRXZlbnQgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0RXZlbnQoZXZ0LnR5cGUsIGV2dCk7XG4gICAgfSxcblxuICAgIHNldEZpbGUgKGZpbGUpIHtcbiAgICAgIHRoaXMuX29uTmV3RmlsZUluKGZpbGUpXG4gICAgfSxcblxuICAgIF9zZXRDb250YWluZXJTaXplICgpIHtcbiAgICAgIGlmICh0aGlzLnVzZUF1dG9TaXppbmcpIHtcbiAgICAgICAgdGhpcy5yZWFsV2lkdGggPSArZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLiRyZWZzLndyYXBwZXIpLndpZHRoLnNsaWNlKDAsIC0yKVxuICAgICAgICB0aGlzLnJlYWxIZWlnaHQgPSArZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLiRyZWZzLndyYXBwZXIpLmhlaWdodC5zbGljZSgwLCAtMilcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2F1dG9TaXppbmdJbml0ICgpIHtcbiAgICAgIHRoaXMuX3NldENvbnRhaW5lclNpemUoKVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3NldENvbnRhaW5lclNpemUpXG4gICAgfSxcblxuICAgIF9hdXRvU2l6aW5nUmVtb3ZlICgpIHtcbiAgICAgIHRoaXMuX3NldENvbnRhaW5lclNpemUoKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3NldENvbnRhaW5lclNpemUpXG4gICAgfSxcblxuICAgIF9pbml0aWFsaXplICgpIHtcbiAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kcmVmcy5jYW52YXNcbiAgICAgIHRoaXMuX3NldFNpemUoKVxuICAgICAgdGhpcy5jYW52YXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICd0cmFuc3BhcmVudCcgOiAodHlwZW9mIHRoaXMuY2FudmFzQ29sb3IgPT09ICdzdHJpbmcnID8gdGhpcy5jYW52YXNDb2xvciA6ICcnKVxuICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICAgICB0aGlzLmN0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xuICAgICAgdGhpcy5jdHguaW1hZ2VTbW9vdGhpbmdRdWFsaXR5ID0gXCJoaWdoXCI7XG4gICAgICB0aGlzLmN0eC53ZWJraXRJbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xuICAgICAgdGhpcy5jdHgubXNJbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xuICAgICAgdGhpcy5jdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IG51bGxcbiAgICAgIHRoaXMuaW1nID0gbnVsbFxuICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQudmFsdWUgPSAnJ1xuICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXG4gICAgICB0aGlzLmNob3NlbkZpbGUgPSBudWxsXG4gICAgICB0aGlzLl9zZXRJbml0aWFsKClcbiAgICAgIGlmICghdGhpcy5wYXNzaXZlKSB7XG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTklUX0VWRU5ULCB0aGlzKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2V0U2l6ZSAoKSB7XG4gICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMub3V0cHV0V2lkdGhcbiAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XG4gICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9ICh0aGlzLnVzZUF1dG9TaXppbmcgPyB0aGlzLnJlYWxXaWR0aCA6IHRoaXMud2lkdGgpICsgJ3B4J1xuICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gKHRoaXMudXNlQXV0b1NpemluZyA/IHRoaXMucmVhbEhlaWdodCA6IHRoaXMuaGVpZ2h0KSArICdweCdcbiAgICB9LFxuXG4gICAgX3JvdGF0ZUJ5U3RlcCAoc3RlcCkge1xuICAgICAgbGV0IG9yaWVudGF0aW9uID0gMVxuICAgICAgc3dpdGNoIChzdGVwKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDZcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgb3JpZW50YXRpb24gPSAzXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIG9yaWVudGF0aW9uID0gOFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgLTE6XG4gICAgICAgICAgb3JpZW50YXRpb24gPSA4XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAtMjpcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDNcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIC0zOlxuICAgICAgICAgIG9yaWVudGF0aW9uID0gNlxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbihvcmllbnRhdGlvbilcbiAgICB9LFxuXG4gICAgX3NldEltYWdlUGxhY2Vob2xkZXIgKCkge1xuICAgICAgbGV0IGltZ1xuICAgICAgaWYgKHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyICYmIHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyWzBdKSB7XG4gICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyWzBdXG4gICAgICAgIGxldCB7IHRhZywgZWxtIH0gPSB2Tm9kZVxuICAgICAgICBpZiAodGFnID09ICdpbWcnICYmIGVsbSkge1xuICAgICAgICAgIGltZyA9IGVsbVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghaW1nKSByZXR1cm5cblxuICAgICAgdmFyIG9uTG9hZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGltZywgMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXG4gICAgICB9XG5cbiAgICAgIGlmICh1LmltYWdlTG9hZGVkKGltZykpIHtcbiAgICAgICAgb25Mb2FkKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGltZy5vbmxvYWQgPSBvbkxvYWRcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldFRleHRQbGFjZWhvbGRlciAoKSB7XG4gICAgICB2YXIgY3R4ID0gdGhpcy5jdHhcbiAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJ1xuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXG4gICAgICBsZXQgZGVmYXVsdEZvbnRTaXplID0gdGhpcy5vdXRwdXRXaWR0aCAqIERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcbiAgICAgIGxldCBmb250U2l6ZSA9ICghdGhpcy5jb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemUgfHwgdGhpcy5jb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemUgPT0gMCkgPyBkZWZhdWx0Rm9udFNpemUgOiB0aGlzLmNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZVxuICAgICAgY3R4LmZvbnQgPSBmb250U2l6ZSArICdweCBzYW5zLXNlcmlmJ1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXG4gICAgICBjdHguZmlsbFRleHQodGhpcy5wbGFjZWhvbGRlciwgdGhpcy5vdXRwdXRXaWR0aCAvIDIsIHRoaXMub3V0cHV0SGVpZ2h0IC8gMilcbiAgICB9LFxuXG4gICAgX3NldFBsYWNlaG9sZGVycyAoKSB7XG4gICAgICB0aGlzLl9wYWludEJhY2tncm91bmQoKVxuICAgICAgdGhpcy5fc2V0SW1hZ2VQbGFjZWhvbGRlcigpXG4gICAgICB0aGlzLl9zZXRUZXh0UGxhY2Vob2xkZXIoKVxuICAgIH0sXG5cbiAgICBfc2V0SW5pdGlhbCAoKSB7XG4gICAgICBsZXQgc3JjLCBpbWdcbiAgICAgIGlmICh0aGlzLiRzbG90cy5pbml0aWFsICYmIHRoaXMuJHNsb3RzLmluaXRpYWxbMF0pIHtcbiAgICAgICAgbGV0IHZOb2RlID0gdGhpcy4kc2xvdHMuaW5pdGlhbFswXVxuICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcbiAgICAgICAgaWYgKHRhZyA9PSAnaW1nJyAmJiBlbG0pIHtcbiAgICAgICAgICBpbWcgPSBlbG1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaW5pdGlhbEltYWdlICYmIHR5cGVvZiB0aGlzLmluaXRpYWxJbWFnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgc3JjID0gdGhpcy5pbml0aWFsSW1hZ2VcbiAgICAgICAgaW1nID0gbmV3IEltYWdlKClcbiAgICAgICAgaWYgKCEvXmRhdGE6Ly50ZXN0KHNyYykgJiYgIS9eYmxvYjovLnRlc3Qoc3JjKSkge1xuICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2Nyb3NzT3JpZ2luJywgJ2Fub255bW91cycpXG4gICAgICAgIH1cbiAgICAgICAgaW1nLnNyYyA9IHNyY1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5pbml0aWFsSW1hZ2UgPT09ICdvYmplY3QnICYmIHRoaXMuaW5pdGlhbEltYWdlIGluc3RhbmNlb2YgSW1hZ2UpIHtcbiAgICAgICAgaW1nID0gdGhpcy5pbml0aWFsSW1hZ2VcbiAgICAgIH1cbiAgICAgIGlmICghc3JjICYmICFpbWcpIHtcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRJc0luaXRpYWwgPSB0cnVlXG4gICAgICBpZiAodS5pbWFnZUxvYWRlZChpbWcpKSB7XG4gICAgICAgIC8vIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcbiAgICAgICAgdGhpcy5fb25sb2FkKGltZywgK2ltZy5kYXRhc2V0WydleGlmT3JpZW50YXRpb24nXSwgdHJ1ZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWVcbiAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAvLyB0aGlzLmVtaXRFdmVudChldmVudHMuSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQpXG4gICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgK2ltZy5kYXRhc2V0WydleGlmT3JpZW50YXRpb24nXSwgdHJ1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGltZy5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX29ubG9hZCAoaW1nLCBvcmllbnRhdGlvbiA9IDEsIGluaXRpYWwpIHtcbiAgICAgIGlmICh0aGlzLmltYWdlU2V0KSB7XG4gICAgICAgIHRoaXMucmVtb3ZlKClcbiAgICAgIH1cbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IGltZ1xuICAgICAgdGhpcy5pbWcgPSBpbWdcblxuICAgICAgaWYgKGlzTmFOKG9yaWVudGF0aW9uKSkge1xuICAgICAgICBvcmllbnRhdGlvbiA9IDFcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24ob3JpZW50YXRpb24pXG5cbiAgICAgIGlmIChpbml0aWFsKSB7XG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uVmlkZW9Mb2FkICh2aWRlbywgaW5pdGlhbCkge1xuICAgICAgdGhpcy52aWRlbyA9IHZpZGVvXG4gICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxuICAgICAgY29uc3QgeyB2aWRlb1dpZHRoLCB2aWRlb0hlaWdodCB9ID0gdmlkZW9cbiAgICAgIGNhbnZhcy53aWR0aCA9IHZpZGVvV2lkdGhcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSB2aWRlb0hlaWdodFxuICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXG4gICAgICBjb25zdCBkcmF3RnJhbWUgPSAoaW5pdGlhbCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMudmlkZW8pIHJldHVyblxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMudmlkZW8sIDAsIDAsIHZpZGVvV2lkdGgsIHZpZGVvSGVpZ2h0KVxuICAgICAgICBjb25zdCBmcmFtZSA9IG5ldyBJbWFnZSgpXG4gICAgICAgIGZyYW1lLnNyYyA9IGNhbnZhcy50b0RhdGFVUkwoKVxuICAgICAgICBmcmFtZS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5pbWcgPSBmcmFtZVxuICAgICAgICAgIC8vIHRoaXMuX3BsYWNlSW1hZ2UoKVxuICAgICAgICAgIGlmIChpbml0aWFsKSB7XG4gICAgICAgICAgICB0aGlzLl9wbGFjZUltYWdlKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZHJhdygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkcmF3RnJhbWUodHJ1ZSlcbiAgICAgIGNvbnN0IGtlZXBEcmF3aW5nID0gKCkgPT4ge1xuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgZHJhd0ZyYW1lKClcbiAgICAgICAgICBpZiAoIXRoaXMudmlkZW8gfHwgdGhpcy52aWRlby5lbmRlZCB8fCB0aGlzLnZpZGVvLnBhdXNlZCkgcmV0dXJuXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGtlZXBEcmF3aW5nKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKCdwbGF5JywgKCkgPT4ge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoa2VlcERyYXdpbmcpXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfaGFuZGxlQ2xpY2sgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UgJiYgIXRoaXMuZGlzYWJsZWQgJiYgIXRoaXMuc3VwcG9ydFRvdWNoICYmICF0aGlzLnBhc3NpdmUpIHtcbiAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hhbmRsZURibENsaWNrIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnZpZGVvRW5hYmxlZCAmJiB0aGlzLnZpZGVvKSB7XG4gICAgICAgIGlmICh0aGlzLnZpZGVvLnBhdXNlZCB8fCB0aGlzLnZpZGVvLmVuZGVkKSB7XG4gICAgICAgICAgdGhpcy52aWRlby5wbGF5KClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnZpZGVvLnBhdXNlKClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hhbmRsZUlucHV0Q2hhbmdlICgpIHtcbiAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMuZmlsZUlucHV0XG4gICAgICBpZiAoIWlucHV0LmZpbGVzLmxlbmd0aCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxuXG4gICAgICBsZXQgZmlsZSA9IGlucHV0LmZpbGVzWzBdXG4gICAgICB0aGlzLl9vbk5ld0ZpbGVJbihmaWxlKVxuICAgIH0sXG5cbiAgICBfb25OZXdGaWxlSW4gKGZpbGUpIHtcbiAgICAgIHRoaXMuY3VycmVudElzSW5pdGlhbCA9IGZhbHNlXG4gICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlXG4gICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuRklMRV9DSE9PU0VfRVZFTlQsIGZpbGUpXG4gICAgICB0aGlzLmNob3NlbkZpbGUgPSBmaWxlO1xuICAgICAgaWYgKCF0aGlzLl9maWxlU2l6ZUlzVmFsaWQoZmlsZSkpIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLkZJTEVfU0laRV9FWENFRURfRVZFTlQsIGZpbGUpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9maWxlVHlwZUlzVmFsaWQoZmlsZSkpIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLkZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVCwgZmlsZSlcbiAgICAgICAgbGV0IHR5cGUgPSBmaWxlLnR5cGUgfHwgZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuRmlsZVJlYWRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbGV0IGZyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgICAgICBmci5vbmxvYWQgPSAoZSkgPT4ge1xuICAgICAgICAgIGxldCBmaWxlRGF0YSA9IGUudGFyZ2V0LnJlc3VsdFxuICAgICAgICAgIGNvbnN0IGJhc2U2NCA9IHUucGFyc2VEYXRhVXJsKGZpbGVEYXRhKVxuICAgICAgICAgIGNvbnN0IGlzVmlkZW8gPSAvXnZpZGVvLy50ZXN0KGZpbGUudHlwZSlcbiAgICAgICAgICBpZiAoaXNWaWRlbykge1xuICAgICAgICAgICAgbGV0IHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKVxuICAgICAgICAgICAgdmlkZW8uc3JjID0gZmlsZURhdGFcbiAgICAgICAgICAgIGZpbGVEYXRhID0gbnVsbDtcbiAgICAgICAgICAgIGlmICh2aWRlby5yZWFkeVN0YXRlID49IHZpZGVvLkhBVkVfRlVUVVJFX0RBVEEpIHtcbiAgICAgICAgICAgICAgdGhpcy5fb25WaWRlb0xvYWQodmlkZW8pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjYW4gcGxheSBldmVudCcpXG4gICAgICAgICAgICAgICAgdGhpcy5fb25WaWRlb0xvYWQodmlkZW8pXG4gICAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG9yaWVudGF0aW9uID0gMVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgb3JpZW50YXRpb24gPSB1LmdldEZpbGVPcmllbnRhdGlvbih1LmJhc2U2NFRvQXJyYXlCdWZmZXIoYmFzZTY0KSlcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikgeyB9XG4gICAgICAgICAgICBpZiAob3JpZW50YXRpb24gPCAxKSBvcmllbnRhdGlvbiA9IDFcbiAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKVxuICAgICAgICAgICAgaW1nLnNyYyA9IGZpbGVEYXRhXG4gICAgICAgICAgICBmaWxlRGF0YSA9IG51bGw7XG4gICAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCBvcmllbnRhdGlvbilcbiAgICAgICAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLk5FV19JTUFHRV9FVkVOVClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnIucmVhZEFzRGF0YVVSTChmaWxlKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfZmlsZVNpemVJc1ZhbGlkIChmaWxlKSB7XG4gICAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZVxuICAgICAgaWYgKCF0aGlzLmZpbGVTaXplTGltaXQgfHwgdGhpcy5maWxlU2l6ZUxpbWl0ID09IDApIHJldHVybiB0cnVlXG5cbiAgICAgIHJldHVybiBmaWxlLnNpemUgPCB0aGlzLmZpbGVTaXplTGltaXRcbiAgICB9LFxuXG4gICAgX2ZpbGVUeXBlSXNWYWxpZCAoZmlsZSkge1xuICAgICAgY29uc3QgYWNjZXB0YWJsZU1pbWVUeXBlID0gKHRoaXMudmlkZW9FbmFibGVkICYmIC9edmlkZW8vLnRlc3QoZmlsZS50eXBlKSAmJiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpLmNhblBsYXlUeXBlKGZpbGUudHlwZSkpIHx8IC9eaW1hZ2UvLnRlc3QoZmlsZS50eXBlKVxuICAgICAgaWYgKCFhY2NlcHRhYmxlTWltZVR5cGUpIHJldHVybiBmYWxzZVxuICAgICAgaWYgKCF0aGlzLmFjY2VwdCkgcmV0dXJuIHRydWVcbiAgICAgIGxldCBhY2NlcHQgPSB0aGlzLmFjY2VwdFxuICAgICAgbGV0IGJhc2VNaW1ldHlwZSA9IGFjY2VwdC5yZXBsYWNlKC9cXC8uKiQvLCAnJylcbiAgICAgIGxldCB0eXBlcyA9IGFjY2VwdC5zcGxpdCgnLCcpXG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdHlwZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbGV0IHR5cGUgPSB0eXBlc1tpXVxuICAgICAgICBsZXQgdCA9IHR5cGUudHJpbSgpXG4gICAgICAgIGlmICh0LmNoYXJBdCgwKSA9PSAnLicpIHtcbiAgICAgICAgICBpZiAoZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKSA9PT0gdC50b0xvd2VyQ2FzZSgpLnNsaWNlKDEpKSByZXR1cm4gdHJ1ZVxuICAgICAgICB9IGVsc2UgaWYgKC9cXC9cXCokLy50ZXN0KHQpKSB7XG4gICAgICAgICAgdmFyIGZpbGVCYXNlVHlwZSA9IGZpbGUudHlwZS5yZXBsYWNlKC9cXC8uKiQvLCAnJylcbiAgICAgICAgICBpZiAoZmlsZUJhc2VUeXBlID09PSBiYXNlTWltZXR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZpbGUudHlwZSA9PT0gdHlwZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSxcblxuICAgIF9wbGFjZUltYWdlIChhcHBseU1ldGFkYXRhKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cbiAgICAgIHZhciBpbWdEYXRhID0gdGhpcy5pbWdEYXRhXG5cbiAgICAgIHRoaXMubmF0dXJhbFdpZHRoID0gdGhpcy5pbWcubmF0dXJhbFdpZHRoXG4gICAgICB0aGlzLm5hdHVyYWxIZWlnaHQgPSB0aGlzLmltZy5uYXR1cmFsSGVpZ2h0XG5cbiAgICAgIGltZ0RhdGEuc3RhcnRYID0gdS5udW1iZXJWYWxpZChpbWdEYXRhLnN0YXJ0WCkgPyBpbWdEYXRhLnN0YXJ0WCA6IDBcbiAgICAgIGltZ0RhdGEuc3RhcnRZID0gdS5udW1iZXJWYWxpZChpbWdEYXRhLnN0YXJ0WSkgPyBpbWdEYXRhLnN0YXJ0WSA6IDBcblxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy5fYXNwZWN0RmlsbCgpXG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLmltYWdlU2V0KSB7XG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxTaXplID09ICdjb250YWluJykge1xuICAgICAgICAgIHRoaXMuX2FzcGVjdEZpdCgpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbml0aWFsU2l6ZSA9PSAnbmF0dXJhbCcpIHtcbiAgICAgICAgICB0aGlzLl9uYXR1cmFsU2l6ZSgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fYXNwZWN0RmlsbCgpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoICogdGhpcy5zY2FsZVJhdGlvXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHQgKiB0aGlzLnNjYWxlUmF0aW9cbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSB7XG4gICAgICAgIGlmICgvdG9wLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xuICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0gMFxuICAgICAgICB9IGVsc2UgaWYgKC9ib3R0b20vLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XG4gICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSB0aGlzLm91dHB1dEhlaWdodCAtIGltZ0RhdGEuaGVpZ2h0XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoL2xlZnQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XG4gICAgICAgICAgaW1nRGF0YS5zdGFydFggPSAwXG4gICAgICAgIH0gZWxzZSBpZiAoL3JpZ2h0Ly50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xuICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0gdGhpcy5vdXRwdXRXaWR0aCAtIGltZ0RhdGEud2lkdGhcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IC9eKC0/XFxkKyklICgtP1xcZCspJSQvLmV4ZWModGhpcy5pbml0aWFsUG9zaXRpb24pXG4gICAgICAgICAgdmFyIHggPSArcmVzdWx0WzFdIC8gMTAwXG4gICAgICAgICAgdmFyIHkgPSArcmVzdWx0WzJdIC8gMTAwXG4gICAgICAgICAgaW1nRGF0YS5zdGFydFggPSB4ICogKHRoaXMub3V0cHV0V2lkdGggLSBpbWdEYXRhLndpZHRoKVxuICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0geSAqICh0aGlzLm91dHB1dEhlaWdodCAtIGltZ0RhdGEuaGVpZ2h0KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGFwcGx5TWV0YWRhdGEgJiYgdGhpcy5fYXBwbHlNZXRhZGF0YSgpXG5cbiAgICAgIGlmIChhcHBseU1ldGFkYXRhICYmIHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy56b29tKGZhbHNlLCAwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogMCB9KVxuICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2FzcGVjdEZpbGwgKCkge1xuICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcbiAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcbiAgICAgIGxldCBjYW52YXNSYXRpbyA9IHRoaXMub3V0cHV0V2lkdGggLyB0aGlzLm91dHB1dEhlaWdodFxuICAgICAgbGV0IHNjYWxlUmF0aW9cblxuICAgICAgaWYgKHRoaXMuYXNwZWN0UmF0aW8gPiBjYW52YXNSYXRpbykge1xuICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHRcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGggLyBzY2FsZVJhdGlvXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm91dHB1dEhlaWdodFxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMub3V0cHV0V2lkdGhcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHNjYWxlUmF0aW9cbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5vdXRwdXRXaWR0aFxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfYXNwZWN0Rml0ICgpIHtcbiAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXG4gICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XG4gICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLm91dHB1dFdpZHRoIC8gdGhpcy5vdXRwdXRIZWlnaHRcbiAgICAgIGxldCBzY2FsZVJhdGlvXG4gICAgICBpZiAodGhpcy5hc3BlY3RSYXRpbyA+IGNhbnZhc1JhdGlvKSB7XG4gICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMub3V0cHV0V2lkdGhcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHNjYWxlUmF0aW9cbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5vdXRwdXRXaWR0aFxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NhbGVSYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMub3V0cHV0SGVpZ2h0XG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gc2NhbGVSYXRpb1xuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5vdXRwdXRIZWlnaHRcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5vdXRwdXRXaWR0aCkgLyAyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9uYXR1cmFsU2l6ZSAoKSB7XG4gICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxuICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxuICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGhcbiAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHRcbiAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxuICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KSAvIDJcbiAgICB9LFxuXG4gICAgX2hhbmRsZVBvaW50ZXJTdGFydCAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMuc3VwcG9ydFRvdWNoID0gdHJ1ZVxuICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSBmYWxzZVxuICAgICAgbGV0IHBvaW50ZXJDb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXG4gICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gcG9pbnRlckNvb3JkXG5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cbiAgICAgIC8vIHNpbXVsYXRlIGNsaWNrIHdpdGggdG91Y2ggb24gbW9iaWxlIGRldmljZXNcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSB7XG4gICAgICAgIHRoaXMudGFiU3RhcnQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIC8vIGlnbm9yZSBtb3VzZSByaWdodCBjbGljayBhbmQgbWlkZGxlIGNsaWNrXG4gICAgICBpZiAoZXZ0LndoaWNoICYmIGV2dC53aGljaCA+IDEpIHJldHVyblxuXG4gICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxuICAgICAgICB0aGlzLnBpbmNoaW5nID0gZmFsc2VcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxuICAgICAgfVxuXG4gICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5waW5jaGluZyA9IHRydWVcbiAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcbiAgICAgIH1cblxuICAgICAgbGV0IGNhbmNlbEV2ZW50cyA9IFsnbW91c2V1cCcsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCcsICdwb2ludGVyZW5kJywgJ3BvaW50ZXJjYW5jZWwnXVxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNhbmNlbEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBsZXQgZSA9IGNhbmNlbEV2ZW50c1tpXVxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGUsIHRoaXMuX2hhbmRsZVBvaW50ZXJFbmQpXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9oYW5kbGVQb2ludGVyRW5kIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgbGV0IHBvaW50ZXJNb3ZlRGlzdGFuY2UgPSAwXG4gICAgICBpZiAodGhpcy5wb2ludGVyU3RhcnRDb29yZCkge1xuICAgICAgICBsZXQgcG9pbnRlckNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcbiAgICAgICAgcG9pbnRlck1vdmVEaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhwb2ludGVyQ29vcmQueCAtIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQueCwgMikgKyBNYXRoLnBvdyhwb2ludGVyQ29vcmQueSAtIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQueSwgMikpIHx8IDBcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSB7XG4gICAgICAgIGxldCB0YWJFbmQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKVxuICAgICAgICBpZiAoKHBvaW50ZXJNb3ZlRGlzdGFuY2UgPCBDTElDS19NT1ZFX1RIUkVTSE9MRCkgJiYgdGFiRW5kIC0gdGhpcy50YWJTdGFydCA8IE1JTl9NU19QRVJfQ0xJQ0sgJiYgdGhpcy5zdXBwb3J0VG91Y2gpIHtcbiAgICAgICAgICB0aGlzLmNob29zZUZpbGUoKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudGFiU3RhcnQgPSAwXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcbiAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxuICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gMFxuICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBudWxsXG4gICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IGZhbHNlXG4gICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gbnVsbFxuICAgIH0sXG5cbiAgICBfaGFuZGxlUG9pbnRlck1vdmUgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IHRydWVcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpKSByZXR1cm5cbiAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXG4gICAgICB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgPSBjb29yZFxuXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnVG9Nb3ZlKSByZXR1cm5cblxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGlmICghdGhpcy5kcmFnZ2luZykgcmV0dXJuXG4gICAgICAgIGlmICh0aGlzLmxhc3RNb3ZpbmdDb29yZCkge1xuICAgICAgICAgIHRoaXMubW92ZSh7XG4gICAgICAgICAgICB4OiBjb29yZC54IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueCxcbiAgICAgICAgICAgIHk6IGNvb3JkLnkgLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC55XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXG4gICAgICB9XG5cbiAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XG4gICAgICAgIGlmICghdGhpcy5waW5jaGluZykgcmV0dXJuXG4gICAgICAgIGxldCBkaXN0YW5jZSA9IHUuZ2V0UGluY2hEaXN0YW5jZShldnQsIHRoaXMpXG4gICAgICAgIGxldCBkZWx0YSA9IGRpc3RhbmNlIC0gdGhpcy5waW5jaERpc3RhbmNlXG4gICAgICAgIHRoaXMuem9vbShkZWx0YSA+IDAsIFBJTkNIX0FDQ0VMRVJBVElPTilcbiAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gZGlzdGFuY2VcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hhbmRsZVBvaW50ZXJMZWF2ZSAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMuY3VycmVudFBvaW50ZXJDb29yZCA9IG51bGxcbiAgICB9LFxuXG4gICAgX2hhbmRsZVdoZWVsIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlU2Nyb2xsVG9ab29tIHx8ICF0aGlzLmhhc0ltYWdlKCkpIHJldHVyblxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICAgIHRoaXMuc2Nyb2xsaW5nID0gdHJ1ZVxuICAgICAgaWYgKGV2dC53aGVlbERlbHRhIDwgMCB8fCBldnQuZGVsdGFZID4gMCB8fCBldnQuZGV0YWlsID4gMCkge1xuICAgICAgICB0aGlzLnpvb20odGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tKVxuICAgICAgfSBlbHNlIGlmIChldnQud2hlZWxEZWx0YSA+IDAgfHwgZXZ0LmRlbHRhWSA8IDAgfHwgZXZ0LmRldGFpbCA8IDApIHtcbiAgICAgICAgdGhpcy56b29tKCF0aGlzLnJldmVyc2VTY3JvbGxUb1pvb20pXG4gICAgICB9XG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gZmFsc2VcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9oYW5kbGVEcmFnRW50ZXIgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnQW5kRHJvcCB8fCAhdS5ldmVudEhhc0ZpbGUoZXZ0KSkgcmV0dXJuXG4gICAgICBpZiAodGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLnJlcGxhY2VEcm9wKSByZXR1cm5cbiAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gdHJ1ZVxuICAgIH0sXG5cbiAgICBfaGFuZGxlRHJhZ0xlYXZlIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgaWYgKCF0aGlzLmZpbGVEcmFnZ2VkT3ZlciB8fCAhdS5ldmVudEhhc0ZpbGUoZXZ0KSkgcmV0dXJuXG4gICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXG4gICAgfSxcblxuICAgIF9oYW5kbGVEcmFnT3ZlciAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgfSxcblxuICAgIF9oYW5kbGVEcm9wIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgaWYgKCF0aGlzLmZpbGVEcmFnZ2VkT3ZlciB8fCAhdS5ldmVudEhhc0ZpbGUoZXZ0KSkgcmV0dXJuXG4gICAgICBpZiAodGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLnJlcGxhY2VEcm9wKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxuXG4gICAgICBsZXQgZmlsZVxuICAgICAgbGV0IGR0ID0gZXZ0LmRhdGFUcmFuc2ZlclxuICAgICAgaWYgKCFkdCkgcmV0dXJuXG4gICAgICBpZiAoZHQuaXRlbXMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0Lml0ZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgbGV0IGl0ZW0gPSBkdC5pdGVtc1tpXVxuICAgICAgICAgIGlmIChpdGVtLmtpbmQgPT0gJ2ZpbGUnKSB7XG4gICAgICAgICAgICBmaWxlID0gaXRlbS5nZXRBc0ZpbGUoKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGUgPSBkdC5maWxlc1swXVxuICAgICAgfVxuXG4gICAgICBpZiAoZmlsZSkge1xuICAgICAgICB0aGlzLl9vbk5ld0ZpbGVJbihmaWxlKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSAoKSB7XG4gICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCA+IDApIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRZID4gMCkge1xuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3V0cHV0V2lkdGggLSB0aGlzLmltZ0RhdGEuc3RhcnRYID4gdGhpcy5pbWdEYXRhLndpZHRoKSB7XG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vdXRwdXRIZWlnaHQgLSB0aGlzLmltZ0RhdGEuc3RhcnRZID4gdGhpcy5pbWdEYXRhLmhlaWdodCkge1xuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSAoKSB7XG4gICAgICBpZiAodGhpcy5pbWdEYXRhLndpZHRoIDwgdGhpcy5vdXRwdXRXaWR0aCkge1xuICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSB0aGlzLm91dHB1dFdpZHRoIC8gdGhpcy5uYXR1cmFsV2lkdGhcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaW1nRGF0YS5oZWlnaHQgPCB0aGlzLm91dHB1dEhlaWdodCkge1xuICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSB0aGlzLm91dHB1dEhlaWdodCAvIHRoaXMubmF0dXJhbEhlaWdodFxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2V0T3JpZW50YXRpb24gKG9yaWVudGF0aW9uID0gNiwgYXBwbHlNZXRhZGF0YSkge1xuICAgICAgdmFyIHVzZU9yaWdpbmFsID0gYXBwbHlNZXRhZGF0YVxuICAgICAgaWYgKG9yaWVudGF0aW9uID4gMSB8fCB1c2VPcmlnaW5hbCkge1xuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cbiAgICAgICAgdGhpcy5yb3RhdGluZyA9IHRydWVcbiAgICAgICAgLy8gdS5nZXRSb3RhdGVkSW1hZ2VEYXRhKHVzZU9yaWdpbmFsID8gdGhpcy5vcmlnaW5hbEltYWdlIDogdGhpcy5pbWcsIG9yaWVudGF0aW9uKVxuICAgICAgICB2YXIgX2ltZyA9IHUuZ2V0Um90YXRlZEltYWdlKHVzZU9yaWdpbmFsID8gdGhpcy5vcmlnaW5hbEltYWdlIDogdGhpcy5pbWcsIG9yaWVudGF0aW9uKVxuICAgICAgICBfaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmltZyA9IF9pbWdcbiAgICAgICAgICB0aGlzLl9wbGFjZUltYWdlKGFwcGx5TWV0YWRhdGEpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoYXBwbHlNZXRhZGF0YSlcbiAgICAgIH1cblxuICAgICAgaWYgKG9yaWVudGF0aW9uID09IDIpIHtcbiAgICAgICAgLy8gZmxpcCB4XG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBYKHRoaXMub3JpZW50YXRpb24pXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDQpIHtcbiAgICAgICAgLy8gZmxpcCB5XG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBZKHRoaXMub3JpZW50YXRpb24pXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDYpIHtcbiAgICAgICAgLy8gOTAgZGVnXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDMpIHtcbiAgICAgICAgLy8gMTgwIGRlZ1xuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKVxuICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA4KSB7XG4gICAgICAgIC8vIDI3MCBkZWdcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvblxuICAgICAgfVxuXG4gICAgICBpZiAodXNlT3JpZ2luYWwpIHtcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9wYWludEJhY2tncm91bmQgKCkge1xuICAgICAgbGV0IGJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAndHJhbnNwYXJlbnQnIDogdGhpcy5jYW52YXNDb2xvclxuICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZENvbG9yXG4gICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXG4gICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcbiAgICB9LFxuXG4gICAgX2RyYXcgKCkge1xuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9kcmF3RnJhbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZHJhd0ZyYW1lKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgX2RyYXdGcmFtZSAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXG4gICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcbiAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmltZ0RhdGFcblxuICAgICAgdGhpcy5fcGFpbnRCYWNrZ3JvdW5kKClcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KVxuXG4gICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xuICAgICAgICB0aGlzLl9jbGlwKHRoaXMuX2NyZWF0ZUNvbnRhaW5lckNsaXBQYXRoKVxuICAgICAgICAvLyB0aGlzLl9jbGlwKHRoaXMuX2NyZWF0ZUltYWdlQ2xpcFBhdGgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5EUkFXX0VWRU5ULCBjdHgpXG4gICAgICBpZiAoIXRoaXMuaW1hZ2VTZXQpIHtcbiAgICAgICAgdGhpcy5pbWFnZVNldCA9IHRydWVcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLk5FV19JTUFHRV9EUkFXTl9FVkVOVClcbiAgICAgIH1cbiAgICAgIHRoaXMucm90YXRpbmcgPSBmYWxzZVxuICAgIH0sXG5cbiAgICBfY2xpcFBhdGhGYWN0b3J5ICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcbiAgICAgIGxldCByYWRpdXMgPSB0eXBlb2YgdGhpcy5pbWFnZUJvcmRlclJhZGl1cyA9PT0gJ251bWJlcicgP1xuICAgICAgICB0aGlzLmltYWdlQm9yZGVyUmFkaXVzIDpcbiAgICAgICAgIWlzTmFOKE51bWJlcih0aGlzLmltYWdlQm9yZGVyUmFkaXVzKSkgPyBOdW1iZXIodGhpcy5pbWFnZUJvcmRlclJhZGl1cykgOiAwXG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKHggKyByYWRpdXMsIHkpO1xuICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSByYWRpdXMsIHkpO1xuICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByYWRpdXMpO1xuICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQgLSByYWRpdXMpO1xuICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0LCB4ICsgd2lkdGggLSByYWRpdXMsIHkgKyBoZWlnaHQpO1xuICAgICAgY3R4LmxpbmVUbyh4ICsgcmFkaXVzLCB5ICsgaGVpZ2h0KTtcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHkgKyBoZWlnaHQsIHgsIHkgKyBoZWlnaHQgLSByYWRpdXMpO1xuICAgICAgY3R4LmxpbmVUbyh4LCB5ICsgcmFkaXVzKTtcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHksIHggKyByYWRpdXMsIHkpO1xuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29udGFpbmVyQ2xpcFBhdGggKCkge1xuICAgICAgdGhpcy5fY2xpcFBhdGhGYWN0b3J5KDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxuICAgICAgaWYgKHRoaXMuY2xpcFBsdWdpbnMgJiYgdGhpcy5jbGlwUGx1Z2lucy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5jbGlwUGx1Z2lucy5mb3JFYWNoKGZ1bmMgPT4ge1xuICAgICAgICAgIGZ1bmModGhpcy5jdHgsIDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBfY3JlYXRlSW1hZ2VDbGlwUGF0aCAoKSB7XG4gICAgLy8gICBsZXQgeyBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5pbWdEYXRhXG4gICAgLy8gICBsZXQgdyA9IHdpZHRoXG4gICAgLy8gICBsZXQgaCA9IGhlaWdodFxuICAgIC8vICAgbGV0IHggPSBzdGFydFhcbiAgICAvLyAgIGxldCB5ID0gc3RhcnRZXG4gICAgLy8gICBpZiAodyA8IGgpIHtcbiAgICAvLyAgICAgaCA9IHRoaXMub3V0cHV0SGVpZ2h0ICogKHdpZHRoIC8gdGhpcy5vdXRwdXRXaWR0aClcbiAgICAvLyAgIH1cbiAgICAvLyAgIGlmIChoIDwgdykge1xuICAgIC8vICAgICB3ID0gdGhpcy5vdXRwdXRXaWR0aCAqIChoZWlnaHQgLyB0aGlzLm91dHB1dEhlaWdodClcbiAgICAvLyAgICAgeCA9IHN0YXJ0WCArICh3aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxuICAgIC8vICAgfVxuICAgIC8vICAgdGhpcy5fY2xpcFBhdGhGYWN0b3J5KHgsIHN0YXJ0WSwgdywgaClcbiAgICAvLyB9LFxuXG4gICAgX2NsaXAgKGNyZWF0ZVBhdGgpIHtcbiAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxuICAgICAgY3R4LnNhdmUoKVxuICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjZmZmJ1xuICAgICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1pbidcbiAgICAgIGNyZWF0ZVBhdGgoKVxuICAgICAgY3R4LmZpbGwoKVxuICAgICAgY3R4LnJlc3RvcmUoKVxuICAgIH0sXG5cbiAgICBfYXBwbHlNZXRhZGF0YSAoKSB7XG4gICAgICBpZiAoIXRoaXMudXNlck1ldGFkYXRhKSByZXR1cm5cbiAgICAgIHZhciB7IHN0YXJ0WCwgc3RhcnRZLCBzY2FsZSB9ID0gdGhpcy51c2VyTWV0YWRhdGFcblxuICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc3RhcnRYKSkge1xuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gc3RhcnRYXG4gICAgICB9XG5cbiAgICAgIGlmICh1Lm51bWJlclZhbGlkKHN0YXJ0WSkpIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHN0YXJ0WVxuICAgICAgfVxuXG4gICAgICBpZiAodS5udW1iZXJWYWxpZChzY2FsZSkpIHtcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gc2NhbGVcbiAgICAgIH1cblxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLnVzZXJNZXRhZGF0YSA9IG51bGxcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIG9uRGltZW5zaW9uQ2hhbmdlICgpIHtcbiAgICAgIGlmICghdGhpcy5pbWcpIHtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xuICAgICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldFNpemUoKVxuICAgICAgICB0aGlzLl9wbGFjZUltYWdlKClcbiAgICAgIH1cbiAgICB9LFxuICAgIHJvdGF0ZVRvQW5nbGVJbmplY3RlZCgpIHtcbiAgICAgIHRoaXMuYW5nbGUgPVxuICAgICAgICBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDBcblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMuYW5nbGUgPSBwYXJzZUludCh0aGlzLmFuZ2xlKVxuICAgICAgaWYgKGlzTmFOKHRoaXMuYW5nbGUpIHx8IHRoaXMuYW5nbGUgPiAzNjAgfHwgdGhpcy5hbmdsZSA8IDApIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50IGZvciByb3RhdGUoKSBtZXRob2QuIEl0IHNob3VsZCBiZSBpbiByYW5nZSBbMCwgMzYwXS4nXG4gICAgICAgIClcbiAgICAgICAgdGhpcy5hbmdsZSA9IDBcbiAgICAgIH1cblxuICAgICAgY29uc3QgX3RoaXM4ID0gdGhpc1xuICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXG4gICAgICB0aGlzLnJvdGF0aW5nID0gdHJ1ZVxuXG4gICAgICBjb25zdCBpbWcgPSB0aGlzLm9yaWdpbmFsSW1hZ2VcbiAgICAgIC8vIFpvb20gaW4gdG8gcmVkdWNlIHF1YWxpdHkgbG9zcyB3aGVuIHJvdGF0aW5nXG4gICAgICBjb25zdCB3aWR0aCA9IHRoaXMub3JpZ2luYWxJbWFnZS53aWR0aFxuICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5vcmlnaW5hbEltYWdlLmhlaWdodFxuICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICAgICBjYW52YXMud2lkdGggPSB3aWR0aFxuICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodFxuXG4gICAgICBjb25zdCBwaWNPZmZzZXRYID0gd2lkdGggLyAyXG4gICAgICBjb25zdCBwaWNPZmZzZXRZID0gaGVpZ2h0IC8gMlxuXG4gICAgICBjdHgudHJhbnNsYXRlKHBpY09mZnNldFgsIHBpY09mZnNldFkpXG4gICAgICBjdHgucm90YXRlKCh0aGlzLmFuZ2xlIC8gMTgwKSAqIE1hdGguUEkpXG4gICAgICBjdHguZHJhd0ltYWdlKGltZywgMCAtIHBpY09mZnNldFgsIDAgLSBwaWNPZmZzZXRZLCB3aWR0aCwgaGVpZ2h0KVxuICAgICAgY3R4LnJlc3RvcmUoKVxuXG4gICAgICBjb25zdCBfY2FudmFzID0gY2FudmFzXG5cbiAgICAgIGNvbnN0IF9pbWcgPSBuZXcgSW1hZ2UoKVxuICAgICAgX2ltZy5zcmMgPSBfY2FudmFzLnRvRGF0YVVSTCgpXG5cbiAgICAgIF9pbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIF90aGlzOC5pbWcgPSBfaW1nXG4gICAgICAgIF90aGlzOC5fZHJhd0ZyYW1lKClcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldFJlc2l6ZWRJbWFnZShmaWxlLCB3aWR0aCA9IDEwMDApIHtcbiAgICAgIGlmICghZmlsZSkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgdmFyIGltZ1Jlc2l6ZWQgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIHZhciBjYW52YXMgPSBudWxsO1xuICAgICAgbGV0IGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgbGV0IHJhdGlvID0gMTtcbiAgICAgIGZpbGVSZWFkZXIub25sb2FkID0gKGUpID0+IHtcbiAgICAgICAgbGV0IGZpbGVEYXRhID0gZS50YXJnZXQucmVzdWx0O1xuICAgICAgICBsZXQgYmFzZTY0ID0gdS5wYXJzZURhdGFVcmwoZmlsZURhdGEpO1xuICAgICAgICAvLyBmaXJzdCBnZXQgRVhJRiBvcmllbnRhdGlvblxuICAgICAgICBsZXQgb3JpZW50YXRpb24gPSAxO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIG9yaWVudGF0aW9uID0gdS5nZXRGaWxlT3JpZW50YXRpb24odS5iYXNlNjRUb0FycmF5QnVmZmVyKGJhc2U2NCkpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHsgfVxuICAgICAgICBpbWcuc3JjID0gZmlsZURhdGE7XG4gICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgcmF0aW8gPSBpbWcuaGVpZ2h0IC8gaW1nLndpZHRoXG4gICAgICAgICAgY2FudmFzID0gY2FudmFzRXhpZk9yaWVudGF0aW9uLmRyYXdJbWFnZShcbiAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgIG9yaWVudGF0aW9uLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICAgIHdpZHRoICogcmF0aW9cbiAgICAgICAgICApO1xuICAgICAgICAgIGltZ1Jlc2l6ZWQuc3JjID0gY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgICAgICAgIGltZ1Jlc2l6ZWQub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fb25sb2FkKGltZ1Jlc2l6ZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjxzdHlsZSBsYW5nPVwic3R5bHVzXCI+XG4uY3JvcHBhLWNvbnRhaW5lclxuICBkaXNwbGF5IGlubGluZS1ibG9ja1xuICBjdXJzb3IgcG9pbnRlclxuICB0cmFuc2l0aW9uIGFsbCAwLjNzXG4gIHBvc2l0aW9uIHJlbGF0aXZlXG4gIGZvbnQtc2l6ZSAwXG4gIGFsaWduLXNlbGYgZmxleC1zdGFydFxuICBiYWNrZ3JvdW5kLWNvbG9yICNlNmU2ZTZcblxuICBjYW52YXNcbiAgICB0cmFuc2l0aW9uIGFsbCAwLjNzXG5cbiAgJjpob3ZlclxuICAgIG9wYWNpdHkgMC43XG5cbiAgJi5jcm9wcGEtLWRyb3B6b25lXG4gICAgYm94LXNoYWRvdyBpbnNldCAwIDAgMTBweCBsaWdodG5lc3MoYmxhY2ssIDIwJSlcblxuICAgIGNhbnZhc1xuICAgICAgb3BhY2l0eSAwLjVcblxuICAmLmNyb3BwYS0tZGlzYWJsZWQtY2NcbiAgICBjdXJzb3IgZGVmYXVsdFxuXG4gICAgJjpob3ZlclxuICAgICAgb3BhY2l0eSAxXG5cbiAgJi5jcm9wcGEtLWhhcy10YXJnZXRcbiAgICBjdXJzb3IgbW92ZVxuXG4gICAgJjpob3ZlclxuICAgICAgb3BhY2l0eSAxXG5cbiAgICAmLmNyb3BwYS0tZGlzYWJsZWQtbXpcbiAgICAgIGN1cnNvciBkZWZhdWx0XG5cbiAgJi5jcm9wcGEtLWRpc2FibGVkXG4gICAgY3Vyc29yIG5vdC1hbGxvd2VkXG5cbiAgICAmOmhvdmVyXG4gICAgICBvcGFjaXR5IDFcblxuICAmLmNyb3BwYS0tcGFzc2l2ZVxuICAgIGN1cnNvciBkZWZhdWx0XG5cbiAgICAmOmhvdmVyXG4gICAgICBvcGFjaXR5IDFcblxuICBzdmcuaWNvbi1yZW1vdmVcbiAgICBwb3NpdGlvbiBhYnNvbHV0ZVxuICAgIGJhY2tncm91bmQgd2hpdGVcbiAgICBib3JkZXItcmFkaXVzIDUwJVxuICAgIGZpbHRlciBkcm9wLXNoYWRvdygtMnB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjcpKVxuICAgIHotaW5kZXggMTBcbiAgICBjdXJzb3IgcG9pbnRlclxuICAgIGJvcmRlciAycHggc29saWQgd2hpdGVcbjwvc3R5bGU+XG5cbjxzdHlsZSBsYW5nPVwic2Nzc1wiPlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RvYmlhc2FobGluL1NwaW5LaXQvYmxvYi9tYXN0ZXIvc2Nzcy9zcGlubmVycy8xMC1mYWRpbmctY2lyY2xlLnNjc3Ncbi5zay1mYWRpbmctY2lyY2xlIHtcbiAgJGNpcmNsZUNvdW50OiAxMjtcbiAgJGFuaW1hdGlvbkR1cmF0aW9uOiAxcztcblxuICBwb3NpdGlvbjogYWJzb2x1dGU7XG5cbiAgLnNrLWNpcmNsZSB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBsZWZ0OiAwO1xuICAgIHRvcDogMDtcbiAgfVxuXG4gIC5zay1jaXJjbGUgLnNrLWNpcmNsZS1pbmRpY2F0b3Ige1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG1hcmdpbjogMCBhdXRvO1xuICAgIHdpZHRoOiAxNSU7XG4gICAgaGVpZ2h0OiAxNSU7XG4gICAgYm9yZGVyLXJhZGl1czogMTAwJTtcbiAgICBhbmltYXRpb246IHNrLWNpcmNsZUZhZGVEZWxheSAkYW5pbWF0aW9uRHVyYXRpb24gaW5maW5pdGUgZWFzZS1pbi1vdXQgYm90aDtcbiAgfVxuXG4gIEBmb3IgJGkgZnJvbSAyIHRocm91Z2ggJGNpcmNsZUNvdW50IHtcbiAgICAuc2stY2lyY2xlI3skaX0ge1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnIC8gJGNpcmNsZUNvdW50ICogKCRpIC0gMSkpO1xuICAgIH1cbiAgfVxuXG4gIEBmb3IgJGkgZnJvbSAyIHRocm91Z2ggJGNpcmNsZUNvdW50IHtcbiAgICAuc2stY2lyY2xlI3skaX0gLnNrLWNpcmNsZS1pbmRpY2F0b3Ige1xuICAgICAgYW5pbWF0aW9uLWRlbGF5OiAtJGFuaW1hdGlvbkR1cmF0aW9uICsgJGFuaW1hdGlvbkR1cmF0aW9uIC8gJGNpcmNsZUNvdW50ICogKCRpIC0gMSk7XG4gICAgfVxuICB9XG59XG5Aa2V5ZnJhbWVzIHNrLWNpcmNsZUZhZGVEZWxheSB7XG4gIDAlLFxuICAzOSUsXG4gIDEwMCUge1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbiAgNDAlIHtcbiAgICBvcGFjaXR5OiAxO1xuICB9XG59XG48L3N0eWxlPlxuXG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiaW1wb3J0IGNvbXBvbmVudCBmcm9tICcuL2Nyb3BwZXIudnVlJ1xyXG5pbXBvcnQgYXNzaWduIGZyb20gJ29iamVjdC1hc3NpZ24nXHJcblxyXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcclxuICBjb21wb25lbnROYW1lOiAnY3JvcHBhJ1xyXG59XHJcblxyXG5jb25zdCBWdWVDcm9wcGEgPSB7XHJcbiAgaW5zdGFsbDogZnVuY3Rpb24gKFZ1ZSwgb3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IGFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpXHJcbiAgICBsZXQgdmVyc2lvbiA9IE51bWJlcihWdWUudmVyc2lvbi5zcGxpdCgnLicpWzBdKVxyXG4gICAgaWYgKHZlcnNpb24gPCAyKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdnVlLWNyb3BwYSBzdXBwb3J0cyB2dWUgdmVyc2lvbiAyLjAgYW5kIGFib3ZlLiBZb3UgYXJlIHVzaW5nIFZ1ZUAke3ZlcnNpb259LiBQbGVhc2UgdXBncmFkZSB0byB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgVnVlLmApXHJcbiAgICB9XHJcbiAgICBsZXQgY29tcG9uZW50TmFtZSA9IG9wdGlvbnMuY29tcG9uZW50TmFtZSB8fCAnY3JvcHBhJ1xyXG5cclxuICAgIC8vIHJlZ2lzdHJhdGlvblxyXG4gICAgVnVlLmNvbXBvbmVudChjb21wb25lbnROYW1lLCBjb21wb25lbnQpXHJcbiAgfSxcclxuXHJcbiAgY29tcG9uZW50XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgVnVlQ3JvcHBhIl0sIm5hbWVzIjpbImRlZmluZSIsInRoaXMiLCJwb2ludCIsInZtIiwiY2FudmFzIiwicXVhbGl0eSIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRYIiwiY2xpZW50WSIsImxlZnQiLCJ0b3AiLCJldnQiLCJwb2ludGVyIiwidG91Y2hlcyIsImNoYW5nZWRUb3VjaGVzIiwib25lUG9pbnRDb29yZCIsInBvaW50ZXIxIiwicG9pbnRlcjIiLCJjb29yZDEiLCJjb29yZDIiLCJNYXRoIiwic3FydCIsInBvdyIsIngiLCJ5IiwiaW1nIiwiY29tcGxldGUiLCJuYXR1cmFsV2lkdGgiLCJkb2N1bWVudCIsIndpbmRvdyIsImxhc3RUaW1lIiwidmVuZG9ycyIsImxlbmd0aCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiY2FsbGJhY2siLCJjdXJyVGltZSIsIkRhdGUiLCJnZXRUaW1lIiwidGltZVRvQ2FsbCIsIm1heCIsImlkIiwic2V0VGltZW91dCIsImFyZyIsImlzQXJyYXkiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJIVE1MQ2FudmFzRWxlbWVudCIsImJpblN0ciIsImxlbiIsImFyciIsInRvQmxvYiIsImRlZmluZVByb3BlcnR5IiwidHlwZSIsImF0b2IiLCJ0b0RhdGFVUkwiLCJzcGxpdCIsIlVpbnQ4QXJyYXkiLCJpIiwiY2hhckNvZGVBdCIsIkJsb2IiLCJkdCIsImRhdGFUcmFuc2ZlciIsIm9yaWdpbmFsRXZlbnQiLCJ0eXBlcyIsImFycmF5QnVmZmVyIiwidmlldyIsIkRhdGFWaWV3IiwiZ2V0VWludDE2IiwiYnl0ZUxlbmd0aCIsIm9mZnNldCIsIm1hcmtlciIsImdldFVpbnQzMiIsImxpdHRsZSIsInRhZ3MiLCJ1cmwiLCJyZWciLCJleGVjIiwiYmFzZTY0IiwiYmluYXJ5U3RyaW5nIiwiYnl0ZXMiLCJidWZmZXIiLCJvcmllbnRhdGlvbiIsIl9jYW52YXMiLCJDYW52YXNFeGlmT3JpZW50YXRpb24iLCJkcmF3SW1hZ2UiLCJfaW1nIiwiSW1hZ2UiLCJzcmMiLCJvcmkiLCJtYXAiLCJuIiwiaXNOYU4iLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJ2YWx1ZSIsImlzRmluaXRlIiwiZmxvb3IiLCJpbml0aWFsSW1hZ2VUeXBlIiwiU3RyaW5nIiwidmFsIiwiQm9vbGVhbiIsInZhbGlkcyIsImV2ZXJ5IiwiaW5kZXhPZiIsIndvcmQiLCJ0ZXN0IiwiUENUX1BFUl9aT09NIiwiTUlOX01TX1BFUl9DTElDSyIsIkNMSUNLX01PVkVfVEhSRVNIT0xEIiwiTUlOX1dJRFRIIiwiREVGQVVMVF9QTEFDRUhPTERFUl9UQUtFVVAiLCJQSU5DSF9BQ0NFTEVSQVRJT04iLCJzeW5jRGF0YSIsInJlbmRlciIsImV2ZW50cyIsIklOSVRfRVZFTlQiLCJwcm9wcyIsInciLCJ1c2VBdXRvU2l6aW5nIiwicmVhbFdpZHRoIiwid2lkdGgiLCJoIiwicmVhbEhlaWdodCIsImhlaWdodCIsInBsYWNlaG9sZGVyRm9udFNpemUiLCJuYXR1cmFsSGVpZ2h0IiwibG9hZGluZ1NpemUiLCJfaW5pdGlhbGl6ZSIsInJBRlBvbHlmaWxsIiwidG9CbG9iUG9seWZpbGwiLCJzdXBwb3J0cyIsInN1cHBvcnREZXRlY3Rpb24iLCJiYXNpYyIsIndhcm4iLCJwYXNzaXZlIiwiJHdhdGNoIiwiZGF0YSIsInNldCIsImtleSIsIiRzZXQiLCJyZW1vdmUiLCIkbmV4dFRpY2siLCJfZHJhdyIsImF1dG9TaXppbmciLCIkcmVmcyIsIndyYXBwZXIiLCJnZXRDb21wdXRlZFN0eWxlIiwiX2F1dG9TaXppbmdJbml0IiwiX2F1dG9TaXppbmdSZW1vdmUiLCJvbkRpbWVuc2lvbkNoYW5nZSIsIl9zZXRQbGFjZWhvbGRlcnMiLCJpbWFnZVNldCIsIl9wbGFjZUltYWdlIiwib2xkVmFsIiwidSIsIm51bWJlclZhbGlkIiwicG9zIiwiY3VycmVudFBvaW50ZXJDb29yZCIsImltZ0RhdGEiLCJzdGFydFgiLCJzdGFydFkiLCJ1c2VyTWV0YWRhdGEiLCJyb3RhdGluZyIsIm9mZnNldFgiLCJvZmZzZXRZIiwicHJldmVudFdoaXRlU3BhY2UiLCJfcHJldmVudFpvb21pbmdUb1doaXRlU3BhY2UiLCJfcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSIsInNjYWxlUmF0aW8iLCJoYXNJbWFnZSIsImFicyIsImVtaXRFdmVudCIsIlpPT01fRVZFTlQiLCJMT0FESU5HX1NUQVJUX0VWRU5UIiwiTE9BRElOR19FTkRfRVZFTlQiLCIkZW1pdCIsImN0eCIsImNob3NlbkZpbGUiLCJmaWxlSW5wdXQiLCJmaWxlcyIsIm9sZFgiLCJvbGRZIiwiTU9WRV9FVkVOVCIsImFtb3VudCIsIm1vdmUiLCJ6b29tSW4iLCJhY2NlbGVyYXRpb24iLCJyZWFsU3BlZWQiLCJ6b29tU3BlZWQiLCJzcGVlZCIsIm91dHB1dFdpZHRoIiwiem9vbSIsInN0ZXAiLCJkaXNhYmxlUm90YXRpb24iLCJkaXNhYmxlZCIsInBhcnNlSW50IiwiX3JvdGF0ZUJ5U3RlcCIsIl9zZXRPcmllbnRhdGlvbiIsIm1ldGFkYXRhIiwiY29tcHJlc3Npb25SYXRlIiwibWltZVR5cGUiLCJxdWFsaXR5QXJndW1lbnQiLCJhcmdzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJnZW5lcmF0ZUJsb2IiLCJibG9iIiwiZXJyIiwiZGl2IiwiY3JlYXRlRWxlbWVudCIsIkZpbGUiLCJGaWxlUmVhZGVyIiwiRmlsZUxpc3QiLCJjbGljayIsImhhZEltYWdlIiwib3JpZ2luYWxJbWFnZSIsInZpZGVvIiwicGF1c2UiLCJJTUFHRV9SRU1PVkVfRVZFTlQiLCJwbHVnaW4iLCJjbGlwUGx1Z2lucyIsInB1c2giLCJFcnJvciIsImZpbGUiLCJfb25OZXdGaWxlSW4iLCJzbGljZSIsIl9zZXRDb250YWluZXJTaXplIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJfc2V0U2l6ZSIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiY2FudmFzQ29sb3IiLCJnZXRDb250ZXh0IiwiaW1hZ2VTbW9vdGhpbmdFbmFibGVkIiwiaW1hZ2VTbW9vdGhpbmdRdWFsaXR5Iiwid2Via2l0SW1hZ2VTbW9vdGhpbmdFbmFibGVkIiwibXNJbWFnZVNtb290aGluZ0VuYWJsZWQiLCJfc2V0SW5pdGlhbCIsIm91dHB1dEhlaWdodCIsIiRzbG90cyIsInBsYWNlaG9sZGVyIiwidk5vZGUiLCJ0YWciLCJlbG0iLCJvbkxvYWQiLCJpbWFnZUxvYWRlZCIsIm9ubG9hZCIsInRleHRCYXNlbGluZSIsInRleHRBbGlnbiIsImRlZmF1bHRGb250U2l6ZSIsImZvbnRTaXplIiwiY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplIiwiZm9udCIsImZpbGxTdHlsZSIsInBsYWNlaG9sZGVyQ29sb3IiLCJmaWxsVGV4dCIsIl9wYWludEJhY2tncm91bmQiLCJfc2V0SW1hZ2VQbGFjZWhvbGRlciIsIl9zZXRUZXh0UGxhY2Vob2xkZXIiLCJpbml0aWFsIiwiaW5pdGlhbEltYWdlIiwic2V0QXR0cmlidXRlIiwiYmFiZWxIZWxwZXJzLnR5cGVvZiIsImN1cnJlbnRJc0luaXRpYWwiLCJfb25sb2FkIiwiZGF0YXNldCIsImxvYWRpbmciLCJvbmVycm9yIiwiSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQiLCJ2aWRlb1dpZHRoIiwidmlkZW9IZWlnaHQiLCJkcmF3RnJhbWUiLCJmcmFtZSIsImtlZXBEcmF3aW5nIiwiZW5kZWQiLCJwYXVzZWQiLCJlbWl0TmF0aXZlRXZlbnQiLCJkaXNhYmxlQ2xpY2tUb0Nob29zZSIsInN1cHBvcnRUb3VjaCIsImNob29zZUZpbGUiLCJ2aWRlb0VuYWJsZWQiLCJwbGF5IiwiaW5wdXQiLCJGSUxFX0NIT09TRV9FVkVOVCIsIl9maWxlU2l6ZUlzVmFsaWQiLCJGSUxFX1NJWkVfRVhDRUVEX0VWRU5UIiwiX2ZpbGVUeXBlSXNWYWxpZCIsIkZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVCIsIm5hbWUiLCJ0b0xvd2VyQ2FzZSIsInBvcCIsImZyIiwiZSIsImZpbGVEYXRhIiwidGFyZ2V0IiwicmVzdWx0IiwicGFyc2VEYXRhVXJsIiwiaXNWaWRlbyIsInJlYWR5U3RhdGUiLCJIQVZFX0ZVVFVSRV9EQVRBIiwiX29uVmlkZW9Mb2FkIiwibG9nIiwiZ2V0RmlsZU9yaWVudGF0aW9uIiwiYmFzZTY0VG9BcnJheUJ1ZmZlciIsIk5FV19JTUFHRV9FVkVOVCIsInJlYWRBc0RhdGFVUkwiLCJmaWxlU2l6ZUxpbWl0Iiwic2l6ZSIsImFjY2VwdGFibGVNaW1lVHlwZSIsImNhblBsYXlUeXBlIiwiYWNjZXB0IiwiYmFzZU1pbWV0eXBlIiwicmVwbGFjZSIsInQiLCJ0cmltIiwiY2hhckF0IiwiZmlsZUJhc2VUeXBlIiwiYXBwbHlNZXRhZGF0YSIsIl9hc3BlY3RGaWxsIiwiaW5pdGlhbFNpemUiLCJfYXNwZWN0Rml0IiwiX25hdHVyYWxTaXplIiwiaW5pdGlhbFBvc2l0aW9uIiwiX2FwcGx5TWV0YWRhdGEiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsImNhbnZhc1JhdGlvIiwiYXNwZWN0UmF0aW8iLCJwb2ludGVyTW92ZWQiLCJwb2ludGVyQ29vcmQiLCJnZXRQb2ludGVyQ29vcmRzIiwicG9pbnRlclN0YXJ0Q29vcmQiLCJ0YWJTdGFydCIsInZhbHVlT2YiLCJ3aGljaCIsImRyYWdnaW5nIiwicGluY2hpbmciLCJjb29yZCIsImxhc3RNb3ZpbmdDb29yZCIsImRpc2FibGVQaW5jaFRvWm9vbSIsInBpbmNoRGlzdGFuY2UiLCJnZXRQaW5jaERpc3RhbmNlIiwiY2FuY2VsRXZlbnRzIiwiX2hhbmRsZVBvaW50ZXJFbmQiLCJwb2ludGVyTW92ZURpc3RhbmNlIiwidGFiRW5kIiwiZGlzYWJsZURyYWdUb01vdmUiLCJwcmV2ZW50RGVmYXVsdCIsImRpc3RhbmNlIiwiZGVsdGEiLCJkaXNhYmxlU2Nyb2xsVG9ab29tIiwic2Nyb2xsaW5nIiwid2hlZWxEZWx0YSIsImRlbHRhWSIsImRldGFpbCIsInJldmVyc2VTY3JvbGxUb1pvb20iLCJkaXNhYmxlRHJhZ0FuZERyb3AiLCJldmVudEhhc0ZpbGUiLCJyZXBsYWNlRHJvcCIsImZpbGVEcmFnZ2VkT3ZlciIsIml0ZW1zIiwiaXRlbSIsImtpbmQiLCJnZXRBc0ZpbGUiLCJ1c2VPcmlnaW5hbCIsImdldFJvdGF0ZWRJbWFnZSIsImZsaXBYIiwiZmxpcFkiLCJyb3RhdGU5MCIsImNsZWFyUmVjdCIsImZpbGxSZWN0IiwiX2RyYXdGcmFtZSIsIl9jbGlwIiwiX2NyZWF0ZUNvbnRhaW5lckNsaXBQYXRoIiwiRFJBV19FVkVOVCIsIk5FV19JTUFHRV9EUkFXTl9FVkVOVCIsInJhZGl1cyIsImltYWdlQm9yZGVyUmFkaXVzIiwiYmVnaW5QYXRoIiwibW92ZVRvIiwibGluZVRvIiwicXVhZHJhdGljQ3VydmVUbyIsImNsb3NlUGF0aCIsIl9jbGlwUGF0aEZhY3RvcnkiLCJmb3JFYWNoIiwiY3JlYXRlUGF0aCIsInNhdmUiLCJnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24iLCJmaWxsIiwicmVzdG9yZSIsInNjYWxlIiwiYW5nbGUiLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJfdGhpczgiLCJwaWNPZmZzZXRYIiwicGljT2Zmc2V0WSIsInRyYW5zbGF0ZSIsInJvdGF0ZSIsIlBJIiwiaW1nUmVzaXplZCIsImZpbGVSZWFkZXIiLCJyYXRpbyIsImNhbnZhc0V4aWZPcmllbnRhdGlvbiIsImRlZmF1bHRPcHRpb25zIiwiVnVlQ3JvcHBhIiwiVnVlIiwib3B0aW9ucyIsImFzc2lnbiIsInZlcnNpb24iLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQ0FBQyxVQUFVLElBQUksRUFBRSxPQUFPLEVBQUU7SUFDdEIsSUFBSSxPQUFPQSxTQUFNLEtBQUssVUFBVSxJQUFJQSxTQUFNLENBQUMsR0FBRyxFQUFFO1FBQzVDQSxTQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3ZCLE1BQU0sQUFBaUM7UUFDcEMsY0FBYyxHQUFHLE9BQU8sRUFBRSxDQUFDO0tBQzlCLEFBRUY7Q0FDRixDQUFDQyxjQUFJLEVBQUUsWUFBWTtFQUNsQixZQUFZLENBQUM7O0VBRWIsU0FBUyxTQUFTLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7SUFDeEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDOztJQUVqRixJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyQixJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyQixJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUUsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDckMsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDOztJQUV4QyxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENB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
