import { getShader, transferAttribData } from '../common';
import fragmentShaderSource from './frag.glsl';
import vertexShaderSource from './vert.glsl';
/**
 * 三角
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
  gl.linkProgram(program);
  gl.useProgram(program);

  // position
  transferAttribData(gl, [
    0.0, 1.0, 0.0,
    1.0, -1.0, 0.0,
    -1.0, -1.0, 0.0
  ], gl.getAttribLocation(program, 'position'));

  // color
  transferAttribData(gl, [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
  ], gl.getAttribLocation(program, 'color'));

  // transform (アフィン変換)
  gl.uniformMatrix4fv(gl.getUniformLocation(program, 'transform'), false, [
    0.5, 0, 0, 0,
    0, 0.5, 0, 0,
    0, 0, 0.5, 0,
    0, 0, 0, 1
  ]);

  // draw
  gl.useProgram(program);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
