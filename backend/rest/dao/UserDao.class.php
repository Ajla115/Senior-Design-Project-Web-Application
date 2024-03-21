<?php
require_once "BaseDao.class.php";

class UserDao extends BaseDao
{

  /**
   * constructor of dao class
   */
  public function __construct()
  {
    parent::__construct("users");
  }

  public function get_user_by_email($email)
  {
    //return $this->query("SELECT * FROM users WHERE email = :email", ['email' => $email]);
    try {
      $stmt = $this->conn->prepare("SELECT * FROM users WHERE email = :email");
      $stmt->bindParam(':email', $email);
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
      return array("status" => 500, "message" => $e->getMessage());
    }
  }

  //  Ovu funkciju nisam jos mijenjala, ali msm da mi nece trebati
/*function getUserByFirstNameAndLastName($customer_name, $customer_surname){
        return $this->query_unique("SELECT * FROM customers WHERE customer_name = :customer_name AND customer_surname = :customer_surname", ["customer_name" => $customer_name, "customer_surname" => $customer_surname]);
    }*/

  public function getUserByFirstNameAndLastName($customer_name, $customer_surname)
  {
    try {
      $stmt = $this->conn->prepare("SELECT * FROM customers WHERE customer_name = :customer_name AND customer_surname = :customer_surname");
      $stmt->bindParam(':customer_name', $customer_name);
      $stmt->bindParam(':customer_surname', $customer_surname);
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
      return array("status" => 500, "error" => $e->getMessage());
    }


  }
}





?>