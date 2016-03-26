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
    
    public function addProduct($pname, $pdesc, $price, $stock){
        
        $sql = 'SELECT product_id FROM products ORDER BY product_id DESC LIMIT 1;';
        $rows = $this->db->query($sql);
        $previousproduct = $rows[0]['product_id'];
        
        $sku = 'kg' . $previousproduct;
        
         $moresql = "INSERT INTO products (product_name, sku, product_price, description, stock) VALUES ('$pname', '$sku', '$price', '$pdesc', '$stock');";
        $morerows = $this->db->query($moresql);
     
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
        $sql = "UPDATE products SET product_name = '$pname', description = '$pdesc', product_price = '$price', stock = '$stock' WHERE sku = '$sku'";
        $rows = $this->db->query($sql);
        
    }
            
    public function checkProductsStock() {
        
            $sql = "SELECT stock, sku FROM products";
            $rows = $this->db->query($sql);
            return $rows;
        
    }
    public function updateProductStock($items) {
        
        foreach($items as $item) {
            $sku = $item['sku'];
            $stock = $item['stock'];
           
            
            $sql = "UPDATE products SET stock = '$stock' WHERE sku = '$sku'";
            $rows = $this->db->query($sql);
            
        }

    }
    
    public function deleteProduct($sku) {

        $sql = "DELETE FROM products WHERE sku = '$sku';";
        $rows = $this->db->query($sql);

    }

  


}

?>
