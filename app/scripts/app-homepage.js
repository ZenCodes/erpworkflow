/**
 * Created by praba on 2/11/2016.
 */
Polymer({
  is: "app-homepage",
  ready: function() {
    //this.page='home-page';
    this.userlabel="Signout";
    this.$.intentflow.style.visibility='hidden';
    
    /*Condition which allow to see the search page and hide the respective components in UI*/
    if(sessionStorage.getItem("curr_sess_roleflag")=="5"&&sessionStorage.getItem("curr_sess_roleflag")!="6"){
     //alert("search");
      localStorage.setItem("curr_sess_showpage","Search Items");
      this.page="Search Items";
      this.$.flow.style.visibility='hidden';
      this.$.list.style.visibility='hidden';
      this.$.flowbutton.style.visibility='hidden';
      this.$.drawerlist.style.visibility='hidden';
      this.$.searchmenu.style.visibility='visible';
    }
    if(sessionStorage.getItem("curr_sess_roleflag")=="6"){
      //alert("item");
      //alert(localStorage.getItem("curr_sess_wardflag"));
      if(localStorage.getItem("curr_sess_wardflag")=="") {
        //localStorage.setItem("curr_sess_wardflag", "");
        localStorage.setItem("curr_sess_showpage", "additem-card");
        this.page = "admin-page";
      }
      if(localStorage.getItem("curr_sess_wardflag")=="4") {
        localStorage.setItem("curr_sess_showpage", "Add Supplier");
        //document.querySelector("supplier-page").setPage("Add Supplier");
		    this.page = "supplier-page";
      }
      this.$.flow.style.visibility='hidden';
      this.$.list.style.visibility='visible';
      this.$.flowbutton.style.visibility='hidden';
      this.$.drawerlist.style.visibility='visible';
      this.$.searchmenu.style.visibility='hidden';
    }
    /*Condition which allow security gaurd(role flag is 0) to navigate to his respective inward/outward item entry page*/
    //if(sessionStorage.getItem("loggedrole")=="Security guard")
    if(sessionStorage.getItem("curr_sess_roleflag")=="0"&&sessionStorage.getItem("curr_sess_roleflag")!="5"&&sessionStorage.getItem("curr_sess_roleflag")!="6")
    {
      //alert("inwardoutward");
      /*Condtion to navigate to the inward item entry page when he initially logged in or changing options in drawer menu*/
      if(localStorage.getItem("curr_sess_wardflag")!="1"){
        localStorage.setItem("curr_sess_showpage","Vehicle Info");
        this.page="inwardslip-page";
      }
      /*Condtion to navigate to the outward item entry page when he initially logged in or changing options in drawer menu*/
      else
      {
        localStorage.setItem("curr_sess_showpage","Out Vehicle Info");
        this.page="outwardslip-page";
      }
      /*For security flow states are not necessary,which was hided from him*/
      this.$.flow.style.visibility='hidden';
      this.$.flowbutton.style.visibility='hidden';
      this.$.searchmenu.style.visibility='hidden';
    }
    /*Condtion to navigate to the grn flow page according to the role(role flags of the managers),who logged in*/
    //if(sessionStorage.getItem("loggedrole")=="Stores manager"||sessionStorage.getItem("loggedrole")=="Production manager"||sessionStorage.getItem("loggedrole")=="Quality manager"||sessionStorage.getItem("loggedrole")=="Purchase manager")
    if(sessionStorage.getItem("curr_sess_roleflag")!="0"&&sessionStorage.getItem("curr_sess_roleflag")!="5"&&sessionStorage.getItem("curr_sess_roleflag")!="6"&&sessionStorage.getItem("curr_sess_roleflag")!="7"&&sessionStorage.getItem("curr_sess_roleflag")!="8"&&sessionStorage.getItem("curr_sess_roleflag")!="9")
    {
      //alert("oldintent");
      if(localStorage.getItem("curr_sess_wardflag")=="2"){
      this.$.flow.style.visibility='hidden';    
      this.$.intentflow.style.visibility='visible';  
      document.querySelector('app-homepage').setPage('intenthome-page');
      document.querySelector('intenthome-page').setPage('Add Intent');
      }
      else{
      localStorage.setItem("curr_sess_showpage","physicins-page");
      this.page="home-page";
      this.$.flow.style.visibility='visible';
      }
      this.$.list.style.visibility='visible';
      this.$.flowbutton.style.visibility='hidden';
      this.$.searchmenu.style.visibility='hidden';
    }

    if(sessionStorage.getItem("curr_sess_roleflag")=="7"||sessionStorage.getItem("curr_sess_roleflag")=="8"||sessionStorage.getItem("curr_sess_roleflag")=="9"){
      //alert("new intent");
      localStorage.setItem("curr_sess_wardflag","2");
      this.$.intentflow.style.visibility='visible'; 
      //this.$.intentflow.style.marginLeft='-5%';  
      document.querySelector('app-homepage').setPage('intenthome-page');
      document.querySelector('intenthome-page').setPage('Add Intent');
      this.$.flow.style.visibility='hidden';
      this.$.list.style.visibility='hidden';
      this.$.flowbutton.style.visibility='hidden';
      this.$.drawerlist.style.visibility='visible';
      this.$.searchmenu.style.visibility='hidden';
    }
  },
  /*when user click signout button it will clear the user session*/
  FnToggleSignin:function(){
    sessionStorage.setItem("loggeduser","null");
    sessionStorage.setItem("loggedrole","null");
    window.location.href="../index.html";
  },
  /*It will change the page according to the user login either inward/outward/search pages*/
  setPage:function(page){
    this.page=page;
  },
  /*Flow button visibility change according to the user login and card expand and shrink modes*/
  setVisible:function(flag){
    if(flag=="true")
      this.$.flowbutton.style.visibility='visible';
    if(flag=="false")
      this.$.flowbutton.style.visibility='hidden';
  },
  setFlowVisibility:function(flag){
    if(flag=="true")
      this.$.flow.style.visibility='visible';
    if(flag=="false")
      this.$.flow.style.visibility='hidden';
  },
  FnSetIntentFlowVisibility:function(flag){
    if(flag=="true")
      this.$.intentflow.style.visibility='visible';
    if(flag=="false")
      this.$.intentflow.style.visibility='hidden';
  }
});
