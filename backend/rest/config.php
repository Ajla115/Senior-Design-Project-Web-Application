<?php
class Config
{
    // $host = 'localhost' might not work, use '127.0.0.1' if that is the case

    // public static $host = '127.0.0.1';
    // public static $schema = 'sdp_project';
    // public static $username = 'root';
    // public static $password = 'a1b2c3d4e5';
    // public static $port = '3306';


    //This part below will be used when deploying the whole project with digital ocean
   public static function DB_HOST(){
        return Config::get_env("DB_HOST", "127.0.0.1");
    }

    public static function DB_USERNAME(){
        return Config::get_env("DB_USERNAME", "root");
    }

    public static function DB_PASSWORD(){
        return Config::get_env("DB_PASSWORD", "a1b2c3d4e5");
    }

    public static function DB_SCHEME(){
        return Config::get_env("DB_SCHEME", "sdp_project");
    }

    public static function DB_PORT(){
        return Config::get_env("DB_PORT", "3306");
    }
    //This I don't need at the moment, but will be needed with deployment to DO
    public static function JWT_SECRET(){
        return Config::get_env("JWT_SECRET", "web");
    }

    public static function get_env($name, $default){
        return isset($_ENV[$name]) && trim($_ENV[$name]) != ' ' ? $_ENV[$name] : $default;
    }

}

?>
