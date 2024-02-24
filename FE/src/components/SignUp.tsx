import { Button, Paper, TextField } from "@mui/material";
import { useForm } from "../hooks/useForm";
import { useAddUserMutation } from "../redux/gql_endpoint";
import { FormEvent } from "react";

export default function SignUp() {
	const { reset: usernameReset, ...username } = useForm("text");
	const { reset: passwordReset, ...password } = useForm("password");
	const { reset: firstNameReset, ...firstName } = useForm("text");
	const { reset: lastNameReset, ...lastName } = useForm("text");
	const { reset: emailReset, ...email } = useForm("text");

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [addUser, { isLoading }] = useAddUserMutation();

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

	return (
		<Paper
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				gap: "1rem",
				padding: "3rem",
			}}
			variant="outlined"
			component={"form"}
			onSubmit={handleSubmit}>
			<TextField
				required
				variant="outlined"
				label="First name"
				{...firstName}
			/>
			<TextField
				required
				variant="outlined"
				label="Last name"
				{...lastName}
			/>
			<TextField
				required
				variant="outlined"
				label="Username"
				color={username.value.length < 3 ? "error" : "primary"}
				{...username}
			/>
			<TextField
				required
				variant="outlined"
				label="Password"
				color={password.value.length < 3 ? "error" : "primary"}
				{...password}
			/>
			<TextField
				required
				variant="outlined"
				label="Email"
				color={password.value.length < 3 ? "error" : "primary"}
				{...email}
			/>
			<Button
				type="submit"
				variant="outlined">
				Sign up
			</Button>
		</Paper>
	);
}
