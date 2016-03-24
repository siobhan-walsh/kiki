<?php
    // get the session
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    $methodType = $_SERVER['REQUEST_METHOD'];
    $data = array("status" => "fail", "msg" => "$methodType");

    $DBHost = "localhost";
    $dblogin = "root";
    $DBpassword = "root";
    $DBname = "kiki";

    $methodType = $_SERVER['REQUEST_METHOD'];
    $data = array("status" => "fail", "msg" => "$methodType");

    if ($methodType === 'POST') {


        if(isset($_SERVER['HTTP_X_REQUESTED_WITH'])
            && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            // yes, is AJAX call
            // answer POST call and get the data that was sent
            if(isset($_POST["email"]) && !empty($_POST["email"])
                && isset($_POST["pw"]) && !empty($_POST["pw"])){


                // get the data from the post and store in variables
                $login = $_POST["email"];
                $password = $_POST["pw"];
	
                try {
                    $conn = new PDO("mysql:host=$DBHost;dbname=$DBname", $dblogin, $DBpassword);
                    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                    $sql = "SELECT * FROM users WHERE email = :log AND password = :pwd;";
					
					//"SELECT * FROM users WHERE user_name = $login AND password = $password;";

//SELECT * FROM users WHERE user_name = 'mickeymouse' AND password = 'Mickey!1';

                    $statement = $conn->prepare($sql);
                    $statement->execute(array(":log" => $login, ":pwd" =>  $password));
					$statement->execute();

                    // this should be one if there's a user by that user value and password value
                    $count = $statement->rowCount();
				
                    if($count > 0) {
                        // success, so fetch the first and hopefully only record

                        // http://stackoverflow.com/questions/15287905/convert-pdo-recordset-to-json-in-php
                        // http://php.net/manual/en/pdostatement.fetchall.php
                        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
                        $returnedLogin = $rows[0]['un'];
					
						
                        $returnedPassword = $rows[0]['pw'];

                      
                        $_SESSION['un'] = $returnedLogin;
					
                        $_SESSION['loggedin'] = true;
						

                       
                        $sid= session_id();
                        $data = array("status" => "success", "sid" => $sid);


                    } else {
                        $data = array("status" => "fail", "msg" => "User name and/or password not correct.");
                    }


                } catch(PDOException $e) {
                    $data = array("status" => "fail", "msg" => $e->getMessage());
                }


            } else {
                $data = array("status" => "fail", "msg" => "Either login or password were absent.");
            }



        } else {
            // not AJAX
            $data = array("status" => "fail", "msg" => "Has to be an AJAX call.");
        }


    } else {
        // simple error message, only taking POST requests
        $data = array("status" => "fail", "msg" => "Error: only POST allowed.");
    }

    echo json_encode($data, JSON_FORCE_OBJECT);

?>

