<?php

use Firebase\JWT\JWT; //this creates JWT Token
use Firebase\JWT\Key;

/**
 * @SWG\Get(
 *     path="/example",
 *     summary="Get example resource",
 *     tags={"Example"},
 *     @SWG\Response(
 *         response=200,
 *         description="Successful operation",
 *         @SWG\Schema(
 *             type="object",
 *             @SWG\Property(property="id", type="integer"),
 *             @SWG\Property(property="name", type="string")
 *         )
 *     )
 * )
 */

Flight::route('GET /connection-check', function(){
    /*Coonection check to see if deployed database works*/
      new UserService();
  });
  


//login route for users
//registration and login are both needed on the swagger
//you first succesfully connect using one of this two, and then use the token to authorize
Flight::route('POST /login', function(){
    $login = Flight::request()->data->getData();
    $user = Flight::userDao()->get_user_by_email($login['email']);
    //Flight::json($user);
    if(count($user) > 0){  //checks if the user array has more than 0 elements, if it is, go with the first user from the array
        $user = $user[0];
    }
    if (isset($user['id'])){  //this checks if the user is valid, by checkig if an id was set
      if($user['password'] == md5($login['password'])){
        unset($user['password']); //remove password from array not be included in JWT Token bc of security issues
        //$user['is_admin'] = false;
        $jwt = JWT::encode($user, Config::JWT_SECRET(), 'HS256'); 
        //ovako se zapravo stavara JWT Token
        Flight::json(['token' => $jwt]);
      }else{
        Flight::json(["message" => "Wrong password"], 404);
      }
    }else{
      Flight::json(["message" => "User doesn't exist"], 404); 
      //ovo je u slucaju da email nije valid, mada je ovo generalized message, ali mogu se i specificne poruke stavljati da user zna u cmeu je greska
  }
});

//Registration route for users 
Flight::route('POST /register', function () {
    $data = Flight::request()->data->getData();

    // Add the user to the database
    $user = Flight::userService()->add($data);
    //unset($user['password']);
    //unset is used when you don't want to send something to the database

    // Generate the JWT token
    $jwt = JWT::encode($user, Config::JWT_SECRET(), 'HS256');

    // Return the JWT token in the response
    Flight::json(['token' => $jwt, 'new user' => $user]);
});

//PUT route to edit or update user's data
//In the body, it will send the whole object, and then it will update then changed values
//This is better than having to do PUT for every database column/attribute differently
Flight::route("PUT /users/@id", function($id){
  $data = Flight::request()->data->getData();
  Flight::json(['message' => 'User was edited succesfully', 'data' => Flight::userService()->update($data, $id)]); 
  //-> converts the results to the JSON form
  //This array we could have created above, store it in a variable, and then call that variable or do it directly like this
});

//Get route to get a user based on their id from database
Flight::route('GET /users/@id', function ($id) {
  Flight::json(Flight::userService()->get_by_id($id));
});


//Delete route for users to deactivate their account completely and
//be deleted from the database
Flight::route('DELETE /users/@id', function ($id) {
  Flight::userService()->delete($id);
});



?>