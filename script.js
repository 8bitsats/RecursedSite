const canvas = document.getElementById('runic-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.onresize = resizeCanvas;
resizeCanvas();

const runes = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚻᛁᛉᛊᛏᛒᛖᛗᛚᛜᛟᛞ';
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(-1);

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFA500'; // Orange color
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const text = runes[Math.floor(Math.random() * runes.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

function animate() {
    draw();
    requestAnimationFrame(animate);
}

animate();

// Cloudinary Gallery Functionality
const cloudinaryConfig = {
    cloudName: 'labradojo',
    apiKey: '824359521237755',
    apiSecret: 'nQQs4wW5HBGPd4_xY6tta-bEsho',
    folder: 'Recursed'
};

let galleryImages = [];
let currentIndex = 0;

async function fetchImages() {
    try {
        const response = await axios.get(`https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/list/${cloudinaryConfig.folder}.json`);
        galleryImages = response.data.resources.map(resource => resource.secure_url);
        updateGalleryImage();
    } catch (error) {
        console.error('Error fetching images from Cloudinary:', error);
    }
}

function updateGalleryImage() {
    const galleryImg = document.querySelector('.gallery .image-container img:nth-child(1)');
    if (galleryImages.length > 0) {
        galleryImg.src = galleryImages[currentIndex];
    }
}

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.getElementById('close-lightbox');

document.querySelectorAll('.gallery .image-container img').forEach(img => {
    img.addEventListener('click', () => {
        lightbox.style.display = 'block';
        lightboxImg.src = img.src;
    });
});

closeLightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
});

document.getElementById('prev-btn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateGalleryImage();
});

document.getElementById('next-btn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateGalleryImage();
});

fetchImages();
