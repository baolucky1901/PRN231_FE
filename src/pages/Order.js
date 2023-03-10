import React, { useEffect, useState } from "react";
import { filter } from 'lodash';
import Services from '../components/common/Services';
import useDocTitle from "../hooks/useDocTitle";
import { Link } from "react-router-dom";
// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
  } from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import BackDrop from "../components/backdrop";
// sections
import { UserListHead, UserListToolbar } from '../section/@header/order';
// ===========================================================================

const TABLE_HEAD = [
    // { id: 'name', label: 'Name', alignRight: false },
    // { id: 'company', label: 'Company', alignRight: false },
    // { id: 'role', label: 'Role', alignRight: false },
    // { id: 'isVerified', label: 'Verified', alignRight: false },
    // { id: 'status', label: 'Status', alignRight: false },
    // { id: '' },
    { id: 'id', label: 'Id', alignRight: false },
    { id: 'name', label: 'Name', alignRight: false },
    { id: '' },
    // { id: 'userId', label: 'User Id', alignRight: false },
    // { id: 'id', label: 'Id', alignRight: false },
    // { id: 'title', label: 'Title', alignRight: false },
    // { id: 'body', label: 'Body', alignRight: false },
  ];
  
  // ----------------------------------------------------------------------
  
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
  }

const Order = () => {
  useDocTitle("Book Combo Details");

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('desc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('id');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [data, setData] = useState([{"data" : []}]);

  const [loading, setLoading] = useState(false);
 
  const [error, setError] = useState(null);

  const APIUrl = "https://localhost:44301/api/books/cus/books";

  useEffect(() => {
    fetch(APIUrl+"?page=1&pageSize=25")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((responsedata) => {
        setData(responsedata.data); 
        // console.log("Check fetch data", responsedata.data)
      })
      .catch((err) => {
        setError(err.message);
        setData(null);
      })
      .finally(() => {
        setLoading(true);
      });
      
  }, [data]);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);
  console.log(filteredUsers)

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
        <section id="order_details" className="section">
            <div className="container">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Order History
                </Typography>
                {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                    New Category
                </Button> */}
                </Stack>
                {loading ? <Card>
                    <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <UserListHead
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={data.length}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                const { id, name, email, imgPath, isActive } = row;
                                const selectedUser = selected.indexOf(id) !== -1;

                                return (
                                    
                                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                            {/* <TableCell padding="checkbox">
                                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, id)} />
                                            </TableCell> */}
                                            

                                            <TableCell align="left">{id}</TableCell>

                                            <TableCell component="th" scope="row" padding="none">
                                                <Link to={`/product-details/${id}`}>
                                                <Typography variant="subtitle2" noWrap>
                                                {name}
                                                </Typography>
                                                </Link>
                                            </TableCell>
                                            <TableCell align="right">
                                            <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                                                <Iconify icon={'eva:more-vertical-fill'} />
                                            </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                                </TableRow>
                            )}
                            </TableBody>

                            {isNotFound && (
                            <TableBody>
                                <TableRow>
                                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                    <Paper
                                    sx={{
                                        textAlign: 'center',
                                    }}
                                    >
                                    <Typography variant="h6" paragraph>
                                        Not found
                                    </Typography>

                                    <Typography variant="body2">
                                        No results found for &nbsp;
                                        <strong>&quot;{filterName}&quot;</strong>.
                                        <br /> Try checking for typos or using complete words.
                                    </Typography>
                                    </Paper>
                                </TableCell>
                                </TableRow>
                            </TableBody>
                            )}
                        </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>  
                : <BackDrop /> }
                
            </div>
        </section>

        
        <Services />
    </>
  );
};

export default Order;