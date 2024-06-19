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
      $stmt = $this->conn->prepare("SELECT * FROM users WHERE email_address = :email");
      $stmt->bindParam(':email', $email);
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
      //return array("status" => 500, "message" => $e->getMessage());
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");
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
      //return array("status" => 500, "error" => $e->getMessage());
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");
    }


  }

  public function checkExistenceForEmail($email_address)
  {
    try {
      $stmt = $this->conn->prepare("SELECT * FROM users WHERE email_address = :email_address");
      $stmt->bindParam(':email_address', $email_address);
      $stmt->execute();
      $user = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($user) {
        return 1; // Return 1 as symbol that user with this email exists
      }
    } catch (PDOException $e) {
      //return $e->getMessage();
      error_log($e->getMessage());
      return 0;
    }
  }

  public function getUserByEmail($email_address)
  {
    //return $this->query("SELECT * FROM users WHERE email = :email", ['email' => $email]);
    try {
      $stmt = $this->conn->prepare("SELECT * FROM users WHERE email_address = :email_address");
      $stmt->bindParam(':email_address', $email_address);
      $stmt->execute();
      $user = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($user) {
        return $user['password']; // Return just the password
      }
    } catch (PDOException $e) {
      //return $e->getMessage();
      error_log($e->getMessage());
      return "Internal Server Error";
    }
  }



  public function userDataUpdate($first_name, $last_name, $email_address)
  {
    try {

      $updateStmt = $this->conn->prepare("UPDATE users SET first_name = :first_name, last_name = :last_name, email_address = :new_email_address WHERE email_address = :email_address");
      $updateStmt->bindParam(':first_name', $first_name);
      $updateStmt->bindParam(':last_name', $last_name);
      $updateStmt->bindParam(':new_email_address', $email_address);
      // $updateStmt->bindParam(':email_address', $email_address);
      $updateStmt->execute();

      // Fetch the updated user data to return
      $selectUpdated = $this->conn->prepare("SELECT * FROM users WHERE email_address = :email_address");
      $selectUpdated->bindParam(':email_address', $email_address);
      $selectUpdated->execute();
      $updatedUser = $selectUpdated->fetch(PDO::FETCH_ASSOC);

      return $updatedUser; // Return the updated user data


    } catch (PDOException $e) {
      //return $e->getMessage();
      error_log($e->getMessage());
      return "Internal Server Error";
    }
  }


}







?>