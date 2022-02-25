const total_a_pagar = (val: number) => {
    const input = [10, 20, 40, 100, 500]
    const output = [999, 1399, 1999, 2499, 3999]

    var i = -1
    while (val > input[++i]*1000) { }
    return output[i]
}

// console.log(total_a_pagar(600*1000))

export {total_a_pagar}