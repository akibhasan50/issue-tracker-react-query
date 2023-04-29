import { Link } from "react-router-dom";
import { relativeDate } from "../helpers/relativeDate";
import { GoIssueOpened, GoIssueClosed, GoComment } from "react-icons/go";

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
            return (
              <span key={label} className={`label red`}>
                {label}
              </span>
            );
          })}
        </span>
        <small>
          #{number} opende {relativeDate(createdDate)} by {createdBy}
        </small>
      </div>
      {assignee ? <div>{assignee}</div> : null}
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
