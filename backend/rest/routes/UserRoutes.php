<?php

use Firebase\JWT\JWT; //this creates JWT Token
use Firebase\JWT\Key;


Flight::route('GET /connection-check', function () {
  /*Coonection check to see if deployed database works*/
  new UserService();
});


/**
 * @OA\Post(
 *     path="/login", 
 *     summary = "In order to get token for auth you need to log in", 
 *     description="Login",
 *     tags={"login"},
 *     @OA\RequestBody(description="Login", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *             @OA\Property(property="email", type="string", example="demo@gmail.com",	description="User email" ),
 *             @OA\Property(property="password", type="string", example="12345",	description="Password" ),
 *        )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="Logged in successfuly"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Error"
 *     )
 * )
 */
//login route for users
//registration and login are both needed on the swagger
//you first succesfully connect using one of this two, and then use the token to authorize
Flight::route('POST /login', function () {
  $login = Flight::request()->data->getData();
  $user = Flight::userDao()->get_user_by_email($login['email']);
  //Flight::json($user);

  if (count($user['message']) > 0) {  //checks if the user array has more than 0 elements, if it is, go with the first user from the array
    $user = $user['message'];
    $user = $user[0];
  }

  if (isset ($user['id'])) {  //this checks if the user is valid, by checkig if an id was set
    if ($user['password'] == md5($login['password'])) {

      unset ($user['password']); //remove password from array not be included in JWT Token bc of security issues
      //$user['is_admin'] = false;

      $jwt = JWT::encode($user, Config::JWT_SECRET(), 'HS256');
      //ovako se zapravo stavara JWT Token
      Flight::json(["status" => 200, "token" => $jwt]);
    } else {
      Flight::json(["status" => 500, "message" => "Wrong password"]);
    }
  } else {
    Flight::json(["status" => 500, "message" => "User doesn't exist"]);
    //ovo je u slucaju da email nije valid, mada je ovo generalized message, ali mogu se i specificne poruke stavljati da user zna u cmeu je greska
  }
});


/**
 * @OA\Post(
 *     path="/register",
 *     summary = "Register to auth all other routes",
 *     description="Add a new user",
 *     tags={"register"},
 *     @OA\RequestBody(description="Add new user", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *    				@OA\Property(property="first_name", type="string", example="Demo",	description="User first name"),
 *    				@OA\Property(property="last_name", type="string", example="Demoic",	description="User last name" ),
 *                   @OA\Property(property="email", type="string", example="demo@gmail.com",	description="User email" ),
 *                   @OA\Property(property="password", type="string", example="12345",	description="Password" ),
 *        )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="User has been added"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid API request"
 *     )
 * )
 */
//Registration route for users 
Flight::route('POST /register', function () {
  $data = Flight::request()->data->getData();

  // Add the user to the database
  $user = Flight::userService()->add($data);

  // Generate the JWT token
  $jwt = JWT::encode($user, Config::JWT_SECRET(), 'HS256');

  // Return the JWT token in the response
  Flight::json(["status" => 200, "token" => $jwt, "new user" => $user]);
  

});

/**
 * @OA\Put(
 *     path="/users/{id}", security={{"ApiKeyAuth": {}}},
 *       summary="Edit user data for one ID",
 *     description="Edit user data",
 *     tags={"users"},
 *     @OA\Parameter(in="path", name="id", example=1, description="User ID"),
 *     @OA\RequestBody(description="Account data", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *                  @OA\Property(property="first_name", type="string", example="Demo",	description="First name"),
 *                  @OA\Property(property="last_name", type="string", example="Demoic",	description="Last name"),
 *                   @OA\Property(property="email", type="string", example="demo@gmail.com",	description="Email" ),
 *                   @OA\Property(property="password", type="string", example="abcde",	description="Password" ),
 *        )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="User data has been edited"
 *     ),
 *     @OA\Response( response=400, description="Invalid ID"),
 *      @OA\Response( response=404, description="User is not found" )
 * )
 */

//PUT route to edit or update user's data
//In the body, it will send the whole object, and then it will update then changed values
//This is better than having to do PUT for every database column/attribute differently
Flight::route("PUT /users/@id", function ($id) {
  $data = Flight::request()->data->getData();
  Flight::json(Flight::userService()->update($data, $id));
  //-> converts the results to the JSON form
  //This array we could have created above, store it in a variable, and then call that variable or do it directly like this
});

/**
 * @OA\Get(path="/users/{id}", tags={"users"}, security={{"ApiKeyAuth": {}}},
 *     summary="Return user data for one ID",
 *     @OA\Parameter(in="path", name="id", example=1, description="User ID"),
 *     @OA\Response( response=200, description="User data is successfully fetched."),
 *      @OA\Response( response=400, description="Invalid ID"),
 *      @OA\Response( response=404, description="User account is not found" )
 *      )
 *   )
 */


//Get route to get a user based on their id from database
Flight::route('GET /users/@id', function ($id) {
  Flight::json(Flight::userService()->get_by_id($id));
});

/**
 * @OA\Delete(
 *     path="/users/{id}", security={{"ApiKeyAuth": {}}},
 * summary="Delete user data for one ID",
 *     description="Delete user",
 *     tags={"users"},
 *     @OA\Parameter(in="path", name="id", example=1, description="User ID"),
 *     @OA\Response(
 *         response=200,
 *         description="User account has been deleted"
 *     ),
 *     @OA\Response( response=400, description="Invalid ID"),
 *      @OA\Response( response=404, description="User account is not found" )
 * )
 */


//Delete route for users to deactivate their account completely and
//be deleted from the database
Flight::route('DELETE /users/@id', function ($id) {
  Flight::userService()->delete($id);
});



?>