<?php

    require_once('./libs/PHPTAL-1.3.0/PHPTAL.php');

    $template = new PHPTAL('index.xhtml');

    $template->page_title = "Kiki's";

    try {
        echo $template->execute();
    }
    catch (Exception $e){

        echo $e;
    }


?>



