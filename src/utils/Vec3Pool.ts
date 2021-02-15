import { Pool } from '../utils/Pool'
import { Vec3 } from '../math/Vec3'

export class Vec3Pool extends Pool {
  type: typeof Vec3

  constructor() {
    super()

    this.type = Vec3
  }

  /**
   * Construct a vector
   */
  constructObject(): Vec3 {
    return new Vec3()
  }
}
