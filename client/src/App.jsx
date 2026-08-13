
import { Toaster } from "sonner"
import PagesRoute from "./routes/pagesRoute"


function App() {

  return (
    <div className="App bg-black/50 h-screen w-full">
      <Toaster position="top-center" duration={1000} richColors closeButton />
      <PagesRoute />
    </div>
  )
}

export default App