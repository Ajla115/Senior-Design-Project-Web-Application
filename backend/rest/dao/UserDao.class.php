<?php
require_once "BaseDao.class.php";

class UserDao extends BaseDao{

  /**
  * constructor of dao class
  */
  public function __construct(){
    parent::__construct("users"); 
  }

  public function get_user_by_email($email){
    return $this->query("SELECT * FROM users WHERE email = :email", ['email' => $email]);
  }    
  
//  Ovu funkciju nisam jos mijenjala, ali msm da mi nece trebati
/*function getUserByFirstNameAndLastName($customer_name, $customer_surname){
        return $this->query_unique("SELECT * FROM customers WHERE customer_name = :customer_name AND customer_surname = :customer_surname", ["customer_name" => $customer_name, "customer_surname" => $customer_surname]);
    }*/


}





?>