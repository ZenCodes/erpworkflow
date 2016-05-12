  (function() {
    'use strict';
    var todayTime="";
    Polymer({
      is: 'report-service',

      ready:function(){

      },
      FnGetFormattedDate:function(todayTime) {
      //alert(todayTime);        
        var month = todayTime .getMonth() + 1;
        if(month<10)
          month="0"+month;
        var day = todayTime .getDate();
        if(day<10)
          day="0"+day;
        var year = todayTime .getFullYear();
        return month + "/" + day + "/" + year;
      },
      callOutwardService:function(dayval){
        //alert(todayTime);

        
        var flag=true;
        var obj={"outdate":""};
        if(dayval=="current"){ 
        if(todayTime=="")         
        todayTime = new Date();                  
        }
        if(dayval=="forward"){
        if(todayTime=="") 
        todayTime = new Date();
        if((todayTime.getDate()+1)<=(new Date().getDate())){              
        todayTime.setDate(todayTime.getDate() + 1);
        document.querySelector('fromtopicker-card').FnSetToDate(this.FnGetFormattedDate(todayTime));
        }
        else{
          flag=false;
        this.$.ID_Show_Dialog.FnShowDialog("Date shouldn't exceed the run date!",""); 
        }
        }
        if(dayval=="backward"){
        if(todayTime=="") 
        todayTime = new Date();
        todayTime.setDate(todayTime.getDate() - 1);
        document.querySelector('fromtopicker-card').FnSetFromDate(this.FnGetFormattedDate(todayTime));
        }
        if(flag==true){
        obj.outdate=this.FnGetFormattedDate(todayTime);
        this.outwardparam=obj;
        this.outwardurl=sessionStorage.getItem("curr_sess_url")+"outwarditemfetch";
        this.$.outwarditemfetchajax.generateRequest();
        }
      },
      outwardResponse:function(e){
        //alert(JSON.stringify(e.detail.response.itemarr));
        if((e.detail.response.itemarr).length==0){
          var arr=[];
          document.querySelector('outwardreport-card').FnEnableHide(true);
          document.querySelector('outwardreport-card').itemarr=arr;
        }
          // alert("No Items Found!");
          //this.$.ID_Show_Dialog.FnShowDialog("No Items Found!","");
        else{
          document.querySelector('outwardreport-card').FnEnableHide(false);
        document.querySelector('outwardreport-card').itemarr=e.detail.response.itemarr;
      }
      
      },
      FnFromToDateChange:function(fromdate,todate){
        
        todayTime=new Date(localStorage.getItem("curr_sess_todaydate"));
        var obj={"fromdate":"","todate":""};
        obj.fromdate=fromdate;
        obj.todate=todate;
        this.outwardfromtoparam=obj;
        this.outwardfromtourl=sessionStorage.getItem("curr_sess_url")+"outwarditemfromtofetch";
        this.$.outwarditemfromtofetchajax.generateRequest();
      },
      outwardfromtoResponse:function(e){
        if((e.detail.response.itemarr).length==0){
          var arr=[];
          document.querySelector('outwardreport-card').FnEnableHide(true);
          document.querySelector('outwardreport-card').itemarr=arr;
        }
          // alert("No Items Found!");
          //this.$.ID_Show_Dialog.FnShowDialog("No Items Found!","");
        else  {
          document.querySelector('outwardreport-card').FnEnableHide(false);
        document.querySelector('outwardreport-card').itemarr=e.detail.response.itemarr;
      }
      
      },
      FnSetTodayTime:function(){
        //todayTime=localStorage.getItem("curr_sess_todaydate");
      }
    });
  })();