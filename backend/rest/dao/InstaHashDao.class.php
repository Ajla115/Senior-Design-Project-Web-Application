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


  function getActiveHashtags()
  {

    try {
      $stmt = $this->conn->prepare("
      SELECT h.id, h.hashtag_name, COUNT(ah.hashtag_id) AS number_of_followers FROM " . $this->table_name . " AS h LEFT JOIN accounts_with_hashtag ah ON h.id = ah.hashtag_id WHERE h.activity = 'active' GROUP BY h.id, h.hashtag_name ORDER BY h.id DESC");
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));

    } catch (PDOException $e) {
      return array("status" => 500, "message" => $e->getMessage());
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
      return array("status" => 500, "message" => $e->getMessage());
    }
  }

  function customAdd($hashtag)
  {
    try {
      $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (hashtag, activity) VALUES (:hashtag, 'active')");
      $stmt->bindParam(':hashtag', $hashtag);
      $stmt->execute();
      return array("status" => 200, "message" => "Inserted successfully");
    } catch (PDOException $e) {
      return array("status" => 500, "message" => $e->getMessage());
    }
  }

  function getAccountsDataPerHashtag($id)
  {
    try {
      $stmt = $this->conn->prepare("SELECT ia.id, ia.username, ia.post_number, ia.followers_number, ia.followings_number
      FROM instagram_accounts ia
      JOIN accounts_with_hashtag ah ON ia.id = ah.account_id
      JOIN instagram_hashtags ih ON ah.hashtag_id = ih.id  WHERE ih.id = :hashtagId");
      $stmt->bindParam(':hashtagId', $id);
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
      return array("status" => 500, "message" => $e->getMessage());
    }
  }



}









?>