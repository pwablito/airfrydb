import './App.css';
import { React, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';


function App() {
  const [recipes, setRecipes] = useState([])
  const [displayedRecipe, setDisplayedRecipe] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [displayModalOpen, setDisplayModalOpen] = useState(false);
  const handleAddModalOpen = () => setAddModalOpen(true);
  const handleAddModalClose = () => setAddModalOpen(false);
  const handleDisplayModalOpen = () => setDisplayModalOpen(true);
  const handleDisplayModalClose = () => setDisplayModalOpen(false);

  const addName = useRef("")
  const addNotes = useRef("")
  const addShakes = useRef(0)
  const addTime = useRef(0)
  const addTemp = useRef(400)

  function addModalSubmit() {
    addRecipe(
      addName.current.value,
      Number(addTemp.current.value),
      Number(addTime.current.value),
      Number(addShakes.current.value),
      addNotes.current.value,
    )
    setAddModalOpen(false)
  }

  function refreshRecipes() {
    axios.get(`/api/recipes`)
      .then(res => {
        setRecipes(res.data);
        setLoaded(true);
      })
  }

  function deleteRecipe(id) {
    axios.delete(`/api/recipes/${id}`)
      .then(refreshRecipes)
  }

  function deleteDisplayed() {
    console.log("Deleting", displayedRecipe)
    deleteRecipe(displayedRecipe.id)
  }

  function addRecipe(name, temp, cook_minutes, shake_times, notes) {
    axios.post(`api/recipes`, {
      name: name,
      temp: temp,
      cook_minutes: cook_minutes,
      shake_times: shake_times,
      notes: notes
    })
      .then(refreshRecipes)
  }

  useEffect(refreshRecipes, []);

  const addModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const table = useMaterialReactTable({
    columns: [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 250,
      },
      {
        accessorKey: 'cook_minutes',
        header: 'Time',
        size: 50,
      },
      {
        accessorKey: 'temp',
        header: 'Temp (F)',
        size: 50,
      },
      {
        accessorKey: 'shake_times',
        header: 'Shakes',
        size: 50,
      },
      {
        accessorKey: 'notes',
        header: 'Notes',
        size: 250,
      }
    ],
    data: recipes,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (_) => {
        console.log(row.original);
        setDisplayedRecipe(row.original)

        setDisplayModalOpen(true)
      },
      sx: {
        cursor: 'pointer',
      },
    }),
  });

  return (
    <div className="App">
      <div>
        <h1>Air Fry DB <Button onClick={handleAddModalOpen} variant="outlined">Add Recipe</Button></h1>
        <Modal
          open={addModalOpen}
          onClose={handleAddModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={addModalStyle}>
            <div style={{ margin: 10 }}>
              <TextField
                required
                id="name"
                label="Recipe Name"
                inputRef={addName}
              />
            </div>
            <div style={{ margin: 10 }}>
              <TextField
                id="cook_time"
                label="Cook Time"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                inputRef={addTime}
              />
            </div>
            <div style={{ margin: 10 }}>
              <TextField
                id="shakes"
                label="Shakes"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                inputRef={addShakes}
              />
            </div>
            <div style={{ margin: 10 }}>
              <TextField
                id="temp"
                label="Temperature"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                inputRef={addTemp}
              />
            </div>
            <div style={{ margin: 10 }}>
              <TextField
                id="notes"
                label="Notes"
                inputRef={addNotes}
              />
            </div>
            <Button color="success" onClick={addModalSubmit} variant="outlined">Add Recipe</Button>

          </Box>
        </Modal>
        {loaded ? <MaterialReactTable table={table} /> : <p>Loading...</p>}
        <Modal
          open={displayModalOpen}
          onClose={handleDisplayModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={addModalStyle}>
            <p>Name: {displayedRecipe.name}</p>
            <p>Temperature (F): {displayedRecipe.temp}</p>
            <p>Cook Time (s): {displayedRecipe.cook_time}</p>
            <p>Shakes (#): {displayedRecipe.shakes}</p>
            <p>Notes: {displayedRecipe.notes}</p>
            <Button color="danger" onClick={deleteDisplayed} variant="outlined">Delete</Button>
          </Box>
        </Modal>
      </div>
    </div>

  )
}

export default App;
