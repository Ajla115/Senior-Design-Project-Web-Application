<?php
require_once 'BaseService.php';
require_once __DIR__ . "/../dao/InstaHashDao.class.php";


class InstaHashService extends BaseService
{

   public function __construct()
    {
        parent::__construct(new InstaHashDao);
    }

    function customDelete($id){
        return $this->dao->customDelete($id);
    }

    function getActiveHashtags(){
        return $this->dao->getActiveHashtags();
    }

    function getAccountsPerHashtag($id){
        return $this->dao->getAccountsPerHashtag($id);
    }

    function customAdd($hashtag){
        return $this->dao->customAdd($hashtag);
    }

  



 
}



