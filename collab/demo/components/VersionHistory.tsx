import type { FunctionComponent } from 'react';
import type { SendableStepsFromServer } from '../model/steps';
import { panel } from '../styles';

type VersionHistoryProps = {
  steps?: SendableStepsFromServer[];
}

const VersionHistory: FunctionComponent<VersionHistoryProps> = ({
  steps,
}) => {
  const { container, header, contents } = panel;
  return (
    <div css={container}>
      <div css={header}>Version History</div>
      <div css={contents}>
        <p>{JSON.stringify(steps)}</p>
      </div>
    </div>
  );
};

export { VersionHistory };