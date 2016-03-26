<?php

    require_once('./libs/PHPTAL-1.3.0/PHPTAL.php');

    $template = new PHPTAL('thankyou.xhtml');

    $template->page_title = "Thank you";

    try {
        echo $template->execute();
    }
    catch (Exception $e){

        echo $e;
    }


?>



