import { useState } from "react";
import IssuesList from "../components/IssuesList";
import LabelList from "../components/LabelList";
export default function Issues() {
  const [labels, setLabels] = useState([]);
  console.log(labels);
  return (
    <div>
      <main>
        <section>
          <h1>Issues</h1>
          <IssuesList />
        </section>
        <aside>
          <LabelList
            selected={labels}
            toggle={(label) =>
              setLabels((currentLabels) => {
                return currentLabels?.includes(label)
                  ? currentLabels?.filter(
                      (currentLabel) => currentLabel !== label
                    )
                  : currentLabels?.concat(label);
              })
            }
          />
        </aside>
      </main>
    </div>
  );
}
