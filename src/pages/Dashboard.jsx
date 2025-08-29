import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { generarPDFDashboardDatos } from "../utils/pdfUtils";

const COLORS = ['#4f772d', '#31572c', '#132a13', '#90a955', '#ecf39e']

export default function Dashboard() {
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const storedClientes = JSON.parse(localStorage.getItem('clientes')) || []
    const storedProductos = JSON.parse(localStorage.getItem('productos')) || []

    setClientes(storedClientes)
    setProductos(storedProductos)
  }, [])

  // Clientes asignado cada producto
  const contarClientesPorProducto = (productoId) => {
    return clientes.filter(cliente => cliente.productos?.includes(productoId)).length
  }

  // Pastel: cantidad total de asignaciones de productos
  const dataGrafica = productos.map((producto) => ({
    name: producto.nombre,
    value: contarClientesPorProducto(producto.id),
  })).filter(item => item.value > 0)

  const clientesRecientes = [...clientes]
    .sort((a, b) => b.id - a.id)
    .slice(0, 3)

  return (
    <div id="dashboard-container" className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-[#4f772d]">Panel de Control</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total clientes */}
        <div className="p-6 rounded-lg shadow bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Total Clientes</h2>
          <p className="text-4xl font-bold text-[#4f772d]">{clientes.length}</p>
        </div>

        {/* Total productos */}
        <div className="p-6 rounded-lg shadow bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Total Productos</h2>
          <p className="text-4xl font-bold text-[#4f772d]">{productos.length}</p>
        </div>

        {/* Clientes por producto */}
        <div className="p-6 rounded-lg shadow bg-white border border-gray-200 max-h-[400px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Clientes por Producto</h2>
          {productos.length === 0 ? (
            <p className="text-gray-500">No hay productos almacenados.</p>
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {productos.map(producto => (
                <li key={producto.id} className="flex justify-between border-b border-gray-200 pb-1">
                  <span>{producto.nombre}</span>
                  <span className="font-bold">{contarClientesPorProducto(producto.id)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Clientes recientes */}
        <div className="p-6 rounded-lg shadow bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Clientes Recientes</h2>
          {clientesRecientes.length === 0 ? (
            <p className="text-gray-500">No hay clientes recientes.</p>
          ) : (
            <ul className="space-y-2">
              {clientesRecientes.map(cliente => (
                <li key={cliente.id} className="border-b border-gray-200 pb-1">
                  <p className="font-medium">{cliente.nombre}</p>
                  <p className="text-sm text-gray-600">{cliente.email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-6 rounded-lg shadow bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Distribución de Productos por Cliente</h2>
          {dataGrafica.length === 0 ? (
            <p className="text-gray-500">No hay datos para mostrar.</p>
          ) : (
            <div id="grafica-pastel" style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataGrafica}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {dataGrafica.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="p-6 rounded-lg shadow bg-white border border-gray-200 flex flex-col space-y-4">
          <h2 className="text-xl font-semibold mb-4">Accesos Rápidos</h2>
          <button
            onClick={() => navigate('/productos')}
            className="bg-[#4f772d] text-white py-2 rounded hover:bg-[#3d5a1f] transition"
          >
            Ver Productos
          </button>
          <button
            onClick={() => navigate('/agregar-cliente')} 
            className="bg-[#4f772d] text-white py-2 rounded hover:bg-[#3d5a1f] transition"
          >
            Agregar Cliente
          </button>
          <button
          onClick={() => generarPDFDashboardDatos(clientes, productos)}
          className="bg-[#4f772d] text-white py-2 rounded hover:bg-[#3d5a1f] transition"
        >
          Descargar PDF
        </button>
        </div>
      </div>
    </div>
  )
}
