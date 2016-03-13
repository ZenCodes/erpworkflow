/**
 * Created by praba on 2/26/2016.
 */
(function() {
	var supplierid;
   var obj1;
  var obj2;
  var obj3;
  Polymer({
    is: "adminsupplier-service",
    ready: function () {

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
		  this.paymenturl=sessionStorage.getItem("curr_sess_url")+"addpayment-service";
		  this.$.addpaymentajax.generateRequest();

		  //document.querySelector('addsupplier-card').FnBtnDisable();
          //this.$.dialogpage.FnShowDialog("Supplier Added successfully!!","");
      }
      else
      	  alert("Unable to add supplier!");
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


	},
	addpaymentResponse:function(e){

	if(e.detail.response.returnval=="succ"){
		//alert("payment Added!");
		this.itemurl=sessionStorage.getItem("curr_sess_url")+"additem-service";
		this.itemparam=obj3;
        this.$.additemajax.generateRequest();
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
              this.supplierurl=sessionStorage.getItem("curr_sess_url")+"addsupplier-service";
		      this.$.addsupplierajax.generateRequest();

	},
	additemResponse:function(e){
		//this.$.addpaymentajax.generateRequest();
      if(e.detail.response.returnval=="succ"){
		  alert("Supplier Added!");
		  //document.querySelector('addsupplier-card').FnBtnDisable();
          //this.$.dialogpage.FnShowDialog("Supplier Added successfully!!","");
      }
      else
      	  alert("Unable to add suppliers!");
       // this.$.dialogpage.FnShowDialog("Failed to Add Supplier!!","");
    }

  });
})();
