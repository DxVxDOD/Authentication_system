import { Button, Paper, TextField } from "@mui/material";
import { useForm } from "../hooks/useForm";

export default function SignUp() {
	const { reset: usernameReset, ...username } = useForm("text");
	const { reset: passwordReset, ...password } = useForm("password");

	function handleSubmit() {
		usernameReset();
		passwordReset();
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
				label="Username"
				{...username}
			/>
			<TextField
				required
				variant="outlined"
				label="Password"
				{...password}
			/>
			<Button variant="outlined">Sign up</Button>
		</Paper>
	);
}
