<?php
require_once 'BaseService.php';
require_once __DIR__ . "/../dao/UserDao.class.php";
include (__DIR__ . '/validtlds.php');


use OTPHP\TOTP;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class UserService extends BaseService
{
    public function __construct()
    {
        parent::__construct(new UserDao);
    }



    private function checkPassword($password)
    {

        //start with the assumption, that the password is not pawned, 
        //if the password is pawned, output an appropriate message
        $pawned = false;

        $sha1Password = strtoupper(sha1($password));
        $prefix = substr($sha1Password, 0, 5);
        $suffix = substr($sha1Password, 5);
        $ch = curl_init("https://api.pwnedpasswords.com/range/" . $prefix);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);

        curl_close($ch);
        if ($response === false) {
            // Handle error; the request failed
            exit('Could not retrieve data from the API.');
        }
        if (str_contains($response, $suffix)) {
            $pawned = true;
        }

        return $pawned;
    }

    //I wrote this as well, as reusable funtion because I will need it for changing the password
    private function hashPassword($password)
    {
        //encrypt the password, that is not pawned using Bcrypt alg
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        return $hashedPassword;
    }


    private function checkExistenceForEmail($email_address)
    {
        $emailExistence = Flight::userDao()->checkExistenceForEmail($email_address);
        return $emailExistence;
    }


    //get the hashed password from the database
    private function getPassword($email_address)
    {

        $password = Flight::userDao()->getUserByEmail($email_address);

        return $password;
    }
    public function update($entity, $id, $id_column = "id")
    {
        //unset($entity['password']);
        //I turned off updating of password here because I will do that on seperate page
        $entity['password'] = md5($entity['password']);
        if (isset($entity['id_column']) && !is_null($entity['id_column'])) {
            return parent::update($entity, $id, $entity['id_column']);
        }
        return parent::update($entity, $id);
    }

    public function userDataUpdate($data)
    {
        $first_name = $data['first_name'];
        $last_name = $data['last_name'];
        $email_address = $data['email_address'];
        return $this->dao->userDataUpdate($first_name, $last_name, $email_address);
    }



    public function get_user_by_email($email)
    {
        return $this->dao->get_user_by_email($email);
    }

    private function checkEmail($email)
    {
        global $tld_array;
        //this is how it s recognizing varaible from another file

        //this function checks if the email is just in a valid form with one @ and then it goes .com or . something else
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        //Now, if the form of the email is correct, pursue further by checking the TLD of the email
        //here, file validtlds.php has to be included
        //I will take the last part of the current email and compare to see if it exists in the array of valid TLDs
        //I will separate the email into array by using explode function
        //Then I will take TLD, by applying end function to the array
        //End function works only for an array, and not for the string
        $email_array = explode(".", $email);
        $email_tld = end($email_array);

        //Here, it will be compared against imported list of valid TLDs from another file
        if (!in_array($email_tld, $tld_array)) {

            return false;
        }

        $domain_array = explode('@', $email);
        $domain = $domain_array[1];
        if (getmxrr($domain, $mx_details)) {
            if (count($mx_details) > 0) {
                return true;
            } else {
                return false;
            }

        }
    }

    private function checkPhoneNumber($phone)
    {
        $phone_util = \libphonenumber\PhoneNumberUtil::getInstance();
        try {
            $number_proto = $phone_util->parse($phone, "BA");
            if ($phone_util->getNumberType($number_proto) === \libphonenumber\PhoneNumberType::MOBILE) {
                //echo "Mobile phone number\n";
                return true;
            } else {
                //in cases where the phone number is not correct exit and show an error message
                //exit("Not mobile phone number\n");
                return false;
            }
        } catch (\libphonenumber\NumberParseException $e) {
            // exit($e->getMessage());
            return false;
        }
    }

    private function checkPlusSign($phone)
    {
        //substr(string, starting_index, length)
        $result = substr($phone, 0, 1) === '+';
        return $result;
    }

    private function generateOTPassword()
    {
        // A random secret will be generated from this.
        // You should store the secret with the user for verification.
        //The secret is a seperate function because it will be used for sending by email and password
        $otp = TOTP::generate();
        return $otp->getSecret();
        //echo "The OTP secret is: {$otp->getSecret()}\n";
    }



    public function register($data)
    {

        //extract individual attributes from JSON object
        $first_name = $data['first_name'];
        $last_name = $data['last_name'];
        $phone = $data["phone"];
        $email_address = $data['email_address'];
        $password = $data['password'];
        $reserved_names = array("admin", "root", "system", "administrator");

        $full_name = $first_name . " " . $last_name;


        if (empty($first_name) || empty($last_name) || empty($phone) || empty($email_address) || empty($password)) {
            return array("status" => 500, "message" => "All fields have to be filled in.");
        }

        if (!ctype_alpha($first_name)) {
            return array("status" => 500, "message" => "First name can only contain letters, no numbers, special characters and spaces.");
        }

        if (!ctype_alpha($last_name)) {
            return array("status" => 500, "message" => "Last name can only contain letters, no numbers, special characters and spaces.");
        }

        $emailResult = $this->checkEmail($email_address);

        if (!$emailResult) {
            return array("status" => 500, "message" => "Invalid email format");
        }

          //If result of phone check is true, then continue doing further
          $result = $this->checkPhoneNumber($phone);
          if (!$result) {
              //Flight::halt(500, "Phone number input invalid");
              return array("status" => 500, "message" => "Phone number input invalid");
              
          }
  
          //now, when we have checked that the phone number is in correct Bosnian form
          //I will check if the phone has that + sign in front of it.
  
          if (!($this->checkPlusSign($phone))) {
              //Flight::halt(500, "Please put a + sign in front of the phone number.");
              return array("status" => 500, "message" => "Please put a + sign in front of the phone number.");
          }
  


        if (mb_strlen($password) < 8) {
            return array("status" => 500, "message" => "The password should be at least 8 characters long");
        }


        $pawned = $this->checkPassword($password);
        //if the result is true, notify the user that the password is pawned and abort the mission
        //if the password is not pawned, hash it and store into database

        if ($pawned) {
            return (["status" => 500, "message" => "Password is pawned. Use another password."]);
        } else {

            $hashedPassword = $this->hashPassword($password);

            //change the value of the JSON object that contains password
            $data["password"] = $hashedPassword;

             //after hashing password, generate the OTP password as secret
             $secret = $this->generateOTPassword();
             $login_count = 0;
 
             //now, I have added these two new elements to the existing array and sent that to the database to be inserted
             $data["secret"] = $secret;
             $data["login_count"] = $login_count;
 
             //until the user clicks on the confirmation link, it will be unverified
             $data["verified"] = "unverified";
 
             //I am using uniqID function to create unique identifiers based on microseconds
             //Plus I added user_ and true parameter for more entropy to increase uniqnuess
             $register_token = uniqid('user_', true);
             $data["register_token"] = $register_token;
 

             //if the compiler has reached this point, it means that all requirements are satisified, and user can be added to the database
            // Add the user to the database via the parent class's add method
            $result = parent::add($data);

            if ($result['status'] === 500) {
                return array("status" => 500, "message" => $result["message"]);
            } 

            if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
                $url = "https://";
            } else {
                $url = "http://";
            }
            
            // Add the HTTP host (localhost or www.example.com, etc.)
            //$url .= $_SERVER['HTTP_HOST'];

            if ($_SERVER['HTTP_HOST'] === '127.0.0.1') {
                $url .= 'localhost:3000';
            }
            
            // Define the verification path directly
            $verificationPath = '/verifyAccount';
            
            // Combine URL with verification path and token
            $verificationLink = $url . $verificationPath . '?register_token=' . $register_token;
            
            $subject = "Confirm Register Verification";
            $body = "Please click the following link to verify your registration:<br><a href='$verificationLink'>Verify Registration By Clicking Here</a>";
            

            $this->send_email(Config::EMAIL1(), $subject, $email_address, $full_name, $body);
 
             $result["message"] .= " Confirm your account registration through email.";
             return array("status" => $result["status"], "message" => $result["message"]);
         }
     }
 


    public function login($data)
    {
        $email_address = $data['email_address'];
        //here, we will check if username is actually username or email
        $password = $data['password'];

        if (empty($email_address) || empty($password)) {
            exit("All fields have to be filled in.");
        }

        if (!filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
            exit("This is invalid email format.");
        }

        //if user is logging in with email, I will first check if this email exists
        //if it, exists we will retrieve its password and verify it
        //if the email does not exist, I will show appropriate message on the screen

        $emailExistence = $this->checkExistenceForEmail($email_address);

        if ($emailExistence == 1) {

            $hashedPassword = $this->getPassword($email_address);

            if (password_verify($data["password"], $hashedPassword)) {
                //encode only email address
                $jwt = JWT::encode([$email_address], Config::JWT_SECRET(), 'HS256');
                $data = $this->dao->get_user_by_email($email_address);
                // print_r($data["message"][0]["first_name"]);
                //die();
                return array("status" => 200, "token" => $jwt, "first_name" => $data["message"][0]["first_name"], "last_name" => $data["message"][0]["last_name"], "email" => $email_address);
                //return array("status" => 200, "message" => "Correct password! Logging in...");
            } else {
                return array("status" => 500, "message" => "Invalid password");
            }
        } else {

            return array("status" => 500, "message" => "This email does not exist");
        }
    }

    public function userData()
    {
        $all_headers = getallheaders();
        $token = $all_headers('Authorization');
        //MOZDA OVE DVIJE LINIJE NECE RADITI


        //$decoded = JWT::decode($data->token, $key, array('HS256'));
        $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));
        //this decoded is the email once again
        //connect to the database and extract first and last name based on the email
        $data = $this->dao->get_user_by_email($decoded);

        //now, we are returning first, and last name and password
        return array($data['first_name'], $data['last_name'], $decoded);
    }

    private function send_email($senderEmail, $title, $recipientEmail, $recipientName, $description)
    {
        $mail = new PHPMailer(true);
        try {
            //Server settings
            //$mail->SMTPDebug = SMTP::DEBUG_SERVER; //Enable verbose debug output
            $mail->SMTPDebug = SMTP::DEBUG_OFF; //Enable verbose debug output
           

            $mail->isSMTP(); //Send using SMTP
            $mail->Host = Config::SMTP_HOST(); //Set the SMTP server to send through
            $mail->SMTPAuth = true; //Enable SMTP authentication
            $mail->Username = Config::SMTP_USERNAME(); //SMTP username
            $mail->Password = Config::SMTP_PASSWORD(); //SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            //$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; //Enable implicit TLS encryption
            $mail->Port = Config::SMTP_PORT();

            //Recipients
            $mail->setFrom($senderEmail, $title);
            $mail->addAddress($recipientEmail, $recipientName);

            //Content
            $mail->isHTML(true);
            $mail->Subject = $title;
            $mail->Body = $description;
            $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}\n");
            return false;
            //echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
    }


    public function sendemailtocustomerservice($data)
    {
        $title = $data["title"];
        $description = $data["description"];

        $recipientEmail = Config::EMAIL1();

        $all_headers = getallheaders();

        $token = $all_headers['Authorization'];

        $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));

        $senderEmail = $decoded[0];

        if (!isset($title) || !isset($description)) {
            return array("status" => 500, "message" => "Fields cannot be empty.");
        }

        $result = $this->send_email($senderEmail, $title, $recipientEmail, "Customer Service Center", $description);

        if ($result) {
            return array("status" => 200, "message" => "Success! Email is sent.");
        } else {
            return array("status" => 500, "message" => "Error! Email was not sent.");
        }


    }

}
