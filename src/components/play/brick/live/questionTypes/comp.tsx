import React from 'react';

import {ComponentAttempt} from '../../model/model';


class CompComponent<Props, State> extends React.Component<Props, State> {
  getAnswer() { };

  getAttempt(): ComponentAttempt {
    let props = this.props as any;
    let att = this.mark({ answer: this.getAnswer(), correct: false, marks: 0, maxMarks: 0 }, props.attempt);
    return att;
  };

  mark(attempt: ComponentAttempt, prev: ComponentAttempt): ComponentAttempt { return attempt; }
}

export default CompComponent;
