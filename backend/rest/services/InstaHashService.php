<?php
require_once 'BaseService.php';
require_once __DIR__ . "/../dao/InstaHashDao.class.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class InstaHashService extends BaseService
{

    public function __construct()
    {
        parent::__construct(new InstaHashDao);
    }

    function customDelete($hashtagID)
    {
        try {
            $all_headers = getallheaders();

            if (!isset($all_headers['Authorization'])) {
                throw new Exception('Authorization token not provided');
            }

            $token = $all_headers['Authorization'];

            $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));

            $userEmail = $decoded[0];
            $is_admin_status = $decoded[4];


            if (empty($hashtagID)) {
                return array("status" => 500, "message" => "The hashtag ID has not been found.");

            }

            $userID = Flight::userDao()->retrieveIDBasedOnTheEmail($userEmail);

            if (!isset($userID)) {
                return array("status" => 500, "message" => "The ID has not been extracted.");
            }


            $result = $this->dao->customDelete($hashtagID, $userID, $is_admin_status);

            return array("status" => $result["status"], "message" => $result["message"]);

        } catch (Exception $e) {
            return array("status" => 500, "message" => $e->getMessage());
        }

    }



    function getActiveHashtags()
    {
        return $this->dao->getActiveHashtags();
    }

    function getAccountsPerHashtag($id)
    {
        return $this->dao->getAccountsPerHashtag($id);
    }

    function customAdd($hashtag)
    {
        try {


            $all_headers = getallheaders();

            if (!isset($all_headers['Authorization'])) {
                throw new Exception('Authorization token not provided');
            }

            $token = $all_headers['Authorization'];

            $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));

            $userEmail = $decoded[0];

            if (empty($hashtag)) {
                return array("status" => 500, "message" => "Hashtag field cannot be empty.");
            }

            $userID = Flight::userDao()->retrieveIDBasedOnTheEmail($userEmail);

            if (!isset($userID)) {
                return array("status" => 500, "message" => "The ID has not been extracted.");
            }

            $result = $this->dao->customAdd($hashtag, $userID);
            return $result;

        } catch (Exception $e) {
            return array("status" => 500, "message" => $e->getMessage());
        }

    }

    function getTotalHashtags()
    {
        $rows = $this->dao->getTotalHashtags();
        return array("status" => 200, "message" => $rows);
    }

    function getAccountsDataPerHashtag($id)
    {
        return $this->dao->getAccountsDataPerHashtag($id);
    }







}



