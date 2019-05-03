import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import Image from 'react-bootstrap/Image';
import Fab from '@material-ui/core/Fab';
import routes from '../constants/routes';
import styles from './Trial.css';
import { videos } from '../videos';

const { dialog } = require('electron').remote;
const { remote } = require('electron');

class Trial extends Component {
  constructor(props) {
    super(props);
    const {
      location: {
        state: {
          pid,
          vocoded: { value: vocoded }
        }
      }
    } = this.props;

    this.state = {
      pid,
      vocoded,
      trialNumber: 0,
      trial: this.generateTrial(vocoded),
      errorMsg: '',
      playing: false
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ blackScreen: false }), 1000);
  }

  generateTrial = () => {
    const initalKeys = [
      'ba_audio',
      'ba_con',
      'ba_visual',
      'ga_audio',
      'ga_con',
      'ga_visual',
      'incon'
    ];
    let finalKeys = [];
    for (let i = 0; i < 10; i++) {
      finalKeys.push(...initalKeys);
      finalKeys = this.shuffle(finalKeys);
    }
    for (let i = 0; i < 10; i++) {
      finalKeys = this.shuffle(finalKeys);
    }

    return finalKeys;
  };

  nextTrial = () => {
    const { trialNumber } = this.state;
    return this.setState({ trialNumber: trialNumber + 1, playing: false });
  };

  saveTrial = referrer => {
    dialog.showSaveDialog(
      { filters: [{ name: 'CSV', extensions: ['csv'] }] },
      filename => {
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
          path: filename,
          header: [
            { id: 'pid', title: 'Participant ID' },
            { id: 'mode', title: 'Mode (Non/Vocoded)' },
            { id: 'video', title: 'Video Played' },
            { id: 'trial', title: 'Trial Number' }
          ]
        });

        const { trial: video, vocoded: mode, pid } = this.state;
        const records = [];

        video.forEach((v, i) =>
          records.push({
            video: v,
            mode: i === 0 ? (mode === 'vs' ? 'Vocoded' : 'NonVocoded') : '',
            pid: i === 0 ? pid : '',
            trial: i + 1
          })
        );

        csvWriter
          .writeRecords(records)
          .then(() => this.setState({ errorMsg: 'File saved successfully' }))
          .catch(err =>
            this.setState({
              errorMsg: `Something went wrong, try again!:  ${err}`
            })
          );
      }
    );
    return this.saveButton();
  };

  saveButton = () => (
    <div>
      <div className={styles.backButton} data-tid="backButton">
        <Link to={routes.HOME}>
          <i className="fa fa-arrow-left fa-3x" />
        </Link>
      </div>
      <div>
        <span style={{ color: 'white' }}>{this.state.errorMsg}</span>
        <Fab
          style={{
            left: 'calc(50vw - 90px)',
            top: 'calc(50vh - 24px)',
            position: 'absolute'
          }}
          variant="extended"
          aria-label="Save"
          color="primary"
          onClick={() => this.saveTrial()}
        >
          Save the file again
        </Fab>
      </div>
    </div>
  );

  shuffle = a => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  render() {
    const {
      trial,
      trialNumber,
      errorMsg,
      blackScreen,
      vocoded,
      playing
    } = this.state;
    if (errorMsg !== '') return this.saveButton();
    if (trialNumber >= 70) return this.saveTrial();
    const currentVideo = trial[trialNumber];
    const [w, h] = remote.getCurrentWindow().getSize();
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.HOME}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <ReactPlayer
          height={h - 50}
          width={w - 50}
          key={`${currentVideo}_${trialNumber}`}
          url={videos[vocoded][`${currentVideo}_${vocoded}`]}
          className={styles.noClick}
          playing={playing}
          onReady={() => this.setState({ playing: true })}
        />
        <div className={styles.forwardButton} data-tid="forwardButton">
          <i onClick={this.nextTrial} className="fa fa-arrow-right fa-3x" />
        </div>
      </div>
    );
  }
}

export default withRouter(Trial);
