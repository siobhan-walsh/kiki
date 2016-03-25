<?php

//require_once('DBConnector.php');

//$um = new ProductManager();

// Facade
class ProductManager {

    private $db;

    public function __construct() {
        $this->db = DBConnector::getInstance();
    }

    public function listProducts() {
        $sql = "SELECT * FROM products";
        $rows = $this->db->query($sql);
        return $rows;
    }

    public function findProduct($SKU) {
        $params = array(":sku" => $SKU);
        $sql = "SELECT SKU, item_price, description FROM product WHERE SKU = :sku";

        $rows = $this->db->query($sql, $params);
        if(count($rows) > 0) {
            return $rows[0];
        }

        return null;
    }
    
    public function updateProduct($sku, $pname, $pdesc, $price, $stock){
        $sql = "UPDATE products SET product_name = '$pname', description = '$pdesc', product_price = '$price', qty = '$stock' WHERE sku = '$sku'";
        $rows = $this->db->query($sql);
        
    }
            
    
    public function updateProductQty($items) {
        
        foreach($items as $item) {
            $sku = $item['sku'];
            $stock = $item['stock'];
           
            
            $sql = "UPDATE products SET qty = '$stock' WHERE sku = '$sku'";
            $rows = $this->db->query($sql);
            
        }

    }


}

?>
