<?php

//route to add DM to the database
Flight::route('POST /dm', function () {
    $data = Flight::request()->data->getData();
    Flight::json(Flight::dmService()->add($data));
});







