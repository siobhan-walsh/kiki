<?php

require_once('../init.php');
loadScripts();

    $data = array("status" => "not set!");

        $pm = new ProductManager();
    $parameters = new Parameters("POST");

    $action = $parameters->getValue('action');



       if($action == 'checkstock'){
           
           //check
           
           $sku = $parameters->getValue('sku');
           $rows = $pm->checkProductsStock();
           
           echo json_encode($rows);
           
           
       } else  if($action == 'update'){
            
         //   sku: loginValue, newItemName: editedItemName, newPrice: editedPrice, newStock:  editedStock},
            
            $sku = $parameters->getValue('sku');
            $pname = $parameters->getValue('newItemName');
            $pdesc = $parameters->getValue('newDesc');
            $price = $parameters->getValue('newPrice');
            $stock = $parameters->getValue('newStock');
            
            $rows = $pm->updateProduct($sku, $pname, $pdesc, $price,  $stock);
            
            
            echo json_encode($rows);
            
        } else  if($action == 'add'){
            
            $pname = $parameters->getValue('productName');
            $pdesc = $parameters->getValue('productDesc');
            $price = $parameters->getValue('productPrice');
            $stock = $parameters->getValue('productStock');
            
            $rows = $pm->addProduct($pname, $pdesc, $price,  $stock);
            
            
            echo json_encode($rows);
            
        } else if($action == 'delete'){
            $sku = $parameters->getValue('sku');
           $pm->deleteProduct($sku);
           
           echo json_encode(array('deleted item' => $sku ));
           
               
       } else if($action == 'menu'){
            
            
            $rows = $pm->listProducts();

            

            $html = '';
            
                foreach($rows as $row) {

                $sku = $row['sku'];
                $pname = $row['product_name'];
                $price = $row['product_price'];
                $desc = $row['description'];
                $stock = $row['stock'];

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
            
        } else if ($action == 'admin'){
            
            
            $rows = $pm->listProducts();

           

            $html = '';
                    
            foreach($rows as $row) {

                        $sku = $row['sku'];
                        $pname = $row['product_name'];
                        $price = $row['product_price'];
                        $desc = $row['description'];
                        $stock = $row['stock'];

                       // <div class='menu'>
                      $html .=   "

                                    <tr>

                                      
                                     <td data-sku-name='$sku' class='itemtitle'><span >$pname</span></td>
                                     <td data-sku-name='$sku' class='itemdesc'><span >$desc</span></td>
                                     <td class='numstd'>$sku</td>
                                     <td data-sku-price='$sku' class='price'><span >$price</span></td>
                                     <td data-sku-stock='$sku' class='stock'><span >$stock</span></td>
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
