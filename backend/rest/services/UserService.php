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
        try {
            $first_name = $data['first_name'];
            $last_name = $data['last_name'];
            $new_email_address = $data['email_address'];
            $phone = $data["phone"];


            $all_headers = getallheaders();

            if (!isset($all_headers['Authorization'])) {
                throw new Exception('Authorization token not provided');
            }

            $token = $all_headers['Authorization'];

            $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));

            $current_email = $decoded[0];


            if (empty($first_name) || empty($last_name) || empty($phone) || empty($new_email_address)) {
                return array("status" => 400, "message" => "All fields have to be filled in.");
            }

            if (!ctype_alpha($first_name) || !ctype_alpha($last_name)) {
                return array("status" => 400, "message" => "First and last name fields can only contain letters, no numbers, special characters and spaces.");
            }

            $emailResult = $this->checkEmail($new_email_address);

            if (!$emailResult) {
                return array("status" => 400, "message" => "Invalid email format");
            }
            $result = $this->checkPhoneNumber($phone);
            if (!$result) {
                return array("status" => 400, "message" => "Phone number input invalid");

            }

            if (!($this->checkPlusSign($phone))) {
                return array("status" => 400, "message" => "Please put a + sign in front of the phone number.");
            }

            $result = $this->dao->userDataUpdate($first_name, $last_name, $new_email_address, $phone, $current_email);

            if ($result["status"] == 200) {
                return array("status" => 200, "message" => "User data has been successfully updated.");
            } else {
                return array("status" => 400, "message" => $result["message"]);
            }
        } catch (Exception $e) {
            return array("status" => 500, "message" => $e->getMessage());
        }
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





            //until the user clicks on the confirmation link, it will be unverified
            $data["status"] = "unverified";

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

    private function getStatusByEmail($email)
    {
        return $this->dao->getStatusByEmail($email);
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

            $statusResult = $this->getStatusByEmail($email_address);

            if ($statusResult['status'] == 200 && $statusResult['data'] != 'verified') {
                return array("status" => 500, "message" => "Only verified accounts can login.");
            }

            $hashedPassword = $this->getPassword($email_address);

            if (password_verify($data["password"], $hashedPassword)) {
                //encode only email address
                $data = $this->dao->get_user_by_email($email_address);

                $data2 = array($data["message"][0]["email_address"], $data["message"][0]["first_name"], $data["message"][0]["last_name"], $data["message"][0]["phone"]);

                $jwt = JWT::encode($data2, Config::JWT_SECRET(), 'HS256');

                // print_r($data["message"][0]["first_name"]);
                //die();

                return array("status" => 200, "token" => $jwt, "first_name" => $data["message"][0]["first_name"], "last_name" => $data["message"][0]["last_name"], "email" => $data["message"][0]["email_address"], "phone" => $data["message"][0]["phone"]);

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
        try {
            $title = $data["title"];
            $description = $data["description"];

            $recipientEmail = Config::EMAIL1();


            $all_headers = getallheaders();

            if (!isset($all_headers['Authorization'])) {
                throw new Exception('Authorization token not provided');
            }


            $token = $all_headers['Authorization'];

            $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));

            $senderEmail = $decoded[0];

            if (empty($title) || empty($description)) {
                return array("status" => 500, "message" => "Fields cannot be empty.");
            }

            $result = $this->send_email($senderEmail, $title, $recipientEmail, "Customer Service Center", $description);

            if ($result) {
                return array("status" => 200, "message" => "Success! Email is sent.");
            } else {
                return array("status" => 500, "message" => "Error! Email was not sent.");
            }
        } catch (Exception $e) {
            error_log($e->getMessage());
            return array("status" => 500, "message" => $e->getMessage());
        }



    }


    public function markUserAsDeleted()
    {

        try {
            $all_headers = getallheaders();

            if (!isset($all_headers['Authorization'])) {
                throw new Exception('Authorization token not provided');
            }


            $token = $all_headers['Authorization'];

            $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));

            $senderEmail = $decoded[0];

            $result = $this->dao->markUserAsDeleted($senderEmail);

            if ($result["status"] == 200) {
                return array("status" => 200, "message" => "Your account has been successfully deleted.");
            } else {
                return array("status" => 400, "message" => $result["message"]);
            }
        } catch (Exception $e) {
            error_log($e->getMessage());
            return array("status" => 500, "message" => $e->getMessage());
        }


    }

    public function verifyAccount($data)
    {
        $url = $data["register_token"];
        $result = $this->dao->verifyAccount($url);
        if ($result["status"] == 200) {
            return array("status" => 200, "message" => "Account has been verified.");
        } else if ($result["status"] == 400) {
            return array("status" => 400, "message" => "Account is already verified.");
        } else {
            return array("status" => 500, "message" => $result["message"]);
        }
    }

    private function updatePassword($password, $email)
    {
        $result = Flight::userDao()->updatePassword($password, $email);
        return $result;
    }



    public function changePassword($data)
    {
        try {
            $all_headers = getallheaders();

            if (!isset($all_headers['Authorization'])) {
                throw new Exception('Authorization token not provided');
            }

            $token = $all_headers['Authorization'];


            $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));

            $userEmail = $decoded[0];

            if (empty($data['password']) || empty($data['new_password']) || empty($data['repeat_password'])) {
                return array("status" => 500, "message" => "Fields cannot be empty");
            }

            // Now I will extract all data about the user just based on the email, using already created function
            $user = $this->get_user_by_email($userEmail);
            $full_name = $user["message"][0]["first_name"] . " " . $user["message"][0]["last_name"];

            // First compare, if the password saved in the database is it same with the password that the user entered for old value
            if (!password_verify($data["password"], $user["message"][0]["password"])) {
                return array("status" => 500, "message" => "Password does not match saved password.");
            }

            // Check if the new and repeated password are the same
            if (!hash_equals($data["new_password"], $data["repeat_password"])) {
                return array("status" => 500, "message" => "New and repeated password are not the same.");
            }

            // Now check if the new password fits the criteria
            if (mb_strlen($data["new_password"]) < 8) {
                return array("status" => 500, "message" => "The password should be at least 8 characters long");
            }

            $pawned = $this->checkPassword($data["new_password"]);

            if ($pawned) {
                return array("status" => 500, "message" => "Password is pawned. Use another password.");
            } else {
                $hashedPassword = $this->hashPassword($data["new_password"]);

                $daoResult = $this->updatePassword($hashedPassword, $userEmail);

                if ($daoResult["status"] == 500) {
                    return array("status" => 500, "message" => $daoResult["message"]);
                } else if ($daoResult["status"] == 200) {
                    $subject = "Successful password change.";
                    $body = "Your password has been successfully updated.";
                    $this->send_email(Config::EMAIL1(), $subject, $userEmail, $full_name, $body);
                }
                return array("status" => $daoResult["status"], "message" => $daoResult["message"]);
            }
        } catch (Exception $e) {
            error_log($e->getMessage());
            return array("status" => 500, "message" => "Internal Server Error.");
        }
    }

    public function totalUsers()
    {
        $rows = $this->dao->getTotalUsers();
        return array("status" => 200, "message" => $rows);
    }

    public function forgetPassword($data)
    {

        if (empty($data['email'])) {
            return array("status" => 500, "message" => "Email field is empty");
        }

        //first check if email is in the correct form
        if (!($this->checkEmail($data["email"]))) {
            return array("status" => 500, "message" => "Invalid email format.");
        }

        //now check if user with this email exists
        if (!($this->checkExistenceForEmail($data["email"]))) {
            return array("status" => 500, "message" => "Email does not exist.");
        }

        $verificationResult = Flight::userDao()->checkVerificationStatus($data["email"]);

        if ($verificationResult["status"] !== 200) {
            return array("status" => $verificationResult["status"], "message" => $verificationResult["message"]);
        }

        $recipient = Flight::userDao()->get_user_by_email($data["email"]);

        $recipientName = $recipient["message"][0]["first_name"] . " " . $recipient["message"][0]["last_name"];


        //ovo je da bude samo 2 pokusaja u 10 minuta
        if (Flight::userDao()->checkTimeForRequests($data["email"])) {
            return array("status" => 500, "message" => "You can only make two requests within 10 minutes. Please try again later.");
        }

        //When, all requirements have been satisified, then create a JWT token with expiration

        $issue_time = time(); //issued at
        $expiration_time = $issue_time + 300;  //300 seconds are 5 minutes
        $userData = [
            'email' => $data['email'],
            'exp' => $expiration_time,
            'iat' => $issue_time  //I also added issued at claim
        ];

        $expirationJWT = JWT::encode($userData, CONFIG::JWT_SECRET(), 'HS256');

        if (!Flight::userDao()->saveExpirationTokenAndCount($expirationJWT, $data["email"])) {
            return array("status" => 500, "message" => "Saving of token to the database failed.");
        }

        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
            $url = "https://";
        } else {
            $url = "http://";
        }

        if ($_SERVER['HTTP_HOST'] === '127.0.0.1') {
            $url .= 'localhost:3000';
        }

        // Define the verification path directly
        $verificationPath = '/resetPassword';

        // Combine URL with verification path and token
        $verificationLink = $url . $verificationPath . '?activation_token=' . $expirationJWT;

        $subject = "Reset Your Password";
        $body = "Please click the following link to reset your password:<br><a href='$verificationLink'>Reset Your Password By Clicking Here</a>";

        $this->send_email(Config::EMAIL1(), $subject, $data['email'], $recipientName, $body);

        return array("status" => 200, "message" => "Check your email");

    }

    public function resetPassword($data)
    {
        try {
            //first, I need to check if the token is valid AKA can it be related to any of the tokens in database
            $result = Flight::userDao()->checkTokenExistence($data["activation_token"]);

            //if the token does not exist, stop action
            if ($result["status"] !== 200) {
                return array("status" => 500, "message" => $result["message"]);
            }

            //ako je vrijednost 1, znaci da je vec koristeno, ali ako je nula onda se moze nastaviti koristiti
            $result2 = Flight::userDao()->checkTokenCount($data["activation_token"]);

            if (isset($result2) && $result2["status"] !== 200) {
                return array("status" => 500, "message" => $result2["message"]);
            }

            // if (isset($result3) && $result3["status"] !== 200) {
            //     Flight::halt($result2["status"], $result2["message"]);
            // }
            $decoded = (array) JWT::decode($data["activation_token"], new Key(Config::JWT_SECRET(), 'HS256'));
            
            $userEmail = $decoded['email'];
            
            //$decoded["email"]

            //trebalo bi po defaultu da tokena izbaci
            //if token exists, check if it has expired
            // $current_time = time();
            // if($decoded["exp"] < $current_time){
            //     Flight::halt(500, "Session has expired.");
            // }

            if (empty($data['new_password']) || empty($data['repeat_password'])) {
                return array("status" => 500, "message" => "Fields cannot be empty.");
            }

            //check if the new and repeated password are the same
            if (!hash_equals($data["new_password"], $data["repeat_password"])) {
                return array("status" => 500, "message" => "New and repeated password are not the same.");
            }

            //now check if the new password  fits the criteria
            if (mb_strlen($data["new_password"]) < 8) {
                return array("status" => 500, "message" => "The password should be at least 8 characters long.");
            }

            $pawned = $this->checkPassword($data["new_password"]);

            if ($pawned) {
                return array("status" => 500, "message" => "Password is pawned. Use another password.");
            } else {

                $hashedPassword = $this->hashPassword($data["new_password"]);

                $recipient = Flight::userDao()->get_user_by_email($userEmail);

                $recipientName = $recipient["message"][0]["first_name"] . " " . $recipient["message"][0]["last_name"];


                //this decodedUser[2] is the email so I am sending it as a verification to know whose user's password I am updating because emails are unique
                $daoResult = Flight::userDao()->updatePassword($hashedPassword, $userEmail);
                if ($daoResult["status"] == 500) {
                    return array("status" => 500, "message" => $daoResult["message"]);
                    //for successul password change, send an email
                } else if ($daoResult["status"] == 200) {
                    $subject = "Successul password change.";
                    $body = "Your password has been successfully updated.";
                    $this->send_email(Config::EMAIL1(), $subject, $userEmail, $recipientName, $body);

                }
                $result3 = Flight::userDao()->updateTokenCount($data["activation_token"]);
                if ($result3["status"] !== 200) {
                    return array("status" => 500, "message" => $result3["message"]);
                }
                return array("status" => 200, "message" => "Password successfully updated");

            }

        } catch (Exception $e) {
            error_log($e->getMessage());
            Flight::halt(500, json_encode([
                'error' => true,
                'message' => 'Token has expired.'
            ]));
        }
    }







}
