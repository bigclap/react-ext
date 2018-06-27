/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import {
  InputLabel, Button, Typography, TextField, FormControl, FormGroup,
} from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import withRoot from './withRoot';
import backgroundConnection from './backgroundConnection';
import Progress from './Modules/Progress';


const styles = theme => ({
  root: {
    textAlign: 'center',
    padding: theme.spacing.unit * 2,
  },
});

class Index extends React.Component {
  state = {
    searchLimit: 0,
    keyword: '',
    inProgress: false,
  };

  changeLimit = (e, v) => {
    this.setState({
      searchLimit: v,
    });
  };

  componentDidMount = () => {
    this.setState({
      inProgress: !!backgroundConnection.eventSubscriber,
    });
    this.loadSearches();
  };

  searchReady = (result) => {
    this.setState({
      inProgress: false,
    });
    console.log(result);
  };

  sendForm = () => {
    if (this.state.keyword.length > 4 && this.state.searchLimit > 10) {
      this.setState({
        inProgress: true,
      });
    }
  };

  handleKeyword = (event) => {
    this.setState({
      keyword: event.target.value,
    });
  };

  loadSearches = async () => {
    const { data } = axios.get(`${BACKEND_HOST}/groups`, { params: { uid: chrome.runtime.id } });
    this.setState({ searchesList: data });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="display1" gutterBottom>
          YouTube channels search
        </Typography>
        <FormGroup className='form'>
          <TextField label="Find this keywords" margin="normal" value={this.state.keyword}
                     onChange={this.handleKeyword}
                     type='text'/>
          <div style={{ textAlign: 'left' }}>
            <InputLabel>{
              `Chose search limit: ${this.state.searchLimit || ''}`
            }</InputLabel>
            <Slider min={10} max={100} value={this.state.searchLimit} step={5}
                    onChange={this.changeLimit}/>
          </div>
          <Button variant="contained" type="button" color='primary' disabled={this.state.inProgress}
                  onClick={this.sendForm}>Search on
            YouTube</Button>
        </FormGroup>
        {(() => {
          if (this.state.inProgress) {
            return <Progress searchReady={this.searchReady}
                             keyword={this.state.keyword}
                             limit={this.state.searchLimit}
            />;
          }
          return null;
        })()}
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
