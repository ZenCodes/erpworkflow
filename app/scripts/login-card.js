/**
 * Created by praba on 2/10/2016.
 */

//JS file for login-card
Polymer({
  is: "login-card",
  ready:function()
  {
    localStorage.setItem("curr_sess_showpage","login-card");
    this.$.ID_WebcomponentService.callWebcomponentService();
  },
  //Response received after authenticating user,if it is valid user navigating to indexhome.html page otherwise it will give alert message to the user
  Response:function(e){
    var logflag=e.detail.response.returnval;
    if(logflag!="invalid")
    {
      //alert(logflag);

      localStorage.setItem("curr_sess_wardflag","0");
      sessionStorage.setItem("loggeduser",this.username);
      sessionStorage.setItem("loggedrole",logflag);
      /*Calling webcomponent service for reading role from roleconfig json file*/
      document.querySelector("webcomponent-service").roleconfigreadService();
      //window.location.href="elements/indexhome.html";
    }
    else
      alert("Invalid user!!");
  },
  //It is a method which receives Global Url from url.json file
  setUrl:function(url){
    this.url=url+"login-card";
    //alert(this.url);
  },
  //Function which invokes for keyboard enter of the login card
  FnLoginSubmit:function()
  {
   /* if(this.username=='manager'&&this.password=='manager'){
      sessionStorage.setItem("loggeduser",this.username);
      sessionStorage.setItem("curr_sess_roleflag",'manager');
      window.location.href="elements/indexhome.html";
    }
    else if(this.username=='admin'&&this.password=='admin'){
      sessionStorage.setItem("loggeduser",this.username);
      sessionStorage.setItem("curr_sess_roleflag",'admin');
      window.location.href="elements/indexhome.html";
    }
    else*/
      this.$.Form_Login.submit();

   // this.$.Form_Login.submit();
  }
});
