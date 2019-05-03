import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Select from 'react-select';
import Fab from '@material-ui/core/Fab';
import { TextField } from '@material-ui/core';
import styles from './Home.css';

const vocodedOptions = [
  { value: 'vs', label: 'Vocoded' },
  { value: 'nvs', label: 'NonVocoded' }
];

const style = {
  selectText: {
    color: 'white'
  },
  textField: {
    background: 'white'
  }
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pid: '',
      vocoded: null,
      formFilled: false
    };
  }

  stateChange = () => {
    const { pid, vocoded } = this.state;

    if (pid !== '' && vocoded !== null)
      return this.setState({ formFilled: true });

    return this.setState({ formFilled: false });
  };

  handleSelect = key => value =>
    this.setState({ [key]: value }, this.stateChange);

  render() {
    const { pid, vocoded, formFilled } = this.state;
    return (
      <div className={styles.container} data-tid="container">
        <TextField
          variant="filled"
          style={style.textField}
          label="Participant ID"
          value={pid}
          onChange={e =>
            this.setState({ pid: e.target.value }, this.stateChange)
          }
        />
        <br />
        <br />
        <span style={style.selectText}>Vocoded or NonVocoded:</span>
        <br />
        <br />
        <Select
          options={vocodedOptions}
          value={vocoded}
          onChange={this.handleSelect('vocoded')}
        />
        <br />
        <Fab
          variant="extended"
          aria-label="Start"
          color="primary"
          disabled={!formFilled}
          component={Link}
          to={{
            pathname: '/trial',
            state: { ...this.state }
          }}
        >
          Start Trial
        </Fab>
      </div>
    );
  }
}

export default withRouter(Home);
