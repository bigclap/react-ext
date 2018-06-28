import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Table, Paper, TableBody, TableCell, TableHead, TableRow, Typography,
} from '@material-ui/core/';
import withRoot from './withRoot';
import { BACKEND_HOST } from '../config';
import EnhancedTable from './EnhancedTable';


const styles = theme => ({
  root: {
    textAlign: 'center',
    padding: theme.spacing.unit * 2,
  },
});

class Index extends React.Component {
  state = {
    searchesList: [],
    keyword: '',
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="display1" gutterBottom>
          YouTube channels search by {new URLSearchParams(window.location.search).get('keyword')}
        </Typography>
        <EnhancedTable/>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
