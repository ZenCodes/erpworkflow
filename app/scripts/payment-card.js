/**
 * Created by praba on 2/12/2016.
 */

//JS file for the supplier-page
Polymer({
  is: "payment-card",
  ready:function()
  {
    this.read=false;
	this.mode="";
	this.supid="";
	this.supname="";
  },
  FnModeSelected:function(e){
	if(e.target.selectedItem.textContent.trim()!="-----Select-----")
      this.mode = e.target.selectedItem.textContent.trim();
  },
  FnAddPaymentInfoSubmit:function(){

	 document.querySelector('#droppaymentmode').validate();
	 document.querySelector('#bankname').validate();
	 document.querySelector('#accno').validate();
	 document.querySelector('#address').validate();
	 var paymentterm=document.querySelector('#radio').selected;
	 if(this.mode==""||this.address==null||this.address==""||this.bankname==null||this.bankname==""||this.accountno==null||this.accountno==""){
	 }
	 else{
		 if(localStorage.getItem("curr_sess_searchtypeflag")=="nothing"){
	     this.$.adminsupplierservice.addpaymentService(this.accountno,this.bankname,this.address,this.mode,paymentterm);
	     document.querySelector('supplier-page').setPage('Show Item');
	     document.querySelector('supplieritem-card').FnFetchItemInfo(this.supid,this.supname);
 		}
 		else if(localStorage.getItem("curr_sess_addsuppliereditflag")=="1"&&localStorage.getItem("curr_sess_searchtypeflag")=="1"){
 		this.$.adminsupplierservice.updatepaymentService(this.accountno,this.bankname,this.address,this.mode,paymentterm);
 		document.querySelector('supplier-page').setPage('Show Item');
		document.querySelector('supplieritem-card').FnFetchItemInfo(this.supid,this.supname);
 		}
 		else
 		{
		document.querySelector('supplier-page').setPage('Show Item');
		document.querySelector('supplieritem-card').FnFetchItemInfo(this.supid,this.supname);
		}
	}
  },

  FnFetchPaymentInfo:function(supplierid,suppliername){
	this.supid=supplierid;
	this.supname=suppliername;
	localStorage.setItem("curr_sess_suppliername",suppliername);
	this.$.adminsupplierservice.callPaymentService(supplierid,suppliername);
  },
  setSelectType:function(mode,term){
  	if(localStorage.getItem("curr_sess_addsuppliereditflag")=="1")
  		this.read=false;
  	else
	  this.read=true;
	  this.paymenttype=mode;
	  this.selected=term;
	  //this.term=term;
  },
  FnEnableFields:function(){
  	//alert('coming...');
  	this.read=false;
  }
});
