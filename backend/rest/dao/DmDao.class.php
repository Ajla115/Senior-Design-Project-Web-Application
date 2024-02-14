<?php
require_once "BaseDao.class.php";
require_once "StatusEnum.php";

class DmDao extends BaseDao{

  public function __construct(){
    parent::__construct("users_dms"); 
  }

  
public function deleteScheduled($id){
    $stmt = $this->conn->prepare("DELETE FROM " . $this->table_name . " WHERE id = :id AND status = :status1 ");
    $scheduled = StatusEnum::SCHEDULED;
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':status1', $scheduled);
    $stmt->execute();
    //print("Number of deleted rows is: ");
    $count = $stmt -> rowCount();
    return $count;
}


public function updateScheduled($entity, $id, $id_column = "id")
{
    $query = "UPDATE " . $this->table_name . " SET ";
    foreach ($entity as $column => $value) {
        $query .= $column . "= :" . $column . ", ";
    }
    $query = rtrim($query, ", "); 
    //right trim - will remove space or characters from right, such as space after comma etc
    $query .= " WHERE $id_column = :id AND status = :status"; 
    
    $stmt = $this->conn->prepare($query);
    
    foreach ($entity as $column => $value) {
        $stmt->bindParam(':' . $column, $entity[$column]);
    }

    $stmt->bindParam(':id', $id);
    $scheduled = StatusEnum::SCHEDULED;
    $stmt->bindParam(':status', $scheduled);

    $stmt->execute();
    $count = $stmt->rowCount();
    return $count;
}
}










  
 
