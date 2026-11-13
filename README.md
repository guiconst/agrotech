# AgroTech

Monitoramento de umidade de hortas comunitárias. React + Vite + Capacitor (Android).

## Prints do app

| Tela do aplicativo | Ícone na tela inicial do celular |
| --- | --- |
| <img src="prints/tela-app.png" alt="Tela principal do AgroTech com resumo, filtros e cards das hortas" width="260"> | <img src="prints/icone-no-celular.png" alt="Ícone do AgroTech instalado na tela inicial do Android" width="260"> |

Ícone e splash na pasta `assets/` (gerados com `@capacitor/assets`).

## Rodar no computador
```bash
npm install
npm run dev
```

## Atualizar o app Android
```bash
npm run build
npx capacitor-assets generate --android
npx cap sync android
```
Abrir no Android Studio: `npx cap open android`.

## Subir no GitHub
```bash
git init
git add .
git commit -m "feat: app AgroTech com icone, splash e workflow de APK"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```
Depois: aba **Actions** > último build > **Artifacts** > `meu-aplicativo-apk`.

## Funções do app
- Hortas com cultura e faixa ideal de umidade própria
- Registro de leitura manual e de rega (+25%)
- Histórico com gráfico e últimas leituras
- Anotações por horta
- Busca e filtros (Todas / Atenção / Ideais)
- Alertas por notificação local quando a horta fica seca ou encharcada
- Simulação de sensores para demonstração
- Editar e remover hortas; dados salvos no aparelho
