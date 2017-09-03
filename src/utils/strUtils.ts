export const bin2String = (array: number[]) => {
  let result = "";
  for (const b of array) {
    result += String.fromCharCode(b);
  }
  return result;
};
