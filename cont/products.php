<?php

require_once('../init.php');
loadScripts();

    $data = array("status" => "not set!");

        $pm = new ProductManager();
        $rows = $pm->listProducts();

       $html = '';


        foreach($rows as $row) {
            
            $sku = $row['sku'];
            $pname = $row['product_name'];
            $price = $row['product_price'];
            $desc = $row['description'];
            
            
          $html .=   "<div class='menu'>
          
						<div class='row'>
                        
							<div class='col-sm-8'>
								<p class='menu-title'>$pname</p>
								<div class='menu-detail'>$desc</div>
							</div>
							<div class='col-sm-4 menu-price-detail'>
								<p class='menu-price'>$ $price</p>
                                <span h4 class='menu-price add' data-pname = '$pname' data-price = '$price' data-sku = '$sku'>+ add to cart</span>
                            </div>
						</div>
					</div>";
            
            
           
        }
 
        echo $html;
        return;
        


 // echo json_encode($rows, JSON_FORCE_OBJECT);


?>
