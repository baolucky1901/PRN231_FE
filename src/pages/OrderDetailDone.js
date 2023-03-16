import React, { useEffect, useState } from "react";
import { filter } from "lodash";
import Services from "../components/common/Services";
import useDocTitle from "../hooks/useDocTitle";
import { useParams, useNavigate } from "react-router-dom";
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
  TableContainer,
  TablePagination,
  Button,
} from "@mui/material";
// components
import Scrollbar from "../components/scrollbar";
import BackDrop from "../components/backdrop";
// sections
import { UserListHead, UserListToolbar } from "../section/@header/order";
// ===========================================================================

const TABLE_HEAD = [
  { id: "id", label: "Id", alignRight: false },
  { id: "orderId", label: "OrderId", alignRight: false },
  { id: "bookName", label: "Book", alignRight: false },
  { id: "priceBook", label: "Price-Book", alignRight: false },
  { id: "eBookName", label: "E-Book", alignRight: false },
  { id: "priceEBook", label: "Price-EBook", alignRight: false },
  { id: "comboBookName", label: "Combo-Book", alignRight: false },
  { id: "priceCombo", label: "Price-Combo", alignRight: false },
  { id: "quantity", label: "Quantity", alignRight: false },
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

const OrderDetailDone = () => {
  useDocTitle("Order History");

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("desc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("id");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const { orderId } = useParams();

  // here the 'id' received has 'string-type', so converting it to a 'Number'
  const prodId = parseInt(orderId);

  const APIUrl = "https://localhost:44301/api/order-details/";

  useEffect(() => {
    fetch(APIUrl + `${prodId}`)
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

  const navigate = useNavigate();
  const handleChangeStatusToDone = async () => {
    const response = await fetch(
      "https://localhost:44301/api/orders/order/order-status/done?orderId=" +
        prodId,
      {
        method: "PUT",
        body: JSON.stringify({
          /* data to be sent in the request body */
        }),
      }
    );
    navigate("/order");
  };

  const handleReturnToListOrder = async () => {
    navigate("/order");
  };

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
              Order Details History - Done
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
                            orderId,
                            bookName,
                            priceBook,
                            eBookName,
                            priceEBook,
                            comboBookName,
                            priceCombo,
                            quantity,
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

                              <TableCell>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  {orderId}
                                </Stack>
                              </TableCell>

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
                                    {bookName ?? "----"}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {priceBook ? `${priceBook} VND` : "----"}
                              </TableCell>
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
                                    {eBookName ?? "----"}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {priceEBook ? `${priceEBook} VND` : "----"}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  padding={2}
                                  spacing={2}
                                >
                                  <Typography variant="subtitle2" noWrap>
                                    {comboBookName ?? "----"}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {priceCombo ? `${priceCombo} VND` : "----"}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {quantity}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        marginTop="24px"
                        marginLeft="24px"
                      >
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleChangeStatusToDone}
                        >
                          Done
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={handleReturnToListOrder}
                        >
                          Return
                        </Button>
                      </Stack>
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

export default OrderDetailDone;
