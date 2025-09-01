import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import Loader from '../components/Loader'
import { generarPDFDashboardDatos } from "../utils/pdfUtils"

const COLORS = ['#4f772d', '#31572c', '#132a13', '#90a955', '#ecf39e']

export default function Dashboard() {
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [clienteProductos, setClienteProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select('*')
      if (clientesError) console.error('Error al obtener clientes:', clientesError)

      // productos
      const { data: productosData, error: productosError } = await supabase
        .from('productos')
        .select('*')
      if (productosError) console.error('Error al obtener productos:', productosError)

      // relaciones cliente-producto
      const { data: clienteProductosData, error: cpError } = await supabase
        .from('cliente_productos')
        .select('*')
      if (cpError) console.error('Error al obtener relaciones cliente-productos:', cpError)

      setClientes(clientesData || [])
      setProductos(productosData || [])
      setClienteProductos(clienteProductosData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <Loader text="Cargando dashboard..." />

  // contar clientes por producto
  const contarClientesPorProducto = (productoId) =>
    clienteProductos.filter(cp => cp.producto_id === productoId).length

  const dataGrafica = productos
    .map(producto => ({
      name: producto.nombre,
      value: contarClientesPorProducto(producto.id),
    }))
    .filter(item => item.value > 0)

  const clientesRecientes = [...clientes].sort((a, b) => b.id - a.id).slice(0, 3)

  return (
    <div id="dashboard-container" className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-[#4f772d]">Panel de Control</h1>

      {/* Sección superior: totales + lista clientes por producto */}
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

      {/* Gráfica de barras */}
      <div className="p-6 rounded-lg shadow bg-white border border-gray-200 mt-8">
        <h2 className="text-xl font-semibold mb-4">Distribución de Productos por Cliente</h2>
        {dataGrafica.length === 0 ? (
          <p className="text-gray-500">No hay datos para mostrar.</p>
        ) : (
          <div id="grafica-barras" style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataGrafica}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" reversed /> {/* <-- Aquí el cambio */}
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#4f772d">
                  {dataGrafica.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Sección inferior: clientes recientes + accesos rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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

        {/* Accesos rápidos */}
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
            onClick={() => generarPDFDashboardDatos(clientes, productos, clienteProductos)}
            className="bg-[#4f772d] text-white py-2 rounded hover:bg-[#3d5a1f] transition"
          >
            Descargar PDF
          </button>
        </div>
      </div>
    </div>

  )
}
