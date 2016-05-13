
function openerp_pod_screens(instance, module){
    var QWeb = instance.web.qweb;
    _t = instance.web._t;
    var raw_mat_type_id;
    var del_id;
    var move_lines = [];

    module.DOrderWidget = instance.web.Widget.extend({ //kk
        template:'DOrderWidget', //kk
        init: function(parent, options) {
            this._super(parent,options);
            var self = this;
			this.pod =     parent.pod;
            this.order = options.order;
            this.orderlinewidgets = [];
            this.model = options.model;
            this._packageCount =1;

        },

		click_handler: function() {
			if (this.$('.orderline selected')){
				$('li.orderline.selected').attr('class','orderline');
			}
        },

		get_move_line: function(move_id){
			move_lines = []
			for(i = 0; i < this.pod.attributes.move_line.length; i++){
			    console.log("in get move line move_id of length is",this.pod.attributes.move_line.length);
				final_move_lines = {}
				for(j = 0; j < move_id.length; j++ ){
				    console.log("############### move_id.length is",move_id.length)
					if(this.pod.attributes.move_line[i].id == move_id[j]){
						var list = this.pod.attributes.move_line[i].location_id[1].split('/');
						final_move_lines = {
								'product_name':this.pod.attributes.move_line[i].name,
                                'id':this.pod.attributes.move_line[i].product_id[0],
                                'qty':this.pod.attributes.move_line[i].product_qty,
								'qty_uos':this.pod.attributes.move_line[i].product_uos_qty,
								'unit':this.pod.attributes.move_line[i].product_uom[1],
								'barcode':this.pod.attributes.move_line[i].raw_material_type_name[1],
								'source':list.pop(),
						};
						move_lines[j] = final_move_lines;
					}
				}
			}
			return move_lines;
		},

// Error Source
	//	get_move_line: function(move_id){
		//	raw_mat_type_id_list=[]

			//console.log("in get move line move_id of length is",move_id.length);
		//	for(i = 0; i < this.pod.attributes.move_line.length; i++){
			//	console.log("move_line______@@@@@@@@2",this.pod.attributes.move_line[i]);
				//if (this.pod.attributes.move_line[i].sale_line_id[0])
				//{
			//	console.log("sale_line_id____1__",this.pod.attributes.move_line[i].sale_line_id[0]);
			//	dict ={}
				//for(k = 0; k < this.pod.attributes.sol_list.length; k++)
				//{
				///	console.log("sale_line_id____from list__",this.pod.attributes.sol_list[k].id);
				//	if (this.pod.attributes.sol_list[k].id == this.pod.attributes.move_line[i].sale_line_id[0])
				//	{
					//	raw_mat_type_id = this.pod.attributes.sol_list[k].raw_material_type_id[0];
					//	var key = this.pod.attributes.sol_list[k].id;
					//	console.log(key,"kkkkkkkkkkkeeeeeeeeeeeeeeeeeeeeyyyyyyyyyy");
					//	dict = {
						//	key : key,
					//		value : this.pod.attributes.sol_list[k].raw_material_type_id[0],
					//		};


				//		console.log("sssssssss",dict);
				//	}
			//	}
			//	}
			//	console.log("##########3",raw_mat_type_id_list);
				//final_move_lines = {}
				//for(j = 0; j < move_id.length; j++ ){
					//if(this.pod.attributes.move_line[i].id == move_id[j]){
					//	var list = this.pod.attributes.move_line[i].location_id[1].split('/');
						//del_id= this.pod.attributes.move_line[i].picking_id[0];

						//final_move_lines = {
							//	'product_name':this.pod.attributes.move_line[i].name,
                           //     'id':this.pod.attributes.move_line[i].product_id[0],
                           //     'qty':this.pod.attributes.move_line[i].product_qty,
							//	'qty_uos':this.pod.attributes.move_line[i].product_uos_qty,
							//	'unit':this.pod.attributes.move_line[i].product_uom[1],
                            //    'barcode':this.pod.attributes.move_line[i].raw_material_type_name[1],
							//	'source':list.pop(),
					//	};
					//	move_lines[j] = final_move_lines;
					//	console.log("final_move_linessssssssssssss",final_move_lines)
					//	console.log("move_lines[j]}}}}}}}}}]]]]]]]]]]]",move_lines[j])
				//	}

				//}

			//}
			//return move_lines;
		//},



		get_partner: function(val){
			for(i = 0; i < this.pod.attributes.partners_list.length; i++){
				if(this.pod.attributes.partners_list[i].id === val){
					addre = {
							'name':this.pod.attributes.partners_list[i].name,
							'street':this.pod.attributes.partners_list[i].street,
							'street2':this.pod.attributes.partners_list[i].street2,
							'phone':this.pod.attributes.partners_list[i].phone,
							'email':this.pod.attributes.partners_list[i].email,
							'fax':this.pod.attributes.partners_list[i].fax,
							}
				}
			}
			return addre;
		},

		get_data: function(val){
			var del = this.pod;
			for (i=0;i<del.attributes.delivery_list.length;i++){
				console.log("in get data ===del.attributes.delivery_list",del.attributes.delivery_list[i]);
				if(del.attributes.delivery_list[i].name === val){
					var partner_idd = del.attributes.delivery_list[i].partner_id[0];
					var move_id = [];
					for(j = 0;j < del.attributes.delivery_list[i].move_lines.length; j++){
						move_id.push(del.attributes.delivery_list[i].move_lines[j]);
					}
					console.log("in get data ===move_id",move_id);
					var res = this.get_partner(partner_idd);
					var mov_res = this.get_move_line(move_id);
					console.log("mov_ressssssssssssssssssss",mov_res)

					console.log("stock.picking == stock.move na id match thaya pa6i male","in get data ===this.get_move_line(move_id)",this.get_move_line(move_id));
						selected_delivery_order = {
							'aaddreess':res,
							'orders':mov_res,
							'selected_ordername':val,
						}
				}
			}
			return selected_delivery_order;
			console.log("selected_delivery_orderrrrrrrrrrrrrrr",selected_delivery_order)
		},

		search_order_in_delivery: function(delivery, query){
            search_delivery = []
            query = query.toUpperCase();
            for (i = 0; i < delivery.length ; i++){
                var str = delivery[i].trim();
                if (str.indexOf(query) !== -1){
                    search_delivery.push(str);
                }
            }
            return search_delivery;
		},

        renderElement: function() {
            var self = this;
            this._super();
            var pod_tab = self.pod;



            $(document).ready(function() {
                var barcode="";
                var self = this;
                var codeNumbers = [];
                var timeStamp = 0;
                var lastTimeStamp = 0;
                bar_list= [];
                prodlot_bar_list = [];


                this.check_move_product = function(val,raw_mtrl){
					console.log("barcode......................----------------------",raw_mtrl);
                    for(i=0;i<pod_tab.attributes.delivery_list.length;i++){
                        delivery_order = $('.orderline.selected')[0].textContent;
                        if(pod_tab.attributes.delivery_list[i].name == delivery_order){
                            var move_id = pod_tab.attributes.delivery_list[i].move_lines;
                            for (k = 0;k<move_id.length;k++){
                                for(l =0;l<pod_tab.attributes.move_line.length;l++){
                                    if(move_id[k] == pod_tab.attributes.move_line[l].id){
                                        product_id = pod_tab.attributes.move_line[l].product_id[0]

											if (val == product_id) {
												if(pod_tab.attributes.move_line[l].raw_material_type_name[0] == raw_mtrl)
                                        		{
													return pod_tab.attributes.move_line[l];
												}
												else {
														console.log("rrrrrrrrrraaaaaaaaawwwwwwwwwwww ");
														$("div.raw_mat").show();
														 myAudio = new Audio('/point_of_delivery/static/src/img/b.mp3');
														 $(myAudio).bind( function()  {
														 myAudio.currentTime = 0;
														 myAudio.play();			 });
															myAudio.play();
													 }
											}
                                    }
                                }
                            }
                        }
                    }
                    return false;
                };

                this.on_ean = function (value) {
                    // body...
                    console.log("value============",value)
                    var scan_product;
                    var find_val_product;
                    var flag = true;
                    //var raw_mat_type_id =
                    prodlot_list = [];
					//console.log("local_del_id----------->>>>>>",this.del_id);
					console.log("del_id----------->>>>>>-----------",del_id);
                    for (i=0;i<pod_tab.attributes.move_line.length;i++){
                        if (pod_tab.attributes.move_line[i].prodlot_id[1] !== undefined){
                            prodlot_list.push(pod_tab.attributes.move_line[i].prodlot_id[1]);
                        }

                    }
                    if (prodlot_list.indexOf(value) == -1 ){
                        //alert("this is test for blank from parth");
                        //$("div.showscan").show();
                    }
                    var barcode_id;
                    var production_id;
                    var raw_type_id;
                    var sale_orders_lines_dict = {};
                    var manufacture_orders_lines_dict = {};
                   /* for (i=0;i<pod_tab.attributes.production_list.length;i++){
						//console.log("abc.....",pod_tab.attributes.production_list[i].name);
						//barcode_num = pod_tab.attributes.production_list[i].name
						if(value  ==  pod_tab.attributes.production_list[i].name)
						{
							//console.log("andar in if condition");

							barcode_id= pod_tab.attributes.production_list[i].id
							for (j=0;j<pod_tab.attributes.move_line_2.length;j++)
							{


								move_id = pod_tab.attributes.move_line_2[j]
								console.log("move_id move_id....",move_id);
							    console.log("innnn barcode id....",barcode_id);
							    if (barcode_id  ==  pod_tab.attributes.move_line_2[j].prodlot_id[0])
								{
									for(m = 0; m < pod_tab.attributes.move_line_2.length;m++)
										{
											console.log("latest move list loop",pod_tab.attributes.move_line_2[m]);
											if (pod_tab.attributes.move_line_2[m].prodlot_id[0] == barcode_id && pod_tab.attributes.move_line_2[m].sale_line_id != null)
											{
												sale_line_id = pod_tab.attributes.move_line_2[m].sale_line_id[0]
												console.log("latest move list loop sale_line_id===================",sale_line_id);
											}
										}
									//console.log("andar avyu pod_tab.attributes.move_line_2[j].sale_line_id[0]",pod_tab.attributes.move_line_2[j]);
									if (sale_line_id != null)
									{
										console.log("sale_line_id____1__",pod_tab.attributes.move_line_2[j].sale_line_id[0]);
										for(l = 0; l < pod_tab.attributes.sol_list.length; l++)
										{
			//								console.log("sale_line_id____from list__",pod_tab.attributes.sol_list[l].id);
				//							console.log("sale_line_id____from raw material__",pod_tab.attributes.sol_list[l].raw_material_type_id[1]);
											if (pod_tab.attributes.sol_list[l].id == sale_line_id)
											{
												raw_mat_type_id = pod_tab.attributes.sol_list[l].raw_material_type_id[0];
												sale_orders_lines_dict[barcode_id]=raw_mat_type_id;
											}
										}
									}
									production_id = pod_tab.attributes.move_line_2[j].production_id[0]
									//console.log("production_id=========",pod_tab.attributes.move_line_2[j].production_id[0]);
									for (k=0;k<pod_tab.attributes.mo_list.length;k++)
									{
										//console.log("mo_id=========",pod_tab.attributes.mo_list[k].id);
										if(production_id  ==  pod_tab.attributes.mo_list[k].id)
											{
											raw_type_id = pod_tab.attributes.mo_list[k].raw_material_type[0]
											console.log("mo_id=====#######==12345==",pod_tab.attributes.mo_list[k]);
											console.log("mo_id=====#######====",pod_tab.attributes.mo_list[k].raw_material_type[0]);
											manufacture_orders_lines_dict[barcode_id] = raw_type_id;
											}
										//if(production_id  ==  pod_tab.attributes.move_line_2[j].prodlot_id[0])
									}
								console.log("============sale_orders_lines_dict",sale_orders_lines_dict);
								console.log("============manufacture_orders_lines_dict",manufacture_orders_lines_dict);
								}
							}

						}
					} */

					//else { alert("message");} //console.log("mali gayu barcode_id...",barcode_id);
                    console.log("value.....",value);
                    if(String(value).length == 15){

                        var abc = _.contains(bar_list, value);
                        console.log("abc.....",abc);
                        //console.log("abc.....",pod_tab.attributes.production_list.name);
                        if (abc){

                              //document.getElementById('xyz').play();
                            $("div.scanned").show();


				             myAudio = new Audio('/point_of_delivery/static/src/img/b.mp3');

					         $(myAudio).bind( function()  {
					         myAudio.currentTime = 0;
					         myAudio.play();
					                 });

					                 myAudio.play();

                        }else{
						 //console.log("*************raw_mat_type_id",raw_mat_type_id);
                         //if(raw_mat_type_id == raw_type_id){}
                         //console.log("*************raw_mat_type_id",raw_mat_type_id);
                         //console.log("*************raw_type_id",raw_type_id);
                        for (i=0;i<pod_tab.attributes.production_list.length;i++){
							//if (pod_tab.attributes.production_list[i].raw_material_type[0] == )
                        	console.log("pppppppproduction",pod_tab.attributes.production_list[i].raw_material_type[0]);
                            if(pod_tab.attributes.production_list[i].name == value && !abc){
								//move_lines[i].['barcode']
                                scan_product = pod_tab.attributes.production_list[i].product_id[0];
                                var prodlot_id_scan = pod_tab.attributes.production_list[i].id;
                                var raw_mtrl = pod_tab.attributes.production_list[i].raw_material_type[0];
                                find_val_product = self.check_move_product(scan_product,raw_mtrl);
                                console.log("find_val_product......",find_val_product);
                                flag = false;
                                console.log("ffffffffflllllaaaagggg",flag);
                                if(find_val_product !== false){

                                    //this is a create of pakages of point of dilivery Parth Trivedi
                                    document.getElementById("done").style.display = "block";
                                    console.log('now u can render',find_val_product.product_id[1]);
                                    var list = find_val_product.location_id[1].split('/');
                                    var res1 = {
                                            'product_name':find_val_product.product_id[1],
                                            'id':find_val_product.product_id[0],
                                            'qty':1,
                                            'unit':find_val_product.product_uom[1],
                                            'source':list.pop(),
                                            'barcode':value,
                                            }
                                    var id_list=[];
									//alert("hiiiiiiiiiiiiillllllllll ");
									document.getElementById("done").style.display = "block";
                                        for(m=0;m<$('.tab_package tr').length;m++){
                                        id_list.push(parseInt($('.tab_package tr')[m].children[1].innerHTML));

                                        if (id_list.indexOf(find_val_product.product_id[0] !== -1) ){
                                        }
                                    }
                                    if ($('.tab_package tr').length != 0 && id_list.indexOf(find_val_product.product_id[0]) !== -1 ){
                                        var del_qty ;
					//$('#done').show();

                                        for (h=0;h<$('.tab_delivery tr').length;h++){
                                            if(parseInt($('.tab_delivery tr')[h].children[1].innerHTML) == find_val_product.product_id[0]){
                                                if (parseInt($('.tab_delivery tr')[h].children[3].innerHTML) !== 0) {
                                                    $('.tab_delivery tr')[h].children[3].innerHTML = parseInt($('.tab_delivery tr')[h].children[3].innerHTML) - 1;
                                                    del_qty =parseInt($('.tab_delivery tr')[h].children[3].innerHTML);
                                                    break;
                                                }else{
                                                    $('.shownotqty').show();
                                                }
                                            }
                                        }
                                        for (g=0;g<$('.tab_package tr').length;g++){
                                            if(parseInt($('.tab_package tr')[g].children[1].innerHTML) == find_val_product.product_id[0]){
											 	if (del_qty >= 0) {
                                                    $('.tab_package tr')[g].children[2].innerHTML = parseInt($('.tab_package tr')[g].children[2].innerHTML) + 1;
                                                    var span = document.createElement('span');
                                                    span.innerHTML = value;
                                                    $('.tab_package tr')[g].children[5].appendChild(span);
                                                    prodlot_bar_list.push(parseInt(prodlot_id_scan));
                                                    bar_list.push(value);
                                                    console.log('heerreeeeeeeee',bar_list);
                                                    break;
                                                }else{
                                                    $('.shownotqty').show();
                                                }
                                            }
                                        }
                                    }else{
                                        for (h=0;h<$('.tab_delivery tr').length;h++){
                                            if(parseInt($('.tab_delivery tr')[h].children[1].innerHTML) == find_val_product.product_id[0]){
                                                if (parseInt($('.tab_delivery tr')[h].children[3].innerHTML) !== 0) {
                                                    $('.tab_delivery tr')[h].children[3].innerHTML = parseInt($('.tab_delivery tr')[h].children[3].innerHTML) - 1;
                                                    break;
                                                }else{
                                                    //$('.shownotqty').show();
                                                }
                                            }
                                        }
                                        prodlot_bar_list.push(parseInt(prodlot_id_scan));
                                        bar_list.push(value);

                                        console.log('heerreeeeeeeee111111',bar_list,prodlot_bar_list);
                                        $('.tab_package').append('<tr class="productline"><td>'+res1["product_name"]+'</td><td style="display:none">'+res1["id"]+'</td><td class="middle_d">'+res1["qty"]+'</td><td class="middle_d">'+res1["unit"]+'</td><td class="middle_d">'+res1["source"]+'</td><td class="barcode"><span>'+res1["barcode"]+'</span></td><td class="middle_d"><img class="close_tr" src="/point_of_delivery/static/src/img/STOCK_STOP.png"></img></td></tr>');
                                        break;
                                    }
                                }else{
                                    console.log('na mali',$("div.showscan"));
                                    $("div.showscan").show();
                                    myAudio = new Audio('/point_of_delivery/static/src/img/b.mp3');

					                $(myAudio).bind( function()  {
					                myAudio.currentTime = 0;
					                myAudio.play();
					                             });
					                      myAudio.play();
                                    break;
                                }
                                break;
                            }
                        }
                        }
                    } else if (String(value).length != 15)
                             { alert("wrong bar code.......");
                               console.log("wrong bahar no code 6",flag);
                               }
                    $('.productline').on("click" , function() {
                        if ($('.productline.selected')){
                            $('.productline.selected').attr('class','productline');
                        }
                        $(this).attr('class','productline selected');
                    });


                    $('.close_tr').on("click", function(){
                        for(n = 0; n<$(this).parent().parent().find('td.barcode span').length;n++){
                            bar_list = _.without(bar_list, $(this).parent().parent().find('td.barcode span')[n].innerHTML);
                        }
                        new_prod = [];
                        for (w=0;w<bar_list.length;w++){

                            for (i=0;i<pod_tab.attributes.production_list.length;i++){
                                if(pod_tab.attributes.production_list[i].name == bar_list[w]){
                                    new_prod.push(pod_tab.attributes.production_list[i].id)
                                }
                            }

                        }
                        prodlot_bar_list = new_prod;
                        console.log(" scan list", prodlot_bar_list);
                        $(this).parents("tr:first").remove();
                        for(m=0;m<$('.tab_delivery tr').length;m++){
                            if(parseInt($(this).parents("tr:first")[0].children[1].innerHTML) == parseInt($('.tab_delivery tr')[m].children[1].innerHTML)){
                                console.log("got", $(this).parent().parent().find('td.barcode span'));
                                $('.tab_delivery tr')[m].children[3].innerHTML = $('.tab_delivery tr')[m].children[2].innerHTML;
                            }
                        }

                    });

                };

                // The barcode readers acts as a keyboard, we catch all keyup events and try to find a
                // barcode sequence in the typed keys, then act accordingly.
                this.handler = function(e){
                    //console.log('start barcode.....',(e.which));
                    if(e.which === 13){ //ignore returns
                        e.preventDefault();
                        return;
                    }
                    //We only care about numbers
                    console.log('start scane......');
                    if (e.which >= 48 && e.which < 58){

                        // The barcode reader sends keystrokes with a specific interval.
                        // We look if the typed keys fit in the interval.
                        if (codeNumbers.length === 0) {
                            timeStamp = new Date().getTime();
                        } else {
                            if (lastTimeStamp + 30 < new Date().getTime()) {
                                // not a barcode reader
                                codeNumbers = [];
                                timeStamp = new Date().getTime();
                            }
                        }
                        codeNumbers.push(e.which - 48);
                        //console.log('bar_list.....',codeNumbers.join(''));
                        //console.log('push p6i.....',codeNumbers);

                        lastTimeStamp = new Date().getTime();
	                    console.log('loop ni bahar.....',codeNumbers.length);
	                    if (codeNumbers.length === 15) {
	                        //We have found what seems to be a valid codebar
	                        self.on_ean(codeNumbers.join(''));
	                        codeNumbers = [];

	                    } else
	                            {
	                              console.log('Baharnu.....');
	                              //self.on_ean(codeNumbers.join(''));
	                              //codeNumbers = [];
	                              //self.on_ean(codeNumbers.join(''));
								  //$("div.showscan").show();
	                    		}
                    } else {
                        // NaN
                        codeNumbers = [];
                    }
                };
                console.log('barrrrrrrr out of function',codeNumbers);
                $('body').on('keypress', this.handler);
            });

			this.$('.orderlines').on("click", "li", function() {
				self.click_handler();
				var scrn;
                var brcd;
                bar_list = [];
                prodlot_bar_list = [];
                prodlot_list = [];
				$(this).attr('class','orderline selected');
				var selected_delivery = $(this)[0].textContent;
				console.log("first go to the function get_data",selected_delivery);
				$.when(self.get_data(selected_delivery)).then(function(res){
					$('#categories2', this.$el).html(QWeb.render('DeliveryDetailsWidget',{widget:res}));
					brcd = $('#categories1', this.$el).html(QWeb.render('DeliveryWidget',{widget:res}));
					console.log("brcddddddddddddddd",brcd)
					scrn = $('#categories4', this.$el).html(QWeb.render('DeliveryWidgetBarcode',{widget:res}));
				});
				$(scrn).find('.pack_buton').on("click", function() {
					console.log("pack_buton.....");
                    window.print();
				});

                // $(brcd).find('.tab_delivery tr').on("click", function(e) {
                //     console.log("got meeeee", $(this)[0].children[1].innerText);
                //     e.preventDefault();
                //     for (s=0;s<$('.tab_package tr').length;s++){
                //         if(parseInt($('.tab_package tr')[s].children[1].innerHTML) == parseInt($(this)[0].children[1].innerHTML)){
                //             final_qty = parseInt($('.tab_package tr')[s].children[2].innerHTML) + 1;
                //             console.log('matchhhhhhh innnnn',$(this)[0].children[2].innerText);
                //             if (final_qty > parseInt($(this)[0].children[2].innerText) || final_qty < 0){
                //                 $('.shownotqty').show();
                //             }else{
                //                 $(this)[0].children[3].innerHTML = parseInt($(this)[0].children[3].innerHTML) - 1;
                //                 $('.tab_package tr')[s].children[2].innerHTML = final_qty;
                //             }
                //         }
                //     }
                // });
		    });

			this.$('.searchbox .search-clear').click(function(){
				var self = this;
				$('.searchbox input').val('').focus();
				$('li.orderline').css('display','block');
	        });


	        this.$('.searchbox input').keyup(function(event){
	            query = $(this).val();
	            if(query){
	            	delivery = []
	            	for(i=0;i<self.pod.attributes.delivery_list.length;i++){
						delivery.push(self.pod.attributes.delivery_list[i].name);
	            	}
		            var delivery_list = self.search_order_in_delivery(delivery, query);
					var li_list = $('li.orderline');
		            for(i=0;i<li_list.length;i++){
		            	$('#order'+i).css("display","none");
						for(j=0;j<delivery_list.length;j++){
							if( $('#order'+i)[0].innerText == delivery_list[j]){
								$('#order'+i).css("display","block");
							}
						}
		            }
                    self.$('.search-clear').fadeIn();
                }else{
					$('li.orderline').css('display','block');
                }
	        });


            // freeing subwidgets
            if(this.scrollbar){
                this.scrollbar.destroy();
            }

			var position = this.scrollbar ? this.scrollbar.get_position() : 0;
            var at_bottom = this.scrollbar ? this.scrollbar.is_at_bottom() : false;

            this.scrollbar = new module.ScrollbarWidget(this,{
                target_widget:   this,
                target_selector: '.order-scroller',
                name: 'order',
                track_bottom: true,
                on_show: function(){
                    self.$('.order-scroller').css({'width':'89%'},100);
                },
                on_hide: function(){
                    self.$('.order-scroller').css({'width':'100%'},100);
                },
            });

            this.scrollbar.replace(this.$('.placeholder-ScrollbarWidget'));
            this.scrollbar.set_position(position);

            if( at_bottom ){
                this.scrollbar.set_position(Number.MAX_VALUE, false);
            }

        },
        refresh: function(){
            this.renderElement();
            this.trigger('order_line_refreshed');
        },

    });

    module.DOrderButtonWidget = instance.web.Widget.extend({ // kk
        template:'DOrderButtonWidget', // kk
        init: function(parent, options) {
            this._super(parent,options);
            var self = this;
			this.pod =     options.pod;
            this.order = options.order;
            this.order.bind('destroy',function(){ self.destroy(); });
            this.order.bind('change', function(){ self.renderElement(); });
            this.pod.bind('change:selectedOrder', _.bind( function(pod) {
                var selectedOrder;
                selectedOrder = pod.get('selectedOrder');
                if (this.order === selectedOrder) {
                    this.setButtonSelected();
                }
            }, this));
        },
        renderElement:function(){
            this._super();
            this.$('button.select-order').off('click').click(_.bind(this.selectOrder, this));
            this.$('button.close-order').off('click').click(_.bind(this.closeOrder, this));
        },
        selectOrder: function(event) {
        	this.pod.set({
                selectedOrder: this.order
            });
        },
        setButtonSelected: function() {
            $('.selected-order').removeClass('selected-order');
            this.$el.addClass('selected-order');
        },
        closeOrder: function(event) {
            this.order.destroy();
        },
    });

	module.DeliveryPackageListWidget = instance.web.Widget.extend({
		template: 'DeliveryPackageListWidget',
		init: function(parent, options){
            this._super(parent,options);
            var self = this;
            this.pod =     parent.pod;
            this._packageCount =1;
            this._lstPackProductLineHtml = {};
        },


        renderElement: function() {

            var self = this;
            this._super();
			var fff;
            this.$('#reset').on("click", function() {
				$('.productline').remove();
                this._packageCount = 1;
                location.reload()
                bar_list = [];
                prodlot_list = [];
                prodlot_bar_list = [];
                this._lstPackProductLineHtml = {};
                for(m=0;m<$('.tab_delivery tr').length;m++){
                    $('.tab_delivery tr')[m].children[3].innerHTML = $('.tab_delivery tr')[m].children[2].innerHTML;
                }
            });



            this.$('#done').on("click", function() {
                var move_id;
                var move_lines = [];
                self._lstPackProductLineHtml["pack" + 1] = $('.tab_package').html();
                var delivery_package = self._lstPackProductLineHtml["pack" + 1].trim();
                console.log('in nnnn paccckkk',delivery_package);

                for(i=0;i<self.pod.attributes.delivery_list.length;i++){
                    delivery_order = $('.orderline.selected')[0].textContent;
                    if(self.pod.attributes.delivery_list[i].name == delivery_order){
                        move_id = self.pod.attributes.delivery_list[i].move_lines;
                        for(d=0;d<self.pod.attributes.move_line.length;d++){
                            for(j=0;j<move_id.length;j++){
                                if(self.pod.attributes.move_line[d].id == move_id[j]){
                                    move_lines.push(self.pod.attributes.move_line[d]);
                                }
                            }
                        }
                    }
                }
                var final_data = [];
                var partial_datas ={};
                var bAddToFinalData = false;
                var delivery_package = self._lstPackProductLineHtml["pack" + 1].trim();
                for (k=0;k<$.parseHTML(delivery_package).length;k++){
                    for (j=0;j<move_lines.length;j++){
                        if($.parseHTML(delivery_package)[k].children[1].innerHTML == move_lines[j].product_id[0]){
                            var strMoveName = [move_lines[j].id]
                            var oCurrentMove = {'prodlot_id': move_lines[j].prodlot_id[0],'product_id': move_lines[j].product_id[0],'location_id':move_lines[j].location_id[0], 'product_uom': move_lines[j].product_uom[0],'product_quantity':move_lines[j].product_qty , 'product_qty':parseFloat($.parseHTML(delivery_package)[k].children[2].innerHTML)};
                            var bDoNotAdd = false;
                            // Check exististing final data for current move line
                            //      Iterate final_data and check for matching product_id in move lines
                            //      if found update the 'bDoNotAdd' flag
                            if (final_data.length != 0){
                                for (var data_part_key in final_data){
                                    if(final_data.hasOwnProperty(data_part_key)){
                                        var oCurDataPart = final_data[data_part_key];
                                        for(var mov_key in oCurDataPart){
                                            if(oCurDataPart.hasOwnProperty(mov_key)){
                                                var oMoveInTest = oCurDataPart[mov_key];
                                                if(oMoveInTest.product_id == oCurrentMove.product_id){
                                                    oMoveInTest.product_qty += oCurrentMove.product_qty;
                                                    bDoNotAdd = true;
                                                    break;
                                                }
                                            }
                                        }

                                        if(bDoNotAdd){
                                            break;
                                        }

                                    }
                                }
                            }
                            // If no matching move line found
                            if(!bDoNotAdd){
                                bAddToFinalData = true;
                                partial_datas[strMoveName] = oCurrentMove;
                            }
                            break;
                        }
                    }
                }

                if(bAddToFinalData){
                    final_data.push(partial_datas);
                }
                var pod_tabs = self.pod;
                ids = [];
                for(i=0;i<pod_tabs.attributes.delivery_list.length;i++){
                    delivery_order = $('.orderline.selected')[0].textContent;
                    if(pod_tabs.attributes.delivery_list[i].name == delivery_order){
                        ids = [pod_tabs.attributes.delivery_list[i].id];
                        break;
                    }
                }



                console.log('prodlist',prodlot_bar_list);
                console.log('prodlistbarrrrrrr',bar_list);
                console.log('FINAL DATA',final_data);

                (new instance.web.Model('stock.move.split')).call('split_custom',[ids,prodlot_bar_list,bar_list,final_data[0]], {})
                    .fail(function(unused, event){
                        //don't show error popup if it fails
                        event.preventDefault();
                        console.error('Failed to send order:');
                    })
                    .done(function( value){
                        //remove from db if success
                        console.log('malllllliiiii lasssst',value);

                        (new instance.web.Model('stock.picking')).call('do_partial_custom',[ids,value], {})
                        .done(function( ){
                            window.location.reload();
                        })
                        // window.location.reload();
                    });
            });
        },
	});

    module.DeliveryCategoriesWidget = instance.web.Widget.extend({
        template: 'DeliveryCategoriesWidget',
        init: function(parent, options){
            var self = this;
            this._super(parent,options);



        },


    });

	module.DeliveryDetailsCategoriesWidget = instance.web.Widget.extend({
		template: 'DeliveryDetailsCategoriesWidget',
        init: function(parent, options){
            var self = this;
            this._super(parent,options);
        },
	});

    module.DeliveryListWidget = instance.web.Widget.extend({
        template:'DeliveryListWidget',
        init: function(parent, options) {
            var self = this;
            this._super(parent,options);
        },
    });

	module.DeliveryScreenWidget = instance.web.Widget.extend({
		template: 'DeliveryScreenWidget',
        init: function(parent, options){
			options = options || {};
            this._super(parent, options);
            var self = this;
            this.pod =     parent.pod;

        },
		start: function(){ //FIXME this should work as renderElement... but then the categories aren't properly set. explore why
            var self = this;
            this.Delivery_categories_widget = new module.DeliveryCategoriesWidget(this,{});
            this.Delivery_categories_widget.replace($('.placeholder-DeliveryCategoriesWidget'));

            //this.Scroll_categories_widget = new module.ScrollbarWidget(this,{});
           // this.Scroll_categories_widget.replace($('.placeholder-ScrollbarWidget'));

            this.DeliveryDetails_categories_widget = new module.DeliveryDetailsCategoriesWidget(this,{});
            this.DeliveryDetails_categories_widget.replace($('.placeholder-DeliveryDetailsCategoriesWidget'));

            this.Delivery_list_widget = new module.DeliveryListWidget(this,{});
            this.Delivery_list_widget.replace($('.placeholder-DeliveryListWidget'));

            this.Delivery_package_widget = new module.DeliveryPackageListWidget(this,{});
            this.Delivery_package_widget.replace($('.placeholder-DeliveryPackageListWidget'));
        },
	});



    module.HeaderButtonWidget = instance.web.Widget.extend({
        template: 'HeaderButtonWidget',
        init: function(parent, options){
            options = options || {};
            this._super(parent, options);
            this.action = options.action;
            this.label   = options.label;
        },
        renderElement: function(){
            var self = this;
            this._super();
            if(this.action){
                this.$el.click(function(){ self.action(); });
            }

        },

        show: function(){ this.$el.show(); },
        hide: function(){ this.$el.hide(); },
    });

    module.PodWidget = instance.web.Widget.extend({
        template: 'PodWidget',
        init: function() {
			this._super(arguments[0],{});
			this.pod = new module.PodModel(this.session);
			instance.web.blockUI();
            this.pod_widget = this; //So that pod_widget's childs have pod_widget set automatically
            this.numpad_visible = true;
            this.left_action_bar_visible = true;
            this.leftpane_visible = true;
            this.leftpane_width   = '230px';
            this.leftpane_margin = '10px';
            this.cashier_controls_visible = true;
        },

		start: function() {
			var self = this;
			self.build_widgets();
			$('#numpad').show();
			instance.web.unblockUI();
            self.$('.loader').animate({opacity:0},1500,'swing',function(){self.$('.loader').hide();});
			$('#leftpane').show().animate({'width':this.leftpane_width},500,'swing');
            $('#rightpane').animate({'left':this.leftpane_width},500,'swing');
			$( ".close" ).click(function() {
		        $("div.showact").hide();
                $("div.scanned").hide();
                $("div.showscan").hide();
                $("div.raw_mat").hide();
                $('.shownotqty').hide();
		    });

			return self.pod.ready.done(function() {
				var pod =  this.pod;

				//for(i=0;i<self.pod.attributes.delivery_list.length;i++){
				for(i=0;i<10;i++){
					console.log("in get move line move_id of length is",self.pod.attributes.delivery_list.length);
					self.pod.add_new_order();
					$('.orderlines').append("<li class='orderline'  id=order"+(i) +"><span class='product-name'>"+self.pod.attributes.delivery_list[i].name+"</span></li>");
					var new_order = $('.orderline');
					var new_order_button = new module.DOrderButtonWidget(null, { // kk
                        order: new_order,
                        pod: self.pod
                    });
                    new_order_button.appendTo($('#orders'));
                    new_order_button.selectOrder();
                    self.pod.get('orders').add(new module.Order({ pod: self.pod }));
				}

			});

		},



        // This method instantiates all the screens, widgets, etc. If you want to add new screens change the
        // startup screen, etc, override this method.
        build_widgets: function() {
            var self = this;
			var prices = []


			this.product_screen = new module.DeliveryScreenWidget(this,{});
            this.product_screen.appendTo($('#rightpane'));

			this.dorder_widget = new module.DOrderWidget(this, {}); // kk
            this.dorder_widget.replace($('#placeholder-DOrderWidget')); // kk

            this.close_button = new module.HeaderButtonWidget(this,{
                label: _t('Close'),
                action: function(){ self.try_close(); },
            });
            this.close_button.appendTo(this.$('#rightheader'));
            // --------  Screens ---------
        },
        try_close: function() {
            var self = this;
            //TODO : do the close after the flush...
            self.close();
        },
        close: function() {
            var self = this;
            this.action_manager = new instance.web.ActionManager(this);
            return new instance.web.Model("ir.model.data").get_func("search_read")([['name', '=', 'action_client_pod_menu']], ['res_id']).pipe(
                    _.bind(function(res) {
                return this.rpc('/web/action/load', {'action_id': res[0]['res_id']}).pipe(_.bind(function(result) {
                    var action = result;
                    action.context = _.extend(action.context || {}, {'cancel_action': {type: 'ir.actions.client', tag: 'reload'}});
                    //self.destroy();
                    this.action_manager.do_action(action)
                }, this));
            }, this));
        },

    });



}
