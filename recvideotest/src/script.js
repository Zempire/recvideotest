import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Vector3 } from 'three'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI({
//     width: 400
// })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)



// Textures
const bakedTexture = textureLoader.load('recvideo.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

// Materials
const bakedMaterial = new THREE.MeshBasicMaterial({map: bakedTexture})
const redMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(0xff0000)})
const greenMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(0x00ff00)})


// Model
gltfLoader.load('recvideo.glb',
(gltf) => {
    gltf.scene.traverse((child) => {
        if (child.name.includes('Green')) {
            child.material = greenMaterial
        }
        else if (child.name.includes('Red')) {
            child.material = redMaterial
        }
        else {
            child.material = bakedMaterial

        }
    })
    scene.add(gltf.scene)
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 50
camera.position.y = 20
camera.position.z = -2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0,20,0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate camera
    if (camera.position.x > 0) {
        camera.position.x -= .2
    }
    if (camera.position.x < 1) {
        if (camera.position.z > -80) {
            camera.position.z -= .3
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()