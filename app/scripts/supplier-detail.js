(function() {
    'use strict';
    var itemArray=[];
    var itemid;
    var itemtype;
    Polymer({
      is: 'supplier-detail',
	 ready:function(){
	 	
	 this.hidecustomer=true;
	 this.hidesupplier=true;
	 this.idd=0;
	 this.price="";
	 //this.hideprice=false;	 
	 localStorage.setItem("curr_sess_unitset",this.idd);
	 localStorage.setItem("curr_sess_addsupplierforitem","0");
	 localStorage.setItem("curr_sess_addcustomerforitem","0");
	 //document.querySelector('#addsupplier').checked=true;
	 //alert(itemtype);
	 
	 if(itemtype!="FG"){
	 	localStorage.setItem("curr_sess_addsupplierforitem","1");
	 	this.hidesupplier=false;
	 }
	 if(itemtype=="FG"){
	 	localStorage.setItem("curr_sess_addcustomerforitem","1");
	 	this.hidecustomer=false;
	 }
	 /*Dynamic array for creating rows of item card*/
	 this.supArray=[{id:this.idd,supname:'',price:''}];
     this.splice('supArray',1,1);
	 },
	 /*FnChooseSupplier:function(e){
	 	localStorage.setItem("curr_sess_addsupplierforitem","1");
		this.hidecustomer=true;
	 	this.hidesupplier=false;
	 },
	 FnChooseCustomer:function(e){
	 	//this.hideprice=true;
	 	document.querySelector('#addsupplier').checked=false;
	 	localStorage.setItem("curr_sess_addcustomerforitem","1");
		this.hidecustomer=false;
	 	this.hidesupplier=true;
	 },*/
	
     FnAddSupplier:function(){
     	//alert(itemArray.length);
     	//alert("halo"+this.price);
     	itemArray[(itemArray.length)-1].price=this.price;
     	//alert(JSON.stringify(itemArray));
     	//this.idd=parseInt(this.idd)+1;
     	// alert(this.idd);
    	
		this.push('supArray', {id: this.idd, supname: '',price:''});
		
	 },
	 FnSaveSupplier:function(){
	 	//localStorage.setItem("curr_sess_writesupplierfromadditem","1");
	 	if(localStorage.getItem("curr_sess_addsupplierforitem")=="1"){
	 	itemArray[(itemArray.length)-1].price=this.price;
		document.querySelector('admin-service').callItemWriteSupplierService(itemid,itemArray);
		}
		else if(localStorage.getItem("curr_sess_addcustomerforitem")=="1")
		document.querySelector('admin-service').callItemWriteCustomerService(itemid,itemArray);	
		else
		alert("unable to add supplier");
		this.FnBtnDisable();
	 },
	 FnSelectSupplier:function(supplierid,suppliername){
		 var obj={"supplierid":"","suppliername":"","price":""};
		 obj.supplierid=supplierid;
		 obj.suppliername=suppliername;
		 
		 itemArray.push(obj);
		 // alert(JSON.stringify(itemArray));
	 },
	 FnSelectCustomer:function(cusid,cusname){
	     var obj={"supplierid":"","suppliername":""};
		 obj.supplierid=cusid;
		 obj.suppliername=cusname;
	 	 itemArray.push(obj);
	 },
	 FnSetItemid:function(iitemid,iitemtype){
		 itemid=iitemid;
		 itemtype=iitemtype;
		 this.$.customersuppliercard.FnSetcussupItemId(itemid,itemtype);		 
	 },
	 FnBtnDisable:function(){	  	
         document.querySelector('#saveitem').style.backgroundColor='grey';
      	 document.querySelector('#add').style.backgroundColor='grey';
     	 this.Btn_disable_flag=true;
    },
     FnSetPrice:function(price){
    	//alert(price);
    	this.price=price;
    }
    });
  })();