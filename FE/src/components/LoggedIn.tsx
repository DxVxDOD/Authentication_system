import { Button, Paper, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoggedIn() {
	const { user } = useAuth();

	const navigate = useNavigate();

	function handleLogout() {
		window.localStorage.clear();
		navigate("/");
		location.reload();
	}

	if (user) {
		return (
			<Paper
				sx={{
					padding: "2rem",
					display: "flex",
					flexDirection: "column",
					gap: "1rem",
				}}>
				<Typography
					variant="h4"
					component={"h1"}>
					{user.username} {"is logged in."}
				</Typography>
				<Button
					onClick={handleLogout}
					fullWidth
					aria-label="Log out button"
					variant="contained">
					Log out
				</Button>
			</Paper>
		);
	}
}
