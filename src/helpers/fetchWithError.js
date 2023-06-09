export const fetchWithError = async (url, options) => {
  const response = await fetch(url, options);

  if (response.status === 200) {
    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }
    return result;
  }

  throw new Error(`${response.status} : ${response.statusText}`);
};
