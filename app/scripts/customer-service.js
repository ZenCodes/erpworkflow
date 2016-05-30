/**
 * Created by praba on 2/26/2016.
 */
(function() {
  var supplierid;
  var obj1;
  var obj2;
  var obj3;
  var obj4;
  var obj5;
  var obj6;
  var approvecustomerarr=[];
  Polymer({
    is: "customer-service",
    ready: function () {

    },
    callSearchService:function(supplierid,suppliername){
    this.supplierreadurl=sessionStorage.getItem("curr_sess_url")+"readcustomerinfo-service";
      var obj={"supplierid":"","suppliername":""};
      //obj.supplierid=supplierid;
      obj.suppliername=suppliername;
      this.supplierreadparam=obj;
      this.$.readsupplierajax.generateRequest();
  },
  readsupplierResponse:function(e){
        var arr= e.detail.response.itemarr;
        //alert(arr[0].Customer_ID);
        //document.querySelector("addcustomer-card").supplierid=arr[0].Customer_ID;
        localStorage.setItem('curr_sess_customerloggedid',arr[0].Customer_ID);
        document.querySelector("addcustomer-card").suppliername=arr[0].Customer_Name;
        document.querySelector("addcustomer-card").aliasname=arr[0].Alias_Name;
        document.querySelector("addcustomer-card").address1=arr[0].Address1;
        document.querySelector("addcustomer-card").address2=arr[0].Address2;
        document.querySelector("addcustomer-card").doorno=arr[0].Doorno;
        document.querySelector("addcustomer-card").streetno=arr[0].Streetno;
        document.querySelector("addcustomer-card").streetname=arr[0].Street_Name;
        document.querySelector("addcustomer-card").location=arr[0].Location;
        document.querySelector("addcustomer-card").city=arr[0].City;
        document.querySelector("addcustomer-card").district=arr[0].District;
        document.querySelector("addcustomer-card").state=arr[0].State;
        document.querySelector("addcustomer-card").country=arr[0].Country;
        document.querySelector("addcustomer-card").pincode=arr[0].Pincode;
        document.querySelector("addcustomer-card").phoneno=arr[0].Phoneno;
        document.querySelector("addcustomer-card").mobileno=arr[0].Mobileno;
        document.querySelector("addcustomer-card").emailid=arr[0].Email;
        document.querySelector("addcustomer-card").faxno=arr[0].Faxno;
        document.querySelector("addcustomer-card").website=arr[0].Website;
        //To call show item card when click item detail tab after add supplier page
        document.querySelector("customeradditem-card").FnSetValue(arr[0].Customer_ID,arr[0].Customer_Name);
        document.querySelector("customeritem-card").FnFetchItemInfo(arr[0].Customer_ID,arr[0].Customer_Name);
  },
  callPaymentService:function(){
          this.paymentreadurl=sessionStorage.getItem("curr_sess_url")+"readcustomerpaymentinfo-service";
          var obj={"supplierid":"","suppliername":""};
          obj.supplierid=localStorage.getItem('curr_sess_customerloggedid');
          //alert("read payment"+obj.supplierid);
          //obj.suppliername=supname;
          this.paymentreadparam=obj;
          this.$.readpaymentajax.generateRequest();
  },
  readpaymentResponse:function(e){
    var arr= e.detail.response.itemarr;
     //alert(JSON.stringify(arr));
      document.querySelector("customerpayment-card").accountname=arr[0].Account_Name;
      document.querySelector("customerpayment-card").accountno=arr[0].Account_No;
      document.querySelector("customerpayment-card").accounttype=arr[0].Account_Type;
      document.querySelector("customerpayment-card").paymenttype=arr[0].Payment_Type;
      document.querySelector("customerpayment-card").bankname=arr[0].Bank_Name;
      document.querySelector("customerpayment-card").branch=arr[0].Branch;
      document.querySelector("customerpayment-card").ifsccode=arr[0].IFSC_Code;
      document.querySelector("customerpayment-card").micrcode=arr[0].MICR_Code;
      document.querySelector("customerpayment-card").swiftcode=arr[0].Swift_Code;
      document.querySelector("customerpayment-card").term=arr[0].Payment_Term;
      document.querySelector("customerpayment-card"). setSelectType(arr[0].Payment_Type,arr[0].Payment_Term);
  },
    callItemService:function(supplierid){
      this.itemreadurl=sessionStorage.getItem("curr_sess_url")+"readcustomeriteminfo-service";
          var obj={"supplierid":""};
          this.supplierid=supplierid;
          obj.supplierid=supplierid;
          this.itemreadparam=obj;
      this.$.readitemajax.generateRequest();
    },
    readitemResponse:function(e){
      var arr= e.detail.response.itemarr;
      //alert(JSON.stringify(arr));
        if(this.supplierid!="")
        document.querySelector("customeritem-card").itemArray=arr;
  },
    callTaxreadService:function(){
      this.readtaxurl=sessionStorage.getItem("curr_sess_url")+"taxread-service";
      var obj={"customerid":""};
      this.customerid=localStorage.getItem('curr_sess_customerloggedid');
      obj.customerid=localStorage.getItem('curr_sess_customerloggedid');
      //alert(obj.customerid);
      this.readtaxparam=obj;
      this.$.readtaxajax.generateRequest();
    },
    readtaxResponse:function(e){
      var arr= e.detail.response.itemarr;
      //alert("tax...."+JSON.stringify(arr));
      document.querySelector("tax-card").tinno=arr[0].TIN;
      document.querySelector("tax-card").cstno=arr[0].CST;
      document.querySelector("tax-card").panno=arr[0].PAN;
      document.querySelector("tax-card").tanno=arr[0].TAN;
      document.querySelector("tax-card").cinno=arr[0].CIN;
    },
    callExcisereadService:function(){
      this.readexciseurl=sessionStorage.getItem("curr_sess_url")+"exciseread-service";
      var obj={"customerid":""};
      this.customerid=localStorage.getItem('curr_sess_customerloggedid');
      obj.customerid=localStorage.getItem('curr_sess_customerloggedid');
      //alert(obj.customerid);
      this.readexciseparam=obj;
      this.$.readexciseajax.generateRequest();
    },
    readexciseResponse:function(e){
      var arr= e.detail.response.itemarr;
      //alert("excise....."+JSON.stringify(arr));
      document.querySelector("excise-card").regno=arr[0].Reg_No;
      document.querySelector("excise-card").eccno=arr[0].Ecc_No;
      document.querySelector("excise-card").range=arr[0].Range;
      document.querySelector("excise-card").division=arr[0].Division;
      document.querySelector("excise-card").commission=arr[0].Commission;
      document.querySelector("excise-card").servicetax=arr[0].Service_Tax;
    },
    addsupplierService:function(supplieridd,suppliername,aliasname,address1,address2,doorno,streetno,streetname,location,city,district,state,country,pincode,phoneno,mobileno,emailid,faxno,website){
      obj1={
        "supplierid":"","suppliername":"","aliasname":"","address1":"","address2":"","doorno":"","streetno":"","streetname":"","location":"","city":"","district":"","state":"","country":"","pincode":"","phoneno":"","mobileno":"","emailid":"",
        "faxno":"","website":""
      };
      supplierid=supplieridd;
      obj1.supplierid=supplierid;
      obj1.suppliername=suppliername;
      obj1.aliasname=aliasname;
      obj1.address1=address1;
      obj1.address2=address2;
      obj1.doorno=doorno;
      obj1.streetno=streetno;
      obj1.streetname=streetname;
      obj1.location=location;
      obj1.city=city;
      obj1.district=district;
      obj1.state=state;
      obj1.country=country;
      obj1.pincode=pincode;
      obj1.phoneno=phoneno;
      obj1.mobileno=mobileno;
      obj1.emailid=emailid;
      obj1.faxno=faxno;
      obj1.website=website;
      },
    addsupplierResponse:function(e){
      //alert('supplier'+e.detail.response.returnval);
      //alert(JSON.stringify(obj3));
      if(e.detail.response.returnval=="succ"){
        this.customertaxaddparam=obj3;
        this.customertaxaddurl=sessionStorage.getItem("curr_sess_url")+"customertaxadd-service";
        this.$.customertaxaddajax.generateRequest();
      }
      else{
          //alert("Customer ID already exists!..Create new customer...");
          //window.location.href="../elements/indexhome.html";
      }
    },
    FnAddContactService:function(designation,mobileno,emailid){
    obj2={"customerid":"","designation":"","mobileno":"","emailid":""};
    obj2.customerid=localStorage.getItem('curr_sess_customerloggedid');
    obj2.designation=designation;
    obj2.mobileno=mobileno;
    obj2.emailid=emailid;
    this.customeraddcontactparam=obj2;
    this.customeraddcontacturl=sessionStorage.getItem("curr_sess_url")+"customeraddcontact-service";
    this.$.customeraddcontactajax.generateRequest();
  },
  customeraddcontactResponse:function(e){
    if(e.detail.response.itemarr=="succ") {
      alert('Contact Added!');
      //this.$.customerdialogcard.FnShowDialog("Contact Added!");
      this.FncustomerreadcontactService();
    }
    else
      this.$.customerdialogcard.FnShowDialog("Problem in adding contact!");
  },
  FncustomerreadcontactService:function(){
    document.querySelector("customer-page").setPage("Add Contact");
    var obj={"customerid":""};
    obj.customerid=localStorage.getItem('curr_sess_customerloggedid');
    //alert("In customer..."+obj.customerid);
    this.customerreadcontactparam=obj;
    this.customerreadcontacturl=sessionStorage.getItem("curr_sess_url")+"customerreadcontact-service";
    this.$.customerreadcontactajax.generateRequest();
  },
  customerreadcontactResponse:function(e) {
    //alert(JSON.stringify(e.detail.response.itemarr));
    document.querySelector('contactperson-card').itemArray=e.detail.response.itemarr;
  },
  FnCustomerTaxAddService:function(tin,cst,pan,tan,cin){
    obj3={"customerid":"","tin":"","cst":"","pan":"","tan":"","cin":""};
    obj3.customerid=localStorage.getItem('curr_sess_customerloggedid');
    //alert(obj3.customerid);
    obj3.tin=tin;
    obj3.cst=cst;
    obj3.pan=pan;
    obj3.tan=tan;
    obj3.cin=cin;
    document.querySelector('customer-page').setPage('Add Excise');
  },
  customertaxaddResponse:function(e){
    //alert('tax'+e.detail.response.returnval);
    //alert(JSON.stringify(obj4));
    if(e.detail.response.returnval=="succ") {
      this.customerexciseaddparam = obj4;
      this.customerexciseaddurl = sessionStorage.getItem("curr_sess_url") + "customerexciseadd-service";
      this.$.customeraddexciseajax.generateRequest();
    }
  },
  FnCustomerExciseAddService:function(regno,eccno,range,division,commission,servicetax){
    obj4={"customerid":"","regno":"","eccno":"","range":"","division":"","commission":"","servicetax":""};
    obj4.customerid=localStorage.getItem('curr_sess_customerloggedid');
    obj4.regno=regno;
    obj4.eccno=eccno;
    obj4.range=range;
    obj4.division=division;
    obj4.commission=commission;
    obj4.servicetax=servicetax;
    document.querySelector('customer-page').setPage('Add Payment');
  },
  customerexciseaddResponse:function(e) {
  //alert('excise' + e.detail.response.returnval);
  if (e.detail.response.returnval=="succ"){
    this.paymentparam = obj5;
    this.paymenturl = sessionStorage.getItem("curr_sess_url") + "addcustomerpayment-service";
    this.$.addpaymentajax.generateRequest();
  }
  },
  addpaymentService:function(accountname,accountno,accounttype,paymenttype,bankname,branch,ifsccode,micrcode,swiftcode,paymentterm){
    //alert('in payment!');
    obj5={
            "customerid":"","accountname":"","accountno":"","accounttype":"","paymenttype":"","bankname":"",
            "branch":"","ifsccode":"","micrcode":"","swiftcode":"","paymentterm":""
          };
          obj5.customerid=localStorage.getItem('curr_sess_customerloggedid');
          obj5.accountname=accountname;
          obj5.accountno=accountno;
          obj5.accounttype=accounttype;
          obj5.paymenttype=paymenttype;
          obj5.bankname=bankname;
          obj5.branch=branch;
          obj5.ifsccode=ifsccode;
          obj5.micrcode=micrcode;
          obj5.swiftcode=swiftcode;
          obj5.paymentterm=paymentterm;
          this.supplierparam=obj1;
        if(localStorage.getItem("curr_sess_searchtypeflag")=="nothing"){
          this.supplierurl=sessionStorage.getItem("curr_sess_url")+"addcustomer-service";
          this.$.addsupplierajax.generateRequest();
        }
  },
  addpaymentResponse:function(e){
  if(e.detail.response.returnval=="succ"){
    alert("Customer Added successfully!!");
  }
  else
    alert("Unable to add payment!");
  },
  additemService:function(itemflag,itemid, itemname, itemdes, container, quantity, itemgroup, itemtype,supplier, purchasetype){
     obj3={
            "itemflag":"","supplierid":"","itemid":"","itemname":"","itemdes":"","container":"","quantity":"","itemgroup":"","itemtype":"","itemsupplier":"","purchasetype":""
          };
          obj3.supplierid=supplierid;
          obj3.itemid=itemid;
          obj3.itemname=itemname;
          obj3.itemdes=itemdes;
          obj3.container=container;
          obj3.quantity=quantity;
          obj3.itemgroup=itemgroup;
          obj3.itemtype=itemtype;
          obj3.itemsupplier=supplier;
          obj3.purchasetype=purchasetype;
          obj3.itemflag=itemflag;
          this.supplierparam=obj1;
          if(localStorage.getItem("curr_sess_searchtypeflag")=="nothing"){
            this.supplierurl=sessionStorage.getItem("curr_sess_url")+"addcustomer-service";
            this.$.addsupplierajax.generateRequest();
          }
          else
          {
            this.itemurl=sessionStorage.getItem("curr_sess_url")+"additem-service";
            this.itemparam=obj3;
            this.$.additemajax.generateRequest();
          }
  },
  additemResponse:function(e){
    //this.$.addpaymentajax.generateRequest();
      if(e.detail.response.returnval=="succ"){
      //alert("Supplier Added!");
      //document.querySelector('supplieradditem-card').FnBtnDisable();
          this.$.dialogpage.FnShowDialog("Customer Added successfully!!","");
      }
      else
          alert("Unable to add customer!");
       // this.$.dialogpage.FnShowDialog("Failed to Add Supplier!!","");
    },
    updatesupplierService:function(supplierid,suppliername,aliasname,address1,address2,doorno,streetno,streetname,location,city,district,state,country,pincode,phoneno,mobileno,emailid,faxno,website){
      //alert(supplierid+" "+suppliername+" "+landmark+" "+location+" "+city+" "+district+" "+state+" "+country+" "+pincode+" "+phoneno+" "+mobileno+" "+emailid)
      obj1={
        "supplierid":"","suppliername":"","aliasname":"","address1":"","address2":"","doorno":"","streetno":"","streetname":"","location":"","city":"","district":"","state":"","country":"","pincode":"","phoneno":"","mobileno":"","emailid":"",
        "faxno":"","website":""
      };
      supplierid=localStorage.getItem('curr_sess_customerloggedid');
      obj1.supplierid=supplierid;
      obj1.suppliername=suppliername;
      obj1.aliasname=aliasname;
      obj1.address1=address1;
      obj1.address2=address2;
      obj1.doorno=doorno;
      obj1.streetno=streetno;
      obj1.streetname=streetname;
      obj1.location=location;
      obj1.city=city;
      obj1.district=district;
      obj1.state=state;
      obj1.country=country;
      obj1.pincode=pincode;
      obj1.phoneno=phoneno;
      obj1.mobileno=mobileno;
      obj1.emailid=emailid;
      obj1.faxno=faxno;
      obj1.website=website;
      //alert(JSON.stringify(obj1));
      },
     updatecustomerResponse:function(e){
      //alert("update customer...."+e.detail.response.returnval);
      if(e.detail.response.returnval=="succ"){
        this.updatetaxparam=obj3;
        this.updatetaxurl=sessionStorage.getItem("curr_sess_url")+"updatetax-service";
        this.$.updatetaxajax.generateRequest();
      }
      else{
          alert("Unable to update customer");
          window.location.href="../elements/indexhome.html";
      }
    },

    updatecustomertaxService:function(tin,cst,pan,tan,cin){
      obj3={"customerid":"","tin":"","cst":"","pan":"","tan":"","cin":""};
      obj3.customerid=localStorage.getItem('curr_sess_customerloggedid');
      //alert(obj3.customerid);
      obj3.tin=tin;
      obj3.cst=cst;
      obj3.pan=pan;
      obj3.tan=tan;
      obj3.cin=cin;
      //alert(JSON.stringify(obj3));
    },
    updatetaxResponse:function(e){
      //alert('tax update'+e.detail.response.returnval);
       if(e.detail.response.returnval=="succ") {
        this.updateexciseparam = obj4;
        this.updateexciseurl = sessionStorage.getItem("curr_sess_url") + "updateexcise-service";
        this.$.updateexciseajax.generateRequest();
      }
    },
    updatecustomerexciseService:function(regno,eccno,range,division,commission,servicetax){
      obj4={"customerid":"","regno":"","eccno":"","range":"","division":"","commission":"","servicetax":""};
      obj4.customerid=localStorage.getItem('curr_sess_customerloggedid');
      obj4.regno=regno;
      obj4.eccno=eccno;
      obj4.range=range;
      obj4.division=division;
      obj4.commission=commission;
      obj4.servicetax=servicetax;
      //alert(JSON.stringify(obj4));
    },
    updateexciseResponse:function(e) {
      //alert('update excise' + e.detail.response.returnval);
      if (e.detail.response.returnval=="succ"){
        this.updatecustomerpaymentparam=obj5;
        this.updatecustomerpaymenturl=sessionStorage.getItem("curr_sess_url")+"updatecustomerpayment-service";
        this.$.updatecustomerpaymentajax.generateRequest();
      }
    } ,
    updatepaymentService:function(accountname,accountno,accounttype,paymenttype,bankname,branch,ifsccode,micrcode,swiftcode,paymentterm){
      obj5={
        "customerid":"","accountname":"","accountno":"","accounttype":"","paymenttype":"","bankname":"",
        "branch":"","ifsccode":"","micrcode":"","swiftcode":"","paymentterm":""
      };
      obj5.customerid=localStorage.getItem('curr_sess_customerloggedid');
      obj5.accountname=accountname;
      obj5.accountno=accountno;
      obj5.accounttype=accounttype;
      obj5.paymenttype=paymenttype;
      obj5.bankname=bankname;
      obj5.branch=branch;
      obj5.ifsccode=ifsccode;
      obj5.micrcode=micrcode;
      obj5.swiftcode=swiftcode;
      obj5.paymentterm=paymentterm;
      //alert(JSON.stringify(obj5));
      this.updatecustomerparam=obj1;
      this.updatecustomerurl=sessionStorage.getItem("curr_sess_url")+"updatecustomer-service";
      this.$.updatecustomerajax.generateRequest();
    },
    updatecustomerpaymentResponse:function(e){
      //alert(e.detail.response.returnval);
      if(e.detail.response.returnval=="succ"){
        alert("Customer Info Updated successfully!!");
      }
      else
        alert("Unable to add payment!");
    },
    readcustomertoapproveService:function(){
      //alert("call");
      this.readcustomertoapproveurl=sessionStorage.getItem("curr_sess_url")+"readcustomertoapprove-service";
      this.$.readcustomertoapproveajax.generateRequest();
    },
    FnreadcustomertoapproveResponse:function(e){
      //alert(JSON.stringify(e.detail.response.itemarr));
      document.querySelector('approvecustomer-card').itemArray=e.detail.response.itemarr;
    },
    FnSetCustomerforApprove:function(customerid){
      approvecustomerarr.push(customerid);
    },
    approvecustomerforsalesService:function(){
      //alert("call"+JSON.stringify(approvesupplierarr));
      for(var i=0;i<approvecustomerarr.length;i++){
        var obj={"customerid":""};
        obj.customerid=approvecustomerarr[i];
        this.approvecustomerforsalesparam=obj;
        this.approvecustomerforsalesurl=sessionStorage.getItem("curr_sess_url")+"approvecustomerforsales-service";
        this.$.approvecustomerforsalesajax.generateRequest();
      }
    },
    FnapprovecustomerforsalesResponse:function(e){
      //alert(e.detail.response.itemarr);
      if(e.detail.response.itemarr=="succ"){
        alert("Customers are approved!!");
        window.location.href="../elements/indexhome.html";
      }
      else
        alert("Failed to approve the customer!!");
    }
  });
})();
