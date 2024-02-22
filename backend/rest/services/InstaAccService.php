<?php
require_once 'BaseService.php';
require_once __DIR__ . "/../dao/InstaAccDao.class.php";


class InstaAccService extends BaseService
{

   public function __construct()
    {
        parent::__construct(new InstaAccDao);
    }

    function get_by_username($username)
    {
        return $this->dao->get_by_username($username);
    }

    function addIndividually($username){
      return $this->dao->addIndividually($username);
    }



 
}



