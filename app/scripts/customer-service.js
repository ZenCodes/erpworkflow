/**
 * Created by praba on 2/26/2016.
 */
(function() {
  var supplierid;
   var obj1;
  var obj2;
  var obj3;
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
        /*document.querySelector("payment-card").bankname=arr[0].bankname;
        document.querySelector("payment-card").accountno=arr[0].accountno;
        document.querySelector("payment-card").address=arr[0].address;
        document.querySelector("payment-card").selection=arr[0].paymentterm;
        document.querySelector("payment-card"). setSelectType(arr[0].paymenttype,arr[0].paymentterm);*/

  },
    addsupplierService:function(supplieridd,suppliername,landmark,location,city,district,state,country,pincode,phoneno,mobileno,emailid){

      obj1={
        "supplierid":"","suppliername":"","landmark":"","location":"","city":"","district":"","state":"","country":"","pincode":"","phoneno":"","mobileno":"","emailid":""
      };
      supplierid=supplieridd;
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
    addsupplierResponse:function(e){

      if(e.detail.response.returnval=="succ"){
      //alert("Supplier Added!");
      this.paymentparam=obj2;
      this.paymenturl=sessionStorage.getItem("curr_sess_url")+"addcustomerpayment-service";
      this.$.addpaymentajax.generateRequest();

      //document.querySelector('addsupplier-card').FnBtnDisable();
          //this.$.dialogpage.FnShowDialog("Supplier Added successfully!!","");
      }
      else{
          alert("Customer ID already exists!..Create new customer...");
          window.location.href="../elements/indexhome.html";
      }
       // this.$.dialogpage.FnShowDialog("Failed to Add Supplier!!","");
    },
    addpaymentService:function(accno,bankname,address,mode,paymentterm){
     obj2={
            "supplierid":"","accno":"","bankname":"","mode":"","paymentterm":""
          };
          obj2.supplierid=supplierid;
          obj2.accno=accno;
          obj2.bankname=bankname;
          obj2.mode=mode;
          obj2.paymentterm=paymentterm;
          obj2.address=address;
          this.supplierparam=obj1;

        if(localStorage.getItem("curr_sess_searchtypeflag")=="nothing"){
              this.supplierurl=sessionStorage.getItem("curr_sess_url")+"addcustomer-service";
          this.$.addsupplierajax.generateRequest();
          }

  },
  addpaymentResponse:function(e){

  if(e.detail.response.returnval=="succ"){
    alert("Customer Added successfully!!");
    //this.itemurl=sessionStorage.getItem("curr_sess_url")+"additem-service";
    //this.itemparam=obj3;
        //this.$.additemajax.generateRequest();
        //document.querySelector('addsupplier-card').FnBtnDisable();
        //this.$.dialogpage.FnShowDialog("Supplier Added successfully!!","");
        }
        else
            alert("Unable to add payment!");
         // this.$.dialogpage.FnShowDialog("Failed to Add Supplier!!","");
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
    updatesupplierService:function(supplieridd,suppliername,landmark,location,city,district,state,country,pincode,phoneno,mobileno,emailid){
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
    //this.itemurl=sessionStorage.getItem("curr_sess_url")+"additem-service";
    //this.itemparam=obj3;
        //this.$.additemajax.generateRequest();
        //document.querySelector('addsupplier-card').FnBtnDisable();
        //this.$.dialogpage.FnShowDialog("Supplier Added successfully!!","");
        }
        else
            alert("Unable to add payment!");
         // this.$.dialogpage.FnShowDialog("Failed to Add Supplier!!","");
    }


  });
})();
