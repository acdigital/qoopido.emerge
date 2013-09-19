** I re-integrated Emerge into my Qoopido.js library, so this repo will become obsolet!!! **

Qoopido Emerge
===========================
jQuery plugin to react on elements entering or nearing the visible area.


installation & usage
---------------------------
Download and extract the ZIP file of the emerge package from [here](https://github.com/dlueth/qoopido.emerge/blob/master/packages/qoopido.emerge.zip?raw=true) and put the contents somewhere onto your webspace.

Finally add jQuery and qoopido.emerge.min.js to your script block and you are all set.

Example Javascript:
```javascript
<script type="text/javascript">
;(function($, window, document, undefined) {
    'use strict';

    $(document).ready(function() {
        $('#footer img')
            .on('emerged.emerge', function(event) {
                // do something when the element emerges
            })
            .on('demerged.emerge', function(event) {
				// do something when the element demerges
			})
        .emerge({
        	interval:   20,     // default
        	threshold:  'auto', // default
        	recur:      true,   // default
        	auto:       0.5,    // default (meaning 0.5 * screen width/height threshold)
        	visibility: true    // default
		});
    });
})(jQuery, window, document);
</script>
```
