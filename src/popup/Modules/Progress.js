import React from 'react';
import { InputLabel, LinearProgress } from '@material-ui/core';
import { backgroundConnection } from '../backgroundConnection';

export default class Progress extends React.Component {
  state = {
    progress: 0,
    limit: 0,
    keyword: null,
  };

  componentDidMount = () => {
    const updateMethod = (state) => {
      this.setState(state);
    };
    // create search process from form
    if (!backgroundConnection.eventSubscriber && this.props.keyword && this.props.limit) {
      backgroundConnection.eventSubscribe(updateMethod);
      this.searchVideos();
    }

    // just listen process
    if (backgroundConnection.eventSubscriber) {
      backgroundConnection.eventSubscribe(updateMethod);
    }
  };

  searchVideos = async () => {
    const result = await backgroundConnection
      .searchVideos(this.props.keyword, this.props.limit);
    this.props.searchReady(result);
  };

  render() {
    const { props } = this;
    if (backgroundConnection.eventSubscriber) {
      return <div>
        <InputLabel margin={'dense'}
                    shrink>{`${this.state.keyword}: ${Math.floor(this.state.progress)} / ${this.state.limit}`}</InputLabel>
        <LinearProgress color="secondary" variant="determinate" style={{ margin: '10px 0 0 0' }}
                        value={this.state.progress / this.state.limit * 100}/>
      </div>;
    }
    return null;
  }
}
