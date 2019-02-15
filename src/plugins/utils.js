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

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function choice(list) {
  return list[randint(0, list.length - 1)]
}

export default { max, range, randint, choice }
