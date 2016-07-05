
//JS file for the customer payment card
Polymer({
  is: "useraccount-info-card",
  ready:function()
  {
  this.read=false;
	this.mode="";
  },
 
  // Function invokes while submitting payment info page of the customer
  FnAddPaymentInfoSubmit:function(){
    // Function whic validates the input fields
    /*document.querySelector('#droppaymentmode').validate();
    document.querySelector('#bankname').validate();
    document.querySelector('#accountno').validate();
    document.querySelector('#accountname').validate();
    document.querySelector('#accounttype').validate();
    document.querySelector('#branch').validate();
    document.querySelector('#ifsccode').validate();
    document.querySelector('#micrcode').validate();
    document.querySelector('#swiftcode').validate();*/
	 // var paymentterm=this.querySelector('#radio').selected;
	 if(this.accountno==null||this.accountno==""){
	 }
	 else{
   if(localStorage.getItem("curr_sess_searchtypeflag")=="nothing"){
   //Function which calls service to add payment info of the customer 
	 this.$.userservice.addpaymentService(this.accountname,this.accountno,this.accounttype,this.paymenttype,this.bankname,this.branch,this.ifsccode);
	 document.querySelector("usercreation-home-card").setPage("Role/Department Detail");
 	 }
    //Function which calls service to update payment info of the customer while searching customer 
 		else if(localStorage.getItem("curr_sess_addemployeeeditflag")=="1"&&localStorage.getItem("curr_sess_searchtypeflag")=="1"){
 		this.$.userservice.updatepaymentService(this.accountname,this.accountno,this.accounttype,this.paymenttype,this.bankname,this.branch,this.ifsccode);
    	this.$.userservice.FnRoleService();
    	document.querySelector("usercreation-home-card").setPage("Role/Department Detail");
 		}
    //Function which calls service to search payment info of the customer while searching
 		else
 		{      
        this.$.userservice.FnRoleService();
    	document.querySelector("usercreation-home-card").setPage("Role/Department Detail");
		}
	}
  }
});
