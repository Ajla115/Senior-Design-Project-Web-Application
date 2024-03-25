<?php
require_once "BaseDao.class.php";

class InstaAccDao extends BaseDao
{

  /**
   * constructor of dao class
   */
  public function __construct()
  {
    parent::__construct("instagram_accounts");
  }

  function get_by_username($username)
  {
    // return $this->query("SELECT *
    //   FROM instagram_accounts
    //   WHERE username = :username", ["username" => $username]);
    try {
      $stmt = $this->conn->prepare("SELECT * FROM instagram_accounts WHERE username = :username");
      $stmt->bindParam(':username', $username);
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
      return array("status" => 500, "message" => $e->getMessage());
    }
  }

  function addIndividually($username)
  {
    // return $this->query("
    // INSERT INTO " . $this->table_name . " (username, stats) VALUES (:value1, :value2)", ["value1" => $username, "value2" => 0]);
    try {
      $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (username, stats, activity) VALUES (:username, 0, 'active')");
      $stmt->bindParam(':username', $username);
      $stmt->execute();
      return array("status" => 200, "message" => "Inserted successfully");
    } catch (PDOException $e) {
      return array("status" => 500, "message" => $e->getMessage());
    }
  }


  function customDelete($id)
  {
    try {
      $stmt = $this->conn->prepare("UPDATE  " . $this->table_name . " SET activity = 'deleted' WHERE id = :id");
      $stmt->bindParam(':id', $id);
      $stmt->execute();
      return array("status" => 200, "message" => "Deleted successfully");
    } catch (PDOException $e) {
      return array("status" => 500, "message" => "Deletion failed");
    }
  }


  function getActiveAccounts()
  {
    //   return $this->query("
    //     SELECT *
    //     FROM " . $this->table_name . "
    //     WHERE activity = 'active'
    // ");
    try {
      $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE activity = 'active'");
      $stmt->execute();

      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
      return array("status" => 500, "message" => $e->getMessage());
    }
  }


}









?>