import { Link } from "react-router-dom";
import { relativeDate } from "../helpers/relativeDate";
import { GoIssueOpened, GoIssueClosed, GoComment } from "react-icons/go";
import useUserData from "../helpers/useUserData";
import { Label } from "./Label";

export const IssueItem = ({
  title,
  number,
  assignee,
  commentCount,
  createdBy,
  createdDate,
  labels,
  status,
}) => {
  const assigneeUser = useUserData(assignee);
  const createdByUser = useUserData(createdBy);

  return (
    <li>
      <div>
        {status === "done" || status === "cancelled" ? (
          <GoIssueClosed style={{ color: "red" }}></GoIssueClosed>
        ) : (
          <GoIssueOpened style={{ color: "green" }}></GoIssueOpened>
        )}
      </div>
      <div className="issue-content">
        <span>
          <Link to={`/issue/${number}`}>{title}</Link>
          {labels.map((label) => {
            return <Label key={label} label={label}></Label>;
          })}
        </span>
        <small>
          #{number} opende {relativeDate(createdDate)}
          {createdByUser.isSuccess ? ` by ${createdByUser.data.name}` : ""}
        </small>
      </div>
      {assignee ? (
        <img
          alt="avatar"
          className="assigned-to"
          src={
            assigneeUser.isSuccess ? assigneeUser.data.profilePictureUrl : ""
          }
        ></img>
      ) : null}
      <span className="comment-count">
        {commentCount > 0 ? (
          <>
            <GoComment></GoComment> {commentCount}
          </>
        ) : null}
      </span>
    </li>
  );
};
