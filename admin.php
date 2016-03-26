<?php

require_once('./libs/PHPTAL-1.3.0/PHPTAL.php');
require_once('init.php');
loadScripts();


    if(!Utils::isGET()) {
        $data = array("status" => "error", "msg" => "Only GET allowed.");
    }

    $parameters = new Parameters("GET");

    $showUserProfileAction = new ShowUserProfileAction();
    $showUserProfileAction->setParameters($parameters);
    $profile = $showUserProfileAction->getProfile();

    if(Utils::isAJAX()) {
        $data = array();

        if($profile == null) {

            $data = array("status" => "error", "msg" => Messages::getMessages());
        } else {
            $data = array("status" => "success", "profile" => $profile);
        }
        echo json_encode($data, JSON_FORCE_OBJECT);
        return;

    } else {

        $template = new PHPTAL('admin.xhtml');

        $template->page_title = "Admin Login";
        $template->profile = $profile;


        $template->messages = Messages::getMessages();

 
        try {
            echo $template->execute();
        }
        catch (Exception $e){
    
            echo $e;
        }

    }

?>
