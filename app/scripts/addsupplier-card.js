/**
 * Created by praba on 3/10/2016.
 */
(function() {
  'use strict';

  Polymer({
    is: 'addsupplier-card',
    ready:function(){

		this.Btn_disable_flag=false;
		this.read=false;
		 //Initially hiding paperlistbox of itemtype and itemgroup fields
		    this.isHidden=true;
    		this.isHiddenid=true;
    		this.IDread=true;
    		localStorage.setItem("curr_sess_searchtypeflag", "nothing");
    		localStorage.setItem("curr_sess_addsuppliereditflag","0");
	},
	FnEmailChange:function(){
	   document.querySelector('#emailid').validate();
	},
	FnInputChange:function(){
	localStorage.setItem("curr_sess_searchtypeflag","nothing");
	this.IDread=true;
	this.supplierid=(this.suppliername).substring(0,4);
	},
   FnSupplierInfoSubmit:function(){
     document.querySelector('#emailid').validate();   	
     document.querySelector('#supplierid').validate();
     document.querySelector('#suppliername').validate();
     document.querySelector('#location').validate();
     document.querySelector('#district').validate();
     document.querySelector('#state').validate();
     document.querySelector('#country').validate();
     document.querySelector('#pincode').validate();
     document.querySelector('#city').validate();
     document.querySelector('#mobileno').validate();
     //document.querySelector('#landmark').validate();
     if(this.supplierid==""||this.supplierid==null||this.suppliername==""||this.suppliername==null||this.location==""||this.location==null||this.city==null||this.city==""||this.district==""||this.district==null||this.state==null||this.state==""||this.country==null||this.country==""||this.pincode==""||this.pincode==null||this.mobileno==null||this.mobileno==""){}
     else{
     	
		 document.querySelector("supplieradditem-card").FnSetValue(this.supplierid,this.suppliername);
		 if(localStorage.getItem("curr_sess_searchtypeflag")=="nothing"){
         this.$.adminsupplierservice.addsupplierService(this.supplierid,this.suppliername,this.landmark,this.location,this.city,this.district,this.state,this.country,this.pincode,this.phoneno,this.mobileno,this.emailid);
         document.querySelector("supplier-page").setPage("Add Payment");
     	//document.querySelector("payment-card").FnFetchPaymentInfo(this.supplierid,this.suppliername);
 		}
 		else if(localStorage.getItem("curr_sess_addsuppliereditflag")=="1"&&localStorage.getItem("curr_sess_searchtypeflag")=="1"){
 			this.$.adminsupplierservice.updatesupplierService(this.supplierid,this.suppliername,this.landmark,this.location,this.city,this.district,this.state,this.country,this.pincode,this.phoneno,this.mobileno,this.emailid);
            document.querySelector("payment-card").FnEnableFields();
            document.querySelector("supplier-page").setPage("Add Payment");

            document.querySelector("payment-card").FnFetchPaymentInfo(this.supplierid,this.suppliername);
 		}
 		else{
			document.querySelector("supplier-page").setPage("Add Payment");
			//if(localStorage.getItem("curr_sess_searchtypeflag")=="0")
			document.querySelector("payment-card").FnFetchPaymentInfo(this.supplierid,this.suppliername);
			//else if(localStorage.getItem("curr_sess_searchtypeflag")=="1")
			//document.querySelector("supplieradditem-card").FnFetchPaymentInfo(this.supplierid,this.suppliername);
		}
	}
    },
    FnSearchSupplierId:function(){
	//The flag is used to ensure the search is performed by using item id
    localStorage.setItem("curr_sess_searchtypeflag","0");
    //When performing search using itemid making listbox visible with items
    this.isHiddenid=false;
	this.read=true;
    this.supplierurl=sessionStorage.getItem("curr_sess_url")+"itemsupplierread-service";
	this.$.supplierlistreadajax.generateRequest();
	},
	FnSearchSupplierName:function(){
	//The flag is used to ensure the search is performed by using item name
    localStorage.setItem("curr_sess_searchtypeflag","1");
    document.querySelector('viewtype-card').FnEnableEdit(true);
    //When performing search using itemname making listbox visible with items
    this.isHidden=false;
    this.read=true;
    this.supplierurl=sessionStorage.getItem("curr_sess_url")+"itemsupplierread-service";
    this.$.supplierlistreadajax.generateRequest();
	},
	supplierlistreadResponse:function(e){

		//Fetching items matching with searc items to populate it in listbox
		    //Condition will invoke if we performed item search using name
		    if(localStorage.getItem("curr_sess_searchtypeflag")=="1") {
		      this.querySelector('#searchname').style.visibility = 'visible';
		      var arr = [];
		      arr.push({"itemname": "-----Select-----"});
		      var item = e.detail.response.itemarr;
		      //alert(item);
		      //alert(JSON.stringify(item));
		      if (this.suppliername.length > 0) {
		        for (var i = 0; i < item.length; i++) {
		          var subval = ((item[i].itemsuppliername).trim()).substring(0, this.suppliername.length);
		          if ((subval).toLowerCase() == (this.suppliername).toLowerCase()) {
		            var obj = {"itemname": ""};
		            obj.itemname = item[i].itemsuppliername;
		            arr.push(obj);
		          }
		        }
		        //Binding items to the listbox when it has the matching items otherwise showing no items
		        if (arr.length > 0)
		          this.itemArray = arr;
		        else {
		          var obj = {"itemname": ""};
		          obj.itemname = "No items found";
		          arr.push(obj);
		          this.itemArray = arr;
		          		        }
		      }
		    }
		    //Condition will invoke if we performed item search using name
		    if(localStorage.getItem("curr_sess_searchtypeflag")=="0") {
		      //Fetching items matching with searc items to populate it in listbox
		      //Condition will invoke if we performed item search using id
		      this.querySelector('#searchid').style.visibility = 'visible';
		      var arr = [];
		      arr.push({"itemid": "-----Select-----"});
		      var item = e.detail.response.itemarr;
		      //alert(JSON.stringify(item));
		      //alert(this.itemval);
		      if (this.supplierid.length > 0) {
		        for (var i = 0; i < item.length; i++) {
		          var subval = ((item[i].itemsupplierid).trim()).substring(0, this.supplierid.length);

		          if ((subval).toLowerCase() == (this.supplierid).toLowerCase()) {
		            var obj = {"itemid": ""};
		            obj.itemid = item[i].itemsupplierid;
		            arr.push(obj);
		          }
		        }
		        //Binding items to the listbox when it has the matching items otherwise showing no items
		        if (arr.length > 0)
		          this.itemidArray = arr;
		        else {
		          var obj = {"itemid": ""};
		          obj.itemid = "No items found";
		          arr.push(obj);
		          this.itemidArray = arr;

		        }
		      }
    }
	},
	FnSupplierIdSelected:function(e){
		//if selecting item from dropdown apart from no items found it will invoke the search servcie and fetching currently selected item info
		if(e.target.selectedItem.textContent.trim()!="-----Select-----") {
		this.supplierid = e.target.selectedItem.textContent.trim();
		//Making invisible and deselection in dropdown of item id search list box
		this.querySelector('#searchid').style.visibility='hidden';
		this.querySelector('#searchid').selected=-1;
		this.itemidArray="";
		//if selected item id is not null invoking service to fetch item info
		if(this.supplieritemid!=""||this.supplierid!="-----Select-----") {
		    this.$.adminsupplierservice.callSearchService(this.supplierid, "");
		}
		}
		else   {
		this.read=false;
		this.itemidArray="";
		this.querySelector('#searchid').style.visibility='hidden';
		this.querySelector('#searchid').selected=-1;
    }
	},
	FnSupplierNameSelected:function(e){
		//if selecting item from dropdown apart from no items found it will invoke the search servcie and fetching currently selected item info
		    if(e.target.selectedItem.textContent.trim()!="-----Select-----") {
		      this.suppliername = e.target.selectedItem.textContent.trim();
		      //Making invisible and deselection in dropdown of item name search list box
		      this.querySelector('#searchname').style.visibility='hidden';
		      this.querySelector('#searchname').selected=-1;
		      this.itemArray="";
		      //if selected item id is not null invoking service to fetch item info
		      if(this.suppliername!=""||this.suppliername!="-----Select-----") {

		        this.$.adminsupplierservice.callSearchService("", this.suppliername);

		      }
		    }
		    else   {
		    	//alert("hi")
		    this.read=false;
		    this.suppliername="";
		    this.supplierid="";
		    this.itemArray="";
		    this.querySelector('#searchname').style.visibility='hidden';
		    this.querySelector('#searchname').selected=-1;
    }
	},
	FnEnableFields:function(){
		this.read=false;
	}
  });
})();
