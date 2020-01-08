# :video_game: Physics Conquest Game

This is a Multiplayer Quiz Game about Physics. But, how works? 

1. The Players enter in Game
2. The Administrator starts the Game
3. If the player hits a question, he gets a point
4. If the player misses a question, he loses a point
5. The Administrator finishes the Game

## :camera: Printscreens
<img src="https://raw.githubusercontent.com/Windows87/physics-conquest-game/master/printscreens/ps1.png">
<img src="https://raw.githubusercontent.com/Windows87/physics-conquest-game/master/printscreens/ps2.png">
<img src="https://raw.githubusercontent.com/Windows87/physics-conquest-game/master/printscreens/ps4.png">
<img src="https://raw.githubusercontent.com/Windows87/physics-conquest-game/master/printscreens/ps3.png">

## :wrench: How to Play
1. Clone the Github Repository: ``` git clone https://github.com/Windows87/physics-conquest-game ```
2. Enter Directory: ``` cd physics-conquest-game ```
3. Install npm modules: ``` npm install ```
4. Start server: ``` npm start ```
5. Terminal will show a IP (Example: *0.0.0.0*)
6. The players need enter in this IP
7. The Admin need enter in this IP/admin (Example: *0.0.0.0/admin*)

## :construction_worker: For Developers
### Stack
- ReactJS
- NodeJS
- Express and NeDB
- Socket.io

### API
```GET``` api/questions/ - Get all Questions

```GET``` api/questions/[QuestionID] - Get Question by Id

```POST``` api/questions/ - Create Question. Body Example:
```javascript
{
	"title": "As an object falls in the absence of air resistance, its",
	"answers": [
		"Speed increases",
		"Acceleration increases",
		"Both of these",
		"None of these"
	],
	"correct_answer": "Speed increases"
}
```

```DELETE``` - /api/questions/[QuestionID] - Delele Question by Id
