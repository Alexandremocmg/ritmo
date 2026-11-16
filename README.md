# Ritmo

Aplicativo de academia para organizar rotinas, registrar séries e acompanhar a evolução. Funciona no navegador, com dados salvos localmente e vídeos reproduzidos dentro do app.

## Abrir o aplicativo

Baixe este repositório pelo botão **Code → Download ZIP**, extraia toda a pasta e abra **Ritmo.html**. Mantenha a pasta **public/media** junto ao arquivo, na estrutura do projeto. Não é necessário instalar dependências para usar o app.

Também há uma entrada **index.html** na raiz para hospedagem estática. A pasta **public** contém a versão com HTML, JavaScript e CSS separados.

### GitHub Pages

O projeto está preparado para publicação pela raiz **/** da branch **main**. O arquivo **.nojekyll** mantém os arquivos estáticos sem processamento do Jekyll.

**[Acessar o Ritmo no celular ou computador](https://alexandremocmg.github.io/ritmo/)**

O site publica automaticamente as alterações enviadas à branch **main**. Os registros de treino continuam salvos apenas no navegador e no dispositivo utilizados.

### Instalar no celular

- **Android:** abra o endereço no Chrome e toque em **Instalar app**, no início ou em **Perfil → Instalar Ritmo**. Se o botão mostrar **Como instalar**, use o menu **⋮ → Instalar aplicativo** ou **Adicionar à tela inicial**.
- **iPhone:** abra o endereço no Safari, toque em **Compartilhar → Adicionar à Tela de Início** e confirme. Se aparecer a opção **Abrir como App**, mantenha-a ativada.

O ícone abre o Ritmo em uma janela própria. Após o primeiro carregamento com internet e a preparação do cache, a interface pode abrir offline. **Os vídeos da versão online precisam de conexão**; não são baixados automaticamente. No pacote local, os vídeos continuam sendo lidos da pasta `public/media`.

Uma atualização do aplicativo não apaga os treinos. Quando houver uma nova versão, a opção **Atualizar app**, em Perfil, fica disponível após concluir ou descartar a sessão em andamento. O backup em Perfil permite transferir os registros entre dispositivos ou entre armazenamentos que o navegador trate separadamente.

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

Inclui **16 MP4 locais**: demonstrações para 15 exercícios e uma referência adicional de supino com barra. Os seis clipes novos do Pexels foram conferidos por sequências de quadros, cortados e otimizados em MP4 H.264.

Os novos vídeos cobrem supino inclinado com halteres, elevação lateral, tríceps na polia com barra curta, rosca direta com barra reta, cadeira extensora e panturrilha em pé no step. Nas fichas padrão, **mesa flexora** continua sem vídeo incluído. No catálogo de alternativas, também estão pendentes **flexora sentada e panturrilha com halteres**. A rosca com halteres tem uma demonstração YouCan da variação em banco inclinado.

A remada na máquina tem demonstração animada da **YouCan Workout Library**, conferida e otimizada com FFmpeg. A página da biblioteca é identificada no player; seu vínculo oficial com @joinyoucan não foi confirmado.

Autores, fontes, licenças e cortes estão em [CREDITOS-VIDEOS.txt](CREDITOS-VIDEOS.txt) e [public/media/fontes.json](public/media/fontes.json). Veja também [NOTICE.md](NOTICE.md).

## Catálogo ampliado

O catálogo contém **46 exercícios de musculação** e **9 atividades de cardio**. A lista solicitada tinha 42 itens: 36 de musculação e 6 de cardio. Nove movimentos de musculação já estavam cadastrados; foram acrescentados 27, mantendo nomes e registros anteriores. Sinônimos como “cadeira flexora”, “flexão de joelho sentado”, “Chest Press” e “Tríceps pulley” são reconhecidos na busca. Ao adicionar pelo nome equivalente, o app usa a entrada já cadastrada.

Versões em máquina, halteres, Smith e polia têm entradas próprias quando representam variações diferentes. Os novos exercícios aparecem na biblioteca e nos seletores das rotinas e do treino livre. As seis atividades solicitadas aparecem na seção Cardio da biblioteca e em Registrar cardio. Os exercícios novos ainda não têm vídeos incluídos; os 16 MP4 anteriores foram preservados.

No mergulho assistido, os kg representam assistência. O app não sugere aumento automático, nem calcula volume em kg, recordes de carga ou 1RM para esse movimento. As séries continuam contando para o grupo muscular.

## Dados pessoais

O app não possui servidor de contas nem sincronização em nuvem. Os registros ficam no navegador e no dispositivo utilizados; exporte um backup em **Perfil** para transferi-los. Vídeos pessoais adicionados pelo usuário ficam separados do backup JSON. Nenhum registro pessoal de treino ou arquivo de credenciais acompanha este repositório.

O Coach utiliza regras locais; não há uma IA externa conectada.

## Desenvolvimento

Node.js 20 ou superior, sem dependências externas:

```sh
node build.cjs
node --test test-v3-data.cjs test-v3-regression.cjs test-pwa.cjs test-library.cjs test-catalog.cjs
```

O build gera **public/index.html**, **Ritmo.html**, **index.html**, os ícones PNG e **sw.js**. Edite os arquivos-fonte em **public**, **manifest.webmanifest**, **sw.template.js** e **scripts/generate-icons.cjs** e gere novamente a distribuição. A versão do cache deriva do conteúdo dos arquivos da interface.

## Verificação

Foram verificados dados, migração, tipos de séries, volume, progressão, controladores da interface, associação dos seis novos vídeos, créditos, integridade dos arquivos e decodificação completa dos novos MP4. A inspeção visual dos movimentos foi feita em sequências de quadros. A reprodução automatizada dentro do navegador não pôde ser revalidada porque a política administrativa do Windows bloqueou a automação do Edge.

Instruções adicionais: [LEIA-ME-v3.1.txt](LEIA-ME-v3.1.txt).
