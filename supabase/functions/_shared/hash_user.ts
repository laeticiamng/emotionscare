const INITIAL_HASH = new Uint32Array([
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]);

const ROUND_CONSTANTS = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

const encoder = new TextEncoder();

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

function toUint32(value: number): number {
  return value >>> 0;
}

function createMessageSchedule(view: DataView, offset: number, schedule: Uint32Array) {
  for (let i = 0; i < 16; i += 1) {
    schedule[i] = view.getUint32(offset + i * 4, false);
  }

  for (let i = 16; i < 64; i += 1) {
    const s0 = rightRotate(schedule[i - 15], 7) ^ rightRotate(schedule[i - 15], 18) ^ (schedule[i - 15] >>> 3);
    const s1 = rightRotate(schedule[i - 2], 17) ^ rightRotate(schedule[i - 2], 19) ^ (schedule[i - 2] >>> 10);
    schedule[i] = toUint32(schedule[i - 16] + s0 + schedule[i - 7] + s1);
  }
}

function processBlock(state: Uint32Array, schedule: Uint32Array) {
  let a = state[0];
  let b = state[1];
  let c = state[2];
  let d = state[3];
  let e = state[4];
  let f = state[5];
  let g = state[6];
  let h = state[7];

  for (let i = 0; i < 64; i += 1) {
    const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
    const ch = (e & f) ^ (~e & g);
    const temp1 = toUint32(h + S1 + ch + ROUND_CONSTANTS[i] + schedule[i]);
    const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
    const maj = (a & b) ^ (a & c) ^ (b & c);
    const temp2 = toUint32(S0 + maj);

    h = g;
    g = f;
    f = e;
    e = toUint32(d + temp1);
    d = c;
    c = b;
    b = a;
    a = toUint32(temp1 + temp2);
  }

  state[0] = toUint32(state[0] + a);
  state[1] = toUint32(state[1] + b);
  state[2] = toUint32(state[2] + c);
  state[3] = toUint32(state[3] + d);
  state[4] = toUint32(state[4] + e);
  state[5] = toUint32(state[5] + f);
  state[6] = toUint32(state[6] + g);
  state[7] = toUint32(state[7] + h);
}

function finaliseHash(state: Uint32Array): string {
  let result = '';
  for (let i = 0; i < state.length; i += 1) {
    result += state[i].toString(16).padStart(8, '0');
  }
  return result;
}

export function hash(value: string): string {
  const data = encoder.encode(value);
  const originalBitLength = data.length * 8;

  const paddedLength = ((data.length + 9 + 63) >> 6) << 6;
  const buffer = new ArrayBuffer(paddedLength);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  bytes.set(data, 0);
  bytes[data.length] = 0x80;

  const high = Math.floor(originalBitLength / 0x1_0000_0000);
  const low = originalBitLength >>> 0;
  view.setUint32(paddedLength - 8, high, false);
  view.setUint32(paddedLength - 4, low, false);

  const state = new Uint32Array(INITIAL_HASH);
  const schedule = new Uint32Array(64);

  for (let offset = 0; offset < paddedLength; offset += 64) {
    createMessageSchedule(view, offset, schedule);
    processBlock(state, schedule);
  }

  return finaliseHash(state);
}
