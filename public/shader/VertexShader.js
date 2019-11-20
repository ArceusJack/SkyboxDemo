export default `
varying vec3 pos;
  
      void main(){
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        
        pos = (modelMatrix * vec4(position, 1.)).xyz;
      }
`
