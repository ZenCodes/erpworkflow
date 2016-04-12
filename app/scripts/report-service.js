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
        var obj={"outdate":""};
        if(dayval=="current"){ 
        if(todayTime=="")         
        todayTime = new Date();                  
        }
        if(dayval=="forward"){
        if(todayTime=="") 
        todayTime = new Date();
        todayTime.setDate(todayTime.getDate() + 1);
        document.querySelector('fromtopicker-card').FnSetToDate(this.FnGetFormattedDate(todayTime));
        }
        if(dayval=="backward"){
        if(todayTime=="") 
        todayTime = new Date();
        todayTime.setDate(todayTime.getDate() - 1);
        document.querySelector('fromtopicker-card').FnSetFromDate(this.FnGetFormattedDate(todayTime));
        }
        obj.outdate=this.FnGetFormattedDate(todayTime);
        this.outwardparam=obj;
        this.outwardurl=sessionStorage.getItem("curr_sess_url")+"outwarditemfetch";
        this.$.outwarditemfetchajax.generateRequest();
      },
      outwardResponse:function(e){
        //alert(JSON.stringify(e.detail.response.itemarr));
        if((e.detail.response.itemarr).length==0)
          alert("No items found");
        document.querySelector('outwardreport-card').itemarr=e.detail.response.itemarr;

      },
      FnFromToDateChange:function(fromdate,todate){
        var obj={"fromdate":"","todate":""};
        obj.fromdate=fromdate;
        obj.todate=todate;
        this.outwardfromtoparam=obj;
        this.outwardfromtourl=sessionStorage.getItem("curr_sess_url")+"outwarditemfromtofetch";
        this.$.outwarditemfromtofetchajax.generateRequest();
      },
      outwardfromtoResponse:function(e){
        if((e.detail.response.itemarr).length==0)
          alert("No items found");
        document.querySelector('outwardreport-card').itemarr=e.detail.response.itemarr;
      }
    });
  })();