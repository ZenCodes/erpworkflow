/**
 * Created by praba on 2/26/2016.
 */
 // JS component for adminsupplier-service
(function() {
	var supplierid;
   var obj1;
  var obj2;
  var obj3;
  var obj4;
  var obj5;
  var obj6;
  var approvesupplierarr=[];
  Polymer({
    is: "adminsupplier-service",
    ready: function () {

    },
  //Method which make req to fetch the supplier information while searching 
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
    localStorage.setItem('curr_sess_supplierloggedid',arr[0].Supplier_ID);
    // Method which bind the searched supplier information to the supplier card
    document.querySelector("addsupplier-card").suppliername=arr[0].Supplier_Name;
    document.querySelector("addsupplier-card").aliasname=arr[0].Alias_Name;
    document.querySelector("addsupplier-card").address1=arr[0].Address1;
    document.querySelector("addsupplier-card").address2=arr[0].Address2;
    document.querySelector("addsupplier-card").doorno=arr[0].Doorno;
    document.querySelector("addsupplier-card").streetno=arr[0].Streetno;
    document.querySelector("addsupplier-card").streetname=arr[0].Street_Name;
    document.querySelector("addsupplier-card").location=arr[0].Location;
    document.querySelector("addsupplier-card").city=arr[0].City;
    document.querySelector("addsupplier-card").district=arr[0].District;
    document.querySelector("addsupplier-card").state=arr[0].State;
    document.querySelector("addsupplier-card").country=arr[0].Country;
    document.querySelector("addsupplier-card").pincode=arr[0].Pincode;
    document.querySelector("addsupplier-card").phoneno=arr[0].Phoneno;
    document.querySelector("addsupplier-card").mobileno=arr[0].Mobileno;
    document.querySelector("addsupplier-card").emailid=arr[0].Email;
    document.querySelector("addsupplier-card").faxno=arr[0].Faxno;
    document.querySelector("addsupplier-card").website=arr[0].Website;
    //To call show item card when click item detail tab after add supplier page
    document.querySelector("supplieradditem-card").FnSetValue(arr[0].Supplier_ID,arr[0].Supplier_Name);
    document.querySelector("supplieritem-card").FnFetchItemInfo(arr[0].Supplier_ID,arr[0].Supplier_Name);
	},
  // Method which make request to search the payment information of the searched supplier
	callPaymentService:function(){
		this.paymentreadurl=sessionStorage.getItem("curr_sess_url")+"readpaymentinfo-service";
		var obj={"supplierid":"","suppliername":""};
		obj.supplierid=localStorage.getItem('curr_sess_supplierloggedid');		      
		this.paymentreadparam=obj;
    this.$.readpaymentajax.generateRequest();
	},
	readpaymentResponse:function(e){
		var arr= e.detail.response.itemarr;
    // Binding payment information of the searched supplier to payment card 
    document.querySelector("payment-card").accountname=arr[0].Account_Name;
    document.querySelector("payment-card").accountno=arr[0].Account_No;
    document.querySelector("payment-card").accounttype=arr[0].Account_Type;
    document.querySelector("payment-card").paymenttype=arr[0].Payment_Type;
    document.querySelector("payment-card").bankname=arr[0].Bank_Name;
    document.querySelector("payment-card").branch=arr[0].Branch;
    document.querySelector("payment-card").ifsccode=arr[0].IFSC_Code;
    document.querySelector("payment-card").micrcode=arr[0].MICR_Code;
    document.querySelector("payment-card").swiftcode=arr[0].Swift_Code;
    document.querySelector("payment-card").term=arr[0].Payment_Term;
    document.querySelector("payment-card"). setSelectType(arr[0].Payment_Type,arr[0].Payment_Term);
	},
  // Fetching item information against the supplier
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
			if(this.supplierid!="")
	    document.querySelector("supplieritem-card").itemArray=arr;
	},
  // Fetching tax information for the searched supplier
  callTaxreadService:function(){
    this.readtaxurl=sessionStorage.getItem("curr_sess_url")+"suppliertaxread-service";
    var obj={"supplierid":""};
    this.supplierid=localStorage.getItem('curr_sess_supplierloggedid');
    obj.supplierid=localStorage.getItem('curr_sess_supplierloggedid');
    this.readtaxparam=obj;
    this.$.readtaxajax.generateRequest();
  },
  readtaxResponse:function(e){
    var arr= e.detail.response.itemarr;
    // Binding tax information to the supplier tax card for the searched supplier
    document.querySelector("suppliertax-card").tinno=arr[0].TIN;
    document.querySelector("suppliertax-card").cstno=arr[0].CST;
    document.querySelector("suppliertax-card").panno=arr[0].PAN;
    document.querySelector("suppliertax-card").tanno=arr[0].TAN;
    document.querySelector("suppliertax-card").cinno=arr[0].CIN;
    document.querySelector("suppliertax-card").FnEnableFields();
  },
  // Fetching excise information for the searched supplier
  callExcisereadService:function(){
    this.readexciseurl=sessionStorage.getItem("curr_sess_url")+"supplierexciseread-service";
    var obj={"supplierid":""};
    this.supplierid=localStorage.getItem('curr_sess_supplierloggedid');
    obj.supplierid=localStorage.getItem('curr_sess_supplierloggedid');    
    this.readexciseparam=obj;
    this.$.readexciseajax.generateRequest();
  },
  readexciseResponse:function(e){
    var arr= e.detail.response.itemarr;
    // Binding excise information to the supplier excise card for the searched supplier
    document.querySelector("supplierexcise-card").regno=arr[0].Reg_No;
    document.querySelector("supplierexcise-card").eccno=arr[0].Ecc_No;
    document.querySelector("supplierexcise-card").range=arr[0].Range;
    document.querySelector("supplierexcise-card").division=arr[0].Division;
    document.querySelector("supplierexcise-card").commission=arr[0].Commission;
    document.querySelector("supplierexcise-card").servicetax=arr[0].Service_Tax;
    document.querySelector("supplierexcise-card").FnEnableFields();
  },
  // Method which make request to add the supplier
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
      if(e.detail.response.returnval=="succ"){
        localStorage.setItem('curr_sess_supplierloggedid',e.detail.response.id);
        obj3.supplierid=localStorage.getItem('curr_sess_supplierloggedid');
        this.customertaxaddparam=obj3;
        this.customertaxaddurl=sessionStorage.getItem("curr_sess_url")+"suppliertaxadd-service";
        this.$.customertaxaddajax.generateRequest();
      }
      else{
      }
  },
  // Function which make request to add the supplier tax info
  FnCustomerTaxAddService:function(tin,cst,pan,tan,cin){
      obj3={"supplierid":"","tin":"","cst":"","pan":"","tan":"","cin":""};
      obj3.supplierid=localStorage.getItem('curr_sess_supplierloggedid');      
      obj3.tin=tin;
      obj3.cst=cst;
      obj3.pan=pan;
      obj3.tan=tan;
      obj3.cin=cin;      
      document.querySelector('supplier-page').setPage('Add Excise');
  },
  customertaxaddResponse:function(e){
      if(e.detail.response.returnval=="succ") {
        obj4.supplierid=localStorage.getItem('curr_sess_supplierloggedid');
        this.customerexciseaddparam = obj4;
        this.customerexciseaddurl = sessionStorage.getItem("curr_sess_url") + "supplierexciseadd-service";
        this.$.customeraddexciseajax.generateRequest();
      }
  },
  // Function which make request to add the supplier excise info
  FnSupplierExciseAddService:function(regno,eccno,range,division,commission,servicetax){
      obj4={"supplierid":"","regno":"","eccno":"","range":"","division":"","commission":"","servicetax":""};
      obj4.supplierid=localStorage.getItem('curr_sess_supplierloggedid');
      obj4.regno=regno;
      obj4.eccno=eccno;
      obj4.range=range;
      obj4.division=division;
      obj4.commission=commission;
      obj4.servicetax=servicetax;      
      document.querySelector('supplier-page').setPage('Add Payment');
    },
    customerexciseaddResponse:function(e) {
      if (e.detail.response.returnval=="succ"){
        obj5.supplierid=localStorage.getItem('curr_sess_supplierloggedid');
        this.paymentparam = obj5;
        this.paymenturl = sessionStorage.getItem("curr_sess_url") + "addpayment-service";
        this.$.addpaymentajax.generateRequest();
      }
    },
    // Function which make request to add the supplier payment info
    addpaymentService:function(accountname,accountno,accounttype,paymenttype,bankname,branch,ifsccode,micrcode,swiftcode,paymentterm){
      obj5={
        "supplierid":"","accountname":"","accountno":"","accounttype":"","paymenttype":"","bankname":"",
        "branch":"","ifsccode":"","micrcode":"","swiftcode":"","paymentterm":""
      };
      obj5.supplierid=localStorage.getItem('curr_sess_supplierloggedid');
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
        this.supplierurl=sessionStorage.getItem("curr_sess_url")+"addsupplier-service";
        this.$.addsupplierajax.generateRequest();
      }
    },
    addpaymentResponse:function(e){      
      if(e.detail.response.returnval=="succ"){
        alert("Supplier Added successfully!!");
      }
      else
        alert("Unable to add payment!");
    },
    // Function which make request to add item to the supplier
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
      if(e.detail.response.returnval=="succ"){
        this.$.dialogpage.FnShowDialog("Supplier Added successfully!!","");
      }
      else
      	alert("Unable to add suppliers!");       
  },
  // // Function which make request to update the supplier info
  updatesupplierService:function(supplierid,suppliername,aliasname,address1,address2,doorno,streetno,streetname,location,city,district,state,country,pincode,phoneno,mobileno,emailid,faxno,website){
      obj1={
        "supplierid":"","suppliername":"","aliasname":"","address1":"","address2":"","doorno":"","streetno":"","streetname":"","location":"","city":"","district":"","state":"","country":"","pincode":"","phoneno":"","mobileno":"","emailid":"",
        "faxno":"","website":""
      };
      supplierid=localStorage.getItem('curr_sess_supplierloggedid');
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
    updatesupplierResponse:function(e){
       if(e.detail.response.returnval=="succ"){
        this.updatetaxparam=obj3;
        this.updatetaxurl=sessionStorage.getItem("curr_sess_url")+"supplierupdatetax-service";
        this.$.updatetaxajax.generateRequest();
      }
      else{
        alert("Unable to update supplier");
        window.location.href="../elements/indexhome.html";
      }
    },
    // Function which make request to add the supplier tax info
    updatesuppliertaxService:function(tin,cst,pan,tan,cin){
      obj3={"supplierid":"","tin":"","cst":"","pan":"","tan":"","cin":""};
      obj3.supplierid=localStorage.getItem('curr_sess_supplierloggedid');      
      obj3.tin=tin;
      obj3.cst=cst;
      obj3.pan=pan;
      obj3.tan=tan;
      obj3.cin=cin;      
    },
    updatetaxResponse:function(e){      
      if(e.detail.response.returnval=="succ") {
        this.updateexciseparam = obj4;
        this.updateexciseurl = sessionStorage.getItem("curr_sess_url") + "supplierupdateexcise-service";
        this.$.updateexciseajax.generateRequest();
      }
    },
    // Function which make request to update the supplier excise info
    updatesupplierexciseService:function(regno,eccno,range,division,commission,servicetax){
      obj4={"supplierid":"","regno":"","eccno":"","range":"","division":"","commission":"","servicetax":""};
      obj4.supplierid=localStorage.getItem('curr_sess_supplierloggedid');
      obj4.regno=regno;
      obj4.eccno=eccno;
      obj4.range=range;
      obj4.division=division;
      obj4.commission=commission;
      obj4.servicetax=servicetax;      
    },
    updateexciseResponse:function(e) {      
      if (e.detail.response.returnval=="succ"){
        this.updatepaymentparam=obj5;
        this.updatepaymenturl=sessionStorage.getItem("curr_sess_url")+"updatepayment-service";
        this.$.updatepaymentajax.generateRequest();
      }
    } ,
    // Function which make request to update the supplier payment info
    updatepaymentService:function(accountname,accountno,accounttype,paymenttype,bankname,branch,ifsccode,micrcode,swiftcode,paymentterm){
      obj5={
        "supplierid":"","accountname":"","accountno":"","accounttype":"","paymenttype":"","bankname":"",
        "branch":"","ifsccode":"","micrcode":"","swiftcode":"","paymentterm":""
      };
      obj5.supplierid=localStorage.getItem('curr_sess_supplierloggedid');
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
      this.updatesupplierparam=obj1;
      this.updatesupplierurl=sessionStorage.getItem("curr_sess_url")+"updatesupplier-service";
      this.$.updatesupplierajax.generateRequest();
    },
    updatepaymentResponse:function(e){      
      if(e.detail.response.returnval=="succ"){
        alert("Supplier Info Updated successfully!!");
      }
      else
        alert("Unable to add payment!");
    },
    // Function which fetch the created supplier for approval
    readsuppliertoapproveService:function(){    	
      this.readsuppliertoapproveurl=sessionStorage.getItem("curr_sess_url")+"readsuppliertoapprove-service";
      this.$.readsuppliertoapproveajax.generateRequest();
    },
    FnreadsuppliertoapproveResponse:function(e){      
      document.querySelector('approvesupplier-card').itemArray=e.detail.response.itemarr;
    },
    // Function which receive all the suppliers who have accepted for approve
    FnSetSupplierforApprove:function(supplierid){
    	approvesupplierarr.push(supplierid);
    },
    // Function which make request to approve the created supplier
    approvesupplierforpurchaseService:function(status){
      var obj={"supplierid":"","status":""};
      obj.status=status;      
      obj.supplierid=sessionStorage.getItem("sess_curr_supplierid");
      this.approvesupplierforpurchaseparam=obj;
      this.approvesupplierforpurchaseurl=sessionStorage.getItem("curr_sess_url")+"approvesupplierforpurchase-service";
      this.$.approvesupplierforpurchaseajax.generateRequest();
    },
    FnapprovesupplierforpurchaseResponse:function(e){
      if(e.detail.response.itemarr=="succ"){
        this.$.dialogpage.FnShowDialog(sessionStorage.getItem("sess_curr_suppliername")+" Approved Successfully!!","");
      	window.location.href="../elements/indexhome.html";
      }
      else
      	alert("Failed to approve the supplier!!");
    },
    // Function which make request to add the supplier contact info
    FnAddContactService:function(designation,mobileno,emailid){
      obj2={"supplierid":"","designation":"","mobileno":"","emailid":""};
      obj2.supplierid=localStorage.getItem('curr_sess_supplierloggedid');
      obj2.designation=designation;
      obj2.mobileno=mobileno;
      obj2.emailid=emailid;
      this.supplieraddcontactparam=obj2;
      this.supplieraddcontacturl=sessionStorage.getItem("curr_sess_url")+"supplieraddcontact-service";
      this.$.supplieraddcontactajax.generateRequest();
    },
    supplieraddcontactResponse:function(e){
      if(e.detail.response.itemarr=="succ") {
        alert('Contact Added!');        
        this.FnsupplierreadcontactService();
      }
      else
        alert("Problem in adding contact!");
    },
    // Function which make request to fetch the supplier contact info
    FnsupplierreadcontactService:function(){
      document.querySelector("supplier-page").setPage("Add Contact");
      var obj={"supplierid":""};
      obj.supplierid=localStorage.getItem('curr_sess_supplierloggedid');      
      this.supplierreadcontactparam=obj;
      this.supplierreadcontacturl=sessionStorage.getItem("curr_sess_url")+"supplierreadcontact-service";
      this.$.supplierreadcontactajax.generateRequest();
    },
    supplierreadcontactResponse:function(e) {      
      document.querySelector('suppliercontactperson-card').itemArray=e.detail.response.itemarr;
    },
    // Function which make request to read the supplier info
    FnSupplierinforeadService:function(){
      var obj={"supplierid":""};
      obj.supplierid=sessionStorage.getItem("sess_curr_supplierid");      
      this.supplierinforeadparam=obj;
      this.supplierinforeadurl=sessionStorage.getItem("curr_sess_url")+"supplierinforead-service";
      this.$.supplierinforeadajax.generateRequest();
    },
    FnsupplierinforeadResponse:function(e){
      var arr=e.detail.response;
      // Binding supplier info to the card in approve supplier page
      document.querySelector("supplier-detail-read").suppliername=arr[0].Supplier_Name;
      document.querySelector("supplier-detail-read").aliasname=arr[0].Alias_Name;
      document.querySelector("supplier-detail-read").address1=arr[0].Address1;
      document.querySelector("supplier-detail-read").address2=arr[0].Address2;
      document.querySelector("supplier-detail-read").doorno=arr[0].Doorno;
      document.querySelector("supplier-detail-read").streetno=arr[0].Streetno;
      document.querySelector("supplier-detail-read").streetname=arr[0].Street_Name;
      document.querySelector("supplier-detail-read").location=arr[0].Location;
      document.querySelector("supplier-detail-read").city=arr[0].City;
      document.querySelector("supplier-detail-read").district=arr[0].District;
      document.querySelector("supplier-detail-read").state=arr[0].State;
      document.querySelector("supplier-detail-read").country=arr[0].Country;
      document.querySelector("supplier-detail-read").pincode=arr[0].Pincode;
      document.querySelector("supplier-detail-read").phoneno=arr[0].Phoneno;
      document.querySelector("supplier-detail-read").mobileno=arr[0].Mobileno;
      document.querySelector("supplier-detail-read").emailid=arr[0].Email;
      document.querySelector("supplier-detail-read").faxno=arr[0].Faxno;
      document.querySelector("supplier-detail-read").website=arr[0].Website;
      // Binding supplier payment info to the card in approve supplier page
      document.querySelector("customer-payment-read").accountname=arr[0].Account_Name;
      document.querySelector("customer-payment-read").accountno=arr[0].Account_No;
      document.querySelector("customer-payment-read").accounttype=arr[0].Account_Type;
      document.querySelector("customer-payment-read").paymenttype=arr[0].Payment_Type;
      document.querySelector("customer-payment-read").bankname=arr[0].Bank_Name;
      document.querySelector("customer-payment-read").branch=arr[0].Branch;
      document.querySelector("customer-payment-read").ifsccode=arr[0].IFSC_Code;
      document.querySelector("customer-payment-read").micrcode=arr[0].MICR_Code;
      document.querySelector("customer-payment-read").swiftcode=arr[0].Swift_Code;
      document.querySelector("customer-payment-read").term=arr[0].Payment_Term;
      // Binding supplier tax info to the card in approve supplier page
      document.querySelector("customer-tax-read").tinno=arr[0].TIN;
      document.querySelector("customer-tax-read").cstno=arr[0].CST;
      document.querySelector("customer-tax-read").panno=arr[0].PAN;
      document.querySelector("customer-tax-read").tanno=arr[0].TAN;
      document.querySelector("customer-tax-read").cinno=arr[0].CIN;
      // Binding supplier excise info to the card in approve supplier page
      document.querySelector("customer-excise-read").regno=arr[0].Reg_No;
      document.querySelector("customer-excise-read").eccno=arr[0].Ecc_No;
      document.querySelector("customer-excise-read").range=arr[0].Range;
      document.querySelector("customer-excise-read").division=arr[0].Division;
      document.querySelector("customer-excise-read").commission=arr[0].Commission;
      document.querySelector("customer-excise-read").servicetax=arr[0].Service_Tax;
    }

  });
})();
