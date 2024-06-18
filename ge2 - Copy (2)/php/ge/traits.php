<?php

trait GE_traits {

	/**
	 * # no_ds
	 * Remove duplicate spaces from a string.
	 *
	 * @param string $str The input string.
	 * @return string The string with duplicate spaces removed.
	 *
	 * Example:
	 * ```php
	 * $input = "Hello   world  ";
	 * $output = $this->no_ds($input);
	 * // $output = "Hello world"
	 * ```
	 */
	public function no_ds($str) {
		$str = preg_replace('/\s\s+/',' ',$str);
		return trim(preg_replace('#\s\>#',">",$str));
	}
	
	/**
	 * # no_leading
	 * Remove leading and trailing spaces, and convert multiple spaces to single spaces.
	 *
	 * @param string $str The input string.
	 * @return string The string with leading and trailing spaces removed, and multiple spaces converted to single spaces.
	 *
	 * Example:
	 * ```php
	 * $input = "  Hello   world  ";
	 * $output = $this->no_leading($input);
	 * // $output = "Hello world"
	 * ```
	 */
	public function no_leading($str) {
		$str = $this->no_ds($str);
		$str = preg_replace('#>\s+#',"> ",$str);
		return preg_replace('#> <#',">\n<",$str);
	}

	/**
	 * # strip
	 * Remove all newlines, tabs, and carriage returns from a string.
	 *
	 * @param string $text The input string.
	 * @return string The string with all newlines, tabs, and carriage returns removed.
	 *
	 * Example:
	 * ```php
	 * $input = "Hello\nworld\r\n";
	 * $output = $this->strip($input);
	 * // $output = "Hello world"
	 * ```
	 */
	public function strip($text) {
		$text = preg_replace('/[\n|\t|\r]/', ' ', $text);
		$text = $this->nods($text);
		return $text;
	}
	
	/**
	 * # safetext
	 * Convert a string to lowercase and remove all non-alphanumeric characters. Great for safenaming
	 *
	 * @param string $text The input string.
	 * @return string The string converted to lowercase and with all non-alphanumeric characters removed.
	 *
	 * Example:
	 * ```php
	 * $input = "Hello, World!";
	 * $output = $this->safetext($input);
	 * // $output = "helloworld"
	 * ```
	 */
	public function safetext($text) {
		return strtolower(preg_replace('/\W|\s/', '', $this->strip($text)));
	}
	
	/**
	 * # rndtext
	 * Generate a random string of 6 characters, consisting of 2 consonants, 2 vowels, and 2 digits.
	 *
	 * @return string The random string.
	 *
	 * Example:
	 * ```php
	 * $randomString = $this->rndtext();
	 * // $randomString might be "mika23"
	 * ```
	 */
	public function rndtext() {
		$rc = ['0123456789','aeiou','bcdfghjklmnpqrstvwxyz'];
		return $rc[2][random_int(0, strlen($rc[2]) - 1)].
			$rc[1][random_int(0, strlen($rc[1]) - 1)].
			$rc[2][random_int(0, strlen($rc[2]) - 1)].
			$rc[1][random_int(0, strlen($rc[1]) - 1)].
			$rc[0][random_int(0, strlen($rc[0]) - 1)].
			$rc[0][random_int(0, strlen($rc[0]) - 1)];
	}

	/**
	 * # e()
	 * Echo a variable with a wrapper element.
	 *
	 * @param mixed $var The variable to echo.
	 * @param string $element The HTML element to use as the wrapper (default is "pre").
	 * @return string The HTML-wrapped variable.
	 *
	 * Example:
	 * ```php
	 * $myArray = ['one', 'two', 'three'];
	 * $output = $this->e($myArray);
	 * // $output = "<pre data-type="array">Array
	 * // (
	 * //     [0] => one
	 * //     [1] => two
	 * //     [2] => three
	 * // )
	 * // </pre>"
	 * ```
	 */
	public function e($var,$element="pre") {
		// echo with wrapper;
		$str = '';
		if (is_null($var) || $var === "") {
			$str = "<!---".'$var'."?-->";
		} elseif ( (is_array($var)) || (is_object($var)) ) {
			$str = "<$element data-type='".gettype($var)."'>".
			$str .= print_r($var,true);
			$str .= "</$element>";
		} else {
			$str = "<$element data-type='".gettype($var)."'>".
			$str .= $var;
			$str .= "</$element>";
		}
		return $str;
	}

	/**
	 * # mkdirr	
	 * Create a directory recursively.
	 *
	 * @param string $directory The path to the directory to create.
	 * @return void
	 *
	 * Example:
	 * ```php
	 * $this->mkdirr('/path/to/new/directory');
	 * ```
	 */
	public function mkdirr($directory) {
		// Create the directory recursively
		if (!is_dir($directory)) {
			$parent_directory = dirname($directory);
			if (!is_dir($parent_directory)) {
				$this->mkdirr($parent_directory);
			}
		mkdir($directory, 0755, true);
		}
	}
	
	/**
	 * # getIL	
	 * Get the initial letters of the words in a sentence.
	 *
	 * @param string $sentence The input sentence.
	 * @return string The initial letters of the words in the sentence, converted to lowercase.
	 *
	 * Example:
	 * ```php
	 * $sentence = "Republic of Indonesia";
	 * $initialLetters = $this->getIL($sentence);
	 * // $initialLetters = "ri"
	 * ```
	 */
	public function getIL($sentence) {
		// return "ri" from "Republic Indonesia"
		$words = explode(" ", $sentence);
		// Iterate through each word and extract the initial letter
		$initialLetters = "";
		foreach ($words as $word) {
			$initialLetters .= substr($word, 0, 1);
		}
		return strtolower($initialLetters);
	}

	/**
	 * # getfile
	 * Get the contents of a file, or an empty string if the file does not exist.
	 *
	 * @param string $file The path to the file.
	 * @return string The contents of the file, or an empty string if the file does not exist.
	 *
	 * Example:
	 * ```php
	 * $fileContents = $this->getfile('/path/to/file.txt');
	 * // $fileContents contains the contents of the file, or an empty string if the file does not exist
	 * ```
	 */
	public function getfile($file) {
		// return file contents or "" if not exist
		if (file_exists($file)) {
			return trim(file_get_contents($file));
		} else {
			return '';
		}
	}		

}