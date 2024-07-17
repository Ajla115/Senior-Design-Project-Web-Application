<?php
require_once 'BaseService.php';
require_once __DIR__ . "/../dao/InstaAccDao.class.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

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

    function addIndividually($username)
    {
        try {


            $all_headers = getallheaders();

            if (!isset($all_headers['Authorization'])) {
                throw new Exception('Authorization token not provided');
            }

            $token = $all_headers['Authorization'];

            $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));

            $userEmail = $decoded[0];


            if (empty($username)) {
                return array("status" => 500, "message" => "Username cannot be empty");

            }

            $userID = Flight::userDao()->retrieveIDBasedOnTheEmail($userEmail);

            if (!isset($userID)) {
                return array("status" => 500, "message" => "The ID has not been extracted.");
            }

            $result = $this->dao->addIndividually($username, $userID);

            return $result;

        } catch (Exception $e) {
            return array("status" => 500, "message" => $e->getMessage());
        }

    }

    function customDelete($accountID)
    {
        try {
            $all_headers = getallheaders();

            if (!isset($all_headers['Authorization'])) {
                throw new Exception('Authorization token not provided');
            }

            $token = $all_headers['Authorization'];

            $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));

            $userEmail = $decoded[0];
            $is_admin = $decoded[4];


            if (empty($accountID)) {
                return array("status" => 500, "message" => "The account ID has not been found.");

            }

            $userID = Flight::userDao()->retrieveIDBasedOnTheEmail($userEmail);

            if (!isset($userID)) {
                return array("status" => 500, "message" => "The ID has not been extracted.");
            }


            $result = $this->dao->customDelete($accountID, $userID, $is_admin);

            return array("status"=>$result["status"], "message"=>$result["message"]);

        } catch (Exception $e) {
            return array("status" => 500, "message" => $e->getMessage());
        }

    }



    function getActiveAccounts()
    {
        return $this->dao->getActiveAccounts();
    }

    public function getTotalInstagramAccounts()
    {
        $totalAccounts = $this->dao->getTotalInstagramAccounts();
        return array("status" => 200, "message" => $totalAccounts);
    }







}



