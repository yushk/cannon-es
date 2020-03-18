import { Vec3 } from '../math/Vec3'
import { Material } from '../material/Material'
import { Body } from '../objects/Body'
// prettier-ignore
import { Quaternion } from '../math/Quaternion'

export const SHAPE_TYPES = {
  SPHERE: 1 as 1,
  PLANE: 2 as 2,
  BOX: 4 as 4,
  COMPOUND: 8 as 8,
  CONVEXPOLYHEDRON: 16 as 16,
  HEIGHTFIELD: 32 as 32,
  PARTICLE: 64 as 64,
  CYLINDER: 128 as 128,
  TRIMESH: 256 as 256,
}

type ShapeOptions = {
  type?: typeof SHAPE_TYPES[keyof typeof SHAPE_TYPES]
  collisionResponse?: boolean
  collisionFilterGroup?: number
  collisionFilterMask?: number
  material?: Material
}

/**
 * Base class for shapes
 * @class Shape
 * @constructor
 * @param {object} [options]
 * @param {number} [options.collisionFilterGroup=1]
 * @param {number} [options.collisionFilterMask=-1]
 * @param {number} [options.collisionResponse=true]
 * @param {number} [options.material=null]
 * @author schteppe
 */
export class Shape {
  id: number // Identifyer of the Shape.
  type: number // The type of this shape. Must be set to an int > 0 by subclasses.
  boundingSphereRadius: number // The local bounding sphere radius of this shape.
  collisionResponse: boolean // Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled.
  collisionFilterGroup: number
  collisionFilterMask: number
  material: Material | null
  body: Body | null

  static idCounter: number
  static types: typeof SHAPE_TYPES

  constructor(options: ShapeOptions = {}) {
    this.id = Shape.idCounter++
    this.type = options.type || 0
    this.boundingSphereRadius = 0
    this.collisionResponse = options.collisionResponse ? options.collisionResponse : true
    this.collisionFilterGroup = options.collisionFilterGroup !== undefined ? options.collisionFilterGroup : 1
    this.collisionFilterMask = options.collisionFilterMask !== undefined ? options.collisionFilterMask : -1
    this.material = options.material ? options.material : null
    this.body = null
  }

  /**
   * Computes the bounding sphere radius. The result is stored in the property .boundingSphereRadius
   * @method updateBoundingSphereRadius
   */
  updateBoundingSphereRadius(): void {
    throw `computeBoundingSphereRadius() not implemented for shape type ${this.type}`
  }

  /**
   * Get the volume of this shape
   * @method volume
   * @return {Number}
   */
  volume(): number {
    throw `volume() not implemented for shape type ${this.type}`
  }

  /**
   * Calculates the inertia in the local frame for this shape.
   * @method calculateLocalInertia
   * @param {Number} mass
   * @param {Vec3} target
   * @see http://en.wikipedia.org/wiki/List_of_moments_of_inertia
   */
  calculateLocalInertia(mass: number, target: Vec3): void {
    throw `calculateLocalInertia() not implemented for shape type ${this.type}`
  }

  calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void {
    throw `calculateWorldAABB() not implemented for shape type ${this.type}`
  }
}

Shape.prototype.constructor = Shape

Shape.idCounter = 0

/**
 * The available shape types.
 * @static
 * @property types
 * @type {Object}
 */
Shape.types = SHAPE_TYPES
