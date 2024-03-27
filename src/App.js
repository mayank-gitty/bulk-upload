import logo from './logo.svg';

import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import './App.css';
// import UploadForm from './Components/ReactDropzone';

import UploadForm from './Components/UploadForm';

function App() {
  return (
    <div className="App">
       <UploadForm/>
    </div>
  );
}

export default App;
