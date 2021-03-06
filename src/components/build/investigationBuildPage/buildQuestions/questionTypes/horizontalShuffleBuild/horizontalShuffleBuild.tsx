import React, {useEffect} from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';

import './horizontalShuffleBuild.scss'
import { Grid } from '@material-ui/core';


export interface VerticalShuffleBuildProps {
  locked: boolean
  data: any
  updateComponent(component: any): void
}

const HorizontalShuffleBuildComponent: React.FC<VerticalShuffleBuildProps> = ({ locked, data, updateComponent }) => {
  const [height, setHeight] = React.useState('0%');
  
  useEffect(() => calculateHeight());

  const newAnswer = () => ({ value: "" });
  
  if (!data.list) {
    data.list = [newAnswer(), newAnswer(), newAnswer()];
  } else if (data.list.length < 3) {
    data.list.push(newAnswer());
    updateComponent(data);
  }

  const [state, setState] = React.useState(data);

  const update = () => {
    setState(Object.assign({}, state));
    updateComponent(state);
    calculateHeight();
  }

  const changed = (shortAnswer: any, event: any) => {
    if (locked) { return; }
    shortAnswer.value = event.target.value;
    update();
  }

  const addAnswer = () => {
    if (locked) { return; }
    state.list.push({ value: "" });
    update();
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    state.list.splice(index, 1);
    update();
  }

  const renderAnswer = (answer: any, key: number) => {
    let column = (key % 3) + 1;
    return (
      <Grid container item xs={4} key={key}>
        <div className={`horizontal-shuffle-box horizontal-column-${column}`}>
          {
            (state.list.length > 3) ? <DeleteIcon className="right-top-icon" onClick={() => removeFromList(key)} /> : ""
          }
          <input
            disabled={locked}
            value={answer.value}
            onChange={(event) => changed(answer, event)}
            placeholder={"Enter A" + (key + 1) + "..."} />
        </div>
      </Grid>
    );
  }

  const calculateHeight = () => {
    let showButton = true;
    for (let answer of state.list) {
      if (answer.value === "") {
        showButton = false;
      }
    }
    showButton === true ? setHeight('auto') : setHeight('0%');
  }

  return (
    <div className="horizontal-shuffle-build">
      <div className="component-title">
        <div>Enter Answers below in order.</div>
        <div>These will be randomised in the Play Interface.</div>
      </div>
      <Grid container direction="row">
        {
          state.list.map((answer: any, i: number) => renderAnswer(answer, i))
        }
      </Grid>
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height={height}
        label="+ &nbsp;&nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R" />
    </div>
  )
}

export default HorizontalShuffleBuildComponent
