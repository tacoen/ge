<?php

$files_dir = '../php/ge/';

function makeTree($folder_path) {
    // Check if the given path is a valid directory
    if (!is_dir($folder_path)) {
        return "Error: '$folder_path' is not a valid directory.";
    }

    // Initialize the tree output
    $tree = '';

    // Recursively build the tree
    $tree = buildTree($folder_path, $tree, 0);

    return $tree;
}

function buildTree($path, $tree, $depth) {
    // Get the contents of the directory
    $contents = scandir($path);

    // Iterate through the contents
    foreach ($contents as $item) {
        // Skip the "." and ".." directories
        if ($item === '.' || $item === '..') {
            continue;
        }

        // Get the full path of the current item
        $item_path = $path . '/' . $item;

        // Indent the item based on the depth
        $indent = str_repeat('  ', $depth);

        // If the current item is a directory, add it to the tree and recursively build its contents
        if (is_dir($item_path)) {
            $tree .= $indent . '+ ' . $item . '/' . PHP_EOL;
            $tree = buildTree($item_path, $tree, $depth + 1);
        } else {
            // If the current item is a file, add it to the tree
            $tree .= $indent . '- ' . $item . PHP_EOL;
        }
    }

    return $tree;
}

function process_docblock($file_path)
{
    $title = "<h1>" . basename($file_path) . "</h1>";
    echo $title;
    $file_contents = file_get_contents($file_path);
    $docblock_pattern = '~\/\*\*(.+?)\*\/~ms';

    $docblocks = [];
    if (preg_match_all($docblock_pattern, $file_contents, $matches)) {
        $docblocks = $matches[1];
    }

    $html = "<div class='docblocks'>";
    foreach ($docblocks as $docblock) {
        $docblock_lines = explode("\n", $docblock);
        $html .= "<div class='docblock'>";
        $in_code_block = false;
        $params = [];
        $return = null;
        foreach ($docblock_lines as $line) {
            // Remove leading whitespace, an optional '*' character, and any additional whitespace
            $line = preg_replace('/^(\s*\*?\s*)?/', '', $line);
            if (strpos($line, '@param') === 0) {
                // Extract @param information
                $param_parts = explode(' ', $line, 4);
                if (count($param_parts) >= 4) {
                    $param_type = $param_parts[1];
                    $param_name = $param_parts[2];
                    $param_description = isset($param_parts[3]) ? $param_parts[3] : '';
                    $params[] = [
                        'type' => $param_type,
                        'name' => $param_name,
                        'description' => $param_description
                    ];
                }
            } elseif (strpos($line, '@return') === 0) {
                // Extract @return information
                $return_parts = explode(' ', $line, 4);
                if (count($return_parts) >= 4) {
                    $return_type = $return_parts[1];
					$param_name = $return_parts[2];
                    $return_description = isset($return_parts[3]) ? $return_parts[3] : '';
                    $return = [
                        'type' => $return_type,
						'name' -> $return_name,
                        'description' => $return_description
                    ];
                }
            } elseif (strpos($line, '# ') === 0) {
                $text = trim(substr($line, 1));
                $html .= "<h2 class='intoc' id='".$text."'>" . $text . "</h2>";
                continue;
            } elseif (strpos($line, '```') !== false) {
                $in_code_block = !$in_code_block;
                $html .= $in_code_block ? "<pre><code class='language-php'>" : "</code></pre>";
                continue;
            } elseif ($in_code_block) {
                $html .= htmlspecialchars($line) . "\n";
            } else {
                $h3el = ['example:', 'syntax:', 'test results:','result:'];
                if (in_array(trim(strtolower($line)), $h3el)) {
                    $html .= "<h4>" . $line . "</h4>";
                    continue;
                } else {
                    if (trim($line) !== '') {
                        if ($current_paragraph !== '') {
                            $current_paragraph .= "\n";
                        }
                        $current_paragraph .= $line;
                    } else {
                        if ($current_paragraph !== '') {
                            $html .= "<p>" . $current_paragraph . "</p>";
                            $current_paragraph = '';
                        }
                    }
                }
            }
        }

        // Display the extracted @param information
        if (!empty($params)) {
            $html .= "<h3>Parameters:</h3>";
            foreach ($params as $param) {
                $html .= "<p class='details'><b>{$param['type']}:</b><span><em>{$param['name']}</em> {$param['description']}</span></p>";
            }
        }

        // Display the extracted @return information
        if (!empty($return)) {
            $html .= "<h3>Return:</h3>";
                $html .= "<p class='details'><b>{$return['type']}:</b><span><em>{$return['name']}</em> {$return['description']}</span></p>";
        }

        $html .= "</div>";
    }
    $html .= "</div>";
    return $html;
}

// Browse/index functionality

if ($_SERVER['REQUEST_METHOD'] === 'GET') {?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charSet="utf-8"/>
        <script src='../js/icons.js'></script>
        <script src='../js/tafunc.js'></script>
		<script src='func.js'></script>
		<link rel="stylesheet" href="../css/ge-new.css" type="text/css" media="all">
        <link rel="stylesheet" href="../style.css" type="text/css" media="all">
    <title>Ge2 PHP Doc</title>
	</head>
    <body class='doc' >
<nav topnav class='flex'>
<button class='naked' data-toggle='#sitemenu'><i data-icon='menu'></i></button>
<div class='flex middle right'>
	<button onclick='ta.theme_switch(this)' data-theme='light' class='themeswitcher naked'>
	<i class='dark' data-icon='adjust-2'></i>
	<i class='light' data-icon='adjust'></i>
	</button>
<a href='/ge2/' class='favicon'><img src='/favicon.ico'></a>
</div>
</nav><!--topnav-->
        <div id='sitemenu' class='hide'>
            <button class='naked closer' data-toggle='#sitemenu'>
                <i data-icon='cross'></i>
            </button>
            <header>
                <h1 class='red fg'>(骼)</h1>
            </header>
            <div class='flex w100 sitemenu container hide' data-fetch='../_sitemenu.html'></div>
        </div>
        <div class='flex warp container'>
	
	<nav class="sidebar">
      <ul>
        <?php
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $files = scandir($files_dir);
            $php_files = array_filter($files, function ($file) {
                return pathinfo($file, PATHINFO_EXTENSION) === 'php';
            });
            foreach ($php_files as $file) {
                $file_path = $files_dir . $file;
                echo "<li><a href='?file=$file'>$file</a></li>";
            }
        }
        ?>
      </ul>

    </nav>
    <div class="content tocindex">
      <?php
      if (isset($_GET['file'])) {
          $selected_file = $_GET['file'];
          $file_path = $files_dir . $selected_file;
          $docblock_html = process_docblock($file_path);
          echo $docblock_html;
      } else {?>
		
		<h1>DocBlock</h1>
		
		<p>This doc is read Docblock directly from the PHP script,
		not all function being docblock-ed.</p>
		
		<h2>Structure</h2>
		
		<p>composer not require. <code>namespace</code> not ready.</p>
		
		<pre><?php echo maketree('../php'); ?></pre>
		
		<h2>ge.php</h2>
		
		<pre><code>require_once('ge/traits.php');
require_once('ge/skel.php');
require_once('ge/html.php');
require_once('ge/sqlitev2.php');
$ge = new GE_html();
</code></pre>

		on index.php:
		<pre><code>require_once('php/ge.php');</code></pre>
	
	  <?php } ?>
    
	</div>
	<div id='toc'>
	<h5>On this Page</h5>
	<div class='toc'>
	</div>
	</div>
  </div>
<script>
document.addEventListener("DOMContentLoaded", (e)=>{

	ta.fetch('#sitemenu .container');
	taicon.delay();
/*
	if (document.querySelector('div.content').innerText != '') {
		gh.generateTOC('div.content');
	}
*/
});
</script>  
</body>
</html>

<?php } exit; ?>


