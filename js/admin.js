
                    $(document).ready(function() {

                        // from: http://www.developerdrive.com/2013/04/turning-a-form-element-into-json-and-submiting-it-via-jquery/
                        function ConvertFormToJSON(form){
                            var array = $(form).serializeArray();
                            var json = {};

                            jQuery.each(array, function() {
                                // don't send 'undefined'
                                json[this.name] = this.value || '';
                            });
                            return json;
                        }
                        
                        function getProducts(){
                             $.ajax({
                                url: "./cont/products.php",
                                type: "POST",
                                dataType: 'HTML',
                                 data:{action:'admin'},
                                success: function(presp) {
                                 // console.log("cart checkout response: ", presp);
                                   $('#table-body').append(presp);

                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    console.log(jqXHR.statusText, textStatus);
                                }
                            });
                        };
                        
                        getProducts();
                        checkProducts();
                        setInterval(function(){
                            checkProducts();
                        }, 10000);
                        
                        
                         function checkProducts(){
                             $.ajax({
                                url: "./cont/products.php",
                                type: "POST",
                                dataType: 'JSON',
                                 data:{action:'checkstock'},
                                success: function(presp) {
                               
                                    var lowstockItems = [];
                                    for(var i = 0; i < presp.length; i++){
                                        
                                        if(presp[i].stock < 4){
                                           
                                            lowstockItems.push(presp[i].sku);
                                            var tdtd = $('*[data-sku-stock = "' + presp[i].sku + '"]').html('<p style="color:red;">low stock:</p><span>' + presp[i].stock + '</span>');
                                      
                                        } else {
                                            $('*[data-sku-stock = "' + presp[i].sku + '"]').html('<span>' + presp[i].stock + '</span>');
                                        }
                                        
                                    };
                                 
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    console.log(jqXHR.statusText, textStatus);
                                }
                            });
                        };
                       
                      
                        
                        $("#submitNewProduct").click(function() {
                           
                            // get values from form
                            var productName = $("#addProductName").val();
                            var productDesc = $("#addDesc").val();
                            var productPrice = $("#addPrice").val();
                            var productStock = $("#addStock").val();
                            
                            console.log('productname', productName);
                            
                            if(productName == '' || productDesc == '' || productPrice == '' || productStock == ''){
                                console.log('productname null', productName);
                                
                                $('#submitNewProduct').after('<p style="color:red;">Please enter all fields</p>');
                            } else {
                                
                                $.ajax({
                                    url: "./cont/products.php",
                                    type: "POST",
                                    dataType: "JSON",
                                    data: {action: "add", productName:  productName, productDesc: productDesc, productPrice:productPrice, productStock:productStock},
                                    success: function(returnedData) {


                                        location.reload(); 

                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        $("#p1").text(jqXHR.statusText);
                                    }

                                });
                                
                            }

                            

                        });

                        function doLogin() {

                            var formData = ConvertFormToJSON("#loginForm");
                         
                            $.ajax({
                                url: "./login.php",
                                type: "POST",
                                dataType: "JSON",
                                data: formData,
                                success: function(returnedData) {
                                    console.log("Login data returned: ", returnedData);

                                    var status = returnedData['status'];
                                    if(status == 'error') {
                                        msgs = returnedData['msg'];
                                        for(msg in msgs) {
                                        
                                            $("#AJAXMessages").html("<li class='" + msgs[msg]['type']
                                                + "'" + ">" + msgs[msg]['text'] + "</li>");
                                        }

                                    } else {
                                     
                                       
                                        $("#profileContainer").html("<div id='userProfile'>"
                                            + "<h4>User Profile</h4>\n"
                                            + "<span>" + returnedData['user']['user_name'] + "</span> "
                                            + "<span>" + returnedData['user']['first_name'] + "</span> "
                                            + "<span>" + returnedData['user']['last_name'] + "</span>"
                                            +"<br/><br/><br/></div>");
                                        $("#AJAXMessages").html("");
                                        
                                        //show products
                                        getProducts();

                                        // remove login form
                                        $("#loginForm").remove();

                                        // create logout form
                                        $("#loginFormContainer").after('<div id="logoutFormContainer"><form id="logoutForm"><fieldset><legend>Logout Form</legend><label for="password">Password: </label><input id="logoutbutton" type="button" value="Logout"/><input type="hidden" value="logout" name="logoutButton"/></fieldset></form></div>');
                                        $("#logoutbutton").bind("click", doLogout);
                                         location.reload(); 

                                    }


                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    console.log("AJAX Error", textStatus);
                                }
                            });
                        }

                        function doLogout() {
                            var formData = {logout: "true"};
                        

                            $.ajax({
                                url: "./logout.php",
                                type: "POST",
                                dataType: "JSON",
                                data: formData,
                                success: function(returnedData) {
                                  
                                   location.reload(); 
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    //console.log(jqXHR.statusText, textStatus, errorThrown);
                                    console.log(jqXHR.statusText, textStatus);
                                }
                            });
                        }

                        // login event
                        $("#loginbutton").click(doLogin);

                        // logout event
                        $("#logoutbutton").click(doLogout);

                        
                        // inputs for clicky 
                        
                         $('#table-body').on('click', 'span', function() {

                            var $td = $(this).parent();
                            var tdspan = $(this);
                            var $input = null;
                             var thisthang = this;
                            

                           var htmlval = $td.children('span').html();
                            
                            if($td.attr('class') === 'itemtitle') {
                                
                                var inp = document.createElement('input');
                                inp.type = 'text';
                                inp.value = htmlval;
                                tdspan.replaceWith(inp);
                              
                                var $input = $td.find('input');
                                $input.focus();
                                $input.select();
                            } else if($td.attr('class') === 'price') {
                              
                                var inp = document.createElement('input');
                                inp.type = 'text';
                                inp.value = htmlval;
                                tdspan.replaceWith(inp);
                                var $input = $td.find('input');
                                $input.focus();
                                $input.select();
                            } else if($td.attr('class') === 'stock') {
                              
                                var inp = document.createElement('input');
                                inp.type = 'text';
                                inp.value = htmlval;
                                tdspan.replaceWith(inp);
                                var $input = $td.find('input');
                                $input.focus();
                                $input.select();
                            } else if($td.attr('class') === 'itemdesc') {
                              
                                var inp = document.createElement('input');
                                inp.type = 'text';
                                inp.value = htmlval;
                                tdspan.replaceWith(inp);
                                var $input = $td.find('input');
                                $input.focus();
                                $input.select();
                            }

                            if($input != null) {
                                

                                $input.on('blur', function() {
                                   // $(this).parent().html($(this).val());
                                    $(this).replaceWith('<span>' + $(this).val() + '</span>');
                                   
                                });

                                $input.keyup(function(e) {
                                    if(e.which == 13) {
                                         $(this).replaceWith('<span>' + $(this).val() + '</span>');
                                    } else if(e.which == 27) {
                                        // escape key, means user canceled operation
                                         $(this).replaceWith('<span>' + htmlval + '</span>');            
                                    }
                                });
                            }
                        });

                        // updating products
                        
                        $('#table-body').on('click', '.update', function() {
                
              
                            var skuValue = this.getAttribute("id");
                            skuValue = skuValue.replace("u-", "");
                            var editedItemName = $(this).parent().parent().find(".itemtitle span").text();
                            var editedDesc = $(this).parent().parent().find(".itemdesc span").text();
                            var editedPrice = $(this).parent().parent().find(".price span").text();
                            var editedStock = $(this).parent().parent().find(".stock span").text();
                            
                           
                            $.ajax({
                                url: "./cont/products.php",
                                type: "POST",
                                dataType: 'json',
                                data: {action: "update", sku: skuValue, newItemName: editedItemName, newDesc: editedDesc, newPrice: editedPrice, newStock:  editedStock},
                                success: function(returnedData) {

                                    checkProducts();
                                    location.reload(); 
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    console.log(jqXHR.statusText, textStatus);
                                }
                            });

                        });

      // deleting products
                $('#table-body').on('click', '.delete', function() {
                        var deletesku = this.getAttribute("id");
                        deletesku = deletesku.replace("d-", "");
                   
                       
                    $.ajax({
                         url: "./cont/products.php",
                        type: "POST",
                        dataType: 'json',
                        data: {action: "delete", sku: deletesku},
                        success: function(returnedData) {
                         
                            location.reload(); 
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(jqXHR.statusText, textStatus);
                        }
                    });

                });


});
