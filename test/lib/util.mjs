function halt (err) {
  console.error(err)
  process.exitCode = 1
}

function sleep (ms, result) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result), ms)
  })
}

export { halt, sleep }
