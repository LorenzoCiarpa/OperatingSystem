
$(document).ready(function() {

  $('#login').click(function(){
    var userValue = $('#email').val();
    var pwdValue = $('#password1').val();
    var pwdValue2 = $('#password2').val();

    if(pwdValue != pwdValue2){
        passwordWrong(pwdValue, pwdValue2);
    }else{
        $.ajax({
            type: "POST",
            url: 'http://localhost/netflix-streaming/php/sign_up.php',
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
    }
  });//click

});//jq

function checkLogin(data){
  if(data == "ok"){
     var login_box = document.getElementsByClassName('login_box');
     login_box[0].innerHTML = "<h1 style='color:white;'> Account Creato </h1>";
      //window.alert("Account creato");
     setInterval(() => {window.location = "login.html";}, 2000);
  }else{
    emailWrong();
  }
};

function emailWrong(){
    var input = document.getElementsByClassName('sign_error');
    input[0].innerText = "Email Already Exist";
    setTimeout(() => {input[0].innerText = "";},5000);
    console.log("fatto");

}

function passwordWrong(){
    var input = document.getElementsByClassName('sign_error');
    input[1].innerText = "Password Doesn't match";
    input[2].innerText = "Password Doesn't match";
    setTimeout(() => {
        input[1].innerText = "";
        input[2].innerText = "";},5000);
    console.log("fatto");
}
