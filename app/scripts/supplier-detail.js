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
	 	 
	 localStorage.setItem("curr_sess_unitset",this.idd);
	 localStorage.setItem("curr_sess_addsupplierforitem","0");
	 localStorage.setItem("curr_sess_addcustomerforitem","0");

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
	 //Function which invokes while adding supplier 
     FnAddSupplier:function(){
     	itemArray[(itemArray.length)-1].price=this.price;	
		this.push('supArray', {id: this.idd, supname: '',price:''});		
	 },
	 // Function which add supplier/customer
	 FnSaveSupplier:function(){	 	
	 	if(localStorage.getItem("curr_sess_addsupplierforitem")=="1"){
	 	itemArray[(itemArray.length)-1].price=this.price;
	 	// Function which calls service to add supplier
		document.querySelector('admin-service').callItemWriteSupplierService(itemid,itemArray);
		}
		else if(localStorage.getItem("curr_sess_addcustomerforitem")=="1")
		// Function which calls service to add customer
		document.querySelector('admin-service').callItemWriteCustomerService(itemid,itemArray);	
		else
		alert("unable to add supplier");
		this.FnBtnDisable();
	 },
	 // Function which invoke while selecting supplier
	 FnSelectSupplier:function(supplierid,suppliername){
		 var obj={"supplierid":"","suppliername":"","price":""};
		 obj.supplierid=supplierid;
		 obj.suppliername=suppliername;		 
		 itemArray.push(obj);		 
	 },
	 // Function which invoke while selecting customer
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
    	 this.price=price;
    }
    });
  })();