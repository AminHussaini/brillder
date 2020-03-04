import React, { Fragment } from 'react'
import { useDrag, DragSourceMonitor } from 'react-dnd'
import { Grid } from '@material-ui/core';
import MediaQuery from 'react-responsive';

import './dragBox.scss';
import ItemTypes from '../../ItemTypes'
import { QuestionComponentTypeEnum } from 'components/model/question';
import { DropResult } from './interfaces';


const HoverBox = ({ marginTop, label }: any) => {
  return (
    <Fragment>
      <MediaQuery minDeviceWidth={1280}>
        <div className="drag-box-hover" style={{ marginTop }}>{label}</div>
      </MediaQuery>
      <MediaQuery maxDeviceWidth={1280}>
        <div className="drag-box-hover" style={{ marginTop }}>{label}</div>
      </MediaQuery>
    </Fragment>
  );
}

export interface BoxProps {
  locked: boolean,
  name?: string,
  value: QuestionComponentTypeEnum,
  isImage?: boolean,
  label?: string,
  src?: string,
  fontSize?: string,
  marginTop?: any,
  hoverMarginTop?: any,
  fontFamily?: string,
  onDrop: Function,
}

const DragBox: React.FC<BoxProps> = ({
  name, onDrop, value, fontSize, isImage, src, label, marginTop, hoverMarginTop, fontFamily, locked
}) => {
  const renderContent = () => {
    if (isImage) {
      return <div>
        <img alt="" style={{ width: '35%' }} src={src} />
        <HoverBox label={label} marginTop={hoverMarginTop} />
      </div>
    }
    return (
      <div>
        <div className="drag-box-name" style={{fontFamily}}>{name}</div>
        <HoverBox label={label} marginTop={hoverMarginTop} />
      </div>
    );
  }

  return (
    <Grid container item xs={12} className="drag-box-item sort-item" style={{ fontSize: fontSize, marginTop }}>
      {renderContent()}
    </Grid>
  )
}

export default DragBox
