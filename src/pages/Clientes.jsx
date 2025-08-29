import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import Loader from '../components/Loader'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [productosDisponibles, setProductosDisponibles] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Traer todos los clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select('*')
      if (clientesError) console.error('Error al obtener clientes:', clientesError)

      // Traer todos los productos
      const { data: productosData, error: productosError } = await supabase
        .from('productos')
        .select('*')
      if (productosError) console.error('Error al obtener productos:', productosError)
      setProductosDisponibles(productosData || [])

      // Traer relaciones cliente-productos
      const { data: relaciones, error: relacionesError } = await supabase
        .from('cliente_productos')
        .select('*')
      if (relacionesError) console.error('Error al obtener relaciones:', relacionesError)

      // Mapear productos asignados a cada cliente
      const clientesConProductos = (clientesData || []).map(cliente => {
        const productosCliente = (relaciones || [])
          .filter(rel => rel.cliente_id === cliente.id)
          .map(rel => rel.producto_id)
        return { ...cliente, productos: productosCliente }
      })

      setClientes(clientesConProductos)
      setLoading(false)
    }

    fetchData()
  }, [])

  // Mostrar Loader mientras carga
  if (loading) return <Loader text="Cargando clientes..." />

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-[#4f772d]">Clientes</h1>
        <button
          onClick={() => navigate('/agregar-cliente')}
          className="bg-[#4f772d] text-white px-4 py-2 rounded hover:bg-[#3d5a1f] w-full md:w-auto cursor-pointer transition-colors duration-300 ease-in-out"
        >
          Agregar Cliente
        </button>
      </div>

      <div className="grid gap-4">
        {clientes.map(cliente => (
          <div
            key={cliente.id}
            onClick={() => navigate(`/clientes/${cliente.id}`)}
            className="cursor-pointer bg-white p-4 rounded-xl shadow space-y-2 transform transition duration-200 hover:scale-[1.02]"
          >
            <div>
              <h3 className="text-xl font-semibold">{cliente.nombre}</h3>
              <p className="text-sm text-gray-600">{cliente.email}</p>
            </div>
            <div className="text-sm text-gray-800">
              <strong>Productos:</strong>{' '}
              {cliente.productos.length > 0
                ? cliente.productos
                    .map(
                      pid =>
                        productosDisponibles.find(p => p.id === pid)?.nombre ||
                        'Producto eliminado'
                    )
                    .join(', ')
                : <span className="text-gray-500">Sin productos asignados</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
