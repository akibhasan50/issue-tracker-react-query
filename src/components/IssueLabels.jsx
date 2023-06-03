import React, { useState } from "react";
import { useLabelsData } from "../helpers/useLabelsData";
import { GoGear } from "react-icons/go";
import { useMutation, useQueryClient } from "react-query";
export default function IssueLabels({ labels, issueNumber }) {

  const labelQuery = useLabelsData();
  const [menuOpen, setMenuOpen] = useState(false);
  const queryClients = useQueryClient();
  const setLabels = useMutation(
    (labelId) => {
      const newLabels = labels.includes(labelId)
        ? labels.filter((currentLabel) => currentLabel === labelId)
        : [...labels, labelId];
     return fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ labels: newLabels }),
      }).then((res) => res.json());
    },
    {
      onMutate: (labelId) => {
        const oldLabels = queryClients.getQueryData([
          "issues",
          issueNumber,
        ]).labels;
        const newLabels = oldLabels.includes(labelId)
          ? oldLabels.filter((currentLabel) => currentLabel === labelId)
          : [...oldLabels, labelId];
        queryClients.setQueryData(["issues", issueNumber], (data) => ({
          ...data,
          labels: newLabels,
        }));
        return function rollback() {
          queryClients.setQueryData(["issues", issueNumber], (data) => {
            const rollbackLabels = oldLabels.includes(labelId)
            ? [...data.labels,labelId] : data.labels.filter((currentLabel) => currentLabel === labelId)
            return {
              ...data,
              labels: rollbackLabels,
            };
          });
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
        <span>Labels</span>
        {labelQuery.isLoading
          ? null
          : labels?.map((label) => {
              const labelObj = labelQuery?.data?.find(
                (queryLabel) => queryLabel.id === label
              );
              return (
                <span className={`label-${labelObj?.color}`} key={label}>
                  {labelObj?.name}
                </span>
              );
            })}
      </div>
      <GoGear
        onClick={() => !labelQuery.isLoading && setMenuOpen(!menuOpen)}
      ></GoGear>
      {menuOpen && (
        <div className="picker-menu labels">
          {labelQuery.data?.map((label) => {
            const selectedLabel = labelQuery?.data?.includes(label.id);
            return (
              <div
                key={label.id}
                className={selectedLabel ? "selected" : ""}
                style={{ backgroundColor: label.color }}
                onClick={() => setLabels.mutate(label.id)}
              >
                {label.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
