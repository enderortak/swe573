export type Integer = number & { __int__: void };

export const roundToInt = (num: number): Integer => Math.round(num) as Integer;

export const toInt = (value: string): Integer => {
  return parseInt(value) as Integer;
};

export const checkIsInt = (num: number): num is Integer =>  num % 1 === 0;

export const assertAsInt = (num: number): Integer => {
  try {
    if (checkIsInt(num)) {
      return num;
    }
  } catch (err) {
    throw new Error(`Invalid Int value (error): ${num}`);
  }

  throw new Error(`Invalid Int value: ${num}`);
};

export type Float = number