# Como mandar para o GitHub

Crie um repositorio vazio no GitHub chamado, por exemplo, `meu-caixa`.

No terminal, dentro desta pasta, rode:

```bash
git init
git add .
git commit -m "Primeira versao do Meu Caixa"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/meu-caixa.git
git push -u origin main
```

Troque `SEU_USUARIO` pelo seu usuario do GitHub.

## O que vai para o Git

- Codigo do app web: `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `sw.js` e icones.
- Codigo do APK Android: pasta `android-app`.
- Arquivos de build/configuracao: `package.json`, `build.gradle`, `settings.gradle`, `gradle.properties`.
- Guia de hospedagem e uso.

## O que nao vai

- APKs prontos da pasta `dist`.
- Android SDK, JDK e Gradle baixados nesta maquina.
- Zips, logs e cloudflared.
- Chave de assinatura e senha do APK.

## Para hospedar online

No Cloudflare Pages, use:

```text
Build command: npm run build
Build output directory: public
```

Assim o site publicado fica limpo, sem mandar os arquivos do Android para a hospedagem.

Se o Cloudflare estiver usando Workers com o comando `npx wrangler deploy`, o arquivo `wrangler.jsonc` ja aponta para `public` e roda `npm run build` antes do deploy.

No seu PowerShell, se `npm run build` for bloqueado, use `npm.cmd run build`. Em hospedagens como Cloudflare/GitHub, `npm run build` funciona normal.
