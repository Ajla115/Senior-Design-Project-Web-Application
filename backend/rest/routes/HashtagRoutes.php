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
 * @OA\Get(path="/hashtags", tags={"hashtags"}, security={{"ApiKeyAuth": {}}},
 *          summary="Return all active hashtags from the API. ",
 *          @OA\Response( response=200, description="List of active hashtags."),
 *           @OA\Response( response=400, description="Invalid API request"),
 *           @OA\Response( response=404, description="Hashtags not found" )
 *     )
 * )
 */

//get all instagram hashtags
Flight::route('GET /hashtags', function () {
    Flight::json(Flight::instaHashService()->getActiveHashtags());
});


/**
 * @OA\Get(path="/accountperhashtag/{id}", tags={"hashtags"}, security={{"ApiKeyAuth": {}}},
 *     summary="Return number of accounts for specific hashtag  ID",
 *     @OA\Parameter(in="path", name="id", example=1, description="Hashtag ID"),
 *     @OA\Response( response=200, description="Number of accounts is successfully fetched."),
 *      @OA\Response( response=400, description="Invalid ID"),
 *      @OA\Response( response=404, description="Data is not found" )
 *      )
 *   )
 */

//get instagram account data by id
Flight::route('GET /accountperhashtag/@id', function ($id) {
    Flight::json(Flight::instaHashService()->getAccountsPerHashtag($id));
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
    Flight::instaAccService()->customDelete($id);
});


