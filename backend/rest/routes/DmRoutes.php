<?php

//route to add DM to the database
//however, we are sending an array of recipients ids and they have to be split in the database 
//one row --> one recipient
Flight::route('POST /dm', function () {
    $data = Flight::request()->data->getData();
    Flight::json(['message' =>  Flight::dmService()->splitAndAdd($data)]);
});

//bulk delete to delete multiple dms at the same time
Flight::route('DELETE /dm/bulkDelete', function () {
    $data = Flight::request()->data->getData();
    Flight::json(['data' => Flight::dmService()->bulkDelete($data)]);
});

//route to delete DM per id, however only scheduled and not sent DMs can be deleted
Flight::route('DELETE /dm/@id', function ($id) {
    Flight::json(['message' => Flight::dmService()->deleteScheduled($id)]);
});

//route to do bulk update of DMs based on recipients IDs
//but first checks if this username exists in the instagram_accounts table
//if it exists, take its ID, if it does not exist, add it to the instagram accounts table first and then to user_dms
Flight::route("PUT /dm/bulkUpdate", function () {
    $data = Flight::request()->data->getData();
    Flight::json(['message' => Flight::dmService()->checkRecipientsAndUpdateDM($data)]);
});

//route to update DM per id, however only scheduled and not sent DMs can be edited
//Update a single DM that has only one message
Flight::route("PUT /dm/@id", function ($id) {
    $data = Flight::request()->data->getData();
    Flight::json(['message' => Flight::dmService()->checkRecipientsAndUpdateDMIndividually($data, $id)]);
});



