from openerp.osv import osv, fields

class product_quality_analysis(osv.osv):
    _name = "product.quality.analysis"
    _columns = {
        'qc_document' : fields.boolean('Generate QC Documents?'),
        'product_id' : fields.many2one('product.product', 'Product Name', required=True),
        'quality_analysis_ids' : fields.one2many('quality.analysis','prod_qua_ana_id','Quality Analysis'),
    }

class quality_analysis(osv.osv):
    _name = "quality.analysis"
    _rec_name = "analysis_id"
    _columns = {
        'prod_qua_ana_id' : fields.many2one('product.quality.analysis', 'Product Quality Analysis'),
        'analysis_id' : fields.many2one('analysis.name', 'Name', required=True),
        'is_text' : fields.boolean('Is Text'),
        'text_value' : fields.char('Text Value'),
        'min_value' : fields.float('Min Value'),
        'max_value' : fields.float('Max Value'),
        'is_ok' : fields.boolean('Pass'),
    }

class analysis_name(osv.osv):
    _name = "analysis.name"
    _columns = {
        'name' : fields.char('Analysis Name',translate=True, required=True)
    }

class raw_material_type_name(osv.osv):
    _name = "raw.material.type.name"
    _columns = {
        'name' : fields.char('Raw Material Type', translate=True, required=True)
    }

class sale_order_line(osv.osv):
    _inherit = "sale.order.line"
    _columns = {
        'raw_material_type_id' : fields.many2one('raw.material.type.name','Raw Material Type', required=True)
    }
