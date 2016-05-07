/**
 * Painting
 * @classdesc Painting Class
 */
var Painting = (function() {
  'use strict';

  /**
   * @constructor
   * @param canvas - canvas Element
   * @param [options] - options
   */
  function Painting(canvas, options) {
    if (typeof options === 'undefined' || options === null) options = {};

    this.velocityFilterWeight = options.velocityFilterWeight || 0.7;
    this.minWidth = options.minWidth || 0.5;
    this.maxWidth = options.maxWidth || 2.5;
    this.dotSize = options.dotSize || function () {
      return (this.minWidth + this.maxWidth) / 2;
    };

    this.penColor = options.penColor || 'black';
    this.backgroundColor = options.backgroundColor || 'rgba(0,0,0,0)';
    this.onEnd = options.onEnd;
    this.onBegin = options.onBegin;

    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this.clear();

    this._handleMouseEvents();
    this._handleTouchEvents();
  }

  /**
   * Painting#clear
   */
  Painting.prototype.clear = function() {
    var ctx = this._ctx,
        canvas = this._canvas;

    ctx.fillStyle = this.backgroundColor;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this._reset();
  };

  /**
   * Painting#toDataURL
   */
  Painting.prototype.toDataURL = function() {
    var canvas = this._canvas;
    return canvas.toDataURL.apply(canvas, arguments);
  };

  /**
   * Painting#fromDataURL
   */
  Painting.prototype.fromDataURL = function() {
    var image = new Image(),
        ratio = window.devicePixelRatio || 1,
        width = this._canvas.width / ratio,
        height = this._canvas.height / ratio;

    this._reset();
    image.src = dataUrl;
    image.onload = (function(_this) {
      _this._ctx.drawImage(image, 0, 0, width, height);
    })(this);
    this._isEmpty = false;
  };

  /**
   * Painting#_strokeUpdate
   */
  Painting.prototype._strokeUpdate = function (event) {
    var point = this._createPoint(event);
    this._addPoint(point);
  };

  /**
   * Painting#_strokeBegin
   */
  Painting.prototype._strokeBegin = function (event) {
    this._reset();
    this._strokeUpdate(event);
    if (typeof this.onBegin === 'function') {
      this.onBegin(event);
    }
  };

  /**
   * Painting#_strokeDraw
   */
  Painting.prototype._strokeDraw = function (point) {
    var ctx = this._ctx,
        dotSize = typeof(this.dotSize) === 'function' ? this.dotSize() : this.dotSize;

    ctx.beginPath();
    this._drawPoint(point.x, point.y, dotSize);
    ctx.closePath();
    ctx.fill();
  };

  /**
   * Painting#_strokeEnd
   */
  Painting.prototype._strokeEnd = function (event) {
    var canDrawCurve = this.points.length > 2,
        point = this.points[0];

    if (!canDrawCurve && point) {
      this._strokeDraw(point);
    }
    if (typeof this.onEnd === 'function') {
      this.onEnd(event);
    }
  };

  /**
   * Painting#_handleMouseEvents
   */
  Painting.prototype._handleMouseEvents = function (event) {
    this._mouseButtonDown = false;

    this._canvas.addEventListener('mousedown', this._handleMouseDown.bind(this));
    this._canvas.addEventListener('mousemove', this._handleMouseMove.bind(this));
    document.addEventListener('mouseup', this._handleMouseUp.bind(this));
  };

  /**
   * Painting#_handleTouchEvents
   */
  Painting.prototype._handleTouchEvents = function (event) {
    // Pass touch events to canvas element on mobile IE11 and Edge.
    this._canvas.style.msTouchAction = 'none';
    this._canvas.style.touchAction = 'none';

    this._canvas.addEventListener('touchstart', this._handleTouchStart.bind(this));
    this._canvas.addEventListener('touchmove', this._handleTouchMove.bind(this));
    this._canvas.addEventListener('touchend', this._handleTouchEnd.bind(this));
  };

  /**
   * Painting#on
   */
  Painting.prototype.on = function (event) {
    this._handleMouseEvents();
    this._handleTouchEvents();
  };

  /**
   * Painting#off
   */
  Painting.prototype.off = function (event) {
    this._canvas.removeEventListener('mousedown', this._handleMouseDown);
    this._canvas.removeEventListener('mousemove', this._handleMouseMove);
    document.removeEventListener('mouseup', this._handleMouseUp);

    this._canvas.removeEventListener('touchstart', this._handleTouchStart);
    this._canvas.removeEventListener('touchmove', this._handleTouchMove);
    this._canvas.removeEventListener('touchend', this._handleTouchEnd);
  };

  /**
   * Painting#isEmpty
   */
  Painting.prototype.isEmpty = function (event) {
    return this._isEmpty;
  };

  /**
   * Painting#_reset
   */
  Painting.prototype._reset = function (event) {
    this.points = [];
    this._lastVelocity = 0;
    this._lastWidth = (this.minWidth + this.maxWidth) / 2;
    this._isEmpty = true;
    this._ctx.fillStyle = this.penColor;
  };

  /**
   * Painting#_createPoint
   */
  Painting.prototype._createPoint = function (event) {
    var rect = this._canvas.getBoundingClientRect();
    return new Point(
      event.clientX - rect.left,
      event.clientY - rect.top
    );
  };

  /**
   * Painting#_addPoint
   */
  Painting.prototype._addPoint = function (point) {
    var points = this.points,
        c2, c3,
        curve, tmp;

    points.push(point);

    if (points.length > 2) {
      // To reduce the initial lag make it work with 3 points
      // by copying the first point to the beginning.
      if (points.length === 3) points.unshift(points[0]);

      tmp = this._calculateCurveControlPoints(points[0], points[1], points[2]);
      c2 = tmp.c2;
      tmp = this._calculateCurveControlPoints(points[1], points[2], points[3]);
      c3 = tmp.c1;
      curve = new Bezier(points[1], c2, c3, points[2]);
      this._addCurve(curve);

      // Remove the first element from the list,
      // so that we always have no more than 4 points in points array.
      points.shift();
    }
  };

  /**
   * Painting#_calculateCurveControlPoints
   */
  Painting.prototype._calculateCurveControlPoints = function (s1, s2, s3) {
    var dx1 = s1.x - s2.x, dy1 = s1.y - s2.y,
        dx2 = s2.x - s3.x, dy2 = s2.y - s3.y,

        m1 = {x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0},
        m2 = {x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0},

        l1 = Math.sqrt(dx1*dx1 + dy1*dy1),
        l2 = Math.sqrt(dx2*dx2 + dy2*dy2),

        dxm = (m1.x - m2.x),
        dym = (m1.y - m2.y),

        k = l2 / (l1 + l2),
        cm = {x: m2.x + dxm*k, y: m2.y + dym*k},

        tx = s2.x - cm.x,
        ty = s2.y - cm.y;

    return {
      c1: new Point(m1.x + tx, m1.y + ty),
      c2: new Point(m2.x + tx, m2.y + ty)
    };
  };

  /**
   * Painting#_addCurve
   */
  Painting.prototype._addCurve = function (curve) {
    var startPoint = curve.startPoint,
        endPoint = curve.endPoint,
        velocity, newWidth;

    velocity = endPoint.velocityFrom(startPoint);
    velocity = this.velocityFilterWeight * velocity + 
              (1 - this.velocityFilterWeight) * this._lastVelocity;

    newWidth = this._strokeWidth(velocity);
    this._drawCurve(curve, this._lastWidth, newWidth);

    this._lastVelocity = velocity;
    this._lastWidth = newWidth;
  };

  /**
   * Painting#_drawPoint
   */
  Painting.prototype._drawPoint = function (x, y, size) {
    var ctx = this._ctx;

    ctx.moveTo(x, y);
    ctx.arc(x, y, size, 0, 2 * Math.PI, false);
    this._isEmpty = false;
  };

  /**
   * Painting#_drawCurve
   */
  Painting.prototype._drawCurve = function (curve, startWidth, endWidth) {
    var ctx = this._ctx,
        widthDelta = endWidth - startWidth,
        drawSteps, width, i, t, tt, ttt, u, uu, uuu, x, y;

    drawSteps = Math.floor(curve.length());
    ctx.beginPath();
    for (i = 0; i < drawSteps; i++) {
      // Calculate the Bezier (x, y) coordinate for this step.
      t = i / drawSteps;
      tt = t * t;
      ttt = tt * t;
      u = 1 - t;
      uu = u * u;
      uuu = uu * u;

      x = uuu * curve.startPoint.x;
      x += 3 * uu * t * curve.control1.x;
      x += 3 * u * tt * curve.control2.x;
      x += ttt * curve.endPoint.x;

      y = uuu * curve.startPoint.y;
      y += 3 * uu * t * curve.control1.y;
      y += 3 * u * tt * curve.control2.y;
      y += ttt * curve.endPoint.y;

      width = startWidth + ttt * widthDelta;
      this._drawPoint(x, y, width);
    }
    ctx.closePath();
    ctx.fill();
  };

  /**
   * Painting#_strokeWidth
   */
  Painting.prototype._strokeWidth = function (velocity) {
    return Math.max(this.maxWidth / (velocity + 1), this.minWidth);
  };

  /**
   * Painting#_handleMouseDown
   */
  Painting.prototype._handleMouseDown = function (event) {
    if (event.which === 1) {
      this._mouseButtonDown = true;
      this._strokeBegin(event);
    }
  };

  /**
   * Painting#_handleMouseMove
   */
  Painting.prototype._handleMouseMove = function (event) {
    if (this._mouseButtonDown) {
      this._strokeUpdate(event);
    }
  };

  /**
   * Painting#_handleMouseUp
   */
  Painting.prototype._handleMouseUp = function (event) {
    if (event.which === 1 && this._mouseButtonDown) {
      this._mouseButtonDown = false;
      this._strokeEnd(event);
    }
  };

  /**
   * Painting#_handleTouchStart
   */
  Painting.prototype._handleTouchStart = function (event) {
    if (event.targetTouches.length == 1) {
      var touch = event.changedTouches[0];
      this._strokeBegin(touch);
    }
  };

  /**
   * Painting#_handleTouchMove
   */
  Painting.prototype._handleTouchMove = function (event) {
    console.log('[Painting] _handleTouchMove');
    // Prevent scrolling.
    event.preventDefault();

    var touch = event.targetTouches[0];
    this._strokeUpdate(touch);
  };

  /**
   * Painting#_handleTouchEnd
   */
  Painting.prototype._handleTouchEnd = function (event) {
    console.log('[Painting] _handleTouchEnd');

    var wasCanvasTouched = event.target === this._canvas;
    if (wasCanvasTouched) {
      event.preventDefault();
      this._strokeEnd(event);
    }
  };





  // --------------------------------------------------
  /**
   * Point
   */
  var Point = function (x, y, time) {
    this.x = x;
    this.y = y;
    this.time = time || new Date().getTime();
  }

  /**
   * Point#velocityFrom
   */
  Point.prototype.velocityFrom = function (start) {
    return (this.time !== start.time) ? this.distanceTo(start) / (this.time - start.time) : 1;
  }

  /**
   * Point#distanceTo
   */
  Point.prototype.distanceTo = function (start) {
    return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
  }



  // --------------------------------------------------
  /**
   * Bezier
   */
  var Bezier = function (startPoint, control1, control2, endPoint) {
    this.startPoint = startPoint;
    this.control1 = control1;
    this.control2 = control2;
    this.endPoint = endPoint;
  }

  /**
   * Bezier#length
   */
  Bezier.prototype.length = function () {
    var steps = 10,
        length = 0,
        i, t, cx, cy, px, py, xdiff, ydiff;

    for (i = 0; i <= steps; i++) {
      t = i / steps;
      cx = this._point(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
      cy = this._point(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);

      if (i > 0) {
        xdiff = cx - px;
        ydiff = cy - py;
        length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
      }

      px = cx;
      py = cy;
    }
    return length;
  };

  /**
   * Bezier#_point
   */
  Bezier.prototype._point = function (t, start, c1, c2, end) {
    return start * (1.0 - t) * (1.0 - t)  * (1.0 - t)
            + 3.0 *  c1    * (1.0 - t) * (1.0 - t)  * t
            + 3.0 *  c2    * (1.0 - t) * t          * t
            +        end   * t         * t          * t;
  };

  return Painting;

})();


export default Painting;









