
import { Toaster } from "sonner"
import PagesRoute from "./routes/pagesRoute"
import { AnimatePresence } from "framer-motion"


function App() {

  return (
    <AnimatePresence mode="wait">
      <div
        className="App bg-black/50 h-screen w-full">
        <Toaster position="top-center" duration={1000} richColors closeButton />
        <PagesRoute />
      </div>
    </AnimatePresence>

  )
}

export default App