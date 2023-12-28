import './App.css';
import UserList from './components/UserList';

function App() {
  return (
    <div className="App bg-gradient-to-br from-orange-300  via-orange-200 to-orange-300 w-screen md:w-2/3 mx-auto md:rounded-3xl h-screen text-gray-800 ">
      <UserList />
    </div>
  );
}

export default App;
