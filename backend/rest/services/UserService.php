<?php
require_once 'BaseService.php';
require_once __DIR__ . "/../dao/UserDao.class.php";



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
        //I will do forget your password flow on the another page, but I will leave updating of password available also here
        $entity['password'] = md5($entity['password']);
        if (isset($entity['id_column']) && !is_null($entity['id_column'])) {
            return parent::update($entity, $id, $entity['id_column']);
        }
        return parent::update($entity, $id);
    }

    public function userDataUpdate($data){
        $first_name = $data['first_name'];
        $last_name = $data['last_name'];
        $email_address = $data['email_address'];
        return $this->dao->userDataUpdate($first_name, $last_name, $email_address);
    }
    


    public function get_user_by_email($email)
    {
        return $this->dao->get_user_by_email($email);
    }


    public function register($data)
    {

        //extract individual attributes from JSON object
        $first_name = $data['first_name'];
        $last_name = $data['last_name'];
        $email_address = $data['email_address'];
        $password = $data['password'];

        if (empty($first_name) || empty($last_name) || empty($email_address) || empty($password)) {
            return array("status" => 500, "message" => "All fields have to be filled in.");
        }

        if (!ctype_alpha($first_name)) {
            return array("status" => 500, "message" => "First name can only contain letters, no numbers, special characters and spaces.");
        }

        if (!ctype_alpha($last_name)) {
            return array("status" => 500, "message" => "Last name can only contain letters, no numbers, special characters and spaces.");
        }

        if (!filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
            return array("status" => 500, "message" => "Invalid email format");
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

            //if the compiler has reached this point, it means that all requirements are satisified, and user can be added to the database
            // Add the user to the database via the parent class's add method
            $result = parent::add($data);

            if ($result['status'] === 200) {
                return array("status" => 200, "message" => "User registered successfully");
            } else {
                return array("status" => 500, "message" => "Failed to add user");
            }
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


    public function sendemailtocustomerservice($data){
        $title = $data["title"];
        $description = $data["description"];

        $recipientEmail = Config::EMAIL1();

        $all_headers = getallheaders();

        $token = $all_headers['Authorization'];
        
        $decoded = (array) JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));

        $senderEmail = $decoded[0];

        $result = $this->send_email($senderEmail, $title, $recipientEmail, "Customer Service Center", $description);

        if($result){
            return array("status"=>200, "message"=>"Success! Email is sent.");
        } else{
            return array("status"=>500, "message"=>"Error! Email was not sent.");
        }


    }

}
