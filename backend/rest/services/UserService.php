<?php
require_once 'BaseService.php';
require_once __DIR__ . "/../dao/UserDao.class.php";


class UserService extends BaseService
{
    public function __construct()
    {
        parent::__construct(new UserDao);
    }


    /* public function update($entity, $id, $id_column="id"){
         $entity['password'] = md5($entity['password']);
         if(isset($entity['id_column']) && !is_null($entity['id_column'])){
             return parent::update($entity, $id, $entity['id_column']);
         }
         return parent::update($entity, $id);
     }*/


    public function update($entity, $id, $id_column = "id")
    {
        //unset($entity['password']);
        //I turned off updating of password here because I will do that on seperate page
        //I will do forget your password flow on the another page, but I will leave updating of password available also here
        $entity['password'] = md5($entity['password']);
        if (isset($entity['id_column']) && !is_null($entity['id_column'])) {
            return parent::update($entity, $id, $entity['id_column']);
        }
        return parent::update($entity, $id);
    }

    public function add($entity)
    {
        //unset($entity['phone']); //ovo je da smo u form registration koloni imali i opciju da se unese phone, a nema ga u bazi
        $entity['password'] = md5($entity['password']); //ovo je za hashing sifre
        return parent::add($entity);
    }


    function get_user_by_email($email)
    {
        return $this->dao->get_user_by_email($email);
    }

    //Ovo mi ne treba
    /* function getCustomerByFirstNameAndLastName($customer_name, $customer_surname)
     {
         return $this->dao->getCustomerByFirstNameAndLastName($customer_name, $customer_surname);
     }*/



}
?>