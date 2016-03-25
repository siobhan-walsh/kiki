<?php

require_once('../init.php');
loadScripts();

    $data = array("status" => "not set!");

    if(Utils::isPOST()) {
        // post means either to delete or add a user
        $parameters = new Parameters("POST");

        $action = $parameters->getValue('action');
        $user_name = $parameters->getValue('username');
        $userid = $parameters->getValue('userid');

        //$data = array("action" => $action, "user_name" => $user_name);
        if($action == 'delete' && !empty($user_name)) {

            $um = new UserManager();
            $um->deleteUser($user_name);
            $data = array("status" => "success", "msg" => "User '$user_name' deleted.");
            echo json_encode($data, JSON_FORCE_OBJECT);
            return;

        } else if($action == 'update' && !empty($userid)) {
            $newFirstName = $parameters->getValue('newFirstName');
            $newLastName = $parameters->getValue('newLastName');
            $newUserName = $parameters->getValue('newUserName');
            $userid = $parameters->getValue('userid');

            if(!empty($newFirstName)) {

                $um = new UserManager();
                $count = $um->updateUser($userid, $newFirstName, $newLastName, $newUserName);
                if($count > 0) {
                    $data = array("status" => "success", "msg" =>
                        "User '$user_name' updated with new first name ('$newFirstName').");
                } else {
                    $data = array("status" => "fail", "msg" =>
                        "User '$userid' was NOT updated with new first name ('$newFirstName').");
                }
            } else {
                $data = array("status" => "fail", "msg" =>
                    "New user name must be present - value was '$newFirstName' for '$user_name'.");

            }
            echo json_encode($data, JSON_FORCE_OBJECT);
            return;

        } else if($action == 'add') {
            $newFirstName = $parameters->getValue('newFirstName');
            $newLastName = $parameters->getValue('newLastName');
            $newUserName = $parameters->getValue('newUserName');
            $newPw = $parameters->getValue('newPw');
            $newPw = md5($newPw);

            if(!empty($newFirstName) && !empty($newLastName) && !empty($newUserName) && !empty($newPw)) {
                $data = array("status" => "success", "msg" => "User added.");
                $um = new UserManager();
                $um->addUser($newFirstName, $newLastName, $newUserName, $newPw);

            } else {
                $data = array("status" => "fail", "msg" => "First name, last name, and user name cannot be empty.");
            }
            echo json_encode($data, JSON_FORCE_OBJECT);
            return;

        } else {
            $data = array("status" => "fail", "msg" => "Action not understood.");
        }

        echo json_encode($data, JSON_FORCE_OBJECT);
        return;

    } else if(Utils::isGET()) {
        // get means get the list of users
        $um = new UserManager();
        $rows = $um->listUsers();
        $html = "";
        if($rows != null) {

            foreach($rows as $row) {
                $user_id = $row['ID'];
                $first_name = $row['first_name'];
                $last_name = $row['last_name'];
                $user_name = $row['user_name'];
                $html .= "<tr data-user-id = '$user_id'>
                  <td class='first_name'><span>$first_name</span></td>
                  <td class='last_name'><span>$last_name</span></td>
                  <td class='user_name'><span>$user_name</span></td>
                  <td><input id='d-$user_name' class='delete' type='button' value='Delete'/></td>
                  <td><input id='u-$user_id' class='update' type='button' value='Update'/></td>
                  </tr>";
            }
            echo $html;

        } else {
            // shouldn't be but ...
            echo 'The returned rows is "null". No user table perhaps?';
        }

        return;

    } else {
        $data = array("status" => "error", "msg" => "Only GET and POST allowed.");
        echo json_encode($data, JSON_FORCE_OBJECT);
    }



?>
