<?php 

//get instagram account data by id
Flight::route('GET /accounts/id/@id', function ($id) {
    Flight::json(Flight::instaAccService()->get_by_id($id));
});


//get instagram account data by username
Flight::route('GET /accounts/@username', function ($username) {
    Flight::json(Flight::instaAccService()->get_by_username($username));
});

//update instagram accounts
Flight::route("PUT /accounts/@id", function($id){
    $data = Flight::request()->data->getData();
    Flight::json(['message' => 'Instagram account was updated succesfully', 'data' => Flight::instaAccService()->update($data, $id)]); 
});
  
//delete instagram account
Flight::route('DELETE /accounts/@id', function ($id) {
    Flight::instaAccService()->delete($id);
});
  