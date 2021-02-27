export const Nota = {
    name: "Nota",
    primaryKey: "notaId",
    properties: {
        notaId: "string",
        name: "string",
        total: "string",
        timestamp: "date",
        items: "Item[]"
    }
};

export const Item = {
    name: "Item",
    primaryKey: "itemId",
    properties: {
        itemId: "string",
        name: "string",
        unit: "string",
        price: "double",
        quantity: "double",
        total: "double",
        timestamp: "date"
    }
};

export const Stock = {
    name: "Stock",
    primaryKey: "stockId",
    properties: {
        stockId: "string",
        name: "string",
        unit: "string",
        price: "double",
        timestamp: "date"
    }
};