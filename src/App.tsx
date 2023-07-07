import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import './App.css';
import { Delete } from '@mui/icons-material';

type Todo = {
  id: number;
  task: string;
  completed: boolean;
};

// Obtener los elementos del localStorage
const getLocalItems = () => {
  const list = localStorage.getItem('todos');
  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

function App() {
  const [item, setItem] = useState<string>('');
  const [items, setItems] = useState<Todo[]>(getLocalItems());
  const [pendingTasks, setPendingTasks] = useState<number>(0);

  // Actualizar el localStorage y el contador de tareas pendientes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(items));
    const count = items.filter((item) => !item.completed).length;
    setPendingTasks(count);
  }, [items]);

  // Agregar una nueva tarea
  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (item !== '') {
      const newItem: Todo = {
        id: Math.random(),
        task: item,
        completed: false,
      };
      setItems((prevItems) => [...prevItems, newItem]);
    }
    setItem('');
  };

  // Marcar una tarea como completa o incompleta
  const completeTask = (id: number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          completed: !item.completed,
        };
      }
      return item;
    });
    setItems(updatedItems);
  };

  // Eliminar una tarea
  const deleteTask = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Todo List
      </Typography>

      <form
        onSubmit={(e) => addTask(e)}
        style={{ display: 'flex', marginBottom: '1rem' }}
      >
        <TextField
          fullWidth
          label="New Todo"
          variant="outlined"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          Add
        </Button>
      </form>

      <Container>
        <p>Tareas Pendientes: {pendingTasks}</p>
      </Container>
      <Container>
        {items.length > 0 ? (
          <List>
            {items?.map((item) => (
              <ListItem
                key={item.id}
                onClick={() => completeTask(item.id)}
                style={{
                  textDecoration: item.completed ? 'line-through' : 'none',
                }}
              >
                <ListItemText primary={item.task} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteTask(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <p>No tienes tareas </p>
        )}
      </Container>
    </Container>
  );
}

export default App;
