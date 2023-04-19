import { getShader } from '../common';
import fragmentShaderSource from './frag.glsl';
import vertexShaderSource from './vert.glsl';
/**
 * MD4
 */
export default async () => {
  const cvs = document.body.appendChild(document.createElement('canvas'));
  const gl = cvs.getContext('webgl2');

  // create shader program
  const program = gl.createProgram();
  gl.attachShader(program, getShader(gl, gl.VERTEX_SHADER, vertexShaderSource));
  gl.attachShader(program, getShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource));
  gl.transformFeedbackVaryings(program, ['result'], gl.SEPARATE_ATTRIBS);
  gl.linkProgram(program);
  gl.useProgram(program);

  // create buffer
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, gl.createTransformFeedback());
  const buff = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buff);
  gl.bufferData(gl.ARRAY_BUFFER, Uint8Array.BYTES_PER_ELEMENT * 16, gl.DYNAMIC_COPY);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buff);

  // draw
  gl.enable(gl.RASTERIZER_DISCARD);
  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, 1);
  gl.endTransformFeedback();
  gl.disable(gl.RASTERIZER_DISCARD);

  // get result
  const result = new Uint8Array(16);
  gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, result);
  let hex = '';
  for (const e of result) {
    hex += e.toString(16);
  }
  console.log(hex);
};
