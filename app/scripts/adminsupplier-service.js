/**
 * Created by praba on 2/26/2016.
 */
(function() {
	var supplierid;
   var obj1;
  var obj2;
  var obj3;
  var approvesupplierarr=[];
  Polymer({
    is: "adminsupplier-service",
    ready: function () {

    },
    callSearchService:function(supplierid,suppliername){
	  this.supplierreadurl=sessionStorage.getItem("curr_sess_url")+"readsupplierinfo-service";
      var obj={"supplierid":"","suppliername":""};
      obj.supplierid=supplierid;
      obj.suppliername=suppliername;
      this.supplierreadparam=obj;
      this.$.readsupplierajax.generateRequest();
	},
	readsupplierResponse:function(e){
		var arr= e.detail.response.itemarr;
		//alert(JSON.stringify(arr));
		document.querySelector("addsupplier-card").supplierid=arr[0].supplierid;
		document.querySelector("addsupplier-card").suppliername=arr[0].suppliername;
		document.querySelector("addsupplier-card").landmark=arr[0].landmark;
		document.querySelector("addsupplier-card").location=arr[0].location;
        document.querySelector("addsupplier-card").city=arr[0].city;
        document.querySelector("addsupplier-card").district=arr[0].district;
        document.querySelector("addsupplier-card").state=arr[0].state;
        document.querySelector("addsupplier-card").country=arr[0].country;
        document.querySelector("addsupplier-card").pincode=arr[0].pincode;
        document.querySelector("addsupplier-card").phoneno=arr[0].phoneno;
        document.querySelector("addsupplier-card").mobileno=arr[0].mobileno;
        document.querySelector("addsupplier-card").emailid=arr[0].emailid;
        //To call show item card when click item detail tab after add supplier page
        document.querySelector("supplieradditem-card").FnSetValue(arr[0].supplierid,arr[0].suppliername);
        document.querySelector("supplieritem-card").FnFetchItemInfo(arr[0].supplierid,arr[0].suppliername);
	},
	callPaymentService:function(supid,supname){
		this.paymentreadurl=sessionStorage.getItem("curr_sess_url")+"readpaymentinfo-service";
		      var obj={"supplierid":"","suppliername":""};
		      obj.supplierid=supid;
		      obj.suppliername=supname;
		      this.paymentreadparam=obj;
      this.$.readpaymentajax.generateRequest();
	},
	readpaymentResponse:function(e){
		var arr= e.detail.response.itemarr;
	    document.querySelector("payment-card").paymenttype=arr[0].paymenttype;
	    document.querySelector("payment-card").bankname=arr[0].bankname;
	    document.querySelector("payment-card").accountno=arr[0].accountno;
	    document.querySelector("payment-card").address=arr[0].address;
	    document.querySelector("payment-card").term=arr[0].paymentterm;
	    document.querySelector("payment-card"). setSelectType(arr[0].paymenttype,arr[0].paymentterm);

	},
    callItemService:function(supplierid){
	this.itemreadurl=sessionStorage.getItem("curr_sess_url")+"readiteminfo-service";
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
		    document.querySelector("supplieritem-card").itemArray=arr;
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
		  this.paymenturl=sessionStorage.getItem("curr_sess_url")+"addpayment-service";
		  this.$.addpaymentajax.generateRequest();
		  //document.querySelector('addsupplier-card').FnBtnDisable();
      //this.$.dialogpage.FnShowDialog("Supplier Added successfully!!","");
      }
      else{
      	  alert("Supplier ID already exists!..Create new supplier...");
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
              this.supplierurl=sessionStorage.getItem("curr_sess_url")+"addsupplier-service";
		      this.$.addsupplierajax.generateRequest();
		  	  }

	},
	addpaymentResponse:function(e){

	if(e.detail.response.returnval=="succ"){
		alert("Supplier Added successfully!!");
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
              this.supplierurl=sessionStorage.getItem("curr_sess_url")+"addsupplier-service";
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
          this.$.dialogpage.FnShowDialog("Supplier Added successfully!!","");
      }
      else
      	  alert("Unable to add suppliers!");
       // this.$.dialogpage.FnShowDialog("Failed to Add Supplier!!","");
    },
    updatesupplierService:function(supplieridd,suppliername,landmark,location,city,district,state,country,pincode,phoneno,mobileno,emailid){
    	//alert(supplieridd+" "+suppliername+" "+landmark+" "+location+" "+city+" "+district+" "+state+" "+country+" "+pincode+" "+phoneno+" "+mobileno+" "+emailid)
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
     updatesupplierResponse:function(e){
     	//alert(e.detail.response.returnval);
      if(e.detail.response.returnval=="succ"){
		  //alert("Supplier Added!");
		  this.updatepaymentparam=obj2;
		  this.updatepaymenturl=sessionStorage.getItem("curr_sess_url")+"updatepayment-service";
		  this.$.updatepaymentajax.generateRequest();

		  //document.querySelector('addsupplier-card').FnBtnDisable();
          //this.$.dialogpage.FnShowDialog("Supplier Added successfully!!","");
      }
      else{
      	  alert("Supplier ID already exists!..Create new supplier...");
      	  window.location.href="../elements/indexhome.html";
      }
       // this.$.dialogpage.FnShowDialog("Failed to Add Supplier!!","");
    },
    updatepaymentService:function(accno,bankname,address,mode,paymentterm){
    	//alert(accno+" "+bankname+" "+address+" "+mode+" "+paymentterm);
		 obj2={
		        "supplierid":"","accno":"","bankname":"","mode":"","paymentterm":""
		      };
		      obj2.supplierid=supplierid;
		      obj2.accno=accno;
		      obj2.bankname=bankname;
		      obj2.mode=mode;
		      obj2.paymentterm=paymentterm;
		      obj2.address=address;
  			  this.updatesupplierparam=obj1;

			  //if(localStorage.getItem("curr_sess_searchtypeflag")=="nothing"){
          this.updatesupplierurl=sessionStorage.getItem("curr_sess_url")+"updatesupplier-service";
		      this.$.updatesupplierajax.generateRequest();
		  	  //}

	},
	updatepaymentResponse:function(e){
		//alert(e.detail.response.returnval);
	if(e.detail.response.returnval=="succ"){
		alert("Supplier Info Updated successfully!!");
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
    readsuppliertoapproveService:function(){
    	//alert("call");
      this.readsuppliertoapproveurl=sessionStorage.getItem("curr_sess_url")+"readsuppliertoapprove-service";
      this.$.readsuppliertoapproveajax.generateRequest();
    },
    FnreadsuppliertoapproveResponse:function(e){
      //alert(e.detail.response.itemarr);
      document.querySelector('approvesupplier-card').itemArray=e.detail.response.itemarr;
    },
    FnSetSupplierforApprove:function(supplierid){
    	approvesupplierarr.push(supplierid);
    },
     approvesupplierforpurchaseService:function(){
      //alert("call"+JSON.stringify(approvesupplierarr));
      	
      for(var i=0;i<approvesupplierarr.length;i++){
      var obj={"supplierid":""};
      obj.supplierid=approvesupplierarr[i];
      this.approvesupplierforpurchaseparam=obj;
      this.approvesupplierforpurchaseurl=sessionStorage.getItem("curr_sess_url")+"approvesupplierforpurchase-service";
      this.$.approvesupplierforpurchaseajax.generateRequest();
  	  }
    },
    FnapprovesupplierforpurchaseResponse:function(e){
      //alert(e.detail.response.itemarr);
      if(e.detail.response.itemarr=="succ"){
      	alert("Suppliers are approved!!");
      	window.location.href="../elements/indexhome.html";
      }
      else
      	alert("Failed to approve the supplier!!");
      //document.querySelector('approvesupplier-card').itemArray=e.detail.response.itemarr;
    }

  });
})();
