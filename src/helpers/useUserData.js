import { useQuery } from "react-query";

export default function useUserData(userId) {
  const userData = useQuery(["users", userId], () => {
    return fetch(`/api/users/${userId}`).then((res) => res.json());
  });

  return userData;
}
