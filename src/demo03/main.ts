import { getShader } from '../common';
import fragmentShaderSource from './frag.glsl';
import vertexShaderSource from './vert.glsl';
/**
 * Particle
 */
export default async () => {
  const cvs = document.body.appendChild(document.createElement('canvas'));
  cvs.width = 500;
  cvs.height = 500;

  const gl = cvs.getContext('webgl2');
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // create shader program
  const program = gl.createProgram();
  gl.attachShader(program, getShader(gl, gl.VERTEX_SHADER, vertexShaderSource));
  gl.attachShader(program, getShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource));
  gl.transformFeedbackVaryings(program, ['vPosition', 'vVelocity'], gl.INTERLEAVED_ATTRIBS);
  gl.linkProgram(program);
  gl.useProgram(program);

  // create buffer
  const N = 50_000;
  const particles: number[] = [];
  for (let i = 0; i < N; i++) {
    // position
    particles.push((Math.random() - 0.5) * 2);
    particles.push((Math.random() - 0.5) * 2);
    // velocity
    particles.push(0.0);
    particles.push(0.0);
  }
  const buff0 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buff0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particles), gl.STREAM_COPY);
  // position
  const posLoc = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 4, 0);
  // velocity
  const velLoc = gl.getAttribLocation(program, 'velocity');
  gl.enableVertexAttribArray(velLoc);
  gl.vertexAttribPointer(velLoc, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 4, Float32Array.BYTES_PER_ELEMENT * 2);

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, gl.createTransformFeedback());
  const buff1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buff1);
  gl.bufferData(gl.ARRAY_BUFFER, Float32Array.BYTES_PER_ELEMENT * N * 4, gl.STREAM_COPY);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buff1);

  // mouse
  cvs.addEventListener('mousemove', (event: MouseEvent) => {
    const mouseX = ((event.offsetX / cvs.width) - 0.5) * 2.0;
    const mouseY = ((event.offsetY / cvs.height) - 0.5) * 2.0;
    gl.uniform2f(gl.getUniformLocation(program, 'mouse'), mouseX, -mouseY);
  }, false);

  // draw
  const buff = [buff0, buff1];
  const step = () => {
    gl.beginTransformFeedback(gl.POINTS);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, N);
    gl.endTransformFeedback();

    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buff[0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, buff[1]);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 4, 0);
    gl.vertexAttribPointer(velLoc, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 4, Float32Array.BYTES_PER_ELEMENT * 2);
    buff.reverse();

    requestAnimationFrame(step);
  };
  step();
};
