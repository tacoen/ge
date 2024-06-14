<?php

$root = realpath(dirname(__FILE__) . '/../');


$path = $root.'/ge2/php';
require_once $path . '/minify/src/Minify.php';
require_once $path . '/minify/src/CSS.php';
require_once $path . '/minify/src/JS.php';
require_once $path . '/minify/src/Exception.php';
require_once $path . '/minify/src/Exceptions/BasicException.php';
require_once $path . '/minify/src/Exceptions/FileImportException.php';
require_once $path . '/minify/src/Exceptions/IOException.php';
require_once $path . '/path-converter/src/ConverterInterface.php';
require_once $path . '/path-converter/src/Converter.php';

use MatthiasMullie\Minify;


function minifyJS($files)
{
	global $root;
	$output = '';


	foreach ($files as $file) {

		if (file_exists($root.$file)) {
			$content = trim(file_get_contents($root.$file));

			$minifier = new Minify\JS($content);
			//echo $minifier->minify();
			$output .= $minifier->minify() .";"; /* make sure */
		}
	}
		
	return "/* me ge2 ".time(). " */\n". $output;
}

function minifyCSS($files)
{
	global $root;
	$output = '';	
	foreach ($files as $file) {
		if (file_exists($root.$file)) {
			$content = trim(file_get_contents($root.$file));

			$minifier = new Minify\CSS($content);
			//echo $minifier->minify();
			$output .= $minifier->minify();
		}
	}
	
	return "/* ge2 ".time(). " */\n".$output;
}

function dominicss($files) {
	global $root;	
	$minifiedContent = minifyCSS($files);
	file_put_contents($root.'/ge2/cache/ge2.min.css', $minifiedContent);
	return $minifiedContent;
}
function dominijs($files) {
	global $root;	
	$minifiedContent = minifyJS($files);
	file_put_contents($root.'/ge2/cache/ge2.min.js', $minifiedContent);
	return $minifiedContent;
}

if (php_sapi_name() === 'cli') {
	
	$argc = $_SERVER['argc'];
	$argv = $_SERVER['argv'];

	if ($argc < 2 || !in_array($argv[1], ['js', 'css'])) {
		echo "Usage: php script.php [js|css] [file1,file2,file3,...]\n";
		exit;
	}

	$type = $argv[1];
	$files = explode(',', $argv[2]);

	if ($type === 'js') {
		$minifiedContent = dominijs($files);
		echo "JavaScript minified file saved as 'ge2.min.js'\n";
	} elseif ($type === 'css') {
		$minifiedContent = dominicss($files);
		echo "CSS minified file saved as 'ge2.min.css'\n";
	}
} else {
	if (isset($_GET['js'])) {
		$jsFiles = explode(',', $_GET['js']);
		$minifiedJS = dominijs($jsFiles);

		header('Content-Type: application/javascript');
		header('Cache-Control: no-cache, no-store, must-revalidate');
		header('Pragma: no-cache');
		header('Expires: 0');
		//echo $minifiedJS ;
		header('Content-Disposition: attachment; filename="'.time().'-ge2.min.js"');
		readfile($root.'/ge2/cache/ge2.min.js');
	} elseif (isset($_GET['css'])) {
		$cssFiles = explode(',', $_GET['css']);
		$minifiedCSS = dominicss($cssFiles);
		header('Content-Type: text/css');
		header('Cache-Control: no-cache, no-store, must-revalidate');
		header('Pragma: no-cache');
		header('Expires: 0');
		//echo $minifiedCSS ;
		header('Content-Disposition: attachment; filename="'.time().'-ge2.min.css"');
		readfile($root.'/ge2/cache/ge2.min.css');
	} else {
		echo 'Invalid request. Please specify either "js" or "css" parameter.';
	}
}

?>