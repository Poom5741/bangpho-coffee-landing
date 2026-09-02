import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Scrollcraft Initialization', () => {
  it('should initialize scrollcraft using ScrollCraft.mount in page.tsx', () => {
    const pagePath = join(process.cwd(), 'src', 'app', 'page.tsx')
    const content = readFileSync(pagePath, 'utf-8')

    // Should have useEffect
    expect(content).toContain('useEffect')

    // Should call ScrollCraft.mount (not Scrollcraft.init)
    expect(content).toContain('ScrollCraft.mount')
    expect(content).not.toContain('Scrollcraft.init')

    // Should mount to document.body
    expect(content).toContain('document.body')
  })

  it('should be a client component', () => {
    const pagePath = join(process.cwd(), 'src', 'app', 'page.tsx')
    const content = readFileSync(pagePath, 'utf-8')

    // Should have "use client" directive
    expect(content).toMatch(/["']use client["']/)
  })
})
