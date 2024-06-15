<?php

header('Content-type: application/json');

$input = file_get_contents('php://input');

file_put_contents('/var/www/ge2/doc/content.txt',$input);
			
echo json_encode( $input, true );