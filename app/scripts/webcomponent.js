/**
 * Created by praba on 2/10/2016.
 */
(function() {
  Polymer({
    is: "webcomponent-service",
    ready:function()
    {
      //localStorage.setItem("curr_sess_showpage","login-card");
    },
    callWebcomponentService:function(){
      //alert("calling....");
      this.$.webcomponentreadajax.generateRequest();
    },
    FnWebcomponentreadResponse:function(e) {
      this.current_page=localStorage.getItem("curr_sess_showpage");
      //alert(this.current_page);
      var arr = e.detail.response;
      //alert(JSON.stringify(arr));
      var labelvalue=[];
      var errorlabelvalue=[];
      //Binding labels to login-card
      for(var i=1;i<arr.length;i++) {

        if ((arr[i].Page[0].page[0]) == this.current_page) {

          labelvalue = arr[i].Page[1].Label;
          //alert(arr[i].Page[2].title);
          if(this.current_page!='login-card')
          document.querySelector('app-homepage').setPageTitle(arr[i].Page[2].title);
          /*Binding Labels and error message to the respective card*/
          //alert(JSON.stringify(labelvalue));
          document.querySelector(arr[i].Page[0].page[1]).label = labelvalue;

        }
      }
    },
    /*Receives request after successfull validation of user login and invoke ajax for retrive all roles*/
    roleconfigreadService:function(){
      this.$.roleconfigreadajax.generateRequest();
    },
    /*Role response received*/
    FnRoleconfigreadResponse:function(e){
      var roleconfig=e.detail.response;
      //alert(JSON.stringify(roleconfig));
      for(var i=0;i<roleconfig[0].role.length;i++){
        /*Checking logged role with role config json if exists returns the flag for the corresponding role then it will navigate to the index home(my-app js) page*/
        if(sessionStorage.getItem("loggedrole")==roleconfig[0].role[i].rolename){
          sessionStorage.setItem("curr_sess_roleflag",roleconfig[0].role[i].RoleFlag);
          localStorage.setItem("curr_sess_currflowstatus",roleconfig[0].role[i].status);
          localStorage.setItem("curr_sess_currflownewstatus",roleconfig[0].role[i].newstatus);
          localStorage.setItem("curr_sess_currflowupdatestatus",roleconfig[0].role[i].updatestatus);
          //alert(roleconfig[0].role[i].RoleFlag+" "+roleconfig[0].role[i].status+" "+roleconfig[0].role[i].newtatus+" "+roleconfig[0].role[i].updatetatus);
          if(sessionStorage.getItem("curr_sess_roleflag")=="6")
          localStorage.setItem("curr_sess_wardflag","");
          if(sessionStorage.getItem("curr_sess_roleflag")!=null)
          window.location.href="../elements/indexhome.html";
        }
      }
    },
    //Method invoke ajax service to fetch menu info for the currently logged uer's drawer menu items
    drawermenureadService:function(){
      this.$.drawermenureadAjax.generateRequest();
    },
    //Response for the requested drawer menu items
    drawermenureadResponse:function(e)
    {
      var arr=e.detail.response;
      //alert(JSON.stringify(arr));
      var sessrole=sessionStorage.getItem("curr_sess_roleflag");
      for(var i=0;i<arr[0].role.length;i++) {
        if (arr[0].role[i].RoleFlag == sessrole) {
          //alert(JSON.stringify(arr[0].role[i].menu));
          //Binding response to the drawer menulist card
          document.querySelector('drawermenu-list').itemArray = arr[0].role[i].menu;
        }
      }
    }
  });
})();
