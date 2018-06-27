import React from 'react';
import { LinearProgress } from '@material-ui/core';
import backgroundConnection from '../backgroundConnection';

export default class Progress extends React.Component {
  state = {
    progress: 0,
  };

  componentDidMount = () => {
    if (!backgroundConnection.eventSubscriber && this.props.keyword && this.props.limit) {
      backgroundConnection.eventSubscribe((state) => {
        this.setState({
          progress: state.progress,
        });
      }, this.props.keyword);
      this.searchVideos();
    }
    if (backgroundConnection.eventSubscriber) {
      this.props.keyword = backgroundConnection.eventSubscriber.keyword;
      backgroundConnection.eventSubscribe((state) => {
        this.props.limit = state.limit;
        this.setState({
          progress: state.progress,
        });
      }, this.props.keyword);
    }
  };

  searchVideos = async () => {
    const result = await backgroundConnection
      .searchVideos(this.props.keyword, this.props.limit);
    this.props.searchReady(result);
  };

  render() {
    const { props } = this;
    return <div style={{ textAlign: 'left' }}>
      {`${this.props.keyword || backgroundConnection.eventSubscriber.keyword}: ${Math.floor(this.state.progress)} / ${props.limit}`}
      <LinearProgress color="secondary" variant="determinate"
                      value={this.state.progress / props.limit * 100}/>
    </div>;
  }
}
