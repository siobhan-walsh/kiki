
        $(document).ready(function() {

            //
            
            var items = [];
            var cartstarted = false;
            
            console.log('cartstarted', cartstarted);
            
            function loadProducts() {
                $.ajax({
                    url: "./cont/products.php",
                    type: "POST",
                    dataType: 'html',
                    success: function(returnedData) {
                       // console.log("cart checkout response: ", returnedData);
                        $("#listitems").html(returnedData);
                        
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
                        
                        var thesku = this.getAttribute('data-sku');
                        
                        items.push(thesku);
                        
                        this.innerHTML = 'added';
                        
                        console.log('items', items);
                        
                        if(cartstarted == true){
                            
                            //add new item to cart
                            
                            console.log('add that thing to cart', thesku);
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
                
               // console.log(spans[0].getAttribute(data-sku));
              /*
               
                
                */
            }
         
        });