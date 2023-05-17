import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

export default function AddIssue() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const addIssues = useMutation(
    (issueBody) =>
      fetch("/api/issues", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(issueBody),
      }).then((response) => response.json()),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["issues"], { exact: true });
        queryClient.setQueriesData(["issues"], data.number.toString(), data);
        navigate(`/issue/${data.number}`);
      },
    }
  );

  return (
    <div className="add-issue">
      <h2>Add Issue</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (addIssues.isLoading) return;

          addIssues.mutate({
            comment: e.target.comment.value,
            title: e.target.title.value,
          });
        }}
      >
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" placeholder="Title"></input>
        <label htmlFor="comment">Comment</label>
        <textarea placeholder="Comment" name="comment" id="comment"></textarea>

        <button type="submit" disabled={addIssues.isLoading}>
          {addIssues.isLoading ? "Adding Issue..." : "Add Issue"}
        </button>
      </form>
    </div>
  );
}
