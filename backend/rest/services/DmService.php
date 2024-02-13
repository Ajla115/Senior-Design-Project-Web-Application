<?php
require_once 'BaseService.php';
require_once __DIR__ . "/../dao/DmDao.class.php";


class DmService extends BaseService
{

   public function __construct()
    {
        parent::__construct(new DmDao);
    }



 
}



