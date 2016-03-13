/**
 * Created by praba on 2/12/2016.
 */

//JS file for the supplier-page
Polymer({
  is: "payment-card",
  ready:function()
  {
	this.mode="";
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
	 this.$.adminsupplierservice.addpaymentService(this.accountno,this.bankname,this.address,this.mode,paymentterm);
	 document.querySelector('supplier-page').setPage('Add Item');
	}
  }
});
