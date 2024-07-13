<?php
require_once "BaseDao.class.php";

class UserDao extends BaseDao
{

  /**
   * constructor of dao class
   */
  public function __construct()
  {
    parent::__construct("users");
  }

  public function get_user_by_email($email)
  {
    //return $this->query("SELECT * FROM users WHERE email = :email", ['email' => $email]);
    try {
      $stmt = $this->conn->prepare("SELECT * FROM users WHERE email_address = :email");
      $stmt->bindParam(':email', $email);
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
      //return array("status" => 500, "message" => $e->getMessage());
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");
    }
  }


  //  Ovu funkciju nisam jos mijenjala, ali msm da mi nece trebati
/*function getUserByFirstNameAndLastName($customer_name, $customer_surname){
        return $this->query_unique("SELECT * FROM customers WHERE customer_name = :customer_name AND customer_surname = :customer_surname", ["customer_name" => $customer_name, "customer_surname" => $customer_surname]);
    }*/

  public function getUserByFirstNameAndLastName($customer_name, $customer_surname)
  {
    try {
      $stmt = $this->conn->prepare("SELECT * FROM customers WHERE customer_name = :customer_name AND customer_surname = :customer_surname");
      $stmt->bindParam(':customer_name', $customer_name);
      $stmt->bindParam(':customer_surname', $customer_surname);
      $stmt->execute();
      return array("status" => 200, "message" => $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
      //return array("status" => 500, "error" => $e->getMessage());
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error");
    }


  }

  public function checkExistenceForEmail($email_address)
  {
    try {
      $stmt = $this->conn->prepare("SELECT * FROM users WHERE email_address = :email_address");
      $stmt->bindParam(':email_address', $email_address);
      $stmt->execute();
      $user = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($user) {
        return 1; // Return 1 as symbol that user with this email exists
      }
    } catch (PDOException $e) {
      //return $e->getMessage();
      error_log($e->getMessage());
      return 0;
    }
  }

  public function getUserByEmail($email_address)
  {
    //return $this->query("SELECT * FROM users WHERE email = :email", ['email' => $email]);
    try {
      $stmt = $this->conn->prepare("SELECT * FROM users WHERE email_address = :email_address");
      $stmt->bindParam(':email_address', $email_address);
      $stmt->execute();
      $user = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($user) {
        return $user['password']; // Return just the password
      }
    } catch (PDOException $e) {
      //return $e->getMessage();
      error_log($e->getMessage());
      return "Internal Server Error";
    }
  }



  public function userDataUpdate($first_name, $last_name, $new_email_address, $phone, $current_email)
  {
    try {
      $updateStmt = $this->conn->prepare("UPDATE users SET first_name = :first_name, last_name = :last_name, email_address = :new_email_address, phone = :phone WHERE email_address = :current_email");
      $updateStmt->bindParam(':first_name', $first_name);
      $updateStmt->bindParam(':last_name', $last_name);
      $updateStmt->bindParam(':new_email_address', $new_email_address);
      $updateStmt->bindParam(':phone', $phone);
      $updateStmt->bindParam(':current_email', $current_email);

      // Execute the statement and check if rows were affected
      if ($updateStmt->execute()) {
        if ($updateStmt->rowCount() > 0) {
          return array("status" => 200, "message" => "Your data has been successfully updated.");
        } else {
          return array("status" => 500, "message" => "No rows affected. Please check if the email address exists.");
        }
      } else {
        return array("status" => 500, "message" => "Failed to execute update statement.");
      }
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error: " . $e->getMessage());
    }
  }

  public function markUserAsDeleted($email)
  {
    try {
      $stmt = $this->conn->prepare("UPDATE users SET status = 'deleted' WHERE email_address = :email");
      $stmt->bindParam(':email', $email);
      if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
          return array("status" => 200, "message" => "User status updated to 'deleted'.");
        } else {
          return array("status" => 500, "message" => "No rows affected. Please check if the email address exists.");
        }
      } else {
        return array("status" => 500, "message" => "Failed to execute update statement.");
      }
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error: " . $e->getMessage());
    }
  }

  public function verifyAccount($registerToken)
  {
    try {
      // Check if the account is already verified
      $checkStmt = $this->conn->prepare("SELECT status FROM users WHERE register_token = :register_token");
      $checkStmt->bindParam(':register_token', $registerToken);
      $checkStmt->execute();

      $user = $checkStmt->fetch(PDO::FETCH_ASSOC);

      if ($user) {
        if ($user['status'] === 'verified') {
          return array("status" => 400, "message" => "Account is already verified.");
        }

        // Proceed to update the account status if not already verified
        $stmt = $this->conn->prepare("UPDATE users SET status = 'verified' WHERE register_token = :register_token");
        $stmt->bindParam(':register_token', $registerToken);

        if ($stmt->execute()) {
          if ($stmt->rowCount() > 0) {
            return array("status" => 200, "message" => "User status updated to 'verified'.");
          } else {
            return array("status" => 500, "message" => "No rows affected. Please check if the register token exists.");
          }
        } else {
          return array("status" => 500, "message" => "Failed to execute update statement.");
        }
      } else {
        return array("status" => 500, "message" => "No user found with the provided register token.");
      }
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error: " . $e->getMessage());
    }
  }

  public function getStatusByEmail($email)
  {
    try {
      $stmt = $this->conn->prepare("SELECT status FROM users WHERE email_address = :email");
      $stmt->bindParam(':email', $email);
      if ($stmt->execute()) {
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result) {
          return array("status" => 200, "data" => $result["status"]);
        } else {
          return array("status" => 404, "message" => "User not found.");
        }
      } else {
        return array("status" => 500, "message" => "Failed to execute query.");
      }
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Internal Server Error.");
    }
  }

  public function updatePassword($password, $email)
  {

    try {
      $stmt = $this->conn->prepare("UPDATE users SET password = :password WHERE email_address = :email_address");
      $stmt->bindParam(':password', $password);
      $stmt->bindParam(':email_address', $email);
      $stmt->execute();
      if ($stmt->rowCount() > 0) {
        return array("status" => 200, "message" => "Password has been successfully updated.");
      } else {
        return array("status" => 500, "message" => "Password update has failed.");
      }
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Backend error");
    }

  }

  public function getTotalUsers()
  {
    try {
      $stmt = $this->conn->prepare("SELECT COUNT(*) as total_users FROM users WHERE status = 'verified'");
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row['total_users'];
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return null;
    }
  }

  public function retrieveIDBasedOnTheEmail($email_address)
  {
    try {
      $stmt = $this->conn->prepare("SELECT id FROM users WHERE email_address = :email_address AND status = 'verified'");
      $stmt->bindParam(':email_address', $email_address);
      $stmt->execute();
      $user = $stmt->fetch(PDO::FETCH_ASSOC);
      return $user['id']; //returns id
    } catch (PDOException $e) {
      //return $e->getMessage();
      error_log($e->getMessage());
      return;
    }
  }

  public function checkVerificationStatus($email)
  {
    try {
      $stmt = $this->conn->prepare("SELECT status FROM users WHERE email_address = :email_address");
      $stmt->bindParam(':email_address', $email);
      $stmt->execute();
      $user = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($user) {

        if ($user['status'] === 'verified') {
          return array("status" => 200, "message" => "User is verified.");

        } else {
          return array("status" => 500, "message" => "User is  not verified.");

        }
      } else {
        return array("status" => 404, "message" => "User is not found.");

      }
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return array("status" => 401, "message" => "Backend error.");
    }
  }

  public function checkTimeForRequests($email)
{
    try {
        $stmt = $this->conn->prepare("
            SELECT forget_password_count, last_request
            FROM users
            WHERE email_address = :email
        ");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            $current_time = new DateTime();
            if (!empty($result['last_request'])) {
                $last_request_time = new DateTime($result['last_request']);
                $interval = $current_time->diff($last_request_time);

                if ($interval->i < 10) {
                    if ($result['forget_password_count'] >= 2) {
                        return true;
                    } else {
                        $stmt = $this->conn->prepare("
                            UPDATE users
                            SET forget_password_count = forget_password_count + 1, last_request = :current_time
                            WHERE email_address = :email
                        ");
                        $current_time_string = $current_time->format('Y-m-d H:i:s');
                        $stmt->bindParam(':current_time', $current_time_string);
                        $stmt->bindParam(':email', $email);
                        $stmt->execute();
                    }
                } else {
                    $stmt = $this->conn->prepare("
                        UPDATE users
                        SET forget_password_count = 1, last_request = :current_time
                        WHERE email_address = :email
                    ");
                    $current_time_string = $current_time->format('Y-m-d H:i:s');
                    $stmt->bindParam(':current_time', $current_time_string);
                    $stmt->bindParam(':email', $email);
                    $stmt->execute();
                }
            } else {
                $stmt = $this->conn->prepare("
                    UPDATE users
                    SET forget_password_count = 1, last_request = :current_time
                    WHERE email_address = :email
                ");
                $current_time_string = $current_time->format('Y-m-d H:i:s');
                $stmt->bindParam(':current_time', $current_time_string);
                $stmt->bindParam(':email', $email);
                $stmt->execute();
            }
        } else {
            return array("status" => 500, "message" => "Email does not exist.");
        }

        return false;
    } catch (PDOException $e) {
        error_log($e->getMessage());
        return array("status" => 500, "message" => "Backend error.");
    }
}

  
  public function saveExpirationTokenAndCount($token, $email)
  {
      try {
          $current_time = (new DateTime())->format('Y-m-d H:i:s');
          $stmt = $this->conn->prepare("
              UPDATE users
              SET activation_token = :token, forget_password_count = forget_password_count + 1, last_request = :current_time
              WHERE email_address = :email
          ");
          $stmt->bindParam(':token', $token);
          $stmt->bindParam(':current_time', $current_time);
          $stmt->bindParam(':email', $email);
          $stmt->execute();
          return true;
      } catch (PDOException $e) {
          error_log($e->getMessage());
          return false;
      }
  }
  

  public function checkTokenExistence($activationToken)
  {
    try {
      $stmt = $this->conn->prepare("
              SELECT COUNT(*) as count
              FROM users
              WHERE activation_token = :activation_token
          ");

      $stmt->bindParam(':activation_token', $activationToken);

      $stmt->execute();

      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result['count'] > 0) {
        return array("status" => 200, "message" => "Token exists.");
      } else {
        return array("status" => 404, "message" => "Token does not exist.");
      }
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return array("status" => 400, "message" => "An error occurred while checking the token.");
    }
  }

  public function checkTokenCount($activationToken)
  {
    try {
      $stmt = $this->conn->prepare("
              SELECT activation_token_count
              FROM users
              WHERE activation_token = :activation_token
          ");

      $stmt->bindParam(':activation_token', $activationToken);

      $stmt->execute();

      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        if ($result['activation_token_count'] == 1) {
          return array("status" => 500, "message" => "Token was already used.");
        } else {
          return array("status" => 200, "message" => "Token was not yet used.");
        }
      } else {
        return array("status" => 500, "message" => "Token does not exist.");
      }
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Backend error.");
    }
  }


  public function updateTokenCount($activationToken)
  {

    try {
      $stmt = $this->conn->prepare("UPDATE users SET activation_token_count = 1 WHERE activation_token = :activation_token");
      $stmt->bindParam(':activation_token', $activationToken);
      $stmt->execute();
      if ($stmt->rowCount() > 0) {
        return array("status" => 200, "message" => "Count has been successfully updated.");
      } else {
        return array("status" => 500, "message" => "Count update has failed.");
      }
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return array("status" => 500, "message" => "Backend error.");
    }

  }





}









