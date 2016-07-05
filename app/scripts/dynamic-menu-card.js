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
      if(sessionStorage.getItem("curr_sess_roleflag")=="0"&&value=="Vehicle Info"&&localStorage.getItem("curr_sess_wardflag")!="1")
        document.querySelector("inwardslip-page").setPage(this.menulabel);
      else if(sessionStorage.getItem("curr_sess_roleflag")=="0"&&value=="Item Detail"&&localStorage.getItem("curr_sess_wardflag")!="1"){
        document.querySelector("vehicle-page").FnVehicleInfoSubmit();
      }
      //Setting page views in Outwardslip page according to the tab selection made in the Outwardslip page
      else if(sessionStorage.getItem("curr_sess_roleflag")=="0"&&localStorage.getItem("curr_sess_wardflag")=="1"&&value=="Vehicle Info")
        document.querySelector("outwardslip-page").setPage("Out Vehicle Info");
      else if(sessionStorage.getItem("curr_sess_roleflag")=="0"&&localStorage.getItem("curr_sess_wardflag")=="1"&&value=="Item Detail"){
        document.querySelector("vehicleinfo-page").FnVehicleInfoSubmit();
      }

      else if(sessionStorage.getItem("curr_sess_roleflag")=="6"&&localStorage.getItem("curr_sess_wardflag")==""&&value=="Item Detail")
	      document.querySelector("admin-page").setPage("additem-card");
	    else if(sessionStorage.getItem("curr_sess_roleflag")=="6"&&localStorage.getItem("curr_sess_wardflag")==""&&value=="Supplier/Customer Detail")
      {
        if(localStorage.getItem("curr_sess_searchtypeflag")!="1")
        document.querySelector("additem-card").FnAddItemInfoSubmit();
        if(localStorage.getItem("curr_sess_searchtypeflag")=="1"){
        document.querySelector("admin-page").setPage("supplier-detail");
        document.querySelector('supplier-detail').ready();
        document.querySelector('viewtype-card').FnEnableEdit(false);
        }
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="10"&&localStorage.getItem("curr_sess_wardflag")=="6"&&value=="Payment Detail")
        document.querySelector("excise-card").FnExciseNext();
      else if(sessionStorage.getItem("curr_sess_roleflag")=="10"&&localStorage.getItem("curr_sess_wardflag")=="6"&&localStorage.getItem("curr_sess_searchtypeflag")=="nothing"&&value=="Item Detail")
        document.querySelector("contactperson-card").FnNextContact();
      else if(sessionStorage.getItem("curr_sess_roleflag")=="10"&&localStorage.getItem("curr_sess_wardflag")=="6"&&localStorage.getItem("curr_sess_searchtypeflag")!="nothing"&&value=="Item Detail")
        document.querySelector("contactperson-card").FnNextContact();
      else if(sessionStorage.getItem("curr_sess_roleflag")=="10"&&localStorage.getItem("curr_sess_wardflag")=="6"&&value=="Customer Detail")
        document.querySelector("customer-page").setPage("Add Customer");
      else if(sessionStorage.getItem("curr_sess_roleflag")=="10"&&localStorage.getItem("curr_sess_wardflag")=="6"&&value=="Tax Detail")
        document.querySelector("addcustomer-card").FnSupplierInfoSubmit();
      else if(sessionStorage.getItem("curr_sess_roleflag")=="10"&&localStorage.getItem("curr_sess_wardflag")=="6"&&value=="Excise Detail")
        document.querySelector("tax-card").FnTaxNext();
      else if(sessionStorage.getItem("curr_sess_roleflag")=="10"&&localStorage.getItem("curr_sess_wardflag")=="6"&&value=="Contact Detail")
        document.querySelector("customerpayment-card").FnAddPaymentInfoSubmit();

      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"&&localStorage.getItem("curr_sess_wardflag")=="4"&&value=="Payment Detail")
        document.querySelector("supplierexcise-card").FnExciseNext();
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"&&localStorage.getItem("curr_sess_wardflag")=="4"&&localStorage.getItem("curr_sess_searchtypeflag")=="nothing"&&value=="Item Detail")
        document.querySelector("suppliercontactperson-card").FnNextContact();
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"&&localStorage.getItem("curr_sess_wardflag")=="4"&&localStorage.getItem("curr_sess_searchtypeflag")!="nothing"&&value=="Item Detail")
        document.querySelector("suppliercontactperson-card").FnNextContact();
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"&&localStorage.getItem("curr_sess_wardflag")=="4"&&value=="Supplier Detail")
        document.querySelector("supplier-page").setPage("Add Supplier");
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"&&localStorage.getItem("curr_sess_wardflag")=="4"&&value=="Tax Detail")
        document.querySelector("addsupplier-card").FnSupplierInfoSubmit();
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"&&localStorage.getItem("curr_sess_wardflag")=="4"&&value=="Excise Detail")
        document.querySelector("suppliertax-card").FnTaxNext();
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"&&localStorage.getItem("curr_sess_wardflag")=="4"&&value=="Contact Detail")
        document.querySelector("payment-card").FnAddPaymentInfoSubmit();

      else if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&localStorage.getItem("curr_sess_wardflag")=="8"&&value=="Customer Detail")
        document.querySelector("customer-read-page").setPage("Customer Detail");
      else if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&localStorage.getItem("curr_sess_wardflag")=="8"&&value=="Tax Detail")
        document.querySelector("customer-read-page").setPage("Tax Detail");
      else if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&localStorage.getItem("curr_sess_wardflag")=="8"&&value=="Excise Detail")
        document.querySelector("customer-read-page").setPage("Excise Detail");
      else if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&localStorage.getItem("curr_sess_wardflag")=="8"&&value=="Payment Detail")
        document.querySelector("customer-read-page").setPage("Payment Detail");
      else if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&localStorage.getItem("curr_sess_wardflag")=="7"&&value=="Supplier Detail")
        document.querySelector("supplier-read-page").setPage("Supplier Detail");
      else if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&localStorage.getItem("curr_sess_wardflag")=="7"&&value=="Tax Detail")
        document.querySelector("supplier-read-page").setPage("Tax Detail");
      else if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&localStorage.getItem("curr_sess_wardflag")=="7"&&value=="Excise Detail")
        document.querySelector("supplier-read-page").setPage("Excise Detail");
      else if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&localStorage.getItem("curr_sess_wardflag")=="7"&&value=="Payment Detail")
        document.querySelector("supplier-read-page").setPage("Payment Detail");

      else if(sessionStorage.getItem("curr_sess_roleflag")=="6"&&localStorage.getItem("curr_sess_wardflag")=="11"&&value=="Employee Detail")
        document.querySelector("usercreation-home-card").setPage("Employee Detail");
      else if(sessionStorage.getItem("curr_sess_roleflag")=="6"&&localStorage.getItem("curr_sess_wardflag")=="11"&&value=="Account Detail")
        document.querySelector("usercreation-home-card").setPage("Account Detail");
      else if(sessionStorage.getItem("curr_sess_roleflag")=="6"&&localStorage.getItem("curr_sess_wardflag")=="11"&&value=="Role/Department Detail")
        document.querySelector("usercreation-home-card").setPage("Role/Department Detail");

      else if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&localStorage.getItem("curr_sess_wardflag")=="12"&&value=="Employee Detail")
        document.querySelector("user-read-page").setPage("Employee Detail");
      else if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&localStorage.getItem("curr_sess_wardflag")=="12"&&value=="Account Detail")
        document.querySelector("user-read-page").setPage("Account Detail");
      else if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&localStorage.getItem("curr_sess_wardflag")=="12"&&value=="Role/Department Detail")
        document.querySelector("user-read-page").setPage("Role Detail");
    }
  });
})();
