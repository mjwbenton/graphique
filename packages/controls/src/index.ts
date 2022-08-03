export type ControlTypeMap = {
  string: string;
  number: number;
};

export type ControlType = keyof ControlTypeMap;

export type Control<
  TypeName extends ControlType,
  Name extends string,
  Type extends ControlTypeMap[TypeName] = ControlTypeMap[TypeName]
> = {
  type: TypeName;
  name: Name;
  defaultValue: Type;
};

export type Controls = Array<Control<ControlType, string>>;

export type ValuesObject<T extends Controls> = {
  [P in T[number] as P["name"]]: ControlTypeMap[P["type"]];
};

export function number<Name extends string>(
  name: Name,
  defaultValue: number
): Control<"number", Name> {
  return {
    type: "number",
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
    name,
    defaultValue,
  };
}

export function defaultValuesObject<T extends Controls>(controls: T) {
  return controls.reduce<ValuesObject<T>>(
    (acc, cur) => ({
      ...acc,
      [cur.name]: cur.defaultValue,
    }),
    {} as ValuesObject<T>
  );
}
