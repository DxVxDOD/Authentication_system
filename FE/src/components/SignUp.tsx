import {
	Button,
	Paper,
	TextField,
	Box,
	Container,
	Grid,
	Typography,
} from "@mui/material";
import { useForm } from "../hooks/useForm";
import { useSignUpMutation } from "../redux/gql_endpoint";
import { FormEvent } from "react";

export default function SignUp() {
	const { reset: usernameReset, ...username } = useForm("text");
	const { reset: passwordReset, ...password } = useForm("password");
	const { reset: firstNameReset, ...firstName } = useForm("text");
	const { reset: lastNameReset, ...lastName } = useForm("text");
	const { reset: emailReset, ...email } = useForm("text");

	const [addUser, { isLoading }] = useSignUpMutation();

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

	if (isLoading) {
		return (
			<>
				It is Loading,
				<>Loading</>
			</>
		);
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
								autoComplete="family-name"
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
								{...firstName}
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
								label="Email"
								{...email}
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
								{...password}
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}>
						Sign Up
					</Button>
				</Box>
			</Paper>
		</Container>
	);
}
