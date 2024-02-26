import {
	Box,
	Button,
	Container,
	Grid,
	Link,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { useForm } from "../hooks/useForm";
import {
	useEnableFieldsMutation,
	useLoginMutation,
} from "../redux/gql_endpoint";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const { reset: usernameReset, ...username } = useForm("text");
	const { reset: passwordReset, ...password } = useForm("password");
	const [disabled, setDisabled] = useState(false);
	const navigate = useNavigate();

	const [
		login,
		{
			isLoading: isLoginLoading,
			isError: isLoginError,
			data: LoginData,
			error: loginError,
			isSuccess: isLoginSuccess,
		},
	] = useLoginMutation();

	const [enableFields, { data: enableFieldsData }] =
		useEnableFieldsMutation();

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		await login({
			username: username.value,
			password: password.value,
		});

		usernameReset();
		passwordReset();
	}

	useEffect(() => {
		if (typeof loginError === "string" && loginError.includes("Block")) {
			setDisabled(true);
			toast.error("Too many log in attempts, please try again later!");
			setTimeout(() => {
				enableFields();
				location.reload();
			}, 15000);
		} else if (typeof loginError === "string" || isLoginError) {
			toast.error(`Wrong username or password!`);
		}
		if (LoginData) {
			toast.success(`Login successful: ${LoginData.username}`);
		}

		if (enableFieldsData) {
			setDisabled(false);
		}
		if (isLoginSuccess) {
			navigate("/logged-in");
		}
	}, [
		loginError,
		LoginData,
		isLoginError,
		isLoginLoading,
		isLoginSuccess,
		enableFields,
		enableFieldsData,
		navigate,
	]);

	return (
		<Container
			component="main"
			maxWidth="xs">
			{LoginData && (
				<Paper
					elevation={2}
					sx={{
						padding: "1rem",
						display: "flex",
						justifyContent: "center",
					}}>
					<Typography>{LoginData.username} is logged in</Typography>
				</Paper>
			)}
			<Paper
				className={isLoginLoading ? "loading_animation" : ""}
				elevation={2}
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					padding: "3rem",
				}}>
				<Typography
					component="h1"
					variant="h5">
					Login
				</Typography>
				<Box
					component="form"
					onSubmit={handleSubmit}
					sx={{ mt: 1 }}>
					<Grid
						container
						spacing={2}>
						<Grid
							item
							xs={12}>
							<TextField
								required
								name="email"
								fullWidth
								autoComplete="username"
								autoFocus
								variant="outlined"
								label="Username"
								disabled={disabled || isLoginLoading}
								{...username}
							/>
						</Grid>
						<Grid
							item
							xs={12}>
							<TextField
								required
								fullWidth
								id="password"
								variant="outlined"
								label="Password"
								autoComplete="current-password"
								disabled={disabled || isLoginLoading}
								{...password}
							/>
						</Grid>
						<Grid
							item
							xs={12}>
							<Button
								disabled={disabled || isLoginLoading}
								type="submit"
								fullWidth
								variant="contained"
								LinkComponent={Link}>
								{"Login"}
							</Button>
						</Grid>
						<Grid
							item
							xs={12}>
							<Button
								fullWidth
								href="/sign-up"
								variant="contained"
								LinkComponent={Link}>
								{"Sign Up"}
							</Button>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</Container>
	);
}
