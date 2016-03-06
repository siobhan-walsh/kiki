
        $(document).ready(function() {

            //
            
            Storage.prototype.setObject = function(key, value) {
                this.setItem(key, JSON.stringify(value));
             
            }

            Storage.prototype.getObject = function(key) {
                var value = this.getItem(key);
                return value && JSON.parse(value);
            }
            
            
            var items = [];
            var cartstarted = false;
            
            console.log('cartstarted', cartstarted);
            
            function loadProducts() {
                $.ajax({
                    url: "./cont/products.php",
                    type: "POST",
                    dataType: 'HTML',
                    success: function(presp) {
                        //console.log("cart checkout response: ", presp);
                        $("#listitems").html(presp);
                        $("#whitebox").fadeIn('slow');
                        
                        addtocart();
                        
              
                        
                                
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.statusText, textStatus);
                    }
                });
            }

            loadProducts();

//////
            
            function loadShoppingCartItems() {

                var cartData = sessionStorage.getObject('autosave');

                // if nothing added leave function
                if(cartData == null) {
                    return;
                }
                var cartDataItems = cartData['items'];
                var shoppingCartList = $("#itemarea");


                for(var i = 0; i < cartDataItems.length; i++) {
                    var item = cartDataItems[i];
                    // sku, qty, date
                    var sku = item['sku'];
                    var qty = item['qty'];
                    var date = item['date'];
                    var price = item['price'];
                    var desc = item['desc'];
                    var subtotal = parseFloat(Math.round((qty * price) * 100) / 100).toFixed(2);

                    var item = "<li data-item-sku='" + sku + "' data-item-qty='" + qty + "' data-item-date='"
                        + date + "'>" + desc + " " + qty + " x $" + price + " = " + subtotal
                        + " <input type='button' data-remove-button='remove' value='X'/></li>";
                    shoppingCartList.append(item);


                }
                console.log('cart items array, added', cartDataItems);
            }
            
            loadShoppingCartItems();
            
            function addtocart(){
                
                $('#add').on('click', $(this).data('data-sku-add'), function() {

                        console.log(this.getAttribute("data-sku-add"));

                // get the sku
                var sku = this.getAttribute("data-sku-add");
                var qty = $("input[data-sku-qty='" + sku + "']").val();
                var price = $("p[data-sku-price='" + sku + "']").text();
                var desc = $("div[data-sku-desc='" + sku + "']").text();
                var subtotal = parseFloat(Math.round((qty * price) * 100) / 100).toFixed(2);
                console.log(desc, "quantity", qty, "price", price);

                var shoppingCartList = $("#shoppingCart");


                // ALTERED FOR WEB STORAGE
                var aDate = new Date();
                var item = "<li data-item-sku='" + sku + "' data-item-qty='" + qty + "' data-item-date='"
                    + aDate.getTime() + "'>" + desc + " " + qty + " x $" + price + " = " + subtotal
                    + " <input type='button' data-remove-button='remove' value='X'/></li>";
                shoppingCartList.append(item);


                // SESSION STORAGE - SAVE SKU AND QTY AS AN OBJECT IN THE
                // ARRAY INSIDE OF THE AUTOSAVE OBJECT
                var cartData = sessionStorage.getObject('autosave');
                if(cartData == null) {
                    return;
                }
                var item = {'sku': sku, 'qty': qty, date: aDate.getTime(), 'desc': desc, 'price': price};
                cartData['items'].push(item);
                // clobber the old value
                sessionStorage.setObject('autosave', cartData);
                console.log('sesssto', sessionStorage.setObject('autosave'));

            });
                
            };

            // remove items from the cart
            $("#shoppingCart").on("click", "input", function() {
                // https://api.jquery.com/closest/



                // WEB STORAGE REMOVE
                var thisInputSKU = this.parentNode.getAttribute('data-item-sku');
                var thisInputQty = this.parentNode.getAttribute('data-item-qty');
                var thisInputDate = this.parentNode.getAttribute('data-item-date');

                var cartData = sessionStorage.getObject('autosave');
                if(cartData == null) {
                    return;
                }
                var cartDataItems = cartData['items'];
                for(var i = 0; i < cartDataItems.length; i++) {
                    var item = cartDataItems[i];
                    // get the item based on the sku, qty, and date
                    if(item['sku'] == thisInputSKU && item['date'] == thisInputDate) {
                        // remove from web storage
                        cartDataItems.splice(i, 1);

                    }
                }
                cartData['items'] = cartDataItems;
                console.log('cart data stuff', cartData);
                // clobber the old value
                sessionStorage.setObject('autosave', cartData);

                this.closest("li").remove();

            });


            // start the cart
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


            // cancel the cart
            $("#cancelCart").click(function() {

                console.log("End cart.");
                $.ajax({
                    url: "./shoppingcart.php",
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

            // cancel the cart
            $("#checkoutcart").click(function() {

                // retrieve all of the items from the cart:
                var items = $("#shoppingCart li");
                var itemArray = [];
                $.each(items, function(key, value) {

                    var item = {sku: value.getAttribute("data-item-sku"),
                        qty: value.getAttribute("data-item-qty")};
                    itemArray.push(item);
                });
                var itemsAsJSON = JSON.stringify(itemArray);
                console.log("itemsAsJSON", itemsAsJSON);


                console.log("Check out cart with the following items", itemArray);
                $.ajax({
                    url: "./shoppingcart.php",
                    type: "POST",
                    dataType: 'json',
                    data: {action: "checkoutcart", items: itemsAsJSON},
                    success: function(returnedData) {
                        console.log("cart check out response: ", returnedData);

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