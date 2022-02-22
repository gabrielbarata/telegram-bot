// const { promises: fs } = require('fs');

var pdf_table_extractor = require("pdf-table-extractor");

const read_pdf = (file) => new Promise((resolve, reject) => {
   const success = (name) => (result) => {
      const lista_str = []
      result.pageTables.forEach((page) => {
         page.tables.forEach((table) => {
            var val = table.slice(-5).join('')
            if (val.includes('R$ ') && !val.includes('Total')) {
               lista_str.push(val.split('R$ ')[1])
            }
         })
      })
      // console.log({lista_str})
      const lista_em_centavos = lista_str.map((val) => {
         val = val.replace(/[^0-9.-]|[,/.]+/g, "")
         return Number(val)
      })

      const total_em_centavos = lista_em_centavos.reduce((accumulator, val) => accumulator + val, 0);
      const total = total_em_centavos / 100
      resolve(total)
      // console.log({ name, lista_em_centavos, total })
   }
   pdf_table_extractor(`${file}`, success(file), e => console.log(e))
});


// (async () => {
//    console.log('começou')
//    const a = await read_pdf('b43708d9-532a-4683-878d-738a83f63c25.pdf')
//    console.log(a)
//    console.log('acabou')
// })()

module.exports= {read_pdf}