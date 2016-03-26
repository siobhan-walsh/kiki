
        $(document).ready(function() {
            
            
             Storage.prototype.setObject = function(key, value) {
                
                this.setItem(key, JSON.stringify(value));
             
            }

            Storage.prototype.getObject = function(key) {
                
                var value = this.getItem(key);
                return value && JSON.parse(value);
            }
            
            cartAnimation();
            loadProducts();
            
            var items = [];
            var cartstarted = false;
            
            
            //index of for objects in arrays
            function arrayObjectIndexOf(myArray, searchTerm, property) {
                for(var i = 0, len = myArray.length; i < len; i++) {
                    if (myArray[i][property] === searchTerm) return i;
                }
                return -1;
            }
            
          
            //cart expanding
            
            
            
            function cartAnimation(){
                
                 var winsize = $(window).width() / parseFloat($("html").css("font-size"));
                
                if(winsize < 40){
                    
                    //mobile cart styles

                    $('#cart').css({"right":"-200px"});
                    $('#cart').css({"top":"25vh"});
                    $('#cart').css({"height":"75vh"});

                }
                var tog = false;

                $('#mcartbutton').click(function(){
                  
                     if(tog == false){



                         $('#mcartbutton').stop(true).animate(
                                {
                                    right:'80%',
                                    opacity:1
                                }, 1000, function(){
                                    $('#mcartbutton').css({"background-color":"rgba(255,255,255,0)"});

                                }
                        );

                       $('#cart').stop(true).animate(
                                {

                                    width:'100%',
                                    right:'0',
                                    opacity:1
                                }, 1000, function(){

                                }
                        );

                        $('#arrow i').html('keyboard_arrow_right');
                        tog = true;

                    } else if(tog == true){


                        $('#mcartbutton').stop(true).animate(
                                {
                                    right:'0%',
                                    opacity:1
                                }, 1000, function(){
                                    $('#mcartbutton').css({"background-color":"rgba(255,255,255,1)"});

                                }
                        );

                       $('#cart').stop(true).animate(
                                {

                                    width:'30%',
                                    right:'-200px',
                                    opacity:1
                                }, 1000, function(){

                                }
                        );
                        $('#arrow i').html('keyboard_arrow_left');
                        tog = false;
                    }



                });

                $('#arrow').click(function(){


                    if(tog == false){

                       $('#cart').stop(true).animate(
                                {

                                    width:'60%',
                                    opacity:1
                                }, 1000, function(){

                                }
                        );

                        $('#arrow i').html('keyboard_arrow_right');
                        tog = true;

                    } else if(tog == true){

                       $('#cart').stop(true).animate(
                                {

                                    width:'30%',
                                    opacity:1
                                }, 1000, function(){

                                }
                        );
                        $('#arrow i').html('keyboard_arrow_left');
                        tog = false;
                    }

                });
                
                
            };
            
            
           
            
            
            ///// function to change qty on change
                    
            function changeqty(){

                var numinps = document.querySelectorAll('input[type="number"]');

                function changenums(i){
                    return function(){

                        var changedinp = this;
                        var quan = parseFloat(changedinp.value);
                        

                        var cartData = sessionStorage.getObject('autosave', 'save');
                        
                        if(cartData == null ) {
                            return;
                        }
                         cartData.items[i].qty = quan;

                        sessionStorage.setObject('autosave', cartData);
                        var thisli = $(changedinp).parents('li');
                        
                        thisli[0].setAttribute('data-item-qty', quan);
                       
                        var thisSku = cartData.items[i].sku; 

                        var listeditems = document.querySelectorAll(".showsubtotal");
                        var price = cartData.items[i].price;
                        var subtotal = parseFloat(Math.round((quan * price) * 100) / 100).toFixed(2);
                        
                        var alltotals = [];
                      
                        for(var x = 0; x < listeditems.length; x++){

                            var listeditemsku = listeditems[x].getAttribute("data-price-sku");

                            if(listeditemsku == thisSku ){
                              listeditems[x].innerHTML = subtotal;

                            }
                            
                            alltotals.push(parseFloat(listeditems[x].innerHTML));
                           
                            
                        };
                        
                        var sum = alltotals.reduce(add, 0);

                            function add(a, b) {
                                return a + b;
                            }

                            console.log('sum is', sum); // 6
                        
                        var totalspace = document.getElementById('totalsp');
                        totalsp.innerHTML = sum.toFixed(2);


                    };
                };

                for (var i = 0; i < numinps.length; i++){

                    numinps[i].addEventListener("change", changenums(i));

                };

            };

           
            
            
            function loadProducts() {
                $.ajax({
                    url: "./cont/products.php",
                    type: "POST",
                    dataType: 'HTML',
                    data:{action:'menu'},
                    success: function(presp) {
                        //console.log("cart checkout response: ", presp);
                        $("#listitems").html(presp);
                        $("#whitebox").fadeIn('slow');
                        
                        addtocart();
                        loadShoppingCartItems();
                                
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.statusText, textStatus);
                    }
                });
            }

 
            
            function loadShoppingCartItems() {

                var cartData = sessionStorage.getObject('autosave');

                if(cartData == null) {
                    return;
                }
                
                var cartDataItems = cartData['items'];
                var shoppingCartList = $("#shoppingCart");


                for(var i = 0; i < cartDataItems.length; i++) {
                    
                    
                    var item = cartDataItems[i];
                    var sku = item['sku'];
                    var qty = item['qty'];
                    var date = item['date'];
                    var price = item['price'];
                    var desc = item['desc'];
                    var stock = item['stock'];
                    var subtotal = parseFloat(Math.round((qty * price) * 100) / 100).toFixed(2);
                    
                    
                    var aDate = new Date();
                    
                    var item = "<li data-item-sku='" + sku + "' data-item-qty='" + qty + "' data-item-date='"
                        + aDate.getTime() + "' data-item-total='" + subtotal + "' data-item-stock = '" + stock + "'><div class='row'><span style='font-weight:bold;font-size:18pt;' >" + desc + "</span><br><div class='large-4 large-offset-2 small-offset-2 small-4 columns'><span class='label'>quantity:</span><br><input class='qty' data-sku-qty=' " + sku + "' value='" + qty + "' min='1' max='"+ stock + "' step='1' type='number'></div><div class='large-4 large-offset-2 small-offset-2 small-4 columns'><span class='label'>price:</span><br><span >$</span><span class='showsubtotal' data-price-sku='" + sku + "'>" + subtotal + "</span></div><div class='row '><div class = ' large-10 small-10 large-offset-2 small-offset-2 columns'><input class='removeitem' type='button' data-remove-button='remove' value='remove item' data-item-sku='" + sku + "' data-item-qty='" + qty +" data-item-date = '" + aDate.getTime() +"' /></div></div></div></li>";
                    
                    
            
                    shoppingCartList.append(item);
                    
                    var alreadythere = arrayObjectIndexOf(cartDataItems, sku, "sku"); // 1
                   
                    if(alreadythere != -1){
                       
                        var addbuttons = document.querySelectorAll('.add');
                        
                        
                        for(var x = 0; x < addbuttons.length; x++){
                           
                            if(addbuttons[x].getAttribute('data-sku-add') == sku){
                                
                                addbuttons[x].disabled = true;
                                addbuttons[x].value = 'added';

                            }
                        }
                      
                    };
                    
                    var alltotals = [];

                    for(var x = 0; x < cartData['items'].length; x++){

                         var itemsubtotal = parseFloat(Math.round((cartData['items'][x].qty * cartData['items'][x].price) * 100) / 100).toFixed(2);

                        alltotals.push(parseFloat(itemsubtotal));


                    };
                    function add(a, b) {
                            return a + b;
                        }

                    var sum = alltotals.reduce(add, 0);

                    var totalspace = document.getElementById('totalsp');
                    totalsp.innerHTML = sum.toFixed(2);
                    
                    changeqty();
                   
                    
                }
            
            }
            
            
            
            function addtocart(){
                
                var adds = document.querySelectorAll('.add');
               
                for(var i = 0; i < adds.length; i++){
                    adds[i].addEventListener('click', adding(i));
                };
                
                function adding(i){
                    return function(){
                    var clickeditem = this;
                        
                        this.disabled = true;
                        this.value = 'added';
                        
                        if(sessionStorage.cartstarted != 'true'){
                          
                                $.ajax({
                                    url: "./cont/cart.php",
                                    type: "POST",
                                    dataType: 'json',
                                    data: {action: "startcart"},
                                    success: function(returnedData) {
                                       
                                        sessionStorage.setObject('autosave', {items: []});
                                        
                                        var sku = clickeditem.getAttribute("data-sku-add");
                                        var qty = 1;
                                        var price = $("span[data-sku-price='" + sku + "']").text();
                                        var desc = $("p[data-sku-name='" + sku + "']").text();
                                        var subtotal = parseFloat(Math.round((qty * price) * 100) / 100).toFixed(2);
                                        var stock = clickeditem.getAttribute("data-stock");
                                        var aDate = new Date();
                                        
                                        var shoppingCartList = $("#shoppingCart");

                                       var item = "<li data-item-sku='" + sku + "' data-item-qty='" + qty + "' data-item-date='"
                        + aDate.getTime() + "' data-item-total='" + subtotal + "' data-item-stock = '" + stock + "'><div class='row'><span style='font-weight:bold;font-size:18pt;' >" + desc + "</span><br><div class='large-4 large-offset-2 small-offset-2 small-4 columns'><span class='label'>quantity:</span><br><input class='qty' data-sku-qty=' " + sku + "' value='" + qty + "' min='1' max='"+ stock + "' step='1' type='number'></div><div class='large-4 large-offset-2 small-offset-2 small-4 columns'><span class='label'>price:</span><br><span >$</span><span class='showsubtotal' data-price-sku='" + sku + "'>" + subtotal + "</span></div><div class='row '><div class = ' large-10 small-10 large-offset-2 small-offset-2 columns'><input class='removeitem' type='button' data-remove-button='remove' value='remove item' data-item-sku='" + sku + "' data-item-qty='" + qty +" data-item-date = '" + aDate.getTime() +"' /></div></div></div></li>";
                                        
                                        shoppingCartList.append(item);
                                        changeqty();

                                        var cartData = sessionStorage.getObject('autosave', 'save');

                                        if(cartData == null ) {
                                            return;
                                        }

                                        var item = {'sku': sku, 'qty': qty, date: aDate.getTime(), 'desc': desc, 'price': price, 'stock':stock};
                                        cartData['items'].push(item);
                                      
                                        sessionStorage.setObject('autosave', cartData);
                                        
                                        var alltotals = [];

                                        for(var x = 0; x < cartData['items'].length; x++){
                                            
                                             var itemsubtotal = parseFloat(Math.round((cartData['items'][x].qty * cartData['items'][x].price) * 100) / 100).toFixed(2);

                                            alltotals.push(parseFloat(itemsubtotal));


                                        };
                                        function add(a, b) {
                                                return a + b;
                                            }

                                        var sum = alltotals.reduce(add, 0);
                                        var totalspace = document.getElementById('totalsp');
                                        totalsp.innerHTML = sum.toFixed(2);



                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        console.log(jqXHR.statusText, textStatus);
                                    }
                                });
                                
                                sessionStorage.cartstarted = 'true';
                              
                        } else {
                          
                       
                        var clickeditem = this;
                            
                        var sku = this.getAttribute("data-sku-add");
                        var qty = 1;
                        var price = $("span[data-sku-price='" + sku + "']").text();
                        var desc = $("p[data-sku-name='" + sku + "']").text();
                        var subtotal = parseFloat(Math.round((qty * price) * 100) / 100).toFixed(2);
                        var stock = this.getAttribute("data-stock");
                        var shoppingCartList = $("#shoppingCart");
                        
                        var cartData = sessionStorage.getObject('autosave', 'save');
                        var cartDataItems = cartData.items;

                               
                        var aDate = new Date();


                        var item = "<li data-item-sku='" + sku + "' data-item-qty='" + qty + "' data-item-date='"  + aDate.getTime() + "' data-item-total='" + subtotal + "' data-item-stock = '" + stock + "'><div class='row'><span style='font-weight:bold;font-size:18pt;' >" + desc + "</span><br><div class='large-4 large-offset-2 small-offset-2 small-4 columns'><span class='label'>quantity:</span><br><input class='qty' data-sku-qty=' " + sku + "' value='" + qty + "' min='1' max='"+ stock + "' step='1' type='number'></div><div class='large-4 large-offset-2 small-offset-2 small-4 columns'><span class='label'>price:</span><br><span >$</span><span class='showsubtotal' data-price-sku='" + sku + "'>" + subtotal + "</span></div><div class='row '><div class = ' large-10 small-10 large-offset-2 small-offset-2 columns'><input class='removeitem' type='button' data-remove-button='remove' value='remove item' data-item-sku='" + sku + "' data-item-qty='" + qty +" data-item-date = '" + aDate.getTime() +"' /></div></div></div></li>";
            
            
                                        
                        shoppingCartList.append(item);
                        changeqty();

                        var cartData = sessionStorage.getObject('autosave', 'save');
                        
                        if(cartData == null ) {
                            return;
                        }

                        
                        var item = {'sku': sku, 'qty': qty, date: aDate.getTime(), 'desc': desc, 'price': price, 'stock':stock};
                        cartData['items'].push(item);
                        sessionStorage.setObject('autosave', cartData);
                        console.log('sesssto', sessionStorage);
                            
                            var alltotals = [];

                            
                            for(var x = 0; x < cartData['items'].length; x++){

                                 var itemsubtotal = parseFloat(Math.round((cartData['items'][x].qty * cartData['items'][x].price) * 100) / 100).toFixed(2);

                                alltotals.push(parseFloat(itemsubtotal));


                            };
                             function add(a, b) {
                                    return a + b;
                                }
                            var sum = alltotals.reduce(add, 0);

                            var totalspace = document.getElementById('totalsp');
                            totalsp.innerHTML = sum.toFixed(2);


                        };
                        
                    };    
                };

            };

            // remove items from the cart
            $("#shoppingCart").on("click", "input[type='button']", function() {
               
                var thisInputSKU = this.getAttribute('data-item-sku');
                var thisInputQty = this.getAttribute('data-item-qty');
                var thisInputDate = this.getAttribute('data-item-date');
                var thisInputDate = this.getAttribute('data-item-date');

                var cartData = sessionStorage.getObject('autosave');
               
                if(cartData == null) {
                    return;
                }
                var cartDataItems = cartData['items'];
                for(var i = 0; i < cartDataItems.length; i++) {
                    var item = cartDataItems[i];
                   
                    if(item['sku'] == thisInputSKU) {
                        // remove from web storage
                        cartDataItems.splice(i, 1);
                       
                    }
                }
                cartData['items'] = cartDataItems;
                
             
                sessionStorage.setObject('autosave', cartData);

                this.closest("li").remove();
                var addbuttons = document.querySelectorAll('.add');
                
                
                for(var i = 0; i < addbuttons.length; i++){
                    
                    if(addbuttons[i].getAttribute('data-sku-add') == thisInputSKU){
                        
                        addbuttons[i].disabled = false;
                        addbuttons[i].value = '+ add to cart';
                        
                    }
                };
                
                //update total
                
               var alltotals = [];

                 

                    for(var x = 0; x < cartData['items'].length; x++){

                         var itemsubtotal = parseFloat(Math.round((cartData['items'][x].qty * cartData['items'][x].price) * 100) / 100).toFixed(2);

                        alltotals.push(parseFloat(itemsubtotal));


                    };
                    function add(a, b) {
                            return a + b;
                        }

                    var sum = alltotals.reduce(add, 0);


                    var totalspace = document.getElementById('totalsp');
                    totalsp.innerHTML = sum.toFixed(2);
               

            });


            // start the cart
            
            function startcart(){
                
                $("#startCart").click(function() {
                    console.log("Start cart.");
                    $.ajax({
                        url: "./shoppingcart.php",
                        type: "POST",
                        dataType: 'json',
                        data: {action: "startcart"},
                        success: function(returnedData) {
                           
                            sessionStorage.setObject('autosave', {items: []});


                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(jqXHR.statusText, textStatus);
                        }
                    });
                });
                
                
                
            };
            


            // cancel the cart
            $("#clear").click(function() {

                console.log("End cart.");
                $.ajax({
                    url: "./cont/cart.php",
                    type: "POST",
                    dataType: 'json',
                    data: {action: "cancelcart"},
                    success: function(returnedData) {
                       
                        sessionStorage.clear();

                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.statusText, textStatus);
                    }
                });
                var shoppingCartList = $("#shoppingCart").html("");
            });

            // checkout the cart
            $("#checkoutcart").click(function() {

                // retrieve all of the items from the cart:
                var items = $("#shoppingCart li");
                var itemArray = [];
                var totals = [];
                cartstarted = false;
               
                $.each(items, function(key, value) {
                    
                    var stock = value.getAttribute("data-item-stock");
                    var qty = value.getAttribute("data-item-qty");
                    
                    stock = parseFloat(stock);
                    qty = parseFloat(qty);
                   
                    stock = stock - qty;
                    
                    var item = {sku: value.getAttribute("data-item-sku"),
                        qty: qty, stock:stock};
                    itemArray.push(item);
                    
                    var total = value.getAttribute('data-item-total');
                    total = parseFloat(total);
                   
                    totals.push(total);
                    
                    
                });
                var itemsAsJSON = JSON.stringify(itemArray);
              
                
                totals = totals.reduce(add, 0);
                

                function add(a, b) {
                    return a + b;
                }

                
                $.ajax({
                    url: "./cont/cart.php",
                    type: "POST",
                    dataType: 'json',
                    data: {action: "checkoutcart", items: itemsAsJSON, total: totals},
                    success: function(returnedData) {
                       sessionStorage.clear();
                        window.location = './thankyou.php';

                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.statusText, textStatus);
                    }
                });
                var shoppingCartList = $("#shoppingCart").html("");

            });
           
 }); 
            
