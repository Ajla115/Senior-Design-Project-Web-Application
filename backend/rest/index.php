<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require '../../../vendor/autoload.php';


// it is still possible to add custom routes after the imports
/*Flight::route('GET /', function () {
    //$base = new BaseDao("customers"); ovo je mali hack da se pozove base dao samo na jednu tabelu
});*/


Flight::start();
?>
