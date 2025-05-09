# ShipSmart Frontend

Frontend do sistema de gestão de contatos desenvolvido com **Vue 3**, **Vite**, **TailwindCSS**, **Pinia** e **shadcn-vue**.

Este projeto se comunica com a API Laravel (backend) para realizar cadastro, listagem, edição, exclusão e exportação de contatos, além de integração com fila de e-mail e auto-preenchimento de endereço via **ViaCEP**.

---

## 🚀 Tecnologias

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn-vue](https://shadcn-vue.com/)
- [Pinia (store)](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vue The Mask](https://vue-the-mask.github.io/)
- [Axios](https://axios-http.com/)

---

## ⚙️ Instalação

```bash
git clone https://github.com/seu-usuario/shipsmart-frontend.git
cd shipsmart-frontend

npm install
npm run dev
```

---

## 🔐 Variáveis de ambiente

Crie um arquivo `.env` com:

```env
VITE_API_URL=http://localhost:8000/api
```

> A URL deve apontar para o backend Laravel.

---

## 🧩 Funcionalidades

- ✅ Cadastro de contatos com múltiplos endereços
- ✅ Máscara de CEP e preenchimento via ViaCEP
- ✅ Seleção de estado (UF) via enum
- ✅ Edição e exclusão com modal de confirmação
- ✅ Indicadores de quantidade por status (total, com telefone, com endereço)
- ✅ Exportação para Excel via backend
- ✅ Toasts de feedback (sucesso e erro)
- ✅ Internacionalização (i18n: português e inglês)
- ✅ Layout responsivo e componentes reutilizáveis com shadcn

---

## 📁 Estrutura

```
src/
├─ components/
│  └─ ui/            # Componentes reutilizáveis com shadcn
├─ pages/            # Páginas como Contatos.vue
├─ stores/           # Pinia store (ex: useContatoStore.ts)
├─ lib/              # axios, utils, etc
├─ enums/            # Enums como Estados.ts
├─ assets/           # Estilos base (Tailwind)
```

---

## 📦 Build

Para gerar o build de produção:

```bash
npm run build
```
