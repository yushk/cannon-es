import type { World } from './src/world/World'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeColliding(expected: boolean): R
    }
  }
}

expect.extend({
  toBeColliding([world, bodyAIndex, bodyBIndex, isFirstStep]: [World, number, number, boolean], expected: boolean) {
    const bodyA = world.bodies[bodyAIndex]
    const bodyB = world.bodies[bodyBIndex]
    const isColliding = isFirstStep
      ? !!world.collisionMatrix.get(bodyA, bodyB)
      : !!world.collisionMatrixPrevious.get(bodyA, bodyB)
    return {
      pass: isColliding === expected,
      message: () => (expected ? 'Should be colliding' : 'Should not be colliding'),
    }
  },
})
