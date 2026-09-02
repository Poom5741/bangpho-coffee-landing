import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Visual Polish', () => {
  it('should have kinetic text on hero headline', () => {
    const pagePath = join(process.cwd(), 'src', 'app', 'page.tsx')
    const content = readFileSync(pagePath, 'utf-8')

    // Hero headline should use kinetic text
    expect(content).toContain('data-sc-kinetic')
  })

  it('should have proper cue timing for copy blocks', () => {
    const pagePath = join(process.cwd(), 'src', 'app', 'page.tsx')
    const content = readFileSync(pagePath, 'utf-8')

    // Copy blocks should have data-sc-cue attributes
    expect(content).toContain('data-sc-cue')
  })

  it('should have spotlight effect on CTA section', () => {
    const pagePath = join(process.cwd(), 'src', 'app', 'page.tsx')
    const content = readFileSync(pagePath, 'utf-8')

    // CTA section should have spotlight effect
    expect(content).toContain('data-sc-spotlight')
  })

  it('should have grain overlay for depth', () => {
    const pagePath = join(process.cwd(), 'src', 'app', 'page.tsx')
    const content = readFileSync(pagePath, 'utf-8')

    // Page should have grain overlay
    expect(content).toContain('sc-grain')
  })

  it('should have progress bar', () => {
    const pagePath = join(process.cwd(), 'src', 'app', 'page.tsx')
    const content = readFileSync(pagePath, 'utf-8')

    // Page should have progress bar
    expect(content).toContain('data-sc-progress')
  })
})
