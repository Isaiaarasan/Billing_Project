
export const printInvoice = (invoice) => {
    const {
        customerName,
        customerMobile,
        customerEmail,
        items,
        totalAmount,
        paymentMode,
        createdAt,
        cashDetails
    } = invoice;

    const date = new Date(createdAt);
    const amountGiven = cashDetails?.amountGiven || 0;
    const change = cashDetails?.change || 0;

    const formatCurrency = (amount) => {
        return amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00";
    }

    const printWindow = window.open('', '', 'width=800,height=600');
    // Basic verification to ensure popup was allowed
    if (!printWindow) {
        alert("Please allow popups to print the invoice.");
        return;
    }

    printWindow.document.write(`
        <html>
        <head>
            <title>Invoice - ${customerName}</title>
            <style>
                body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; }
                .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                .header h1 { margin: 0; color: #4f46e5; }
                .header p { margin: 5px 0; color: #666; }
                .meta { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .meta div { text-align: left; }
                .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                .table th { text-align: left; padding: 12px; border-bottom: 2px solid #eee; color: #666; font-size: 12px; text-transform: uppercase; }
                .table td { padding: 12px; border-bottom: 1px solid #eee; }
                .total-section { text-align: right; }
                .total-row { font-size: 18px; font-weight: bold; margin-top: 10px; }
                .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #999; }
                .badge { background: #eee; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
                @media print {
                    body { padding: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>INVOICE</h1>
                <p>Thank you for shopping with us!</p>
            </div>
            
            <div class="meta">
                <div>
                    <strong>Billed To:</strong><br>
                    ${customerName}<br>
                    ${customerMobile || ''}<br>
                    ${customerEmail || ''}
                </div>
                <div style="text-align: right;">
                    <strong>Invoice Details:</strong><br>
                    Date: ${date.toLocaleDateString()}<br>
                    Time: ${date.toLocaleTimeString()}<br>
                    Mode: <span class="badge">${paymentMode || 'Cash'}</span>
                </div>
            </div>

            <table class="table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Rate</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td style="text-align: center;">${item.qty}</td>
                            <td style="text-align: right;">₹${formatCurrency(item.rate)}</td>
                            <td style="text-align: right;">₹${formatCurrency(item.total)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="total-section">
                <p>Subtotal: ₹${formatCurrency(totalAmount)}</p>
                <div class="total-row">Grand Total: ₹${formatCurrency(totalAmount)}</div>
                ${paymentMode === 'Cash' && amountGiven ? `
                    <p style="margin-top: 10px; font-size: 14px; color: #666;">
                        Cash Given: ₹${formatCurrency(amountGiven)}<br>
                        Change Returned: ₹${formatCurrency(change)}
                    </p>
                ` : ''}
            </div>

            <div class="footer">
                <p>This is a computer generated invoice.</p>
            </div>

            <script>
                window.onload = function() { window.print(); window.close(); }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
};
