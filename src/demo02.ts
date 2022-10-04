import { fetchShaderSource, getShader } from './common';
/**
 * Transform Feedback
 */
export async function demo02() {
  const cvs = document.body.appendChild(document.createElement('canvas'));
  const gl = cvs.getContext('webgl2');

  // create shader program
  const program = gl.createProgram();
  gl.attachShader(program, getShader(gl, gl.VERTEX_SHADER, await fetchShaderSource('./glsl/demo02/vert.glsl')));
  gl.attachShader(program, getShader(gl, gl.FRAGMENT_SHADER, await fetchShaderSource('./glsl/demo02/frag.glsl')));
  gl.transformFeedbackVaryings(program, ['result'], gl.SEPARATE_ATTRIBS);
  gl.linkProgram(program);
  gl.useProgram(program);

  // create buffer
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, gl.createTransformFeedback());
  const buff = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buff);
  gl.bufferData(gl.ARRAY_BUFFER, Float32Array.BYTES_PER_ELEMENT * 4, gl.DYNAMIC_COPY);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buff);

  // draw
  gl.enable(gl.RASTERIZER_DISCARD);
  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, 1);
  gl.endTransformFeedback();
  gl.disable(gl.RASTERIZER_DISCARD);

  // get result
  const result = new Float32Array(4);
  gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, result);
  console.log(result);
}
