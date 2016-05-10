/**
 * Created by praba on 2/11/2016.
 */
Polymer({
  is: "app-homepage",
  ready: function() {
    //this.page='home-page';

    //alert(localStorage.getItem("curr_sess_intenttoggleflag"));

    this.userlabel="Signout";
    this.$.intentview.style.visibility='hidden';
    this.$.promotebutton.style.visibility='hidden';
    this.$.intentflow.style.visibility='hidden';

    this.$.dynamicbutton.style.visibility='hidden';
    
    if(sessionStorage.getItem("curr_sess_roleflag")=="10"){
      //alert("sales");
      if(localStorage.getItem("curr_sess_wardflag")=="5") {
        //localStorage.setItem("curr_sess_wardflag", "");
        document.querySelector('app-homepage').setPage('outwardreport-card');
        this.page = "outwardreport-card";
      }
      if(localStorage.getItem("curr_sess_wardflag")=="6") {
        localStorage.setItem("curr_sess_showpage", "Add Customer");
        //document.querySelector("supplier-page").setPage("Add Supplier");
        this.page = "customer-page";
      }
      this.$.flow.style.visibility='hidden';
      this.$.list.style.visibility='visible';
      this.$.flowbutton.style.visibility='hidden';
      this.$.drawerlist.style.visibility='visible';
      this.$.searchmenu.style.visibility='hidden';
    }

    /*Condition which allow to see the search page and hide the respective components in UI*/
    if(sessionStorage.getItem("curr_sess_roleflag")=="5"&&sessionStorage.getItem("curr_sess_roleflag")!="6"){
     //alert("search");
      localStorage.setItem("curr_sess_showpage","Search Items");
      this.page="Search Items";
      this.$.flow.style.visibility='hidden';
      this.$.list.style.visibility='hidden';
      this.$.flowbutton.style.visibility='hidden';
      this.$.drawerlist.style.visibility='visible';
      this.$.searchmenu.style.visibility='visible';
    }
    if(sessionStorage.getItem("curr_sess_roleflag")=="6"){
      
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
    if(sessionStorage.getItem("curr_sess_roleflag")!="0"&&sessionStorage.getItem("curr_sess_roleflag")!="5"&&sessionStorage.getItem("curr_sess_roleflag")!="6"&&sessionStorage.getItem("curr_sess_roleflag")!="7"&&sessionStorage.getItem("curr_sess_roleflag")!="8"&&sessionStorage.getItem("curr_sess_roleflag")!="9"&&sessionStorage.getItem("curr_sess_roleflag")!="10")
    {
      //alert("oldintent");
      if(localStorage.getItem("curr_sess_wardflag")=="2"&&sessionStorage.getItem("curr_sess_intentrefreshflag")=="0"){
      this.$.flow.style.visibility='hidden';    
      // this.$.intentflow.style.visibility='visible';  
      document.querySelector('app-homepage').setPage('intenthome-page');
      document.querySelector('intenthome-page').setPage('Add Intent');
      }
      else if(localStorage.getItem("curr_sess_wardflag")=="3"&&sessionStorage.getItem("curr_sess_intentrefreshflag")=="1"){
        this.$.flow.style.visibility='hidden';
        this.$.intentflow.style.visibility='visible';
      document.querySelector('app-homepage').setPage('intenthome-page');
      document.querySelector('intenthome-page').setPage('View Intent');
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
      if(localStorage.getItem("curr_sess_wardflag")=="2"&&sessionStorage.getItem("curr_sess_intentrefreshflag")=="0"){
      document.querySelector('app-homepage').setPage('intenthome-page');
      document.querySelector('intenthome-page').setPage('Add Intent');
      }
      else
      {
      document.querySelector('app-homepage').setPage('intenthome-page');
      document.querySelector('intenthome-page').setPage('View Intent');
      }
      this.$.flow.style.visibility='hidden';
      this.$.list.style.visibility='hidden';
      this.$.flowbutton.style.visibility='hidden';
      this.$.drawerlist.style.visibility='visible';
      this.$.searchmenu.style.visibility='hidden';
    }
    if(sessionStorage.getItem("curr_sess_roleflag")=="11"){
      this.$.flow.style.visibility='hidden';
      document.querySelector('app-homepage').setPage('outwardreport-card');
    }
    if(sessionStorage.getItem("curr_sess_roleflag")=="9"){
      this.$.flow.style.visibility='hidden';
      this.$.dynamicbutton.style.visibility='visible';
      document.querySelector('app-homepage').setPage('approvesupplier-card');
    }
    if(sessionStorage.getItem("curr_sess_roleflag")=="4"){
      if(localStorage.getItem("curr_sess_wardflag")=="3")
      this.$.intentview.style.visibility='visible';
      //this.$.intentflow.style.visibility='visible';
      if(localStorage.getItem("curr_sess_wardflag")=="3"&&localStorage.getItem("curr_sess_intenttoggleflag")=="1"){
        //alert("intent view");
      this.$.intentview.style.visibility='visible';
      this.$.flow.style.visibility='hidden';
      // this.$.intentflow.style.visibility='hidden';
      document.querySelector('app-homepage').setPage('intenthome-page');
      document.querySelector('intenthome-page').setPage('Intent View');
      }
      if(localStorage.getItem("curr_sess_wardflag")=="3"&&localStorage.getItem("curr_sess_intenttoggleflag")=="0"){
        //alert("item view");
      this.$.intentflow.style.visibility='visible';
      this.$.intentview.style.visibility='visible';
      this.$.flow.style.visibility='hidden';
      document.querySelector('app-homepage').setPage('intenthome-page');
      document.querySelector('intenthome-page').setPage('View Intent');
      }
      if(localStorage.getItem("curr_sess_wardflag")=="4") {
      this.$.flow.style.visibility='hidden';
      localStorage.setItem("curr_sess_showpage", "Add Supplier");
      //document.querySelector("supplier-page").setPage("Add Supplier");
      this.page = "supplier-page";
      }
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
      this.$.intentview.style.visibility='visible';
    if(flag=="false")
      this.$.intentview.style.visibility='hidden';
  },
  setPageTitle:function(title){
    this.pagetitle=title;
  },
  FnSetPromoteVisibility:function(flag){
    if(flag=="true")
      this.$.promotebutton.style.visibility='visible';
    if(flag=="false")
      this.$.promotebutton.style.visibility='hidden';
  },
  FnSetIntentFlowcardVisibility:function(flag){
    //alert(flag);
     if(flag=="true")
      this.$.intentflow.style.visibility='visible';
    if(flag=="false")
      this.$.intentflow.style.visibility='hidden';
  },
   FnSetDynamicButtonVisibility:function(flag){
    //alert(flag);
     if(flag=="true")
      this.$.dynamicbutton.style.visibility='visible';
    if(flag=="false")
      this.$.dynamicbutton.style.visibility='hidden';
  }
});
