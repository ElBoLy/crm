import jsPDF from "jspdf";
import domtoimage from "dom-to-image-more";

export const generarPDFDashboardDatos = async (clientes, productos, clienteProductos) => {
  try {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 190;
    const margin = 10;
    const cellPadding = 5;

    // Color gris para bordes
    pdf.setDrawColor(156, 163, 175); // #9CA3AF

    // ------------------- TÍTULO -------------------
    const titleCellHeight = 15;
    pdf.setFillColor(79, 119, 45); // verde
    pdf.setDrawColor(0); // borde negro
    pdf.rect(margin, margin, pageWidth, titleCellHeight, "FD");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text("Panel de Control", margin + cellPadding, margin + 11);
    pdf.setTextColor(0);

    // ------------------- TOTALES -------------------
    const totalCellHeight = 20;
    pdf.rect(margin, margin + titleCellHeight + 2, pageWidth, totalCellHeight, "S");
    pdf.setFontSize(14);
    pdf.text(`Total Clientes: ${clientes.length}`, margin + cellPadding, margin + titleCellHeight + 12);
    pdf.text(
      `Total Productos: ${productos.length}`,
      margin + pageWidth / 2 + cellPadding,
      margin + titleCellHeight + 12
    );

    // ------------------- CELDAS DINÁMICAS -------------------
    const rowHeight = 7;
    const clientesRecientesCount = Math.min(clientes.length, 3);
    const clientesPorProductoCount = productos.length;
    const dynamicCellHeight = Math.max(
      clientesRecientesCount * rowHeight + 20,
      clientesPorProductoCount * rowHeight + 20
    );

    const clientesCellY = margin + titleCellHeight + totalCellHeight + 5;
    const clientesCellWidth = pageWidth / 2 - 5;
    const clientesPorProdCellX = margin + pageWidth / 2 + 5;
    const clientesPorProdCellWidth = pageWidth / 2 - 5;

    // ------------------- CLIENTES RECIENTES -------------------
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

      const lineY = yPosClientesRecientes + 2;
      pdf.setDrawColor(156, 163, 175);
      pdf.line(margin + cellPadding, lineY, margin + clientesCellWidth - cellPadding, lineY);

      yPosClientesRecientes += rowHeight;
    });

    // ------------------- CLIENTES POR PRODUCTO -------------------
    pdf.rect(clientesPorProdCellX, clientesCellY, clientesPorProdCellWidth, dynamicCellHeight, "S");
    pdf.setFontSize(16);
    pdf.text("Clientes por Producto:", clientesPorProdCellX + cellPadding, clientesCellY + 10);
    pdf.setFontSize(12);

    let yPosClientesPorProd = clientesCellY + 20;
    productos.forEach(producto => {
      // Contar clientes usando clienteProductos
      const clientesCount = clienteProductos.filter(cp => cp.producto_id === producto.id).length;

      pdf.text(`- ${producto.nombre}`, clientesPorProdCellX + cellPadding + 2, yPosClientesPorProd);

      const countText = `${clientesCount}`;
      const countTextWidth = pdf.getTextWidth(countText);
      pdf.text(
        countText,
        clientesPorProdCellX + clientesPorProdCellWidth - cellPadding - countTextWidth,
        yPosClientesPorProd
      );

      const lineY = yPosClientesPorProd + 2;
      pdf.setDrawColor(156, 163, 175);
      pdf.line(
        clientesPorProdCellX + cellPadding,
        lineY,
        clientesPorProdCellX + clientesPorProdCellWidth - cellPadding,
        lineY
      );

      yPosClientesPorProd += rowHeight;
    });

// ------------------- GRÁFICA DE BARRAS -------------------
    const graficaCellY = clientesCellY + dynamicCellHeight + 5;
    const graficaCellWidth = pageWidth;
    const graficaCellHeight = 70;
    pdf.rect(margin, graficaCellY, graficaCellWidth, graficaCellHeight, "S");

    pdf.setFontSize(16);
    pdf.text("Distribución de Productos por Cliente", margin + cellPadding, graficaCellY + 10);

    const graficaNode = document.getElementById("grafica-barras");

// Verificar si hay datos antes de capturar la imagen
    if (graficaNode && graficaNode.children.length > 0) {
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

      const imgX = margin + (graficaCellWidth - imgWidth) / 2;
      const imgY = graficaCellY + 15;

      pdf.addImage(dataUrl, "PNG", imgX, imgY, imgWidth, imgHeight);
    } else {
  // Mensaje alternativo si la gráfica está vacía
      pdf.setFontSize(12);
      pdf.text("No hay datos para mostrar", margin + cellPadding, graficaCellY + 40);
    }
    // ------------------- GUARDAR PDF -------------------
    pdf.save("dashboard.pdf");
  } catch (error) {
    console.error("Error generando el PDF:", error);
  }
};
