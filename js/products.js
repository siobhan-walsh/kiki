
        $(document).ready(function() {

            //cart move out on hover
            var tog = false;
            $('#cart').hover(function(){
                
                console.log('oh hey hovererer');
                
                console.log('tog is', tog);
                
                if(tog == false){
                    
                    $('#cart').stop(true).animate(
                            {

                                width:'50%',
                                opacity:1
                            }, 1000, function(){

                            }
                    );
                    
                    tog = true;
                
                } else if(tog == true){
                    
                    console.log('go back');
                    $('#cart').stop(true).animate(
                            {

                                width:'30%',
                                opacity:1
                            }, 1000, function(){

                            }
                    );
                    tog = false;
                }
                
            });
            
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
                var shoppingCartList = $("#shoppingCart");


                for(var i = 0; i < cartDataItems.length; i++) {
                    
                    
                    var item = cartDataItems[i];
                    // sku, qty, date
                    var sku = item['sku'];
                    var qty = item['qty'];
                    var date = item['date'];
                    var price = item['price'];
                    var desc = item['desc'];
                    var subtotal = parseFloat(Math.round((qty * price) * 100) / 100).toFixed(2);
                    
                    var alreadythere = cartDataItems.indexOf(item);
                    
                    if(alreadythere != -1){
                        
                        
                    }
                    var aDate = new Date();
                    
                    //figuring out the structure for how items appear in cart here first, then move to other functions.
                    //make quantity input value change session upon change of number
                    //check to make sure remove button works
                    
                    var item = "<li data-item-sku='" + sku + "' data-item-qty='" + qty + "' data-item-date='"
                        + aDate.getTime() + "'><div class='row'><span style='font-weight:bold;font-size:18pt;' >" + desc + "</span><br><div class='large-4 large-offset-2 small-offset-2 small-4 columns'><span class='label'>quantity:</span><br><input class='qty' data-sku-qty=' " + sku + "' value='" + qty + "' min='1' max='5' step='1' type='number'></div><div class='large-4 large-offset-2 small-offset-2 small-4 columns'><span class='label'>price:</span><br><span >$ " + subtotal + "</span></div><div class='row '><div class = ' large-10 small-10 large-offset-2 small-offset-2 columns'><input class='removeitem' type='button' data-remove-button='remove' value='remove item'/></div></div></div></li>";
            
                    shoppingCartList.append(item);


                }
                console.log('cart items array, added', cartDataItems);
            }
            
            loadShoppingCartItems();
            
            function addtocart(){
                
                var adds = document.querySelectorAll('.add');
                
                
                for(var i = 0; i < adds.length; i++){
                    adds[i].addEventListener('click', adding(i));
                };
                
                function adding(i){
                    return function(){
                   
                        var clickeditem = this;
                        
                        if(sessionStorage.cartstarted != 'true'){
                            
                            console.log('start that cart');
                           
                                $.ajax({
                                    url: "./cont/cart.php",
                                    type: "POST",
                                    dataType: 'json',
                                    data: {action: "startcart"},
                                    success: function(returnedData) {
                                        console.log("cart start response: ", returnedData);

                                        // WEB STORAGE - SESSION STORAGE
                                        //var sessionID = returnedData['s_id'];
                                        sessionStorage.setObject('autosave', {items: []});
                                        
                                        
                                        
                                        console.log(clickeditem.getAttribute("data-sku-add"));

                                        // get the sku
                                        var sku = clickeditem.getAttribute("data-sku-add");
                                        var qty = 1;
                                        var price = $("span[data-sku-price='" + sku + "']").text();
                                        var desc = $("p[data-sku-name='" + sku + "']").text();
                                        var subtotal = parseFloat(Math.round((qty * price) * 100) / 100).toFixed(2);
                                        console.log(desc, "quantity", qty, "price", price);

                                        var shoppingCartList = $("#shoppingCart");
                                        

                                        // ALTERED FOR WEB STORAGE
                                        var aDate = new Date();
                                        var item = "<li data-item-sku='" + sku + "' data-item-qty='" + qty + "' data-item-date='"
                                            + aDate.getTime() + "'><span style='font-weight:bold;' >" + desc + "</span><span> x" + qty + "  </span><span style='float:right'>$ " + subtotal
                                            + "</span <input type='button' data-remove-button='remove' value='X'/></li>";
                                        
                                        
                                        
                                        shoppingCartList.append(item);


                                        // SESSION STORAGE - SAVE SKU AND QTY AS AN OBJECT IN THE
                                        // ARRAY INSIDE OF THE AUTOSAVE OBJECT

                                        //sessionStorage.setObject('autosave', 'none');

                                        var cartData = sessionStorage.getObject('autosave', 'save');

                                        console.log('ses', sessionStorage.getObject('autosave', 'save'));

                                        if(cartData == null ) {
                                            return;
                                        }

                                        console.log('cart data', cartData);

                                        var item = {'sku': sku, 'qty': qty, date: aDate.getTime(), 'desc': desc, 'price': price};
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
                                console.log('what waht', sessionStorage.cartstarted);
                        } else {
                            
                            
                            function arrayObjectIndexOf(myArray, searchTerm, property) {
                                for(var i = 0, len = myArray.length; i < len; i++) {
                                    if (myArray[i][property] === searchTerm) return i;
                                }
                                return -1;
                            }
                           // arrayObjectIndexOf(cartDataItems, sku, "sku"); // 1
                        
                 
                

                        console.log(this.getAttribute("data-sku-add"));

                        // get the sku
                        var clickeditem = this;
                            
                        var sku = this.getAttribute("data-sku-add");
                        var qty = 1;
                        var price = $("span[data-sku-price='" + sku + "']").text();
                        var desc = $("p[data-sku-name='" + sku + "']").text();
                        var subtotal = parseFloat(Math.round((qty * price) * 100) / 100).toFixed(2);
                        console.log(desc, "quantity", qty, "price", price);

                        var shoppingCartList = $("#shoppingCart");
                            
                           
                            
                         var cartData = sessionStorage.getObject('autosave', 'save');
                            var cartDataItems = cartData.items;
                            
                            for(var i = 0; i < cartDataItems.length; i++) {
                                var item = cartDataItems[i];
                                
                                console.log('cartData2 is', cartData);
                                console.log('cartData2 item', item);
                            
                                var test =  arrayObjectIndexOf(cartDataItems, sku, "sku"); // 1
                                console.log("test is", test);
                                console.log("sku is", sku);

                                if(test != -1 && sku == cartDataItems[i].sku){

                                    console.log('2 that thing is already in the cart qty is', cartDataItems[i].qty);
                                    var quan = parseFloat(item.qty);
                                    var addedqty = parseFloat(qty);
                                    quan = quan + addedqty; 
                                    console.log('noowow quan is', quan);
                                    
                                    var cartData = sessionStorage.getObject('autosave', 'save');
                                  
                                    console.log('ses', cartData);
                                    
                                   

                                    if(cartData == null ) {
                                        return;
                                    }

                                    console.log('cart data', cartData);
                                    
                                     cartData.items[i].qty = quan;
                                    console.log('quan is', quan);
                                    
                                    console.log('cardataitems qty', cartData.items[i].qty);

                                  
                                    sessionStorage.setObject('autosave', cartData);
                                    console.log('sesssto', sessionStorage);
                                    
                                    console.log('this is this right', clickeditem);
                                     var updateqty = $("#shoppingCart li[data-sku-qty='" + sku + "']");
                                    console.log('updateqty is', updateqty);
                                    
                                    
                                    
                                    var listeditems = document.querySelectorAll("#shoppingCart li");
                                    
                                    for(var i = 0; i < listeditems.length; i++){
                                        console.log('thing', listeditems[i].getAttribute("data-item-sku"));
                                        console.log('thing sku', sku);
                                        var listeditemsku = listeditems[i].getAttribute("data-item-sku");
                                        
                                        if(listeditemsku == sku ){
                                            
                                        //update the html for the quantity... will have to put qty in a span element in th code for addingitems in cart
                                            listeditems[i].innerHTML = 'yooo';
                                        
                                        }
                                    }
                                    
                                   return;

                                    };
                                    
                                   
                                }
                          

                        // ALTERED FOR WEB STORAGE
                        var aDate = new Date();
                        var item = "<li class='cartlist' data-item-sku='" + sku + "' data-item-qty='" + qty + "' data-item-date='"
                            + aDate.getTime() + "'><span style='font-weight:bold;float:left;' >" + desc + "</span><span> x" + qty + "  </span><span style='float:right'>$ " + subtotal
                            + "</span <input type='button' data-remove-button='remove' value='X'/></li>";
                        shoppingCartList.append(item);


                        // SESSION STORAGE - SAVE SKU AND QTY AS AN OBJECT IN THE
                        // ARRAY INSIDE OF THE AUTOSAVE OBJECT

                        //sessionStorage.setObject('autosave', 'none');
                        
                        var cartData = sessionStorage.getObject('autosave', 'save');
                        
                        console.log('ses', sessionStorage.getObject('autosave', 'save'));
                        
                        if(cartData == null ) {
                            return;
                        }

                        console.log('cart data', cartData);
                        
                        var item = {'sku': sku, 'qty': qty, date: aDate.getTime(), 'desc': desc, 'price': price};
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