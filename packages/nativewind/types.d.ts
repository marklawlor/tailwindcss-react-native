import "react-native";
import { VirtualizedListProps } from "react-native";

declare module "react-native" {
  interface FlatListProps<ItemT> extends VirtualizedListProps<ItemT> {
    className?: string;
    tw?: string;
  }

  interface ImagePropsBase {
    className?: string;
    tw?: string;
  }

  interface ViewProps {
    className?: string;
    tw?: string;
  }

  interface TextProps {
    className?: string;
    tw?: string;
  }

  interface SwitchProps {
    className?: string;
    tw?: string;
  }

  interface InputAccessoryViewProps {
    className?: string;
    tw?: string;
  }

  interface TouchableWithoutFeedbackProps {
    className?: string;
    tw?: string;
  }
}
