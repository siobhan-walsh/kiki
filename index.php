<?php

<<<<<<< HEAD
   
 
=======
    $profpic = "img/greek.jpg";
    $foodpic = "img/greekfeast.jpg";
>>>>>>> 1de6e44e78d3fdb195b4f174cff7828fa42ac30b
    require_once('./libs/PHPTAL-1.3.0/PHPTAL.php');

    // render the whole page using PHPTAL

    // finally, create a new template object
    $template = new PHPTAL('index.xhtml');

    // now add the variables for processing and that you created from above:
    $template->page_title = "Index Page with PHPTAL";


    // execute the template
    try {
        echo $template->execute();
    }
    catch (Exception $e){
        // not much else we can do here if the template engine barfs
        echo $e;
    }


?>



