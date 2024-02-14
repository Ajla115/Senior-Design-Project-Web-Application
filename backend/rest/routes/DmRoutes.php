<?php

//route to add DM to the database
//however, we are sending an array of recipients ids and they have to be split in the database 
//one row --> one recipient
Flight::route('POST /dm', function () {
    $data = Flight::request()->data->getData();
    
    // here, I am extracting the array of recipiens from the whole data load
    $recipients = $data['recipients_id'];

    // then, I have removed recipients from the whole data object to avoid duplication
    unset($data['recipients_id']);

    // I have iterated over the whole array, and extracted one by one
    $results = [];
    foreach ($recipients as $recipient) {

        // each recipient id will be stored in the recipient variable
        $data['recipients_id'] = $recipient; 

        // And it will be added to the databse
        $result = Flight::dmService()->add($data);

        // this will push the result to the array of results
        //that can get printed out as a result in the postman
        $results[] = $result;
    }

    Flight::json($results);
});



//route to delete DM per id, however only scheduled and not sent DMs can be deleted
Flight::route('DELETE /dm/@id', function ($id) {
    Flight::dmService()->deleteScheduled($id);
});


//route to update DM per id, however only scheduled and not sent DMs can be edited
Flight::route("PUT /dm/@id", function($id){
    $data = Flight::request()->data->getData();
    Flight::json(['message' => 'Direct message was updated succesfully', 'data' => Flight::dmService()->updateScheduled($data, $id)]); 
});
  







