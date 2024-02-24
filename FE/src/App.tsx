import { Box, CssBaseline } from "@mui/material";
import SignUp from "./components/SignUp";

function App() {
	return (
		<Box
			sx={{
				width: "100vw",
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				background: "grey",
				justifyContent: "center",
				alignItems: "center",
			}}
			component={"main"}>
			<CssBaseline />
			<SignUp />
		</Box>
	);
}

export default App;
