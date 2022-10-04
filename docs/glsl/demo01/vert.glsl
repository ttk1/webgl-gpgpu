#version 300 es

in vec3 position;
in vec3 color;

out vec3 vColor;

uniform mat4 transform;

void main() {
  gl_Position = transform * vec4(position, 1.0);
  vColor = color;
}
