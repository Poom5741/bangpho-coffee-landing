import { describe, it, expect } from 'vitest'
import { existsSync } from 'fs'
import { join } from 'path'

describe('Scrollcraft Engine Files', () => {
  it('should have scrollcraft.js in public directory', () => {
    const scrollcraftJsPath = join(process.cwd(), 'public', 'scrollcraft.js')
    expect(existsSync(scrollcraftJsPath)).toBe(true)
  })

  it('should have scrollcraft.css in public directory', () => {
    const scrollcraftCssPath = join(process.cwd(), 'public', 'scrollcraft.css')
    expect(existsSync(scrollcraftCssPath)).toBe(true)
  })
})
