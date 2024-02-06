<?php

use Firebase\JWT\JWT; //ovo creates JWT Token
use Firebase\JWT\Key;

/**
 * @OA\Get(path="/connection-check", tags={"connection"}, security={{"ApiKeyAuth": {}}},
 *         summary="Returns status of connection with the server ",
 *         @OA\Response( response=200, description="Successful connection")
 * )
 */


Flight::route('GET /connection-check', function(){
    /*Coonection check to see if deployed database works*/
      new UserService();
  });
  



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

/*ovdje ide login bez autentifikacije na swaggeru*/

 /**
* @OA\Post(
*     path="/register", security={{"ApiKeyAuth": {}}},
*     description="Add a user - registration",
*     tags={"users"},
*     @OA\RequestBody(description="Add new booking", required=true,
*       @OA\MediaType(mediaType="application/json",
*    			@OA\Schema(
*    				@OA\Property(property="username", type="int", example="",	description="Customer ID"),
*    				@OA\Property(property="vehicle_id", type="int", example="1",	description="Vehicle ID" ),
*                   @OA\Property(property="date_of_booking", type="date", example="2020-07-20",	description="Date of booking" ),
*                   @OA\Property(property="location_id", type="int", example="1",	description="Location ID" ),
*                   @OA\Property(property="employee_id", type="int", example="1",	description="Employee ID" ),
*                   @OA\Property(property="paid", type="tinyint", example="1",	description="Paid or not" ),
*                   @OA\Property(property="date_of_payment", type="date", example="2020-01-19",	description="Date of payment" ),
*        )
*     )),
*     @OA\Response(
*         response=200,
*         description="Booking has been added"
*     ),
*     @OA\Response(
*         response=500,
*         description="Error"
*     )
* )
*/


/*This route is for registration of users*/ 
Flight::route('POST /register', function () {
    $data = Flight::request()->data->getData();

    // Add the userto the database
    $user = Flight::userService()->add($data);
    unset($user['password']);

    // Generate the JWT token
    $jwt = JWT::encode($user, Config::JWT_SECRET(), 'HS256');

    // Return the JWT token in the response
    Flight::json(['token' => $jwt, 'new user' => $user]);
});


?>