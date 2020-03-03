
import React from "react";
import { Grid } from "@material-ui/core";
// @ts-ignore
import Device from "react-device-frame";
import { Hidden } from "@material-ui/core";

import './brickLength.scss';
import NextButton from '../components/nextButton';
import { NewBrickStep } from "../model";

export enum BrickLengthEnum {
  None = 0,
  S20min,
  S40min,
  S60min
}

function BrickLength({ length, saveBrickLength }: any) {
  let presectedLength = 0;
  if (length === 20) {
    presectedLength = BrickLengthEnum.S20min;
  } else if (length === 40) {
    presectedLength = BrickLengthEnum.S40min;
  } else if (length === 60) {
    presectedLength = BrickLengthEnum.S60min;
  }
  const [brickLength, setLength] = React.useState(presectedLength as BrickLengthEnum);

  const setBrickLength = (brickLength: BrickLengthEnum) => {
    setLength(brickLength);
  }

  return (
    <div className="tutorial-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={7} lg={8}>
          <div className="left-card">
            <h1 className="only-tutorial-header-length">
              <p>20 minute bricks offer a snapshot of a topic while</p>
              <p>60 min. ones are opportunities to really get stuck in.</p>
              <p>You can always shorten or extend later.</p>
            </h1>
            <h2 className="length-description">Choose Brick Length.</h2>
            <Grid container direction="row">
              <Grid container item xs={4} className="brick-length-image-container brick-length-image-container1">
                <div
                  className={"brick-length-image brick-length-20-image " + ((brickLength === BrickLengthEnum.S20min) ? "active" : "")}
                  onClick={() => setBrickLength(BrickLengthEnum.S20min)}></div>
                <Grid container direction="row" justify="center" className="bottom-time-description">
                  20mins
                </Grid>
              </Grid>
              <Grid container item xs={4} className="brick-length-image-container brick-length-image-container2">
                <div
                  className={"brick-length-image brick-length-40-image " + ((brickLength === BrickLengthEnum.S40min) ? "active" : "")}
                  onClick={() => setBrickLength(BrickLengthEnum.S40min)}></div>
                <Grid container direction="row" justify="center" className="bottom-time-description">
                  40mins
                </Grid>
              </Grid>
              <Grid container item xs={4} className="brick-length-image-container brick-length-image-container3">
                <div
                  className={"brick-length-image brick-length-60-image " + ((brickLength === BrickLengthEnum.S60min) ? "active" : "")}
                  onClick={() => setBrickLength(BrickLengthEnum.S60min)}></div>
                <Grid container direction="row" justify="center" className="bottom-time-description">
                  60mins
                </Grid>
              </Grid>
            </Grid>
            <NextButton step={NewBrickStep.BrickLength} canSubmit={brickLength !== BrickLengthEnum.None} onSubmit={saveBrickLength} data={brickLength} />
          </div>
        </Grid>
        <Hidden only={['xs', 'sm']}>
          <Grid container justify="center" item md={5} lg={4} style={{ height: "70%" }}>
            <div style={{ position: "relative", width: '58%', paddingTop: '100%' }}>
              <Device name="iphone-5s" use="iphone-5s" color="grey" url={window.location.origin + '/logo-page'} />
            </div>
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
}

export default BrickLength
