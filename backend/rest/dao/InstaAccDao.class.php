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
    try {
      $stmt = $this->conn->prepare("SELECT * FROM instagram_accounts WHERE username = :username");
      $stmt->bindParam(':username', $username);
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
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

      $stmt3 = $this->conn->prepare("INSERT INTO users_accounts (users_id, accounts_id, status) VALUES (:users_id, :accounts_id, 'active')");
      $stmt3->bindParam(':users_id', $userID);
      $stmt3->bindParam(':accounts_id', $accountID);
      $stmt3->execute();

      return array("status" => 200, "message" => "Inserted successfully");

    } catch (PDOException $e) {

      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");

    }
  }


  function customDelete($accountID, $userID)
  {
    try {
      $stmt = $this->conn->prepare("SELECT users_id FROM users_accounts WHERE accounts_id = :accounts_id");
      $stmt->bindParam(':accounts_id', $accountID);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if (!$result) {
        return array("status" => 404, "message" => "User and account connection is not found");
      }

      if ($result['users_id'] != $userID) {
        return array("status" => 403, "message" => "Only person who added the account can delete it.");
      }


      $stmt = $this->conn->prepare("UPDATE users_accounts SET status = 'deleted' WHERE accounts_id = :accounts_id AND users_id = :users_id");
      $stmt->bindParam(':accounts_id', $accountID);
      $stmt->bindParam(':users_id', $userID);
      $stmt->execute();


      $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET activity = 'deleted' WHERE id = :id");
      $stmt->bindParam(':id', $accountID);
      $stmt->execute();

      return array("status" => 200, "message" => "Account deleted successfully");

    } catch (PDOException $e) {
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Deletion failed");
    }
  }


  function getActiveAccounts()
  {
    try {
      //$stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE activity = 'active' ORDER BY id DESC");
      $stmt = $this->conn->prepare("SELECT ia.id, ia.username, ia.post_number, ia.followers_number, ia.followings_number, ia.date_and_time, ia.stats, concat(u.first_name,  ' ', u.last_name) AS user_name
      FROM instagram_accounts ia
      JOIN users_accounts ua ON ia.id = ua.accounts_id
      JOIN users u ON ua.users_id = u.id
      WHERE ia.activity = 'active'
      ORDER BY ia.id DESC;");
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));

    } catch (PDOException $e) {

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

