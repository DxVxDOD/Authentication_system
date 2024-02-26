import SignUp from "./components/SignUp";
import Login from "./components/Login";
import {
	Box,
	CssBaseline,
	ThemeProvider,
	createTheme,
	useMediaQuery,
} from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { blueGrey, grey } from "@mui/material/colors";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { setUser } from "./redux/slices/auth";
import { useAppDispatch } from "./redux/hooks";
import LoggedIn from "./components/LoggedIn";
import { useAuth } from "./hooks/useAuth";

function App() {
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
	const dispatch = useAppDispatch();

	const theme = createTheme({
		palette: {
			mode: prefersDarkMode ? "dark" : "light",
			primary: {
				main: blueGrey.A700,
			},
			text: {
				primary: grey.A200,
			},
		},
	});

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("logged_in_user");
		if (loggedUserJSON !== null) {
			const loggedUser = JSON.parse(loggedUserJSON);
			dispatch(setUser(loggedUser));
		}
	}, [dispatch]);

	const { user } = useAuth();

	return (
		<ThemeProvider theme={theme}>
			<Box
				sx={{
					width: "100vw",
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}
				component={"main"}>
				<Toaster
					position="top-center"
					reverseOrder={false}
				/>

				<CssBaseline />
				<Routes>
					<Route
						path="/sign-up"
						element={<SignUp />}
					/>
					<Route
						path="/"
						element={<Login />}
					/>
					{user && (
						<Route
							path="/logged-in"
							element={<LoggedIn />}
						/>
					)}
				</Routes>
			</Box>
		</ThemeProvider>
	);
}

export default App;
