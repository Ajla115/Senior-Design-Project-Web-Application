<?php
require_once 'BaseService.php';
require_once __DIR__ . "/../dao/DmDao.class.php";


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
    function splitAndAdd($data)
    {

        $usernames = $data['usernames'];

        unset($data['usernames']);

        try {

            foreach ($usernames as $username) {

                $count = $this->dao->checkExistence($username);

                //Case no. 1: user does not exist at all in the instagram account table, so it has to be first added
                if ($count == 0) {

                    Flight::instaAccService()->addIndividually($username);
                }

                //Since it already exists in the instagram accounts table, or we have just added it, extract its id
                $existingRecipientsID = $this->dao->getRecipientIDByUsername($username);

                $this->dao->createNewDM($data, $existingRecipientsID);
            }

        } catch (Exception $e) {
            return "An error occurred: " . $e->getMessage();
        }

        return 'DM was successfully added to the database';
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



    //this is to delete only one DM
    function deleteScheduled($id)
    {
        try {
            $count = $this->dao->deleteScheduled($id);
            if ($count == 0) { //it checks if the status is scheduled or not, because if the status is not scheduled, it wont delete
                return "Deletion failed";
            } else if ($count == 1) {
                return "Deletion was successful";
            }
        } catch (Exception $e) {
            return  "An error occurred: " . $e->getMessage();
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
                return  "An error occurred: " . $e->getMessage();
            }

            return "Bulk update was successful";
        } else {
            return  "The status has to be 'Scheduled'";
        }
    }

    //This is for inidividual update per one DM ID
    function checkRecipientsAndUpdateDMIndividually($data, $id)
    {

        if ($data['status'] == "Scheduled") {

            $usernames = $data['usernames'];

            // then, I have removed usernames of recipients from the whole data object to avoid duplication
            //also this wont be sent to the users_dms table
            unset($data['usernames']);


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
                        $this->dao->updateExistingDM($data, $existingRecipientsID, $id);
                    }
                }
            } catch (Exception $e) {
                return "An error occurred: " . $e->getMessage();
            }

            return "Individual update was successful";
        } else {
            return  "The status has to be 'Scheduled'";
        }
    }
}

















