import React, { useEffect, useState } from "react";
import Column from "./components/Column";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { styled } from "./stiches.config";
import axios from "axios";

const StyledColumns = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  margin: "10vh auto",
  width: "80%",
  height: "80vh",
  gap: "8px",
});

const finalSpaceCharacters = [
  {
    id: "0",
    name: "",
    description: "",
    day: 0,
  },
];

const dayExample = [""];

function App() {
 var denemeArray = [""];
  const [characters, updateCharacters] = useState(finalSpaceCharacters);

  const [todoData, settodoData] = useState<any[""]>(finalSpaceCharacters);
  const [pazartesi, setPazartesi] = useState([""]);

  const [newNameParameter, setNewNameParameter] = useState("");
  const [newDescriptionParameter, setNewDescriptionParameter] = useState("");
  const [newDayParameter, setnewDayParameter] = useState("");

  useEffect(() => {
  
    axios
      .get("http://localhost:8081/list")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          setPazartesi(pazartesi.concat(response.data[3].name.toString()));
          denemeArray.push(response.data[i].name)
          console.log(denemeArray);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        console.log(pazartesi);
      });
      
      denemeArray.shift();
  }, []);

  function SendData() {
    fetch("http://localhost:8081/", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newNameParameter,
        description: newDescriptionParameter,
        day: newDayParameter,
      }),
    })
      .then((x) => x.json())
      .then((x) => {
        updateCharacters(characters.concat(x));
      })
      .finally(function () {});
  }

  const initialColumns = {
    Pazartesi: {
      id: "Pazartesi",
      list: denemeArray,
    },
    Salı: {
      id: "Salı",
      list: [],
    },
    Çarşamba: {
      id: "Çarşamba",
      list: ["item 4", "item 5", "item 6"],
    },
    Perşembe: {
      id: "Perşembe",
      list: ["item 7", "item 8", "item 9"],
    },
    Cuma: {
      id: "Cuma",
      list: [],
    },
    Cumartesi: {
      id: "Cumartesi",
      list: ["item 10", "item 11", "item 12"],
    },
    Pazar: {
      id: "Pazar",
      list: ["item 13", "item 14", "item 15"],
    },
  };

  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = ({ source, destination }: DropResult) => {
    // Make sure we have a valid destination
    if (destination === undefined || destination === null) return null;

    // Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null;

    // Set start and end variables
    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];

    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = start.list.filter(
        (_: any, idx: number) => idx !== source.index
      );

      // Then insert the item at the right location
      newList.splice(destination.index, 0, start.list[source.index]);

      // Then create a new copy of the column object
      const newCol = {
        id: start.id,
        list: newList,
      };

      // Update the state
      setColumns((state) => ({ ...state, [newCol.id]: newCol }));
      return null;
    } else {
      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      const newStartList = start.list.filter(
        (_: any, idx: number) => idx !== source.index
      );

      // Create a new start column
      const newStartCol = {
        id: start.id,
        list: newStartList,
      };

      // Make a new end list array
      const newEndList = end.list;

      // Insert the item into the end list
      newEndList.splice(destination.index, 0, start.list[source.index]);

      // Create a new end column
      const newEndCol = {
        id: end.id,
        list: newEndList,
      };

      // Update the state
      setColumns((state) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      }));
      return null;
    }
  };

  return (
    <div>
      <div className="firstRow">
        <input
          onChange={(e) => setNewNameParameter(e.target.value)}
          type="text"
        />
        <input
          onChange={(e) => setNewDescriptionParameter(e.target.value)}
          type="text"
        />
        <input
          onChange={(e) => setnewDayParameter(e.target.value)}
          type="text"
        />
        <button onClick={SendData}>Post Data</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <StyledColumns>
          {Object.values(columns).map((col) => (
            <Column col={col} key={col.id} />
          ))}
        </StyledColumns>
      </DragDropContext>
    </div>
  );
}

export default App;

//ASENKRON FETCH
// async function fetchDataJSON() {
//   const response = await fetch("http://localhost:8081/list");
//   const data = await response.json();
//   for (let i =0 ; i<data.length;i++){
//     setPazartesi(pazartesi.concat(data[i].name));
//   }
//   return data;
// }
