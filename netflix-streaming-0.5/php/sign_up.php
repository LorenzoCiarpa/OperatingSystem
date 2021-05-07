<?php
    include "connection.php";

    $mysqli = dbConnection();

    $email = $_POST['email'];
    $pass = $_POST['password'];




   $result = $mysqli -> query("SELECT * FROM utente where email = '$email'");
   $count = mysqli_num_rows($result);
   // $row = mysqli_fetch_array($result);

   if($count == 0){
       $result = $mysqli->query("INSERT INTO utente (email, password) VALUES ('$email','$pass')");
       echo "ok";
   }else{
       $error = "Account already Exist!";
       die($error) ;
   }
?>
