<?php
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

//get number of instagram accounts connected to hashtag id
Flight::route('GET /accountsperhashtag/@id', function ($id) {
    Flight::json(Flight::instaHashService()->getAccountsPerHashtag($id));
});


/**
 * @OA\Get(path="/accountsdataperhashtag/{id}", tags={"hashtags"}, security={{"ApiKeyAuth": {}}},
 *     summary="Return data of account for specific hashtag  ID",
 *     @OA\Parameter(in="path", name="id", example=1, description="Hashtag ID"),
 *     @OA\Response( response=200, description="Data of account is successfully fetched."),
 *      @OA\Response( response=400, description="Invalid ID"),
 *      @OA\Response( response=404, description="Data is not found" )
 *      )
 *   )
 */

//get data of instagram accounts of hashtag id
Flight::route('GET /accountsdataperhashtag/@id', function ($id) {
    Flight::json(Flight::instaHashService()->getAccountsDataPerHashtag($id));
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
Flight::route("DELETE /hashtags/@id", function ($id) {
    Flight::json(Flight::instaHashService()->customDelete($id));
});


/**
 * @OA\Post(
 *     path="/hashtags",
 *     security={{"ApiKeyAuth": {}}},
 *     summary="Add a new hashtag to the database",
 *     description="Add a new hashtag",
 *     tags={"hashtags"},
 *     @OA\RequestBody(
 *         description="Add new hashtag",
 *         required=true,
 *         @OA\MediaType(
 *             mediaType="application/json",
 *             @OA\Schema(
 *                 @OA\Property(
 *                     property="hashtag_name",
 *                     type="string",
 *                     example="summer",
 *                     description="Hashtag's value"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Hashtag has been added"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid API request"
 *     )
 * )
 */
Flight::route('POST /hashtags/@hashtag', function ($hashtag) {

    Flight::json(Flight::instaHashService()->customAdd($hashtag));
});

/**
 * @OA\Get(path="/all_hashtags/",  security={{"ApiKeyAuth": {}}},
 *     summary="Return all hashtags",
 *     @OA\Response( response=200, description="All hashtags are successfully fetched."),
 *      @OA\Response( response=400, description="Invalid ID"),
 *      @OA\Response( response=404, description="Data is not found" )
 *      )
 *   )
 */


Flight::route('GET /all_hashtags/', function () {
    Flight::json(Flight::instaHashService()->getTotalHashtags());
    
});