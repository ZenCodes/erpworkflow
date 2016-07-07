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
      // document.querySelector('app-homepage').setUsername(this.username);
      localStorage.setItem("curr_sess_wardflag","0");
      sessionStorage.setItem("loggeduser",this.username);      
      sessionStorage.setItem("loggedrole",logflag); 
      // Calling service to read the logged username
      document.querySelector("webcomponent-service").FnusernamereadService();      
      /*Calling webcomponent service for reading role from roleconfig json file*/
      // document.querySelector("webcomponent-service").roleconfigreadService();      
    }
    else
      alert("Invalid user!!");
  },
  //It is a method which receives Global Url from url.json file
  setUrl:function(url){
    this.url=url+"login-card";    
  },
  //Function which invokes for keyboard enter of the login card
  FnLoginSubmit:function()
  {
      this.$.Form_Login.submit();
  },
  FnPasswordChange:function(){
    document.querySelector('app-card').setPage('passwordchange-card');
  },
  FnForgotPassword:function(){
    document.querySelector('app-card').setPage('resetpassword-card');
  }
});
