export const possibleStataus = [
  {
    id: "backlog",
    label: "Backlog",
  },
  {
    id: "todo",
    label: "To-do",
  },
  {
    id: "inProgress",
    label: "In Progress",
  },
  {
    id: "done",
    label: "Done",
  },
  {
    id: "cancelled",
    label: "Cancelled",
  },
];

export function StatusSelect({ value, onChange }) {
  return (
    <select value={value} onChange={onChange} className="status-select">
      <option value="">Select a status filter</option>
      {possibleStataus.map((status) => (
        <option value={status.id} key={status.id}>
          {status.label}
        </option>
      ))}
    </select>
  );
}
