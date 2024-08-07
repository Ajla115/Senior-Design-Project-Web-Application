<?php

/**
 * @OA\Post(
 *     path="/accounts",
 *     security={{"ApiKeyAuth": {}}},
 *     summary="Add a new account without IG data",
 *     description="Add a new account",
 *     tags={"accounts"},
 *     @OA\RequestBody(
 *         description="Add new account",
 *         required=true,
 *         @OA\MediaType(
 *             mediaType="application/json",
 *             @OA\Schema(
 *                 @OA\Property(
 *                     property="username",
 *                     type="string",
 *                     example="firstname_lastname",
 *                     description="Username"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Username has been added"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid API request"
 *     )
 * )
 */


//works
//add a new account
Flight::route('POST /accounts', function () {
    //I added this because I had a problem with string array conversion
    //I hope this line wont be a problem for DM Routes
    $username = Flight::request()->data['username'];
    Flight::json(Flight::instaAccService()->addIndividually($username));
});

//The route above is related to the DMs, and the one below is for the Instagram Accounts site,
//To just add a new username to the database
/**
 * @OA\Post(
 *     path="/accounts/{username}",
 *     security={{"ApiKeyAuth": {}}},
 *     summary="Add a new account without IG data",
 *     description="Add a new account",
 *     tags={"accounts"},
 *     @OA\RequestBody(
 *         description="Add new account",
 *         required=true,
 *         @OA\MediaType(
 *             mediaType="application/json",
 *             @OA\Schema(
 *                 @OA\Property(
 *                     property="username",
 *                     type="string",
 *                     example="firstname_lastname",
 *                     description="Username"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Username has been added"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid API request"
 *     )
 * )
 */


//works
//add a new account
Flight::route('POST /accounts/@username', function ($username) {
    Flight::json(Flight::instaAccService()->addIndividually($username));
});


/**
 * @OA\Get(path="/accounts", tags={"accounts"}, security={{"ApiKeyAuth": {}}},
 *          summary="Return all IG accounts from the API. ",
 *          @OA\Response( response=200, description="List of active accounts."),
 *           @OA\Response( response=400, description="Invalid API request"),
 *           @OA\Response( response=404, description="Accounts not found" )
 *     )
 * )
 */

//get all instagram account
Flight::route('GET /accounts', function () {
    Flight::json(Flight::instaAccService()->getActiveAccounts());
});


/**
 * @OA\Get(path="/accounts/{id}", tags={"accounts"}, security={{"ApiKeyAuth": {}}},
 *     summary="Return account data for one ID",
 *     @OA\Parameter(in="path", name="id", example=1, description="Account ID"),
 *     @OA\Response( response=200, description="Account is successfully fetched."),
 *      @OA\Response( response=400, description="Invalid ID"),
 *      @OA\Response( response=404, description="Account is not found" )
 *      )
 *   )
 */

//get instagram account data by id
Flight::route('GET /accounts/@id', function ($id) {
    Flight::json(Flight::instaAccService()->get_by_id($id));
});

/**
 * @OA\Get(path="/accounts/username/{username}", tags={"accounts"}, security={{"ApiKeyAuth": {}}},
 *     summary="Return account data for one ID",
 *     @OA\Parameter(in="path", name="username", example="firstname_lastname", description="Username"),
 *     @OA\Response( response=200, description="Account is successfully fetched."),
 *      @OA\Response( response=400, description="Invalid Username"),
 *      @OA\Response( response=404, description="Account is not found" )
 *      )
 *   )
 */
//get instagram account data by username
Flight::route('GET /accounts/username/@username', function ($username) {
    Flight::json(Flight::instaAccService()->get_by_username($username));
});

/**
 * @OA\Put(
 *     path="/accounts/{id}", security={{"ApiKeyAuth": {}}},
 *       summary="Edit account data for one ID",
 *     description="Edit account",
 *     tags={"accounts"},
 *     @OA\Parameter(in="path", name="id", example=1, description="Account ID"),
 *     @OA\RequestBody(description="Account data", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *                  @OA\Property(property="username", type="string", example="firstname_lastname",	description="Username"),
 *    				@OA\Property(property="post_number", type="int", example="1",	description="Post number" ),
 *                   @OA\Property(property="followers_number", type="int", example="1",	description="Followers number" ),
 *                   @OA\Property(property="followings_number", type="int", example="1",	description="Followings number" ),
 *                   @OA\Property(property="date_and_time", type="string", example="2024-02-24",	description="Date and Time" ),
 *                   @OA\Property(property="stats", type="tinyint", example="1",	description="Updated or not" ),
 *        )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="Account has been edited"
 *     ),
 *     @OA\Response( response=400, description="Invalid ID"),
 *      @OA\Response( response=404, description="Account is not found" )
 * )
 */

//update instagram accounts
Flight::route("PUT /accounts/@id", function ($id) {
    $data = Flight::request()->data->getData();
    Flight::json(Flight::instaAccService()->update($data, $id));
});


/**
 * @OA\Delete(
 *     path="/accounts/{id}", security={{"ApiKeyAuth": {}}},
 * summary="Delete account data for one ID",
 *     description="Delete account",
 *     tags={"accounts"},
 *     @OA\Parameter(in="path", name="id", example=1, description="Account ID"),
 *     @OA\Response(
 *         response=200,
 *         description="Account has been deleted"
 *     ),
 *     @OA\Response( response=400, description="Invalid ID"),
 *      @OA\Response( response=404, description="Account is not found" )
 * )
 */

//delete instagram account
Flight::route("DELETE /accounts/@id", function ($id) {
    Flight::json(Flight::instaAccService()->customDelete($id));
});


/**
 * @OA\Get(path="/all_accounts/total/", tags={"accounts"}, security={{"ApiKeyAuth": {}}},
 *     summary="Return number of all accounts",
 *     @OA\Response( response=200, description="Accounts are successfully fetched."),
 *      @OA\Response( response=400, description="Invalid Usernames"),
 *      @OA\Response( response=404, description="Accounts are not found" )
 *      )
 *   )
 */


Flight::route('GET /all_accounts/total/', function () {
    Flight::json(Flight::instaAccService()->getTotalInstagramAccounts());
    
});



