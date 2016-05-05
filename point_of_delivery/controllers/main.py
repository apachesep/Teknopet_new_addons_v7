import base64
import openerp.addons.web.http as oeweb
from openerp.addons.web.controllers.main import content_disposition
import openerp
from openerp.addons.web.controllers.main import manifest_list, module_boot, html_template

class PointOfDeliveryController(openerp.addons.web.http.Controller):
    _cp_path = '/pod'



    @openerp.addons.web.http.httprequest
    def app(self, req, s_action=None, **kw):

        template = html_template.replace('<html','<html manifest="/pod"')
        r = template % {
            'modules': simplejson.dumps(module_boot(req)),
            'init': 'var wc = new s.web.WebClient();wc.appendTo($(document.body));'
        }
        return r