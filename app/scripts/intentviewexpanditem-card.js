/**
 * Created by praba on 2/19/2016.
 */
/**
 * Created by praba on 2/12/2016.
 */
 (function() {
  'use strict';
  var poarr=[];
Polymer({is:"intentviewexpanditem-card",
  ready:function(){
  	this.no=65;
  	this.hidesupplier=true;
  	this.hideadd=false;
  	this.poraiseflag=0;
    //Setting url to make request
  },
  FnCreatePo:function(){  	
  	this.hidesupplier=false;
  	this.hideadd=true;
  	this.querySelector('#specification').style.marginLeft='30px';  	
  	this.querySelector('#qtr').style.marginLeft='20px';
  	this.querySelector('#due').style.marginLeft='20px';
  	this.querySelector('#supplier').style.marginLeft='-5px';
  	this.querySelector('#supplier').style.marginTop='-2%';
  	if(this.poraiseflag==0){
  	sessionStorage.setItem("sess_curr_itemdes",this.itemdes);
  		 var obj={"intentregno":"","itemdes":""};
         obj.intentregno=sessionStorage.getItem("sess_curr_inwardregno");
         obj.itemdes=sessionStorage.getItem("sess_curr_itemdes");
         this.intentpourl=sessionStorage.getItem("curr_sess_url")+"intentpoitemread-service";
         this.intentpoparam=obj;
         this.$.intentpoitemajax.generateRequest();   
    }
  	//alert(sessionStorage.getItem("sess_curr_inwardregno"));
  	//alert(this.itemdes);
  },
  FnintentpoitemResponse:function(e){
  	//alert(JSON.stringify(e.detail.response.itemarr));
	this.suppliernamearr=e.detail.response.itemarr;
  },
  FnSelectSupplier:function(e){
  	this.poraiseflag=1;
  	this.repeatflag=0;
  	//alert(e.target.selectedItem.textContent.trim());
  	var obj={"itemdes":"","supplier":"","intentregno":""};
  	obj.intentregno=sessionStorage.getItem("sess_curr_inwardregno");
  	obj.itemdes=this.itemdes;
  	obj.supplier=e.target.selectedItem.textContent.trim();
   
  	poarr.push(obj);
  	document.querySelector('promotebutton-card').FnPOArrayInfo(poarr);
  	//alert(JSON.stringify(poarr));
  }

});
})();