import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.3), 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

function init() {
  const canvasContainer = document.getElementById('three-canvas');
  if (!canvasContainer) {
    console.error('Elemento #three-canvas não encontrado');
    return;
  }

  const headerHeight = window.innerHeight * 0.3;
  renderer.setSize(window.innerWidth, headerHeight);
  canvasContainer.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const isDarkMode = document.body.classList.contains('dark-mode');
  const material = new THREE.MeshBasicMaterial({ 
    color: isDarkMode ? 0xadd8e6 : 0x6a5acd, 
    wireframe: true 
  });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
  camera.position.z = 3;

  let isAnimating = true;
  const observer = new IntersectionObserver((entries) => {
    isAnimating = entries[0].isIntersecting;
  });
  observer.observe(canvasContainer);

  function animate() {
    if (isAnimating) {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
  }
  animate();
}

function onResize() {
  const headerHeight = window.innerHeight * 0.3;
  renderer.setSize(window.innerWidth, headerHeight);
  camera.aspect = window.innerWidth / headerHeight;
  camera.updateProjectionMatrix();
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

window.addEventListener('resize', debounce(onResize, 100));
document.addEventListener('DOMContentLoaded', init);