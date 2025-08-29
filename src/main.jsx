import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Clientes from './pages/Clientes.jsx'
import Productos from './pages/Productos.jsx'
import PerfilCliente from './pages/PerfilClientes.jsx'
import AgregarCliente from './pages/AgregarClientes.jsx'
import PerfilProducto from './pages/PerfilProducto.jsx'
import Perfil from './pages/Perfil.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="clientes/:id" element={<PerfilCliente />} />
        <Route path="productos" element={<Productos />} />
        <Route path="agregar-cliente" element={<AgregarCliente />} />
        <Route path="productos/:id" element={<PerfilProducto />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
)
