module.exports = (title, table, files = []) => {
  return `<details><summary>${title}</summary>
<br>

${table}
</details>`
}
