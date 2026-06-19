import { receiveTransaction, sendableSteps } from 'prosemirror-collab';
import type { EditorState } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import type { SendableSteps } from '../model/sendable-steps';
import { sendStepsToServer } from './api';

class StepSender {
  private MAX_STEPS_PER_REQUEST = 500;
  private requestInFlight = false;
  private readonly documentId: string;
  private view?: EditorView;
  private buffer: SendableSteps[] = [];

  constructor(documentId: string) {
    this.documentId = documentId;
  }

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
      this.buffer.push({
        version: steps.version,
        steps: steps.steps.map(step => step.toJSON() as unknown),
        clientID: steps.clientID
      });
      this.sendStepsToServer();
    }
  };

  private chunk = () => {
    const stepCount = this.buffer.length < this.MAX_STEPS_PER_REQUEST ? this.buffer.length : this.MAX_STEPS_PER_REQUEST;
    return this.buffer.splice(0, stepCount);
  };

  private sendStepsToServer = () => {
    if (!this.requestInFlight) {
      const stepsToSend = this.chunk();
      if (stepsToSend.length > 0) {
        this.requestInFlight = true;
        sendStepsToServer(this.documentId, stepsToSend)
          .catch(err => {
            console.error(err); // TODO: logging/alerting
            this.buffer.unshift(...stepsToSend);
          }).finally(() =>
          this.requestInFlight = false
        );
      }
    }
  };
}

export { StepSender };