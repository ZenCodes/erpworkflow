/**
 * Created by praba on 2/13/2016.
 */
//JS file for datepicker card
Polymer({
  is: "datepicker-card",
  ready:function()
  {
    this.showdate=moment(new Date()).format('L');
    localStorage.setItem("localsess_curr_inwarddate",this.showdate);
  },
  FnShowDialog:function(){  
    this.date=new Date();
    if(((localStorage.getItem("curr_sess_showpage")=="physicins-page")||(localStorage.getItem("curr_sess_showpage")=="physicinsread-page"))&&(sessionStorage.getItem("curr_sess_roleflag")=="1"||sessionStorage.getItem("curr_sess_roleflag")=="2"||sessionStorage.getItem("curr_sess_roleflag")=="3"||sessionStorage.getItem("curr_sess_roleflag")=="4")){}
      else
    this.$.dialog.toggle();
  },
  FnDismissDialog:function(e){

    if (e.detail.confirmed) {
      var pickdate=moment(this.$.picker.date).format('L');
      var dd1=new Date();
      var dd2=new Date(pickdate);
      var days=parseInt((dd1 - dd2) / (1000 * 60 * 60 * 24));
      if(localStorage.getItem("curr_sess_showpage")!="Add Intent"){
      if(days>0)
      {
        if(days>60)
          this.$.ID_Show_Dialog.FnShowDialog("You can add only recent entries within 60 days!","");
          //alert("You can add only recent entries within 60 days!");
        else{
          this.showdate = moment(this.$.picker.date).format('L');
          localStorage.setItem("localsess_curr_inwarddate",this.showdate);
          document.querySelector('physicqualify-card').setPodate();
        }
      }
      else
        this.$.ID_Show_Dialog.FnShowDialog("Date shouldn't exceed the run date!","");
        //alert("Date shouldn't exceed the run date!");
      }
      else{
        if(days>0)
          this.$.ID_Show_Dialog.FnShowDialog("Due date should be future date!","");
        else
        this.showdate = moment(this.$.picker.date).format('L');
      }
  }
  }

});
