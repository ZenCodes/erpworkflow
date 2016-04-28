/**
 * Created by praba on 2/11/2016.
 */

/*JS file for dynamic menu card of securities inward slip page*/
Polymer({is:"dynamic-card",
  ready:function(){
    /*It loads the security menu json configurable file*/
    if(sessionStorage.getItem("curr_sess_roleflag")=="0"){
      //Reading labels according to the inward or outward page view
      if(localStorage.getItem("curr_sess_wardflag")!="1")
        this.url="../../config/secmenu.json";
      if(localStorage.getItem("curr_sess_wardflag")=="1")
        this.url="../../config/outwardmenu.json";
    }
    if(sessionStorage.getItem("curr_sess_roleflag")=="6"){
	 
         if(localStorage.getItem("curr_sess_wardflag")=="")
        this.url="../../config/itemmenu.json";
    }
    if(sessionStorage.getItem("curr_sess_roleflag")=="10"){
    if(localStorage.getItem("curr_sess_wardflag")=="6")
        this.url="../../config/customermenu.json";      
    }
    if(sessionStorage.getItem("curr_sess_roleflag")=="4"){
    if(localStorage.getItem("curr_sess_wardflag")=="4")
        this.url="../../config/suppliermenu.json";
    }

  },
  /*which receives the menu response of security menu json file,bind it to the dynamic card*/
  menureadResponse:function(e){
    //Receiving response and Binding menu labels
    this.menus=e.detail.response;
   }

});
