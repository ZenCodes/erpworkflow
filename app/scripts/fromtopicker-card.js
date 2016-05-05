/**
 * Created by praba on 2/13/2016.
 */
//JS file for from/to datepicker card
Polymer({
  is: "fromtopicker-card",
  ready:function()
  {
    this.forward=true;
    this.fromshowdate=moment(new Date()).format('L');    
    this.toshowdate=moment(new Date()).format('L');    
  },
  FnForward:function(){
    //alert('forward');
    this.$.reportservice.callOutwardService("forward");
  },
  FnBackward:function(){
    //alert('backward');
    this.forward=false;
    this.$.reportservice.callOutwardService("backward");
  },
  FnShowFromDialog:function(){  
    this.fromdate=new Date();
    this.$.fromdialog.toggle();
  },
  FnShowToDialog:function(){  
    this.todate=new Date();
    this.$.todialog.toggle();
  },
  FnDismissFromDialog:function(e){
    if (e.detail.confirmed) {      
      this.forward=false;
      var pickdate=moment(this.$.frompicker.date).format('L');      
      var dd1=new Date();
      var dd2=new Date(pickdate);
      var days=parseInt((dd1 - dd2) / (1000 * 60 * 60 * 24));
      //alert(days);
      if(days<0)
      {
        //if(days>60)
          //this.$.ID_Show_Dialog.FnShowDialog("You can see 60 days!","");
          //alert("You can add only recent entries within 60 days!");
        //else{
  
          //alert('no');
          if(this.fromshowdate>this.toshowdate) { 
           this.fromshowdate=moment(new Date()).format('L');
           this.$.ID_Show_Dialog.FnShowDialog("From date shouldn't exceed the to date!","");    
          }  
          else{
          this.fromshowdate=moment(new Date()).format('L');
          this.$.ID_Show_Dialog.FnShowDialog("Date shouldn't exceed the run date!",""); 
          }   
              
        //}
      }
      else if(days==0&&(this.fromshowdate==this.toshowdate)){
          this.fromshowdate = moment(this.$.frompicker.date).format('L');
          localStorage.setItem("curr_sess_todaydate",this.fromshowdate);  
          
          //alert(this.fromshowdate+"  "+this.toshowdate)
          if(this.fromshowdate>this.toshowdate) { 
          this.fromshowdate=moment(new Date()).format('L');
          this.$.ID_Show_Dialog.FnShowDialog("From date shouldn't exceed the to date!","");    
          }     
          
      }
      else{
        // alert('infrom');
          this.fromshowdate = moment(this.$.frompicker.date).format('L');
          localStorage.setItem("curr_sess_todaydate",this.fromshowdate); 
          //alert(this.fromshowdate+"  "+this.toshowdate)
          if(this.fromshowdate<this.toshowdate) {   
          //alert('yes');     
          document.querySelector('report-service').FnFromToDateChange(this.fromshowdate,this.toshowdate);
          }
        // this.$.ID_Show_Dialog.FnShowDialog("Date shouldn't exceed the run date!","");
      }
        //alert("Date shouldn't exceed the run date!");
    }
  },
  FnDismissToDialog:function(e){
    if (e.detail.confirmed) {
      this.forward=false;
      var pickdate=moment(this.$.topicker.date).format('L');
      var dd1=new Date();
      var dd2=new Date(pickdate);
      var days=parseInt((dd1 - dd2) / (1000 * 60 * 60 * 24));
      // alert(days);
    if(days<0)
      {
       
          if(this.fromshowdate>this.toshowdate) { 
           this.toshowdate=moment(new Date()).format('L');
           this.$.ID_Show_Dialog.FnShowDialog("From date shouldn't exceed the to date!","");    
          }  
          else{
          this.toshowdate=moment(new Date()).format('L');
          this.$.ID_Show_Dialog.FnShowDialog("Date shouldn't exceed the run date!",""); 
          }          
        
      }
      else if(days==0&&(this.fromshowdate==this.toshowdate)){
          this.toshowdate = moment(this.$.topicker.date).format('L');
          localStorage.setItem("curr_sess_todaydate",this.toshowdate);           
          
          if(this.fromshowdate>this.toshowdate) { 
          this.toshowdate=moment(new Date()).format('L');
          this.$.ID_Show_Dialog.FnShowDialog("From date shouldn't exceed the to date!","");    
          }     
          
      }
      else{
          
          this.toshowdate = moment(this.$.topicker.date).format('L');
          localStorage.setItem("curr_sess_todaydate",this.toshowdate); 
          
          if(this.fromshowdate<this.toshowdate) {             
          document.querySelector('report-service').FnFromToDateChange(this.fromshowdate,this.toshowdate);
          }
          else
          this.$.ID_Show_Dialog.FnShowDialog("From date shouldn't exceed the to date!","");
      }
        
    }
  },
  FnSetFromDate:function(fromdate){    
    this.fromshowdate=fromdate;
  },
  FnSetToDate:function(todate){    
    this.toshowdate=todate;
  }
});
