// == LogicQuest: Puzzle Adventure Core == //
// Author: Your Name
// Year: 2025
// Thoroughly commented for clarity and extensibility

// -- Level/Progression Config: Adjust for balancing --
const TOTAL_LEVELS = 15;
const BASE_GRID = [3,4,4,4,5,5,5,5,6,6,6,7,7,7,7];
const LEVELS = Array.from({length: TOTAL_LEVELS}, (_,i)=> ({
    // Mix of classic sliding and pattern/constraint puzzles:
    grid: BASE_GRID[i],
    moveLimit: i < 3 ? null : Math.max(BASE_GRID[i]*BASE_GRID[i]+3, 16+i*2), // Starts open, tightens
    timeLimit: i < 5 ? null : 30 + i*7, // Adds timer after level 5
    lockedTiles: (i>=12) ? [randomLocked(BASE_GRID[i])] : [], // Lock a tile for bonus difficulty
    type: (i<9) ? "slide" : (i<12) ? "pattern" : "slide", // Some pattern levels in between
    pattern: (i>=9 && i<12) ? randomPattern(BASE_GRID[i]) : null,
}));

// -- Utility: Generate a random locked tile for late levels --
function randomLocked(size) {
    let pos = Math.floor(Math.random()*size*size);
    // Avoid first/last
    if (pos===0 || pos===(size*size-1)) pos++;
    return [pos];
}

// -- Pattern generator for special pattern recognition levels
function randomPattern(size) {
    // Creates a cross, diagonal or checkerboard at random
    const grid = Array.from({length: size*size}, ()=>0);
    const style = Math.floor(Math.random()*3);
    if (style===0) {
        // Diagonal
        for(let r=0;r<size;r++) grid[r*size + r]=1;
    } else if (style===1) {
        // cross
        for(let i=0;i<size;i++) {
            grid[Math.floor(size*size/2)-(size%2?0:size)] = 1;
            grid[i*size + Math.floor(size/2)]=1;
            grid[Math.floor((size/2)*size + i)]=1;
        }
    } else {
        // checker
        for(let i=0;i<grid.length;i++)
            if ((Math.floor(i/size)+i%size)%2===0) grid[i]=1;
    }
    return grid;
}

// == Persistent State Handling ==
const STORAGE_KEY = "logicquest-puzzle-progress";
let state = {
    level: 1,
    progress: [],
    settings: { sound: false }
};

// Load progress
function loadState() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (data && typeof data.level === "number") Object.assign(state, data);
    } catch (e) {}
}
function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// == UI Elements ==
const gridContainer = document.querySelector("#grid-container");
const objectivesDiv = document.getElementById("objectives");
const movesValue = document.getElementById("moves-value");
const timerValue = document.getElementById("timer-value");
const timerLabel = document.getElementById("timer-label");
const movesLabel = document.getElementById("moves-label");
const levelIndicator = document.getElementById("level-indicator");
const progressBar = document.getElementById("progress-bar");
const resetBtn = document.getElementById("reset-btn");
const muteBtn = document.getElementById("mute-btn");
const completeModal = document.getElementById("complete-modal");
const failModal = document.getElementById("fail-modal");
const nextLevelBtn = document.getElementById("next-level-btn");
const menuBtn = document.getElementById("menu-btn");
const menuBtn2 = document.getElementById("menu-btn-2");
const retryBtn = document.getElementById("retry-btn");
const restartLevelBtn = document.getElementById("restart-level-btn");

// == Game Runtime Variables ==
let game = {
    level: 1,
    grid: [],
    size: 3,
    moves: 0,
    timer: null,
    remainingTime: null,
    solved: false,
    locked: [],
    pattern: null
};

// == Utility: Array Shuffle & Check Solvable (see 15-puzzle parity rules) ==
function shuffleArraySolvable(size,locked=[]) {
    // List all positions
    let arr = [];
    let lockedSet = new Set(locked);
    for(let i=1;i<=size*size-1;i++) arr.push(i);
    arr.push(""); // empty slot is ""
    // Move locks out of the way
    for(let l of locked) {
        arr[l] = "x"; // "x" = locked
    }
    // Only shuffle non-locked
    let toShuffle = arr.filter(t => typeof t === "number");
    do {
        for(let i=toShuffle.length-1;i>0;i--) {
            let j = Math.floor(Math.random()*(i+1));
            [toShuffle[i],toShuffle[j]] = [toShuffle[j],toShuffle[i]];
        }
        // Place back
        let idx=0;
        for(let i=0;i<arr.length;i++) {
            if (arr[i]==="x") continue;
            arr[i]=toShuffle[idx++]??"";
        }
    } while(!isSolvable(arr,size));
    return arr;
}
function isSolvable(puzzle,size) {
    let inv = 0, arr=puzzle.slice();
    arr = arr.filter(t=>t!=="" && t!=="x");
    for (let i = 0; i < arr.length - 1; i++)
        for (let j = i + 1; j < arr.length; j++)
            if (arr[i] > arr[j]) inv++;
    let blank = puzzle.indexOf("");
    let blankRowFromBottom = size - Math.floor(blank / size);
    if (size%2 === 1) return inv%2===0;
    return (inv + blankRowFromBottom)%2===0;
}

// == Core Level Loader ==
function loadLevel(idx) {
    // Clamp, update state/progress
    if (idx > TOTAL_LEVELS) idx = TOTAL_LEVELS;
    if (idx < 1) idx = 1;
    game.level = idx;
    state.level = idx;
    game.size = LEVELS[game.level-1].grid;
    game.moves = 0;
    game.locked = LEVELS[game.level-1].lockedTiles?LEVELS[game.level-1].lockedTiles:[];

    // Generate grid:
    let arr = [];
    if (LEVELS[game.level-1].type==="slide") {
        arr = shuffleArraySolvable(game.size,game.locked.flat());
    } else if (LEVELS[game.level-1].type==="pattern") {
        // Custom pattern
        arr = LEVELS[game.level-1].pattern.map(v=>v?1:0);
    }
    game.grid = arr;
    game.pattern = LEVELS[game.level-1].pattern ?? null;

    game.solved = false;
    renderUI();
    startTimer();
    saveState();
}

// == UI Rendering ==
function renderUI() {
    // Grid
    const n = game.size;
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${n},1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${n},1fr)`;

    // Compose grid
    game.grid.forEach((tile, idx) => {
        let div = document.createElement("div");
        div.className = "tile";
        if (tile==="") div.classList.add("empty");
        if (game.locked.flat().includes(idx)) div.classList.add("locked");
        div.innerText = tile==="x"?"✓✔":tile;
        if (tile==="") div.setAttribute("aria-label","Empty");
        div.tabIndex = tile!=="" && !div.classList.contains("locked") ? 0 : -1;
        div.setAttribute("data-pos", idx);
        // Pattern preview:
        if (game.pattern && game.pattern[idx]) {
            div.style.background = "linear-gradient(135deg,#67e2cf,#1a2045)";
            div.innerText = tile;
        }
        // Clickable if movable
        if (isMovable(idx)) {
            div.addEventListener("click", ()=> moveTile(idx));
            div.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key==" ") moveTile(idx);
            });
        }
        gridContainer.appendChild(div);
    });

    // Objectives
    let obj = `Arrange tiles from 1 to ${n*n-1}`;
    if (LEVELS[game.level-1].type==="pattern") obj = `Make the highlighted pattern!`;
    if (game.locked.length) obj += ` <br><span style="color:#cbb7ff;">Some tiles are locked.</span>`;
    objectivesDiv.innerHTML = obj;

    // Moves/Timer
    movesLabel.textContent = "Moves:";
    timerLabel.textContent = LEVELS[game.level-1].timeLimit ? "Time:" : '';
    timerValue.textContent = game.remainingTime!==null?formatTime(game.remainingTime):'';
    movesValue.textContent = game.moves;

    // Level/progress
    levelIndicator.textContent = `Level ${game.level} of ${TOTAL_LEVELS}`;
    progressBar.value = game.level;
    progressBar.max = TOTAL_LEVELS;
}
function formatTime(sec) {
    return Math.max(0,Math.floor(sec/60)) + ":" + ("0"+(sec%60)).slice(-2);
}

// == Movability and Tile Swapping ==
function isMovable(idx) {
    // Empty neighbor
    if (game.grid[idx]==="" || (game.locked&&game.locked.flat().includes(idx))) return false;
    const n=game.size;
    const adj = [-1,1,-n,n];
    const row = Math.floor(idx/n);
    const col = idx%n;
    for (let d of adj) {
        let ni = idx + d;
        if (ni<0 || ni>=n*n) continue;
        if (game.locked&&game.locked.flat().includes(ni)) continue;
        // wrap protection
        if (d===-1&&col===0) continue;
        if (d===1&&col===n-1) continue;
        if (game.grid[ni]==="") return true;
    }
    return false;
}

function moveTile(idx) {
    if (game.solved || (game.locked && game.locked.flat().includes(idx))) return;
    // Find empty neighbor
    const n=game.size;
    const col = idx%n;
    const row = Math.floor(idx/n);
    const adj = [-1,1,-n,n].map(d=>idx+d);
    for (let ni of adj) {
        if (ni<0||ni>=n*n) continue;
        // Prevent wrap
        if (Math.abs(ni-idx)!==1 && Math.abs(ni-idx)!==n) continue;
        if (Math.abs(ni-idx)===1 && Math.floor(ni/n)!==row) continue;
        if (game.grid[ni]==="") {
            [game.grid[ni],game.grid[idx]]=[game.grid[idx],game.grid[ni]];
            game.moves++;
            renderUI();
            checkWin();
            break;
        }
    }
    movesValue.textContent = game.moves;
}

// == Win/Fail/Loss Logic ==
function checkWin() {
    // For pattern levels:
    if (LEVELS[game.level-1].type==="pattern" && game.pattern) {
        let match = true;
        for(let i=0;i<game.grid.length;i++) {
            if (Boolean(game.grid[i])!==Boolean(game.pattern[i])) {
                match=false;
                break;
            }
        }
        if (match) return winLevel();
    } else {
        // Standard: Numbers in order (ignore empty/locked)
        let solved=true;
        for(let i=0;i<game.grid.length-1;i++) {
            if (game.grid[i]!=="x"&&(game.grid[i]!==(i+1))) solved=false;
        }
        if (solved) return winLevel();
    }
    // Check fail (out of moves/timer)
    let lev=LEVELS[game.level-1];
    if (lev.moveLimit && game.moves>lev.moveLimit) {
        showFail("Out of moves! Can you solve it in fewer moves?");
        stopTimer();
    }
}

// == Timer Logic ==
let mainTimerInt = null;
function startTimer() {
    stopTimer();
    let time = LEVELS[game.level-1].timeLimit ?? null;
    game.remainingTime = time;
    if (!time) { timerValue.textContent=''; return; }
    timerValue.textContent = formatTime(time);
    mainTimerInt = setInterval(()=>{
        game.remainingTime--;
        timerValue.textContent = formatTime(game.remainingTime);
        if (game.remainingTime<6) timerValue.classList.add("time-low");
        else timerValue.classList.remove("time-low");
        if (game.remainingTime<=0) {
            stopTimer();
            showFail("Time's up! Try again.");
        }
    }, 1000);
}
function stopTimer() {
    if (mainTimerInt) clearInterval(mainTimerInt), mainTimerInt=null;
}

// == Win/Fail Modals ==
function winLevel() {
    stopTimer();
    game.solved=true;
    showModal("complete",`Level ${game.level} Complete! Great job.`);
    document.getElementById("complete-moves").textContent = game.moves;
    let finishTime =  LEVELS[game.level-1].timeLimit
        ? formatTime(LEVELS[game.level-1].timeLimit - game.remainingTime)
        : "-";
    document.getElementById("complete-time").textContent = finishTime;

    // Unlock next level if beaten for first time
    if (state.progress[game.level-1]===undefined)
        state.progress[game.level-1]=true;
    if (game.level<TOTAL_LEVELS) state.level=game.level+1;
    saveState();
}

function showFail(msg) {
    stopTimer();
    showModal("fail",msg);
}

function showModal(type,msg) {
    // Either complete-modal or fail-modal
    [completeModal,failModal].forEach(m => m.classList.add("hidden"));
    if (type==="complete") {
        completeModal.classList.remove("hidden");
        document.getElementById("completion-message").textContent=msg;
    } else {
        failModal.classList.remove("hidden");
        document.getElementById("fail-message").textContent=msg;
    }
}

// == Modal Button Events ==
nextLevelBtn.onclick = ()=>{
    if (game.level<TOTAL_LEVELS) loadLevel(game.level+1);
    completeModal.classList.add("hidden");
};
restartLevelBtn.onclick = ()=>{
    loadLevel(game.level);
    completeModal.classList.add("hidden");
};
retryBtn.onclick = ()=>{
    loadLevel(game.level);
    failModal.classList.add("hidden");
};
menuBtn.onclick = menuBtn2.onclick = ()=>{
    document.getElementById("level-menu").classList.remove("hidden");
    completeModal.classList.add("hidden");
    failModal.classList.add("hidden");
    renderLevelMenu();
};
document.getElementById("close-level-menu").onclick = ()=>
    document.getElementById("level-menu").classList.add("hidden");

// -- Level menu rendering --
function renderLevelMenu() {
    const list = document.getElementById("level-list");
    list.innerHTML = "";
    for(let i=1;i<=TOTAL_LEVELS;i++) {
        let b = document.createElement("button");
        b.textContent="Level "+i;
        if (state.progress[i-1]||i===1) {
            b.disabled=false;
            b.onclick=()=>{loadLevel(i);document.getElementById("level-menu").classList.add("hidden");};
        } else {
            b.disabled=true;
        }
        list.appendChild(b);
    }
}

// == Controls ==
resetBtn.onclick = ()=>loadLevel(game.level);
muteBtn.onclick = ()=>{
    state.settings.sound = !state.settings.sound;
    muteBtn.textContent = state.settings.sound ? "🔈" : "🔇";
    saveState();
};

// == Keyboard Navigation (for accessibility) ==
document.addEventListener("keydown",e=>{
    if (failModal.classList.contains("hidden")&&
        completeModal.classList.contains("hidden")&&
        !document.getElementById("level-menu").classList.contains("hidden")) return;
    if(e.key=="Escape")
        [failModal,completeModal,document.getElementById("level-menu")].forEach(m=>m.classList.add("hidden"));
});

// == Sound (optional, muted by default) ==
function playSound(type) {
    // Optionally load sound files for hints, timer, completion
    if (!state.settings.sound) return;
}

// == On Page Load ==
loadState();
loadLevel(state.level>0?state.level:1);
