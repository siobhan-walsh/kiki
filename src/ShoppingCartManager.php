<?php

//require_once('./DBConnector.php');

//$um = new ShoppingCartManager();

// Facade
class ShoppingCartManager {

    private $db;

    public function __construct() {
        $this->db = DBConnector::getInstance();
    }

    public function startCart() {
        $sql = "INSERT INTO cart (state, total) VALUES ('started', 0.00)";
        $id = $this->db->getTransactionID($sql);
        // return id of the cart that was started
        return $id;
    }

    public function cancelCart($id) {
        $sql = "UPDATE cart SET state = 'cancelled' WHERE cart_id = $id";
        $count = $this->db->affectRows($sql);
        return $count;
    }

    public function checkoutCart($id, $total) {

        $sql = "UPDATE cart SET state = 'checked out', total = $total WHERE cart_id = $id";
        $count = $this->db->affectRows($sql);
        return $count;
    }

    public function addItemsToCart($items, $cart_id) {
       
        foreach($items as $item) {
            $sku = $item['sku'];
            $qty = $item['qty'];
           
            // need to look up the ID of the product based on the SKU
            $sql = "SELECT product_id FROM products WHERE sku = '$sku'";
            $rows = $this->db->query($sql);
            $product_id = $rows[0]['product_id'];
            $sql = "INSERT INTO cart_product (product_id, cart_id, quantity)
                VALUES ($product_id, $cart_id, $qty)";
            $this->db->affectRows($sql);
        }

    }

}

?>
