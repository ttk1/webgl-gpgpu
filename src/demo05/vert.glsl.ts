export default `#version 300 es

in uint acc;

flat out uint result;

uniform uint step;

uint F(uint X, uint Y, uint Z) {
  return X & Y | ~X  & Z;
}

uint G(uint X, uint Y, uint Z) {
  return X & Y | X & Z | Y & Z;
}

uint H(uint X, uint Y, uint Z) {
  return X ^ Y ^ Z;
}

uint rotate(uint a, int s) {
  return a << s | a >> (32 - s);
}

void FF(inout uint a, uint b, uint c, uint d, uint x, int s) {
  a = rotate(a + F(b, c, d) + x, s);
}

void GG(inout uint a, uint b, uint c, uint d, uint x, int s) {
  a = rotate(a + G(b, c, d) + x + 0x5a827999u, s);
}

void HH(inout uint a, uint b, uint c, uint d, uint x, int s) {
  a = rotate(a + H(b, c, d) + x + 0x6ed9eba1u, s);
}

uint A = 0x67452301u;
uint B = 0xefcdab89u;
uint C = 0x98badcfeu;
uint D = 0x10325476u;

void update(uint X[16]) {
  uint AA = A;
  uint BB = B;
  uint CC = C;
  uint DD = D;

  FF(A, B, C, D, X[0], 3);
  FF(D, A, B, C, X[1], 7);
  FF(C, D, A, B, X[2], 11);
  FF(B, C, D, A, X[3], 19);
  FF(A, B, C, D, X[4], 3);
  FF(D, A, B, C, X[5], 7);
  FF(C, D, A, B, X[6], 11);
  FF(B, C, D, A, X[7], 19);
  FF(A, B, C, D, X[8], 3);
  FF(D, A, B, C, X[9], 7);
  FF(C, D, A, B, X[10], 11);
  FF(B, C, D, A, X[11], 19);
  FF(A, B, C, D, X[12], 3);
  FF(D, A, B, C, X[13], 7);
  FF(C, D, A, B, X[14], 11);
  FF(B, C, D, A, X[15], 19);

  GG(A, B, C, D, X[0], 3);
  GG(D, A, B, C, X[4], 5);
  GG(C, D, A, B, X[8], 9);
  GG(B, C, D, A, X[12], 13);
  GG(A, B, C, D, X[1], 3);
  GG(D, A, B, C, X[5], 5);
  GG(C, D, A, B, X[9], 9);
  GG(B, C, D, A, X[13], 13);
  GG(A, B, C, D, X[2], 3);
  GG(D, A, B, C, X[6], 5);
  GG(C, D, A, B, X[10], 9);
  GG(B, C, D, A, X[14], 13);
  GG(A, B, C, D, X[3], 3);
  GG(D, A, B, C, X[7], 5);
  GG(C, D, A, B, X[11], 9);
  GG(B, C, D, A, X[15], 13);

  HH(A, B, C, D, X[0], 3);
  HH(D, A, B, C, X[8], 9);
  HH(C, D, A, B, X[4], 11);
  HH(B, C, D, A, X[12], 15);
  HH(A, B, C, D, X[2], 3);
  HH(D, A, B, C, X[10], 9);
  HH(C, D, A, B, X[6], 11);
  HH(B, C, D, A, X[14], 15);
  HH(A, B, C, D, X[1], 3);
  HH(D, A, B, C, X[9], 9);
  HH(C, D, A, B, X[5], 11);
  HH(B, C, D, A, X[13], 15);
  HH(A, B, C, D, X[3], 3);
  HH(D, A, B, C, X[11], 9);
  HH(C, D, A, B, X[7], 11);
  HH(B, C, D, A, X[15], 15);

  A += AA;
  B += BB;
  C += CC;
  D += DD;
}

void main(void) {
  // ハッシュ値の先頭が 00000000 の入力を探す
  uint word = step << 24 | uint(gl_VertexID);
  update(uint[](
    word, 0x80u, 0u, 0u,
    0u, 0u, 0u, 0u,
    0u, 0u, 0u, 0u,
    0u, 0u, 32u, 0u));
  result = (A == 0x00000000u) ? word : acc;
}
`;
