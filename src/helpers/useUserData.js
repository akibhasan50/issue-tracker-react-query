import { useQuery } from "react-query";

export default function useUserData(userId) {
  const userData = useQuery(
    ["users", userId],
    ({signal}) => {
      return fetch(`/api/users/${userId}`,{signal}).then((res) => res.json());
    },
    {
      staleTime: 1000 * 60 * 5,
    }
  );

  return userData;
}
