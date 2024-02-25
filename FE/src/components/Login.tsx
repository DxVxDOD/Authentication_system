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
import { useLoginMutation } from "../redux/gql_endpoint";
import { FormEvent } from "react";

export default function Login() {
	const { reset: usernameReset, ...username } = useForm("text");
	const { reset: passwordReset, ...password } = useForm("password");

	const [login, { isLoading, isError, data, error }] = useLoginMutation();

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		login({
			username: username.value,
			password: password.value,
		});

		usernameReset();
		passwordReset();
	}

	return (
		<Container
			component="main"
			maxWidth="xs">
			<Paper
				elevation={3}
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
					Sign in
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
								disabled={
									typeof error === "string" &&
									error.includes("Block")
										? true
										: false
								}
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
								disabled={
									typeof error === "string" &&
									error.includes("Block")
										? true
										: false
								}
								{...password}
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}>
						Sign In
					</Button>
					<Grid item>
						<Link
							href="#"
							variant="body2">
							{"Don't have an account? Sign Up"}
						</Link>
					</Grid>
				</Box>
			</Paper>
		</Container>
	);
}
