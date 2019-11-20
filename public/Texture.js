import { Vector3, BufferGeometry, Color, Float32BufferAttribute, Mesh, Scene, PerspectiveCamera, WebGLRenderTarget,
  Vector2, ShaderMaterial, LinearFilter, RGBAFormat, DoubleSide, Matrix4, Line } from 'three'
import starVertexShader from './shader/VertexShader'
import starFragmentShader from './shader/starFragmentShader'
import NebulaFragment from './shader/NebulaFragment'
import pointStarFragment from './shader/pointStarFragment'

let scene = new Scene()
let camera = new PerspectiveCamera(90, 1, .1, 10000)
//scene.add(camera)
const RESOLUTION = 1024
//buffertarget array stores textures map within cube
let bufferTargetArray = []
for (let i=0;i<6;++i) {
  let bufferTarget = new WebGLRenderTarget(RESOLUTION, RESOLUTION,
    {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat
    })
  bufferTarget.setSize(RESOLUTION, RESOLUTION)
  bufferTargetArray.push(bufferTarget)
}
//far star buffertarget
let pointstarBufferTarger = new WebGLRenderTarget(RESOLUTION, RESOLUTION,{
  minFilter: LinearFilter,
  magFilter: LinearFilter,
  format: RGBAFormat
})
pointstarBufferTarger.setSize(RESOLUTION, RESOLUTION)
//buffertarget store close star
let starBufferTarget = new WebGLRenderTarget(RESOLUTION, RESOLUTION, {
  minFilter: LinearFilter,
  magFilter: LinearFilter,
  format: RGBAFormat
})
let nebPos = [
  -1, -1, -1,
   1, -1, -1,
   1,  1, -1,
  -1, -1, -1,
   1,  1, -1,
  -1,  1, -1,

   1, -1,  1,
  -1, -1,  1,
  -1,  1,  1,
   1, -1,  1,
  -1,  1,  1,
   1,  1,  1,

  1, -1, -1,
  1, -1,  1,
  1,  1,  1,
  1, -1, -1,
  1,  1,  1,
  1,  1, -1,

  -1, -1,  1,
  -1, -1, -1,
  -1,  1, -1,
  -1, -1,  1,
  -1,  1, -1,
  -1,  1,  1,

  -1,  1, -1,
   1,  1, -1,
   1,  1,  1,
  -1,  1, -1,
   1,  1,  1,
  -1,  1,  1,

  -1, -1,  1,
   1, -1,  1,
   1, -1, -1,
  -1, -1,  1,
   1, -1, -1,
  -1, -1, -1
]

const views = [
  { t: [ 1, 0, 0 ], u: [ 0, 1, 0 ] },             //right
  { t: [ -1, 0,0  ], u: [ 0, 1, 0 ] },           //left
  { t: [ 0, - 1, 0 ], u: [ 0, 1, 0 ] },         //down
  { t: [ 0, 1, 0 ], u: [ 0, 1, 0 ] },             //up

  { t: [ 0, 0, 1 ], u: [ 0, 1, 0 ] },             //back
  { t: [ 0, 0, - 1 ], u: [ 0, 1, 0 ] },           //front
]
//shader uniforms
let uniforms = {
  u_time: {value: 0.5},
  u_resolution: {value: new Vector2(window.innerWidth, window.innerHeight)},
  u_mouse: {value: new Vector2(window.innerHeight, window.innerWidth)},
  uScale: {value: 0.7344317968236282},  //how far the nebula zoom
  uColor: {value: new Vector3(0.0392, 0.3647, 0.6314)},
  //uColor:{value: new Vector3(0, 1, 1)},
  uIntensity: {value: 0.9505245321895928},                    //how opaque nebula will be
  uFalloff: {value: 1.975},                   //governs how quikly that intensityleties from zero to one         
  uOffset: {value: [578.3161600120366,-34.933149348944426,-287.80164290219545]},      //shift nebula, prevent overlap
  uPosition: {value: new Vector3(Math.random()* 0.01, Math.random() * 0.01,Math.random()*0.01)},
  uSize:{value: 0.15}
}
//nebula material, reapresent nebula in the sky
let onlyNebulaMaterial = new ShaderMaterial({
  uniforms: uniforms,
  vertexShader: starVertexShader,
  fragmentShader: NebulaFragment,
  side:DoubleSide
})
//close star material, stars that is close
let nebulaStarMaterial = new ShaderMaterial({
  uniforms: uniforms,
  vertexShader: starVertexShader,
  fragmentShader: starFragmentShader,
  side: DoubleSide
})
//point star material, represent far away star
let starmaterial = new ShaderMaterial({
  uniforms: uniforms,
  vertexShader: starVertexShader,
  fragmentShader: pointStarFragment,
  side: DoubleSide
})
//nebula texture
/**
 * this function generates six continuous texture that can apply on sky box as background, using camera looking at six direction
 *
 * @param {*} [{
 *   NSTARS,                  no use
 *   radius,                  no use
 *   transparent,             no use
 *   opacity, 
 *   ifStar
 * }={}]
 * @returns
 */
function multiMapTexture({
  transparent, // = false,
  opacity
} = {}){
  let geometry = new BufferGeometry()
  let spaceSys
  let currTarget
  geometry.addAttribute('position', new Float32BufferAttribute(nebPos, 3))
  spaceSys = new Mesh(geometry, onlyNebulaMaterial)
  scene.add( spaceSys );

  let renderer = window.__renderer

  for (let i=0;i<6;++i) {
    camera.matrixWorldNeedsUpdate = true
    let v = views[i];
    currTarget = bufferTargetArray[i]

    camera.position.set(0,0,0)
    camera.up.set(v.u[0], v.u[1], v.u[2])
    camera.lookAt(v.t[0], v.t[1], v.t[2])

    camera.updateProjectionMatrix ()

    renderer.clearColor(0, 0, 0, (transparent) ? opacity : 1)
    // magic code: https://stackoverflow.com/questions/38583219/  three-js-render-to-texture
    renderer.setRenderTarget(currTarget)
    renderer.render(scene, camera, currTarget, false)
    renderer.setRenderTarget(null)  
  }

  let tex = bufferTargetArray.map((target) => {
    return target.texture
  })

  scene.remove(spaceSys)
  return tex
}
//one map texture
/**
 * The function generate one texture that can apply on each side of box geometry
 *
 * @param {*} [{
 *   NSTARS ,          use as the number of star, attribute 'position'
 *   radius,            box radius, use to calculate star position
 *   transparent,       material transparency, use when clear the render target
 *   opacity,           material opacity, use when clear the render target
 *   ifStar,            if this is a star texuture,
 *   closeStar          if this is a close star texture
 * }={}]
 * @returns texture
 */
function singleMapTexure({
  NSTARS, // = 10000,
  radius, // = 200,
  transparent, // = false,
  opacity,
  closeStar
} = {}){
  let currRenderTarget
  let geometry = new BufferGeometry();
  let particleSystem
  let positions = [];
  let colors = new Float32Array(3 * NSTARS)
  let color = new Color(0xffffff)
  for ( let i = 0; i < NSTARS; i ++ ) {
    positions.push( ( Math.random() * 2 - 1 ) * radius );
    positions.push( ( Math.random() * 2 - 1 ) * radius );
    positions.push( ( Math.random() * 2 - 1 ) * radius );
    color.toArray(colors, i * 3)
  }
  geometry.addAttribute( 'position', new Float32BufferAttribute( positions, 3 ) )
  geometry.addAttribute('aColor', new Float32BufferAttribute(colors, 3))
  if(closeStar){
    console.log('closeStar')
    particleSystem = new Mesh(geometry, nebulaStarMaterial)
    currRenderTarget = starBufferTarget
  }else{
    console.log('farstar')
    particleSystem = new Mesh(geometry, starmaterial)
    currRenderTarget = pointstarBufferTarger
  }
  scene.add( particleSystem );

  let renderer = window.__renderer

  renderer.clearColor(0, 0, 0, (transparent) ? opacity : 1)
  // magic code: https://stackoverflow.com/questions/38583219/three-js-render-to-texture
  renderer.setRenderTarget(currRenderTarget)
  renderer.render(scene, camera, currRenderTarget, false)
  renderer.setRenderTarget(null)

  let tex = currRenderTarget.texture

  scene.remove(particleSystem)
  // scene.dispose()
  return tex
}

export { singleMapTexure,multiMapTexture, uniforms }
