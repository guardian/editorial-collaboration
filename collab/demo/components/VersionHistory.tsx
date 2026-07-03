import type { FunctionComponent} from 'react';
import { useEffect , useState } from 'react';
import { formatDate } from '../libs/format-date';
import { getVersionHistorySelections } from '../libs/version-history-selections';
import type { SendableSteps, StepSelection } from '../model/steps';
import { panel } from '../styles';

type VersionHistoryProps = {
  steps: SendableSteps[];
}

const VersionHistory: FunctionComponent<VersionHistoryProps> = ({
  steps,
}) => {
  const { container, header, contents } = panel;
  const [versionHistorySelections, setVersionHistorySelections] = useState<StepSelection[]>(getVersionHistorySelections(steps));
  useEffect(() =>
    setVersionHistorySelections(getVersionHistorySelections(steps)),
    [steps]
  );
  return (
    <div css={container}>
      <div css={header}>Version History</div>
      <div css={contents}>
        <div>{versionHistorySelections.map((selection, index) =>
            <h3 key={index}>{formatDate(steps[selection.from].clientTimestamp)}</h3>
        )}</div>
      </div>
    </div>
  );
};

export { VersionHistory };