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

    const cargos = state.cargos;
    cargos[id] = action.payload.value;
    return { ...state, cargos };
}

const update_pergunta = (state, action) => {
    const id = action?.payload?.index;
    if (null !== id) {
        const property = action?.payload?.property;
        if (null !== property)
            state.perguntas[id][property] = action.payload.value;
    } else {
        console.warn(`"${action.type}" called without index`);
    }
    return state;
}

export default function aepReducer(state = {
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
}