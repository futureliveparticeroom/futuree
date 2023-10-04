import * as THREE from 'three';
// import GifLoader from 'three-gif-loader';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xEEEEEE);
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const gradientTexture = createGradientTexture();
const backgroundPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(111100, 150),
  new THREE.MeshBasicMaterial({ map: gradientTexture })
);
backgroundPlane.position.z = -155; 
scene.add(backgroundPlane);

function createGradientTexture() {
  const canvas = document.createElement('canvas');
  canvas.width =  256;
  canvas.height = 256;
  
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  
  gradient.addColorStop(0, '#AEC7E6'); // 顶部颜色，蓝色
  gradient.addColorStop(0.5, '#FFFFFF'); // 中间颜色，绿色
  gradient.addColorStop(1, '#AEC7E6'); // 底部颜色，红色
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  return new THREE.CanvasTexture(canvas);
}

// const loader = new GifLoader();
// fetch('http://localhost:3000/getVideos')
//   .then((response) => response.json())
//   .then((imagePaths) => {

// const planeCount = 8;
// const planeSize = 1.1;

let staticPlanes = [];
let dynamicPlanes = [];

fetch('http://localhost:3001/getImages')
  .then((response) => response.json())
  .then((imagePaths) => {
    console.log('Received image paths:', imagePaths);

    for (let i = 0; i < 20; i++) {
   
      if (i < 10) {
        const videoElement = document.getElementById(`video${i+1}`);
        videoElement.play();  // 确保在用户交互后调用
        
        const videoTexture = new THREE.VideoTexture(videoElement);
        const planeMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
        // 假设您的视频是16:9的宽高比
        const planeGeometry = new THREE.PlaneGeometry(1, 1 * (16/9));

        const staticPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        // 设置平面的位置
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 1.0) * 5 - 2;
        staticPlane.position.set(x, y, z);

        staticPlanes.push(staticPlane);
        scene.add(staticPlane);
      } 
      // 对于其它平面，使用图像纹理
      else {
        const textureLoader = new THREE.TextureLoader();

        textureLoader.load(
          imagePaths[i % imagePaths.length],
          (texture) => {
            const imageAspect = texture.image.height / texture.image.width;
            const planeWidth = 2;
            const planeHeight = planeWidth * imageAspect;

            const material = new THREE.MeshBasicMaterial({ map: texture });
            const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeWidth, planeHeight), material);
            plane.material.opacity = 1;

            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 1.0) * 5 - 2;
            plane.position.set(x, y, z);

            dynamicPlanes.push(plane);
            scene.add(plane);
          },
          undefined,
          (error) => {
            console.error('An error occurred:', error);
          }
        );
      }
    }
  })
  .catch((error) => console.error(error));




// for (let i = 1; i < planeCount; i++) {

//   const videoElement= document.getElementById('video4');

//   const texture = new THREE.VideoTexture( videoElement );

//   const material = new THREE.MeshBasicMaterial({ map: texture });
//   const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeSize, planeSize*1.778), material);
//   plane.material.opacity = 1;

//   const x = (Math.random() - 0.5) * 20;
//   const y = (Math.random() - 0.5) * 10;
//   const z = (Math.random() - 1.0) * 5 -2;
//   plane.position.set(x, y, z);

//   planes.push(plane);
//   scene.add(plane);
// }

//     for (let i = 1; i < planeCount; i++) {

//       const videoElement= document.getElementById('video3');

//       const texture = new THREE.VideoTexture( videoElement );

//       // const texture = new THREE.TextureLoader().load(imagePaths[i % imagePaths.length]);
//       const material = new THREE.MeshBasicMaterial({ map: texture });
//       const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeSize, planeSize*1.778), material);
//       plane.material.opacity = 1;
   
//       const x = (Math.random() - 0.5) * 20;
//       const y = (Math.random() - 0.5) * 10;
//       const z = (Math.random() - 1.0) * 5 -2;
//       plane.position.set(x, y, z);

//       planes.push(plane);
//       scene.add(plane);
//     }

//     for (let i = 1; i < planeCount; i++) {

//       const videoElement= document.getElementById('video2');

//       const texture = new THREE.VideoTexture( videoElement );

//       // const texture = new THREE.TextureLoader().load(imagePaths[i % imagePaths.length]);
//       const material = new THREE.MeshBasicMaterial({ map: texture });
//       const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeSize, planeSize*1.778), material);
//       plane.material.opacity = 1;
   
//       const x = (Math.random() - 0.5) * 20;
//       const y = (Math.random() - 0.5) * 10;
//       const z = (Math.random() - 1.0) * 5 -2;
//       plane.position.set(x, y, z);

//       planes.push(plane);
//       scene.add(plane);
//     }
//     for (let i = 1; i < planeCount; i++) {

//       const videoElement= document.getElementById('video1');

//       const texture = new THREE.VideoTexture( videoElement );

//       // const texture = new THREE.TextureLoader().load(imagePaths[i % imagePaths.length]);
//       const material = new THREE.MeshBasicMaterial({ map: texture });
//       const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeSize, planeSize*1.778), material);
//       plane.material.opacity = 1;
   
//       const x = (Math.random() - 0.5) * 20;
//       const y = (Math.random() - 0.5) * 10;
//       const z = (Math.random() - 1.0) * 5 -2;
//       plane.position.set(x, y, z);

//       planes.push(plane);
//       scene.add(plane);
//     }
//   // })
//   // .catch((error) => console.error(error));




camera.position.z = 5;

const moveDirection = new THREE.Vector3(0, 0, 0.005);


const animate = () => {
  requestAnimationFrame(animate);


  const allPlanes = staticPlanes.concat(dynamicPlanes);

  allPlanes.forEach((plane) => {
    plane.position.add(moveDirection);

    if (plane.position.z >1) {
      
      plane.position.z = -5;
    }

    if (plane.position.z > 0 && plane.position.z < 1) {

      plane.material.opacity = (1 - (plane.position.z ))/plane.position.z  ;

    } else if (plane.position.z < -2 && plane.position.z > -7) {

      plane.material.opacity = 1 - (-2 - plane.position.z) / 2;

    } else {
      plane.material.opacity = 1;
    }
  
    plane.material.transparent = true;
    plane.material.needsUpdate = true;
    const target = new THREE.Vector3(camera.position.x, plane.position.y, camera.position.z);

    plane.lookAt(target);
  });



  renderer.render(scene, camera);
};


animate();

function updateImages() {
  fetch('/getImages')
    .then((response) => response.json())
    .then((imagePaths) => {
      dynamicPlanes.forEach((plane, i) => {
        const textureLoader = new THREE.TextureLoader();

        textureLoader.load(
          imagePaths[i % imagePaths.length],
          (newTexture) => {
            const imageAspect = newTexture.image.width / newTexture.image.height;
            const planeHeight = plane.geometry.parameters.height; 
            const planeWidth = planeHeight * imageAspect;

            // 更新材料的紋理
            plane.material.map = newTexture;
            plane.material.needsUpdate = true;

            // 更新平面的幾何形狀
            plane.geometry.dispose(); // 釋放當前幾何形狀的記憶體
            plane.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
          },
          undefined,
          (error) => {
            console.error('An error occurred:', error);
          }
        );
      });
    })
    .catch((error) => console.error(error));
}

const updateInterval = 10000;
setInterval(updateImages, updateInterval);


// function updateImagesWhenIdle() {

//   updateImages();
  

//   // window.requestIdleCallback(() => {
//   //   updateImagesWhenIdle();
//   // }, { timeout: updateInterval });
// }

// const updateInterval = 10000; 
// window.requestIdleCallback(() => {
//   updateImagesWhenIdle();
// }, { timeout: updateInterval });
