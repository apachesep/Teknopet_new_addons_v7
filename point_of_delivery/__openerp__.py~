# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2004-2014 Browseinfo (<http://browseinfo.in>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################


{
    'name': 'Point of Delivery',
    'version': '1.0.1',
    'category': 'Point Of Delivery',
    'sequence': 6,
    'summery':"Touchscreen interface for Delivery.",
    'author': 'Browseinfo',
    'depends':['web','stock','sale','mrp_partial'],
    'js': ['static/src/js/delivery_scrollbar.js',
           'static/src/js/main_delivery.js',
           'static/src/js/models_delivery.js',
           'static/src/js/screen_delivery.js',
           'static/src/js/screens_delivery.js',
           ],
    'data': [
             'wizard/pod_view.xml',
             'menuitem_delivery.xml',
             'point_of_delivery_data.xml',
             ],
    'css': [
        'static/src/css/pod.css', # this is the default css with hover effects
        'static/src/css/keyboard.css'],
    'qweb': ['static/src/xml/pod.xml'],
    'auto_install': False,
    'installable': True,
    'application': True,
}

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
