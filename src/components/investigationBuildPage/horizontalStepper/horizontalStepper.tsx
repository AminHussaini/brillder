import React from 'react';
import './horizontalStepper.scss'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import StepButton from '@material-ui/core/StepButton';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

const CustomNumberIcon = (step:any) => () => (
  <span className={"circle-round circle icon-circle-blue-" + step}></span>
);

const CustomFilledNumberIcon = (step:any) => () => (
  <span className={"circle icon-filled-circle-blue-" + step}>
    <span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span>
  </span>
);

const RectFilledNumberIcon = (step:any) => () => (
  <span className={"rect icon-filled-rect-blue-" + step}>
    <span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span>
  </span>
);

function getSteps(numOfSteps:number) {
  const steps:any[] = [];
  for (let i = 0; i < numOfSteps; i++) {
    steps.push(createStep());
  }
  return steps;
}

function createStep():any {
  return {
    isClicked: false,
    isCompleted: false
  }
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return 'Select campaign settings...';
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    case 3:
      return 'wfwef'
    default:
      return 'Unknown step';
  }
}

export default function HorizontalLinearStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps(8);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleStep = (step: any, index: number) => () => {
    setActiveStep(index);
    step.isClicked = true; 
  };

  let currentIcon = RectFilledNumberIcon(activeStep + 1);

  return (
    <div className={classes.root}>
      <Stepper alternativeLabel  activeStep={activeStep} className="stepper">
        {steps.map((step, index) => {
          index = index + 1;
          let IconStep = null;
          if (index > activeStep + 1) {
            IconStep = CustomNumberIcon(index);
          } else {
            IconStep = CustomFilledNumberIcon(index);
          }
          return (
            <Step key={index}>
              <StepButton icon={IconStep()} onClick={handleStep(step, index)} />
            </Step>
          )
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you are finished
            </Typography>
          </div>
        ) : (
          <div>
            <Grid container direction="row">
              <Grid xs={1} sm={2} item md={3}></Grid>
              <Grid container justify="center" item xs={10} sm={8} md={6} className="question">
                <Grid container direction="row">
                  {currentIcon()}
                  <div className="question-title">Geomorfology</div>
                </Grid>
                <Grid container direction="row" className="black-box">
                  Read the following extract from a geological survey of Western Australia:
                </Grid>
                <Grid container direction="row">
                  When you work with a locum tenens placement firm led by doctors, you know your experience will be a great one. The most extensive network of top-quality doctors and hospitals. The most innovative customer services—from travel to payroll to credentialing. The best clinical and personal fit. It’s why we can say we deliver better doctors to the hospitals we partner with than any other LT firm. With Locum Connections, you have the confidence of knowing we understand what it takes for each assignment to be a success for doctor and hospital alike.
                </Grid>
                <Grid container direction="row" className="black-box">
                  Read the following extract from a geological survey of Western Australia:
                </Grid>
                <Grid container direction="row">
                  <Grid container justify="center">
                    <Button className="grey-button">Lorem ipsum</Button>
                  </Grid>
                </Grid>
                <Grid container direction="row">
                  <Grid container justify="center">
                    <Button className="grey-button">Lorem ipsum</Button>
                  </Grid>
                </Grid>
                <Grid container direction="row">
                  <Grid container justify="center">
                    <Button className="grey-button">Lorem ipsum</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}