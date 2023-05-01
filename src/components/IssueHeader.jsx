import { GoIssueClosed, GoIssueOpened } from "react-icons/go";
import { possibleStatus } from "../helpers/defaultData";
import useUserData from "../helpers/useUserData";
import { relativeDate } from "../helpers/relativeDate";

export const IssueHeader = ({
  title,
  number,
  status = "todo",
  createdBy,
  createdDate,
  comments,
}) => {
  const statusObj = possibleStatus.find((pstatus) => pstatus.id === status);
  const createdUser = useUserData(createdBy);
  return (
    <header>
      <h2>
        {title} <span>#{number}</span>
        <div>
          <span
            className={
              status === "done" || status === " cancelled" ? "closed" : "open"
            }
          >
            {status === "done" || status === "cancelled" ? (
              <GoIssueClosed></GoIssueClosed>
            ) : (
              <GoIssueOpened></GoIssueOpened>
            )}
            {statusObj.label}
          </span>
          <span className="created-by">
            {createdUser.isLoading ? "..." : createdUser.data?.name}
          </span>
          opended this issue {relativeDate(createdDate)} . {comments.length}{" "}
          comments
        </div>
      </h2>
    </header>
  );
};
