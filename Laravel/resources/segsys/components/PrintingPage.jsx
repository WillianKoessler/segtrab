function printHiddenElement(elementId) {
    // Get the content of your hidden element
    const hiddenElement = document.getElementById(elementId);
    if (!hiddenElement) return;

    // Create a temporary hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    
    document.body.appendChild(iframe);

    // Write the element's content into the iframe
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html>
        <head>
            <title>Print</title>
            <!-- Optional: Include your stylesheets here if needed -->
        </head>
        <body>
            ${hiddenElement.innerHTML}
        </body>
        </html>
    `);
    doc.close();

    // Trigger the print dialog from the iframe context
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Clean up and remove the iframe after printing
    setTimeout(() => {
        document.body.removeChild(iframe);
    }, 1000);
}

export default function PrintingPage() {

}