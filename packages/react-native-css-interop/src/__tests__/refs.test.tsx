/** @jsxImportSource react-native-css-interop */
import {
  PureComponent,
  createRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ViewProps } from "react-native";

import { render, createMockComponent, registerCSS } from "test-utils";

const testID = "react-native-css-interop";

const FunctionComponent = createMockComponent<any>((props: ViewProps) => null);

const ForwardRef = createMockComponent(
  forwardRef((props: ViewProps, ref: any) => {
    useImperativeHandle(ref, () => ({
      getProps: () => props,
    }));

    return null;
  }),
);

const ClassComponent = createMockComponent(
  class MyComponent extends PureComponent<any> {
    getProps = () => {
      return this.props;
    };
    render() {
      return null;
    }
  },
);

const ChildComponent = createMockComponent(
  forwardRef((props: ViewProps, ref: any) => {
    return <ClassComponent ref={ref} {...props} />;
  }),
);

test("FunctionComponent", () => {
  registerCSS(`.my-class { color: red; }`);
  const ref = createRef<any>();

  const originalError = console.error;
  const mockError = jest.fn();
  console.error = mockError;

  render(<FunctionComponent ref={ref} testID={testID} className="my-class" />);

  expect(mockError.mock.lastCall?.[0]).toMatch(
    /Warning: Function components cannot be given refs\. Attempts to access this ref will fail\. Did you mean to use React\.forwardRef()?/,
  );

  console.error = originalError;
});

test("ForwardRef", () => {
  registerCSS(`.my-class { color: red; }`);
  const ref = createRef<any>();

  render(<ForwardRef ref={ref} testID={testID} className="my-class" />);

  expect(ref.current?.getProps().style).toEqual({
    color: "rgba(255, 0, 0, 1)",
  });
});

test("ClassComponent", () => {
  registerCSS(`.my-class { color: red; }`);
  const ref = createRef<any>();

  render(<ClassComponent ref={ref} testID={testID} className="my-class" />);

  expect(ref.current?.getProps().style).toEqual({
    color: "rgba(255, 0, 0, 1)",
  });
});

test("ChildComponent", () => {
  registerCSS(`.my-class { color: red; }`);
  const ref = createRef<any>();

  render(<ChildComponent ref={ref} testID={testID} className="my-class" />);

  expect(ref.current?.getProps().style).toEqual({
    color: "rgba(255, 0, 0, 1)",
  });
});
