import figlet from "figlet";
import { getLineAndCharacterOfPosition } from "typescript";


// game logic
const GameState = {
  entites:[] as entity[]
}
class entity{
  x: number;
  y: number;
  size: number;
  newtonForce: number;
  direction: number;
  constructor(x: number,y: number,size: number){
    this.x = x;
    this.y = y;
    this.size = size;
    this.newtonForce = 0;
    this.direction = 0;
  }
}
class PlayerEntity extends entity{
  ws: Bun.ServerWebSocket<unknown>;
  constructor(ws:Bun.ServerWebSocket<unknown>){
    super(Math.random()*100,Math.random()*100,1)
    this.ws = ws;
  }
}

// Server logic

let playerNumber = 1
const server = Bun.serve({
  routes:{
    "/api/version": ()=>{ return Response.json({ message: "dev-0.0.1" })},
    "/api/*": Response.json({ message: "Error 404, not found" }, { status: 404 }),
    "/api/game": async (req,server)=>{ 
      console.log("New socket!!!")
      
      let success = server.upgrade(req,{
        headers: {
          "Set-Cookie": `SessionId=${playerNumber}`,
        },
      })
      playerNumber++
      if(success){
        return new Response("Upgrading to websocket", { status: 101 });
      }
      return new Response("Upgrade failed", { status: 500 });
    },
  },
  websocket: {
    message(ws, message) {
      console.log("new message!")
      console.log()
      ws.send(`recived message: ${message}`)
    }, // a message is received
    open(ws) {
      GameState.entites.push(new PlayerEntity(ws))
    }, // a socket is opened
    close(ws, code, message) {}, // a socket is closed
    drain(ws) {}, // the socket is ready to receive more data
  },
});



console.log(`Listening on http://localhost:${server.port} ...`);

function generateSessionId() {
  throw new Error("Function not implemented.");
}
