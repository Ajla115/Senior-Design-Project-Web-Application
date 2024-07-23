<?php

// Allow from any origin
header("Access-Control-Allow-Origin: *");

// Allow specific methods
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

  $data = Flight::request()->data->getData();
  Flight::json(Flight::userService()->login($data));
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
 *            @OA\Property(property="phone", type="string", example="+3876123456",	description="Phone" ),
 *            @OA\Property(property="email", type="string", example="demo@gmail.com",	description="User email" ),
 *            @OA\Property(property="password", type="string", example="12345",	description="Password" )
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

  Flight::json(Flight::userService()->register($data));


});

/**
 * @OA\Put(
 *     path="/users/{id}", security={{"ApiKeyAuth": {}}},
 *     summary="Edit user data for one ID",
 *     description="Edit user data",
 *     tags={"users"},
 *     @OA\Parameter(in="path", name="id", example=1, description="User ID"),
 *     @OA\RequestBody(description="Account data", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *                  @OA\Property(property="first_name", type="string", example="Demo",	description="First name"),
 *                  @OA\Property(property="last_name", type="string", example="Demoic",	description="Last name"),
 *                   @OA\Property(property="email", type="string", example="demo@gmail.com",	description="Email" ),
 *                   @OA\Property(property="phone", type="string", example="+3876123456",	description="Phone" ),
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


/**
 * @OA\Put(
 *     path="/userdataupdate/", security={{"ApiKeyAuth": {}}},
 *       summary="Edit user data",
 *     description="Edit user data",
 *     tags={"users"},
 *     @OA\RequestBody(description="Account data", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *                  @OA\Property(property="first_name", type="string", example="Demo",	description="First name"),
 *                  @OA\Property(property="last_name", type="string", example="Demoic",	description="Last name"),
 *                  @OA\Property(property="phone", type="string", example="demo@gmail.com",	description="Phone number"),
 *                  @OA\Property(property="email", type="string", example="+38761123456",	description="Email"),
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
Flight::route("PUT /userdataupdate/", function () {
  $data = Flight::request()->data->getData();
  Flight::json(Flight::userService()->userDataUpdate($data));
});



//API for sending an email to the customer service

/**
 * @OA\Post(
 *     path="/sendemailtocustomerservice", security={{"ApiKeyAuth": {}}},
 *     summary = "Send email to the customer service",
 *     description="Send email to the customer service",
 *     tags={"users"},
 *     @OA\RequestBody(description="Send email to the customer service", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *    				@OA\Property(property="title", type="string", example="Forgot my password",	description="Title"),
 *    				@OA\Property(property="description", type="string", example="Detailed explanation",	description="Detailed explanation" )
 *        )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="Email has been sent"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Email was not sent"
 *     )
 * )
 */


Flight::route("POST /sendemailtocustomerservice/", function () {
  $data = Flight::request()->data->getData();
  Flight::json(Flight::userService()->sendemailtocustomerservice($data));
});


/**
 * @OA\Post(
 *     path="/markuserasdeleted'", security={{"ApiKeyAuth": {}}},
 *     summary = "Delete your own account", 
 *     description="Deletion of account",
 *     tags={"users"},
 *     @OA\RequestBody(description="Delete account", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="Account is successfully deleted"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Error"
 *     )
 * )
 */

Flight::route('POST /markuserasdeleted/', function () {
  Flight::json(Flight::userService()->markUserAsDeleted());
});

/**
 * @OA\Post(
 *     path="/verifyAccount", security={{"ApiKeyAuth": {}}},
 *     summary = "Verify Account",
 *     description="Verify account when registering",
 *     tags={"users"},
 *     @OA\RequestBody(description="verify account", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *    				@OA\Property(property="registration_token", type="string", example="user_3647589w644948558",	description="Register Token")
 *        )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="User account has been verified."
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="User account has been verified."
 *     )
 * )
 */

Flight::route('POST /verifyAccount/', function () {
  $data = Flight::request()->data->getData();
  Flight::json(Flight::userService()->verifyAccount($data));
});

/**
 * @OA\Post(
 *     path="/changepassword", security={{"ApiKeyAuth": {}}},
 *     summary = "Change Password",
 *     description="Change Password",
 *     tags={"users"},
 *     @OA\RequestBody(description="change password", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *    				@OA\Property(property="current_password", type="string", example="123456",	description="Current Password")
 *            @OA\Property(property="new_password", type="string", example="1234567",	description="New Password")
 *    				@OA\Property(property="repeat_password", type="string", example="1234567",	description="Repeat Password")
 *    )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="User password has been changed."
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="User password has not been changed."
 *     )
 * )
 */

Flight::route('POST /changepassword/', function () {
  $data = Flight::request()->data->getData();
  Flight::json(Flight::userService()->changePassword($data));
});

/**
 * @OA\Get(path="/totalUsers/", security={{"ApiKeyAuth": {}}}, tags={"users"}, 
 *     summary="Return total users",
 *     @OA\Response( response=200, description="User data is successfully fetched."),
 *      @OA\Response( response=400, description="Invalid ID"),
 *      @OA\Response( response=404, description="User data is not found" )
 *      )
 *   )
*/

Flight::route('GET /totalUsers/', function () {
  Flight::json(Flight::userService()->totalUsers());
});


/**
 * @OA\Post(
 *     path="/forgetpassword/", 
 *     summary = "Forget Password",
 *     description="Forget Password",
 *     tags={"users"},
 *     @OA\RequestBody(description="Forget Password", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *    				@OA\Property(property="email", type="string", example="sdp.project@gmail.com",	description="Current Email")
 *    )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="User password has been changed."
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="User password has not been changed."
 *     )
 * )
 */

Flight::route('POST /forgetpassword/', function () {
  $data = Flight::request()->data->getData();
  Flight::json(Flight::userService()->forgetPassword($data));
});

/**
 * @OA\Post(
 *     path="/resetpassword/", 
 *     summary = "Reset Password",
 *     description="Reset Password",
 *     tags={"users"},
 *     @OA\RequestBody(description="Reset Password", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *    				@OA\Property(property="new_password", type="string", example="1234567",	description="New Password"),
 *            @OA\Property(property="confirm_password", type="string", example="1234567",	description="Confirm Password")
 *    )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="User password has been changed."
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="User password has not been changed."
 *     )
 * )
 */


Flight::route('POST /resetpassword/', function () {
  $data = Flight::request()->data->getData();
  Flight::json(Flight::userService()->resetPassword($data));
});

/**
 * @OA\Post(
 *     path="/registeradmin/", security={{"ApiKeyAuth": {}}},
 *     summary = "Register admin",
 *     description="Add new admin",
 *     tags={"register"},
 *     @OA\RequestBody(description="Add new admin", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *    				@OA\Property(property="first_name", type="string", example="Demo",	description="User first name"),
 *    				@OA\Property(property="last_name", type="string", example="Demoic",	description="User last name" ),
 *            @OA\Property(property="phone", type="string", example="+3876123456",	description="Phone" ),
 *            @OA\Property(property="email", type="string", example="demo@gmail.com",	description="User email" ),
 *            @OA\Property(property="password", type="string", example="12345",	description="Password" )
 *        )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="Admin has been added"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid API request"
 *     )
 * )
 */

Flight::route('POST /registeradmin/', function () {
  $data = Flight::request()->data->getData();
  Flight::json(Flight::userService()->registerAdmin($data));
});

/**
 * @OA\Get(path="/alladmins/", security={{"ApiKeyAuth": {}}}, tags={"admins"}, 
 *     summary="Return total admins",
 *     @OA\Response( response=200, description="Admin data is successfully fetched."),
 *      @OA\Response( response=400, description="Invalid ID"),
 *      @OA\Response( response=404, description="Admin data is not found" )
 *      )
 *   )
*/

Flight::route('GET /alladmins/', function () {
  Flight::json(Flight::userService()->getAllAdmins());
});


/**
 * @OA\Post(
 *     path="/deleteadmin/", security={{"ApiKeyAuth": {}}},
 *     summary = "Delete admin",
 *     description="Delete admin",
 *     tags={"admins"},
 *     @OA\RequestBody(description="Delete admin", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *    				@OA\Property(property="id", type="string", example="1",	description="Admins id")
 *        )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="Admin has been deleted"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid API request"
 *     )
 * )
 */


Flight::route('POST /deleteadmin/', function () {
  $data = Flight::request()->data->getData();
  Flight::json(Flight::userService()->deleteAdmin($data));
});

/**
 * @OA\Get(path="/activeusers/", security={{"ApiKeyAuth": {}}}, tags={"users"}, 
 *     summary="Return all users",
 *     @OA\Response( response=200, description="User data is successfully fetched."),
 *      @OA\Response( response=400, description="Invalid ID"),
 *      @OA\Response( response=404, description="User data is not found" )
 *      )
 *   )
*/

Flight::route('GET /activeusers/', function () {
  Flight::json(Flight::userService()->getActiveUsers());
});

/**
 * @OA\Post(
 *     path="/solvecustomerserviceissue/", security={{"ApiKeyAuth": {}}},
 *     summary = "Solve customer issue",
 *     description="Solve customer issue",
 *     tags={"admins"},
 *     @OA\RequestBody(description="Solve customer issue", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *    				@OA\Property(property="id", type="string", example="1",	description="Ticket ID")
 *        )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="Ticket ID has been solved."
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid API request"
 *     )
 * )
 */

Flight::route('POST /solvecustomerserviceissue/', function () {
  $data = Flight::request()->data->getData();
  Flight::json(Flight::userService()->solveCustomerServiceIssue($data));
});

/**
 * @OA\Get(path="/sentticketstocustomerservice/", security={{"ApiKeyAuth": {}}}, tags={"admins"}, 
 *     summary="Return all user tickets",
 *     @OA\Response( response=200, description="User data is successfully fetched."),
 *      @OA\Response( response=400, description="Invalid ID"),
 *      @OA\Response( response=404, description="User data is not found" )
 *      )
 *   )
*/

Flight::route('GET /sentticketstocustomerservice/', function () {
  Flight::json(Flight::userService()->getSentTicketsToCustomerService());
});

