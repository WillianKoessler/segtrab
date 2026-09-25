export const masks = {
    cpf: "000.000.000-00",
    cnpj: "00.000.000/0000-00",
    caepf: "000.000.000/000-00",
    cno: "00.000.00000/00",
    cei: "00.000.00000/00",
};

export function cleanDocument(value) {
    return value?.replace(/\D/g, '');
}

export function formatDocument(value, type) {
    const document = cleanDocument(value);

    switch (type?.toLowerCase()) {
        case 'cpf': {
            if(value.length !== 11)
                throw new Error(`Invalid "${type}" number`);
            return document
                .replace(/^(\d{3})(\d)/, "$1.$2")
                .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
                .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
        }
        case 'cnpj': {
            if(value.length !== 14)
                throw new Error(`Invalid "${type}" number`);
            return document
                .replace(/^(\d{2})(\d)/, "$1.$2")
                .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
                .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");
        }
        case 'caepf': {
            if(value.length !== 14)
                throw new Error(`Invalid "${type}" number`);
            return document
                .replace(/^(\d{3})(\d)/, "$1.$2")
                .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
                .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/4")
                .replace(/^(\d{3})\.(\d{3})\.(\d{3})\/(\d{3})(\d)/, "$1.$2.$3/4.$5");
        }
        case 'cno':
        case 'cei': {
            if(value.length !== 12)
                throw new Error(`Invalid "${type}" number`);
            return document
                .replace(/^(\d{2})(\d)/, "$1.$2")
                .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                .replace(/^(\d{2})\.(\d{3})\.(\d{5})(\d)/, "$1.$2.$3/4");
        }
        default:
            throw new Error(`Unknown document type "${type}"`);
    }
}