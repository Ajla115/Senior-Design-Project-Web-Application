<?php
/**
 * @OA\Post(
 *     path="/dm",
 *     security={{"ApiKeyAuth": {}}},
 *     summary="Add a new direct message",
 *     description="Add a new dm",
 *     tags={"dms"},
 *     @OA\RequestBody(
 *         description="Add new dm",
 *         required=true,
 *         @OA\MediaType(
 *             mediaType="application/json",
 *             @OA\Schema(
 *                 @OA\Property(
 *                     property="users_id",
 *                     type="int",
 *                     example="1",
 *                     description="Users ID"
 *                 ),
 *                @OA\Property(
 *                     property="users_email",
 *                     type="string",
 *                     example="demo@gmail.com",
 *                     description="Users email"
 *                 ),
 *               @OA\Property(
 *                     property="users_password",
 *                     type="string",
 *                     example="abcde",
 *                     description="Users password"
 *                 ),
 *               @OA\Property(
 *                     property="usernames",
 *                     type="string",
 *                     example="['firstname_lastname']",
 *                     description="Recipients Usernames"
 *                 ),
 *                @OA\Property(
 *                     property="message",
 *                     type="string",
 *                     example="Hello World",
 *                     description="Message Content"
 *                 ),
 *                @OA\Property(
 *                     property="date_and_time",
 *                     type="string",
 *                     example="2024-02-24",
 *                     description="Date and time of message"
 *                 ),
 *                @OA\Property(
 *                     property="status",
 *                     type="string",
 *                     example="[Sent, Scheduled, Canceled]",
 *                     description="Message Status"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Direct Message has been added"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid API request"
 *     )
 * )
 */

//route to add DM to the database
//however, we are sending an array of recipients ids and they have to be split in the database 
//one row --> one recipient
Flight::route('POST /dm', function () {
    $data = Flight::request()->data->getData();
    Flight::json(Flight::dmService()->splitAndAdd($data));
});


/**
 * @OA\Delete(
 *     path="/dm/bulkDelete",
 *     security={{"ApiKeyAuth": {}}},
 *     summary="Delete multiple scheduled DMs at the same time",
 *     description="Delete dms",
 *     tags={"dms"},
 *     @OA\RequestBody(
 *         description="Delete dms",
 *         required=true,
 *         @OA\MediaType(
 *             mediaType="application/json",
 *             @OA\Schema(
 *                 @OA\Property(
 *                     property="dm_ids",
 *                     type="int",
 *                     example="[1, 2, 3]",
 *                     description="DMs ID"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="DMs have been deleted"
 *     ),
 *     @OA\Response(response=400, description="Invalid ID"),
 *     @OA\Response(response=404, description="DM is not found")
 * )
 */


//bulk delete to delete multiple dms at the same time
Flight::route('DELETE /dm/bulkDelete', function () {
    $data = Flight::request()->data->getData();
    Flight::json(Flight::dmService()->bulkDelete($data));
});


/**
 * @OA\Delete(
 *     path="/dm/{id}", security={{"ApiKeyAuth": {}}},
 *     summary="Delete one scheduled DM",
 *     description="Delete one DM",
 *     tags={"dms"},
 *     @OA\Parameter(in="path", name="id", example=1, description="Direct Message ID"),
 *     @OA\Response(
 *         response=200,
 *         description="DM has been deleted"
 *     ),
 *     @OA\Response( response=400, description="Invalid ID"),
 *      @OA\Response( response=404, description="DM is not found" )
 * )
 */

//route to delete DM per id, however only scheduled and not sent DMs can be deleted
Flight::route('DELETE /dm/@id', function ($id) {
    Flight::json(Flight::dmService()->deleteScheduled($id));
});

/**
 * @OA\Put(
 *     path="/dm/bulkUpdate", security={{"ApiKeyAuth": {}}},
 *     summary="Edit data for muliple DMs",
 *     description="Edit multiple DMs at the same time",
 *     tags={"dms"},
 *     @OA\RequestBody(description="Direct messages data", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *                      @OA\Property(
 *                     property="dm_ids",
 *                     type="int",
 *                     example="[1,2,3]",
 *                     description="DM"
 *                 ),
 *                  @OA\Property(
 *                     property="users_id",
 *                     type="int",
 *                     example="1",
 *                     description="Users ID"
 *                 ),
 *                @OA\Property(
 *                     property="users_email",
 *                     type="string",
 *                     example="demo@gmail.com",
 *                     description="Users email"
 *                 ),
 *               @OA\Property(
 *                     property="users_password",
 *                     type="string",
 *                     example="abcde",
 *                     description="Users password"
 *                 ),
 *               @OA\Property(
 *                     property="usernames",
 *                     type="string",
 *                     example="['firstname_lastname']",
 *                     description="Recipients Usernames"
 *                 ),
 *                @OA\Property(
 *                     property="message",
 *                     type="string",
 *                     example="Hello World",
 *                     description="Message Content"
 *                 ),
 *                @OA\Property(
 *                     property="date_and_time",
 *                     type="string",
 *                     example="2024-02-24",
 *                     description="Date and time of message"
 *                 ),
 *                @OA\Property(
 *                     property="status",
 *                     type="string",
 *                     example="[Sent, Scheduled, Canceled]",
 *                     description="Message Status"
 *                 )
 *        )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="Direct messages have  been bulk edited"
 *     ),
 *     @OA\Response( response=400, description="Invalid IDs"),
 *      @OA\Response( response=404, description="Direct messages have  not found" )
 * )
 */


//route to do bulk update of DMs based on recipients IDs
//but first checks if this username exists in the instagram_accounts table
//if it exists, take its ID, if it does not exist, add it to the instagram accounts table first and then to user_dms
Flight::route("PUT /dm/bulkUpdate", function () {
    $data = Flight::request()->data->getData();
    Flight::json(Flight::dmService()->checkRecipientsAndUpdateDM($data));
});


/**
 * @OA\Put(
 *     path="/dm/{id}", security={{"ApiKeyAuth": {}}},
 *     summary="Edit data for one DM based on its ID",
 *     description="Edit dm",
 *     tags={"dms"},
 *     @OA\Parameter(in="path", name="id", example=1, description="Direct Message ID"),
 *     @OA\RequestBody(description="Direct message data", required=true,
 *       @OA\MediaType(mediaType="application/json",
 *    			@OA\Schema(
 *                  @OA\Property(
 *                     property="users_id",
 *                     type="int",
 *                     example="1",
 *                     description="Users ID"
 *                 ),
 *                @OA\Property(
 *                     property="users_email",
 *                     type="string",
 *                     example="demo@gmail.com",
 *                     description="Users email"
 *                 ),
 *               @OA\Property(
 *                     property="users_password",
 *                     type="string",
 *                     example="abcde",
 *                     description="Users password"
 *                 ),
 *               @OA\Property(
 *                     property="usernames",
 *                     type="string",
 *                     example="['firstname_lastname']",
 *                     description="Recipients Usernames"
 *                 ),
 *                @OA\Property(
 *                     property="message",
 *                     type="string",
 *                     example="Hello World",
 *                     description="Message Content"
 *                 ),
 *                @OA\Property(
 *                     property="date_and_time",
 *                     type="string",
 *                     example="2024-02-24",
 *                     description="Date and time of message"
 *                 ),
 *                @OA\Property(
 *                     property="status",
 *                     type="string",
 *                     example="[Sent, Scheduled, Canceled]",
 *                     description="Message Status"
 *                 )
 *        )
 *     )),
 *     @OA\Response(
 *         response=200,
 *         description="Direct message has been edited"
 *     ),
 *     @OA\Response( response=400, description="Invalid ID"),
 *      @OA\Response( response=404, description="Direct message is not found" )
 * )
 */


//route to update DM per id, however only scheduled and not sent DMs can be edited
//Update a single DM that has only one message
Flight::route("PUT /dm/@id", function ($id) {
    $data = Flight::request()->data->getData();
    Flight::json(Flight::dmService()->checkRecipientsAndUpdateDMIndividually($data, $id));
});



