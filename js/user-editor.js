
        $(document).ready(function() {

            function loadUsers() {
                $.ajax({
                    url: "./cont/users.php",
                    type: "GET",
                    dataType: 'html',
                    success: function(returnedData) {
                       
                        $("#userrows").html(returnedData);
                      
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.statusText, textStatus);
                    }
                });
            }

            loadUsers();


            $("#addNewUser").submit(function(e) {
                e.preventDefault();

               
                var firstName = $("#addFirstName").val();
                var lastName = $("#addLastName").val();
                var userName = $("#addUserName").val();
                var pw = $("#addPw").val();

                //console.log(firstName, lastName, userName);

                $.ajax({
                    url: "./cont/users.php",
                    type: "POST",
                    dataType: "JSON",
                    data: {action: "add", newFirstName: firstName,
                        newLastName: lastName, newUserName: userName, newPw: pw},
                    success: function(returnedData) {
                        loadUsers();
                      
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $("#p1").text(jqXHR.statusText);
                    }

                });

            });

            $('#users').on('click', '.delete', function() {
                var loginValue = this.getAttribute("id");
                loginValue = loginValue.replace("d-", "");

                $.ajax({
                    url: "./cont/users.php",
                    type: "POST",
                    dataType: 'json',
                    data: {action: "delete", username: loginValue},
                    success: function(returnedData) {
                        loadUsers();

                        window.location.href = "user-editor.php";
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.statusText, textStatus);
                    }
                });

            });

            $('#users').on('click', '.update', function() {
                
              
                var loginValue = this.getAttribute("id");
             
                loginValue = loginValue.replace("u-", "");
                var editedFirstName = $(this).parent().parent().find(".first_name span").text();
                var editedLastName = $(this).parent().parent().find(".last_name span").text();
                var editedUserName = $(this).parent().parent().find(".user_name span").text();
          
                $.ajax({
                    url: "./cont/users.php",
                    type: "POST",
                    dataType: 'json',
                    data: {action: "update", userid: loginValue, newFirstName: editedFirstName, newLastName: editedLastName, newUserName: editedUserName},
                    success: function(returnedData) {
                        
                    
                        loadUsers();

                        window.location.href = "user-editor.php";
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.statusText, textStatus);
                    }
                });

            });


            // http://stackoverflow.com/questions/11882693/change-table-cell-from-span-to-input-on-click
            $('#users').on('click', 'span', function() {

                var $td = $(this).parent();
                var $input = null;
               

                var val = $(this).html();

                if($td.attr('class') === 'first_name') {
                  
                    $td.html('<input type="text" value="' + val + '"/>');
                    var $input = $td.find('input');
                    $input.focus();
                    $input.select();
                } else if($td.attr('class') === 'last_name') {
                  
                    $td.html('<input type="text" value="' + val + '"/>');
                    var $input = $td.find('input');
                    $input.focus();
                    $input.select();
                } else if($td.attr('class') === 'user_name') {
                
                    $td.html('<input type="text" value="' + val + '"/>');
                    var $input = $td.find('input');
                    $input.focus();
                    $input.select();
                }

                if($input != null) {

                    $input.on('blur', function() {
                        $(this).parent().html('<span>' + $(this).val() + '</span>');
                    });

                    $input.keyup(function(e) {
                        if(e.which == 13) {
                            $(this).parent().html('<span>' + $(this).val() + '</span>');
                        } else if(e.which == 27) {
                          
                            $(this).parent().html('<span>' + val + '</span>');
                        }
                    });
                }
            });



        });
