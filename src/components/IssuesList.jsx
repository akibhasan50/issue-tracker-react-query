import { useQuery } from "react-query";
import { IssueItem } from "./IssueItem";
export default function IssuesList({ labels, status }) {
  const issuesQuery = useQuery(["issues", { labels, status }], () => {
    const labelString = labels.map((label) => `labels[]=${label}`).join("&");
    const statusString = status ? `&status=${status}` : "";
    return fetch(`/api/issues?${labelString}${statusString}`).then((res) => res.json());
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
