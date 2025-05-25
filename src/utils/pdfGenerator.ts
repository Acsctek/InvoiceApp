import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice, Client, CompanyInfo } from '../types';
import { formatCurrency, formatDate } from './helpers';
import { getProductById, getClientById, getCompanyInfo } from './storage';

export const generateInvoicePDF = (invoice: Invoice): void => {
  const client = getClientById(invoice.clientId);
  const company = getCompanyInfo();
  
  if (!client) {
    console.error('Client not found');
    return;
  }

  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Invoice-${invoice.invoiceNumber}`,
    author: company.name,
    subject: 'Invoice',
    keywords: 'invoice, billing',
  });

  // Add company info
  addCompanyInfo(doc, company);
  
  // Add invoice info
  addInvoiceInfo(doc, invoice, client);
  
  // Add invoice items
  addInvoiceItems(doc, invoice);
  
  // Add notes
  if (invoice.notes) {
    doc.setFontSize(10);
    doc.text('Notes:', 14, doc.lastAutoTable.finalY + 20);
    doc.setFontSize(9);
    const splitNotes = doc.splitTextToSize(invoice.notes, 180);
    doc.text(splitNotes, 14, doc.lastAutoTable.finalY + 25);
  }
  
  // Add footer
  addFooter(doc, company);
  
  // Save the PDF
  doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
};

const addCompanyInfo = (doc: jsPDF, company: CompanyInfo): void => {
  doc.setFontSize(20);
  doc.setTextColor(40, 64, 175); // Primary-800
  doc.text(company.name, 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(company.address, 14, 27);
  doc.text(company.phone, 14, 32);
  doc.text(company.email, 14, 37);
  
  // Add logo placeholder or actual logo
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(140, 15, 55, 25, 3, 3, 'FD');
  doc.setFontSize(12);
  doc.setTextColor(150);
  doc.text('INVOICE', 157, 30);
};

const addInvoiceInfo = (doc: jsPDF, invoice: Invoice, client: Client): void => {
  // Add status label
  const statusColors: Record<string, [number, number, number]> = {
    'draft': [100, 116, 139], // gray-500
    'pending': [234, 88, 12], // amber-500
    'paid': [34, 197, 94],    // green-500
    'overdue': [239, 68, 68], // red-500
  };
  
  const statusColor = statusColors[invoice.status] || statusColors.draft;
  
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(14, 45, 35, 10, 2, 2, 'F');
  doc.setTextColor(255);
  doc.setFontSize(8);
  doc.text(invoice.status.toUpperCase(), 19, 51);
  
  // Add invoice details
  doc.setTextColor(50);
  doc.setFontSize(12);
  doc.text('Invoice Number:', 14, 65);
  doc.text(invoice.invoiceNumber, 70, 65);
  
  doc.text('Issue Date:', 14, 72);
  doc.text(formatDate(invoice.issueDate), 70, 72);
  
  doc.text('Due Date:', 14, 79);
  doc.text(formatDate(invoice.dueDate), 70, 79);
  
  // Add client info in a box
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(140, 50, 55, 35, 3, 3, 'FD');
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Bill To:', 145, 58);
  
  doc.setTextColor(50);
  doc.setFontSize(11);
  doc.text(client.name, 145, 65);
  if (client.company) {
    doc.text(client.company, 145, 71);
    doc.setFontSize(9);
    doc.text(client.address, 145, 77);
  } else {
    doc.setFontSize(9);
    doc.text(client.address, 145, 71);
  }
  doc.text(client.email, 145, 83);
};

const addInvoiceItems = (doc: jsPDF, invoice: Invoice): void => {
  const tableHeaders = [['Item', 'Description', 'Qty', 'Price', 'Total']];
  
  const tableRows = invoice.items.map((item) => [
    getProductById(item.productId)?.name || '',
    item.description,
    item.quantity.toString(),
    formatCurrency(item.price),
    formatCurrency(item.total),
  ]);
  
  // Add invoice items table
  autoTable(doc, {
    startY: 95,
    head: tableHeaders,
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 64, 175], // Primary-800
      textColor: 255,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 60 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    },
  });
  
  // Add summary
  const summaryData = [
    ['Subtotal', formatCurrency(invoice.subtotal)],
    ['Tax (' + invoice.tax + '%)', formatCurrency(invoice.taxAmount)],
    ['Discount (' + invoice.discount + '%)', formatCurrency(invoice.discountAmount)],
    ['Total Due', formatCurrency(invoice.total)],
  ];
  
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    body: summaryData,
    theme: 'plain',
    tableWidth: 80,
    margin: { left: 115 },
    styles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 40, halign: 'right' },
    },
    didDrawCell: (data) => {
      // Add highlight for total row
      if (data.row.index === 3) {
        doc.setFillColor(240, 249, 255); // Light blue background
        doc.setDrawColor(30, 64, 175); // Primary border
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'FD');
        
        // Redraw text since it was covered by the rectangle
        doc.setTextColor(30, 64, 175);
        doc.setFontSize(10);
        // Convert cell text to string before calculating width
        const cellText = String(data.cell.text);
        doc.text(
          cellText,
          data.cell.x + (data.cell.width - doc.getTextWidth(cellText)) - 5,
          data.cell.y + data.cell.height / 2 + 3
        );
      }
    },
  });
};

const addFooter = (doc: jsPDF, company: CompanyInfo): void => {
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setDrawColor(220, 220, 220);
  doc.line(14, pageHeight - 25, 196, pageHeight - 25);
  
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text('Thank you for your business', 14, pageHeight - 18);
  
  if (company.website) {
    doc.text(company.website, 14, pageHeight - 13);
  }
  
  doc.text('Page 1 of 1', 196, pageHeight - 13, { align: 'right' });
};