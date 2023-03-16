import React, { useEffect, useState } from "react";
import { filter } from "lodash";
import Services from "../components/common/Services";
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
  Button,
  TableContainer,
  TablePagination,
} from "@mui/material";
// components
import Label from "../components/label";
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
import BackDrop from "../components/backdrop";
// sections
import { UserListHead, UserListToolbar } from "../section/@header/order";
import { UseAuth } from "../contexts/auth/AuthContext";
// ===========================================================================

const TABLE_HEAD = [
  { id: "id", label: "Id", alignRight: false },
  { id: "shippingAddress", label: "Address", alignRight: false },
  { id: "totalPrice", label: "Total Price", alignRight: false },
  { id: "paymentMethod", label: "Payment Method", alignRight: false },
  { id: "orderStatus", label: "Order Status", alignRight: false },
  { id: "" },
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
  return order === "desc"
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
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

const Order = () => {
  useDocTitle("Order History");

  const { user } = UseAuth();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("desc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("id");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const APIUrl = "https://localhost:44301/api/orders/customer/";

  useEffect(() => {
    fetch(APIUrl + `${user._id}?page=1&pageSize=25`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((responseData) => {
        setData(responseData.data);
      })
      .catch((err) => {
        console.log(err);
        setData(null);
      })
      .finally(() => {
        setLoading(true);
      });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredUsers = applySortFilter(
    data,
    getComparator(order, orderBy),
    filterName
  );
  console.log(filteredUsers);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <section id="order_details" className="section">
        <div className="container">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom>
              Order History
            </Typography>
          </Stack>
          {loading ? (
            <Card>
              <UserListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
              />

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
                      {filteredUsers
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          const {
                            id,
                            totalPrice,
                            shippingAddress,
                            paymentMethod,
                            orderStatus,
                          } = row;
                          const selectedUser = selected.indexOf(id) !== -1;

                          return (
                            <TableRow
                              hover
                              key={id}
                              tabIndex={-1}
                              role="checkbox"
                              selected={selectedUser}
                            >
                              <TableCell align="left">{id}</TableCell>

                              <TableCell
                                component="th"
                                scope="row"
                                padding="none"
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  padding={2}
                                  spacing={2}
                                >
                                  <Typography variant="subtitle2" noWrap>
                                    {shippingAddress}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {totalPrice}VNĐ
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {paymentMethod}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Typography variant="subtitle2" noWrap>
                                    {orderStatus === "In_Progress" ? (
                                      <Label color={"warning"}>
                                        In_Progress
                                      </Label>
                                    ) : orderStatus === "Accepted" ? (
                                      <Label color={"primary"}>Accepted</Label>
                                    ) : orderStatus === "Paid" ? (
                                      <Label color={"default"}>Paid</Label>
                                    ) : orderStatus ===
                                      "Physical_book_delivered" ? (
                                      <Label color={"secondary"}>
                                        Physical_book_delivered
                                      </Label>
                                    ) : orderStatus === "Ebook_delivered" ? (
                                      <Label color={"secondary"}>
                                        Ebook_delivered
                                      </Label>
                                    ) : orderStatus === "Done" ? (
                                      <Label color={"success"}>Done</Label>
                                    ) : orderStatus === "Cancel" ? (
                                      <Label color={"error"}>Cancel</Label>
                                    ) : (
                                      <></>
                                    )}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              {orderStatus === "In_Progress" ? (
                                <TableCell
                                  align="left"
                                  style={{ display: "flex" }}
                                >
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    padding={2}
                                    spacing={2}
                                  >
                                    <Link to={`/order-details-cancle/${id}`}>
                                      <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={
                                          <Iconify
                                            icon={"material-symbols:cancel"}
                                          />
                                        }
                                      >
                                        Cancel
                                      </Button>
                                    </Link>
                                    <Link to={`/order-details/${id}`}>
                                      <Button
                                        variant="contained"
                                        startIcon={
                                          <Iconify icon={"eva:edit-fill"} />
                                        }
                                      >
                                        Details
                                      </Button>
                                    </Link>
                                  </Stack>
                                </TableCell>
                              ) : (
                                <></>
                              )}
                              {orderStatus === "Accepted" ? (
                                <TableCell
                                  align="left"
                                  style={{ display: "flex" }}
                                >
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    padding={2}
                                    spacing={2}
                                  >
                                    <Link to={`/order-details/${id}`}>
                                      <Button
                                        variant="contained"
                                        startIcon={
                                          <Iconify icon={"eva:edit-fill"} />
                                        }
                                      >
                                        Details
                                      </Button>
                                    </Link>
                                  </Stack>
                                </TableCell>
                              ) : (
                                <></>
                              )}
                              {orderStatus === "Paid" ? (
                                <TableCell
                                  align="left"
                                  style={{ display: "flex" }}
                                >
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    padding={2}
                                    spacing={2}
                                  >
                                    <Link to={`/order-details-done/${id}`}>
                                      <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={
                                          <Iconify
                                            icon={"material-symbols:done"}
                                          />
                                        }
                                      >
                                        Done
                                      </Button>
                                    </Link>
                                    <Link to={`/order-details/${id}`}>
                                      <Button
                                        variant="contained"
                                        startIcon={
                                          <Iconify icon={"eva:edit-fill"} />
                                        }
                                      >
                                        Details
                                      </Button>
                                    </Link>
                                  </Stack>
                                </TableCell>
                              ) : (
                                <></>
                              )}
                              {orderStatus === "Ebook_delivered" ? (
                                <TableCell
                                  align="left"
                                  style={{ display: "flex" }}
                                >
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    padding={2}
                                    spacing={2}
                                  >
                                    <Link to={`/order-details-done/${id}`}>
                                      <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={
                                          <Iconify
                                            icon={"material-symbols:done"}
                                          />
                                        }
                                      >
                                        Done
                                      </Button>
                                    </Link>
                                    <Link to={`/order-details/${id}`}>
                                      <Button
                                        variant="contained"
                                        startIcon={
                                          <Iconify icon={"eva:edit-fill"} />
                                        }
                                      >
                                        Details
                                      </Button>
                                    </Link>
                                  </Stack>
                                </TableCell>
                              ) : (
                                <></>
                              )}
                              {orderStatus === "Done" ? (
                                <TableCell
                                  align="left"
                                  style={{ display: "flex" }}
                                >
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    padding={2}
                                    spacing={2}
                                  >
                                    <Link to={`/order-details/${id}`}>
                                      <Button
                                        variant="contained"
                                        startIcon={
                                          <Iconify icon={"eva:edit-fill"} />
                                        }
                                      >
                                        Details
                                      </Button>
                                    </Link>
                                  </Stack>
                                </TableCell>
                              ) : (
                                <></>
                              )}
                              {orderStatus === "Cancel" ? (
                                <TableCell
                                  align="left"
                                  style={{ display: "flex" }}
                                >
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    padding={2}
                                    spacing={2}
                                  >
                                    <Link to={`/order-details/${id}`}>
                                      <Button
                                        variant="contained"
                                        startIcon={
                                          <Iconify icon={"eva:edit-fill"} />
                                        }
                                      >
                                        Details
                                      </Button>
                                    </Link>
                                  </Stack>
                                </TableCell>
                              ) : (
                                <></>
                              )}
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
                                textAlign: "center",
                              }}
                            >
                              <Typography variant="h6" paragraph>
                                Not found
                              </Typography>

                              <Typography variant="body2">
                                No results found for &nbsp;
                                <strong>&quot;{filterName}&quot;</strong>.
                                <br /> Try checking for typos or using complete
                                words.
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
          ) : (
            <BackDrop />
          )}
        </div>
      </section>

      <Services />
    </>
  );
};

export default Order;
