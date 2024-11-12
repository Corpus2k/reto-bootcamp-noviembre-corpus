document.getElementById('scraping').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "scrapeData" }, (response) => {
            if (response && response.success) {
                chrome.storage.local.get("productos", (result) => {
                    const productos = result.productos || [];
                    mostrarProductos(productos);
                });
            }
        });
    });
});

// descarga
document.getElementById('downloadBtn').addEventListener('click', () => {
    chrome.storage.local.get("productos", (result) => {
        const productos = result.productos || [];
        const jsonString = JSON.stringify(productos, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "productos.json";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        URL.revokeObjectURL(url); 
    });
});

function mostrarProductos(productos) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    productos.forEach((productoGrupo) => {
        const titleElement = document.createElement('h3');
        titleElement.className = 'product-section-title';
        titleElement.textContent = productoGrupo.titleList;
        container.appendChild(titleElement);

        productoGrupo.productos.forEach((producto) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            const imgElement = document.createElement('img');
            imgElement.src = producto.img;
            imgElement.alt = producto.name;
            imgElement.className = 'product-image';

            const marcaElement = document.createElement('p');
            marcaElement.textContent = `Marca: ${producto.marca}`;

            const nameElement = document.createElement('p');
            nameElement.textContent = `Nombre: ${producto.name}`;

            const priceElement = document.createElement('p');
            priceElement.className = 'price';
            priceElement.textContent = `Precio: S/ ${producto.price}`;

            const distribuidorElement = document.createElement('p');
            distribuidorElement.textContent = `Distribuidor: ${producto.distribuidor}`;

            productCard.appendChild(imgElement);
            productCard.appendChild(marcaElement);
            productCard.appendChild(nameElement);
            productCard.appendChild(priceElement);
            productCard.appendChild(distribuidorElement);

            container.appendChild(productCard);
        });
    });
}
