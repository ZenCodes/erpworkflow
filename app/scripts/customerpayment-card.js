
//JS file for the customer payment card
Polymer({
  is: "customerpayment-card",
  ready:function()
  {
  this.read=false;
	this.mode="";
	this.supid="";
	this.supname="";
  },
  // Function invokes while selecting the payment mode
  FnModeSelected:function(e){
	if(e.target.selectedItem.textContent.trim()!="-----Select-----")
      this.mode = e.target.selectedItem.textContent.trim();
  },
  // Function invokes while submitting payment info page of the customer
  FnAddPaymentInfoSubmit:function(){
    // Function whic validates the input fields
    document.querySelector('#droppaymentmode').validate();
    document.querySelector('#bankname').validate();
    document.querySelector('#accountno').validate();
    document.querySelector('#accountname').validate();
    document.querySelector('#accounttype').validate();
    document.querySelector('#branch').validate();
    document.querySelector('#ifsccode').validate();
    document.querySelector('#micrcode').validate();
    document.querySelector('#swiftcode').validate();
	 var paymentterm=this.querySelector('#radio').selected;
	 if(this.accountno==null||this.accountno==""){
	 }
	 else{
   if(localStorage.getItem("curr_sess_searchtypeflag")=="nothing"){
   //Function which calls service to add payment info of the customer 
	 this.$.customerservice.addpaymentService(this.accountname,this.accountno,this.accounttype,this.paymenttype,this.bankname,this.branch,this.ifsccode,this.micrcode,this.swiftcode,paymentterm);
	 document.querySelector("customer-page").setPage("Add Contact");
 	 }
    //Function which calls service to update payment info of the customer while searching customer 
 		else if(localStorage.getItem("curr_sess_addcustomereditflag")=="1"&&localStorage.getItem("curr_sess_searchtypeflag")=="1"){
 		this.$.customerservice.updatepaymentService(this.accountname,this.accountno,this.accounttype,this.paymenttype,this.bankname,this.branch,this.ifsccode,this.micrcode,this.swiftcode,paymentterm); 		
    this.$.customerservice.FncustomerreadcontactService();
    document.querySelector("customer-page").setPage("Add Contact");
 		}
    //Function which calls service to search payment info of the customer while searching
 		else
 		{      
      this.$.customerservice.FncustomerreadcontactService();
      document.querySelector("customer-page").setPage("Add Contact");
		}
	}
  },
  // Function which receives the customer id and calls payment service to fetch the payment info
  FnFetchPaymentInfo:function(supplierid,suppliername){
	this.supid=supplierid;
	this.supname=suppliername;
	localStorage.setItem("curr_sess_suppliername",suppliername);
	this.$.customerservice.callPaymentService(supplierid,suppliername);
  },
  // Function which set payment type during search 
  setSelectType:function(mode,term){
	  if(localStorage.getItem("curr_sess_addcustomereditflag")=="1")
  		this.read=false;
  	  else
  		this.read=true;
	  this.paymenttype=mode;
	  this.selected=term;  
  }
});
