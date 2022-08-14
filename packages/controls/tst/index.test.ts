import {
  encodeValuesObject,
  decodeValuesObject,
  Controls,
  int,
  string,
  defaultValuesObject,
  validateValuesObject,
  defaultValuesObjectEncoded,
} from "../src/index";

describe("validateValuesObject", () => {
  it("returns false for missing strings", () => {
    const controls = [string("test", "hello")];
    const values = {};
    expect(validateValuesObject(controls, values)).toStrictEqual(false);
  });

  it("returns false for invalid strings", () => {
    const controls = [string("test", "hello")];
    const values = { test: 1 };
    expect(validateValuesObject(controls, values)).toStrictEqual(false);
  });

  it("returns true for valid strings", () => {
    const controls = [string("test", "hello")];
    const values = { test: "world" };
    expect(validateValuesObject(controls, values)).toStrictEqual(true);
  });

  it("returns false for missing numbers", () => {
    const controls = [int("test", 1)];
    const values = {};
    expect(validateValuesObject(controls, values)).toStrictEqual(false);
  });

  it("returns false for invalid numbers", () => {
    const controls = [int("test", 1)];
    const values = { test: "foo" };
    expect(validateValuesObject(controls, values)).toStrictEqual(false);
  });

  it("returns true for valid numbers", () => {
    const controls = [int("test", 1)];
    const values = { test: 1 };
    expect(validateValuesObject(controls, values)).toStrictEqual(true);
  });
});

describe("encodeValuesObject/decodeValuesObject", () => {
  it("can encode and decode an empty values object", () => {
    const controls: Controls = [];
    const values = {};
    const { result: encoded } = encodeValuesObject(controls, values);
    const { result: decoded } = decodeValuesObject(controls, encoded!);
    expect(decoded).toStrictEqual(values);
  });

  it("can encode and decode a number", () => {
    const controls = [int("test", 1)];
    const values = { test: 2 };
    const { result: encoded } = encodeValuesObject(controls, values);
    const { result: decoded } = decodeValuesObject(controls, encoded!);
    expect(decoded).toStrictEqual(values);
  });

  it("can encode and decode a string", () => {
    const controls = [string("test", "hello")];
    const values = { test: "world" };
    const { result: encoded } = encodeValuesObject(controls, values);
    const { result: decoded } = decodeValuesObject(controls, encoded!);
    expect(decoded).toStrictEqual(values);
  });

  it("can handle multiple values", () => {
    const controls = [int("number", 1), string("string", "hello")];
    const values = { number: 2, string: "world" };
    const { result: encoded } = encodeValuesObject(controls, values);
    const { result: decoded } = decodeValuesObject(controls, encoded!);
    expect(decoded).toStrictEqual(values);
  });
});

describe("defaultValuesObject", () => {
  it("pulls the default values out of controls", () => {
    const controls = [int("number", 1), string("string", "hello")];
    expect(defaultValuesObject(controls)).toStrictEqual({
      number: 1,
      string: "hello",
    });
  });
});

describe("defaultValuesObjectEncoded", () => {
  it("returns empty string for empty controls", () => {
    const controls: Controls = [];
    expect(defaultValuesObjectEncoded(controls)).toStrictEqual("");
  });

  it("returns encoded value when there are controls", () => {
    const controls = [
      int("number", 1),
      string("string", "hello"),
      int("anotherNumber", 100),
      string("finalString", "foobarbaz"),
    ];
    expect(defaultValuesObjectEncoded(controls)).toStrictEqual(
      "65y6gsbcdhqqrc9g61y6cvvfc9gq4rk1f8"
    );
  });
});
