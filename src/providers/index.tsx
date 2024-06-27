import { Provider } from 'react-redux';
import { store } from './redux';

export function GlobalProviders(props: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			{props.children}
		</Provider>
	);
}
