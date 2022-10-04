#version 300 es

in vec2 position;
in vec2 velocity;

out vec2 vPosition;
out vec2 vVelocity;

uniform vec2 mouse;

void main(void) {
  gl_Position = vec4(position, 0.0, 1.0);
  gl_PointSize = 2.0;
  vPosition = position + velocity * 0.2;
  // 重力加速
  vVelocity = velocity + ((mouse - position) / pow(distance(mouse, position) + 1.0, 2.0)) * 0.05;
  // 空気抵抗
  vVelocity -= velocity * pow(length(velocity), 2.0) * 0.05;
}
