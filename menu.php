<?php

    require_once('./libs/PHPTAL-1.3.0/PHPTAL.php');


    $template = new PHPTAL('menu.xhtml');


    $template->page_title = "Kiki's | Menu";


    try {
        echo $template->execute();
    }
    catch (Exception $e){

        echo $e;
    }


?>



