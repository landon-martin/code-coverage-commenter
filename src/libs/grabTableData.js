function isTableRow (line) {
  return line && typeof line === 'string' ? line.match(/^[-|]*$/) && line !== '' : false
}

module.exports = (output) => {
  let ccArray = output.split('\n')
  // Remove empty lines and command outputs
  let tableRowCount = 0
  ccArray = ccArray.filter((line) => {
    if (isTableRow(line)) {
      tableRowCount++
    }
    return tableRowCount < 3 && tableRowCount > 0
  })
  return ccArray.slice(1, ccArray.length)
}
