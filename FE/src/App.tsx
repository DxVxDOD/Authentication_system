import SignUp from "./components/SignUp";
import Login from "./components/Login";
import { Box, CssBaseline } from "@mui/material";

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
			<Login />
		</Box>
	);
}

export default App;
