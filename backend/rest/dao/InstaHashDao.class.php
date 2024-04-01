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
      $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE activity = 'active' ORDER BY id DESC");
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));

    } catch (PDOException $e) {
      return array("status" => 500, "message" => $e->getMessage());
    }
  }

  function getAccountsPerHashtag($id){
    try {
      $stmt = $this->conn->prepare("SELECT COUNT(DISTINCT(account_id)) FROM accounts_with_hashtag WHERE hashtag_id = :id");
      $stmt->bindParam(':id', $id);
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    catch (PDOException $e) {
      return array("status" => 500, "message" => $e->getMessage());
    }
  }


}









?>