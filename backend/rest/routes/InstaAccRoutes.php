<?php 

//get instagram account data by id
Flight::route('GET /accounts/id/@id', function ($id) {
    Flight::json(Flight::instaAccService()->get_by_id($id));
});


//get instagram account data by username
Flight::route('GET /accounts/@username', function ($username) {
    Flight::json(Flight::instaAccService()->get_by_username($username));
});

//