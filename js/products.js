
        $(document).ready(function() {

            //
            
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
                        var cart = document.getElementById('cart');
                        
                        var qty = document.createElement('select');
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
                        
                        
                        
                        items.push(sku);
                        
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
                            */
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
            
            
             function objectSize(the_object) {
				 /* function to validate the existence of each key in the object to get the number of valid keys. */
					  var object_size = 0;
					  for (key in the_object){
						if (the_object.hasOwnProperty(key)) {
						  object_size++;
						}
					  }
					  return object_size;
				};
         
        });