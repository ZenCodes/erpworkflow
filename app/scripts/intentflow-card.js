(function() {
    'use strict';

    Polymer({
      is: 'intentflow-card',
     ready:function(){
      localStorage.setItem('curr_sess_postate','Created');
      this.flag='true';
      this.idval = ["Created", "Approved", "POCreated", "POSent"];
      if (localStorage.getItem("curr_sess_roleflag")=="4") { 
       this.querySelector("#" + this.idval[0] + "1").id = this.idval[0];
       this.querySelector("#" + this.idval[0]).style.backgroundColor = '#bfbfbf';        
       this.flag = this.idval[0];      
      }
     },
     click:function(e){
      alert(e.target.id);
      localStorage.setItem('curr_sess_postate',e.target.id);
      this.$.grnservice.FnIntentitemReadService();
     }
     /*,
     setStateCreate:function(){     
     if (localStorage.getItem("curr_sess_roleflag")=="4") { 
       this.querySelector("#" + this.idval[0] + "1").id = this.idval[0];
       this.querySelector("#" + this.idval[0]).style.backgroundColor = '#bfbfbf';        
       this.flag = this.idval[0];      
     }
     },
     setStateTransition:function(){     
     
       this.querySelector("#" + this.idval[1] + "1").id = this.idval[1];
       this.querySelector("#" + this.idval[1]).style.backgroundColor = '#bfbfbf';        
       this.flag = this.idval[1];      
     
     }*/
    });
  })();