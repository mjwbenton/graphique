export const btoa = (val: string) => {
  const encoded =
    typeof window !== "undefined"
      ? window.btoa(val)
      : Buffer.from(val).toString("base64");
  return encoded.replace(/\=+$/, "");
};

export const atob =
  typeof window !== "undefined"
    ? window.atob
    : (val: string) => Buffer.from(val, "base64").toString("ascii");
