
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
                        
                        items.push(sku);
                        
                        this.innerHTML = 'added';
                        
                        console.log('items', items);
                        
                        var p = document.createElement('p');
                        p.innerHTML = name;
                        p.className = 'menu-title';
                        
                        cart.appendChild(p);
                        
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