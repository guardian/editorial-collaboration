import { panel } from '../styles';

const EditHistory = () => {
  const { container, header, contents } = panel;
  return (
    <div css={container}>
      <div css={header}>Version History</div>
      <div css={contents}>
        <p>placeholder</p>
      </div>
    </div>
  );
};

export {EditHistory};