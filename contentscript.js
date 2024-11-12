
const scrapData = () =>{


    const datasetItem = Array.from(document.querySelectorAll('.ga-product-list'));
    const productos = datasetItem.map((data) => {
        const titleList = data.dataset.gaListName;
    
        const item = Array.from(data.querySelectorAll('.ga-product-item'));
        const productosItem = item.map((data) => {
            const figure = data.querySelector('.Showcase__photo');
            const img = figure.querySelector('.showcase__image').src;
    
            const marca = data.dataset.gaBrand;
            const name = data.dataset.gaName;
            const price = data.dataset.gaPrice;
            const distribuidor = data.dataset.gaSeller;
            return {
                marca,
                name,
                price: parseFloat(price),
                distribuidor,
                img
            };
        });
    
        return {
            titleList,
            productos: productosItem
        };
    });
    
    console.log(productos);
    

        // const datasetItem = Array.from(document.querySelectorAll('.ga-product-item'));
        // const productos = datasetItem.map((data) => {
        //     const figure = data.querySelector('.Showcase__photo');
        //     const img = figure.querySelector('.showcase__image').src;

        //     const marca = data.dataset.gaBrand;
        //     const name = data.dataset.gaName;
        //     const price = data.dataset.gaPrice;
        //     const distribuidor = data.dataset.gaSeller;
        //     return {
        //         marca,
        //         name,
        //         price: parseFloat(price),
        //         distribuidor,
        //         img
        //     };
        // });

    return productos;
}

const scrapAllpages = () => {
    let allProducts = [];

    const totalPagesElement = document.querySelector('.pagination__nav .page-number:last-child');
    const totalPages = totalPagesElement ? parseInt(totalPagesElement.textContent.trim()) : 1;
    let pagActual = 1;
    
    const scrapNextPages = () => {
        const productsPag = scrapData();
        allProducts = allProducts.concat(productsPag);


        pagActual++;
        if (pagActual <= totalPages) {
            const nextPageButton = document.querySelector(`.pagination__item.page-number:nth-child(${pagActual + 1})`);
            if (nextPageButton) {
                nextPageButton.click();

                setTimeout(scrapNextPages, 3000);
            } else {
                endScraping();
                // console.warn("no hay siguiente paguina");
            }
        } else {
            endScraping();
        }
    }

    function endScraping() {
        chrome.runtime.sendMessage({ type: "SAVE_DATA", productos: allProducts });
        //console.log("total de productos:", allProducts.length);
    }

    scrapNextPages();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrapeData") {
        scrapAllpages();
        sendResponse({ success: true });
    }
});
