This is a forked esm, flatbundled version of https://github.com/schteppe/cannon.js for easier handling in module environments and tree shaking. Visit the original project for documentations and examples.

    yarn add cannon-es

```jsx
import { World } from 'cannon-es'

// ...
```

#### TO DO:

- Check for any functions missing an explicit return type with regex: `\) \{`
- Check for any removed `@todo` or `@deprecated` JSDoc comments
- Check for variables that were previously intentionally uninitialized in the constructor, but were updated in the TS conversion
- Convert to static methods where possible? (memory savings)
- Convert to abstract classes where possible (Equation, Solver, etc.?)
- Ensure no prototypal methods were overwritten due to error:
  - `Property xxxxx has no initializer and is not definitely assigned in the constructor`
- Resolve `as any` type assertions where possible
  - Fix type for integer array with key-value pair in ConvexPolyhedron:
  ```
  const polyA = hullA.faces[closestFaceA] // polyA: number[]
  polyA.connectedFaces = [] // key-value pair in array
  ```
- Revisit math/Transform.ts types
- Revisit material/ContactMaterial.ts constructor assertions
- Consider narrowing types in objects/SPHSystem (Body -> Particle)
- Remove use of defined assertion (!) where possible
- Find and refactor regex: `options:.*Options = \{\}`
- Should `HingeConstraint` be passing `collideConnected` through `PointToPointConstraint` to `Constraint`? (used in `RigidVehicle` line 81)
- Correct & standardize JSDoc comments
- Test possible performance improvements by converting matrices to Maps (instead of Arrays)
- Only import types where possible (don't impot unused class as value):
  - Upgrade @babel/preset-typescript after March 20th for TypeScript 3.8 support
  - Update class imports marked with `// prettier-ignore` to `import type`
  - Remove Prettier ignore comments when TypeScript 3.8 is supported (Prettier 2.0 release+)
