(function(e,t){"use strict";var n=function n(){return t.qoopido.shared.module.initialize("proximity",e,arguments)};"function"==typeof define&&define.amd?define(["./base"],n):n(t.qoopido.base)})(function(e,t,n,r,o){"use strict";return e.extend({calculate:function(e,t){var n=!1;return e="object"==typeof e&&null!==e?e:{x:o,y:o},t="object"==typeof t&&null!==t?t:{x:o,y:o},e.x!==o&&e.y!==o&&t.x!==o&&t.y!==o&&(e.x=parseFloat(e.x),e.y=parseFloat(e.y),t.x=parseFloat(t.x),t.y=parseFloat(t.y),n={x:parseFloat(Math.abs(t.x-e.x)),y:parseFloat(Math.abs(t.y-e.y)),total:parseFloat(Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)))}),n}})},window);