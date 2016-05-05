
openerp.point_of_delivery = function(instance) {

    instance.point_of_delivery = {};

    var module = instance.point_of_delivery;

	openerp_pod_models(instance,module);
	openerp_pod_scrollbar(instance,module);
    openerp_pod_screens(instance,module);    // import pos_screens.js

    instance.web.client_actions.add('pod.ui', 'instance.point_of_delivery.PodWidget');
};


