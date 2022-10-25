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

    '7-8',
    '7-9',
    '8-9',
    '9-9',
    '10-9',
    '12-9',
    '10-10',
    '10-11',
    '10-12',

    '14-8',
    '14-9',
    '14-10',
    '13-10',
    '12-10',

    '12-11',
    '12-12',
    '11-12',
]

const nodes = new Map()


let matrix = []
for(let i=0;i<ROWS;i++) {
    const row = []
    for(let j=0;j<COLS;j++) {
        const value = `${i}-${j}`
        row.push(value)
        nodes.set(value, {
            neighbors: getNeighborhoods(value),
            fScore: -1,
            gScore: -1,
        })
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


function minimalFScore(list) {
    let key = null
    for(const i of list) {
        if(key === null) key = i

        const minimal = nodes.get(key)
        const current = nodes.get(i)

        if(minimal.fScore > current.fScore) {
            key = i
        }
    }

    return key
}

const visited = new Set()
function search(start, target) {
    let list = [start]

    nodes.get(start).gScore = 0
    nodes.get(start).fScore = distance(start, target)


    while (list.length > 0) {
        const keyMinimalFScore = minimalFScore(list)
        list = list.filter(i => i !== keyMinimalFScore)
        const current = nodes.get(keyMinimalFScore)

        visited.add(keyMinimalFScore)
        if(keyMinimalFScore === target) {
            console.log("found")
            return
        }


        for(const neighborKey of current.neighbors) {
            // 1 is a constant for distance between all neighbors
            // in a complex system like maps should be calculated distance between current node and neighbor node
            const newGScore = current.gScore + 1
            const neighborNode = nodes.get(neighborKey)
            if(neighborNode.gScore === -1 || neighborNode.gScore > newGScore) {
                neighborNode.gScore = newGScore
                neighborNode.fScore = newGScore + distance(neighborKey, target)
                
                const existsInList = list.indexOf(neighborKey) !== -1
                if(!existsInList) {
                    list.push(neighborKey)
                }
            }
        }



    }
}
// function dfs(start, target) {
//     const queue = [start]

//     while(queue.length > 0) {
//         const current = queue.pop()
//         const neighbors = nodes.get(current)
//         console.log(`Searching in ${current}`)
//         for(const i of neighbors) {
//             if(!visited.has(i)) {
//                 visited.add(i)
//                 queue.push(i)
//             }

//             if(i === target) {
//                 console.log('found')
//                 return visited
//             }

//         }

//     }
// }

function distance(start, end) {
    const origin = start.split('-').map(Number)
    const target = end.split('-').map(Number)

    const distanceX = Math.abs(origin[1] - target[1])
    const distanceY = Math.abs(origin[0] - target[0])

    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

    return distance
}


console.log(nodes)

const path = search('0-0', '19-19')
// if(!path) {
//     console.error('not found')
// }


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