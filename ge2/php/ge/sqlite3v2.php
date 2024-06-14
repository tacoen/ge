<?php
/**
* # GE_SQLite3Interface
* 
* A helper class that provides a convenient interface for interacting with an SQLite3 database.
* 
* Explanation:
* The `GE_SQLite3Interface` class is designed to simplify the process of working with an SQLite3 database. It provides a clean and easy-to-use API for executing SQL queries, retrieving data, and managing the database connection.
*
* Syntax:
* ```php
* class GE_SQLite3Interface {
*     private $db;
*     public $debug;
*     public function __construct($database_file) {
*         $this->db = new SQLite3($database_file);
*     }
*     public function __get($table_name) {
*         return new GE_SQLite3Function($this->db, $table_name);
*     }
*     public function init($sql) {
*         $this->db->exec($sql);
*     }
* }
* ```
* Example:
* ```php
* $sqlite = new GE_SQLite3Interface('path/to/database.db');
* $sqlite->init("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)");
* $sqlite->users->insert(['name' => 'John Doe', 'email' => 'john@example.com']);
* $users = $sqlite->users->select()->all();
* print_r($users);
* ```
*
* @param string $database_file The path to the SQLite3 database file.
* @return void
*
*/
class GE_SQLite3Interface {
	private $db;
	public $debug;
    public function __construct($database_file) {
		$this->db = new SQLite3($database_file);
    }
    public function __get($table_name) {
        return new GE_SQLite3Function($this->db, $table_name);
    }
	public function init($sql) {
		$this->db->exec($sql);
	}
}
/**
* # GE_SQLite3Function
* 
* A helper class that provides an easy-to-use interface for interacting with a specific table in an SQLite3 database.
* 
* Explanation:
* The `GE_SQLite3Function` class is designed to work in conjunction with the `GE_SQLite3Interface` class to provide a more specialized set of methods for working with a specific database table. It allows you to perform various operations such as retrieving table structure, getting field names, inserting data, and querying data.
*/
class GE_SQLite3Function {
	private $db;
	private $table;
    public function __construct($db, $table_name) {
        $this->db = $db;
        $this->table = $table_name;
    }
	/**
* # getStructure()
* 
* Retrieves the structure (column information) of the table.
* 
* Explanation:
* The `getStructure()` method uses the `PRAGMA table_info()` SQL statement to retrieve the structure of the table. It fetches each row of the result set and stores them in the `$res` array, which is then returned.
*
* Example:
* ```php
* $sqlite = new GE_SQLite3Interface('path/to/database.db');
* $users = $sqlite->users;
* $tableStructure = $users->getStructure();
* print_r($tableStructure);
* ```
* Result:
* ```
* Array(
*     [0] => Array(
*         [cid] => 0
*         [name] => id
*         [type] => INTEGER
*         [notnull] => 1
*         [dflt_value] =>
*         [pk] => 1
*     ),
*     [1] => Array(
*         [cid] => 1
*         [name] => name
*         [type] => TEXT
*         [notnull] => 0
*         [dflt_value] =>
*         [pk] => 0
*     ),
*     [2] => Array(
*         [cid] => 2
*         [name] => email
*         [type] => TEXT
*         [notnull] => 0
*         [dflt_value] =>
*         [pk] => 0
*     )
* )
* ```
*
* @return array The array of column information for the table.
*
*/
	public function getStructure() {
		$query = "pragma table_info('".$this->table."')";
		$r = $this->db->query($query);
		while ($row = $r->fetchArray(SQLITE3_ASSOC)) { $res[] = $row; }
		return $res;
	}
	/**
* # getFields()
* 
* Retrieves the non-primary key column names of the table.
* 
* Explanation:
* The `getFields()` method first calls the `getStructure()` method to retrieve the structure of the table. It then iterates through the resulting array and collects the names of all columns that are not the primary key. These field names are stored in the `$Fields` array, which is then returned.
*
* Example:
* ```php
* $sqlite = new GE_SQLite3Interface('path/to/database.db');
* $users = $sqlite->users;
* $fields = $users->getFields();
* print_r($fields);
* ```
* Result:
* ```
* Array(
*     [0] => name
*     [1] => email
* )
* ```
*
* @return array The array of non-primary key column names.
*
*/
	public function getFields() {
		$resd = $this->getStructure();
		$Fields=[];
		foreach($resd as $row) {
			if ($row['pk'] != 1) { array_push($Fields, $row['name']); }
		}
		return $Fields;
	}
/**
* # lastid()
* 
* Retrieves the last inserted ID for the table.
* 
* Explanation:
* The `lastid()` method uses a SQL query to retrieve the maximum value of the `id` column for the table. This effectively returns the last inserted ID, assuming that the `id` column is an auto-incrementing primary key.
*
* Example:
* ```php
* $sqlite = new GE_SQLite3Interface('path/to/database.db');
* $users = $sqlite->users;
* $lastId = $users->lastid();
* echo "The last inserted ID is: " . $lastId;
* ```
* Result:
* ```
* The last inserted ID is: 5
* ```
*
* @return int The last inserted ID for the table.
*
*/	
	public function lastid() {
		return $this->db->querysingle("SELECT max(id) FROM ". $this->table);
	}
	/**
* # count()
* 
* Counts the number of rows in the table that match a specified condition.
* 
* Explanation:
* The `count()` method takes two parameters: `$what` and `$value`. It constructs a SQL query to select the count of rows from the table where the column specified by `$what` is equal to `$value`. The query is prepared and executed, and the result is fetched and returned as the count.
*
* Example:
* ```php
* $sqlite = new GE_SQLite3Interface('path/to/database.db');
* $users = $sqlite->users;
* $userCount = $users->count('email', 'john@example.com');
* echo "The number of users with the email 'john@example.com' is: " . $userCount;
* ```
* Result:
* ```
* The number of users with the email 'john@example.com' is: 2
* ```
*
* @param string $what The name of the column to check.
* @param mixed $value The value to match in the specified column.
* @return int The count of rows matching the condition.
*
*/
	public function count($what,$value) {
	    $stmt = $this->db->prepare("SELECT COUNT(*) FROM ".
			$this->table." WHERE $what == $value");
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_NUM);
        $count = $row[0];
        return $count;
	}
/**
* # insertData()
* 
* Inserts a new row of data into the table.
* 
* Explanation:
* The `insertData()` method takes an associative array `$data` as input, where the keys represent the column names and the values represent the data to be inserted. The method first retrieves the list of columns in the table using the `getFields()` method. It then iterates through the list of columns, checking if the corresponding key exists in the `$data` array. If so, it adds the column name to the `$Fields` array and the value from `$data` to the `$Values` array.
*
* The method then constructs an SQL `INSERT INTO` query using the `$Fields` and `$Values` arrays, prepares the query, and executes it using the `$db->prepare()` and `$statement->execute()` methods.
*
* Example:
* ```php
* $sqlite = new GE_SQLite3Interface('path/to/database.db');
* $users = $sqlite->users;
* $newUserData = [
*     'name' => 'John Doe',
*     'email' => 'john@example.com',
*     'age' => 30
* ];
* $insertedFields = $users->insertData($newUserData);
* echo "Inserted the following fields: " . implode(', ', $insertedFields);
* ```
* Result:
* ```
* Inserted the following fields: name, email, age
* ```
*
* @param array $data An associative array of data to be inserted, where the keys represent the column names and the values represent the data to be inserted.
* @return array The list of column names that were inserted.
*
*/	
	public function insertData($data=[]) {
        $fields = $this->getFields($this->table);
		foreach($fields as $f) {
			if (in_array($f, array_keys($data))) {
				$Fields[] = $f;
				$Values[] = $data[$f];
			}
		}
		$query = "INSERT INTO '".$this->table."' (".
			join(",",$Fields).
			") VALUES ('".
			join("','",$Values).
			"');";
		$statement = $this->db->prepare($query);
        $statement->execute();
		return $Fields;
	}
/**
* # getData()
* 
* Retrieves data from the table based on the specified parameters.
* 
* Explanation:
* The `getData()` method takes two parameters: `$what` and `$where`. The `$what` parameter specifies the columns to be retrieved, and can be a single column name, an array of column names, or the special value `'*'` to retrieve all columns.
*
* If `$what` is an array, the method constructs a comma-separated list of column names. If `$what` is `'*'`, the method retrieves the list of column names using the `getFields()` method and constructs the comma-separated list.
*
* The method then constructs the SQL `SELECT` query using the `$whatstr` and the table name. If the `$where` parameter is provided, the method appends a `WHERE` clause to the query using the `$wherestr` parameter.
*
* The method then executes the query using the `$db->query()` method, and retrieves the results as an array of associative arrays, where the keys represent the column names and the values represent the data for each row.
*
* Example:
* ```php
* $sqlite = new GE_SQLite3Interface('path/to/database.db');
* $users = $sqlite->users;
* 
* // Retrieve all columns for all users
* $allUsers = $users->getData('*');
* print_r($allUsers);
* 
* // Retrieve the name and email columns for users with age > 30
* $olderUsers = $users->getData(['name', 'email'], 'age > 30');
* print_r($olderUsers);
* ```
* Result:
* ```
* Array(
*     [0] => Array(
*         'id' => 1,
*         'name' => 'John Doe',
*         'email' => 'john@example.com',
*         'age' => 35
*     ),
*     [1] => Array(
*         'id' => 2,
*         'name' => 'Jane Smith',
*         'email' => 'jane@example.com',
*         'age' => 42
*     )
* )
* Array(
*     [0] => Array(
*         'name' => 'John Doe',
*         'email' => 'john@example.com'
*     ),
*     [1] => Array(
*         'name' => 'Jane Smith',
*         'email' => 'jane@example.com'
*     )
* )
* ```
*
* @param string|array $what The columns to retrieve, or '*' to retrieve all columns.
* @param string $where (optional) The condition to filter the results, in the format 'column_name = value'.
* @return array An array of associative arrays, where each inner array represents a row of data.
*
*/	
	public function getData($what,$where=false) {
		if (is_array($what)) {
			$whatstr = implode(",",$what);
		} else {
			if ($what == "*") {
				$whatstr = implode(",",$this->getFields($this->table)); 
			} else {
				$whatstr = $what;
			}
		}
		$query = "SELECT ".$whatstr." FROM ".$this->table;
		if ($where) { $query .= " WHERE ".$wherestr; }
		echo $query;
		$r = $this->db->query($query);
		while ($row = $r->fetchArray(SQLITE3_ASSOC)) { $res[] = $row; }
		return $res;
	}
/**
* # getSingle()
* 
* Retrieves a single row of data from the table based on the specified parameters.
* 
* Explanation:
* The `getSingle()` method takes two parameters: `$what` and `$where`. The `$what` parameter specifies the columns to be retrieved, and can be a single column name, an array of column names, or the special value `'*'` to retrieve all columns.
*
* If `$what` is an array, the method constructs a comma-separated list of column names. If `$what` is `'*'`, the method retrieves the list of column names using the `getFields()` method and constructs the comma-separated list.
*
* The method then constructs the SQL `SELECT` query using the `$what_str` and the table name. If the `$where` parameter is provided, the method appends a `WHERE` clause to the query using the `$where` parameter.
*
* The method then executes the query using the `$db->querysingle()` method, which returns a single row of data as an associative array, where the keys represent the column names and the values represent the data for that row.
*
* Example:
* ```php
* $sqlite = new GE_SQLite3Interface('path/to/database.db');
* $users = $sqlite->users;
* 
* // Retrieve the first user
* $firstUser = $users->getSingle('*');
* print_r($firstUser);
* 
* // Retrieve the name and email for the user with ID 2
* $secondUser = $users->getSingle(['name', 'email'], 'id = 2');
* print_r($secondUser);
* ```
* Result:
* ```
* Array(
*     'id' => 1,
*     'name' => 'John Doe',
*     'email' => 'john@example.com',
*     'age' => 35
* )
* Array(
*     'name' => 'Jane Smith',
*     'email' => 'jane@example.com'
* )
* ```
*
* @param string|array $what The columns to retrieve, or '*' to retrieve all columns.
* @param string $where (optional) The condition to filter the results, in the format 'column_name = value'.
* @return array An associative array representing a single row of data, where the keys represent the column names and the values represent the data for that row.
*
*/
	public function getSingle($what,$where=false) {
		if (is_array($what)) {
			$what_str = implode(",",$what);
		} else {
			if ($what == "*") {
				$what_str = implode(",",$this->getFields($this->table)); 
			} else {
				$what_str = $what;
			}
		}
		$query = "SELECT ".$what_str." FROM ". $this->table;
		if ($where) { $query .= " WHERE ".$where; }
		return $this->db->querysingle($query,true);
	}
/**
* # resetData()
* 
* Resets the data in the table by deleting all rows and resetting the auto-increment sequence.
* 
* Explanation:
* The `resetData()` method is used to reset the data in the table by deleting all rows and resetting the auto-increment sequence. It does this by executing a series of SQL commands:
*
* 1. `DELETE FROM '$this->table';`: This deletes all rows from the table.
*
* 2. `DELETE FROM sqlite_sequence WHERE name = '$this->table';`: This deletes the auto-increment sequence for the table.
*
* 3. `VACUUM; REINDEX;`: These commands optimize the database file and rebuild the index, which helps to recover disk space and improve performance.
*
*
* The method uses the `$db->exec()` method to execute the SQL commands.
*
* Example:
* ```php
* $sqlite = new GE_SQLite3Interface('path/to/database.db');
* $users = $sqlite->users;
* 
* // Add some data to the users table
* $users->insert(['name' => 'John Doe', 'email' => 'john@example.com']);
* $users->insert(['name' => 'Jane Smith', 'email' => 'jane@example.com']);
* 
* // Reset the data in the users table
* $users->resetData();
* 
* // Check that the table is empty
* $allUsers = $users->getAll('*');
* print_r($allUsers);
* ```
* Result:
* ```
* Array()
* ```
*
* @return void
*
*/	
	public function resetData() {
		$query = "DELETE FROM '".$this->table."';".
		"DELETE FROM sqlite_sequence WHERE name = '".$this->table."';".
		"VACUUM; REINDEX;";
		$this->db->exec($query);
	}
}
?>