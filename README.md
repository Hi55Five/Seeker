# seeker. — configuração do Firebase

O site funciona sozinho com um catálogo de exemplo (só leitura). Pra ativar
o **modo desenvolvedor** (editar links, adicionar/remover peças) e usar o
Firestore como banco de verdade, siga os passos abaixo.

## 1. Criar o projeto

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) e crie um projeto novo.
2. Em **Build > Firestore Database**, clique em "Criar banco de dados" e escolha **modo produção**.
3. Em **Build > Authentication > Sign-in method**, ative o provedor **E-mail/senha**.
4. Em **Authentication > Users**, clique em "Add user" e crie o seu login de administrador (esse e-mail/senha é o que você vai usar no botão de modo desenvolvedor do site).
5. Em **Configurações do projeto (ícone de engrenagem) > Seus apps**, clique no ícone Web (`</>`) pra criar um app web e copiar o objeto `firebaseConfig`.

## 2. Colar a configuração

Abra o arquivo `firebase-config.js` e troque os valores de `firebaseConfig`
pelos que você copiou no passo anterior. Enquanto `apiKey` estiver como
`"SUA_API_KEY"`, o site continua no catálogo de exemplo e o botão de modo
desenvolvedor fica desativado — isso é esperado.

## 3. Regras de segurança do Firestore

Por padrão, o Firestore em modo produção bloqueia tudo. Cole estas regras em
**Firestore Database > Regras**, ajustando pra liberar leitura pra todo mundo
(vitrine pública) e escrita só pra quem estiver logado (modo desenvolvedor):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /meta/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 4. Como funciona o ID interno

Cada produto criado pelo modo desenvolvedor recebe um código sequencial
(`SK-0001`, `SK-0002`, …), guardado no campo `code` do documento. Esse
contador fica salvo em `meta/counters` no Firestore — não precisa mexer
nele manualmente. O código aparece:

- no painel de desenvolvedor, em cada linha da lista (e no formulário de edição);
- discretamente no rodapé de cada card da vitrine pública — útil pra localizar
  rápido uma peça específica se alguém perguntar por ela.

## 5. Usando o modo desenvolvedor

1. No site publicado, clique no ícone `>_` no canto superior direito do header.
2. Faça login com o e-mail/senha criados no passo 1.4.
3. Use **+ Novo produto** pra adicionar uma peça (título, categoria, loja,
   preço e um link direto **ou** um termo de busca — pelo menos um dos dois).
4. Pra editar ou excluir, clique em **Editar** na lista lateral.

Tudo é salvo em tempo real no Firestore — qualquer pessoa com a página
aberta vê as mudanças aparecerem na vitrine sem precisar recarregar.

## Hospedagem gratuita

Como é um site estático, dá pra publicar de graça em **Firebase Hosting**,
**Vercel** ou **GitHub Pages** — basta subir os 4 arquivos
(`index.html`, `style.css`, `script.js`, `firebase-config.js`) tal como estão.
