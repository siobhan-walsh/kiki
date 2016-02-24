<?php
  
    require_once('./libs/PHPTAL-1.3.0/PHPTAL.php');

    // render the whole page using PHPTAL

    // finally, create a new template object
    $template = new PHPTAL('contact.xhtml');

    // now add the variables for processing and that you created from above:
    $template->page_title = "Contact Page with PHPTAL";


    // execute the template
    try {
        echo $template->execute();
    }
    catch (Exception $e){
        // not much else we can do here if the template engine barfs
        echo $e;
    }




/* if (isset($_REQUEST['submitted'])) {

  $errors = array();
 
  if (!empty($_REQUEST['name'])) {
  $firstname = $_REQUEST['name'];
  $pattern = "/^[a-zA-Z0-9\_]{2,20}/";
  if (preg_match($pattern,$name)){ $firstname = $_REQUEST['name'];}
  else{ $errors[] = 'Your Name can only contain _, 1-9, A-Z or a-z 2-20 long.';}
  } else {$errors[] = 'You forgot to enter your Name.';}
  
 
  if (!empty($_REQUEST['subject'])) {
  $comments = $_REQUEST['subject'];
  $pattern = "/^[a-zA-Z0-9\_]{0,2000}/";
  if (preg_match($pattern,$comments)){ $comments = $_REQUEST['subject'];}
  else{ $errors[] = 'Your message can only contain _, 1-9, A-Z or a-z 0-2000 long.';}
  } else {$errors[] = 'You forgot to enter your message.';}
  
 

if (isset($_REQUEST['submitted'])) {
  if (empty($errors)) { 
  $from = "From: Kiki";
  
  $to = "k8esak@gmail.com"; 
  $subject = "Admin - Kiki Comment from " . $name . "";
  
  $message = "Message from " . $firstname . " " . $lastname . " 
  Comments: " . $comments . " 
  1star: " . $check1 ."
  2stars: " . $check2 ."
  3stars: " . $check3 ."
  4stars: " . $check4 ."
  5stars: " . $check5 ."";
  mail($to,$subject,$message,$from);
  }
}

 
  if (isset($_REQUEST['submitted'])) {
 
  if (!empty($errors)) { 
    echo "<script>window.location = 'contact.php'"; 
   
  } else{echo "<script>window.location = 'thankyou.php'</script>"; 
      echo "Message from " . $firstname . " " . $lastname . " <br />Comments: ".$comments." <br />";
      echo "<br />1star: " . $check1 . "";
      echo "<br />2stars: " . $check2 . "";
      echo "<br />3stars: " . $check3 . "";
      echo "<br />4stars: " . $check4 . "";
      echo "<br />5stars: " . $check5 . "";
      }
  }
  }


*////


?> 



