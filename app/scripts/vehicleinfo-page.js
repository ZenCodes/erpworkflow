/**
 * Created by praba on 2/13/2016.
 */
//JS file for vehicle info page
Polymer({
  is: "vehicleinfo-page",
  ready:function()
  {
    this.vehicleno=null;
    this.transportname=null;
    this.drivername=null;
    this.driverno=null;
    this.ownername=null;
    this.ownerphone=null;
    this.panno=null;
  },

  //Function invokes when submitting vehicl info form
  FnVehicleInfoSubmit:function()
  {
    document.querySelector('#drivername').validate()
    document.querySelector('#driverno').validate()
    document.querySelector('#ownername').validate()
    document.querySelector('#ownerphone').validate()
    document.querySelector('#vehicleno').validate()
    document.querySelector('#transportname').validate()
    //document.querySelector('#panno').validate()
    document.querySelector('#destcity').validate()

    if(this.city==null||this.city==""||this.vehicleno==null||this.vehicleno==""||this.transportname==null||this.transportname==""||this.drivername==null||this.drivername==""||this.driverno==null||this.driverno==""||this.ownername==null||this.ownername==""||this.ownerphone==null||this.ownerphone==""){
      //alert("All fields should be filled out");
    }
    else{
      document.querySelector('outwarditem-page').FnSetVehicleinfo(localStorage.getItem("localsess_curr_inwarddate"),localStorage.getItem("curr_sess_outwardtime"),this.city,this.vehicleno,this.transportname,this.drivername,this.driverno,this.ownername,this.ownerphone,this.panno);
      document.querySelector('outwardslip-page').setPage('Out Item Detail');
    }
  }
});
