
        $(document).ready(function() {

            //
            function loadProducts() {
                $.ajax({
                    url: "./cont/products.php",
                    type: "POST",
                    dataType: 'html',
                    success: function(returnedData) {
                       // console.log("cart checkout response: ", returnedData);
                        $("#listitems").html(returnedData);

                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.statusText, textStatus);
                    }
                });
            }

            loadProducts();
            console.log($('#kg1').data("sku"));
           
            function addtocart() {
                
                var spans = document.querySelectorAll('.add');
                
                console.log($('.add').data('sku'));
                
               // console.log(spans[0].getAttribute(data-sku));
              
               
                $.ajax({
                    url: "./cont/products.php",
                    type: "POST",
                    data: {
                        sku:''
                    },
                    dataType: 'JSON',
                    success: function(resp) {
                        console.log("addtocart ", returnedData);
                       
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.statusText, textStatus);
                    }
                });
            }
         
        });