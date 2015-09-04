
var ocean_vert = function(){
return " varying vec3 eyeSpacePos;\
varying vec3 worldSpaceNormal;\
varying vec3 eyeSpaceNormal;\
uniform float heightScale; \
uniform float chopiness;  \
uniform vec2  size;      \
\
void main()\
{\
    float height     = gl_MultiTexCoord0.x;\
    vec2  slope      = gl_MultiTexCoord1.xy;\
\
  vec3 normal      = normalize(cross( vec3(0.0, slope.y*heightScale, 2.0 / size.x), vec3(2.0 / size.y, slope.x*heightScale, 0.0)));\
    worldSpaceNormal = normal;\
\
    vec4 pos         = vec4(gl_Vertex.x, height * heightScale, gl_Vertex.z, 1.0);\
    gl_Position      = gl_ModelViewProjectionMatrix * pos;\
    \
    eyeSpacePos      = (gl_ModelViewMatrix * pos).xyz;\
    eyeSpaceNormal   = (gl_NormalMatrix * normal).xyz;\
}";
}
