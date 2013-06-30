;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
		return window.qoopido.shared.module.initialize('jquery/plugins/emerge', pDefinition, arguments);
	};

	if(typeof define === 'function' && define.amd) {
		define([ '../../base', '../../unique', 'jquery' ], definition);
	} else {
		definition(window.qoopido.base, window.qoopido.unique, window.jQuery);
	}
}(function(mPrototype, mUnique, mJquery, namespace, window, document, undefined) {
	'use strict';

	var
	// properties
		name     = 'emerge',
		defaults = { interval: 50, threshold: 'auto', recur: true, auto: 0.5, visibility: true },
		$window  = mJquery(window),

	// methods / classes
		tick, resize, prototype,

	// events
		EVENT_EMERGED  = 'emerged.' + name,
		EVENT_DEMERGED = 'demerged.' + name,

	// listener
		LISTENER_RESIZE = 'resize orientationchange';

	if(document.compatMode !== 'CSS1Compat') {
		throw('This plugin will not work correctly in quirks mode, please ensure your Browser is in standards mode.');
	}

	mJquery.fn[name] = function(settings) {
		return this.each(function() {
			prototype.create(this, settings);
		});
	};

	tick = function tick(interval) {
		var index,
			pointer = prototype._elements[interval];

		for(index in pointer) {
			if(pointer[index]._checkState !== undefined) {
				pointer[index]._checkState();
			}
		}

		if(pointer.length === 0) {
			window.clearInterval(prototype._intervals[interval]);

			delete prototype._intervals[interval];
		}
	};

	resize = function() {
		prototype._viewport.left   = 0;
		prototype._viewport.top    = 0;
		prototype._viewport.right  = $window.width();
		prototype._viewport.bottom = $window.height();
	};

	prototype = mPrototype.extend({
		_viewport:  { left: 0, top: 0, right: $window.width(), bottom: $window.height() },
		_intervals: {},
		_elements:  {},
		_constructor: function(element, settings) {
			var self = this;

			settings = mJquery.extend(true, {}, defaults, settings || {});

			if(settings.threshold === 'auto') {
				delete settings.threshold;
			}

			if(prototype._intervals[settings.interval] === undefined) {
				prototype._elements[settings.interval]  = prototype._elements[settings.interval] || { length: 0 };
				prototype._intervals[settings.interval] = window.setInterval(function() { tick(settings.interval); }, settings.interval);
			}

			self._element  = element;
			self._object   = mJquery(element);
			self._settings = settings;
			self._viewport = { left: 0, top: 0, right: 0, bottom: 0 };
			self._state    = false;
			self._priority = 2;
			self._uuid     = mUnique.uuid();

			prototype._elements[settings.interval][self._uuid] = self;
			prototype._elements[settings.interval].length++;

			$window.on(LISTENER_RESIZE, function() { self._onResize.call(self); });
			self._onResize();
		},
		_checkState: function() {
			var self     = this,
				state    = false,
				priority = 2,
				boundaries;

			if(self._object.is(':visible') && (self._element.style.visibility !== 'hidden' || self._settings.visibility === false)) {
				boundaries = self._element.getBoundingClientRect();

				if((boundaries.left >= self._viewport.left && boundaries.top >= self._viewport.top && boundaries.left <= self._viewport.right && boundaries.top <= self._viewport.bottom) || (boundaries.right >= self._viewport.left && boundaries.bottom >= self._viewport.top && boundaries.right <= self._viewport.right && boundaries.bottom <= self._viewport.bottom)) {
					if((boundaries.left >= prototype._viewport.left && boundaries.top >= prototype._viewport.top && boundaries.left <= prototype._viewport.right && boundaries.top <= prototype._viewport.bottom) || (boundaries.right >= prototype._viewport.left && boundaries.bottom >= prototype._viewport.top && boundaries.right <= prototype._viewport.right && boundaries.bottom <= prototype._viewport.bottom)) {
						priority = 1;
					}

					state = true;
				}
			}

			if(state !== self._state || priority !== self._priority) {
				self._state    = state;
				self._priority = priority;

				self._changeState();
			}
		},
		_changeState: function() {
			var self = this,
				event;

			if(self._settings.recur !== true) {
				self._remove();
			}

			if(self._state === true) {
				event = mJquery.Event(EVENT_EMERGED);

				event.priority = self._priority;
			} else {
				event = mJquery.Event(EVENT_DEMERGED);
			}

			self._object.trigger(event);
		},
		_remove: function() {
			var self = this;

			delete prototype._elements[self._settings.interval][self._uuid];
			prototype._elements[self._settings.interval].length--;
		},
		_onResize: function() {
			var self = this,
				x    = self._settings.threshold || $window.width() * self._settings.auto,
				y    = self._settings.threshold || $window.height() * self._settings.auto;

			self._viewport.left   = prototype._viewport.left - x;
			self._viewport.top    = prototype._viewport.top - y;
			self._viewport.right  = prototype._viewport.right + x;
			self._viewport.bottom = prototype._viewport.bottom + y;
		}
	});

	$window.on(LISTENER_RESIZE, resize);

	return prototype;
}, window));