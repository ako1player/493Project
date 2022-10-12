/* 
NOTES
  Add alert for delete button - Done
/*
HOW TO START THE PROGRAM
-------------------------
Open up the terminal
make sure you are in the inventory-version2 folder
once in the directory type in "npm start" which should start the program.
May need to have nodejs installed on computer
*/
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect} from "react";
import Axios from 'axios';
import Edit from './Components/Edit';
import Search from './Components/Search';

//App is what renders what shows on the browser
function App() {

  //What the database will store
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [stock, setStock] = useState(0);
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  //for updated items (still needs to be worked on)
  //const [newName, setNewName] = useState("");
  //const [newDesc, setNewDesc] = useState("");
  const [newStock, setNewStock] = useState(0);
  const [newLocation, setNewLocation] = useState("");

  //array of all items added to the database. name,desc, stock, location
  const [itemList, setItemList] = useState([]);

  //adds item to database
  //
  const addItem = () =>{
    Axios.post('http://localhost:3001/create', {
      name: name,
      desc: desc,
      stock: stock,
      location: location
    }).then(() =>{
        setItemList([...itemList, { //displayes items once added to the database. rerenders the page
          name: name,
          description: desc,
          stock: stock,
          location: location,
        },]);
    });
  };

  //filters items when using seach bar
  const filterItems = itemList.filter(
    item =>{
      return(
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    }
  );

  //displays inventory once browser is launched after npm start  
  useEffect(() =>{
    Axios.get('http://localhost:3001/inventory').then((response) =>{
      setItemList(response.data);
    });
  },[]);


  //deletes item from inventory using ID from the database
  const deleteItem = (id) =>{
    Axios.delete(`http://localhost:3001/delete/${id}`).then((response) =>{
        setItemList(itemList.filter((val) =>{
            return val.id !== id
        }))
    });
}

//supposed to update item. Still needs work.
const updateItem = (id) =>{
    Axios.put('http://localhost:3001/update', {location: newLocation, stock: newStock, id: id}).then((response) =>{
      setItemList(itemList.map((val) =>{//this just rerenders page once updated
        return val.id === id ? {id: val.id, name: val.name, description: val.description, stock: newStock, location: newLocation} : 
        val;
      }))
    });
}

//shows pop up to confirm if user wants to delete item or not from inventory
const cnfmDelete = (id) =>{
  if(window.confirm("Are you sure you want to delete this item?")){
    deleteItem(id);
  }
}

const handleChange = (e) => {
  setNewStock(e.currentTarget.value);
}

const locationChange = (e) => {
  setNewLocation(e.currentTarget.value);
}

  //Displays the table for the inventory. Using bootstrap css
  return (
    <div className="App">
      <form className='text-center'>
        <div className='row mb-3'>
          <label>Name:</label>
          <div className='col-sm'>
          <input type="text" onChange={(event)=>{setName(event.target.value)}}/>
          </div>
        </div>
        <div className='row mb-3'>
          <label>Description:</label>
          <div className='col-sm'>
          <input type="text" onChange={(event)=>{setDesc(event.target.value)}}/>
          </div>
        </div>
        <div className='row mb-3'>
          <label>Location:</label>
          <div className='col-sm'>
          <input type="text" onChange={(event)=>{setLocation(event.target.value)}}/>
          </div>
        </div>
        <div className='row mb-3'>
          <label>Stock:</label>
          <div className='col-sm'>
          <input type="number" min="0" onChange={(event)=>{setStock(event.target.value)}}/>
          </div>
        </div>
          <button onClick={addItem} className="btn btn-dark mb-2">Add Item</button>
      </form>
      <div className="items table-responsive">
        <Search query={query} onQueryChange={myQuery => setQuery(myQuery)}/>
        <table className="table table-bordered">
          <thead className="table-dark">
          <tr>
            <th scope='col' className='col-sm-2'>Name</th>
            <th scope='col' className='col-sm-2'>Description</th>
            <th scope='col' className='col-sm-2'>Location</th>
            <th scope='col' className='col-sm-2'>On Hand</th>
            <th scope='col' className='col-sm-2'></th>
          </tr>
          </thead>
          <tbody>
        {filterItems.map((val, key) =>(//gets the items from the itemList useState array and displays name,description, location, and stock
         <Edit item={val} onDelete={itemDel => cnfmDelete(val.id)} onUpdate={itemUpdate => updateItem(val.id)} onHandleChange={handleChange} onLocationChange={locationChange} />
        ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
