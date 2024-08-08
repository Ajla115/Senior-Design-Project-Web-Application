<?php


//please change the name to config.php
//add the file to .gitignore
class Config
{

   public static function DB_HOST(){
        return Config::get_env("DB_HOST", "");
    }

    public static function DB_USERNAME(){
        return Config::get_env("DB_USERNAME", "");
    }

    public static function DB_PASSWORD(){
        return Config::get_env("DB_PASSWORD", "");
    }

    public static function DB_SCHEME(){
        return Config::get_env("DB_SCHEME", "");
    }

    public static function DB_PORT(){
        return Config::get_env("DB_PORT", "");
    }
    public static function JWT_SECRET(){
        return Config::get_env("JWT_SECRET", "");
    }

    public static function SMTP_HOST(){
        return Config::get_env("SMTP_HOST", "");
    }

    public static function SMTP_USERNAME(){
        return Config::get_env("SMTP_USERNAME", "");
    }

    public static function SMTP_PASSWORD(){
        return Config::get_env("SMTP_PASSWORD", "");
    }

    public static function SMTP_PORT(){
        return Config::get_env("SMTP_PORT", "");
    }

    public static function EMAIL1(){
        return Config::get_env("EMAIL1", "");
    }


    public static function get_env($name, $default){
        return isset($_ENV[$name]) && trim($_ENV[$name]) != ' ' ? $_ENV[$name] : $default;
    }

}


