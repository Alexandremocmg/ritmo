# Ritmo

Aplicativo de academia para organizar rotinas, registrar séries e acompanhar a evolução. Funciona no navegador, com dados salvos localmente e vídeos reproduzidos dentro do app.

## Abrir o aplicativo

Baixe este repositório pelo botão **Code → Download ZIP**, extraia toda a pasta e abra **Ritmo.html**. Mantenha a pasta **public/media** junto ao arquivo, na estrutura do projeto. Não é necessário instalar dependências para usar o app.

Também há uma entrada **index.html** na raiz para hospedagem estática. A pasta **public** contém a versão com HTML, JavaScript e CSS separados.

## Recursos

- Perfil inicial para hipertrofia, com meta editável de quatro treinos por semana.
- Rotinas organizadas em pastas e planejamento semanal.
- Treino livre; adição, remoção e reordenação de exercícios e séries durante a sessão.
- Registro de carga, repetições, RIR/RPE e séries normais, aquecimento, drop e falha.
- Comparação com a sessão anterior, descanso automático e retomada do treino salvo.
- Histórico por exercício, calendário, gráficos e marcas pessoais.
- Registros manuais de cardio e medidas corporais.
- Temas claro e escuro.
- Exportação e restauração de backup JSON, com migração das versões anteriores.

## Vídeos

Inclui **14 MP4 locais**: demonstrações para 13 exercícios e uma referência adicional de supino com barra. Os seis clipes novos do Pexels foram conferidos por sequências de quadros, cortados e otimizados em MP4 H.264.

Os novos vídeos cobrem supino inclinado com halteres, elevação lateral, tríceps na polia com barra curta, rosca direta com barra reta, cadeira extensora e panturrilha em pé no step. **Mesa flexora continua sem vídeo incluído.**

Autores, fontes, licenças e cortes estão em [CREDITOS-VIDEOS.txt](CREDITOS-VIDEOS.txt) e [public/media/fontes.json](public/media/fontes.json). Veja também [NOTICE.md](NOTICE.md).

## Dados pessoais

O app não possui servidor de contas nem sincronização em nuvem. Os registros ficam no navegador e no dispositivo utilizados; exporte um backup em **Perfil** para transferi-los. Vídeos pessoais adicionados pelo usuário ficam separados do backup JSON. Nenhum registro pessoal de treino ou arquivo de credenciais acompanha este repositório.

O Coach utiliza regras locais; não há uma IA externa conectada.

## Desenvolvimento

Node.js 20 ou superior, sem dependências externas:

```sh
node build.cjs
node --test test-v3-data.cjs test-v3-regression.cjs
```

O build gera **public/index.html**, **Ritmo.html** e **index.html**. Edite os arquivos-fonte em **public** e gere novamente os HTML de distribuição.

## Verificação

Foram verificados dados, migração, tipos de séries, volume, progressão, controladores da interface, associação dos seis novos vídeos, créditos, integridade dos arquivos e decodificação completa dos novos MP4. A inspeção visual dos movimentos foi feita em sequências de quadros. A reprodução automatizada dentro do navegador não pôde ser revalidada porque a política administrativa do Windows bloqueou a automação do Edge.

Instruções adicionais: [LEIA-ME-v3.1.txt](LEIA-ME-v3.1.txt).
