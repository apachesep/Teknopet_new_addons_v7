#!/usr/bin/env python

from openerp import netsvc
from openerp.osv import osv, fields
from openerp.tools.translate import _



class pod_session_opening(osv.osv_memory):
    _name = 'pod.session.opening'


    def open_session_cbd(self, cr, uid, ids, context=None):
        print"sdbsdbsdhfbsjdfbjsdbjfbsjdfbjsdbfjbsjdfbjsdfjbsdjfbj",context
        context.update({'active_id': 1})
        context.update({'pos_session_id': 1})
        print "connnnnnttttt",context
        return {
                'type' : 'ir.actions.client',
                'name':_('Start Point of Delivery'),
                'tag':'pod.ui',
                'context' : context,
        }

pod_session_opening()
