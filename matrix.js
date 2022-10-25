const ROWS = 20
const COLS = 20


const walls = [
    '0-1',
    '0-7',
    '1-7',
    '2-7',
    '3-7',
    '4-7',
    '5-7',
    '6-7',
    '7-7',
    '9-7',
    '10-7',
    '11-7',
    '12-7',
    '13-7',
    '14-7',
    '15-7',
    '16-7',
    '17-7',
    '18-7',
    '19-7',

    '7-8',
    '7-9',
    '8-9',
    '9-9',
    '10-9',
    '10-10',
    '10-11',
    '10-12',
]

const nodes = new Map()


let matrix = []
for(let i=0;i<ROWS;i++) {
    const row = []
    for(let j=0;j<COLS;j++) {
        const value = `${i}-${j}`
        row.push(value)
        nodes.set(value, getNeighborhoods(value))
    }

    matrix.push(row)
}




function getNeighborhoods(value) {
    const [y, x] = value.split('-').map(Number)
    
    const neighbors = [
        [y, x+1],
        [y, x-1],
        [y+1, x],
        [y-1, x],
        [y-1, x-1],
        [y-1, x+1],
        [y+1, x-1],
        [y+1, x+1],
    ].filter(items => {
        const invalidY = (items[0] < 0 || items[0] >= ROWS)
        const invalidX = (items[1] < 0 || items[1] >= COLS)
        const isInvalid = (invalidY || invalidX)

        const isWall = walls.indexOf(items.join('-')) !== -1

        return !isWall && !isInvalid
    }).map(i => i.join('-'))

    return neighbors
}


const visited = new Set()
function bfs(start, target) {
    const queue = [start]

    while(queue.length > 0) {
        const current = queue.shift()
        const neighbors = nodes.get(current)
        console.log(`Searching in ${current}`)
        for(const i of neighbors) {
            if(!visited.has(i)) {
                visited.add(i)
                queue.push(i)
            }

            if(i === target) {
                console.log('found')
                return visited
            }

        }

    }
}


console.log(nodes)

const path = bfs('0-0', '19-19')
if(!path) {
    console.error('not found')
}


function generateMaze() {
    const html = matrix.map(row => {
        const htmlRow = row.map(i => {
            const isWall = walls.indexOf(i) !== -1
            const isVisited = visited.has(i)
            
            if(isVisited) return `<td class="visited">${i}</td>`
            if(isWall) return `<td class="wall">${i}</td>`
            return `<td>${i}</td>`
        }).join('')
        return `<tr>${htmlRow}</tr>`
    }).join('')
    
    
    document.getElementById("table").innerHTML = html
}

generateMaze()
