<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

function e($w,$n=false) { echo $w; if ($n) { echo "\n"; } }


function u($n=0.5) { return [ $n,$n*2,$n*4,$n/2,$n/4 ]; }

header("Content-type: text/css"); 

/*
$bg = new Color("#f1f1f1");
$fg = $bg->complementary();

echo $mycolor->complementary();
echo $mycolor->darken("15%");
*/

echo <<<EOL

/* this style.php act like sass */

.w100  { width:100%;  }
.w33   { width:33%;  }
.w34   { width:34%;  }

EOL;

$array =[];

for ($i=15; $i <= 85; $i+=5) {
	$str = ".w$i  { width:$i%; }";
	array_push($array,$str);
}

sort($array);

echo join("\n",$array);

echo "\n";

for ($i=25; $i <= 75; $i+=5) {

e("html .label$i label { display: inline-flex; width: calc($i% - var(--p1)); padding-right: var(--p1) }",1);
e("html .label$i label + * { display: inline-flex; width: calc(100% - $i%) }",1);


}

for ($i=1; $i <= 6; $i+=1) {

e(".bg-b$i { background-color: var(--b$i); color: var(--bg) } ",1);
e(".bg-w$i { background-color: var(--w$i); color: var(--fg) } ",1);
	
}
?>

