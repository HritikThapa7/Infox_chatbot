import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import { UserListHead, MoreMenu } from '../components/_dashboard/user';
import { AppContext } from '../context/AppContext';
//
// import USERLIST from '../_mocks_/user';
import publicFetch from '../utils/fetch';
import getImageLink from '../utils/getImageLink';
import AddNewsModal from '../components/_dashboard/news/AddNewsModal';
import EditNewsModal from '../components/_dashboard/news/EditNewsModal';
import { FetchContext } from '../context/FetchContext';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

export default function News() {
  const fetchContext = useContext(FetchContext);
  const appContext = useContext(AppContext);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [openAddNewsModal, setOpenAddNewsModal] = useState(false);
  const [openEditNewsModal, setOpenEditNewsModal] = useState(false);

  const [news, setNews] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    //  publicFetch
    //    .get(`news?page=${page + 1}&limit=${rowsPerPage}&sort=-star,-createdAt`)
    //    .then((res) => {
    //      setNews(res.data.data);
    //      setTotal(res.data.total);
    //    })
    //    .catch(() => {
    //      appContext.handleAlert();
    //    });
    setNews([{ _id: 1, title: 'Some title', star: 2, body: 'Some body', imagePath: '' }]);
  }, [appContext, page, rowsPerPage]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (_id) => {
    try {
      await fetchContext.authAxios.delete(`news/${_id}`);
      appContext.handleAlert({
        severity: 'success',
        message: 'News Delete.'
      });
    } catch (error) {
      appContext.handleAlert();
    }
  };

  return (
    <Page title="User">
      <AddNewsModal
        open={openEditNewsModal}
        handleOpen={() => setOpenEditNewsModal(true)}
        handleClose={() => setOpenEditNewsModal(false)}
      />
      {selectedNews && (
        <EditNewsModal
          news={selectedNews}
          open={openEditNewsModal}
          handleOpen={() => setOpenEditNewsModal(true)}
          handleClose={() => setOpenEditNewsModal(false)}
        />
      )}
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            News
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenEditNewsModal(true)}
            startIcon={<Icon icon={plusFill} />}
          >
            New News
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              {!news ? (
                <h1>Loading...</h1>
              ) : (
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={total}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {news.map((row) => {
                      const { _id, title, star, body, imagePath } = row;

                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox">
                          <TableCell padding="checkbox" />
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={title} src={getImageLink(imagePath)} />
                              <Typography variant="subtitle2" noWrap>
                                {title}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color={(star && 'error') || 'success'}>
                              {star ? 'Highlight' : 'News'}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <MoreMenu
                              handleEdit={() => {
                                setSelectedNews({
                                  _id,
                                  title,
                                  body,
                                  star,
                                  imagePath
                                });
                                setOpenEditNewsModal(true);
                              }}
                              handleDelete={() => {
                                handleDelete(_id);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Scrollbar>

          {news && (
            <TablePagination
              rowsPerPageOptions={[6, 12, 24]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Card>
      </Container>
    </Page>
  );
}
