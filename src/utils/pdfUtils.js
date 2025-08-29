import jsPDF from "jspdf";
import domtoimage from "dom-to-image-more";

export const generarPDFDashboardDatos = async (clientes, productos) => {
  try {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 190; // ancho en mm
    const margin = 10;
    const cellPadding = 5;

    // Color gris tipo gray-400 para bordes
    pdf.setDrawColor(156, 163, 175); // #9CA3AF

    // Título
    const titleCellHeight = 15;
    pdf.setFillColor(79, 119, 45); // verde
    pdf.setDrawColor(0); // Borde negro para título
    pdf.rect(margin, margin, pageWidth, titleCellHeight, "FD");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text("Panel de Control", margin + cellPadding, margin + 11);
    pdf.setTextColor(0);

    // Bordes gris para celdas
    pdf.setDrawColor(156, 163, 175); // #9CA3AF

    // Totales
    const totalCellHeight = 20;
    pdf.rect(margin, margin + titleCellHeight + 2, pageWidth, totalCellHeight, "S");
    pdf.setFontSize(14);
    pdf.text(`Total Clientes: ${clientes.length}`, margin + cellPadding, margin + titleCellHeight + 12);
    pdf.text(`Total Productos: ${productos.length}`, margin + pageWidth / 2 + cellPadding, margin + titleCellHeight + 12);

    // Altura dinámica para las dos celdas
    const rowHeight = 7; // altura por cada fila
    const clientesRecientesCount = Math.min(clientes.length, 3); // máximo 3 clientes recientes
    const clientesPorProductoCount = productos.length;

    // Calculamos altura máxima para ambas secciones
    const dynamicCellHeight = Math.max(
      clientesRecientesCount * rowHeight + 20, // 20 para el título y márgenes
      clientesPorProductoCount * rowHeight + 20
    );

    // Posiciones y tamaños de celdas para secciones
    const clientesCellY = margin + titleCellHeight + totalCellHeight + 5;
    const clientesCellWidth = pageWidth / 2 - 5;
    const clientesPorProdCellX = margin + pageWidth / 2 + 5;
    const clientesPorProdCellWidth = pageWidth / 2 - 5;

    // Celda Clientes Recientes
    pdf.rect(margin, clientesCellY, clientesCellWidth, dynamicCellHeight, "S");
    pdf.setFontSize(16);
    pdf.text("Clientes Recientes:", margin + cellPadding, clientesCellY + 10);
    pdf.setFontSize(12);
    let yPosClientesRecientes = clientesCellY + 20;
    const clientesRecientes = [...clientes].sort((a, b) => b.id - a.id).slice(0, 3);
    clientesRecientes.forEach(cliente => {
      pdf.text(`- ${cliente.nombre}`, margin + cellPadding + 2, yPosClientesRecientes);

      const emailText = cliente.email;
      const emailTextWidth = pdf.getTextWidth(emailText);
      pdf.text(
        emailText,
        margin + clientesCellWidth - cellPadding - emailTextWidth,
        yPosClientesRecientes
      );

      // Línea separadora
      const lineY = yPosClientesRecientes + 2;
      pdf.setDrawColor(156, 163, 175);
      pdf.line(margin + cellPadding, lineY, margin + clientesCellWidth - cellPadding, lineY);

      yPosClientesRecientes += rowHeight;
    });

    // Celda Clientes por Producto
    pdf.rect(clientesPorProdCellX, clientesCellY, clientesPorProdCellWidth, dynamicCellHeight, "S");
    pdf.setFontSize(16);
    pdf.text("Clientes por Producto:", clientesPorProdCellX + cellPadding, clientesCellY + 10);
    pdf.setFontSize(12);
    let yPosClientesPorProd = clientesCellY + 20;

    productos.forEach(producto => {
      const clientesCount = clientes.filter(cliente => cliente.productos?.includes(producto.id)).length;

      pdf.text(`- ${producto.nombre}`, clientesPorProdCellX + cellPadding + 2, yPosClientesPorProd);

      const countText = `${clientesCount}`;
      const countTextWidth = pdf.getTextWidth(countText);
      pdf.text(
        countText,
        clientesPorProdCellX + clientesPorProdCellWidth - cellPadding - countTextWidth,
        yPosClientesPorProd
      );

      // Línea separadora
      const lineY = yPosClientesPorProd + 2;
      pdf.setDrawColor(156, 163, 175);
      pdf.line(clientesPorProdCellX + cellPadding, lineY, clientesPorProdCellX + clientesPorProdCellWidth - cellPadding, lineY);

      yPosClientesPorProd += rowHeight;
    });

    // Celda gráfica abajo
    const graficaCellY = clientesCellY + dynamicCellHeight + 5;
    const graficaCellWidth = pageWidth;
    const graficaCellHeight = 70;
    pdf.rect(margin, graficaCellY, graficaCellWidth, graficaCellHeight, "S");

    // Título gráfica
    pdf.setFontSize(16);
    pdf.text("Distribución de Productos por Cliente", margin + cellPadding, graficaCellY + 10);

    // Capturar gráfica
    const graficaNode = document.getElementById("grafica-pastel");
    if (!graficaNode) {
      console.error("No se encontró el nodo de la gráfica");
      return;
    }
    graficaNode.classList.add("sin-sombras");

    const scale = 2;
    const style = {
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      width: `${graficaNode.scrollWidth}px`,
      height: `${graficaNode.scrollHeight}px`,
    };
    const param = {
      width: graficaNode.scrollWidth * scale,
      height: graficaNode.scrollHeight * scale,
      style,
      quality: 1,
    };

    const dataUrl = await domtoimage.toPng(graficaNode, param);
    graficaNode.classList.remove("sin-sombras");

    const imgProps = pdf.getImageProperties(dataUrl);
    const imgMaxWidth = graficaCellWidth - cellPadding * 2;
    const imgMaxHeight = graficaCellHeight - 20;
    let imgWidth = imgMaxWidth;
    let imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    if (imgHeight > imgMaxHeight) {
      imgHeight = imgMaxHeight;
      imgWidth = (imgProps.width * imgHeight) / imgProps.height;
    }

    // Centrar imagen horizontalmente dentro de la celda
    const imgX = margin + (graficaCellWidth - imgWidth) / 2;
    const imgY = graficaCellY + 15;

    pdf.addImage(dataUrl, "PNG", imgX, imgY, imgWidth, imgHeight);

    // Guardar PDF
    pdf.save("dashboard.pdf");
  } catch (error) {
    console.error("Error generando el PDF:", error);
  }
};
