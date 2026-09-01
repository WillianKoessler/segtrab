import Section from "../layout/Section.js";

function Strong(children) {
    return { tag: "strong", className: "text-blue-600", children }
}

function Text(children) {
    return { tag: 'p', children }
}

function Semibold(children) {
    return { tag: 'span', className: 'font-semibold', children }
}

export default function SectionLimitacoes(index, id, title) {
    return Section(index, id, title, [
        {
            tag: 'div',
            className: "bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600",
            children: [
                {
                    tag: 'div',
                    className: "space-y-4 text-lg leading-relaxed text-gray-800 text-justify indent-8",
                    children: [
                        Text(["Esta ", Strong("Avaliação Ergonômica Preliminar (AEP)"), " possui caráter ", Strong("inicial e orientativo"), ", sendo realizada conforme as diretrizes da ", Strong("NR-17"), " e integrada ao processo de Gerenciamento de Riscos Ocupacionais (GRO) previsto na ", Strong("NR-01"), ". Seu objetivo é identificar indícios de fatores de risco psicossociais relacionados ao trabalho e subsidiar o ", Strong(["Programa de Gerenciamento de Riscos (", Semibold("PGR"), ')']), ", contribuindo para a priorização de medidas preventivas e corretivas."]),
                        Text(["A metodologia adotada, baseada no ", Strong("COPSOQ II"), " (versão curta), utiliza instrumento padronizado e cientificamente validado, fundamentado na percepção dos trabalhadores sobre as condições de trabalho. Os resultados refletem a realidade vivenciada no momento da coleta de dados, não se configurando como ", Strong("diagnóstico clínico individual"), ", mas como avaliação das condições organizacionais e dos fatores psicossociais presentes no ambiente laboral."]),
                        Text(["Ressalta-se que a AEP ", Strong(["não substitui a Análise Ergonômica do Trabalho (", Semibold("AET"), ')']), ", a qual possui caráter aprofundado e investigativo. Conforme a NR-17, a AET deve ser realizada quando forem identificados riscos relevantes, situações críticas ou necessidade de análise detalhada das atividades, incluindo observações em campo, entrevistas e avaliação das condições reais de trabalho."]),
                        Text(["De acordo com o ", Strong("Guia de Fatores de Riscos Psicossociais do MTE"), ", a avaliação preliminar deve ser entendida como parte de um processo contínuo de identificação, avaliação e controle dos riscos, não encerrando o ciclo do GRO, mas servindo como base para o monitoramento e melhoria contínua das condições de trabalho."]),
                        Text(["Além disso, os resultados podem sofrer variações ao longo do tempo, em função de mudanças organizacionais, operacionais ou de gestão, sendo recomendada a ", Strong("reaplicação periódica"), " do instrumento para garantir a atualização dos dados e a efetividade das ações implementadas."]),
                        Text(["Por fim, destaca-se que a participação dos trabalhadores é ", Strong("voluntária, anônima e confidencial"), ". Ainda que se busque representatividade da amostra, podem existir limitações inerentes a instrumentos baseados em percepção, tais como interpretações individuais das questões, nível de engajamento e fatores contextuais não captados no momento da avaliação, reforçando a necessidade de utilização da ", Strong("AEP como ferramenta de triagem e priorização dentro do sistema de gestão de SST"), ", e não como avaliação conclusiva."]),
                    ]
                }
            ]
        }
    ]);
}

