function openerp_pod_models(instance, module){ //module is instance.point_of_sale
    var QWeb = instance.web.qweb;

    var round_di = instance.web.round_decimals;
    var round_pr = instance.web.round_precision


    module.PodModel = Backbone.Model.extend({
        initialize: function(session, attributes) {
            Backbone.Model.prototype.initialize.call(this, attributes);
            var  self = this;
            this.session = session;
            this.ready = $.Deferred();                          // used to notify the GUI that the PodModel has loaded all resources
            this.flush_mutex = new $.Mutex();                   // used to make sure the orders are sent to the server once at time

            this.debug = jQuery.deparam(jQuery.param.querystring()).debug !== undefined;    //debug mode

            // default attributes values. If null, it will be loaded below.
            this.set({
                'nbr_pending_operations': 0,
                'currency':         {symbol: '$', podition: 'after'},
                'company':          null,
                'user':             null,
                'users':  			null,		 // the user that loaded the pod
                'user_list':        null,   // list of all users
                'partner_list':     null,   // list of all partners with an ean
                'cashier':          null,   // the logged cashier, if different from user
				'delivery':         null,
				'partner_res':		null,
				'moves':			null,
                'production':       null,
				'orders':           new module.OrderCollection(),
                'bank_statements':  null,
                'taxes':            null,
                'pod_session':      null,
                'pod_config':       null,
                'units':            null,
                'units_by_id':      null,
                'pricelist':        null,
                'selectedOrder':    null,
                'moves_2':			null,
                'mo_list':			null,
				'sol_list':			null,
            });


            // We fetch the backend data on the server asynchronously. this is done only when the pod user interface is launched,
            // Any change on this data made on the server is thus not reflected on the point of sale until it is relaunched.
            // when all the data has loaded, we compute some stuff, and declare the pod ready to be used.
            $.when(this.load_server_data())
               .done(function(){
                   //self.log_loaded_data(); //Uncomment if you want to log the data to the console for easier debugging
                   self.ready.resolve();
               }).fail(function(){
                   //we failed to load some backend data, or the backend was badly configured.
                   //the error messages will be displayed in podWidget
                   self.ready.reject();
               });

        },

        // helper function to load data from the server
        fetch: function(model, fields, domain, ctx){
            return new instance.web.Model(model).query(fields).filter(domain).context(ctx).all()
        },
        // loads all the needed data on the sever. returns a deferred indicating when all the data has loaded.
        load_server_data: function(){
            var self = this;

			var loaded_stock = self.fetch('stock.picking', ['name','id','sale_id','move_lines','type','partner_id','origin'],[['state','=','assigned'],['type','=','out']])
				.then(function(delivery){
	                self.set('delivery_list',delivery);

                    return self.fetch('stock.production.lot',['name','id','product_id','raw_material_type']);
                }).then(function(production){
                    self.set('production_list',production);

                    return self.fetch('product.product',['name','id','ean13']);
                }).then(function(products){
                    self.set('product_list',products);

	          		return self.fetch('res.partner',['name','street','city','zip','street2','id','phone','email','fax']);
	          	}).then(function(partner_res){
	        		self.set('partners_list',partner_res);

	          		return self.fetch('stock.move',['name','production_id','origin','product_uos_qty','product_uom','product_qty','location_id','product_id','id','picking_id','prodlot_id','sale_line_id','raw_material_type_name'],[['state','=','assigned']]);
	          	}).then(function(moves){
	        		self.set('move_line',moves);

	          		return self.fetch('stock.move',['name','production_id','origin','product_uos_qty','product_uom','product_qty','location_id','product_id','id','picking_id','prodlot_id','sale_line_id']);
	          	}).then(function(moves_2){
	        		self.set('move_line_2',moves_2);

	        		return self.fetch('mrp.production',['name','raw_material_type']);
	          	}).then(function(mo_list){
	        		self.set('mo_list',mo_list);

	        		return self.fetch('sale.order.line',['name','raw_material_type_id']);
	          	}).then(function(sol_list){
	        		self.set('sol_list',sol_list);
	          	});
				return loaded_stock;


        },

        // logs the usefull PodModel data to the console for debug purpodes
        log_loaded_data: function(){
            console.log('PodModel data has been loaded:');
            console.log('PodModel: delivery_list:',this.get('delivery_list'));
            console.log('PodModel: user:',this.get('partners_list'));
            console.log('PodModel: move:',this.get('move_line'));
            console.log('PodModel.session:',this.session);
            console.log('PodModel end of data log.');
        },

        // this is called when an order is removed from the order collection. It ensures that there is always an existing
        // order and a valid selected order
        on_removed_order: function(removed_order){
            if( this.get('orders').isEmpty()){
                this.add_new_order();
            }else{
                this.set({ selectedOrder: this.get('orders').last() });
            }
        },

        // saves the order locally and try to send it to the backend. 'record' is a bizzarely defined JSON version of the Order
        push_order: function(record) {
            this.db.add_order(record);
            this.flush();
        },

        //creates a new empty order and sets it as the current order
        add_new_order: function(){
            var order = new module.Order({pod:this});
            this.get('orders').add(order);
            this.set('selectedOrder', order);
        },



        scan_product: function(parsed_ean){
            var self = this;
            var product = this.db.get_product_by_ean13(parsed_ean.base_ean);
            var selectedOrder = this.get('selectedOrder');

            if(!product){
                return false;
            }

            if(parsed_ean.type === 'price'){
                selectedOrder.addProduct(new module.Product(product), {price:parsed_ean.value});
            }else if(parsed_ean.type === 'weight'){
                selectedOrder.addProduct(new module.Product(product), {quantity:parsed_ean.value, merge:false});
            }else{
                selectedOrder.addProduct(new module.Product(product));
            }
            return true;
        },
    });



    // An order more or less represents the content of a client's shopping cart (the OrderLines)
    // plus the associated payment information (the PaymentLines)
    // there is always an active ('selected') order in the pod, a new one is created
    // automaticaly once an order is completed and sent to the server.
    module.Order = Backbone.Model.extend({
        initialize: function(attributes){
            Backbone.Model.prototype.initialize.apply(this, arguments);
            this.set({
                creationDate:   new Date(),
                name:           "Order " + this.generateUniqueId(),
                client:         null,
            });
            this.pod =     attributes.pod;
            this.selected_orderline = undefined;
            this.screen_data = {};  // see ScreenSelector
            this.receipt_type = 'receipt';  // 'receipt' || 'invoice'
            this.selected = false;
            return this;
        },

        generateUniqueId: function() {
            return new Date().getTime();
        },

        addProduct: function(product, options){
            options = options || {};
            var attr = product.toJSON();
            attr.pod = this.pod;
            attr.order = this;
            var line = new module.Orderline({}, {pod: this.pod, order: this, product: product});

            if(options.quantity !== undefined){
                line.set_quantity(options.quantity);
            }
            if(options.price !== undefined){
                line.set_unit_price(options.price);
            }

            var last_orderline = this.getLastOrderline();
            if( last_orderline && last_orderline.can_be_merged_with(line) && options.merge !== false){
                last_orderline.merge(line);
            }else{
                this.get('orderLines').add(line);
                location.reload();
                //setTimeout(function (line) { location.reload(1); }, 5000);
               // location.reload('.order');
					// Automatically Reload POD Screen after every 50 seconds...
					//setTimeout(function () { location.reload(1); }, 50000);
            }
            this.selectLine(this.getLastOrderline());
        },
        removeOrderline: function( line ){
            this.get('orderLines').remove(line);
            this.selectLine(this.getLastOrderline());
        },
        getLastOrderline: function(){
            return this.get('orderLines').at(this.get('orderLines').length -1);
        },

        set_selected: function(selected){
            this.selected = selected;
            this.trigger('change');
        },
        // returns true if this orderline is selected
        is_selected: function(){
            return this.selected;
        },

        // the order also stores the screen status, as the pod supports
        // different active screens per order. This method is used to
        // store the screen status.
        set_screen_data: function(key,value){
            if(arguments.length === 2){
                this.screen_data[key] = value;
            }else if(arguments.length === 1){
                for(key in arguments[0]){
                    this.screen_data[key] = arguments[0][key];
                }
            }
        },
        //see set_screen_data
        get_screen_data: function(key){
            return this.screen_data[key];
        },

        exportAsJSON: function() {
            var orderLines, paymentLines;
            orderLines = [];
            (this.get('orderLines')).each(_.bind( function(item) {
                return orderLines.push([0, 0, item.export_as_JSON()]);
            }, this));
            console.log("######### orderLinesssssssssssss",orderLines);
            paymentLines = [];
            (this.get('paymentLines')).each(_.bind( function(item) {
                return paymentLines.push([0, 0, item.export_as_JSON()]);
            }, this));
            console.log("######### paymentLinessssssssssss",paymentLines);
            return {
                name: this.getName(),
                amount_paid: this.getPaidTotal(),
                amount_total: this.getTotalTaxIncluded(),
                amount_tax: this.getTax(),
                amount_return: this.getChange(),
                lines: orderLines,
                statement_ids: paymentLines,
                pod_session_id: this.pod.get('pod_session').id,
                partner_id: this.get('client') ? this.get('client').id : undefined,
                user_id: this.pod.get('cashier') ? this.pod.get('cashier').id : this.pod.get('user').id,
            };
        },
        getSelectedLine: function(){
            return this.selected_orderline;
        },
        selectLine: function(line){
        	console.log('select linennnnn',line);
            if(line){
                if(line !== this.selected_orderline){
                    if(this.selected_orderline){
                        this.selected_orderline.set_selected(false);
                    }
                    this.selected_orderline = line;
                    this.selected_orderline.set_selected(true);
                }
            }else{
                this.selected_orderline = undefined;
            }
        },
    });

    module.OrderCollection = Backbone.Collection.extend({
        model: module.Order,
    });

}
