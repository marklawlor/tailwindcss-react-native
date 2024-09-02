export function verifyJSX() {
  // @ts-expect-error
  return <react-native-css-interop-jsx-pragma-check /> === true;
}

export function verifyFlag(name: string, value?: unknown) {
  // return value === undefined
  //   ? Boolean(StyleSheet[INTERNAL_FLAGS][name])
  //   : StyleSheet[INTERNAL_FLAGS][name] === value;
}

export function verifyReceivedData() {
  // return StyleSheet[INTERNAL_FLAGS]["$receivedData"] === "true";
}

export function verifyHasStyles() {
  // return globalStyles.size > 0;
}
