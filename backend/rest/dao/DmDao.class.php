<?php
require_once "BaseDao.class.php";
require_once "StatusEnum.php";

class DmDao extends BaseDao
{

  public function __construct()
  {
    parent::__construct("users_dms");
  }


  public function deleteScheduled($dmID, $userID)
{
    try {
        // Step 1: Verify that the userID matches the users_id for the given dmID
        $checkStmt = $this->conn->prepare("SELECT users_id FROM " . $this->table_name . " WHERE id = :dmID AND status = :status");
        $scheduled = StatusEnum::SCHEDULED;
        $checkStmt->bindParam(':dmID', $dmID);
        $checkStmt->bindParam(':status', $scheduled);
        $checkStmt->execute();
        $result = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if ($result && $result['users_id'] == $userID) {
            // Step 2: Update the status to 'deleted'
            $deleteStmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET status = :deletedStatus WHERE id = :dmID AND users_id = :userID");
            $deletedStatus = 'Deleted';
            $deleteStmt->bindParam(':deletedStatus', $deletedStatus);
            $deleteStmt->bindParam(':dmID', $dmID);
            $deleteStmt->bindParam(':userID', $userID);
            $deleteStmt->execute();
            $count = $deleteStmt->rowCount();

            if ($count > 0) {
                return array("status" => 200, "message" => "Scheduled DM successfully deleted.");
            } else {
                return array("status" => 500, "message" => "Failed to delete scheduled DM.");
            }
        } else {
            return array("status" => 500, "message" => "Only the person who created the scheduled DM can delete it.");
        }
    } catch (PDOException $e) {
        error_log($e->getMessage());
        return array("status" => 500, "message" => "Internal Server Error");
    }
}

  public function checkStatus($id)
  {
    try {
      $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE id = :id AND status = :status1 ");
      $scheduled = StatusEnum::SCHEDULED;
      $stmt->bindParam(':id', $id);
      $stmt->bindParam(':status1', $scheduled);
      $stmt->execute();
      //print("Number of deleted rows is: ");
      $count = $stmt->rowCount();
      return array("status" => 200, "message" => $count); //return $count;
    } catch (PDOException $e) {
      //return array("status" => 500, "message" => $e->getMessage());
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");
    }
  }



  //used to check if instagram account exists and take its ID if it exists
  public function checkExistence($username)
  {
    try {
      $activeStatus = 'active';
      $stmt = $this->conn->prepare("SELECT *  FROM instagram_accounts WHERE username = :username AND activity = :activity");
      $stmt->bindParam(':username', $username);
      $stmt->bindParam(':activity', $activeStatus);
      $stmt->execute();
      $count = $stmt->rowCount();
      return array("status" => 200, "message" => $count); //return $count; 
    } catch (PDOException $e) {
      //return array("status" => 500, "message" => $e->getMessage());
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");
    }

  }


  public function checkExistenceInDMs($existingRecipientsID)
  {
    try {
      $stmt = $this->conn->prepare("SELECT *  FROM users_dms WHERE recipients_id = :recipients_id ");
      $stmt->bindParam(':recipients_id', $existingRecipientsID);
      $stmt->execute();
      $count = $stmt->rowCount();
      return array("status" => 200, "message" => $count); //return $count; 
    } catch (PDOException $e) {
      //return array("status" => 500, "message" => $e->getMessage());
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");
    }
  }

  //return recipients ID
  public function getRecipientIDByUsername($username)
  {
    try {
      $stmt = $this->conn->prepare("SELECT id FROM instagram_accounts WHERE username = :username AND activity= :activity");
      $activeStatus = 'active';
      $stmt->bindParam(':username', $username);
      $stmt->bindParam(':activity', $activeStatus);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return array("status" => 200, "message" => $row['id']);
    } catch (PDOException $e) {
      //return array("status" => 500, "message" => $e->getMessage());
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error. Check logs.");
    }
  }

  public function createNewDM($userID, $data, $existingRecipientsID, $status)
  {
    try {
      $query = "INSERT INTO " . $this->table_name . " (users_id, users_email, users_password, recipients_id, message, date_and_time, status) 
                  VALUES (:users_id, :users_email, :users_password, :recipients_id, :message, :date_and_time, :status)";

      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(':users_id', $userID);
      $stmt->bindParam(':users_email', $data['email']);
      $stmt->bindParam(':users_password', $data['password']);
      $stmt->bindParam(':recipients_id', $existingRecipientsID);
      $stmt->bindParam(':message', $data['message']);
      $stmt->bindParam(':date_and_time', $data['date_and_time']);
      $stmt->bindParam(':status', $status);

      $stmt->execute();

      return array("status" => 200, "message" => "Insertion was successful.");
    } catch (PDOException $e) {
      //return array("status" => 500, "message" => $e->getMessage());
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");
    }
  }



  public function updateExistingDM($data, $current_dm_id, $userID)
  {
      try {
  
          $checkStmt = $this->conn->prepare("SELECT users_id FROM " . $this->table_name . " WHERE id = :dmID");
          $checkStmt->bindParam(':dmID', $current_dm_id);
          $checkStmt->execute();
          $result = $checkStmt->fetch(PDO::FETCH_ASSOC);
  
          if ($result && $result['users_id'] == $userID) {
              // Step 2: Proceed with the update
              $stmt = $this->conn->prepare("
                  UPDATE " . $this->table_name . " 
                  SET 
                      message = :message,
                      date_and_time = :date_and_time
                  WHERE id = :id
              ");
              $stmt->bindParam(':message', $data['message']);
              $stmt->bindParam(':date_and_time', $data['date_and_time']);
              $stmt->bindParam(':id', $current_dm_id);
  
              $stmt->execute();
              return array("status" => 200, "message" => "Update was successful.");
          } else {
              return array("status" => 500, "message" => "Only the person who created the message can edit it.");
          }
      } catch (PDOException $e) {
          error_log($e->getMessage());
          return array("status" => 500, "message" => "Internal Server Error");
      }
  }
  

  public function getAllDMS()
  {
    try {
      $stmt = $this->conn->prepare("SELECT ud.id, ud.users_email, ia.username AS recipient_username, ud.message, ud.date_and_time, 	concat(u.first_name, ' ', u.last_name) AS user_name
					FROM users_dms  ud
					JOIN instagram_accounts ia ON ud.recipients_id = ia.id
					JOIN users u ON u.id = ud.users_id
					WHERE  ud.status = :status");
      $scheduled = "Scheduled";
      //$stmt->bindParam(':users_id', $userID);
      $stmt->bindParam(':status', $scheduled);
      $stmt->execute();
      $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
      return array("status" => 200, "message" => $rows);
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");
    }
  }



  public function getSentDMS()
  {
    try {
      $stmt = $this->conn->prepare("SELECT ud.id, ud.users_email, ia.username AS recipient_username, ud.message, ud.date_and_time, 	concat(u.first_name, ' ', u.last_name) AS user_name
                                      FROM users_dms  ud
                                      JOIN instagram_accounts ia ON ud.recipients_id = ia.id
                                      JOIN users u ON u.id = ud.users_id
                                      WHERE ud.status = :status");
      $sent = "Sent";
      $stmt->bindParam(':status', $sent);
      $stmt->execute();
      $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
      return array("status" => 200, "message" => $rows);
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");
    }
  }

  public function getPasswordForUsername($email)
  {
    try {
      $stmt = $this->conn->prepare("SELECT users_password FROM users_dms WHERE users_email = :email");
      $stmt->bindParam(':email', $email);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row['users_password'];
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return null;
    }
  }

  public function getCountOfScheduledAndSentDMs()
  {
    try {
      // Count scheduled DMs
      $stmt = $this->conn->prepare("SELECT COUNT(*) as count_scheduled FROM users_dms WHERE status = 'Scheduled'");
      $stmt->execute();
      $rowScheduled = $stmt->fetch(PDO::FETCH_ASSOC);
      $countScheduled = $rowScheduled['count_scheduled'];

      // Count sent DMs
      $stmt = $this->conn->prepare("SELECT COUNT(*) as count_sent FROM users_dms WHERE status = 'Sent'");
      $stmt->execute();
      $rowSent = $stmt->fetch(PDO::FETCH_ASSOC);
      $countSent = $rowSent['count_sent'];

      return [
        'count_scheduled' => $countScheduled,
        'count_sent' => $countSent
      ];
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return null;
    }
  }




}










