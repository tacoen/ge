<?php
if (isset($_FILES['image']) && isset($_POST['fileName'])) {
    $file = $_FILES['image'];
    $fileName = $_POST['fileName'];
    // $upload_dir = 'uploads/';
	$upload_dir = '';
    $upload_file = $upload_dir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $upload_file)) {
        echo json_encode(['message' => 'Image uploaded successfully']);
    } else {
        echo json_encode(['error' => 'Failed to upload image']);
    }
} else {
    echo json_encode(['error' => 'No image or file name provided']);
}
?>