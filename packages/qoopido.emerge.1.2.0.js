/*!
* Qoopido Emerge jQuery plugin
*
* Source:  Qoopido Emerge
* Version: 1.2.0
* Date:    2013-06-28
* Author:  Dirk Lüth <info@qoopido.com>
* Website: https://github.com/dlueth/qoopido.emerge
*
* Copyright (c) 2013 Dirk Lüth
*
* Licensed under the MIT and GPL license.
*  - http://www.opensource.org/licenses/mit-license.php
*  - http://www.gnu.org/copyleft/gpl.html
*/
;(function(pDefinition, pShim, window, document, undefined) {
	'use strict';

	pShim();

	var root       = 'qoopido',
		definition = function definition() {
			return initialize('base', pDefinition, arguments);
		},
		initialize = function initialize(pNamespace, pDefinition, pArgs, pSingleton) {
			var namespace = pNamespace.split('/'),
				id        = namespace[namespace.length - 1],
				pointer   = window[root] = window[root] || {},
				modules   = window[root].modules = window[root].modules || {};

			for(var i = 0; namespace[i + 1] !== undefined; i++) {
				pointer[namespace[i]] = pointer[namespace[i]] || {};

				pointer = pointer[namespace[i]];
			}

			namespace = namespace.join('/');

			[].push.apply(pArgs, [ namespace, window, document, undefined ]);

			return (pSingleton === true) ? (pointer[id] = modules[namespace] = pDefinition.apply(null, pArgs).create()) : (pointer[id] = modules[namespace] = pDefinition.apply(null, pArgs));
		};

	initialize('shared/module/initialize',
		function(module, namespace) {
			if(typeof define === 'function' && define.amd) {
				define(namespace, module);
			}

			return module;
		},
		[initialize]);

	if(typeof define === 'function' && define.amd) {
		define(definition);
	} else {
		definition();
	}
}(
	function(namespace, window, document, undefined) {
		'use strict';

		return {
			create: function create() {
				var instance = Object.create(this, Object.getOwnPropertyDescriptors(this));

				if(instance._constructor) {
					instance._constructor.apply(instance, arguments);
				}

				instance.create = instance.extend = undefined;

				return instance;
			},
			extend: function extend(properties) {
				properties         = properties || {};
				properties._parent = Object.create(this, Object.getOwnPropertyDescriptors(this));

				return Object.create(this, Object.getOwnPropertyDescriptors(properties));
			}
		};
	},
	function(undefined) {
		'use strict';

		var valueNull                       = null,
			stringFunction                  = 'function',
			stringObject                    = 'object',
			stringUndefined                 = 'undefined',
			stringHasOwnProperty            = 'hasOwnProperty',
			stringProto                     = '__proto__',
			stringPrototype                 = 'prototype',
			stringDefineProperty            = 'defineProperty',
			stringDefineProperties          = 'defineProperties',
			stringGetOwnPropertyDescriptor  = 'getOwnPropertyDescriptor',
			stringGetOwnPropertyDescriptors = 'getOwnPropertyDescriptors',
			stringGetOwnPropertyNames       = 'getOwnPropertyNames',
			pointerObjectPrototype          = Object[stringPrototype],
			supportsProto                   = (pointerObjectPrototype[stringProto] === valueNull),
			supportsAccessors               = pointerObjectPrototype[stringHasOwnProperty]('__defineGetter__'),
			fallbackDefineProperty, fallbackDefineProperties, fallbackGetOwnPropertyDescriptor;

		function Blueprint() {}
		function checkDefineProperty(object) { try { Object[stringDefineProperty](object, 'sentinel', {}); return ('sentinel' in object); } catch (exception) {}}
		function checkGetOwnPropertyDescriptor(object) { try { object.sentinel = 0; return (Object[stringGetOwnPropertyDescriptor](object, 'sentinel').value === 0); } catch (exception) {}}

		if(!Object.keys) {
			var buggy   = true,
				exclude = [	'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor' ],
				key;

			for(key in { 'toString': valueNull }) {
				buggy = false;
			}

			Object.keys = function keys(object) {
				var result = [],
					name;

				if((typeof object !== stringObject && typeof object !== stringFunction) || object === valueNull) {
					throw new TypeError('Object.keys called on a non-object');
				}

				for(name in object) {
					if(object[stringHasOwnProperty](name)) {
						result.push(name);
					}
				}

				if(buggy === true) {
					var i;

					for(i = 0; (name = exclude[i]) !== undefined; i++) {
						if(object[stringHasOwnProperty](name)) {
							result.push(name);
						}
					}
				}

				return result;
			};
		}

		if(Object[stringDefineProperty]) {
			if(!(checkDefineProperty({})) || !(typeof document === stringUndefined || checkDefineProperty(document.createElement('div')))) {
				fallbackDefineProperty   = Object[stringDefineProperty];
				fallbackDefineProperties = Object[stringDefineProperties];
			}

			if(!(checkGetOwnPropertyDescriptor({})) || !(typeof document === stringUndefined || checkGetOwnPropertyDescriptor(document.createElement('div')))) {
				fallbackGetOwnPropertyDescriptor = Object[stringGetOwnPropertyDescriptor];
			}
		}

		if(!Object[stringDefineProperty] || fallbackDefineProperty !== valueNull) {
			Object[stringDefineProperty] = function defineProperty(object, property, descriptor) {
				if((typeof object !== stringObject && typeof object !== stringFunction) || object === valueNull) {
					throw new TypeError('Object[stringDefineProperty] called on non-object: ' + object);
				}

				if((typeof descriptor !== stringObject && typeof descriptor !== stringFunction) || descriptor === valueNull) {
					throw new TypeError('Property description must be an object: ' + descriptor);
				}

				if(fallbackDefineProperty !== valueNull) {
					try {
						return fallbackDefineProperty.call(Object, object, property, descriptor);
					} catch (exception) {}
				}

				if(descriptor[stringHasOwnProperty]('value')) {
					if(supportsAccessors && (object.__lookupGetter__(property) || object.__lookupSetter__(property))) {
						var prototype = object[stringProto];

						object[stringProto] = pointerObjectPrototype;

						delete object[property];

						object[property] = descriptor.value;

						object[stringProto] = prototype;
					} else {
						object[property] = descriptor.value;
					}
				} else {
					if(supportsAccessors === false) {
						throw new TypeError('getters & setters can not be defined on this javascript engine');
					}

					if(descriptor[stringHasOwnProperty]('get')) {
						object.__defineGetter__(property, descriptor.get);
					}

					if(descriptor[stringHasOwnProperty]('set')) {
						object.__defineSetter__(property, descriptor.set);
					}
				}

				return object;
			};
		}

		if(!Object[stringDefineProperties] || fallbackDefineProperties !== valueNull) {
			Object[stringDefineProperties] = function defineProperties(object, properties) {
				var property;

				if(fallbackDefineProperties) {
					try {
						return fallbackDefineProperties.call(Object, object, properties);
					} catch (exception) {}
				}

				for(property in properties) {
					if(properties[stringHasOwnProperty](property) && property !== '__proto__') {
						Object[stringDefineProperty](object, property, properties[property]);
					}
				}

				return object;
			};
		}

		if(!Object[stringGetOwnPropertyDescriptor] || fallbackGetOwnPropertyDescriptor !== valueNull) {
			Object[stringGetOwnPropertyDescriptor] = function getOwnPropertyDescriptor(object, property) {
				var descriptor =  { enumerable: true, configurable: true };

				if((typeof object !== stringObject && typeof object !== stringFunction) || object === valueNull) {
					throw new TypeError('Object[stringGetOwnPropertyDescriptor] called on non-object: ' + object);
				}

				if(fallbackGetOwnPropertyDescriptor !== valueNull) {
					try {
						return fallbackGetOwnPropertyDescriptor.call(Object, object, property);
					} catch (exception) {}
				}

				if(!object[stringHasOwnProperty](property)) {
					return;
				}

				if(supportsAccessors === true) {
					var prototype = object[stringProto],
						getter, setter;

					object[stringProto] = pointerObjectPrototype;

					getter = object.__lookupGetter__(property);
					setter = object.__lookupSetter__(property);

					object[stringProto] = prototype;

					if(getter || setter) {
						if(getter) {
							descriptor.get = getter;
						}

						if(setter) {
							descriptor.set = setter;
						}

						return descriptor;
					}
				}

				descriptor.value    = object[property];
				descriptor.writable = true;

				return descriptor;
			};
		}

		if(!Object[stringGetOwnPropertyDescriptors]) {
			Object[stringGetOwnPropertyDescriptors] = function(object) {
				var descriptors = {},
					propertiers = Object[stringGetOwnPropertyNames](object),
					i, property;

				for(i = 0; (property = propertiers[i]) !== undefined; i++) {
					descriptors[property] = Object[stringGetOwnPropertyDescriptor](object, property);
				}

				return descriptors;
			};
		}

		if(!Object[stringGetOwnPropertyNames]) {
			Object[stringGetOwnPropertyNames] = function getOwnPropertyNames(object) {
				return Object.keys(object);
			};
		}

		if(!Object.create) {
			var createEmpty;

			if(supportsProto || typeof document === stringUndefined) {
				createEmpty = function() { return { '__proto__': valueNull }; };
			} else {
				createEmpty = function() {
					var iframe = document.createElement('iframe'),
						parent = document.body || document.documentElement,
						empty;

					iframe.style.display = 'none';
					parent.appendChild(iframe);
					iframe.src = 'javascript:';

					empty = iframe.contentWindow.pointerObjectPrototype;

					delete empty.constructor;
					delete empty.hasOwnProperty;
					delete empty.propertyIsEnumerable;
					delete empty.isPrototypeOf;
					delete empty.toLocaleString;
					delete empty.toString;
					delete empty.valueOf;
					empty[stringProto] = valueNull;

					parent.removeChild(iframe);
					iframe = valueNull;

					Blueprint[stringPrototype] = empty;

					createEmpty = function () {
						return new Blueprint();
					};

					return new Blueprint();
				};
			}

			Object.create = function create(prototype, properties) {
				var object;

				function Type() {}

				if(prototype === valueNull) {
					object = createEmpty();
				} else {
					if(typeof prototype !== stringObject && typeof prototype !== stringFunction) {
						throw new TypeError('Object prototype may only be an Object or null');
					}

					Type[stringPrototype] = prototype;

					object = new Type();
					object[stringProto] = prototype;
				}

				if(properties !== void 0) {
					Object[stringDefineProperties](object, properties);
				}

				return object;
			};
		}
	},
	window, document
));
;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('unique', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ './base' ], definition);
	} else {
		definition(window.qoopido.base);
	}
}(function(mPrototype, namespace, window, document, undefined) {
	'use strict';

	var result, x, i,
		lookup     = { uuid: { }, string: { } },
		characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	function generateUuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = (c === 'x') ? r : (r & 0x3 | 0x8);

			return v.toString(16);
		});
	}

	function generateString(length) {
		length = parseInt(length, 10) || 12;
		result = '';

		for(i = 0; i < length; i++) {
			result += characters[parseInt(Math.random() * (characters.length - 1), 10)];
		}

		return result;
	}

	return mPrototype.extend({
		uuid: function uuid() {
			do {
				result = generateUuid();
			} while(typeof lookup.uuid[result] !== 'undefined');

			lookup.uuid[result] = true;

			return result;
		},
		string: function string(length) {
			do {
				result = generateString(length);
			} while(typeof lookup.string[result] !== 'undefined');

			lookup.string[result] = true;

			return result;
		}
	});
}, window));
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