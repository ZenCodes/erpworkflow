/**
 * Created by praba on 2/11/2016.
 */

(function() {
  var value="null";
  var menus=[];
  Polymer({is:"dynamic-menu-card",
    ready:function(){
    
    },
    /*Function which bind the selected menu value to the Inwardslip-page iron pages,accordingly which render the page to the user*/
    FnSelectMenu:function(){
      /*DOM styles for selected menu  in tab*/
      if(value!="null")
      {
      document.getElementById(value).style.border = "none";
      }
  
      value=this.menulabel;
      //Setting page views in Inwardslip page according to the tab selection made in the Inwardslip page
      if(sessionStorage.getItem("curr_sess_roleflag")=="0"&&value=="Vehicle Info"&&localStorage.getItem("curr_sess_wardflag")!="1")
        document.querySelector("inwardslip-page").setPage(this.menulabel);
      else if(sessionStorage.getItem("curr_sess_roleflag")=="0"&&value=="Item Detail"&&localStorage.getItem("curr_sess_wardflag")!="1"){
        document.querySelector("vehicle-page").FnVehicleInfoSubmit();
      }
      //Setting page views in Outwardslip page according to the tab selection made in the Outwardslip page
      else if(sessionStorage.getItem("curr_sess_roleflag")=="0"&&localStorage.getItem("curr_sess_wardflag")=="1"&&value=="Vehicle Info")
        document.querySelector("outwardslip-page").setPage("Out Vehicle Info");       
      else if(sessionStorage.getItem("curr_sess_roleflag")=="0"&&localStorage.getItem("curr_sess_wardflag")=="1"&&value=="Item Detail"){
        //document.querySelector("customerinfo-page").FnCustomerInfoSubmit();
        document.querySelector("vehicleinfo-page").FnVehicleInfoSubmit();
        //document.querySelector("outwardslip-page").setPage("Out Item Detail");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"&&localStorage.getItem("curr_sess_wardflag")=="4"&&value=="Payment Detail")
       	document.querySelector("addsupplier-card").FnSupplierInfoSubmit();
        //document.querySelector("supplier-page").setPage(this.menulabel);
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"&&localStorage.getItem("curr_sess_wardflag")=="4"&&localStorage.getItem("curr_sess_searchtypeflag")=="nothing"&&value=="Item Detail")
        document.querySelector("payment-card").FnAddPaymentInfoSubmit();
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"&&localStorage.getItem("curr_sess_wardflag")=="4"&&localStorage.getItem("curr_sess_searchtypeflag")!="nothing"&&value=="Item Detail")
        {        
        document.querySelector("supplier-page").setPage("Show Item"); 
        }
        //document.querySelector("supplier-page").setPage(this.menulabel);
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"&&localStorage.getItem("curr_sess_wardflag")=="4"&&value=="Supplier Detail")
        document.querySelector("supplier-page").setPage("Add Supplier");
      else if(sessionStorage.getItem("curr_sess_roleflag")=="6"&&localStorage.getItem("curr_sess_wardflag")==""&&value=="Item Detail")
	    document.querySelector("admin-page").setPage("additem-card");
	           //document.querySelector("supplier-page").setPage(this.menulabel);
	    else if(sessionStorage.getItem("curr_sess_roleflag")=="6"&&localStorage.getItem("curr_sess_wardflag")==""&&value=="Supplier/Customer Detail")
      {
        //alert(localStorage.getItem("curr_sess_searchtypeflag"));
        if(localStorage.getItem("curr_sess_searchtypeflag")!="1")
        document.querySelector("additem-card").FnAddItemInfoSubmit();
        if(localStorage.getItem("curr_sess_searchtypeflag")=="1"){
        document.querySelector("admin-page").setPage("supplier-detail"); 
        document.querySelector('supplier-detail').ready();
        document.querySelector('viewtype-card').FnEnableEdit(false);
        } 
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="10"&&localStorage.getItem("curr_sess_wardflag")=="6"&&value=="Payment Detail")
        document.querySelector("addcustomer-card").FnSupplierInfoSubmit();
        //document.querySelector("supplier-page").setPage(this.menulabel);
      else if(sessionStorage.getItem("curr_sess_roleflag")=="10"&&localStorage.getItem("curr_sess_wardflag")=="6"&&localStorage.getItem("curr_sess_searchtypeflag")=="nothing"&&value=="Item Detail")
        document.querySelector("customerpayment-card").FnAddPaymentInfoSubmit();
      else if(sessionStorage.getItem("curr_sess_roleflag")=="10"&&localStorage.getItem("curr_sess_wardflag")=="6"&&localStorage.getItem("curr_sess_searchtypeflag")!="nothing"&&value=="Item Detail")
        {        
        document.querySelector("customer-page").setPage("Show Item"); 
        }
        //document.querySelector("supplier-page").setPage(this.menulabel);
      else if(sessionStorage.getItem("curr_sess_roleflag")=="10"&&localStorage.getItem("curr_sess_wardflag")=="6"&&value=="Supplier Detail")
        document.querySelector("customer-page").setPage("Add Customer");
      /*else if(sessionStorage.getItem("curr_sess_roleflag")=="10"&&localStorage.getItem("curr_sess_wardflag")=="6"&&value=="Customer Detail")
      {              
        document.querySelector("customer-page").setPage("Add Customer");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="10"&&localStorage.getItem("curr_sess_wardflag")=="6"&&value=="Payment Detail")
      {              
        document.querySelector("customer-page").setPage("Add Payment");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="10"&&localStorage.getItem("curr_sess_wardflag")=="6"&&value=="Item Detail")
      {              
        document.querySelector("customer-page").setPage("Add Item");
      }*/
    }
  });
})();
