import { describe, it, expect } from 'vitest'
import { existsSync } from 'fs'
import { join } from 'path'

describe('API Route Location', () => {
  it('should have signup API route in src/app/api/signup/', () => {
    const apiRoutePath = join(process.cwd(), 'src', 'app', 'api', 'signup', 'route.ts')
    expect(existsSync(apiRoutePath)).toBe(true)
  })

  it('should NOT have API route in wrong location (root app/)', () => {
    const wrongPath = join(process.cwd(), 'app', 'api', 'signup', 'route.ts')
    expect(existsSync(wrongPath)).toBe(false)
  })
})
