<?php

require_once('../init.php');
loadScripts();

    $data = array("status" => "not set!");

        $pm = new ProductManager();
        $rows = $pm->listProducts();

        $forpage = $_POST['forpage'];

       $html = '';

        if($forpage == 'menu'){
            
                foreach($rows as $row) {

                $sku = $row['sku'];
                $pname = $row['product_name'];
                $price = $row['product_price'];
                $desc = $row['description'];

               // <div class='menu'>
              $html .=   "

                            <div class='row'>

                                <div class='col-sm-8'>
                                    <p class='menu-title' data-sku-name='$sku'>$pname</p>
                                    <div data-sku-desc='$sku' class='menu-detail'>$desc</div>
                                </div>
                                <div class='col-sm-4 menu-price-detail'>
                                    $<span class='menu-price' data-sku-price='$sku'>$price</span>


                                    <input type='button' h4 class='menu-price add' id='add'  data-pname = '$pname' data-price = '$price' data-sku-add = '$sku' value='+ add to cart'/>
                                </div>
                            </div>
                        ";


            }

            echo $html;
            return;
            
        } else if ($forpage == 'admin'){
                            foreach($rows as $row) {

                        $sku = $row['sku'];
                        $pname = $row['product_name'];
                        $price = $row['product_price'];
                        $desc = $row['description'];
                        $qty = $row['qty'];

                       // <div class='menu'>
                      $html .=   "

                                    <tr>

                                      
                                     <td data-sku-name='$sku'>$pname</td>
                                     <td>$sku</td>
                                     <td data-sku-price='$sku'>$price</td>
                                     <td data-sku-price='$sku'>$qty</td>
                                    </tr>
                                ";


                    }

                    echo $html;
                    return;
        }

        
        


 // echo json_encode($rows, JSON_FORCE_OBJECT);


?>
