odoo.define('website.tests', function (require) {
"use strict";

var FormView = require('web.FormView');
var testUtils = require("web.test_utils");

var createView = testUtils.createView;

QUnit.module('website', {
    before: function () {
        this.data = {
            blog_post: {
                fields: {
                    website_published: {string: "Available on the Website", type: "boolean"},
                },
                records: [{
                    id: 1,
                    website_published: false,
                }, {
                    id: 2,
                    website_published: true,
                }]
            }
        };
    },
}, function () {
    QUnit.test("widget website button: display false value", async function (assert) {
        assert.expect(2);

        var form = await createView({
            View: FormView,
            model: 'blog_post',
            data: this.data,
            arch:
                '<form>' +
                    '<sheet>' +
                        '<div class="oe_button_box" name="button_box">' +
                            '<button class="oe_stat_button" name="website_publish_button" type="object" icon="fa-globe">' +
                                '<field name="website_published" widget="website_button"/>' +
                            '</button>' +
                        '</div>' +
                    '</sheet>' +
                '</form>',
            res_id: 1,
        });
        var selector = '.oe_button_box .oe_stat_button .o_stat_info[name="website_published"] .o_stat_text';
        assert.containsN(form, selector, 2, "there should be two texts displayed");
        selector = '.oe_button_box .oe_stat_button .o_stat_info[name="website_published"] .o_stat_text.o_value.text-danger';
        assert.containsOnce(form, selector, "there should be one text in red");
        form.destroy();
    });
    QUnit.test("widget website button: display true value", async function (assert) {
        assert.expect(2);

        var form = await createView({
            View: FormView,
            model: 'blog_post',
            data: this.data,
            arch:
                '<form>' +
                    '<sheet>' +
                        '<div class="oe_button_box" name="button_box">' +
                            '<button class="oe_stat_button" name="website_publish_button" type="object" icon="fa-globe">' +
                                '<field name="website_published" widget="website_button"/>' +
                            '</button>' +
                        '</div>' +
                    '</sheet>' +
                '</form>',
            res_id: 2,
        });
        var selector = '.oe_button_box .oe_stat_button .o_stat_info[name="website_published"] .o_stat_text';
        assert.containsN(form, selector, 2, "should be two texts displayed");
        selector = '.oe_button_box .oe_stat_button .o_stat_info[name="website_published"] .o_stat_text.o_value.text-success';
        assert.containsOnce(form, selector, "there should be one text in green");
        form.destroy();
    });
});

});
