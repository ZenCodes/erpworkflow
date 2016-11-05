Polymer({is:"drawermenu-card",
  ready:function(){
    sessionStorage.setItem("curr_sess_intentrefreshflag","0");
  },
  selectedMenu:function(e){
    //Role flag 0 to ensure Inwardslip and outgoing item entries,and it will navigate to the pages based on the flags
    if(sessionStorage.getItem("curr_sess_roleflag")=="0"){
      if(e.target.id=="Inward Items Register"){
        localStorage.setItem("curr_sess_wardflag","0");
        window.location.href="../elements/indexhome.html";        
      }
      if(e.target.id=="Outward Items Register"){
        localStorage.setItem("curr_sess_wardflag","1");
        window.location.href="../elements/indexhome.html";        
      }
    }
    else if(sessionStorage.getItem("curr_sess_roleflag")=="4"){
      if(e.target.id=="GRN Flow"){
        localStorage.setItem("curr_sess_wardflag","");
        window.location.href="../elements/indexhome.html";
      }
       if(e.target.id=="Add Supplier"){
        localStorage.setItem("curr_sess_wardflag","4");        
        window.location.href="../elements/indexhome.html";        
      }
      if(e.target.id=="External Intent"){
       localStorage.setItem("curr_sess_wardflag","3");
        sessionStorage.setItem("curr_sess_intentrefreshflag","1");
        document.querySelector('viewintent-page').FnRefreshService();
        window.location.href="../elements/indexhome.html";
      }
    }
    //Role flag 2 is for the role who may do GRN Flow navigation Intent item adding
    else if(sessionStorage.getItem("curr_sess_roleflag")=="2"){
      if(e.target.id=="GRN Flow"){
        localStorage.setItem("curr_sess_wardflag","");
        window.location.href="../elements/indexhome.html";
      }
      if(e.target.id=="Add Intent"){        
        localStorage.setItem("curr_sess_wardflag","2");
        sessionStorage.setItem("curr_sess_intentrefreshflag","0");
        window.location.href="../elements/indexhome.html";
      }
      if(e.target.id=="External Intent"){
       localStorage.setItem("curr_sess_wardflag","3");
       sessionStorage.setItem("curr_sess_intentrefreshflag","1");
       window.location.href="../elements/indexhome.html";
      }
      if(e.target.id=="Internal Intent"){        
        localStorage.setItem("curr_sess_wardflag","15");
        // sessionStorage.setItem("curr_sess_intentrefreshflag","1");
        window.location.href="../elements/indexhome.html";
      }
    }

    else if(sessionStorage.getItem("curr_sess_roleflag")=="3"){
       if(e.target.id=="GRN Flow"){
        localStorage.setItem("curr_sess_wardflag","");
        window.location.href="../elements/indexhome.html";
      }
      if(e.target.id=="Internal Intent"){        
        localStorage.setItem("curr_sess_wardflag","15");
        // sessionStorage.setItem("curr_sess_intentrefreshflag","1");
        window.location.href="../elements/indexhome.html";
      }
      if(e.target.id=="Test Certificate"){        
        localStorage.setItem("curr_sess_wardflag","16");
        // sessionStorage.setItem("curr_sess_intentrefreshflag","0");
        // document.querySelector('search-batch-card').FnsearchbatchService();
        window.location.href="../elements/indexhome.html";
      }
    }
    //Roleflag 1 is for the role who may do GRN Flow and Intent items
    else if(sessionStorage.getItem("curr_sess_roleflag")=="1"){
      if(e.target.id=="GRN Flow"){
        localStorage.setItem("curr_sess_wardflag","");
        window.location.href="../elements/indexhome.html";
      }
       if(e.target.id=="Add Intent"){        
        localStorage.setItem("curr_sess_wardflag","2");
        sessionStorage.setItem("curr_sess_intentrefreshflag","0");
        window.location.href="../elements/indexhome.html";
      }
      if(e.target.id=="External Intent"){        
        localStorage.setItem("curr_sess_wardflag","3");
        sessionStorage.setItem("curr_sess_intentrefreshflag","1");
        window.location.href="../elements/indexhome.html";
      }
      if(e.target.id=="Internal Intent"){        
        localStorage.setItem("curr_sess_wardflag","15");
        // sessionStorage.setItem("curr_sess_intentrefreshflag","1");
        window.location.href="../elements/indexhome.html";
      }
    }
    else if(sessionStorage.getItem("curr_sess_roleflag")=="6"){
      if(e.target.id=="Add Item"){
        localStorage.setItem("curr_sess_wardflag","");
        window.location.href="../elements/indexhome.html";
      }
      if(e.target.id=="Add Supplier"){
        localStorage.setItem("curr_sess_wardflag","4");        
        window.location.href="../elements/indexhome.html";        
      }
      if(e.target.id=="User Management"){
        localStorage.setItem("curr_sess_wardflag","11");       
        window.location.href="../elements/indexhome.html";              
      }
      if(e.target.id=="Department Creation"){
        localStorage.setItem("curr_sess_wardflag","13");       
        window.location.href="../elements/indexhome.html";              
      }
      if(e.target.id=="Role Creation"){
        localStorage.setItem("curr_sess_wardflag","14");       
        window.location.href="../elements/indexhome.html";              
      }
    }
    else if(sessionStorage.getItem("curr_sess_roleflag")=="7"||sessionStorage.getItem("curr_sess_roleflag")=="8"||sessionStorage.getItem("curr_sess_roleflag")=="9"){
      if(e.target.id=="Add Intent"){        
        localStorage.setItem("curr_sess_wardflag","2");
        sessionStorage.setItem("curr_sess_intentrefreshflag","0");
        window.location.href="../elements/indexhome.html";
      }
      if(e.target.id=="External Intent"){
        localStorage.setItem("curr_sess_wardflag","3");
        sessionStorage.setItem("curr_sess_intentrefreshflag","1");
        window.location.href="../elements/indexhome.html";
      }
      if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&e.target.id=="Approve Supplier"){        
        localStorage.setItem("curr_sess_wardflag","7");
        window.location.href="../elements/indexhome.html";
      }
      if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&e.target.id=="Approve Customer"){        
        localStorage.setItem("curr_sess_wardflag","8");
        window.location.href="../elements/indexhome.html";
      }
      if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&e.target.id=="Approve User"){        
        localStorage.setItem("curr_sess_wardflag","12");
        window.location.href="../elements/indexhome.html";
      }
    }
     //Role flag 2 is for the role who may do GRN Flow navigation Intent item adding
    else if(sessionStorage.getItem("curr_sess_roleflag")=="5"){

      if(e.target.id=="External Intent"){
       localStorage.setItem("curr_sess_wardflag","3");
       sessionStorage.setItem("curr_sess_intentrefreshflag","1");
        document.querySelector('viewintent-page').FnRefreshService();
        document.querySelector('app-homepage').setPage('intenthome-page');
        document.querySelector('intenthome-page').setPage('External Intent');
        document.querySelector('app-homepage').setVisible("false");
        document.querySelector('viewtype-card').FnHideBtns();
        document.querySelector('app-homepage').setFlowVisibility('false');       
      }
     
    }
    else if(sessionStorage.getItem("curr_sess_roleflag")=="10"){
      if(e.target.id=="Outward Items Report"){
        localStorage.setItem("curr_sess_wardflag","5");
        window.location.href="../elements/indexhome.html";
      }
      if(e.target.id=="Add Customer"){
        localStorage.setItem("curr_sess_wardflag","6");
        window.location.href="../elements/indexhome.html";
      }
    }
  }
});
