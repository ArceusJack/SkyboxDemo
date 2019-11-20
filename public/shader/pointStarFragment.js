export default `
  #define mainImage(o,i)  o+=90.*fract(dot(sin(i),i))-89.-o
  void main(){	
    vec2 x=gl_FragCoord.xy;
    vec3 a=vec3(max((fract(dot(sin(x),x))-.99)*90.,.0));
    gl_FragColor=vec4(a,0.9);
  }
`