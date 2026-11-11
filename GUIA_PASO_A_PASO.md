# 🧸 Guía paso a paso: API de usuarios con Express + Prisma 8 + Supabase

> **Para quién es esta guía:** para personas que empiezan **desde cero**.
> Todo está explicado como si tuvieras 5 años 🙂. No es por subestimarte: así nadie se queda atrás.
>
> En cada paso vas a encontrar:
>
> - 🤔 **¿Qué es?** → qué estamos haciendo
> - ❓ **¿Por qué?** → por qué hace falta
> - 🎯 **¿Para qué?** → qué conseguimos con eso
> - ⏰ **¿Cuándo?** → en qué momento se hace (y si se repite)
> - 🛠️ **¿Cómo?** → los comandos y el código exactos

---

## 📚 Índice

0. [¿Qué vamos a construir? (el cuento del restaurante)](#0-qué-vamos-a-construir-el-cuento-del-restaurante)
1. [Las herramientas que necesitas](#1-las-herramientas-que-necesitas)
2. [Crear el proyecto](#2-crear-el-proyecto)
3. [Instalar las librerías](#3-instalar-las-librerías)
4. [Crear la base de datos en Supabase](#4-crear-la-base-de-datos-en-supabase)
5. [Guardar los secretos: `.env` y `.gitignore`](#5-guardar-los-secretos-env-y-gitignore)
6. [Prisma 8: el traductor con la base de datos](#6-prisma-8-el-traductor-con-la-base-de-datos)
7. [El servidor: `index.js`](#7-el-servidor-indexjs)
8. [Las carpetas (la arquitectura por capas)](#8-las-carpetas-la-arquitectura-por-capas)
9. [El Model: el que va a la despensa](#9-el-model-el-que-va-a-la-despensa)
10. [El servicio de Token: la pulsera de la discoteca](#10-el-servicio-de-token-la-pulsera-de-la-discoteca)
11. [El Service de usuario: el cocinero](#11-el-service-de-usuario-el-cocinero)
12. [El Controller: el camarero](#12-el-controller-el-camarero)
13. [El Middleware: el portero](#13-el-middleware-el-portero)
14. [El Router: el recepcionista](#14-el-router-el-recepcionista)
15. [¡A probarlo!](#15-a-probarlo)
16. [Errores típicos y cómo arreglarlos](#16-errores-típicos-y-cómo-arreglarlos)
17. [Diccionario para no perderse](#17-diccionario-para-no-perderse)
18. [⚠️ Diferencias con el código de clase](#18-️-diferencias-con-el-código-de-clase)
19. [Retos para practicar](#19-retos-para-practicar)

---

## 0. ¿Qué vamos a construir? (el cuento del restaurante)

Vamos a construir una **API**. Una API es un programa **sin pantalla**: no tiene botones ni colores. Otros programas (una web, una app del móvil, Postman...) le **piden cosas** y ella **responde**.

Nuestra API sabe hacer 4 cosas:

| Qué hace | Dirección (ruta) | ¿Necesita pulsera (token)? |
|---|---|---|
| Registrar un usuario nuevo | `POST /api/user/register` | No |
| Iniciar sesión (login) y darte una pulsera | `POST /api/user/login` | No |
| Buscar un usuario por su email | `GET /api/user/getuser?email=...` | No |
| Ver **todos** los usuarios | `GET /api/user/getallusers` | **Sí** 🔒 |

### 🍝 El cuento del restaurante

Imagina que nuestra API es un **restaurante**. Cada parte del código es una persona que trabaja ahí:

| Persona del restaurante | En el código se llama | Archivo | Qué hace |
|---|---|---|---|
| 🚪 El edificio | Servidor Express | `index.js` | Abre las puertas y espera clientes |
| 🧑‍💼 El recepcionista | **Router** | `src/routers/user.route.js` | "¿Quieres registrarte? Pasa a esa mesa" |
| 💪 El portero | **Middleware** | `src/middleware/guard.middleware.js` | "¿Tienes pulsera? Si no, no entras a la zona VIP" |
| 🧑‍🍳 El camarero | **Controller** | `src/controllers/user.controllers.js` | Toma tu pedido y te trae el plato |
| 👨‍🍳 El cocinero | **Service** | `src/services/user.service.js` | Prepara la comida: decide, comprueba, calcula |
| 🎟️ La máquina de pulseras | **Token service** | `src/services/token/token.service.js` | Fabrica y revisa pulseras (tokens) |
| 📦 El ayudante de despensa | **Model** | `src/models/user.model.js` | El ÚNICO que entra a la despensa a guardar y sacar cosas |
| 🗣️ El traductor | **Prisma** | `src/prisma/...` | Traduce lo que dice el ayudante al idioma de la despensa (SQL) |
| 🏬 La despensa | **Base de datos** | Supabase (en internet) | Donde se guardan los usuarios para siempre |

Así viaja un pedido (una **petición**) por el restaurante:

```
  Cliente (Postman / navegador / web)
        │  "Quiero ver todos los usuarios"
        ▼
  index.js ──► Router ──► Middleware ──► Controller ──► Service ──► Model ──► Prisma ──► Supabase
 (edificio)  (recepción)  (portero)     (camarero)    (cocinero)  (despensa) (traductor)  (base de datos)
        ▲                                                                                   │
        └───────────────────────────── la respuesta vuelve por el mismo camino ◄────────────┘
```

❓ **¿Por qué tanta gente y no una sola persona que lo haga todo?**
Porque si una persona lo hace todo, cuando algo falla no sabes dónde mirar. Si cada uno tiene **un solo trabajo**, cuando la comida sale mala sabes que hay que hablar con el cocinero, no con el recepcionista. En programación esto se llama **separación de responsabilidades**.

---

## 1. Las herramientas que necesitas

🤔 **¿Qué es?** Instalar los programas que vamos a usar.
❓ **¿Por qué?** Igual que para cocinar necesitas cocina y ollas, para programar necesitas herramientas.
⏰ **¿Cuándo?** **Una sola vez** en tu ordenador. Para los siguientes proyectos ya las tendrás.

| Herramienta | ¿Para qué sirve? | Dónde se consigue |
|---|---|---|
| **Node.js** (versión 24 o más nueva) | Es el "motor" que hace funcionar JavaScript fuera del navegador. Trae `npm`, la "tienda" de librerías | https://nodejs.org → botón **LTS** |
| **Visual Studio Code** | El editor donde escribimos el código | https://code.visualstudio.com |
| **Git** | Guarda "fotos" (versiones) de tu código | https://git-scm.com |
| **Postman** o la extensión **Thunder Client** de VS Code | Para hacerle pedidos a nuestra API y probarla | https://www.postman.com |
| Una cuenta en **Supabase** | Nos regala una base de datos PostgreSQL en internet | https://supabase.com |

🛠️ **¿Cómo compruebo que Node está bien instalado?** Abre una terminal (en VS Code: menú *Terminal → New Terminal*) y escribe:

```bash
node -v
npm -v
```

Si ves números (por ejemplo `v24.x.x`), ¡perfecto! ✅

> 💡 **¿Por qué Node 24?** Porque nuestro proyecto tiene un archivo `.ts` (TypeScript) que Node tiene que leer directamente. Las versiones viejas de Node **no saben** hacerlo y darán error.

---

## 2. Crear el proyecto

### 2.1 Crear la carpeta

🤔 **¿Qué es?** Una carpeta vacía donde vivirá todo el proyecto.
⏰ **¿Cuándo?** Al principio de cada proyecto nuevo.
🛠️ **¿Cómo?**

```bash
mkdir prisma_supabase
cd prisma_supabase
code .
```

- `mkdir` = *make directory* = "crea una carpeta".
- `cd` = *change directory* = "métete en esa carpeta".
- `code .` = "abre VS Code aquí" (el punto `.` significa "aquí donde estoy").

### 2.2 Crear el `package.json`

🤔 **¿Qué es?** El `package.json` es el **DNI del proyecto**: cómo se llama, qué librerías usa y qué comandos tiene.
❓ **¿Por qué?** Sin él, `npm` no sabe que esto es un proyecto y no puede instalar nada.
🛠️ **¿Cómo?**

```bash
npm init -y
```

(`-y` significa "sí a todo", para que no te haga preguntas.)

### 2.3 Decirle que usamos `import` (módulos modernos)

Abre `package.json` y añade la línea `"type": "module"`. También cambia la parte de `"scripts"`. Debe quedar parecido a esto:

```json
{
  "name": "prisma_supabase",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "contract:emit": "prisma contract emit"
  }
}
```

❓ **¿Por qué `"type": "module"`?** Hay dos formas de traer código de otro archivo en JavaScript:

- La vieja: `const express = require("express")`
- La moderna: `import express from "express"` ← **la que usamos**

Con `"type": "module"` le decimos a Node: "en este proyecto hablamos el idioma moderno".

❓ **¿Qué son los `scripts`?** Son **atajos**. En vez de escribir comandos largos, escribes `npm run dev` y npm ejecuta lo que pusiste ahí.

| Atajo | Qué hace | Cuándo usarlo |
|---|---|---|
| `npm run dev` | Arranca el servidor y lo **reinicia solo** cada vez que guardas un archivo | Mientras programas (casi siempre) |
| `npm start` | Arranca el servidor una vez, sin reinicios | Cuando el proyecto ya está terminado / en producción |
| `npm run contract:emit` | Le dice a Prisma "he cambiado mis tablas, actualízate" | Cada vez que cambies `contract.prisma` |

---

## 3. Instalar las librerías

🤔 **¿Qué es una librería?** Código que **otra persona ya escribió** y que nosotros reutilizamos. Como comprar pan en vez de hornearlo tú.
⏰ **¿Cuándo?** Una vez al empezar. (Y si clonas un proyecto de otra persona, ejecutas `npm install` y se instalan todas de golpe.)

🛠️ **¿Cómo?**

```bash
npm install express dotenv bcrypt jsonwebtoken
npm install -D nodemon
```

| Librería | ¿Qué es? (versión 5 años) | ¿Para qué la usamos? |
|---|---|---|
| `express` | El **edificio** del restaurante | Crear el servidor y las rutas |
| `dotenv` | Una **caja fuerte** que lee el archivo `.env` | Leer contraseñas y claves sin escribirlas en el código |
| `bcrypt` | Una **picadora de carne** para contraseñas | Convertir `"1234"` en algo ilegible antes de guardarlo |
| `jsonwebtoken` | La **máquina de pulseras** | Crear y comprobar tokens (JWT) |
| `nodemon` (con `-D`) | Un **ayudante que vigila** tus archivos | Reiniciar el servidor solo cuando guardas |

❓ **¿Qué significa `-D`?** "Development" (desarrollo). Son herramientas que **solo usas tú mientras programas**, no las necesita el servidor cuando ya está publicado. Se guardan en `devDependencies`.

📁 Después de instalar aparece la carpeta `node_modules`. Ahí está el código de las librerías. **Es enorme y nunca se sube a GitHub** (luego veremos cómo evitarlo).

> 🧩 **Prisma lo instalamos en el paso 6**, porque tiene su propio asistente.

---

## 4. Crear la base de datos en Supabase

🤔 **¿Qué es Supabase?** Una empresa que te presta una **base de datos PostgreSQL** en internet, gratis para empezar.
❓ **¿Por qué no guardar los usuarios en una variable?** Porque las variables viven en la memoria y **se borran cuando apagas el servidor**. La base de datos es como un cuaderno: lo que escribes **se queda para siempre**.
⏰ **¿Cuándo?** Una vez por proyecto.

🛠️ **¿Cómo?**

1. Entra en https://supabase.com y crea una cuenta (puedes usar GitHub).
2. Pulsa **New project**.
3. Ponle un nombre y escribe una **Database Password**. 📝 **¡Apúntala!** La vas a necesitar y Supabase no te la vuelve a enseñar.
4. Elige la región más cercana (por ejemplo, Europa) y pulsa **Create**. Espera 1-2 minutos.
5. Arriba pulsa el botón **Connect**.
6. Busca la opción **Session pooler** y copia la dirección (la *connection string*). Se ve así:

```
postgresql://postgres.abcdefghijk:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
```

7. Cambia `[YOUR-PASSWORD]` por la contraseña que apuntaste en el punto 3 (**sin** los corchetes `[ ]`).

❓ **¿Qué es esa dirección tan rara?** Es la **dirección de la despensa** con la llave incluida. Tiene estas partes:

```
postgresql://  USUARIO  :  CONTRASEÑA  @  SERVIDOR  :  PUERTA  /  NOMBRE_DE_LA_BD
```

❓ **¿Por qué "Session pooler" y no "Direct connection"?** La conexión directa a veces no funciona en las redes de casa (usa IPv6). El *Session pooler* funciona en cualquier red (IPv4). Usa la del puerto **5432**.

> 🚨 **Esta dirección es SECRETA.** Quien la tenga puede leer y **borrar** toda tu base de datos. Nunca la pongas en el código ni la subas a GitHub. Por eso existe el siguiente paso.

---

## 5. Guardar los secretos: `.env` y `.gitignore`

### 5.1 El archivo `.env` (la caja fuerte)

🤔 **¿Qué es?** Un archivo de texto donde guardamos los secretos: contraseñas, llaves, direcciones.
❓ **¿Por qué?** Para que los secretos **no estén escritos dentro del código**. El código se comparte; los secretos no.
🎯 **¿Para qué?** Para que cada persona tenga **sus propios** secretos sin tocar el código. Tu compañero usa su base de datos, tú la tuya, y el código es el mismo.
⏰ **¿Cuándo?** Al empezar el proyecto, y cada vez que necesites un secreto nuevo.

🛠️ **¿Cómo?** En la raíz del proyecto (al lado de `package.json`) crea un archivo llamado exactamente **`.env`** (con el punto delante):

```env
DATABASE_URL="postgresql://postgres.abcdefghijk:TU_CONTRASEÑA@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
tokenKey="escribe-aqui-una-frase-larga-y-secreta-que-nadie-adivine-123"
PORT=3000
```

| Variable | ¿Qué es? |
|---|---|
| `DATABASE_URL` | La dirección de la despensa (la que copiaste de Supabase) |
| `tokenKey` | El **sello secreto** con el que firmamos las pulseras. Si alguien lo descubre, podría fabricar pulseras falsas. Invéntate una frase larga |
| `PORT` | El número de la "puerta" por donde entra la gente a nuestro servidor |

¿Cómo se usa en el código? Así:

```js
import "dotenv/config";          // abre la caja fuerte (lee el .env)
process.env.tokenKey             // saca de la caja fuerte el valor de tokenKey
```

> ⚠️ El nombre tiene que coincidir **letra por letra**, mayúsculas incluidas. `tokenKey` ≠ `TokenKey` ≠ `tokenkey`.

### 5.2 El `.env.example` (el molde vacío)

🤔 **¿Qué es?** Una **copia del `.env` pero sin los secretos de verdad**.
🎯 **¿Para qué?** Para que quien descargue tu proyecto sepa **qué variables tiene que rellenar**. Este sí se sube a GitHub.

```env
# Copia este archivo, llámalo .env y pon tus valores reales
DATABASE_URL="postgresql://usuario:contraseña@servidor:5432/postgres"
tokenKey="tu-clave-secreta-para-firmar-tokens"
PORT=3000
```

### 5.3 El `.gitignore` (la lista de "esto no se sube")

🤔 **¿Qué es?** Una lista de archivos y carpetas que **Git debe ignorar** (no guardar, no subir).
❓ **¿Por qué?** Para no subir a internet los secretos (`.env`) ni la carpeta gigante `node_modules` (se puede regenerar con `npm install`).
⏰ **¿Cuándo?** **ANTES** del primer `git add`. Si subes un secreto aunque sea una vez, queda en el historial para siempre.

🛠️ **¿Cómo?** Crea el archivo `.gitignore`:

```gitignore
node_modules/
dist/

# secretos: cualquier archivo que empiece por .env...
.env
.env.*
# ...excepto el molde, que sí queremos compartir
!.env.example
```

> 🆘 **¿Y si ya subí un secreto a GitHub?** Borrarlo del repo **no basta** (sigue en el historial). Hay que **cambiar la contraseña**: en Supabase ve a *Project Settings → Database → Reset database password*, y luego actualiza tu `.env`.

---

## 6. Prisma 8: el traductor con la base de datos

🤔 **¿Qué es Prisma?** Es un **ORM**: un traductor. La base de datos habla **SQL** (`SELECT * FROM "User" WHERE email = '...'`). Nosotros hablamos **JavaScript**. Prisma traduce:

```js
// Nosotros escribimos esto (JavaScript):
db.orm.public.User.where({ email: "ana@mail.com" }).first()

// Prisma lo convierte en esto (SQL) y se lo manda a la base de datos:
// SELECT * FROM "User" WHERE email = 'ana@mail.com' LIMIT 1
```

❓ **¿Por qué no escribir SQL directamente?** Se puede, pero con Prisma: el editor te **autocompleta** los nombres, te avisa si te equivocas, y no tienes que aprender SQL el primer día.

### 6.1 Instalar e inicializar Prisma

⏰ **¿Cuándo?** Una vez por proyecto.
🛠️ **¿Cómo?**

```bash
npm install -D prisma@8.0.0-rc.33
npx prisma orm init --target postgres --authoring psl
```

- La primera línea instala la herramienta de Prisma (la "CLI": comandos para la terminal). Ponemos la versión exacta para que todos tengamos **la misma** que en clase.
- `npx` = "ejecuta una herramienta que está instalada en este proyecto".
- `orm init` = "prepárame un proyecto de Prisma".
- `--target postgres` = "mi base de datos es PostgreSQL" (Supabase usa PostgreSQL).
- `--authoring psl` = "quiero describir mis tablas en lenguaje Prisma (PSL)".

Esto **crea solo** varios archivos y carpetas:

| Archivo | ¿Qué es? | ¿Lo toco yo? |
|---|---|---|
| `prisma.config.ts` | Le dice a Prisma dónde están las tablas y la dirección de la BD | Casi nunca |
| `src/prisma/contract.prisma` | **El plano de tus tablas** ✏️ | **Sí, aquí escribes tú** |
| `src/prisma/db.ts` | La **conexión** a la base de datos que usaremos en el código | No |
| `src/prisma/contract.json` | El plano "compilado" para el programa | **No** (se genera solo) |
| `src/prisma/contract.d.ts` | El plano "compilado" para que VS Code autocomplete | **No** (se genera solo) |
| `.env.example`, `tsconfig.json` | Molde de secretos y configuración de TypeScript | No |

> 💡 Si `init` te pregunta algo, acepta lo que propone. Si después de `init` tu `package.json` no tiene `@prisma/orm-postgres` en `dependencies` y `@prisma/cli-engine` en `devDependencies`, instálalos: `npm install @prisma/orm-postgres` y `npm install -D @prisma/cli-engine`.

Mira cómo queda `prisma.config.ts` (no hace falta cambiar nada):

```ts
import 'dotenv/config';                                  // abre la caja fuerte (.env)
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./src/prisma/contract.prisma",           // dónde está el plano de las tablas
    db: {
      connection: process.env['DATABASE_URL']!,         // la dirección de la despensa
    },
  }),
});
```

### 6.2 Dibujar el plano de las tablas: `contract.prisma`

🤔 **¿Qué es?** El **plano** de tu base de datos. Como el plano de una casa, pero dice qué **tablas** hay y qué **columnas** tiene cada una.
❓ **¿Por qué?** Porque la base de datos necesita saber de antemano qué forma tiene la información. No puedes guardar un usuario si no existe la "estantería" de usuarios.
⏰ **¿Cuándo?** Al principio, y **cada vez** que quieras una tabla o columna nueva.

🛠️ **¿Cómo?** Abre `src/prisma/contract.prisma` y escribe:

```prisma
// use prisma-8

model User {
  id        Int                @id @default(autoincrement())
  email     String             @unique
  username  String?
  name      String?
  password  String?
  posts     Post[]
  createdAt DateTime           @default(now()) @onCreate(now())
  updatedAt temporal.UpdatedAt
}

model Post {
  id        Int                @id @default(autoincrement())
  title     String
  content   String?
  author    User               @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime           @default(now()) @onCreate(now())
  updatedAt temporal.UpdatedAt
}
```

🧸 **Explicado palabra por palabra:**

Piensa en una tabla como en una **hoja de Excel**. `model User` = "quiero una hoja que se llame User". Cada línea de dentro es una **columna**:

| Línea | Significa |
|---|---|
| `model User { ... }` | Crea una tabla llamada `User` |
| `id Int` | Una columna `id` que guarda números enteros (`Int` = *integer* = entero) |
| `@id` | Esta columna es el **número de DNI** de cada fila: nunca se repite y sirve para identificarla |
| `@default(autoincrement())` | No hace falta que lo pongas tú: la BD pone 1, 2, 3, 4... sola |
| `email String` | Una columna de texto (`String` = texto) |
| `@unique` | **No puede haber dos usuarios con el mismo email** |
| `username String?` | El `?` significa **opcional**: puede quedar vacío (`null`) |
| `password String?` | Aquí guardaremos la contraseña **ya picada** con bcrypt (nunca la de verdad) |
| `posts Post[]` | "Un usuario puede tener **muchos** posts". Los `[]` significan "lista" |
| `createdAt DateTime @default(now())` | Fecha de creación; se pone sola con la hora actual |
| `updatedAt temporal.UpdatedAt` | Fecha de la última modificación; Prisma la actualiza sola |
| `author User @relation(fields: [authorId], references: [id])` | "Cada post pertenece a **un** usuario. Para saber a cuál, mira la columna `authorId` y búscalo por su `id`" |
| `authorId Int` | El `id` del usuario que escribió el post |

🎯 **La relación en dibujo:**

```
   User                       Post
 ┌────┬──────────────┐      ┌────┬───────────┬──────────┐
 │ id │ email        │      │ id │ title     │ authorId │
 ├────┼──────────────┤      ├────┼───────────┼──────────┤
 │ 1  │ ana@mail.com │◄─────┤ 1  │ Hola      │    1     │
 │ 2  │ leo@mail.com │◄──┬──┤ 2  │ Mi perro  │    2     │
 └────┴──────────────┘   └──┤ 3  │ Otro post │    2     │
                            └────┴───────────┴──────────┘
   Ana tiene 1 post. Leo tiene 2 posts.  (relación "uno a muchos")
```

### 6.3 "Compilar" el plano: `contract emit`

🤔 **¿Qué es?** Convertir tu plano (`contract.prisma`) en los archivos que entiende el programa (`contract.json` y `contract.d.ts`).
❓ **¿Por qué?** Tu código no lee el `.prisma`; lee el `.json`. Si no ejecutas esto, el código no se entera de tus cambios.
⏰ **¿Cuándo?** **Cada vez** que cambies `contract.prisma`.
🛠️ **¿Cómo?**

```bash
npx prisma contract emit
```

(o el atajo que pusimos: `npm run contract:emit`)

### 6.4 Construir las tablas en Supabase: `db init` / `db update`

🤔 **¿Qué es?** Hasta ahora el plano está **solo en tu ordenador**. Este paso **construye las tablas de verdad** en Supabase.
⏰ **¿Cuándo?**

- La **primera vez** (base de datos vacía):

  ```bash
  npx prisma db init
  ```

- Las **siguientes veces** que cambies el plano (después de `contract emit`):

  ```bash
  npx prisma db update
  ```

✅ **¿Cómo compruebo que funcionó?** Entra en Supabase → **Table Editor**. Deberías ver las tablas `User` y `Post`. 🎉

> 🔁 **Resumen del ciclo de Prisma (apréndetelo):**
> 1. ✏️ Cambias `contract.prisma`
> 2. ⚙️ `npx prisma contract emit`
> 3. 🏗️ `npx prisma db update` (o `db init` la primera vez)

### 6.5 La conexión: `src/prisma/db.ts`

Este archivo lo creó Prisma. **No lo tocamos**, pero entendamos qué hace:

```ts
import 'dotenv/config';                                           // abre la caja fuerte
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' }; // lee el plano compilado

export const contract = contractFromJson<Contract>(contractJson);

// "db" es nuestra puerta a la despensa. La exportamos para usarla en los models.
export const db = postgres({
  contract,
  url: process.env['DATABASE_URL']!,
});
```

🎯 **Lo único que tienes que recordar:** este archivo exporta **`db`**, y con `db` hablamos con la base de datos:

```js
db.orm.public.User   // ← "la tabla User" (public es el nombre de la zona donde viven las tablas)
```

---

## 7. El servidor: `index.js`

🤔 **¿Qué es?** El **edificio** del restaurante. El archivo que arranca todo.
❓ **¿Por qué?** Sin servidor, nadie puede hacerle pedidos a nuestra API.
⏰ **¿Cuándo?** Se escribe una vez; se arranca cada vez que vas a trabajar (`npm run dev`).

🛠️ **¿Cómo?** Crea `index.js` en la raíz:

```js
import express from 'express'                              // 1. traemos Express (el edificio)
import 'dotenv/config'                                     // 2. abrimos la caja fuerte (.env)
import userRouter from './src/routers/user.route.js'       // 3. traemos al recepcionista de usuarios

const app = express();                                     // 4. construimos el edificio

app.use(express.json());                                   // 5. le enseñamos a leer JSON

const port = process.env.PORT || 3000                      // 6. qué puerta abrimos

app.get("/", (req, res) => {                               // 7. una ruta de prueba
    res.status(200).send("todo ok")
})

app.use("/api/user", userRouter)                           // 8. todo lo que empiece por /api/user → al recepcionista de usuarios

app.listen(port, () => {                                   // 9. ¡abrimos las puertas!
    console.log("http://localhost:" + port)
})
```

🧸 **Línea por línea:**

1. **`import express`** → traemos la librería.
2. **`import 'dotenv/config'`** → a partir de aquí `process.env.ALGO` funciona.
3. **`import userRouter`** → traemos las rutas de usuario (las crearemos en el paso 14).
4. **`express()`** → crea la aplicación. `app` es nuestro restaurante.
5. **`express.json()`** → cuando alguien nos manda datos en formato JSON (por ejemplo `{"email":"ana@mail.com"}`), Express los convierte en un objeto y los pone en `req.body`. **Sin esta línea, `req.body` sería `undefined`.** 😱
6. **`process.env.PORT || 3000`** → "usa la puerta que diga el `.env`; si no dice nada, usa la 3000". El `||` significa "o si no".
7. **`app.get("/")`** → si alguien visita `http://localhost:3000/`, respondemos `"todo ok"`. Sirve para comprobar rápido que el servidor vive.
8. **`app.use("/api/user", userRouter)`** → "todos los pedidos cuya dirección empiece por `/api/user` se los pasas a `userRouter`".
9. **`app.listen`** → el servidor se queda **esperando pedidos** para siempre (hasta que lo apagues con `Ctrl + C`).

❓ **¿Qué son `req` y `res`?** Aparecen en TODO Express:

- **`req`** (*request* = pedido): **lo que el cliente nos manda**. Dentro tiene `req.body` (los datos), `req.headers` (las cabeceras, donde viaja el token), `req.query` (lo que va después del `?` en la URL)...
- **`res`** (*response* = respuesta): **lo que nosotros le devolvemos**. `res.status(200)` pone el código; `res.send(...)` envía el contenido.

❓ **¿Qué son los números como 200, 201, 401?** Son **códigos de estado HTTP**, como caritas que acompañan a la respuesta:

| Código | Carita | Significa |
|---|---|---|
| `200` | 😀 | OK, todo bien |
| `201` | 🎉 | Creado (algo nuevo se guardó) |
| `400` | 🤨 | Me has mandado algo mal |
| `401` | 🚫 | No estás autorizado (sin pulsera o pulsera falsa) |
| `404` | 🤷 | Esa dirección no existe |
| `500` | 💥 | El servidor se ha roto (culpa nuestra) |

---

## 8. Las carpetas (la arquitectura por capas)

🤔 **¿Qué es?** Organizar el código en carpetas, una por cada "trabajador" del restaurante.
❓ **¿Por qué?** Cuando el proyecto crece, si todo está en un archivo es imposible encontrar nada.
🛠️ **¿Cómo?** Crea esta estructura (las carpetas de `prisma` ya existen):

```
prisma_supabase/
├── index.js                          ← el edificio
├── .env                              ← la caja fuerte (NO se sube)
├── .env.example                      ← el molde (sí se sube)
├── .gitignore
├── package.json
├── prisma.config.ts
└── src/
    ├── routers/
    │   └── user.route.js             ← recepcionista
    ├── middleware/
    │   └── guard.middleware.js       ← portero
    ├── controllers/
    │   └── user.controllers.js       ← camarero
    ├── services/
    │   ├── user.service.js           ← cocinero
    │   └── token/
    │       └── token.service.js      ← máquina de pulseras
    ├── models/
    │   └── user.model.js             ← ayudante de despensa
    └── prisma/
        ├── contract.prisma           ← plano de las tablas
        ├── contract.json             ← (generado)
        ├── contract.d.ts             ← (generado)
        └── db.ts                     ← conexión a la BD
```

> 🧭 **¿En qué orden escribimos los archivos?** Vamos **de abajo hacia arriba**: primero el que habla con la base de datos (Model) y al final el que habla con el cliente (Router). Así, cuando escribimos cada capa, la de abajo ya existe y la podemos importar.
>
> **Model → Token → Service → Controller → Middleware → Router**

---

## 9. El Model: el que va a la despensa

🤔 **¿Qué es?** Las funciones que **hablan con la base de datos**. Es la **única** capa que usa `db`.
❓ **¿Por qué solo él?** Si mañana cambias Prisma por otra cosa, solo tienes que cambiar los models. El resto del restaurante ni se entera.
🎯 **¿Para qué?** Guardar usuarios, buscarlos, listarlos.
🛠️ **¿Cómo?** Crea `src/models/user.model.js`:

```js
import { db } from "../prisma/db.ts";

// 📥 GUARDAR un usuario nuevo en la tabla User
export async function registerUserModel(email, name, username, password) {
  const created = await db.orm.public.User.create({
    email,
    name,
    username,
    password,
  });
  return created; // devolvemos el usuario recién creado
}

// 🔍 BUSCAR un usuario por su email
export async function getUserModel(email) {
  // .where({ email }) = "donde el email sea igual a este"
  // .first()          = "dame solo el primero que encuentres" (o null si no hay ninguno)
  const user = await db.orm.public.User.where({
    email,
  }).first();
  return user;
}

// 📋 TRAER TODOS los usuarios
export async function getAllUsersModel() {
  const users = await db.orm.public.User.all();
  return users;
}
```

🧸 **Conceptos nuevos:**

- **`export`** → "esta función se puede usar desde otros archivos". Sin `export`, sería privada de este archivo.
- **`{ email, name }`** → es un atajo. Es lo mismo que escribir `{ email: email, name: name }`.
- **`async` / `await`** → ¡muy importante! Ir a la base de datos **tarda** (está en internet, en otro país). `await` significa **"espera aquí hasta que la despensa conteste"**. Y una función que usa `await` tiene que llevar `async` delante.

> 🍕 **Ejemplo de `await`:** pides una pizza por teléfono. Si **no esperas** (`sin await`), abres la puerta y no hay pizza, solo una "promesa de pizza" (`Promise`). Si **esperas** (`await`), abres la puerta cuando suena el timbre y ahí está la pizza.

| Quiero... | Código Prisma |
|---|---|
| Crear | `db.orm.public.User.create({ ...datos })` |
| Buscar uno | `db.orm.public.User.where({ email }).first()` |
| Traer todos | `db.orm.public.User.all()` |

---

## 10. El servicio de Token: la pulsera de la discoteca

🤔 **¿Qué es un token (JWT)?** Imagina una discoteca. En la entrada enseñas tu DNI **una vez** (login) y te ponen una **pulsera**. A partir de ahí, para entrar a la zona VIP solo enseñas la pulsera; no tienes que enseñar el DNI cada vez.

- El **DNI** = tu email y contraseña.
- La **pulsera** = el **token**.
- El **sello secreto** que tiene la pulsera para que no se pueda falsificar = el **`tokenKey`** del `.env`.

❓ **¿Por qué no mandar el email y la contraseña en cada pedido?** Porque cuantas más veces viaja la contraseña, más oportunidades hay de que alguien la robe. El token viaja en su lugar.
⏰ **¿Cuándo?** Se **crea** en el login. Se **comprueba** cada vez que alguien quiere entrar a una ruta protegida.

🛠️ **¿Cómo?** Crea `src/services/token/token.service.js`:

```js
import jwt from "jsonwebtoken";
import "dotenv/config";

// 🎟️ FABRICAR una pulsera
// Recibe los datos del usuario y los "sella" con nuestra llave secreta
export function createToken(userdata) {
  const token = jwt.sign(userdata, process.env.tokenKey);
  return token;
}

// 🔎 COMPROBAR una pulsera
// Si el sello es auténtico, devuelve "ok". Si es falsa o está rota, lanza un error.
export function verfyToken(token) {
  try {
    jwt.verify(token, process.env.tokenKey);
    return "ok";
  } catch (e) {
    throw new Error("error de token");
  }
}
```

🧸 **Conceptos nuevos:**

- **`jwt.sign(datos, llave)`** → fabrica la pulsera. El resultado es un texto larguísimo tipo `eyJhbGciOiJIUzI1NiIs...`.
- **`jwt.verify(token, llave)`** → comprueba que la pulsera la hicimos **nosotros** con **nuestra** llave. Si alguien la modificó, falla.
- **`try { ... } catch (e) { ... }`** → "**intenta** hacer esto; si explota, en vez de romper el programa, **atrapa** el error y haz esto otro". Como una red de seguridad en el circo 🎪.
- **`throw new Error(...)`** → "lanza un error a propósito" para avisar a quien nos llamó de que algo salió mal.

> ⚠️ **¡Cuidado!** Lo que va dentro del token **se puede leer** (no está cifrado, solo firmado). Pega un token en https://jwt.io y lo verás. Por eso **nunca metas la contraseña dentro del token**. Nosotros solo metemos nombre, usuario y email.

---

## 11. El Service de usuario: el cocinero

🤔 **¿Qué es?** La **lógica** del negocio: las decisiones. "¿La contraseña es correcta?", "pica la contraseña antes de guardarla", "si todo va bien, dale una pulsera".
❓ **¿Por qué separarlo del controller?** El camarero no cocina. Si mañana tienes otra forma de pedir (una app móvil, un bot...), el cocinero sigue siendo el mismo.

### 🔐 Antes: ¿qué es bcrypt y por qué "picamos" las contraseñas?

Si guardamos las contraseñas tal cual (`"1234"`) y alguien roba la base de datos, **tiene todas las contraseñas**. 😱

`bcrypt` es una **picadora de carne** 🥩➡️🍔:

- Meter carne y sacar hamburguesa es **fácil**.
- Convertir la hamburguesa otra vez en el filete **es imposible**.

Así que:

- **Al registrarse:** picamos la contraseña (`bcrypt.hash`) y guardamos **la hamburguesa**: `$2b$10$Xk3...` (nunca el `"1234"`).
- **Al hacer login:** no podemos "despicar". Lo que hacemos es **picar otra vez** lo que escribió la persona y **comparar las hamburguesas** (`bcrypt.compare`). Si son iguales, la contraseña era correcta. ✅

¿Y `saltRounds = 10`? Es **cuántas vueltas** le da la picadora. Más vueltas = más seguro pero más lento. 10 es el número habitual.

### 🛠️ El código

Crea `src/services/user.service.js`:

```js
import { getUserModel, registerUserModel, getAllUsersModel } from "../models/user.model.js";
import { createToken } from "./token/token.service.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

// 🔍 Buscar un usuario por email
export async function getUserService(email) {
  return await getUserModel(email);
}

// 📝 Registrar un usuario nuevo
export async function registerUserService(body) {
  let { email, name, username, password } = body;

  // picamos la contraseña. ¡OJO al await! Picar también tarda.
  password = await bcrypt.hash(password, saltRounds);

  const created = await registerUserModel(email, name, username, password);

  // devolvemos el usuario creado, pero SIN la contraseña
  return {
    id: created.id,
    email: created.email,
    name: created.name,
    username: created.username,
  };
}

// 🔑 Login
export async function loginService(req) {
  const { email, password } = req.body;

  // 1. buscamos en la BD un usuario con ese email
  const user = await getUserModel(email);

  if (user) {
    // 2. existe: preparamos los datos que irán dentro de la pulsera (¡sin contraseña!)
    const userdata = {
      name: user.name,
      username: user.username,
      email: user.email,
    };

    // 3. comparamos la contraseña escrita con la hamburguesa guardada
    const pass = await bcrypt.compare(password, user.password);

    if (pass) {
      // 4. ¡correcta! fabricamos la pulsera y la devolvemos
      const token = createToken(userdata);
      return { status: 200, message: token };
    } else {
      return { status: 401, message: "usuario o clave incorrecto" };
    }
  } else {
    return { status: 401, message: "usuario o clave incorrecto" };
  }
}

// 📋 Todos los usuarios
export async function getAllUsersService() {
  return await getAllUsersModel();
}
```

🧸 **Conceptos nuevos:**

- **`let { email, password } = body`** → se llama **desestructuración**. Es sacar cosas de una caja de golpe. Es lo mismo que:
  ```js
  let email = body.email;
  let password = body.password;
  ```
- **`if (user) { ... } else { ... }`** → "si encontramos al usuario, haz esto; si no, haz lo otro".

❓ **¿Por qué el mensaje de error es igual cuando el email no existe y cuando la contraseña está mal?** ¡Por seguridad! Si dijéramos "ese email no existe", un malo podría ir probando emails para averiguar quién está registrado. Con el mismo mensaje, no sabe qué parte falló. 🕵️

---

## 12. El Controller: el camarero

🤔 **¿Qué es?** La función que **recibe el pedido** (`req`), se lo pasa al cocinero (service) y **entrega la respuesta** (`res`).
❓ **¿Por qué?** Para que el cocinero no tenga que saber nada de `req`, `res` ni códigos HTTP. El camarero es el único que "habla Express".
🛠️ **¿Cómo?** Crea `src/controllers/user.controllers.js`:

```js
import {
  getUserService,
  registerUserService,
  loginService,
  getAllUsersService,
} from "../services/user.service.js";

// GET /api/user/getuser?email=ana@mail.com
export async function getUserController(req, res) {
  const email = req.query.email; // lo que va después de ?email= en la URL
  res.status(200).send(await getUserService(email));
}

// POST /api/user/register
export async function setUserController(req, res) {
  res.status(201).send(await registerUserService(req.body));
}

// POST /api/user/login
export async function LoginController(req, res) {
  const user = await loginService(req);
  res.status(user.status).send(user.message);
}

// GET /api/user/getallusers
export async function getAllUsersController(req, res) {
  res.status(200).send(await getAllUsersService());
}
```

🧸 Fíjate que el controller es **cortito**: recibe, pasa, responde. Si un controller tiene muchas líneas con `if`, seguramente esa lógica debería estar en el service.

---

## 13. El Middleware: el portero

🤔 **¿Qué es?** Una función que se pone **en medio** (*middle*) del camino, **antes** del controller. Decide si el pedido sigue o se queda fuera.
❓ **¿Por qué?** Hay rutas que no queremos que use cualquiera (por ejemplo, ver todos los usuarios). El portero comprueba la pulsera.
⏰ **¿Cuándo actúa?** En cada pedido a una ruta que tenga el portero puesto (lo ponemos en el router, paso 14).

🛠️ **¿Cómo?** Crea `src/middleware/guard.middleware.js`:

```js
import { verfyToken } from "../services/token/token.service.js";

export function validateUser(req, res, next) {
  try {
    // 1. el token viene en la cabecera "Authorization" así:  "Bearer eyJhbGciOi..."
    //    le quitamos la palabra "Bearer " para quedarnos solo con el token
    const token = req.headers.authorization.replace("Bearer ", "");

    // 2. comprobamos la pulsera (si es falsa, verfyToken lanza un error y saltamos al catch)
    verfyToken(token);

    // 3. ¡pulsera válida! dejamos pasar al siguiente (el controller)
    next();
  } catch (e) {
    // sin pulsera, o pulsera falsa → fuera
    res.status(401).send("error de token");
  }
}
```

🧸 **Conceptos nuevos:**

- **`next`** → es el **botón de "que pase el siguiente"**. Si el portero llama a `next()`, el pedido sigue hacia el controller. Si no lo llama y responde con `res.status(401)`, el pedido termina ahí.
- **`req.headers.authorization`** → las **cabeceras** son como la información escrita **en el sobre** de una carta (no dentro). El token viaja en la cabecera `Authorization`.
- **`Bearer`** → significa "portador". Es una convención: `Bearer <token>` = "soy el portador de esta pulsera".
- Si **no hay** cabecera `Authorization`, `req.headers.authorization` es `undefined`, y hacer `.replace` sobre `undefined` explota... ¡pero el `catch` lo atrapa y responde 401! 🎪

---

## 14. El Router: el recepcionista

🤔 **¿Qué es?** La **lista de direcciones** (rutas) y a qué controller va cada una.
❓ **¿Por qué?** Para tener **en un solo sitio** todas las puertas que tiene nuestra API. Si quieres saber qué hace tu API, miras este archivo.
🛠️ **¿Cómo?** Crea `src/routers/user.route.js`:

```js
import express from "express";
import {
  getUserController,
  setUserController,
  LoginController,
  getAllUsersController,
} from "../controllers/user.controllers.js";
import { validateUser } from "../middleware/guard.middleware.js";

const router = express.Router();

//      MÉTODO  DIRECCIÓN        PORTERO        CAMARERO
router.get(   "/getuser",                       getUserController);
router.post(  "/register",                      setUserController);
router.post(  "/login",                         LoginController);
router.get(   "/getallusers",    validateUser,  getAllUsersController); // 🔒 protegida

export default router;
```

🧸 **Conceptos nuevos:**

- **`GET` vs `POST`** → son **verbos** HTTP, el "tipo de pedido":
  - `GET` = "**dame** algo" (leer). No lleva body.
  - `POST` = "**toma** esto" (crear/enviar datos). Lleva body con JSON.
  - (Existen más: `PUT`/`PATCH` = modificar, `DELETE` = borrar. ¡Retos al final!)
- **`router.get("/getallusers", validateUser, getAllUsersController)`** → se ejecutan **en orden, de izquierda a derecha**: primero el portero; si llama a `next()`, entonces el camarero.
- **La dirección completa** se forma juntando lo de `index.js` con lo del router:
  `"/api/user"` (index.js) + `"/login"` (router) = **`/api/user/login`**
- **`export default`** → "esto es **lo principal** que exporta este archivo". Por eso en `index.js` se importa sin llaves: `import userRouter from ...`.

---

## 15. ¡A probarlo!

### 15.1 Arrancar el servidor

```bash
npm run dev
```

Deberías ver: `http://localhost:3000` ✅
Abre esa dirección en el navegador: debe decir **todo ok**.

> 🛑 Para apagar el servidor: `Ctrl + C` en la terminal.

### 15.2 Probar con Postman (o Thunder Client)

Hazlo **en este orden**, porque cada paso necesita el anterior:

#### ① Registrar un usuario

- Método: **POST**
- URL: `http://localhost:3000/api/user/register`
- Pestaña **Body** → **raw** → **JSON**:

```json
{
  "email": "ana@mail.com",
  "name": "Ana",
  "username": "anita",
  "password": "1234"
}
```

✅ Esperado: código **201** y el usuario (sin contraseña).
🔎 Ve a Supabase → Table Editor → `User`. ¡Ahí está Ana! Y su password es una hamburguesa (`$2b$10$...`), no `1234`. 🍔

#### ② Hacer login

- Método: **POST**
- URL: `http://localhost:3000/api/user/login`
- Body (JSON):

```json
{
  "email": "ana@mail.com",
  "password": "1234"
}
```

✅ Esperado: código **200** y un texto largo `eyJhbGciOi...` → **¡es tu pulsera! Cópiala.**
🧪 Prueba también con una contraseña mala → debe dar **401** `usuario o clave incorrecto`.

#### ③ Entrar a la zona VIP **sin** pulsera

- Método: **GET**
- URL: `http://localhost:3000/api/user/getallusers`

✅ Esperado: **401** `error de token`. ¡El portero funciona! 💪

#### ④ Entrar a la zona VIP **con** pulsera

- Mismo pedido que el ③, pero en la pestaña **Authorization** (o *Auth*) elige **Bearer Token** y pega el token del paso ②.

✅ Esperado: **200** y la lista de todos los usuarios. 🎉

#### ⑤ Buscar un usuario por email

- Método: **GET**
- URL: `http://localhost:3000/api/user/getuser?email=ana@mail.com`

✅ Esperado: **200** y los datos de Ana.

---

## 16. Errores típicos y cómo arreglarlos

| Error que ves | Qué significa | Cómo se arregla |
|---|---|---|
| `Cannot use import statement outside a module` | Node no sabe que usamos `import` | Añade `"type": "module"` en `package.json` |
| `Cannot find module '...'` | Ruta de import mal escrita o librería no instalada | Revisa la ruta (¡incluida la extensión `.js`!) o ejecuta `npm install` |
| `Unknown file extension ".ts"` | Tu Node es demasiado viejo | Instala Node 24 LTS |
| `req.body` es `undefined` | Falta `app.use(express.json())` o no elegiste **JSON** en Postman | Revisa `index.js` y Postman |
| Siempre da `error de token` | No pusiste `Bearer`, copiaste mal el token, o `tokenKey` cambió | Haz login otra vez y copia el token completo |
| `secretOrPrivateKey must have a value` | No existe `tokenKey` en el `.env` | Añádelo (con mayúsculas exactas) y reinicia el servidor |
| `EADDRINUSE: address already in use :::3000` | Ya tienes otro servidor encendido en esa puerta | Apaga el otro (`Ctrl + C`) o cambia `PORT` |
| Error de conexión / `password authentication failed` | `DATABASE_URL` mal escrita o contraseña incorrecta | Copia de nuevo la dirección de Supabase y cambia `[YOUR-PASSWORD]` |
| Error al registrar el mismo email dos veces | `email` es `@unique` | Es correcto que falle 🙂 (ver retos) |
| Cambié `contract.prisma` y no pasa nada | Faltó compilar y actualizar | `npx prisma contract emit` y `npx prisma db update` |
| La respuesta es `{}` vacío | Te faltó un `await` y enviaste una "promesa de pizza" | Pon `await` delante de la llamada al service |

---

## 17. Diccionario para no perderse

| Palabra | Explicación de 5 años |
|---|---|
| **API** | Un programa sin pantalla que responde pedidos de otros programas |
| **Servidor** | Un ordenador (o programa) que espera pedidos y los responde |
| **Endpoint / ruta** | Una dirección concreta de la API, como `/api/user/login` |
| **Petición (request)** | El pedido que hace el cliente |
| **Respuesta (response)** | Lo que el servidor devuelve |
| **JSON** | Una forma de escribir datos: `{ "nombre": "Ana", "edad": 30 }` |
| **Base de datos** | Un cuaderno que no se borra donde guardamos información |
| **Tabla / modelo** | Una "hoja de Excel" dentro de la base de datos |
| **ORM (Prisma)** | Un traductor de JavaScript a SQL |
| **SQL** | El idioma que hablan las bases de datos |
| **Variable de entorno** | Un secreto guardado en `.env` y leído con `process.env` |
| **Hash (bcrypt)** | Picar una contraseña para que no se pueda leer |
| **Token / JWT** | Una pulsera firmada que demuestra que ya hiciste login |
| **Middleware** | Un portero que se pone en medio del camino |
| **async / await** | "Espera a que esto termine antes de seguir" |
| **Promise** | Una "promesa de pizza": algo que todavía no ha llegado |
| **try / catch** | Una red de seguridad para los errores |
| **import / export** | Traer / compartir código entre archivos |

---

## 18. ⚠️ Diferencias con el código de clase

El código de esta guía está **corregido** respecto al del repositorio en algunos puntos. Si comparas, verás estas diferencias (y es un muy buen ejercicio entender **por qué** el original falla):

| Archivo | En el repositorio | En esta guía | ¿Por qué? |
|---|---|---|---|
| `user.model.js` → `registerUserModel` | `await db.close(); return ok;` | `return created;` | `ok` **no existe** (da `ReferenceError`), y `db.close()` **cierra la puerta de la despensa**: las siguientes consultas fallarían |
| `user.service.js` → `registerUserService` | `password = bcrypt.hash(...)` | `password = await bcrypt.hash(...)` | Sin `await` se guarda una "promesa de pizza", no la contraseña picada. Luego el login nunca funcionaría |
| `user.service.js` → `registerUserService` | Devolvía lo que diera el model | Devuelve el usuario **sin** `password` | Nunca devolvemos contraseñas (ni picadas) al cliente |
| `user.service.js` → `getUserService` | `getUserModel()` sin email | `getUserModel(email)` | Sin email, no sabe a quién buscar |
| `user.controllers.js` → `getUserController` | Sin `await`, sin email | `await` + `req.query.email` | Sin `await` responde `{}` vacío |
| `.env.example` | Solo `DATABASE_URL` | También `tokenKey` y `PORT` | Para que quien clone el proyecto sepa todo lo que necesita |
| `.gitignore` | Solo ignora `.env` | Ignora `.env` y `.env.*` | Para que ningún archivo de secretos se suba por accidente |

---

## 19. Retos para practicar

Cuando todo te funcione, intenta esto tú solo/a. ¡Así es como se aprende de verdad! 💪

1. 🟢 **Validar datos:** en `registerUserService`, si falta `email` o `password`, devuelve un error `400` sin ir a la base de datos.
2. 🟢 **Email repetido:** ahora mismo, registrar dos veces el mismo email da un error 500. Atrápalo con `try/catch` y responde `409` con el mensaje `"ese email ya existe"`.
3. 🟡 **Caducidad de la pulsera:** haz que el token caduque en 1 hora: `jwt.sign(userdata, process.env.tokenKey, { expiresIn: "1h" })`.
4. 🟡 **Proteger otra ruta:** pon el portero (`validateUser`) también en `/getuser`.
5. 🟡 **Ocultar contraseñas:** `getallusers` devuelve también las contraseñas picadas. Haz que no salgan.
6. 🔴 **Posts:** crea `post.route.js`, `post.controllers.js`, `post.service.js` y `post.model.js` para crear y listar posts de un usuario (pista: `db.orm.public.Post.create({ title, content, authorId })`).
7. 🔴 **Saber quién soy:** en el middleware, guarda los datos del token en `req.user` (`req.user = jwt.verify(...)`) y crea una ruta `/me` que devuelva los datos del usuario que hizo login.

---

### 🗺️ Chuleta final: el orden para hacerlo todo desde cero

```
 1. Instalar Node 24, VS Code, Git, Postman            (una vez en la vida)
 2. mkdir → cd → npm init -y → "type": "module"         (crear proyecto)
 3. npm install express dotenv bcrypt jsonwebtoken
    npm install -D nodemon                              (librerías)
 4. Crear proyecto en Supabase → copiar Session pooler  (base de datos)
 5. Crear .env, .env.example y .gitignore               (secretos)
 6. npm install -D prisma@8.0.0-rc.33
    npx prisma orm init --target postgres --authoring psl
 7. Escribir contract.prisma
 8. npx prisma contract emit
 9. npx prisma db init                                  (crea las tablas en Supabase)
10. index.js
11. model → token.service → user.service → controller → middleware → router
12. npm run dev → probar con Postman: register → login → getallusers
```

¡Felicidades! 🎉 Has construido una API con registro, login, contraseñas seguras, tokens y rutas protegidas. Eso es exactamente lo que hay detrás del "Iniciar sesión" de casi cualquier web que usas a diario.
