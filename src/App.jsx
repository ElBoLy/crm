import { Outlet, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './index.css'
import './styles/pdfUtils.css' 
import Sidebar from './components/Sidebar'

export default function App() {
  const token = sessionStorage.getItem('token')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!token) return <Navigate to="/login" />

  const sidebarWidth = isCollapsed ? 80 : 256
  const marginLeft = windowWidth >= 768 ? `${sidebarWidth}px` : '0px'

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/* Overlay para móviles */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 backdrop-blur-sm bg-gray/10 z-30 md:hidden transition-opacity duration-300"
        />
      )}

      <main
        className="flex-1 bg-gray-100 p-4 transition-all duration-300"
        style={{ marginLeft }}
      >
        <Outlet />
      </main>
    </div>
  )
}
