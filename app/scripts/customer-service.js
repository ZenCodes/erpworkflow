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
  Polymer({
    is: "customer-service",
    ready: function () {

    },
    callSearchService:function(supplierid,suppliername){
    this.supplierreadurl=sessionStorage.getItem("curr_sess_url")+"readcustomerinfo-service";
      var obj={"supplierid":"","suppliername":""};
      obj.supplierid=supplierid;
      obj.suppliername=suppliername;
      this.supplierreadparam=obj;
      this.$.readsupplierajax.generateRequest();
  },
  readsupplierResponse:function(e){
    var arr= e.detail.response.itemarr;
   // alert(JSON.stringify(arr));
    document.querySelector("addcustomer-card").supplierid=arr[0].supplierid;
    document.querySelector("addcustomer-card").suppliername=arr[0].suppliername;
    document.querySelector("addcustomer-card").landmark=arr[0].landmark;
    document.querySelector("addcustomer-card").location=arr[0].location;
        document.querySelector("addcustomer-card").city=arr[0].city;
        document.querySelector("addcustomer-card").district=arr[0].district;
        document.querySelector("addcustomer-card").state=arr[0].state;
        document.querySelector("addcustomer-card").country=arr[0].country;
        document.querySelector("addcustomer-card").pincode=arr[0].pincode;
        document.querySelector("addcustomer-card").phoneno=arr[0].phoneno;
        document.querySelector("addcustomer-card").mobileno=arr[0].mobileno;
        document.querySelector("addcustomer-card").emailid=arr[0].emailid;
        //To call show item card when click item detail tab after add supplier page
        document.querySelector("customeradditem-card").FnSetValue(arr[0].supplierid,arr[0].suppliername);
        document.querySelector("customeritem-card").FnFetchItemInfo(arr[0].supplierid,arr[0].suppliername);
  },
  callPaymentService:function(supid,supname){
    this.paymentreadurl=sessionStorage.getItem("curr_sess_url")+"readcustomerpaymentinfo-service";
          var obj={"supplierid":"","suppliername":""};
          obj.supplierid=supid;
          obj.suppliername=supname;
          this.paymentreadparam=obj;
      this.$.readpaymentajax.generateRequest();
  },
  readpaymentResponse:function(e){
    var arr= e.detail.response.itemarr;
    //alert(JSON.stringify(arr));
      document.querySelector("customerpayment-card").paymenttype=arr[0].paymenttype;
      document.querySelector("customerpayment-card").bankname=arr[0].bankname;
      document.querySelector("customerpayment-card").accountno=arr[0].accountno;
      document.querySelector("customerpayment-card").address=arr[0].address;
      document.querySelector("customerpayment-card").term=arr[0].paymentterm;
      document.querySelector("customerpayment-card"). setSelectType(arr[0].paymenttype,arr[0].paymentterm);

  },
    callItemService:function(supplierid){
      this.itemreadurl=sessionStorage.getItem("curr_sess_url")+"readcustomeriteminfo-service";
          var obj={"supplierid":""};
          //alert("supplier: "+supplierid);
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
      alert('customer added!'+e.detail.response.returnval);
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
    var obj2={"customerid":"","designation":"","mobileno":"","emailid":""};
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
      document.querySelector("customer-page").setPage("Add Contact");
      var obj={"customerid":""};
      obj.customerid=localStorage.getItem('curr_sess_customerloggedid');
      //alert(obj.customerid);
      this.customerreadcontactparam=obj;
      this.customerreadcontacturl=sessionStorage.getItem("curr_sess_url")+"customerreadcontact-service";
      this.$.customerreadcontactajax.generateRequest();
    }
    else
      this.$.customerdialogcard.FnShowDialog("Problem in adding contact!");
  },
  customerreadcontactResponse:function(e) {
    document.querySelector('contactperson-card').itemArray=e.detail.response.itemarr;
  },
  FnCustomerTaxAddService:function(tin,cst,pan,tan,cin){
    var obj3={"customerid":"","tin":"","cst":"","pan":"","tan":"","cin":""};
    obj3.customerid=localStorage.getItem('curr_sess_customerloggedid');
    alert(obj3.customerid);
    obj3.tin=tin;
    obj3.cst=cst;
    obj3.pan=pan;
    obj3.tan=tan;
    obj3.cin=cin;
    document.querySelector('customer-page').setPage('Add Excise');
  },
  customertaxaddResponse:function(e){
    //alert('tax'+e.detail.response.returnval);
    if(e.detail.response.returnval=="succ") {
      this.customerexciseaddparam = obj4;
      this.customerexciseaddurl = sessionStorage.getItem("curr_sess_url") + "customerexciseadd-service";
      this.$.customerexciseaddjax.generateRequest();
    }
  },
  FnCustomerExciseAddService:function(regno,eccno,range,division,commission,servicetax){
    var obj4={"customerid":"","regno":"","eccno":"","range":"","division":"","commission":"","servicetax":""};
    obj4.customerid=localStorage.getItem('curr_sess_customerloggedid');
    alert(obj4.customerid);
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
    alert('in payment!');
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
      //alert(supplieridd+" "+suppliername+" "+landmark+" "+location+" "+city+" "+district+" "+state+" "+country+" "+pincode+" "+phoneno+" "+mobileno+" "+emailid)
      obj1={
        "supplierid":"","suppliername":"","landmark":"","location":"","city":"","district":"","state":"","country":"","pincode":"","phoneno":"","mobileno":"","emailid":""
      };
      supplierid=supplieridd;
      //alert(supplierid);
      obj1.supplierid=supplierid;
      obj1.suppliername=suppliername;
      obj1.landmark=landmark;
      obj1.location=location;
      obj1.city=city;
      obj1.district=district;
      obj1.state=state;
      obj1.country=country;
      obj1.pincode=pincode;
      obj1.phoneno=phoneno;
      obj1.mobileno=mobileno;
      obj1.emailid=emailid;
      },
     updatecustomerResponse:function(e){
      //alert(e.detail.response.returnval);
      if(e.detail.response.returnval=="succ"){
      //alert("Supplier Added!");
      this.updatecustomerpaymentparam=obj2;
      this.updatecustomerpaymenturl=sessionStorage.getItem("curr_sess_url")+"updatecustomerpayment-service";
      this.$.updatecustomerpaymentajax.generateRequest();

      //document.querySelector('addsupplier-card').FnBtnDisable();
          //this.$.dialogpage.FnShowDialog("Supplier Added successfully!!","");
      }
      else{
          alert("Unable to update customer");
          window.location.href="../elements/indexhome.html";
      }
       // this.$.dialogpage.FnShowDialog("Failed to Add Supplier!!","");
    },
    updatepaymentService:function(accno,bankname,address,mode,paymentterm){
      //alert(supplierid+" "+accno+" "+bankname+" "+address+" "+mode+" "+paymentterm);
     obj2={
            "supplierid":"","accno":"","bankname":"","mode":"","paymentterm":""
          };
          obj2.supplierid=supplierid;
          obj2.accno=accno;
          obj2.bankname=bankname;
          obj2.mode=mode;
          obj2.paymentterm=paymentterm;
          obj2.address=address;
          this.updatecustomerparam=obj1;

        //if(localStorage.getItem("curr_sess_searchtypeflag")=="nothing"){
          this.updatecustomerurl=sessionStorage.getItem("curr_sess_url")+"updatecustomer-service";
          this.$.updatecustomerajax.generateRequest();
          //}

  },
  updatecustomerpaymentResponse:function(e){
    //alert(e.detail.response.returnval);
    if(e.detail.response.returnval=="succ"){
    alert("Customer Info Updated successfully!!");
    }
    else
    alert("Unable to add payment!");
  }


  });
})();
