import type { Body } from '../objects/Body'

/**
 * Records what objects are colliding with each other
 */
export class ObjectCollisionMatrix {
  matrix: Record<string, boolean> // The matrix storage.

  constructor() {
    this.matrix = {}
  }

  get(bi: Body, bj: Body): boolean {
    let { id: i } = bi
    let { id: j } = bj
    if (j > i) {
      const temp = j
      j = i
      i = temp
    }
    return `${i}-${j}` in this.matrix
  }

  set(bi: Body, bj: Body, value: boolean): void {
    let { id: i } = bi
    let { id: j } = bj
    if (j > i) {
      const temp = j
      j = i
      i = temp
    }
    if (value) {
      this.matrix[`${i}-${j}`] = true
    } else {
      delete this.matrix[`${i}-${j}`]
    }
  }

  /**
   * Empty the matrix
   */
  reset(): void {
    this.matrix = {}
  }

  /**
   * Set max number of objects
   */
  setNumObjects(n: number): void {}
}
