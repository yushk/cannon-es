import type { Shape } from '../shapes/Shape'
import { Vec3 } from '../math/Vec3'
import { Box } from '../shapes/Box'
import { Sphere } from '../shapes/Sphere'
import { Body } from '../objects/Body'
import { World } from '../world/World'
import { NaiveBroadphase } from '../collision/NaiveBroadphase'
import { ArrayCollisionMatrix } from '../collision/ArrayCollisionMatrix'
import { ObjectCollisionMatrix } from '../collision/ObjectCollisionMatrix'
import { RaycastResult } from '../collision/RaycastResult'

describe('World', () => {
  test('clearForces', () => {
    const world = new World()
    const body = new Body()
    world.addBody(body)
    body.force.set(1, 2, 3)
    body.torque.set(4, 5, 6)

    world.clearForces()

    expect(body.force.almostEquals(new Vec3(0, 0, 0))).toBe(true)
    expect(body.torque.almostEquals(new Vec3(0, 0, 0))).toBe(true)
  })

  test('rayTestBox', () => {
    const world = new World()

    const body = new Body()
    body.addShape(new Box(new Vec3(1, 1, 1)))
    world.addBody(body)

    const from = new Vec3(-10, 0, 0)
    const to = new Vec3(10, 0, 0)

    const result = new RaycastResult()
    world.rayTest(from, to, result)

    expect(result.hasHit).toBe(true)
  })

  test('rayTestSphere', () => {
    const world = new World()

    const body = new Body()
    body.addShape(new Sphere(1))
    world.addBody(body)

    const from = new Vec3(-10, 0, 0)
    const to = new Vec3(10, 0, 0)

    const result = new RaycastResult()
    world.rayTest(from, to, result)

    expect(result.hasHit).toBe(true)
  })

  test('raycastClosest: single', () => {
    const world = new World()
    const body = new Body({
      shape: new Sphere(1),
    })
    world.addBody(body)

    const from = new Vec3(-10, 0, 0)
    const to = new Vec3(10, 0, 0)

    const result = new RaycastResult()
    world.raycastClosest(from, to, {}, result)

    expect(result.hasHit).toBe(true)
    expect(result.body).toEqual(body)
    expect(result.shape).toBe(body.shapes[0])
  })

  test('raycastClosest: order', () => {
    const world = new World()
    const bodyA = new Body({ shape: new Sphere(1), position: new Vec3(-1, 0, 0) })
    const bodyB = new Body({ shape: new Sphere(1), position: new Vec3(1, 0, 0) })
    world.addBody(bodyA)
    world.addBody(bodyB)

    const from = new Vec3(-10, 0, 0)
    const to = new Vec3(10, 0, 0)

    let result = new RaycastResult()
    world.raycastClosest(from, to, {}, result)

    expect(result.hasHit).toBe(true)
    expect(result.body).toBe(bodyA)
    expect(result.shape).toBe(bodyA.shapes[0])

    from.set(10, 0, 0)
    to.set(-10, 0, 0)

    result = new RaycastResult()
    world.raycastClosest(from, to, {}, result)

    expect(result.hasHit).toBe(true)
    expect(result.body).toBe(bodyB)
    expect(result.shape).toBe(bodyB.shapes[0])
  })

  test('raycastAll: simple', () => {
    const world = new World()
    const body = new Body({ shape: new Sphere(1) })
    world.addBody(body)

    const from = new Vec3(-10, 0, 0)
    const to = new Vec3(10, 0, 0)

    let hasHit: boolean
    let numResults = 0
    let resultBody: Body
    let resultShape: Shape

    const returnVal = world.raycastAll(from, to, {}, function (result) {
      hasHit = result.hasHit
      resultShape = result.shape
      resultBody = result.body
      numResults++
    })

    expect(returnVal).toBe(true)
    expect(hasHit).toBe(true)
    expect(resultBody).toBe(body)
    expect(numResults).toBe(2)
    expect(resultShape).toBe(resultBody.shapes[0])
  })

  test('raycastAll: two spheres', () => {
    const world = new World()
    const body = new Body({ shape: new Sphere(1) })
    world.addBody(body)

    const body2 = new Body({ shape: new Sphere(1) })
    world.addBody(body2)

    const from = new Vec3(-10, 0, 0)
    const to = new Vec3(10, 0, 0)

    let hasHit = false
    let numResults = 0

    world.raycastAll(from, to, {}, function (result) {
      hasHit = result.hasHit
      numResults++
    })

    expect(hasHit).toBe(true)
    expect(numResults).toBe(4)
  })

  test('raycastAll: skipBackfaces', () => {
    const world = new World()
    const body = new Body({ shape: new Sphere(1) })
    world.addBody(body)

    let hasHit = false
    let numResults = 0
    let resultBody: Body
    let resultShape: Shape

    world.raycastAll(new Vec3(-10, 0, 0), new Vec3(10, 0, 0), { skipBackfaces: true }, function (result) {
      hasHit = result.hasHit
      resultShape = result.shape
      resultBody = result.body
      numResults++
    })

    expect(hasHit).toBe(true)
    expect(resultBody).toBe(body)
    expect(numResults).toBe(1)
    expect(resultShape).toBe(resultBody.shapes[0])
  })

  test('raycastAll: collisionFilters', () => {
    const world = new World()
    const body = new Body({
      shape: new Sphere(1),
    })
    world.addBody(body)
    body.collisionFilterGroup = 2
    body.collisionFilterMask = 2

    let numResults = 0

    world.raycastAll(
      new Vec3(-10, 0, 0),
      new Vec3(10, 0, 0),
      {
        collisionFilterGroup: 2,
        collisionFilterMask: 2,
      },
      function () {
        numResults++
      }
    )

    expect(numResults).toBe(2)

    numResults = 0

    world.raycastAll(
      new Vec3(-10, 0, 0),
      new Vec3(10, 0, 0),
      {
        collisionFilterGroup: 1,
        collisionFilterMask: 1,
      },
      function () {
        numResults++
      }
    )

    expect(numResults).toBe(0) // should use collision groups!
  })

  test('raycastAny', () => {
    const world = new World()
    world.addBody(new Body({ shape: new Sphere(1) }))

    const from = new Vec3(-10, 0, 0)
    const to = new Vec3(10, 0, 0)

    const result = new RaycastResult()
    world.raycastAny(from, to, {}, result)

    expect(result.hasHit).toBe(true)
  })

  test('using ArrayCollisionMatrix', () => {
    testCollisionMatrix(ArrayCollisionMatrix)
  })

  test('using ObjectCollisionMatrix', () => {
    testCollisionMatrix(ObjectCollisionMatrix)
  })
})

function testCollisionMatrix(CollisionMatrix: any) {
  const test_configs = [
    {
      positions: [
        [0, 0, 0],
        [2, 0, 0],
        [0, 4, 0],
        [2, 4, 0],
        [0, 8, 0],
        [2, 8, 0],
      ],
      colliding: {
        '0-1': true,
        '2-3': true,
        '4-5': true,
      },
    },
    {
      positions: [
        [0, 0, 0],
        [0, 4, 0],
        [0, 8, 0],
        [2, 0, 0],
        [2, 4, 0],
        [2, 8, 0],
      ],
      colliding: {
        '0-3': true,
        '1-4': true,
        '2-5': true,
      },
    },
    {
      positions: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 10, 0],
        [0, 20, 0],
        [0, 30, 0],
        [0, 40, 0],
        [0, 50, 0],
        [0, 51, 0],
      ],
      colliding: {
        '0-1': true,
        '6-7': true,
      },
    },
  ]

  for (let config_idx = 0; config_idx < test_configs.length; config_idx++) {
    const test_config = test_configs[config_idx]

    const world = new World()
    world.broadphase = new NaiveBroadphase()
    world.collisionMatrix = new CollisionMatrix()
    world.collisionMatrixPrevious = new CollisionMatrix()

    for (let position_idx = 0; position_idx < test_config.positions.length; position_idx++) {
      const body = new Body({ mass: 1 })
      body.addShape(new Sphere(1.1))
      body.position.set.apply(body.position, test_config.positions[position_idx])
      world.addBody(body)
    }

    for (let step_idx = 0; step_idx < 2; step_idx++) {
      world.step(0.1)
      const is_first_step = step_idx === 0

      for (let coll_i = 0; coll_i < world.bodies.length; coll_i++) {
        for (let coll_j = coll_i + 1; coll_j < world.bodies.length; coll_j++) {
          const is_colliding_pair = test_config.colliding[coll_i + '-' + coll_j] === true
          const expected = is_colliding_pair
          expect([world, coll_i, coll_j, is_first_step]).toBeColliding(expected)
        }
      }
    }
  }
}
