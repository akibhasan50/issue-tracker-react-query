import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { IssueHeader } from "./IssueHeader";
import useUserData from "../helpers/useUserData";
import { relativeDate } from "../helpers/relativeDate";

function useIssueData(issueNumber) {
  return useQuery(["issues", issueNumber], () => {
    return fetch(`/api/issues/${issueNumber}`).then((res) => res.json());
  });
}
const useIssueComments = (issueNumber) => {
  return useQuery(["issue", issueNumber, "comments"], () => {
    return fetch(`/api/issues/${issueNumber}/comments`).then((response) =>
      response.json()
    );
  });
};

export default function IssueDetails() {
  const { number } = useParams();
  const issueQuery = useIssueData(number);
  const commentsQuery = useIssueComments(number);

  console.log(commentsQuery.data);

  return (
    <div className="issue-details">
      {issueQuery.isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <IssueHeader {...issueQuery.data}></IssueHeader>
          <main>
            <section>
              {commentsQuery.isLoading ? (
                <p>Loading...</p>
              ) : (
                commentsQuery.data?.map((comment) => (
                  <Comment key={comment.id} {...comment}></Comment>
                ))
              )}
            </section>
          </main>
        </>
      )}
    </div>
  );
}
const Comment = ({ comment, createdBy, createdDate }) => {
  const userQuery = useUserData(createdBy);

  if (userQuery.isLoading) {
    return (
      <div className="comment">
        <div>
          <div className="comment-header">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="comment">
      <img src={userQuery.data.profilePictureUrl} alt="pro pic"></img>
      <div className="comment-header">
        <span>{userQuery.data.name} </span> commented{" "}
        <span>{relativeDate(createdDate)}</span>
        <div className="comment-body">{comment}</div>
      </div>
    </div>
  );
};
