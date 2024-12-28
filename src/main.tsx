import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { GlobalProviders } from "./providers/index.tsx";

const root = document.getElementById("root");

if (root === null) {
	throw new Error("Root not found");
}

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<GlobalProviders>
			<App />
		</GlobalProviders>
	</React.StrictMode>,
);
