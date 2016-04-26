(function() {
    'use strict';
    var itemArray=[];
    var itemid;
    Polymer({
      is: 'supplier-detail',
	 ready:function(){
	 this.hidecustomer=true;
	 this.hidesupplier=false;
	 this.idd=0;

	 localStorage.setItem("curr_sess_unitset",this.idd);
	 localStorage.setItem("curr_sess_addsupplierforitem","1");
	 localStorage.setItem("curr_sess_addcustomerforitem","0");
	 //document.querySelector('#addsupplier').checked=true;
	 /*Dynamic array for creating rows of item card*/
	 this.supArray=[{id:this.idd,supname:''}];
     this.splice('supArray',1,1);
	 },
	 FnChooseSupplier:function(e){
	 	localStorage.setItem("curr_sess_addsupplierforitem","1");
		this.hidecustomer=true;
	 	this.hidesupplier=false;
	 },
	 FnChooseCustomer:function(e){
	 	document.querySelector('#addsupplier').checked=false;
	 	localStorage.setItem("curr_sess_addcustomerforitem","1");
		this.hidecustomer=false;
	 	this.hidesupplier=true;
	 },
     FnAddSupplier:function(){
		this.push('supArray', {id: this.idd, supname: ''});
	 },
	 FnSaveSupplier:function(){
	 	//localStorage.setItem("curr_sess_writesupplierfromadditem","1");
	 	if(localStorage.getItem("curr_sess_addsupplierforitem")=="1")
		document.querySelector('admin-service').callItemWriteSupplierService(itemid,itemArray);
		else if(localStorage.getItem("curr_sess_addcustomerforitem")=="1")
		document.querySelector('admin-service').callItemWriteCustomerService(itemid,itemArray);	
		else
			alert("unable to add supplier");
		this.FnBtnDisable();
	 },
	 FnSelectSupplier:function(supplierid,suppliername){
		 var obj={"supplierid":"","suppliername":""};
		 obj.supplierid=supplierid;
		 obj.suppliername=suppliername;
		 itemArray.push(obj);
		 //alert(JSON.stringify(itemArray));
	 },
	 FnSelectCustomer:function(cusid,cusname){
	     var obj={"supplierid":"","suppliername":""};
		 obj.supplierid=cusid;
		 obj.suppliername=cusname;
	 	 itemArray.push(obj);
	 },
	 FnSetItemid:function(iitemid){
		 itemid=iitemid;
		 //alert(itemid);
	 },
	  FnBtnDisable:function(){	  	
      document.querySelector('#saveitem').style.backgroundColor='grey';
      document.querySelector('#add').style.backgroundColor='grey';
      this.Btn_disable_flag=true;
    }
    });
  })();