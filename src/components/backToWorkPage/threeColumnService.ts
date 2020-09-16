import { Brick, BrickStatus } from 'model/brick';
import { AssignmentBrick, AssignmentBrickStatus } from 'model/assignment';
import { ThreeColumns, ThreeAssignmentColumns, Filters, ThreeColumnNames, AssignmentBrickData } from './model';
import {filterByStatus, filterByPrivate, filterByCore } from './service';

const prepareBrickData = (data: any[], brick: Brick, index: number, key: number, row: number) => {
  data.push({ brick: brick, key, index, row });
}

const prepareAssignmentData = (data: any[], assignment: AssignmentBrick, index: number, key: number, row: number) => {
  data.push({
    brick: assignment.brick, key, index, row, assignmentId: assignment.id, status: assignment.status
  } as AssignmentBrickData);
}

const setColumnBricksByStatus = (
  res: ThreeColumns, filters: Filters, userId: number, generalSubjectId: number,
  name: ThreeColumnNames, bricks: Brick[], status: BrickStatus
) => {
  let bs = filterByStatus(bricks, status);
  if (!filters.isCore) {
    bs = filterByPrivate(bs, userId, generalSubjectId);
  } else {
    bs = filterByCore(bs, generalSubjectId);
  }
  bs = bs.sort(b => (b.editor && b.editor.id === userId) ? -1 : 1);
  res[name] = { rawBricks: bs, finalBricks: bs };
}

export const getLongestColumn = (threeColumns: ThreeColumns) => {
  const draftLength = threeColumns.red.finalBricks.length;
  const reviewLength = threeColumns.yellow.finalBricks.length;
  const publishLenght = threeColumns.green.finalBricks.length;
  return Math.max(draftLength, reviewLength, publishLenght);
}

export const getThreeColumnName = (status: BrickStatus) => {
  let name = ThreeColumnNames.Red;
  if (status === BrickStatus.Publish) {
    name = ThreeColumnNames.Green;
  } else if (status === BrickStatus.Review) {
    name = ThreeColumnNames.Yellow;
  }
  return name;
}

export const getThreeColumnBrick = (threeColumns: ThreeColumns, name: ThreeColumnNames, key: number) => {
  return threeColumns[name].finalBricks[key];
}

export const expandThreeColumnBrick = (threeColumns: ThreeColumns, name: ThreeColumnNames, key: number) => {
  let brick = getThreeColumnBrick(threeColumns, name, key);
  if (brick && !brick.expandFinished) {
    brick.expanded = true;
  }
}

export const prepareTreeRows = (bricks: Brick[], filters: Filters, userId: number, generalSubjectId: number) => {
  let threeColumns = {} as ThreeColumns;
  if (filters) {
    setColumnBricksByStatus(threeColumns, filters, userId, generalSubjectId, ThreeColumnNames.Red, bricks, BrickStatus.Draft);
    setColumnBricksByStatus(threeColumns, filters, userId, generalSubjectId, ThreeColumnNames.Yellow, bricks, BrickStatus.Review);
    setColumnBricksByStatus(threeColumns, filters, userId, generalSubjectId, ThreeColumnNames.Green, bricks, BrickStatus.Publish);
  }
  return threeColumns;
}

export const prepareVisibleThreeColumnBricks = (pageSize: number, sortedIndex: number, threeColumns: ThreeColumns) => {
  let data: any[] = [];
  let count = 0;

  for (let i = 0 + sortedIndex; i < (pageSize / 3) + sortedIndex; i++) {
    let brick = threeColumns.red.finalBricks[i];
    let row = i - sortedIndex;
    if (brick) {
      prepareBrickData(data, brick, i, count, row);
      count++;
    } else {
      prepareBrickData(data, {} as Brick, i, count, row);
      count++;
    }
    brick = threeColumns.yellow.finalBricks[i];
    if (brick) {
      prepareBrickData(data, brick, i, count, row);
      count++;
    } else {
      prepareBrickData(data, {} as Brick, i, count, row);
      count++;
    }
    brick = threeColumns.green.finalBricks[i];
    if (brick) {
      prepareBrickData(data, brick, i, count, row);
      count++;
    } else {
      prepareBrickData(data, {} as Brick, i, count, row);
      count++;
    }
  }
  return data;
}

export const prepareVisibleThreeColumnAssignments = (pageSize: number, sortedIndex: number, threeColumns: ThreeAssignmentColumns) => {
  let data: AssignmentBrickData[] = [];
  let count = 0;

  for (let i = 0 + sortedIndex; i < (pageSize / 3) + sortedIndex; i++) {
    let assignment = threeColumns.red.finalAssignments[i];
    let row = i - sortedIndex;
    if (assignment) {
      prepareAssignmentData(data, assignment, i, count, row);
      count++;
    } else {
      prepareAssignmentData(data, { brick: {}} as AssignmentBrick, i, count, row);
      count++;
    }
    assignment = threeColumns.yellow.finalAssignments[i];
    if (assignment) {
      prepareAssignmentData(data, assignment, i, count, row);
      count++;
    } else {
      prepareAssignmentData(data, { brick: {}} as AssignmentBrick, i, count, row);
      count++;
    }
    assignment = threeColumns.green.finalAssignments[i];
    if (assignment) {
      prepareAssignmentData(data, assignment, i, count, row);
      count++;
    } else {
      prepareAssignmentData(data, { brick: {}} as AssignmentBrick, i, count, row);
      count++;
    }
  }
  return data;
}