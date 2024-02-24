import { ChangeEvent, useState } from "react";

export function useForm(type: string) {
	const [value, setValue] = useState<string>("");

	function onChange(e: ChangeEvent<HTMLInputElement>) {
		setValue(e.target.value);
	}

	function reset() {
		setValue("");
	}

	return { value, onChange, reset, type };
}
