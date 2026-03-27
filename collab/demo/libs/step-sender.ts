import { receiveTransaction, sendableSteps } from 'prosemirror-collab';
import type { EditorState } from 'prosemirror-state';
import type { Step } from 'prosemirror-transform';
import type { EditorView } from 'prosemirror-view';

class StepSender {
  private view?: EditorView;
  private buffer: Step[] = [];

  public setView = (view: EditorView): void => {
    this.view = view;
  }

  /**
   * Checks for steps that need to be sent to the central authority, applies them locally to avoid sending them twice
   * and adds them to the buffer.
   * @param state The current editor state.
   */
  public sendSteps = (state: EditorState) => {
    const steps = sendableSteps(state);
    if ((this.view != null) && (steps != null) && steps.steps.length > 0) {
      const transaction = receiveTransaction(state, steps.steps, steps.steps.map(() => steps.clientID));
      this.view.dispatch(transaction);
      this.buffer.push(...steps.steps);
    }
  }
}

export { StepSender };