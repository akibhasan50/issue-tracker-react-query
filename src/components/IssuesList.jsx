import { useQuery } from "react-query";
import { IssueItem } from "./IssueItem";
import { useState } from "react";
import {fetchWithError} from "../helpers/fetchWithError";
export default function IssuesList({ labels, status }) {
  const issuesQuery = useQuery(
    ["issues", { labels, status }],
    () => {
      const labelString = labels.map((label) => `labels[]=${label}`).join("&");
      const statusString = status ? `&status=${status}` : "";
      return fetchWithError(`/api/issues?${labelString}${statusString}`);
    },
    {
      staleTime: 1000 * 60,
    }
  );
  const [searchValue, setSearchValue] = useState("");

  const searchQuery = useQuery(
    ["issues", "search", searchValue],
    () => {
      return fetch(`/api/search/issues?q=${searchValue}`).then((res) =>
        res.json()
      );
    },
    {
      enabled: !!searchValue.length > 0,
    }
  );
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearchValue(e.target.elements.search.value);
        }}
      >
        <label htmlFor="search">Search Issues</label>
        <input
          type="search"
          placeholder="Search"
          name="search"
          id="search"
          onChange={(e) => {
            if (e.target.value.length === 0) setSearchValue("");
          }}
        ></input>
      </form>
      <h2>Issues List</h2>
      {issuesQuery.isLoading ? (
        <p>Loading...</p>
      ) : issuesQuery.isError ? (
        <p>{issuesQuery.error.message}</p>
      ) : searchQuery.fetchStatus === "idle" &&
        searchQuery.isLoading === true ? (
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
      ) : (
        <>
          <h2>Search Results</h2>
          {searchQuery.isLoading ? (
            <p>Loading....</p>
          ) : (
            <>
              <p>{searchQuery.data.count} Results</p>
              <ul className="issues-list">
                {searchQuery?.data?.items?.map((searchResult) => (
                  <IssueItem
                    key={searchResult.id}
                    assignee={searchResult.assignee}
                    number={searchResult.number}
                    title={searchResult.title}
                    commentCount={searchResult.comments.length}
                    createdBy={searchResult.createdBy}
                    createdDate={searchResult.createdDate}
                    labels={searchResult.labels}
                    status={searchResult.status}
                  ></IssueItem>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}
