import { fetchShaderSource, getShader } from './common';
/**
 * MD4 並列実行
 */
export async function demo05() {
  // 3 バイト分を同時に処理する
  const N = 1 << 24;
  const MAX_STEP = 1 << 8;
  const cvs = document.body.appendChild(document.createElement('canvas'));
  const gl = cvs.getContext('webgl2');

  // create shader program
  const program = gl.createProgram();
  gl.attachShader(program, getShader(gl, gl.VERTEX_SHADER, await fetchShaderSource('./glsl/demo05/vert.glsl')));
  gl.attachShader(program, getShader(gl, gl.FRAGMENT_SHADER, await fetchShaderSource('./glsl/demo05/frag.glsl')));
  gl.transformFeedbackVaryings(program, ['result'], gl.SEPARATE_ATTRIBS);
  gl.linkProgram(program);
  gl.useProgram(program);

  // create buffer
  const accLoc = gl.getAttribLocation(program, 'acc');
  gl.enableVertexAttribArray(accLoc);

  const buff0 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buff0);
  gl.bufferData(gl.ARRAY_BUFFER, Uint32Array.BYTES_PER_ELEMENT * N, gl.STREAM_COPY);
  gl.vertexAttribIPointer(accLoc, 1, gl.UNSIGNED_INT, 0, 0);

  const buff1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buff1);
  gl.bufferData(gl.ARRAY_BUFFER, Uint32Array.BYTES_PER_ELEMENT * N, gl.STREAM_COPY);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, gl.createTransformFeedback());
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buff1);

  const start = performance.now();

  // draw
  gl.enable(gl.RASTERIZER_DISCARD);
  const buff = [buff0, buff1];
  for (let step = 0; step < MAX_STEP; step++) {
    gl.uniform1ui(gl.getUniformLocation(program, 'step'), step);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, N);
    gl.endTransformFeedback();

    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buff[0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, buff[1]);
    gl.vertexAttribIPointer(accLoc, 1, gl.UNSIGNED_INT, 0, 0);
    buff.reverse();
  }
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
  console.log(`hash rate: ${Math.round((N * MAX_STEP * 1000 / (end - start)) / (1024 ** 2))} MH/s`);
}
