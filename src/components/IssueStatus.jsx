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
        queryClients.setQueryData(["issues", issueNumber], (data) => ({
          ...data,
          sta,
        }));
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
