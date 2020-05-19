import React, { useEffect } from "react";
import { RouteComponentProps, Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import { Grid, Button, Hidden } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import update from "immutability-helper";
// @ts-ignore
import { connect } from "react-redux";

import "./investigationBuildPage.scss";
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import QuestionPanelWorkArea from "./buildQuestions/questionPanelWorkArea";
import QuestionTypePage from "./questionType/questionType";
import SynthesisPage from "./synthesisPage/SynthesisPage";
import LastSave from "components/build/baseComponents/lastSave/LastSave";
import DragableTabs from "./dragTabs/dragableTabs";
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";
import PhoneQuestionPreview from "components/build/baseComponents/phonePreview/phoneQuestionPreview/PhoneQuestionPreview";
import SynthesisPreviewComponent from "components/build/baseComponents/phonePreview/synthesis/SynthesisPreview";
import DeleteQuestionDialog from "components/build/baseComponents/deleteQuestionDialog/DeleteQuestionDialog";
import QuestionTypePreview from "components/build/baseComponents/QuestionTypePreview";

import {
  Question,
  QuestionTypeEnum,
  QuestionComponentTypeEnum,
  HintStatus
} from "model/question";
import actions from "../../../redux/actions/brickActions";
import {validateQuestion} from "./questionService/QuestionService";


interface ApiQuestion {
  id?: number;
  contentBlocks: string;
  type: number;
}

interface InvestigationBuildProps extends RouteComponentProps<any> {
  brick: any;
  fetchBrick(brickId: number): void;
  saveBrick(brick: any): any;
}

const InvestigationBuildPage: React.FC<InvestigationBuildProps> = props => {
  const brickId = parseInt(props.match.params.brickId);

  if (!props.brick || props.brick.id !== brickId) {
    props.fetchBrick(brickId);
  }

  const { history } = props;
  const getNewQuestion = (type: number, active: boolean) => {
    return {
      type,
      active,
      hint: {
        value: "",
        list: [] as string[],
        status: HintStatus.None
      },
      components: [
        { type: 0 },
        { type: QuestionComponentTypeEnum.Component },
        { type: 0 }
      ]
    } as Question;
  };

  const [questions, setQuestions] = React.useState([
    getNewQuestion(QuestionTypeEnum.None, true)
  ] as Question[]);
  const [loaded, setStatus] = React.useState(false);
  const [locked, setLock] = React.useState(props.brick ? props.brick.locked : false);
  const [deleteDialogOpen, setDeleteDialog] = React.useState(false);
  const [submitDialogOpen, setSubmitDialog] = React.useState(false);
  const [validationRequired, setValidation] = React.useState(false);
  const [deleteQuestionIndex, setDeleteIndex] = React.useState(-1);
  const [activeQuestionType, setActiveType] = React.useState(QuestionTypeEnum.None);
  const [hoverQuestion, setHoverQuestion] = React.useState(QuestionTypeEnum.None);
  const [isSaving, setSavingStatus] = React.useState(false);

  /* Synthesis */
  let isSynthesisPage = false;
  if (history.location.pathname.slice(-10) === '/synthesis') {
    isSynthesisPage = true;
  }

  let initSynthesis = props.brick ? props.brick.synthesis as string : "";
  const [synthesis, setSynthesis] = React.useState(initSynthesis);
  useEffect(() => {
    if (props.brick && props.brick.synthesis) {
      setSynthesis(props.brick.synthesis)
    }
    if (props.brick && props.brick.locked) {
      setLock(true);
    }
  }, [props.brick]);
  /* Synthesis */

  if (!props.brick) {
    return <div>...Loading...</div>;
  }

  const getQuestionIndex = (question: Question) => {
    return questions.indexOf(question);
  };

  const unselectQuestions = () => {
    const updatedQuestions = questions.slice();
    updatedQuestions.forEach(q => (q.active = false));
    setQuestions(update(questions, { $set: updatedQuestions }));
  }

  let activeQuestion = questions.find(q => q.active === true) as Question;
  if (isSynthesisPage === true) {
    if (activeQuestion) {
      unselectQuestions();
      return <div>...Loading...</div>
    }
  } else if (!activeQuestion) {
    console.log("Can`t find active question");
    activeQuestion = {} as Question;
  }

  const editProposal = () => {
    saveBrick();
    history.push(`/build/new-brick/proposal`);
  }

  const setPreviousQuestion = () => {
    const index = getQuestionIndex(activeQuestion);
    if (index >= 1) {
      const updatedQuestions = questions.slice();
      updatedQuestions.forEach(q => (q.active = false));
      updatedQuestions[index - 1].active = true;
      setQuestions(update(questions, { $set: updatedQuestions }));
    } else {
      saveBrick();
      history.push('/build/new-brick/proposal');
    }
  };

  const setNextQuestion = () => {
    const index = getQuestionIndex(activeQuestion);
    let lastIndex = questions.length - 1;
    if (index < lastIndex) {
      const updatedQuestions = questions.slice();
      updatedQuestions.forEach(q => (q.active = false));
      updatedQuestions[index + 1].active = true;
      setQuestions(update(questions, { $set: updatedQuestions }));
    } else {
      createNewQuestion();
    }
  };

  const createNewQuestion = () => {
    const updatedQuestions = questions.slice();
    updatedQuestions.forEach(q => (q.active = false));
    updatedQuestions.push(getNewQuestion(QuestionTypeEnum.None, true));
    setQuestions(update(questions, { $set: updatedQuestions }));
    if (history.location.pathname.slice(-10) === '/synthesis') {
      history.push(`/build/brick/${brickId}/build/investigation/question`);
    }
    saveBrickQuestions(updatedQuestions);
  };

  const moveToSynthesis = () => {
    history.push(`/build/brick/${brickId}/build/investigation/synthesis`);
  }

  const setQuestionTypeAndMove = (type: QuestionTypeEnum) => {
    if (locked) { return; }
    setQuestionType(type);
    history.push(
      `/build/brick/${brickId}/build/investigation/question-component`
    );
  };

  const setQuestionType = (type: QuestionTypeEnum) => {
    if (locked) { return; }
    var index = getQuestionIndex(activeQuestion);
    const updatedQuestions = update(questions, { [index]: { type: { $set: type } } });
    console.log(updatedQuestions);
    setQuestions(updatedQuestions);
    saveBrickQuestions(updatedQuestions);
  };

  const getUniqueComponent = (question: Question) => {
    return question.components.find(
      c => c.type === QuestionComponentTypeEnum.Component
    );
  }

  const chooseOneToChooseSeveral = (type: QuestionTypeEnum) => {
    const index = getQuestionIndex(activeQuestion);
    const component = getUniqueComponent(activeQuestion);
    for (const answer of component.list) {
      answer.checked = false;
    }
    activeQuestion.type = type;
    const question = Object.assign({}, activeQuestion);
    setQuestion(index, question);
  };

  const convertToShortAnswer = (type: QuestionTypeEnum) => {
    const index = getQuestionIndex(activeQuestion);
    activeQuestion.type = type;
    const component = getUniqueComponent(activeQuestion);
    if (component.list && component.list.length > 0) {
      component.list = [component.list[0]];
    }
    const question = Object.assign({}, activeQuestion);
    setQuestion(index, question);
  }

  const convertQuestionTypes = (type: QuestionTypeEnum) => {
    if (
      type === QuestionTypeEnum.ChooseOne ||
      type === QuestionTypeEnum.ChooseSeveral
    ) {
      chooseOneToChooseSeveral(type);
    } else if (type === QuestionTypeEnum.Sort) {
      const index = getQuestionIndex(activeQuestion);
      activeQuestion.type = type;
      const question = Object.assign({}, activeQuestion);
      question.hint = {
        status: HintStatus.All,
        value: question.hint.value,
        list: []
      };
      setQuestion(index, question);
    } else if (type === QuestionTypeEnum.ShortAnswer) {
      convertToShortAnswer(type);
    } else {
      setQuestionType(type);
    }
    saveBrick();
  };

  const deleteQuestionByIndex = (index: number) => {
    let updatedQuestions = [];
    if (index !== 0) {
      updatedQuestions = update(questions, {
        $splice: [[index, 1]],
        0: { active: { $set: true } }
      });
      setQuestions(updatedQuestions);
    } else {
      updatedQuestions = update(questions, {
        $splice: [[index, 1]],
        [questions.length - 1]: { active: { $set: true } }
      });
      setQuestions(updatedQuestions);
    }
    if (deleteDialogOpen) {
      setDeleteDialog(false);
    }
    saveBrickQuestions(updatedQuestions);
  }

  const removeQuestion = (index: number) => {
    if (locked) { return; }
    if (questions.length === 1) {
      alert("You can`t delete last question");
      return;
    }
    if (questions[index].type) {
      setDeleteDialog(true);
      setDeleteIndex(index);
      return;
    }
    deleteQuestionByIndex(index);
  };

  const selectQuestion = (index: number) => {
    const updatedQuestions = questions.slice();
    updatedQuestions.forEach(q => (q.active = false));

    let selectedQuestion = updatedQuestions[index];
    if (selectedQuestion) {
      selectedQuestion.active = true;

      setQuestions(
        update(questions, { $set: updatedQuestions })
      );
    }
    if (history.location.pathname.slice(-10) === '/synthesis') {
      history.push(`/build/brick/${brickId}/build/investigation/question`)
    }
  };

  const toggleLock = () => {
    setLock(!locked);
    brick.locked = !locked;
    saveBrick();
  }

  const setQuestion = (index: number, question: Question) => {
    if (locked) { return; }
    setQuestions(update(questions, { [index]: { $set: question } }));
  };

  const { brick } = props;

  if (brick.id !== brickId) {
    return <div>...Loading...</div>;
  }

  if (brick.questions && loaded === false) {
    const parsedQuestions: Question[] = [];
    for (const question of brick.questions) {
      try {
        const parsedQuestion = JSON.parse(question.contentBlocks);
        if (parsedQuestion.components) {
          let q = {
            id: question.id,
            type: question.type,
            hint: parsedQuestion.hint,
            components: parsedQuestion.components
          } as Question;
          parsedQuestions.push(q);
        }
      } catch (e) {}
    }
    if (parsedQuestions.length > 0) {
      parsedQuestions[0].active = true;
      setQuestions(update(questions, { $set: parsedQuestions }));
      setStatus(update(loaded, { $set: true }));
    }
  }

  const moveToReview = () => {
    let invalidQuestion = questions.find(question => {
      return !validateQuestion(question);
    });
    if (invalidQuestion) {
      setSubmitDialog(true);
    } else {
      saveBrick();
      history.push(`/play/brick/${brickId}/intro?preview=true`);
    }
  }

  const submitInvalidBrick = () => {
    saveBrick();
    history.push(`/build/brick/${brickId}/build/investigation/submit`);
  }

  const hideInvalidBrick = () => {
    setValidation(true);
    setSubmitDialog(false);
  }

  const saveBrickQuestions = (updatedQuestions: Question[]) => {
    brick.questions = [];
    brick.synthesis = synthesis;
    for (let question of updatedQuestions) {
      const questionObject = {
        components: question.components,
        hint: question.hint
      };
      const apiQuestion = {
        type: question.type,
        contentBlocks: JSON.stringify(questionObject)
      } as ApiQuestion;
      if (question.id) {
        apiQuestion.id = question.id;
        apiQuestion.type = question.type;
      }
      brick.questions.push(apiQuestion);
    }
    props.saveBrick(brick);
  }

  const saveBrick = () => {
    setSavingStatus(true);
    brick.questions = [];
    brick.synthesis = synthesis;
    for (let question of questions) {
      let questionObject = {
        components: question.components,
        hint: question.hint
      };
      let apiQuestion = {
        type: question.type,
        contentBlocks: JSON.stringify(questionObject)
      } as ApiQuestion;
      if (question.id) {
        apiQuestion.id = question.id;
        apiQuestion.type = question.type;
      }
      brick.questions.push(apiQuestion);
    }
    props.saveBrick(brick).then((res:any) => {
      setSavingStatus(false);
    });
  };

  const updateComponents = (components: any[]) => {
    if (locked) { return; }
    const index = getQuestionIndex(activeQuestion);
    const updatedQuestions = questions.slice();
    updatedQuestions[index].components = components;
    setQuestions(update(questions, { $set: updatedQuestions }));
  }

  const exitAndSave = () => {
    saveBrick();
    history.push('/build');
  }

  const renderBuildQuestion = () => {
    return (
      <QuestionPanelWorkArea
        brickId={brickId}
        history={history}
        synthesis={brick.synthesis}
        questionsCount={questions.length}
        question={activeQuestion}
        getQuestionIndex={getQuestionIndex}
        setQuestion={setQuestion}
        toggleLock={toggleLock}
        locked={locked}
        updateComponents={updateComponents}
        setQuestionType={convertQuestionTypes}
        setPreviousQuestion={setPreviousQuestion}
        nextOrNewQuestion={setNextQuestion}
        saveBrick={saveBrick}
      />
    );
  };

  const renderQuestionComponent = () => {
    return (
      <QuestionTypePage
        synthesis={brick.synthesis}
        history={history}
        brickId={brickId}
        setHoverQuestion={setHoverQuestion}
        questionId={activeQuestion.id}
        activeQuestionType={activeQuestionType}
        setActiveQuestionType={setActiveType}
        setQuestionType={setQuestionTypeAndMove}
        questionType={activeQuestion.type}
      />
    );
  };

  return (
    <div className="investigation-build-page">
      <div style={{position: 'fixed'}}>
        <HomeButton onClick={exitAndSave} />
      </div>
      <Hidden only={['xs', 'sm']}>
        <div className="proposal-link" onClick={editProposal}>
          <div className="proposal-edit-icon"/>
          <div className="proposal-text">
            <div style={{lineHeight: 0.9}}>YOUR</div>
            <div style={{lineHeight: 2}}>PROP</div>
            <div style={{lineHeight: 0.9}}>OSAL</div>
          </div>
        </div>
        <Grid
          container direction="row"
          className="investigation-build-background"
          alignItems="center"
        >
          <Grid
            container
            item xs={12} sm={12} md={7} lg={9}
            alignItems="center"
            style={{ height: "100%" }}
            className="question-container"
          >
            <Grid
              container direction="row"
              justify="center" alignItems="center"
              style={{ height: "100%" }}
            >
              <Grid
                container
                item xs={12} sm={12} md={12} lg={9}
                style={{ height: "90%" }}
              >
                <DragableTabs
                  setQuestions={setQuestions}
                  questions={questions}
                  synthesis={synthesis}
                  validationRequired={validationRequired}
                  isSynthesisPage={isSynthesisPage}
                  moveToSynthesis={moveToSynthesis}
                  createNewQuestion={createNewQuestion}
                  selectQuestion={selectQuestion}
                  removeQuestion={removeQuestion}
                />
                <Switch>
                  <Route path="/build/brick/:brickId/build/investigation/question-component">
                    {renderBuildQuestion}
                  </Route>
                  <Route path="/build/brick/:brickId/build/investigation/question">
                    {renderQuestionComponent}
                  </Route>
                  <Route path="/build/brick/:brickId/build/investigation/synthesis">
                    <SynthesisPage synthesis={synthesis} onSynthesisChange={setSynthesis} onReview={moveToReview} />
                  </Route>
                </Switch>
              </Grid>
            </Grid>
          </Grid>
          <LastSave updated={brick.updated} isSaving={isSaving} />
          <Route path="/build/brick/:brickId/build/investigation/question-component">
            <PhoneQuestionPreview question={activeQuestion} />
          </Route>
          <Route path="/build/brick/:brickId/build/investigation/question">
            <QuestionTypePreview
              hoverQuestion={hoverQuestion}
              activeQuestionType={activeQuestionType}
            />
          </Route>
          <Route path="/build/brick/:brickId/build/investigation/synthesis">
            <PhonePreview Component={SynthesisPreviewComponent} data={synthesis} />
          </Route>
        </Grid>
        <Dialog
          open={submitDialogOpen}
          onClose={() => setSubmitDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="submit-brick-dialog"
        >
          <div className="dialog-header">
            <div>Some questions are incomplete.</div>
            <div>These are marked in red.</div>
            <div>Submit anyway?</div>
          </div>
          <Grid container direction="row" className="row-buttons" justify="center">
            <Button className="yes-button" onClick={() => submitInvalidBrick()}>Yes, never mind</Button>
            <Button className="no-button" onClick={() => hideInvalidBrick()}>No, keep working</Button>
          </Grid>
        </Dialog>
        <DeleteQuestionDialog
          open={deleteDialogOpen}
          index={deleteQuestionIndex}
          setDialog={setDeleteDialog}
          deleteQuestion={deleteQuestionByIndex}
        />
      </Hidden>
      <Hidden only={['md', 'lg', 'xl']}>
        <Dialog
          open={true}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="mobile-brick-dialog"
        >
          <div className="mobile-dialog-header" style={{padding: '4vh 4vw'}}>
            <div>You need desktop browser</div>
            <div>to use this page</div>
          </div>
          <Grid container direction="row" className="row-buttons" justify="center">
            <Button className="yes-button" onClick={() => history.push('/build')}>Move</Button>
          </Grid>
        </Dialog>
      </Hidden>
    </div>
  );
};

const mapState = (state: any) => {
  return {
    bricks: state.bricks.bricks,
    brick: state.brick.brick
  };
};

const mapDispatch = (dispatch: any) => {
  return {
    fetchBrick: (brickId: number) => dispatch(actions.fetchBrick(brickId)),
    saveBrick: (brick: any) => dispatch(actions.saveBrick(brick))
  };
};

const connector = connect(mapState, mapDispatch);

export default connector(InvestigationBuildPage);
