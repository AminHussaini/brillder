import {
  HintStatus, Question, QuestionTypeEnum
} from "model/question";
import {getUniqueComponent} from './QuestionService';


function stripHtml(html: string) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

function stripHtmlList(list: any[]) {
  if (list && list.length > 0) {
    for (let item of list) {
      if (item.value) {
        item.value = stripHtml(item.value);
      }
    }
  }
}

function setQuestionType(question: Question, type: QuestionTypeEnum) {
  const updatedQuestion = Object.assign({}, question);
  updatedQuestion.type = type;
  return updatedQuestion;
}

function stripHtmlQuestionList(question: Question) {
  const component = getUniqueComponent(question);
  stripHtmlList(component.list);
  return question;
}


export function convertToSort(question: Question) {
  const updatedQuestion = setQuestionType(question, QuestionTypeEnum.Sort);
  updatedQuestion.hint = {
    status: HintStatus.All,
    value: question.hint.value,
    list: []
  };
  return updatedQuestion;
}

export function convertToShortAnswer(question: Question) {
  const updatedQuestion = setQuestionType(question, QuestionTypeEnum.ShortAnswer);
  const component = getUniqueComponent(updatedQuestion);
  if (component.list && component.list.length > 0) {
    component.list = [component.list[0]];
    if (component.list[0].value) {
      component.list[0].value = stripHtml(component.list[0].value);
    }
  }
  return updatedQuestion;
}

export function convertToVerticalShuffle(question: Question) {
  const updatedQuestion = setQuestionType(question, QuestionTypeEnum.VerticalShuffle);
  return stripHtmlQuestionList(updatedQuestion);
}

export function convertToChooseOne(question: Question) {
  const updatedQuestion = setQuestionType(question, QuestionTypeEnum.ChooseOne);
  const component = getUniqueComponent(updatedQuestion);
  for (const answer of component.list) {
    answer.checked = false;
  }
  return updatedQuestion;
};

export function convertToChooseSeveral(question: Question) {
  return setQuestionType(question, QuestionTypeEnum.ChooseSeveral);
}

export function convertToHorizontalShuffle(question: Question) {
  const updatedQuestion = setQuestionType(question, QuestionTypeEnum.HorizontalShuffle);
  return stripHtmlQuestionList(updatedQuestion);
}

export function convertToPairMatch(question: Question) {
  const updatedQuestion = setQuestionType(question, QuestionTypeEnum.PairMatch);
  return stripHtmlQuestionList(updatedQuestion);
}
