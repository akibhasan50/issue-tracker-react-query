import React, { useState } from "react";
import useUserData from "../helpers/useUserData";
import { GoGear } from "react-icons/go";
import { useMutation, useQuery, useQueryClient } from "react-query";

export default function IssueAssignment({ assignee, issueNumber }) {
  const user = useUserData(assignee);
  const userQuery = useQuery(["users"], () =>
    fetch(`/api/users`).then((res) => res.json())
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const queryClients = useQueryClient();
  const setAssignment = useMutation(
    (assignee) => {
      fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ assignee }),
      }).then((res) => res.json());
    },
    {
      onMutate: (assignee) => {
        const oldAssignee = queryClients.getQueryData([
          "issues",
          issueNumber,
        ]).assignee;

        queryClients.setQueryData(["issues", issueNumber], (data) => ({
          ...data,
          assignee,
        }));
        return function rollback() {
          queryClients.setQueryData(["issues", issueNumber], (data) => ({
            ...data,
            assignee: oldAssignee,
          }));
        };
      },
      onError: (error, variables, rollback) => {
        rollback();
      },
      onSettled: () => {
        queryClients.invalidateQueries(["issues", issueNumber], {
          exact: true,
        });
        setMenuOpen(!menuOpen)
      },
    }
  );
  return (
    <div className="issue-options">
      <div>
        <span>Assignment</span>
        {user.isSuccess && (
          <div>
            <img src={user.data.profilePictureUrl} alt="pro pic"></img>
            {user.data.name}
          </div>
        )}
      </div>
      <GoGear
        onClick={() => !userQuery.isLoading && setMenuOpen(!menuOpen)}
      ></GoGear>
      {menuOpen && (
        <div className="picker-menu">
          {userQuery.data.map((user) => (
            <div className="" key={user.id} onClick={() =>setAssignment.mutate(user.id)}>
              <img src={user.profilePictureUrl} alt="pic"></img>
              {user.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
