const dropzone = document.getElementById('dropzone');
const previewImage = document.getElementById('preview');

dropzone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropzone.classList.add('hover');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('hover');
});

dropzone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropzone.classList.remove('hover');

  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const fileName = document.getElementById('file-name').value.trim();
    if (fileName) {
      previewImage.src = URL.createObjectURL(file);
      previewImage.style.display = 'block';
      uploadImage(file, fileName);
    } else {
      alert('Please enter a file name.');
    }
  } else {
    alert('Please drop an image file.');
  }
});

dropzone.addEventListener('click', () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.onchange = (event) => {
    const file = event.target.files[0];
    const fileName = document.getElementById('file-name').value.trim();
    if (fileName) {
      previewImage.src = URL.createObjectURL(file);
      previewImage.style.display = 'block';
      uploadImage(file, fileName);
    } else {
      alert('Please enter a file name.');
    }
  };
  fileInput.click();
});

function uploadImage(file, fileName) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('fileName', fileName);

  fetch('upload.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('Image uploaded successfully:', data);
  })
  .catch(error => {
    console.error('Error uploading image:', error);
  });
}