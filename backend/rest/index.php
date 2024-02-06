<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require '../../vendor/autoload.php';
require "./service/BaseService.php";


Flight::route('GET /', function(){
    /*
    * This endpoint prints  whether connection is successfully established or not
    */

    new BaseService();
});


Flight::start();


?>
