import { btoa, atob } from "./base64";
import * as yup from "yup";

export type ControlTypeMap = {
  string: string;
  int: number;
};

export type ControlType = keyof ControlTypeMap;

export type Control<
  TypeName extends ControlType,
  Name extends string,
  Type extends ControlTypeMap[TypeName] = ControlTypeMap[TypeName]
> = {
  type: TypeName;
  validate: (v: unknown) => boolean;
  name: Name;
  defaultValue: Type;
};

export type Controls = Array<Control<ControlType, string>>;

export type ValuesObject<T extends Controls> = {
  [P in T[number] as P["name"]]: ControlTypeMap[P["type"]];
};

const JOIN_VALUE = "|";

export function int<Name extends string>(
  name: Name,
  defaultValue: number
): Control<"int", Name> {
  return {
    type: "int",
    validate: (v) =>
      yup.number().required().integer().min(0).isValidSync(v, { strict: true }),
    name,
    defaultValue,
  };
}

export function string<Name extends string>(
  name: Name,
  defaultValue: string
): Control<"string", Name> {
  return {
    type: "string",
    validate: (v) => yup.string().required().isValidSync(v, { strict: true }),
    name,
    defaultValue,
  };
}

export function defaultValuesObject<T extends Controls>(
  controls: T
): ValuesObject<T> {
  return controls.reduce<ValuesObject<T>>(
    (acc, cur) => ({
      ...acc,
      [cur.name]: cur.defaultValue,
    }),
    {} as ValuesObject<T>
  );
}

type ValidatedResult<ResultType> =
  | {
      valid: true;
      result: ResultType;
    }
  | { valid: false; result: undefined };

export function validateValuesObject(
  controls: Controls,
  values: ValuesObject<Controls>
): boolean {
  return !controls.some(({ name, validate }) => !validate(values[name]));
}

export function encodeValuesObject(
  controls: Controls,
  values: ValuesObject<Controls>
): ValidatedResult<string> {
  if (!validateValuesObject(controls, values)) {
    return { valid: false, result: undefined };
  }
  const str = controls.map(({ name }) => values[name]).join(JOIN_VALUE);
  return { valid: true, result: btoa(str) };
}

export function decodeValuesObject(
  controls: Controls,
  encoded: string
): ValidatedResult<ValuesObject<Controls>> {
  const str = atob(encoded);
  const valuesObject = str
    ? Object.fromEntries(
        str
          .split(JOIN_VALUE)
          .map((v, i) => [
            controls[i].name,
            controls[i].type === "int" ? parseFloat(v) : v,
          ])
      )
    : {};
  if (!validateValuesObject(controls, valuesObject)) {
    return { valid: false, result: undefined };
  }
  return { valid: true, result: valuesObject };
}
