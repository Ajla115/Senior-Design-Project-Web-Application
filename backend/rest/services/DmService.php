<?php
require_once 'BaseService.php';
require_once __DIR__ . "/../dao/DmDao.class.php";


class DmService extends BaseService
{

   public function __construct()
    {
        parent::__construct(new DmDao);
    }
    
    function deleteScheduled($id)
{
    try {
        $count = $this->dao->deleteScheduled($id);
        if($count == 0){
            return ['message' => "Deletion failed"]; 
        } else if ($count == 1) {
            return ['message' => "Deletion was successful"];
        }
    } catch (Exception $e) {
        return ['message' => "An error occurred: " . $e->getMessage()];
    }
}

    function updateScheduled($entity, $id, $id_column = "id")
    {
        return $this->dao->updateScheduled($entity, $id, $id_column);
    }



 
}



