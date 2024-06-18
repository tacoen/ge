<?php
require_once('php/ge.php');

// Set the cache directory for CSS and HTML files
//$ge->conf('css', 'custom_cache/css/');
//$ge->conf('html', 'custom_cache/html/');

// Determine the user's request
//$request = null;
//$file = null;

if (isset($_SERVER['QUERY_STRING']) && !empty($_SERVER['QUERY_STRING'])) {
	parse_str($_SERVER['QUERY_STRING'], $params);
	foreach ($params as $key => $value) {
		switch ($key) {
			case 'mini':
				$content = $ge->css($value, true);
				header('Content-Type: text/css');
				echo $content;
				break;
			case 'pretty':
				$content = $ge->html($value, 'pretty');
				header('Content-Type: text/html');
				echo $content;
				break;
			case 'css':
				// Retrieve the CSS file contents without minification
				$content = $ge->css($value, false);
				header('Content-Type: text/css');
				echo $content;
				break;
			case 'html':
				// Retrieve the HTML file contents without prettification
				$content = $ge->html($value, false);
				header('Content-Type: text/html');
				echo $content;
				break;
			default:
				echo "Invalid request.";
				break;
		}
	}
}
?>