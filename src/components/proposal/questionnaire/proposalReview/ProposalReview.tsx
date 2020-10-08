import React from "react";
import Grid from "@material-ui/core/Grid";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { History } from 'history';

import './ProposalReview.scss';
import { Brick } from "model/brick";
import { User } from "model/user";
import { setBrillderTitle } from "components/services/titleService";

import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import MathInHtml from 'components/play/baseComponents/MathInHtml';
import YoutubeAndMathInHtml from "components/play/baseComponents/YoutubeAndMath";
import { BrickFieldNames, PlayButtonStatus } from '../../model';
import map from 'components/map';
import PlayButton from "components/build/baseComponents/PlayButton";
import SpriteIcon from "components/baseComponents/SpriteIcon";

enum BookState {
  TitlesPage,
  PrepPage
}

interface ProposalProps {
  brick: Brick;
  user: User;
  canEdit: boolean;
  history: History;
  playStatus: PlayButtonStatus;
  saveBrick(): void;
  setBrickField(name: BrickFieldNames, value: string): void;
  saveAndPreview(): void;
}

interface ProposalState {
  bookState: BookState;
  bookHovered: boolean;
  closeTimeout: number;
  mode: boolean; // true - edit mode, false - view mode
}

class ProposalReview extends React.Component<ProposalProps, ProposalState> {
  constructor(props: ProposalProps) {
    super(props);
    this.state = {
      mode: false,
      bookHovered: false,
      bookState: BookState.TitlesPage,
      closeTimeout: -1
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.closeTimeout);
  }

  onBookHover() { 
    clearTimeout(this.state.closeTimeout);
    this.setState({ bookHovered: true });
  }

  onBookClose() {
    const closeTimeout = setTimeout(() => {
      this.setState({ bookHovered: false, mode: false });
    }, 400);
    this.setState({ closeTimeout });
  }

  switchMode(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    e.stopPropagation();
    if (this.props.canEdit) {
      this.setState({ mode: !this.state.mode });
    }
  }

  renderEditButton() {
    let className = "edit-icon";
    if (this.state.mode) {
      className += " active";
    }
    return <SpriteIcon onClick={e => this.switchMode(e)} name="edit-outline" className={className} />;
  }

  renderEditableField(name: BrickFieldNames) {
    const { brick } = this.props;
    if (this.state.mode) {
      return (
        <input
          onChange={e => {
            e.stopPropagation();
            this.props.setBrickField(name, e.target.value)
          }}
          placeholder="Please fill in.."
          value={brick[name]}
        />
      );
    }
    return brick[name];
  }

  renderMathField(name: BrickFieldNames) {
    const { brick } = this.props;
    if (this.state.mode) {
      return (
        <DocumentWirisCKEditor
          disabled={!this.props.canEdit}
          data={brick[name]}
          placeholder="Enter Brief Here..."
          toolbar={[
            'bold', 'italic', 'fontColor', 'mathType', 'chemType', 'bulletedList', 'numberedList'
          ]}
          onBlur={() => { }}
          onChange={v => this.props.setBrickField(name, v)}
        />
      );
    }
    return <MathInHtml value={brick[name]} />;
  }

  renderYoutubeAndMathField(name: BrickFieldNames) {
    const { brick } = this.props;
    if (this.state.mode) {
      return (
        <DocumentWirisCKEditor
          disabled={!this.props.canEdit}
          data={brick[name]}
          placeholder="Enter Instructions, Links to Videos and Webpages Here…"
          mediaEmbed={true}
          toolbar={[
            'bold', 'italic', 'fontColor', 'mathType', 'chemType', 'bulletedList', 'numberedList'
          ]}
          onBlur={() => { }}
          onChange={v => this.props.setBrickField(name, v)}
        />
      );
    }
    return <YoutubeAndMathInHtml value={brick[name]} />;
  }

  render() {
    const { brick } = this.props;

    if (brick.title) {
      setBrillderTitle(brick.title);
    }

    const renderAuthorRow = () => {
      const { author } = brick;
      if (!author) { return ''; }

      const { firstName, lastName } = author;

      return (
        <div className="names-row">
          {firstName ? firstName + ' ' : ''}
          {lastName ? lastName : ''}
        </div>
      );
    }

    const renderPlayButton = () => {
      const { playStatus } = this.props;
      if (playStatus === PlayButtonStatus.Hidden) {
        return "";
      }
      return (
        <div className="play-preview-button-container">
          <PlayButton
            isValid={playStatus === PlayButtonStatus.Valid}
            tutorialStep={-1}
            isTutorialSkipped={true}
            onClick={this.props.saveAndPreview}
          />
        </div>
      );
    }

    const renderFirstPage = () => {
      return (
        <div className="page5">
          <div className="flipped-page">
            <Grid container justify="center">
              <FiberManualRecordIcon className="circle-icon" />
            </Grid>
            <div className="proposal-titles">
              <div className="title">{this.renderEditableField(BrickFieldNames.title)}</div>
              <div>{this.renderEditableField(BrickFieldNames.subTopic)}</div>
              <div>{this.renderEditableField(BrickFieldNames.alternativeTopics)}</div>
              <p className="text-title m-t-3 bold">Open Question.</p>
              <div className={`proposal-text ${this.state.mode ? 'edit-mode' : ''}`}>
                {this.renderEditableField(BrickFieldNames.openQuestion)}
              </div>
              <p className="text-title brick-length m-t-3">
                <span className="bold">Brick Length:</span> <span className="brickLength">{brick.brickLength} mins.</span>
              </p>
            </div>
          </div>
        </div>
      );
    }

    const renderSecondPage = () => {
      return (
        <div className="page6" onClick={() => {
          if (this.state.bookState === BookState.TitlesPage) {
            this.setState({bookState: BookState.PrepPage});
          }
        }}>
          <div className="normal-page">
            <div className="normal-page-container">
              <Grid container justify="center">
                {this.renderEditButton()}
              </Grid>
              <p className="text-title">Outline the purpose of your brick.</p>
              <div className={`proposal-text ${this.state.mode ? 'edit-mode' : ''}`} onClick={e => e.stopPropagation()}>
                {this.renderMathField(BrickFieldNames.brief)} 
              </div>
            </div>
          </div>
        </div>
      );
    }

    const renderBook = () => {
      return (
        <div className={`book ${this.state.mode === true ? 'flat' : ''}`} onMouseOver={() => this.onBookHover()}>
          <div className="back"></div>
          <div className="page6-cover" onClick={() => {
            if (this.state.bookState === BookState.PrepPage) {
              this.setState({bookState: BookState.TitlesPage});
            }
          }}>
            <div className="flipped-page">
              <Grid container justify="center">
                {this.renderEditButton()}
              </Grid>
              <p className="text-title text-theme-dark-blue">Create an engaging and relevant preparatory task.</p>
              <div className={`proposal-text text-theme-dark-blue ${this.state.mode ? 'edit-mode' : ''}`} onClick={e => e.stopPropagation()}>
                {this.renderYoutubeAndMathField(BrickFieldNames.prep)}
              </div>
            </div>
          </div>
          {renderSecondPage()}
          {renderFirstPage()}
          <div className="page4"></div>
          <div className="page3"></div>
          <div className="page2"></div>
          <div className="front">
            <div className="page-stitch">
              <div className="vertical-line"></div>
              <div className="horizontal-line top-line-1"></div>
              <div className="horizontal-line top-line-2"></div>
              <div className="horizontal-line bottom-line-1"></div>
              <div className="horizontal-line bottom-line-2"></div>
            </div>
            <Grid container justify="center" alignContent="center" style={{ height: '100%' }}>
              <div>
                <img alt="" src="/images/choose-login/logo.png" />
                <div className="white-text">PROPOSAL</div>
                {renderAuthorRow()}
              </div>
            </Grid>
          </div>
        </div>
      );
    }

    let bookClass = 'book-main-container';
    if (this.state.bookHovered) {
      if (this.state.bookState === BookState.TitlesPage) {
        bookClass += ' hovered';
      } else {
        bookClass += ' prep-page';
      }
    }

    return (
      <div className="proposal-page">
        {renderPlayButton()}
        <Grid container direction="row" style={{ height: '100% !important' }} justify="center">
          <Grid className="back-button-container" container alignContent="center">
            <div className="back-button" onClick={() => this.props.history.push(map.ProposalPrep)} />
          </Grid>
          <Grid className="main-text-container" style={{opacity: this.state.mode === true ? '0' : '1'}}>
            <h1>Your proposal has been saved!</h1>
            <h1>We've made a booklet for you</h1>
            <h1>to check all is in order.</h1>
            <div className="text-line-1"></div>
            <h2>Slide your mouse over the cover to</h2>
            <h2>open it. &nbsp;Click the icon at the top of the page to edit.</h2>
            <div className="text-line-2"></div>
            <h2>When you're ready, start building!</h2>
          </Grid>
          <div className={bookClass}>
            <div className="book-container" onMouseOut={() => this.onBookClose()}>
              {renderBook()}
            </div>
            <Grid className="next-button-container" container onMouseOver={() => this.onBookHover()} alignContent="center">
              {
                this.state.bookHovered ? (
                  <div>
                    <div className="next-button" onClick={() => this.props.saveBrick()}></div>
                  </div>
                ) : ""
              }
            </Grid>
          </div>
          <div className="red-right-block"></div>
        </Grid>
      </div>
    );
  }
}

export default ProposalReview;
