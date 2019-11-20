import {
  WebGLRenderTarget, LinearFilter, RGBAFormat, Object3D, Scene, PerspectiveCamera, Vector3, Color, BufferGeometry,
  BufferAttribute, PointsMaterial, Mesh, VertexColors, Points, MeshBasicMaterial, DoubleSide, BoxBufferGeometry,
  WebGLRenderer, SphereBufferGeometry, ShaderMaterial, Matrix4,
  AdditiveBlending, Float32BufferAttribute, Vector2, Raycaster,
  LuminanceFormat, UnsignedByteType, DataTexture, TextureLoader,
  BoxGeometry, MeshPhongMaterial
} from 'three' 

import SkyBox from '../public/Skybox.js'

const MAJOR_AXIS = 6378137
let RADIUS = MAJOR_AXIS
// --------------------------------------------------------------------------
// main scene setup
var mainScene = new Scene()
var mainCamera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1 * RADIUS, 100 * RADIUS )


var renderer = new WebGLRenderer()
window.__renderer = renderer
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

var geometry = new SphereBufferGeometry( RADIUS, 32, 32 )
var material = new MeshBasicMaterial( { color: 0x888888, wireframe: true } )
var sphere = new Mesh( geometry, material )
sphere.position.z = -2 * RADIUS
mainScene.add( sphere )

let skybox, skybox2
function addBox() {
  skybox = new SkyBox({parent: mainScene})
  skybox.position.z = -2 * RADIUS 
}

var animate = function () {

  requestAnimationFrame( animate )

  if (skybox) {
    skybox.rotation.x += 0.001
    skybox.rotation.y += 0.001
  }
  
  sphere.rotation.x += 0.001
  sphere.rotation.y += 0.001

  renderer.render( mainScene, mainCamera )
}

animate()
addBox()