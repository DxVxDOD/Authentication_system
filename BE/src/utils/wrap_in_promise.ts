export async function wrapInPromise<T>(func: T) {
	const [result] = await Promise.allSettled([func]);
	if (result.status === "rejected") {
		return { data: null, error: result.reason };
	}

	return { data: result.value, error: null };
}
