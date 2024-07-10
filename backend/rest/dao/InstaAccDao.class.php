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
      //return array("status" => 500, "message" => $e->getMessage());
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");
    }
  }

  function addIndividually($username, $userID)
  {
    try {

      $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (username, stats, activity) VALUES (:username, 0, 'active')");
      $stmt->bindParam(':username', $username);
      $stmt->execute();

      $stmt2 = $this->conn->prepare("SELECT id FROM " . $this->table_name . " WHERE username = :username AND activity = 'active' AND stats = 0");
      $stmt2->bindParam(':username', $username);
      $stmt2->execute();

      $accountID = $stmt2->fetchColumn();

      $stmt3 = $this->conn->prepare("INSERT INTO users_accounts (users_id, accounts_id) VALUES (:users_id, :accounts_id)");
      $stmt3->bindParam(':users_id', $userID);
      $stmt3->bindParam(':accounts_id', $accountID);
      $stmt3->execute();

      return array("status" => 200, "message" => "Inserted successfully");

    } catch (PDOException $e) {

      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");

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
      error_log($e->getMessage());
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
      $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE activity = 'active' ORDER BY id DESC");
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));

    } catch (PDOException $e) {
      //return array("status" => 500, "message" => $e->getMessage());
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");
    }
  }

  public function getTotalInstagramAccounts()
  {
    try {
      $stmt = $this->conn->prepare("SELECT COUNT(*) as total_accounts FROM instagram_accounts WHERE activity = 'active' ");
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row ? $row['total_accounts'] : 0;
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return null;
    }
  }


}

