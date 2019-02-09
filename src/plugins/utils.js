function max(list) {
  let result = 0
  list.forEach(i => {
    if (result < i) {
      result = i
    }
  })
  return result
}

function range(n) {
  const r = []
  for (let i = 0; i < n; i++) {
    r.push(i)
  }
  return r
}

export default { max, range }
