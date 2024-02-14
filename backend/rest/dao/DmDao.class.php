<?php
require_once "BaseDao.class.php";
include "./StatusEnum.php";

class DmDao extends BaseDao{

  /**
  * constructor of dao class
  */
  public function __construct(){
    parent::__construct("users_dms"); 
  }

  
  /*public function deleteScheduled($id){
    $stmt = $this->conn->prepare("DELETE FROM " . $this->table_name . " WHERE id = :id AND status IN (:status1, :status2)");
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':status1', StatusEnum::SCHEDULED);
    $stmt->bindParam(':status2', strtolower(StatusEnum::SCHEDULED));
    $stmt->execute();
    //print("Number of deleted rows is: ");
    $count = $stmt -> rowCount();
    if ($count == 0){
      echo "Deletion of direct message failed."; 
    } else if ($count == 1){
      echo "One direct message was succesfully deleted";
    } else {
      echo "Something went wrong. Please check your code";
    }
}*/

public function deleteScheduled($id){
  $stmt = $this->conn->prepare("DELETE FROM " . $this->table_name . " WHERE id = :id AND status IN ('Scheduled', 'scheduled')");
  $stmt->bindParam(':id', $id);
  $stmt->execute();
  //print("Number of deleted rows is: ");
  $count = $stmt -> rowCount();
  if ($count == 0){
    echo "Deletion of direct message failed."; 
  } else if ($count == 1){
    echo "One direct message was succesfully deleted";
  } else {
    echo "Something went wrong. Please check your code";
  }
}

 public function updateScheduled($entity, $id, $id_column = "id"){ 
  //This ID is just status column, while id_column is default column like ID
  $query = "UPDATE " . $this->table_name . " SET ";
  foreach($entity as $column => $value){
      $query.= $column . "= :" . $column . ", ";
  }
  $query = substr($query, 0, -2);
  $query.= " WHERE $id_column = :id AND status IN ('Scheduled', 'scheduled')"; //previously {$id_column} was used, but it become deprecated
  $stmt = $this->conn->prepare($query);
  $entity['id'] = $id;
  $stmt->execute($entity);
  $count = $stmt -> rowCount();
  if ($count == 0){
    echo "Update of direct message failed."; 
  } else if ($count == 1){
    echo "One direct message was succesfully updated";
  } else {
    echo "Something went wrong. Please check your code";
  }

  if (isset($entity['recipients_id']) || is_array($entity['recipients_id'])) {
    $results = [];
    foreach ($entity['recipients_id'] as $recipient) {
        $data = $entity;  
        $data['recipients_id'] = $recipient; 
        $result = $this->add($data);
        $results[] = $result;
    }
    return $results; 
}

  return $entity;
}

}



?>




  
 
