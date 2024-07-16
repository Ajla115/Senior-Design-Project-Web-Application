<?php
require_once 'BaseService.php';
require_once __DIR__ . "/../dao/DmDao.class.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class DmService extends BaseService
{

    public function __construct()
    {
        parent::__construct(new DmDao);
        $this->instaAccService = new InstaAccService();
    }

    //function needed to split new DM by each username and then add it to the database
    // here, I am extracting the array of recipients from the whole data load
    //RADI !!!!!!!

    private function retrieveIDbasedOnEmail($email)
    {
        $user = Flight::userDao()->get_user_by_email($email);
        return $user;
    }
    function splitAndAdd($data)
    {
        try {
            // Get all headers
            $all_headers = getallheaders();


            // Check for Authorization token
            if (!isset($all_headers['Authorization'])) {
                throw new Exception('Authorization token not provided');
            }

            // Decode the JWT token to get user email
            $token = $all_headers['Authorization'];


            $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));

            $userEmail = $decoded[0];



            // Get user ID based on email
            $whole_user = $this->retrieveIDbasedOnEmail($userEmail);


            if ($whole_user['status'] !== 200 || !isset($whole_user['message'])) {
                throw new Exception('Error retrieving user based on the email');
            }

            $userID = $whole_user['message'][0]["id"];


            if (!is_numeric($userID)) {
                throw new Exception('Invalid user ID');
            }



            // Check if usernames is an array
            if (empty($data['usernames']) || !is_array($data['usernames'])) {
                throw new Exception('Usernames must be an array');
            }

            $usernames = $data['usernames'];

            // Remove usernames from data
            unset($data['usernames']);



            // Initialize result variable
            $result = null;

            // Iterate over each username
            foreach ($usernames as $username) {
                // Check existence in instagram_accounts table
                $count = $this->dao->checkExistence($username);


                if ($count['status'] !== 200) {
                    throw new Exception('Error checking username existence');
                }

                // Add username if it does not exist
                if ($count['message'] == 0) {
                    $addedUser = Flight::instaAccService()->addIndividually($username);
                }


                // Get recipient ID by username
                $recipientIDResponse = $this->dao->getRecipientIDByUsername($username);




                if ($recipientIDResponse['status'] !== 200 || !isset($recipientIDResponse['message'])) {
                    throw new Exception('Error retrieving recipient ID');
                }

                $existingRecipientsID = $recipientIDResponse['message'];



                if (!is_numeric($existingRecipientsID)) {
                    throw new Exception('Invalid recipient ID');
                }

                // Create new DM entry
                $status = "Scheduled";
                $result = $this->dao->createNewDM($userID, $data, $existingRecipientsID, $status);

                if ($result['status'] != 200) {
                    throw new Exception('Error creating new DM');
                }
            }


            return array("status" => 200, "message" => "DM was successfully added to the database.");

        } catch (Exception $e) {
            error_log($e->getMessage());
            return array("status" => 500, "message" => "Internal Server Error: " . $e->getMessage());
        }
    }

    //this is to delete multiple DMs at the same time
    function bulkDelete($data)
    {
        $dm_ids = $data['dm_ids'];
        $deleted = false; // Flag to indicate if any DM is deleted

        unset($data['dm_ids']);

        foreach ($dm_ids as $dm_id) {
            $count = $this->dao->checkStatus($dm_id);

            if ($count == 1) { //this is the count for rows that have status 'Scheduled' since they only can be deleted
                $this->dao->delete($dm_id);
                $deleted = true; // Set flag to true since a DM was deleted
            }
        }

        if ($deleted) {
            return "DMs with the appropriate status have been deleted.";
        } else {
            return "No DMs with the appropriate status found for deletion.";
        }
    }



    function deleteScheduled($dmID)
    {
        try {
            $all_headers = getallheaders();

            if (!isset($all_headers['Authorization'])) {
                throw new Exception('Authorization token not provided');
            }

            $token = $all_headers['Authorization'];

            $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));

            $userEmail = $decoded[0];

            if (empty($dmID)) {
                return array("status" => 500, "message" => "The DM ID has not been found.");
            }

            $userID = Flight::userDao()->retrieveIDBasedOnTheEmail($userEmail);

            if (!isset($userID)) {
                return array("status" => 500, "message" => "The ID has not been extracted.");
            }

            return $this->dao->deleteScheduled($dmID, $userID);

        } catch (Exception $e) {
            error_log($e->getMessage());
            return array("status" => 500, "message" => "Internal Server Error");
        }
    }




    //Bulk Update
    function checkRecipientsAndUpdateDM($data)
    {

        if ($data['status'] == "Scheduled") {

            $usernames = $data['usernames'];

            //also sent an array of DM ids, but each DM ID corresponds to one username
            $dm_ids = $data['dm_ids'];


            // then, I have removed usernames of recipients from the whole data object to avoid duplication
            //also this wont be sent to the users_dms table
            unset($data['usernames']);
            unset($data['dm_ids']);

            try {
                for ($i = 0; $i < count($usernames); $i++) {

                    //foreach ($usernames as $username) {

                    $count = $this->dao->checkExistence($usernames[$i]);

                    //Case no. 1: user does not exist at all in the instagram account table and a completely new DM message with it has to be created
                    //Case no. 1 -> RADI completelly
                    if ($count == 0) {

                        //since there is for each loop in Base Dao, here I created a seperate addIndividually function because creating an array that accepts one by one username and then proceeds has not worked properly
                        //if a user does not exist in the instagream_accounts table, add it there
                        Flight::instaAccService()->addIndividually($usernames[$i]);

                        $existingRecipientsID = $this->dao->getRecipientIDByUsername($usernames[$i]);

                        $this->dao->createNewDM($data, $existingRecipientsID);
                    }
                    //Case no. 2: user exists only in the instagram accounts or Case no. 3: exists in both tables  and its DM will get updated
                    if ($count == 1) {

                        //if user exists in instagram_account, just take his ID
                        $existingRecipientsID = $this->dao->getRecipientIDByUsername($usernames[$i]);

                        //check if it exists in the DM table, that is if any DMs with this ID have been sent
                        $appearanceInDms = $this->dao->checkExistenceInDMs($existingRecipientsID);

                        //Case no. 3: user exists  in the instagram account table, but does not have an appropriate DM, so it has to be be created
                        if ($appearanceInDms == 0) {

                            //but now create a DM message with it
                            $this->dao->createNewDM($data, $existingRecipientsID);
                        }

                        //$current_dm_id = $dm_idsArr[$i];
                        //print_r($dm_idsArr[$i]);

                        //if IF is not the case, it means that this DM already exists with this ID so it will just get updated
                        $this->dao->updateExistingDM($data, $existingRecipientsID, $dm_ids[$i]);
                    }
                }
            } catch (Exception $e) {
                return "An error occurred: " . $e->getMessage();
            }

            return "Bulk update was successful";
        } else {
            return "The status has to be 'Scheduled'";
        }
    }

    function checkRecipientsAndUpdateDMIndividually($data, $dmID)
    {
        try {
            $all_headers = getallheaders();

            if (!isset($all_headers['Authorization'])) {
                throw new Exception('Authorization token not provided');
            }

            $token = $all_headers['Authorization'];

            $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));

            $userEmail = $decoded[0];

            if (empty($dmID)) {
                return array("status" => 500, "message" => "The DM ID has not been found.");
            }

            $userID = Flight::userDao()->retrieveIDBasedOnTheEmail($userEmail);

            if (!isset($userID)) {
                return array("status" => 500, "message" => "The ID has not been extracted.");
            }

            if (empty($data['message'])) {
                return array("status" => 500, "message" => "Message field cannot be empty.");
            }

            $result = $this->dao->updateExistingDM($data, $dmID, $userID);
            return $result;
            
        } catch (Exception $e) {
            return array("status" => 500, "message" => "Update failed.");
        }
    }



    private function getDMS()
    {
        return Flight::dmDao()->getAllDMS();
    }

    public function getAllDMS($data)
    {
        try {
            $all_headers = getallheaders();

            if (!isset($all_headers['Authorization'])) {
                throw new Exception('Authorization token not provided');
            }

            $token = $all_headers['Authorization'];
            $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));
            $userEmail = $decoded[0];

            $whole_user = $this->retrieveIDbasedOnEmail($userEmail);
            if ($whole_user['status'] !== 200 || !isset($whole_user['message'])) {
                throw new Exception('Error retrieving user ID');
            }

            $userID = $whole_user['message'][0]["id"];

            if (!is_numeric($userID)) {
                throw new Exception('Invalid user ID');
            }

            $response = $this->getDMS();


            if ($response['status'] === 200) {
                $dms = $response['message'];
                $result = [];


                foreach ($dms as $dm) {
                    $result[] = [
                        "id" => $dm['id'],
                        "username" => $dm['users_email'],
                        "recipient" => $dm['recipient_username'],
                        "message" => $dm['message'],
                        "dateAndTime" => $dm['date_and_time'],
                        "user_name" => $dm['user_name']
                    ];
                }

                return array("status" => 200, "message" => $result);
            } else {
                return array("status" => 500, "message" => $response['message']);
            }
        } catch (Exception $e) {
            error_log($e->getMessage());
            return array("status" => 500, "message" => "Internal Server Error: " . $e->getMessage());
        }
    }


    public function getSentDMS($data)
    {
        try {
            $all_headers = getallheaders();

            if (!isset($all_headers['Authorization'])) {
                throw new Exception('Authorization token not provided');
            }

            $token = $all_headers['Authorization'];
            $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));
            $userEmail = $decoded[0];

            $whole_user = $this->retrieveIDbasedOnEmail($userEmail);
            if ($whole_user['status'] !== 200 || !isset($whole_user['message'])) {
                throw new Exception('Error retrieving user ID');
            }

            $userID = $whole_user['message'][0]["id"];

            if (!is_numeric($userID)) {
                throw new Exception('Invalid user ID');
            }

            $response = Flight::dmDao()->getSentDMS();


            if ($response['status'] === 200) {
                $dms = $response['message'];
                $result = [];


                foreach ($dms as $dm) {
                    $result[] = [
                        "id" => $dm['id'],
                        "username" => $dm['users_email'],
                        "recipient" => $dm['recipient_username'],
                        "message" => $dm['message'],
                        "dateAndTime" => $dm['date_and_time'],
                        "user_name" => $dm['user_name']
                    ];
                }

                return array("status" => 200, "message" => $result);
            } else {
                return array("status" => 500, "message" => $response['message']);
            }



        } catch (Exception $e) {
            error_log($e->getMessage());
            return array("status" => 500, "message" => "Internal Server Error: " . $e->getMessage());
        }
    }
    public function getPercentageOfScheduledDMs()
    {
        $counts = $this->dao->getCountOfScheduledAndSentDMs();
        if ($counts === null) {
            return null;
        }

        $total = $counts['count_scheduled'] + $counts['count_sent'];
        if ($total == 0) {
            $percentageScheduled = 0;
        } else {
            $percentageScheduled = round(($counts['count_scheduled'] / $total) * 100, 2);
        }

        return [
            'percentage_scheduled' => $percentageScheduled,
            'count_scheduled' => $counts['count_scheduled'],
            'count_sent' => $counts['count_sent']
        ];
    }
}


















