import React from "react";
import { StatusSelect } from "./StatusSelect";
import { useMutation, useQueryClient } from "react-query";

function IssueStatus({ status, issueNumber }) {
  const queryClients = useQueryClient();
  const setStatus = useMutation(
    (status) => {
      fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ status }),
      }).then((res) => res.json());
    },
    {
      onMutate: (status) => {
        const oldStatus = queryClients.getQueryData([
          "issues",
          issueNumber,
        ]).status;

        queryClients.setQueryData(["issues", issueNumber], (data) => ({
          ...data,
          status,
        }));
        return function rollback() {
          queryClients.setQueryData(["issues", issueNumber], (data) => ({
            ...data,
            status: oldStatus,
          }));
        };
      },
      onError: (error, variables, rollback) => {
        console.log(error, variables, rollback);
        rollback();
      },
      onSettled: () => {
        queryClients.invalidateQueries(["issues", issueNumber], {
          exact: true,
        });
      },
    }
  );
  return (
    <div className="issue-options">
      <div>
        <span>Status</span>
        <StatusSelect
          noEmptyOption
          value={status}
          onChange={(e) => setStatus.mutate(e.target.value)}
        ></StatusSelect>
      </div>
    </div>
  );
}

export default IssueStatus;
