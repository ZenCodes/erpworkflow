/**
 * Created by praba on 2/11/2016.
 */
Polymer({
  is: "vehicle-page",
  ready:function()
  {
    this.invoiceno=null;
    this.vehicleno=null;
    this.vehiclename=null;
    this.drivername=null;
    this.driverno=null;
  },
  //Function will invoke on button click
  FnVehicleInfoSubmit:function()
  {
    document.querySelector('#invoiceno').validate();
    document.querySelector('#vehicleno').validate();
    //document.querySelector('#driverno').validate();
    var Rt_drivernameflag=document.querySelector('#drivername').validate();


    //this.$.invoice.validate();
    //this.$.vno.validate();
    if(this.invoiceno==null||this.invoiceno==""||this.vno==null||this.vno==""||Rt_drivernameflag==false){
      //this.$.ID_Show_Dialog.FnShowDialog("Fields have to be filled!","");
    }
    else{
      //Check for not null info and binding info to the item page
      document.querySelector('item-page').FnSetVehicleinfo(this.invoiceno,this.vno,this.vname,this.dname,this.dno);
      document.querySelector('inwardslip-page').setPage('Item Detail');
    }
  }
});
