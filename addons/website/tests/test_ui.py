# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

import odoo
import odoo.tests


@odoo.tests.tagged('-at_install', 'post_install')
class TestUiHtmlEditor(odoo.tests.HttpCase):
    def test_html_editor_multiple_templates(self):
        Website = self.env['website']
        View = self.env['ir.ui.view']
        generic_aboutus = Website.viewref('website.aboutus')
        # Use an empty page layout with oe_structure id for this test
        oe_structure_layout = '''
            <t name="About us" t-name="website.aboutus">
                <t t-call="website.layout">
                    <p>aboutus</p>
                    <div id="oe_structure_test_ui" class="oe_structure oe_empty"/>
                </t>
            </t>
        '''
        generic_aboutus.arch = oe_structure_layout
        self.start_tour("/", 'html_editor_multiple_templates', login='admin')
        self.assertEqual(View.search_count([('key', '=', 'website.aboutus')]), 2, "Aboutus view should have been COW'd")
        self.assertTrue(generic_aboutus.arch == oe_structure_layout, "Generic Aboutus view should be untouched")
        self.assertEqual(len(generic_aboutus.inherit_children_ids.filtered(lambda v: 'oe_structure' in v.name)), 0, "oe_structure view should have been deleted when aboutus was COW")
        specific_aboutus = Website.with_context(website_id=1).viewref('website.aboutus')
        self.assertTrue(specific_aboutus.arch != oe_structure_layout, "Specific Aboutus view should have been changed")
        self.assertEqual(len(specific_aboutus.inherit_children_ids.filtered(lambda v: 'oe_structure' in v.name)), 1, "oe_structure view should have been created on the specific tree")

    def test_html_editor_scss(self):
        self.start_tour("/", 'test_html_editor_scss', login='admin')


class TestUiTranslate(odoo.tests.HttpCase):
    def test_admin_tour_rte_translator(self):
        self.start_tour("/", 'rte_translator', login='admin', timeout=120)


@odoo.tests.common.tagged('post_install', '-at_install')
class TestUi(odoo.tests.HttpCase):

    def test_01_public_homepage(self):
        self.phantom_js("/", "console.log('test successful')", "'website.content.snippets.animation' in odoo.__DEBUG__.services")

    def test_02_admin_tour_banner(self):
        self.start_tour("/", 'banner', login='admin')

    def test_03_restricted_editor(self):
        self.restricted_editor = self.env['res.users'].create({
            'name': 'Restricted Editor',
            'login': 'restricted',
            'password': 'restricted',
            'groups_id': [(6, 0, [
                    self.ref('base.group_user'),
                    self.ref('website.group_website_publisher')
                ])]
        })
        self.start_tour("/", 'restricted_editor', login='restricted')
