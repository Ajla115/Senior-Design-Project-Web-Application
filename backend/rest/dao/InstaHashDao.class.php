<?php
require_once "BaseDao.class.php";

class InstaHashDao extends BaseDao
{

  /**
   * constructor of dao class
   */
  public function __construct()
  {
    parent::__construct("instagram_hashtags");
  }




  function customDelete($hashtagID, $userID)
  {
    try {
      $stmt = $this->conn->prepare("SELECT users_id FROM users_hashtags WHERE hashtags_id = :hashtags_id");
      $stmt->bindParam(':hashtags_id', $hashtagID);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if (!$result) {
        return array("status" => 404, "message" => "User and hashtag connection is not found");
      }

      if ($result['users_id'] != $userID) {
        return array("status" => 403, "message" => "Only person who added the hashtag can delete it.");
      }

      $stmt = $this->conn->prepare("UPDATE users_hashtags SET status = 'deleted' WHERE hashtags_id = :hashtags_id AND users_id = :users_id");
      $stmt->bindParam(':hashtags_id', $hashtagID);
      $stmt->bindParam(':users_id', $userID);
      $stmt->execute();

      $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET activity = 'deleted' WHERE id = :id");
      $stmt->bindParam(':id', $hashtagID);
      $stmt->execute();

      return array("status" => 200, "message" => "Hashtag deleted successfully");
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Deletion failed");
    }
  }

  function getActiveHashtags()
  {

    try {
      $stmt = $this->conn->prepare("
      SELECT h.id, h.hashtag_name, COUNT(ah.hashtag_id) AS number_of_followers FROM " . $this->table_name . " AS h LEFT JOIN accounts_with_hashtag ah ON h.id = ah.hashtag_id WHERE h.activity = 'active' GROUP BY h.id, h.hashtag_name ORDER BY h.id DESC");
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
      //return array("status" => 500, "message" => $e->getMessage());
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");
    }
  }

  function getAccountsPerHashtag($id)
  {
    try {
      $stmt = $this->conn->prepare("SELECT COUNT(DISTINCT(account_id)) FROM accounts_with_hashtag WHERE hashtag_id = :id");
      $stmt->bindParam(':id', $id);
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
      //return array("status" => 500, "message" => $e->getMessage());
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");
    }
  }

  function customAdd($hashtag_name, $userID)
  {
    try {
      $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (hashtag_name, activity) VALUES (:hashtag_name, 'active')");
      $stmt->bindParam(':hashtag_name', $hashtag_name);
      $stmt->execute();

      $stmt2 = $this->conn->prepare("SELECT id FROM " . $this->table_name . " WHERE hashtag_name = :hashtag_name AND activity = 'active'");
      $stmt2->bindParam(':hashtag_name', $hashtag_name);
      $stmt2->execute();

      $hashtagID = $stmt2->fetchColumn();

      $stmt3 = $this->conn->prepare("INSERT INTO users_hashtags (users_id, hashtags_id, status) VALUES (:users_id, :hashtags_id, 'active')");
      $stmt3->bindParam(':users_id', $userID);
      $stmt3->bindParam(':hashtags_id', $hashtagID);
      $stmt3->execute();

      return array("status" => 200, "message" => "Inserted successfully");
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

  function getAccountsDataPerHashtag($id)
  {
    try {
      $stmt = $this->conn->prepare("SELECT DISTINCT ia.id, ia.username, ia.post_number, ia.followers_number, ia.followings_number
      FROM instagram_accounts ia
      JOIN accounts_with_hashtag ah ON ia.id = ah.account_id
      JOIN instagram_hashtags ih ON ah.hashtag_id = ih.id  WHERE ih.id = :hashtagId");
      $stmt->bindParam(':hashtagId', $id);
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
      //return array("status" => 500, "message" => $e->getMessage());
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");
    }
  }

  public function getTotalHashtags()
  {
    try {
      $stmt = $this->conn->prepare("SELECT COUNT(*) as total_hashtags FROM instagram_hashtags WHERE activity = 'active' ");
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row['total_hashtags'];
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return null;
    }
  }
}
