<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

function e($w,$n=false) { echo $w; if ($n) { echo "\n"; } }

include("Color.php");
use Color;


header("Content-type: text/css"); 

$unit="rem";
$pad=0.5;

$bg = new Color("#f1f1f1");
$fg = $bg->complementary();
/*
echo $mycolor->complementary();
echo $mycolor->darken("15%");
*/

?>

:root {
	--fg: #212121;
	--bg: #efefef;
	--active: #f00;
	--b1: #0002;
	--b2: #0004;
	--b3: #0006;
	--b4: #0008;
	--b5: #000a;
	--b6: #000c;
	--w1: #fff2;
	--w2: #fff4;
	--w3: #fff6;
	--w4: #fff8;
	--w5: #fffa;
	--w6: #fffc;
}


body { 
	background-color: var(--bg);
	color: var(--fg);
	margin:0; padding:0;
}


.flex { display: flex; flex-direction: row; }

h1:first-child,
h2:first-child,
h3:first-child,
h4:first-child,
h5:first-child,
h6:first-child,
p:first-child { margin-top: 0 }

h4,h5,h6 { margin-bottom: 0 }


/* this style.php act like sass */


<?php 
$str = ""; $array =[];
for ($i=15; $i <= 85; $i+=5) {

	$str = ".w".$i." { width: calc(".$i."% - ".($pad*2)."rem); padding: 0 ".$pad."rem; }";
	array_push($array,$str);
	$str = ".pad-no>.w".$i." { width: ".$i."%; padding: 0 0; }";
	array_push($array,$str);
	$str = ".pad-sm>.w".$i." { width: calc(".$i."% - ".$pad."rem); padding: 0 ".($pad/2)."rem; }";
	array_push($array,$str);
	$str = ".pad-lg>.w".$i." { width: calc(".$i."% - ".($pad*4)."rem); padding: 0 ".($pad*2)."rem; }";
	array_push($array,$str);
}

sort($array);

echo join("\n",$array);


echo "\n.marv-lg { margin: ".($pad*2)."rem 0; }";
echo "\n.marv { margin: ".$pad."rem 0; }";
echo "\n.marv-sm { margin: ".($pad/2)."rem 0; }";

echo "\n/* ---- ";

for ($i=1; $i <= 6; $i+=1) {
	echo "\n<h".$i.">heading - h".$i."</h".$i.">";
}

echo "*/\n";


?>
