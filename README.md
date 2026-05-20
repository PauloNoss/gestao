# Meu Caixa

Aplicativo pessoal de financas para celular, com dashboard, lancamentos rapidos, IA local para interpretar texto/voz/foto, lista de desejos, assinaturas, contatos/emprestimos, previsoes e modo privado.

## Rodar no computador

```bash
npm start
```

Depois abra:

```text
http://127.0.0.1:4173
```

## Gerar versao web para hospedar

```bash
npm run build
```

No PowerShell do Windows, se o `npm` for bloqueado por politica de scripts, use:

```bash
npm.cmd run build
```

A pasta gerada para hospedagem e:

```text
public
```

Use essa pasta como saida no Cloudflare Pages, Netlify, Vercel ou GitHub Pages.

## Hospedar pelo Cloudflare Pages

Configure assim:

```text
Build command: npm run build
Build output directory: public
```

Os dados financeiros ficam salvos no aparelho/navegador de cada pessoa. O site hospedado fica acessivel pelo link, mas abre vazio para quem nunca usou.

## Subir no GitHub

```bash
git init
git add .
git commit -m "Primeira versao do Meu Caixa"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/meu-caixa.git
git push -u origin main
```

Antes de subir, confira se nao aparecem arquivos grandes ou sensiveis:

```bash
git status --short
```

Nao devem entrar no Git: APKs, SDK Android, JDK, Gradle baixado, logs, zips, keystore e `android-app/signing.properties`.

## APK Android

O projeto Android fica em `android-app`. Para assinar APK localmente, copie:

```text
android-app/signing.example.properties
```

para:

```text
android-app/signing.properties
```

e preencha os dados da sua chave. O arquivo real de assinatura fica fora do Git.
