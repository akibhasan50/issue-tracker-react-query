import { useQuery } from "react-query";

export const useLabelsData = () => {
  const labelsQuery = useQuery(["labels"], () => {
    return fetch("/api/labels").then((res) => res.json());
  });
  return labelsQuery;
};
