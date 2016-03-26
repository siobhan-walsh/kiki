<?php
  
    require_once('./libs/PHPTAL-1.3.0/PHPTAL.php');

    $template = new PHPTAL('contact.xhtml');

    $template->page_title = "Kiki's | Contact Us";

    try {
        echo $template->execute();
    }
    catch (Exception $e){

        echo $e;
    }





?> 



