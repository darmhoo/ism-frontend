import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../components/data-table/DataTableBase'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { ChangeEvent, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'react-toastify';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from '../utils/axios';



import memoize from 'memoize-one';

import { fetchAllClassrooms, createClassroom, getAttendance, deleteClassroom, fetchAllAssignments, createAssignment, deleteAssignment } from '@app/services/admin/classServices';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import moment from 'moment';


const Assignment = () => {

  const [open, setOpen] = React.useState(false);
  const [pending, setpending] = React.useState(true);
  const [pending2, setpending2] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [selectedAssignment, setSelectedAssignment] = React.useState<any>();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [filename, setFilename] = React.useState("");
  const [file, setFile] = React.useState(null);


  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [link, setLink] = React.useState('');
  const [deadline, setDeadline] = React.useState<any>();
  const [rows, setRows] = React.useState([]);
  const [attendance, setAttendance] = React.useState([]);



  const handleOpenAdd = () => {
    setOpenAdd(true);
  }

  const handleCloseAdd = () => {
    setOpenAdd(false);
  }
  const handleOpenEdit = async (id: any) => {
    setpending2(true);
    let attendance = await getAttendance(id);
    console.log(attendance);
    setAttendance(attendance.data);
    setpending2(false);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDownload = () => {
    setOpenDelete(false);
  };

  const handleButtonClick = (type: any, assignment: any) => {
    setSelectedAssignment(assignment);
    if (type === 'edit') {
      handleOpenEdit(assignment.id);
    } else if (type === 'delete') {
      handleOpenDelete();
    } else {
      handleDownload();
    }
  }
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file: any = e.target.files[0];
    setFile(file);
    const { name } = file;

    setFilename(name);
  }

  const getAssignments = async () => {
    const assignments = await fetchAllAssignments();
    setRows(assignments.assignments);
    setpending(false);
    console.log(assignments);
  }
  const performActionDelete = async () => {
    setLoading(true);
    const res = await deleteAssignment(selectedAssignment?.id);
    if (res.status === 'Success') {
      toast.success('Assignment Deleted Successfully!');
      handleCloseDelete();
      getAssignments();

    }
    setLoading(false);
  }


  // const createAssignmentAction = async () => {
  //   setLoading(true);
  //   const data = {
  //     title: title,
  //     description: description,
  //     link: link,
  //   }
  //   const assignment = await createAssignment(data);
  //   console.log(assignment);
  //   toast.success('Assignment Created Successfully!');
  //   handleCloseAdd();
  //   getAssignments();
  //   setLoading(false);



  // }

  const createAssignmentAction = async () => {
    setLoading(true);
    let formData = new FormData();
    //@ts-ignore
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("link", link);
    formData.append("deadline", deadline);

    let res = await axios.post('/assignments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (res) {
      toast.success('Assignment created');
    }
    setLoading(false);
    handleCloseAdd();


  }
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const style2 = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const columns = memoize(clickHandler => [
    { name: 'Title', selector: (row: any) => row.title },
    { name: 'Description', selector: (row: any) => row.description },
    { name: 'Link', selector: (row: any) => row.link },
    { name: 'Deadline', selector: (row: any) => row.deadline },
    { name: 'Download File', cell: (row: any) => (<button className='btn btn-primary btn-sm p-1' title='Download File' onClick={() => { clickHandler('download', row) }}>Download</button>) },

    {
      name: 'Action',

      cell: (row: any) => (<div><button className='btn btn-primary btn-sm p-1' title='View Attendance' onClick={() => { clickHandler('edit', row) }}>View</button> <button className='btn p-1 btn-danger btn-sm' onClick={() => { clickHandler('delete', row) }} title='Delete Class'>Delete</button></div>),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ])

  const columns2 = [
    { name: 'First Name', selector: (row: any) => row.profile?.first_name },
    { name: 'Last Name', selector: (row: any) => row.profile?.last_name },
    { name: 'Email', selector: (row: any) => row.email },
    { name: 'Clock-in Time', selector: (row: any) => moment(row.attendance_user?.created_at).toString() }

  ];


  useEffect(() => {
    getAssignments();
  }, [])
  return (
    <div>
      <ContentHeader title="Assignments" />
      <section className="content">

        <div className="container-fluid">
          <div className="d-grid gap-2 d-md-block py-2">
            <Button size='small' variant='outlined' startIcon={<AddIcon />} onClick={handleOpenAdd} className="btn btn-primary btn-sm float-right mx-1" type="button">Add</Button>
          </div>
          <DataTable columns={columns(handleButtonClick)} data={rows} progressPending={pending} responsive keyField='id' striped />
        </div>
      </section>
      <Footer />

      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">
        <Container sx={{
          ...style, borderRadius: '5px', paddingY: '1.5rem'
        }} maxWidth="lg" component="form" noValidate>
          <h5 id="child-modal-title" className='text-center my-3'>Create Assignment</h5>
          <Container
          >

            <TextField
              id="outlined-controlled"
              size='small'
              label="Title"
              value={title}
              sx={{ marginRight: '1rem', marginY: '.5rem', width: '100%' }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(event.target.value);
              }}
            />
            <DateTimePicker label="Deadline"
              value={deadline}
              onChange={(newValue) => setDeadline(newValue)}></DateTimePicker>
            <TextField
              id="outlined-controlled"
              label="Description"
              size='small'
              sx={{ marginRight: '1rem', marginY: '.5rem', width: '100%' }}


              value={description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDescription(event.target.value);
              }}
            />

          </Container>

          <Container
          >

            <TextField
              id="outlined-controlled"
              label="Link"
              size='small'
              sx={{ marginRight: '1rem', marginY: '.5rem', width: '100%' }}



              value={link}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setLink(event.target.value);
              }}
            />

            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{ marginRight: "1rem" }}
              disabled={loading}
            >
              Upload File
              <input
                type="file"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            <span>{filename}</span>

          </Container>


          <br />
          <Box sx={{
            marginRight: "1rem",
            float: 'right'
          }}>
            <Button variant='outlined' size='small' sx={{
              marginRight: ".2rem"
            }} onClick={handleCloseAdd}>Cancel</Button>
            <Button variant='contained' size='small' onClick={createAssignmentAction} disabled={loading}>Submit</Button>
          </Box>

          {/* <Button variant="outlined" onClick={handleClose}>Close Child Modal</Button> */}
        </Container>
      </Modal>


      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">
        <Container sx={{
          ...style2, borderRadius: '5px', paddingY: '1.5rem'
        }} maxWidth="lg" component="form" noValidate>
          <h5 id="child-modal-title" className='text-center my-3'>View Attendance</h5>


          <DataTable columns={columns2} data={attendance} progressPending={pending2} responsive keyField='id' striped />


          <Box sx={{
            marginRight: "1rem",
            float: 'right'
          }}>
            <Button variant='outlined' size='small' sx={{
              marginRight: ".2rem"
            }} onClick={handleCloseEdit}>Cancel</Button>
            <Button variant='contained' size='small' onClick={createAssignmentAction} disabled={loading}>Submit</Button>
          </Box>

          {/* <Button variant="outlined" onClick={handleClose}>Close Child Modal</Button> */}
        </Container>
      </Modal>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">

        <DialogTitle align='center' variant='h5'>Delete Assignment</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to <b>delete</b> {selectedAssignment?.title}</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button variant='outlined' size='small' sx={{
            marginRight: ".2rem"
          }} onClick={handleCloseDelete}>Cancel</Button>
          <Button variant='contained' size='small' color='error' onClick={performActionDelete} disabled={loading}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Assignment;
