(function() {
    'use strict';

    Polymer({
      is: 'intentflow-card',
     ready:function(){
      localStorage.setItem('curr_sess_postate','Approved');
      this.flag='true';
      this.idval = ["Created", "Approved", "POCreated", "POSent"];
      // if (localStorage.getItem("curr_sess_roleflag")=="4") { 
       this.querySelector("#" + this.idval[1] + "1").id = this.idval[1];
       this.querySelector("#" + this.idval[1]).style.backgroundColor = '#bfbfbf';        
       this.flag = this.idval[1];      
      // }
     },
     click:function(e){
      if (this.flag == "true") {
        this.querySelector("#" + e.target.id + "1").id = e.target.id;
        this.querySelector("#" + e.target.id).style.backgroundColor = '#bfbfbf';
        this.flag = e.target.id;
      }
      else {
        this.querySelector("#" + this.flag).style.backgroundColor = '#f2f2f2';
        this.querySelector("#" + this.flag).id = this.flag + "1";
        this.querySelector("#" + e.target.id + "1").id = e.target.id;
        this.querySelector("#" + e.target.id).style.backgroundColor = '#bfbfbf';
        this.flag = e.target.id;
      }
     
      localStorage.setItem('curr_sess_postate',e.target.id);
      this.$.grnservice.FnIntentitemReadService();
     }
    
    });
  })();