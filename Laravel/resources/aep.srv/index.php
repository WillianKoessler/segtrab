<?php
// Force revalidation and forbid storing the response
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);

// HTTP 1.0 backward compatibility
header("Pragma: no-cache");

// Set an expiration date in the past
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
?>
<!DOCTYPE html>
<html lang="pt-BR">

	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Segtrab Saúde: Análise Ergonômica Preliminar</title>
		<meta name="description" content="Sistema de Saúde e Segurança no Trabalho - Ferramenta de Geração para Análise Ergonômica Preliminar">
		<meta name="author" content="Segtrab Saúde">
		<script>
			const SOURCE_DATA = [
				{ id: 1, threshold: 0, group: "Ergonômico - Organizacionais", risco: "Trabalho realizado sem pausas pré-definidas para descanso", pergunta: "Você NÃO tem possibilidade de fazer pausas durante o seu dia de trabalho para descansar, beber água ou fazer suas necessidades fisiológicas? " },
				{ id: 2, threshold: 10, group: "Ergonômico - Organizacionais", risco: "Necessidade de manter ritmos intensos de trabalho", pergunta: "A sua rotina, você precisa manter um ritmo intenso de trabalho, que considere anormal, onde o volume de trabalho é maior que o tempo disponível para realizá-lo e exige de você uma sobrecarga de esforço, seja por pedidos excessivos, atrasos de produção que precisam ser compensados ou algo similar? " },
				{ id: 3, threshold: 10, group: "Ergonômico - Organizacionais", risco: "Trabalho com necessidade de variação de turnos", pergunta: "Você tem que trabalhar em turnos diferentes ao longo da semana? Por exemplo, as vezes pela manhã, as vezes a noite." },
				{ id: 4, threshold: 10, group: "Ergonômico - Organizacionais", risco: "Monotonia", pergunta: "Você considera seu trabalho monótono? Ou seja, com menos tarefas que você conseguiria atender, tarefas repetitivas e sem necessidade de esforço mental, tempo ocioso ou situação similar." },
				{ id: 5, threshold: 10, group: "Ergonômico - Organizacionais", risco: "Trabalho noturno", pergunta: "Você trabalha em turno noturno (das 22h as 5h)?" },
				{ id: 6, threshold: 10, group: "Ergonômico - Organizacionais", risco: "Trabalho com utilização rigorosa de metas de produção", pergunta: "Suas tarefas são determinadas por metas de produção fixas e rigorosas?" },
				{ id: 7, threshold: 10, group: "Ergonômico - Organizacionais", risco: "Trabalho remunerado por produção", pergunta: "A sua remuneração está diretamente ligada à quantidade de trabalho produzido? Ou seja, quanto mais você produzir, mais dinheiro ganha?" },
				{ id: 8, threshold: 30, group: "Ergonômico - Organizacionais", risco: "Cadência do trabalho imposta por um equipamento", pergunta: "O ritmo do seu trabalho é controlado por um equipamento ou máquina? (esteira, nória, bateladas ou algo similar)" },
				{ id: 9, threshold: 0, group: "Ergonômico - Organizacionais", risco: "Desequilíbrio entre tempo de trabalho e tempo de repouso", pergunta: "Você costuma realizar muitas demandas durante o dia, de forma frequente e ao mesmo que exigem muita atenção, que tenham muitos detalhes?" },
				{ id: 10, threshold: 30, group: "Ergonômico - Organizacionais", risco: "Insuficiência de capacitação para execução da tarefa", pergunta: "Você já sentiu que faltam treinamentos, orientações ou preparo adequado para executar suas atividades com segurança e confiança? " },
				{ id: 11, threshold: 0, group: "Ergonômico - Psicossociais/Cognitivos", risco: "Insatisfação no trabalho", pergunta: "Você se sente desmotivado(a) ou insatisfeito(a) com suas atividades, ambiente ou condições de trabalho com frequência?" },
				{ id: 12, threshold: 0, group: "Ergonômico - Organizacionais", risco: "Trabalho com sobrecarga vocal", pergunta: "O seu trabalho exige o uso excessivo ou intenso da sua voz? Fala a maior parte do tempo em volume superior a conversação normal." },
				{ id: 13, threshold: 10, group: "Ergonômico - Psicossociais/Cognitivos", risco: "Excesso de situações de estresse", pergunta: "No trabalho você passa por situações frequentes e excessivas de estresse? Neste caso, não consideramos situações de tensão normais do dia a dia, mas situações frequentes de desrespeito onde não haja possibilidade de se defender, pressão psicológica, ameaças ou algo similar que cause tensão constante." },
				{ id: 14, threshold: 50, group: "Ergonômico - Psicossociais/Cognitivos", risco: "Exigência de alto nível de concentração, atenção e memória", pergunta: "Você sente que, no dia a dia, a quantidade de informações, tarefas e decisões no trabalho tem sido excessiva e constante? Essa sobrecarga pode estar afetando seu foco, sua produtividade e até mesmo a forma como se relaciona com as pessoas ao seu redor." },
				{ id: 15, threshold: 50, group: "Ergonômico - Psicossociais/Cognitivos", risco: "Situações de sobrecarga de trabalho mental", pergunta: "Seu trabalho demanda um nível frequente e excessivo de atenção e concentração, onde um erro pode gerar consequências graves?" },
				{ id: 16, threshold: 30, group: "Ergonômico - Psicossociais/Cognitivos", risco: "Trabalho em condições de difícil comunicação", pergunta: "Você possui dificuldade em se comunicar com outras pessoas no seu trabalho devido ao ambiente, ruído, isolamento, meios de comunicação insuficientes ou alguma outra condição?" },
				{ id: 17, threshold: 30, group: "Ergonômico - Psicossociais/Cognitivos", risco: "Excesso de demandas emocionais ou afetivas no trabalho", pergunta: "O seu trabalho traz uma sobrecarga de demandas emocionais, onde precisa interagir com situações de sofrimento? Exemplos: atendimento de pacientes graves, abate de animais em larga escala, atendimentos de emergência em acidentes ou algo que seja impossível não se envolver emocionalmente." },
				{ id: 18, threshold: 30, group: "Ergonômico - Psicossociais/Cognitivos", risco: "Trabalho com demandas divergentes (ordens divergentes, metas incompatíveis entre si, exigência de qualidade X quantidade, entre outras)", pergunta: "Você costuma receber ordens ou metas de diversas fontes ou gestores diferentes, que podem ser conflitantes, gerando metas ou tempo disponível incompatível para atender tudo que chega?" },
				{ id: 19, threshold: 0, group: "Ergonômico - Psicossociais/Cognitivos", risco: "Falta de autonomia no trabalho", pergunta: "Você sente que não tem autonomia e liberdade para tomar decisões sobre suas tarefas ou para escolher a melhor forma de realizá-las, depende de uma ordem ou orientação sobre o quê, como e quando fazer suas tarefas?" },
				{ id: 20, threshold: 30, group: "Ergonômico - Psicossociais/Cognitivos", risco: "Realização de múltiplas tarefas, com alta demanda cognitiva", pergunta: "Você é impedido de realizar seus intervalos de refeição ou descanso entre jornadas de trabalho? Por exemplo, não consegue realizar 1h de intervalor para almoço e não tem 11h de descanso entre uma jornada e outra de trabalho. Descreva na página seguinte, se julgar necessário, quaisquer informações sobre seu ambiente de trabalho que ache que poderia ser importante relatar, visualizando a melhoria do clima organizacional e um ambiente saudável." },
				{ id: 21, threshold: 30, group: "Ergonômico - Psicossociais/Cognitivos", risco: "Assédio de qualquer natureza no trabalho", pergunta: "Você já passou por situações constrangedoras, ofensivas ou humilhantes no ambiente de trabalho, causadas por colegas ou superiores?" },
				{ id: 22, threshold: 0, group: "Ergonômico - Psicossociais/Cognitivos", risco: "Excesso de conflitos hierárquicos no trabalho", pergunta: "Você vivencia situações frequentes de divergência ou conflito com superiores, que dificultam a execução das suas atividades ou geram insegurança nas decisões? " },
			];
		</script>
		<script src="/tailwindcss.3.4.17.js"></script>
		<script src="/KDOM.error.js"></script>
		<script src="/KDOM.store.js"></script>
		<script src="/KDOM.js"></script>
		<script src="./helpers.js"></script>
	</head>

	<body>
		<div id="root" class="bg-white min-h-screen overflow-x-auto max-w-5xl mx-auto px-4 py-8"></div>
		<script type="module" src="./script.js"></script>
	</body>

</html>