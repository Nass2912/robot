// Ok, I will start with an assumption: 
// Through online researches, robot differential drive basically turns the wheel at different speed to move. So, they do not have backward like in a car, rather they turn themselves around, so I will be assuming that if we put a reference point North side of the robot, when doing the backward command, it will rotate and the robot will face south. Forward will be the reverse.

// import needed to use the terminal as input base
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const moveRobot = (commands, initialPosition) => {
    const min = 0; // starting point of our grid
    const max = 9; // ending point of our grid
    let [x, y, orientation] = initialPosition;
    const move = (command) => {
        switch (command) {
            // Math.max and Math.min to make sure we never go out of bounds, If we are already on the edge of the grid, it will not be executing the command and move to the next.
            case 'F':
                y = Math.min(y + 1, max);
                orientation = 'N'
                break;
            case 'B':
                y = Math.max(y - 1, min);
                orientation = 'S'
                break;
            case 'L':
                x = Math.max(x - 1, min);
                orientation = 'W'
                break;
            case 'R':
                x = Math.min(x + 1, max);
                orientation = 'E'
                break;
        }
    }
    for (const command of commands) {
        move(command)
    }
    return [x, y, orientation];
}


// Ask from terminal with loop incase validation fails
const askFromTerminal = (question, validation) => {
    return new Promise((resolve) => {
        const askUserInput = () => {
            rl.question(question, (input) => {
                if (validation(input)) {
                    resolve(input);
                } else {
                    console.log('Invalid input. Please try again.');
                    askUserInput();
                }
            });
        }
        askUserInput();
    });
}

// Ask user input with validations, this has to be as strict as possible to prevent crash later on
async function userInputData() {
    const x = await askFromTerminal('Enter the x coordinate / vertical position between (0-9): ', (input) => /^[0-9]/.test(input));
    const y = await askFromTerminal('Enter the y coordinate / horizontal position between (0-9) : ', (input) => /^[0-9]/.test(input));
    const initPst = await askFromTerminal('Enter initial direction N,S,E or W: ', (input) => /^[NSEWnsew]$/.test(input)); 
    const commands = await askFromTerminal('Enter the commands F,B,L,R: ', (input) => /^[FBLRfblr]+$/.test(input)); 
    rl.close();
    return [[...commands.toUpperCase()],parseInt(x),parseInt(y),initPst.toUpperCase()];
}

const gridWithPosition = (finalPosition) => {
    const [x, y, direction] = finalPosition
    const arrowResolver = direction === 'N' ? '⬆️' : direction === 'S' ? '⬇️' : direction === 'E' ? '⬅️' : '➡️'
    for (let i = 9; i >= 0; i--) {
        let row = '';
        for (let j = 0; j <= 9; j++) {
            if (i === y  && j === x) {
                row += `${arrowResolver}  `;
            } else {
                row += '🟩  ';
            }
        }
        console.log(row);
    }
}

// finally lauching the app which runs on the terminal
userInputData().then((inputs) => {
    const [commands, ...rest] = inputs
    const finalPosition = moveRobot(commands, rest);
    process.stdout.write('\x1Bc'); // clear terminal
    console.log(finalPosition)
    gridWithPosition(finalPosition)
});