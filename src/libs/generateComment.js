module.exports = (title, table) => {
  let tableLength = 0

  table = table.filter(function (row) {
    tableLength += row.length
    return tableLength < 60000
  })

  const tableString = table.join('\n')

  return `<details><summary>${title}</summary>
<br>

${tableString}
</details>`
}
