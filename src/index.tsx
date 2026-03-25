import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

// ===== Table API (Generic CRUD) =====
// GET /api/tables/:table
app.get('/api/tables/:table', async (c) => {
  const table = c.req.param('table')
  const allowed = ['tools', 'submissions', 'reports', 'settings']
  if (!allowed.includes(table)) return c.json({ error: 'Invalid table' }, 400)

  const { search, limit, sort } = c.req.query()
  const lim = parseInt(limit || '200')
  let query = `SELECT * FROM ${table}`
  const params: string[] = []

  if (search) {
    if (table === 'submissions') {
      query += ` WHERE email LIKE ? OR name LIKE ? OR id LIKE ?`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    } else if (table === 'tools') {
      query += ` WHERE name LIKE ? OR category LIKE ? OR description LIKE ?`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    } else if (table === 'reports') {
      query += ` WHERE submission_id LIKE ? OR id LIKE ?`
      params.push(`%${search}%`, `%${search}%`)
    } else if (table === 'settings') {
      query += ` WHERE setting_key LIKE ?`
      params.push(`%${search}%`)
    }
  }

  if (sort === '-created_at') {
    query += ` ORDER BY created_at DESC`
  } else {
    query += ` ORDER BY created_at DESC`
  }

  query += ` LIMIT ?`
  params.push(String(lim))

  try {
    const stmt = c.env.DB.prepare(query)
    const result = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all()
    return c.json({ data: result.results || [] })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// GET /api/tables/:table/:id
app.get('/api/tables/:table/:id', async (c) => {
  const table = c.req.param('table')
  const id = c.req.param('id')
  const allowed = ['tools', 'submissions', 'reports', 'settings']
  if (!allowed.includes(table)) return c.json({ error: 'Invalid table' }, 400)

  try {
    const result = await c.env.DB.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(id).first()
    if (!result) return c.json({ error: 'Not found' }, 404)
    return c.json(result)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// POST /api/tables/:table
app.post('/api/tables/:table', async (c) => {
  const table = c.req.param('table')
  const allowed = ['tools', 'submissions', 'reports', 'settings']
  if (!allowed.includes(table)) return c.json({ error: 'Invalid table' }, 400)

  try {
    const body = await c.req.json()
    const keys = Object.keys(body)
    const vals = Object.values(body)
    const placeholders = keys.map(() => '?').join(',')
    const query = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`
    await c.env.DB.prepare(query).bind(...vals).run()
    return c.json({ success: true, id: body.id })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// PUT /api/tables/:table/:id (full replace)
app.put('/api/tables/:table/:id', async (c) => {
  const table = c.req.param('table')
  const id = c.req.param('id')
  const allowed = ['tools', 'submissions', 'reports', 'settings']
  if (!allowed.includes(table)) return c.json({ error: 'Invalid table' }, 400)

  try {
    const body = await c.req.json()
    const keys = Object.keys(body).filter(k => k !== 'id')
    const vals = keys.map(k => (body as any)[k])
    const setClause = keys.map(k => `${k} = ?`).join(', ')
    await c.env.DB.prepare(`UPDATE ${table} SET ${setClause} WHERE id = ?`).bind(...vals, id).run()
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// PATCH /api/tables/:table/:id (partial update)
app.patch('/api/tables/:table/:id', async (c) => {
  const table = c.req.param('table')
  const id = c.req.param('id')
  const allowed = ['tools', 'submissions', 'reports', 'settings']
  if (!allowed.includes(table)) return c.json({ error: 'Invalid table' }, 400)

  try {
    const body = await c.req.json()
    const keys = Object.keys(body).filter(k => k !== 'id')
    const vals = keys.map(k => (body as any)[k])
    const setClause = keys.map(k => `${k} = ?`).join(', ')
    await c.env.DB.prepare(`UPDATE ${table} SET ${setClause} WHERE id = ?`).bind(...vals, id).run()
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// DELETE /api/tables/:table/:id
app.delete('/api/tables/:table/:id', async (c) => {
  const table = c.req.param('table')
  const id = c.req.param('id')
  const allowed = ['tools', 'submissions', 'reports', 'settings']
  if (!allowed.includes(table)) return c.json({ error: 'Invalid table' }, 400)

  try {
    await c.env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run()
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// ===== Page Routes =====
const pages = ['index', 'submit', 'result', 'tools', 'history', 'admin', 'debug'] as const

import { indexPage } from './pages/index'
import { submitPage } from './pages/submit'
import { resultPage } from './pages/result'
import { toolsPage } from './pages/tools'
import { historyPage } from './pages/history'
import { adminPage } from './pages/admin'
import { debugPage } from './pages/debug'

app.get('/', (c) => c.html(indexPage()))
app.get('/submit', (c) => c.html(submitPage()))
app.get('/result', (c) => c.html(resultPage()))
app.get('/tools', (c) => c.html(toolsPage()))
app.get('/history', (c) => c.html(historyPage()))
app.get('/admin', (c) => c.html(adminPage()))
app.get('/debug', (c) => c.html(debugPage()))

// Legacy routes (for .html compat)
app.get('/index.html', (c) => c.redirect('/'))
app.get('/submit.html', (c) => c.redirect('/submit'))
app.get('/result.html', (c) => c.redirect(`/result${c.req.url.includes('?') ? '?' + c.req.url.split('?')[1] : ''}`))
app.get('/tools.html', (c) => c.redirect(`/tools${c.req.url.includes('?') ? '?' + c.req.url.split('?')[1] : ''}`))
app.get('/history.html', (c) => c.redirect('/history'))
app.get('/admin.html', (c) => c.redirect('/admin'))
app.get('/debug.html', (c) => c.redirect('/debug'))

export default app
