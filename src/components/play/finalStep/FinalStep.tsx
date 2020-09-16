import React from "react";
import { Grid, Hidden } from "@material-ui/core";

import "./FinalStep.scss";
import sprite from "assets/img/icons-sprite.svg";
import { Brick } from "model/brick";
import { PlayStatus } from "../model";

import Clock from "../baseComponents/Clock";
import ShareDialog from './dialogs/ShareDialog';
import LinkDialog from './dialogs/LinkDialog';
import LinkCopiedDialog from './dialogs/LinkCopiedDialog';
import ShareColumn from "./ShareColumn";
import InviteColumn from "./InviteColumn";
import ExitButton from "./ExitButton";

interface FinalStepProps {
  status: PlayStatus;
  brick: Brick;
  history: any;
}

const FinalStep: React.FC<FinalStepProps> = ({
  status,
  brick,
  history,
}) => {
  const [shareOpen, setShare] = React.useState(false);
  const [linkOpen, setLink] = React.useState(false);
  const [linkCopiedOpen, setCopiedLink] = React.useState(false);

  const link = `/play/brick/${brick.id}/intro`;

  return (
    <div>
      <Hidden only={['xs']}>
        <div className="brick-container final-step-page">
          <Grid container direction="row">
            <Grid item xs={8}>
              <div className="introduction-page">
                <div className="intro-header">
                  <div className="left-brick-circle">
                    <div className="round-button">
                      <svg className="svg active">
                        {/*eslint-disable-next-line*/}
                        <use href={sprite + "#check-icon-thin"} />
                      </svg>
                    </div>
                  </div>
                  <h2>Final step?</h2>
                  <p>Well done for completing “{brick.title}”!</p>
                  <Grid className="share-row" container direction="row" justify="center">
                    <ShareColumn onClick={() => setShare(true)} />
                    <InviteColumn onClick={()=>{}} />
                  </Grid>
                </div>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="introduction-info">
                <div className="intro-header">
                  <Clock brickLength={brick.brickLength} />
                </div>
                <div className="intro-text-row">
                </div>
                <ExitButton onClick={() => history.push('/play/dashboard')} />
              </div>
            </Grid>
          </Grid>
        </div>
      </Hidden>
      <Hidden only={['sm', 'md', 'lg', 'xl']}>
        <div className="brick-container mobile-final-step-page final-step-page">
          <div className="introduction-info">
            <div className="intro-text-row"></div>
          </div>
          <div className="introduction-page">
          </div>
          <ExitButton onClick={() => history.push('/play/dashboard')} />
        </div>
      </Hidden>
      <LinkDialog
        isOpen={linkOpen} link={document.location.host + link}
        submit={() => setCopiedLink(true)} close={() => setLink(false)}
      />
      <LinkCopiedDialog isOpen={linkCopiedOpen} close={()=> setCopiedLink(false)} />
      <ShareDialog isOpen={shareOpen} link={() => { setShare(false); setLink(true) }} close={() => setShare(false)} />
    </div>
  );
};

export default FinalStep;