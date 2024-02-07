<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require '../../vendor/autoload.php';
require "./services/BaseService.php";


// import and register all business logic files (services) to FlightPHP
require_once __DIR__ . '/services/UserService.php';


//register names that will be used for services and daos
Flight::register('userService', "UserService");
Flight::register('userDao', "UserDao");

//import all routes
require_once __DIR__ . '/routes/UserRoutes.php';

Flight::route('GET /', function(){
    //This is the most basic route to just check connection
    new UserService();
    
});


Flight::route('GET /connection-check', function(){
    /*Coonection check to see if deployed database works*/
      new UserService();
});
  

/* This is needed for swagger - REST API documentation endpoint */
Flight::route('GET /docs.json', function(){
    $openapi = \OpenApi\scan('routes');
    header('Content-Type: application/json');
    echo $openapi->toJson();
  });
  

Flight::start();



