<?php

    require_once('./libs/PHPTAL-1.3.0/PHPTAL.php');


    $template = new PHPTAL('menu.xhtml');


    $template->page_title = "Menu Page with PHPTAL";


    try {
        echo $template->execute();
    }
    catch (Exception $e){

        echo $e;
    }


?>



