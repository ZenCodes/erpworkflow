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
        this.$.adminsupplierservice.addpaymentService(this.accountname,this.accountno,this.accounttype,this.paymenttype,this.bankname,this.branch,this.ifsccode,this.micrcode,this.swiftcode,paymentterm);
        document.querySelector("supplier-page").setPage("Add Contact");
        // document.querySelector('supplier-page').setPage('Show Item');
        // document.querySelector('supplieritem-card').FnFetchItemInfo(localStorage.getItem('curr_sess_supplierloggedid'),this.supname);
      }
      else if(localStorage.getItem("curr_sess_addsuppliereditflag")=="1"&&localStorage.getItem("curr_sess_searchtypeflag")=="1"){
        this.$.adminsupplierservice.updatepaymentService(this.accountname,this.accountno,this.accounttype,this.paymenttype,this.bankname,this.branch,this.ifsccode,this.micrcode,this.swiftcode,paymentterm);
        this.$.adminsupplierservice.FnsupplierreadcontactService();
        document.querySelector("supplier-page").setPage("Add Contact");
        // document.querySelector('supplier-page').setPage('Show Item');
        // document.querySelector('supplieritem-card').FnFetchItemInfo(localStorage.getItem('curr_sess_supplierloggedid'),this.supname);
      }
      else
      {
        this.$.adminsupplierservice.FnsupplierreadcontactService();
        document.querySelector("supplier-page").setPage("Add Contact");        
        // document.querySelector('supplier-page').setPage('Show Item');
        // document.querySelector('supplieritem-card').FnFetchItemInfo(localStorage.getItem('curr_sess_supplierloggedid'),this.supname);
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
  }
});
