<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require '../../vendor/autoload.php';

// import and register all business logic files (services) to FlightPHP
require "./services/BaseService.php";
require_once __DIR__ . '/services/UserService.php';
require_once __DIR__ . '/services/InstaAccService.php';
require_once __DIR__ . '/services/InstaHashService.php';
require_once __DIR__ . '/services/DmService.php';
require_once __DIR__ . '/../../config.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

//register names that will be used for services and daos
Flight::register('userService', "UserService");
Flight::register("instaAccService", "InstaAccService");
Flight::register("instaHashService", "InstaHashService");
Flight::register("dmService", "DmService");
Flight::register('userDao', "UserDao");
Flight::register('dmDao', "DmDao");

//import all routes
require_once __DIR__ . '/routes/UserRoutes.php';
require_once __DIR__ . '/routes/InstaAccRoutes.php';
require_once __DIR__ . '/routes/DmRoutes.php';
require_once __DIR__ . '/routes/HashtagRoutes.php';

function allow_preflight()
{
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Headers: *');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: *');
    echo "ok";
    die();
  } else {
    header("Access-Control-Allow-Headers: *");
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: *');
  }
}
allow_preflight();

// function allow_preflight()
// {
//   $allowed_origins = ['http://localhost:3000', 'http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/ ']; // Add allowed origins
//   $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

//   if (in_array($origin, $allowed_origins)) {
//     header('Access-Control-Allow-Origin: ' . $origin);
//   }

//   header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
//   header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

//   if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     header('HTTP/1.1 200 OK');
//     die();
//   }
// }

// allow_preflight();


Flight::route('GET /', function () {
  //This is the most basic route to just check connection
  new UserService();
});


Flight::route('GET /connection-check', function () {
  /*Coonection check to see if deployed database works*/
  new UserService();
});

/* This is needed for swagger - REST API documentation endpoint */
/* REST API documentation endpoint */
// Flight::route('GET /docs.json', function () {
//   $openapi = \OpenApi\Generator::scan(['routes']);
//   header('Content-Type: application/json');
//   echo $openapi->toJson();
// });

Flight::route('GET /docs.json', function () {
  $openapi = \OpenApi\scan('routes');
  header('Content-Type: application/json');
  echo $openapi->toJson();
});

Flight::start();
