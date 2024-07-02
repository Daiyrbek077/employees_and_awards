import { HashRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";


const App = observer(() => {


  return (
    <HashRouter>
      <NavBar />
      <AppRouter />
    </HashRouter>
  )
})

export default App;