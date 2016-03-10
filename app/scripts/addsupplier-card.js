/**
 * Created by praba on 3/10/2016.
 */
(function() {
  'use strict';

  Polymer({
    is: 'addsupplier-card',

   FnSupplierInfoSubmit:function(){
     document.querySelector('#supplierid').validate();
     document.querySelector('#suppliername').validate();
     document.querySelector('#location').validate();
     document.querySelector('#district').validate();
     document.querySelector('#state').validate();
     document.querySelector('#country').validate();
     document.querySelector('#pincode').validate();
     document.querySelector('#phoneno').validate();
     document.querySelector('#emailid').validate();
     document.querySelector('#landmark').validate();
     if(this.emailid==null||this.emailid==""){}
     else
     document.querySelector('admin-service').addsupplierService(this.supplierid,this.suppliername,this.landmark,this.location,this.city,this.district,this.state,this.country,this.pincode,this.phoneno,this.mobileno,this.emailid);
    }
  });
})();
