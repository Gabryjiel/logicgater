import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux";

export function GlobalProviders(props: { children: React.ReactNode }) {
  return <ReduxProvider store={store}>{props.children}</ReduxProvider>;
}
