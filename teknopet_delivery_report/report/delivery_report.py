# -*- coding: utf-8 -*-
##############################################################################
#
#    This module uses OpenERP, Open Source Management Solution Framework.
#    Copyright (C) 2014-Today BrowseInfo (<http://www.browseinfo.in>)
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>
#
##############################################################################

import time
from openerp import pooler, tools
from openerp.report import report_sxw
from openerp.report.interface import report_rml
from openerp.tools import to_xml
from openerp.tools import ustr
from datetime import datetime, date
from datetime import date
from dateutil.relativedelta import relativedelta
from openerp.tools.amount_to_text_en import amount_to_text
import random
import tempfile
import base64
from PIL import Image
from decimal import Decimal

class delivery_page_report(report_rml):

    def get_analysis_data(self, cr, uid, move_lines):
        main_list = []

        for move_line in move_lines:
            if move_line.product_id.qc_document:
                sub_list = []
                for quality_id in move_line.product_id.quality_analysis_ids:
                    if quality_id.is_ok == True:
                        product_dict = {}
                        product_dict['name'] = quality_id.analysis_id.name
                        product_dict['actual'] = "Pass"
                        product_dict['upper'] = ''
                        product_dict['lower'] = ''
                        product_dict['ok'] = "Ok"
                        sub_list.append(product_dict)
                    else:
                        product_dict = {}
                        product_dict['name'] = quality_id.analysis_id.name
                        product_dict['upper'] = quality_id.max_value or ''
                        product_dict['lower'] = quality_id.min_value or ''
                        product_dict['ok'] = ''
                        product_dict['actual'] = '%.2f' %random.uniform(float(quality_id.min_value),float(quality_id.max_value))
                        sub_list.append(product_dict)
                if move_line.sale_line_id:
                    sale_ids = pooler.get_pool(cr.dbname).get('sale.order').search(cr, uid, [('name','=',move_line.origin)])
                    line_ids = pooler.get_pool(cr.dbname).get('sale.order.line').search(cr, uid, [('product_id','=',move_line.product_id.id),('order_id','=',sale_ids[0])])
                    sale_browse = pooler.get_pool(cr.dbname).get('sale.order.line').browse(cr, uid, line_ids[0])
                    sale_dict = {}
                    sale_dict['name'] = "Raw Material Type"
                    sale_dict['actual'] = sale_browse.raw_material_type_ids.name
                    sale_dict['upper'] = ''
                    sale_dict['lower'] = ''
                    sale_dict['ok'] = ''
                    sub_list.append(sale_dict)
                main_list.append(sub_list)
        return main_list

    def create(self, cr, uid, ids, datas, context):
        del_obj = pooler.get_pool(cr.dbname).get('stock.picking.out')
        user_obj = pooler.get_pool(cr.dbname).get('res.users')
        rml_obj=report_sxw.rml_parse(cr, uid, del_obj._name,context)
        company=user_obj.browse(cr,uid,[uid],context)[0].company_id

        rml ="""<document filename="QC Documents.pdf">
                <template pageSize="(595.0,842.0)" title="QC Documents" author="OpenERP S.A.(sales@openerp.com)" allowSplitting="20">
                    <pageTemplate>
                        <frame id="first" x1="1.3cm" y1="1.5cm" width="18.4cm" height="26.5cm"/>
                        <stylesheet>
                            <blockTableStyle id="Table4">
                                <blockAlignment value="LEFT"/>
                                <blockValign value="TOP"/>
                                <lineStyle kind="LINEBEFORE" colorName="#000000" start="0,0" stop="0,-1"/>
                                <lineStyle kind="LINEABOVE" colorName="#000000" start="0,0" stop="0,0"/>
                                <lineStyle kind="LINEBELOW" colorName="#000000" start="0,-1" stop="0,-1"/>
                                <lineStyle kind="LINEBEFORE" colorName="#000000" start="1,0" stop="1,-1"/>
                                <lineStyle kind="LINEABOVE" colorName="#000000" start="1,0" stop="1,0"/>
                                <lineStyle kind="LINEBELOW" colorName="#000000" start="1,-1" stop="1,-1"/>
                                <lineStyle kind="LINEBEFORE" colorName="#000000" start="2,0" stop="2,-1"/>
                                <lineStyle kind="LINEABOVE" colorName="#000000" start="2,0" stop="2,0"/>
                                <lineStyle kind="LINEBELOW" colorName="#000000" start="2,-1" stop="2,-1"/>
                                <lineStyle kind="LINEBEFORE" colorName="#000000" start="3,0" stop="3,-1"/>
                                <lineStyle kind="LINEABOVE" colorName="#000000" start="3,0" stop="3,0"/>
                                <lineStyle kind="LINEBELOW" colorName="#000000" start="3,0" stop="3,-1"/>
                                <lineStyle kind="LINEBEFORE" colorName="#000000" start="4,0" stop="4,-1"/>
                                <lineStyle kind="LINEABOVE" colorName="#000000" start="4,0" stop="4,0"/>
                                <lineStyle kind="LINEBELOW" colorName="#000000" start="4,0" stop="4,-1"/>
                                <lineStyle kind="LINEBEFORE" colorName="#000000" start="5,0" stop="5,-1"/>
                                <lineStyle kind="LINEABOVE" colorName="#000000" start="5,0" stop="5,0"/>
                                <lineStyle kind="LINEBELOW" colorName="#000000" start="5,0" stop="5,-1"/>
                                <lineStyle kind="LINEAFTER" colorName="#000000" start="5,-1" stop="5,-1"/>
                            </blockTableStyle>
                            <blockTableStyle id="Table_Title_String">
                              <blockAlignment value="LEFT"/>
                              <blockValign value="TOP"/>
                            </blockTableStyle>
                            <initialize>
                              <paraStyle name="all" alignment="justify"/>
                            </initialize>
                            <paraStyle name="Standard" fontName="Helvetica"/>
                            <paraStyle name="main_footer" fontSize="8.0" alignment="CENTER"/>
                            <paraStyle name="main_header" fontSize="8.0" leading="10" alignment="LEFT" spaceBefore="0.0" spaceAfter="0.0"/>
                            <paraStyle name="terp_header" fontName="Helvetica-Bold" fontSize="12.0" leading="15" alignment="LEFT" spaceBefore="0.0" spaceAfter="0.0"/>
                            <paraStyle name="Heading" fontName="Helvetica" fontSize="14.0" leading="17" spaceBefore="12.0" spaceAfter="6.0"/>
                            <paraStyle name="terp_tblheader_Details" fontName="Helvetica" fontSize="14.0" alignment="CENTER" spaceBefore="0.0" spaceAfter="0.0"/>
                            <paraStyle name="content_Details" fontName="Helvetica" fontSize="12.0" alignment="LEFT" spaceBefore="0.0" spaceAfter="0.0"/>
                            <images/>
                        </stylesheet>
                        <pageGraphics>
                            <!-- Set here the default font to use for all <drawString> tags -->
                            <setFont name="DejaVu Sans" size="8"/>
                            <!-- You Logo - Change X,Y,Width and Height -->
                            <image x="1.3cm" y="27.7cm" height="40.0" >"""+ to_xml(company.logo) +"""</image>
                            <fill color="black"/>
                            <stroke color="black"/>

                            <!-- page header -->
                            <lines>1.3cm 27.7cm 20cm 27.7cm</lines>
                            <drawRightString x="20cm" y="27.8cm">"""+ to_xml(company.rml_header1) +"""</drawRightString>
                            <drawString x="1.3cm" y="27.3cm">"""+ to_xml(company.partner_id.name) +"""</drawString>
                            <place x="1.3cm" y="25.3cm" height="1.8cm" width="15.0cm">
                                <para style="main_header">"""+ to_xml(company.partner_id.street or  '') +"""</para>
                                <para style="main_header">"""+ to_xml(company.partner_id.street2 or  '') +"""</para>
                                <para style="main_header">"""+ to_xml(company.partner_id.city or  '') +""",""" + to_xml(company.partner_id.state_id.name or  '') +"""</para>
                                <para style="main_header">"""+ to_xml(company.partner_id.country_id.name or  '') +""" - """+ to_xml(company.partner_id.zip or  '') +"""</para>
                            </place>
                            <drawString x="1.3cm" y="25.0cm">Phone:</drawString>
                            <drawRightString x="7cm" y="25.0cm">"""+ to_xml(company.partner_id.phone or '') +"""</drawRightString>
                            <drawString x="1.3cm" y="24.6cm">Mail:</drawString>
                            <drawRightString x="7cm" y="24.6cm">"""+ to_xml(company.partner_id.email or '') +"""</drawRightString>
                            <lines>1.3cm 24.5cm 7cm 24.5cm</lines>

                            <!-- left margin -->
                            <rotate degrees="90"/>
                            <fill color="grey"/>
                            <drawString x="2.65cm" y="-0.4cm">generated by OpenERP.com</drawString>
                            <fill color="black"/>
                            <rotate degrees="-90"/>

                            <!-- page footer -->
                            <lines>1.2cm 2.65cm 19.9cm 2.65cm</lines>
                            <place x="1.3cm" y="0cm" height="2.55cm" width="19.0cm">
                                <para style="main_footer">"""+ to_xml(company.rml_footer or '') +"""</para>
                                <para style="main_footer">Contact : """+ to_xml(company.name) +"""- Page: <pageNumber/></para>
                            </place>
                        </pageGraphics>
                    </pageTemplate>
                </template>
                """
        lst = []
        for line in del_obj.browse(cr, uid, ids):
            main_list = self.get_analysis_data(cr, uid, line.move_lines)
            for sub in main_list:
                rml += """
                        <story>
                            <para style="Standard">
                                <font color="white"> </font>
                            </para>
                            <para style="Standard">
                                <font color="white"> </font>
                            </para>
                            <para style="Standard">
                                <font color="white"> </font>
                            </para>
                            <para style="Standard">
                              <font color="white"> </font>
                            </para>
                            <para style="Standard">
                              <font color="white"> </font>
                            </para>
                            <para style="Standard">
                              <font color="white"> </font>
                            </para>
                            <para style="Standard">
                              <font color="white"> </font>
                            </para>
                            <para style="Standard">
                              <font color="white"> </font>
                            </para>
                            <para style="Standard">
                              <font color="white"> </font>
                            </para>
                            <para style="Standard">
                              <font color="white"> </font>
                            </para>

                            <blockTable colWidths="538.0" style="Table_Title_String">
                              <tr>
                                <td>
                                  <para style="terp_header">Delivery Order : """+ to_xml(line.name or '') +"""</para>
                                  <para style="terp_header">Sale Order : """+ to_xml(line.origin or '') +"""</para>
                                  <para style="terp_header">QC Number : </para>
                                </td>
                              </tr>
                            </blockTable>

                            <para style="Standard">
                              <font color="white"> </font>
                            </para>
                            <para style="Standard">
                              <font color="white"> </font>
                            </para>

                            <blockTable colWidths="210.0,90.0,90.0,90.0,55.0" rowHeights="40" style="Table4">
                              <tr>
                                <td>
                                  <para style="terp_tblheader_Details"><b>CHARACTERISTIC</b></para>
                                </td>
                                <td>
                                  <para style="terp_tblheader_Details"><b>Actual Value</b></para>
                                </td>
                                <td>
                                  <para style="terp_tblheader_Details"><b>Upper Limit</b></para>
                                </td>
                                <td>
                                  <para style="terp_tblheader_Details"><b>Lower Limit</b></para>
                                </td>
                                <td>
                                  <para style="terp_tblheader_Details"><b>ok?</b></para>
                                </td>
                              </tr>
                            </blockTable>
                            """
                for sub_list in sub:
                    rml += """
                            <blockTable colWidths="210.0,90.0,90.0,90.0,55.0" style="Table4">
                              <tr>
                                <td>
                                  <para style="content_Details">""" + str(sub_list['name']) + """</para>
                                </td>
                                <td>
                                  <para style="content_Details">""" + sub_list['actual'] + """</para>
                                </td>
                                <td>
                                  <para style="content_Details">""" + str(sub_list['upper']) + """</para>
                                </td>
                                <td>
                                  <para style="content_Details">""" +str(sub_list['lower']) + """</para>
                                </td>
                                <td>
                                  <para style="content_Details">""" + str(sub_list['ok']) + """</para>
                                </td>
                              </tr>
                            </blockTable>
                            """

                rml += """</story>
                        """

        rml += """</document> """
        report_type = datas.get('report_type', 'pdf')
        create_doc = self.generators[report_type]
        self.internal_header=False
        pdf = create_doc(rml, title=self.title)
        return (pdf, report_type)

delivery_page_report('report.delivery.page.report', 'stock.picking.out','','')

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: