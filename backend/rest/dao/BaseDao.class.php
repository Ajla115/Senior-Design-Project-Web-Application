<?php
require_once __DIR__ . '/../config.php';
class BaseDao
{
  protected $conn;
   protected $table_name;

    //Class constructor used to establish connection to the database
    public function __construct($table_name)
    { 
        try {

        $this->table_name = $table_name;
        // $host = '127.0.0.1';
        //  $schema = 'sdp_project';
        // $username = 'root';
        // $password = 'a1b2c3d4e5';
        // $port = '3306';
        

        /*Deployment on DO*/
        $host = Config::DB_HOST();
        $username = Config::DB_USERNAME();
        $password = Config::DB_PASSWORD();
        $schema = Config::DB_SCHEME();
        $port = Config::DB_PORT();

        $this->conn = new PDO("mysql:host=$host;port=$port;dbname=$schema", $username, $password); 

        

        //set the PDO error mode to exception
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "Connected successfully";
        }
        catch(PDOException $e){
                echo "Connection failed: " . $e->getMessage();
        }
    }
    
    //Method to get all attributes of all entries from one table
    public function get_all()
    {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name); 
        //This space between FROM and " is very important 
        //because it allows the database to read this keyword and table name, as two seperate entities as it should
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

     //Method to get entries from the table based upon a id which is given as a parameter
        public function get_by_id($id){
            $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE id = :id");
            //again, here it needs to have spaces before and after WHERE and FROM
            $stmt->execute(['id' => $id]); 
            return $stmt->fetchAll(PDO::FETCH_ASSOC);  

    }

    public function delete($id){
        $stmt = $this->conn->prepare("DELETE FROM " . $this->table_name . " WHERE id = :id");
        $stmt->bindParam(':id', $id);
        if ($stmt->execute()) {
            echo "Deletion was successful."; // deletion was successful
        } else {
            echo "Deletion failed."; // deletion failed
        }
    }

    //Method used to add a column in the database
    public function add($entity){
        $query = "INSERT INTO " . $this->table_name . " (";
        foreach($entity as $column => $value){
            $query.= $column . ', '; //.= is for appending
        } 
        //through this foreach loop, we will get a look that resembles this part below

        /* first_name : "Test1",
           last_name : "Test2"
           -The last attribute does not have the comma at the end, only the bracket is closed,
           so to achieve this, a substring to remove tha last comma is used*/

        $query = substr($query, 0, -2);
        $query.= ") VALUES (";
        foreach($entity as $column => $value){
            $query.= ":" . $column . ', '; //this : is for binding parameters
            //again, column bc placeholders are named after columns in database and not values
            //but execute will match these placeholders with values from entity
            //placeholders, binding are important for security, and prevent SQL Injection
            //and to differentiate between SQL code and data
        }

        $query = substr($query, 0, -2);
        $query.= ")";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($entity);
        $entity['id'] = $this->conn->lastInsertId(); //this is will return the ID of the last entry
        return $entity;  
}

    //Method used to update entity in database
     public function update($entity, $id, $id_column = "id"){ 
        //This ID is just status column, while id_column is default column like ID
        $query = "UPDATE " . $this->table_name . " SET ";
        foreach($entity as $column => $value){
            $query.= $column . "= :" . $column . ", ";
        }
        $query = substr($query, 0, -2);
        $query.= " WHERE $id_column = :id"; //previously {$id_column} was used, but it become deprecated
        $stmt = $this->conn->prepare($query);
        $entity['id'] = $id;
        $stmt->execute($entity);
        return $entity;
    }

    //Should these custom created functions stay protected or turned to public
    protected function query($query, $params = [])
    {
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /* ova query je za custom metode jer je nekad bolje imati custom 
    functions, a ne sve pisati u BaseDao zato sto onda npr sve funkcije 
    koje su u BaseDao ne bi mogle biti primijenjene u svim drugim Daos*/

    protected function query_unique($query, $params)
    {
        $results = $this->query($query, $params);
        return reset($results);
    }


}

?>



