import Section from "../layout/Section.js";

function Text(text) {
    return {
        tag: 'div',
        className: "text-base text-gray-800 text-justify indent-8 mb-4",
        style: "text-align: justify; text-indent: 2em;",
        children: text
    }
}

function MatrizDeRisco() {
    return [
        {
            tag: "div",
            className: "print-safe-block print-wide-table-container overflow-x-auto print:overflow-visible mb-8",
            children: {
                tag: "table",
                className: "w-full border-collapse border border-gray-700 text-sm",
                children: [
                    {
                        tag: "thead",
                        children: [
                            {
                                tag: "tr",
                                children: [
                                    {
                                        tag: "td",
                                        colSpan: "2",
                                        rowSpan: "2",
                                        className: "border border-gray-700 bg-blue-600 px-3 py-2 font-bold text-center text-white align-middle",
                                        style: "width: 28%;",
                                        children: [
                                            "MATRIZ DE RISCOS 5X5 ",
                                            { tag: "br" },
                                            "METODOLOGIA AIHA "
                                        ]
                                    },
                                    {
                                        tag: "td",
                                        colSpan: "5",
                                        className: "border border-gray-700 bg-blue-600 px-3 py-2 font-bold text-center text-white",
                                        children: "SEVERIDADE"
                                    },
                                    {
                                        tag: "td",
                                        rowSpan: "2",
                                        className: "border border-gray-700 bg-blue-600 px-3 py-2 font-bold text-center text-white align-middle",
                                        style: "width: 13%;",
                                        children: [
                                            "LEGENDA DO ",
                                            { tag: "br" },
                                            "NÍVEL DE RISCO "
                                        ]
                                    }
                                ]
                            },
                            {
                                tag: "tr",
                                children: [
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-blue-500 px-2 py-2 font-bold text-center text-white",
                                        children: [
                                            "LEVE ",
                                            {
                                                tag: "br"
                                            },
                                            {
                                                tag: "span",
                                                children: "1"
                                            }
                                        ]
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-blue-500 px-2 py-2 font-bold text-center text-white",
                                        children: [
                                            "BAIXO ",
                                            {
                                                tag: "br"
                                            },
                                            {
                                                tag: "span",
                                                children: "2"
                                            }
                                        ]
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-blue-500 px-2 py-2 font-bold text-center text-white",
                                        children: [
                                            "MODERADO ",
                                            {
                                                tag: "br"
                                            },
                                            {
                                                tag: "span",
                                                children: "3"
                                            }
                                        ]
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-blue-500 px-2 py-2 font-bold text-center text-white",
                                        children: [
                                            "ALTO ",
                                            {
                                                tag: "br"
                                            },
                                            {
                                                tag: "span",
                                                children: "4"
                                            }
                                        ]
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-blue-500 px-2 py-2 font-bold text-center text-white",
                                        children: [
                                            "EXTREMO ",
                                            {
                                                tag: "br"
                                            },
                                            {
                                                tag: "span",
                                                children: "5"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag: "tbody",
                        children: [
                            {
                                tag: "tr",
                                children: [
                                    {
                                        tag: "td",
                                        rowSpan: "5",
                                        className: "border border-gray-700 bg-blue-600 px-3 py-2 font-bold text-center text-white align-middle",
                                        children: "PROBABILIDADE"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-blue-50 px-2 py-2 text-center text-blue-800 font-semibold",
                                        children: [
                                            "MUITO PROVÁVEL ",
                                            {
                                                tag: "br"
                                            },
                                            {
                                                tag: "span",
                                                className: "font-bold",
                                                children: "5"
                                            }
                                        ]
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-green-400 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-yellow-300 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-orange-400 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-red-500 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-red-500 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-sky-200 px-2 py-3 text-center font-bold text-sky-800 align-middle",
                                        children: [
                                            "TRIVIAL ",
                                            {
                                                tag: "br"
                                            },
                                            {
                                                tag: "span",
                                                className: "text-xs font-normal",
                                                children: "1 - 3"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag: "tr",
                                children: [
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-blue-50 px-2 py-2 text-center text-blue-800 font-semibold",
                                        children: [
                                            "PROVÁVEL ",
                                            {
                                                tag: "br"
                                            },
                                            {
                                                tag: "span",
                                                className: "font-bold",
                                                children: "4"
                                            }
                                        ]
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-green-400 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-green-400 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-yellow-300 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-orange-400 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-red-500 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-green-200 px-2 py-3 text-center font-bold text-green-800 align-middle",
                                        children: [
                                            "TOLERÁVEL ",
                                            {
                                                tag: "br"
                                            },
                                            {
                                                tag: "span",
                                                className: "text-xs font-normal",
                                                children: "3 - 8"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag: "tr",
                                children: [
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-blue-50 px-2 py-2 text-center text-blue-800 font-semibold",
                                        children: [
                                            "POSSÍVEL ",
                                            {
                                                tag: "br"
                                            },
                                            {
                                                tag: "span",
                                                className: "font-bold",
                                                children: "3"
                                            }
                                        ]
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-sky-200 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-green-400 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-yellow-300 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-orange-400 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-red-500 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-yellow-200 px-2 py-3 text-center font-bold text-yellow-800 align-middle",
                                        children: [
                                            "MODERADO ",
                                            {
                                                tag: "br"
                                            },
                                            {
                                                tag: "span",
                                                className: "text-xs font-normal",
                                                children: "4 - 12"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag: "tr",
                                children: [
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-blue-50 px-2 py-2 text-center text-blue-800 font-semibold",
                                        children: [
                                            "POUCO PROVÁVEL ",
                                            {
                                                tag: "br"
                                            },
                                            {
                                                tag: "span",
                                                className: "font-bold",
                                                children: "2"
                                            }
                                        ]
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-sky-200 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-green-400 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-yellow-300 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-yellow-300 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-orange-400 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-orange-200 px-2 py-3 text-center font-bold text-orange-800 align-middle",
                                        children: [
                                            "SUBSTANCIAL ",
                                            {
                                                tag: "br"
                                            },
                                            {
                                                tag: "span",
                                                className: "text-xs font-normal",
                                                children: "10 - 16"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag: "tr",
                                children: [
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-blue-50 px-2 py-2 text-center text-blue-800 font-semibold",
                                        children: [
                                            "RARA ",
                                            {
                                                tag: "br"
                                            },
                                            {
                                                tag: "span",
                                                className: "font-bold",
                                                children: "1"
                                            }
                                        ]
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-sky-200 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-sky-200 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-green-400 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-yellow-300 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-yellow-300 px-2 py-3"
                                    },
                                    {
                                        tag: "td",
                                        className: "border border-gray-700 bg-red-200 px-2 py-3 text-center font-bold text-red-800 align-middle",
                                        children: [
                                            "INTOLERÁVEL ",
                                            {
                                                tag: "br"
                                            },
                                            {
                                                tag: "span",
                                                className: "text-xs font-normal",
                                                children: "15 - 25"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        {
            tag: "div",
            className: "print-safe-block mb-8",
            children: [
                {
                    tag: "h3",
                    className: "text-lg font-bold text-gray-900 mb-4",
                    children: "Probabilidade"
                },
                {
                    tag: "p",
                    className: "text-base text-gray-800 text-justify mb-4",
                    style: "text-align: justify;",
                    children: "A probabilidade representa a chance de o problema ocorrer ou estar presente no ambiente de trabalho."
                },
                {
                    tag: "table",
                    className: "w-full border-collapse border border-gray-300 text-sm",
                    children: [
                        {
                            tag: "thead",
                            children: {
                                tag: "tr",
                                className: "bg-blue-600 text-white",
                                children: [
                                    {
                                        tag: "th",
                                        className: "border border-gray-300 px-4 py-2 text-left",
                                        children: "%"
                                    },
                                    {
                                        tag: "th",
                                        className: "border border-gray-300 px-4 py-2 text-left",
                                        children: "Interpretação"
                                    },
                                    {
                                        tag: "th",
                                        className: "border border-gray-300 px-4 py-2 text-center",
                                        children: "Probabilidade"
                                    }
                                ]
                            }
                        },
                        {
                            tag: "tbody",
                            children: [
                                {
                                    tag: "tr",
                                    className: "bg-green-50",
                                    children: [
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2",
                                            children: "<40%"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2",
                                            children: "ambiente muito saudável"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2 text-center font-bold",
                                            children: "1"
                                        }
                                    ]
                                },
                                {
                                    tag: "tr",
                                    className: "bg-green-100",
                                    children: [
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2",
                                            children: "40-59%"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2",
                                            children: "boa condição"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2 text-center font-bold",
                                            children: "2"
                                        }
                                    ]
                                },
                                {
                                    tag: "tr",
                                    className: "bg-yellow-50",
                                    children: [
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2",
                                            children: "60-74%"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2",
                                            children: "atenção"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2 text-center font-bold",
                                            children: "3"
                                        }
                                    ]
                                },
                                {
                                    tag: "tr",
                                    className: "bg-orange-50",
                                    children: [
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2",
                                            children: "75-89%"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2",
                                            children: "problema frequente"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2 text-center font-bold",
                                            children: "4"
                                        }
                                    ]
                                },
                                {
                                    tag: "tr",
                                    className: "bg-red-50",
                                    children: [
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2",
                                            children: "90-100%"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2",
                                            children: "problema crítico"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2 text-center font-bold",
                                            children: "5"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            tag: "div",
            className: "print-safe-block mb-8",
            children: [
                {
                    tag: "h3",
                    className: "text-lg font-bold text-gray-900 mb-4",
                    children: "Severidade"
                },
                {
                    tag: "p",
                    className: "text-base text-gray-800 text-justify mb-4",
                    style: "text-align: justify;",
                    children: "A severidade representa o impacto do risco na saúde do trabalhador caso ele ocorra."
                },
                {
                    tag: "table",
                    className: "w-full border-collapse border border-gray-300 text-sm",
                    children: [
                        {
                            tag: "thead",
                            children: {
                                tag: "tr",
                                className: "bg-blue-600 text-white",
                                children: [
                                    {
                                        tag: "th",
                                        className: "border border-gray-300 px-4 py-2 text-center",
                                        children: "Severidade"
                                    },
                                    {
                                        tag: "th",
                                        className: "border border-gray-300 px-4 py-2 text-left",
                                        children: "Impacto"
                                    }
                                ]
                            }
                        },
                        {
                            tag: "tbody",
                            children: [
                                {
                                    tag: "tr",
                                    className: "bg-green-50",
                                    children: [
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2 text-center font-bold",
                                            children: "1"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2",
                                            children: "desconforto leve"
                                        }
                                    ]
                                },
                                {
                                    tag: "tr",
                                    className: "bg-green-100",
                                    children: [
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2 text-center font-bold",
                                            children: "2"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2",
                                            children: "fadiga mental leve"
                                        }
                                    ]
                                },
                                {
                                    tag: "tr",
                                    className: "bg-yellow-50",
                                    children: [
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2 text-center font-bold",
                                            children: "3"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2",
                                            children: "estresse ocupacional"
                                        }
                                    ]
                                },
                                {
                                    tag: "tr",
                                    className: "bg-orange-50",
                                    children: [
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2 text-center font-bold",
                                            children: "4"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2",
                                            children: "transtornos psicológicos"
                                        }
                                    ]
                                },
                                {
                                    tag: "tr",
                                    className: "bg-red-50",
                                    children: [
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2 text-center font-bold",
                                            children: "5"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-300 px-4 py-2",
                                            children: "adoecimento grave"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            tag: "div",
            className: "print-safe-block mb-8",
            children: [
                {
                    tag: "h4",
                    className: "text-base font-bold text-gray-900 mb-2",
                    children: "Métodos de Controle e Ação"
                },
                {
                    tag: "p",
                    className: "text-sm text-gray-700 mb-4",
                    style: "text-align: justify;",
                    children: "Os métodos de controle devem ser definidos de acordo com o nível de risco identificado na avaliação. A priorização das ações segue a hierarquia de criticidade estabelecida pela matriz de risco."
                },
                {
                    tag: "table",
                    className: "w-full border-collapse border border-gray-700 text-sm",
                    children: [
                        {
                            tag: "thead",
                            children: {
                                tag: "tr",
                                children: [
                                    {
                                        tag: "th",
                                        className: "border border-gray-700 bg-gray-200 px-4 py-2 text-center font-bold text-gray-900 w-1/3",
                                        children: [
                                            "NÍVEIS DE RISCOS ",
                                            {
                                                tag: "br"
                                            },
                                            "(ORDEM DE PRIORIDADE) "
                                        ]
                                    },
                                    {
                                        tag: "th",
                                        className: "border border-gray-700 bg-gray-200 px-4 py-2 text-center font-bold text-gray-900",
                                        children: "CONTROLE DE AÇÕES"
                                    }
                                ]
                            }
                        },
                        {
                            tag: "tbody",
                            children: [
                                {
                                    tag: "tr",
                                    className: "bg-red-100",
                                    children: [
                                        {
                                            tag: "td",
                                            className: "border border-gray-700 px-4 py-2 font-bold text-red-700",
                                            children: "1º INTOLERÁVEL"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-700 px-4 py-2",
                                            children: "Ações imediatas"
                                        }
                                    ]
                                },
                                {
                                    tag: "tr",
                                    className: "bg-orange-100",
                                    children: [
                                        {
                                            tag: "td",
                                            className: "border border-gray-700 px-4 py-2 font-bold text-orange-700",
                                            children: "2º SUBSTANCIAL"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-700 px-4 py-2",
                                            children: "Controle necessário"
                                        }
                                    ]
                                },
                                {
                                    tag: "tr",
                                    className: "bg-yellow-100",
                                    children: [
                                        {
                                            tag: "td",
                                            className: "border border-gray-700 px-4 py-2 font-bold text-yellow-700",
                                            children: "3º MODERADO"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-700 px-4 py-2",
                                            children: "Controle adicional, se possível / viável"
                                        }
                                    ]
                                },
                                {
                                    tag: "tr",
                                    className: "bg-green-100",
                                    children: [
                                        {
                                            tag: "td",
                                            className: "border border-gray-700 px-4 py-2 font-bold text-green-700",
                                            children: "4º TOLERÁVEL"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-700 px-4 py-2",
                                            children: "Nenhum controle adicional necessário"
                                        }
                                    ]
                                },
                                {
                                    tag: "tr",
                                    className: "bg-sky-100",
                                    children: [
                                        {
                                            tag: "td",
                                            className: "border border-gray-700 px-4 py-2 font-bold text-sky-700",
                                            children: "5º TRIVIAL"
                                        },
                                        {
                                            tag: "td",
                                            className: "border border-gray-700 px-4 py-2",
                                            children: "Nenhuma ação necessária"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

export default function SectionClassificacaoEAvaliacaoDosRiscosPsicossociais(index, id, title) {
    return Section(index, id, title, [
        Text("A identificação e avaliação dos fatores de risco psicossociais foram realizadas por meio de Avaliação Ergonômica Preliminar (AEP), utilizando o COPSOQ II - Copenhagen Psychosocial Questionnaire (versão curta), instrumento psicométrico internacionalmente validado, alinhado às diretrizes da NR-01 (Gerenciamento de Riscos Ocupacionais - GRO) e da NR-17 (Ergonomia)."),
        Text("O instrumento possibilita a análise estruturada de domínios organizacionais relacionados às condições de trabalho, incluindo demandas laborais, controle e desenvolvimento, relações interpessoais e liderança, organização do trabalho, conflito trabalho-vida, segurança no emprego e saúde e bem-estar. Esses domínios permitem identificar fatores organizacionais que podem contribuir para o estresse ocupacional e para impactos na saúde e no desempenho dos trabalhadores."),
        Text("Os resultados da avaliação foram obtidos a partir da percepção dos trabalhadores, por meio de questionário estruturado com escala padronizada, sendo posteriormente tratados estatisticamente para geração de indicadores quantitativos por domínio."),
        Text("Para fins de integração ao Inventário de Riscos do PGR, os resultados foram convertidos em níveis de risco, utilizando metodologia qualitativa baseada na matriz 5x5 (Probabilidade x Severidade)."),
        MatrizDeRisco,
    ]
    );
}