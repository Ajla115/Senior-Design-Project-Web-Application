<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require '../../vendor/autoload.php';
require "./services/BaseService.php";


// import and register all business logic files (services) to FlightPHP
require_once __DIR__ . '/services/UserService.php';
//require_once __DIR__ . '/dao/UserDao.php';

//register names that will be used for services and daos
Flight::register('userService', "UserService");
Flight::register('userDao', "UserDao");

//import all routes
require_once __DIR__ . '/routes/UserRoutes.php';

Flight::route('GET /', function(){
    /*
    * This endpoint prints  whether connection is successfully established or not
    */
    new UserService();
    
});

Flight::route('GET /s', function(){
    /*
    * This endpoint prints  whether connection is successfully established or not
    */
    Flight::json('test');
    new UserService();
    
});

Flight::route('GET /connection-check', function(){
    /*Coonection check to see if deployed database works*/
      new UserService();
  });
  

Flight::start();



