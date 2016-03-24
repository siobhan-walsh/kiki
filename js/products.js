
        $(document).ready(function() {
            
            //index of for objects in arrays
            function arrayObjectIndexOf(myArray, searchTerm, property) {
                for(var i = 0, len = myArray.length; i < len; i++) {
                    if (myArray[i][property] === searchTerm) return i;
                }
                return -1;
            }
           
            //click to expand cart
            var tog = false;
            $('#arrow').click(function(){

                
                if(tog == false){
                    
                   $('#cart').stop(true).animate(
                            {

                                width:'50%',
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
            
            ///// function to change qty:
                    
            function changeqty(){

                var numinps = document.querySelectorAll('input[type="number"]');

                function changenums(i){
                    return function(){

                        var changedinp = this;
                        var quan = parseFloat(changedinp.value);
                        
                        console.log('quan is', quan);

                        var cartData = sessionStorage.getObject('autosave', 'save');
                        
                        console.log('cartdata is', cartData);


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

                        for(var x = 0; x < listeditems.length; x++){

                            var listeditemsku = listeditems[x].getAttribute("data-price-sku");

                            if(listeditemsku == thisSku ){
                              listeditems[x].innerHTML = subtotal;

                            }
                        };


                    };
                };

                for (var i = 0; i < numinps.length; i++){

                    numinps[i].addEventListener("change", changenums(i));

                };

            };

            Storage.prototype.setObject = function(key, value) {
                
                this.setItem(key, JSON.stringify(value));
             
            }

            Storage.prototype.getObject = function(key) {
                
                var value = this.getItem(key);
                return value && JSON.parse(value);
            }
            
            
            var items = [];
            var cartstarted = false;
            
            
            function loadProducts() {
                $.ajax({
                    url: "./cont/products.php",
                    type: "POST",
                    dataType: 'HTML',
                    data:{forpage:'menu'},
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

            loadProducts();
            
            function loadShoppingCartItems() {

                var cartData = sessionStorage.getObject('autosave');


                // if nothing added leave function
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
                        + aDate.getTime() + "' data-item-total='" + subtotal + "' data-item-stock = '" + stock + "'><div class='row'><span style='font-weight:bold;font-size:18pt;' >" + desc + "</span><br><div class='large-4 large-offset-2 small-offset-2 small-4 columns'><span class='label'>quantity:</span><br><input class='qty' data-sku-qty=' " + sku + "' value='" + qty + "' min='1' max='5' step='1' type='number'></div><div class='large-4 large-offset-2 small-offset-2 small-4 columns'><span class='label'>price:</span><br><span >$</span><span class='showsubtotal' data-price-sku='" + sku + "'>" + subtotal + "</span></div><div class='row '><div class = ' large-10 small-10 large-offset-2 small-offset-2 columns'><input class='removeitem' type='button' data-remove-button='remove' value='remove item' data-item-sku='" + sku + "' data-item-qty='" + qty +" data-item-date = '" + aDate.getTime() +"' /></div></div></div></li>";
                    
                    
            
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
                    
                    changeqty();
                   
                    
                }
                console.log('cart items array', cartDataItems);
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
                            
                            console.log('start that cart');
                           
                                $.ajax({
                                    url: "./cont/cart.php",
                                    type: "POST",
                                    dataType: 'json',
                                    data: {action: "startcart"},
                                    success: function(returnedData) {
                                        console.log("cart start response: ", returnedData);

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
                        + aDate.getTime() + "' data-item-total='" + subtotal + "' data-item-stock = '" + stock + "'><div class='row'><span style='font-weight:bold;font-size:18pt;' >" + desc + "</span><br><div class='large-4 large-offset-2 small-offset-2 small-4 columns'><span class='label'>quantity:</span><br><input class='qty' data-sku-qty=' " + sku + "' value='" + qty + "' min='1' max='5' step='1' type='number'></div><div class='large-4 large-offset-2 small-offset-2 small-4 columns'><span class='label'>price:</span><br><span >$</span><span class='showsubtotal' data-price-sku='" + sku + "'>" + subtotal + "</span></div><div class='row '><div class = ' large-10 small-10 large-offset-2 small-offset-2 columns'><input class='removeitem' type='button' data-remove-button='remove' value='remove item' data-item-sku='" + sku + "' data-item-qty='" + qty +" data-item-date = '" + aDate.getTime() +"' /></div></div></div></li>";
                                        
                                        shoppingCartList.append(item);
                                        changeqty();


                                        // SESSION STORAGE - SAVE SKU AND QTY AS AN OBJECT IN THE
                                        // ARRAY INSIDE OF THE AUTOSAVE OBJECT


                                        var cartData = sessionStorage.getObject('autosave', 'save');

                                        console.log('ses', sessionStorage.getObject('autosave', 'save'));

                                        if(cartData == null ) {
                                            return;
                                        }

                                        var item = {'sku': sku, 'qty': qty, date: aDate.getTime(), 'desc': desc, 'price': price, 'stock':stock};
                                        cartData['items'].push(item);
                                        // clobber the old value
                                        sessionStorage.setObject('autosave', cartData);
                                        console.log('sesssto', sessionStorage);
                                        



                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        console.log(jqXHR.statusText, textStatus);
                                    }
                                });
                                
                                sessionStorage.cartstarted = 'true';
                              
                        } else {
                          
                        // get the sku
                        var clickeditem = this;
                            
                        var sku = this.getAttribute("data-sku-add");
                        var qty = 1;
                        var price = $("span[data-sku-price='" + sku + "']").text();
                        var desc = $("p[data-sku-name='" + sku + "']").text();
                        var subtotal = parseFloat(Math.round((qty * price) * 100) / 100).toFixed(2);
                        console.log(desc, "quantity", qty, "price", price);
                            var stock = this.getAttribute("data-stock");
                        var shoppingCartList = $("#shoppingCart");
                            
                           
                            
                         var cartData = sessionStorage.getObject('autosave', 'save');
                            var cartDataItems = cartData.items;

                               
                                        var aDate = new Date();
                                     

                                        var item = "<li data-item-sku='" + sku + "' data-item-qty='" + qty + "' data-item-date='"
                        + aDate.getTime() + "' data-item-total='" + subtotal + "' data-item-stock = '" + stock + "'><div class='row'><span style='font-weight:bold;font-size:18pt;' >" + desc + "</span><br><div class='large-4 large-offset-2 small-offset-2 small-4 columns'><span class='label'>quantity:</span><br><input class='qty' data-sku-qty=' " + sku + "' value='" + qty + "' min='1' max='5' step='1' type='number'></div><div class='large-4 large-offset-2 small-offset-2 small-4 columns'><span class='label'>price:</span><br><span >$</span><span class='showsubtotal' data-price-sku='" + sku + "'>" + subtotal + "</span></div><div class='row '><div class = ' large-10 small-10 large-offset-2 small-offset-2 columns'><input class='removeitem' type='button' data-remove-button='remove' value='remove item' data-item-sku='" + sku + "' data-item-qty='" + qty +" data-item-date = '" + aDate.getTime() +"' /></div></div></div></li>";
            
            
                                        
                        shoppingCartList.append(item);
                            changeqty();


                        // SESSION STORAGE - SAVE SKU AND QTY AS AN OBJECT IN THE
                        // ARRAY INSIDE OF THE AUTOSAVE OBJECT

                        //sessionStorage.setObject('autosave', 'none');
                        
                        var cartData = sessionStorage.getObject('autosave', 'save');
                        
                        console.log('ses', sessionStorage.getObject('autosave', 'save'));
                        
                        if(cartData == null ) {
                            return;
                        }

                        console.log('cart data', cartData);
                        
                        var item = {'sku': sku, 'qty': qty, date: aDate.getTime(), 'desc': desc, 'price': price, 'stock':stock};
                        cartData['items'].push(item);
                        // clobber the old value
                        sessionStorage.setObject('autosave', cartData);
                        console.log('sesssto', sessionStorage);


                        };
                        
                    };    
                };

            };

            // remove items from the cart
            $("#shoppingCart").on("click", "input[type='button']", function() {
                // https://api.jquery.com/closest/

                // WEB STORAGE REMOVE
                var thisInputSKU = this.getAttribute('data-item-sku');
                var thisInputQty = this.getAttribute('data-item-qty');
                var thisInputDate = this.getAttribute('data-item-date');

                var cartData = sessionStorage.getObject('autosave');
               
                if(cartData == null) {
                    return;
                }
                var cartDataItems = cartData['items'];
                for(var i = 0; i < cartDataItems.length; i++) {
                    var item = cartDataItems[i];
                    // get the item based on the sku, qty, and date
                    if(item['sku'] == thisInputSKU) {
                        // remove from web storage
                        cartDataItems.splice(i, 1);
                       
                    }
                }
                cartData['items'] = cartDataItems;
                
                // clobber the old value
                sessionStorage.setObject('autosave', cartData);

                this.closest("li").remove();
                var addbuttons = document.querySelectorAll('.add');
                
                
                for(var i = 0; i < addbuttons.length; i++){
                    
                    if(addbuttons[i].getAttribute('data-sku-add') == thisInputSKU){
                        
                        addbuttons[i].disabled = false;
                        addbuttons[i].value = '+ add to cart';
                        
                    }
                };
                

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
                            console.log("cart start response: ", returnedData);

                            // WEB STORAGE - SESSION STORAGE
                            //var sessionID = returnedData['s_id'];
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
                        console.log("cart cancel response: ", returnedData);


                        // SESSION STORAGE - CLEAR THE SESSION
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
                
                console.log('chekcout', items);
                $.each(items, function(key, value) {
                    
                    var stock = value.getAttribute("data-item-stock");
                    var qty = value.getAttribute("data-item-qty");
                    
                    stock = parseFloat(stock);
                    qty = parseFloat(qty);
                    console.log('stock is', stock);
                    console.log('qty is', qty)
                    
                    stock = stock - qty;
                    console.log('stock is', stock);

                    var item = {sku: value.getAttribute("data-item-sku"),
                        qty: qty, stock:stock};
                    itemArray.push(item);
                    
                    var total = value.getAttribute('data-item-total');
                    total = parseFloat(total);
                    console.log('total is', total);
                    
                    totals.push(total);
                    
                    
                });
                var itemsAsJSON = JSON.stringify(itemArray);
                console.log("itemsAsJSON", itemsAsJSON);
                console.log('so the total is', totals); 
                
                totals = totals.reduce(add, 0);
                

                function add(a, b) {
                    return a + b;
                }

                console.log('so the total is', totals); 

                console.log("Check out cart with the following items", itemArray);
                $.ajax({
                    url: "./cont/cart.php",
                    type: "POST",
                    dataType: 'json',
                    data: {action: "checkoutcart", items: itemsAsJSON, total: totals},
                    success: function(returnedData) {
                        console.log("cart check out response: ", returnedData);
                        
                        sessionStorage.setObject('autosave', {items: []});
                       // window.location = './thankyou.php';

                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.statusText, textStatus);
                    }
                });
                var shoppingCartList = $("#shoppingCart").html("");

            });
           
 }); 
            
    ///////        
            

            
     /*       
           
            function addtocart() {
                
                var spans = document.querySelectorAll('.add');
                
                console.log(spans[0].getAttribute('data-sku'));
                
                for(var i = 0; i< spans.length; i++){
                    
                    spans[i].addEventListener('click', adding(i));
                    
                }
                
                function adding(i){
                    return function(){
                        
                        console.log('hihi', this.getAttribute('data-sku'));
                        
                        var sku = this.getAttribute('data-sku');
                        var name = this.getAttribute('data-pname');
                        var cart = document.getElementById('itemarea');
                        var qty = document.createElement('select');
                        
                        qty.dataset.sku = sku;

                        
                        console.log('qty dta', qty.dataset.sku );
                       
                        var o1 = document.createElement('option');
                        var o2 = document.createElement('option');
                        var o3 = document.createElement('option');
                        var o4 = document.createElement('option');
                        
                        var crow = document.createElement('div');
                        crow.className = 'crow';
                        
                        o1.value = '1';
                        o2.value = '2';
                        o3.value = '3';
                        o4.value = '4';
                        
                        o1.innerHTML = '1';
                        o2.innerHTML = '2';
                        o3.innerHTML = '3';
                        o4.innerHTML = '4';
                        
                        qty.className = 'qty';
                        //qty.data('sku', sku);
                        
                        
                        
                        items.push(
                            {
                                sku:sku,
                                qty:1
                            }
                        );
                        
                        this.innerHTML = 'added';
                        
                        console.log('items', items);
                        
                        var p = document.createElement('span');
                        p.innerHTML = name;
                        p.className = 'menu-title';
                        
                        qty.appendChild(o1);
                        qty.appendChild(o2);
                        qty.appendChild(o3);
                        qty.appendChild(o4);
                        
                        crow.appendChild(p);
                        
                        crow.appendChild(qty);
                        cart.appendChild(crow);
                        
                        
                        if(cartstarted == true){
                            
                            //add new item to cart
                            
                            console.log('add that thing to cart', sku);
                            /*
                            $.ajax({
                                url: "./cont/products.php",
                                type: "POST",
                                data: {
                                    sku:thesku
                                },
                                dataType: 'JSON',
                                success: function(resp) {
                                    console.log("addtocart ", resp);

                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    console.log(jqXHR.statusText, textStatus);
                            }
                            });
                           //
                        } else {
                            
                            //start the new cart, and add the clicked item
                            
                             //start cart 
                        
                             $.ajax({
                                url: "./cont/cart.php",
                                type: "POST",
                                data: {
                                    action:'startcart'
                                },
                                dataType: 'JSON',
                                success: function(resp) {
                                    console.log("resp ", resp);
                                    cartstarted = true;
                                    console.log('cartstarted', cartstarted);
                                    
                                    


                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    console.log(jqXHR.statusText, textStatus);
                                }
                            });

                            };
                  
                        
                    }
                }
                
          
            }
            
            
            //checking out man woaaaaah
            
            
            
              
                var checkoutbtn = document.getElementById('checkout');
            
                var clearbtn = document.getElementById('clear');
                
                
                    checkoutbtn.onclick = function(){

                        //do the checkout stuff!
                        
                            //cycle through, get qty value, save info in local storage
                        
                            var qtyselectors = document.querySelectorAll('select');
                        
                            console.log('select val', qtyselectors[0].value);
                            console.log('skuuu', qtyselectors[0].dataset.sku);
                        
                                //check to see if that skuuu is in the items array
                        
                        
                            //send items through ajax to db
                            //for each product insert cart_id, product_id, qty INTO cart_product
                            //update status of cart to completed
                            //update qty in products
                        
                        console.log('buy the things');

                    };
            
                clearbtn.onclick = function(){

                        //clear the cart
                        console.log('clear the things');

                    };
                
           
            
            
             function objectSize(the_object) {
				 /* function to validate the existence of each key in the object to get the number of valid keys. 
					  var object_size = 0;
					  for (key in the_object){
						if (the_object.hasOwnProperty(key)) {
						  object_size++;
						}
					  }
					  return object_size;
				};
         
        });
*/