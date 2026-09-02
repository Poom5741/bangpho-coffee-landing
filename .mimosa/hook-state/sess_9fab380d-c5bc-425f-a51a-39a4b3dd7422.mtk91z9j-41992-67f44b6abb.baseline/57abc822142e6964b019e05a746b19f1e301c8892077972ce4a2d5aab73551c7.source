import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('API Endpoint', () => {
  it('should call /api/signup endpoint in EmailSignup component', () => {
    const componentPath = join(process.cwd(), 'src', 'components', 'EmailSignup.tsx')
    const content = readFileSync(componentPath, 'utf-8')

    // Should call /api/signup
    expect(content).toContain('/api/signup')

    // Should NOT call /api/waitlist
    expect(content).not.toContain('/api/waitlist')
  })

  it('should use POST method for signup', () => {
    const componentPath = join(process.cwd(), 'src', 'components', 'EmailSignup.tsx')
    const content = readFileSync(componentPath, 'utf-8')

    // Should use POST method
    expect(content).toMatch(/method:\s*['"]POST['"]/)
  })
})
