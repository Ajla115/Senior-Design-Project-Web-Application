<?php
require __DIR__ . '/../dao/BaseDao.class.php';

class BaseService{
    protected $dao;
    public function __construct(){
        $this->dao = new BaseDao('instagram_accounts');
    
    }

}

?>