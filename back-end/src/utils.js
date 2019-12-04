export const isEmpty = (input) => {
  if (input === null || input === undefined) {
    return true;
  }
  if (typeof (input) === 'string' && input.trim() === '') {
    return true;
  }
  if (Array.isArray(input) && input.length === 0) {
    return true;
  }
  if (typeof (input) === 'object' && Object.keys(input).length === 0) {
    return true;
  }
  return false;
};

export const unescapeSlashes = (str) => {
  let parsedStr = str.replace(/(^|[^\\])(\\\\)*\\$/, "$&\\");
  try {
    parsedStr = JSON.parse(`"${parsedStr}"`);
  } catch (e) {
    return str;
  }
  return parsedStr;
}
