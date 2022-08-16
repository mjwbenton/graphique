import base32encode from "base32-encode";
import base32decode from "base32-decode";

const STANDARD = "Crockford";
const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

export function encode(val: string) {
  return base32encode(ENCODER.encode(val), STANDARD).toLowerCase();
}

export function decode(val: string) {
  return DECODER.decode(base32decode(val, STANDARD));
}
