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
								<p class='menu-title' data-sku-name='$sku'>$pname</p>
								<div data-sku-desc='$sku' class='menu-detail'>$desc</div>
							</div>
							<div class='col-sm-4 menu-price-detail'>
								$<span class='menu-price' data-sku-price='$sku'>$price</span>
                                
                                <input class='qty' data-sku-qty='$sku' value='1' min='1' max='5' step='1' type='number'>
                                
                                <input type='button' h4 class='menu-price add' id='add'  data-pname = '$pname' data-price = '$price' data-sku-add = '$sku' value='+ add to cart'/>
                            </div>
						</div>
					</div>";
            
            /*
            
            <input data-sku-qty="sk-2843y" value="1" min="1" max="10" step="1" type="number">
            
            <select class='qty' data-sku = '$sku'>
                                    <option value= '1' >1</option>
                                    <option value= '2' >2</option>
                                    <option value= '3' >3</option>
                                    <option value= '4' >4</option>
                                    <option value= '5' >5</option>
                                
                                </select>
            
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
            
            */
            
            
           
        }
 
        echo $html;
        return;
        


 // echo json_encode($rows, JSON_FORCE_OBJECT);


?>
