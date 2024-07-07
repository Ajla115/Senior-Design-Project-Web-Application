<?php
require_once "BaseDao.class.php";
require_once "StatusEnum.php";

class DmDao extends BaseDao
{

  public function __construct()
  {
    parent::__construct("users_dms");
  }


  public function deleteScheduled($id)
  {
    try {
      $stmt = $this->conn->prepare("DELETE FROM " . $this->table_name . " WHERE id = :id AND status = :status ");
      $scheduled = StatusEnum::SCHEDULED;
      $stmt->bindParam(':id', $id);
      
      $stmt->bindParam(':status', $scheduled);
      $stmt->execute();
      $count = $stmt->rowCount();
      return $count;
      //return array("status" => 200, "message" => $count); 
    } catch (PDOException $e) {
      error_log($e->getMessage());
      //return array("status" => 500, "message" => "Internal Server Error");
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
      $stmt = $this->conn->prepare("SELECT *  FROM instagram_accounts WHERE username = :username ");
      $stmt->bindParam(':username', $username);
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
      $stmt = $this->conn->prepare("SELECT id FROM instagram_accounts WHERE username = :username");
      $stmt->bindParam(':username', $username);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row['id'];
    } catch (PDOException $e) {
      //return array("status" => 500, "message" => $e->getMessage());
      error_log($e->getMessage());
      return -1;
    }
  }

  //this will create a new dm if we add a new username while already updating an existing DM
//RADI
  // public function createNewDM($data, $existingRecipientsID)
  // {

  //   return $this->query("
  // INSERT INTO " . $this->table_name . " (users_id, users_email, users_password, recipients_id, message, date_and_time, status) 
  // VALUES (:value1, :value2, :value3, :value4, :value5, :value6, :value7)",
  //     [
  //       "value1" => $data['users_id'],
  //       "value2" => $data['users_email'],
  //       "value3" => $data['users_password'],
  //       "value4" => $existingRecipientsID,
  //       "value5" => $data['message'],
  //       "value6" => $data['date_and_time'],
  //       "value7" => $data['status']
  //     ]
  //   );

  // }

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

  // //Update existing route
  // public function updateExistingDM($data, $existingRecipientsID, $current_dm_id)
  // {
  //   return $this->query("
  // UPDATE " . $this->table_name . " SET users_id = :value1, users_email= :value2, users_password = :value3, recipients_id = :value4, message = :value5,
  // date_and_time = :value6, status = :value7 WHERE id = :id;",
  //     [
  //       "value1" => $data['users_id'],
  //       "value2" => $data['users_email'],
  //       "value3" => $data['users_password'],
  //       "value4" => $existingRecipientsID,
  //       "value5" => $data['message'],
  //       "value6" => $data['date_and_time'],
  //       "value7" => $data['status'],
  //       "id" => $current_dm_id
  //     ]
  //   );
  // }


public function updateExistingDM($data, $current_dm_id)
{
    try {
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
    } catch (PDOException $e) {
        error_log($e->getMessage());
        return array("status" => 500, "message" => "Internal Server Error");
    }
}


  public function getAllDMS($userID)
{
  try {
    $stmt = $this->conn->prepare("SELECT d.id, d.users_email, ia.username AS recipient_username, d.message, d.date_and_time 
                                  FROM " . $this->table_name . " d
                                  JOIN instagram_accounts ia ON d.recipients_id = ia.id
                                  WHERE d.users_id = :users_id AND d.status = :status");
    $scheduled = "Scheduled";
    $stmt->bindParam(':users_id', $userID);
    $stmt->bindParam(':status', $scheduled);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return array("status" => 200, "message" => $rows);
  } catch (PDOException $e) {
    error_log($e->getMessage());
    return array("status" => 500, "message" => "Internal Server Error");
  }
}


public function getPasswordForUsername($email){
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










