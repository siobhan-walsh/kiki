<?php
 

 
 
    $email_to = "siobhanemmarose@gmail.com";
 
    $email_subject = "from kiki";
 
     
 
    $email_message .= "First Name: ".clean_string($first_name)."\n";
 
    $email_message .= "Email: ".clean_string($email_from)."\n";

 
    $email_message .= "Comments: ".clean_string($comments)."\n";
 
   
 
@mail("siobhanemmarose@gmail.com", $email_subject, $email_message);  
 
?>
 
 

 
 
Thank you for contacting us. We will be in touch with you very soon.
