HEAD
import "./style.css";
import "./ika/room4.css";
import ".ika/room4.ts";
import "./src/style.css";
import "./rooms/maria";

/*---------------------------------------------------------
--------------------------TIMER----------------------------
----------------------------------------------------------*/

const totalTimerElement = document.getElementById('timer') as HTMLDivElement;

//Variabel som förklarar att detta är ett nummer med startvärder 0
let totalStartTime: number 0;

//
let totalTimerInterval: number | null = null;



