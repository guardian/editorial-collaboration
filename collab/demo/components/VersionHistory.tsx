import { Button } from '@guardian/stand/button';
import type { FunctionComponent } from 'react';
import { useCallback , useEffect , useState } from 'react';
import { formatDate } from '../libs/format-date';
import { getVersionHistorySelections } from '../libs/version-history-selections';
import type { SendableSteps, StepSelection } from '../model/steps';
import { panel as style } from '../styles';

type VersionHistoryProps = {
  steps: SendableSteps[];
  setStepSelection: (selection: StepSelection | null) => void;
}

const VersionHistory: FunctionComponent<VersionHistoryProps> = ({
  steps,
  setStepSelection,
}) => {
  const [versionHistorySelections, setVersionHistorySelections] = useState<StepSelection[]>(getVersionHistorySelections(steps));
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number | null>(null);

  useEffect(() => {
    setVersionHistorySelections(getVersionHistorySelections(steps));
    setSelectedVersionIndex(null);
    setStepSelection(null);
  }, [steps]);

  const onVersionClick = useCallback((selection: StepSelection, index: number) => {
    setStepSelection(selection);
    setSelectedVersionIndex(index);
  }, []);

  const onContinueEditingClick = useCallback(() => {
    setSelectedVersionIndex(null);
    setStepSelection(null);
  }, []);

  return (
    <div css={style.container}>
      <div css={style.header}>Version History</div>
      <div css={style.contents}>
        {(selectedVersionIndex != null) && (
          <Button cssOverrides={style.button} onClick={onContinueEditingClick}>Continue editing</Button>
        )}
        {versionHistorySelections.map((selection, index) => {
          const timestamp = steps[selection.from]?.clientTimestamp;
          return (
            <button
              key={index}
              css={[style.item, (index === selectedVersionIndex) && style.selected]}
              onClick={() => onVersionClick(selection, index)}
            >
              {(timestamp != null) && formatDate(timestamp)}
            </button>
          )
        }
        )}
      </div>
    </div>
  );
};

export { VersionHistory };