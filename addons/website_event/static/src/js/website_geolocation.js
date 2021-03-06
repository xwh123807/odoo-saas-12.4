odoo.define('website_event.geolocation', function (require) {
'use strict';

var publicWidget = require('web.public.widget');

publicWidget.registry.visitor = publicWidget.Widget.extend({
    selector: ".oe_country_events, .country_events",

    /**
     * @override
     */
    start: function () {
        var defs = [this._super.apply(this, arguments)];
        var self = this;
        defs.push(this._rpc({route: '/event/get_country_event_list'}).then(function (data) {
            if (data) {
                self.$('.country_events_list').replaceWith(data);
            }
        }));
        return Promise.all(defs);
    },
});
});
