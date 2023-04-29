import { useQuery } from "react-query";
import { IssueItem } from "./IssueItem";
export default function IssuesList() {
  const issuesQuery = useQuery(["issues"], () => {
    return fetch("/api/issues/").then((res) => res.json());
  });
  return (
    <div>
      <h2>Issues List</h2>
      {issuesQuery.isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="issues-list">
          {issuesQuery.data?.map((issue) => (
            <IssueItem
              key={issue.id}
              assignee={issue.assignee}
              number={issue.number}
              title={issue.title}
              commentCount={issue.comments.length}
              createdBy={issue.createdBy}
              createdDate={issue.createdDate}
              labels={issue.labels}
              status={issue.status}
            ></IssueItem>
          ))}
        </ul>
      )}
    </div>
  );
}