import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('CSS Variables Usage', () => {
  it('should use CSS variables instead of hardcoded colors in EmailSignup', () => {
    const componentPath = join(process.cwd(), 'src', 'components', 'EmailSignup.tsx')
    const content = readFileSync(componentPath, 'utf-8')

    // Should NOT contain hardcoded hex colors
    expect(content).not.toMatch(/#[0-9A-Fa-f]{6}/)
    expect(content).not.toMatch(/#[0-9A-Fa-f]{3}/)

    // Should use CSS variables
    expect(content).toContain('var(--')
  })

  it('should use brand color variables', () => {
    const componentPath = join(process.cwd(), 'src', 'components', 'EmailSignup.tsx')
    const content = readFileSync(componentPath, 'utf-8')

    // Should reference brand colors via CSS variables
    const hasBrandColors =
      content.includes('var(--sc-canvas') ||
      content.includes('var(--sc-ink') ||
      content.includes('var(--sc-accent') ||
      content.includes('var(--color-')

    expect(hasBrandColors).toBe(true)
  })
})
