import jsPDF from "jspdf";

export const generarPDFPerfilCliente = (cliente, productosCliente) => {
  try {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 190; // ancho útil en mm
    const margin = 10;
    const cellPadding = 5;

    // Color gris tipo gray-400 para bordes
    pdf.setDrawColor(156, 163, 175); 

    // Título: Perfil del Cliente
    const titleCellHeight = 15;
    pdf.setFillColor(79, 119, 45); // verde
    pdf.setDrawColor(0); // borde negro para título
    pdf.rect(margin, margin, pageWidth, titleCellHeight, "FD");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text("Perfil del Cliente", margin + cellPadding, margin + 11);
    pdf.setTextColor(0);

    // Posiciones y tamaños de celdas
    const datosClienteCellY = margin + titleCellHeight + 5;
    const datosClienteCellHeight = 30;
    const datosClienteCellWidth = pageWidth;

    const productosCellY = datosClienteCellY + datosClienteCellHeight + 5;
    const productosCellHeight = 60;
    const productosCellWidth = pageWidth;

    const firmaCellY = productosCellY + productosCellHeight + 5;
    const firmaCellHeight = 30;
    const firmaCellWidth = pageWidth;

    // Celda Datos del Cliente
    pdf.rect(margin, datosClienteCellY, datosClienteCellWidth, datosClienteCellHeight, "S");
    pdf.setFontSize(16);
    pdf.text("Datos del Cliente:", margin + cellPadding, datosClienteCellY + 10);
    pdf.setFontSize(12);
    pdf.text(`Nombre: ${cliente.nombre}`, margin + cellPadding, datosClienteCellY + 20);
    pdf.text(`Email: ${cliente.email}`, margin + cellPadding, datosClienteCellY + 27);

    // Celda Productos del Cliente
    pdf.rect(margin, productosCellY, productosCellWidth, productosCellHeight, "S");
    pdf.setFontSize(16);
    pdf.text("Productos del Cliente:", margin + cellPadding, productosCellY + 10);
    pdf.setFontSize(12);

    let yPosProductos = productosCellY + 20;
    let totalPrecio = 0;

    productosCliente.forEach(producto => {
    const precio = Number(producto.precio) || 0;
    pdf.text(`- ${producto.nombre}`, margin + cellPadding + 2, yPosProductos);
    const precioText = `$${precio.toFixed(2)}`;
    const precioTextWidth = pdf.getTextWidth(precioText);
    pdf.text(precioText, margin + productosCellWidth - cellPadding - precioTextWidth, yPosProductos);
    yPosProductos += 7;
    totalPrecio += precio;
  });

    // Línea separadora antes del total
    pdf.setDrawColor(156, 163, 175);
    pdf.line(margin + cellPadding, yPosProductos + 2, margin + productosCellWidth - cellPadding, yPosProductos + 2);

    // Total al final
    pdf.setFontSize(14);
    pdf.text("Total:", margin + cellPadding, yPosProductos + 10);
    const totalText = `$${totalPrecio.toFixed(2)}`;
    const totalTextWidth = pdf.getTextWidth(totalText);
    pdf.text(totalText, margin + productosCellWidth - cellPadding - totalTextWidth, yPosProductos + 10);

    pdf.setDrawColor(156, 163, 175);

    // Celda Firma del Cliente
    pdf.rect(margin, firmaCellY, firmaCellWidth, firmaCellHeight, "S");
    pdf.setFontSize(16);
    pdf.text("Firma del Cliente:", margin + cellPadding, firmaCellY + 10);
    pdf.line(margin + cellPadding, firmaCellY + 25, margin + firmaCellWidth - cellPadding, firmaCellY + 25);

    // Guardar PDF
    pdf.save(`perfil_cliente_${cliente.nombre.replace(/\s+/g, "_").toLowerCase()}.pdf`);
  } catch (error) {
    console.error("Error generando el PDF:", error);
  }
};
