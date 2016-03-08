/**
 * Created by praba on 2/13/2016.
 */
//JS file for customer info page
Polymer({
  is: "customerinfo-page",
  ready:function()
  {
    this.customername=null;
    //this.invoiceno=null;
    this.city=null;
    this.outtime=null;
  },
  setOutDate:function(date){
    this.outdate=date;
  },
  //Function invokes when submitting customer info form
  FnCustomerInfoSubmit:function()
  {
    //document.querySelector('#customer_invoiceno').validate();
    document.querySelector('#customer_name').validate();
    document.querySelector('#customer_city').validate();

    if(this.customername==null||this.city==null){

    }
    else{
      //Setting customer info to the outwardslip page
      document.querySelector('outwarditem-page').FnSetCustomerinfo(localStorage.getItem("localsess_curr_inwarddate"),localStorage.getItem("curr_sess_outwardtime"),this.customername,this.city);
      document.querySelector('outwardslip-page').setPage('Out Item Detail');
    }

  }
});
