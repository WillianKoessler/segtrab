import Section from "../layout/Section.js";
import SectionIdentificacao from "./identificacao.js";
import SectionImportanciaDaParticipacao from "./importancia-da-participacao.js";
import SectionLimitacoes from "./limitacoes.js";
import SectionMetodologia from "./metodologia.js";
import SectionObjetivo from "./objetivo.js";
import SectionResponsabilidades from "./responsabilidades.js";
import SectionResultadosGerais from "./resultados-gerais.js";
import SectionClassificacaoEAvaliacaoDosRiscosPsicossociais from "./classificacao-e-avaliacao-dos-riscos.js";
import SectionInventarioDeRiscosOcupacionaisParaOPGR from "./inventario-de-riscos-ocupacionais-para-o-pgr.js";

const SECTIONS_MAP = [
    {
        id: "identificacao",
        name: "Identificação",
        element: SectionIdentificacao
    },
    {
        id: "objetivo",
        name: "Objetivo",
        element: SectionObjetivo
    },
    {
        id: "metodologia",
        name: "Metodologia",
        element: SectionMetodologia
    },
    {
        id: "importância_da_participacao",
        name: "Importância da Participação dos Trabalhadores",
        element: SectionImportanciaDaParticipacao
    },
    {
        id: "resultados_gerais",
        name: "Resultados Gerais",
        element: SectionResultadosGerais
    },
    {
        id: "limitacoes",
        name: "Limitações",
        element: SectionLimitacoes
    },
    {
        id: "responsabilidades",
        name: "Responsabilidades",
        element: SectionResponsabilidades
    },
    {
        id: "classificacao_e_avaliacao_dos_riscos",
        name: "Classificação e Avaliação dos Riscos Psicossociais",
        element: SectionClassificacaoEAvaliacaoDosRiscosPsicossociais
    },
    // {
    //     id: "inventario_de_riscos_ocupacionais_para_o_pgr",
    //     name: "Inventário de Riscos Ocupacionais para o PGR",
    //     element: SectionInventarioDeRiscosOcupacionaisParaOPGR
    // },
];

export default SECTIONS_MAP;