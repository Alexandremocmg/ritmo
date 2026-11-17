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

Inclui **35 MP4 locais**: demonstrações para 34 exercícios e uma referência adicional de supino com barra. Os clipes do Pexels foram conferidos por sequências de quadros, cortados e otimizados em MP4 H.264.

Os vídeos incluem demonstrações animadas e filmadas, com o aparelho e a variação identificados no player. Mesa flexora e flexora sentada agora têm vídeos distintos. Panturrilha com halteres continua sem correspondência confirmada.

A remada na máquina tem demonstração animada da **YouCan Workout Library**, conferida e otimizada com FFmpeg. A página da biblioteca é identificada no player; seu vínculo oficial com @joinyoucan não foi confirmado.

Autores, fontes, licenças e cortes estão em [CREDITOS-VIDEOS.txt](CREDITOS-VIDEOS.txt) e [public/media/fontes.json](public/media/fontes.json). Veja também [NOTICE.md](NOTICE.md).

## Catálogo ampliado

O catálogo contém **46 exercícios de musculação** e **9 atividades de cardio**. A lista solicitada tinha 42 itens: 36 de musculação e 6 de cardio. Nove movimentos de musculação já estavam cadastrados; foram acrescentados 27, mantendo nomes e registros anteriores. Sinônimos como “cadeira flexora”, “flexão de joelho sentado”, “Chest Press” e “Tríceps pulley” são reconhecidos na busca. Ao adicionar pelo nome equivalente, o app usa a entrada já cadastrada.

Versões em máquina, halteres, Smith e polia têm entradas próprias quando representam variações diferentes. Os novos exercícios aparecem na biblioteca e nos seletores das rotinas e do treino livre. As seis atividades solicitadas aparecem na seção Cardio da biblioteca e em Registrar cardio. Dezessete dos 27 exercícios novos têm vídeos incluídos; os outros dez continuam como “Vídeo pendente”. Os 16 MP4 anteriores foram preservados.

No mergulho assistido, os kg representam assistência. O app não sugere aumento automático, nem calcula volume em kg, recordes de carga ou 1RM para esse movimento. As séries continuam contando para o grupo muscular.


### Vídeos do catálogo ampliado

Incluídas dez demonstrações da **YouCan Workout Library**, com fonte identificada no player: supino na máquina, supino inclinado na máquina, crucifixo na máquina, crossover, remada no Smith, rosca Scott na máquina, rosca na polia, tríceps corda, abdominal na máquina e elevação de pernas. Os arquivos foram conferidos por sequências de quadros do original e da edição, exportados com FFmpeg em H.264/30 fps, sem áudio, com capa e fast start, e decodificados integralmente. O vínculo oficial da biblioteca com @joinyoucan continua não confirmado.

O catálogo de 46 exercícios tem 35 entradas com vídeo contando a referência de supino com barra; restam 11 pendências: dez do catálogo novo e panturrilha com halteres. A lista completa e os candidatos rejeitados ficam em `public/media/fontes.json`. Os arquivos chamados “Lever Front Pulldown” e “Lever Back Extension” mostravam, respectivamente, uma polia e um banco com peso corporal; por isso não foram associados a aparelhos diferentes dos demonstrados.

### Novas fontes para as pendências

Acrescentados nove vídeos: mesa flexora, flexora sentada, leg press horizontal, abdução de quadril, agachamento Hack, supino no Smith, desenvolvimento na máquina, tríceps na máquina e extensão lombar. Cinco vêm de Goulart / wger sob **CC BY-SA 4.0**, incluindo as edições e capas derivadas sob a mesma licença; três são obras do **CDC em domínio público**, obtidas no Wikimedia Commons; um vem de **Antoni Shkraba / Pexels**. Fonte, autor, licença e indicação de edição aparecem no player.

Os vídeos do CDC têm resolução original de 320 × 240, identificada como baixa resolução; a exportação preserva os pixels originais. O supino no Smith mostra a variação inclinada. O arquivo do wger intitulado “Seated Hip Adduction” foi identificado visualmente como abdução por mostrar apoios externos às coxas e afastamento dos joelhos, e foi associado a essa entrada.

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
# Contas e sincronização (3.4)

Na hospedagem Vercel, o Perfil oferece cadastro, entrada com e-mail/senha, confirmação por código, recuperação de senha e sincronização do perfil, fichas, histórico, planejamento, cardio e medidas. O SDK oficial `@neon/auth` mantém a sessão; as funções `/api/account` verificam JWT Ed25519 com o JWKS da mesma branch e restringem consultas ao proprietário autenticado. A conexão Postgres nunca vai para o navegador.

As variáveis existentes da integração são suficientes:

- `DATABASE_URL`: conexão usada exclusivamente pelo servidor.
- `DATABASE_NEON_AUTH_BASE_URL`: URL pública do Neon Auth. Alternativa aceita: `DATABASE_VITE_NEON_AUTH_URL`.
- `DATABASE_POSTGRES_DATABASE` não precisa ser lida: o banco já faz parte da conexão.

O build da Vercel instala as dependências declaradas e executa `node build-vercel.cjs`. O comando gera `dist/` com a interface e o SDK; as funções ficam em `api/`. No primeiro acesso autenticado ao banco, a função cria apenas a tabela `public.ritmo_accounts`, caso ainda não exista. Não altera tabelas do Neon Auth nem executa migrações do Better Auth.

Cadastros não importam automaticamente dados anteriores. Após entrar, use **Importar dados deste navegador** para substituir o perfil da conta pelos dados locais, com cópia de recuperação. Arquivos pessoais de vídeo permanecem no aparelho; seus IDs locais não são enviados. No GitHub Pages e no arquivo HTML, o app continua disponível no modo local, sem API de contas.

Cada conta possui uma cópia local separada para acesso offline. A conta anteriormente selecionada pode ser aberta offline neste mesmo navegador; sair da conta remove essa seleção, preservando a cópia para a próxima entrada. O app só envia dados após confirmar a sessão. Alterações pendentes sobrevivem ao recarregamento; revisões condicionais impedem sobrescrita silenciosa entre aparelhos. Conflitos exigem escolha explícita e guardam as versões anteriores no armazenamento local. Uma sessão de treino aberta impede trocas de conta e substituições dos dados.

No Neon, habilite e-mail/senha, cadastre a origem de produção como domínio confiável e, se exigir verificação, selecione códigos de verificação. Os fluxos por código utilizam o provedor de e-mail configurado no Neon; envio real depende dessa configuração. Para operação de produção, siga a [configuração de e-mail recomendada pelo Neon](https://neon.com/docs/auth/production-checklist). Login social não é oferecido nesta versão.

Verificação local: `node --test test-v3-data.cjs test-v3-regression.cjs test-pwa.cjs test-library.cjs test-catalog.cjs test-cloud.cjs`. Os testes de nuvem usam adaptadores simulados: cobrem autorização por proprietário, isolamento de contas, cache offline, conflitos, alterações durante envio, limites e proteção de treino ativo. Cadastro, entrega de e-mail, restauração da sessão pelo SDK e escrita no Postgres precisam também de validação com uma conta real na hospedagem. Nenhum teste cria usuários reais.
