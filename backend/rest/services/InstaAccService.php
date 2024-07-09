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
        if(empty($username)){
            return array("status"=>500, "message" => "Username cannot be empty");

        }
      return $this->dao->addIndividually($username);
    }

    function customDelete($id){
        return $this->dao->customDelete($id);
    }

    function getActiveAccounts(){
        return $this->dao->getActiveAccounts();
    }

    public function getTotalInstagramAccounts()
    {
        $totalAccounts = $this->dao->getTotalInstagramAccounts();
        return array("status" => 200, "message" => $totalAccounts);
    }

    
  



 
}



