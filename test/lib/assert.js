function equal (a, b, errMessage) {
  if (a !== b) {
    throw new Error(errMessage || 'Not equal')
  }
}

function deepEqualArray (a, b, errMessage) {
  if (!(Array.isArray(a) && Array.isArray(b))) {
    throw new Error('Two arrays required')
  }
  if (a.length !== b.length) {
    throw new Error('Array lengths differ')
  }

  for (const [index, item] of a.entries()) {
    if (a[index] !== b[index]) {
      throw new Error(`Index: ${index}. Not equal: ${a[index]}, ${b[index]}`)
    }
  }
}

export { equal, deepEqualArray }
