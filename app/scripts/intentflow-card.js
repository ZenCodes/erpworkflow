(function() {
    'use strict';

    Polymer({
      is: 'intentflow-card',

     ready:function(){
      this.flag='true';

      this.idval = ["Created", "Approved", "Supplied", "Accepted"];
     },
     setStateCreate:function(){     
     if (localStorage.getItem("curr_sess_wardflag")=="2") { 
       this.querySelector("#" + this.idval[0] + "1").id = this.idval[0];
       this.querySelector("#" + this.idval[0]).style.backgroundColor = '#bfbfbf';        
       this.flag = this.idval[0];      
     }
     },
     setStateTransition:function(){     
     
       this.querySelector("#" + this.idval[1] + "1").id = this.idval[1];
       this.querySelector("#" + this.idval[1]).style.backgroundColor = '#bfbfbf';        
       this.flag = this.idval[1];      
     
     }
    });
  })();