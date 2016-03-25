<?php

require_once('../init.php');
loadScripts();

    $data = array("status" => "not set!");

        $pm = new ProductManager();
    $parameters = new Parameters("POST");

        if($_POST['action'] == 'update'){
            
         //   sku: loginValue, newItemName: editedItemName, newPrice: editedPrice, newStock:  editedStock},
            
            $sku = $_POST['sku'];
            $pname = $parameters->getValue('newItemName');
            $pdesc = $parameters->getValue('newDesc');
            $price = $parameters->getValue('newPrice');
            $stock = $parameters->getValue('newStock');
            
            $rows = $pm->updateProduct($sku, $pname, $pdesc, $price,  $stock);
            
            
            echo json_encode($rows);
            
        } else if($_POST['action'] == 'menu'){
            
            
            $rows = $pm->listProducts();

            

            $html = '';
            
                foreach($rows as $row) {

                $sku = $row['sku'];
                $pname = $row['product_name'];
                $price = $row['product_price'];
                $desc = $row['description'];
                $stock = $row['qty'];

               // <div class='menu'>
              $html .=   "

                            <div class='row'>

                                <div class='col-sm-8'>
                                    <p class='menu-title' data-sku-name='$sku'>$pname</p>
                                    <div data-sku-desc='$sku' class='menu-detail'>$desc</div>
                                </div>
                                <div class='col-sm-4 menu-price-detail'>
                                    $<span class='menu-price' data-sku-price='$sku'>$price</span>


                                    <input type='button' h4 class='menu-price add' id='add'  data-pname = '$pname' data-price = '$price' data-sku-add = '$sku' data-stock = '$stock' value='+ add to cart'/>
                                </div>
                            </div>
                        ";


            }

            echo $html;
            return;
            
        } else if ($_POST['action'] == 'admin'){
            
            
            $rows = $pm->listProducts();

           

            $html = '';
                    
            foreach($rows as $row) {

                        $sku = $row['sku'];
                        $pname = $row['product_name'];
                        $price = $row['product_price'];
                        $desc = $row['description'];
                        $qty = $row['qty'];

                       // <div class='menu'>
                      $html .=   "

                                    <tr>

                                      
                                     <td data-sku-name='$sku' class='itemtitle'><span >$pname</span></td>
                                     <td data-sku-name='$sku' class='itemdesc'><span >$desc</span></td>
                                     <td>$sku</td>
                                     <td data-sku-price='$sku' class='price'><span >$price</span></td>
                                     <td data-sku-price='$sku' class='stock'><span >$qty</span></td>
                                     <td><input id='d-$sku' class='delete' type='button' value='Delete'/></td>
                  <td><input id='u-$sku' class='update' type='button' value='Update'/></td>
                                    </tr>
                                ";


                    }

                    echo $html;
                    return;
        }

        
        


 // echo json_encode($rows, JSON_FORCE_OBJECT);


?>
