import { useMemo } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/slices/auth";

export function useAuth() {
	const user = useAppSelector(selectCurrentUser);

	return useMemo(() => ({ user }), [user]);
}
