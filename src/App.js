import React, { useState, useEffect } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

const SortableItem = SortableElement(({ value }) => {
  return (
    <li className="list-group-item">
      <h1>{value.title}</h1>
      <p>{value.description}</p>
    </li>
  );
});

const SortableList = SortableContainer(({ items }) => {
  return (
    <ul>
      {items.map((value, i) => (
        <SortableItem value={value} key={i} index={i} />
      ))}
    </ul>
  );
});

function SortableComponent() {
  const [tasks, setTasks] = useState([
    { title: 'item 1', description: 'task one' },
    { title: 'item 2', description: 'task two' },
    { title: 'item 3', description: 'task three' },
    { title: 'item 4', description: 'task four' },
    { title: 'item 5', description: 'task five' }
  ]);

  const getData = async () => {
    const res = await fetch('http://localhost:4000/tasks');
    const tasks = await res.json();
    tasks.sort((a, b) =>
      a.sorting > b.sorting ? 1 : b.sorting > a.sorting ? -1 : 0
    );
    setTasks(tasks);
  };

  useEffect(() => {
    getData();
  }, []);

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    let tasksCopy = [...tasks];
    tasksCopy = arrayMove(tasksCopy, oldIndex, newIndex);
    setTasks(tasksCopy);
    const tasksIds = tasksCopy.map(t => t._id);
    const res = await fetch('http://localhost:4000/tasks', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tasksIds)
    });
    const data = await res.json();
    console.log(data);
    getData();
  };

  return <SortableList items={tasks} onSortEnd={onSortEnd} />;
}

function App() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4 offset-md-4">
          <SortableComponent />
        </div>
      </div>
    </div>
  );
}

export default App;
