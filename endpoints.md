# 📚 Documentação de Endpoints - API Pizzaria

**Base URL:** `http://localhost:3333`

---

## 📑 Índice

1. [Autenticação](#autenticação)
2. [Usuários](#usuários)
3. [Categorias](#categorias)
4. [Produtos](#produtos)
5. [Pedidos](#pedidos)
6. [Itens do Pedido](#itens-do-pedido)

---

## 🔐 Autenticação

Todos os endpoints (exceto POST `/users` e POST `/session`) requerem autenticação via token JWT no header:

```
Authorization: Bearer <token>
```

---

## 👥 Usuários

### POST `/users`
Criar um novo usuário.

**Status:** `201 Created`

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2025-12-18T10:30:00.000Z",
  "updatedAt": "2025-12-18T10:30:00.000Z"
}
```

**Validações:**
- `name`: Mínimo 3 caracteres (obrigatório)
- `email`: Formato válido de email (obrigatório)
- `password`: Mínimo 6 caracteres (obrigatório)

---

### POST `/session`
Autenticar usuário e obter token JWT.

**Status:** `200 OK`

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "STAFF"
  }
}
```

**Erros:**
- `400`: Email ou senha incorretos
- `404`: Usuário não encontrado

---

### GET `/me`
Obter dados do usuário autenticado.

**Status:** `200 OK`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2025-12-18T10:30:00.000Z",
  "updatedAt": "2025-12-18T10:30:00.000Z"
}
```

**Erros:**
- `401`: Token não fornecido ou inválido

---

## 🏷️ Categorias

### POST `/category`
Criar uma nova categoria (apenas ADMIN).

**Status:** `201 Created`

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Body:**
```json
{
  "name": "Pizzas Salgadas"
}
```

**Response:**
```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "Pizzas Salgadas",
  "createdAt": "2025-12-18T10:30:00.000Z",
  "updatedAt": "2025-12-18T10:30:00.000Z"
}
```

**Validações:**
- `name`: Mínimo 2 caracteres (obrigatório)

**Erros:**
- `401`: Não autenticado
- `403`: Não é administrador
- `400`: Validação falhou

---

### GET `/category`
Listar todas as categorias.

**Status:** `200 OK`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "name": "Pizzas Salgadas",
    "createdAt": "2025-12-18T10:30:00.000Z",
    "updatedAt": "2025-12-18T10:30:00.000Z"
  },
  {
    "id": "a1234567-89ab-cdef-0123-456789abcdef",
    "name": "Bebidas",
    "createdAt": "2025-12-18T11:00:00.000Z",
    "updatedAt": "2025-12-18T11:00:00.000Z"
  }
]
```

**Erros:**
- `401`: Não autenticado

---

## 🍕 Produtos

### POST `/product`
Criar um novo produto (apenas ADMIN).

**Status:** `201 Created`

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: multipart/form-data
```

**Body (FormData):**
- `name`: string - Nome do produto
- `price`: string - Preço em centavos (ex: "3500" para R$ 35,00)
- `description`: string - Descrição do produto
- `category_id`: string - UUID da categoria
- `file`: file - Imagem do produto (JPEG, JPG, PNG)

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3333/product \
  -H "Authorization: Bearer <token>" \
  -F "name=Pizza Margherita" \
  -F "price=3500" \
  -F "description=Pizza com molho de tomate, mozzarela e manjericão" \
  -F "category_id=f47ac10b-58cc-4372-a567-0e02b2c3d479" \
  -F "file=@/path/to/image.jpg"
```

**Response:**
```json
{
  "id": "d8b12345-6789-abcd-ef01-234567890abc",
  "name": "Pizza Margherita",
  "price": 3500,
  "description": "Pizza com molho de tomate, mozzarela e manjericão",
  "banner": "https://cloudinary.com/...",
  "disabled": false,
  "category_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "createdAt": "2025-12-18T10:30:00.000Z",
  "updatedAt": "2025-12-18T10:30:00.000Z"
}
```

**Validações:**
- `name`: Não vazio (obrigatório)
- `price`: Não vazio (obrigatório)
- `description`: Não vazio (obrigatório)
- `category_id`: Não vazio (obrigatório)
- `file`: JPEG, JPG ou PNG, máximo 4MB (obrigatório)

**Erros:**
- `401`: Não autenticado
- `403`: Não é administrador
- `400`: Validação falhou ou arquivo inválido

---

### GET `/products`
Listar todos os produtos com filtro opcional por `disabled`.

**Status:** `200 OK`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `disabled`: `true` | `false` (opcional, padrão: `false`)

**Exemplos:**
```
GET /products?disabled=false  → Produtos habilitados
GET /products?disabled=true   → Produtos desabilitados
GET /products                 → Produtos habilitados (padrão)
```

**Response:**
```json
[
  {
    "id": "d8b12345-6789-abcd-ef01-234567890abc",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Pizza com molho de tomate, mozzarela e manjericão",
    "banner": "https://cloudinary.com/...",
    "disabled": false,
    "category": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "name": "Pizzas Salgadas"
    },
    "createdAt": "2025-12-18T10:30:00.000Z",
    "updatedAt": "2025-12-18T10:30:00.000Z"
  }
]
```

**Erros:**
- `401`: Não autenticado

---

### GET `/category/product`
Listar produtos de uma categoria específica.

**Status:** `200 OK`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `category_id`: string (obrigatório) - UUID da categoria

**Exemplo:**
```
GET /category/product?category_id=f47ac10b-58cc-4372-a567-0e02b2c3d479
```

**Response:**
```json
[
  {
    "id": "d8b12345-6789-abcd-ef01-234567890abc",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Pizza com molho de tomate, mozzarela e manjericão",
    "banner": "https://cloudinary.com/...",
    "disabled": false,
    "category": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "name": "Pizzas Salgadas"
    },
    "createdAt": "2025-12-18T10:30:00.000Z",
    "updatedAt": "2025-12-18T10:30:00.000Z"
  },
  {
    "id": "e9c23456-78ab-cdef-0123-456789abcdef",
    "name": "Pizza Calabresa",
    "price": 3200,
    "description": "Pizza com calabresa e cebola",
    "banner": "https://cloudinary.com/...",
    "disabled": false,
    "category": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "name": "Pizzas Salgadas"
    },
    "createdAt": "2025-12-18T10:35:00.000Z",
    "updatedAt": "2025-12-18T10:35:00.000Z"
  }
]
```

**Erros:**
- `400`: `category_id` não fornecido
- `401`: Não autenticado

---

### DELETE `/product`
Deletar um produto (apenas ADMIN).

**Status:** `200 OK`

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Query Parameters:**
- `product_id`: string (obrigatório) - UUID do produto

**Exemplo:**
```
DELETE /product?product_id=d8b12345-6789-abcd-ef01-234567890abc
```

**Response:**
```json
{
  "message": "Produto deletado com sucesso"
}
```

**Erros:**
- `401`: Não autenticado
- `403`: Não é administrador
- `404`: Produto não encontrado

---

## 📋 Pedidos

### POST `/order`
Criar um novo pedido.

**Status:** `201 Created`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "table": 5,
  "name": "Cliente A"
}
```

**Response:**
```json
{
  "id": "12345678-90ab-cdef-0123-456789abcdef",
  "table": 5,
  "name": "Cliente A",
  "status": false,
  "draft": true,
  "createdAt": "2025-12-18T10:30:00.000Z",
  "updatedAt": "2025-12-18T10:30:00.000Z"
}
```

**Validações:**
- `table`: Número inteiro (obrigatório)
- `name`: String não vazia (obrigatório)

**Erros:**
- `400`: Validação falhou
- `401`: Não autenticado

---

### GET `/orders`
Listar pedidos com filtro opcional por `draft`.

**Status:** `200 OK`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `draft`: `true` | `false` (opcional, padrão: `false`)

**Exemplos:**
```
GET /orders?draft=false  → Pedidos enviados para cozinha
GET /orders?draft=true   → Pedidos em rascunho
GET /orders              → Pedidos enviados (padrão)
```

**Response:**
```json
[
  {
    "id": "12345678-90ab-cdef-0123-456789abcdef",
    "table": 5,
    "name": "Cliente A",
    "status": false,
    "draft": false,
    "items": [
      {
        "id": "item-001",
        "amount": 2,
        "product": {
          "id": "d8b12345-6789-abcd-ef01-234567890abc",
          "name": "Pizza Margherita",
          "price": 3500,
          "description": "Pizza com molho de tomate, mozzarela e manjericão",
          "banner": "https://cloudinary.com/..."
        }
      }
    ],
    "createdAt": "2025-12-18T10:30:00.000Z",
    "updatedAt": "2025-12-18T10:30:00.000Z"
  }
]
```

**Erros:**
- `401`: Não autenticado

---

### GET `/order/detail`
Obter detalhes completos de um pedido específico.

**Status:** `200 OK`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `order_id`: string (obrigatório) - UUID do pedido

**Exemplo:**
```
GET /order/detail?order_id=12345678-90ab-cdef-0123-456789abcdef
```

**Response:**
```json
{
  "id": "12345678-90ab-cdef-0123-456789abcdef",
  "table": 5,
  "name": "Cliente A",
  "status": false,
  "draft": false,
  "items": [
    {
      "id": "item-001",
      "amount": 2,
      "product": {
        "id": "d8b12345-6789-abcd-ef01-234567890abc",
        "name": "Pizza Margherita",
        "price": 3500,
        "description": "Pizza com molho de tomate, mozzarela e manjericão",
        "banner": "https://cloudinary.com/..."
      }
    },
    {
      "id": "item-002",
      "amount": 1,
      "product": {
        "id": "e9c23456-78ab-cdef-0123-456789abcdef",
        "name": "Pizza Calabresa",
        "price": 3200,
        "description": "Pizza com calabresa e cebola",
        "banner": "https://cloudinary.com/..."
      }
    }
  ],
  "createdAt": "2025-12-18T10:30:00.000Z",
  "updatedAt": "2025-12-18T10:30:00.000Z"
}
```

**Erros:**
- `400`: `order_id` não fornecido
- `401`: Não autenticado
- `404`: Pedido não encontrado

---

### PUT `/order/send`
Enviar pedido para a cozinha (marca como não-rascunho).

**Status:** `200 OK`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "order_id": "12345678-90ab-cdef-0123-456789abcdef",
  "name": "Cliente A"
}
```

**Response:**
```json
{
  "id": "12345678-90ab-cdef-0123-456789abcdef",
  "table": 5,
  "name": "Cliente A",
  "status": false,
  "draft": false,
  "createdAt": "2025-12-18T10:30:00.000Z",
  "updatedAt": "2025-12-18T10:35:00.000Z"
}
```

**Validações:**
- `order_id`: String não vazia (obrigatório)
- `name`: String não vazia (obrigatório)

**Erros:**
- `400`: Validação falhou
- `401`: Não autenticado
- `404`: Pedido não encontrado

---

### PUT `/order/finish`
Marcar pedido como finalizado (pronto).

**Status:** `200 OK`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "order_id": "12345678-90ab-cdef-0123-456789abcdef"
}
```

**Response:**
```json
{
  "id": "12345678-90ab-cdef-0123-456789abcdef",
  "table": 5,
  "name": "Cliente A",
  "status": true,
  "draft": false,
  "createdAt": "2025-12-18T10:30:00.000Z",
  "updatedAt": "2025-12-18T10:40:00.000Z"
}
```

**Validações:**
- `order_id`: String não vazia (obrigatório)

**Erros:**
- `400`: Validação falhou
- `401`: Não autenticado
- `404`: Pedido não encontrado

---

### DELETE `/order`
Deletar um pedido completo.

**Status:** `200 OK`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `order_id`: string (obrigatório) - UUID do pedido

**Exemplo:**
```
DELETE /order?order_id=12345678-90ab-cdef-0123-456789abcdef
```

**Response:**
```json
{
  "message": "Pedido deletado com sucesso"
}
```

**Erros:**
- `400`: `order_id` não fornecido
- `401`: Não autenticado
- `404`: Pedido não encontrado

---

## 🛒 Itens do Pedido

### POST `/order/add`
Adicionar um item (produto) ao pedido.

**Status:** `201 Created`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "order_id": "12345678-90ab-cdef-0123-456789abcdef",
  "product_id": "d8b12345-6789-abcd-ef01-234567890abc",
  "amount": 2
}
```

**Response:**
```json
{
  "id": "item-001",
  "amount": 2,
  "product": {
    "id": "d8b12345-6789-abcd-ef01-234567890abc",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Pizza com molho de tomate, mozzarela e manjericão",
    "banner": "https://cloudinary.com/..."
  },
  "order_id": "12345678-90ab-cdef-0123-456789abcdef",
  "createdAt": "2025-12-18T10:30:00.000Z",
  "updatedAt": "2025-12-18T10:30:00.000Z"
}
```

**Validações:**
- `order_id`: String não vazia (obrigatório)
- `product_id`: String não vazia (obrigatório)
- `amount`: Número inteiro, mínimo 1 (obrigatório)

**Erros:**
- `400`: Validação falhou
- `401`: Não autenticado
- `404`: Pedido ou produto não encontrado

---

### DELETE `/order/remove`
Remover um item do pedido.

**Status:** `200 OK`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `item_id`: string (obrigatório) - UUID do item

**Exemplo:**
```
DELETE /order/remove?item_id=item-001
```

**Response:**
```json
{
  "message": "Item removido com sucesso"
}
```

**Erros:**
- `400`: `item_id` não fornecido
- `401`: Não autenticado
- `404`: Item não encontrado

---

## 🧪 Exemplos de Fluxo Completo

### Fluxo 1: Criar Pedido e Adicionar Itens

```bash
# 1. Criar pedido
curl -X POST http://localhost:3333/order \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "table": 5,
    "name": "Cliente A"
  }'

# Resposta com order_id: 12345678-90ab-cdef-0123-456789abcdef

# 2. Adicionar item ao pedido
curl -X POST http://localhost:3333/order/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "12345678-90ab-cdef-0123-456789abcdef",
    "product_id": "d8b12345-6789-abcd-ef01-234567890abc",
    "amount": 2
  }'

# 3. Enviar pedido para cozinha
curl -X PUT http://localhost:3333/order/send \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "12345678-90ab-cdef-0123-456789abcdef",
    "name": "Cliente A"
  }'

# 4. Marcar pedido como pronto
curl -X PUT http://localhost:3333/order/finish \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "12345678-90ab-cdef-0123-456789abcdef"
  }'

# 5. Deletar pedido (opcional)
curl -X DELETE http://localhost:3333/order?order_id=12345678-90ab-cdef-0123-456789abcdef \
  -H "Authorization: Bearer <token>"
```

### Fluxo 2: Listagem e Gerenciamento

```bash
# Listar todas as categorias
curl -X GET http://localhost:3333/category \
  -H "Authorization: Bearer <token>"

# Listar produtos da categoria de pizzas
curl -X GET http://localhost:3333/category/product?category_id=f47ac10b-58cc-4372-a567-0e02b2c3d479 \
  -H "Authorization: Bearer <token>"

# Listar pedidos em rascunho
curl -X GET http://localhost:3333/orders?draft=true \
  -H "Authorization: Bearer <token>"

# Listar pedidos enviados para cozinha
curl -X GET http://localhost:3333/orders?draft=false \
  -H "Authorization: Bearer <token>"

# Obter detalhes do pedido
curl -X GET http://localhost:3333/order/detail?order_id=12345678-90ab-cdef-0123-456789abcdef \
  -H "Authorization: Bearer <token>"
```

---

## 🔄 Status Codes Comuns

| Código | Significado |
|--------|------------|
| `200` | Sucesso (GET, PUT, DELETE) |
| `201` | Criado com sucesso (POST) |
| `400` | Requisição inválida (validação falhou) |
| `401` | Não autenticado (token ausente/inválido) |
| `403` | Não autorizado (permissão insuficiente) |
| `404` | Recurso não encontrado |
| `500` | Erro interno do servidor |

---

**Última atualização:** Dezembro 2025
