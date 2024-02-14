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
        return $this->dao->deleteScheduled($id);
    }

    function updateScheduled($entity, $id, $id_column = "id")
    {
        return $this->dao->updateScheduled($entity, $id, $id_column);
    }



 
}



