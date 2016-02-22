/**
 * Created by praba on 2/13/2016.
 */
//JS file for customer info page
Polymer({
  is: "customerinfo-page",
  ready:function()
  {
    this.customername=null;
    this.invoiceno=null;
    this.city=null;
    this.outtime=null;
  },
  setOutDate:function(date){
    this.outdate=date;
  },
  FnCustomValidation:function(input){
    var letters = '/^[A-Za-z]+$/';
    if (input.match(letters)) {
      return true;
    }
    else {
      alert(this.$.ID_Show_Dialog.FnShowDialog);
      this.$.ID_Show_Dialog.FnShowDialog("Customername should contain letters only!","");
      return false;
    }
  },
  //Function invokes when submitting customer info form
  FnCustomerInfoSubmit:function()
  {
    document.querySelector('#customer_invoiceno').validate();
    document.querySelector('#customer_name').validate();
    document.querySelector('#customer_city').validate();
    /*if(this.customername!=""||this.customername!=null) {
      this.FnCustomValidation(this.customername);
      //alert(Rt_cust_flag);
      //if(Rt_cust_flag==false)
      //this.$.ID_Show_Dialog.FnShowDialog("Customername should contain letters only!","");
    }*/
    if(this.customername==null||this.city==null){
      /*if(this.customername!="") {
        var Rt_cust_flag=this.FnCustomValidation(this.customername);
        //alert(Rt_cust_flag);
        if(Rt_cust_flag==true)
          this.$.ID_Show_Dialog.FnShowDialog("Customername should contain letters only!","");
      }
      else if(this.city!="") {
        var Rt_cust_flag=this.FnCustomValidation(this.city);
        if(Rt_cust_flag==true)
          this.$.ID_Show_Dialog.FnShowDialog("Cityname should contain letters only!","");
      }*/

    }
    else{
      //Setting customer info to the outwardslip page
      document.querySelector('outwarditem-page').FnSetCustomerinfo(localStorage.getItem("localsess_curr_inwarddate"),localStorage.getItem("curr_sess_outwardtime"),this.customername,this.invoiceno,this.city);
      document.querySelector('outwardslip-page').setPage('Out Vehicle Info');
    }

  }
});
