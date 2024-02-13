<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require '../../vendor/autoload.php';
require "./services/BaseService.php";

// import and register all business logic files (services) to FlightPHP
require_once __DIR__ . '/services/UserService.php';
require_once __DIR__ . '/services/InstaAccService.php';

//register names that will be used for services and daos
Flight::register('userService', "UserService");
Flight::register("instaAccService", "InstaAccService");
Flight::register('userDao', "UserDao");

//import all routes
require_once __DIR__ . '/routes/UserRoutes.php';
require_once __DIR__ . '/routes/InstaAccRoutes.php';

Flight::route('GET /', function(){
    //This is the most basic route to just check connection
    new UserService();
    
});


Flight::route('GET /connection-check', function(){
    /*Coonection check to see if deployed database works*/
      new UserService();
});
  


/* This is needed for swagger - REST API documentation endpoint */
/* REST API documentation endpoint */
Flight::route('GET /swagger.json', function(){
  $openapi = \OpenApi\Generator::scan(['routes']);
  header('Content-Type: application/json');
  file_put_contents(__DIR__ . '/swagger.json', $openapi->toJson());
  readfile(__DIR__ . '/swagger.json');
 //echo $openapi->toJson();
});


  

Flight::start();



