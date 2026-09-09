/*
 * AEP — Avaliação Ergonômica Preliminar
 * Native React 19 page for the existing SegSys application.
 *
 * Integration: import/use the default export from this file in the existing
 * application router. Authentication remains owned by the host app (Sanctum).
 * The page intentionally contains no alternate app shell, mount point, or auth layer.
 */
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

const cn = (...values) => values.filter(Boolean).join(' ')

const buttonVariants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400',
    ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-400',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
}
const buttonSizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-6 text-base',
    icon: 'h-10 w-10 p-0',
}
function Button({ variant = 'default', size = 'md', className = '', type = 'button', disabled = false, children, ...props }) {
    return <button type={type} disabled={disabled} className={cn('inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', buttonVariants[variant] || buttonVariants.default, buttonSizes[size] || buttonSizes.md, className)} {...props}>{children}</button>
}
function Input({ className = '', label, hint, error, id, type = 'text', ...props }) {
    const inputId = id || props.name
    const input = <input id={inputId} type={type} className={cn('flex h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', error ? 'border-red-500 focus-visible:ring-red-500' : '', className)} {...props} />
    if (!label && !hint && !error) return input
    return <div className="space-y-1.5">{label && <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">{label}</label>}{input}{error ? <p className="text-xs text-red-600">{error}</p> : hint ? <p className="text-xs text-slate-500">{hint}</p> : null}</div>
}
function ProgressBar({ value = 0, max = 100, label, showValue = true, className = '', barClassName = '', trackClassName = '', ...props }) {
    const safeMax = max > 0 ? max : 100
    const percent = Math.min(100, Math.max(0, (Number(value) / safeMax) * 100))
    return <div className={cn('w-full space-y-2', className)}>{(label || showValue) && <div className="flex items-center justify-between gap-3">{label && <span className="text-sm font-medium text-slate-700">{label}</span>}{showValue && <span className="text-sm font-semibold text-slate-500">{Math.round(percent)}%</span>}</div>}<div role="progressbar" aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={Number(value)} className={cn('h-3 w-full overflow-hidden rounded-full bg-slate-200', trackClassName)} {...props}><div className={cn('h-full rounded-full bg-blue-600 transition-[width] duration-300 ease-out', barClassName)} style={{ width: `${percent}%` }} /></div></div>
}
function Card({ className = '', children, ...props }) { return <div className={cn('rounded-2xl border border-slate-200 bg-white shadow-sm', className)} {...props}>{children}</div> }
function CardHeader({ className = '', children, ...props }) { return <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props}>{children}</div> }
function CardTitle({ className = '', children, ...props }) { return <h3 className={cn('text-lg font-semibold tracking-tight text-slate-900', className)} {...props}>{children}</h3> }
function CardDescription({ className = '', children, ...props }) { return <p className={cn('text-sm text-slate-500', className)} {...props}>{children}</p> }
function CardContent({ className = '', children, ...props }) { return <div className={cn('px-6 pb-6 pt-0', className)} {...props}>{children}</div> }
function CardFooter({ className = '', children, ...props }) { return <div className={cn('flex items-center p-6 pt-0', className)} {...props}>{children}</div> }
function Table({ className = '', tableClassName = '', children, ...props }) { return <div className={cn('w-full overflow-x-auto', className)}><table className={cn('w-full caption-bottom border-collapse text-sm', tableClassName)} {...props}>{children}</table></div> }
function TableCaption({ className = '', children, ...props }) { return <caption className={cn('mt-4 text-sm text-slate-500', className)} {...props}>{children}</caption> }
function TableHead({ className = '', children, ...props }) { return <thead className={cn('border-b border-slate-200 bg-slate-50', className)} {...props}>{children}</thead> }
function TableBody({ className = '', children, ...props }) { return <tbody className={cn('divide-y divide-slate-200', className)} {...props}>{children}</tbody> }
function TableRow({ className = '', children, ...props }) { return <tr className={cn('transition-colors hover:bg-slate-50', className)} {...props}>{children}</tr> }
function TableHeadCell({ className = '', children, align = 'center', scope = 'col', ...props }) { return <th scope={scope} className={cn(`px-4 py-3 text-${align} align-middle text-xs font-semibold uppercase tracking-wide text-slate-600`, className)} {...props}>{children}</th> }
function TableCell({ className = '', children, ...props }) { return <td className={cn('px-4 py-3 align-middle text-slate-700', className)} {...props}>{children}</td> }
function SectionHeader({ index, name }) { return <h2 className={index ? 'text-xl sm:text-3xl font-bold text-gray-900 mb-6 border-b-4 border-blue-600 pb-3 scroll-mt-32' : 'text-2xl sm:text-4xl font-bold text-gray-900 mb-8 border-b-4 border-blue-600 pb-4 uppercase'}>{index ? <span className="bg-blue-600 text-white rounded-full w-10 h-10 inline-flex items-center justify-center text-lg font-bold mr-4">{index}</span> : null}{String(name).toUpperCase()}</h2> }
function Section({ index, id, title, children }) { return <section className="mb-12 print:break-after-page" id={id || undefined}><SectionHeader index={index} name={title} />{children}</section> }

// ------------------------- AEP domain state -------------------------
const perguntas = [
    {
        id: 1,
        threshold: 0,
        currentPercent: 0,
        group: "Ergonômico - Organizacionais",
        risco: "Trabalho realizado sem pausas pré-definidas para descanso",
        pergunta: "Você NÃO tem possibilidade de fazer pausas durante o seu dia de trabalho para descansar, beber água ou fazer suas necessidades fisiológicas?",
        acoes: [
            "Criar um protocolo organizacional que determine tempos mínimos de descanso, alinhado às normas de saúde e segurança.",
            "Incentivar micropausas para recuperação física e mental, estimular pausas ativas para alongamento, respiração e relaxamento muscular.",
            "Monitorar cumprimento das pausas e evitar pressões para ignorá-las, criar mecanismos de controle para garantir que as pausas sejam respeitadas.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Promover uma cultura organizacional que valorize o equilíbrio entre produtividade e bem-estar.",
            "Realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
        ]
    },
    {
        id: 2,
        threshold: 10,
        currentPercent: 0,
        group: "Ergonômico - Organizacionais",
        risco: "Necessidade de manter ritmos intensos de trabalho",
        pergunta: "A sua rotina, você precisa manter um ritmo intenso de trabalho, que considere anormal, onde o volume de trabalho é maior que o tempo disponível para realizá-lo e exige de você uma sobrecarga de esforço, seja por pedidos excessivos, atrasos de produção que precisam ser compensados ou algo similar?",
        acoes: [
            "Ajustar demandas para evitar ritmo insustentável.",
            "Identificar se este fator de risco possui relação com ocorrências diversas, como acidentes e afastamentos.",
            "Melhorar distribuição de tarefas para evitar sobrecarga contínua.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Reavaliar o planejamento de tarefas para distribuir as demandas de forma mais equilibrada (de acordo com os níveis de risco ergonômico identificados).",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, alternância de posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
            "Verificar se há uma sobrecarga de trabalho por nº de trabalhadores e propor a contratação de mais trabalhadores para a realização das atividades.",
        ]
    },
    {
        id: 3,
        threshold: 10,
        currentPercent: 0,
        group: "Ergonômico - Organizacionais",
        risco: "Trabalho com necessidade de variação de turnos",
        pergunta: "Você tem que trabalhar em turnos diferentes ao longo da semana? Por exemplo, as vezes pela manhã, as vezes a noite.",
        acoes: [
            "Garantir tempo adequado de descanso entre turnos.",
            "Implementar escalas organizadas e previsíveis.",
            "Monitorar impactos à saúde e fornecer suporte para adaptação.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR - 17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Priorizar o avanço turno (manhã/tarde/noite), respeitando o relógio biológico; por exemplo: é melhor um indivíduo mudar do turno da tarde para a noite do que da noite para a tarde.",
            "Realizar estudos de fadiga e sono (mapear as áreas com maior propensão X consequências), além de disponibilizar dispositivos de alerta; campanhas educativas sobre Higiene do Sono.",
            "Realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, alternância de posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
        ]
    },
    {
        id: 4,
        threshold: 10,
        currentPercent: 0,
        group: "Ergonômico - Organizacionais",
        risco: "Monotonia",
        pergunta: "Você considera seu trabalho monótono? Ou seja, com menos tarefas que você conseguiria atender, tarefas repetitivas e sem necessidade de esforço mental, tempo ocioso ou situação similar.",
        acoes: [
            "Implementar novas atividades e rotinas operacionais, ampliando o escopo de tarefas para evitar a monotonia.",
            "Implementar sistemas que estimulem maior movimentação; como, por exemplo, sistemas de identificação de ronda.",
            "Implementar treinamento para novas habilidades.",
            "Introduzir variação nas atividades sempre que possível.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR - 17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Realizar estudos de fadiga e sono (mapear as áreas com maior propensão X consequências), além de disponibilizar dispositivos de alerta; campanhas educativas sobre Higiene do Sono.",
            "Realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17; incentivar pausas ativas e práticas de engajamento no trabalho.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, alternância de posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
        ]
    },
    {
        id: 5,
        threshold: 10,
        currentPercent: 0,
        group: "Ergonômico - Organizacionais",
        risco: "Trabalho noturno",
        pergunta: "Você trabalha em turno noturno (das 22h as 5h)?",
        acoes: [
            "Disponibilizar iluminação adequada e ambiente confortável para repouso nos intervalos.",
            "Garantir pausas adequadas e condições ergonômicas, realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Implementar orientações sobre hábitos saudáveis de sono e alimentação.",
            "Oferecer suporte para adaptação ao ciclo biológico e recuperação do sono.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Priorizar o avanço turno (manhã/tarde/noite), respeitando o relógio biológico.",
            "Realizar estudos de fadiga e sono (mapear as áreas com maior propensão X consequências), além de disponibilizar dispositivos de alerta; campanhas educativas sobre Higiene do Sono.",
            "Reduzir a carga horária para minimizar impactos à saúde.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, alternância de posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
        ]
    },
    {
        id: 6,
        threshold: 10,
        currentPercent: 0,
        group: "Ergonômico - Organizacionais",
        risco: "Trabalho com utilização rigorosa de metas de produção",
        pergunta: "Suas tarefas são determinadas por metas de produção fixas e rigorosas?",
        acoes: [
            "Adaptar demandas ao nível de qualificação da equipe e promover capacitação contínua.",
            "Estruturar um programa de capacitação e treinamentos recorrentes com meios de avaliação de desempenho, aprendizagem e evolução do trabalhador.",
            "Garantir boa integração, suporte técnico e mentoria para novos trabalhadores.",
            "Implementar treinamentos frequentes e específicos para cada função.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Realizar treinamentos específicos e periódicos relacionados às atividades desempenhadas.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
        ]
    },
    {
        id: 7,
        threshold: 10,
        currentPercent: 0,
        group: "Ergonômico - Organizacionais",
        risco: "Trabalho remunerado por produção",
        pergunta: "A sua remuneração está diretamente ligada à quantidade de trabalho produzido? Ou seja, quanto mais você produzir, mais dinheiro ganha?",
        acoes: [
            "Apoio psicológico e treinamento, oferecendo suporte psicológico e ações de saúde e bem-estar e promovendo uma cultura que valorize a vida pessoal.",
            "Capacitar trabalhadores e líderes para gerenciar estresse.",
            "Criar ambiente de escuta e feedback construtivo, com lideranças mais humanizadas, evitando assédio moral e cobranças abusivas.",
            "Envolver trabalhadores na definição de metas.",
            "Estimular reconhecimento e engajamento, valorizando qualidade, não apenas números.",
            "Garantir pausas estratégicas e jornada adequada, monitorando a carga de trabalho e prevenindo esgotamento; realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-",
            "Implantar gestão realista de metas, ajustando metas à capacidade produtiva real das pessoas, evitando sobrecarga e cobranças excessivas.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
        ]
    },
    {
        id: 8,
        threshold: 30,
        currentPercent: 0,
        group: "Ergonômico - Organizacionais",
        risco: "Cadência do trabalho imposta por um equipamento",
        pergunta: "O ritmo do seu trabalho é controlado por um equipamento ou máquina? (esteira, nória, bateladas ou algo similar)",
        acoes: [
            "Evitar pagamentos que incentivem ritmo insustentável.",
            "Garantir pausas e revisar impacto da remuneração no bem-estar, realizando pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Oferecer suporte para produtividade sem sobrecarga.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Revisar periodicamente os critérios de produção para manter equidade, principalmente em períodos de baixa produtividade (ex.: sazonalidades / safra / entressafra).",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
        ]
    },
    {
        id: 9,
        threshold: 0,
        currentPercent: 0,
        group: "Ergonômico - Organizacionais",
        risco: "Desequilíbrio entre tempo de trabalho e tempo de repouso",
        pergunta: "Você costuma realizar muitas demandas durante o dia, de forma frequente e ao mesmo que exigem muita atenção, que tenham muitos detalhes?",
        acoes: [
            "Ajustar ritmo de produção para evitar fadiga.",
            "Implantar plano de inspeção e manutenção, realizando manutenções preventivas para evitar falhas e desgastes no ritmo do equipamento.",
            "Melhorar ergonomia biomecânica.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
        ]
    },
    {
        id: 10,
        threshold: 30,
        currentPercent: 0,
        group: "Ergonômico - Organizacionais",
        risco: "Insuficiência de capacitação para execução da tarefa",
        pergunta: "Você já sentiu que faltam treinamentos, orientações ou preparo adequado para executar suas atividades com segurança e confiança?",
        acoes: [
            "Garantir pausas adequadas e tempo suficiente para descanso, realizando pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Monitorar jornada de trabalho e evitar horas extras excessivas.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Promover programas de gestão de tempo e organização de atividades.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
        ]
    },
    {
        id: 11,
        threshold: 0,
        currentPercent: 0,
        group: "Ergonômico - Psicossociais/Cognitivos",
        risco: "Insatisfação no trabalho",
        pergunta: "Você se sente desmotivado(a) ou insatisfeito(a) com suas atividades, ambiente ou condições de trabalho com frequência?",
        acoes: [
            "Capacitar trabalhadores para técnicas de preservação da voz.",
            "Disponibilizar equipamentos que reduzam esforço vocal (microfones, amplificadores).",
            "Incentivar pausas vocais e hidratação.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
        ]
    },
    {
        id: 12,
        threshold: 0,
        currentPercent: 0,
        group: "Ergonômico - Organizacionais",
        risco: "Trabalho com sobrecarga vocal",
        pergunta: "O seu trabalho exige o uso excessivo ou intenso da sua voz? Fala a maior parte do tempo em volume superior a conversação normal.",
        acoes: [
            "Criar ambientes organizacionais que minimizem cobranças abusivas.",
            "Criar programas de saúde mental, bem-estar e assistência psicossocial com apoio de profissionais especializados, disponibilizando suporte psicológico e promovendo bem-estar.",
            "Estabelecer canais de comunicação para relatar e gerenciar situações estressantes.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Promover práticas de bem-estar como Ginástica Laboral, meditações, etc.",
            "Realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
            "Treinar equipes em gerenciamento de estresse.",
        ]
    },
    {
        id: 13,
        threshold: 10,
        currentPercent: 0,
        group: "Ergonômico - Psicossociais/Cognitivos",
        risco: "Excesso de situações de estresse",
        pergunta: "No trabalho você passa por situações frequentes e excessivas de estresse? Neste caso, não consideramos situações de tensão normais do dia a dia, mas situações frequentes de desrespeito onde não haja possibilidade de se defender, pressão psicológica, ameaças ou algo similar que cause tensão constante.",
        acoes: [
            "Criar ambientes organizacionais que minimizem cobranças abusivas.",
            "Criar programas de saúde mental, bem-estar e assistência psicossocial com apoio de profissionais especializados, disponibilizando suporte psicológico e promovendo bem-estar.",
            "Estabelecer canais de comunicação para relatar e gerenciar situações estressantes.",
            "Implementar pausas estratégicas para recuperação cognitiva, realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Oferecer suporte e equilíbrio entre demandas.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Promover práticas de bem-estar como Ginástica Laboral, meditações, etc.",
            "Reduzir multitarefas e definir prioridades claras.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
            "Treinar equipes em gerenciamento de estresse.",
        ]
    },
    {
        id: 14,
        threshold: 50,
        currentPercent: 0,
        group: "Ergonômico - Psicossociais/Cognitivos",
        risco: "Exigência de alto nível de concentração, atenção e memória",
        pergunta: "Você sente que, no dia a dia, a quantidade de informações, tarefas e decisões no trabalho tem sido excessiva e constante? Essa sobrecarga pode estar afetando seu foco, sua produtividade e até mesmo a forma como se relaciona com as pessoas ao seu redor.",
        acoes: [
            "Alternar tarefas intensivas com atividades menos exigentes, promover rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
            "Disponibilizar iluminação adequada e ambiente confortável para repouso nos intervalos.",
            "Implantar testes de fadiga antes da jornada de trabalho.",
            "Implementar pausas e estratégias para melhoria do foco, realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Reduzir distrações e otimizar o ambiente de trabalho.",
        ]
    },
    {
        id: 15,
        threshold: 50,
        currentPercent: 0,
        group: "Ergonômico - Psicossociais/Cognitivos",
        risco: "Situações de sobrecarga de trabalho mental",
        pergunta: "Seu trabalho demanda um nível frequente e excessivo de atenção e concentração, onde um erro pode gerar consequências graves?",
        acoes: [
            "Criar protocolos claros para evitar falhas.",
            "Implementar treinamentos em comunicação eficaz.",
            "Melhorar ferramentas e canais de comunicação.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
        ]
    },
    {
        id: 16,
        threshold: 30,
        currentPercent: 0,
        group: "Ergonômico - Psicossociais/Cognitivos",
        risco: "Trabalho em condições de difícil comunicação",
        pergunta: "Você possui dificuldade em se comunicar com outras pessoas no seu trabalho devido ao ambiente, ruído, isolamento, meios de comunicação insuficientes ou alguma outra condição?",
        acoes: [
            "Estabelecer processos claros para mediação de conflitos.",
            "Implementar canais anônimos para reportar conflitos, criar canais de ouvidoria para resolução de problemas.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Promover treinamentos sobre liderança, mediação de conflitos e trabalho em equipe.",
            "Realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
            "Treinar líderes para gestão humanizada e diálogo aberto.",
        ]
    },
    {
        id: 17,
        threshold: 30,
        currentPercent: 0,
        group: "Ergonômico - Psicossociais/Cognitivos",
        risco: "Excesso de demandas emocionais ou afetivas no trabalho",
        pergunta: "O seu trabalho traz uma sobrecarga de demandas emocionais, onde precisa interagir com situações de sofrimento? Exemplos: atendimento de pacientes graves, abate de animais em larga escala, atendimentos de emergência em acidentes ou algo que seja impossível não se envolver emocionalmente.",
        acoes: [
            "Criar ambiente de apoio e valorização dos trabalhadores.",
            "Implementar rodízio para reduzir exposição contínua a demandas intensas, rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
            "Oferecer para apoio psicológico interno ou encaminhar para atendimento psicológico externo (de forma individual ou atendimentos coletivos).",
            "Oferecer suporte psicológico e treinamentos em inteligência emocional.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Promover a redistribuição de tarefas para evitar sobrecarga emocional de indivíduos.",
            "Realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
        ]
    },
    {
        id: 18,
        threshold: 30,
        currentPercent: 0,
        group: "Ergonômico - Psicossociais/Cognitivos",
        risco: "Trabalho com demandas divergentes",// (ordens divergentes, metas incompatíveis entre si, exigência de qualidade X quantidade, entre outras)",
        pergunta: "Você costuma receber ordens ou metas de diversas fontes ou gestores diferentes, que podem ser conflitantes, gerando metas ou tempo disponível incompatível para atender tudo que chega?",
        acoes: [
            "Campanhas anuais a respeito de assédio moral e sexual na SIPAT.",
            "Cartilha orientativa a respeito de assédio moral e sexual (disponível em papel e na intranet da empresa).",
            "Criar política clara de combate ao assédio.",
            "procedimentos que contenham exemplos de situações que se enquadram em assédio moral e sexual para melhor entendimento da equipe.",
            "Estabelecer canais de denúncia seguros e eficazes, criação ou verificação da eficácia do Canal de Denúncias (treinamentos e palestras sobre a funcionalidade do canal de denúncias).",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Realizar treinamentos da Comissão Interna de Prevneção de Acidentes e de Assédio (CIPA), nos termos da NR-5.",
            "Treinamento/Capacitação de Gestão de Pessoas para as lideranças.",
            "Treinar gestores e equipes para prevenção e intervenção rápida.",
        ]
    },
    {
        id: 19,
        threshold: 0,
        currentPercent: 0,
        group: "Ergonômico - Psicossociais/Cognitivos",
        risco: "Falta de autonomia no trabalho",
        pergunta: "Você sente que não tem autonomia e liberdade para tomar decisões sobre suas tarefas ou para escolher a melhor forma de realizá-las, depende de uma ordem ou orientação sobre o quê, como e quando fazer suas tarefas?",
        acoes: [
            "Criar um fluxo de trabalho organizado e coerente, reorganizar processos internos para alinhar objetivos conflitantes.",
            "Elaborar rotinas de alinhamento de expectativas e garantir diretrizes claras para as equipes.",
            "Oferecer suporte do RH para mediar questões de incompatibilidade.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Promover reuniões de alinhamento entre setores.",
            "Realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Revisar metas para eliminar exigências contraditórias.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
        ]
    },
    {
        id: 20,
        threshold: 30,
        currentPercent: 0,
        group: "Ergonômico - Psicossociais/Cognitivos",
        risco: "Realização de múltiplas tarefas, com alta demanda cognitiva",
        pergunta: "Você é impedido de realizar seus intervalos de refeição ou descanso entre jornadas de trabalho? Por exemplo, não consegue realizar 1h de intervalor para almoço e não tem 11h de descanso entre uma jornada e outra de trabalho. Descreva na página seguinte, se julgar necessário, quaisquer informações sobre seu ambiente de trabalho que ache que poderia ser importante relatar, visualizando a melhoria do clima organizacional e um ambiente saudável.",
        acoes: [
            "Fornecer ferramentas tecnológicas que simplifiquem processos complexos.",
            "Implementar pausas e técnicas para melhoria da concentração, realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Oferecer treinamentos em organização e produtividade.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Priorizar e delegar tarefas de forma organizada.",
            "Priorizar tarefas e reduzir exigências simultâneas.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
        ]
    },
    {
        id: 21,
        threshold: 30,
        currentPercent: 0,
        group: "Ergonômico - Psicossociais/Cognitivos",
        risco: "Assédio de qualquer natureza no trabalho",
        pergunta: "Você já passou por situações constrangedoras, ofensivas ou humilhantes no ambiente de trabalho, causadas por colegas ou superiores?",
        acoes: [
            "Aplicar pesquisas regulares de clima organizacional.",
            "Criar planos de carreira claros e justos.",
            "Criar programas de reconhecimento e valorização dos trabalhadores.",
            "Envolver os colaboradores nas decisões sobre mudanças no ambiente de trabalho.",
            "Melhorar comunicação interna e escuta ativa.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Revisar fatores que impactam engajamento e motivação.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
        ]
    },
    {
        id: 22,
        threshold: 0,
        currentPercent: 0,
        group: "Ergonômico - Psicossociais/Cognitivos",
        risco: "Excesso de conflitos hierárquicos no trabalho",
        pergunta: "Você vivencia situações frequentes de divergência ou conflito com superiores, que dificultam a execução das suas atividades ou geram insegurança nas decisões?",
        acoes: [
            "Definir margens de autonomia para diferentes funções.",
            "Delegar responsabilidades com base no desempenho individual.",
            "Incentivar autonomia progressiva e feedbacks construtivos, promover treinamentos que incentivem a autogestão.",
            "Para as atividades em que os trabalhos devam ser realizados em pé, devem ser colocados assentos com encosto para descanso em locais em que possam ser utilizados pelos trabalhadores durante as pausas conforme item 17.6.7 da NR-17.",
            "Realização e/ou atualização da Análise Ergonômica do Trabalho (AET) conforme item 17.3.2 da NR-17.",
            "Permitir maior participação dos trabalhadores nas decisões.",
            "Realizar pausas para propiciar a recuperação psicofisiológica dos trabalhadores conforme item 17.4.3.2 da NR-17.",
            "Revisar processos para garantir equilíbrio entre controle e flexibilidade.",
            "Rodízio das atividades com outras tarefas que permitam variar níveis de exigência intelectual/cognitiva, flexibilidade de prazos, as posturas, os grupos musculares utilizados ou o ritmo de trabalho.",
            "Cartilha orientativa a respeito de assédio moral e sexual (disponível em papel e na intranet da empresa).",
        ]
    },
];

const cargos = [
    // { name: 'Cargo Teste', responses: [100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    // { name: 'Auxiliar Administrativo', responses: [38.38, 94.98, 30.29, 46.53, 72.56, 73.45, 67.34, 19.67, 19.02, 66.32, 75.14, 39.02, 68.42, 93.69, 37.40, 55.49, 38.89, 63.83, 31.40, 91.87, 4.14, 45.51] },
    // { name: 'Auxiliar de Serviços Gerais', responses: [58.11, 45.47, 92.86, 36.56, 66.59, 59.28, 85.25, 2.55, 11.99, 65.47, 65.58, 4.44, 68.96, 3.66, 81.23, 75.02, 68.27, 51.39, 8.12, 10.20, 86.89, 70.33] },
    // { name: 'Gerente', responses: [57.13, 66.74, 31.29, 50.12, 14.79, 59.63, 1.66, 82.51, 52.89, 36.78, 77.88, 49.05, 5.05, 46.03, 7.57, 45.88, 28.84, 65.19, 54.52, 51.32, 59.56, 56.68] },
    // { name: 'Supervisor', responses: [14.92, 88.26, 23.35, 23.26, 33.48, 61.94, 64.08, 82.81, 29.48, 24.24, 41.61, 55.87, 7.13, 41.24, 80.67, 2.95, 99.25, 11.33, 80.78, 89.82, 91.98, 21.49] },
    // { name: 'Operador de Caixa', responses: [3.23, 90.07, 12.35, 59.70, 55.13, 99.52, 70.25, 72.57, 14.04, 95.73, 46.29, 25.24, 85.20, 91.81, 64.18, 83.58, 73.09, 46.40, 92.24, 41.13, 40.81, 42.16] },
    // { name: 'Vendedor', responses: [41.09, 76.19, 12.14, 27.23, 78.52, 44.45, 77.47, 51.42, 53.30, 35.53, 4.34, 55.06, 21.39, 85.70, 24.90, 38.44, 88.35, 15.23, 88.36, 30.23, 20.49, 83.83] },
    // { name: 'Técnico de Refrigeração Automotiva e Industrial Sênior', responses: [41.09, 76.19, 12.14, 27.23, 78.52, 44.45, 77.47, 51.42, 53.30, 35.53, 4.34, 55.06, 21.39, 85.70, 24.90, 38.44, 88.35, 15.23, 88.36, 30.23, 20.49, 83.83] },
    // { name: 'Cargo Sem Risco', responses: [0, 10, 10, 10, 10, 10, 10, 30, 0, 30, 0, 0, 10, 50, 50, 30, 30, 30, 0, 30, 30, 0,] },
];

const set_cargo = (state, action) => {
    const id = action?.payload?.index;
    if (null === id) {
        console.warn(`"${action.type}" called without index`);
        return state;
    }

    const cargos = state.cargos.map((cargo, index) => index === id ? action.payload.value : cargo);
    return { ...state, cargos };
}

const update_pergunta = (state, action) => {
    const id = action?.payload?.index;
    if (null !== id) {
        const property = action?.payload?.property;
        if (null !== property) {
            const perguntas = state.perguntas.map((pergunta, index) => index === id ? { ...pergunta, [property]: action.payload.value } : pergunta);
            return { ...state, perguntas };
        }
    } else {
        console.warn(`"${action.type}" called without index`);
    }
    return state;
}

function aepReducer(state = {
    razao_social: "[Razão Social]",
    cnpj: "01.234.567/0001-89",
    address: "Rua dos Bobos, nº0",
    cnae: "00.000-00",
    classe_risco: "1",
    num_avaliados: 0,
    dataAvaliacao: new Date(Date.now()),
    reavaliacao: 12,
    cargos: cargos,
    perguntas: perguntas
}, action) {
    try {
        switch (action.type) {
            case "set:razao_social": return { ...state, razao_social: action.payload }
            case "set:cnpj": return { ...state, cnpj: action.payload }
            case "set:address": return { ...state, address: action.payload }
            case "set:cnae": return { ...state, cnae: action.payload }
            case "set:classe_risco": return { ...state, classe_risco: action.payload }
            case "set:num_avaliados": return { ...state, num_avaliados: action.payload }
            case "set:dataAvaliacao": return { ...state, dataAvaliacao: action.payload }
            case "set:reavaliacao": return { ...state, reavaliacao: action.payload }
            case "set:cargos": return set_cargo(state, action);
            case "add:cargos": return { ...state, cargos: state.cargos.concat({ name: action.payload, responses: (new Array(22)).fill(0) }) }
            case "rem:cargos": return { ...state, cargos: state.cargos.filter((value, index) => { return value !== action.payload && index !== action.payload }) }
            case "update:pergunta": return update_pergunta(state, action);
            default: return state;
        }
    } catch (error) { debugger; throw error; }
}
const AEPStoreContext = createContext(null)
function createInitialState() { return aepReducer(undefined, { type: '@@react19/init' }) }
function loadInitialAEPState() {
    const initial = createInitialState()
    try {
        const raw = window.localStorage.getItem('aepState')
        if (!raw) return initial
        const saved = JSON.parse(raw)
        if (saved?.dataAvaliacao) saved.dataAvaliacao = new Date(saved.dataAvaliacao)
        return { ...initial, ...saved }
    } catch { return initial }
}
function AEPStoreProvider({ children }) {
    const [state, setState] = useState(loadInitialAEPState)
    const dispatch = useCallback((action) => setState(previous => aepReducer(previous, action)), [])
    useEffect(() => { try { window.localStorage.setItem('aepState', JSON.stringify(state)) } catch { } }, [state])
    const value = useMemo(() => ({ state, dispatch }), [state, dispatch])
    return <AEPStoreContext.Provider value={value}>{children}</AEPStoreContext.Provider>
}
function useAEPStore() {
    const store = useContext(AEPStoreContext)
    if (!store) throw new Error('AEP page must be rendered inside AEPStoreProvider')
    return store
}
function useAppSelector(selector) { return selector(useAEPStore().state) }
function useAppDispatch() { return useAEPStore().dispatch }

const SectionCoverPage = (() => {

    function SectionCoverPage() {
        const razaoSocial = useAppSelector((state) => state.razao_social)
        const cnpj = useAppSelector((state) => state.cnpj)

        return (
            <div className="flex flex-row flex-nowrap mx-auto h-screen break-inside-avoid-page">
                <div className="flex flex-col justify-evenly items-center text-center p-4">
                    <span className="text-5xl font-bold text-blue-800">Avaliação Ergonômica Preliminar (AEP)</span>
                    <span className="text-2xl font-semibold text-blue-600">Relatório de Fatores de Riscos Psicossociais Relacionados ao Trabalho (FRPRT)</span>
                    <img className="w-1/2" src="/assets/img/logo.png" alt="Logo" />
                    <p className="text-xl text-gray-600">{razaoSocial}<br />{cnpj}</p>
                </div>
                <img className="h-screen" src="/assets/img/capa-aep.jpg" alt="Capa AEP" />
            </div>
        )
    }
    return SectionCoverPage
})()

const SectionIdentificacao = (() => {

    function parseDate(dateString) {
        if (!dateString) return null
        const [year, month, day] = dateString.split('-').map(Number)
        if (!year || !month || !day) return null
        return new Date(year, month - 1, day)
    }

    function formatDate(date) {
        if (!(date instanceof Date) || Number.isNaN(date.getTime())) return ''
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        return `${y}-${m}-${d}`
    }

    const respTecnicos = [
        { nome: 'Filipe Silva Leite', formacao: 'Eng. de Segurança do Trabalho', registro: 'CREA: 1413179258' },
        { nome: 'Glauber da Costa Milach', formacao: 'Médico do Trabalho', registro: 'CRM: 52301610' },
        { nome: 'Lucia de Araújo Barbosa Rosas', formacao: 'Psicóloga', registro: 'CRP: RJ 05/54967' },
    ]

    function ResponsaveisTecnicosTable() {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeadCell>Nome</TableHeadCell>
                        <TableHeadCell>Formação</TableHeadCell>
                        <TableHeadCell>Registro</TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {respTecnicos.map((tec) => (
                        <TableRow key={tec.registro}>
                            <TableCell className="print:p-0"><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm print:border-0 print:p-0" defaultValue={tec.nome} /></TableCell>
                            <TableCell className="print:p-0"><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm print:border-0 print:p-0" defaultValue={tec.formacao} /></TableCell>
                            <TableCell className="print:p-0"><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm print:border-0 print:p-0" defaultValue={tec.registro} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    const CNPJ_MASK = (value) => {
        let masked = value.replace(/\D/g, '')
        masked = masked.replace(/^(\d{2})(\d)/, '$1.$2')
        masked = masked.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        masked = masked.replace(/\.(\d{3})(\d)/, '.$1/$2')
        masked = masked.replace(/(\d{4})(\d)/, '$1-$2')
        return masked.slice(0, 18)
    }

    function IdentificationItem({ id, display, specs }) {
        const spec = typeof specs === 'string' ? { type: specs } : specs
        const dispatch = useAppDispatch()
        const storedValue = useAppSelector((state) => state[id])
        const inputType = spec.type === 'date' ? 'date' : spec.type === 'number' ? 'number' : 'text'
        const inputValue = spec.type === 'date'
            ? (storedValue instanceof Date ? formatDate(storedValue) : (typeof storedValue === 'string' ? storedValue : ''))
            : (storedValue ?? '')

        const handleChange = (event) => {
            const raw = event.currentTarget.value
            let payload = raw
            if (spec.type === 'date') payload = raw ? parseDate(raw) : null
            else if (spec.type === 'number') payload = raw === '' ? null : Number(raw)
            dispatch({ type: `set:${id}`, payload })
        }

        const { type: _ignoredType, defaultValue: _ignoredDefaultValue, ...inputProps } = spec

        return (
            <li className="flex flex-row items-center gap-3">
                <span className="font-bold text-blue-700">{display}:</span>
                <input
                    className="rounded border border-blue-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400 print:p-0 print:text-gray-800 print:border-none bg-white print:bg-transparent"
                    style={{ fieldSizing: 'content' }}
                    type={inputType}
                    value={inputValue}
                    {...inputProps}
                    onInput={spec.type === 'cnpj' ? (event) => { event.currentTarget.value = CNPJ_MASK(event.currentTarget.value) } : undefined}
                    onChange={handleChange}
                />
            </li>
        )
    }

    function AddCargoControl() {
        const dispatch = useAppDispatch()
        const [show, setShow] = useState(false)
        const [value, setValue] = useState('')
        const inputRef = useRef(null)

        useEffect(() => {
            if (show) inputRef.current?.focus()
        }, [show])

        const save = () => {
            const trimmed = value.trim()
            if (!trimmed) return
            dispatch({ type: 'add:cargos', payload: trimmed })
            setValue('')
            setShow(false)
        }

        if (!show) return <Button variant="primary" className="w-fit" onClick={() => setShow(true)}>Adicionar Cargo</Button>

        return (
            <div className="mt-3 print:hidden flex items-center gap-2">
                <input ref={inputRef} value={value} onChange={(event) => setValue(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === 'Enter') save() }} type="text" placeholder="Nome do Cargo" className="bg-white flex-1 border border-gray-300 rounded px-3 py-2 text-sm" />
                <Button variant="primary" size="sm" onClick={save}>Salvar</Button>
                <Button variant="secondary" size="sm" onClick={() => { setShow(false); setValue('') }}>Cancelar</Button>
            </div>
        )
    }

    function CargoItem({ cargo, index }) {
        const dispatch = useAppDispatch()

        const updateCargo = (patch) => {
            dispatch({ type: 'set:cargos', payload: { index, value: { ...cargo, ...patch } } })
        }

        const handleResponseChange = (responseIndex, value) => {
            const responses = [...cargo.responses]
            responses[responseIndex] = Number(value)
            updateCargo({ responses })
        }

        return (
            <div className="flex flex-col rounded-lg border border-blue-300 p-2 gap-2">
                <div className="flex flex-row flex-nowrap justify-between">
                    <div className="flex flex-row items-center gap-2 w-full">
                        <span>Cargo: </span>
                        <Input placeholder="Nome do Cargo" value={cargo.name} onChange={(event) => updateCargo({ name: event.currentTarget.value })} className="w-full" />
                    </div>
                    <Button variant="destructive" onClick={() => dispatch({ type: 'rem:cargos', payload: cargo })}>Remover</Button>
                </div>
                <div className="bg-gray-200 flex flex-row flex-wrap gap-2 rounded-lg p-2 border border-gray-300">
                    {cargo.responses.map((response, responseIndex) => (
                        <div key={responseIndex} className="flex flex-col gap-2 text-sm bg-gray-300 text-center rounded-lg">
                            <span>{`Q#${responseIndex + 1}`}</span>
                            <input onChange={(event) => handleResponseChange(responseIndex, event.currentTarget.value)} type="number" max={100} min={0} className="w-12 text-sm text-center" value={response} />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    function HiddenData() {
        const cargos = useAppSelector((state) => state.cargos)
        return (
            <div className="flex flex-col gap-4">
                {cargos.map((cargo, index) => <CargoItem key={`${cargo.name}-${index}`} cargo={cargo} index={index} />)}
                <AddCargoControl />
            </div>
        )
    }

    function SectionIdentificacao({ index, id, title }) {
        return (
            <Section index={index} id={id} title={title}>
                <ul className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600 space-y-3 text-sm sm:text-lg flex flex-col items-start">
                    <IdentificationItem id="razao_social" display="Empresa" specs="text" />
                    <IdentificationItem id="cnpj" display="CNPJ" specs="cnpj" />
                    <IdentificationItem id="address" display="Endereço" specs="text" />
                    <IdentificationItem id="cnae" display="CNAE do estabelecimento" specs="text" />
                    <IdentificationItem id="classe_risco" display="Classe de risco" specs={{ type: 'number', min: 1, max: 4 }} />
                    <IdentificationItem id="num_avaliados" display="Número de Trabalhadores Avaliados" specs={{ type: 'number', min: 1 }} />
                    <IdentificationItem id="dataAvaliacao" display="Data da Avaliação" specs={{ type: 'date', defaultValue: new Date().toLocaleDateString() }} />
                    <IdentificationItem id="reavaliacao" display="Reavaliação Recomendada (meses)" specs={{ type: 'number', min: 1 }} />
                </ul>

                <div className="print:hidden bg-gray-100 p-4 my-4 rounded-lg border-l-4 border-red-200 flex flex-col items-start">
                    <span className="text-gray-400 text-lg">Esta parte não aparecerá na impressão.</span>
                    <HiddenData />
                </div>

                <div className="mb-12 mt-8">
                    <h3 className="text-2xl font-bold text-blue-800 mb-4">{index}.1 Responsáveis Técnicos pela Ferramenta de avaliação de FRPRT:</h3>
                    <ResponsaveisTecnicosTable />
                </div>
            </Section>
        )
    }
    return SectionIdentificacao
})()

const SectionImportanciaDaParticipacao = (() => {

    function Strong({ children }) {
        return <strong className="text-blue-600">{children}</strong>
    }
    function Indent({ children }) {
        return <p className="indent-8">{children}</p>
    }

    function SectionImportanciaDaParticipacao({ index, id, title }) {
        return (
            <Section index={index} id={id} title={title}>
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600 space-y-4 text-lg leading-relaxed text-gray-800 text-justify">
                    <Indent>
                        A participação dos trabalhadores é fundamental para a qualidade e confiabilidade da Avaliação Ergonômica Preliminar (AEP). Como o <Strong>COPSOQ II</Strong> baseia-se na percepção dos trabalhadores, o engajamento dos participantes garante resultados mais precisos e representativos das condições reais de trabalho.
                    </Indent>
                    <Indent>
                        Conforme o Guia do MTE, é essencial assegurar <Strong>anonimato, confidencialidade e comunicação transparente</Strong>, promovendo um ambiente de confiança que favoreça respostas fidedignas.
                    </Indent>
                    <Indent>A participação também é indispensável nas etapas do GRO, contribuindo para a identificação de perigos, avaliação dos riscos e definição de medidas de prevenção.</Indent>
                </div>
            </Section>
        )
    }
    return SectionImportanciaDaParticipacao
})()

const SectionMetodologia = (() => {
    function Strong(children) {
        return <strong className="text-blue-600">{children}</strong>;
    }
    function Text(children) {
        return <p className="text-lg leading-relaxed text-gray-800 text-justify indent-8 mb-4">{children}</p>;
    }
    function Indent(children) {
        return <p className="indent-8">{children}</p>;
    }
    function SectionMetodologia({ index, id, title }) {
        return (
            <Section index={index} id={id} title={title}>
                {[
                    <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600 space-y-4 text-lg leading-relaxed text-gray-800 text-justify">{Indent([
                        "Para a realização desta Avaliação Ergonômica Preliminar (AEP), foi utilizado o instrumento ",
                        Strong("COPSOQ II (versão curta)"),
                        ", questionário psicométrico internacionalmente validado, adequado à identificação de fatores de risco psicossociais relacionados ao trabalho, conforme diretrizes da NR-01 e NR-17."
                    ])}{Indent("O instrumento possibilita a análise estruturada das condições de trabalho, contemplando domínios como demandas laborais, autonomia, relações interpessoais, organização do trabalho, liderança, conflito trabalho-vida, segurança no emprego e saúde e bem-estar.")}{Indent([
                        "A coleta de dados foi realizada por meio de questionário estruturado com ",
                        Strong("escala Likert de 5 pontos"),
                        ", garantindo participação voluntária, anonimato e confidencialidade."
                    ])}<div className="bg-white border-l-4 border-blue-600 p-5 my-2 rounded-lg"><p className="font-bold text-gray-900 mb-3">Os dados coletados foram tratados estatisticamente, incluindo:</p><ul className="list-disc pl-6 space-y-2 text-gray-800 text-base"><li>Padronização das respostas.</li><li>Ajustes de consistência, com inversão quando necessário.</li><li>Cálculo de médias por dimensão e domínio.</li><li>Consolidação dos resultados em indicadores quantitativos.</li></ul></div>{Indent([
                        "A metodologia adotada está alinhada ao processo do ",
                        Strong("GRO"),
                        ", contemplando identificação de perigos, avaliação e classificação dos riscos e apoio à melhoria contínua das condições de trabalho."
                    ])}</div>
                ]}
            </Section>
        )
    }
    return SectionMetodologia
})()

const SectionObjetivo = (() => {
    function Strong(children) {
        return <strong className="text-blue-600">{children}</strong>;
    }
    function Text(children) {
        return <p className="text-lg leading-relaxed text-gray-800 text-justify indent-8 mb-4">{children}</p>;
    }
    function SectionObjetivo({ index, id, title }) {
        return (
            <Section index={index} id={id} title={title}>
                {[
                    <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600">{Text([
                        "Esta ",
                        Strong("Avaliação Ergonômica Preliminar (AEP)"),
                        " tem como objetivo identificar e analisar de forma técnica os ",
                        Strong("fatores de riscos psicossociais presentes no ambiente laboral"),
                        ", que podem contribuir para o estresse ocupacional e impactar a saúde, o bem-estar e a produtividade dos trabalhadores.",
                    ])}{Text([
                        "Este relatório está em ",
                        Strong("estrita conformidade com a NR-17 e NR-1 (GRO e PGR)"),
                        ", atendendo ao ",
                        Strong("Guia de Informações sobre Fatores de Riscos Psicossociais Relacionados ao Trabalho (MTE) e COPSOQ II Versão Curta"),
                        ", garantindo alinhamento com as melhores práticas nacionais e internacionais em saúde e segurança do trabalho."
                    ])}{Text([
                        "Os resultados subsidiam a priorização de medidas de controle, elaboração de planos de ação e integração ao ",
                        Strong("PGR"),
                        ", podendo indicar a necessidade de aprofundamento por meio de ",
                        Strong("Análise Ergonômica do Trabalho (AET)"),
                        "."
                    ])}{Text("Dessa forma, a avaliação contribui para a promoção de ambientes de trabalho mais seguros, saudáveis e produtivos.")}</div>
                ]}
            </Section>
        )
    }
    return SectionObjetivo
})()

const SectionResponsabilidades = (() => {
    function formatDate(date) {
        if (typeof date === "string")
            date = new Date(date);
        return new Intl.DateTimeFormat("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date);
    }
    function Strong(children) {
        return <b>{children}</b>;
    }
    function Signature(nome, cargo, empresa, responsabilidade) {
        return <div className="flex-1 min-w-0 w-full max-w-[300px] flex flex-col items-center"><div className="w-full border-b-2 border-black mb-2 mt-8" /><div className="text-base font-semibold text-gray-900 text-center">{nome}</div><div className="text-sm text-gray-700 text-center">{cargo}</div><div className="text-sm text-gray-700 text-center">{empresa}</div><div className="text-sm text-gray-900 font-bold mt-1 text-center">{responsabilidade}</div></div>;
    }
    function SectionResponsabilidades({ index, id, title }) {
        const dataAvaliacao = useAppSelector(s => s.dataAvaliacao);
        const razao_social = useAppSelector(s => s.razao_social);
        return (
            <Section index={index} id={id} title={title}>
                {[
                    <div className="text-lg font-semibold text-gray-800 mb-32">{formatDate(dataAvaliacao)}</div>,
                    <div className="flex flex-col md:flex-row print:flex-row justify-center items-start gap-8 md:gap-16 w-full mb-8">{Signature("Representante Legal", "Segtrab Saúde", "Responsável pela avaliação")}{Signature("Representante Legal", razao_social, "Responsável pela aprovação")}</div>,
                    <div className="text-base text-gray-800 mb-4 text-justify indent-8" style={{
                        textAlign: "justify",
                        textIndent: "2em"
                    }}>{Strong("Ressalta-se que a responsabilidade pela implementação, monitoramento e acompanhamento das ações corretivas e preventivas recomendadas neste relatório é integralmente da empresa")}, conforme estabelece a NR-1 (item 1.5.3.1) e o {Strong("Programa de Gerenciamento de Riscos (PGR)")}, cabendo à organização avaliar a aplicabilidade das medidas no contexto de suas operações, garantindo a conformidade com as normas regulamentadoras vigentes e as melhores práticas de saúde, segurança e ergonomia ocupacional.</div>,
                    <div className="text-base text-gray-800 text-justify indent-8" style={{
                        textAlign: "justify",
                        textIndent: "2em"
                    }}>Este relatório, elaborado com rigor técnico e em conformidade com a {Strong("NR-1, NR-17 e o Guia de Fatores de Riscos Psicossociais Relacionados ao Trabalho")}, visa subsidiar a gestão da empresa na tomada de decisões informadas, mantendo rastreabilidade e evidências técnicas para auditorias, fiscalizações e processos de melhoria contínua do sistema de gestão de SST.</div>
                ]}
            </Section>
        )
    }
    return SectionResponsabilidades
})()

const SectionResultadosGerais = (() => {

    const average = (nums) => {
        if (!Array.isArray(nums) || nums.length === 0) return 0
        return nums.reduce((total, n) => total + Number(n || 0), 0) / nums.length
    }

    const getRiskSettings = (hasRisk) => ({
        has: hasRisk,
        yesNo: hasRisk ? 'Sim' : 'Não',
        withWithout: hasRisk ? 'Com' : 'Sem',
        label: hasRisk ? 'Ruim' : 'Bom',
        colorName: hasRisk ? 'Vermelha' : 'Verde',
        colorZone: hasRisk ? 'red' : 'green',
        colorBg: hasRisk ? 'bg-red-400' : 'bg-green-400',
        colorText: hasRisk ? 'text-red-500' : 'text-green-500',
        colorBorder: hasRisk ? 'border-red-50' : 'border-green-50',
        level: hasRisk ? 'Alto' : 'Baixo',
    })

    function QuadroMediaGeral() {
        const perguntas = useAppSelector((state) => state.perguntas)
        const cargos = useAppSelector((state) => state.cargos)
        const avgAll = cargos.length ? cargos.reduce((total, cargo) => total + average(cargo.responses), 0) / cargos.length : 0

        return (
            <div className="bg-white rounded-lg shadow-lg border-2 border-blue-200 -mt-2 px-6 py-1 flex flex-col items-center justify-center gap-2 break-inside-avoid-page">
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="text-xl font-semibold text-gray-700 mb-3 text-center">Média Geral da Empresa</div>
                    <div className="text-4xl sm:text-6xl font-extrabold select-none pointer-events-none leading-none">{avgAll.toFixed(2)}%</div>
                </div>
                <div className="flex flex-col w-full text-sm">
                    {perguntas.map((pergunta, index) => {
                        const responses = cargos.map((cargo) => Number(cargo.responses[index] || 0))
                        const avg = responses.length ? responses.reduce((sum, value) => sum + value, 0) / responses.length : 0
                        const hasRisk = responses.some((response) => response > pergunta.threshold)
                        return (
                            <a key={pergunta.id} className="w-full mb-1" href={`#pergunta_${index + 1}`}>
                                <div className="flex justify-between items-center"><span className="text-gray-700 font-medium">{pergunta.risco}</span><span className="text-sm font-semibold text-gray-600">{avg.toFixed(2)}%</span></div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className={cn('h-full transition-all duration-300', getRiskSettings(hasRisk).colorBg)} style={{ width: `${avg}%` }} /></div>
                            </a>
                        )
                    })}
                </div>
                <div className="flex flex-row justify-evenly w-full text-sm mb-2 gap-4 print:text-xs">
                    <RiskLegend hasRisk={false} label="Boa percepção, manutenção recomendada." />
                    <RiskLegend hasRisk label="Risco elevado, ação corretiva imediata." />
                </div>
            </div>
        )
    }

    function RiskLegend({ hasRisk, label }) {
        const risk = getRiskSettings(hasRisk)
        const zoneBg = hasRisk ? 'bg-red-50' : 'bg-green-50'
        const zoneText = hasRisk ? 'text-red-800' : 'text-green-800'
        const labelText = hasRisk ? 'text-red-700' : 'text-green-700'
        return (
            <div className={`${zoneBg} p-4 rounded-lg border border-black`}>
                <div className={`flex items-center gap-x-2 mb-2 ${zoneText}`}>
                    <div className={cn('w-4 h-4 rounded', risk.colorBg)} />
                    <span className="font-semibold">Zona {risk.colorName}</span>
                    <span className="font-thin text-sm">{hasRisk ? 'Risco Encontrado' : 'Não há Risco'}</span>
                </div>
                <p className={labelText}>{label}</p>
            </div>
        )
    }

    function CargoRiskRow({ cargo, pergunta, perguntaIndex }) {
        const value = Number(cargo.responses[perguntaIndex] || 0)
        const risk = getRiskSettings(value > pergunta.threshold)
        return (
            <div className="flex items-center gap-4 text-gray-700">
                <div className="w-2/5 text-right text-sm"><span className="block">{cargo.name}</span></div>
                <span className="w-[70px] text-center font-semibold bg-gray-100 rounded-lg">{value.toFixed(2)}%</span>
                <div className="flex-1">
                    <div className="relative h-8 bg-gray-100 rounded font-semibold">
                        <div className={`absolute left-0 top-0 h-8 rounded flex items-center ${risk.colorBg}`} style={{ width: `${value}%` }}>
                            <span className="ml-2 uppercase whitespace-nowrap">{risk.withWithout} RISCO</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    function Porcentagens({ cargos, pergunta, perguntaIndex }) {
        return (
            <div className="print-safe-block mb-16 print:mb-0">
                <div className="p-6 w-full flex flex-col gap-3">
                    {cargos.map((cargo, index) => <CargoRiskRow key={`${cargo.name}-${index}`} cargo={cargo} pergunta={pergunta} perguntaIndex={perguntaIndex} />)}
                </div>
            </div>
        )
    }

    const resultadoSrc = [
        ['Trivial', 'Trivial', 'Tolerável', 'Moderado', 'Moderado'],
        ['Trivial', 'Tolerável', 'Moderado', 'Moderado', 'Substancial'],
        ['Trivial', 'Tolerável', 'Moderado', 'Substancial', 'Intolerável'],
        ['Tolerável', 'Tolerável', 'Moderado', 'Substancial', 'Intolerável'],
        ['Tolerável', 'Moderado', 'Substancial', 'Intolerável', 'Intolerável'],
    ]

    const certezaSrc = {
        Trivial: ['Nenhuma ação é necessária', 'Nenhuma informação adicional é necessária', 'Nenhuma informação adicional é necessária'],
        Tolerável: ['Nenhum controle adicional é necessário', 'Informação adicional necessária', 'Informação adicional necessária'],
        Moderado: ['Controle adicional se for possível e viável', 'Informação adicional necessária', 'Informação adicional necessária'],
        Substancial: ['Controle necessário', 'Controle e informação adicional necessários', 'Controle e informação adicional necessários'],
        Intolerável: ['Ação imediata ou interrupção da atividade', 'Controle e informação adicional necessários', 'Controle e informação adicional necessários'],
    }

    function Field({ label, className, children }) {
        return <div className={cn('inline-flex flex-col mx-auto', className)}><span className="uppercase" style={{ fontSize: '0.625rem', lineHeight: '0.75rem' }}>{label}</span>{children}</div>
    }

    function Perigos({ pergunta, risk }) {
        const initial = risk.has ? [5, 3] : [3, 1]
        const [resultado, setResultado] = useState(initial)
        const selectedResult = resultadoSrc[resultado[0] - 1]?.[resultado[1] - 1] || (risk.has ? 'Intolerável' : 'Trivial')
        const defaultClass = 'bg-white border border-gray-500 resize-none rounded-lg print:border-none print:bg-transparent py-1 px-2'

        const handleChange = (event, id) => {
            const nextValue = Math.min(5, Math.max(1, Number(event.currentTarget.value) || 1))
            setResultado((current) => {
                const next = [...current]
                next[id] = nextValue
                return next
            })
        }

        return (
            <div className="flex flex-col items-center justify-evenly bg-gray-200 rounded-lg w-full p-2 mb-4 gap-2">
                <div className="flex flex-row gap-2 w-full">
                    <Field label="Perigos / Fontes Geradoras / Circunstâncias" className="w-full">
                        <textarea className={cn(defaultClass, 'text-sm')} placeholder={risk.has ? pergunta.risco : ''} />
                    </Field>
                    <Field label="Possíveis Danos à Saúde" className="w-full">
                        <textarea className={cn(defaultClass, 'text-sm')} placeholder={risk.has ? 'Estresse, ansiedade, burnout' : ''} />
                    </Field>
                </div>
                <div className="flex w-full">
                    <Field label="Probabilidade" className="mx-2 justify-center items-center">
                        <input type="number" style={{ fieldSizing: 'content' }} min={1} max={5} className={cn(defaultClass, 'text-center w-fit')} value={resultado[0]} onChange={(event) => handleChange(event, 0)} />
                    </Field>
                    <Field label="Severidade" className="mx-2 justify-center items-center">
                        <input type="number" style={{ fieldSizing: 'content' }} min={1} max={5} className={cn(defaultClass, 'text-center w-fit')} value={resultado[1]} onChange={(event) => handleChange(event, 1)} />
                    </Field>
                    <Field label="Resultado" className="mx-2 flex-grow justify-center items-center">
                        <input className={cn(defaultClass, 'w-fit text-center')} style={{ fieldSizing: 'content' }} readOnly value={selectedResult} />
                    </Field>
                    <Field label="Medida Recomendada" className="mx-2 flex-grow justify-center items-center">
                        <input className={cn(defaultClass, 'text-center')} style={{ fieldSizing: 'content' }} readOnly value={certezaSrc[selectedResult]?.[0] || ''} />
                    </Field>
                </div>
            </div>
        )
    }

    function Medida({ medida, initialEnabled = true, onRemove }) {
        const [enabled, setEnabled] = useState(initialEnabled)
        return (
            <div className={cn('flex items-center gap-3 py-2 px-2', enabled ? 'bg-white text-black' : 'bg-gray-100 text-gray-400 print:hidden')}>
                <div className="flex-1">{medida}</div>
                <span className="hidden print:inline-block text-lg align-middle ml-2">✔ </span>
                <span className="text-xs print:hidden">{enabled ? 'Aplica' : 'Não se aplica'}</span>
                <div className="print:hidden flex items-center gap-4">
                    <button type="button" role="switch" aria-checked={enabled} data-state={enabled ? 'checked' : 'unchecked'} className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300" onClick={() => setEnabled((value) => !value)}>
                        <span data-state={enabled ? 'checked' : 'unchecked'} className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
                    </button>
                    {onRemove && <button type="button" className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg" title="Remover item temporário" onClick={onRemove}>Remover</button>}
                </div>
            </div>
        )
    }

    function DataQuando() {
        const dataAvaliacao = useAppSelector((state) => state.dataAvaliacao)
        const reavaliacao = useAppSelector((state) => state.reavaliacao)
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        const formatMesAno = (data) => `${meses[data.getMonth()]}/${data.getFullYear()}`
        const inicio = new Date(dataAvaliacao)
        inicio.setMonth(inicio.getMonth() + 1)
        const final = new Date(inicio)
        final.setMonth(final.getMonth() + Number(reavaliacao || 1) - 1)
        return <span className="inline font-normal">{formatMesAno(inicio)} à {formatMesAno(final)}</span>
    }

    function TabelaResponsavel() {
        const tableData = [
            { header: 'Responsável', type: 'text' },
            { header: 'Data de Implantação', type: 'text', placeholder: '___/___/______' },
            { header: 'A Fazer', type: 'checkbox' },
            { header: 'Fazendo', type: 'checkbox' },
            { header: 'Adiado', type: 'checkbox' },
            { header: 'Concluído', type: 'checkbox' },
            { header: 'Concluído em', type: 'text', placeholder: '___/___/______' },
        ]
        return (
            <table className="w-full text-xs border border-gray-300 rounded text-sm print:border-black mt-7">
                <thead><tr className="bg-gray-100 text-center">{tableData.map((item) => <th key={item.header} className="px-2 py-1 border-none">{item.header}</th>)}</tr></thead>
                <tbody><tr>{tableData.map((item) => <td key={item.header} className="border border-gray-300 px-2 py-1 print:border-black bg-white text-center"><input type={item.type} className={item.type === 'text' ? 'w-full rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-400 text-center' : 'w-4 h-4 align-middle'} readOnly={item.type !== 'text'} placeholder={item.placeholder} /></td>)}</tr></tbody>
            </table>
        )
    }

    function PlanoDeAcao({ pergunta, risk }) {
        const [medidas, setMedidas] = useState(() => pergunta.acoes.map((medida, index) => ({ id: `default-${index}`, medida, temporary: false })))
        const [showAdd, setShowAdd] = useState(false)
        const [newMeasure, setNewMeasure] = useState('')

        const addMeasure = () => {
            const trimmed = newMeasure.trim()
            if (!trimmed) return
            setMedidas((current) => current.concat({ id: `temporary-${Date.now()}`, medida: trimmed, temporary: true }))
            setNewMeasure('')
            setShowAdd(false)
        }

        return (
            <div className="p-4 bg-yellow-100 text-sm mb-4">
                <div className="mb-2"><b>Ação Recomendada:</b>{` Risco ${risk.level}`}</div>
                <b>Medidas de Prevenção/Controle:</b>
                <div className="w-full mt-1">
                    <div className="flex flex-col border border-gray-200 rounded overflow-hidden">
                        {medidas.map((item) => <Medida key={item.id} medida={item.medida} initialEnabled={item.temporary} onRemove={item.temporary ? () => setMedidas((current) => current.filter((value) => value.id !== item.id)) : undefined} />)}
                    </div>
                    {showAdd ? (
                        <div className="mt-3 print:hidden flex items-center gap-2">
                            <input autoFocus value={newMeasure} onChange={(event) => setNewMeasure(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === 'Enter') addMeasure() }} type="text" placeholder="Descreva a medida a ser adicionada..." className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm bg-white" />
                            <button onClick={addMeasure} className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium h-9 rounded-md px-3 bg-blue-600 hover:bg-blue-700 text-white">Salvar</button>
                            <button onClick={() => { setShowAdd(false); setNewMeasure('') }} className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">Cancelar</button>
                        </div>
                    ) : (
                        <button className="mt-3 print:hidden flex items-center text-blue-700 hover:text-blue-800 font-medium" type="button" onClick={() => setShowAdd(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus w-4 h-4 mr-1"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                            Adicionar medida temporária
                        </button>
                    )}
                </div>
                <div className="mt-4">
                    <div className="mb-2">
                        <span className="block font-bold">Quando</span>
                        <span className="font-semibold">Aplicar em: </span><DataQuando />
                        <TabelaResponsavel />
                    </div>
                </div>
            </div>
        )
    }

    function PerguntaCard({ pergunta, perguntaIndex, cargos }) {
        const responses = cargos.map((cargo) => Number(cargo.responses[perguntaIndex] || 0))
        const risk = getRiskSettings(responses.some((response) => response > pergunta.threshold))

        return (
            <div className={cn('mb-8 rounded-xl shadow-lg border-2 border-gray-200 bg-white', perguntaIndex === 0 ? '' : 'break-inside-avoid-page')}>
                <div id={`pergunta_${perguntaIndex + 1}`} className="px-6 py-4 border-b border-gray-300 bg-gradient-to-r from-blue-50 to-blue-100">
                    <h4 className="text-xl font-bold uppercase tracking-wide text-gray-800">{pergunta.risco}</h4>
                </div>
                <div className="p-6 print:pb-0 gap-y-12">
                    <div className="w-full px-6 gap-y-8"><div className="w-full px-6"><div className="text-black font-bold">Pergunta:</div><div className="text-gray-700 font-normal">{pergunta.pergunta}</div></div></div>
                    <Porcentagens cargos={cargos} pergunta={pergunta} perguntaIndex={perguntaIndex} />
                    <Perigos pergunta={pergunta} risk={risk} />
                    <PlanoDeAcao pergunta={pergunta} risk={risk} />
                </div>
            </div>
        )
    }

    function QuadroPerguntas() {
        const perguntas = useAppSelector((state) => state.perguntas)
        const cargos = useAppSelector((state) => state.cargos)
        return (
            <div className="mb-8 mt-8 print-chart-container max-w-5xl mx-auto px-2 sm:px-4">
                {perguntas.map((pergunta, index) => <PerguntaCard key={pergunta.id} pergunta={pergunta} perguntaIndex={index} cargos={cargos} />)}
            </div>
        )
    }

    function SectionResultadosGerais({ index, id, title }) {
        return (
            <Section index={index} id={id} title={title}>
                {/* <QuadroMediaGeral /> */}
                <QuadroPerguntas />
            </Section>
        )
    }
    return SectionResultadosGerais
})()

const SectionLimitacoes = (() => {
    function Strong(children) {
        return <strong className="text-blue-600">{children}</strong>;
    }
    function Text(children) {
        return <p>{children}</p>;
    }
    function Semibold(children) {
        return <span className="font-semibold">{children}</span>;
    }
    function SectionLimitacoes({ index, id, title }) {
        return (
            <Section index={index} id={id} title={title}>
                {[
                    <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600"><div className="space-y-4 text-lg leading-relaxed text-gray-800 text-justify indent-8">{Text(["Esta ", Strong("Avaliação Ergonômica Preliminar (AEP)"), " possui caráter ", Strong("inicial e orientativo"), ", sendo realizada conforme as diretrizes da ", Strong("NR-17"), " e integrada ao processo de Gerenciamento de Riscos Ocupacionais (GRO) previsto na ", Strong("NR-01"), ". Seu objetivo é identificar indícios de fatores de risco psicossociais relacionados ao trabalho e subsidiar o ", Strong(["Programa de Gerenciamento de Riscos (", Semibold("PGR"), ')']), ", contribuindo para a priorização de medidas preventivas e corretivas."])}{Text(["A metodologia adotada, baseada no ", Strong("COPSOQ II"), " (versão curta), utiliza instrumento padronizado e cientificamente validado, fundamentado na percepção dos trabalhadores sobre as condições de trabalho. Os resultados refletem a realidade vivenciada no momento da coleta de dados, não se configurando como ", Strong("diagnóstico clínico individual"), ", mas como avaliação das condições organizacionais e dos fatores psicossociais presentes no ambiente laboral."])}{Text(["Ressalta-se que a AEP ", Strong(["não substitui a Análise Ergonômica do Trabalho (", Semibold("AET"), ')']), ", a qual possui caráter aprofundado e investigativo. Conforme a NR-17, a AET deve ser realizada quando forem identificados riscos relevantes, situações críticas ou necessidade de análise detalhada das atividades, incluindo observações em campo, entrevistas e avaliação das condições reais de trabalho."])}{Text(["De acordo com o ", Strong("Guia de Fatores de Riscos Psicossociais do MTE"), ", a avaliação preliminar deve ser entendida como parte de um processo contínuo de identificação, avaliação e controle dos riscos, não encerrando o ciclo do GRO, mas servindo como base para o monitoramento e melhoria contínua das condições de trabalho."])}{Text(["Além disso, os resultados podem sofrer variações ao longo do tempo, em função de mudanças organizacionais, operacionais ou de gestão, sendo recomendada a ", Strong("reaplicação periódica"), " do instrumento para garantir a atualização dos dados e a efetividade das ações implementadas."])}{Text(["Por fim, destaca-se que a participação dos trabalhadores é ", Strong("voluntária, anônima e confidencial"), ". Ainda que se busque representatividade da amostra, podem existir limitações inerentes a instrumentos baseados em percepção, tais como interpretações individuais das questões, nível de engajamento e fatores contextuais não captados no momento da avaliação, reforçando a necessidade de utilização da ", Strong("AEP como ferramenta de triagem e priorização dentro do sistema de gestão de SST"), ", e não como avaliação conclusiva."])}</div></div>
                ]}
            </Section>
        )
    }
    return SectionLimitacoes
})()

const SectionClassificacaoEAvaliacaoDosRiscosPsicossociais = (() => {
    function Text(text) {
        return <div className="text-base text-gray-800 text-justify indent-8 mb-4" style={{
            textAlign: "justify",
            textIndent: "2em"
        }}>{text}</div>;
    }
    function MatrizDeRisco() {
        return (<>
            <div className="print-safe-block print-wide-table-container overflow-x-auto print:overflow-visible mb-8"><table className="w-full border-collapse border border-gray-700 text-sm"><thead><tr><td colSpan="2" rowSpan="2" className="border border-gray-700 bg-blue-600 px-3 py-2 font-bold text-center text-white align-middle" style={{
                width: "28%"
            }}>MATRIZ DE RISCOS 5X5 <br />METODOLOGIA AIHA </td><td colSpan="5" className="border border-gray-700 bg-blue-600 px-3 py-2 font-bold text-center text-white">SEVERIDADE</td><td rowSpan="2" className="border border-gray-700 bg-blue-600 px-3 py-2 font-bold text-center text-white align-middle" style={{
                width: "13%"
            }}>LEGENDA DO <br />NÍVEL DE RISCO </td></tr><tr><td className="border border-gray-700 bg-blue-500 px-2 py-2 font-bold text-center text-white">LEVE <br /><span>1</span></td><td className="border border-gray-700 bg-blue-500 px-2 py-2 font-bold text-center text-white">BAIXO <br /><span>2</span></td><td className="border border-gray-700 bg-blue-500 px-2 py-2 font-bold text-center text-white">MODERADO <br /><span>3</span></td><td className="border border-gray-700 bg-blue-500 px-2 py-2 font-bold text-center text-white">ALTO <br /><span>4</span></td><td className="border border-gray-700 bg-blue-500 px-2 py-2 font-bold text-center text-white">EXTREMO <br /><span>5</span></td></tr></thead><tbody><tr><td rowSpan="5" className="border border-gray-700 bg-blue-600 px-3 py-2 font-bold text-center text-white align-middle">PROBABILIDADE</td><td className="border border-gray-700 bg-blue-50 px-2 py-2 text-center text-blue-800 font-semibold">MUITO PROVÁVEL <br /><span className="font-bold">5</span></td><td className="border border-gray-700 bg-green-400 px-2 py-3" /><td className="border border-gray-700 bg-yellow-300 px-2 py-3" /><td className="border border-gray-700 bg-orange-400 px-2 py-3" /><td className="border border-gray-700 bg-red-500 px-2 py-3" /><td className="border border-gray-700 bg-red-500 px-2 py-3" /><td className="border border-gray-700 bg-sky-200 px-2 py-3 text-center font-bold text-sky-800 align-middle">TRIVIAL <br /><span className="text-xs font-normal">1 - 3</span></td></tr><tr><td className="border border-gray-700 bg-blue-50 px-2 py-2 text-center text-blue-800 font-semibold">PROVÁVEL <br /><span className="font-bold">4</span></td><td className="border border-gray-700 bg-green-400 px-2 py-3" /><td className="border border-gray-700 bg-green-400 px-2 py-3" /><td className="border border-gray-700 bg-yellow-300 px-2 py-3" /><td className="border border-gray-700 bg-orange-400 px-2 py-3" /><td className="border border-gray-700 bg-red-500 px-2 py-3" /><td className="border border-gray-700 bg-green-200 px-2 py-3 text-center font-bold text-green-800 align-middle">TOLERÁVEL <br /><span className="text-xs font-normal">3 - 8</span></td></tr><tr><td className="border border-gray-700 bg-blue-50 px-2 py-2 text-center text-blue-800 font-semibold">POSSÍVEL <br /><span className="font-bold">3</span></td><td className="border border-gray-700 bg-sky-200 px-2 py-3" /><td className="border border-gray-700 bg-green-400 px-2 py-3" /><td className="border border-gray-700 bg-yellow-300 px-2 py-3" /><td className="border border-gray-700 bg-orange-400 px-2 py-3" /><td className="border border-gray-700 bg-red-500 px-2 py-3" /><td className="border border-gray-700 bg-yellow-200 px-2 py-3 text-center font-bold text-yellow-800 align-middle">MODERADO <br /><span className="text-xs font-normal">4 - 12</span></td></tr><tr><td className="border border-gray-700 bg-blue-50 px-2 py-2 text-center text-blue-800 font-semibold">POUCO PROVÁVEL <br /><span className="font-bold">2</span></td><td className="border border-gray-700 bg-sky-200 px-2 py-3" /><td className="border border-gray-700 bg-green-400 px-2 py-3" /><td className="border border-gray-700 bg-yellow-300 px-2 py-3" /><td className="border border-gray-700 bg-yellow-300 px-2 py-3" /><td className="border border-gray-700 bg-orange-400 px-2 py-3" /><td className="border border-gray-700 bg-orange-200 px-2 py-3 text-center font-bold text-orange-800 align-middle">SUBSTANCIAL <br /><span className="text-xs font-normal">10 - 16</span></td></tr><tr><td className="border border-gray-700 bg-blue-50 px-2 py-2 text-center text-blue-800 font-semibold">RARA <br /><span className="font-bold">1</span></td><td className="border border-gray-700 bg-sky-200 px-2 py-3" /><td className="border border-gray-700 bg-sky-200 px-2 py-3" /><td className="border border-gray-700 bg-green-400 px-2 py-3" /><td className="border border-gray-700 bg-yellow-300 px-2 py-3" /><td className="border border-gray-700 bg-yellow-300 px-2 py-3" /><td className="border border-gray-700 bg-red-200 px-2 py-3 text-center font-bold text-red-800 align-middle">INTOLERÁVEL <br /><span className="text-xs font-normal">15 - 25</span></td></tr></tbody></table></div>
            <div className="print-safe-block mb-8"><h3 className="text-lg font-bold text-gray-900 mb-4">Probabilidade</h3><p className="text-base text-gray-800 text-justify mb-4" style={{
                textAlign: "justify"
            }}>A probabilidade representa a chance de o problema ocorrer ou estar presente no ambiente de trabalho.</p><table className="w-full border-collapse border border-gray-300 text-sm"><thead><tr className="bg-blue-600 text-white"><th className="border border-gray-300 px-4 py-2 text-left">%</th><th className="border border-gray-300 px-4 py-2 text-left">Interpretação</th><th className="border border-gray-300 px-4 py-2 text-center">Probabilidade</th></tr></thead><tbody><tr className="bg-green-50"><td className="border border-gray-300 px-4 py-2">&lt;40%</td><td className="border border-gray-300 px-4 py-2">ambiente muito saudável</td><td className="border border-gray-300 px-4 py-2 text-center font-bold">1</td></tr><tr className="bg-green-100"><td className="border border-gray-300 px-4 py-2">40-59%</td><td className="border border-gray-300 px-4 py-2">boa condição</td><td className="border border-gray-300 px-4 py-2 text-center font-bold">2</td></tr><tr className="bg-yellow-50"><td className="border border-gray-300 px-4 py-2">60-74%</td><td className="border border-gray-300 px-4 py-2">atenção</td><td className="border border-gray-300 px-4 py-2 text-center font-bold">3</td></tr><tr className="bg-orange-50"><td className="border border-gray-300 px-4 py-2">75-89%</td><td className="border border-gray-300 px-4 py-2">problema frequente</td><td className="border border-gray-300 px-4 py-2 text-center font-bold">4</td></tr><tr className="bg-red-50"><td className="border border-gray-300 px-4 py-2">90-100%</td><td className="border border-gray-300 px-4 py-2">problema crítico</td><td className="border border-gray-300 px-4 py-2 text-center font-bold">5</td></tr></tbody></table></div>
            <div className="print-safe-block mb-8"><h3 className="text-lg font-bold text-gray-900 mb-4">Severidade</h3><p className="text-base text-gray-800 text-justify mb-4" style={{
                textAlign: "justify"
            }}>A severidade representa o impacto do risco na saúde do trabalhador caso ele ocorra.</p><table className="w-full border-collapse border border-gray-300 text-sm"><thead><tr className="bg-blue-600 text-white"><th className="border border-gray-300 px-4 py-2 text-center">Severidade</th><th className="border border-gray-300 px-4 py-2 text-left">Impacto</th></tr></thead><tbody><tr className="bg-green-50"><td className="border border-gray-300 px-4 py-2 text-center font-bold">1</td><td className="border border-gray-300 px-4 py-2">desconforto leve</td></tr><tr className="bg-green-100"><td className="border border-gray-300 px-4 py-2 text-center font-bold">2</td><td className="border border-gray-300 px-4 py-2">fadiga mental leve</td></tr><tr className="bg-yellow-50"><td className="border border-gray-300 px-4 py-2 text-center font-bold">3</td><td className="border border-gray-300 px-4 py-2">estresse ocupacional</td></tr><tr className="bg-orange-50"><td className="border border-gray-300 px-4 py-2 text-center font-bold">4</td><td className="border border-gray-300 px-4 py-2">transtornos psicológicos</td></tr><tr className="bg-red-50"><td className="border border-gray-300 px-4 py-2 text-center font-bold">5</td><td className="border border-gray-300 px-4 py-2">adoecimento grave</td></tr></tbody></table></div>
            <div className="print-safe-block mb-8"><h4 className="text-base font-bold text-gray-900 mb-2">Métodos de Controle e Ação</h4><p className="text-sm text-gray-700 mb-4" style={{
                textAlign: "justify"
            }}>Os métodos de controle devem ser definidos de acordo com o nível de risco identificado na avaliação. A priorização das ações segue a hierarquia de criticidade estabelecida pela matriz de risco.</p><table className="w-full border-collapse border border-gray-700 text-sm"><thead><tr><th className="border border-gray-700 bg-gray-200 px-4 py-2 text-center font-bold text-gray-900 w-1/3">NÍVEIS DE RISCOS <br />(ORDEM DE PRIORIDADE) </th><th className="border border-gray-700 bg-gray-200 px-4 py-2 text-center font-bold text-gray-900">CONTROLE DE AÇÕES</th></tr></thead><tbody><tr className="bg-red-100"><td className="border border-gray-700 px-4 py-2 font-bold text-red-700">1º INTOLERÁVEL</td><td className="border border-gray-700 px-4 py-2">Ações imediatas</td></tr><tr className="bg-orange-100"><td className="border border-gray-700 px-4 py-2 font-bold text-orange-700">2º SUBSTANCIAL</td><td className="border border-gray-700 px-4 py-2">Controle necessário</td></tr><tr className="bg-yellow-100"><td className="border border-gray-700 px-4 py-2 font-bold text-yellow-700">3º MODERADO</td><td className="border border-gray-700 px-4 py-2">Controle adicional, se possível / viável</td></tr><tr className="bg-green-100"><td className="border border-gray-700 px-4 py-2 font-bold text-green-700">4º TOLERÁVEL</td><td className="border border-gray-700 px-4 py-2">Nenhum controle adicional necessário</td></tr><tr className="bg-sky-100"><td className="border border-gray-700 px-4 py-2 font-bold text-sky-700">5º TRIVIAL</td><td className="border border-gray-700 px-4 py-2">Nenhuma ação necessária</td></tr></tbody></table></div>
        </>)
    }
    function SectionClassificacaoEAvaliacaoDosRiscosPsicossociais({ index, id, title }) {
        return (
            <Section index={index} id={id} title={title}>
                {[
                    Text("A identificação e avaliação dos fatores de risco psicossociais foram realizadas por meio de Avaliação Ergonômica Preliminar (AEP), utilizando o COPSOQ II - Copenhagen Psychosocial Questionnaire (versão curta), instrumento psicométrico internacionalmente validado, alinhado às diretrizes da NR-01 (Gerenciamento de Riscos Ocupacionais - GRO) e da NR-17 (Ergonomia)."),
                    Text("O instrumento possibilita a análise estruturada de domínios organizacionais relacionados às condições de trabalho, incluindo demandas laborais, controle e desenvolvimento, relações interpessoais e liderança, organização do trabalho, conflito trabalho-vida, segurança no emprego e saúde e bem-estar. Esses domínios permitem identificar fatores organizacionais que podem contribuir para o estresse ocupacional e para impactos na saúde e no desempenho dos trabalhadores."),
                    Text("Os resultados da avaliação foram obtidos a partir da percepção dos trabalhadores, por meio de questionário estruturado com escala padronizada, sendo posteriormente tratados estatisticamente para geração de indicadores quantitativos por domínio."),
                    Text("Para fins de integração ao Inventário de Riscos do PGR, os resultados foram convertidos em níveis de risco, utilizando metodologia qualitativa baseada na matriz 5x5 (Probabilidade x Severidade)."),
                    <MatrizDeRisco />,
                ]}
            </Section>
        )
    }
    return SectionClassificacaoEAvaliacaoDosRiscosPsicossociais
})()

const SectionInventarioDeRiscosOcupacionaisParaOPGR = (() => {
    function Text({ text, className }) {
        return <div className={cn("text-base text-gray-800 text-justify indent-8", className)} style={{
            textAlign: "justify",
            textIndent: "2em"
        }}>{text}</div>;
    }
    function Table() {
        const perguntas = useAppSelector(s => s.perguntas);
        function Header() {
            return <thead><tr className="bg-blue-600 text-white"><th className="border border-gray-300 px-3 py-2 print:px-1 text-left">DOMÍNIO</th><th className="border border-gray-300 px-1 py-2 text-center w-12">%</th><th className="border border-gray-300 px-3 py-2 print:px-1 text-left">AGENTE NOCIVO</th><th className="border border-gray-300 px-3 py-2 print:px-1 text-left">POSSÍVEIS DANOS</th><th className="border border-gray-300 px-3 py-2 print:px-1 text-center">PROBABILIDADE (1 a 5)</th><th className="border border-gray-300 px-3 py-2 print:px-1 text-center">SEVERIDADE (1 a 5)</th><th className="border border-gray-300 px-3 py-2 print:px-1 text-center">NÍVEL DE RISCO</th></tr></thead>;
        }
        function Body() {
        }
        return <table className="w-full border-collapse border border-gray-300 text-sm print:text-xs"><Header /><Body /></table>;
    }
    function SectionInventarioDeRiscosOcupacionaisParaOPGR({ index, id, title }) {
        return (
            <Section index={index} id={id} title={title}>
                {[
                    Text({ className: "mb-4", text: "Os domínios avaliados foram incorporados ao Inventário de Riscos Ocupacionais, permitindo a identificação dos fatores psicossociais relevantes no ambiente de trabalho e subsidiando a elaboração do Plano de Ação do PGR, no qual é definido o monitoramento necessário para a mitigação dos riscos identificados." }),
                    Text({ text: "Ressalta-se que os resultados obtidos refletem a percepção dos trabalhadores no momento da avaliação e devem ser monitorados periodicamente, conforme o ciclo de melhoria contínua do Gerenciamento de Riscos Ocupacionais (GRO), garantindo a atualização das informações e a efetividade das medidas preventivas adotadas pela organização." }),
                    <div className="mt-6"><h3 className="text-lg font-bold text-gray-900 mb-4">Apuração dos Resultados</h3><div className="print-safe-block print-wide-table-container overflow-x-auto print:overflow-visible mt-6"><Table /></div></div>
                ]}
            </Section>
        )
    }
    return SectionInventarioDeRiscosOcupacionaisParaOPGR
})()

const SectionSumario = (() => {

    function SectionItem({ section, index }) {
        return (
            <a className="w-full flex items-center text-left text-lg sm:text-xl font-semibold text-gray-800 hover:text-blue-700 transition-colors print:pointer-events-none" href={`#${section.id}`}>
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">{index + 1}</span>
                <span className="uppercase">{String(section.displayName)}</span>
            </a>
        )
    }

    function SectionSumario({ sections }) {
        return (
            <Section title="Sumário">
                <div className="space-y-3">
                    {sections.map((section, index) => <SectionItem key={section.id} section={section} index={index} />)}
                </div>
            </Section>
        )
    }
    return SectionSumario
})()

const SECTIONS_MAP = [
    { id: 'identificacao', name: 'Identificação', element: SectionIdentificacao },
    { id: 'objetivo', name: 'Objetivo', element: SectionObjetivo },
    { id: 'metodologia', name: 'Metodologia', element: SectionMetodologia },
    { id: 'importância_da_participacao', name: 'Importância da Participação dos Trabalhadores', element: SectionImportanciaDaParticipacao },
    { id: 'resultados_gerais', name: 'Resultados Gerais', element: SectionResultadosGerais },
    { id: 'limitacoes', name: 'Limitações', element: SectionLimitacoes },
    { id: 'responsabilidades', name: 'Responsabilidades', element: SectionResponsabilidades },
    { id: 'classificacao_e_avaliacao_dos_riscos', name: 'Classificação e Avaliação dos Riscos Psicossociais', element: SectionClassificacaoEAvaliacaoDosRiscosPsicossociais },
]

function AEPPrintStyles() {
    return <style>{`
    html { scroll-behavior: smooth; }
    @media print {
      @page { size: A4; margin: 12mm; }
      body { background: #fff !important; }
      .aep-page { max-width: none !important; }
      .aep-page input, .aep-page textarea, .aep-page select { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .aep-page .print-safe-block { break-inside: avoid; page-break-inside: avoid; }
    }
  `}</style>
}

function AEPPageContent() {
    return <div className="aep-page max-w-5xl mx-auto min-h-screen">
        <SectionCoverPage />
        <main className="mx-auto p-8 bg-white w-full text-gray-900">
            <SectionSumario sections={SECTIONS_MAP.map(({ id, name }) => ({ id, displayName: name }))} />
            {SECTIONS_MAP.map(({ id, name, element: SectionComponent }, index) => <SectionComponent key={id} index={index + 1} id={id} title={name} />)}
        </main>
    </div>
}

export default function AEPPage() {
    return <AEPStoreProvider><AEPPrintStyles /><AEPPageContent /></AEPStoreProvider>
}
