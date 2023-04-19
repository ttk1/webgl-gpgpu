import { getShader } from '../common';
import fragmentShaderSource from './frag.glsl';
import vertexShaderSource from './vert.glsl';
/**
 * MD4 並列実行(for loop 版)
 */
export default async () => {
  // 2 バイト分を同時に処理する
  const N = 1 << 16;
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
  gl.bufferData(gl.ARRAY_BUFFER, Uint32Array.BYTES_PER_ELEMENT * N, gl.STREAM_COPY);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buff);

  const start = performance.now();

  // draw
  gl.enable(gl.RASTERIZER_DISCARD);
  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, N);
  gl.endTransformFeedback();
  gl.disable(gl.RASTERIZER_DISCARD);
  gl.finish();

  // 結果の表示
  const result = new Uint32Array(N);
  gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, result);
  result.forEach(e => {
    if (e != 0) {
      console.log(e);
    }
  });

  // ハッシュレート計算
  const end = performance.now();
  console.log(`duration: ${Math.round(end - start)} ms`);
  console.log(`hash rate: ${Math.round((2 ** 32 * 1000 / (end - start)) / (1024 ** 3))} GH/s`);
};
