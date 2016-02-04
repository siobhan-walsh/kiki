
        $(document).ready(function() {

            //
            function loadProducts() {
                $.ajax({
                    url: "./cont/products.php",
                    type: "POST",
                    dataType: 'html',
                    success: function(returnedData) {
                        console.log("cart checkout response: ", returnedData);
                        $("#listitems").html(returnedData);

                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.statusText, textStatus);
                    }
                });
            }

            loadProducts();
        });