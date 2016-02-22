/**
 * Created by praba on 2/11/2016.
 */
(function() {
  Polymer({
    is: "url-service",
    ready:function()
    {
    },
    urlService:function(){
      this.$.urlreadajax.generateRequest();
    },
    urlreadResponse:function(e)
    {
      var arr=e.detail.response;
      sessionStorage.setItem("curr_sess_url",arr[0].url);
      document.querySelector('login-card').setUrl(arr[0].url);
    }
  });
})();
