import {
	Button,
	Paper,
	TextField,
	Box,
	Container,
	Grid,
	Link,
	Typography,
} from "@mui/material";
import { useForm } from "../hooks/useForm";
import { useSignUpMutation } from "../redux/gql_endpoint";
import { FormEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
	const { reset: usernameReset, ...username } = useForm("text");
	const { reset: passwordReset, ...password } = useForm("password");
	const { reset: firstNameReset, ...firstName } = useForm("text");
	const { reset: lastNameReset, ...lastName } = useForm("text");
	const { reset: emailReset, ...email } = useForm("email");
	const navigate = useNavigate();

	const [addUser, { isLoading, isSuccess, error }] = useSignUpMutation();

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();

		await addUser({
			username: username.value,
			email: email.value,
			fullName: `${lastName.value} ${firstName.value}`,
			password: password.value,
		});

		usernameReset();
		passwordReset();
		firstNameReset();
		lastNameReset();
		emailReset();
	}

	useEffect(() => {
		if (typeof error === "string") {
			toast.error(error);
		}
		if (isSuccess) {
			navigate("/logged-in");
		}
	}, [error, isSuccess, navigate]);

	return (
		<Container
			component="main"
			maxWidth="xs">
			<Paper
				className={isLoading ? "loading_animation" : ""}
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
					Sign up
				</Typography>
				<Box
					component="form"
					onSubmit={handleSubmit}
					sx={{ mt: 3 }}>
					<Grid
						container
						spacing={2}>
						<Grid
							item
							xs={12}
							sm={6}>
							<TextField
								required
								fullWidth
								autoFocus
								variant="outlined"
								label="First name"
								autoComplete="first-name"
								{...firstName}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}>
							<TextField
								required
								fullWidth
								variant="outlined"
								label="Last name"
								autoComplete="family-name"
								{...lastName}
							/>
						</Grid>
						<Grid
							item
							xs={12}>
							<TextField
								required
								fullWidth
								variant="outlined"
								autoComplete="email"
								label="Email"
								{...email}
							/>
						</Grid>
						<Grid
							item
							xs={12}>
							<TextField
								required
								variant="outlined"
								label="Username"
								fullWidth
								color={
									username.value.length < 3
										? "error"
										: "primary"
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
								variant="outlined"
								label="Password"
								color={
									username.value.length < 3
										? "error"
										: "primary"
								}
								{...password}
							/>
						</Grid>
					</Grid>
					<Grid
						sx={{ mt: 2 }}
						container
						spacing={2}>
						<Grid
							xs={12}
							item>
							<Button
								type="submit"
								fullWidth
								variant="contained">
								{"Sign Up"}
							</Button>
						</Grid>
						<Grid
							xs={12}
							item>
							<Button
								fullWidth
								href="/"
								variant="contained"
								LinkComponent={Link}>
								{"Login"}
							</Button>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</Container>
	);
}
