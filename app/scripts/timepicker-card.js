/**
 * Created by praba on 2/13/2016.
 */
Polymer({
  is: "timepicker-card",
  ready:function()
  {
    var type="";
    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    if (minutes < 10){
      minutes = "0" + minutes
    }
    //document.write(hours + ":" + minutes + " ")
    if(hours > 11){
      type="PM";
    } else {
      type="AM";
    }
    this.showtime=hours + ":" + minutes + " "+type;
    localStorage.setItem("curr_sess_outwardtime",this.showtime);
  },
  showDialog:function(){
    this.time=this.showtime;
    this.$.dialog.toggle();
  },
  dismissDialog:function(e){
    if (e.detail.confirmed) {
      var picktime=this.$.picker.time;
      this.showtime = this.$.picker.time;
      localStorage.setItem("curr_sess_outwardtime",this.showtime);
      //document.querySelector('customerinfo-page').setTime();
    }

  }

});
