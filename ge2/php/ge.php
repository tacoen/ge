<?php
require_once('ge/traits.php');
require_once('ge/skel.php');
require_once('ge/html.php');

$ge = new GE_html();

/* usage of element */

$div = $ge->element('div');
$div->attr([
    'class' => 'container',
    'id' => 'main-content'
]);

$div->content('This is the main content area.');

$h1 = new GE_element('h1');
$h1->attr("id='heading' class='be' data-href='#'"); 
$h1->content('Welcome to the website');
$div->content($h1);
$h2 = new GE_element('h1');
$h2->content('Welcome to the website - 2');	
//echo $div."\n\n";

$div->content('<p>This is the main content area -- 2</p>');

echo $div;

//echo $div;


/* usage skel */

$coba = new GE_element('coba',true);
$coba->attr("id='sebuah'"); 
$coba->content('cobaaan dalam body');

$ge->structure();

$ge->title->content('coba-coba');

$ge->before->content('<nav>logo</nav>');
$ge->body->content($h1);
$ge->body->content($coba);
$ge->body->content($h2);
$ge->style->content('h1 { color: red} ');
$ge->script->content('console.log("boo");');

$ge->head_js->content(
	"<script type='text/javascript' src='/js/ta/icon.js' ></script>
	<script type='text/javascript' src='/js/ta/function.js' ></script>
	<script type='text/javascript' src='/js/ta/ui.js' ></script>
	<script type='text/javascript' src='/js/ta/loader.js' ></script>
	<script type='text/javascript' src='/js/boek.js' ></script>
	<script type='text/javascript' src='/js/index.js' ></script>"
);

echo $ge->html();

//print_r($ge->showSkel());


?>
