
$(document).ready(function() {

  $('#login').click(function(){
    var userValue = $('#email').val();
    var pwdValue = $('#password').val();

    $.ajax({
        type: "POST",
        url: 'http://localhost/netflix-streaming/php/login.php',
        data: ({ email : userValue, password: pwdValue }),
        dataType: "html",
        success: function(data) {
            checkLogin( data );
            return data;
        },
        error: function() {
            console.log('Error occured');
        }
    });//ajax

  });//click

});//jq

function checkLogin(data){
  if(data == "ok"){
      //console.log("ok va bn");
    window.location = "index.html";
  }else{
     emailWrong();
    console.log("email o password errati");
  }
};

function emailWrong(){
    var input = document.getElementsByClassName('sign_error');
    input[0].innerText = "Email or Password Wrong";
    input[1].innerText = "Email or Password Wrong";
    setTimeout(() => {
        input[0].innerText = "";
        input[1].innerText = "";},5000);
    console.log("fatto");

}
