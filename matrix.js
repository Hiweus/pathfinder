const ROWS = 20
const COLS = 20


const walls = ["19-18","18-18","17-18","15-19","15-18","15-17","15-16","17-16","19-16","19-17","17-14","16-14","14-14","15-14","13-14","12-14","12-15","12-16","12-17","12-19","11-17","10-17","9-17","8-17","8-16","8-14","8-13","8-15","7-13","6-13","5-13","4-13","4-15","6-15","5-15","6-16","6-17","6-18","6-19","7-19","8-19","9-19","10-19","11-19","3-13","2-13","2-15","2-14","2-16","2-17","4-16","2-18","3-18","4-18","18-14","19-14","19-15","7-4","7-5","7-7","7-8","7-10","6-10","5-10","4-10","3-10","2-10","1-10","0-10","8-10","10-10","11-10","11-11","11-12","11-13","11-14","8-11","10-9","10-8","10-7","10-5","10-6","10-4","9-7","9-8","9-6","9-5","9-4","7-3","8-3","9-3","10-3","5-5","4-5","3-5","2-5","1-5","6-7","5-7","4-7","3-7","2-7","1-7","0-5","10-2","9-2"]

const path = []

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
            parentNode: null,
            value,
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
async function search(start, target) {
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
            generateMaze()

            let cursor = current
            while(cursor) {
                path.push(cursor.value)
                cursor = cursor.parentNode
            }

            generateMaze()
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

                neighborNode.parentNode = current
                
                const existsInList = list.indexOf(neighborKey) !== -1
                if(!existsInList) {
                    list.push(neighborKey)
                }
            }
        }

        generateMaze()
        await new Promise(res => setTimeout(res, 1))
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

search('0-0', '19-19')
// if(!path) {
//     console.error('not found')
// }

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}

function generateMaze() {
    const html = matrix.map(row => {
        const htmlRow = row.map(i => {
            const isWall = walls.indexOf(i) !== -1
            const isVisited = visited.has(i)
            const isPath = path.indexOf(i) !== -1
            
            if(isPath) return `<td class="path" onclick="removeItemOnce(path, '${i}'); generateMaze();">${i}</td>`
            if(isWall) return `<td class="wall" onclick="removeItemOnce(walls, '${i}'); generateMaze();">${i}</td>`
            if(isVisited) return `<td class="visited" onclick="walls.push('${i}'); generateMaze();">${i}</td>`
            return `<td onclick="walls.push('${i}'); generateMaze();">${i}</td>`
        }).join('')
        return `<tr>${htmlRow}</tr>`
    }).join('')
    
    
    document.getElementById("table").innerHTML = html
}

generateMaze()


window.addEventListener("keydown", ({key}) => {
    if(key.toString() === "a") {
        console.log(JSON.stringify(walls))
    }

    if(key.toString() === "c") {
        walls.splice(0, walls.length)
        generateMaze()
    }

    if(key.toString() === "x") {
        visited.clear()
        generateMaze()
    }
})