# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2004-2010 Tiny SPRL (<http://tiny.be>).
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

from openerp.osv import fields, osv

class stock_inventory_line_split(osv.osv_memory):
    _inherit = "stock.move.split"


    def split_custom(self,cr,uid,ids,prodlot_list,bar_list,data,context=None):
        for i in data:
            print"in looopppp product",data[i]['product_id']
            split_dict = {
                    'product_id':data[i]['product_id'],
                    'use_exist':True,
                    'product_uom':data[i]['product_uom'],
                    'location_id':data[i]['location_id'],
                    'qty':data[i]['product_quantity'],
                }
            print 'malllllllllloooooo wizard',split_dict
            stock_move_split_id = self.pool.get('stock.move.split').create(cr,uid,split_dict,context)
            print "createddddd idddd",stock_move_split_id
            for prodlot in prodlot_list:
                product_quantity = self.pool.get('stock.production.lot').browse(cr ,uid,int(prodlot),context).stock_available
                product_id = self.pool.get('stock.production.lot').browse(cr ,uid,int(prodlot),context).product_id
                print "hasdkhasdhkasdhhkshadline+++++++",product_quantity,prodlot
                if (int(product_id) == int(data[i]['product_id'])):
                    lines_dict = {
                                'prodlot_id':prodlot,
                                'wizard_exist_id':stock_move_split_id,
                                'quantity':product_quantity,
                    }
                    stock_split_line_id = self.pool.get('stock.move.split.lines').create(cr,uid,lines_dict,context)
                    print "createddddd stock_split_line_id",stock_split_line_id

            
            context = {'active_model':'stock.move'}
            meth = self.pool.get('stock.move.split').split(cr, uid,[int(stock_move_split_id)],[int(i)],context)
            print "methhhhhhhhhhhhhhhhhhhhhhhhheeeereeeeeee",meth
        move_ids = self.pool.get('stock.move').search(cr, uid, [('picking_id', '=', int(ids[0]))])
        move_dict = {}
        for j in move_ids:
            move_obj = self.pool.get('stock.move').browse(cr , uid, int(j) ,context)
            if move_obj.prodlot_id.id:
                strMoveName = "move" + str(j)
                dict_pro = {
                            'product_id':move_obj.product_id.id,'prodlot_id':move_obj.prodlot_id.id,'product_uom':move_obj.product_uom.id,'product_qty':move_obj.product_qty,
                            }
                move_dict[strMoveName] = dict_pro
        print"++++++++++++++++++++DDDDDDDDDDDDDDDDDDDDDDDDD+++++++++++++++",move_dict
        return move_dict


class stock_picking_line_partial(osv.osv):
    _inherit = "stock.picking"


    def do_partial_custom(self,cr,uid,ids,value,context=None):
        context={'default_type':'out'}
        print "method py calll+++++++++++++++++++++++++",context,value
        return self.pool.get('stock.picking').do_partial(cr,uid,ids,value,context=context)


class stock_move(osv.osv):
    _inherit= "stock.move"
    _columns = {
        'raw_material_type_name': fields.many2one('raw.material.type.name', 'Raw material type', required=True),
	}


class sale_order(osv.osv):
    _inherit= "sale.order"

    def _prepare_order_line_move(self, cr, uid, order, line, picking_id, date_planned, context=None):
        location_id = order.shop_id.warehouse_id.lot_stock_id.id
	print "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ sale.order ======"
        output_id = order.shop_id.warehouse_id.lot_output_id.id
        return {
            'name': line.name,
            'picking_id': picking_id,
            'product_id': line.product_id.id,
            'date': date_planned,
            'date_expected': date_planned,
            'product_qty': line.product_uom_qty,
            'product_uom': line.product_uom.id,
            'product_uos_qty': (line.product_uos and line.product_uos_qty) or line.product_uom_qty,
            'product_uos': (line.product_uos and line.product_uos.id)\
                    or line.product_uom.id,
            'product_packaging': line.product_packaging.id,
            'partner_id': line.address_allotment_id.id or order.partner_shipping_id.id,
            'location_id': location_id,
            'location_dest_id': output_id,
            'sale_line_id': line.id,
            'tracking_id': False,
            'state': 'draft',
            #'state': 'waiting',
            'company_id': order.company_id.id,
            'price_unit': line.product_id.standard_price or 0.0,
	    'raw_material_type_name':line.raw_material_type_id and line.raw_material_type_id.id or False, 
        }

