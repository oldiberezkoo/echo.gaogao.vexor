ELIMINATING WATERFALLS

🔴 CRITICAL Impact (2–10× улучшение)

Promise.all() для независимых операций  
Самое базовое и важное правило — параллелизация независимых операций

❌ Неправильно (3 round trips):

const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()


✅ Правильно (1 round trip):

const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])


Мои мысли: Логичное уменьшение критического пути за счёт параллельного старта всего, что не зависит друг от друга. Важно помнить: правило применимо только к независимым запросам. Если при падении одного запроса вы всё равно можете продолжать работу — используйте Promise.allSettled().

---

Не допускайте waterfall-цепочек в API routes  
Критично для серверного кода — запускайте независимые операции сразу

❌ Неправильно (config ждёт auth, data ждёт обоих):

export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}


✅ Правильно (auth и config стартуют одновременно):

export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const session = await sessionPromise
  const [config, data] = await Promise.all([
    configPromise,
    fetchData(session.user.id)
  ])
  return Response.json({ data, config })
}


Мои мысли: В серверных хендлерах waterfall особенно дорогой, поэтому здесь критично отслеживать такие цепочки. Обязательно следите за неймингом промисов: в подобных кейсах код легко превращается в кашу, и поддерживать его становится сложно.

---

Dependency-based parallelization  
Продвинутая параллелизация — максимизация параллелизма при частичных зависимостях

❌ Неправильно (profile ждёт config без причины):

const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig()
])
const profile = await fetchProfile(user.id)


✅ Правильно с better-all (config и profile параллельно):

import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() { return fetchUser() },
  async config() { return fetchConfig() },
  async profile() {
    return fetchProfile((await this.$.user).id)
  }
})


✅ Альтернатива без библиотеки:

const userPromise = fetchUser()
const profilePromise = userPromise.then(user => fetchProfile(user.id))

const [user, config, profile] = await Promise.all([
  userPromise,
  fetchConfig(),
  profilePromise
])


Мои мысли: Мне ближе вариант без библиотеки — минимум магии и максимум профита. Библиотека может повышать «выразительность», но, как по мне, читаемость часто становится хуже.

ТОП - Тёма о программировани, [02.02.2026 23:07]
🟡 HIGH Impact

Defer await until needed  
Условная оптимизация — await только там, где данные реально используются

❌ Неправильно (всегда загружает permissions):

async function updateResource(resourceId: string, userId: string) {
  const permissions = await fetchPermissions(userId)
  const resource = await getResource(resourceId)

  if (!resource) {
    return { error: 'Not found' }
  }

  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }

  return await updateResourceData(resource, permissions)
}


✅ Правильно (permissions грузим только если ресурс найден):

async function updateResource(resourceId: string, userId: string) {
  const resource = await getResource(resourceId)

  if (!resource) {
    return { error: 'Not found' }
  }

  const permissions = await fetchPermissions(userId)

  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }

  return await updateResourceData(resource, permissions)
}


Простой пример с early return:

// ❌ Неправильно
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)

  if (skipProcessing) {
    return { skipped: true }
  }

  return processUserData(userData)
}

// ✅ Правильно
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    return { skipped: true }
  }

  const userData = await fetchUserData(userId)
  return processUserData(userData)
}


Мои мысли: Всё просто: если что-то можно не делать — не делайте. Либо выполните что-то более полезное, либо просто сэкономьте ресурсы. Это правило применимо во множестве ситуаций, а не только в React/фронтенде.

---

Strategic Suspense boundaries  
UI-оптимизация — layout показывается сразу, данные грузятся внутри

❌ Неправильно (весь layout ждёт данные):

async function Page() {
  const data = await fetchData() // блокирует всю страницу

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <DataDisplay data={data} />
      </div>
      <div>Footer</div>
    </div>
  )
}


✅ Правильно (Sidebar/Header/Footer сразу; ждёт только DataDisplay):

function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <Suspense fallback={<Skeleton />}>
          <DataDisplay />
        </Suspense>
      </div>
      <div>Footer</div>
    </div>
  )
}

async function DataDisplay() {
  const data = await fetchData() // блокирует только этот компонент
  return <div>{data.content}</div>
}


✅ Продвинутый вариант (несколько компонентов используют одни данные):

function Page() {
  const dataPromise = fetchData() // стартует сразу, но не await

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <Suspense fallback={<Skeleton />}>
        <DataDisplay dataPromise={dataPromise} />
        <DataSummary dataPromise={dataPromise} />
      </Suspense>
      <div>Footer</div>
    </div>
  )
}

function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise)
  return <div>{data.content}</div>
}

function DataSummary({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise)
  return <div>{data.summary}</div>
}


Мои мысли: Правильная композиция решает огромное количество проблем — и тут мы снова упираемся в это. Организуйте интерфейс так, чтобы как можно быстрее начать отдавать пользователю его части (без перегибов). При этом важно следить за кэшем и дедупликацией: при сильном разбиении легко дернуть один и тот же запрос несколько раз — это и лишние ресурсы, и риск неконсистентного интерфейса (ответы могут отличаться). Второй вариант решения с прокидыванием проммисов в пропы мне не нравится...