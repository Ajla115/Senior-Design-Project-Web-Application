<?php
require_once "BaseDao.class.php";

class InstaAccDao extends BaseDao{

  /**
  * constructor of dao class
  */
  public function __construct(){
    parent::__construct("instagram_accounts"); 
  }

  function get_by_username($username)
  {
      return $this->query("SELECT *
      FROM instagram_accounts
      WHERE username = :username", ["username" => $username]);
  }

 

}





?>