odoo.define('website_forum.editor', function (require) {
"use strict";

var core = require('web.core');
var WebsiteNewMenu = require('website.newMenu');
var wUtils = require('website.utils');

var _t = core._t;

WebsiteNewMenu.include({
    actions: _.extend({}, WebsiteNewMenu.prototype.actions || {}, {
        new_forum: '_createNewForum',
    }),

    //--------------------------------------------------------------------------
    // Actions
    //--------------------------------------------------------------------------

    /**
     * Asks the user information about a new forum to create, then creates it
     * and redirects the user to this new forum.
     *
     * @private
     * @returns {Promise} Unresolved if there is a redirection
     */
    _createNewForum: function () {
        var self = this;
        return wUtils.prompt({
            id: "editor_new_forum",
            window_title: _t("New Forum"),
            input: _t("Forum Name"),
            init: function () {
                var $group = this.$dialog.find("div.form-group");
                $group.removeClass("mb0");

                var $add = $(
                    '<div class="form-group mb0">'+
                        '<label class="offset-md-3 col-md-9 text-left">'+
                        '    <input type="checkbox" required="required"/> '+
                        '</label>'+
                    '</div>');
                $add.find('label').append(_t("Add to menu"));
                $group.after($add);
            }
        }).then(function (result) {
            var forum_name = result.val;
            var $dialog = result.dialog;
            if (!forum_name) {
                return;
            }
            var add_menu = ($dialog.find('input[type="checkbox"]').is(':checked'));
            return self._rpc({
                route: '/forum/new',
                params: {
                    forum_name: forum_name,
                    add_menu: add_menu || "",
                },
            }).then(function (url) {
                window.location.href = url;
                return new Promise(function () {});
            });
        });
    },
});
});
