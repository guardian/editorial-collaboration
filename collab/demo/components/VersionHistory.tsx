import type { FunctionComponent } from 'react';
import { useCallback , useEffect , useState } from 'react';
import { formatDate } from '../libs/format-date';
import { getVersionHistorySelections } from '../libs/version-history-selections';
import type { SendableSteps, StepSelection } from '../model/steps';
import { panel as style } from '../styles';

type VersionHistoryProps = {
  steps: SendableSteps[];
  setCurrentSteps: (steps: SendableSteps[]) => void;
  setEditing: (readOnly: boolean) => void;
}

const VersionHistory: FunctionComponent<VersionHistoryProps> = ({
  steps,
  setCurrentSteps,
  setEditing,
}) => {
  const [versionHistorySelections, setVersionHistorySelections] = useState<StepSelection[]>(getVersionHistorySelections(steps));
  const [selectedVersion, setSelectedVersion] = useState<number>();
  useEffect(() => {
    setVersionHistorySelections(getVersionHistorySelections(steps));
    setSelectedVersion(undefined);
  }, [steps]);
  const onClick = useCallback((selection: StepSelection, index: number) => {
    setCurrentSteps(steps.slice(0, selection.to + 1));
    setSelectedVersion(index);
    setEditing(false);
  }, [steps]);
  return (
    <div css={style.container}>
      <div css={style.header}>Version History</div>
      <div css={style.contents}>
        {versionHistorySelections.map((selection, index) =>
            <button
              key={index}
              css={[style.item, (index === selectedVersion) && style.selected]}
              onClick={() => onClick(selection, index)}
            >
              {formatDate(steps[selection.from]?.clientTimestamp)}
            </button>
        )}
      </div>
    </div>
  );
};

export { VersionHistory };