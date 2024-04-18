// Retrieve the previously set background image from localStorage
const previousImage = localStorage.getItem('backgroundImage');
// Set the background image if it exists
if (previousImage) {
  document.body.style.backgroundImage = `url(${previousImage})`;
}
// Function to handle the image upload
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file.type.startsWith('image/')) { // Check if the selected file is an image
    const reader = new FileReader();
    reader.onload = function (e) {
      const image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        document.body.style.backgroundImage = `url(${image.src})`;
        // Store the selected background image in localStorage
        try{
          localStorage.setItem('backgroundImage', image.src);
        }catch(e){
          console.log(e);
        }
      };
    };
    reader.readAsDataURL(file);
  } else {
    alert('Please select an image file.');
  }
}
// Attach event listener to the image upload input
document.getElementById('bgImageInput').addEventListener('change', handleImageUpload);
