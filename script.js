document.addEventListener('DOMContentLoaded', function() {
  const openDrawerBtn = document.getElementById('openDrawerBtn');
  const drawer = document.getElementById('drawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const overlay = document.getElementById('overlay2');
  const bgImageInput = document.getElementById('bgImageInput');
  const imageList = document.getElementById('imageList');

  openDrawerBtn.addEventListener('click', function() {
    drawer.style.right = '0';
    overlay.style.display = 'block';
  });
  closeDrawerBtn.addEventListener('click', function() {
    drawer.style.right = '-300px';
    overlay.style.display = 'none';
  });
  cancelBtn.addEventListener('click', function() {
    drawer.style.right = '-300px';
    overlay.style.display = 'none';
  });

  overlay.addEventListener('click', function() {
    drawer.style.right = '-300px';
    overlay.style.display = 'none';
  });

  bgImageInput.addEventListener('change', function(event) {
    // Check if files are selected
    if (event.target.files && event.target.files.length > 0) {
      const selectedImage = event.target.files[0];
      if (selectedImage.type && selectedImage.type.startsWith('image/')) { // Check if the selected file is an image
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageUrl = e.target.result;
          try {
            // Fetch and display previous images
            const previousImages = JSON.parse(localStorage.getItem('previousImages')) || [];
            // Remove the oldest image from the UI and localStorage if there are already 4 images
            if (previousImages.length >=10) {
              const oldestImageSrc = previousImages.shift();
              // Remove the oldest image element from the UI
              const oldestImage = imageList.querySelector(`img[src="${oldestImageSrc}"]`);
              imageList.removeChild(oldestImage);
            }
            // Add the new image URL to the beginning of the previousImages array
            previousImages.unshift(imageUrl);
            // Update localStorage with the modified array
            localStorage.setItem('previousImages', JSON.stringify(previousImages));
            // Update the UI to show the new image in the drawer
            const img = document.createElement('img');
            img.src = imageUrl;
            img.classList.add('previous-image');
            img.style.maxWidth = '100px'; // Set maximum width for the image
            img.style.maxHeight = '100px'; // Set maximum height for the image
            img.style.borderRadius = '10px'; // Set border radius
            img.style.boxShadow = '10px 10px 5px rgba(0, 0, 0, 0.5)'; // Add box shadow
            imageList.appendChild(img);
          } catch (error) {
            // Handle the error by logging it
           // console.error('Error adding new photo:', error.message);
          }
        };
        reader.readAsDataURL(selectedImage);
      } else {
        // Display an error message if the selected file is not an image
        console.error('Please select an image file.');
      }
    }
  });

  // Function to initialize the drawer with previously added images
  function initializeDrawer() {
    // Fetch and display previous images
    const previousImages = JSON.parse(localStorage.getItem('previousImages')) || [];
    previousImages.forEach(function(imageSrc) {
      const img = document.createElement('img');
      img.src = imageSrc;
      img.classList.add('previous-image');
      img.style.maxWidth = '100px'; // Set maximum width for the image
      img.style.maxHeight = '100px'; // Set maximum height for the image
      img.style.borderRadius = '10px'; // Set border radius
      img.style.boxShadow = '10px 10px 5px rgba(0, 0, 0, 0.5)'; // Add box shadow
      imageList.appendChild(img);
    });
  }
  
  // Initialize the drawer when the DOM is loaded
  initializeDrawer();
});

