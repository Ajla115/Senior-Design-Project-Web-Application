<?php

class BaseService{
    protected $dao;
    public function __construct(){
        $this->dao = new BaseDao();
    
    }

}

?>