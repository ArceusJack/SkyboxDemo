import { Object3D, MeshBasicMaterial, BoxGeometry, Mesh, DoubleSide, Color, Vector2, BoxBufferGeometry} from 'three'
import { singleMapTexure, multiMapTexture } from './Texture'

let mapUV = [new Vector2(.0, .0), new Vector2(1., .0), new Vector2(1., 1.), new Vector2(.0, 1.)]
const MAJOR_AXIS = 6378137
let RADIUS = MAJOR_AXIS
class SkyBox extends Object3D {
  constructor ({
    parent
  }) {
    super()
    parent.add(this)
    this.name = 'SkyBox'
    //console.log(this)
    console.log('skybox')
    this.addBox({
      BOXSIZE: MAJOR_AXIS * 4,
      radius: 200,
      NSTARS: 100000,
      opacity: 0.99,
      transparent: true,
      ifStar:true,
      closeStar: true
    })

    this.addBox({
      BOXSIZE: MAJOR_AXIS * 7.5,
      radius: 200,
      NSTARS: 100000,
      opacity: 0.5,
      transparent: true,
      ifStar: true,
      closeStar: false
    })
    this.addBox({
      BOXSIZE: MAJOR_AXIS * 8,
      radius: 400,
      NSTARS: 20000,
      opacity: 1.,
      transparent: true,
      ifStar: false,
      closeStar: false
    })
  }
  /**
   * addBox() aims to add skybox into the main scene. First we generate two types of texture from singleMapTexure() and multiMapTexture(). Then we decide if we need star or nebula, which can be determined by two boolean value ifStar and closeStar.
   * @param {BOXSIZE} //skybox size
   * @param {radius}  //use in generate texture 
   * @param {NSTARS}  //use in generate texture
   * @param {transparent}   //let the skybox be transparent
   * @param {opacity} //opacity
   * @param {ifStar}  //determine if the skybox render star or nebula
   * @param {closeStar}   //if the skybox render far star or close star
   */
  addBox ({
    BOXSIZE,
    radius,
    NSTARS,
    transparent = true,
    opacity,
    ifStar,
    closeStar
  } = {}) {
    //let materials

    let tTex = singleMapTexure({
      NSTARS,
      radius,
      transparent,
      opacity,
      closeStar
    })
    let multiMapTex = multiMapTexture({
      transparent,
      opacity
    })
    
  let multiMatetials = multiMapTex.map((texture, i) => {
    return new MeshBasicMaterial({ side: DoubleSide, map: texture, transparent: true, opacity: opacity, depthWrite: false})
  })

    let mapMaterials = new MeshBasicMaterial({
      map: tTex,
      opacity: opacity,
      transparent: true,
      side: DoubleSide,
      depthWrite: false                   //in case close object will cover far object
    })
    let multiPlaneMapGeo = new BoxGeometry(BOXSIZE, BOXSIZE, BOXSIZE)
    let singleMapGeo = new BoxBufferGeometry(BOXSIZE, BOXSIZE, BOXSIZE)  
    
    //begin uv mapping
    multiPlaneMapGeo.uvsNeedUpdate = true

    multiPlaneMapGeo.faceVertexUvs[0] = []
  //right
    multiPlaneMapGeo.faceVertexUvs[0][0] = [mapUV[1], mapUV[2], mapUV[0]]
    multiPlaneMapGeo.faceVertexUvs[0][1] = [mapUV[2], mapUV[3], mapUV[0]]
    //left
    multiPlaneMapGeo.faceVertexUvs[0][2] = [mapUV[1], mapUV[2], mapUV[0]]
    multiPlaneMapGeo.faceVertexUvs[0][3] = [mapUV[2], mapUV[3], mapUV[0]]
    //up
    multiPlaneMapGeo.faceVertexUvs[0][4] = [mapUV[3], mapUV[0], mapUV[2]]
    multiPlaneMapGeo.faceVertexUvs[0][5] = [mapUV[0], mapUV[1], mapUV[2]]
    //down
    multiPlaneMapGeo.faceVertexUvs[0][6] = [mapUV[3], mapUV[0], mapUV[2]]
    multiPlaneMapGeo.faceVertexUvs[0][7] = [mapUV[0], mapUV[1], mapUV[2]]
    //back
    multiPlaneMapGeo.faceVertexUvs[0][8] = [mapUV[1], mapUV[2], mapUV[0]]
    multiPlaneMapGeo.faceVertexUvs[0][9] = [mapUV[2], mapUV[3], mapUV[0]]
    //front
    multiPlaneMapGeo.faceVertexUvs[0][10] = [mapUV[1], mapUV[2], mapUV[0]]
    multiPlaneMapGeo.faceVertexUvs[0][11] = [mapUV[2], mapUV[3], mapUV[0]]

    let singleCube = new Mesh(singleMapGeo, mapMaterials)
    let multiCube = new Mesh(multiPlaneMapGeo, multiMatetials)

    //this.add(singleCube)
    if(!ifStar && !closeStar){
      this.add(multiCube)
    }else{
      this.add(singleCube)
    }
  }
}

export default SkyBox
