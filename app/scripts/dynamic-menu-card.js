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
      /*document.getElementById(this.menulabel).style.border="groove";
      document.getElementById(this.menulabel).style.borderRadius="4px";
      document.getElementById(this.menulabel).style.borderColor="#e5efe2";
      document.getElementById(this.menulabel).style.borderBottom="none";
      document.getElementById(this.menulabel).style.borderBottomWidth="5px";*/
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
        //document.querySelector("customerinfo-page").FnCustomerInfoSubmit();
       // document.querySelector("vehicleinfo-page").FnVehicleInfoSubmit();
      //else if(sessionStorage.getItem("curr_sess_roleflag")=="0"&&localStorage.getItem("curr_sess_wardflag")=="1"&&value=="Customer Detail")
        //document.querySelector("vehicleinfo-page").FnVehicleInfoSubmit();
      //document.querySelector("outwardslip-page").setPage(this.menulabel);
      else if(sessionStorage.getItem("curr_sess_roleflag")=="0"&&localStorage.getItem("curr_sess_wardflag")=="1"&&value=="Item Detail"){
        //document.querySelector("customerinfo-page").FnCustomerInfoSubmit();
        document.querySelector("vehicleinfo-page").FnVehicleInfoSubmit();
        //document.querySelector("outwardslip-page").setPage("Out Item Detail");

      }
    }
  });
})();
