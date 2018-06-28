import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios/index';
import { BACKEND_HOST } from '../config';

let counter = 0;

function createData(name, calories, fat, carbs, protein) {
  counter += 1;
  return {
    id: counter, name, calories, fat, carbs, protein,
  };
}

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

const columnData = [
  {
    id: 'name', numeric: false, disablePadding: false, label: 'Channel name',
  },
  {
    id: 'subscriberCount', numeric: true, disablePadding: false, label: 'Subscribers',
  },
  {
    id: 'avgViews', numeric: true, disablePadding: false, label: 'Avg views',
  },
  {
    id: 'videoCount', numeric: true, disablePadding: false, label: 'Video count',
  },
  {
    id: 'keywordVideos', numeric: true, disablePadding: false, label: 'Key videos count',
  },
  {
    id: 'lastActivity', numeric: false, disablePadding: false, label: 'Last publishing',
  },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {columnData.map(column => (
            <TableCell
              key={column.id}
              numeric={column.numeric}
              padding={column.disablePadding ? 'none' : 'default'}
              style={{ textAlign: 'center' }}
              sortDirection={orderBy === column.id ? order : false}
            >
              <Tooltip
                title="Sort"
                placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                enterDelay={300}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          ), this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
  },
});

class EnhancedTable extends React.Component {
  componentDidMount = () => {
    this.loadSearches();
  };

  loadSearches = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    try {
      const { data } = await axios.get(`${BACKEND_HOST}/groups/${searchParams.get('group')}/channels`);
      if (data.channels) {
        this.setState({ data: data.channels });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'calories',
      data: [],
    };
  }

  render() {
    const { classes } = this.props;
    const {
      data, order, orderBy,
    } = this.state;
    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {data && data
                .sort(getSorting(order, orderBy))
                .map(channel => (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={channel.id}
                  >
                    <TableCell component="th" scope="row">
                      <a
                        href={`https://www.youtube.com/channel/${channel.channelId}`}>{channel.name}</a></TableCell>
                    <TableCell numeric>{channel.subscriberCount}</TableCell>
                    <TableCell numeric>{channel.avgViews}</TableCell>
                    <TableCell numeric>{channel.videoCount}</TableCell>
                    <TableCell numeric>{channel.keywordVideos}</TableCell>
                    <TableCell>{channel.lastActivity.substr(0, 10)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);
